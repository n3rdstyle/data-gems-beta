/**
 * Collapsible Section Component
 * Section with expandable/collapsible content
 */

function createCollapsibleSection(options = {}) {
  const {
    title = '',
    content = null, // DOM element or array of DOM elements
    collapsed = false,
    onToggle = null
  } = options;

  // State
  let isCollapsed = collapsed;

  // Create container
  const container = document.createElement('div');
  container.className = 'collapsible-section';

  if (isCollapsed) {
    container.classList.add('collapsible-section--collapsed');
  }

  // Create header
  const header = document.createElement('div');
  header.className = 'collapsible-section__header';
  header.setAttribute('role', 'button');
  header.setAttribute('tabindex', '0');
  header.setAttribute('aria-expanded', !isCollapsed);

  // Create title
  const titleElement = document.createElement('div');
  titleElement.className = 'collapsible-section__title text-style-h2';
  titleElement.textContent = title;

  // Create toggle icon
  const toggleIcon = document.createElement('div');
  toggleIcon.className = 'collapsible-section__toggle';
  toggleIcon.innerHTML = typeof getIcon !== 'undefined' ? getIcon('chevronDown') : '▼';

  header.appendChild(titleElement);
  header.appendChild(toggleIcon);

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

  // Toggle function
  const toggle = () => {
    isCollapsed = !isCollapsed;
    container.classList.toggle('collapsible-section--collapsed', isCollapsed);
    header.setAttribute('aria-expanded', !isCollapsed);

    if (onToggle) {
      onToggle(isCollapsed);
    }
  };

  // Event listeners
  header.addEventListener('click', toggle);
  header.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });

  // Assemble component
  container.appendChild(header);
  container.appendChild(contentContainer);

  // Public API
  return {
    element: container,

    expand() {
      if (isCollapsed) {
        toggle();
      }
    },

    collapse() {
      if (!isCollapsed) {
        toggle();
      }
    },

    toggle() {
      toggle();
    },

    isCollapsed() {
      return isCollapsed;
    },

    setTitle(newTitle) {
      titleElement.textContent = newTitle;
    },

    getTitle() {
      return titleElement.textContent;
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
      }
    },

    getContentContainer() {
      return contentContainer;
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createCollapsibleSection };
}
