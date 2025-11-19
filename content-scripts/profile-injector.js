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

  for (const [, platform] of Object.entries(PLATFORMS)) {
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
  button.textContent = 'Inject my Profile';
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

  // Create button
  injectionButton = createInjectionButton();

  // Check if optimize button's wrapper already exists
  const existingOptimizeButton = document.getElementById('data-gems-optimize-button');
  if (existingOptimizeButton && existingOptimizeButton._wrapper) {
    // Add inject button to the right of optimize button in the same wrapper
    existingOptimizeButton._wrapper.appendChild(injectionButton);
    injectionButton._wrapper = existingOptimizeButton._wrapper;
    return;
  }

  // Create wrapper div for right alignment (positioned next to optimize button)
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.justifyContent = 'flex-end';
  wrapper.style.alignItems = 'center';
  wrapper.style.marginBottom = '16px';
  wrapper.style.width = '100%';
  wrapper.style.gap = '8px';

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
    // Check if wrapper is shared with other buttons
    if (injectionButton._wrapper) {
      const wrapper = injectionButton._wrapper;
      const buttonsInWrapper = wrapper.querySelectorAll('button');

      // Only remove wrapper if this is the last button
      if (buttonsInWrapper.length <= 1) {
        wrapper.remove();
      } else {
        // Just remove this button, keep the wrapper for other buttons
        injectionButton.remove();
      }
    } else {
      injectionButton.remove();
    }
    injectionButton = null;
  }
}

/**
 * Detect category for current prompt using Context Engine
 */
async function detectCategoryForPrompt() {
  const promptText = getPromptValue().trim();

  if (!promptText || !window.ContextEngineAPI?.isReady) {
    return null;
  }

  try {
    // Get available categories from profile collections
    const availableCategories = [...new Set(
      hspProfile.content?.preferences?.items
        ?.flatMap(pref => pref.collections || [])
        .filter(Boolean) || []
    )];

    if (availableCategories.length === 0) {
      return null;
    }

    // Use Context Engine's analyzeQueryIntent (from context-selector.js)
    // This requires us to import or access the function from the MAIN world
    const result = await new Promise((resolve, reject) => {
      const requestId = `cat_${Date.now()}_${Math.random()}`;

      const resultHandler = (event) => {
        if (event.detail.requestId === requestId) {
          document.removeEventListener('dataGems:detectCategory:result', resultHandler);
          document.removeEventListener('dataGems:detectCategory:error', errorHandler);
          resolve(event.detail.result);
        }
      };

      const errorHandler = (event) => {
        if (event.detail.requestId === requestId) {
          document.removeEventListener('dataGems:detectCategory:result', resultHandler);
          document.removeEventListener('dataGems:detectCategory:error', errorHandler);
          reject(new Error(event.detail.error));
        }
      };

      document.addEventListener('dataGems:detectCategory:result', resultHandler);
      document.addEventListener('dataGems:detectCategory:error', errorHandler);

      // Send request to MAIN world
      document.dispatchEvent(new CustomEvent('dataGems:detectCategory', {
        detail: { promptText, availableCategories, requestId }
      }));

      // Timeout after 10 seconds
      setTimeout(() => {
        document.removeEventListener('dataGems:detectCategory:result', resultHandler);
        document.removeEventListener('dataGems:detectCategory:error', errorHandler);
        reject(new Error('Category detection timeout'));
      }, 10000);
    });

    return result?.domain || null;
  } catch (error) {
    console.error('[Data Gems] Category detection error:', error);
    return null;
  }
}

/**
 * Show category selection dropdown
 */
