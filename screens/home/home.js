/**
 * Home
 * Complete screen combining header, calibration, and content preferences
 * Requires: header.js, calibration.js, content-preferences.js, preference-options.js
 */

function createHome(options = {}) {
  const {
    profileName = 'Dennis',
    profileSubtitle = '',
    profileDescription = '',
    avatarImage = null,
    email = '',
    age = '',
    gender = '',
    location = '',
    languages = [],
    preferencesTitle = 'My Preferences',
    preferencesData = [],
    preferenceOptionsButtons = [],
    onProfileClick = null,
    onProfileSave = null,
    getProfileData = null, // New: function to get current profile data
    onMenuButtonClick = null,
    onRandomQuestionClick = null,
    onPreferenceOptionClick = null,
    onPreferenceOptionsToggle = null,
    onPreferenceAdd = null,
    onPreferenceUpdate = null,
    onPreferenceDelete = null,
    onRandomQuestionUsed = null, // Callback when a random question is used
    usedRandomQuestions = [], // Array of already used question texts
    onBackupData = null,
    onUpdateData = null,
    onClearData = null,
    onThirdPartyData = null,
    onDescriptionToggle = null,
    onPersonalInfoToggle = null
  } = options;

  // Create home container
  const screenElement = document.createElement('div');
  screenElement.className = 'home';

  // Create modals (hidden by default)
  let profileModal = null;
  let profileOverlay = null;
  let messagesModal = null;
  let messagesOverlay = null;
  let settingsScreen = null;

  const openProfile = () => {
    // Create overlay
    profileOverlay = createOverlay({
      opacity: 0.5
    });

    // Get current profile data (if callback provided, otherwise use initial values)
    let currentProfileData = {
      profileName: profileName,
      profileSubtitle: profileSubtitle,
      profileDescription: profileDescription,
      email: email,
      age: age,
      gender: gender,
      location: location,
      languages: languages
    };

    if (getProfileData) {
      currentProfileData = getProfileData();
    }

    // Create profile screen with current data
    profileModal = createProfile({
      profileName: currentProfileData.profileName || currentProfileData.name,
      profileSubtitle: currentProfileData.profileSubtitle || currentProfileData.subtitle,
      profileDescription: currentProfileData.profileDescription || currentProfileData.description,
      descriptionState: currentProfileData.descriptionState,
      avatarImage: currentProfileData.avatarImage,
      email: currentProfileData.email,
      age: currentProfileData.age,
      gender: currentProfileData.gender,
      location: currentProfileData.location,
      languages: currentProfileData.languages,
      personalInfoState: currentProfileData.emailState || currentProfileData.ageState || currentProfileData.genderState || currentProfileData.locationState,
      onClose: closeProfile,
      onSave: onProfileSave,
      onDescriptionToggle: onDescriptionToggle,
      onPersonalInfoToggle: onPersonalInfoToggle
    });

    // Position profile screen centered
    profileModal.element.style.position = 'absolute';
    profileModal.element.style.top = '50%';
    profileModal.element.style.left = '50%';
    profileModal.element.style.transform = 'translate(-50%, -50%)';
    profileModal.element.style.zIndex = '1001';

    screenElement.appendChild(profileOverlay.element);
    screenElement.appendChild(profileModal.element);
    profileOverlay.show();
  };

  const closeProfile = () => {
    if (profileOverlay) {
      profileOverlay.hide();
      setTimeout(() => {
        if (profileModal) {
          profileModal.element.remove();
          profileModal = null;
        }
        if (profileOverlay) {
          profileOverlay.element.remove();
          profileOverlay = null;
        }
      }, 300);
    }
  };

  const openMessages = () => {
    // Create overlay
    messagesOverlay = createOverlay({
      opacity: 0.5
    });

    // Create messages modal
    messagesModal = createMessagesModal({
      messages: [
        { id: 1, title: 'Message #1', preview: 'Lorem Ipsum Dolor ...' },
        { id: 2, title: 'Message #2', preview: 'Lorem Ipsum Dolor ...' },
        { id: 3, title: 'Message #3', preview: 'Lorem Ipsum Dolor ...' },
        { id: 4, title: 'Message #4', preview: 'Lorem Ipsum Dolor ...' },
        { id: 5, title: 'Message #5', preview: 'Lorem Ipsum Dolor ...' }
      ],
      onClose: closeMessages,
      onMessageClick: (message) => console.log('Message clicked:', message)
    });

    // Append modal inside overlay (not as sibling)
    messagesOverlay.element.appendChild(messagesModal.element);
    screenElement.appendChild(messagesOverlay.element);
    messagesOverlay.show();
  };

  const closeMessages = () => {
    if (messagesOverlay) {
      messagesOverlay.hide();
      setTimeout(() => {
        if (messagesModal) {
          messagesModal.element.remove();
          messagesModal = null;
        }
        if (messagesOverlay) {
          messagesOverlay.element.remove();
          messagesOverlay = null;
        }
      }, 300);
    }
  };

  const openSettings = () => {
    // Hide home screen
    screenElement.style.display = 'none';

    // Create settings screen
    settingsScreen = createSettings({
      onClose: closeSettings,
      onBackupData: onBackupData,
      onUpdateData: onUpdateData,
      onClearData: onClearData,
      onThirdPartyData: onThirdPartyData
    });

    // Add settings screen to parent
    screenElement.parentElement.appendChild(settingsScreen.element);
  };

  const closeSettings = () => {
    if (settingsScreen) {
      settingsScreen.element.remove();
      settingsScreen = null;
    }
    // Show home screen again
    screenElement.style.display = '';
  };

  // Create header
  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'home__header';
  const header = createHeader({
    profile: {
      name: profileName,
      subtitle: profileSubtitle,
      avatarImage: avatarImage,
      onClick: openProfile
    },
    menuButtons: [
      { icon: 'settings', ariaLabel: 'Settings', onClick: openSettings }
    ],
    onMenuButtonClick
  });
  headerWrapper.appendChild(header.element);

  // Create calibration
  const calibrationWrapper = document.createElement('div');
  calibrationWrapper.className = 'home__calibration';
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

  // Store reference to preference options (created later)
  let preferenceOptions = null;

  // Create content preferences
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'home__content';
  const contentPreferences = createContentPreferences({
    title: preferencesTitle,
    data: preferencesData, // Use real data from HSP protocol (empty array on first install)
    modalContainer: screenElement,
    onSearchStateChange: (isActive) => {
      // Show/hide preference options based on search state
      if (preferenceOptions) {
        if (isActive) {
          preferenceOptions.element.style.display = 'none';
        } else {
          preferenceOptions.element.style.display = '';
        }
      }
    },
    onCardStateChange: (card, state) => {
      // Persist state changes from hover icon buttons
      if (onPreferenceUpdate) {
        const cardId = card.getId();
        onPreferenceUpdate(cardId, {
          state: state
        });
      }
    },
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
          // Determine new state
          let newState = 'default';
          if (data.favorited) {
            newState = 'favorited';
          } else if (data.hidden) {
            newState = 'hidden';
          }

          // Save to HSP protocol storage
          if (onPreferenceUpdate) {
            const cardId = card.getId();
            onPreferenceUpdate(cardId, {
              value: data.text,
              state: newState,
              collections: data.collections
            });
            // Close modal after save
            modal.hide();
          } else {
            // Fallback: Update UI only (not persistent)
            card.setData(data.text);
            card.setCollections(data.collections);
            card.setState(newState);

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
          }
        },
        onDelete: () => {
          // Save to HSP protocol storage
          if (onPreferenceDelete) {
            const cardId = card.getId();
            onPreferenceDelete(cardId);
          } else {
            // Fallback: Remove from UI only (not persistent)
            const dataList = contentPreferences.getDataList();
            dataList.removeCard(card);

            // Update tag counts
            contentPreferences.updateTagCounts();

            // Update calibration
            updateCalibrationFromCards();

            modal.hide();
          }
        }
      });
      modal.show(container);
    }
  });
  contentWrapper.appendChild(contentPreferences.element);

  // Add scroll listener to hide preference options when scrolling
  contentWrapper.addEventListener('scroll', () => {
    // Hide preference options when scrolling
    if (preferenceOptions && preferenceOptions.isOpen()) {
      preferenceOptions.hide();
    }
  });

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

  // Track which questions have been used
  let usedQuestions = randomQuestions.filter(q => usedRandomQuestions.includes(q.question));
  let availableQuestions = randomQuestions.filter(q => !usedRandomQuestions.includes(q.question));

  // Create Preference Options component
  preferenceOptions = createPreferenceOptions({
    randomQuestionLabel: availableQuestions.length > 0 ? availableQuestions[0].question : 'New questions soon',
    randomQuestionDisabled: availableQuestions.length === 0,
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

                // Save to HSP protocol storage
                if (onPreferenceAdd) {
                  onPreferenceAdd(data.text, state, data.collections);
                  // Note: renderCurrentScreen() in app.js will rebuild the UI
                } else {
                  // Fallback: Add to UI only (not persistent)
                  const dataList = contentPreferences.getDataList();
                  const newCard = dataList.addCard(data.text, state, data.collections);

                  // Move card to the top
                  dataList.element.insertBefore(newCard.element, dataList.element.firstChild);

                  // Update tag counts
                  contentPreferences.updateTagCounts();

                  // Update calibration
                  updateCalibrationFromCards();
                }
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
      // Check if there are available questions
      if (availableQuestions.length === 0) {
        return; // Button should be disabled, but double-check
      }

      // Get the first available question
      const questionObj = availableQuestions[0];

      // Show modal with the question text
      preferenceOptions.showModal(questionObj.question);
    },
    onModalSend: (answer, question) => {
      // When user sends an answer, create a new preference card
      if (answer && answer.trim()) {
        // Get the current question object (first in available list)
        const questionObj = availableQuestions[0];

        // Format: "Question: Answer"
        const cardText = `${question}\n${answer}`;

        // Save to HSP protocol storage
        if (onPreferenceAdd) {
          onPreferenceAdd(cardText, 'default', [questionObj.tag]);
          // Note: renderCurrentScreen() in app.js will rebuild the UI
        } else {
          // Fallback: Add to UI only (not persistent)
          const dataList = contentPreferences.getDataList();
          const newCard = dataList.addCard(cardText, 'default', [questionObj.tag]);

          // Move card to the top
          dataList.element.insertBefore(newCard.element, dataList.element.firstChild);

          // Update tag counts
          contentPreferences.updateTagCounts();

          // Update calibration
          updateCalibrationFromCards();
        }

        // Mark this question as used
        const usedQuestion = availableQuestions.shift();
        usedQuestions.push(usedQuestion);

        // Save used questions to AppState via callback
        if (onRandomQuestionUsed) {
          onRandomQuestionUsed(usedQuestion.question);
        }

        // Update button label and state
        if (availableQuestions.length > 0) {
          // Show next available question
          preferenceOptions.setRandomQuestionLabel(availableQuestions[0].question);
        } else {
          // All questions used - disable button
          preferenceOptions.setRandomQuestionLabel('New questions soon');
          preferenceOptions.setRandomQuestionDisabled(true);
        }
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

    updateHeaderProfile(profileData) {
      // Update the profile teaser in the header
      if (header && header.updateProfile) {
        header.updateProfile(profileData);
      }
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
  module.exports = { createHome };
}
