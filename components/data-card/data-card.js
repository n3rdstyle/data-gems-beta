/**
 * Data Card Component
 * Manages card states: default, favorited, hidden
 */

class DataCard {
  constructor(element, options = {}) {
    this.element = element;
    // Read state from element's data-state attribute if not provided in options
    this.state = options.state || element.getAttribute('data-state') || 'default';
    // Read value from element's text content if not provided in options
    const textElement = element.querySelector('.data-card__text');
    this.value = options.value || options.data || (textElement ? textElement.textContent : 'Preference Data');
    this.id = options.id || element.getAttribute('data-id') || null;
    this.onStateChange = options.onStateChange || null;
    this.onClick = options.onClick || null;
    this.onSelectionChange = options.onSelectionChange || null; // NEW: Selection change callback
    this.collections = options.collections || [];
    this.source = options.source || null; // Track data source (e.g., { type: 'google', url: '...' })
    this.mergedFrom = options.mergedFrom || null; // NEW: Track if card is merged from others
    this.onMergedInfoClick = options.onMergedInfoClick || null; // NEW: Callback for merged info click
    this.selected = false; // NEW: Selection state

    this.init();
  }

  init() {
    // Set initial state
    this.setState(this.state);

    // Set data-id attribute
    if (this.id) {
      this.element.setAttribute('data-id', this.id);
    }

    // Set initial value (only if different from what's already there)
    if (this.value) {
      this.setValue(this.value);
    }

    // Add source info icon if source is present
    this.addSourceInfo();

    // Add merged info icon if card was merged
    this.addMergedInfo();

    // Create action icons container
    this.createActionIcons();

    // Add click handler
    this.element.addEventListener('click', (e) => {
      // Don't trigger card click if clicking on action icons or info icons
      if (e.target.closest('.data-card__actions') ||
          e.target.closest('.data-card__source-info') ||
          e.target.closest('.data-card__merged-info')) {
        return;
      }
      this.handleClick();
    });
  }

  /**
   * Add source info icon with tooltip
   */
  addSourceInfo() {
    if (!this.source || !this.source.type) {
      return;
    }

    const contentElement = this.element.querySelector('.data-card__content');
    if (!contentElement) return;

    // Get source label
    let sourceLabel = 'External Source';
    if (this.source.type === 'google') {
      sourceLabel = 'Integrated via Google';
    } else if (this.source.type === 'notion') {
      sourceLabel = 'Integrated via Notion';
    }

    // Create info icon container
    const sourceInfo = document.createElement('div');
    sourceInfo.className = 'data-card__source-info';

    // Create tooltip container
    const tooltipContainer = document.createElement('div');
    tooltipContainer.className = 'tooltip-container';

    // Create info icon
    const infoIcon = document.createElement('div');
    infoIcon.className = 'data-card__source-icon';
    infoIcon.innerHTML = ICONS.info;
    infoIcon.setAttribute('aria-label', sourceLabel);

    // Create tooltip using the design system tooltip component
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip tooltip--top-right';
    tooltip.textContent = sourceLabel;

    tooltipContainer.appendChild(infoIcon);
    tooltipContainer.appendChild(tooltip);
    sourceInfo.appendChild(tooltipContainer);
    contentElement.appendChild(sourceInfo);
  }

  /**
   * Add merged info icon with clickable link
   */
  addMergedInfo() {
    if (!this.mergedFrom || !Array.isArray(this.mergedFrom) || this.mergedFrom.length === 0) {
      return;
    }

    const contentElement = this.element.querySelector('.data-card__content');
    if (!contentElement) return;

    const count = this.mergedFrom.length;
    const label = `Merged from ${count} original card${count > 1 ? 's' : ''}`;

    // Create info icon container
    const mergedInfo = document.createElement('div');
    mergedInfo.className = 'data-card__merged-info';

    // Create tooltip container
    const tooltipContainer = document.createElement('div');
    tooltipContainer.className = 'tooltip-container';

    // Create info icon (clickable)
    const infoIcon = document.createElement('div');
    infoIcon.className = 'data-card__merged-icon';
    infoIcon.innerHTML = ICONS.info;
    infoIcon.setAttribute('aria-label', label);
    infoIcon.style.cursor = 'pointer';

    // Create tooltip with clickable text
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip tooltip--top-right';

    const tooltipText = document.createElement('span');
    tooltipText.textContent = label;

    const viewLink = document.createElement('span');
    viewLink.textContent = ' (click to view)';
    viewLink.style.textDecoration = 'underline';
    viewLink.style.cursor = 'pointer';

    tooltip.appendChild(tooltipText);
    tooltip.appendChild(viewLink);

    // Add click handler
    const handleClick = (e) => {
      e.stopPropagation();
      if (this.onMergedInfoClick) {
        this.onMergedInfoClick(this.mergedFrom, this);
      }
    };

    infoIcon.addEventListener('click', handleClick);
    tooltip.addEventListener('click', handleClick);

    tooltipContainer.appendChild(infoIcon);
    tooltipContainer.appendChild(tooltip);
    mergedInfo.appendChild(tooltipContainer);
    contentElement.appendChild(mergedInfo);
  }

