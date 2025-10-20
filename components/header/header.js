/**
 * Header Component
 * Main header combining profile teaser and top menu
 * Requires: profile-teaser.js, top-menu.js
 */

function createHeader(options = {}) {
  const {
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
  headerElement.className = 'header';

  // Create profile teaser
  const profileWrapper = document.createElement('div');
  profileWrapper.className = 'header__profile';

  const profileTeaser = createProfileTeaser({
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

  // Create top menu
  const menuWrapper = document.createElement('div');
  menuWrapper.className = 'header__menu';

  const topMenu = createTopMenu({
    buttons: menuButtons,
    onButtonClick: (button, index, icon) => {
      if (onMenuButtonClick) {
        onMenuButtonClick(button, index, icon);
      }
    }
  });

  menuWrapper.appendChild(topMenu.element);

  // Assemble header
  headerElement.appendChild(profileWrapper);
  headerElement.appendChild(menuWrapper);

  // Public API
  return {
    element: headerElement,

    getProfile() {
      return profileTeaser;
    },

    getMenu() {
      return topMenu;
    },

    updateProfile(updates) {
      if (updates.name !== undefined) {
        profileTeaser.setName(updates.name);
      }
      if (updates.subtitle !== undefined) {
        profileTeaser.setSubtitle(updates.subtitle);
      }
      if (updates.avatarImage !== undefined) {
        profileTeaser.setAvatarImage(updates.avatarImage);
      }
    },

    addMenuButton(buttonConfig) {
      return topMenu.addButton(buttonConfig);
    },

    removeMenuButton(index) {
      topMenu.removeButton(index);
    },

    getMenuButtons() {
      return topMenu.getButtons();
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createHeader };
}
