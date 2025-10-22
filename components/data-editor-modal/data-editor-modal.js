/**
 * Data Editor Modal Component
 * Modal for editing preference data with:
 * - Header (simple variant)
 * - Text edit field component
 * - Collection edit field component
 * - Action buttons (save/remove)
 * Requires: header.js, text-edit-field.js, collection-edit-field.js, button-primary.js, button-tertiary.js
 */

function createDataEditorModal(options = {}) {
  const {
    title = 'Settings',
    onClose = null,
    preferenceTitle = 'Preference',
    preferenceText = '',
    preferenceHidden = false,
    preferenceFavorited = false,
    collections = [],
    existingTags = [], // All existing tags in the system
    onSave = null,
    onDelete = null,
    onToggleHidden = null,
    onToggleFavorite = null,
    onAddCollection = null
  } = options;

  // Create modal overlay
  const overlayElement = document.createElement('div');
  overlayElement.className = 'data-editor-modal-overlay';

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

  // Close on overlay click
  overlayElement.addEventListener('click', (e) => {
    if (e.target === overlayElement) {
      api.hide();
      if (onClose) {
        onClose();
      }
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
    disabled: !preferenceText || preferenceText.trim() === '',
    onClick: () => {
      // Get current state from text edit field
      const currentState = textEditField.getState();

      // Call save callback with all data including state
      if (onSave) {
        onSave({
          text: textEditField.getText(),
          collections: collectionEditField.getCollections(),
          hidden: currentState.hidden,
          favorited: currentState.favorited
        });
      }
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
    onTextChange: (newText) => {
      // Enable/disable save button based on text content
      const isEmpty = !newText || newText.trim() === '';
      saveButton.setDisabled(isEmpty);
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
          console.log('Tag add cancelled');
        }
      });

      // Show the modal in the same container as data editor modal
      tagAddModal.show(overlayElement.parentNode || document.body);
    }
  });

  // Add sections to content
  contentContainer.appendChild(textEditField.element);
  contentContainer.appendChild(collectionEditField.element);

  const cancelButton = createTertiaryButton({
    text: 'Cancel',
    onClick: () => {
      api.hide();
    }
  });

  buttonsSection.appendChild(saveButton.element);
  buttonsSection.appendChild(cancelButton.element);

  // Assemble modal
  modalElement.appendChild(headerSection.element);
  modalElement.appendChild(contentContainer);
  modalElement.appendChild(buttonsSection);

  // Assemble overlay with modal
  overlayElement.appendChild(modalElement);

  // Public API
  const api = {
    element: overlayElement,
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
      overlayElement.classList.add('data-editor-modal-overlay--visible');
      // If container provided, append to container, otherwise append to body
      const target = container || document.body;
      target.appendChild(overlayElement);
    },

    hide() {
      overlayElement.classList.remove('data-editor-modal-overlay--visible');
      // Use timeout to allow fade-out animation
      setTimeout(() => {
        if (overlayElement.parentNode) {
          overlayElement.parentNode.removeChild(overlayElement);
        }
      }, 200);
    },

    destroy() {
      overlayElement.remove();
    }
  };

  return api;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createDataEditorModal };
}
