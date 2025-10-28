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
      inputContainer: 'div[class*="input-area-container"]'
    },
    isContentEditable: true,
    injectionMethod: 'text', // Gemini: text-only injection (file upload not automatable)
    autoInjectDisabled: true, // Gemini: always require manual button click
    // NOTE: Gemini file upload cannot be automated due to browser security:
    // - File inputs are created dynamically only on real user clicks
    // - Programmatic clicks don't trigger file dialog (browser security)
    // - Drag & drop events are rejected (event.isTrusted check)
    // Therefore: text injection only, via manual button click
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
let hspProfile = null;
let observerActive = false;
let autoInjectEnabled = false;
let hasInjectedInCurrentChat = false; // Track if we've injected in current chat

// Session storage key for tracking injection per tab
const SESSION_INJECTION_KEY = 'data_gems_has_auto_injected';

/**
 * Check if we've already auto-injected in this browser tab session
 */
function hasAutoInjectedInSession() {
  try {
    return sessionStorage.getItem(SESSION_INJECTION_KEY) === 'true';
  } catch (error) {
    return false;
  }
}

/**
 * Mark that we've auto-injected in this session
 */
function markAutoInjectedInSession() {
  try {
    sessionStorage.setItem(SESSION_INJECTION_KEY, 'true');
  } catch (error) {
    // Silent error - sessionStorage might be disabled
  }
}

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
 * Set prompt element value (appends to existing text if any)
 */
