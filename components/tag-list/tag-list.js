/**
 * Tag List Component
 * Creates a horizontal list of tag components
 */

function createTagList(options = {}) {
  const {
    tags = [],
    onTagClick = null
  } = options;

  // Create tag list container
  const tagListElement = document.createElement('div');
  tagListElement.className = 'tag-list';

  // Store tag instances
  const tagInstances = [];

  // Add tags to the list
  tags.forEach(tagConfig => {
    const tag = createTag({
      type: tagConfig.type || 'collection',
      label: tagConfig.label || 'Tag',
      count: tagConfig.count || 0,
      state: tagConfig.state || 'inactive',
      onClick: (clickedTag) => {
        if (onTagClick) {
          onTagClick(clickedTag);
        }
      }
    });

    tagListElement.appendChild(tag.element);
    tagInstances.push(tag);
  });

  // Public API
  return {
    element: tagListElement,

    addTag(tagConfig) {
      const tag = createTag({
        type: tagConfig.type || 'collection',
        label: tagConfig.label || 'Tag',
        count: tagConfig.count || 0,
        state: tagConfig.state || 'inactive',
        onClick: (clickedTag) => {
          if (onTagClick) {
            onTagClick(clickedTag);
          }
        }
      });

      tagListElement.appendChild(tag.element);
      tagInstances.push(tag);
      return tag;
    },

    removeTag(tag) {
      const index = tagInstances.indexOf(tag);
      if (index > -1) {
        tagInstances.splice(index, 1);
        tag.element.remove();
      }
    },

    getTags() {
      return tagInstances;
    },

    clear() {
      tagInstances.forEach(tag => tag.element.remove());
      tagInstances.length = 0;
    },

    setActiveTag(tag) {
      tagInstances.forEach(t => {
        if (t === tag) {
          t.setState('active');
        } else {
          t.setState('inactive');
        }
      });
    },

    getActiveTag() {
      return tagInstances.find(t => t.getState() === 'active');
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createTagList };
}
