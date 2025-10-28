/**
 * Primary Button Component
 * Main action button with gradient background
 * Variants:
 * - default: Sundown gradient, 32px border radius
 * - neutral: Dark gray for use on gradient backgrounds
 * - dark: Primary dark blue
 * - v2: Compact version with 8px border radius, dark blue background (for modals)
 *
 * Sizes:
 * - large: 48px height (for prominent CTAs)
 * - medium: 40px height (default)
 * - small: 32px height (for compact interfaces)
 */

function createPrimaryButton(options = {}) {
  const {
    label = 'Button',
    icon = null,
    onClick = null,
    disabled = false,
    ariaLabel = '',
    variant = 'default', // 'default', 'neutral', 'dark', or 'v2'
    size = 'medium' // 'large', 'medium', or 'small'
  } = options;

  // Create button element
  const button = document.createElement('button');
  button.type = 'button';
  button.disabled = disabled;

  // Add icon and label if icon is provided
  if (icon) {
    const iconSpan = document.createElement('span');
    iconSpan.className = 'button-primary__icon';
    const iconSvg = getIcon(icon);
    iconSpan.innerHTML = iconSvg;
    button.appendChild(iconSpan);

    const labelSpan = document.createElement('span');
    labelSpan.textContent = label;
    button.appendChild(labelSpan);
  } else {
    button.textContent = label;
  }

  // Apply variant and text-style classes
  if (variant === 'neutral') {
    button.className = 'button-primary button-primary--neutral text-style-body-medium';
  } else if (variant === 'dark') {
    button.className = 'button-primary button-primary--dark text-style-body-medium';
  } else if (variant === 'v2') {
    button.className = 'button-primary button-primary--v2 text-style-body-medium';

    // Apply size for v2 variant (maintains backward compatibility)
    if (size === 'small') {
      button.classList.add('button-primary--small');
      button.classList.remove('text-style-body-medium');
      button.classList.add('text-style-button-small');
    }
  } else {
    button.className = 'button-primary text-style-body-medium';
  }

  // Apply size classes for non-v2 variants
  if (variant !== 'v2') {
    if (size === 'large') {
      button.classList.add('button-primary--large');
    } else if (size === 'small') {
      button.classList.add('button-primary--small');
      button.classList.remove('text-style-body-medium');
      button.classList.add('text-style-button-small');
    } else {
      button.classList.add('button-primary--medium');
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
      if (icon) {
        // If button has icon, update only the label span
        const labelSpan = button.querySelector('span:not(.button-primary__icon)');
        if (labelSpan) {
          labelSpan.textContent = newLabel;
        }
      } else {
        button.textContent = newLabel;
      }
    },

    getLabel() {
      if (icon) {
        const labelSpan = button.querySelector('span:not(.button-primary__icon)');
        return labelSpan ? labelSpan.textContent : '';
      }
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
