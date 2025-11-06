/**
 * Offscreen Document for Background Duplicate Scanning
 * Runs AI-powered duplicate detection in background
 * Has access to ai.languageModel (not available in service workers)
 */

console.log('[Offscreen] Duplicate scanner loaded');

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
      startDuplicateScan()
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
 */
async function startDuplicateScan() {
  console.log('[Offscreen] Starting duplicate scan...');

  // Reset state
  scanState = {
    running: true,
    cancelled: false,
    checked: 0,
    total: 0,
    foundCount: 0
  };

  // Save initial status to storage
  await chrome.storage.local.set({
    duplicateScanStatus: scanState,
    duplicateScanResults: []
  });

  // Get all gems from storage
  const result = await chrome.storage.local.get(['hspProfile']);
  const profile = result.hspProfile || {};
  const gems = profile?.content?.preferences?.items || [];

  if (gems.length === 0) {
    console.log('[Offscreen] No gems found');
    scanState.running = false;
    await chrome.storage.local.set({ duplicateScanStatus: scanState });
    return;
  }

  scanState.total = gems.length;
  console.log(`[Offscreen] Checking ${gems.length} gems for duplicates`);

  // Check if AI is available
  if (typeof ai === 'undefined' || !ai?.languageModel) {
    console.error('[Offscreen] AI not available');
    scanState.running = false;
    await chrome.storage.local.set({ duplicateScanStatus: scanState });
    throw new Error('AI not available in offscreen document. Please ensure Chrome Prompt API is enabled.');
  }

  console.log('[Offscreen] AI available! Creating session...');

  const duplicatePairs = [];
  const threshold = 80; // 80% similarity threshold
  const checkedPairs = new Set(); // Track which pairs we've already checked

  try {
    // Create AI session for similarity checking
    const session = await ai.languageModel.create({
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

      // Save progress to storage every 10 gems
      if ((i + 1) % 10 === 0 || i === gems.length - 1) {
        await chrome.storage.local.set({ duplicateScanStatus: scanState });
        console.log(`[Offscreen] Progress: ${i + 1} / ${gems.length} (${scanState.foundCount} pairs found)`);
      }
    }

    // Clean up session
    await session.destroy();

    // Save final results
    await chrome.storage.local.set({
      duplicateScanResults: duplicatePairs,
      duplicateScanStatus: scanState
    });

    console.log(`[Offscreen] Completed! Found ${duplicatePairs.length} similar pairs`);

  } catch (error) {
    console.error('[Offscreen] Error during scan:', error);
    scanState.running = false;
    await chrome.storage.local.set({ duplicateScanStatus: scanState });
    throw error;
  } finally {
    scanState.running = false;
    await chrome.storage.local.set({ duplicateScanStatus: scanState });
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
