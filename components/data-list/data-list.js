/**
 * Data List Component
 * Manages a collection of data cards
 * Requires: data-card.js
 */

class DataList {
  constructor(element, options = {}) {
    this.element = element;
    this.element.classList.add('data-list');
    this.cards = [];
    this.data = options.data || [];
    this.onCardStateChange = options.onCardStateChange || null;
    this.onCardSelectionChange = options.onCardSelectionChange || null; // NEW: Selection callback
    this.onMergedInfoClick = options.onMergedInfoClick || null; // NEW: Merged info callback
    this.onListChange = options.onListChange || null;
    this.onCardClick = options.onCardClick || null;
    this.modalContainer = options.modalContainer || null;

    this.init();
  }

  init() {
    // Create empty state element
    this.emptyStateElement = document.createElement('div');
    this.emptyStateElement.className = 'data-list__empty';
    this.emptyStateElement.textContent = 'No data yet. Add your first preference below!';
    this.element.appendChild(this.emptyStateElement);

    // If data is provided, populate the list
    if (this.data.length > 0) {
      this.populate(this.data);
    } else {
      // Initialize existing cards in the DOM
      this.initExistingCards();
    }

    // Update empty state visibility
    this.updateEmptyState();
  }

  /**
   * Initialize cards that already exist in the DOM
   */
  initExistingCards() {
    const cardElements = this.element.querySelectorAll('.data-card');
    cardElements.forEach(cardElement => {
      const card = new DataCard(cardElement, {
        onStateChange: (state) => this.handleCardStateChange(card, state),
        onSelectionChange: this.onCardSelectionChange, // NEW: Pass selection callback
        onMergedInfoClick: this.onMergedInfoClick, // NEW: Pass merged info callback
        onClick: this.onCardClick ? (card) => this.onCardClick(card, this.modalContainer) : null
      });
      this.cards.push(card);
    });
  }

  /**
   * Populate the list with data
   * @param {Array} data - Array of objects with { name, state, collections, id, source, mergedFrom, topic }
   */
  populate(data) {
    // Clear existing cards
    this.clear();

    // Create new cards
    data.forEach(item => {
      this.addCard(item.name, item.state || 'default', item.collections || [], item.id, item.source, item.mergedFrom, item.topic);
    });
  }

  /**
   * Add a card to the list
   * @param {string} name - Card text
   * @param {string} state - Card state ('default', 'favorited', 'hidden')
   * @param {Array} collections - Array of collection names
   * @param {string} id - Card ID (optional)
   * @param {object} source - Source metadata (e.g., { type: 'google', url: '...' })
   * @param {Array} mergedFrom - Array of original merged cards (optional)
   * @param {string} topic - Topic/question for the preference (optional)
   * @returns {DataCard} - The created card instance
   */
  addCard(name, state = 'default', collections = [], id = null, source = null, mergedFrom = null, topic = null) {
    // Create card without callback first
    const card = createDataCard({
      id: id,
      state: state,
      data: name,
      collections: collections,
      source: source,
      mergedFrom: mergedFrom,
      topic: topic,
      onClick: this.onCardClick ? (card) => this.onCardClick(card, this.modalContainer) : null
    });

    // Now set the callbacks after card is created
    card.onStateChange = (newState) => this.handleCardStateChange(card, newState);
    card.onSelectionChange = this.onCardSelectionChange; // NEW: Set selection callback
    card.onMergedInfoClick = this.onMergedInfoClick; // NEW: Set merged info callback

    this.element.appendChild(card.element);
    this.cards.push(card);

    // Update empty state visibility
    this.updateEmptyState();

    // Trigger list change callback
    if (this.onListChange) {
      this.onListChange('add', card);
    }

    return card;
  }

  /**
   * Remove a card from the list
   * @param {DataCard} card - The card to remove
   */
  removeCard(card) {
    const index = this.cards.indexOf(card);
    if (index > -1) {
      this.cards.splice(index, 1);
      card.element.remove();
      card.destroy();

      // Update empty state visibility
      this.updateEmptyState();

      // Trigger list change callback
      if (this.onListChange) {
        this.onListChange('remove', card);
      }
    }
  }

  /**
   * Clear all cards from the list
   */
  clear() {
    this.cards.forEach(card => {
      card.element.remove();
      card.destroy();
    });
    this.cards = [];

    // Update empty state visibility
    this.updateEmptyState();

    // Trigger list change callback
    if (this.onListChange) {
      this.onListChange('clear');
    }
  }

  /**
   * Get all cards
   * @returns {Array<DataCard>}
   */
  getCards() {
    return this.cards;
  }

  /**
   * Get cards by state
   * @param {string} state - 'default', 'favorited', or 'hidden'
   * @returns {Array<DataCard>}
   */
  getCardsByState(state) {
    return this.cards.filter(card => card.getState() === state);
  }

  /**
   * Get card count
   * @returns {number}
   */
  getCount() {
    return this.cards.length;
  }

  /**
   * Set all cards to a specific state
   * @param {string} state - Target state
   */
  setAllStates(state) {
    this.cards.forEach(card => card.setState(state));
  }

