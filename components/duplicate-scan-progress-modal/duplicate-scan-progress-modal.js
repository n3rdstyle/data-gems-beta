/**
 * Duplicate Scan Progress Modal Component
 * Shows progress while scanning for duplicates in the background
 * Requires: header.js, button-tertiary.js, overlay.js
 */

function createDuplicateScanProgressModal(options = {}) {
  const {
    onCancel = null
  } = options;

  // Create modal overlay using overlay component
  const overlay = createOverlay({
    blur: false,
    opacity: 'default',
    visible: false,
    onClick: () => {
      // Prevent closing on overlay click
    }
  });

  // Create modal container
  const modalElement = document.createElement('div');
  modalElement.className = 'duplicate-scan-progress-modal';

  // Create header (simple variant)
  const headerSection = createHeader({
    variant: 'simple',
    title: 'Scanning for Duplicates',
    onClose: () => {
      if (onCancel) {
        onCancel();
      }
      api.hide();
    }
  });

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'duplicate-scan-progress-modal__content';

  // Status text
  const statusText = document.createElement('div');
  statusText.className = 'duplicate-scan-progress-modal__status';
  statusText.textContent = 'Analyzing your gems for similar content...';

  // Progress counter
  const counterText = document.createElement('div');
  counterText.className = 'duplicate-scan-progress-modal__counter';
  counterText.textContent = 'Checked 0 / 0 gems';

  // Progress bar container
  const progressBarContainer = document.createElement('div');
  progressBarContainer.className = 'duplicate-scan-progress-modal__progress-bar';

  const progressBarFill = document.createElement('div');
  progressBarFill.className = 'duplicate-scan-progress-modal__progress-fill';
  progressBarContainer.appendChild(progressBarFill);

  // Percentage text
  const percentageText = document.createElement('div');
  percentageText.className = 'duplicate-scan-progress-modal__percentage';
  percentageText.textContent = '0%';

  // Found duplicates counter
  const foundContainer = document.createElement('div');
  foundContainer.className = 'duplicate-scan-progress-modal__found';

  const foundLabel = document.createElement('div');
  foundLabel.className = 'duplicate-scan-progress-modal__found-label';
  foundLabel.textContent = 'Similar pairs found';

  const foundCount = document.createElement('div');
  foundCount.className = 'duplicate-scan-progress-modal__found-count';
  foundCount.textContent = '0';

  foundContainer.appendChild(foundLabel);
  foundContainer.appendChild(foundCount);

  // Add sections to content
  contentContainer.appendChild(statusText);
  contentContainer.appendChild(counterText);
  contentContainer.appendChild(progressBarContainer);
  contentContainer.appendChild(percentageText);
  contentContainer.appendChild(foundContainer);

  // Create buttons section
  const buttonsSection = document.createElement('div');
  buttonsSection.className = 'duplicate-scan-progress-modal__buttons';

  // Cancel button
  const cancelButton = createTertiaryButton({
    text: 'Cancel Scan',
    onClick: () => {
      if (onCancel) {
        onCancel();
      }
      api.hide();
    }
  });
  buttonsSection.appendChild(cancelButton.element);

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

    updateProgress(checked, total, foundCount) {
      // Update counter
      counterText.textContent = `Checked ${checked} / ${total} gems`;

      // Update progress bar
      const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;
      progressBarFill.style.width = `${percentage}%`;
      percentageText.textContent = `${percentage}%`;

      // Update found count
      foundCount.textContent = foundCount.toString();
    },

    setStatus(message) {
      statusText.textContent = message;
    },

    destroy() {
      overlay.destroy();
    }
  };

  return api;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createDuplicateScanProgressModal };
}
