/**
 * Messages Modal Component
 * Modal for displaying a list of messages
 * Requires: header.js, action-button.js, divider.js
 */

function createMessagesModal(options = {}) {
  const {
    messages = [],
    onClose = null,
    onMessageClick = null
  } = options;

  // Create modal container
  const modal = document.createElement('div');
  modal.className = 'messages-modal';

  // Create header
  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'messages-modal__header';
  const header = createHeader({
    variant: 'simple',
    title: 'Messages',
    onClose: onClose || (() => {})
  });
  headerWrapper.appendChild(header.element);

  // Create content container
  const content = document.createElement('div');
  content.className = 'messages-modal__content';

  // Add messages
  messages.forEach((message, index) => {
    const itemWrapper = document.createElement('div');
    itemWrapper.className = 'messages-modal__item';

    // Create action button for message
    const messageButton = createActionButton({
      label: message.title,
      caption: message.preview,
      variant: 'navigation',
      onClick: () => {
        if (onMessageClick) {
          onMessageClick(message);
        }
      }
    });

    itemWrapper.appendChild(messageButton.element);

    // Add divider (will be hidden for last item via CSS)
    const divider = createDivider();
    divider.element.className = 'messages-modal__divider';
    itemWrapper.appendChild(divider.element);

    content.appendChild(itemWrapper);
  });

  // Assemble modal
  modal.appendChild(headerWrapper);
  modal.appendChild(content);

  // Public API
  return {
    element: modal,

    addMessage(message) {
      const itemWrapper = document.createElement('div');
      itemWrapper.className = 'messages-modal__item';

      const messageButton = createActionButton({
        label: message.title,
        caption: message.preview,
        variant: 'navigation',
        onClick: () => {
          if (onMessageClick) {
            onMessageClick(message);
          }
        }
      });

      itemWrapper.appendChild(messageButton.element);

      const divider = createDivider();
      divider.element.className = 'messages-modal__divider';
      itemWrapper.appendChild(divider.element);

      content.appendChild(itemWrapper);
    },

    clearMessages() {
      content.innerHTML = '';
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createMessagesModal };
}
