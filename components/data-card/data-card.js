/**
 * Data Card Component
 * Manages card states: default, favorited, hidden
 */

class DataCard {
  constructor(element, options = {}) {
    this.element = element;
    // Read state from element's data-state attribute if not provided in options
    this.state = options.state || element.getAttribute('data-state') || 'default';
    // Read data from element's text content if not provided in options
    const textElement = element.querySelector('.data-card__text');
    this.data = options.data || (textElement ? textElement.textContent : 'Preference Data');
    this.onStateChange = options.onStateChange || null;
    this.onClick = options.onClick || null;
    this.collections = options.collections || [];

    this.init();
  }

  init() {
    // Set initial state
    this.setState(this.state);

    // Set initial data (only if different from what's already there)
    if (this.data) {
      this.setData(this.data);
    }

    // Add click handler
    this.element.addEventListener('click', () => this.handleClick());
  }

  /**
   * Set the card state
   * @param {string} state - 'default', 'favorited', or 'hidden'
   */
  setState(state) {
    const validStates = ['default', 'favorited', 'hidden'];

    if (!validStates.includes(state)) {
      console.warn(`Invalid state: ${state}. Using 'default'.`);
      state = 'default';
    }

    this.state = state;
    this.element.setAttribute('data-state', state);

    // Trigger callback if provided
    if (this.onStateChange) {
      this.onStateChange(state);
    }
  }

  /**
   * Get current state
   * @returns {string}
   */
  getState() {
    return this.state;
  }

  /**
   * Toggle between states (default -> favorited -> hidden -> default)
   */
  toggleState() {
    const stateOrder = ['default', 'favorited', 'hidden'];
    const currentIndex = stateOrder.indexOf(this.state);
    const nextIndex = (currentIndex + 1) % stateOrder.length;
    this.setState(stateOrder[nextIndex]);
  }

  /**
   * Set the card text content
   * @param {string} data - Text to display
   */
  setData(data) {
    this.data = data;
    const textElement = this.element.querySelector('.data-card__text');
    if (textElement) {
      textElement.textContent = data;
    }
  }

  /**
   * Get current data
   * @returns {string}
   */
  getData() {
    return this.data;
  }

  /**
   * Handle card click
   */
  handleClick() {
    // If onClick callback is provided, use that instead of default behavior
    if (this.onClick) {
      this.onClick(this);
    } else {
      // Default behavior: toggle state
      this.toggleState();
    }
  }

  /**
   * Destroy the card instance
   */
  destroy() {
    this.element.removeEventListener('click', this.handleClick);
  }
}

// Factory function to create cards
function createDataCard(options = {}) {
  const card = document.createElement('div');
  card.className = 'data-card';
  card.setAttribute('data-state', options.state || 'default');

  card.innerHTML = `
    <div class="data-card__content">
      <p class="data-card__text">${options.data || 'Preference Data'}</p>
    </div>
  `;

  return new DataCard(card, options);
}

// Initialize all cards on page
function initDataCards() {
  const cards = document.querySelectorAll('.data-card');
  return Array.from(cards).map(card => new DataCard(card));
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DataCard, createDataCard, initDataCards };
}
