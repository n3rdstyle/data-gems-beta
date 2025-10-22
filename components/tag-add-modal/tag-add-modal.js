/**
 * Tag Add Modal Component
 * Modal for adding a new tag/collection with:
 * - Header (simple variant)
 * - Tag add field component
 * - Action buttons (add/cancel)
 * Requires: header.js, tag-add-field.js, button-primary.js, button-tertiary.js
 */

function createTagAddModal(options = {}) {
  const {
    title = 'Add Collection',
    label = 'Collection Name',
    placeholder = 'Enter collection name...',
    existingTags = [], // Array of existing tag/collection names
    currentCollections = [], // Array of collections already assigned to the current card
    onAdd = null,
    onCancel = null
  } = options;

  // Create modal overlay
  const overlayElement = document.createElement('div');
  overlayElement.className = 'tag-add-modal-overlay';

  // Create modal container
  const modalElement = document.createElement('div');
  modalElement.className = 'tag-add-modal';

  // Create header (simple variant)
  const headerSection = createHeader({
    variant: 'simple',
    title: title,
    onClose: () => {
      api.hide();
      if (onCancel) {
        onCancel();
      }
    }
  });

  // Close on overlay click
  overlayElement.addEventListener('click', (e) => {
    if (e.target === overlayElement) {
      api.hide();
      if (onCancel) {
        onCancel();
      }
    }
  });

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'tag-add-modal__content';

  // Create buttons section first (to access in callbacks)
  const buttonsSection = document.createElement('div');
  buttonsSection.className = 'tag-add-modal__buttons';

  const addButton = createPrimaryButton({
    label: 'Add',
    variant: 'v2',
    disabled: true,
    onClick: () => {
      const tagName = tagAddField.getValue();
      if (tagName && onAdd) {
        onAdd(tagName);
      }
      api.hide();
    }
  });

  const cancelButton = createTertiaryButton({
    text: 'Cancel',
    onClick: () => {
      api.hide();
      if (onCancel) {
        onCancel();
      }
    }
  });

  // Create tag add field (now includes tag list)
  const tagAddField = createTagAddField({
    title: label,
    placeholder: placeholder,
    existingTags: existingTags,
    currentCollections: currentCollections,
    onInput: (value) => {
      const isEmpty = !value || value.trim() === '';
      addButton.setDisabled(isEmpty);
    },
    onEnter: (value) => {
      if (value && onAdd) {
        onAdd(value);
      }
      api.hide();
    }
  });

  buttonsSection.appendChild(addButton.element);
  buttonsSection.appendChild(cancelButton.element);

  // Assemble modal content
  contentContainer.appendChild(tagAddField.element);
  contentContainer.appendChild(buttonsSection);

  // Assemble modal
  modalElement.appendChild(headerSection.element);
  modalElement.appendChild(contentContainer);
  overlayElement.appendChild(modalElement);

  // Public API
  const api = {
    element: overlayElement,

    show(container = document.body) {
      container.appendChild(overlayElement);
      // Focus input after a short delay
      setTimeout(() => tagAddField.focus(), 100);
      return this;
    },

    hide() {
      if (overlayElement.parentNode) {
        overlayElement.parentNode.removeChild(overlayElement);
      }
      return this;
    },

    clear() {
      tagAddField.clear();
      addButton.setDisabled(true);
      return this;
    },

    setValue(value) {
      tagAddField.setValue(value);
      const isEmpty = !value || value.trim() === '';
      addButton.setDisabled(isEmpty);
      return this;
    },

    getValue() {
      return tagAddField.getValue();
    }
  };

  return api;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createTagAddModal };
}
