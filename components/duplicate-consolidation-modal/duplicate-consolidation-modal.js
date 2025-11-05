/**
 * Duplicate Consolidation Modal Component
 * Modal shown when a similar gem is detected, offering options to:
 * - Replace (delete old, keep new)
 * - Merge (consolidate both into one)
 * - Keep Both (save as separate gems)
 * - Cancel (don't save)
 * Requires: header.js, button-primary.js, button-tertiary.js, overlay.js
 */

function createDuplicateConsolidationModal(options = {}) {
  const {
    existingText = '',
    newText = '',
    similarity = 0,
    onReplace = null,
    onMerge = null,
    onKeepBoth = null,
    onCancel = null
  } = options;

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
  modalElement.className = 'duplicate-consolidation-modal';

  // Create header (simple variant)
  const headerSection = createHeader({
    variant: 'simple',
    title: 'Similar Gem Found',
    onClose: () => {
      if (onCancel) {
        onCancel();
      }
      api.hide();
    }
  });

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'duplicate-consolidation-modal__content';

  // Create similarity indicator
  const similarityIndicator = document.createElement('div');
  similarityIndicator.className = 'duplicate-consolidation-modal__similarity';
  similarityIndicator.innerHTML = `
    <span class="duplicate-consolidation-modal__similarity-label">Similarity:</span>
    <span class="duplicate-consolidation-modal__similarity-value">${similarity}%</span>
  `;

  // Create info text
  const infoText = document.createElement('p');
  infoText.className = 'duplicate-consolidation-modal__info';
  infoText.textContent = 'We found a gem that looks similar to the one you\'re trying to save. What would you like to do?';

  // Create comparison section
  const comparisonContainer = document.createElement('div');
  comparisonContainer.className = 'duplicate-consolidation-modal__comparison';

  // Existing gem
  const existingGemSection = document.createElement('div');
  existingGemSection.className = 'duplicate-consolidation-modal__gem duplicate-consolidation-modal__gem--existing';

  const existingLabel = document.createElement('div');
  existingLabel.className = 'duplicate-consolidation-modal__gem-label';
  existingLabel.textContent = 'Existing Gem';

  const existingContent = document.createElement('div');
  existingContent.className = 'duplicate-consolidation-modal__gem-content';
  existingContent.textContent = existingText;

  existingGemSection.appendChild(existingLabel);
  existingGemSection.appendChild(existingContent);

  // New gem
  const newGemSection = document.createElement('div');
  newGemSection.className = 'duplicate-consolidation-modal__gem duplicate-consolidation-modal__gem--new';

  const newLabel = document.createElement('div');
  newLabel.className = 'duplicate-consolidation-modal__gem-label';
  newLabel.textContent = 'New Gem';

  const newContent = document.createElement('div');
  newContent.className = 'duplicate-consolidation-modal__gem-content';
  newContent.textContent = newText;

  newGemSection.appendChild(newLabel);
  newGemSection.appendChild(newContent);

  comparisonContainer.appendChild(existingGemSection);
  comparisonContainer.appendChild(newGemSection);

  // Add sections to content
  contentContainer.appendChild(similarityIndicator);
  contentContainer.appendChild(infoText);
  contentContainer.appendChild(comparisonContainer);

  // Create buttons section
  const buttonsSection = document.createElement('div');
  buttonsSection.className = 'duplicate-consolidation-modal__buttons';

  // Merge button (primary action)
  const mergeButton = createPrimaryButton({
    label: 'Merge',
    variant: 'v2',
    onClick: async () => {
      if (onMerge) {
        await onMerge();
      }
      api.hide();
    }
  });

  // Replace button
  const replaceButton = createTertiaryButton({
    text: 'Replace',
    onClick: () => {
      if (onReplace) {
        onReplace();
      }
      api.hide();
    }
  });

  // Keep Both button
  const keepBothButton = createTertiaryButton({
    text: 'Keep Both',
    onClick: () => {
      if (onKeepBoth) {
        onKeepBoth();
      }
      api.hide();
    }
  });

  // Cancel button
  const cancelButton = createTertiaryButton({
    text: 'Cancel',
    onClick: () => {
      if (onCancel) {
        onCancel();
      }
      api.hide();
    }
  });

  // Add buttons in order: Merge (primary), Replace, Keep Both, Cancel
  buttonsSection.appendChild(mergeButton.element);
  buttonsSection.appendChild(replaceButton.element);
  buttonsSection.appendChild(keepBothButton.element);
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

    destroy() {
      overlay.destroy();
    }
  };

  return api;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createDuplicateConsolidationModal };
}
