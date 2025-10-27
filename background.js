/**
 * Data Gems Background Service Worker
 * Handles background tasks and lifecycle events
 */

// Initialize extension on install
chrome.runtime.onInstalled.addListener((details) => {
  // Set default data on fresh install
  if (details.reason === 'install') {
    chrome.storage.local.set({
      userData: {
        name: 'User',
        subtitle: '',
        email: '',
        age: '',
        gender: '',
        location: '',
        languages: [],
        description: ''
      },
      preferences: {
        favoriteTopics: [],
        hiddenTopics: []
      },
      dataGems: []
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

    default:
      sendResponse({ error: 'Unknown action' });
  }
});

/**
 * Monitor tab updates for auto-injection
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only act when page is fully loaded
  if (changeInfo.status !== 'complete') return;
  if (!tab.url) return;

  // Check if auto-inject is enabled
  try {
    const result = await chrome.storage.local.get(['hasProfile']);
    const hasProfile = result.hasProfile;

    if (!hasProfile) return;

    // Check if auto-inject is enabled in settings
    const autoInjectEnabled = hasProfile?.settings?.injection?.auto_inject || false;
    if (!autoInjectEnabled) return;

    // Check if URL matches supported platforms
    const supportedPlatforms = [
      'chat.openai.com',
      'chatgpt.com',
      'claude.ai',
      'gemini.google.com',
      'grok.com',
      'x.com/i/grok',
      'twitter.com/i/grok'
    ];

    const isSupported = supportedPlatforms.some(platform => tab.url.includes(platform));
    if (!isSupported) return;

    // Send message to content script to trigger auto-injection
    try {
      await chrome.tabs.sendMessage(tabId, {
        action: 'autoInject',
        profile: hasProfile
      });
    } catch (error) {
      // Content script not ready yet, ignore
    }
  } catch (error) {
    console.error('[Data Gems] Error in auto-inject check:', error);
  }
});

// Keep service worker alive
chrome.runtime.onStartup.addListener(() => {
  // Extension started
});
