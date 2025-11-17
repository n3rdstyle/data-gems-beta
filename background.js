/**
 * Data Gems Background Service Worker
 * Handles background tasks and lifecycle events
 */

// Service workers use 'self' instead of 'window'
// Create window alias for compatibility with bundle
if (typeof window === 'undefined') {
  self.window = self;
}

// Load Context Engine v2
console.log('[Background] Loading Context Engine v2 bundle...');
try {
  importScripts('engine-bridge.bundle.js');
  console.log('[Background] ✓ Context Engine bundle loaded');
} catch (error) {
  console.error('[Background] ✗ Failed to load Context Engine bundle:', error);
}

// Offscreen Document Management (for WASM embedding generation)
let offscreenDocumentCreated = false;

// Import Status (global state for background import)
let importStatus = {
  isImporting: false,
  currentItem: 0,
  totalItems: 0,
  importedCount: 0,
  errorCount: 0,
  phase: '', // 'primary' or 'child'
  error: null
};

/**
 * Create offscreen document for embedding generation
 * Offscreen documents support WASM unlike Service Workers
 */
async function ensureOffscreenDocument() {
  if (offscreenDocumentCreated) {
    return;
  }

  try {
    // Check if offscreen document already exists
    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT']
    });

    if (existingContexts.length > 0) {
      offscreenDocumentCreated = true;
      console.log('[Background] Offscreen document already exists');
      return;
    }

    // Create offscreen document
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['WORKERS'], // Using for ML model inference
      justification: 'Generate text embeddings using Transformers.js for semantic search'
    });

    offscreenDocumentCreated = true;
    console.log('[Background] ✓ Offscreen document created');
  } catch (error) {
    console.error('[Background] ✗ Failed to create offscreen document:', error);
    throw error;
  }
}

/**
 * Send embedding request to offscreen document
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} 768-dim embedding vector
 */
async function generateEmbeddingOffscreen(text) {
  await ensureOffscreenDocument();

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        target: 'offscreen',
        type: 'generateEmbedding',
        text
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (response.success) {
          resolve(response.embedding);
        } else {
          reject(new Error(response.error || 'Unknown error'));
        }
      }
    );
  });
}

// Expose to engine bundle (Service Worker can't message itself!)
self.generateEmbeddingOffscreen = generateEmbeddingOffscreen;

// Context Engine instance (initialized on first use)
let contextEngineReady = false;
let contextEngineInitializing = false;

/**
 * Initialize Context Engine v2
 * Called lazily on first Context Engine API call
 */
async function ensureContextEngine() {
  console.log('[Background] ensureContextEngine() called, ready:', contextEngineReady, 'initializing:', contextEngineInitializing);

  if (contextEngineReady) {
    return;
  }

  if (contextEngineInitializing) {
    // Wait for initialization to complete
    let waitCount = 0;
    while (!contextEngineReady && waitCount < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      waitCount++;
    }
    if (!contextEngineReady) {
      throw new Error('[Background] Context Engine initialization timeout');
    }
    return;
  }

  contextEngineInitializing = true;
  console.log('[Background] Initializing Context Engine v2...');

  try {
    // Check if ContextEngineAPI is available
    if (!self.ContextEngineAPI) {
      throw new Error('[Background] ContextEngineAPI not found after bundle load');
    }

    console.log('[Background] ContextEngineAPI available, calling initialize()...');
    await self.ContextEngineAPI.initialize();
    contextEngineReady = true;
    console.log('[Background] ✓ Context Engine v2 ready');
  } catch (error) {
    console.error('[Background] ✗ Failed to initialize Context Engine v2:', error);
    contextEngineInitializing = false;
    throw error;
  }
}

/**
 * Destroy Context Engine (for clean database deletion)
 */
