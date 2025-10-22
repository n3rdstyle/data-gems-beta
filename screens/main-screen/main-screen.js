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
      // Get all existing tags from all cards
      const allCards = contentPreferences.getDataList().getCards();
      const allCollections = allCards.flatMap(c => c.getCollections());
      const currentCollections = card.getCollections();
      // Combine all collections with current card's collections and remove duplicates
      const existingTags = [...new Set([...allCollections, ...currentCollections])];

      // Create and show modal when card is clicked
      const modal = createDataEditorModal({
        title: 'Edit Preference',
        preferenceTitle: 'Preference',
        preferenceText: card.getData(),
        preferenceHidden: card.getState() === 'hidden',
        preferenceFavorited: card.getState() === 'favorited',
        collections: card.getCollections(),
        existingTags: existingTags,
        onSave: (data) => {
          card.setData(data.text);
          // Update card collections
          card.setCollections(data.collections);

          // Update card state based on hidden/favorited flags
          if (data.favorited) {
            card.setState('favorited');
          } else if (data.hidden) {
            card.setState('hidden');
          } else {
            card.setState('default');
          }

          // Update tag counts
          contentPreferences.updateTagCounts();

          // Reapply active filter if one exists
          const activeFilter = contentPreferences.getActiveFilter();
          if (activeFilter) {
            if (activeFilter.type === 'state') {
              contentPreferences.filterByState(activeFilter.value);
            } else if (activeFilter.type === 'collection') {
              const dataList = contentPreferences.getDataList();
              dataList.filterByCollection(activeFilter.value);
            }
          }

          modal.hide();
        },
        onDelete: () => {
          modal.hide();
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
