/**
 * Data Editor Modal Component
 * Modal for editing preference data with:
 * - Header (simple variant)
 * - Text edit field component
 * - Collection edit field component
 * - Action buttons (save/remove)
 * Requires: header.js, text-edit-field.js, collection-edit-field.js, button-primary.js, button-tertiary.js, overlay.js
 */

function createDataEditorModal(options = {}) {
  const {
    title = 'Settings',
    onClose = null,
    preferenceTitle = 'Preference',
    preferenceTopic = '', // NEW: Topic for the preference (optional)
    preferenceText = '',
    preferenceHidden = false,
    preferenceFavorited = false,
    collections = [],
    existingTags = [], // All existing tags in the system
    autoCategorizeEnabled = true, // Whether AI auto-categorization is enabled
    mergedFrom = null, // Array of original cards when in merge mode
    onSave = null,
    onDelete = null,
    onToggleHidden = null,
    onToggleFavorite = null,
    onAddCollection = null
  } = options;

  // Check if we're in merge mode
  const isMergeMode = mergedFrom && Array.isArray(mergedFrom) && mergedFrom.length > 0;

  // Track AI-suggested collections
  let aiSuggestedCollections = [];
  let debounceTimer = null;

  // Create modal overlay using overlay component
  const overlay = createOverlay({
    blur: false,
    opacity: 'default',
    visible: false,
    onClick: () => {
      if (onClose) {
        onClose();
      }
      api.hide();
    }
  });

  // Create modal container
  const modalElement = document.createElement('div');
  modalElement.className = 'data-editor-modal';

  // Create header (simple-delete variant)
  const headerSection = createHeader({
    variant: 'simple-delete',
    title: title,
    onDelete: () => {
      if (onDelete) {
        onDelete();
      }
      api.hide();
    }
  });

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'data-editor-modal__content';

  // ===== Buttons Section (created early to access in callbacks) =====
  const buttonsSection = document.createElement('div');
  buttonsSection.className = 'data-editor-modal__buttons';

  const saveButton = createPrimaryButton({
    label: 'Save',
    variant: 'v2',
    disabled: !preferenceText || preferenceText.trim() === '' || !preferenceTopic || preferenceTopic.trim() === '',
    onClick: () => {
      // Get current state from text edit field
      const currentState = textEditField.getState();

      // Get topic value
      const topicValue = topicInputField.getValue();
      console.log('[DataEditorModal] Save clicked, topic:', topicValue);

      // Validate topic is not empty
      if (!topicValue || topicValue.trim() === '') {
        alert('Please enter a topic for this preference.');
        return;
      }

      // Call save callback with all data including state
      if (onSave) {
        onSave({
          topic: topicValue,  // NEW: Include topic
          text: textEditField.getText(),
          collections: collectionEditField.getCollections(),
          hidden: currentState.hidden,
          favorited: currentState.favorited
        });
      }
    }
  });

  // ===== Topic Input Field Section =====
  const topicInputField = createInputField({
    type: 'text',
    label: 'Topic',
    placeholder: 'e.g., "Wie ist deine Morning-Routine?"',
    value: preferenceTopic,
    maxLength: 500,
    required: true,
    onChange: (newTopic) => {
      // Update save button state when topic changes
      const isTextEmpty = !textEditField.getText() || textEditField.getText().trim() === '';
      const isTopicEmpty = !newTopic || newTopic.trim() === '';
      saveButton.setDisabled(isTextEmpty || isTopicEmpty);
    }
  });

  // ===== Text Edit Field Section =====
  // Don't pass callbacks - state changes are only applied on Save
  const textEditField = createTextEditField({
    title: preferenceTitle,
    text: preferenceText,
    placeholder: 'Enter preference details...',
    hidden: preferenceHidden,
    favorited: preferenceFavorited,
    mergedFrom: mergedFrom, // Pass merged from data if available
    onShowOriginals: isMergeMode ? showOriginalsModal : null, // Show originals callback
    onTextChange: async (newText) => {
      // Enable/disable save button based on text content AND topic
      const isTextEmpty = !newText || newText.trim() === '';
      const topicValue = topicInputField.getValue();
      const isTopicEmpty = !topicValue || topicValue.trim() === '';
      saveButton.setDisabled(isTextEmpty || isTopicEmpty);

      // AI Auto-Categorization
      if (autoCategorizeEnabled && !isTextEmpty && typeof aiHelper !== 'undefined') {
        // Clear previous debounce timer
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }

        // Debounce AI call by 500ms
        debounceTimer = setTimeout(async () => {
          try {
            // Only suggest if no collections manually added yet
            const currentCollections = collectionEditField.getCollections();
            const manualCollections = currentCollections.filter(c => !aiSuggestedCollections.includes(c));

            // If user has manually added collections, don't override with AI
            if (manualCollections.length > 0) {
              return;
            }

            // Get topic for context
            const currentTopic = topicInputField.getValue();

            // Combine topic and text for better categorization
            const contextText = currentTopic
              ? `Topic: ${currentTopic}\n\n${newText}`
              : newText;

            // Get AI suggestions (using both topic and value)
            const suggestions = await aiHelper.suggestCategories(contextText, existingTags);

            if (suggestions.length > 0) {
              console.log('[Data Editor Modal] AI suggested categories:', suggestions);

              // Remove old AI suggestions
              const tagList = collectionEditField.getTagList();
              const currentTags = tagList.getTags();
              aiSuggestedCollections.forEach(oldSuggestion => {
                const tagToRemove = currentTags.find(t => t.getLabel() === oldSuggestion);
                if (tagToRemove) {
                  collectionEditField.removeCollection(tagToRemove);
                }
              });

              // Add new AI suggestions
              aiSuggestedCollections = suggestions;
              suggestions.forEach(suggestion => {
                collectionEditField.addCollection(suggestion);
              });
            }
          } catch (error) {
            console.error('[Data Editor Modal] AI categorization error:', error);
          }
        }, 500);
      }
    },
    onEnter: () => {
      // Trigger save button on Enter if not disabled
      if (!saveButton.isDisabled()) {
        saveButton.click();
      }
    }
  });

  // ===== Collection Edit Field Section =====
  const collectionEditField = createCollectionEditField({
    title: 'Collections',
    collections: collections,
    onAddCollection: () => {
      // Open Tag Add Modal
      const tagAddModal = createTagAddModal({
        title: 'Add Collection',
        label: 'Collection Name',
        placeholder: 'Enter collection name...',
        existingTags: existingTags,
        currentCollections: collectionEditField.getCollections(),
        onAdd: (tagNames) => {
          // Parse comma-separated tag names and add each one to the collection edit field
          // These will only be saved to the card when the user clicks Save
          const tags = tagNames.split(',').map(t => t.trim()).filter(t => t);
          tags.forEach(tag => {
            collectionEditField.addCollection(tag);
          });
        },
        onCancel: () => {
          // Modal cancelled
        }
      });

      // Show the modal in the same container as data editor modal
      tagAddModal.show(overlay.element.parentNode || document.body);
    }
  });

  // Add sections to content
  contentContainer.appendChild(topicInputField.element);
  contentContainer.appendChild(textEditField.element);
  contentContainer.appendChild(collectionEditField.element);

  const cancelButton = createTertiaryButton({
    text: 'Cancel',
    onClick: () => {
      api.hide();
    }
  });

  // Add buttons
  buttonsSection.appendChild(saveButton.element);
  buttonsSection.appendChild(cancelButton.element);

  // Assemble modal
  modalElement.appendChild(headerSection.element);
  modalElement.appendChild(contentContainer);
  modalElement.appendChild(buttonsSection);

  // Assemble overlay with modal
  overlay.element.appendChild(modalElement);

  // Function to show originals modal
  function showOriginalsModal() {
    if (!mergedFrom || mergedFrom.length === 0) return;

    // Create originals overlay
    const originalsOverlay = createOverlay({
      blur: false,
      opacity: 'dark',
      visible: false,
      onClick: () => {
        originalsOverlay.hide();
        setTimeout(() => {
          if (originalsOverlay.element.parentNode) {
            originalsOverlay.element.parentNode.removeChild(originalsOverlay.element);
          }
        }, 200);
      }
    });

    // Create originals modal
    const originalsModal = document.createElement('div');
    originalsModal.className = 'data-editor-modal data-editor-modal--originals';

    // Create header
    const originalsHeader = createHeader({
      variant: 'simple',
      title: `Original Cards (${mergedFrom.length})`,
      onClose: () => {
        originalsOverlay.hide();
        setTimeout(() => {
          if (originalsOverlay.element.parentNode) {
            originalsOverlay.element.parentNode.removeChild(originalsOverlay.element);
          }
        }, 200);
      }
    });

    // Create content with cards
    const originalsContent = document.createElement('div');
    originalsContent.className = 'data-editor-modal__originals-content';

    mergedFrom.forEach((original, index) => {
      const cardElement = document.createElement('div');
      cardElement.className = 'data-editor-modal__original-card';

      // Card text
      const cardText = document.createElement('div');
      cardText.className = 'data-editor-modal__original-text text-style-body-medium';
      cardText.textContent = original.text;

      // Card metadata (collections and state)
      const cardMeta = document.createElement('div');
      cardMeta.className = 'data-editor-modal__original-meta';

      // Show collections as tags
      if (original.collections && original.collections.length > 0) {
        const collectionsContainer = document.createElement('div');
        collectionsContainer.className = 'data-editor-modal__original-collections';

        original.collections.forEach(collection => {
          const tag = document.createElement('span');
          tag.className = 'data-editor-modal__original-tag text-style-body-small';
          tag.textContent = collection;
          collectionsContainer.appendChild(tag);
        });

        cardMeta.appendChild(collectionsContainer);
      }

      // Show state icons
      if (original.state === 'favorited' || original.state === 'hidden') {
        const stateIcon = document.createElement('span');
        stateIcon.className = 'data-editor-modal__original-state';
        stateIcon.innerHTML = getIcon(original.state === 'favorited' ? 'heart-filled' : 'visibility-off');
        cardMeta.appendChild(stateIcon);
      }

      cardElement.appendChild(cardText);
      if (cardMeta.children.length > 0) {
        cardElement.appendChild(cardMeta);
      }

      originalsContent.appendChild(cardElement);
    });

    // Assemble originals modal
    originalsModal.appendChild(originalsHeader.element);
    originalsModal.appendChild(originalsContent);

    // Assemble and show
    originalsOverlay.element.appendChild(originalsModal);

    const container = overlay.element.parentNode || document.body;
    container.appendChild(originalsOverlay.element);
    setTimeout(() => originalsOverlay.show(), 10);
  }

  // Public API
  const api = {
    element: overlay.element,
    modalElement: modalElement,

    getHeader() {
      return headerSection;
    },

    getTextEditField() {
      return textEditField;
    },

    getCollectionEditField() {
      return collectionEditField;
    },

    getTopic() {
      return topicInputField.getValue();
    },

    setTopic(topic) {
      topicInputField.setValue(topic);
    },

    getText() {
      return textEditField.getText();
    },

    setText(text) {
      textEditField.setText(text);
    },

    getCollections() {
      return collectionEditField.getCollections();
    },

    addCollection(label) {
      return collectionEditField.addCollection(label);
    },

    clearCollections() {
      collectionEditField.clearCollections();
    },

    setCollections(collections) {
      collectionEditField.setCollections(collections);
    },

    show(container) {
      // If container provided, append to container, otherwise append to body
      const target = container || document.body;
      target.appendChild(overlay.element);
      // Show overlay after appending to trigger transition
      setTimeout(() => overlay.show(), 10);
    },

    hide() {
      overlay.hide();
      // Use timeout to allow fade-out animation
      setTimeout(() => {
        if (overlay.element.parentNode) {
          overlay.element.parentNode.removeChild(overlay.element);
        }
      }, 200);
    },

    destroy() {
      overlay.destroy();
    }
  };

  return api;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createDataEditorModal };
}
