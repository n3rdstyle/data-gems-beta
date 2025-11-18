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
    onPersonalInfoToggle = null,
    getAutoInjectEnabled = null, // Changed to getter function
    onAutoInjectToggle = null,
    getAutoBackupEnabled = null, // Changed to getter function
    onAutoBackupToggle = null,
    getAutoCategorizeEnabled = null, // Getter function for auto-categorize setting
    onAutoCategorizeToggle = null,
    onBulkAutoCategorize = null,
    onMigrateSubCategories = null,  // NEW: SubCategory migration callback
    onCardSelectionChange = null,  // NEW: Card selection callback for merge feature
    onMergedInfoClick = null,  // NEW: Merged info click callback
    onMergeClick = null,  // NEW: Merge button click callback
    onDeleteSelected = null,  // NEW: Delete selected cards callback
    isBetaUser = false,
    onJoinBeta = null,
    onRevokeBeta = null
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
      onMessageClick: (message) => {}
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

    // Create settings screen with current values from getters
    settingsScreen = createSettings({
      onClose: closeSettings,
      onBackupData: onBackupData,
      onUpdateData: onUpdateData,
      onClearData: onClearData,
      onThirdPartyData: onThirdPartyData,
      autoInjectEnabled: getAutoInjectEnabled ? getAutoInjectEnabled() : false,
      onAutoInjectToggle: onAutoInjectToggle,
      autoBackupEnabled: getAutoBackupEnabled ? getAutoBackupEnabled() : false,
      onAutoBackupToggle: onAutoBackupToggle,
      autoCategorizeEnabled: getAutoCategorizeEnabled ? getAutoCategorizeEnabled() : true,
      onAutoCategorizeToggle: onAutoCategorizeToggle,
      onBulkAutoCategorize: onBulkAutoCategorize,
      onMigrateSubCategories: onMigrateSubCategories,
      isBetaUser: isBetaUser,
      onJoinBeta: onJoinBeta,
      onRevokeBeta: onRevokeBeta
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

  // Track if any cards are selected (for scroll behavior)
  let hasSelectedCards = false;

  // Helper function to update quick input bar based on list state
  const updatePreferenceOptionsState = () => {
    if (!preferenceOptions) return;

    const dataList = contentPreferences.getDataList();
    const cardCount = dataList.getCount();
    const isEmpty = cardCount === 0;

    // Set state: 'empty', 'normal', or 'selection'
    if (isEmpty) {
      preferenceOptions.setState('empty');
    } else if (hasSelectedCards) {
      // Selection state is handled by onCardSelectionChange
      // This just ensures we're in the right state initially
      preferenceOptions.setState('normal');
    } else {
      preferenceOptions.setState('normal');
    }
  };

  // Create content preferences
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'home__content';
  const contentPreferences = createContentPreferences({
    title: preferencesTitle,
    data: preferencesData, // Use real data from HSP protocol (empty array on first install)
    modalContainer: screenElement,
    onSearchStateChange: (isActive) => {
      // No longer hide preference options - inline search doesn't need this
      // Buttons remain visible when using inline search field
    },
    onListChange: (action, card) => {
      // Update preference options state when list changes
      updatePreferenceOptionsState();
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
    onCardSelectionChange: (selected, card) => {
      // Check immediately if we should hide the bar BEFORE updating buttons
      const dataList = contentPreferences.getDataList();
      const cards = dataList.getCards();
      const hadSelectedCards = hasSelectedCards;
      hasSelectedCards = cards.some(c => c.isSelected && c.isSelected());

      // Count selected cards
      const selectedCount = cards.filter(c => c.isSelected && c.isSelected()).length;

      // If deselecting last card and scrolled, hide instantly before state change
      if (!hasSelectedCards && hadSelectedCards && preferenceOptions) {
        const scrollTop = contentWrapper.scrollTop;
        if (scrollTop > 100) {
          // Hide bar instantly
          preferenceOptions.hide();

          // Update state back to normal
          preferenceOptions.setState('normal');

          // Call parent callback
          if (onCardSelectionChange) {
            onCardSelectionChange(selected, card);
          }

          // Adjust back-to-top button
          scrollToTopButton.element.style.bottom = '16px';
          return; // Exit early - already handled
        }
      }

      // Normal flow - update state based on selection
      if (hasSelectedCards) {
        // Switch to selection mode
        preferenceOptions.setState('selection');
        preferenceOptions.setMergeCount(selectedCount);
        preferenceOptions.setMergeDisabled(selectedCount < 2); // Need at least 2 to merge
      } else {
        // Switch back to normal mode
        preferenceOptions.setState('normal');
      }

      // Call parent callback
      if (onCardSelectionChange) {
        onCardSelectionChange(selected, card);
      }

      // Show bar if cards are selected
      if (hasSelectedCards && !hadSelectedCards && preferenceOptions) {
        preferenceOptions.show();
      }

      // Always adjust back-to-top button position based on selection state
      if (hasSelectedCards) {
        scrollToTopButton.element.style.bottom = '72px'; // Bottom bar height + 16px spacing
      } else {
        scrollToTopButton.element.style.bottom = '16px';
      }
    },
    onCardClick: (card, container) => {
      // Get all existing tags from all cards (predefined + user-created)
      const allCards = contentPreferences.getDataList().getCards();
      const userCollections = allCards.flatMap(c => c.getCollections());
      const currentCollections = card.getCollections();
      const predefinedCategories = aiHelper.getPredefinedCategories();
      // Combine predefined, user-created, and current collections, remove duplicates, and sort alphabetically
      const existingTags = [...new Set([...predefinedCategories, ...userCollections, ...currentCollections])].sort((a, b) => a.localeCompare(b));

      // Create and show modal when card is clicked
      const modal = createDataEditorModal({
        title: 'Edit Preference',
        preferenceTitle: 'Preference',
        preferenceText: card.getData(),
        preferenceTopic: card.getTopic() || '', // Pass existing topic
        preferenceHidden: card.getState() === 'hidden',
        preferenceFavorited: card.getState() === 'favorited',
        collections: card.getCollections(),
        existingTags: existingTags,
        autoCategorizeEnabled: getAutoCategorizeEnabled ? getAutoCategorizeEnabled() : true,
        mergedFrom: card.getMergedFrom(), // Pass merged from data if available
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
              collections: data.collections,
              topic: data.topic  // Include topic in update
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
    },
    onMergedInfoClick: onMergedInfoClick // NEW: Pass merged info callback
  });
  contentWrapper.appendChild(contentPreferences.element);

  // Create scroll-to-top button
  const scrollToTopButton = createTertiaryButton({
    icon: 'arrowUp',
    ariaLabel: 'Scroll to top',
    size: 'default',
    background: 'filled'
  });
  scrollToTopButton.element.style.position = 'absolute';
  scrollToTopButton.element.style.bottom = '16px';
  scrollToTopButton.element.style.right = '16px';
  scrollToTopButton.element.style.zIndex = '3'; // Same as merge/trash buttons
  scrollToTopButton.element.style.opacity = '0';
  scrollToTopButton.element.style.transform = 'translateY(20px)';
  scrollToTopButton.element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  scrollToTopButton.element.style.pointerEvents = 'none';

  // Get the scrollable container (content wrapper)
  const scrollableContainer = contentWrapper;

  scrollToTopButton.element.addEventListener('click', () => {
    scrollableContainer.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  screenElement.appendChild(scrollToTopButton.element);

  // Add scroll listener to hide quick input bar when scrolling
  let lastScrollTop = 0;

  scrollableContainer.addEventListener('scroll', () => {
    if (!preferenceOptions) return;

    const currentScrollTop = scrollableContainer.scrollTop;

    // Detect scroll direction
    if (currentScrollTop > lastScrollTop) {
      // Scrolling down - hide quick input bar (unless cards are selected), show scroll-to-top button
      // Keep bar visible if cards are selected (so trash/merge buttons stay visible)
      if (!hasSelectedCards) {
        preferenceOptions.hide();
      }
      scrollToTopButton.element.style.opacity = '1';
      scrollToTopButton.element.style.transform = 'translateY(0)';
      scrollToTopButton.element.style.pointerEvents = 'auto';
    } else {
      // Scrolling up - show quick input bar, hide scroll-to-top button
      preferenceOptions.show();
      scrollToTopButton.element.style.opacity = '0';
      scrollToTopButton.element.style.transform = 'translateY(20px)';
      scrollToTopButton.element.style.pointerEvents = 'none';
    }

    lastScrollTop = currentScrollTop;
  });

  // Initialize calibration with current card count
  updateCalibrationFromCards();

  // Create Quick Input Bar component (handles random questions internally)
  preferenceOptions = createQuickInputBar({
    onQuickAdd: (text, topic, collections) => {
      // Quick add from input field - save directly
      if (text && text.trim()) {
        if (onPreferenceAdd) {
          // Pass collections from random question (if available)
          onPreferenceAdd(text, 'default', collections || [], topic);
          // Note: renderCurrentScreen() in app.js will rebuild the UI
        }
      }
    },
    onPlusClick: () => {
      // Open data editor modal for manual add with full options
      // Get all existing tags from all cards (predefined + user-created)
      const allCards = contentPreferences.getDataList().getCards();
      const userCollections = allCards.flatMap(c => c.getCollections());
      const predefinedCategories = aiHelper.getPredefinedCategories();
      const existingTags = [...new Set([...predefinedCategories, ...userCollections])].sort((a, b) => a.localeCompare(b));

      // Open empty Data Editor Modal
      const modal = createDataEditorModal({
        title: 'Add Preference',
        preferenceTitle: 'Preference',
        preferenceText: '',
        preferenceHidden: false,
        preferenceFavorited: false,
        collections: [],
        existingTags: existingTags,
        autoCategorizeEnabled: getAutoCategorizeEnabled ? getAutoCategorizeEnabled() : true,
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
            console.log('[Home] Calling onPreferenceAdd with topic:', data.topic);
            if (onPreferenceAdd) {
              onPreferenceAdd(data.text, state, data.collections, data.topic);
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
    },
    onRandomQuestionClick: () => {
      // Open full random question modal (for users who prefer that flow)
      // This would be triggered by a separate button if we want to keep it
      // For now, question tags in quick-input-bar handle this inline
    },
    onMergeClick: onMergeClick,
    onDeleteClick: onDeleteSelected,
    getAutoCategorizeEnabled: getAutoCategorizeEnabled
  });

  // Assemble screen
  screenElement.appendChild(headerWrapper);
  screenElement.appendChild(calibrationWrapper);
  screenElement.appendChild(contentWrapper);
  screenElement.appendChild(preferenceOptions.element);

  // Initialize quick input bar (loads questions asynchronously)
  preferenceOptions.initialize();

  // Initialize quick input bar state based on initial data
  updatePreferenceOptionsState();

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
