/**
 * Tertiary Button Component
 * Creates a minimal button for tertiary actions
 * Supports both icon and text variants
 * Icon sizes: 'default' (40x40px with 24px icon) or 'small' (24x24px with 16px icon)
 * Requires: icons.js (for icon variant)
 */

function createTertiaryButton(options = {}) {
  const {
    icon = null,
    text = null,
    size = 'default', // 'default' or 'small' (only applies to icon variant)
    filled = false, // Whether to fill the icon
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

  // Apply size class (only for icon variant)
  if (variant === 'icon' && size === 'small') {
    button.classList.add('button-tertiary--small');
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
    contentContainer.className = 'button-tertiary__text';
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
