/**
 * Search Modal
 * Bottom sheet modal for searching preferences
 */

function createSearchModal(options = {}) {
  const {
    placeholder = 'Search your preferences',
    onSearch = null,
    onClose = null,
    onSearchSubmit = null
  } = options;

  // Create modal container
  const modalElement = document.createElement('div');
  modalElement.className = 'search-modal';

  // Create header
  const header = document.createElement('div');
  header.className = 'search-modal__header';

  const title = document.createElement('h2');
  title.className = 'search-modal__title';
  title.textContent = 'Search Preferences';

  const closeButton = createTertiaryButton({
    icon: 'close',
    ariaLabel: 'Close',
    size: 'default'
  });

  header.appendChild(title);
  header.appendChild(closeButton.element);

  // Create search field wrapper
  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'search-modal__search';

  // Create search component
  const searchField = createSearch({
    placeholder,
    onInput: (value) => {
      if (onSearch) {
        onSearch(value);
      }
    },
    onEnter: (value) => {
      if (value && value.trim()) {
        if (onSearchSubmit) {
          onSearchSubmit(value);
        }
        hide(false); // Don't clear the field on submit
      }
    }
  });

  searchWrapper.appendChild(searchField.element);

  // Assemble modal
  modalElement.appendChild(header);
  modalElement.appendChild(searchWrapper);

  // Store overlay reference
  let overlayElement = null;

  // Event handlers
  closeButton.element.addEventListener('click', () => {
    hide();
    if (onClose) onClose();
  });

  // Show/hide functions
  const show = () => {
    // Clear field when opening modal (silent mode to avoid triggering filters)
    searchField.clear(true);

    // Trigger reflow for animation
    setTimeout(() => {
      modalElement.classList.add('visible');
      // Auto-focus search field
      const input = searchField.element.querySelector('input');
      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    }, 10);
  };

  const hide = (clearField = true) => {
    modalElement.classList.remove('visible');
    // Clear search field only if requested
    if (clearField) {
      searchField.clear();
    }
    setTimeout(() => {
      modalElement.remove();
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

    getSearchValue() {
      return searchField.getValue();
    },

    clearSearch() {
      searchField.clear();
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createSearchModal };
}
