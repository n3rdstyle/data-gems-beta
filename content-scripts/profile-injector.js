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
      uploadButton: 'button[aria-label*="upload" i], button[aria-label*="attach" i], button[aria-label*="file" i], button.upload-button, input[type="file"]'
    },
    isContentEditable: true,
    injectionMethod: 'file', // Try file attachment, fall back to text if fails
    dropZones: [
      'div[class*="input-area-container"]',
      'div[class*="input-area"]',
      'rich-textarea',
      'form',
      '.input-area-container'
    ],
    // NOTE: Gemini's file upload mechanism is challenging to automate:
    // - File inputs may be hidden or in shadow DOM
    // - Gemini may reject JSON files (prefers images/docs)
    // - Drag & drop events may not be properly handled
    // As a result, text injection is commonly used as fallback
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
  console.log('[Data Gems] Starting file attachment for:', file.name);
  console.log('[Data Gems] Platform:', currentPlatform.name);

  // Method 0: DON'T click upload button (opens file picker which requires user activation)
  // Instead, directly find and set the file input element

  // IMPORTANT: Wait for file inputs to be created in the DOM (especially for Gemini)
  // Based on working implementation from data-gems repo
  if (currentPlatform.name === 'Gemini') {
    console.log('[Data Gems] Waiting 1000ms for Gemini file inputs to load...');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Method 1: Try to find and use file input directly with retry logic for Gemini
  let fileInput = null;
  const fileInputSelectors = [
    'input[type="file"]',
    'input[accept]',
    'input[accept*="application"]',
    'input[accept*="text"]',
    'input[accept*="json"]',
    'input[accept*="image"]',
    'input.file-upload-input',
    'input.hidden-file-input',
    '[class*="file"] input[type="file"]'
  ];

  // For Gemini, use retry logic with visibility checks
  if (currentPlatform.name === 'Gemini') {
    let attempts = 0;
    while (!fileInput && attempts < 5) {
      if (attempts > 0) {
        console.log('[Data Gems] Retry attempt', attempts, 'of 5...');
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // First try specific selectors
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

      // If not found, search all file inputs with visibility checks
      if (!fileInput) {
        const allFileInputs = document.querySelectorAll('input[type="file"]');
        console.log('[Data Gems] Checking', allFileInputs.length, 'file inputs for visibility');

        for (const input of allFileInputs) {
          const rect = input.getBoundingClientRect();
          const isVisible = rect.width > 0 && rect.height > 0;
          const computedStyle = window.getComputedStyle(input);
          const isDisplayed = computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden';

          // Take any file input that's not explicitly hidden
          if (isVisible || isDisplayed || input.offsetParent !== null) {
            console.log('[Data Gems] Found visible file input:', {
              class: input.className,
              accept: input.accept,
              isVisible,
              isDisplayed,
              hasOffsetParent: input.offsetParent !== null
            });
            fileInput = input;
            break;
          }
        }
      }

      attempts++;
    }

    if (!fileInput) {
      console.log('[Data Gems] ✗ No file input found after 5 retry attempts');
    }
  }

  // For non-Gemini platforms or if Gemini retry succeeded, collect all inputs
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
        hasProfileString: beforeBodyText.includes('data-gems-profile')
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
        hasProfileString: afterBodyText.includes('data-gems-profile')
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
          hasProfileString: afterBodyText.includes('data-gems-profile')
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

  // Method 3: For Gemini - create file input dynamically and attach to upload system
  if (currentPlatform.name === 'Gemini') {
    console.log('[Data Gems] Method 2 failed, trying Method 3: Gemini dynamic file input injection');

    try {
      // Look for the uploader component container
      const uploaderContainer = document.querySelector('uploader, [class*="uploader"], [class*="file-uploader"]');
      console.log('[Data Gems] Found uploader container:', !!uploaderContainer);

      // Strategy: Create our own file input, attach the file, then trigger it
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '*/*';
      fileInput.style.display = 'none';
      fileInput.setAttribute('data-data-gems-injected', 'true');

      // Attach to the uploader container or body
      const attachPoint = uploaderContainer || document.body;
      attachPoint.appendChild(fileInput);
      console.log('[Data Gems] Created and attached file input to', attachPoint.tagName);

      // Set the file on our input
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
      console.log('[Data Gems] Set file on custom input:', fileInput.files.length, 'files');

      // Trigger change event - Gemini's Angular might listen for this
      const changeEvent = new Event('change', { bubbles: true, cancelable: true });
      fileInput.dispatchEvent(changeEvent);

      // Also try input event
      const inputEvent = new Event('input', { bubbles: true, cancelable: true });
      fileInput.dispatchEvent(inputEvent);

      console.log('[Data Gems] Dispatched events on custom input');

      // Wait and check
      await new Promise(resolve => setTimeout(resolve, 2000));

      const afterBodyText = document.body.textContent.toLowerCase();
      if (afterBodyText.includes(file.name.toLowerCase()) || afterBodyText.includes('data-gems-profile')) {
        console.log('[Data Gems] ✓ Success: Gemini Method 3 (custom input) worked');
        fileInput.remove();
        return true;
      }

      console.log('[Data Gems] Custom input method did not trigger attachment');
      fileInput.remove();

    } catch (error) {
      console.log('[Data Gems] ✗ Error with Gemini Method 3 (custom input):', error);
    }

    // Method 3b: Try to trigger Angular's file selector and observe for file inputs
    console.log('[Data Gems] Trying Method 3b: Trigger Angular file selector and observe');

    const hiddenFileButton = document.querySelector('button[data-test-id="hidden-local-file-upload-button"]');
    const hiddenImageButton = document.querySelector('button[data-test-id="hidden-local-image-upload-button"]');
    const fileSelectTriggers = document.querySelectorAll('[xapfileselectortrigger]');

    console.log('[Data Gems] Found hidden file button:', !!hiddenFileButton);
    console.log('[Data Gems] Found hidden image button:', !!hiddenImageButton);
    console.log('[Data Gems] Found xapfileselectortrigger elements:', fileSelectTriggers.length);

    // Strategy: Observe for new file inputs that appear when upload is triggered
    try {
      const observerResult = await new Promise((resolve) => {
        let resolved = false;
        const observer = new MutationObserver((mutations) => {
          if (resolved) return;

          for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === 1) { // Element node
                // Check if the added node is a file input
                if (node.tagName === 'INPUT' && node.type === 'file') {
                  console.log('[Data Gems] Detected new file input via MutationObserver!');
                  resolved = true;
                  observer.disconnect();
                  resolve(node);
                  return;
                }
                // Check if the added node contains a file input
                const fileInput = node.querySelector?.('input[type="file"]');
                if (fileInput) {
                  console.log('[Data Gems] Detected file input in added node!');
                  resolved = true;
                  observer.disconnect();
                  resolve(fileInput);
                  return;
                }
              }
            }
          }
        });

        // Start observing
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });

        console.log('[Data Gems] Started MutationObserver, clicking upload button...');

        // Click the main upload button to trigger file input creation
        const mainUploadButton = document.querySelector('button.upload-card-button, uploader button[mat-icon-button]');
        if (mainUploadButton) {
          console.log('[Data Gems] Clicking main upload button');
          mainUploadButton.click();
        } else if (hiddenFileButton) {
          console.log('[Data Gems] Clicking hidden file button');
          hiddenFileButton.click();
        }

        // Timeout after 3 seconds
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            observer.disconnect();
            console.log('[Data Gems] MutationObserver timeout - no file input detected');
            resolve(null);
          }
        }, 3000);
      });

      if (observerResult) {
        console.log('[Data Gems] Using detected file input');
        const input = observerResult;

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;

        // Trigger events
        ['change', 'input'].forEach(eventType => {
          const event = new Event(eventType, { bubbles: true, cancelable: true });
          input.dispatchEvent(event);
        });

        console.log('[Data Gems] Waiting 2000ms for UI update...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        const afterBodyText = document.body.textContent.toLowerCase();
        if (afterBodyText.includes(file.name.toLowerCase()) || afterBodyText.includes('data-gems-profile')) {
          console.log('[Data Gems] ✓ Success: Gemini Method 3b (observer) worked');
          return true;
        }
      }
    } catch (error) {
      console.log('[Data Gems] ✗ Error with Gemini Method 3b observer:', error);
    }

    // Fallback: Search ALL inputs (not just type="file")
    console.log('[Data Gems] Observer method failed, searching all input elements');
    const allInputs = document.querySelectorAll('input');
    console.log('[Data Gems] Found', allInputs.length, 'total input elements');

    for (const input of allInputs) {
      // Check if it could be a file input
      if (input.type === 'file' || input.accept || input.hasAttribute('accept') || input.hasAttribute('xapfileselectortrigger')) {
        try {
          console.log('[Data Gems] Trying input:', {
            type: input.type,
            accept: input.accept,
            id: input.id,
            class: input.className,
            hasXapTrigger: input.hasAttribute('xapfileselectortrigger')
          });

          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);

          // Try to set files property
          try {
            input.files = dataTransfer.files;
          } catch (e) {
            console.log('[Data Gems] Could not set files property:', e.message);
            continue;
          }

          // Trigger all possible events
          const events = ['change', 'input', 'blur', 'focus'];
          events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true, cancelable: true });
            input.dispatchEvent(event);
          });

          console.log('[Data Gems] Waiting 1500ms for UI update...');
          await new Promise(resolve => setTimeout(resolve, 1500));

          // Check for success
          const afterBodyText = document.body.textContent.toLowerCase();
          if (afterBodyText.includes(file.name.toLowerCase()) || afterBodyText.includes('data-gems-profile')) {
            console.log('[Data Gems] ✓ Success: Gemini Method 3b fallback worked');
            return true;
          }
        } catch (error) {
          console.log('[Data Gems] ✗ Error with input:', error);
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

      // If auto-inject is enabled and we haven't injected yet in this session, do it now
      if (autoInjectEnabled && !hasAutoInjectedInSession()) {
        // Wait a bit for page to fully load
        setTimeout(async () => {
          await handleInjection();
          markAutoInjectedInSession();
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

      // Reset UI state for new chat (but keep session injection tracking)
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

      // Auto-inject if we haven't already for this session
      if (promptElement && !hasAutoInjectedInSession()) {
        setTimeout(async () => {
          await handleInjection();
          markAutoInjectedInSession();
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
