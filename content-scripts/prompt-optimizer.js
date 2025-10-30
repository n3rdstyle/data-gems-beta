/**
 * Data Gems Prompt Optimizer
 * Adds "Optimize" button above AI chat prompt fields
 * Sends prompt + profile to n8n context engineer for enhancement
 */

// Configuration
const N8N_WEBHOOK_URL = 'https://n3rdstyle.app.n8n.cloud/webhook/ea6a32cc-72a6-4183-bacc-c5c2746ebca9';

// Platform detection (reuse from profile-injector)
const PLATFORMS = {
  CHATGPT: {
    name: 'ChatGPT',
    hostPatterns: ['chat.openai.com', 'chatgpt.com'],
    selectors: {
      promptInput: '#prompt-textarea, textarea[data-id], div[contenteditable="true"][data-testid="textbox"]',
      inputContainer: 'main'
    },
    isContentEditable: true
  },
  CLAUDE: {
    name: 'Claude',
    hostPatterns: ['claude.ai'],
    selectors: {
      promptInput: 'div[contenteditable="true"][data-placeholder*="message"], div.ProseMirror[contenteditable="true"]',
      inputContainer: 'div[class*="InputContainer"], fieldset'
    },
    isContentEditable: true
  },
  GEMINI: {
    name: 'Gemini',
    hostPatterns: ['gemini.google.com'],
    selectors: {
      promptInput: 'div[contenteditable="true"].ql-editor, rich-textarea[class*="input-area"]',
      inputContainer: 'div[class*="input-area-container"]'
    },
    isContentEditable: true
  },
  GROK: {
    name: 'Grok',
    hostPatterns: ['grok.com', 'x.com', 'twitter.com'],
    selectors: {
      promptInput: 'textarea[placeholder*="Ask" i], textarea[placeholder*="message" i], textarea[class*="input"], textarea[data-testid*="input"], div[contenteditable="true"], textarea',
      inputContainer: 'div.query-bar, form, main'
    },
    isContentEditable: false
  }
};

// Global state
let currentPlatform = null;
let optimizeButton = null;
let promptElement = null;
let hspProfile = null;
let isOptimizing = false;

/**
 * Detect current platform
 */
function detectPlatform() {
  const hostname = window.location.hostname;

  for (const [key, platform] of Object.entries(PLATFORMS)) {
    if (platform.hostPatterns.some(pattern => hostname.includes(pattern))) {
      return platform;
    }
  }

  return null;
}

/**
 * Find the prompt input element
 */
function findPromptElement(platform) {
  if (!platform) return null;

  const selector = platform.selectors.promptInput;
  const element = document.querySelector(selector);

  return element;
}

/**
 * Get prompt element value
 */
function getPromptValue() {
  if (!promptElement) return '';

  if (currentPlatform.isContentEditable) {
    return promptElement.textContent || '';
  } else {
    return promptElement.value || '';
  }
}

/**
 * Set prompt element value
 */
function setPromptValue(text) {
  if (!promptElement) return;

  if (currentPlatform.isContentEditable) {
    promptElement.textContent = text;

    // Trigger input event
    const event = new Event('input', { bubbles: true });
    promptElement.dispatchEvent(event);

    // Place cursor at end
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(promptElement);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);

    promptElement.focus();
  } else {
    promptElement.value = text;

    // Trigger input and change events
    promptElement.dispatchEvent(new Event('input', { bubbles: true }));
    promptElement.dispatchEvent(new Event('change', { bubbles: true }));

    // Focus and place cursor at end
    promptElement.focus();
    promptElement.setSelectionRange(text.length, text.length);
  }
}

/**
 * Create the optimize button
 */
function createOptimizeButton() {
  const button = document.createElement('button');
  button.id = 'data-gems-optimize-button';
  button.className = 'data-gems-optimize-button';
  button.textContent = 'Optimize with Context';
  button.setAttribute('aria-label', 'Optimize prompt with Data Gems context');
  button.setAttribute('type', 'button');

  // Add click handler
  button.addEventListener('click', handleOptimization);

  return button;
}

/**
 * Show the optimize button
 */
function showOptimizeButton() {
  if (optimizeButton || !promptElement) return;

  // Check if there's text in the prompt
  const promptText = getPromptValue().trim();
  if (!promptText) return;

  // Create wrapper div for positioning
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.justifyContent = 'flex-end';
  wrapper.style.alignItems = 'center';
  wrapper.style.marginBottom = '8px';
  wrapper.style.width = '100%';

  // Create button
  optimizeButton = createOptimizeButton();

  // Add button to wrapper
  wrapper.appendChild(optimizeButton);

  // Strategy 1: Try to find form element (ChatGPT, Claude, etc.)
  const formElement = promptElement.closest('form');
  if (formElement && formElement.parentElement) {
    formElement.parentElement.insertBefore(wrapper, formElement);
    optimizeButton._wrapper = wrapper;
    return;
  }

  // Strategy 2: Use platform-specific inputContainer selector
  if (currentPlatform.selectors.inputContainer) {
    const container = document.querySelector(currentPlatform.selectors.inputContainer);
    if (container) {
      container.insertBefore(wrapper, container.firstChild);
      optimizeButton._wrapper = wrapper;
      return;
    }
  }

  // Strategy 3: Fallback - insert before the prompt element's parent
  if (promptElement.parentElement) {
    promptElement.parentElement.insertBefore(wrapper, promptElement);
    optimizeButton._wrapper = wrapper;
    return;
  }

  // If all strategies fail, cleanup
  wrapper.remove();
  optimizeButton = null;
}