function showCategoryDropdown(detectedCategory) {
  // Get all available categories from profile
  const allCategories = [...new Set(
    hspProfile.content?.preferences?.items
      ?.flatMap(pref => pref.collections || [])
      .filter(Boolean) || []
  )];

  if (allCategories.length === 0) {
    // No categories available, inject full profile
    performInjection(null);
    return;
  }

  // Create dropdown
  const dropdown = document.createElement('div');
  dropdown.className = 'profile-injection-dropdown';
  dropdown.id = 'data-gems-injection-dropdown';

  // Detected category section (if any)
  if (detectedCategory && allCategories.includes(detectedCategory)) {
    const detectedSection = document.createElement('div');
    detectedSection.className = 'dropdown-section';

    const detectedItem = document.createElement('div');
    detectedItem.className = 'dropdown-item dropdown-item--detected';
    detectedItem.dataset.category = detectedCategory;
    detectedItem.innerHTML = `
      <span class="checkmark">✓</span>
      <span class="label">${detectedCategory}</span>
      <span class="info-icon" data-tooltip="AI detected this category based on your prompt">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      </span>
    `;
    detectedItem.addEventListener('click', () => handleCategorySelection(detectedCategory));

    detectedSection.appendChild(detectedItem);
    dropdown.appendChild(detectedSection);

    // Divider
    const divider1 = document.createElement('div');
    divider1.className = 'dropdown-divider';
    dropdown.appendChild(divider1);
  }

  // Other categories section
  const otherCategories = allCategories.filter(cat => cat !== detectedCategory);
  if (otherCategories.length > 0) {
    const otherSection = document.createElement('div');
    otherSection.className = 'dropdown-section';

    otherCategories.forEach(category => {
      const item = document.createElement('div');
      item.className = 'dropdown-item';
      item.dataset.category = category;
      item.textContent = category;
      item.addEventListener('click', () => handleCategorySelection(category));
      otherSection.appendChild(item);
    });

    dropdown.appendChild(otherSection);

    // Divider
    const divider2 = document.createElement('div');
    divider2.className = 'dropdown-divider';
    dropdown.appendChild(divider2);
  }

  // Full profile option
  const fullSection = document.createElement('div');
  fullSection.className = 'dropdown-section';

  const fullItem = document.createElement('div');
  fullItem.className = 'dropdown-item dropdown-item--full';
  // No dataset.category means full profile (null)
  fullItem.innerHTML = `
    <span class="icon">📋</span>
    <span class="label">Ganzes Profil</span>
  `;
  fullItem.addEventListener('click', () => handleCategorySelection(null));

  fullSection.appendChild(fullItem);
  dropdown.appendChild(fullSection);

  // Add dropdown next to button in wrapper (not as child of button)
  const wrapper = injectionButton._wrapper || injectionButton.parentElement;
  if (wrapper) {
    // Position dropdown relative to button
    dropdown.style.position = 'absolute';
    dropdown.style.bottom = 'calc(100% + 8px)';
    dropdown.style.right = '0';
    wrapper.style.position = 'relative'; // Ensure wrapper is positioned
    wrapper.appendChild(dropdown);
  } else {
    // Fallback: add to button
    injectionButton.appendChild(dropdown);
  }

  // Show dropdown with animation
  setTimeout(() => dropdown.classList.add('open'), 10);

  // Keyboard navigation
  let selectedIndex = 0; // Start with detected (if exists) or first item
  const allItems = dropdown.querySelectorAll('.dropdown-item');

  // Set initial selection
  if (allItems.length > 0) {
    allItems[selectedIndex].classList.add('selected');
  }

  const handleKeyboard = (e) => {
    if (!dropdown.classList.contains('open')) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        dropdown.classList.remove('open');
        setTimeout(() => dropdown.remove(), 200);
        document.removeEventListener('keydown', handleKeyboard);
        break;

      case 'ArrowDown':
        e.preventDefault();
        allItems[selectedIndex]?.classList.remove('selected');
        selectedIndex = (selectedIndex + 1) % allItems.length;
        allItems[selectedIndex]?.classList.add('selected');
        allItems[selectedIndex]?.scrollIntoView({ block: 'nearest' });
        break;

      case 'ArrowUp':
        e.preventDefault();
        allItems[selectedIndex]?.classList.remove('selected');
        selectedIndex = (selectedIndex - 1 + allItems.length) % allItems.length;
        allItems[selectedIndex]?.classList.add('selected');
        allItems[selectedIndex]?.scrollIntoView({ block: 'nearest' });
        break;

      case 'Enter':
        e.preventDefault();
        const selectedItem = allItems[selectedIndex];
        if (selectedItem) {
          // Get category from dataset or null for "full profile"
          const category = selectedItem.dataset.category || null;
          handleCategorySelection(category);
        }
        document.removeEventListener('keydown', handleKeyboard);
        break;
    }
  };

  document.addEventListener('keydown', handleKeyboard);

  // Close on outside click
  const closeDropdown = (e) => {
    // Check if click is outside both button and dropdown
    if (!injectionButton || !dropdown) return;

    if (!injectionButton.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      setTimeout(() => dropdown.remove(), 200);
      document.removeEventListener('click', closeDropdown);
      document.removeEventListener('keydown', handleKeyboard);
    }
  };
  setTimeout(() => document.addEventListener('click', closeDropdown), 100);
}

