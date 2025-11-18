/**
 * Content Preferences Component
 * Composite component combining headline, data search, and data list
 */

/**
 * Calculate tags with counts from data
 * @param {Array} data - Array of data items with collections
 * @returns {Object} Object with mainTags and collectionTags arrays
 */
function calculateTagsFromData(data) {
  const mainTags = [];
  const collectionTags = [];

  // Count total cards
  const totalCount = data.length;

  // Count favorited cards
  const favoritedCount = data.filter(item => item.state === 'favorited').length;

  // Count hidden cards
  const hiddenCount = data.filter(item => item.state === 'hidden').length;

  // Count unassigned cards (no collections or empty collections array)
  const unassignedCount = data.filter(item =>
    !item.collections || !Array.isArray(item.collections) || item.collections.length === 0
  ).length;

  // Count collections
  const collectionCounts = {};
  data.forEach(item => {
    if (item.collections && Array.isArray(item.collections)) {
      item.collections.forEach(collection => {
        collectionCounts[collection] = (collectionCounts[collection] || 0) + 1;
      });
    }
  });

  // Add "All" tag (with dropdown icon for collections)
  mainTags.push({
    type: 'collection',
    label: 'All',
    count: totalCount,
    state: 'active',
    showIcon: true,
    iconName: 'chevronDown'
  });

  // Add "Favorites" tag only if there are favorited cards
  if (favoritedCount > 0) {
    mainTags.push({
      type: 'favorites',
      label: 'Favorites',
      count: favoritedCount,
      state: 'inactive'
    });
  }

  // Add "Hidden" tag only if there are hidden cards
  if (hiddenCount > 0) {
    mainTags.push({
      type: 'hidden',
      label: 'Hidden',
      count: hiddenCount,
      state: 'inactive'
    });
  }

  // Add "Unassigned" tag only if there are unassigned cards
  if (unassignedCount > 0) {
    mainTags.push({
      type: 'unassigned',
      label: 'Unassigned',
      count: unassignedCount,
      state: 'inactive'
    });
  }

  // Store collection tags separately (not displayed directly)
  Object.keys(collectionCounts).sort().forEach(collectionName => {
    collectionTags.push({
      type: 'collection',
      label: collectionName,
      count: collectionCounts[collectionName],
      state: 'inactive'
    });
  });

  // Add "Unassigned" to collection tags if there are unassigned cards
  if (unassignedCount > 0) {
    collectionTags.push({
      type: 'unassigned',
      label: 'Unassigned',
      count: unassignedCount,
      state: 'inactive'
    });
  }

  return {
    mainTags,
    collectionTags
  };
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
    onCardSelectionChange = null, // NEW: Selection callback
    onMergedInfoClick = null, // NEW: Merged info callback
    onCardClick = null,
    onListChange = null, // Callback when list changes (add/remove/clear)
    modalContainer = null,
    onSearchStateChange = null // Callback when search is activated/deactivated
  } = options;

  // Calculate tags from data if not provided
  const tagData = tags ? { mainTags: tags, collectionTags: [] } : calculateTagsFromData(data);
  let collectionTags = tagData.collectionTags;

  // Create main container
  const container = document.createElement('div');
  container.className = 'content-preferences';

  // Function to open collection filter modal
  const openCollectionFilterModal = () => {
    // If search is active, calculate collections only from visible (searched) cards
    let availableCollections = collectionTags;
    if (activeSearchTerm) {
      // Temporarily show all search results (remove collection filter)
      // to calculate all available collections from search results
      const allCards = dataList.getCards();

      // First, apply only search filter to get all search results
      const searchResults = allCards.filter(card => {
        const text = card.getData().toLowerCase();
        return text.includes(activeSearchTerm.toLowerCase());
      });

      // Calculate collection counts from search results only
      const collectionCounts = {};
      let unassignedCount = 0;

      searchResults.forEach(card => {
        const collections = card.getCollections();
        if (collections && Array.isArray(collections) && collections.length > 0) {
          collections.forEach(collection => {
            collectionCounts[collection] = (collectionCounts[collection] || 0) + 1;
          });
        } else {
          // Card has no collections - count as unassigned
          unassignedCount++;
        }
      });

      // Create filtered collection list
      availableCollections = Object.keys(collectionCounts).sort().map(collectionName => ({
        type: 'collection',
        label: collectionName,
        count: collectionCounts[collectionName],
        state: 'inactive'
      }));

      // Add "Unassigned" option if there are unassigned cards
      if (unassignedCount > 0) {
        availableCollections.push({
          type: 'unassigned',
          label: 'Unassigned',
          count: unassignedCount,
          state: 'inactive'
        });
      }
    }

    // Create and show collection filter modal
    const modal = createCollectionFilterModal({
      collections: availableCollections,
      selectedCollections: activeFilter && activeFilter.type === 'collections' ? activeFilter.value : [],
      onApply: (selectedCollections) => {
        if (selectedCollections.length > 0) {
          // Filter by selected collections
          activeFilter = { type: 'collections', value: selectedCollections };

          // If search is active, first reapply search to show all search results
          // then apply collection filter on top of that
          if (activeSearchTerm) {
            dataList.filter(activeSearchTerm);
          }

          // Filter by collections (this now preserves search filter automatically)
          dataList.filterByCollections(selectedCollections);

          // Count visible cards
          const visibleCards = dataList.getCards().filter(card =>
            card.element.style.display !== 'none'
          );
          const visibleCount = visibleCards.length;

          // Update headline tag button label
          if (selectedCollections.length === 1) {
            headline.setTagButtonLabel(selectedCollections[0], visibleCount);
          } else {
            headline.setTagButtonLabel('Multiple Tags', visibleCount);
          }

          // Update "All" tag in tag list
          const allTag = tagList.getTags().find(t => t.getLabel() === 'All' || t.showIcon);
          if (allTag) {
            if (selectedCollections.length === 1) {
              allTag.setLabel(selectedCollections[0]);
            } else {
              allTag.setLabel('Multiple Tags');
            }
            allTag.setCount(visibleCount);
          }
        } else {
          // No collections selected
          activeFilter = null;

          // If search is active, reapply search only, otherwise clear all filters
          if (activeSearchTerm) {
            dataList.filter(activeSearchTerm);
          } else {
            dataList.clearFilter();
          }

          // Count visible cards
          const visibleCards = dataList.getCards().filter(card =>
            card.element.style.display !== 'none'
          );
          const visibleCount = visibleCards.length;

          // Reset headline tag button label
          headline.setTagButtonLabel('All', visibleCount);

          // Reset "All" tag in tag list
          const allTag = tagList.getTags().find(t => t.showIcon);
          if (allTag) {
            allTag.setLabel('All');
            allTag.setCount(visibleCount);
          }
        }
      },
      onClose: () => {
        // Modal closed without applying - do nothing
      }
    });

    // Create overlay
    const overlay = createOverlay({ opacity: 0.5 });
    overlay.element.appendChild(modal.element);

    // Set overlay reference in modal so it can clean up
    modal.setOverlay(overlay.element);

    // Close modal when clicking on overlay background
    overlay.element.addEventListener('click', (e) => {
      if (e.target === overlay.element) {
        modal.hide();
      }
    });

    if (modalContainer) {
      modalContainer.appendChild(overlay.element);
    } else {
      container.appendChild(overlay.element);
    }

    // Show overlay and modal
    overlay.show();
    modal.show();
  };

  // Create headline with integrated search
  const headlineWrapper = document.createElement('div');
  headlineWrapper.className = 'content-preferences__headline';

  // Get initial count from "All" tag
  const initialAllTag = tagData.mainTags.find(tag => tag.label === 'All');
  const initialCount = initialAllTag ? initialAllTag.count : data.length;

  const headline = createHeadline({
    text: title,
    showIcon: true,
    iconName: 'search',
    searchPlaceholder: searchPlaceholder,
    showTagButton: true,
    tagButtonLabel: 'All',
    tagButtonCount: initialCount,
    onTagButtonClick: () => {
      openCollectionFilterModal();
    },
    onSearch: (value) => {
      // Filter data list based on search (live filtering)
      if (onSearch) {
        onSearch(value);
      }
      if (value) {
        dataList.filter(value);
        activeSearchTerm = value;

        // If there's an active collection filter, reapply it on top of search results
        if (activeFilter && activeFilter.type === 'collections') {
          dataList.filterByCollections(activeFilter.value);
        }

        // Update tag button count with visible cards
        const visibleCards = dataList.getCards().filter(card =>
          card.element.style.display !== 'none'
        );
        headline.setTagButtonCount(visibleCards.length);

        // Notify parent that search was activated
        if (onSearchStateChange && !activeSearchTerm) {
          onSearchStateChange(true);
        }
      } else {
        activeSearchTerm = null;

        // Notify parent that search was deactivated
        if (onSearchStateChange) {
          onSearchStateChange(false);
        }

        // If no search term but there's an active tag filter, reapply it
        if (activeFilter) {
          if (activeFilter.type === 'state') {
            dataList.filterByState(activeFilter.value);
          } else if (activeFilter.type === 'collections') {
            dataList.filterByCollections(activeFilter.value);
          }
        } else {
          dataList.clearFilter();
        }

        // Update tag button count
        const visibleCards = dataList.getCards().filter(card =>
          card.element.style.display !== 'none'
        );
        headline.setTagButtonCount(visibleCards.length);
      }
    }
  });
  headlineWrapper.appendChild(headline.element);

  // Track active filter
  let activeFilter = null;

  // Store reference to the "All" tag
  let allTag = null;

  // Track active search term
  let activeSearchTerm = null;

  // Store reference to tag list wrapper for show/hide
  let tagListWrapper = null;


  // Function to update tag counts (will be defined later)
  const updateTagCountsInternal = () => {
    // Recalculate tag counts based on current data
    const cards = dataList.getCards();
    const data = cards.map(card => ({
      state: card.getState(),
      collections: card.getCollections()
    }));

    const newTagData = calculateTagsFromData(data);
    collectionTags = newTagData.collectionTags; // Update collection tags list

    // Update existing tags with new counts
    const existingTags = tagList.getTags();

    existingTags.forEach(existingTag => {
      const matchingNewTag = newTagData.mainTags.find(nt =>
        nt.label === existingTag.getLabel() && nt.type === existingTag.getType()
      );

      if (matchingNewTag) {
        existingTag.setCount(matchingNewTag.count);

        // Hide Favorites/Hidden/Unassigned tags if count is 0
        if ((existingTag.getType() === 'favorites' || existingTag.getType() === 'hidden' || existingTag.getType() === 'unassigned') &&
            matchingNewTag.count === 0) {
          existingTag.hide();
        } else if (existingTag.getType() === 'favorites' || existingTag.getType() === 'hidden' || existingTag.getType() === 'unassigned') {
          existingTag.show();
        }
      } else {
        // Tag not found in newTags, set count to 0
        existingTag.setCount(0);

        // Hide Favorites/Hidden/Unassigned tags if count is 0
        if (existingTag.getType() === 'favorites' || existingTag.getType() === 'hidden' || existingTag.getType() === 'unassigned') {
          existingTag.hide();
        }
      }
    });

    // Add Favorites/Hidden/Unassigned tags if they don't exist yet but have count > 0
    const needsFavoritesTag = !existingTags.some(t => t.getType() === 'favorites') &&
                              newTagData.mainTags.some(nt => nt.type === 'favorites' && nt.count > 0);
    const needsHiddenTag = !existingTags.some(t => t.getType() === 'hidden') &&
                           newTagData.mainTags.some(nt => nt.type === 'hidden' && nt.count > 0);
    const needsUnassignedTag = !existingTags.some(t => t.getType() === 'unassigned') &&
                               newTagData.mainTags.some(nt => nt.type === 'unassigned' && nt.count > 0);

    if (needsFavoritesTag) {
      const favTag = newTagData.mainTags.find(nt => nt.type === 'favorites');
      // Insert after "All" tag (index 1)
      tagList.addTagAtIndex({ ...favTag, variant: 'card' }, 1);
    }

    if (needsHiddenTag) {
      const hiddenTag = newTagData.mainTags.find(nt => nt.type === 'hidden');
      // Insert after "All" and "Favorites" tags
      const insertIndex = existingTags.some(t => t.getType() === 'favorites') ? 2 : 1;
      tagList.addTagAtIndex({ ...hiddenTag, variant: 'card' }, insertIndex);
    }

    if (needsUnassignedTag) {
      const unassignedTag = newTagData.mainTags.find(nt => nt.type === 'unassigned');
      // Insert after "All", "Favorites", and "Hidden" tags
      let insertIndex = 1;
      if (existingTags.some(t => t.getType() === 'favorites')) insertIndex++;
      if (existingTags.some(t => t.getType() === 'hidden')) insertIndex++;
      tagList.addTagAtIndex({ ...unassignedTag, variant: 'card' }, insertIndex);
    }

    // If there's an active collection filter, update the "All" tag accordingly
    if (activeFilter && activeFilter.type === 'collections' && allTag) {
      const visibleCards = dataList.getCards().filter(card =>
        card.element.style.display !== 'none'
      );
      allTag.setCount(visibleCards.length);
    } else if (allTag) {
      // No filter active, show total count
      allTag.setCount(dataList.getCards().length);
    }
  };

  // Create data list first (so it's available for callbacks)
  const listWrapper = document.createElement('div');
  listWrapper.className = 'content-preferences__list';
  const dataList = new DataList(listWrapper, {
    data: data,
    onListChange: (action, card) => {
      // Forward list change event to parent
      if (onListChange) {
        onListChange(action, card);
      }
    },
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
    onCardSelectionChange: onCardSelectionChange, // NEW: Pass selection callback
    onMergedInfoClick: onMergedInfoClick, // NEW: Pass merged info callback
    onCardClick: onCardClick,
    modalContainer: modalContainer
  });


  // Create tag list (without search field)
  tagListWrapper = document.createElement('div');
  tagListWrapper.className = 'content-preferences__tags';
  const tagList = createTagList({
    tags: tagData.mainTags.map(tag => ({ ...tag, variant: 'card' })),
    onTagClick: (tag) => {
      const tagLabel = tag.getLabel().toLowerCase();
      const isAllTag = tag === allTag;

      // If "All" tag was already active (now inactive after toggle), open collection filter modal
      // If it was inactive (now active after toggle), just show all cards normally
      const wasActive = tag.getState() === 'inactive'; // After toggle, inactive means it was active before
      if (isAllTag && collectionTags.length > 0 && wasActive) {
        // Prevent default toggle behavior - keep it active
        tag.setState('active');

        // Create and show collection filter modal
        const modal = createCollectionFilterModal({
          collections: collectionTags,
          selectedCollections: activeFilter && activeFilter.type === 'collections' ? activeFilter.value : [],
          onApply: (selectedCollections) => {
            if (selectedCollections.length > 0) {
              // Filter by selected collections
              activeFilter = { type: 'collections', value: selectedCollections };
              dataList.filterByCollections(selectedCollections);

              // Update "All" tag label and count
              const visibleCards = dataList.getCards().filter(card =>
                card.element.style.display !== 'none'
              );
              const newCount = visibleCards.length;

              if (selectedCollections.length === 1) {
                // Single collection: show collection name
                tag.setLabel(selectedCollections[0]);
              } else {
                // Multiple collections: show "Multiple Tags"
                tag.setLabel('Multiple Tags');
              }
              tag.setCount(newCount);
            } else {
              // No collections selected, show all
              activeFilter = null;
              dataList.clearFilter();

              // Reset "All" tag to default
              tag.setLabel('All');
              tag.setCount(dataList.getCards().length);
            }
          },
          onClose: () => {
            // Modal closed without applying - do nothing
          }
        });

        // Create overlay
        const overlay = createOverlay({ opacity: 0.5 });
        overlay.element.appendChild(modal.element);

        // Set overlay reference in modal so it can clean up
        modal.setOverlay(overlay.element);

        // Close modal when clicking on overlay background
        overlay.element.addEventListener('click', (e) => {
          if (e.target === overlay.element) {
            modal.hide();
          }
        });

        if (modalContainer) {
          modalContainer.appendChild(overlay.element);
        } else {
          container.appendChild(overlay.element);
        }

        // Show overlay and modal
        overlay.show();
        modal.show();

        return; // Don't execute normal tag logic
      }

      // Handle filtering by tag type
      const allTags = tagList.getTags();

      // Note: Tag has already toggled itself in handleClick()
      // So if it's now 'active', it was just activated
      // If it's now 'inactive', it was just deactivated
      const isActive = tag.getState() === 'active';

      if (isActive) {
        // Tag was just activated
        // Deactivate all other tags
        allTags.forEach(t => {
          if (t !== tag) {
            t.setState('inactive');
          }
        });

        // Apply filter based on tag type and label
        if (tagLabel === 'favorites') {
          activeFilter = { type: 'state', value: 'favorited' };
          dataList.filterByState('favorited');

          // Count visible (favorited) cards
          const visibleCards = dataList.getCards().filter(card =>
            card.element.style.display !== 'none'
          );

          // Update headline tag button
          headline.setTagButtonLabel('Favorites', visibleCards.length);

          // Reset "All" tag to default when switching to Favorites
          if (allTag) {
            allTag.setLabel('All');
            allTag.setCount(dataList.getCards().length);
          }
        } else if (tagLabel === 'hidden') {
          activeFilter = { type: 'state', value: 'hidden' };
          dataList.filterByState('hidden');

          // Count visible (hidden) cards
          const visibleCards = dataList.getCards().filter(card =>
            card.element.style.display !== 'none'
          );

          // Update headline tag button
          headline.setTagButtonLabel('Hidden', visibleCards.length);

          // Reset "All" tag to default when switching to Hidden
          if (allTag) {
            allTag.setLabel('All');
            allTag.setCount(dataList.getCards().length);
          }
        } else if (tagLabel === 'unassigned') {
          activeFilter = { type: 'unassigned', value: true };
          dataList.filterByUnassigned();

          // Count visible (unassigned) cards
          const visibleCards = dataList.getCards().filter(card =>
            card.element.style.display !== 'none'
          );

          // Update headline tag button
          headline.setTagButtonLabel('Unassigned', visibleCards.length);

          // Reset "All" tag to default when switching to Unassigned
          if (allTag) {
            allTag.setLabel('All');
            allTag.setCount(dataList.getCards().length);
          }
        } else {
          // For "All" tag without collections, show all cards
          activeFilter = null;
          dataList.clearFilter();

          // Update headline tag button
          headline.setTagButtonLabel('All', dataList.getCards().length);

          // Reset "All" tag to default
          if (allTag) {
            allTag.setLabel('All');
            allTag.setCount(dataList.getCards().length);
          }
        }
      } else {
        // Tag was just deactivated
        // Check if any other tag is still active
        const hasActiveTag = allTags.some(t => t.getState() === 'active');

        if (!hasActiveTag) {
          // No tag is active, activate "All" tag
          const allTag = allTags.find(t => t.getLabel().toLowerCase() === 'all');
          if (allTag) {
            allTag.setState('active');
          }
        }

        // Clear filter and show all cards
        activeFilter = null;
        dataList.clearFilter();

        // Update headline tag button
        headline.setTagButtonLabel('All', dataList.getCards().length);
      }

      if (onTagClick) {
        onTagClick(tag);
      }
    }
  });
  tagListWrapper.appendChild(tagList.element);

  // Store reference to "All" tag for later updates
  allTag = tagList.getTags().find(t =>
    t.getType() === 'collection' && (t.getLabel() === 'All' || t.showIcon)
  );

  // Assemble component
  container.appendChild(headlineWrapper);
  // container.appendChild(tagListWrapper); // Tag list removed per user request
  container.appendChild(listWrapper);

  // Public API
  const api = {
    element: container,

    getHeadline() {
      return headline;
    },

    getTagList() {
      return tagList;
    },

    getDataList() {
      return dataList;
    },

    setTitle(newTitle) {
      headline.setText(newTitle);
    },

    addCard(name, state = 'default', collections = [], id = null, source = null, mergedFrom = null, topic = null) {
      return dataList.addCard(name, state, collections, id, source, mergedFrom, topic);
    },

    removeCard(card) {
      dataList.removeCard(card);
    },

    openSearch() {
      headline.expandSearch();
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
