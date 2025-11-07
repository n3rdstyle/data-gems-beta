/**
 * Text Edit Field Component
 * Editable text field with compact header and action icons
 * Combines compact header with editable text area
 * Requires: header.js
 */

function createTextEditField(options = {}) {
  const {
    title = 'Preference',
    text = '',
    placeholder = 'Enter text...',
    hidden = false,
    favorited = false,
    mergedFrom = null, // Array of original cards if this is a merged card
    onToggleHidden = null,
    onToggleFavorite = null,
    onTextChange = null,
    onEnter = null,
    onShowOriginals = null, // Callback to show original cards
    editable = true,
    headerVariant = 'compact' // 'compact' (with icons) or 'compact-plain' (without icons)
  } = options;

  // Create container
  const container = document.createElement('div');
  container.className = 'text-edit-field';

  // Track current state
  let currentHidden = hidden;
  let currentFavorited = favorited;

  // Function to build action icons based on current state
  function buildActionIcons() {
    const actionIcons = [];

    // Add info icon first if this is a merged card
    if (mergedFrom && Array.isArray(mergedFrom) && mergedFrom.length > 0) {
      actionIcons.push({
        icon: 'info',
        ariaLabel: `Show ${mergedFrom.length} original cards`,
        onClick: () => {
          if (onShowOriginals) {
            onShowOriginals(mergedFrom);
          }
        }
      });
    }

    // Default state: show both hidden and heart icons (outline)
    if (!currentHidden && !currentFavorited) {
      actionIcons.push(
        {
          icon: 'hidden',
          ariaLabel: 'Hide',
          onClick: () => {
            currentHidden = true;
            currentFavorited = false;
            updateHeaderIcons();
          }
        },
        {
          icon: 'heart',
          ariaLabel: 'Favorite',
          onClick: () => {
            currentFavorited = true;
            currentHidden = false;
            updateHeaderIcons();
          }
        }
      );
    }
    // Favorited state: show only heart icon (filled)
    else if (currentFavorited) {
      actionIcons.push({
        icon: 'heart',
        filled: true,
        ariaLabel: 'Unfavorite',
        onClick: () => {
          currentFavorited = false;
          updateHeaderIcons();
        }
      });
    }
    // Hidden state: show only hidden icon (filled)
    else if (currentHidden) {
      actionIcons.push({
        icon: 'hidden',
        filled: true,
        ariaLabel: 'Show',
        onClick: () => {
          currentHidden = false;
          updateHeaderIcons();
        }
      });
    }

    return actionIcons;
  }

  // Create compact header with initial icons
  const header = createHeader({
    variant: headerVariant,
    title: title,
    actionIcons: headerVariant === 'compact' ? buildActionIcons() : []
  });

  // Create text box
  const textBox = document.createElement('div');
  textBox.className = 'text-edit-field__textbox text-style-body-medium';
  textBox.contentEditable = editable;
  textBox.textContent = text;

  if (!text && placeholder) {
    textBox.setAttribute('data-placeholder', placeholder);
  }

  // Handle text changes
  if (onTextChange) {
    textBox.addEventListener('input', () => {
      onTextChange(textBox.textContent);
    });
  }

  // Prevent newlines on Enter and trigger onEnter callback
  textBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (onEnter) {
        onEnter();
      }
    }
  });

  // Assemble component
  container.appendChild(header.element);
  container.appendChild(textBox);

  // Function to rebuild the header with new state
  function updateHeaderIcons() {
    if (header.setActionIcons) {
      header.setActionIcons(buildActionIcons());
    }
  }

  // Public API
  return {
    element: container,

    getHeader() {
      return header;
    },

    getText() {
      return textBox.textContent;
    },

    setText(newText) {
      textBox.textContent = newText;
      if (!newText && placeholder) {
        textBox.setAttribute('data-placeholder', placeholder);
      } else {
        textBox.removeAttribute('data-placeholder');
      }
    },

    setPlaceholder(newPlaceholder) {
      textBox.setAttribute('data-placeholder', newPlaceholder);
    },

    setEditable(isEditable) {
      textBox.contentEditable = isEditable;
    },

    isEditable() {
      return textBox.contentEditable === 'true';
    },

    focus() {
      textBox.focus();
    },

    clear() {
      textBox.textContent = '';
      if (placeholder) {
        textBox.setAttribute('data-placeholder', placeholder);
      }
    },

    updateState(newHidden, newFavorited) {
      currentHidden = newHidden;
      currentFavorited = newFavorited;
      updateHeaderIcons();
    },

    getState() {
      return {
        hidden: currentHidden,
        favorited: currentFavorited
      };
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createTextEditField };
}