  /**
   * Create action icons (favorite and hidden)
   */
  createActionIcons() {
    const contentElement = this.element.querySelector('.data-card__content');
    if (!contentElement) return;

    // Create actions container
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'data-card__actions';

    // Build action icons based on current state
    this.updateActionIcons(actionsContainer);

    contentElement.appendChild(actionsContainer);
  }

  /**
   * Update action icons based on current state
   */
  updateActionIcons(container = null) {
    const actionsContainer = container || this.element.querySelector('.data-card__actions');
    if (!actionsContainer) return;

    // Clear existing icons
    actionsContainer.innerHTML = '';

    // Default state: show hidden, heart, and select icons (outline)
    if (this.state === 'default') {
      this.addIconButton(actionsContainer, 'select', this.selected, () => {
        this.toggleSelection();
      });
      this.addIconButton(actionsContainer, 'hidden', false, () => {
        this.setState('hidden');
        this.updateActionIcons();
      });
      this.addIconButton(actionsContainer, 'heart', false, () => {
        this.setState('favorited');
        this.updateActionIcons();
      });
    }
    // Favorited state: show select and heart icons
    else if (this.state === 'favorited') {
      this.addIconButton(actionsContainer, 'select', this.selected, () => {
        this.toggleSelection();
      });
      this.addIconButton(actionsContainer, 'heart', true, () => {
        this.setState('default');
        this.updateActionIcons();
      });
    }
    // Hidden state: show only hidden icon (filled) - no select in hidden state
    else if (this.state === 'hidden') {
      this.addIconButton(actionsContainer, 'hidden', true, () => {
        this.setState('default');
        this.updateActionIcons();
      });
    }
  }

  /**
   * Add an icon button to the container
   */
  addIconButton(container, iconName, filled, onClick) {
    const button = document.createElement('button');
    button.className = 'data-card__icon-button';
    button.setAttribute('aria-label', iconName);

    // Get icon from ICONS system
    const iconKey = filled ? `${iconName}Filled` : iconName;
    const iconSVG = typeof ICONS !== 'undefined' ? ICONS[iconKey] : null;

    if (iconSVG) {
      button.innerHTML = iconSVG;
    }

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      onClick();
    });

    container.appendChild(button);
  }

  /**
   * Set the card state
   * @param {string} state - 'default', 'favorited', or 'hidden'
   */
  setState(state) {
    const validStates = ['default', 'favorited', 'hidden'];

    if (!validStates.includes(state)) {
      state = 'default';
    }

    this.state = state;
    this.element.setAttribute('data-state', state);

    // Update action icons to reflect new state
    this.updateActionIcons();

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
   * @param {string} value - Text to display
   */
  setValue(value) {
    this.value = value;
    const textElement = this.element.querySelector('.data-card__text');
    if (textElement) {
      textElement.textContent = value;
    }
  }

  /**
   * Get current value
   * @returns {string}
   */
  getValue() {
    return this.value;
  }

  /**
   * Get card ID
   * @returns {string}
   */
  getId() {
    return this.id;
  }

  /**
   * Legacy method - for backward compatibility
   * @deprecated Use setValue instead
   */
  setData(data) {
    return this.setValue(data);
  }

  /**
   * Legacy method - for backward compatibility
   * @deprecated Use getValue instead
   */
  getData() {
    return this.getValue();
  }

  /**
   * Get collections
   * @returns {Array}
   */
  getCollections() {
    return this.collections || [];
  }

  /**
   * Set collections
   * @param {Array} collections - Array of collection names
   */
  setCollections(collections) {
    this.collections = collections || [];
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
   * Toggle selection state
   */
  toggleSelection() {
    this.selected = !this.selected;
    this.element.setAttribute('data-selected', this.selected.toString());

    // Update visual state
    if (this.selected) {
      this.element.classList.add('data-card--selected');
    } else {
      this.element.classList.remove('data-card--selected');
    }

    // Update action icons to reflect new selection state
    this.updateActionIcons();

    // Trigger callback if provided
    if (this.onSelectionChange) {
      this.onSelectionChange(this.selected, this);
    }
  }

  /**
   * Set selection state
   * @param {boolean} selected - Whether card should be selected
   */
  setSelected(selected) {
    if (this.selected !== selected) {
      this.toggleSelection();
    }
  }

  /**
   * Get selection state
   * @returns {boolean}
   */
  isSelected() {
    return this.selected;
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

  if (options.id) {
    card.setAttribute('data-id', options.id);
  }

  card.innerHTML = `
    <div class="data-card__content">
      <p class="data-card__text text-style-body-medium">${options.value || options.data || 'Preference Data'}</p>
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
