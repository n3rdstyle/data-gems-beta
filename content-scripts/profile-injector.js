/**
 * Data Gems Profile Injector
 * Injects user profile into AI chat interfaces
 * Supported platforms: ChatGPT, Claude, Gemini, Grok
 */

// Platform detection and configuration
const PLATFORMS = {
  CHATGPT: {
    name: 'ChatGPT',
    hostPatterns: ['chat.openai.com', 'chatgpt.com'],
    selectors: {
      promptInput: '#prompt-textarea, textarea[data-id], div[contenteditable="true"][data-testid="textbox"]',
      inputContainer: 'main',
      uploadButton: 'button[aria-label*="attach" i], button[aria-label*="upload" i], input[type="file"]'
    },
    isContentEditable: true,
    injectionMethod: 'file' // Try file attachment first, fall back to text if fails
  },
  CLAUDE: {
    name: 'Claude',
    hostPatterns: ['claude.ai'],
    selectors: {
      promptInput: 'div[contenteditable="true"][data-placeholder*="message"], div.ProseMirror[contenteditable="true"]',
      inputContainer: 'div[class*="InputContainer"], fieldset',
      uploadButton: 'button[aria-label*="attach" i], button[aria-label*="Add content" i], input[type="file"]'
    },
    isContentEditable: true,
    injectionMethod: 'file' // Claude: attach JSON file
  },
  GEMINI: {
    name: 'Gemini',
    hostPatterns: ['gemini.google.com'],
    selectors: {
      promptInput: 'div[contenteditable="true"].ql-editor, rich-textarea[class*="input-area"]',
      inputContainer: 'div[class*="input-area-container"]',
      uploadButton: 'button[aria-label*="upload" i], button[aria-label*="attach" i], button[aria-label*="file" i], button.upload-button'
    },
    isContentEditable: true,
    injectionMethod: 'file' // Gemini: attach file
  },
  // PERPLEXITY: Disabled - Perplexity blocks content scripts via CSP
  // PERPLEXITY: {
  //   name: 'Perplexity',
  //   hostPatterns: ['perplexity.ai'],
  //   selectors: {
  //     promptInput: '#ask-input, div[contenteditable="true"][role="textbox"][data-lexical-editor="true"]',
  //     inputContainer: 'div.relative.rounded-2xl'
  //   },
  //   isContentEditable: true,
  //   injectionMethod: 'text'
  // },
  GROK: {
    name: 'Grok',
    hostPatterns: ['grok.com', 'x.com', 'twitter.com'],
    selectors: {
      // Try multiple selectors: placeholder, class, data-testid, then fallback to any textarea
      promptInput: 'textarea[placeholder*="Ask" i], textarea[placeholder*="message" i], textarea[class*="input"], textarea[data-testid*="input"], div[contenteditable="true"], textarea',
      inputContainer: 'div.query-bar, form, main',
      uploadButton: 'button[aria-label*="attach" i], button.group\\/attach-button, input[type="file"]'
    },
    isContentEditable: false,
    injectionMethod: 'file' // Grok: attach file
  }
};

