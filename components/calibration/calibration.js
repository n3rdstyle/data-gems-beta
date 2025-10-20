/**
 * Calibration Component
 * Progress bar for showing calibration/loading status
 */

function createCalibration(options = {}) {
  const {
    progress = 0, // 0-100
    width = 400,
    animated = true,
    onChange = null
  } = options;

  // Create calibration container
  const calibrationElement = document.createElement('div');
  calibrationElement.className = 'calibration';
  calibrationElement.style.width = `${width}px`;

  // Create progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'calibration__progress';

  // Set initial progress
  const clampedProgress = Math.max(0, Math.min(100, progress));
  progressBar.style.width = `${clampedProgress}%`;

  calibrationElement.appendChild(progressBar);

  // Public API
  return {
    element: calibrationElement,

    setProgress(value) {
      const newProgress = Math.max(0, Math.min(100, value));
      progressBar.style.width = `${newProgress}%`;

      if (onChange) {
        onChange(newProgress);
      }
    },

    getProgress() {
      return parseFloat(progressBar.style.width) || 0;
    },

    setWidth(newWidth) {
      calibrationElement.style.width = `${newWidth}px`;
    },

    getWidth() {
      return parseInt(calibrationElement.style.width) || width;
    },

    reset() {
      progressBar.style.width = '0%';
      if (onChange) {
        onChange(0);
      }
    },

    complete() {
      progressBar.style.width = '100%';
      if (onChange) {
        onChange(100);
      }
    },

    // Animate progress from current to target
    animateTo(targetProgress, duration = 1000) {
      const target = Math.max(0, Math.min(100, targetProgress));
      const current = this.getProgress();
      const difference = target - current;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const eased = 1 - Math.pow(1 - progress, 3);
        const newValue = current + (difference * eased);

        progressBar.style.width = `${newValue}%`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          progressBar.style.width = `${target}%`;
          if (onChange) {
            onChange(target);
          }
        }
      };

      if (animated !== false) {
        requestAnimationFrame(animate);
      } else {
        this.setProgress(target);
      }
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createCalibration };
}
