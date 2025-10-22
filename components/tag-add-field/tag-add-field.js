/**
 * Tag Add Field Component
 * Text edit field with integrated tag list for adding collections
 * Combines text-edit-field with tag-list
 * Requires: text-edit-field.js, tag-list.js
 */

function createTagAddField(options = {}) {
  const {
    title = 'Collection Name',
    placeholder = 'Enter collection name...',
    existingTags = [], // Array of existing tag/collection names
    currentCollections = [], // Array of collections already assigned to the current card
    onInput = null,
    onEnter = null
  } = options;

  // Create container
  const container = document.createElement('div');
  container.className = 'tag-add-field';

  // Track selected tags
  let selectedTags = [];

  // Create text edit field using compact-plain header (without action icons)
  const textEditField = createTextEditField({
    title: title,
    text: '',
    placeholder: placeholder,
    headerVariant: 'compact-plain', // Use plain variant without icons
    onTextChange: (newText) => {
      if (onInput) {
        onInput(newText);
      }
    },
    editable: true
  });

  // Create tag list if there are existing tags
  let tagListInstance = null;
  if (existingTags.length > 0) {
    const filteredTags = existingTags.filter(tagName => {
      const lowerName = tagName.toLowerCase();
      // Filter out system tags and already assigned tags
      return lowerName !== 'all' &&
             lowerName !== 'favorites' &&
             lowerName !== 'hidden' &&
             !currentCollections.includes(tagName);
    });

    if (filteredTags.length > 0) {
      const tagListWrapper = document.createElement('div');
      tagListWrapper.className = 'tag-add-field__tag-list';

      tagListInstance = createTagList({
        tags: filteredTags.map(tagName => ({
          type: 'collection',
          label: tagName,
          count: 0,
          state: 'inactive',
          size: 'small'
        })),
        onTagClick: (tag) => {
          // Update selected tags based on tag states
          const allTags = tagListInstance.getTags();
          const activeTags = allTags.filter(t => t.getState() === 'active');
          selectedTags = activeTags.map(t => t.getLabel());

          // Get current text from text field
          const currentText = textEditField.getText().trim();

          // Parse current text to get manually typed tags
          const currentTags = currentText ? currentText.split(',').map(t => t.trim()).filter(t => t) : [];

          // Filter out manually typed tags that are also in the tag list
          const manualTags = currentTags.filter(t => !existingTags.includes(t));

          // Combine manual tags with selected tags
          const allTagsList = [...manualTags, ...selectedTags];

          // Update text field with comma-separated list
          if (allTagsList.length > 0) {
            textEditField.setText(allTagsList.join(', '));
          } else {
            textEditField.setText('');
          }

          // Trigger onInput callback
          if (onInput) {
            onInput(allTagsList.join(', '));
          }
        }
      });

      tagListWrapper.appendChild(tagListInstance.element);
      container.appendChild(textEditField.element);
      container.appendChild(tagListWrapper);
    } else {
      // No valid tags, just add text field
      container.appendChild(textEditField.element);
    }
  } else {
    // No existing tags, just add text field
    container.appendChild(textEditField.element);
  }

  // Handle Enter key on textbox (contentEditable div)
  const textbox = textEditField.element.querySelector('.text-edit-field__textbox');
  if (textbox) {
    textbox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const value = textEditField.getText().trim();
        if (value && onEnter) {
          onEnter(value);
        }
      }
    });
  }

  // Public API
  return {
    element: container,

    getValue() {
      return textEditField.getText().trim();
    },

    setValue(newValue) {
      textEditField.setText(newValue);
      if (onInput) {
        onInput(newValue);
      }
    },

    clear() {
      textEditField.setText('');
      selectedTags = [];

      // Deactivate all tags
      if (tagListInstance) {
        const allTags = tagListInstance.getTags();
        allTags.forEach(tag => tag.setState('inactive'));
      }

      if (onInput) {
        onInput('');
      }
    },

    focus() {
      textEditField.focus();
    },

    getSelectedTags() {
      return selectedTags;
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createTagAddField };
}
