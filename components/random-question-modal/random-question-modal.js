/**
 * Random Question Modal
 * Bottom sheet modal for answering random questions
 */

function createRandomQuestionModal(options = {}) {
  const {
    question = '',
    onAnswer = null,
    onClose = null
  } = options;

  // Create modal container
  const modalElement = document.createElement('div');
  modalElement.className = 'random-question-modal';

  // Create header
  const header = document.createElement('div');
  header.className = 'random-question-modal__header';

  const title = document.createElement('h2');
  title.className = 'random-question-modal__title';
  title.textContent = question;

  const closeButton = createTertiaryButton({
    icon: 'close',
    ariaLabel: 'Close',
    size: 'default'
  });

  header.appendChild(title);
  header.appendChild(closeButton.element);

  // Create answer field wrapper
  const answerWrapper = document.createElement('div');
  answerWrapper.className = 'random-question-modal__answer';

  // Create input field
  const inputField = createInputField({
    type: 'text',
    placeholder: 'Type your answer',
    onKeyDown: (e) => {
      if (e.key === 'Enter') {
        const answer = inputField.getValue().trim();
        if (answer) {
          answerButton.element.click();
        }
      }
    }
  });

  // Create answer button
  const answerButton = createTertiaryButton({
    icon: 'send',
    ariaLabel: 'Send answer',
    size: 'default',
    onClick: () => {
      const answer = inputField.getValue().trim();
      if (answer && onAnswer) {
        onAnswer(answer, question);
        hide(false); // Don't clear the field on submit
      }
    }
  });

  answerWrapper.appendChild(inputField.element);
  answerWrapper.appendChild(answerButton.element);

  // Assemble modal
  modalElement.appendChild(header);
  modalElement.appendChild(answerWrapper);

  // Event handlers
  closeButton.element.addEventListener('click', () => {
    hide();
    if (onClose) onClose();
  });

  // Show/hide functions
  const show = () => {
    // Clear field when opening modal
    inputField.clear();

    // Trigger reflow for animation
    setTimeout(() => {
      modalElement.classList.add('visible');
      // Auto-focus input field
      setTimeout(() => inputField.focus(), 100);
    }, 10);
  };

  const hide = (clearField = true) => {
    modalElement.classList.remove('visible');
    // Clear input field only if requested
    if (clearField) {
      inputField.clear();
    }
    setTimeout(() => {
      modalElement.remove();
    }, 300);
  };

  // Public API
  return {
    element: modalElement,
    show,
    hide,

    getAnswerValue() {
      return inputField.getValue();
    },

    clearAnswer() {
      inputField.clear();
    },

    setQuestion(newQuestion) {
      title.textContent = newQuestion;
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createRandomQuestionModal };
}
