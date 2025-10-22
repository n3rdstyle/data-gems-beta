/**
 * Content Preferences Component
 * Composite component combining headline, data search, and data list
 */

/**
 * Calculate tags with counts from data
 * @param {Array} data - Array of data items with collections
 * @returns {Array} Array of tag objects with counts
 */
function calculateTagsFromData(data) {
  const tags = [];

  // Count total cards
  const totalCount = data.length;

  // Count favorited cards
  const favoritedCount = data.filter(item => item.state === 'favorited').length;

  // Count hidden cards
  const hiddenCount = data.filter(item => item.state === 'hidden').length;

  // Add "All" tag
  tags.push({
    type: 'collection',
    label: 'All',
    count: totalCount,
    state: 'active'
  });

  // Add "Favorites" tag
  tags.push({
    type: 'favorites',
    label: 'Favorites',
    count: favoritedCount,
    state: 'inactive'
  });

  // Add "Hidden" tag
  tags.push({
    type: 'hidden',
    label: 'Hidden',
    count: hiddenCount,
    state: 'inactive'
  });

  // Count collections
  const collectionCounts = {};
  data.forEach(item => {
    if (item.collections && Array.isArray(item.collections)) {
      item.collections.forEach(collection => {
        collectionCounts[collection] = (collectionCounts[collection] || 0) + 1;
      });
    }
  });

  // Add collection tags
  Object.keys(collectionCounts).sort().forEach(collectionName => {
    tags.push({
      type: 'collection',
      label: collectionName,
      count: collectionCounts[collectionName],
      state: 'inactive'
    });
  });

  return tags;
}

