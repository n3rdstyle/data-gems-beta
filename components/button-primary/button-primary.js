/**
 * Primary Button Component
 * Main action button with gradient background
 * Variants:
 * - default: Sundown gradient, 32px border radius
 * - neutral: Dark gray for use on gradient backgrounds
 * - dark: Primary dark blue
 * - v2: Compact version with 8px border radius, dark blue background (for modals)
 */

function createPrimaryButton(options = {}) {
  const {
    label = 'Button',
    onClick = null,
    disabled = false,
    ariaLabel = '',
    variant = 'default', // 'default', 'neutral', 'dark', or 'v2'
    size = 'default' // 'default' or 'small' (only applies to v2 variant)
  } = options;

  // Create button element
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.disabled = disabled;

  // Apply variant and text-style classes
  if (variant === 'neutral') {
    button.className = 'button-primary button-primary--neutral text-style-body-medium';
  } else if (variant === 'dark') {
    button.className = 'button-primary button-primary--dark text-style-body-medium';
  } else if (variant === 'v2') {
    button.className = 'button-primary button-primary--v2 text-style-body-medium';

    // Apply size for v2 variant
    if (size === 'small') {
      button.classList.add('button-primary--small');
      button.classList.remove('text-style-body-medium');
      button.classList.add('text-style-button-small');
    }
  } else {
    button.className = 'button-primary text-style-body-medium';
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
