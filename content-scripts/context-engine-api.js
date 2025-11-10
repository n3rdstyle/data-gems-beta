/**
 * Context Engine API for Content Scripts
 * Lightweight message passing wrapper to communicate with background service worker
 *
 * This provides the same API as window.ContextEngineAPI in the popup,
 * but routes all calls through chrome.runtime.sendMessage to the background worker.
 */

window.ContextEngineAPI = {
  isReady: false,
  isInitializing: false,

  /**
   * Initialize - check if background Context Engine is ready
   */
  async initialize() {
    console.log('[ContextEngineAPI] Checking background Context Engine status...');
    this.isInitializing = true;

    try {
      const response = await this._sendMessage('contextEngine.isReady');
      if (response.success) {
        this.isReady = response.isReady;
        console.log('[ContextEngineAPI] Background Context Engine ready:', this.isReady);
      }
      return this;
    } catch (error) {
      console.error('[ContextEngineAPI] Failed to connect to background:', error);
      throw error;
    } finally {
      this.isInitializing = false;
    }
  },

  /**
   * Search for relevant context
   */
  async search(query, filters = {}, limit = 10) {
    const response = await this._sendMessage('contextEngine.search', {
      query,
      filters,
      limit
    });

    if (response.success) {
      return response.results;
    } else {
      throw new Error(response.error || 'Search failed');
    }
  },

  /**
   * Get all gems (with optional filters)
   */
  async getAllGems(filters = {}) {
    const response = await this._sendMessage('contextEngine.getAllGems', {
      filters
    });

    if (response.success) {
      return response.gems;
    } else {
      throw new Error(response.error || 'Failed to get gems');
    }
  },

  /**
   * Get a single gem by ID
   */
  async getGem(id) {
    const response = await this._sendMessage('contextEngine.getGem', {
      id
    });

    if (response.success) {
      return response.gem;
    } else {
      throw new Error(response.error || 'Failed to get gem');
    }
  },

  /**
   * Get database statistics
   */
  async getStats() {
    const response = await this._sendMessage('contextEngine.getStats');

    if (response.success) {
      return response.stats;
    } else {
      throw new Error(response.error || 'Failed to get stats');
    }
  },

  /**
   * Send message to background and await response
   * @private
   */
  _sendMessage(action, params = {}) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          action,
          ...params
        },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        }
      );
    });
  }
};

// Auto-initialize on load
(async function() {
  try {
    await window.ContextEngineAPI.initialize();
  } catch (error) {
    console.error('[ContextEngineAPI] Auto-initialization failed:', error);
  }
})();

console.log('[ContextEngineAPI] Message passing wrapper loaded');