async function destroyContextEngine() {
  console.log('[Background] Destroying Context Engine...');

  try {
    if (self.ContextEngineAPI && self.ContextEngineAPI.engine) {
      await self.ContextEngineAPI.engine.destroy();

      // Reset the singleton so it gets recreated fresh next time
      self.ContextEngineAPI.engine = null;
      self.ContextEngineAPI.isReady = false;
    }
    contextEngineReady = false;
    contextEngineInitializing = false;
    console.log('[Background] ✓ Context Engine destroyed and reset');
  } catch (error) {
    console.error('[Background] Error destroying Context Engine:', error);
    // Reset flags anyway
    contextEngineReady = false;
    contextEngineInitializing = false;
  }
}

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async (details) => {
  // Create offscreen document for embeddings
  try {
    await ensureOffscreenDocument();
  } catch (error) {
    console.error('[Background] Failed to create offscreen document on install:', error);
  }

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

// Ensure offscreen document on startup
chrome.runtime.onStartup.addListener(async () => {
  try {
    await ensureOffscreenDocument();
  } catch (error) {
    console.error('[Background] Failed to create offscreen document on startup:', error);
  }
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Background] Received message:', request.action, 'from:', sender.tab ? 'content script' : 'popup');

  // Handle Context Engine API calls
  if (request.action?.startsWith('contextEngine.')) {
    console.log('[Background] → Routing to Context Engine handler');
    handleContextEngineMessage(request, sender, sendResponse);
    return true; // Keep channel open for async response
  }

  // Forward offscreen document messages (for embeddings)
  if (request.target === 'offscreen') {
    // Messages from enrichment.js need to be forwarded to offscreen document
    chrome.runtime.sendMessage(request, (response) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse(response);
      }
    });
    return true; // Keep channel open for async response
  }

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

    case 'destroyEngine':
      destroyContextEngine()
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'log':
      console.log(request.message);
      sendResponse({ success: true });
      return false;

    case 'importData':
      handleImportData(request.importedData)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'getImportStatus':
      sendResponse({ status: importStatus });
      return false;

    default:
      sendResponse({ error: 'Unknown action' });
  }
});

/**
 * Handle Context Engine API messages from content scripts
 */
