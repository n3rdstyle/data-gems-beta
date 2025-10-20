/**
 * Primary Button Component
 * Main action button with gradient background
 */

function createPrimaryButton(options = {}) {
  const {
    label = 'Button',
    onClick = null,
    disabled = false,
    ariaLabel = '',
    variant = 'default' // 'default' or 'neutral'
  } = options;

  // Create button element
  const button = document.createElement('button');
  button.className = 'button-primary';
  button.type = 'button';
  button.textContent = label;
  button.disabled = disabled;

  // Apply variant
  if (variant === 'neutral') {
    button.classList.add('button-primary--neutral');
  }

  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }

  // Add click event
  if (onClick) {
    button.addEventListener('click', onClick);
  }

  // Public API
  return {
    element: button,

    setLabel(newLabel) {
      button.textContent = newLabel;
    },

    getLabel() {
      return button.textContent;
    },

    setDisabled(isDisabled) {
      button.disabled = isDisabled;
    },

    isDisabled() {
      return button.disabled;
    },

    enable() {
      button.disabled = false;
    },

    disable() {
      button.disabled = true;
    },

    click() {
      if (!button.disabled) {
        button.click();
      }
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createPrimaryButton };
}
