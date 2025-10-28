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
