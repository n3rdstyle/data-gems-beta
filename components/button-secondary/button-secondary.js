/**
 * Secondary Button Component
 * Outlined button with stroke for secondary actions
 * Variants:
 * - default: Primary color border with transparent background
 * - neutral: Neutral color border for use on colored backgrounds
 * - light: Light border for use on dark backgrounds
 * - v2: Compact version with fixed height (for modals)
 *
 * Sizes:
 * - large: 48px height (for prominent CTAs)
 * - medium: 40px height (default)
 * - small: 32px height (for compact interfaces)
 */

function createSecondaryButton(options = {}) {
  const {
    label = 'Button',
    onClick = null,
    disabled = false,
    ariaLabel = '',
    variant = 'default', // 'default', 'neutral', 'light', or 'v2'
    size = 'medium' // 'large', 'medium', or 'small'
  } = options;

  // Create button element
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.disabled = disabled;

  // Apply variant and text-style classes
  if (variant === 'neutral') {
    button.className = 'button-secondary button-secondary--neutral text-style-body-medium';
  } else if (variant === 'light') {
    button.className = 'button-secondary button-secondary--light text-style-body-medium';
  } else if (variant === 'v2') {
    button.className = 'button-secondary button-secondary--v2 text-style-body-medium';

    // Apply size for v2 variant (maintains backward compatibility)
    if (size === 'small') {
      button.classList.add('button-secondary--small');
      button.classList.remove('text-style-body-medium');
      button.classList.add('text-style-button-small');
    }
  } else {
    button.className = 'button-secondary text-style-body-medium';
  }

  // Apply size classes for non-v2 variants
  if (variant !== 'v2') {
    if (size === 'large') {
      button.classList.add('button-secondary--large');
    } else if (size === 'small') {
      button.classList.add('button-secondary--small');
      button.classList.remove('text-style-body-medium');
      button.classList.add('text-style-button-small');
    } else {
      button.classList.add('button-secondary--medium');
    }
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
  module.exports = { createSecondaryButton };
}
