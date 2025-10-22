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
  const calibration = createCalibration({ progress: 0 });
  calibrationWrapper.appendChild(calibration.element);

  // Function to update calibration based on card count
  const updateCalibrationFromCards = () => {
    const dataList = contentPreferences.getDataList();
    const cardCount = dataList.getCards().length;
    const progress = Math.min(cardCount, 100); // 1 card = 1%

    calibration.animateTo(progress, 500);

    // Hide calibration when 100 is reached
    if (progress >= 100) {
      calibrationWrapper.style.display = 'none';
    } else {
      calibrationWrapper.style.display = '';
    }
  };

  // Create content preferences
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'main-screen__content';
  const contentPreferences = createContentPreferences({
    title: preferencesTitle,
    data: preferencesData.length > 0 ? preferencesData : [
      { name: 'Preference Data 1', state: 'default' },
      { name: 'Preference Data 2', state: 'default' },
      { name: 'Preference Data 3', state: 'favorited' },
      { name: 'Preference Data 4', state: 'hidden' },
      { name: 'Preference Data 5', state: 'default' },
      { name: 'Preference Data 6', state: 'default' },
      { name: 'Preference Data 7', state: 'default' },
      { name: 'Preference Data 8', state: 'default' },
      { name: 'Preference Data 9', state: 'default' },
      { name: 'Preference Data 10', state: 'default' },
      { name: 'Preference Data 11', state: 'default' },
      { name: 'Preference Data 12', state: 'default' },
      { name: 'Preference Data 13', state: 'favorited' },
      { name: 'Preference Data 14', state: 'default' },
      { name: 'Preference Data 15', state: 'default' },
      { name: 'Preference Data 16', state: 'default' },
      { name: 'Preference Data 17', state: 'default' },
      { name: 'Preference Data 18', state: 'default' },
      { name: 'Preference Data 19', state: 'hidden' },
      { name: 'Preference Data 20', state: 'default' },
      { name: 'Preference Data 21', state: 'default' },
      { name: 'Preference Data 22', state: 'default' },
      { name: 'Preference Data 23', state: 'default' },
      { name: 'Preference Data 24', state: 'favorited' },
      { name: 'Preference Data 25', state: 'default' },
      { name: 'Preference Data 26', state: 'default' },
      { name: 'Preference Data 27', state: 'default' },
      { name: 'Preference Data 28', state: 'default' },
      { name: 'Preference Data 29', state: 'default' },
      { name: 'Preference Data 30', state: 'default' },
      { name: 'Preference Data 31', state: 'default' },
      { name: 'Preference Data 32', state: 'default' },
      { name: 'Preference Data 33', state: 'default' },
      { name: 'Preference Data 34', state: 'hidden' },
      { name: 'Preference Data 35', state: 'default' },
      { name: 'Preference Data 36', state: 'default' },
      { name: 'Preference Data 37', state: 'default' },
      { name: 'Preference Data 38', state: 'favorited' },
      { name: 'Preference Data 39', state: 'default' },
      { name: 'Preference Data 40', state: 'default' },
      { name: 'Preference Data 41', state: 'default' },
      { name: 'Preference Data 42', state: 'default' },
      { name: 'Preference Data 43', state: 'default' },
      { name: 'Preference Data 44', state: 'default' },
      { name: 'Preference Data 45', state: 'default' },
      { name: 'Preference Data 46', state: 'default' },
      { name: 'Preference Data 47', state: 'default' },
      { name: 'Preference Data 48', state: 'default' },
      { name: 'Preference Data 49', state: 'default' },
      { name: 'Preference Data 50', state: 'default' },
      { name: 'Preference Data 51', state: 'default' },
      { name: 'Preference Data 52', state: 'favorited' },
      { name: 'Preference Data 53', state: 'default' },
      { name: 'Preference Data 54', state: 'default' },
      { name: 'Preference Data 55', state: 'default' },
      { name: 'Preference Data 56', state: 'default' },
      { name: 'Preference Data 57', state: 'default' },
      { name: 'Preference Data 58', state: 'hidden' },
      { name: 'Preference Data 59', state: 'default' },
      { name: 'Preference Data 60', state: 'default' },
      { name: 'Preference Data 61', state: 'default' },
      { name: 'Preference Data 62', state: 'default' },
      { name: 'Preference Data 63', state: 'default' },
      { name: 'Preference Data 64', state: 'default' },
      { name: 'Preference Data 65', state: 'favorited' },
      { name: 'Preference Data 66', state: 'default' },
      { name: 'Preference Data 67', state: 'default' },
      { name: 'Preference Data 68', state: 'default' },
      { name: 'Preference Data 69', state: 'default' },
      { name: 'Preference Data 70', state: 'default' },
      { name: 'Preference Data 71', state: 'default' },
      { name: 'Preference Data 72', state: 'default' },
      { name: 'Preference Data 73', state: 'default' },
      { name: 'Preference Data 74', state: 'default' },
      { name: 'Preference Data 75', state: 'default' },
      { name: 'Preference Data 76', state: 'default' },
      { name: 'Preference Data 77', state: 'hidden' },
      { name: 'Preference Data 78', state: 'default' },
      { name: 'Preference Data 79', state: 'default' },
      { name: 'Preference Data 80', state: 'favorited' },
      { name: 'Preference Data 81', state: 'default' },
      { name: 'Preference Data 82', state: 'default' },
      { name: 'Preference Data 83', state: 'default' },
      { name: 'Preference Data 84', state: 'default' },
      { name: 'Preference Data 85', state: 'default' },
      { name: 'Preference Data 86', state: 'default' },
      { name: 'Preference Data 87', state: 'default' },
      { name: 'Preference Data 88', state: 'default' },
      { name: 'Preference Data 89', state: 'default' },
      { name: 'Preference Data 90', state: 'default' },
      { name: 'Preference Data 91', state: 'default' },
      { name: 'Preference Data 92', state: 'default' },
      { name: 'Preference Data 93', state: 'default' },
      { name: 'Preference Data 94', state: 'default' },
      { name: 'Preference Data 95', state: 'default' },
      { name: 'Preference Data 96', state: 'default' },
      { name: 'Preference Data 97', state: 'default' }
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

          // Update calibration based on card count
          updateCalibrationFromCards();

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
          // Remove the card
          const dataList = contentPreferences.getDataList();
          dataList.removeCard(card);

          // Update tag counts
          contentPreferences.updateTagCounts();

          // Update calibration
          updateCalibrationFromCards();

          modal.hide();
        }
      });
      modal.show(container);
    }
  });
  contentWrapper.appendChild(contentPreferences.element);

  // Initialize calibration with current card count
  updateCalibrationFromCards();

  // Define questions for Random Question button with associated tags
  const randomQuestions = [
    { question: 'What is your favorite food?', tag: 'Nutrition' },
    { question: 'Where is your next travel destination?', tag: 'Travel' },
    { question: 'Coffee or tea?', tag: 'Nutrition' },
    { question: 'Do you play soccer?', tag: 'Sports' },
    { question: 'Which phone do you have?', tag: 'Technology' }
  ];

  let currentQuestionIndex = 0;

  // Create Preference Options component
  const preferenceOptions = createPreferenceOptions({
    randomQuestionLabel: randomQuestions[0].question, // Start with first question
    buttons: preferenceOptionsButtons.length > 0 ? preferenceOptionsButtons : [
      {
        label: 'Add new preference',
        showModal: false, // Don't show the random question modal
        onClick: () => {
          // Empty - handled in onButtonClick
        }
      }
    ],
    onButtonClick: (label) => {
      // Handle Add new preference separately
      if (label === 'Add new preference') {
        // Close the preference options overlay
        preferenceOptions.hide();

        // Get all existing tags from all cards
        const allCards = contentPreferences.getDataList().getCards();
        const existingTags = [...new Set(allCards.flatMap(c => c.getCollections()))];

        // Open empty Data Editor Modal
        const modal = createDataEditorModal({
            title: 'Add Preference',
            preferenceTitle: 'Preference',
            preferenceText: '',
            preferenceHidden: false,
            preferenceFavorited: false,
            collections: [],
            existingTags: existingTags,
            onSave: (data) => {
              // Only add card if text is not empty
              if (data.text && data.text.trim()) {
                // Determine state based on flags
                let state = 'default';
                if (data.favorited) {
                  state = 'favorited';
                } else if (data.hidden) {
                  state = 'hidden';
                }

                // Add new card to the top of the list (prepend)
                const dataList = contentPreferences.getDataList();
                const newCard = dataList.addCard(data.text, state, data.collections);

                // Move card to the top
                dataList.element.insertBefore(newCard.element, dataList.element.firstChild);

                // Update tag counts
                contentPreferences.updateTagCounts();

                // Update calibration
                updateCalibrationFromCards();
              }

              modal.hide();
            },
            onDelete: () => {
              modal.hide();
            }
          });
          modal.show(screenElement);
      }
    },
    onToggle: onPreferenceOptionsToggle,
    onRandomQuestionClick: () => {
      // Get the current question object
      const questionObj = randomQuestions[currentQuestionIndex];

      // Show modal with the question text
      preferenceOptions.showModal(questionObj.question);
    },
    onModalSend: (answer, question) => {
      // When user sends an answer, create a new preference card
      if (answer && answer.trim()) {
        // Find the question object to get the associated tag
        const questionObj = randomQuestions[currentQuestionIndex];

        // Format: "Question: Answer"
        const cardText = `${question}\n${answer}`;

        // Add new card to the top of the list with the associated tag
        const dataList = contentPreferences.getDataList();
        const newCard = dataList.addCard(cardText, 'default', [questionObj.tag]);

        // Move card to the top
        dataList.element.insertBefore(newCard.element, dataList.element.firstChild);

        // Update tag counts
        contentPreferences.updateTagCounts();

        // Update calibration
        updateCalibrationFromCards();

        // Move to next question (cycle back to 0 after last question)
        currentQuestionIndex = (currentQuestionIndex + 1) % randomQuestions.length;

        // Update button label to show next question
        preferenceOptions.setRandomQuestionLabel(randomQuestions[currentQuestionIndex].question);
      }
    }
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

    updateCalibrationFromCards() {
      updateCalibrationFromCards();
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
