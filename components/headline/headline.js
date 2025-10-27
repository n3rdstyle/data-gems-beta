/**
 * Headline Component
 * Creates a section headline/title
 */

function createHeadline(options = {}) {
  const {
    text = 'Headline',
    showIcon = false,
    iconName = 'search',
    onIconClick = null
  } = options;

  // Create headline element
  const headlineElement = document.createElement('div');
  headlineElement.className = 'headline text-style-h2';

  // Create text element
  const textElement = document.createElement('span');
  textElement.className = 'headline__text';
  textElement.textContent = text;
  headlineElement.appendChild(textElement);

  // Create action container (for icon or search button)
  const actionContainer = document.createElement('span');
  actionContainer.className = 'headline__action';

  // Create icon element if needed
  let iconElement = null;
  if (showIcon) {
    iconElement = document.createElement('span');
    iconElement.className = 'headline__icon';
    iconElement.innerHTML = getIcon(iconName);
    iconElement.setAttribute('role', 'button');
    iconElement.setAttribute('aria-label', 'Search');

    if (onIconClick) {
      iconElement.addEventListener('click', onIconClick);
    }

    actionContainer.appendChild(iconElement);
    headlineElement.appendChild(actionContainer);
  }

  // Public API
  return {
    element: headlineElement,

    getText() {
      return textElement.textContent;
    },

    setText(newText) {
      textElement.textContent = newText;
    },

    setIconClick(callback) {
      if (iconElement && callback) {
        iconElement.addEventListener('click', callback);
      }
    },

    setSearchActive(searchTerm, onCancel) {
      // Hide icon, show search button
      actionContainer.innerHTML = '';

      const searchButton = document.createElement('button');
      searchButton.className = 'headline__search-button';
      searchButton.setAttribute('aria-label', `Active search: ${searchTerm}`);

      const label = document.createElement('span');
      label.className = 'headline__search-label';
      label.textContent = searchTerm;

      const cancelIcon = document.createElement('span');
      cancelIcon.className = 'headline__search-cancel';
      cancelIcon.innerHTML = getIcon('close');

      searchButton.appendChild(label);
      searchButton.appendChild(cancelIcon);

      searchButton.addEventListener('click', () => {
        if (onCancel) {
          onCancel();
        }
      });

      actionContainer.appendChild(searchButton);
    },

    clearSearch() {
      // Remove search button, restore icon
      actionContainer.innerHTML = '';

      if (showIcon && iconElement) {
        const newIconElement = document.createElement('span');
        newIconElement.className = 'headline__icon';
        newIconElement.innerHTML = getIcon(iconName);
        newIconElement.setAttribute('role', 'button');
        newIconElement.setAttribute('aria-label', 'Search');

        if (onIconClick) {
          newIconElement.addEventListener('click', onIconClick);
        }

        actionContainer.appendChild(newIconElement);
        iconElement = newIconElement;
      }
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createHeadline };
}
