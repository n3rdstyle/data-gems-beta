/**
 * Google Sheets Import Utilities
 * Functions to fetch and format Google Sheets data
 */

/**
 * Extract spreadsheet ID and GID from Google Sheets URL
 * @param {string} url - Google Sheets URL
 * @returns {object} Object with spreadsheetId and gid (gid may be null)
 */
function extractSpreadsheetId(url) {
  const idMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  const spreadsheetId = idMatch ? idMatch[1] : null;

  // Extract GID from URL fragment (e.g., #gid=123456)
  const gidMatch = url.match(/[#&]gid=(\d+)/);
  const gid = gidMatch ? gidMatch[1] : null;

  return { spreadsheetId, gid };
}

/**
 * Fetch sheet tab name by GID
 * Extracts the actual tab name from the Google Sheets HTML
 * @param {string} spreadsheetId - Google Sheets ID
 * @param {string} gid - Sheet GID
 * @returns {Promise<string>} Sheet tab name
 */
async function fetchSheetTabNameByGid(spreadsheetId, gid) {
  try {
    // Fetch the HTML with the specific GID in the URL
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${gid}`;
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const html = await response.text();

    // Extract tab name using the correct CSS class: docs-sheet-tab-caption
    // Pattern: <div class="goog-inline-block docs-sheet-tab-caption">Tab Name</div>
    const tabCaptionPattern = /<div class="[^"]*docs-sheet-tab-caption[^"]*">([^<]+)<\/div>/g;
    const matches = [];
    let match;

    while ((match = tabCaptionPattern.exec(html)) !== null) {
      const tabName = match[1].trim();
      if (tabName && tabName.length > 0) {
        matches.push(tabName);
      }
    }

    // If we found matches, we need to determine which one corresponds to our GID
    // The HTML structure shows the active tab, so we'll look for all tabs
    // and try to match based on the GID in the URL
    if (matches.length > 0) {
      // For now, return the first match as the page loads with the specific GID
      // The active tab should be the one we're looking for

      // Try to find the tab name that appears near our GID in the HTML
      const gidPattern = new RegExp(`gid=${gid}[^>]*>[^<]*<[^>]*>([^<]+)`);
      const gidMatch = html.match(gidPattern);
      if (gidMatch) {
        const nearbyText = gidMatch[1].trim();
        const foundTab = matches.find(name => nearbyText.includes(name) || name.includes(nearbyText));
        if (foundTab) {
          return foundTab;
        }
      }

      // Fallback: return the last match (active tab is often rendered last)
      return matches[matches.length - 1];
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Fetch all sheet tabs (name + GID) from Google Sheets
 * @param {string} spreadsheetId - Google Sheets ID
 * @returns {Promise<Array>} Array of {name, gid} objects
 */
async function fetchAllSheetTabs(spreadsheetId) {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
    const response = await fetch(url);
    if (!response.ok) {
      return [{ name: 'Imported Sheet', gid: null }];
    }
    const html = await response.text();

    // Extract all tabs from the sheet structure
    // Look for patterns in the embedded JSON data that contains sheet info
    // Pattern: "sheets":[{"properties":{"sheetId":123,"title":"Tab Name",...
    const sheetsData = [];

    // Try multiple patterns to extract sheet data

    // Pattern 1: Look for sheets array in JSON
    // Match the entire sheets array with proper nesting handling
    let startIdx = html.indexOf('"sheets":[');
    if (startIdx !== -1) {
      // Find the closing bracket by counting nested brackets
      let depth = 0;
      let i = startIdx + 10; // Start after "sheets":[
      let endIdx = -1;

      while (i < html.length && i < startIdx + 50000) { // Limit search to 50KB
        if (html[i] === '[') depth++;
        else if (html[i] === ']') {
          if (depth === 0) {
            endIdx = i;
            break;
          }
          depth--;
        }
        i++;
      }

      if (endIdx !== -1) {
        const sheetsJson = html.substring(startIdx, endIdx + 1);

        // Extract sheet properties
        const sheetPattern = /"sheetId":(\d+)[^}]*"title":"([^"]+)"/g;
        let match;

        while ((match = sheetPattern.exec(sheetsJson)) !== null) {
          sheetsData.push({
            name: match[2],
            gid: match[1]
          });
        }
      }
    }

    // Fallback: try to extract tab names from the tab bar HTML
    if (sheetsData.length === 0) {
      // Look for tab names using the correct CSS class: docs-sheet-tab-caption
      const tabCaptionPattern = /<div class="[^"]*docs-sheet-tab-caption[^"]*">([^<]+)<\/div>/g;
      let match;

      while ((match = tabCaptionPattern.exec(html)) !== null) {
        const tabName = match[1].trim();
        if (tabName && tabName.length > 0) {
          sheetsData.push({
            name: tabName,
            gid: null // GID unknown - will use brute-force discovery
          });
        }
      }
    }

    // If we still have nothing, return a fallback
    if (sheetsData.length === 0) {
      const titleMatch = html.match(/<title>([^<]+)<\/title>/);
      const title = titleMatch
        ? titleMatch[1].replace(/\s*-\s*Google\s+(Sheets|Tabellen)?\s*$/i, '').trim()
        : 'Imported Sheet';

      return [{ name: title, gid: null }];
    }

    return sheetsData;
  } catch (error) {
    return [{ name: 'Imported Sheet', gid: null }];
  }
}

/**
 * Fetch CSV data from Google Sheets
 * @param {string} spreadsheetId - Google Sheets ID
 * @param {string} gid - Sheet GID (optional, defaults to first sheet)
 * @returns {Promise<string>} CSV data
 */
async function fetchGoogleSheetCSV(spreadsheetId, gid = null) {
  let url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;

  if (gid) {
    url += `&gid=${gid}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.status} ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    throw error;
  }
}

/**
 * Parse CSV text into array of objects
 * @param {string} csvText - Raw CSV data
 * @returns {Array<Object>} Array of row objects
 */
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length === 0) return [];

  // First line is headers
  const headers = lines[0].split(',').map(h => h.trim());

  // Parse remaining lines
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }

  return rows;
}

