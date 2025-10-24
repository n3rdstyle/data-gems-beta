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
    this.onListChange = options.onListChange || null;
    this.onCardClick = options.onCardClick || null;
    this.modalContainer = options.modalContainer || null;

    this.init();
  }

  init() {
    // If data is provided, populate the list
    if (this.data.length > 0) {
      this.populate(this.data);
    } else {
      // Initialize existing cards in the DOM
      this.initExistingCards();
    }
  }

  /**
   * Initialize cards that already exist in the DOM
   */
  initExistingCards() {
    const cardElements = this.element.querySelectorAll('.data-card');
    cardElements.forEach(cardElement => {
      const card = new DataCard(cardElement, {
        onStateChange: (state) => this.handleCardStateChange(card, state),
        onClick: this.onCardClick ? (card) => this.onCardClick(card, this.modalContainer) : null
      });
      this.cards.push(card);
    });
  }

  /**
   * Populate the list with data
   * @param {Array} data - Array of objects with { name, state, collections }
   */
  populate(data) {
    // Clear existing cards
    this.clear();

    // Create new cards
    data.forEach(item => {
      this.addCard(item.name, item.state || 'default', item.collections || [], item.id);
    });
  }

  /**
   * Add a card to the list
   * @param {string} name - Card text
   * @param {string} state - Card state ('default', 'favorited', 'hidden')
   * @param {Array} collections - Array of collection names
   * @param {string} id - Card ID (optional)
   * @returns {DataCard} - The created card instance
   */
  addCard(name, state = 'default', collections = [], id = null) {
    // Create card without callback first
    const card = createDataCard({
      id: id,
      state: state,
      data: name,
      collections: collections,
      onClick: this.onCardClick ? (card) => this.onCardClick(card, this.modalContainer) : null
    });

    // Now set the callback after card is created
    card.onStateChange = (newState) => this.handleCardStateChange(card, newState);

    this.element.appendChild(card.element);
    this.cards.push(card);

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
  }

  /**
   * Clear filter (show all cards)
   */
  clearFilter() {
    this.cards.forEach(card => {
      card.element.style.display = '';
    });
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
