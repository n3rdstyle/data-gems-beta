/**
 * Collapsible Section Component
 * Section with header (compact-toggle variant) and hideable content
 * Requires: header.js
 */

function createCollapsibleSection(options = {}) {
  const {
    title = '',
    content = null, // DOM element or array of DOM elements
    collapsed = false,
    onToggle = null
  } = options;

  // State - Toggle is INVERTED: active = content visible, inactive = content hidden
  let isHidden = collapsed;
  let isToggleEnabled = false; // Toggle starts disabled until at least one field is filled

  // Create container
  const container = document.createElement('div');
  container.className = 'collapsible-section';

  if (isHidden) {
    container.classList.add('collapsible-section--hidden');
  }

  // Create header using header component with compact-toggle variant
  const headerComponent = createHeader({
    variant: 'compact-toggle',
    title: title,
    toggleActive: !isHidden, // Toggle active = content visible
    onToggleChange: (isActive) => {
      // Only allow toggle if at least one field is filled
      if (!isToggleEnabled) {
        return;
      }

      isHidden = !isActive; // If toggle is active, content is visible (not hidden)
      container.classList.toggle('collapsible-section--hidden', isHidden);

      if (onToggle) {
        onToggle(isHidden);
      }
    }
  });

  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'collapsible-section__header';
  headerWrapper.appendChild(headerComponent.element);

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'collapsible-section__content';

  // Add content
  if (content) {
    if (Array.isArray(content)) {
      content.forEach(item => {
        if (item instanceof HTMLElement) {
          contentContainer.appendChild(item);
        }
      });
    } else if (content instanceof HTMLElement) {
      contentContainer.appendChild(content);
    }
  }

  // Check if any field has a value
  const checkFieldsAndUpdateToggle = () => {
    const inputs = contentContainer.querySelectorAll('input, textarea, select, .dropdown__selected');
    let hasValue = false;

    inputs.forEach(input => {
      if (input.classList && input.classList.contains('dropdown__selected')) {
        // Check dropdown selected value
        const text = input.textContent.trim();
        if (text && !input.parentElement.querySelector('.dropdown__placeholder')) {
          hasValue = true;
        }
      } else if (input.value && input.value.trim() !== '') {
        hasValue = true;
      }
    });

    isToggleEnabled = hasValue;

    // Update toggle appearance based on enabled state
    const toggleElement = headerComponent.getToggle();
    if (toggleElement && toggleElement.element) {
      if (isToggleEnabled) {
        toggleElement.element.style.opacity = '1';
        toggleElement.element.style.pointerEvents = 'auto';
      } else {
        toggleElement.element.style.opacity = '0.3';
        toggleElement.element.style.pointerEvents = 'none';
      }
    }

    return hasValue;
  };

  // Monitor field changes
  const monitorFields = () => {
    contentContainer.addEventListener('input', () => {
      checkFieldsAndUpdateToggle();
    });

    contentContainer.addEventListener('change', () => {
      checkFieldsAndUpdateToggle();
    });

    // Initial check
    setTimeout(() => {
      checkFieldsAndUpdateToggle();
    }, 100);
  };

  // Toggle function
  const toggle = () => {
    if (!isToggleEnabled) {
      return;
    }

    const newToggleState = !headerComponent.isToggleActive();
    headerComponent.setToggleActive(newToggleState);
    isHidden = !newToggleState;
    container.classList.toggle('collapsible-section--hidden', isHidden);

    if (onToggle) {
      onToggle(isHidden);
    }
  };

  // Assemble component
  container.appendChild(headerWrapper);
  container.appendChild(contentContainer);

  // Start monitoring fields
  monitorFields();

  // Public API
  return {
    element: container,

    show() {
      if (isHidden) {
        toggle();
      }
    },

    hide() {
      if (!isHidden) {
        toggle();
      }
    },

    toggle() {
      toggle();
    },

    isHidden() {
      return isHidden;
    },

    // Legacy methods for backward compatibility
    expand() {
      this.show();
    },

    collapse() {
      this.hide();
    },

    isCollapsed() {
      return isHidden;
    },

    setTitle(newTitle) {
      headerComponent.setTitle(newTitle);
    },

    getTitle() {
      return headerComponent.getTitle();
    },

    setContent(newContent) {
      contentContainer.innerHTML = '';
      if (Array.isArray(newContent)) {
        newContent.forEach(item => {
          if (item instanceof HTMLElement) {
            contentContainer.appendChild(item);
          }
        });
      } else if (newContent instanceof HTMLElement) {
        contentContainer.appendChild(newContent);
      }
    },

    addContent(newContent) {
      if (newContent instanceof HTMLElement) {
        contentContainer.appendChild(newContent);
        // Re-check fields after adding content
        setTimeout(() => {
          checkFieldsAndUpdateToggle();
        }, 100);
      }
    },

    getContentContainer() {
      return contentContainer;
    },

    // Force re-check of fields (useful after programmatic updates)
    updateToggleState() {
      checkFieldsAndUpdateToggle();
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createCollapsibleSection };
}