/**
 * Format Google Sheets data as readable text for Data Card
 * @param {Array<Object>} rows - Parsed CSV rows
 * @param {string} sheetTitle - Title of the sheet
 * @returns {string} Formatted text
 */
function formatSheetAsText(rows, sheetTitle = 'Training Plan') {
  if (!rows || rows.length === 0) {
    return sheetTitle;
  }

  let text = `${sheetTitle}\n\n`;

  // Get all unique exercises
  const exercises = {};
  rows.forEach(row => {
    const exercise = row.Exercise || row.exercise;
    if (!exercise) return;

    if (!exercises[exercise]) {
      exercises[exercise] = [];
    }
    exercises[exercise].push(row);
  });

  // Format each exercise group
  Object.keys(exercises).forEach(exerciseName => {
    const sets = exercises[exerciseName];
    text += `${exerciseName}\n`;

    sets.forEach((set, index) => {
      const setNum = set['Number.Set'] || set['Number Set'] || (index + 1);
      const reps = set.Reps || set.reps || '';
      const weight = set.Weight || set.weight || '';
      const nonstop = set['Nonstop?'] || set.nonstop || '';

      text += `  Set ${setNum}: ${reps} reps`;
      if (weight && weight !== 'Body') {
        text += ` @ ${weight}`;
      }
      if (nonstop === 'Yes' || nonstop === 'yes') {
        text += ' (nonstop)';
      }
      text += '\n';
    });

    text += '\n';
  });

  return text.trim();
}

/**
 * Import Google Sheets data and return formatted preference data
 * Imports the tab specified by GID in URL, or first tab if no GID
 * @param {string} spreadsheetUrl - Google Sheets URL (may include #gid=...)
 * @returns {Promise<Object>} Preference data object with source_url
 */
async function importGoogleSheet(spreadsheetUrl) {
  try {
    // Extract spreadsheet ID and GID from URL
    const { spreadsheetId, gid } = extractSpreadsheetId(spreadsheetUrl);
    if (!spreadsheetId) {
      throw new Error('Invalid Google Sheets URL');
    }

    // Fetch all sheet tabs to get tab names
    const tabs = await fetchAllSheetTabs(spreadsheetId);

    // Fetch CSV data for the specified tab first
    const csvData = await fetchGoogleSheetCSV(spreadsheetId, gid);

    // Determine tab name based on whether GID is specified
    let tabName = 'Imported Sheet';
    if (gid) {
      // Fetch the actual tab name from HTML using the GID
      const fetchedName = await fetchSheetTabNameByGid(spreadsheetId, gid);
      tabName = fetchedName || `Sheet (GID: ${gid})`;
    } else {
      // Use first tab name from HTML
      tabName = tabs.length > 0 ? tabs[0].name : 'Imported Sheet';
    }

    // Parse CSV
    const rows = parseCSV(csvData);

    // Format as text
    const formattedText = formatSheetAsText(rows, tabName);

    // Normalize URL for consistent comparison (use spreadsheet ID + GID)
    const normalizedUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}${gid ? `#gid=${gid}` : ''}`;

    // Return single preference data with source URL
    return {
      value: formattedText,
      state: 'default',
      collections: ['Training'],
      sourceUrl: normalizedUrl
    };
  } catch (error) {
    throw error;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    extractSpreadsheetId,
    fetchSheetTabNameByGid,
    fetchAllSheetTabs,
    fetchGoogleSheetCSV,
    parseCSV,
    formatSheetAsText,
    importGoogleSheet
  };
}