/**
 * Hide the optimize button
 */
function hideOptimizeButton() {
  if (optimizeButton) {
    if (optimizeButton._wrapper) {
      optimizeButton._wrapper.remove();
    } else {
      optimizeButton.remove();
    }
    optimizeButton = null;
  }
}

/**
 * Update button loading state
 */
function setOptimizeButtonLoading(loading) {
  if (!optimizeButton) return;

  if (loading) {
    optimizeButton.textContent = 'Optimizing...';
    optimizeButton.disabled = true;
    optimizeButton.classList.add('loading');
  } else {
    optimizeButton.textContent = 'Optimize with Context';
    optimizeButton.disabled = false;
    optimizeButton.classList.remove('loading');
  }
}

/**
 * Handle prompt optimization
 */
async function handleOptimization() {
  if (isOptimizing) return;

  const promptText = getPromptValue().trim();
  if (!promptText) {
    console.log('[Data Gems] No prompt text to optimize');
    return;
  }

  if (!hspProfile) {
    console.log('[Data Gems] No profile available');
    alert('Please set up your Data Gems profile first');
    return;
  }

  isOptimizing = true;
  setOptimizeButtonLoading(true);

  try {
    console.log('[Data Gems] Sending to context engineer:', {
      prompt: promptText,
      profileSize: JSON.stringify(hspProfile).length
    });

    // Send prompt + profile to n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: promptText,
        profile: hspProfile
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('[Data Gems] Context engineer response:', result);

    // Handle response
    if (result.output && result.output.additional_data === 'true') {
      // Need more information - show questions modal
      handleAdditionalDataRequest(result.output, promptText);
    } else if (result.optimized_prompt) {
      // Got optimized prompt - replace in prompt field
      setPromptValue(result.optimized_prompt);
      hideOptimizeButton();

      // Show success notification
      showNotification('Prompt optimized with your context!', 'success');
    } else {
      console.warn('[Data Gems] Unexpected response format:', result);
      showNotification('Received response but could not extract optimized prompt', 'warning');
    }

  } catch (error) {
    console.error('[Data Gems] Optimization error:', error);
    showNotification(`Optimization failed: ${error.message}`, 'error');
  } finally {
    isOptimizing = false;
    setOptimizeButtonLoading(false);
  }
}

/**
 * Handle additional data request (questions from workflow)
 */
function handleAdditionalDataRequest(output, originalPrompt) {
  console.log('[Data Gems] Additional data needed:', output);

  // TODO: Create a modal to show questions and collect answers
  // For now, just notify the user
  const questions = output.additional_data_request || output.questions || [];

  if (questions.length > 0) {
    showNotification(`The context engineer needs ${questions.length} more piece(s) of information. Check the console for questions.`, 'info');
    console.log('[Data Gems] Questions to answer:', questions);
  }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `data-gems-notification data-gems-notification-${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

/**
 * Update button visibility based on prompt content
 */
function updateButtonVisibility() {
  if (!currentPlatform || !promptElement || isOptimizing) {
    return;
  }

  const promptText = getPromptValue().trim();

  if (promptText && hspProfile) {
    showOptimizeButton();
  } else {
    hideOptimizeButton();
  }
}

/**
 * Initialize prompt optimizer
 */
async function initializePromptOptimizer() {
  // Detect platform
  currentPlatform = detectPlatform();
  if (!currentPlatform) {
    console.log('[Data Gems] Platform not supported for prompt optimization');
    return;
  }

  console.log('[Data Gems] Prompt optimizer initializing on:', currentPlatform.name);

  // Load profile from storage
  try {
    const result = await chrome.storage.local.get(['hspProfile']);
    hspProfile = result.hspProfile;

    if (!hspProfile) {
      console.log('[Data Gems] No profile found');
      return;
    }
  } catch (error) {
    console.error('[Data Gems] Failed to load profile:', error);
    return;
  }

  // Wait for prompt element to be available
  const waitForPrompt = setInterval(() => {
    promptElement = findPromptElement(currentPlatform);

    if (promptElement) {
      clearInterval(waitForPrompt);
      console.log('[Data Gems] Prompt element found, setting up monitoring');

      // Setup input monitoring
      setupInputMonitoring();

      // Initial visibility check
      updateButtonVisibility();
    }
  }, 1000);

  // Stop trying after 30 seconds
  setTimeout(() => {
    clearInterval(waitForPrompt);
  }, 30000);
}

/**
 * Setup input monitoring for button visibility
 */
function setupInputMonitoring() {
  if (!promptElement) return;

  // Listen for input changes
  const handleInputChange = () => {
    updateButtonVisibility();
  };

  if (currentPlatform.isContentEditable) {
    // For contenteditable, use MutationObserver
    const observer = new MutationObserver(handleInputChange);
    observer.observe(promptElement, {
      characterData: true,
      childList: true,
      subtree: true
    });
  } else {
    // For textarea/input, use input event
    promptElement.addEventListener('input', handleInputChange);
  }

  // Also monitor for URL changes (new chat)
  let lastUrl = window.location.href;
  const urlObserver = new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;

      // Reset UI state for new chat
      hideOptimizeButton();
      promptElement = null;

      // Reinitialize after a short delay
      setTimeout(() => {
        initializePromptOptimizer();
      }, 1000);
    }
  });

  urlObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Listen for profile updates
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.hspProfile) {
    hspProfile = changes.hspProfile.newValue;
    updateButtonVisibility();
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePromptOptimizer);
} else {
  initializePromptOptimizer();
}
