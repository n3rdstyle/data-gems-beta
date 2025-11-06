/**
 * Duplicate Results Modal Component
 * Shows all found duplicate pairs and allows user to review and merge them
 * Requires: header.js, button-tertiary.js, button-primary.js, overlay.js
 */

function createDuplicateResultsModal(options = {}) {
  const {
    duplicatePairs = [], // Array of {gem1, gem2, similarity}
    onMergePair = null,  // (gem1Id, gem2Id) => Promise
    onReplacePair = null, // (oldId, newId) => Promise
    onKeepBoth = null,    // (gem1Id, gem2Id) => Promise
    onClose = null
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
  modalElement.className = 'duplicate-results-modal';

  // Create header (simple variant)
  const headerSection = createHeader({
    variant: 'simple',
    title: 'Similar Gems Found',
    onClose: () => {
      if (onClose) {
        onClose();
      }
      api.hide();
    }
  });

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'duplicate-results-modal__content';

  if (duplicatePairs.length === 0) {
    // No duplicates found
    const noResults = document.createElement('div');
    noResults.className = 'duplicate-results-modal__no-results';

    const icon = document.createElement('div');
    icon.className = 'duplicate-results-modal__no-results-icon';
    icon.textContent = '✨';

    const text = document.createElement('div');
    text.className = 'duplicate-results-modal__no-results-text';
    text.textContent = 'No similar gems found! Your collection is unique.';

    noResults.appendChild(icon);
    noResults.appendChild(text);
    contentContainer.appendChild(noResults);
  } else {
    // Show summary
    const summary = document.createElement('div');
    summary.className = 'duplicate-results-modal__summary';
    summary.innerHTML = `Found <span class="duplicate-results-modal__summary-count">${duplicatePairs.length}</span> similar ${duplicatePairs.length === 1 ? 'pair' : 'pairs'}. Review and choose how to handle each:`;
    contentContainer.appendChild(summary);

    // Create pairs list
    const pairsList = document.createElement('div');
    pairsList.className = 'duplicate-results-modal__pairs';

    duplicatePairs.forEach((pair, index) => {
      const pairElement = createPairElement(pair, index);
      pairsList.appendChild(pairElement);
    });

    contentContainer.appendChild(pairsList);
  }

  // Create pair element
  function createPairElement(pair, index) {
    const { gem1, gem2, similarity } = pair;

    const pairDiv = document.createElement('div');
    pairDiv.className = 'duplicate-results-modal__pair';
    pairDiv.setAttribute('data-pair-index', index);

    // Similarity badge
    const similarityBadge = document.createElement('div');
    similarityBadge.className = 'duplicate-results-modal__similarity';
    similarityBadge.innerHTML = `
      <span class="duplicate-results-modal__similarity-label">Similarity:</span>
      <span class="duplicate-results-modal__similarity-value">${similarity}%</span>
    `;
    pairDiv.appendChild(similarityBadge);

    // Gems comparison
    const gemsContainer = document.createElement('div');
    gemsContainer.className = 'duplicate-results-modal__gems';

    const gem1Element = document.createElement('div');
    gem1Element.className = 'duplicate-results-modal__gem';
    gem1Element.textContent = gem1.value;

    const gem2Element = document.createElement('div');
    gem2Element.className = 'duplicate-results-modal__gem';
    gem2Element.textContent = gem2.value;

    gemsContainer.appendChild(gem1Element);
    gemsContainer.appendChild(gem2Element);
    pairDiv.appendChild(gemsContainer);

    // Action buttons
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'duplicate-results-modal__pair-actions';

    // Merge button (primary)
    const mergeBtn = createTertiaryButton({
      text: 'Merge',
      onClick: async () => {
        if (onMergePair) {
          await onMergePair(gem1.id, gem2.id);
          // Remove this pair from the list
          pairDiv.remove();
          updateSummary();
        }
      }
    });

    // Replace button
    const replaceBtn = createTertiaryButton({
      text: 'Replace',
      onClick: async () => {
        if (onReplacePair) {
          await onReplacePair(gem1.id, gem2.id);
          // Remove this pair from the list
          pairDiv.remove();
          updateSummary();
        }
      }
    });

    // Keep Both button
    const keepBothBtn = createTertiaryButton({
      text: 'Keep Both',
      onClick: async () => {
        if (onKeepBoth) {
          await onKeepBoth(gem1.id, gem2.id);
          // Remove this pair from the list
          pairDiv.remove();
          updateSummary();
        }
      }
    });

    actionsContainer.appendChild(mergeBtn.element);
    actionsContainer.appendChild(replaceBtn.element);
    actionsContainer.appendChild(keepBothBtn.element);

    pairDiv.appendChild(actionsContainer);

    return pairDiv;
  }

  // Update summary when pairs are processed
  function updateSummary() {
    const remainingPairs = contentContainer.querySelectorAll('.duplicate-results-modal__pair').length;

    if (remainingPairs === 0) {
      // All pairs processed, show success message
      contentContainer.innerHTML = '';
      const success = document.createElement('div');
      success.className = 'duplicate-results-modal__no-results';
      success.innerHTML = `
        <div class="duplicate-results-modal__no-results-icon">✅</div>
        <div class="duplicate-results-modal__no-results-text">All duplicates processed!</div>
      `;
      contentContainer.appendChild(success);
    } else {
      // Update count
      const summary = contentContainer.querySelector('.duplicate-results-modal__summary');
      if (summary) {
        summary.innerHTML = `Found <span class="duplicate-results-modal__summary-count">${remainingPairs}</span> similar ${remainingPairs === 1 ? 'pair' : 'pairs'}. Review and choose how to handle each:`;
      }
    }
  }

  // Create buttons section
  const buttonsSection = document.createElement('div');
  buttonsSection.className = 'duplicate-results-modal__buttons';

  // Done button
  const doneButton = createPrimaryButton({
    label: 'Done',
    variant: 'v2',
    onClick: () => {
      if (onClose) {
        onClose();
      }
      api.hide();
    }
  });
  buttonsSection.appendChild(doneButton.element);

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
  module.exports = { createDuplicateResultsModal };
}