// Global state
let currentPlatform = null;
let injectionButton = null;
let promptElement = null;
let hasProfile = null;
let observerActive = false;
let autoInjectEnabled = false;
let hasAutoInjected = false; // Track if we've already auto-injected for this page
let lastAutoInjectUrl = ''; // Track URL to detect new chats

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
  // Don't show button if auto-inject is enabled
  if (autoInjectEnabled) return;

  if (injectionButton || !promptElement) return;

  // Create wrapper div for center alignment
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.justifyContent = 'center';
  wrapper.style.alignItems = 'center';
  wrapper.style.marginBottom = '16px';
  wrapper.style.width = '100%';
  wrapper.style.textAlign = 'center';

  // Create button
  injectionButton = createInjectionButton();

  // Add button to wrapper
  wrapper.appendChild(injectionButton);

  // Grok-specific strategy: Insert before the query-bar div
  if (currentPlatform.name === 'Grok') {
    const queryBar = document.querySelector('div.query-bar');
    if (queryBar && queryBar.parentElement) {
      queryBar.parentElement.insertBefore(wrapper, queryBar);
      injectionButton._wrapper = wrapper;
      return;
    }
  }

  // Strategy 1: Try to find form element (ChatGPT, Claude, etc.)
  const formElement = promptElement.closest('form');
  if (formElement && formElement.parentElement) {
    // Insert wrapper BEFORE the form element
    formElement.parentElement.insertBefore(wrapper, formElement);
    injectionButton._wrapper = wrapper;
    return;
  }

  // Strategy 2: Use platform-specific inputContainer selector (Gemini, etc.)
  if (currentPlatform.selectors.inputContainer) {
    const container = document.querySelector(currentPlatform.selectors.inputContainer);
    if (container) {
      // Insert wrapper as first child of container
      container.insertBefore(wrapper, container.firstChild);
      injectionButton._wrapper = wrapper;
      return;
    }
  }

  // Strategy 3: Fallback - insert before the prompt element's parent
  if (promptElement.parentElement) {
    promptElement.parentElement.insertBefore(wrapper, promptElement);
    injectionButton._wrapper = wrapper;
    return;
  }

  // If all strategies fail, cleanup
  wrapper.remove();
  injectionButton = null;
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
    return;
  }

  // Check injection method for current platform
  if (currentPlatform.injectionMethod === 'file') {
    // Try file attachment method first (ChatGPT, Gemini, Claude)
    const profileData = formatProfileAsJSON(hasProfile);
    const blob = new Blob([profileData], { type: 'application/json' });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `data-gems-profile-${timestamp}.json`;
    const file = new File([blob], fileName, { type: 'application/json' });

    const success = await attachFileToChat(file);

    if (success) {
      hideInjectionButton();
      return;
    }
  }

  // Text injection method (used for Grok, or as fallback if file fails)
  const profileText = formatProfileForInjection(hasProfile, {
    includeHidden: false,
    includeMetadata: false,
    prettify: true
  });

  setPromptValue(profileText);
  hideInjectionButton();
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
 * Attach file to chat (ChatGPT, Gemini, etc.)
 */
