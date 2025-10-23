/**
 * Overlay Element
 * Backdrop for modals and overlays
 */

function createOverlay(options = {}) {
  const {
    opacity = 'default', // 'light', 'default', 'dark'
    fixed = false,
    visible = false,
    onClick = null,
    zIndex = 1000
  } = options;

  // Create overlay element
  const overlayElement = document.createElement('div');
  overlayElement.className = 'overlay';

  // Apply optional classes
  if (fixed) {
    overlayElement.classList.add('overlay--fixed');
  }

  if (opacity === 'light') {
    overlayElement.classList.add('overlay--light');
  } else if (opacity === 'dark') {
    overlayElement.classList.add('overlay--dark');
  }

  if (visible) {
    overlayElement.classList.add('overlay--visible');
  }

  // Set z-index
  overlayElement.style.zIndex = zIndex;

  // Add click handler
  if (onClick) {
    overlayElement.addEventListener('click', (e) => {
      // Only trigger if clicking directly on overlay, not on children
      if (e.target === overlayElement) {
        onClick(e);
      }
    });
  }

  // Public API
  return {
    element: overlayElement,

    show() {
      overlayElement.classList.add('overlay--visible');
    },

    hide() {
      overlayElement.classList.remove('overlay--visible');
    },

    toggle() {
      overlayElement.classList.toggle('overlay--visible');
    },

    isVisible() {
      return overlayElement.classList.contains('overlay--visible');
    },

    setOpacity(level) {
      overlayElement.classList.remove('overlay--light', 'overlay--dark');
      if (level === 'light') {
        overlayElement.classList.add('overlay--light');
      } else if (level === 'dark') {
        overlayElement.classList.add('overlay--dark');
      }
    },

    setZIndex(value) {
      overlayElement.style.zIndex = value;
    },

    destroy() {
      if (overlayElement.parentNode) {
        overlayElement.parentNode.removeChild(overlayElement);
      }
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createOverlay };
}
