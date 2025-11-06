/**
 * Data Gems Background Service Worker
 * Handles background tasks and lifecycle events
 */

// Initialize extension on install
chrome.runtime.onInstalled.addListener((details) => {
  // Set default data on fresh install
  if (details.reason === 'install') {
    const installDate = new Date().toISOString();

    chrome.storage.local.set({
      // Beta user tracking (preferences are handled by app.js in HSP format)
      betaUser: {
        installDate: installDate,
        checkedIn: false,
        betaId: null,
        email: null,
        skipped: false,
        skipCount: 0
      }
    });
  }
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Add message handlers here as needed
  switch (request.action) {
    case 'getData':
      chrome.storage.local.get(['userData', 'preferences', 'dataGems'], (result) => {
        sendResponse(result);
      });
      return true; // Keep channel open for async response

    case 'saveData':
      chrome.storage.local.set(request.data, () => {
        sendResponse({ success: true });
      });
      return true;

    case 'betaCheckin':
      handleBetaCheckin(request.email, request.consentGiven)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'betaSkipped':
      handleBetaSkipped()
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'betaRevoke':
      handleBetaRevoke()
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'checkBetaReminder':
      checkBetaReminderConditions()
        .then(shouldShow => sendResponse({ shouldShow }))
        .catch(error => sendResponse({ shouldShow: false, error: error.message }));
      return true;

    case 'startDuplicateScan':
      startDuplicateScan()
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'cancelDuplicateScan':
      cancelDuplicateScan();
      sendResponse({ success: true });
      return true;

    case 'getDuplicateScanStatus':
      sendResponse({ status: duplicateScanStatus });
      return true;

    case 'getDuplicateScanResults':
      chrome.storage.local.get(['duplicateScanResults'], (result) => {
        sendResponse({ results: result.duplicateScanResults || [] });
      });
      return true;

    default:
      sendResponse({ error: 'Unknown action' });
  }
});

/**
 * Monitor tab updates for auto-injection
 * DISABLED: Auto-inject is now handled directly by the content script on page load
 * This prevents multiple injection attempts and is simpler/more reliable
 */
// chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
//   // Disabled - content script handles auto-inject directly
// });

// Keep service worker alive
chrome.runtime.onStartup.addListener(() => {
  // Extension started
});

/**
 * Beta Check-In Functions
 */

// Check if beta reminder should be shown
async function checkBetaReminderConditions() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['betaUser', 'hspProfile'], (result) => {
      console.log('🔍 [Beta Check-In] Storage data:', result);

      const betaUser = result.betaUser || {};
      const profile = result.hspProfile || {};

      console.log('🔍 [Beta Check-In] betaUser:', betaUser);
      console.log('🔍 [Beta Check-In] profile exists:', !!profile);

      // Don't show if already checked in
      if (betaUser.checkedIn) {
        console.log('❌ [Beta Check-In] Already checked in');
        resolve(false);
        return;
      }

      // Don't show automatically if user has skipped at all (only show via settings)
      if (betaUser.skipped) {
        console.log('❌ [Beta Check-In] User has skipped, only show via settings');
        resolve(false);
        return;
      }

      // Get preferences count from HSP format
      const preferencesCount = profile?.content?.preferences?.items?.length || 0;
      console.log('🔍 [Beta Check-In] Preferences count:', preferencesCount);

      // Show if 5+ preferences saved
      const hasEnoughGems = preferencesCount >= 5;

      console.log('🔍 [Beta Check-In] Has enough gems (5+):', hasEnoughGems);
      console.log('🔍 [Beta Check-In] Should show?', hasEnoughGems);

      resolve(hasEnoughGems);
    });
  });
}

// Handle beta check-in submission
async function handleBetaCheckin(email, consentGiven) {
  // Generate beta ID
  const betaId = `beta_${generateUUID()}`;
  const joinDate = new Date().toISOString();

  // Save to Supabase
  try {
    await sendToSupabase(betaId, email, joinDate, consentGiven);

    // Update local storage
    return new Promise((resolve) => {
      chrome.storage.local.get(['betaUser'], (result) => {
        const betaUser = result.betaUser || {};
        betaUser.checkedIn = true;
        betaUser.betaId = betaId;
        betaUser.email = email;

        chrome.storage.local.set({ betaUser }, () => {
          resolve();
        });
      });
    });
  } catch (error) {
    throw new Error('Failed to register for beta program. Please try again.');
  }
}

// Handle beta skip
async function handleBetaSkipped() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['betaUser'], (result) => {
      const betaUser = result.betaUser || {};
      betaUser.skipped = true;
      betaUser.skipCount = (betaUser.skipCount || 0) + 1;

      chrome.storage.local.set({ betaUser }, resolve);
    });
  });
}

