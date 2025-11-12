/**
 * Collection Edit Field Component
 * Tag list with compact header and add button
 * Combines compact header with plus button and small tag list
 * Requires: header.js, tag-list.js
 */

function createCollectionEditField(options = {}) {
  const {
    title = 'Collections',
    collections = [],
    onAddCollection = null,
    onRemoveCollection = null,  // NEW: Callback when collection removed
    onTagClick = null,
    onRemoveTag = null
  } = options;

  // Create container
  const container = document.createElement('div');
  container.className = 'collection-edit-field';

  // Create compact header with plus button
  const header = createHeader({
    variant: 'compact',
    title: title,
    actionIcons: [
      {
        icon: 'plus',
        ariaLabel: 'Add collection',
        onClick: () => {
          if (onAddCollection) {
            onAddCollection();
          }
        }
      }
    ]
  });

  // Create tag list with small tags
  const tagList = createTagList({
    tags: collections.map(label => ({
      label: label,
      size: 'small',
      state: 'active'
    })),
    onTagClick: (tag) => {
      // Remove tag when clicked
      tagList.removeTag(tag);

      // Notify that a collection was removed
      if (onRemoveCollection) {
        onRemoveCollection(tag.getLabel());
      }

      // Call external callback if provided
      if (onTagClick) {
        onTagClick(tag);
      }
    }
  });

  // Assemble component
  container.appendChild(header.element);
  container.appendChild(tagList.element);

  // Public API
  return {
    element: container,

    getTitle() {
      return header.getTitle();
    },

    setTitle(newTitle) {
      header.setTitle(newTitle);
    },

    getHeader() {
      return header;
    },

    getPlusButton() {
      return header.getIconButton(0);
    },

    getTagList() {
      return tagList;
    },

    getCollections() {
      return tagList.getTags().map(t => t.getLabel());
    },

    addCollection(label) {
      return tagList.addTag({
        label: label,
        size: 'small',
        state: 'active'
      });
    },

    removeCollection(tag) {
      tagList.removeTag(tag);
      if (onRemoveTag) {
        onRemoveTag(tag);
      }
    },

    clearCollections() {
      tagList.clear();
    },

    setCollections(collections) {
      tagList.clear();
      collections.forEach(label => {
        tagList.addTag({
          label: label,
          size: 'small',
          state: 'active'
        });
      });
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createCollectionEditField };
}
