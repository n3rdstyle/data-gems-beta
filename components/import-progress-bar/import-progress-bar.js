/**
 * Import Progress Bar Component
 * Shows import/embedding progress at top of screen
 */

function createImportProgressBar(options = {}) {
  const {
    total = 100
  } = options;

  // Create tooltip container wrapper
  const tooltipContainer = document.createElement('div');
  tooltipContainer.className = 'tooltip-container';

  // Create container
  const container = document.createElement('div');
  container.className = 'import-progress-bar';

  // Create fill bar
  const fill = document.createElement('div');
  fill.className = 'import-progress-bar__fill';
  container.appendChild(fill);

  // Create tooltip instead of permanent label
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip tooltip--bottom tooltip--import';
  tooltip.textContent = 'Importing data...';

  // Assemble: tooltip container wraps progress bar + tooltip
  tooltipContainer.appendChild(container);
  tooltipContainer.appendChild(tooltip);

  // Public API
  return {
    element: tooltipContainer,
    labelElement: tooltip, // Keep same name for backward compatibility

    /**
     * Update progress
     * @param {number} current - Current item count
     * @param {number} total - Total items
     */
    setProgress(current, total) {
      const percentage = Math.min(100, Math.round((current / total) * 100));
      fill.style.width = `${percentage}%`;
      tooltip.textContent = `Importing ${current} of ${total} items...`;
    },

    /**
     * Set custom label
     */
    setLabel(text) {
      tooltip.textContent = text;
    },

    /**
     * Mark as complete
     */
    complete() {
      fill.style.width = '100%';
      container.classList.add('import-progress-bar--complete');
      tooltip.textContent = '✓ Import complete!';

      // Fade out after 1 second
      setTimeout(() => {
        tooltipContainer.style.transition = 'opacity 0.5s ease-out';
        tooltipContainer.style.opacity = '0';

        // Remove from DOM after fade
        setTimeout(() => {
          tooltipContainer.remove();
        }, 500);
      }, 1000);
    },

    /**
     * Show progress bar
     */
    show() {
      document.body.appendChild(tooltipContainer);
    },

    /**
     * Remove progress bar
     */
    remove() {
      tooltipContainer.remove();
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createImportProgressBar };
}
