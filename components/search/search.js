/**
 * Search Component
 * Creates a search input field with state management
 */

function createSearch(options = {}) {
  const {
    placeholder = 'Search your preferences',
    onInput = null,
    onClear = null
  } = options;

  // Create search container
  const searchElement = document.createElement('div');
  searchElement.className = 'search';

  // Create input
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'search__input';
  input.placeholder = placeholder;

  // Add input event listener
  input.addEventListener('input', (e) => {
    const value = e.target.value;
    if (onInput) {
      onInput(value);
    }
  });

  // Add clear functionality (Escape key)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      if (onClear) {
        onClear();
      }
      if (onInput) {
        onInput('');
      }
    }
  });

  searchElement.appendChild(input);

  // Public API
  return {
    element: searchElement,

    getValue() {
      return input.value;
    },

    setValue(value) {
      input.value = value;
      if (onInput) {
        onInput(value);
      }
    },

    clear() {
      input.value = '';
      if (onClear) {
        onClear();
      }
      if (onInput) {
        onInput('');
      }
    },

    focus() {
      input.focus();
    },

    blur() {
      input.blur();
    },

    setPlaceholder(newPlaceholder) {
      input.placeholder = newPlaceholder;
    },

    // Event handlers
    onInput: null,
    onClear: null
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createSearch };
}
