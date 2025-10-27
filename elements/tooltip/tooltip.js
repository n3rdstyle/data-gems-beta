/**
 * Tooltip Element
 * Factory function and class for creating tooltips
 */

class Tooltip {
  constructor(element, options = {}) {
    this.element = element;
    this.text = options.text || element.getAttribute('data-tooltip') || '';
    this.position = options.position || element.getAttribute('data-tooltip-position') || 'top';
    this.container = options.container || null;

    this.init();
  }

  init() {
    // Create tooltip element if it doesn't exist
    if (!this.container) {
      this.createTooltip();
    }
  }

  createTooltip() {
    // Create container if element isn't already wrapped
    if (!this.element.parentElement.classList.contains('tooltip-container')) {
      const container = document.createElement('div');
      container.className = 'tooltip-container';
      this.element.parentNode.insertBefore(container, this.element);
      container.appendChild(this.element);
      this.container = container;
    } else {
      this.container = this.element.parentElement;
    }

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = `tooltip tooltip--${this.position}`;
    tooltip.textContent = this.text;

    this.tooltipElement = tooltip;
    this.container.appendChild(tooltip);
  }

  /**
   * Update tooltip text
   * @param {string} text - New tooltip text
   */
  setText(text) {
    this.text = text;
    if (this.tooltipElement) {
      this.tooltipElement.textContent = text;
    }
  }

  /**
   * Update tooltip position
   * @param {string} position - Position: 'top', 'top-right', 'top-left', 'bottom', 'left', 'right'
   */
  setPosition(position) {
    if (this.tooltipElement) {
      this.tooltipElement.className = `tooltip tooltip--${position}`;
    }
    this.position = position;
  }

  /**
   * Show tooltip
   */
  show() {
    if (this.tooltipElement) {
      this.tooltipElement.classList.add('tooltip--visible');
    }
  }

  /**
   * Hide tooltip
   */
  hide() {
    if (this.tooltipElement) {
      this.tooltipElement.classList.remove('tooltip--visible');
    }
  }

  /**
   * Destroy tooltip
   */
  destroy() {
    if (this.tooltipElement) {
      this.tooltipElement.remove();
    }
  }
}

/**
 * Factory function to create a tooltip
 * @param {HTMLElement} triggerElement - The element that triggers the tooltip
 * @param {Object} options - Configuration options
 * @param {string} options.text - Tooltip text content
 * @param {string} options.position - Position: 'top', 'top-right', 'top-left', 'bottom', 'left', 'right'
 * @returns {Tooltip} - Tooltip instance
 */
function createTooltip(triggerElement, options = {}) {
  return new Tooltip(triggerElement, options);
}

/**
 * Factory function to create standalone tooltip markup
 * @param {Object} options - Configuration options
 * @param {string} options.text - Tooltip text content
 * @param {string} options.position - Position: 'top', 'top-right', 'top-left', 'bottom', 'left', 'right'
 * @param {HTMLElement} options.trigger - Optional trigger element content
 * @returns {HTMLElement} - Tooltip container element
 */
function createTooltipElement(options = {}) {
  const container = document.createElement('div');
  container.className = 'tooltip-container';

  // Add trigger element if provided
  if (options.trigger) {
    container.appendChild(options.trigger);
  }

  // Create tooltip
  const tooltip = document.createElement('div');
  tooltip.className = `tooltip tooltip--${options.position || 'top'}`;
  tooltip.textContent = options.text || '';

  container.appendChild(tooltip);

  return container;
}

/**
 * Initialize all tooltips on the page with data-tooltip attribute
 */
function initTooltips() {
  const elements = document.querySelectorAll('[data-tooltip]');
  return Array.from(elements).map(element => new Tooltip(element));
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Tooltip, createTooltip, createTooltipElement, initTooltips };
}
