/**
 * Main Screen
 * Complete screen combining header, calibration, and content preferences
 * Requires: header.js, calibration.js, content-preferences.js, preference-options.js
 */

function createMainScreen(options = {}) {
  const {
    profileName = 'Dennis',
    profileSubtitle = 'Founder',
    preferencesTitle = 'My Preferences',
    preferencesData = [],
    preferenceOptionsButtons = [],
    onProfileClick = null,
    onMenuButtonClick = null,
    onRandomQuestionClick = null,
    onPreferenceOptionClick = null,
    onPreferenceOptionsToggle = null
  } = options;

  // Create main screen container
  const screenElement = document.createElement('div');
  screenElement.className = 'main-screen';

  // Create header
  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'main-screen__header';
  const header = createHeader({
    profile: {
      name: profileName,
      subtitle: profileSubtitle,
      onClick: onProfileClick || (() => console.log('Profile clicked'))
    },
    menuButtons: [
      { icon: 'message', ariaLabel: 'Messages', onClick: () => console.log('Messages') },
      { icon: 'settings', ariaLabel: 'Settings', onClick: () => console.log('Settings') },
      { icon: 'arrowUpRight', ariaLabel: 'Share', onClick: () => console.log('Share') }
    ],
    onMenuButtonClick
  });
  headerWrapper.appendChild(header.element);

  // Create calibration
  const calibrationWrapper = document.createElement('div');
  calibrationWrapper.className = 'main-screen__calibration';
  const calibration = createCalibration({ progress: 2 });
  calibrationWrapper.appendChild(calibration.element);

  // Create content preferences
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'main-screen__content';
  const contentPreferences = createContentPreferences({
    title: preferencesTitle,
    data: preferencesData.length > 0 ? preferencesData : [
      { name: 'Preference Data', state: 'default' },
      { name: 'Preference Data', state: 'default' },
      { name: 'Preference Data', state: 'favorited' },
      { name: 'Preference Data', state: 'hidden' },
      { name: 'Preference Data', state: 'default' },
      { name: 'Preference Data', state: 'default' },
      { name: 'Preference Data', state: 'default' }
    ],
    modalContainer: screenElement,
    onCardClick: (card, container) => {
      // Create and show modal when card is clicked
      const modal = createDataEditorModal({
        title: 'Edit Preference',
        preferenceTitle: 'Preference',
        preferenceText: card.getData(),
        preferenceHidden: card.getState() === 'hidden',
        preferenceFavorited: card.getState() === 'favorited',
        collections: ['Example', 'Demo'],
        onSave: (data) => {
          card.setData(data.text);
          modal.hide();
        },
        onDelete: () => {
          modal.hide();
        },
        onToggleHidden: (hidden) => {
          card.setState(hidden ? 'hidden' : 'default');
        },
        onToggleFavorite: (favorited) => {
          card.setState(favorited ? 'favorited' : 'default');
        },
        onAddCollection: () => {
          const newCollection = prompt('Enter collection name:');
          if (newCollection) {
            modal.addCollection(newCollection);
          }
        }
      });
      modal.show(container);
    }
  });
  contentWrapper.appendChild(contentPreferences.element);

  // Create Preference Options component
  const preferenceOptions = createPreferenceOptions({
    buttons: preferenceOptionsButtons.length > 0 ? preferenceOptionsButtons : [
      { label: 'Add new preference', onClick: (label) => console.log('Clicked:', label) },
      { label: 'Play \'the Answer\' game', onClick: (label) => console.log('Clicked:', label) },
      { label: 'Finish onboarding questions', onClick: (label) => console.log('Clicked:', label) }
    ],
    onButtonClick: onPreferenceOptionClick,
    onToggle: onPreferenceOptionsToggle
  });

  // Assemble screen
  screenElement.appendChild(headerWrapper);
  screenElement.appendChild(calibrationWrapper);
  screenElement.appendChild(contentWrapper);
  screenElement.appendChild(preferenceOptions.element);

  // Public API
  return {
    element: screenElement,

    getHeader() {
      return header;
    },

    getCalibration() {
      return calibration;
    },

    getContentPreferences() {
      return contentPreferences;
    },

    getPreferenceOptions() {
      return preferenceOptions;
    },

    updateCalibration(progress) {
      calibration.setProgress(progress);
    },

    animateCalibration(progress, duration) {
      calibration.animateTo(progress, duration);
    },

    showPreferenceOptions() {
      preferenceOptions.show();
    },

    hidePreferenceOptions() {
      preferenceOptions.hide();
    },

    togglePreferenceOptions() {
      preferenceOptions.toggle();
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createMainScreen };
}
