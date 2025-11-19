/**
 * Calibration Component
 * Progress bar for showing calibration/loading status with tooltip
 */

function createCalibration(options = {}) {
  const {
    progress = 0, // 0-100
    width = 400,
    animated = true,
    onChange = null,
    showTooltip = true, // Option to show/hide tooltip
    showLabel = false // Option to show permanent status text above bar
  } = options;

  // Create tooltip container that wraps the calibration
  const tooltipContainer = document.createElement('div');
  tooltipContainer.className = 'tooltip-container';

  // Create status label if enabled
  let statusLabel = null;
  if (showLabel) {
    statusLabel = document.createElement('div');
    statusLabel.className = 'calibration__label';
  }

  // Create calibration container
  const calibrationElement = document.createElement('div');
  calibrationElement.className = showLabel ? 'calibration calibration--with-label' : 'calibration';
  calibrationElement.style.width = `${width}px`;

  // Create progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'calibration__progress';

  // Set initial progress
  const clampedProgress = Math.max(0, Math.min(100, progress));
  progressBar.style.width = `${clampedProgress}%`;

  calibrationElement.appendChild(progressBar);

  // Create tooltip if enabled
  let tooltipElement = null;
  if (showTooltip) {
    // Create tooltip
    tooltipElement = document.createElement('div');
    tooltipElement.className = 'tooltip tooltip--top tooltip--calibration';
  }

  // Assemble: tooltip container wraps label + calibration + tooltip
  if (statusLabel) {
    tooltipContainer.appendChild(statusLabel);
  }
  tooltipContainer.appendChild(calibrationElement);
  if (tooltipElement) {
    tooltipContainer.appendChild(tooltipElement);
  }

  // Helper function to update tooltip and label text
  const updateTooltipText = (currentProgress) => {
    const remaining = 100 - currentProgress;
    const remainingCards = Math.max(0, remaining);
    const currentCards = Math.round(currentProgress);

    // Tooltip text - detailed explanation
    let tooltipText = '';
    if (remaining > 0) {
      tooltipText = `Add ${remainingCards} more data card${remainingCards !== 1 ? 's' : ''} to complete your profile calibration and unlock personalized AI recommendations.`;
    } else {
      tooltipText = 'Profile calibration complete! Your AI experience is now fully personalized.';
    }

    // Label text - simple progress format
    const labelText = `${currentCards}/100 %`;

    // Update tooltip if exists
    if (tooltipElement) {
      tooltipElement.textContent = tooltipText;
    }

    // Update label if exists
    if (statusLabel) {
      statusLabel.textContent = labelText;
    }
  };

  // Set initial tooltip text
  updateTooltipText(clampedProgress);

  // Public API
  return {
    element: tooltipContainer,

    setProgress(value) {
      const newProgress = Math.max(0, Math.min(100, value));
      progressBar.style.width = `${newProgress}%`;
      updateTooltipText(newProgress);

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
      updateTooltipText(0);
      if (onChange) {
        onChange(0);
      }
    },

    complete() {
      progressBar.style.width = '100%';
      updateTooltipText(100);
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
        updateTooltipText(newValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          progressBar.style.width = `${target}%`;
          updateTooltipText(target);
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
