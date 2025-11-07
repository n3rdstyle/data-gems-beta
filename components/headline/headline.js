/**
 * Headline Component
 * Creates a section headline/title
 */

function createHeadline(options = {}) {
  const {
    text = 'Headline',
    showIcon = false,
    iconName = 'search',
    onIconClick = null,
    searchPlaceholder = 'Search',
    onSearch = null,
    showTagButton = false,
    tagButtonLabel = 'All',
    tagButtonCount = undefined,
    onTagButtonClick = null
  } = options;

  // Create headline element
  const headlineElement = document.createElement('div');
  headlineElement.className = 'headline text-style-h2';

  // Create text element
  const textElement = document.createElement('span');
  textElement.className = 'headline__text';
  textElement.textContent = text;
  headlineElement.appendChild(textElement);

  // Create action container (for icon or search field)
  const actionContainer = document.createElement('span');
  actionContainer.className = 'headline__action';

  // Create buttons container for search and tag buttons
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'headline__buttons';

  // Track search state
  let isSearchExpanded = false;

  // Create search field container (hidden initially)
  const searchContainer = document.createElement('div');
  searchContainer.className = 'headline__search-container';

  // Create search input
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'headline__search-input';
  searchInput.placeholder = searchPlaceholder;
  searchInput.setAttribute('aria-label', searchPlaceholder);

  // Add input handler
  searchInput.addEventListener('input', (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  });

  // Handle Enter key to submit search, Escape to close
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
      submitSearch(searchInput.value.trim());
    } else if (e.key === 'Escape') {
      collapseSearch();
      searchInput.value = '';
      if (onSearch) {
        onSearch('');
      }
    }
  });

  searchContainer.appendChild(searchInput);

  // Create icon button using tertiary button
  let iconButton = null;
  if (showIcon) {
    iconButton = createTertiaryButton({
      icon: iconName,
      ariaLabel: 'Search',
      variant: 'transparent'
    });

    iconButton.element.addEventListener('click', () => {
      if (!isSearchExpanded) {
        // Expand search
        expandSearch();
      } else {
        // Collapse search
        collapseSearch();
      }

      if (onIconClick) {
        onIconClick();
      }
    });

    actionContainer.appendChild(searchContainer);
  }

  // Create tag button if needed (positioned left of search button)
  let tagButton = null;
  let currentTagButtonCount = tagButtonCount;
  if (showTagButton) {
    const displayText = tagButtonCount !== undefined ? `${tagButtonLabel} (${tagButtonCount})` : tagButtonLabel;
    tagButton = createTertiaryButton({
      text: displayText,
      icon: 'chevronDown',
      ariaLabel: 'Select tag',
      variant: 'text',
      size: 'small'
    });

    if (onTagButtonClick) {
      tagButton.element.addEventListener('click', onTagButtonClick);
    }

    // Add tag button class for styling
    tagButton.element.classList.add('headline__tag-button');

    buttonsContainer.appendChild(tagButton.element);
  }

  // Helper to update tag button text with count
  const updateTagButtonText = (label, count) => {
    if (tagButton) {
      const displayText = count !== undefined ? `${label} (${count})` : label;
      tagButton.setText(displayText);
    }
  };

  // Add search button after tag button
  if (showIcon) {
    buttonsContainer.appendChild(iconButton.element);
  }

  // Add buttons container to action container
  if (showIcon || showTagButton) {
    actionContainer.appendChild(buttonsContainer);
    headlineElement.appendChild(actionContainer);
  }

  // Function to submit search
  const submitSearch = (searchTerm) => {
    // Collapse search field
    collapseSearch();

    // Show search button with term
    showSearchButton(searchTerm);

    // Keep search applied
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  // Function to show search button with active term
  const showSearchButton = (searchTerm) => {
    // Hide icon button and search container
    if (iconButton) {
      iconButton.element.style.display = 'none';
    }
    searchContainer.style.display = 'none';

    // Create search button
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
      clearSearchButton();
    });

    actionContainer.appendChild(searchButton);
  };

  // Function to clear search button and restore icon
  const clearSearchButton = () => {
    // Remove search button
    const searchButton = actionContainer.querySelector('.headline__search-button');
    if (searchButton) {
      searchButton.remove();
    }

    // Show icon button and search container again
    if (iconButton) {
      iconButton.element.style.display = '';
    }
    searchContainer.style.display = '';

    // Clear search
    searchInput.value = '';
    if (onSearch) {
      onSearch('');
    }
  };

  // Function to expand search field
  const expandSearch = () => {
    isSearchExpanded = true;
    headlineElement.classList.add('headline--search-active');
    searchContainer.classList.add('headline__search-container--expanded');

    // Add filled variant to button
    if (iconButton) {
      iconButton.element.classList.add('button-tertiary--filled');
    }

    // Focus input after animation
    setTimeout(() => {
      searchInput.focus();
    }, 300);
  };

  // Function to collapse search field
  const collapseSearch = () => {
    isSearchExpanded = false;
    headlineElement.classList.remove('headline--search-active');
    searchContainer.classList.remove('headline__search-container--expanded');

    // Remove filled variant from button
    if (iconButton) {
      iconButton.element.classList.remove('button-tertiary--filled');
    }

    // Don't clear search value or trigger clear here
    // This will be handled by submitSearch or escape key
  };


  // Close search when clicking outside
  document.addEventListener('click', (e) => {
    if (isSearchExpanded &&
        !searchContainer.contains(e.target) &&
        !iconButton.element.contains(e.target)) {
      collapseSearch();
    }
  });

  // Public API
  return {
    element: headlineElement,

    getText() {
      return textElement.textContent;
    },

    setText(newText) {
      textElement.textContent = newText;
    },

    setTagButtonLabel(label, count) {
      if (tagButton) {
        currentTagButtonCount = count;
        updateTagButtonText(label, count);
        // Auto-activate button if not "All"
        if (label !== 'All') {
          tagButton.element.classList.add('headline__tag-button--active');
        } else {
          tagButton.element.classList.remove('headline__tag-button--active');
        }
      }
    },

    setTagButtonCount(count) {
      if (tagButton) {
        currentTagButtonCount = count;
        const currentLabel = tagButton.getText().split(' (')[0]; // Extract label without count
        updateTagButtonText(currentLabel, count);
      }
    },

    setTagButtonActive(isActive) {
      if (tagButton) {
        if (isActive) {
          tagButton.element.classList.add('headline__tag-button--active');
        } else {
          tagButton.element.classList.remove('headline__tag-button--active');
        }
      }
    },

    expandSearch() {
      if (!isSearchExpanded) {
        expandSearch();
      }
    },

    collapseSearch() {
      if (isSearchExpanded) {
        collapseSearch();
      }
    },

    isSearchExpanded() {
      return isSearchExpanded;
    },

    getSearchValue() {
      return searchInput.value;
    },

    setSearchValue(value) {
      searchInput.value = value;
    },

    // Legacy methods for backward compatibility
    setSearchActive(searchTerm, onCancel) {
      showSearchButton(searchTerm);
    },

    clearSearch() {
      clearSearchButton();
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createHeadline };
}
