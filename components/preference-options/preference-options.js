/**
 * Preference Options Component
 * Overlay with blur effect and action buttons triggered by plus button
 * Requires: button-tertiary.js, button-primary.js
 */

function createPreferenceOptions(options = {}) {
  const {
    buttons = [],
    randomQuestionLabel = 'Random Question',
    onButtonClick = null,
    onRandomQuestionClick = null,
    onToggle = null,
    onModalSend = null
  } = options;

  let isActive = false;
  let isModalActive = false;
  let currentQuestion = '';

  // Create main container
  const preferenceOptionsElement = document.createElement('div');
  preferenceOptionsElement.className = 'preference-options';

  // Create blur overlay
  const overlay = document.createElement('div');
  overlay.className = 'preference-options__overlay';

  // Create content container
  const content = document.createElement('div');
  content.className = 'preference-options__content';

  // Create buttons container
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'preference-options__buttons';

  // We'll populate buttons after modal is created, so showModal is available

  // Create bottom action bar wrapper
  const bottomBar = document.createElement('div');
  bottomBar.className = 'preference-options__bottom-bar';

  // Create trigger button (tertiary with add icon) - defined early for toggle function
  const triggerButtonWrapper = document.createElement('div');
  triggerButtonWrapper.className = 'preference-options__trigger';

  const triggerButton = createTertiaryButton({
    icon: 'plus',
    ariaLabel: 'Add',
    onClick: () => {
      toggle();
    }
  });

  // Create gradient background frame
  const gradientFrame = document.createElement('div');
  gradientFrame.className = 'preference-options__gradient-frame';

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'preference-options__modal';

  const modalCard = document.createElement('div');
  modalCard.className = 'preference-options__modal-card';

  // Answer input container
  const answerContainer = document.createElement('div');
  answerContainer.className = 'preference-options__modal-answer';

  const input = document.createElement('input');
  input.className = 'preference-options__modal-input';
  input.type = 'text';
  input.placeholder = 'Type your answer';

  const sendButton = createPrimaryButton({
    label: 'Send',
    variant: 'neutral',
    onClick: () => {
      const answer = input.value.trim();
      if (answer) {
        if (onModalSend) {
          onModalSend(answer, currentQuestion);
        }
        input.value = '';
        hideModal();
      }
    }
  });

  // Handle Enter key
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendButton.element.click();
    }
  });

  answerContainer.appendChild(input);
  answerContainer.appendChild(sendButton.element);

  // Question text
  const questionText = document.createElement('div');
  questionText.className = 'preference-options__modal-question';

  modalCard.appendChild(answerContainer);
  modalCard.appendChild(questionText);
  modal.appendChild(modalCard);

  // Helper functions (now that input and questionText exist)
  function showModal(question) {
    currentQuestion = question;
    questionText.textContent = question;
    isModalActive = true;
    preferenceOptionsElement.classList.add('modal-active');
    // Focus input
    setTimeout(() => input.focus(), 100);
  }

  function hideModal() {
    isModalActive = false;
    preferenceOptionsElement.classList.remove('modal-active');
    input.value = '';
    currentQuestion = '';
  }

  function show() {
    isActive = true;
    preferenceOptionsElement.classList.add('active');
    if (onToggle) onToggle(true);
  }

  function hide() {
    isActive = false;
    isModalActive = false;
    preferenceOptionsElement.classList.remove('active');
    preferenceOptionsElement.classList.remove('modal-active');
    if (onToggle) onToggle(false);
  }

  function toggle() {
    if (isActive) {
      hide();
    } else {
      show();
    }
  }

  function isOpen() {
    return isActive;
  }

  // Now create action buttons (after showModal is defined)
  const buttonElements = [];
  buttons.forEach((buttonConfig, index) => {
    const button = document.createElement('button');
    button.className = 'preference-options__button';
    button.textContent = buttonConfig.label || buttonConfig;
    button.type = 'button';

    button.addEventListener('click', () => {
      if (buttonConfig.onClick) {
        buttonConfig.onClick(buttonConfig.label || buttonConfig, index);
      }
      if (onButtonClick) {
        onButtonClick(buttonConfig.label || buttonConfig, index);
      }
      // Show modal with question
      showModal(buttonConfig.label || buttonConfig);
    });

    buttonElements.push(button);
    buttonsContainer.appendChild(button);
  });

  // Create Random Question button (primary button) - after showModal is defined
  const randomQuestionButton = document.createElement('button');
  randomQuestionButton.className = 'preference-options__random-button';
  randomQuestionButton.textContent = randomQuestionLabel;
  randomQuestionButton.type = 'button';
  randomQuestionButton.addEventListener('click', () => {
    // Call user callback if provided
    if (onRandomQuestionClick) {
      onRandomQuestionClick();
    }
    // Show modal with a random question or the button label
    showModal(randomQuestionLabel);
  });

  triggerButtonWrapper.appendChild(triggerButton.element);
  bottomBar.appendChild(randomQuestionButton);
  bottomBar.appendChild(triggerButtonWrapper);

  // Assemble component
  content.appendChild(buttonsContainer);
  content.appendChild(modal);
  content.appendChild(gradientFrame);
  content.appendChild(bottomBar);
  preferenceOptionsElement.appendChild(overlay);
  preferenceOptionsElement.appendChild(content);

  // Close overlay when clicking on blur background
  overlay.addEventListener('click', () => {
    if (isModalActive) {
      hideModal();
    } else {
      hide();
    }
  });

  function addButton(buttonConfig) {
    const button = document.createElement('button');
    button.className = 'preference-options__button';
    button.textContent = buttonConfig.label || buttonConfig;
    button.type = 'button';

    const index = buttonElements.length;
    button.addEventListener('click', () => {
      if (buttonConfig.onClick) {
        buttonConfig.onClick(buttonConfig.label || buttonConfig, index);
      }
      if (onButtonClick) {
        onButtonClick(buttonConfig.label || buttonConfig, index);
      }
      showModal(buttonConfig.label || buttonConfig);
    });

    buttonElements.push(button);
    buttonsContainer.appendChild(button);
  }

  function removeButton(index) {
    if (index >= 0 && index < buttonElements.length) {
      buttonsContainer.removeChild(buttonElements[index]);
      buttonElements.splice(index, 1);
    }
  }

  function getButtons() {
    return buttonElements;
  }

  // Public API
  return {
    element: preferenceOptionsElement,
    show,
    hide,
    toggle,
    isOpen,
    showModal,
    hideModal,
    addButton,
    removeButton,
    getButtons,
    getTriggerButton() {
      return triggerButton;
    },
    getInput() {
      return input;
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createPreferenceOptions };
}