async function attachFileToChat(file) {
  // Method 0: DON'T click upload button (opens file picker which requires user activation)
  // Instead, directly find and set the file input element

  // Method 1: Try to find and use file input directly
  const fileInputs = document.querySelectorAll('input[type="file"]');

  for (const input of fileInputs) {

    // Skip image-only inputs (unless platform is Gemini which might need it)
    if (input.accept && input.accept.includes('image/') && !input.accept.includes('*') && !input.accept.includes('json')) {
      continue;
    }

    try {
      // Take snapshot BEFORE attaching to detect changes
      const beforeAttachments = document.querySelectorAll('[class*="attachment"], [class*="file-"], [data-testid*="file"], [data-testid*="attachment"]').length;
      const beforeBodyText = document.body.textContent.toLowerCase();
      const fileNameLower = file.name.toLowerCase();

      // Create DataTransfer object with our file
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      // Set files property (this doesn't require user activation!)
      input.files = dataTransfer.files;

      // Trigger change event
      const changeEvent = new Event('change', { bubbles: true });
      input.dispatchEvent(changeEvent);

      // Also trigger input event
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);

      // Wait to see if attachment appears in UI
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Take snapshot AFTER to compare
      const afterAttachments = document.querySelectorAll('[class*="attachment"], [class*="file-"], [data-testid*="file"], [data-testid*="attachment"]').length;
      const afterBodyText = document.body.textContent.toLowerCase();

      // Only report success if there's a CLEAR NEW CHANGE
      // Check 1: Attachment element count increased
      if (afterAttachments > beforeAttachments) {
        return true;
      }

      // Check 2: File name appears in DOM (and wasn't there before)
      if (!beforeBodyText.includes(fileNameLower) && afterBodyText.includes(fileNameLower)) {
        return true;
      }

      // Check 3: "data-gems-profile" appears in DOM (and wasn't there before)
      if (!beforeBodyText.includes('data-gems-profile') && afterBodyText.includes('data-gems-profile')) {
        return true;
      }

    } catch (error) {
      // Silent error handling
    }
  }

  // Method 2: Try to simulate drop event (for platforms that support drag & drop)
  const dropTargets = [
    'form.group\\/composer',
    '[class*="composer"]',
    'form[class*="composer"]',
    currentPlatform.selectors?.inputContainer
  ].filter(Boolean);

  for (const targetSelector of dropTargets) {
    const target = document.querySelector(targetSelector);

    if (target) {
      try {
        // Take snapshot before drop to detect changes
        const beforeAttachments = document.querySelectorAll('[class*="attachment"], [class*="file-"], [data-testid*="file"]').length;
        const beforeBodyText = document.body.textContent;

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        const dropEvent = new DragEvent('drop', {
          bubbles: true,
          cancelable: true,
          dataTransfer: dataTransfer
        });

        target.dispatchEvent(dropEvent);

        // Wait to see if attachment appears
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Check for attachment UI - more robust verification
        const afterAttachments = document.querySelectorAll('[class*="attachment"], [class*="file-"], [data-testid*="file"], [data-testid*="attachment"]').length;
        const afterBodyText = document.body.textContent.toLowerCase();
        const beforeBodyTextLower = beforeBodyText.toLowerCase();
        const fileNameLower = file.name.toLowerCase();

        // Check if attachment count increased OR if file name appears in DOM
        if (afterAttachments > beforeAttachments) {
          return true;
        }

        if (!beforeBodyTextLower.includes(fileNameLower) && afterBodyText.includes(fileNameLower)) {
          return true;
        }

        // Also check for generic file indicators
        if (!beforeBodyTextLower.includes('data-gems-profile') && afterBodyText.includes('data-gems-profile')) {
          return true;
        }

      } catch (error) {
        // Silent error handling
      }
    }
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
  if (!currentPlatform) {
    return;
  }

  // Load profile and settings from storage
  try {
    const result = await chrome.storage.local.get(['hasProfile']);
    hasProfile = result.hasProfile;

    if (!hasProfile) {
      return;
    }

    // Load auto-inject setting
    autoInjectEnabled = hasProfile?.settings?.injection?.auto_inject || false;
  } catch (error) {
    return;
  }

  // Wait for prompt element to be available
  const waitForPrompt = setInterval(() => {
    promptElement = findPromptElement(currentPlatform);

    if (promptElement) {
      clearInterval(waitForPrompt);

      // Check if this is a new chat (URL changed)
      const currentUrl = window.location.href;
      if (currentUrl !== lastAutoInjectUrl) {
        hasAutoInjected = false;
        lastAutoInjectUrl = currentUrl;
      }

      // If auto-inject is enabled and we haven't injected yet, do it now
      if (autoInjectEnabled && !hasAutoInjected) {
        // Wait a bit for page to fully load
        setTimeout(async () => {
          await handleInjection();
          hasAutoInjected = true;
        }, 1500);
      } else {
        // Show button only if auto-inject is disabled
        updateButtonVisibility();
      }

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

      // Reset state for new chat
      hasAutoInjected = false;
      lastAutoInjectUrl = currentUrl;
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

// Old auto-inject via background script messages - REMOVED
// Auto-inject is now handled directly on page load (see initializeProfileInjection)
// This is simpler and prevents multiple injection attempts

// Listen for changes to storage (e.g., when user toggles auto-inject in settings)
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.hasProfile) {
    const newProfile = changes.hasProfile.newValue;
    const oldAutoInject = autoInjectEnabled;
    const newAutoInject = newProfile?.settings?.injection?.auto_inject || false;

    // Update auto-inject state
    autoInjectEnabled = newAutoInject;
    hasProfile = newProfile;

    // If auto-inject was turned off, show button
    if (oldAutoInject && !newAutoInject && promptElement && !injectionButton) {
      showInjectionButton();
    }

    // If auto-inject was turned on, hide button and potentially auto-inject
    if (!oldAutoInject && newAutoInject) {
      hideInjectionButton();

      // Auto-inject if we haven't already for this page
      if (promptElement && !hasAutoInjected) {
        setTimeout(async () => {
          await handleInjection();
          hasAutoInjected = true;
        }, 500);
      }
    }
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeProfileInjection);
} else {
  initializeProfileInjection();
}

// TEMPORARY: Export for testing in console
window.__dataGems_test = {
  attachFileToChat,
  handleInjection,
  currentPlatform: () => currentPlatform,
  hasProfile: () => hasProfile
};
