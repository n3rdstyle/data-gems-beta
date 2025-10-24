/**
 * Preference Options Component
 * Overlay with blur effect and action buttons triggered by plus button
 * Requires: button-tertiary.js, button-primary.js, overlay.js, input-field.js
 */

function createPreferenceOptions(options = {}) {
  const {
    buttons = [],
    randomQuestionLabel = 'Random Question',
    randomQuestionDisabled = false,
    onButtonClick = null,
    onRandomQuestionClick = null,
    onToggle = null,
    onModalSend = null
  } = options;

  let isActive = false;
  let isModalActive = false;
  let currentQuestion = '';
  let isRandomQuestionDisabled = randomQuestionDisabled;

  // Create main container
  const preferenceOptionsElement = document.createElement('div');
  preferenceOptionsElement.className = 'preference-options';

  // Create overlay using overlay component
  const overlayComponent = createOverlay({
    blur: false,
    opacity: 'default',
    visible: false,
    zIndex: 1,  // Set low z-index so buttons are above
    onClick: () => {
      if (isModalActive) {
        hideModal();
      } else {
        hide();
      }
    }
  });

  const overlay = overlayComponent.element;
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

  const inputField = createInputField({
    type: 'text',
    placeholder: 'Type your answer',
    onKeyDown: (e) => {
      if (e.key === 'Enter') {
        sendButton.element.click();
      }
    }
  });

  const sendButton = createPrimaryButton({
    label: 'Send',
    variant: 'neutral',
    onClick: () => {
      const answer = inputField.getValue().trim();
      if (answer) {
        if (onModalSend) {
          onModalSend(answer, currentQuestion);
        }
        inputField.clear();
        hideModal();
      }
    }
  });

  answerContainer.appendChild(inputField.element);
  answerContainer.appendChild(sendButton.element);

  // Question text
  const questionText = document.createElement('div');
  questionText.className = 'preference-options__modal-question text-style-body-medium';

  modalCard.appendChild(answerContainer);
  modalCard.appendChild(questionText);
  modal.appendChild(modalCard);

  // Helper functions (now that inputField and questionText exist)
  function showModal(question) {
    currentQuestion = question;
    questionText.textContent = question;
    isModalActive = true;
    preferenceOptionsElement.classList.add('modal-active');
    // Focus input
    setTimeout(() => inputField.focus(), 100);
  }

  function hideModal() {
    isModalActive = false;
    preferenceOptionsElement.classList.remove('modal-active');
    inputField.clear();
    currentQuestion = '';
  }

  function show() {
    // If there's only one button and it's "Add new preference", trigger it directly
    if (buttonElements.length === 1 && buttons.length === 1) {
      const singleButton = buttons[0];
      if ((singleButton.label || singleButton) === 'Add new preference') {
        // Call the button click handler directly without showing the overlay
        if (onButtonClick) {
          onButtonClick(singleButton.label || singleButton, 0);
        }
        return; // Don't show the overlay
      }
    }

    isActive = true;
    preferenceOptionsElement.classList.add('active');
    overlayComponent.show();
    if (onToggle) onToggle(true);
  }

  function hide() {
    isActive = false;
    isModalActive = false;
    preferenceOptionsElement.classList.remove('active');
    preferenceOptionsElement.classList.remove('modal-active');
    overlayComponent.hide();
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
    button.className = 'preference-options__button text-style-body-medium';
    button.textContent = buttonConfig.label || buttonConfig;
    button.type = 'button';

    button.addEventListener('click', () => {
      // Check if button config has showModal set to false
      const shouldShowModal = buttonConfig.showModal !== false;

      if (buttonConfig.onClick) {
        buttonConfig.onClick(buttonConfig.label || buttonConfig, index);
      }
      if (onButtonClick) {
        onButtonClick(buttonConfig.label || buttonConfig, index);
      }
      // Show modal with question only if not explicitly disabled
      if (shouldShowModal) {
        showModal(buttonConfig.label || buttonConfig);
      }
    });

    buttonElements.push(button);
    buttonsContainer.appendChild(button);
  });

  // Create Random Question button (primary button) - after showModal is defined
  const randomQuestionButton = document.createElement('button');
  randomQuestionButton.className = 'preference-options__random-button text-style-body-medium';
  randomQuestionButton.textContent = randomQuestionLabel;
  randomQuestionButton.type = 'button';
  randomQuestionButton.disabled = isRandomQuestionDisabled;

  // Add disabled class if needed
  if (isRandomQuestionDisabled) {
    randomQuestionButton.classList.add('preference-options__random-button--disabled');
  }

  randomQuestionButton.addEventListener('click', () => {
    // Don't do anything if disabled
    if (isRandomQuestionDisabled) {
      return;
    }

    // Call user callback if provided
    if (onRandomQuestionClick) {
      onRandomQuestionClick();
    }
    // Show modal with the current button label
    showModal(randomQuestionButton.textContent);
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

  function addButton(buttonConfig) {
    const button = document.createElement('button');
    button.className = 'preference-options__button text-style-body-medium';
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
      return inputField;
    },
    setRandomQuestionLabel(label) {
      randomQuestionButton.textContent = label;
    },

    setRandomQuestionDisabled(disabled) {
      isRandomQuestionDisabled = disabled;
      randomQuestionButton.disabled = disabled;

      if (disabled) {
        randomQuestionButton.classList.add('preference-options__random-button--disabled');
      } else {
        randomQuestionButton.classList.remove('preference-options__random-button--disabled');
      }
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createPreferenceOptions };
}
