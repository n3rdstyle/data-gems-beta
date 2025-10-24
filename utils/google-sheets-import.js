/**
 * Google Sheets Import Utilities
 * Functions to fetch and format Google Sheets data
 */

/**
 * Extract spreadsheet ID from Google Sheets URL
 * @param {string} url - Google Sheets URL
 * @returns {string|null} Spreadsheet ID or null if invalid
 */
function extractSpreadsheetId(url) {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
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
      // Look for tab names in the sheet tab bar
      const tabBarPattern = />([^<]+)<\/div><div class="goog-inline-block docs-sheet-tab-dropdown"/g;
      let match;

      while ((match = tabBarPattern.exec(html)) !== null) {
        const tabName = match[1].trim();
        if (tabName && tabName.length > 0 && !tabName.startsWith('<')) {
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
    console.error('Error fetching sheet tabs:', error);
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
    console.error('Error fetching Google Sheet:', error);
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
 * Imports only the first/active tab - user must provide separate links for multiple tabs
 * @param {string} spreadsheetUrl - Google Sheets URL
 * @returns {Promise<Object>} Preference data object
 */
async function importGoogleSheet(spreadsheetUrl) {
  try {
    // Extract spreadsheet ID
    const spreadsheetId = extractSpreadsheetId(spreadsheetUrl);
    if (!spreadsheetId) {
      throw new Error('Invalid Google Sheets URL');
    }

    // Fetch all sheet tabs to get the first tab name
    const tabs = await fetchAllSheetTabs(spreadsheetId);
    const tabName = tabs.length > 0 ? tabs[0].name : 'Imported Sheet';

    console.log(`Importing first tab: ${tabName}`);
    if (tabs.length > 1) {
      console.log(`Note: ${tabs.length} tabs found, but only importing the first one`);
    }

    // Fetch CSV data for first tab (no GID = default/first tab)
    const csvData = await fetchGoogleSheetCSV(spreadsheetId, null);

    // Parse CSV
    const rows = parseCSV(csvData);

    // Format as text
    const formattedText = formatSheetAsText(rows, tabName);

    // Return single preference data
    return {
      value: formattedText,
      state: 'default',
      collections: ['Training']
    };
  } catch (error) {
    console.error('Error importing Google Sheet:', error);
    throw error;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    extractSpreadsheetId,
    fetchAllSheetTabs,
    fetchGoogleSheetCSV,
    parseCSV,
    formatSheetAsText,
    importGoogleSheet
  };
}
