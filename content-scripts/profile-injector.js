/**
 * Data Gems Profile Injector
 * Injects user profile into AI chat interfaces
 * Supported platforms: ChatGPT, Claude, Gemini, Perplexity, Grok
 */

// Platform detection and configuration
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
  PERPLEXITY: {
    name: 'Perplexity',
    hostPatterns: ['perplexity.ai'],
    selectors: {
      promptInput: 'textarea[placeholder*="Ask"], textarea[class*="TextArea"]',
      inputContainer: 'div[class*="TextAreaContainer"]'
    },
    isContentEditable: false
  },
  GROK: {
    name: 'Grok',
    hostPatterns: ['x.com', 'twitter.com'],
    selectors: {
      promptInput: 'textarea[aria-label*="message"], div[contenteditable="true"][data-placeholder*="Grok"]',
      inputContainer: 'div[class*="MessageInput"]'
    },
    isContentEditable: false
  }
};

// Global state
let currentPlatform = null;
let injectionButton = null;
let promptElement = null;
let hasProfile = null;
let observerActive = false;

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
 * Check if chat is new (empty input)
 */
function isNewChat() {
  if (!promptElement) return false;

  if (currentPlatform.isContentEditable) {
    const text = promptElement.textContent || '';
    return text.trim() === '';
  } else {
    const text = promptElement.value || '';
    return text.trim() === '';
  }
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
    // For contenteditable elements, set textContent
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

    // Focus element
    promptElement.focus();
  } else {
    // For textarea/input elements
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
 * Create the injection button
 */
function createInjectionButton() {
  const button = document.createElement('button');
  button.id = 'data-gems-inject-button';
  button.className = 'data-gems-inject-button';
  button.textContent = 'Inject my profile';
  button.setAttribute('aria-label', 'Inject Data Gems profile');
  button.setAttribute('type', 'button');

  // Add click handler
  button.addEventListener('click', handleInjection);

  return button;
}

/**
 * Show the injection button
 */
function showInjectionButton() {
  if (injectionButton || !promptElement) return;

  // Find the form element (parent of the prompt)
  const formElement = promptElement.closest('form');
  if (!formElement || !formElement.parentElement) return;

  // Create wrapper div for right alignment
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.justifyContent = 'flex-end';
  wrapper.style.marginBottom = '16px';

  // Create button
  injectionButton = createInjectionButton();

  // Add button to wrapper
  wrapper.appendChild(injectionButton);

  // Insert wrapper BEFORE the form element
  formElement.parentElement.insertBefore(wrapper, formElement);

  // Store wrapper reference for cleanup
  injectionButton._wrapper = wrapper;
}

/**
 * Hide the injection button
 */
function hideInjectionButton() {
  if (injectionButton) {
    // Remove wrapper if it exists
    if (injectionButton._wrapper) {
      injectionButton._wrapper.remove();
    } else {
      injectionButton.remove();
    }
    injectionButton = null;
  }
}

/**
 * Handle profile injection
 */
async function handleInjection() {
  if (!hasProfile) {
    console.error('[Data Gems] No profile data available');
    return;
  }

  // Format profile as JSON (without the explanation text)
  const profileData = formatProfileAsJSON(hasProfile);

  // Create JSON Blob
  const blob = new Blob([profileData], { type: 'application/json' });

  // Create File object
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const fileName = `data-gems-profile-${timestamp}.json`;
  const file = new File([blob], fileName, { type: 'application/json' });

  // Try to attach file to ChatGPT
  const success = await attachFileToChat(file);

  if (success) {
    // Hide button after successful injection
    hideInjectionButton();
  } else {
    console.error('[Data Gems] Failed to attach profile file');
    alert('Failed to attach profile. Please try again.');
  }
}

/**
 * Format profile as clean JSON (without explanation text)
 */
function formatProfileAsJSON(hasProfile) {
  const filteredProfile = {
    hsp: hasProfile.hsp,
    type: hasProfile.type
  };

  if (hasProfile.content?.basic?.identity) {
    filteredProfile.content = {
      basic: {
        identity: {}
      }
    };

    const identity = hasProfile.content.basic.identity;
    Object.keys(identity).forEach(key => {
      const field = identity[key];

      if (field.state === 'hidden') return;
      if (field.value === null || field.value === '' ||
          (Array.isArray(field.value) && field.value.length === 0)) return;
      if (key === 'avatarImage') return;

      filteredProfile.content.basic.identity[key] = field;
    });
  }

  if (hasProfile.content?.preferences?.items) {
    if (!filteredProfile.content) {
      filteredProfile.content = {};
    }

    filteredProfile.content.preferences = {
      items: hasProfile.content.preferences.items.filter(pref => {
        if (pref.state === 'hidden') return false;
        if (!pref.value || pref.value.trim() === '') return false;
        return true;
      })
    };
  }

  if (hasProfile.collections && hasProfile.collections.length > 0) {
    filteredProfile.collections = hasProfile.collections;
  }

  return JSON.stringify(filteredProfile, null, 2);
}

/**
 * Attach file to ChatGPT chat
 */
async function attachFileToChat(file) {
  // Method 1: Try to find file input and trigger it
  const fileInputs = document.querySelectorAll('input[type="file"]');

  for (const input of fileInputs) {
    // Skip image-only inputs
    if (input.accept && input.accept.includes('image/') && !input.accept.includes('*')) {
      continue;
    }

    // Create DataTransfer object with our file
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    // Set files property
    input.files = dataTransfer.files;

    // Trigger change event
    const changeEvent = new Event('change', { bubbles: true });
    input.dispatchEvent(changeEvent);

    return true;
  }

  // Method 2: Try to simulate drop event on the composer
  const composer = document.querySelector('form.group\\/composer, [class*="composer"]');

  if (composer) {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const dropEvent = new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      dataTransfer: dataTransfer
    });

    composer.dispatchEvent(dropEvent);
    return true;
  }

  return false;
}