/**
 * Handle category selection from dropdown
 */
function handleCategorySelection(selectedCategory) {
  // Close dropdown
  const dropdown = document.getElementById('data-gems-injection-dropdown');
  if (dropdown) {
    dropdown.classList.remove('open');
    setTimeout(() => dropdown.remove(), 200);
  }

  // Perform injection with selected category
  performInjection(selectedCategory);
}

/**
 * Filter profile by collections
 */
function filterProfileByCollections(profile, collectionNames) {
  if (!collectionNames || collectionNames.length === 0) {
    console.log('[Profile Injector] No collection filter - returning full profile');
    return profile;
  }

  console.log('[Profile Injector] Filtering profile by collections:', collectionNames);

  // Filter preferences by collections (case-insensitive)
  const allPreferences = profile.content?.preferences?.items || [];
  console.log('[Profile Injector] Total preferences:', allPreferences.length);

  // DEBUG: Show all preferences with their collections
  console.log('[Profile Injector] All preferences and their collections:');
  allPreferences.forEach((pref, index) => {
    console.log(`  ${index + 1}. "${pref.value?.substring(0, 60)}..." → Collections:`, pref.collections || []);
  });

  const filteredPreferences = allPreferences.filter(pref => {
    const prefCollections = pref.collections || [];
    const matches = prefCollections.some(col =>
      collectionNames.some(filterCol =>
        col.toLowerCase() === filterCol.toLowerCase()
      )
    );

    if (matches) {
      console.log('[Profile Injector] ✓ Matched preference:', {
        value: pref.value?.substring(0, 50) + '...',
        collections: prefCollections
      });
    }

    return matches;
  });

  console.log('[Profile Injector] Filtered preferences:', filteredPreferences.length);

  // Filter identity fields by collections (case-insensitive)
  const filteredIdentity = {};
  const identity = profile.content?.basic?.identity || {};

  Object.entries(identity).forEach(([key, field]) => {
    // Always include base identity fields (name, etc.) regardless of collections
    const baseFields = ['name', 'firstName', 'lastName', 'email'];
    if (baseFields.includes(key)) {
      filteredIdentity[key] = field;
      return;
    }

    // Filter other identity fields by collections
    const fieldCollections = field.collections || [];
    const matches = fieldCollections.some(col =>
      collectionNames.some(filterCol =>
        col.toLowerCase() === filterCol.toLowerCase()
      )
    );

    if (matches) {
      console.log('[Profile Injector] ✓ Matched identity field:', key, {
        collections: fieldCollections
      });
      filteredIdentity[key] = field;
    }
  });

  return {
    ...profile,
    content: {
      ...profile.content,
      basic: {
        identity: filteredIdentity
      },
      preferences: {
        items: filteredPreferences
      }
    }
  };
}

/**
 * Perform the actual profile injection
 */
async function performInjection(selectedCategory) {
  if (!hspProfile) {
    return;
  }

  // Filter profile if category selected
  const profileToInject = selectedCategory
    ? filterProfileByCollections(hspProfile, [selectedCategory])
    : hspProfile;

  // Check injection method for current platform
  if (currentPlatform.injectionMethod === 'file') {
    // Try file attachment method first (ChatGPT, Gemini, Claude)
    const profileData = formatProfileAsJSON(profileToInject);
    const blob = new Blob([profileData], { type: 'application/json' });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `data-gems-profile-${timestamp}.json`;
    const file = new File([blob], fileName, { type: 'application/json' });

    const success = await attachFileToChat(file);

    if (success) {
      // Keep button visible for multiple injections
      return;
    }
  }

  // Text injection method (used for Grok, or as fallback if file fails)
  const profileText = formatProfileForInjection(profileToInject, {
    includeHidden: false,
    includeMetadata: false,
    prettify: true
  });

  setPromptValue(profileText);
  // Keep button visible for multiple injections
}

