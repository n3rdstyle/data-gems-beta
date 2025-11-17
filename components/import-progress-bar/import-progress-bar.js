/**
 * Import Progress Bar Component
 * Shows import/embedding progress at top of screen
 */

function createImportProgressBar(options = {}) {
  const {
    total = 100
  } = options;

  // Create container
  const container = document.createElement('div');
  container.className = 'import-progress-bar';

  // Create fill bar
  const fill = document.createElement('div');
  fill.className = 'import-progress-bar__fill';
  container.appendChild(fill);

  // Create label
  const label = document.createElement('div');
  label.className = 'import-progress-bar__label';
  label.textContent = 'Importing data...';

  // Public API
  return {
    element: container,
    labelElement: label,

    /**
     * Update progress
     * @param {number} current - Current item count
     * @param {number} total - Total items
     */
    setProgress(current, total) {
      const percentage = Math.min(100, Math.round((current / total) * 100));
      fill.style.width = `${percentage}%`;
      label.textContent = `Importing ${current} of ${total} items...`;
    },

    /**
     * Set custom label
     */
    setLabel(text) {
      label.textContent = text;
    },

    /**
     * Mark as complete
     */
    complete() {
      fill.style.width = '100%';
      container.classList.add('import-progress-bar--complete');
      label.textContent = '✓ Import complete!';

      // Fade out after 1 second
      setTimeout(() => {
        container.style.transition = 'opacity 0.5s ease-out';
        label.style.transition = 'opacity 0.5s ease-out';
        container.style.opacity = '0';
        label.style.opacity = '0';

        // Remove from DOM after fade
        setTimeout(() => {
          container.remove();
          label.remove();
        }, 500);
      }, 1000);
    },

    /**
     * Show progress bar
     */
    show() {
      document.body.appendChild(container);
      document.body.appendChild(label);
    },

    /**
     * Remove progress bar
     */
    remove() {
      container.remove();
      label.remove();
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createImportProgressBar };
}
