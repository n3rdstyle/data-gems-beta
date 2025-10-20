/**
 * Tertiary Button Component
 * Creates a minimal icon button for tertiary actions
 * Requires: icons.js
 */

function createTertiaryButton(options = {}) {
  const {
    icon = 'add',
    onClick = null,
    disabled = false,
    ariaLabel = ''
  } = options;

  // Create button element
  const button = document.createElement('button');
  button.className = 'button-tertiary';
  button.type = 'button';
  button.disabled = disabled;

  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }

  // Create icon container
  const iconContainer = document.createElement('span');
  iconContainer.className = 'button-tertiary__icon';

  // Get icon SVG from global icon system
  const iconSvg = getIcon(icon);
  iconContainer.innerHTML = iconSvg;

  button.appendChild(iconContainer);

  // Add click event
  if (onClick) {
    button.addEventListener('click', onClick);
  }

  // Public API
  return {
    element: button,

    setIcon(newIcon) {
      const svg = getIcon(newIcon);
      iconContainer.innerHTML = svg;
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
