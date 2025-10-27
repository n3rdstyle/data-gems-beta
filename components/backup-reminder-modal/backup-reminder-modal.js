/**
 * Backup Reminder Modal Component
 * Modal for reminding users to backup their data with:
 * - Header (simple variant)
 * - Informational text about backups
 * - Toggle for automatic backup option
 * - Action buttons (export/later)
 * Requires: header.js, toggle.js, button-primary.js, button-tertiary.js, overlay.js
 */

function createBackupReminderModal(options = {}) {
  const {
    onClose = null,
    onExport = null,
    autoBackupEnabled = false,
    onAutoBackupToggle = null
  } = options;

  // Track auto-backup state
  let autoBackupState = autoBackupEnabled;

  // Create modal overlay using overlay component
  const overlay = createOverlay({
    blur: false,
    opacity: 'default',
    visible: false,
    onClick: () => {
      // Prevent closing on overlay click - user should choose an action
    }
  });

  // Create modal container
  const modalElement = document.createElement('div');
  modalElement.className = 'backup-reminder-modal';

  // Create header (simple variant)
  const headerSection = createHeader({
    variant: 'simple',
    title: 'Backup Reminder',
    onClose: () => {
      if (onClose) {
        onClose(autoBackupState);
      }
      api.hide();
    }
  });

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'backup-reminder-modal__content';

  // Create info text
  const infoText = document.createElement('p');
  infoText.className = 'backup-reminder-modal__info';
  infoText.textContent = 'Great progress! You\'ve added 10 preferences to your profile. To keep your data safe, we recommend creating a backup now.';

  // Create backup explanation
  const explanationText = document.createElement('p');
  explanationText.className = 'backup-reminder-modal__explanation';
  explanationText.textContent = 'Regular backups ensure you never lose your valuable preference data. You can restore your data anytime from a backup file.';

  // Create auto-backup section
  const autoBackupContainer = document.createElement('div');
  autoBackupContainer.className = 'backup-reminder-modal__auto-backup';

  const autoBackupLabelContainer = document.createElement('div');
  autoBackupLabelContainer.className = 'backup-reminder-modal__auto-backup-text';

  const autoBackupLabel = document.createElement('div');
  autoBackupLabel.className = 'backup-reminder-modal__auto-backup-label';
  autoBackupLabel.textContent = 'Automatic backups';

  const autoBackupDescription = document.createElement('div');
  autoBackupDescription.className = 'backup-reminder-modal__auto-backup-description';
  autoBackupDescription.textContent = 'Automatically export backup after 50 entries and every 50 entries thereafter';

  autoBackupLabelContainer.appendChild(autoBackupLabel);
  autoBackupLabelContainer.appendChild(autoBackupDescription);

  const autoBackupToggle = createToggle({
    active: autoBackupEnabled,
    onChange: (isActive) => {
      autoBackupState = isActive;
      if (onAutoBackupToggle) {
        onAutoBackupToggle(isActive);
      }
    }
  });

  autoBackupContainer.appendChild(autoBackupLabelContainer);
  autoBackupContainer.appendChild(autoBackupToggle.element);

  // Add sections to content
  contentContainer.appendChild(infoText);
  contentContainer.appendChild(explanationText);
  contentContainer.appendChild(autoBackupContainer);

  // Create buttons section
  const buttonsSection = document.createElement('div');
  buttonsSection.className = 'backup-reminder-modal__buttons';

  const exportButton = createPrimaryButton({
    label: 'Export Backup',
    variant: 'v2',
    onClick: () => {
      if (onExport) {
        onExport();
      }
      if (onClose) {
        onClose(autoBackupState);
      }
      api.hide();
    }
  });

  const laterButton = createTertiaryButton({
    text: 'Later',
    onClick: () => {
      if (onClose) {
        onClose(autoBackupState);
      }
      api.hide();
    }
  });

  buttonsSection.appendChild(exportButton.element);
  buttonsSection.appendChild(laterButton.element);

  // Assemble modal
  modalElement.appendChild(headerSection.element);
  modalElement.appendChild(contentContainer);
  modalElement.appendChild(buttonsSection);

  // Assemble overlay with modal
  overlay.element.appendChild(modalElement);

  // Public API
  const api = {
    element: overlay.element,
    modalElement: modalElement,

    getAutoBackupState() {
      return autoBackupState;
    },

    setAutoBackupState(value) {
      autoBackupState = value;
      autoBackupToggle.setActive(value);
    },

    show(container) {
      // If container provided, append to container, otherwise append to body
      const target = container || document.body;
      target.appendChild(overlay.element);
      // Show overlay after appending to trigger transition
      setTimeout(() => overlay.show(), 10);
    },

    hide() {
      overlay.hide();
      // Use timeout to allow fade-out animation
      setTimeout(() => {
        if (overlay.element.parentNode) {
          overlay.element.parentNode.removeChild(overlay.element);
        }
      }, 200);
    },

    destroy() {
      overlay.destroy();
    }
  };

  return api;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createBackupReminderModal };
}
