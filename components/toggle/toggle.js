/**
 * Toggle Component
 * Switch toggle for binary on/off states
 * Requires: toggle.css
 */

function createToggle(options = {}) {
  const {
    label = '',
    active = false,
    disabled = false,
    onChange = null
  } = options;

  let isActive = active;

  // Create toggle container
  const toggle = document.createElement('div');
  toggle.className = disabled ? 'toggle toggle--disabled' : 'toggle';

  // Create track
  const track = document.createElement('div');
  track.className = isActive ? 'toggle__track toggle__track--active' : 'toggle__track';

  // Create thumb
  const thumb = document.createElement('div');
  thumb.className = 'toggle__thumb';
  track.appendChild(thumb);

  // Create label (optional)
  let labelElement = null;
  if (label) {
    labelElement = document.createElement('span');
    labelElement.className = 'toggle__label';
    labelElement.textContent = label;
  }

  // Assemble toggle
  toggle.appendChild(track);
  if (labelElement) {
    toggle.appendChild(labelElement);
  }

  // Click handler
  const handleClick = () => {
    if (disabled) return;

    isActive = !isActive;

    if (isActive) {
      track.classList.add('toggle__track--active');
    } else {
      track.classList.remove('toggle__track--active');
    }

    if (onChange) {
      onChange(isActive);
    }
  };

  toggle.addEventListener('click', handleClick);

  // Public API
  return {
    element: toggle,

    isActive() {
      return isActive;
    },

    setActive(value) {
      isActive = value;
      if (isActive) {
        track.classList.add('toggle__track--active');
      } else {
        track.classList.remove('toggle__track--active');
      }
    },

    toggle() {
      handleClick();
    },

    setDisabled(value) {
      if (value) {
        toggle.classList.add('toggle--disabled');
      } else {
        toggle.classList.remove('toggle--disabled');
      }
    },

    setLabel(newLabel) {
      if (labelElement) {
        labelElement.textContent = newLabel;
      } else if (newLabel) {
        labelElement = document.createElement('span');
        labelElement.className = 'toggle__label';
        labelElement.textContent = newLabel;
        toggle.appendChild(labelElement);
      }
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createToggle };
}
