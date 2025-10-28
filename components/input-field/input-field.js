/**
 * Input Field Element
 * Reusable input and textarea component
 */

// Counter for generating unique IDs
let inputFieldIdCounter = 0;

function createInputField(options = {}) {
  const {
    type = 'text', // 'text', 'email', 'search', 'textarea'
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
    validateEmail = false, // Enable live email validation
    id = null, // Optional custom id
    name = null, // Optional custom name
    onChange = null,
    onInput = null,
    onFocus = null,
    onBlur = null,
    onKeyPress = null,
    onKeyDown = null
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
    inputElement.className = 'input-field__textarea text-style-body';
    if (autoResize) {
      inputElement.classList.add('input-field__textarea--auto-resize');
    }
  } else {
    inputElement = document.createElement('input');
    inputElement.className = 'input-field__input text-style-body';
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

    // Update email validation
    updateEmailValidation();

    // Auto resize
    resizeTextarea();
  });

  inputElement.addEventListener('change', (e) => {
    if (onChange) onChange(e.target.value, e);
  });

  inputElement.addEventListener('focus', (e) => {
    // Show validation when focusing (if email type and has value)
    if ((validateEmail || type === 'email') && inputElement.value.trim()) {
      updateEmailValidation();
    }
    // Call user's onFocus callback if provided
    if (onFocus) onFocus(e);
  });

  inputElement.addEventListener('blur', (e) => {
    // Hide validation when leaving the field (return to default state)
    if (validateEmail || type === 'email') {
      if (validationElement) {
        validationElement.style.display = 'none';
        inputElement.classList.remove('input-field__input--valid');
        inputElement.classList.remove('input-field__input--invalid');
      }
    }
    // Call user's onBlur callback if provided
    if (onBlur) onBlur(e);
  });

  if (onKeyPress) {
    inputElement.addEventListener('keypress', (e) => onKeyPress(e));
  }

  if (onKeyDown) {
    inputElement.addEventListener('keydown', (e) => onKeyDown(e));
  }

  wrapper.appendChild(inputElement);
  container.appendChild(wrapper);

  // Email validation element (for live validation)
  let validationElement = null;
  if (validateEmail || type === 'email') {
    validationElement = document.createElement('div');
    validationElement.className = 'input-field__validation';
    validationElement.style.display = 'none';
    container.appendChild(validationElement);
  }

  // Helper function to validate email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Helper function to update validation state (live validation)
  const updateEmailValidation = () => {
    if (!validateEmail && type !== 'email') return;

    const emailValue = inputElement.value.trim();

    if (emailValue === '') {
      // Empty - hide validation
      validationElement.style.display = 'none';
      inputElement.classList.remove('input-field__input--valid');
      inputElement.classList.remove('input-field__input--invalid');
    } else if (isValidEmail(emailValue)) {
      // Valid email - show success
      validationElement.style.display = 'block';
      validationElement.textContent = '✓ Valid email';
      validationElement.className = 'input-field__validation input-field__validation--valid';
      inputElement.classList.add('input-field__input--valid');
      inputElement.classList.remove('input-field__input--invalid');
    } else {
      // Invalid email - show error
      validationElement.style.display = 'block';
      validationElement.textContent = '✗ Please enter a valid email';
      validationElement.className = 'input-field__validation input-field__validation--invalid';
      inputElement.classList.remove('input-field__input--valid');
      inputElement.classList.add('input-field__input--invalid');
    }
  };

  // Don't show validation initially - only show when user interacts with field
  // Validation will appear when user focuses the field

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
      // Update validation if email type
      updateEmailValidation();
    },

    clear() {
      inputElement.value = '';
      if (showCount && countElement) {
        countElement.textContent = `0 / ${maxLength}`;
      }
      resizeTextarea();
      // Clear validation
      if (validationElement) {
        validationElement.style.display = 'none';
        inputElement.classList.remove('input-field__input--valid');
        inputElement.classList.remove('input-field__input--invalid');
      }
    },

    clearValidation() {
      // Reset validation to default state (hide all validation)
      if (validationElement) {
        validationElement.style.display = 'none';
        inputElement.classList.remove('input-field__input--valid');
        inputElement.classList.remove('input-field__input--invalid');
      }
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
    },

    setPlaceholder(newPlaceholder) {
      inputElement.placeholder = newPlaceholder;
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createInputField };
}
