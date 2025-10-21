/**
 * Header Component
 * Main header with three variants:
 * 1. Default: Profile teaser + top menu
 * 2. Simple: Title + close button (for settings/modals)
 * 3. Compact: Small title + action icons (for preference cards)
 * Requires: profile-teaser.js, top-menu.js, button-tertiary.js
 */

function createHeader(options = {}) {
  const {
    variant = 'default', // 'default', 'simple', or 'compact'
    title = 'Settings', // For simple/compact variants
    onClose = null, // For simple variant
    closeIcon = 'close', // For simple variant: icon to use for close button
    actionIcons = [], // For compact variant: array of {icon, ariaLabel, onClick, active}
    onIconClick = null, // For compact variant
    profile = {
      name: 'User',
      subtitle: '',
      onClick: null
    },
    menuButtons = [
      { icon: 'message', ariaLabel: 'Messages', onClick: null },
      { icon: 'settings', ariaLabel: 'Settings', onClick: null },
      { icon: 'arrowUpRight', ariaLabel: 'Share', onClick: null }
    ],
    onProfileClick = null,
    onMenuButtonClick = null
  } = options;

  // Create header container
  const headerElement = document.createElement('div');
  const variantClass = variant === 'simple' ? 'header--simple' : variant === 'compact' ? 'header--compact' : '';
  headerElement.className = variantClass ? `header ${variantClass}` : 'header';

  let profileTeaser, topMenu, titleElement, closeButton, iconButtons, iconsContainer;

  if (variant === 'compact') {
    // Compact variant: Small title + small tertiary action buttons
    titleElement = document.createElement('h3');
    titleElement.className = 'header__title-compact';
    titleElement.textContent = title;

    iconsContainer = document.createElement('div');
    iconsContainer.className = 'header__icons';

    iconButtons = [];

    actionIcons.forEach((iconConfig, index) => {
      const button = createTertiaryButton({
        icon: iconConfig.icon,
        size: 'small',
        filled: iconConfig.filled || false,
        ariaLabel: iconConfig.ariaLabel,
        onClick: () => {
          if (iconConfig.onClick) {
            iconConfig.onClick(iconConfig, index);
          }
          if (onIconClick) {
            onIconClick(iconConfig, index);
          }
        }
      });

      iconsContainer.appendChild(button.element);
      iconButtons.push({ element: button.element, button: button, config: iconConfig });
    });

    headerElement.appendChild(titleElement);
    headerElement.appendChild(iconsContainer);
  } else if (variant === 'simple') {
    // Simple variant: Title + close button
    titleElement = document.createElement('h2');
    titleElement.className = 'header__title';
    titleElement.textContent = title;

    closeButton = createTertiaryButton({
      icon: closeIcon,
      ariaLabel: closeIcon === 'trash' ? 'Delete' : 'Close',
      onClick: () => {
        if (onClose) {
          onClose();
        }
      }
    });
    closeButton.element.classList.add('header__close');

    headerElement.appendChild(titleElement);
    headerElement.appendChild(closeButton.element);
  } else {
    // Default variant: Profile teaser + top menu
    const profileWrapper = document.createElement('div');
    profileWrapper.className = 'header__profile';

    profileTeaser = createProfileTeaser({
      name: profile.name,
      subtitle: profile.subtitle,
      avatarImage: profile.avatarImage,
      onClick: () => {
        if (profile.onClick) {
          profile.onClick(profileTeaser);
        }
        if (onProfileClick) {
          onProfileClick(profileTeaser);
        }
      },
      ariaLabel: profile.ariaLabel || `View ${profile.name}'s profile`
    });

    profileWrapper.appendChild(profileTeaser.element);

    const menuWrapper = document.createElement('div');
    menuWrapper.className = 'header__menu';

    topMenu = createTopMenu({
      buttons: menuButtons,
      onButtonClick: (button, index, icon) => {
        if (onMenuButtonClick) {
          onMenuButtonClick(button, index, icon);
        }
      }
    });

    menuWrapper.appendChild(topMenu.element);

    headerElement.appendChild(profileWrapper);
    headerElement.appendChild(menuWrapper);
  }

  // Public API
  const api = {
    element: headerElement,
    variant
  };

  if (variant === 'compact') {
    api.setTitle = (newTitle) => {
      titleElement.textContent = newTitle;
    };
    api.getTitle = () => {
      return titleElement.textContent;
    };
    api.getIconButtons = () => {
      return iconButtons;
    };
    api.getIconButton = (index) => {
      return iconButtons[index];
    };
    api.setActionIcons = (newActionIcons) => {
      // Clear existing icons
      iconsContainer.innerHTML = '';
      iconButtons = [];

      // Create new icons
      newActionIcons.forEach((iconConfig, index) => {
        const button = createTertiaryButton({
          icon: iconConfig.icon,
          size: 'small',
          filled: iconConfig.filled || false,
          ariaLabel: iconConfig.ariaLabel,
          onClick: () => {
            if (iconConfig.onClick) {
              iconConfig.onClick(iconConfig, index);
            }
            if (onIconClick) {
              onIconClick(iconConfig, index);
            }
          }
        });

        iconsContainer.appendChild(button.element);
        iconButtons.push({ element: button.element, button: button, config: iconConfig });
      });
    };
  } else if (variant === 'simple') {
    api.setTitle = (newTitle) => {
      titleElement.textContent = newTitle;
    };
    api.getTitle = () => {
      return titleElement.textContent;
    };
    api.getCloseButton = () => {
      return closeButton;
    };
  } else {
    api.getProfile = () => {
      return profileTeaser;
    };
    api.getMenu = () => {
      return topMenu;
    };
    api.updateProfile = (updates) => {
      if (updates.name !== undefined) {
        profileTeaser.setName(updates.name);
      }
      if (updates.subtitle !== undefined) {
        profileTeaser.setSubtitle(updates.subtitle);
      }
      if (updates.avatarImage !== undefined) {
        profileTeaser.setAvatarImage(updates.avatarImage);
      }
    };
    api.addMenuButton = (buttonConfig) => {
      return topMenu.addButton(buttonConfig);
    };
    api.removeMenuButton = (index) => {
      topMenu.removeButton(index);
    };
    api.getMenuButtons = () => {
      return topMenu.getButtons();
    };
  }

  return api;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createHeader };
}
