/**
 * Search Component
 * Creates a search input field with state management
 * Requires: input-field.js
 */

function createSearch(options = {}) {
  const {
    placeholder = 'Search your preferences',
    onInput = null,
    onClear = null,
    onEnter = null
  } = options;

  // Create search container
  const searchElement = document.createElement('div');
  searchElement.className = 'search';

  // Create input field
  const inputField = createInputField({
    type: 'search',
    placeholder: placeholder,
    onChange: (value) => {
      if (onInput) {
        onInput(value);
      }
    },
    onKeyDown: (e) => {
      if (e.key === 'Escape') {
        inputField.clear();
        if (onClear) {
          onClear();
        }
        if (onInput) {
          onInput('');
        }
      } else if (e.key === 'Enter') {
        if (onEnter) {
          onEnter(inputField.getValue());
        }
      }
    }
  });

  searchElement.appendChild(inputField.element);

  // Public API
  return {
    element: searchElement,

    getValue() {
      return inputField.getValue();
    },

    setValue(value) {
      inputField.setValue(value);
      if (onInput) {
        onInput(value);
      }
    },

    clear(silent = false) {
      inputField.clear();
      if (!silent) {
        if (onClear) {
          onClear();
        }
        if (onInput) {
          onInput('');
        }
      }
    },

    focus() {
      inputField.focus();
    },

    blur() {
      inputField.blur();
    },

    setPlaceholder(newPlaceholder) {
      inputField.setPlaceholder(newPlaceholder);
    },

    // Event handlers
    onInput: null,
    onClear: null,
    onEnter: null
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createSearch };
}
