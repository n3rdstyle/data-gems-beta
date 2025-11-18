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

  // Declare tagListInstance reference that will be set later
  let tagListInstance = null;

  // Track previously selected tags to detect removals
  let previouslyTypedTags = [];

  // Input event handler
  input.addEventListener('input', () => {
    // Check if typed value matches an existing tag
    if (tagListInstance) {
      const typedValue = input.value.trim();

      // Parse comma-separated tags to get all currently typed tags
      const currentTypedTags = typedValue.split(',').map(t => t.trim()).filter(t => t);
      const lastTypedTag = currentTypedTags.length > 0 ? currentTypedTags[currentTypedTags.length - 1] : '';

      console.log('[TagAddField] Current typed tags:', currentTypedTags);
      console.log('[TagAddField] Previously typed tags:', previouslyTypedTags);

      // Check if any previously typed tag was removed
      const removedTags = previouslyTypedTags.filter(prevTag =>
        !currentTypedTags.some(currTag => currTag.toLowerCase() === prevTag.toLowerCase())
      );

      if (removedTags.length > 0) {
        console.log('[TagAddField] Removed tags:', removedTags);

        // For each removed tag, find it in the tag list and deactivate it
        removedTags.forEach(removedTag => {
          const allTags = tagListInstance.getTags();
          const tagToDeactivate = allTags.find(tag =>
            tag.getLabel().toLowerCase() === removedTag.toLowerCase() &&
            tag.getState() === 'active'
          );

          if (tagToDeactivate) {
            const tagLabel = tagToDeactivate.getLabel();
            console.log('[TagAddField] Deactivating tag:', tagLabel);

            // Remove from current position
            tagListInstance.removeTag(tagToDeactivate);

            // Find correct alphabetical position
            const remainingTags = tagListInstance.getTags();
            const sortedPosition = remainingTags.findIndex(tag =>
              tag.getLabel().toLowerCase() > tagLabel.toLowerCase()
            );

            const insertIndex = sortedPosition === -1 ? remainingTags.length : sortedPosition;

            // Add back in alphabetical position with inactive state
            tagListInstance.addTagAtIndex({
              type: 'collection',
              label: tagLabel,
              count: 0,
              state: 'inactive',
              size: 'small'
            }, insertIndex);

            // Remove from selectedTags
            selectedTags = selectedTags.filter(t => t.toLowerCase() !== tagLabel.toLowerCase());

            console.log('[TagAddField] Tag deactivated and moved to alphabetical position:', tagLabel, 'at index', insertIndex);
          }
        });

        // Update previously typed tags
        previouslyTypedTags = [...currentTypedTags];

        if (onInput) {
          onInput(input.value);
        }
        return;
      }

      // Check if a new tag matches an existing one
      if (lastTypedTag) {
        // Find matching tag (case-insensitive)
        const allTags = tagListInstance.getTags();
        const matchingTag = allTags.find(tag =>
          tag.getLabel().toLowerCase() === lastTypedTag.toLowerCase()
        );

        console.log('[TagAddField] Matching tag found:', matchingTag ? matchingTag.getLabel() : 'none');

        if (matchingTag && matchingTag.getState() !== 'active') {
          // Tag exists in the list - activate it and move to first position
          const tagLabel = matchingTag.getLabel();

          // Remove the tag from its current position
          tagListInstance.removeTag(matchingTag);

          // Add it at the first position with active state, with proper click handler
          const newTag = tagListInstance.addTagAtIndex({
            type: 'collection',
            label: tagLabel,
            count: 0,
            state: 'active',
            size: 'small'
          }, 0);

          // Update selectedTags
          if (!selectedTags.includes(tagLabel)) {
            selectedTags.push(tagLabel);
          }

          console.log('[TagAddField] Tag activated and moved to first position:', tagLabel);

          // Update input field to show selected tags + any other manually typed tags
          const otherTypedTags = currentTypedTags.slice(0, -1); // All tags except the last one (which matched)
          const manualTags = otherTypedTags.filter(t => !existingTags.includes(t));

          // Combine manual tags with selected tags
          const allTagsList = [...manualTags, ...selectedTags];

          // Update input with comma-separated list
          input.value = allTagsList.join(', ');

          // Update previously typed tags
          previouslyTypedTags = allTagsList;

          // Trigger onInput callback with updated value
          if (onInput) {
            onInput(input.value);
          }
          return; // Skip the onInput call below
        }
      }

      // Update previously typed tags
      previouslyTypedTags = [...currentTypedTags];
    }

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
      previouslyTypedTags = [];

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