function setPromptValue(text) {
  if (!promptElement) return;

  // Get current text and append the new text
  const currentText = getPromptValue();

  // For Gemini, add a separator line before the injected text
  let separator = currentText.trim() ? '\n\n' : ''; // Add blank line if there's existing text
  if (currentPlatform.name === 'Gemini' && currentText.trim()) {
    separator = '\n\n--------------------\n\n';
  }

  const combinedText = currentText + separator + text;

  if (currentPlatform.isContentEditable) {
    // For contenteditable elements, set textContent
    promptElement.textContent = combinedText;

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
    promptElement.value = combinedText;

    // Trigger input and change events
    promptElement.dispatchEvent(new Event('input', { bubbles: true }));
    promptElement.dispatchEvent(new Event('change', { bubbles: true }));

    // Focus and place cursor at end
    promptElement.focus();
    promptElement.setSelectionRange(combinedText.length, combinedText.length);
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
  // Don't show button if auto-inject is enabled (unless platform disables auto-inject)
  const platformAutoInjectDisabled = currentPlatform?.autoInjectDisabled || false;
  if (autoInjectEnabled && !platformAutoInjectDisabled) return;

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
  if (!hspProfile) {
    return;
  }

  // Check injection method for current platform
  if (currentPlatform.injectionMethod === 'file') {
    // Try file attachment method first (ChatGPT, Gemini, Claude)
    const profileData = formatProfileAsJSON(hspProfile);
    const blob = new Blob([profileData], { type: 'application/json' });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `data-gems-profile-${timestamp}.json`;
    const file = new File([blob], fileName, { type: 'application/json' });

    const success = await attachFileToChat(file);

    if (success) {
      hasInjectedInCurrentChat = true; // Mark as injected
      hideInjectionButton();
      return;
    }
  }

  // Text injection method (used for Grok, or as fallback if file fails)
  const profileText = formatProfileForInjection(hspProfile, {
    includeHidden: false,
    includeMetadata: false,
    prettify: true
  });

  setPromptValue(profileText);
  hasInjectedInCurrentChat = true; // Mark as injected
  hideInjectionButton();
}

/**
 * Format profile as clean JSON (without explanation text)
 */
function formatProfileAsJSON(hspProfile) {
  const filteredProfile = {
    hsp: hspProfile.hsp,
    type: hspProfile.type
  };

  if (hspProfile.content?.basic?.identity) {
    filteredProfile.content = {
      basic: {
        identity: {}
      }
    };

    const identity = hspProfile.content.basic.identity;
    Object.keys(identity).forEach(key => {
      const field = identity[key];

      if (field.state === 'hidden') return;
      if (field.value === null || field.value === '' ||
          (Array.isArray(field.value) && field.value.length === 0)) return;
      if (key === 'avatarImage') return;

      filteredProfile.content.basic.identity[key] = field;
    });
  }

  if (hspProfile.content?.preferences?.items) {
    if (!filteredProfile.content) {
      filteredProfile.content = {};
    }

    filteredProfile.content.preferences = {
      items: hspProfile.content.preferences.items.filter(pref => {
        if (pref.state === 'hidden') return false;
        if (!pref.value || pref.value.trim() === '') return false;
        return true;
      })
    };
  }

  if (hspProfile.collections && hspProfile.collections.length > 0) {
    // Only send collection labels (LLM doesn't need IDs, timestamps, etc.)
    filteredProfile.collections = hspProfile.collections.map(col => col.label);
  }

  return JSON.stringify(filteredProfile, null, 2);
}

/**
 * Attach file to chat (ChatGPT, Gemini, etc.)
 */
async function attachFileToChat(file) {
  console.log('[Data Gems] Starting file attachment for:', file.name);
  console.log('[Data Gems] Platform:', currentPlatform.name);

  // Method 1: Try to find file input
  // CRITICAL: For Gemini, file inputs ALREADY EXIST in DOM (no button click needed)
  // Working extension logs show: <input class="hidden-file-input"> found directly
  let fileInput = null;

  // Platform-specific selectors - Gemini uses hidden-file-input class
  const fileInputSelectors = currentPlatform.name === 'Gemini' ? [
    'input.hidden-file-input',                        // GEMINI SPECIFIC - found in working extension
    'input[type="file"][class*="hidden"]',           // Alternative hidden input pattern
    'input[type="file"]',                            // Generic fallback
    'input[accept*="image"]',                        // Image inputs
    'input[accept]'                                  // Any accept attribute
  ] : [
    'input[type="file"]',
    'input[accept]',
    'input[accept*="application"]',
    'input[accept*="text"]',
    'input[accept*="json"]',
    'input.file-upload-input',
    '[class*="file"] input[type="file"]'
  ];

  // For Gemini, search directly (file inputs already exist in DOM)
  if (currentPlatform.name === 'Gemini') {
    // Try specific selectors first
    for (const selector of fileInputSelectors) {
      try {
        fileInput = document.querySelector(selector);
        if (fileInput) {
          console.log('[Data Gems] 📎 Found file input:', fileInput);
          console.log('[Data Gems] File input details:', {
            class: fileInput.className,
            accept: fileInput.accept,
            type: fileInput.type
          });
          break;
        }
      } catch (e) {
        // Invalid selector, skip
      }
    }

    // If not found with specific selectors, search all file inputs
    if (!fileInput) {
      const allFileInputs = document.querySelectorAll('input[type="file"]');
      console.log('[Data Gems] Checking', allFileInputs.length, 'file inputs on page');

      if (allFileInputs.length > 0) {
        // Log all found inputs for debugging
        allFileInputs.forEach((input, index) => {
          console.log(`[Data Gems] File input ${index}:`, {
            class: input.className,
            accept: input.accept
          });
        });

        // Prefer hidden-file-input class
        for (const input of allFileInputs) {
          if (input.className.includes('hidden-file-input')) {
            fileInput = input;
            console.log('[Data Gems] Selected hidden-file-input');
            break;
          }
        }

        // Otherwise take first available
        if (!fileInput && allFileInputs.length > 0) {
          fileInput = allFileInputs[0];
          console.log('[Data Gems] Using first available file input');
        }
      }
    }
  }

  // For non-Gemini platforms, use standard selectors
  if (!fileInput && currentPlatform.name !== 'Gemini') {
    for (const selector of fileInputSelectors) {
      try {
        fileInput = document.querySelector(selector);
        if (fileInput) {
          console.log('[Data Gems] Found file input with selector:', selector);
          break;
        }
      } catch (e) {
        // Invalid selector, skip
      }
    }
  }

  // Collect all inputs for fallback
  const fileInputs = fileInput ? [fileInput] : document.querySelectorAll('input[type="file"]');
  console.log('[Data Gems] Found', fileInputs.length, 'file inputs');

  for (const input of fileInputs) {
    console.log('[Data Gems] Checking file input:', {
      accept: input.accept,
      multiple: input.multiple,
      classList: Array.from(input.classList),
      id: input.id,
      visibility: window.getComputedStyle(input).display,
      parentVisibility: input.parentElement ? window.getComputedStyle(input.parentElement).display : 'n/a'
    });

    // For Gemini, try ALL file inputs regardless of accept attribute
    const isGemini = currentPlatform.name === 'Gemini';

    // Skip image-only inputs (unless platform is Gemini which might need it)
    if (!isGemini && input.accept && input.accept.includes('image/') && !input.accept.includes('*') && !input.accept.includes('json')) {
      console.log('[Data Gems] Skipping image-only input');
      continue;
    }

    try {
      console.log('[Data Gems] Attempting file attachment via input element');

      // Take snapshot BEFORE attaching to detect changes
      const beforeAttachments = document.querySelectorAll('[class*="attachment"], [class*="file-"], [data-testid*="file"], [data-testid*="attachment"]').length;
      const beforeBodyText = document.body.textContent.toLowerCase();
      const fileNameLower = file.name.toLowerCase();

      console.log('[Data Gems] Before state:', {
        attachmentCount: beforeAttachments,
        hasFileName: beforeBodyText.includes(fileNameLower),
        hspProfileString: beforeBodyText.includes('data-gems-profile')
      });

      // Create DataTransfer object with our file
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      // Set files property (this doesn't require user activation!)
      input.files = dataTransfer.files;
      console.log('[Data Gems] Files set to input:', input.files.length, 'files');

      // Trigger change event
      const changeEvent = new Event('change', { bubbles: true });
      input.dispatchEvent(changeEvent);
      console.log('[Data Gems] Dispatched change event');

      // Also trigger input event
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
      console.log('[Data Gems] Dispatched input event');

      // Wait to see if attachment appears in UI
      console.log('[Data Gems] Waiting 1500ms for UI update...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Take snapshot AFTER to compare
      const afterAttachments = document.querySelectorAll('[class*="attachment"], [class*="file-"], [data-testid*="file"], [data-testid*="attachment"]').length;
      const afterBodyText = document.body.textContent.toLowerCase();

      console.log('[Data Gems] After state:', {
        attachmentCount: afterAttachments,
        hasFileName: afterBodyText.includes(fileNameLower),
        hspProfileString: afterBodyText.includes('data-gems-profile')
      });

      // Only report success if there's a CLEAR NEW CHANGE
      // Check 1: Attachment element count increased
      if (afterAttachments > beforeAttachments) {
        console.log('[Data Gems] ✓ Success: Attachment count increased');
        return true;
      }

      // Check 2: File name appears in DOM (and wasn't there before)
      if (!beforeBodyText.includes(fileNameLower) && afterBodyText.includes(fileNameLower)) {
        console.log('[Data Gems] ✓ Success: File name appeared in DOM');
        return true;
      }

      // Check 3: "data-gems-profile" appears in DOM (and wasn't there before)
      if (!beforeBodyText.includes('data-gems-profile') && afterBodyText.includes('data-gems-profile')) {
        console.log('[Data Gems] ✓ Success: Profile string appeared in DOM');
        return true;
      }

      console.log('[Data Gems] ✗ Failed: No UI changes detected for this input');

    } catch (error) {
      console.log('[Data Gems] ✗ Error with file input:', error);
    }
  }

  // Method 2: Try to simulate drop event (for platforms that support drag & drop)
  console.log('[Data Gems] Method 1 failed, trying Method 2: drop event simulation');

  // Use platform-specific dropZones if available, otherwise fallback to defaults
  const dropTargets = currentPlatform.dropZones || [
    'form.group\\/composer',
    '[class*="composer"]',
    'form[class*="composer"]',
    currentPlatform.selectors?.inputContainer
  ];

  console.log('[Data Gems] Drop target selectors:', dropTargets.filter(Boolean));

  for (const targetSelector of dropTargets) {
    const target = document.querySelector(targetSelector);

    if (target) {
      console.log('[Data Gems] Found drop target:', targetSelector);

      try {
        // Take snapshot before drop to detect changes
        const beforeAttachments = document.querySelectorAll('[class*="attachment"], [class*="file-"], [data-testid*="file"]').length;
        const beforeBodyText = document.body.textContent;

        console.log('[Data Gems] Before drop:', { attachmentCount: beforeAttachments });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        const dropEvent = new DragEvent('drop', {
          bubbles: true,
          cancelable: true,
          dataTransfer: dataTransfer
        });

        target.dispatchEvent(dropEvent);
        console.log('[Data Gems] Dispatched drop event');

        // Wait to see if attachment appears
        console.log('[Data Gems] Waiting 2000ms for UI update...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Check for attachment UI - more robust verification
        const afterAttachments = document.querySelectorAll('[class*="attachment"], [class*="file-"], [data-testid*="file"], [data-testid*="attachment"]').length;
        const afterBodyText = document.body.textContent.toLowerCase();
        const beforeBodyTextLower = beforeBodyText.toLowerCase();
        const fileNameLower = file.name.toLowerCase();

        console.log('[Data Gems] After drop:', {
          attachmentCount: afterAttachments,
          hasFileName: afterBodyText.includes(fileNameLower),
          hspProfileString: afterBodyText.includes('data-gems-profile')
        });

        // Check if attachment count increased OR if file name appears in DOM
        if (afterAttachments > beforeAttachments) {
          console.log('[Data Gems] ✓ Success: Attachment count increased via drop');
          return true;
        }

        if (!beforeBodyTextLower.includes(fileNameLower) && afterBodyText.includes(fileNameLower)) {
          console.log('[Data Gems] ✓ Success: File name appeared via drop');
          return true;
        }

        // Also check for generic file indicators
        if (!beforeBodyTextLower.includes('data-gems-profile') && afterBodyText.includes('data-gems-profile')) {
          console.log('[Data Gems] ✓ Success: Profile string appeared via drop');
          return true;
        }

        console.log('[Data Gems] ✗ Failed: No UI changes detected for drop target');

      } catch (error) {
        console.log('[Data Gems] ✗ Error with drop event:', error);
      }
    } else {
      console.log('[Data Gems] Drop target not found:', targetSelector);
    }
  }

  // Method 3: For Gemini - look for upload button and try to access its associated file input
  if (currentPlatform.name === 'Gemini') {
    console.log('[Data Gems] Method 2 failed, trying Method 3: Gemini-specific file input search');

    // Wait a bit and try to find file inputs again (they might be dynamically created)
    await new Promise(resolve => setTimeout(resolve, 500));

    const allInputs = document.querySelectorAll('input[type="file"]');
    console.log('[Data Gems] Found', allInputs.length, 'file inputs (second attempt)');

    if (allInputs.length > 0) {
      for (const input of allInputs) {
        try {
          console.log('[Data Gems] Gemini Method 3: Trying file input');

          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          input.files = dataTransfer.files;

          // Trigger all possible events
          const events = ['change', 'input', 'blur'];
          events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true, cancelable: true });
            input.dispatchEvent(event);
          });

          console.log('[Data Gems] Waiting 2000ms for UI update...');
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Check for success
          const afterBodyText = document.body.textContent.toLowerCase();
          if (afterBodyText.includes(file.name.toLowerCase()) || afterBodyText.includes('data-gems-profile')) {
            console.log('[Data Gems] ✓ Success: Gemini Method 3 worked');
            return true;
          }
        } catch (error) {
          console.log('[Data Gems] ✗ Error with Gemini Method 3:', error);
        }
      }
    }

    // Method 4: Try to find shadow DOM elements
    console.log('[Data Gems] Method 3 failed, trying Method 4: Shadow DOM search');
    const shadowRoots = [];

    function findShadowRoots(element) {
      if (element.shadowRoot) {
        shadowRoots.push(element.shadowRoot);
      }
      for (const child of element.children) {
        findShadowRoots(child);
      }
    }

    findShadowRoots(document.body);
    console.log('[Data Gems] Found', shadowRoots.length, 'shadow roots');

    for (const shadowRoot of shadowRoots) {
      const shadowInputs = shadowRoot.querySelectorAll('input[type="file"]');
      console.log('[Data Gems] Found', shadowInputs.length, 'file inputs in shadow DOM');

      for (const input of shadowInputs) {
        try {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          input.files = dataTransfer.files;

          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.dispatchEvent(new Event('input', { bubbles: true }));

          await new Promise(resolve => setTimeout(resolve, 2000));

          const afterBodyText = document.body.textContent.toLowerCase();
          if (afterBodyText.includes(file.name.toLowerCase()) || afterBodyText.includes('data-gems-profile')) {
            console.log('[Data Gems] ✓ Success: Shadow DOM method worked');
            return true;
          }
        } catch (error) {
          console.log('[Data Gems] ✗ Error with shadow DOM method:', error);
        }
      }
    }
  }

  console.log('[Data Gems] ✗ All file attachment methods failed, falling back to text injection');
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

  const hasData = hasInjectableData(hspProfile);

  // Don't show button if we've already injected in this chat
  if (hasInjectedInCurrentChat) {
    hideInjectionButton();
    return;
  }

  // Show button if we have data to inject
  // Button stays visible even if user starts typing
  if (hasData) {
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
    const result = await chrome.storage.local.get(['hspProfile']);
    hspProfile = result.hspProfile;

    if (!hspProfile) {
      return;
    }

    // Load auto-inject setting
    autoInjectEnabled = hspProfile?.settings?.injection?.auto_inject || false;
  } catch (error) {
    return;
  }

  // Wait for prompt element to be available
  const waitForPrompt = setInterval(() => {
    promptElement = findPromptElement(currentPlatform);

    if (promptElement) {
      clearInterval(waitForPrompt);

      // Check if auto-inject is disabled for this platform
      const platformAutoInjectDisabled = currentPlatform.autoInjectDisabled || false;

      // If auto-inject is enabled (globally) AND platform allows it AND we haven't injected yet
      if (autoInjectEnabled && !platformAutoInjectDisabled && !hasAutoInjectedInSession()) {
        // Wait a bit for page to fully load
        setTimeout(async () => {
          await handleInjection();
          markAutoInjectedInSession();
        }, 1500);
      } else {
        // Show button if:
        // - Auto-inject is disabled globally, OR
        // - Platform disables auto-inject (e.g., Gemini), OR
        // - Already injected in this session
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

      // Reset UI state for new chat (but keep session injection tracking)
      hideInjectionButton();
      promptElement = null;
      observerActive = false;
      hasInjectedInCurrentChat = false; // Reset injection flag for new chat

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
function formatProfileForInjection(hspProfile, options = {}) {
  const {
    includeHidden = false,
    includeMetadata = false,
    prettify = true
  } = options;

  if (!hspProfile || !hspProfile.hsp) {
    return 'No profile data available.';
  }

  const filteredProfile = {
    hsp: hspProfile.hsp,
    type: hspProfile.type
  };

  if (hspProfile.content?.basic?.identity) {
    filteredProfile.content = {
      basic: {
        identity: {}
      }
    };

    const identity = hspProfile.content.basic.identity;
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

  if (hspProfile.content?.preferences?.items) {
    if (!filteredProfile.content) {
      filteredProfile.content = {};
    }

    filteredProfile.content.preferences = {
      items: hspProfile.content.preferences.items.filter(pref => {
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

  if (hspProfile.collections && hspProfile.collections.length > 0) {
    filteredProfile.collections = hspProfile.collections;
  }

  if (includeMetadata && hspProfile.metadata) {
    filteredProfile.metadata = {
      schema_version: hspProfile.metadata.schema_version,
      total_preferences: hspProfile.metadata.total_preferences
    };
  }

  const jsonString = prettify
    ? JSON.stringify(filteredProfile, null, 2)
    : JSON.stringify(filteredProfile);

  const injectionText = `Here is my Data Gems profile in HSP Protocol v${hspProfile.hsp} format:

\`\`\`json
${jsonString}
\`\`\`

Please use this information as context for our conversation.`;

  return injectionText;
}

function hasInjectableData(hspProfile) {
  if (!hspProfile || !hspProfile.hsp) {
    return false;
  }

  const identity = hspProfile.content?.basic?.identity || {};
  const preferences = hspProfile.content?.preferences?.items || [];

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
  if (areaName === 'local' && changes.hspProfile) {
    const newProfile = changes.hspProfile.newValue;
    const oldAutoInject = autoInjectEnabled;
    const newAutoInject = newProfile?.settings?.injection?.auto_inject || false;

    // Update auto-inject state
    autoInjectEnabled = newAutoInject;
    hspProfile = newProfile;

    // If auto-inject was turned off, show button
    if (oldAutoInject && !newAutoInject && promptElement && !injectionButton) {
      showInjectionButton();
    }

    // If auto-inject was turned on, hide button and potentially auto-inject
    if (!oldAutoInject && newAutoInject) {
      // Check if platform allows auto-inject
      const platformAutoInjectDisabled = currentPlatform?.autoInjectDisabled || false;

      if (!platformAutoInjectDisabled) {
        hideInjectionButton();

        // Auto-inject if we haven't already for this session
        if (promptElement && !hasAutoInjectedInSession()) {
          setTimeout(async () => {
            await handleInjection();
            markAutoInjectedInSession();
          }, 500);
        }
      } else {
        // Platform disables auto-inject, keep showing button
        if (!injectionButton) {
          showInjectionButton();
        }
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
  hspProfile: () => hspProfile
};
