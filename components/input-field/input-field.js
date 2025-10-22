/**
 * Input Field Element
 * Reusable input and textarea component
 */

// Counter for generating unique IDs
let inputFieldIdCounter = 0;

function createInputField(options = {}) {
  const {
    type = 'text', // 'text', 'search', 'textarea'
    label = '',
    placeholder = '',
    value = '',
    disabled = false,
    required = false,
    maxLength = null,
    showCount = false,
    autoResize = false, // For textarea
    helperText = '',
    errorMessage = '',
    id = null, // Optional custom id
    name = null, // Optional custom name
    onChange = null,
    onInput = null,
    onFocus = null,
    onBlur = null,
    onKeyPress = null
  } = options;

  // Generate unique ID if not provided
  const uniqueId = id || `input-field-${++inputFieldIdCounter}`;

  // Create container
  const container = document.createElement('div');
  container.className = 'input-field';

  if (type === 'search') {
    container.classList.add('input-field--search');
  }

  if (errorMessage) {
    container.classList.add('input-field--error');
  }

  // Create label if provided
  if (label) {
    const labelElement = document.createElement('label');
    labelElement.className = 'input-field__label';
    labelElement.htmlFor = uniqueId;
    labelElement.textContent = label;
    if (required) {
      labelElement.textContent += ' *';
    }
    container.appendChild(labelElement);
  }

  // Create input wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'input-field__wrapper';

  // Create search icon if search type
  if (type === 'search') {
    const searchIcon = document.createElement('div');
    searchIcon.className = 'input-field__search-icon';
    searchIcon.innerHTML = typeof getIcon !== 'undefined' ? getIcon('search') : '🔍';
    wrapper.appendChild(searchIcon);
  }

  // Create input or textarea
  let inputElement;
  if (type === 'textarea') {
    inputElement = document.createElement('textarea');
    inputElement.className = 'input-field__textarea';
    if (autoResize) {
      inputElement.classList.add('input-field__textarea--auto-resize');
    }
  } else {
    inputElement = document.createElement('input');
    inputElement.className = 'input-field__input';
    inputElement.type = type === 'search' ? 'text' : type;
  }

  // Set attributes
  inputElement.id = uniqueId;
  inputElement.name = name || uniqueId;
  if (placeholder) inputElement.placeholder = placeholder;
  if (value) inputElement.value = value;
  if (disabled) inputElement.disabled = disabled;
  if (required) inputElement.required = required;
  if (maxLength) inputElement.maxLength = maxLength;

  // Auto-resize textarea function
  const resizeTextarea = () => {
    if (type === 'textarea' && autoResize) {
      inputElement.style.height = 'auto';
      inputElement.style.height = inputElement.scrollHeight + 'px';
    }
  };

  // Add event listeners
  inputElement.addEventListener('input', (e) => {
    if (onInput) onInput(e.target.value, e);
    if (onChange) onChange(e.target.value, e);

    // Update character count
    if (showCount && countElement) {
      updateCount();
    }

    // Auto resize
    resizeTextarea();
  });

  inputElement.addEventListener('change', (e) => {
    if (onChange) onChange(e.target.value, e);
  });

  if (onFocus) {
    inputElement.addEventListener('focus', (e) => onFocus(e));
  }

  if (onBlur) {
    inputElement.addEventListener('blur', (e) => onBlur(e));
  }

  if (onKeyPress) {
    inputElement.addEventListener('keypress', (e) => onKeyPress(e));
  }

  wrapper.appendChild(inputElement);
  container.appendChild(wrapper);

  // Helper text
  if (helperText && !errorMessage) {
    const helperElement = document.createElement('div');
    helperElement.className = 'input-field__helper';
    helperElement.textContent = helperText;
    container.appendChild(helperElement);
  }

  // Error message
  if (errorMessage) {
    const errorElement = document.createElement('div');
    errorElement.className = 'input-field__error-message';
    errorElement.textContent = errorMessage;
    container.appendChild(errorElement);
  }

  // Character count
  let countElement = null;
  if (showCount && maxLength) {
    countElement = document.createElement('div');
    countElement.className = 'input-field__count';
    container.appendChild(countElement);

    const updateCount = () => {
      const current = inputElement.value.length;
      countElement.textContent = `${current} / ${maxLength}`;

      if (current > maxLength) {
        countElement.classList.add('input-field__count--over-limit');
      } else {
        countElement.classList.remove('input-field__count--over-limit');
      }
    };

    updateCount();
  }

  // Initial resize for textarea
  if (type === 'textarea' && autoResize) {
    setTimeout(resizeTextarea, 0);
  }

  // Public API
  return {
    element: container,

    getValue() {
      return inputElement.value;
    },

    setValue(newValue) {
      inputElement.value = newValue;
      if (showCount && countElement) {
        const current = inputElement.value.length;
        countElement.textContent = `${current} / ${maxLength}`;
      }
      resizeTextarea();
    },

    clear() {
      inputElement.value = '';
      if (showCount && countElement) {
        countElement.textContent = `0 / ${maxLength}`;
      }
      resizeTextarea();
    },

    focus() {
      inputElement.focus();
    },

    blur() {
      inputElement.blur();
    },

    disable() {
      inputElement.disabled = true;
    },

    enable() {
      inputElement.disabled = false;
    },

    isDisabled() {
      return inputElement.disabled;
    },

    setError(message) {
      container.classList.add('input-field--error');

      // Remove existing error message
      const existingError = container.querySelector('.input-field__error-message');
      if (existingError) {
        existingError.textContent = message;
      } else {
        const errorElement = document.createElement('div');
        errorElement.className = 'input-field__error-message';
        errorElement.textContent = message;
        container.appendChild(errorElement);
      }
    },

    clearError() {
      container.classList.remove('input-field--error');
      const errorElement = container.querySelector('.input-field__error-message');
      if (errorElement) {
        errorElement.remove();
      }
    },

    getInputElement() {
      return inputElement;
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createInputField };
}
