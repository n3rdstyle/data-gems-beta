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
 * Fetch active sheet tab name from Google Sheets
 * @param {string} spreadsheetId - Google Sheets ID
 * @returns {Promise<string>} Sheet tab name
 */
async function fetchGoogleSheetTabName(spreadsheetId) {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
    const response = await fetch(url);
    if (!response.ok) {
      return 'Imported Sheet'; // Fallback
    }
    const html = await response.text();

    // Try to extract the active sheet tab name from the HTML
    // Google Sheets renders tab names in the sheet tab bar near the bottom
    // Look for pattern like: >Tab Name</div><div class="goog-inline-block docs-sheet-tab-dropdown"
    const tabBarPattern = />([^<]+)<\/div><div class="goog-inline-block docs-sheet-tab-dropdown"/;
    const tabMatch = html.match(tabBarPattern);
    if (tabMatch && tabMatch[1]) {
      const tabName = tabMatch[1].trim();
      // Make sure it's not empty and not a generic element
      if (tabName && tabName.length > 0 && !tabName.startsWith('<')) {
        return tabName;
      }
    }

    // Fallback: Try to extract from JSON structure
    const sheetNamePatterns = [
      /"sheets":\s*\[\s*\{\s*"properties":\s*\{\s*"sheetId":\s*\d+,\s*"title":\s*"([^"]+)"/,
      /'sheets':\s*\[\s*\{\s*'properties':\s*\{\s*'sheetId':\s*\d+,\s*'title':\s*'([^']+)'/,
    ];

    for (const pattern of sheetNamePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    // Fallback: try to get spreadsheet title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    if (titleMatch) {
      let title = titleMatch[1].replace(/\s*-\s*Google\s+(Sheets|Tabellen)?\s*$/i, '').trim();
      return title || 'Imported Sheet';
    }

    return 'Imported Sheet'; // Final fallback
  } catch (error) {
    console.error('Error fetching sheet tab name:', error);
    return 'Imported Sheet'; // Fallback
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

    // Fetch sheet tab name
    const sheetTitle = await fetchGoogleSheetTabName(spreadsheetId);

    // Fetch CSV data
    const csvData = await fetchGoogleSheetCSV(spreadsheetId);

    // Parse CSV
    const rows = parseCSV(csvData);

    // Format as text
    const formattedText = formatSheetAsText(rows, sheetTitle);

    // Return preference data
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
    fetchGoogleSheetTabName,
    fetchGoogleSheetCSV,
    parseCSV,
    formatSheetAsText,
    importGoogleSheet
  };
}
