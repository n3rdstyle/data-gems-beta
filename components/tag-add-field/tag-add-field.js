/**
 * Tag Add Field Component
 * Simple input field with label and optional tag list for adding collections
 * Requires: tag-list.js
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

  // Create label
  const label = document.createElement('label');
  label.className = 'tag-add-field__label text-style-h3';
  label.textContent = title;

  // Create input
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'tag-add-field__input';
  input.placeholder = placeholder;

  // Input event handler
  input.addEventListener('input', () => {
    if (onInput) {
      onInput(input.value);
    }
  });

  // Enter key handler
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = input.value.trim();
      if (value && onEnter) {
        onEnter(value);
      }
    }
  });

  // Add label and input to container
  container.appendChild(label);
  container.appendChild(input);

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

          // Get current text from input
          const currentText = input.value.trim();

          // Parse current text to get manually typed tags
          const currentTags = currentText ? currentText.split(',').map(t => t.trim()).filter(t => t) : [];

          // Filter out manually typed tags that are also in the tag list
          const manualTags = currentTags.filter(t => !existingTags.includes(t));

          // Combine manual tags with selected tags
          const allTagsList = [...manualTags, ...selectedTags];

          // Update input with comma-separated list
          if (allTagsList.length > 0) {
            input.value = allTagsList.join(', ');
          } else {
            input.value = '';
          }

          // Trigger onInput callback
          if (onInput) {
            onInput(input.value);
          }
        }
      });

      tagListWrapper.appendChild(tagListInstance.element);
      container.appendChild(tagListWrapper);
    }
  }

  // Public API
  return {
    element: container,

    getValue() {
      return input.value.trim();
    },

    setValue(newValue) {
      input.value = newValue;
      if (onInput) {
        onInput(newValue);
      }
    },

    clear() {
      input.value = '';
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
      input.focus();
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
