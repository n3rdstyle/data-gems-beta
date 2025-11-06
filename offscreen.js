/**
 * Offscreen Document for Background Duplicate Scanning
 * Runs AI-powered duplicate detection in background
 * Has access to ai.languageModel (not available in service workers)
 */

console.log('[Offscreen] Duplicate scanner loaded');
console.log('[Offscreen] chrome available?', typeof chrome);
console.log('[Offscreen] chrome.storage available?', typeof chrome?.storage);
console.log('[Offscreen] chrome.storage.local available?', typeof chrome?.storage?.local);

// Track scan status
let scanState = {
  running: false,
  cancelled: false,
  checked: 0,
  total: 0,
  foundCount: 0
};

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Offscreen] Received message:', request.action);

  switch (request.action) {
    case 'startDuplicateScan':
      // Receive gems data from background script
      const gems = request.gems || [];
      console.log(`[Offscreen] Received ${gems.length} gems to scan`);
      startDuplicateScan(gems)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Keep channel open for async response

    case 'cancelDuplicateScan':
      cancelDuplicateScan();
      sendResponse({ success: true });
      return true;

    case 'getDuplicateScanStatus':
      sendResponse({ status: scanState });
      return true;

    default:
      sendResponse({ error: 'Unknown action' });
  }
});

/**
 * Start duplicate scan
 * Receives gems data as parameter (from background script)
 */
async function startDuplicateScan(gems) {
  console.log('[Offscreen] Starting duplicate scan...');

  // Reset state
  scanState = {
    running: true,
    cancelled: false,
    checked: 0,
    total: 0,
    foundCount: 0
  };

  // Notify background script of initial status
  chrome.runtime.sendMessage({
    action: 'updateScanStatus',
    status: scanState,
    results: []
  });

  if (!gems || gems.length === 0) {
    console.log('[Offscreen] No gems found');
    scanState.running = false;
    chrome.runtime.sendMessage({
      action: 'updateScanStatus',
      status: scanState,
      results: []
    });
    return;
  }

  scanState.total = gems.length;
  console.log(`[Offscreen] Checking ${gems.length} gems for duplicates`);

  // Check if AI is available with detailed logging
  console.log('[Offscreen] Checking AI availability...');
  console.log('[Offscreen] typeof ai:', typeof ai);
  console.log('[Offscreen] typeof window.ai:', typeof window?.ai);
  console.log('[Offscreen] typeof self.ai:', typeof self?.ai);
  console.log('[Offscreen] ai object:', ai);
  console.log('[Offscreen] ai?.languageModel:', ai?.languageModel);
  console.log('[Offscreen] window?.ai?.languageModel:', window?.ai?.languageModel);

  // Try different API locations
  let aiAPI = null;
  if (typeof ai !== 'undefined' && ai?.languageModel) {
    aiAPI = ai;
    console.log('[Offscreen] Found AI on global ai');
  } else if (typeof window !== 'undefined' && window.ai?.languageModel) {
    aiAPI = window.ai;
    console.log('[Offscreen] Found AI on window.ai');
  } else if (typeof self !== 'undefined' && self.ai?.languageModel) {
    aiAPI = self.ai;
    console.log('[Offscreen] Found AI on self.ai');
  }

  if (!aiAPI) {
    console.error('[Offscreen] AI not available in any location');
    scanState.running = false;
    chrome.runtime.sendMessage({
      action: 'updateScanStatus',
      status: scanState,
      results: []
    });
    throw new Error('AI not available in offscreen document. Please ensure Chrome Prompt API is enabled.');
  }

  console.log('[Offscreen] AI API found! Using:', aiAPI === ai ? 'global ai' : aiAPI === window.ai ? 'window.ai' : 'self.ai');

  console.log('[Offscreen] AI available! Creating session...');

  const duplicatePairs = [];
  const threshold = 80; // 80% similarity threshold
  const checkedPairs = new Set(); // Track which pairs we've already checked

  try {
    // Create AI session for similarity checking
    const session = await aiAPI.languageModel.create({
      systemPrompt: `You are a similarity detector for user preferences.
Compare two preference texts and rate similarity.

Rules:
1. Consider semantic meaning, not just exact words
2. "I eat meat" and "Do you like meat? Yes" are 85% similar
3. "Favorite color: blue" and "I like blue" are 90% similar
4. "Running is my hobby" and "I hate running" are 20% similar (opposite meanings)
5. Rate similarity from 0-100

Output format (just the number):
85`
    });

    console.log('[Offscreen] AI session created successfully');

    // Compare each gem with others
    for (let i = 0; i < gems.length; i++) {
      // Check if scan was cancelled
      if (scanState.cancelled) {
        console.log('[Offscreen] Scan cancelled by user');
        break;
      }

      const gem1 = gems[i];

      for (let j = i + 1; j < gems.length; j++) {
        const gem2 = gems[j];

        // Create unique pair identifier
        const pairId = [gem1.id, gem2.id].sort().join('-');

        // Skip if we've already checked this pair
        if (checkedPairs.has(pairId)) {
          continue;
        }
        checkedPairs.add(pairId);

        try {
          const prompt = `Preference 1: "${gem1.value}"

Preference 2: "${gem2.value}"

How similar are these? (0-100, just the number):`;

          const response = await session.prompt(prompt);
          const similarity = parseInt(response.trim());

          if (!isNaN(similarity) && similarity >= threshold) {
            console.log(`[Offscreen] Found similar pair (${similarity}%): "${gem1.value.substring(0, 40)}..." ←→ "${gem2.value.substring(0, 40)}..."`);

            duplicatePairs.push({
              gem1: { id: gem1.id, value: gem1.value },
              gem2: { id: gem2.id, value: gem2.value },
              similarity: similarity
            });

            scanState.foundCount++;
          }
        } catch (error) {
          console.warn('[Offscreen] Error comparing gems:', error);
          // Continue with next pair
        }
      }

      // Update progress
      scanState.checked = i + 1;

      // Send progress update to background every 10 gems
      if ((i + 1) % 10 === 0 || i === gems.length - 1) {
        chrome.runtime.sendMessage({
          action: 'updateScanStatus',
          status: scanState,
          results: duplicatePairs
        });
        console.log(`[Offscreen] Progress: ${i + 1} / ${gems.length} (${scanState.foundCount} pairs found)`);
      }
    }

    // Clean up session
    await session.destroy();

    // Send final results to background
    scanState.running = false;
    chrome.runtime.sendMessage({
      action: 'updateScanStatus',
      status: scanState,
      results: duplicatePairs
    });

    console.log(`[Offscreen] Completed! Found ${duplicatePairs.length} similar pairs`);

  } catch (error) {
    console.error('[Offscreen] Error during scan:', error);
    scanState.running = false;
    chrome.runtime.sendMessage({
      action: 'updateScanStatus',
      status: scanState,
      results: []
    });
    throw error;
  }
}

/**
 * Cancel duplicate scan
 */
function cancelDuplicateScan() {
  console.log('[Offscreen] Cancelling scan...');
  scanState.cancelled = true;
}

// Notify background script that offscreen is ready
console.log('[Offscreen] Ready to scan');
chrome.runtime.sendMessage({ action: 'offscreenReady' }).catch(() => {
  // Ignore errors if background script isn't listening
});