// Handle beta revoke
async function handleBetaRevoke() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['betaUser'], async (result) => {
      const betaUser = result.betaUser || {};
      const betaId = betaUser.betaId;

      if (!betaId) {
        // No beta ID to delete
        resolve();
        return;
      }

      try {
        // Delete from Supabase
        await deleteFromSupabase(betaId);

        // Reset local storage
        chrome.storage.local.set({
          betaUser: {
            installDate: betaUser.installDate || new Date().toISOString(),
            checkedIn: false,
            betaId: null,
            email: null,
            skipped: false,
            skipCount: 0
          }
        }, resolve);
      } catch (error) {
        reject(new Error('Failed to revoke beta status. Please try again.'));
      }
    });
  });
}

// Send beta user data to Supabase
async function sendToSupabase(betaId, email, joinDate, consentGiven) {
  const SUPABASE_URL = 'https://shijwijxomocxqycjvud.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaWp3aWp4b21vY3hxeWNqdnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNTE5OTYsImV4cCI6MjA2MTgyNzk5Nn0.ept6h6lUhX57ELTWTuy1wBoRJB2QKIsJ6iBL1OEIpmk';

  const response = await fetch(`${SUPABASE_URL}/rest/v1/beta_users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({
      beta_id: betaId,
      email: email,
      joined_at: joinDate,
      consent_given: consentGiven
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase error: ${error}`);
  }
}

// Delete beta user data from Supabase
async function deleteFromSupabase(betaId) {
  const SUPABASE_URL = 'https://shijwijxomocxqycjvud.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaWp3aWp4b21vY3hxeWNqdnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNTE5OTYsImV4cCI6MjA2MTgyNzk5Nn0.ept6h6lUhX57ELTWTuy1wBoRJB2QKIsJ6iBL1OEIpmk';

  const response = await fetch(`${SUPABASE_URL}/rest/v1/beta_users?beta_id=eq.${betaId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=minimal'
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase error: ${error}`);
  }
}

// Generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Duplicate Scan Functions
 */

// Track scan status
let duplicateScanStatus = {
  running: false,
  checked: 0,
  total: 0,
  foundCount: 0,
  cancelled: false
};

// Start duplicate scan
async function startDuplicateScan() {
  console.log('[Duplicate Scan] Starting background scan...');

  // Reset status
  duplicateScanStatus = {
    running: true,
    checked: 0,
    total: 0,
    foundCount: 0,
    cancelled: false
  };

  // Clear previous results
  await chrome.storage.local.set({ duplicateScanResults: [] });

  // Get all gems
  const result = await chrome.storage.local.get(['hspProfile']);
  const profile = result.hspProfile || {};
  const gems = profile?.content?.preferences?.items || [];

  if (gems.length === 0) {
    console.log('[Duplicate Scan] No gems found');
    duplicateScanStatus.running = false;
    return;
  }

  duplicateScanStatus.total = gems.length;
  console.log(`[Duplicate Scan] Checking ${gems.length} gems for duplicates`);

  // Check if AI is available
  if (typeof ai === 'undefined' || !ai?.languageModel) {
    console.error('[Duplicate Scan] AI not available in service worker');
    duplicateScanStatus.running = false;
    throw new Error('AI not available. Please ensure Chrome has AI features enabled.');
  }

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

    // Compare each gem with others
    for (let i = 0; i < gems.length; i++) {
      // Check if scan was cancelled
      if (duplicateScanStatus.cancelled) {
        console.log('[Duplicate Scan] Scan cancelled by user');
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
            console.log(`[Duplicate Scan] Found similar pair (${similarity}%): "${gem1.value.substring(0, 40)}..." ←→ "${gem2.value.substring(0, 40)}..."`);

            duplicatePairs.push({
              gem1: { id: gem1.id, value: gem1.value },
              gem2: { id: gem2.id, value: gem2.value },
              similarity: similarity
            });

            duplicateScanStatus.foundCount++;
          }
        } catch (error) {
          console.warn('[Duplicate Scan] Error comparing gems:', error);
          // Continue with next pair
        }
      }

      // Update progress
      duplicateScanStatus.checked = i + 1;

      // Log progress every 10 gems
      if ((i + 1) % 10 === 0 || i === gems.length - 1) {
        console.log(`[Duplicate Scan] Progress: ${i + 1} / ${gems.length} (${duplicateScanStatus.foundCount} pairs found)`);
      }
    }

    // Clean up session
    await session.destroy();

    // Save results
    await chrome.storage.local.set({ duplicateScanResults: duplicatePairs });

    console.log(`[Duplicate Scan] Completed! Found ${duplicatePairs.length} similar pairs`);

  } catch (error) {
    console.error('[Duplicate Scan] Error during scan:', error);
    throw error;
  } finally {
    duplicateScanStatus.running = false;
  }
}

// Cancel duplicate scan
function cancelDuplicateScan() {
  console.log('[Duplicate Scan] Cancelling scan...');
  duplicateScanStatus.cancelled = true;
}
