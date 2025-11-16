/**
 * Context Engine API Bridge for MAIN World
 * Communicates with ISOLATED world via Custom Events
 */

console.log('[ContextEngine Bridge] Initializing MAIN world bridge...');

window.ContextEngineAPI = {
  isReady: false,
  isInitializing: false,

  /**
   * Initialize - check if ISOLATED world Context Engine is ready
   */
  async initialize() {
    this.isInitializing = true;

    try {
      const result = await this._sendRequest('initialize');
      this.isReady = result.isReady;
      console.log('[ContextEngine Bridge] MAIN world bridge ready:', this.isReady);
      return this;
    } catch (error) {
      console.error('[ContextEngine Bridge] Failed to initialize:', error);
      throw error;
    } finally {
      this.isInitializing = false;
    }
  },

  /**
   * Search for relevant context
   */
  async search(query, filters = {}, limit = 10) {
    return this._sendRequest('search', { query, filters, limit });
  },

  /**
   * Get all gems
   */
  async getAllGems(filters = {}) {
    return this._sendRequest('getAllGems', { filters });
  },

  /**
   * Get single gem by ID
   */
  async getGem(id) {
    return this._sendRequest('getGem', { id });
  },

  /**
   * Get stats
   */
  async getStats() {
    return this._sendRequest('getStats');
  },

  /**
   * Send request to ISOLATED world and await response
   * @private
   */
  _sendRequest(action, params = {}) {
    return new Promise((resolve, reject) => {
      const requestId = `ce_${action}_${Date.now()}_${Math.random()}`;

      // Set up listeners
      const resultHandler = (event) => {
        if (event.detail.requestId === requestId) {
          document.removeEventListener('dataGems:contextEngine:result', resultHandler);
          document.removeEventListener('dataGems:contextEngine:error', errorHandler);
          resolve(event.detail.result);
        }
      };

      const errorHandler = (event) => {
        if (event.detail.requestId === requestId) {
          document.removeEventListener('dataGems:contextEngine:result', resultHandler);
          document.removeEventListener('dataGems:contextEngine:error', errorHandler);
          reject(new Error(event.detail.error));
        }
      };

      document.addEventListener('dataGems:contextEngine:result', resultHandler);
      document.addEventListener('dataGems:contextEngine:error', errorHandler);

      // Send request to ISOLATED world
      document.dispatchEvent(new CustomEvent('dataGems:contextEngine:request', {
        detail: { action, params, requestId }
      }));

      // Timeout after 30 seconds
      setTimeout(() => {
        document.removeEventListener('dataGems:contextEngine:result', resultHandler);
        document.removeEventListener('dataGems:contextEngine:error', errorHandler);
        reject(new Error(`ContextEngine ${action} timeout`));
      }, 30000);
    });
  }
};

// Auto-initialize with polling
(async function() {
  try {
    await window.ContextEngineAPI.initialize();
    console.log('[ContextEngine Bridge] MAIN world auto-init complete');

    // If not ready yet, poll until ready
    if (!window.ContextEngineAPI.isReady) {
      console.log('[ContextEngine Bridge] Context Engine not ready yet, starting polling...');

      const pollingInterval = setInterval(async () => {
        try {
          await window.ContextEngineAPI.initialize();

          if (window.ContextEngineAPI.isReady) {
            clearInterval(pollingInterval);
            console.log('[ContextEngine Bridge] ✓ Context Engine is now ready!');
          }
        } catch (error) {
          console.error('[ContextEngine Bridge] Polling error:', error);
        }
      }, 1000); // Poll every 1 second

      // Stop polling after 60 seconds
      setTimeout(() => {
        clearInterval(pollingInterval);
        console.log('[ContextEngine Bridge] Polling stopped (timeout)');
      }, 60000);
    }
  } catch (error) {
    console.error('[ContextEngine Bridge] MAIN world auto-init failed:', error);
  }
})();

console.log('[ContextEngine Bridge] MAIN world bridge loaded');
