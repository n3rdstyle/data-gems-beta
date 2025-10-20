/**
 * Top Menu Component
 * Horizontal menu bar with tertiary action buttons
 * Requires: button-tertiary.js, icons.js
 */

function createTopMenu(options = {}) {
  const {
    buttons = [
      { icon: 'message', ariaLabel: 'Messages', onClick: null },
      { icon: 'settings', ariaLabel: 'Settings', onClick: null },
      { icon: 'arrowUpRight', ariaLabel: 'Share', onClick: null }
    ],
    onButtonClick = null
  } = options;

  // Create top menu container
  const topMenuElement = document.createElement('div');
  topMenuElement.className = 'top-menu';

  // Store button instances
  const buttonInstances = [];

  // Create buttons
  buttons.forEach((buttonConfig, index) => {
    const button = createTertiaryButton({
      icon: buttonConfig.icon || 'settings',
      ariaLabel: buttonConfig.ariaLabel || '',
      onClick: () => {
        // Call button-specific handler
        if (buttonConfig.onClick) {
          buttonConfig.onClick(button, index);
        }
        // Call global handler
        if (onButtonClick) {
          onButtonClick(button, index, buttonConfig.icon);
        }
      }
    });

    button.element.classList.add('top-menu__button');
    topMenuElement.appendChild(button.element);
    buttonInstances.push(button);
  });

  // Public API
  return {
    element: topMenuElement,

    getButtons() {
      return buttonInstances;
    },

    getButton(index) {
      return buttonInstances[index];
    },

    addButton(buttonConfig) {
      const index = buttonInstances.length;
      const button = createTertiaryButton({
        icon: buttonConfig.icon || 'settings',
        ariaLabel: buttonConfig.ariaLabel || '',
        onClick: () => {
          if (buttonConfig.onClick) {
            buttonConfig.onClick(button, index);
          }
          if (onButtonClick) {
            onButtonClick(button, index, buttonConfig.icon);
          }
        }
      });

      button.element.classList.add('top-menu__button');
      topMenuElement.appendChild(button.element);
      buttonInstances.push(button);
      return button;
    },

    removeButton(index) {
      if (index >= 0 && index < buttonInstances.length) {
        const button = buttonInstances[index];
        button.element.remove();
        buttonInstances.splice(index, 1);
      }
    },

    clear() {
      buttonInstances.forEach(button => button.element.remove());
      buttonInstances.length = 0;
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createTopMenu };
}
