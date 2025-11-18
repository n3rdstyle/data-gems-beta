/**
 * Quick Input Bar Component
 * Bottom bar with quick input field and question tag suggestions
 * Integrates with existing random question service and preference system
 * Requires: input-field.js, button-tertiary.js, button-primary.js, tag.js, random-question-service.js
 */

function createQuickInputBar(options = {}) {
  const {
    onQuickAdd = null,           // Callback for quick add (text, topic, collections)
    onPlusClick = null,           // Callback for + button (opens advanced menu)
    onRandomQuestionClick = null, // Callback for opening full random question modal
    onMergeClick = null,          // Callback for merge button
    onDeleteClick = null,         // Callback for delete button
    getAutoCategorizeEnabled = null
  } = options;

  // State
  let currentState = 'normal'; // 'normal', 'selection', 'empty'
  let questionTags = [];
  let currentQuestionData = null; // Currently selected question for context

  // Create main container
  const barElement = document.createElement('div');
  barElement.className = 'quick-input-bar';

  // Create normal state content
  const normalContent = document.createElement('div');
  normalContent.className = 'quick-input-bar__normal';

  // Question tags row
  const tagsRow = document.createElement('div');
  tagsRow.className = 'quick-input-bar__tags-row';

  const tagsContainer = document.createElement('div');
  tagsContainer.className = 'quick-input-bar__tags';

  const refreshButton = createTertiaryButton({
    icon: 'refresh',
    ariaLabel: 'Refresh questions',
    size: 'small'
  });
  refreshButton.element.classList.add('quick-input-bar__refresh');

  tagsRow.appendChild(tagsContainer);
  tagsRow.appendChild(refreshButton.element);

  // Input row
  const inputRow = document.createElement('div');
  inputRow.className = 'quick-input-bar__input-row';

  const inputField = createInputField({
    type: 'text',
    placeholder: 'Add a preference...',
    onInput: (value) => {
      // Enable/disable send button based on input
      const hasValue = value.trim().length > 0;
      sendButton.element.disabled = !hasValue;
      if (hasValue) {
        sendButton.element.classList.remove('disabled');
      } else {
        sendButton.element.classList.add('disabled');
      }
    },
    onKeyDown: (e) => {
      if (e.key === 'Enter') {
        const value = inputField.getValue().trim();
        if (value) {
          handleQuickAdd(value);
        }
      }
    }
  });
  inputField.element.classList.add('quick-input-bar__input');

  const sendButton = createTertiaryButton({
    icon: 'send',
    ariaLabel: 'Send',
    size: 'default',
    onClick: () => {
      const value = inputField.getValue().trim();
      if (value) {
        handleQuickAdd(value);
      }
    }
  });
  sendButton.element.classList.add('quick-input-bar__send');
  sendButton.element.disabled = true;
  sendButton.element.classList.add('disabled');

  inputRow.appendChild(inputField.element);
  inputRow.appendChild(sendButton.element);

  normalContent.appendChild(tagsRow);
  normalContent.appendChild(inputRow);

  // Create selection state content
  const selectionContent = document.createElement('div');
  selectionContent.className = 'quick-input-bar__selection';
  selectionContent.style.display = 'none';

  const mergeButton = createPrimaryButton({
    label: 'Merge 0 Cards',
    variant: 'v2',
    onClick: () => {
      if (onMergeClick) {
        onMergeClick();
      }
    }
  });
  mergeButton.element.classList.add('quick-input-bar__merge');

  const trashButton = createTertiaryButton({
    icon: 'trash',
    ariaLabel: 'Delete selected',
    size: 'default',
    onClick: () => {
      if (onDeleteClick) {
        onDeleteClick();
      }
    }
  });
  trashButton.element.classList.add('quick-input-bar__trash');

  selectionContent.appendChild(mergeButton.element);
  selectionContent.appendChild(trashButton.element);

  // Create empty state content
  const emptyContent = document.createElement('div');
  emptyContent.className = 'quick-input-bar__empty';
  emptyContent.style.display = 'none';

  const emptyButton = createPrimaryButton({
    label: 'Add your first preference',
    variant: 'default',
    icon: 'plus',
    onClick: () => {
      if (onPlusClick) {
        onPlusClick();
      }
    }
  });
  emptyButton.element.classList.add('quick-input-bar__empty-button');

  emptyContent.appendChild(emptyButton.element);

  // Assemble bar
  barElement.appendChild(normalContent);
  barElement.appendChild(selectionContent);
  barElement.appendChild(emptyContent);

  // Helper: Handle quick add
  function handleQuickAdd(text) {
    if (onQuickAdd) {
      // Pass text, question, and collections from random question
      const topic = currentQuestionData ? currentQuestionData.question : '';
      const collections = currentQuestionData && currentQuestionData.categoryName
        ? [currentQuestionData.categoryName]
        : [];

      onQuickAdd(text, topic, collections);
    }

    // Clear input and reset state
    inputField.clear();
    currentQuestionData = null;
    sendButton.element.disabled = true;
    sendButton.element.classList.add('disabled');

    // Update placeholder back to default if it was showing a question
    inputField.element.querySelector('input').placeholder = 'Add a preference...';

    // Remove active state from all tags
    const allTags = tagsContainer.querySelectorAll('.tag');
    allTags.forEach(tag => tag.classList.remove('tag--active'));
  }

  // Helper: Load question tags
  async function loadQuestionTags() {
    try {
      // Get 3 random questions from the service
      const questions = [];
      for (let i = 0; i < 3; i++) {
        const q = await getRandomQuestion();
        if (q) {
          questions.push(q);
        }
      }

      questionTags = questions;
      renderQuestionTags();
    } catch (error) {
      console.error('Failed to load question tags:', error);
      questionTags = [];
      renderQuestionTags();
    }
  }

  // Helper: Render question tags
  function renderQuestionTags() {
    tagsContainer.innerHTML = '';

    if (questionTags.length === 0) {
      // Show placeholder or hide tags row
      tagsRow.style.display = 'none';
      return;
    }

    tagsRow.style.display = '';

    questionTags.forEach((questionData, index) => {
      const tag = createTag({
        label: questionData.question,
        variant: 'default',
        size: 'small',
        onClick: () => handleQuestionTagClick(questionData, index)
      });
      tag.element.classList.add('quick-input-bar__tag');
      tagsContainer.appendChild(tag.element);
    });
  }

  // Helper: Handle question tag click
  function handleQuestionTagClick(questionData, index) {
    const allTags = tagsContainer.querySelectorAll('.tag');
    const clickedTag = allTags[index];
    const isCurrentlyActive = clickedTag.classList.contains('tag--active');

    // Toggle behavior
    if (isCurrentlyActive) {
      // Clicking on active tag - deactivate it
      clickedTag.classList.remove('tag--active');
      currentQuestionData = null;

      // Reset input placeholder to default
      const inputElement = inputField.element.querySelector('input');
      inputElement.placeholder = 'Add a preference...';
    } else {
      // Clicking on inactive tag - activate it and deactivate others
      currentQuestionData = questionData;

      // Update input placeholder to show question
      const inputElement = inputField.element.querySelector('input');
      inputElement.placeholder = questionData.question;

      // Focus input field
      inputField.focus();

      // Update tag states: activate clicked, deactivate others
      allTags.forEach((tag, i) => {
        if (i === index) {
          tag.classList.add('tag--active');
        } else {
          tag.classList.remove('tag--active');
        }
      });
    }
  }

  // Refresh button handler
  refreshButton.element.addEventListener('click', () => {
    loadQuestionTags();
  });

  // Public API
  return {
    element: barElement,

    async initialize() {
      // Load initial question tags
      await loadQuestionTags();
    },

    setState(state) {
      currentState = state;

      // Hide all content
      normalContent.style.display = 'none';
      selectionContent.style.display = 'none';
      emptyContent.style.display = 'none';

      // Show appropriate content
      if (state === 'normal') {
        normalContent.style.display = '';
      } else if (state === 'selection') {
        selectionContent.style.display = '';
      } else if (state === 'empty') {
        emptyContent.style.display = '';
      }
    },

    setMergeCount(count) {
      mergeButton.setLabel(`Merge ${count} Card${count !== 1 ? 's' : ''}`);
    },

    setMergeDisabled(disabled) {
      mergeButton.setDisabled(disabled);
    },

    refreshQuestions() {
      loadQuestionTags();
    },

    clearInput() {
      inputField.clear();
      currentQuestionData = null;
      sendButton.element.disabled = true;
      sendButton.element.classList.add('disabled');
    },

    hide() {
      barElement.classList.add('hidden-by-scroll');
    },

    show() {
      barElement.classList.remove('hidden-by-scroll');
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createQuickInputBar };
}
