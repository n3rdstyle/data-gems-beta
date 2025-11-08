/**
 * Data Gems Prompt Optimizer
 * Adds "Optimize" button above AI chat prompt fields
 * Sends prompt + profile to n8n context engineer for enhancement
 */

(function() {
'use strict';

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

  console.log('[Data Gems] Setting prompt value:', {
    isContentEditable: currentPlatform.isContentEditable,
    textLength: text.length,
    hasNewlines: text.includes('\n'),
    newlineCount: (text.match(/\n/g) || []).length
  });

  if (currentPlatform.isContentEditable) {
    // Clear existing content
    promptElement.innerHTML = '';

    // Split text into lines and create proper DOM structure
    const lines = text.split('\n');
    console.log('[Data Gems] Converted to HTML:', {
      htmlLength: text.length,
      lineCount: lines.length,
      preview: text.substring(0, 200)
    });

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
  if (optimizeButton || !promptElement) {
    console.log('[Data Gems Prompt Optimizer] Cannot show button:', {
      buttonAlreadyExists: !!optimizeButton,
      hasPromptElement: !!promptElement
    });
    return;
  }

  // Check if there's text in the prompt
  const promptText = getPromptValue().trim();
  if (!promptText) {
    console.log('[Data Gems Prompt Optimizer] No prompt text, not showing button');
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

  // Add button to wrapper
  wrapper.appendChild(optimizeButton);

  // Strategy 1: Try to find form element (ChatGPT, Claude, etc.)
  const formElement = promptElement.closest('form');
  if (formElement && formElement.parentElement) {
    formElement.parentElement.insertBefore(wrapper, formElement);
    optimizeButton._wrapper = wrapper;
    console.log('[Data Gems Prompt Optimizer] ✓ Button inserted (Strategy 1: form parent)');
    return;
  }

  // Strategy 2: Use platform-specific inputContainer selector
  if (currentPlatform.selectors.inputContainer) {
    const container = document.querySelector(currentPlatform.selectors.inputContainer);
    if (container) {
      container.insertBefore(wrapper, container.firstChild);
      optimizeButton._wrapper = wrapper;
      console.log('[Data Gems Prompt Optimizer] ✓ Button inserted (Strategy 2: input container)');
      return;
    }
  }

  // Strategy 3: Fallback - insert before the prompt element's parent
  if (promptElement.parentElement) {
    promptElement.parentElement.insertBefore(wrapper, promptElement);
    optimizeButton._wrapper = wrapper;
    console.log('[Data Gems Prompt Optimizer] ✓ Button inserted (Strategy 3: before prompt)');
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
    console.log('[Data Gems] Optimizing prompt locally with context selector');

    // ========================================
    // NEW: Local optimization with context selector
    // ========================================

    // Use the context selector to find relevant gems and format prompt
    // Request up to 5 gems for rich context (fan-out decomposition will explore broadly)
    const optimizedPrompt = await optimizePromptWithContext(promptText, hspProfile, true, 5);

    console.log('[Data Gems] Optimized prompt:', optimizedPrompt.substring(0, 200) + '...');

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
          console.log('[Data Gems] Profile size limit reached, stopping at key:', key);
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

    console.log('[Data Gems] Sending to context engineer:', {
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
    console.log('[Data Gems] Raw response:', responseText.substring(0, 500));

    // Try to parse as JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[Data Gems] JSON parse error:', parseError);
      console.error('[Data Gems] Response text:', responseText);
      throw new Error('Failed to parse response as JSON');
    }

    console.log('[Data Gems] Context engineer response:', result);

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
  console.log('[Data Gems] Additional data needed:', output);

  // TODO: Create a modal to show questions and collect answers
  // For now, just notify the user
  const questions = output.additional_data_request || output.questions || [];

  if (questions.length > 0) {
    showNotification(`The context engineer needs ${questions.length} more piece(s) of information. Check the console for questions.`, 'info');
    console.log('[Data Gems] Questions to answer:', questions);
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
    console.log('[Data Gems Prompt Optimizer] Button visibility check failed:', {
      hasPlatform: !!currentPlatform,
      hasPromptElement: !!promptElement,
      isOptimizing: isOptimizing
    });
    return;
  }

  const promptText = getPromptValue().trim();

  console.log('[Data Gems Prompt Optimizer] Button visibility check:', {
    hasPromptText: !!promptText,
    promptTextLength: promptText.length,
    hasProfile: !!hspProfile
  });

  if (promptText && hspProfile) {
    console.log('[Data Gems Prompt Optimizer] → Showing button');
    showOptimizeButton();
  } else {
    console.log('[Data Gems Prompt Optimizer] → Hiding button');
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
      console.warn('[Data Gems Prompt Optimizer] No profile found in storage. Please set up your profile first.');
      console.log('[Data Gems Prompt Optimizer] Checked storage key: hspProfile');
      console.log('[Data Gems Prompt Optimizer] Storage result:', result);
      return;
    }

    console.log('[Data Gems Prompt Optimizer] Profile loaded successfully:', Object.keys(hspProfile));
  } catch (error) {
    console.error('[Data Gems Prompt Optimizer] Failed to load profile:', error);
    return;
  }

  // Wait for prompt element to be available
  const waitForPrompt = setInterval(() => {
    promptElement = findPromptElement(currentPlatform);

    if (promptElement) {
      clearInterval(waitForPrompt);
      console.log('[Data Gems Prompt Optimizer] ✓ Prompt element found:', promptElement.tagName);
      console.log('[Data Gems Prompt Optimizer] ✓ Setting up monitoring');

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
console.log('[Data Gems Prompt Optimizer] Script loaded, document state:', document.readyState);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePromptOptimizer);
} else {
  initializePromptOptimizer();
}

})(); // End of IIFE
