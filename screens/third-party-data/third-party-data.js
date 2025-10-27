/**
 * Third Party Data Screen
 * Screen for importing data from Google Sheets
 * Requires: header.js, input-field.js, button-primary.js
 */

function createThirdPartyData(options = {}) {
  const {
    onClose = null,
    onImport = null,
    importedSheets = [] // Array of imported sheets with {url, title, data}
  } = options;

  // Create main container
  const screenElement = document.createElement('div');
  screenElement.className = 'third-party-data';

  // Create header
  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'third-party-data__header';
  const header = createHeader({
    variant: 'simple',
    title: 'Third Party Data',
    onClose: onClose || (() => console.log('Third Party Data closed'))
  });
  headerWrapper.appendChild(header.element);

  // Create scrollable content container
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'third-party-data__content';

  // Instructions
  const instructions = document.createElement('p');
  instructions.className = 'third-party-data__instructions text-style-body';
  instructions.textContent = 'Import data from Google Sheets. Paste a Google Sheets URL below:';
  contentWrapper.appendChild(instructions);

  // URL Input Container
  const inputContainer = document.createElement('div');
  inputContainer.className = 'third-party-data__input-container';

  // Create input field for URL
  const urlInputField = createInputField({
    type: 'text',
    placeholder: 'https://docs.google.com/spreadsheets/d/...',
    helperText: ''
  });
  inputContainer.appendChild(urlInputField.element);

  // Create import button
  const importButton = createPrimaryButton({
    label: 'Import',
    variant: 'v2',
    onClick: async () => {
      const url = urlInputField.getValue().trim();
      if (!url) {
        alert('Please enter a Google Sheets URL');
        return;
      }

      // Validate URL format
      if (!url.includes('docs.google.com/spreadsheets')) {
        alert('Please enter a valid Google Sheets URL');
        return;
      }

      // Disable button during import
      importButton.setDisabled(true);
      importButton.setLabel('Importing...');

      try {
        if (onImport) {
          await onImport(url);
        }
        // Clear input after successful import
        urlInputField.clear();
      } catch (error) {
        alert(`Import failed: ${error.message}`);
      } finally {
        importButton.setDisabled(false);
        importButton.setLabel('Import');
      }
    }
  });
  inputContainer.appendChild(importButton.element);

  contentWrapper.appendChild(inputContainer);

  // Imported Sheets Section
  if (importedSheets && importedSheets.length > 0) {
    const sheetsHeader = document.createElement('h3');
    sheetsHeader.className = 'third-party-data__sheets-header text-style-h3';
    sheetsHeader.textContent = 'Imported Sheets';
    contentWrapper.appendChild(sheetsHeader);

    const sheetsList = document.createElement('div');
    sheetsList.className = 'third-party-data__sheets-list';

    importedSheets.forEach(sheet => {
      const sheetItem = document.createElement('div');
      sheetItem.className = 'third-party-data__sheet-item';

      const sheetName = document.createElement('div');
      sheetName.className = 'third-party-data__sheet-name text-style-label';
      sheetName.textContent = sheet.title || 'Untitled Sheet';

      const sheetUrl = document.createElement('div');
      sheetUrl.className = 'third-party-data__sheet-url text-style-caption';
      sheetUrl.textContent = sheet.url;

      sheetItem.appendChild(sheetName);
      sheetItem.appendChild(sheetUrl);
      sheetsList.appendChild(sheetItem);
    });

    contentWrapper.appendChild(sheetsList);
  }

  // Assemble screen
  screenElement.appendChild(headerWrapper);
  screenElement.appendChild(contentWrapper);

  // Public API
  return {
    element: screenElement
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createThirdPartyData };
}
