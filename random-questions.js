/**
 * Random Questions Page
 * Standalone page for answering random questions with history
 */

// State
let currentQuestion = null;
let answeredQuestions = [];
let inputField = null;
let submitButton = null;
let skipButton = null;

// Storage key for session history
const HISTORY_STORAGE_KEY = 'randomQuestions_sessionHistory';

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Random Questions Page Loading...');

  // Set up close button
  setupCloseButton();

  // Set up input field and buttons
  setupInputField();
  setupButtons();

  // Load previous session history
  await loadHistoryFromStorage();

  // Set up clear history button
  setupClearHistoryButton();

  // Initialize random question system
  try {
    await initializeRandomQuestions();
    console.log('✅ Random Question System initialized');

    // Load first question
    await loadNextQuestion();
  } catch (error) {
    console.error('❌ Failed to initialize:', error);
    showError('Failed to load questions. Please try again.');
  }
});

/**
 * Set up close button
 */
function setupCloseButton() {
  const closeButton = document.getElementById('closeButton');
  if (closeButton) {
    closeButton.innerHTML = getIcon('close');
    closeButton.addEventListener('click', () => {
      window.close();
    });
  }
}

/**
 * Set up input field
 */
function setupInputField() {
  const answerFieldContainer = document.getElementById('answerField');
  if (!answerFieldContainer) return;

  inputField = createInputField({
    type: 'text',
    placeholder: 'Type your answer...',
    onInput: (value) => {
      // Enable/disable submit button based on input
      if (submitButton) {
        const hasValue = value.trim().length > 0;
        submitButton.setDisabled(!hasValue);
      }
    },
    onKeyDown: (e) => {
      if (e.key === 'Enter') {
        const value = inputField.getValue().trim();
        if (value) {
          handleSubmit();
        }
      }
    }
  });

  answerFieldContainer.appendChild(inputField.element);

  // Auto-focus input field
  setTimeout(() => inputField.focus(), 100);
}

/**
 * Set up action buttons
 */
function setupButtons() {
  const skipButtonContainer = document.getElementById('skipButton');
  const submitButtonContainer = document.getElementById('submitButton');

  if (skipButtonContainer) {
    skipButton = createSecondaryButton({
      label: 'Skip',
      variant: 'default',
      onClick: handleSkip
    });
    skipButtonContainer.replaceWith(skipButton.element);
  }

  if (submitButtonContainer) {
    submitButton = createPrimaryButton({
      label: 'Submit Answer',
      variant: 'default',
      onClick: handleSubmit
    });
    submitButton.setDisabled(true); // Initially disabled
    submitButtonContainer.replaceWith(submitButton.element);
  }
}

/**
 * Load next question
 */
async function loadNextQuestion() {
  try {
    // Show loading state
    const questionText = document.getElementById('questionText');
    if (questionText) {
      questionText.textContent = 'Loading question...';
    }

    // Get random question
    const question = await getRandomQuestion();

    if (!question) {
      // No more questions available
      if (questionText) {
        questionText.textContent = 'All questions answered! 🎉';
      }
      // Disable input and buttons
      if (inputField) {
        inputField.element.querySelector('input').disabled = true;
      }
      if (submitButton) {
        submitButton.setDisabled(true);
      }
      if (skipButton) {
        skipButton.setDisabled(true);
      }
      return;
    }

    // Update state
    currentQuestion = question;

    // Update UI
    if (questionText) {
      questionText.textContent = question.question;
    }

    // Clear input field
    if (inputField) {
      inputField.clear();
      inputField.focus();
    }

    // Reset submit button state
    if (submitButton) {
      submitButton.setDisabled(true);
    }

    console.log('✅ Loaded question:', question.question);
  } catch (error) {
    console.error('❌ Failed to load question:', error);
    showError('Failed to load question. Please try again.');
  }
}

/**
 * Handle submit answer
 */
async function handleSubmit() {
  if (!currentQuestion || !inputField) return;

  const answer = inputField.getValue().trim();
  if (!answer) return;

  try {
    // Disable buttons while processing
    if (submitButton) submitButton.setDisabled(true);
    if (skipButton) skipButton.setDisabled(true);

    console.log('💾 Saving answer:', { question: currentQuestion.question, answer });

    // Save answer
    const savedGem = await saveAnswer(currentQuestion, answer);

    console.log('✅ Answer saved successfully!');
    console.log('   Gem ID:', savedGem?.id);
    console.log('   Saved to RxDB:', savedGem ? 'Yes' : 'No');
    console.log('   Saved to Profile: Yes');

    // Add to history
    addToHistory(currentQuestion.question, answer);

    // Clear input
    inputField.clear();

    // Load next question
    await loadNextQuestion();

    // Re-enable skip button
    if (skipButton) skipButton.setDisabled(false);

    console.log('✅ Ready for next question');
  } catch (error) {
    console.error('❌ Failed to submit answer:', error);
    showError('Failed to save answer. Please try again.');

    // Re-enable buttons
    if (submitButton) submitButton.setDisabled(false);
    if (skipButton) skipButton.setDisabled(false);
  }
}

