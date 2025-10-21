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
    onCardStateChange = null,
    onCardClick = null,
    modalContainer = null
  } = options;

  // Create main container
  const container = document.createElement('div');
  container.className = 'content-preferences';

  // Create headline
  const headlineWrapper = document.createElement('div');
  headlineWrapper.className = 'content-preferences__headline';
  const headline = createHeadline({ text: title });
  headlineWrapper.appendChild(headline.element);

  // Track active filter
  let activeFilter = null;

  // Create data list first (so it's available for callbacks)
  const listWrapper = document.createElement('div');
  listWrapper.className = 'content-preferences__list';
  const dataList = new DataList(listWrapper, {
    data: data,
    onCardStateChange: (card, state) => {
      // When a card state changes, reapply the active filter if one exists
      if (activeFilter) {
        // Small delay to ensure state is updated
        setTimeout(() => {
          dataList.filterByState(activeFilter);
        }, 10);
      }

      if (onCardStateChange) {
        onCardStateChange(card, state);
      }
    },
    onCardClick: onCardClick,
    modalContainer: modalContainer
  });

  // Create data search (after data list so dataList is available)
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
      if (value) {
        dataList.filter(value);
      } else {
        // If no search term but there's an active tag filter, reapply it
        if (activeFilter) {
          dataList.filterByState(activeFilter);
        } else {
          dataList.clearFilter();
        }
      }
    },
    onTagClick: (tag) => {
      // Handle filtering by tag type
      const tagList = dataSearch.getTagList();
      const allTags = tagList.getTags();

      // Toggle tag state
      const isActive = tag.getState() === 'active';

      if (isActive) {
        // Deactivate and clear filter
        tag.setState('inactive');
        activeFilter = null;
        dataList.clearFilter();
      } else {
        // Deactivate all other tags
        allTags.forEach(t => {
          if (t !== tag) {
            t.setState('inactive');
          }
        });

        // Activate clicked tag
        tag.setState('active');

        // Apply filter based on tag type
        const tagLabel = tag.getLabel().toLowerCase();
        if (tagLabel === 'favorites') {
          activeFilter = 'favorited';
          dataList.filterByState('favorited');
        } else if (tagLabel === 'hidden') {
          activeFilter = 'hidden';
          dataList.filterByState('hidden');
        } else {
          // For collection tags, clear filter
          activeFilter = null;
          dataList.clearFilter();
        }
      }

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
    },

    filterByState(state) {
      activeFilter = state;
      if (state) {
        dataList.filterByState(state);
      } else {
        dataList.clearFilter();
      }
    },

    clearFilter() {
      activeFilter = null;
      dataList.clearFilter();
    },

    getActiveFilter() {
      return activeFilter;
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createContentPreferences };
}
