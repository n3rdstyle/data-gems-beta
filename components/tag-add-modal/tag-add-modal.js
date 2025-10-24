/**
 * Tag Add Modal Component
 * Modal for adding a new tag/collection with:
 * - Header (simple variant)
 * - Tag add field component
 * - Action buttons (add/cancel)
 * Requires: header.js, tag-add-field.js, button-primary.js, button-tertiary.js, overlay.js
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

  // Create modal overlay using overlay component
  const overlay = createOverlay({
    blur: false,
    opacity: 'default',
    visible: false,
    onClick: () => {
      api.hide();
      if (onCancel) {
        onCancel();
      }
    }
  });

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
  overlay.element.appendChild(modalElement);

  // Public API
  const api = {
    element: overlay.element,

    show(container = document.body) {
      container.appendChild(overlay.element);
      // Show overlay after appending to trigger transition
      setTimeout(() => {
        overlay.show();
        // Focus input after overlay is visible
        tagAddField.focus();
      }, 10);
      return this;
    },

    hide() {
      overlay.hide();
      // Use timeout to allow fade-out animation
      setTimeout(() => {
        if (overlay.element.parentNode) {
          overlay.element.parentNode.removeChild(overlay.element);
        }
      }, 200);
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