/**
 * Check if button should be visible
 */
function updateButtonVisibility() {
  if (!currentPlatform || !promptElement) {
    hideInjectionButton();
    return;
  }

  const chatIsNew = isNewChat();
  const hasData = hasInjectableData(hasProfile);

  if (chatIsNew && hasData) {
    showInjectionButton();
  } else {
    hideInjectionButton();
  }
}

/**
 * Initialize profile injection
 */
async function initializeProfileInjection() {
  // Detect platform
  currentPlatform = detectPlatform();
  if (!currentPlatform) return;

  // Load profile from storage
  try {
    const result = await chrome.storage.local.get(['hasProfile']);
    hasProfile = result.hasProfile;
    if (!hasProfile) return;
  } catch (error) {
    console.error('[Data Gems] Error loading profile:', error);
    return;
  }

  // Wait for prompt element to be available
  const waitForPrompt = setInterval(() => {
    promptElement = findPromptElement(currentPlatform);

    if (promptElement) {
      clearInterval(waitForPrompt);

      // Initial visibility check
      updateButtonVisibility();

      // Monitor input changes
      setupInputMonitoring();
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
  if (!promptElement || observerActive) return;

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
    observerActive = true;
  } else {
    // For textarea/input, use input event
    promptElement.addEventListener('input', handleInputChange);
    observerActive = true;
  }

  // Also monitor for URL changes (new chat)
  let lastUrl = window.location.href;
  const urlObserver = new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;

      // Reset state
      hideInjectionButton();
      promptElement = null;
      observerActive = false;

      // Reinitialize after a short delay
      setTimeout(() => {
        initializeProfileInjection();
      }, 1000);
    }
  });

  urlObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Copy formatter functions (inline to avoid external dependencies in content script)
function formatProfileForInjection(hasProfile, options = {}) {
  const {
    includeHidden = false,
    includeMetadata = false,
    prettify = true
  } = options;

  if (!hasProfile || !hasProfile.hsp) {
    return 'No profile data available.';
  }

  const filteredProfile = {
    hsp: hasProfile.hsp,
    type: hasProfile.type
  };

  if (hasProfile.content?.basic?.identity) {
    filteredProfile.content = {
      basic: {
        identity: {}
      }
    };

    const identity = hasProfile.content.basic.identity;
    Object.keys(identity).forEach(key => {
      const field = identity[key];

      if (!includeHidden && field.state === 'hidden') {
        return;
      }

      if (field.value === null || field.value === '' ||
          (Array.isArray(field.value) && field.value.length === 0)) {
        return;
      }

      if (key === 'avatarImage') {
        return;
      }

      filteredProfile.content.basic.identity[key] = field;
    });
  }

  if (hasProfile.content?.preferences?.items) {
    if (!filteredProfile.content) {
      filteredProfile.content = {};
    }

    filteredProfile.content.preferences = {
      items: hasProfile.content.preferences.items.filter(pref => {
        if (!includeHidden && pref.state === 'hidden') {
          return false;
        }
        if (!pref.value || pref.value.trim() === '') {
          return false;
        }
        return true;
      })
    };
  }

  if (hasProfile.collections && hasProfile.collections.length > 0) {
    filteredProfile.collections = hasProfile.collections;
  }

  if (includeMetadata && hasProfile.metadata) {
    filteredProfile.metadata = {
      schema_version: hasProfile.metadata.schema_version,
      total_preferences: hasProfile.metadata.total_preferences
    };
  }

  const jsonString = prettify
    ? JSON.stringify(filteredProfile, null, 2)
    : JSON.stringify(filteredProfile);

  const injectionText = `Here is my Data Gems profile in HSP Protocol v${hasProfile.hsp} format:

\`\`\`json
${jsonString}
\`\`\`

Please use this information as context for our conversation.`;

  return injectionText;
}

function hasInjectableData(hasProfile) {
  if (!hasProfile || !hasProfile.hsp) {
    return false;
  }

  const identity = hasProfile.content?.basic?.identity || {};
  const preferences = hasProfile.content?.preferences?.items || [];

  const hasIdentityData = Object.keys(identity).some(key => {
    if (key === 'avatarImage') return false;
    const field = identity[key];
    return field && field.value && field.value !== '' &&
           (!Array.isArray(field.value) || field.value.length > 0) &&
           field.state !== 'hidden';
  });

  const hasPreferences = preferences.some(p =>
    p.value && p.value.trim() !== '' && p.state !== 'hidden'
  );

  return hasIdentityData || hasPreferences;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeProfileInjection);
} else {
  initializeProfileInjection();
}
