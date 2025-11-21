/**
 * Divider Component
 * Simple horizontal divider line
 * @returns {{ element: HTMLHRElement }} Component instance with element reference
 */
function createDivider() {
  const divider = document.createElement('hr');
  divider.className = 'divider';

  return {
    element: divider
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createDivider };
}
