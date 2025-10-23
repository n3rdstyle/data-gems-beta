/**
 * Headline Component
 * Creates a section headline/title
 */

function createHeadline(options = {}) {
  const {
    text = 'Headline'
  } = options;

  // Create headline element
  const headlineElement = document.createElement('div');
  headlineElement.className = 'headline text-style-h2';
  headlineElement.textContent = text;

  // Public API
  return {
    element: headlineElement,

    getText() {
      return headlineElement.textContent;
    },

    setText(newText) {
      headlineElement.textContent = newText;
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createHeadline };
}
