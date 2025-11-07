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
    onMergeClick = null,
    onDeleteClick = null
  } = options;

  let isActive = false;
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
      hide();
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

  // Create trash button container (shown when cards are selected)
  const trashButtonContainer = document.createElement('div');
  trashButtonContainer.className = 'preference-options__trash-container';
  trashButtonContainer.style.display = 'none'; // Hidden by default

  const trashButton = createTertiaryButton({
    icon: 'trash',
    ariaLabel: 'Delete Selected',
    onClick: () => {
      if (onDeleteClick) {
        onDeleteClick();
      }
    }
  });
  trashButton.element.classList.add('preference-options__trash-button');

  trashButtonContainer.appendChild(trashButton.element);

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

  // Helper functions
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
    preferenceOptionsElement.classList.remove('active');
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

  // Now create action buttons
  const buttonElements = [];
  buttons.forEach((buttonConfig, index) => {
    const button = document.createElement('button');
    button.className = 'preference-options__button text-style-body-medium';
    button.textContent = buttonConfig.label || buttonConfig;
    button.type = 'button';

    button.addEventListener('click', () => {
      if (buttonConfig.onClick) {
        buttonConfig.onClick(buttonConfig.label || buttonConfig, index);
      }
      if (onButtonClick) {
        onButtonClick(buttonConfig.label || buttonConfig, index);
      }
    });

    buttonElements.push(button);
    buttonsContainer.appendChild(button);
  });

  // Create Random Question button with tooltip
  const randomQuestionContainer = document.createElement('div');
  randomQuestionContainer.className = 'tooltip-container';

  const randomQuestionButton = document.createElement('button');
  randomQuestionButton.className = 'preference-options__random-button text-style-body-medium';
  randomQuestionButton.type = 'button';
  randomQuestionButton.disabled = isRandomQuestionDisabled;

  // Wrap text in span for proper ellipsis truncation with flexbox
  const questionTextSpan = document.createElement('span');
  questionTextSpan.className = 'preference-options__random-button-text';
  questionTextSpan.textContent = randomQuestionLabel;
  randomQuestionButton.appendChild(questionTextSpan);

  // Add disabled class if needed
  if (isRandomQuestionDisabled) {
    randomQuestionButton.classList.add('preference-options__random-button--disabled');
  }

  randomQuestionButton.addEventListener('click', () => {
    // Don't do anything if disabled
    if (isRandomQuestionDisabled) {
      return;
    }

    // Call user callback if provided (will open the new Random Question Modal)
    if (onRandomQuestionClick) {
      onRandomQuestionClick();
    }
  });

  // Create tooltip for Random Question button
  const randomQuestionTooltip = document.createElement('div');
  randomQuestionTooltip.className = 'tooltip tooltip--top tooltip--random-question';
  randomQuestionTooltip.textContent = 'Answer quick questions to build your profile faster and get better AI recommendations.';

  // Assemble tooltip container
  randomQuestionContainer.appendChild(randomQuestionButton);
  randomQuestionContainer.appendChild(randomQuestionTooltip);

  // Create Merge Button (shown when 2+ cards are selected)
  const mergeButtonContainer = document.createElement('div');
  mergeButtonContainer.className = 'preference-options__merge-container';
  mergeButtonContainer.style.display = 'none'; // Hidden by default

  const mergeButton = createPrimaryButton({
    label: 'Merge 0 Cards',
    variant: 'v2',
    onClick: () => {
      if (onMergeClick) {
        onMergeClick();
      }
    }
  });

  mergeButtonContainer.appendChild(mergeButton.element);

  triggerButtonWrapper.appendChild(triggerButton.element);

  bottomBar.appendChild(randomQuestionContainer);
  bottomBar.appendChild(mergeButtonContainer);
  bottomBar.appendChild(trashButtonContainer);
  bottomBar.appendChild(triggerButtonWrapper);

  // Assemble component
  content.appendChild(buttonsContainer);
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

  // Track empty state
  let isEmpty = false;
  let primaryButton = null;

  // Public API
  return {
    element: preferenceOptionsElement,
    show,
    hide,
    toggle,
    isOpen,
    addButton,
    removeButton,
    getButtons,
    getTriggerButton() {
      return triggerButton;
    },
    setRandomQuestionLabel(label) {
      questionTextSpan.textContent = label;
    },

    setRandomQuestionDisabled(disabled) {
      isRandomQuestionDisabled = disabled;
      randomQuestionButton.disabled = disabled;

      if (disabled) {
        randomQuestionButton.classList.add('preference-options__random-button--disabled');
      } else {
        randomQuestionButton.classList.remove('preference-options__random-button--disabled');
      }
    },

    setEmptyState(isEmptyState) {
      isEmpty = isEmptyState;

      if (isEmpty) {
        // Hide random question button
        randomQuestionContainer.style.display = 'none';

        // Replace tertiary button with primary button
        triggerButtonWrapper.innerHTML = '';
        triggerButtonWrapper.classList.add('preference-options__trigger--empty');
        primaryButton = createPrimaryButton({
          label: 'Add your first preference',
          variant: 'default',
          icon: 'plus'
        });
        primaryButton.element.addEventListener('click', () => {
          toggle();
        });
        triggerButtonWrapper.appendChild(primaryButton.element);
      } else {
        // Show random question button
        randomQuestionContainer.style.display = '';

        // Restore tertiary button
        triggerButtonWrapper.innerHTML = '';
        triggerButtonWrapper.classList.remove('preference-options__trigger--empty');
        triggerButtonWrapper.appendChild(triggerButton.element);
        primaryButton = null;
      }
    },

    showMergeButton(count) {
      // Show merge button, hide random question button
      mergeButtonContainer.style.display = '';
      randomQuestionContainer.style.display = 'none';
      mergeButton.setLabel(`Merge ${count} Cards`);
    },

    hideMergeButton() {
      // Hide merge button, show random question button
      mergeButtonContainer.style.display = 'none';
      randomQuestionContainer.style.display = '';
    },

    updateMergeCount(count) {
      mergeButton.setLabel(`Merge ${count} Card${count !== 1 ? 's' : ''}`);
    },

    setMergeButtonDisabled(disabled) {
      mergeButton.setDisabled(disabled);
    },

    showTrashButton() {
      // Hide plus button, show trash button container
      triggerButtonWrapper.style.display = 'none';
      trashButtonContainer.style.display = '';
    },

    hideTrashButton() {
      // Show plus button, hide trash button container
      triggerButtonWrapper.style.display = '';
      trashButtonContainer.style.display = 'none';
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createPreferenceOptions };
}
