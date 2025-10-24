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
 * @param {string} sheetTitle - Title for the preference card
 * @returns {Promise<Object>} Preference data object
 */
async function importGoogleSheet(spreadsheetUrl, sheetTitle = 'Training Plan') {
  try {
    // Extract spreadsheet ID
    const spreadsheetId = extractSpreadsheetId(spreadsheetUrl);
    if (!spreadsheetId) {
      throw new Error('Invalid Google Sheets URL');
    }

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
    fetchGoogleSheetCSV,
    parseCSV,
    formatSheetAsText,
    importGoogleSheet
  };
}