async function handleContextEngineMessage(request, sender, sendResponse) {
  console.log('[Background] Received Context Engine message:', request.action);

  try {
    // Ensure Context Engine is initialized
    await ensureContextEngine();

    const action = request.action.replace('contextEngine.', '');
    console.log('[Background] Handling action:', action);

    switch (action) {
      case 'search':
        const results = await self.ContextEngineAPI.search(
          request.query,
          request.filters || {},
          request.limit || 10
        );
        // Convert RxDB documents to plain objects
        const plainResults = results.map(result => {
          const gemData = result.toJSON ? result.toJSON() : result;
          return {
            id: gemData.id || gemData._data?.id,
            value: gemData.value || gemData._data?.value,
            collections: gemData.collections || gemData._data?.collections,
            subCollections: gemData.subCollections || gemData._data?.subCollections,
            keywords: gemData.keywords || gemData._data?.keywords,
            score: gemData.score || result.score || 0
          };
        });
        console.log('[Background] Returning', plainResults.length, 'search results');
        sendResponse({ success: true, results: plainResults });
        break;

      case 'getAllGems':
        const allGems = await self.ContextEngineAPI.getAllGems(request.filters || {});
        const plainGems = allGems.map(gem => {
          const gemData = gem.toJSON ? gem.toJSON() : gem;
          return {
            id: gemData.id || gemData._data?.id,
            value: gemData.value || gemData._data?.value,
            collections: gemData.collections || gemData._data?.collections,
            subCollections: gemData.subCollections || gemData._data?.subCollections,
            keywords: gemData.keywords || gemData._data?.keywords
          };
        });
        console.log('[Background] Returning', plainGems.length, 'gems');
        sendResponse({ success: true, gems: plainGems });
        break;

      case 'getGem':
        const gem = await self.ContextEngineAPI.getGem(request.id);
        if (gem) {
          const gemData = gem.toJSON ? gem.toJSON() : gem;
          sendResponse({
            success: true,
            gem: {
              id: gemData.id || gemData._data?.id,
              value: gemData.value || gemData._data?.value,
              collections: gemData.collections || gemData._data?.collections,
              subCollections: gemData.subCollections || gemData._data?.subCollections,
              keywords: gemData.keywords || gemData._data?.keywords
            }
          });
        } else {
          sendResponse({ success: true, gem: null });
        }
        break;

      case 'getStats':
        const stats = await self.ContextEngineAPI.getStats();
        console.log('[Background] Returning stats:', stats);
        sendResponse({ success: true, stats });
        break;

      case 'isReady':
        const isReady = self.ContextEngineAPI?.isReady || false;
        console.log('[Background] Context Engine ready?', isReady);
        sendResponse({ success: true, isReady });
        break;

      default:
        sendResponse({ success: false, error: `Unknown Context Engine action: ${action}` });
    }
  } catch (error) {
    console.error('[Background] Context Engine error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

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

// CRITICAL: Initialize Context Engine v2 with proper sequencing
/**
 * Handle data import in background
 * Runs independently of popup (continues even if popup closes)
 * @param {Object} importedData - Data to import
 */
async function handleImportData(importedData) {
  console.log('[Background] Starting import...');

  // Reset import status
  importStatus = {
    isImporting: true,
    currentItem: 0,
    totalItems: 0,
    importedCount: 0,
    errorCount: 0,
    phase: 'preparing',
    error: null
  };

  try {
    // Ensure Context Engine is ready
    const engine = await ensureContextEngine();
    console.log('[Background] Context Engine ready for import');

    // Extract preferences and child gems
    const preferences = importedData.content?.preferences?.items || [];
    const childGems = importedData.content?.childGems || [];

    importStatus.totalItems = preferences.length + childGems.length;
    console.log(`[Background] Importing ${preferences.length} primary gems and ${childGems.length} child gems`);

    const BATCH_SIZE = 5; // Update status every 5 items

    // Import primary gems
    importStatus.phase = 'primary';
    for (let i = 0; i < preferences.length; i++) {
      const pref = preferences[i];
      importStatus.currentItem = i + 1;

      try {
        const gem = {
          id: pref.id,
          value: pref.value,
          collections: pref.collections || [],
          subCollections: pref.subCollections || [],
          timestamp: pref.created_at ? new Date(pref.created_at).getTime() : Date.now(),
          state: pref.state || 'default',
          assurance: pref.assurance || 'self_declared',
          reliability: pref.reliability || 'authoritative',
          source_url: pref.source_url,
          mergedFrom: pref.mergedFrom,
          created_at: pref.created_at || new Date().toISOString(),
          updated_at: pref.updated_at || new Date().toISOString(),
          topic: pref.topic || '',
          isPrimary: true,
          parentGem: '',
          childGems: [],
          isVirtual: false
        };

        await window.ContextEngineAPI.addGem(gem, true); // true = generate embeddings
        importStatus.importedCount++;

        if (importStatus.importedCount % BATCH_SIZE === 0) {
          console.log(`[Background] Progress: ${importStatus.importedCount}/${importStatus.totalItems}`);
        }
      } catch (error) {
        importStatus.errorCount++;
        console.error(`[Background] Failed to import gem ${i + 1}:`, error);
      }
    }

    // Import child gems
    if (childGems.length > 0) {
      importStatus.phase = 'child';
      console.log(`[Background] Importing ${childGems.length} child gems...`);

      for (let i = 0; i < childGems.length; i++) {
        const child = childGems[i];
        importStatus.currentItem = preferences.length + i + 1;

        try {
          const childGem = {
            ...child,
            isPrimary: false,
            parentGem: child.parentGem || '',
            isVirtual: false
          };

          await window.ContextEngineAPI.addGem(childGem, true);
          importStatus.importedCount++;

          if (importStatus.importedCount % BATCH_SIZE === 0) {
            console.log(`[Background] Progress: ${importStatus.importedCount}/${importStatus.totalItems}`);
          }
        } catch (error) {
          importStatus.errorCount++;
          console.error(`[Background] Failed to import child gem ${i + 1}:`, error);
        }
      }
    }

    console.log(`[Background] ✅ Import complete: ${importStatus.importedCount} imported, ${importStatus.errorCount} errors`);
    importStatus.isImporting = false;
    importStatus.phase = 'complete';

  } catch (error) {
    console.error('[Background] Import failed:', error);
    importStatus.error = error.message;
    importStatus.isImporting = false;
    importStatus.phase = 'error';
    throw error;
  }
}

// 1. Create offscreen document first (for embedding generation)
// 2. Then manually initialize Context Engine (which may trigger migration)
// This prevents "Could not establish connection" errors during migration
(async () => {
  try {
    console.log('[Background] Initializing Context Engine v2...');

    // Step 1: Ensure offscreen document exists FIRST
    console.log('[Background] Step 1/2: Creating offscreen document...');
    await ensureOffscreenDocument();
    console.log('[Background] ✓ Offscreen document ready');

    // Step 2: Now manually initialize Context Engine (safe to generate embeddings)
    console.log('[Background] Step 2/2: Initializing Context Engine...');
    await window.ContextEngineAPI.initialize();
    console.log('[Background] ✓ Context Engine v2 fully initialized and ready!');
  } catch (error) {
    console.error('[Background] ✗ Context Engine initialization failed:', error);
  }
})();
