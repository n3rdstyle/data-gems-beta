/**
 * Tag Component
 * Interactive filter tags with multiple types and states
 * Supports two sizes: default and small
 */

class Tag {
  constructor(element, options = {}) {
    this.element = element;
    this.type = options.type || element.getAttribute('data-type') || 'collection';
    this.state = options.state || element.getAttribute('data-state') || 'inactive';
    this.size = options.size || element.getAttribute('data-size') || 'default';
    this.label = options.label || 'Collection';
    this.count = options.count !== undefined ? options.count : 0;
    this.onStateChange = options.onStateChange || null;
    this.onClick = options.onClick || null;

    this.init();
  }

  init() {
    // Set initial attributes
    this.element.setAttribute('data-type', this.type);
    this.element.setAttribute('data-state', this.state);
    this.element.setAttribute('data-size', this.size);

    // Set initial content
    this.updateContent();

    // Add click handler
    this.element.addEventListener('click', () => this.handleClick());

    // Add hover handlers for inactive states
    this.element.addEventListener('mouseenter', () => this.handleMouseEnter());
    this.element.addEventListener('mouseleave', () => this.handleMouseLeave());
  }

  /**
   * Update tag content
   */
  updateContent() {
    const iconSpan = this.element.querySelector('.tag__icon');
    const labelSpan = this.element.querySelector('.tag__label');
    const countSpan = this.element.querySelector('.tag__count');

    if (labelSpan) {
      labelSpan.textContent = this.label;
    }

    if (countSpan) {
      countSpan.textContent = this.count;
      // Hide count if it's 0
      countSpan.style.display = this.count > 0 ? '' : 'none';
    }

    // Icon is handled by CSS based on type
  }

  /**
   * Set tag state
   * @param {string} state - 'active' or 'inactive'
   */
  setState(state) {
    const validStates = ['active', 'inactive'];
    if (!validStates.includes(state)) {
      console.warn(`Invalid state: ${state}. Using 'inactive'.`);
      state = 'inactive';
    }

    this.state = state;
    this.element.setAttribute('data-state', state);

    // Trigger callback
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
   * Toggle between active and inactive
   */
  toggle() {
    const newState = this.state === 'active' ? 'inactive' : 'active';
    this.setState(newState);
  }

  /**
   * Set tag type
   * @param {string} type - 'collection', 'favorites', or 'hidden'
   */
  setType(type) {
    const validTypes = ['collection', 'favorites', 'hidden'];
    if (!validTypes.includes(type)) {
      console.warn(`Invalid type: ${type}. Using 'collection'.`);
      type = 'collection';
    }

    this.type = type;
    this.element.setAttribute('data-type', type);
  }

  /**
   * Get current type
   * @returns {string}
   */
  getType() {
    return this.type;
  }

  /**
   * Set label text
   * @param {string} label
   */
  setLabel(label) {
    this.label = label;
    this.updateContent();
  }

  /**
   * Get label text
   * @returns {string}
   */
  getLabel() {
    return this.label;
  }

  /**
   * Set count
   * @param {number} count
   */
  setCount(count) {
    this.count = count;
    this.updateContent();
  }

  /**
   * Get count
   * @returns {number}
   */
  getCount() {
    return this.count;
  }

  /**
   * Increment count
   */
  incrementCount() {
    this.count++;
    this.updateContent();
  }

  /**
   * Decrement count
   */
  decrementCount() {
    if (this.count > 0) {
      this.count--;
      this.updateContent();
    }
  }

  /**
   * Handle click event
   */
  handleClick() {
    // Default behavior: toggle state
    this.toggle();

    // Custom click handler
    if (this.onClick) {
      this.onClick(this);
    }
  }

  /**
   * Handle mouse enter (for hover effect)
   */
  handleMouseEnter() {
    if (this.state === 'inactive') {
      this.element.style.cursor = 'pointer';
    }
  }

  /**
   * Handle mouse leave
   */
  handleMouseLeave() {
    // Hover effects are handled by CSS
  }

  /**
   * Hide the tag
   */
  hide() {
    this.element.style.display = 'none';
  }

  /**
   * Show the tag
   */
  show() {
    this.element.style.display = '';
  }

  /**
   * Check if tag is visible
   * @returns {boolean}
   */
  isVisible() {
    return this.element.style.display !== 'none';
  }

  /**
   * Destroy the tag instance
   */
  destroy() {
    this.element.removeEventListener('click', this.handleClick);
    this.element.removeEventListener('mouseenter', this.handleMouseEnter);
    this.element.removeEventListener('mouseleave', this.handleMouseLeave);
  }
}

/**
 * Factory function to create tags
 */
function createTag(options = {}) {
  const tag = document.createElement('div');
  tag.className = 'tag';
  tag.setAttribute('data-type', options.type || 'collection');
  tag.setAttribute('data-state', options.state || 'inactive');
  tag.setAttribute('data-size', options.size || 'default');

  // Small tags don't have icon or count
  if (options.size === 'small') {
    tag.innerHTML = `
      <span class="tag__label text-style-body">${options.label || 'Collection'}</span>
    `;
  } else {
    tag.innerHTML = `
      <span class="tag__icon"></span>
      <span class="tag__label text-style-body">${options.label || 'Collection'}</span>
      <span class="tag__count">${options.count !== undefined ? options.count : 0}</span>
    `;
  }

  return new Tag(tag, options);
}

/**
 * Initialize all tags on page
 */
function initTags() {
  const tags = document.querySelectorAll('.tag');
  return Array.from(tags).map(tag => new Tag(tag));
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Tag, createTag, initTags };
}