/**
 * Handle injection button click - show dropdown with category selection
 */
async function handleInjection(event) {
  if (!hspProfile) {
    return;
  }

  // Prevent event bubbling
  if (event) {
    event.stopPropagation();
  }

  try {
    // Detect category from prompt (in background, don't show loading state)
    const detectedCategory = await detectCategoryForPrompt();

    // Show dropdown with detected category
    showCategoryDropdown(detectedCategory);

  } catch (error) {
    console.error('[Data Gems] Error during category detection:', error);

    // Show dropdown without detected category
    showCategoryDropdown(null);
  }
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

      // Remove internal fields that LLM doesn't need
      const { embedding, vector, keywords, enrichmentTimestamp, enrichmentVersion, ...cleanField } = field;
      filteredProfile.content.basic.identity[key] = cleanField;
    });
  }

  if (hspProfile.content?.preferences?.items) {
    if (!filteredProfile.content) {
      filteredProfile.content = {};
    }

    filteredProfile.content.preferences = {
      items: hspProfile.content.preferences.items
        .filter(pref => {
          if (pref.state === 'hidden') return false;
          if (!pref.value || pref.value.trim() === '') return false;
          return true;
        })
        .map(pref => {
          // Remove internal fields that LLM doesn't need
          const { vector, keywords, enrichmentTimestamp, enrichmentVersion, ...cleanPref } = pref;
          return cleanPref;
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
          break;
        }
      } catch (e) {
        // Invalid selector, skip
      }
    }

    // If not found with specific selectors, search all file inputs
    if (!fileInput) {
      const allFileInputs = document.querySelectorAll('input[type="file"]');

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
            break;
          }
        }

        // Otherwise take first available
        if (!fileInput && allFileInputs.length > 0) {
          fileInput = allFileInputs[0];
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

    // For Gemini, try ALL file inputs regardless of accept attribute
    const isGemini = currentPlatform.name === 'Gemini';

    // Skip image-only inputs (unless platform is Gemini which might need it)
    if (!isGemini && input.accept && input.accept.includes('image/') && !input.accept.includes('*') && !input.accept.includes('json')) {
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

  // Use platform-specific dropZones if available, otherwise fallback to defaults
  const dropTargets = currentPlatform.dropZones || [
    'form.group\\/composer',
    '[class*="composer"]',
    'form[class*="composer"]',
    currentPlatform.selectors?.inputContainer
  ];


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
    }
  }

  // Method 3: For Gemini - look for upload button and try to access its associated file input
  if (currentPlatform.name === 'Gemini') {

    // Wait a bit and try to find file inputs again (they might be dynamically created)
    await new Promise(resolve => setTimeout(resolve, 500));

    const allInputs = document.querySelectorAll('input[type="file"]');

    if (allInputs.length > 0) {
      for (const input of allInputs) {
        try {

          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          input.files = dataTransfer.files;

          // Trigger all possible events
          const events = ['change', 'input', 'blur'];
          events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true, cancelable: true });
            input.dispatchEvent(event);
          });

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

    for (const shadowRoot of shadowRoots) {
      const shadowInputs = shadowRoot.querySelectorAll('input[type="file"]');

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

  // Show button if we have data to inject
  // Button stays visible for multiple injections
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

      // Remove internal fields that LLM doesn't need
      const { embedding, vector, keywords, enrichmentTimestamp, enrichmentVersion, ...cleanField } = field;
      filteredProfile.content.basic.identity[key] = cleanField;
    });
  }

  if (hspProfile.content?.preferences?.items) {
    if (!filteredProfile.content) {
      filteredProfile.content = {};
    }

    filteredProfile.content.preferences = {
      items: hspProfile.content.preferences.items
        .filter(pref => {
          if (!includeHidden && pref.state === 'hidden') {
            return false;
          }
          if (!pref.value || pref.value.trim() === '') {
            return false;
          }
          return true;
        })
        .map(pref => {
          // Remove internal fields that LLM doesn't need
          const { vector, keywords, enrichmentTimestamp, enrichmentVersion, ...cleanPref } = pref;
          return cleanPref;
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
