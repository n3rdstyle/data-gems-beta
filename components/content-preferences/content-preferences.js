/**
 * Content Preferences Component
 * Composite component combining headline, data search, and data list
 */

function createContentPreferences(options = {}) {
  const {
    title = 'My Preferences',
    data = [],
    searchPlaceholder = 'Search your preferences',
    tags = [
      { type: 'collection', label: 'Collection', count: 1, state: 'active' },
      { type: 'favorites', label: 'Favorites', count: 1, state: 'inactive' },
      { type: 'hidden', label: 'Hidden', count: 1, state: 'inactive' },
      { type: 'collection', label: 'Collection', count: 1, state: 'inactive' }
    ],
    onSearch = null,
    onTagClick = null,
    onAddClick = null,
    onCardStateChange = null
  } = options;

  // Create main container
  const container = document.createElement('div');
  container.className = 'content-preferences';

  // Create headline
  const headlineWrapper = document.createElement('div');
  headlineWrapper.className = 'content-preferences__headline';
  const headline = createHeadline({ text: title });
  headlineWrapper.appendChild(headline.element);

  // Create data search
  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'content-preferences__search';
  const dataSearch = createDataSearch({
    placeholder: searchPlaceholder,
    tags: tags,
    onSearch: (value) => {
      // Filter data list based on search
      if (onSearch) {
        onSearch(value);
      }
      if (dataList) {
        if (value) {
          dataList.filter(value);
        } else {
          dataList.clearFilter();
        }
      }
    },
    onTagClick: (tag) => {
      if (onTagClick) {
        onTagClick(tag);
      }
    },
    onAddClick: () => {
      if (onAddClick) {
        onAddClick();
      }
    }
  });
  searchWrapper.appendChild(dataSearch.element);

  // Create data list
  const listWrapper = document.createElement('div');
  listWrapper.className = 'content-preferences__list';
  const dataList = new DataList(listWrapper, {
    data: data,
    onCardStateChange: (card, state) => {
      if (onCardStateChange) {
        onCardStateChange(card, state);
      }
    }
  });

  // Assemble component
  container.appendChild(headlineWrapper);
  container.appendChild(searchWrapper);
  container.appendChild(listWrapper);

  // Public API
  return {
    element: container,

    getHeadline() {
      return headline;
    },

    getDataSearch() {
      return dataSearch;
    },

    getDataList() {
      return dataList;
    },

    setTitle(newTitle) {
      headline.setText(newTitle);
    },

    addCard(name, state = 'default') {
      return dataList.addCard(name, state);
    },

    removeCard(card) {
      dataList.removeCard(card);
    },

    clearSearch() {
      dataSearch.clearSearch();
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createContentPreferences };
}
