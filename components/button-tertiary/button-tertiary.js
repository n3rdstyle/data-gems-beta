/**
 * Tertiary Button Component
 * Creates a minimal button for tertiary actions
 * Supports both icon and text variants
 *
 * Icon variant sizes:
 * - default: 40x40px with 24px icon
 * - small: 24x24px with 16px icon
 *
 * Text variant sizes:
 * - large: 48px height
 * - medium: 40px height (default)
 * - small: 32px height
 *
 * Background variants:
 * - transparent: Default transparent background with hover effect (default)
 * - filled: Permanent neutral-80 background with white icon/text
 *
 * Requires: icons.js (for icon variant)
 */

function createTertiaryButton(options = {}) {
  const {
    icon = null,
    text = null,
    size = 'medium', // For icon: 'default' or 'small' | For text: 'large', 'medium', or 'small'
    filled = false, // Whether to fill the icon
    background = 'transparent', // 'transparent' or 'filled' (neutral-80 background)
    onClick = null,
    disabled = false,
    ariaLabel = ''
  } = options;

  // Determine variant: text takes precedence over icon
  const variant = text ? 'text' : 'icon';

  // Create button element
  const button = document.createElement('button');
  button.className = 'button-tertiary';

  // Apply variant class
  if (variant === 'text') {
    button.classList.add('button-tertiary--text');
  }

  // Apply background class
  if (background === 'filled') {
    button.classList.add('button-tertiary--filled');
  }

  // Apply size class
  if (variant === 'icon') {
    // Icon variant: 'default' or 'small'
    if (size === 'small') {
      button.classList.add('button-tertiary--small');
    }
  } else {
    // Text variant: 'large', 'medium', or 'small'
    if (size === 'large') {
      button.classList.add('button-tertiary--large');
    } else if (size === 'small') {
      button.classList.add('button-tertiary--small');
    } else {
      button.classList.add('button-tertiary--medium');
    }
  }

  button.type = 'button';
  button.disabled = disabled;

  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }

  let contentContainer;

  if (variant === 'text') {
    // Create text container
    contentContainer = document.createElement('span');
    contentContainer.className = 'button-tertiary__text text-style-body-medium';
    contentContainer.textContent = text;
    button.appendChild(contentContainer);
  } else {
    // Create icon container
    contentContainer = document.createElement('span');
    contentContainer.className = 'button-tertiary__icon';

    // Get icon SVG from global icon system
    // If filled, use the filled version of the icon
    const iconName = filled ? `${icon}Filled` : icon;
    const iconSvg = getIcon(iconName || 'add');

    contentContainer.innerHTML = iconSvg;
    button.appendChild(contentContainer);
  }

  // Add click event
  if (onClick) {
    button.addEventListener('click', onClick);
  }

  // Public API
  return {
    element: button,
    variant,

    setIcon(newIcon) {
      if (variant === 'icon') {
        const svg = getIcon(newIcon);
        contentContainer.innerHTML = svg;
      }
    },

    setText(newText) {
      if (variant === 'text') {
        contentContainer.textContent = newText;
      }
    },

    setDisabled(isDisabled) {
      button.disabled = isDisabled;
    },

    isDisabled() {
      return button.disabled;
    },

    toggleCollapsed() {
      button.classList.toggle('collapsed');
    },

    setCollapsed(collapsed) {
      if (collapsed) {
        button.classList.add('collapsed');
      } else {
        button.classList.remove('collapsed');
      }
    },

    isCollapsed() {
      return button.classList.contains('collapsed');
    },

    onClick: null
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createTertiaryButton };
}
