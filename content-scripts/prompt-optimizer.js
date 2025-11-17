/**
 * Data Gems Prompt Optimizer
 * Adds "Optimize" button above AI chat prompt fields
 * Sends prompt + profile to n8n context engineer for enhancement
 */

(function() {
'use strict';

// Bridge wrapper for MAIN world function
// Since this script runs in ISOLATED world and optimizePromptWithContext is in MAIN world,
// we use Custom Events to communicate between worlds
function optimizePromptWithContext(promptText, profile, useAI, maxGems) {
  return new Promise((resolve, reject) => {
    const requestId = `opt_${Date.now()}_${Math.random()}`;

    // Set up listeners for result
    const resultHandler = (event) => {
      if (event.detail.requestId === requestId) {
        document.removeEventListener('dataGems:optimizePrompt:result', resultHandler);
        document.removeEventListener('dataGems:optimizePrompt:error', errorHandler);
        resolve(event.detail.result);
      }
    };

    const errorHandler = (event) => {
      if (event.detail.requestId === requestId) {
        document.removeEventListener('dataGems:optimizePrompt:result', resultHandler);
        document.removeEventListener('dataGems:optimizePrompt:error', errorHandler);
        reject(new Error(event.detail.error));
      }
    };

    document.addEventListener('dataGems:optimizePrompt:result', resultHandler);
    document.addEventListener('dataGems:optimizePrompt:error', errorHandler);

    // Send request to MAIN world
    document.dispatchEvent(new CustomEvent('dataGems:optimizePrompt', {
      detail: { promptText, profile, useAI, maxGems, requestId }
    }));

    // Timeout after 60 seconds
    setTimeout(() => {
      document.removeEventListener('dataGems:optimizePrompt:result', resultHandler);
      document.removeEventListener('dataGems:optimizePrompt:error', errorHandler);
      reject(new Error('Optimization timeout'));
    }, 60000);
  });
}

// Configuration
// N8N_WEBHOOK_URL - Commented out, using local optimization instead
// const N8N_WEBHOOK_URL = 'https://n3rdstyle.app.n8n.cloud/webhook/ea6a32cc-72a6-4183-bacc-c5c2746ebca9';

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
let contextEngineReady = false;

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
    // Clear existing content
    promptElement.innerHTML = '';

    // Split text into lines and create proper DOM structure
    const lines = text.split('\n');

    // Create text nodes and br elements
    lines.forEach((line, index) => {
      // Add text node
      const textNode = document.createTextNode(line);
      promptElement.appendChild(textNode);

      // Add br element between lines (but not after last line)
      if (index < lines.length - 1) {
        const brElement = document.createElement('br');
        promptElement.appendChild(brElement);
      }
    });

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
 * Check Context Engine readiness
 */
async function checkContextEngineStatus() {
  try {
    // Check if ContextEngineAPI is available in MAIN world
    if (typeof window.ContextEngineAPI === 'undefined') {
      return false;
    }

    const wasReady = contextEngineReady;
    contextEngineReady = window.ContextEngineAPI.isReady === true;

    // If status changed from not ready to ready, update button
    if (!wasReady && contextEngineReady) {
      console.log('[Data Gems Prompt Optimizer] ✓ Context Engine is now ready!');
      updateOptimizeButtonState();
    }

    return contextEngineReady;
  } catch (error) {
    console.error('[Data Gems Prompt Optimizer] Error checking Context Engine status:', error);
    return false;
  }
}

/**
 * Create the optimize button
 */
function createOptimizeButton() {
  const button = document.createElement('button');
  button.id = 'data-gems-optimize-button';
  button.className = 'data-gems-optimize-button';
  button.textContent = 'Initializing...';
  button.setAttribute('aria-label', 'Optimize prompt with Data Gems context');
  button.setAttribute('type', 'button');
  button.disabled = true; // Start disabled

  // Add click handler
  button.addEventListener('click', handleOptimization);

  // Check Context Engine status and start polling
  checkContextEngineStatus();
  startContextEnginePolling();

  return button;
}

/**
 * Show the optimize button
 */
function showOptimizeButton() {
  if (optimizeButton || !promptElement) {
    return;
  }

  // Check if there's text in the prompt
  const promptText = getPromptValue().trim();
  if (!promptText) {
    return;
  }

  // Create wrapper div for positioning
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.justifyContent = 'flex-end';
  wrapper.style.alignItems = 'center';
  wrapper.style.marginBottom = '8px';
  wrapper.style.width = '100%';

  // Create button
  optimizeButton = createOptimizeButton();

  // Update button state based on Context Engine readiness
  updateOptimizeButtonState();

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
  console.error('[Data Gems Prompt Optimizer] ✗ All insertion strategies failed');
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
    updateOptimizeButtonState();
  }
}

/**
 * Update button state based on Context Engine readiness
 */
function updateOptimizeButtonState() {
  if (!optimizeButton) return;

  if (!contextEngineReady) {
    optimizeButton.textContent = 'Initializing...';
    optimizeButton.disabled = true;
    optimizeButton.classList.add('initializing');
    optimizeButton.classList.remove('loading');
  } else {
    optimizeButton.textContent = 'Optimize with Context';
    optimizeButton.disabled = false;
    optimizeButton.classList.remove('initializing', 'loading');
  }
}

/**
 * Handle prompt optimization
 */
async function handleOptimization() {
  if (isOptimizing) return;

  const promptText = getPromptValue().trim();
  if (!promptText) {
    return;
  }

  if (!hspProfile) {
    alert('Please set up your Data Gems profile first');
    return;
  }

  isOptimizing = true;
  setOptimizeButtonLoading(true);

  try {

    // ========================================
    // NEW: Local optimization with context selector
    // ========================================

    // Use the context selector to find relevant gems and format prompt
    // Request up to 5 gems for rich context (fan-out decomposition will explore broadly)
    const optimizedPrompt = await optimizePromptWithContext(promptText, hspProfile, true, 5);


    // Set the optimized prompt in the input field
    setPromptValue(optimizedPrompt);
    hideOptimizeButton();

    // Show success notification
    showNotification('Prompt enriched with relevant context from your Data Gems!', 'success');

    // ========================================
    // OLD: n8n Webhook Integration (COMMENTED OUT)
    // ========================================
    /*
    // Smart profile filtering: Remove images and binary data, keep text gems only
    const MAX_PROFILE_SIZE = 100000; // 100KB limit (reduced from 437KB)
    const MAX_STRING_LENGTH = 3000; // Limit each text field to 3000 chars

    function filterProfileData(obj, maxDepth = 5, currentDepth = 0) {
      if (currentDepth > maxDepth) return null;
      if (obj === null || obj === undefined) return obj;

      // If it's a primitive, check if it's a huge string (likely base64 image)
      if (typeof obj === 'string') {
        // Skip base64 images and very long strings
        if (obj.startsWith('data:image/') || obj.length > 5000) {
          return '[IMAGE_DATA_REMOVED]';
        }
        // Truncate long text to MAX_STRING_LENGTH
        if (obj.length > MAX_STRING_LENGTH) {
          return obj.substring(0, MAX_STRING_LENGTH) + '... [truncated]';
        }
        return obj;
      }

      if (typeof obj !== 'object') return obj;

      // Handle arrays - limit to first 20 items
      if (Array.isArray(obj)) {
        const filtered = obj
          .slice(0, 20)
          .map(item => filterProfileData(item, maxDepth, currentDepth + 1))
          .filter(Boolean);
        return filtered.length > 0 ? filtered : null;
      }

      // Handle objects
      const filtered = {};
      for (const [key, value] of Object.entries(obj)) {
        // Skip keys that typically contain binary/image data
        if (key.match(/image|photo|picture|avatar|thumbnail|base64|binary|media|file/i)) {
          continue;
        }

        const filteredValue = filterProfileData(value, maxDepth, currentDepth + 1);
        if (filteredValue !== null && filteredValue !== undefined) {
          filtered[key] = filteredValue;
        }

        // Check if we're getting too large
        const currentSize = JSON.stringify(filtered).length;
        if (currentSize > MAX_PROFILE_SIZE) {
          break;
        }
      }
      return Object.keys(filtered).length > 0 ? filtered : null;
    }

    // Extract and filter profile data
    let minimalProfile;

    if (hspProfile.content) {
      minimalProfile = filterProfileData(hspProfile.content);
    } else if (hspProfile.hsp) {
      minimalProfile = filterProfileData(hspProfile.hsp);
    } else {
      minimalProfile = {
        name: hspProfile.name || 'User',
        role: hspProfile.role || '',
        company: hspProfile.company || '',
        experience: hspProfile.experience || '',
        specialties: hspProfile.specialties || '',
        interests: hspProfile.interests || '',
        bio: hspProfile.bio || ''
      };
    }

    const minimalProfileStr = JSON.stringify(minimalProfile);
    const originalProfileStr = JSON.stringify(hspProfile);

      prompt: promptText,
      originalProfileSize: originalProfileStr.length,
      minimalProfileSize: minimalProfileStr.length,
      sizeReduction: `${Math.round((1 - minimalProfileStr.length / originalProfileStr.length) * 100)}%`,
      profilePreview: JSON.stringify(minimalProfile).substring(0, 500)
    });

    // Send prompt + minimal profile to n8n webhook (with 90s timeout for AI processing)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: promptText,
        profile: minimalProfile
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}: ${response.statusText}`);
    }

    // Get raw response text first
    const responseText = await response.text();

    // Try to parse as JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[Data Gems] JSON parse error:', parseError);
      console.error('[Data Gems] Response text:', responseText);
      throw new Error('Failed to parse response as JSON');
    }


    // Handle response - n8n returns array format: [{"optimized_prompt":"..."}]
    const responseData = Array.isArray(result) ? result[0] : result;

    if (responseData.output && responseData.output.additional_data === 'true') {
      // Need more information - show questions modal
      handleAdditionalDataRequest(responseData.output, promptText);
    } else if (responseData.optimized_prompt) {
      // Got optimized prompt - replace in prompt field
      setPromptValue(responseData.optimized_prompt);
      hideOptimizeButton();

      // Show success notification
      showNotification('Prompt optimized with your context!', 'success');
    } else {
      console.warn('[Data Gems] Unexpected response format:', result);
      showNotification('Received response but could not extract optimized prompt', 'warning');
    }
    */

  } catch (error) {
    console.error('[Data Gems] Optimization error:', error);

    let errorMessage = error.message;
    if (error.name === 'AbortError') {
      errorMessage = 'Request timed out after 90 seconds. Your profile may be too large.';
    }

    showNotification(`Optimization failed: ${errorMessage}`, 'error');
  } finally {
    isOptimizing = false;
    setOptimizeButtonLoading(false);
  }
}

/**
 * Handle additional data request (questions from workflow)
 * COMMENTED OUT - Not used with local optimization
 */
/*
function handleAdditionalDataRequest(output, originalPrompt) {

  // TODO: Create a modal to show questions and collect answers
  // For now, just notify the user
  const questions = output.additional_data_request || output.questions || [];

  if (questions.length > 0) {
    showNotification(`The context engineer needs ${questions.length} more piece(s) of information. Check the console for questions.`, 'info');
  }
}
*/

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
    return;
  }


  // Load profile from storage
  try {
    const result = await chrome.storage.local.get(['hspProfile']);
    hspProfile = result.hspProfile;

    if (!hspProfile) {
      console.warn('[Data Gems Prompt Optimizer] No profile found in storage. Please set up your profile first.');
      return;
    }

  } catch (error) {
    console.error('[Data Gems Prompt Optimizer] Failed to load profile:', error);
    return;
  }

  // Wait for prompt element to be available
  const waitForPrompt = setInterval(() => {
    promptElement = findPromptElement(currentPlatform);

    if (promptElement) {
      clearInterval(waitForPrompt);

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

/**
 * Context Engine status polling
 */
let contextEnginePollingInterval = null;

function startContextEnginePolling() {
  // Don't start if already polling
  if (contextEnginePollingInterval) return;

  // Poll every 500ms until ready
  contextEnginePollingInterval = setInterval(async () => {
    const isReady = await checkContextEngineStatus();

    // Stop polling once ready
    if (isReady) {
      clearInterval(contextEnginePollingInterval);
      contextEnginePollingInterval = null;
    }
  }, 500);

  // Stop polling after 30 seconds (timeout)
  setTimeout(() => {
    if (contextEnginePollingInterval) {
      clearInterval(contextEnginePollingInterval);
      contextEnginePollingInterval = null;
    }
  }, 30000);
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

})(); // End of IIFE