  /**
   * Export list data
   * @returns {Array} - Array of {name, state} objects
   */
  export() {
    return this.cards.map(card => ({
      name: card.getData(),
      state: card.getState()
    }));
  }

  /**
   * Import list data
   * @param {Array} data - Array of {name, state} objects
   */
  import(data) {
    this.populate(data);
  }

  /**
   * Filter cards by search term
   * @param {string} searchTerm - Text to search for
   */
  filter(searchTerm) {
    const term = searchTerm.toLowerCase();
    this.cards.forEach(card => {
      const text = card.getData().toLowerCase();
      const matches = text.includes(term);

      // Show/hide based on match
      card.element.style.display = matches ? '' : 'none';
    });

    // Update empty state visibility
    this.updateEmptyState();
  }

  /**
   * Filter cards by state
   * @param {string} state - State to filter by ('favorited', 'hidden', 'default')
   */
  filterByState(state) {
    this.cards.forEach(card => {
      const cardState = card.getState();
      card.element.style.display = cardState === state ? '' : 'none';
    });

    // Update empty state visibility
    this.updateEmptyState();
  }

  /**
   * Filter cards by collection
   * @param {string} collectionName - Collection name to filter by
   */
  filterByCollection(collectionName) {
    this.cards.forEach(card => {
      const collections = card.collections || [];
      const hasCollection = collections.some(c =>
        c.toLowerCase() === collectionName.toLowerCase()
      );
      card.element.style.display = hasCollection ? '' : 'none';
    });

    // Update empty state visibility
    this.updateEmptyState();
  }

  /**
   * Filter cards that have no collections assigned
   */
  filterByUnassigned() {
    this.cards.forEach(card => {
      const collections = card.getCollections();
      const isUnassigned = !collections || collections.length === 0;
      card.element.style.display = isUnassigned ? '' : 'none';
    });

    // Update empty state visibility
    this.updateEmptyState();
  }

  /**
   * Filter cards by multiple collections (OR logic)
   * Only filters among currently visible cards (preserves other filters like search)
   * @param {Array<string>} collectionNames - Array of collection names to filter by
   */
  filterByCollections(collectionNames) {
    if (!collectionNames || collectionNames.length === 0) {
      this.clearFilter();
      return;
    }

    const lowerCaseNames = collectionNames.map(name => name.toLowerCase());
    const includesUnassigned = lowerCaseNames.includes('unassigned');

    this.cards.forEach(card => {
      // Only process cards that are currently visible (not already hidden by search)
      if (card.element.style.display !== 'none') {
        const collections = card.getCollections() || [];
        const isUnassigned = collections.length === 0;

        // Check if card matches any selected collection or unassigned
        let shouldShow = false;

        if (isUnassigned && includesUnassigned) {
          // Card has no collections and "Unassigned" is selected
          shouldShow = true;
        } else if (!isUnassigned) {
          // Card has collections - check if any match
          shouldShow = collections.some(c =>
            lowerCaseNames.includes(c.toLowerCase())
          );
        }

        // Hide card if it doesn't match any selected filter
        if (!shouldShow) {
          card.element.style.display = 'none';
        }
      }
      // Cards that are already hidden (by search) remain hidden
    });

    // Update empty state visibility
    this.updateEmptyState();
  }

  /**
   * Clear filter (show all cards)
   */
  clearFilter() {
    this.cards.forEach(card => {
      card.element.style.display = '';
    });

    // Update empty state visibility
    this.updateEmptyState();
  }

  /**
   * Sort cards alphabetically
   * @param {boolean} ascending - Sort direction
   */
  sort(ascending = true) {
    this.cards.sort((a, b) => {
      const aName = a.getData().toLowerCase();
      const bName = b.getData().toLowerCase();
      return ascending ? aName.localeCompare(bName) : bName.localeCompare(aName);
    });

    // Re-append in sorted order
    this.cards.forEach(card => {
      this.element.appendChild(card.element);
    });
  }

  /**
   * Handle card state change
   * @private
   */
  handleCardStateChange(card, state) {
    if (this.onCardStateChange) {
      this.onCardStateChange(card, state);
    }
  }

  /**
   * Update empty state visibility based on card count
   * @private
   */
  updateEmptyState() {
    if (!this.emptyStateElement) return;

    const visibleCards = this.cards.filter(card =>
      card.element.style.display !== 'none'
    );

    if (visibleCards.length === 0) {
      this.emptyStateElement.style.display = 'flex';
    } else {
      this.emptyStateElement.style.display = 'none';
    }
  }

  /**
   * Set custom empty state message
   * @param {string} message - Custom message to display when list is empty
   */
  setEmptyStateMessage(message) {
    if (this.emptyStateElement) {
      this.emptyStateElement.textContent = message;
    }
  }

  /**
   * Destroy the list and all cards
   */
  destroy() {
    this.cards.forEach(card => card.destroy());
    this.cards = [];
  }
}

// Factory function to create a data list
function createDataList(options = {}) {
  const list = document.createElement('div');
  list.className = 'data-list';

  return new DataList(list, options);
}

// Initialize all data lists on page
function initDataLists() {
  const lists = document.querySelectorAll('.data-list');
  return Array.from(lists).map(list => new DataList(list));
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DataList, createDataList, initDataLists };
}