function createContentPreferences(options = {}) {
  const {
    title = 'My Preferences',
    data = [],
    searchPlaceholder = 'Search your preferences',
    tags = null, // If null, will be auto-calculated from data
    onSearch = null,
    onTagClick = null,
    onCardStateChange = null,
    onCardClick = null,
    modalContainer = null
  } = options;

  // Calculate tags from data if not provided
  const calculatedTags = tags || calculateTagsFromData(data);

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

  // Function to update tag counts (will be defined later)
  const updateTagCountsInternal = () => {
    // Recalculate tag counts based on current data
    const cards = dataList.getCards();
    const data = cards.map(card => ({
      state: card.getState(),
      collections: card.getCollections()
    }));

    console.log('updateTagCountsInternal - card collections:', data.map(d => d.collections));

    const newTags = calculateTagsFromData(data);
    console.log('updateTagCountsInternal - newTags:', newTags);

    // Update existing tags with new counts
    const tagList = dataSearch.getTagList();
    const existingTags = tagList.getTags();

    existingTags.forEach(existingTag => {
      const matchingNewTag = newTags.find(nt =>
        nt.label === existingTag.getLabel() && nt.type === existingTag.getType()
      );

      if (matchingNewTag) {
        existingTag.setCount(matchingNewTag.count);

        // Hide Favorites/Hidden tags if count is 0
        if ((existingTag.getType() === 'favorites' || existingTag.getType() === 'hidden') &&
            matchingNewTag.count === 0) {
          existingTag.hide();
        } else if (existingTag.getType() === 'favorites' || existingTag.getType() === 'hidden') {
          existingTag.show();
        }
      } else {
        // Tag not found in newTags, set count to 0
        existingTag.setCount(0);

        // Hide Favorites/Hidden tags
        if (existingTag.getType() === 'favorites' || existingTag.getType() === 'hidden') {
          existingTag.hide();
        }
      }
    });

    // Add any new collection tags that don't exist yet
    const newCollectionTags = newTags.filter(newTag => {
      const exists = existingTags.some(et =>
        et.getLabel() === newTag.label && et.getType() === newTag.type
      );
      return !exists && newTag.type === 'collection' && newTag.label !== 'All';
    });

    // Add new tags in alphabetical order by finding the correct position
    newCollectionTags.forEach(newTag => {
      // Get current tags (updated in case we're adding multiple)
      const currentTags = tagList.getTags();

      // Find position to insert: after Hidden tag and in alphabetical order
      const hiddenTagIndex = currentTags.findIndex(t => t.getType() === 'hidden');
      let insertIndex = hiddenTagIndex >= 0 ? hiddenTagIndex + 1 : currentTags.length;

      // Find alphabetical position among existing collection tags
      for (let i = insertIndex; i < currentTags.length; i++) {
        const tag = currentTags[i];
        if (tag.getType() === 'collection' && tag.getLabel() !== 'All') {
          if (newTag.label.localeCompare(tag.getLabel()) < 0) {
            insertIndex = i;
            break;
          }
        }
      }

      tagList.addTagAtIndex(newTag, insertIndex);
    });

    // Remove collection tags with 0 count
    // Create array copy to avoid issues when removing during iteration
    const tagsToRemove = existingTags.filter(existingTag =>
      existingTag.getType() === 'collection' &&
      existingTag.getLabel() !== 'All' &&
      existingTag.getCount() === 0
    );

    console.log('Tags to remove:', tagsToRemove.map(t => t.getLabel()));

    tagsToRemove.forEach(tag => {
      console.log('Removing tag:', tag.getLabel());
      tagList.removeTag(tag);
    });
  };

  // Create data list first (so it's available for callbacks)
  const listWrapper = document.createElement('div');
  listWrapper.className = 'content-preferences__list';
  const dataList = new DataList(listWrapper, {
    data: data,
    onCardStateChange: (card, state) => {
      // Update tag counts when state changes
      setTimeout(() => {
        updateTagCountsInternal();
      }, 0);

      // When a card state changes, reapply the active filter if one exists
      if (activeFilter) {
        // Small delay to ensure state is updated
        setTimeout(() => {
          if (activeFilter.type === 'state') {
            dataList.filterByState(activeFilter.value);
          } else if (activeFilter.type === 'collection') {
            dataList.filterByCollection(activeFilter.value);
          }

          // Check if filter has any visible cards
          const visibleCards = Array.from(dataList.element.querySelectorAll('.data-card'))
            .filter(el => el.style.display !== 'none');

          // If no cards match the filter, reset to "All"
          if (visibleCards.length === 0) {
            activeFilter = null;
            dataList.clearFilter();

            // Set "All" tag as active and others as inactive
            const tagList = dataSearch.getTagList();
            const allTags = tagList.getTags();
            allTags.forEach(tag => {
              if (tag.getLabel().toLowerCase() === 'all') {
                tag.setState('active');
              } else {
                tag.setState('inactive');
              }
            });

            // Show all tags again
            allTags.forEach(t => t.show());
          }
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
    tags: calculatedTags,
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

      // Note: Tag has already toggled itself in handleClick()
      // So if it's now 'active', it was just activated
      // If it's now 'inactive', it was just deactivated
      const isActive = tag.getState() === 'active';

      if (isActive) {
        // Tag was just activated
        const tagLabel = tag.getLabel().toLowerCase();
        const isAllTag = tagLabel === 'all';

        // Deactivate all other tags
        allTags.forEach(t => {
          if (t !== tag) {
            t.setState('inactive');
          }
        });

        // Hide/show tags based on which tag was clicked
        if (!isAllTag) {
          // If a specific tag (not "All") was activated, hide all other tags except "All"
          allTags.forEach(t => {
            const tLabel = t.getLabel().toLowerCase();
            if (t !== tag && tLabel !== 'all') {
              t.hide();
            } else {
              t.show();
            }
          });
        } else {
          // If "All" was activated, show all tags
          allTags.forEach(t => t.show());
        }

        // Apply filter based on tag type and label
        const tagType = tag.getType();

        if (tagLabel === 'favorites') {
          activeFilter = { type: 'state', value: 'favorited' };
          dataList.filterByState('favorited');
        } else if (tagLabel === 'hidden') {
          activeFilter = { type: 'state', value: 'hidden' };
          dataList.filterByState('hidden');
        } else if (tagType === 'collection' && tagLabel !== 'all') {
          // Filter by collection name
          activeFilter = { type: 'collection', value: tag.getLabel() };
          dataList.filterByCollection(tag.getLabel());
        } else {
          // For "All" tag, show all cards
          activeFilter = null;
          dataList.clearFilter();
        }
      } else {
        // Tag was just deactivated, clear filter and show all tags and cards
        activeFilter = null;
        dataList.clearFilter();

        // Show all tags again
        allTags.forEach(t => t.show());
      }

      if (onTagClick) {
        onTagClick(tag);
      }
    }
  });
  searchWrapper.appendChild(dataSearch.element);

  // Assemble component
  container.appendChild(headlineWrapper);
  container.appendChild(searchWrapper);
  container.appendChild(listWrapper);

  // Public API
  const api = {
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
    },

    updateTagCounts() {
      updateTagCountsInternal();
    }
  };

  return api;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createContentPreferences };
}
