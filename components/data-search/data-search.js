/**
 * Data Search Component
 * Composite component combining search, tag list, and action buttons
 */

function createDataSearch(options = {}) {
  const {
    placeholder = 'Search your preferences',
    tags = [],
    onSearch = null,
    onTagClick = null,
    expandedByDefault = true
  } = options;

  // Create main container
  const dataSearchElement = document.createElement('div');
  dataSearchElement.className = 'data-search';

  // Create top row (search + expand button)
  const topRow = document.createElement('div');
  topRow.className = 'data-search__top-row';

  // Create search wrapper
  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'data-search__search-wrapper';

  // Create search component
  const search = createSearch({
    placeholder,
    onInput: (value) => {
      if (onSearch) {
        onSearch(value);
      }
    }
  });
  searchWrapper.appendChild(search.element);

  // Create expand/collapse button using tertiary button
  const expandButton = createTertiaryButton({
    icon: 'chevronUp',
    ariaLabel: 'Toggle collections'
  });

  if (!expandedByDefault) {
    expandButton.setCollapsed(true);
  }

  topRow.appendChild(searchWrapper);
  topRow.appendChild(expandButton.element);

  // Create bottom row (tag list only)
  const bottomRow = document.createElement('div');
  bottomRow.className = 'data-search__bottom-row';
  if (!expandedByDefault) {
    bottomRow.classList.add('hidden');
  }

  // Create tag list wrapper
  const tagListWrapper = document.createElement('div');
  tagListWrapper.className = 'data-search__tag-list-wrapper';

  // Create tag list with card variant
  const tagList = createTagList({
    tags: tags.map(tag => ({
      ...tag,
      variant: 'card'
    })),
    onTagClick
  });
  tagListWrapper.appendChild(tagList.element);

  bottomRow.appendChild(tagListWrapper);

  // Add expand/collapse functionality
  let isExpanded = expandedByDefault;
  expandButton.element.addEventListener('click', () => {
    isExpanded = !isExpanded;
    expandButton.setCollapsed(!isExpanded);
    if (isExpanded) {
      bottomRow.classList.remove('hidden');
    } else {
      bottomRow.classList.add('hidden');
    }
  });

  // Assemble component
  dataSearchElement.appendChild(topRow);
  dataSearchElement.appendChild(bottomRow);

  // Public API
  return {
    element: dataSearchElement,

    getSearchValue() {
      return search.getValue();
    },

    setSearchValue(value) {
      search.setValue(value);
    },

    clearSearch() {
      search.clear();
    },

    getTagList() {
      return tagList;
    },

    expand() {
      if (!isExpanded) {
        isExpanded = true;
        expandButton.setCollapsed(false);
        bottomRow.classList.remove('hidden');
      }
    },

    collapse() {
      if (isExpanded) {
        isExpanded = false;
        expandButton.setCollapsed(true);
        bottomRow.classList.add('hidden');
      }
    },

    isExpanded() {
      return isExpanded;
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createDataSearch };
}