/**
 * Handle skip question
 */
async function handleSkip() {
  if (!currentQuestion) return;

  console.log('⏭️ Skipped question:', currentQuestion.question);

  // Load next question
  await loadNextQuestion();
}

/**
 * Set up clear history button
 */
function setupClearHistoryButton() {
  const clearButton = document.getElementById('clearHistoryButton');
  if (clearButton) {
    clearButton.addEventListener('click', async () => {
      if (confirm('Clear all session history? This will not delete your saved gems.')) {
        answeredQuestions = [];
        await saveHistoryToStorage();
        updateHistoryUI();
        console.log('✅ Session history cleared');
      }
    });
  }
}

/**
 * Load history from storage and RxDB
 */
async function loadHistoryFromStorage() {
  try {
    // First, try to load from local storage (session history)
    const result = await new Promise((resolve) => {
      chrome.storage.local.get(HISTORY_STORAGE_KEY, resolve);
    });

    if (result[HISTORY_STORAGE_KEY] && Array.isArray(result[HISTORY_STORAGE_KEY])) {
      answeredQuestions = result[HISTORY_STORAGE_KEY];
      console.log(`✅ Loaded ${answeredQuestions.length} answers from session storage`);
    }

    // Then, fetch previously answered random questions from RxDB
    await loadPreviousAnswersFromRxDB();

    // Update UI with combined history
    updateHistoryUI();
  } catch (error) {
    console.error('Failed to load history:', error);
  }
}

/**
 * Load previously answered random questions from RxDB
 */
async function loadPreviousAnswersFromRxDB() {
  try {
    // Get all gems with random_question source from RxDB via background
    const response = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        action: 'contextEngine.getAllGems',
        filters: {}
      }, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });

    if (response.success && response.gems) {
      // Filter for random question gems only
      const randomQuestionGems = response.gems.filter(gem =>
        gem.metadata?.source === 'random_question'
      );

      console.log(`✅ Found ${randomQuestionGems.length} previously answered random questions in RxDB`);

      // Add gems that aren't already in session history
      const existingQuestions = new Set(answeredQuestions.map(q => q.question));

      randomQuestionGems.forEach(gem => {
        const question = gem.topic || gem.metadata?.question;
        const answer = gem.value;
        const timestamp = gem.created_at ? new Date(gem.created_at).getTime() : 0;

        if (question && answer && !existingQuestions.has(question)) {
          answeredQuestions.push({ question, answer, timestamp });
        }
      });

      // Sort by newest first
      answeredQuestions.sort((a, b) => {
        const timeA = a.timestamp || 0;
        const timeB = b.timestamp || 0;
        return timeB - timeA;
      });

      // Save combined history to storage
      await saveHistoryToStorage();

      console.log(`✅ Total history: ${answeredQuestions.length} answers`);
    }
  } catch (error) {
    console.error('Failed to load previous answers from RxDB:', error);
  }
}

/**
 * Save history to storage
 */
async function saveHistoryToStorage() {
  try {
    await new Promise((resolve) => {
      chrome.storage.local.set({ [HISTORY_STORAGE_KEY]: answeredQuestions }, resolve);
    });
  } catch (error) {
    console.error('Failed to save history to storage:', error);
  }
}

/**
 * Add question/answer to history
 */
function addToHistory(question, answer) {
  // Add to state with timestamp for sorting
  answeredQuestions.unshift({
    question,
    answer,
    timestamp: Date.now()
  });

  // Save to storage
  saveHistoryToStorage();

  // Update UI
  updateHistoryUI();
}

/**
 * Update history UI
 */
function updateHistoryUI() {
  const historyList = document.getElementById('historyList');
  const historyCount = document.getElementById('historyCount');
  const clearButton = document.getElementById('clearHistoryButton');

  if (!historyList) return;

  // Update count
  if (historyCount) {
    historyCount.textContent = `(${answeredQuestions.length})`;
  }

  // Show/hide clear button
  if (clearButton) {
    clearButton.style.display = answeredQuestions.length > 0 ? 'block' : 'none';
  }

  // Clear existing items
  historyList.innerHTML = '';

  if (answeredQuestions.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'random-questions__history-empty';
    emptyState.textContent = 'No questions answered yet. Start answering to build your history!';
    historyList.appendChild(emptyState);
    return;
  }

  // Add history items
  answeredQuestions.forEach(({ question, answer }) => {
    const item = document.createElement('div');
    item.className = 'random-questions__history-item';

    const questionEl = document.createElement('div');
    questionEl.className = 'random-questions__history-question';
    questionEl.textContent = question;

    const answerEl = document.createElement('div');
    answerEl.className = 'random-questions__history-answer';
    answerEl.textContent = answer;

    item.appendChild(questionEl);
    item.appendChild(answerEl);
    historyList.appendChild(item);
  });
}

/**
 * Show error message
 */
function showError(message) {
  const questionText = document.getElementById('questionText');
  if (questionText) {
    questionText.textContent = message;
    questionText.style.color = 'var(--color-error)';
  }
}

// Initialize empty history on page load
updateHistoryUI();
