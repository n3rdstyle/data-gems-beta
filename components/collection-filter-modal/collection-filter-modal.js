/**
 * Collection Filter Modal
 * Modal for selecting one or more collection tags to filter by
 */

function createCollectionFilterModal(options = {}) {
  const {
    collections = [],
    selectedCollections = [],
    onApply = null,
    onClose = null
  } = options;

  // Create modal container
  const modalElement = document.createElement('div');
  modalElement.className = 'collection-filter-modal';

  // Create header
  const header = document.createElement('div');
  header.className = 'collection-filter-modal__header';

  const title = document.createElement('h2');
  title.className = 'collection-filter-modal__title';
  title.textContent = 'Filter by Collection';

  const closeButton = createTertiaryButton({
    icon: 'close',
    ariaLabel: 'Close',
    size: 'default'
  });

  header.appendChild(title);
  header.appendChild(closeButton.element);

  // Create collection list
  const list = document.createElement('div');
  list.className = 'collection-filter-modal__list';

  // Track selected collections
  let selected = [...selectedCollections];

  // Create footer with buttons (before collection items, so we can reference them)
  const footer = document.createElement('div');
  footer.className = 'collection-filter-modal__footer';

  const clearButton = createSecondaryButton({
    label: 'Clear',
    variant: 'v2',
    disabled: selected.length === 0 // Initially disabled if no selection
  });

  const applyButton = createPrimaryButton({
    label: 'Apply Filter',
    variant: 'v2',
    disabled: false // Always enabled - empty selection means "show all"
  });

  // Helper to update button state
  const updateButtonState = () => {
    // Apply button is always enabled (empty selection = show all)
    applyButton.setDisabled(false);

    // Clear button only enabled when there's a selection
    if (selected.length === 0) {
      clearButton.setDisabled(true);
    } else {
      clearButton.setDisabled(false);
    }
  };

  // Create collection items
  if (collections.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'collection-filter-modal__empty';
    empty.textContent = 'No collections available';
    list.appendChild(empty);
  } else {
    collections.forEach(collection => {
      const item = document.createElement('div');
      item.className = 'collection-filter-modal__item';
      if (selected.includes(collection.label)) {
        item.classList.add('active');
      }

      const content = document.createElement('div');
      content.className = 'collection-filter-modal__item-content';

      const label = document.createElement('span');
      label.className = 'collection-filter-modal__item-label';
      label.textContent = collection.label;

      const count = document.createElement('span');
      count.className = 'collection-filter-modal__item-count';
      count.textContent = `(${collection.count})`;

      content.appendChild(label);
      content.appendChild(count);

      const check = document.createElement('div');
      check.className = 'collection-filter-modal__item-check';

      item.appendChild(content);
      item.appendChild(check);

      // Toggle selection on click
      item.addEventListener('click', () => {
        if (selected.includes(collection.label)) {
          selected = selected.filter(s => s !== collection.label);
          item.classList.remove('active');
        } else {
          selected.push(collection.label);
          item.classList.add('active');
        }
        updateButtonState(); // Update apply button state
      });

      list.appendChild(item);
    });
  }

  // Add buttons to footer (buttons were created earlier)
  // Order: Apply Filter first, then Clear
  footer.appendChild(applyButton.element);
  footer.appendChild(clearButton.element);

  // Assemble modal
  modalElement.appendChild(header);
  modalElement.appendChild(list);
  modalElement.appendChild(footer);

  // Event handlers
  closeButton.element.addEventListener('click', () => {
    hide();
    if (onClose) onClose();
  });

  clearButton.element.addEventListener('click', () => {
    selected = [];
    list.querySelectorAll('.collection-filter-modal__item').forEach(item => {
      item.classList.remove('active');
    });
    // Call onApply with empty array to show all cards and close modal
    if (onApply) {
      onApply([]);
    }
    hide();
  });

  applyButton.element.addEventListener('click', () => {
    if (onApply) {
      onApply(selected);
    }
    hide();
  });

  // Store overlay reference
  let overlayElement = null;

  // Show/hide functions
  const show = () => {
    // Trigger reflow for animation
    setTimeout(() => {
      modalElement.classList.add('visible');
    }, 10);
  };

  const hide = () => {
    modalElement.classList.remove('visible');
    setTimeout(() => {
      modalElement.remove();
      // Remove overlay if it exists
      if (overlayElement) {
        overlayElement.remove();
        overlayElement = null;
      }
    }, 300);
  };

  const setOverlay = (overlay) => {
    overlayElement = overlay;
  };

  // Public API
  return {
    element: modalElement,
    show,
    hide,
    setOverlay,

    getSelectedCollections() {
      return selected;
    },

    setSelectedCollections(collections) {
      selected = [...collections];
      list.querySelectorAll('.collection-filter-modal__item').forEach((item, index) => {
        if (selected.includes(collections[index]?.label)) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createCollectionFilterModal };
}
