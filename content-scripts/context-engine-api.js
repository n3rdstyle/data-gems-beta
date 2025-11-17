/**
 * Context Engine API for Content Scripts
 * Lightweight message passing wrapper to communicate with background service worker
 *
 * This provides the same API as window.ContextEngineAPI in the popup,
 * but routes all calls through chrome.runtime.sendMessage to the background worker.
 */

// Create shared global object for all content scripts
if (!window.dataGemsShared) {
  window.dataGemsShared = {};
}

window.ContextEngineAPI = {
  isReady: false,
  isInitializing: false,

  /**
   * Initialize - check if background Context Engine is ready
   */
  async initialize() {
    this.isInitializing = true;

    try {
      const response = await this._sendMessage('contextEngine.isReady');
      if (response.success) {
        this.isReady = response.isReady;
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
   * Generate embedding for text
   */
  async generateEmbedding(text) {
    const response = await this._sendMessage('contextEngine.generateEmbedding', {
      text
    });

    if (response.success) {
      return response.embedding;
    } else {
      throw new Error(response.error || 'Failed to generate embedding');
    }
  },

  /**
   * Get pre-computed category embeddings
   */
  async getCategoryEmbeddings() {
    const response = await this._sendMessage('contextEngine.getCategoryEmbeddings');

    if (response.success) {
      return response.embeddings;
    } else {
      throw new Error(response.error || 'Failed to get category embeddings');
    }
  },

  /**
   * Check if category embeddings are ready
   */
  async areCategoryEmbeddingsReady() {
    const response = await this._sendMessage('contextEngine.areCategoryEmbeddingsReady');

    if (response.success) {
      return response.ready;
    } else {
      throw new Error(response.error || 'Failed to check category embeddings status');
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

// Bridge for MAIN world requests
document.addEventListener('dataGems:contextEngine:request', async (event) => {
  const { action, params, requestId } = event.detail;

  try {
    let result;

    switch (action) {
      case 'initialize':
        // Wait for Context Engine to be ready (max 10 seconds)
        if (!window.ContextEngineAPI.isReady) {
          const startTime = Date.now();
          while (!window.ContextEngineAPI.isReady && (Date.now() - startTime) < 10000) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        result = { isReady: window.ContextEngineAPI.isReady };
        break;

      case 'search':
        result = await window.ContextEngineAPI.search(
          params.query,
          params.filters,
          params.limit
        );
        break;

      case 'getAllGems':
        result = await window.ContextEngineAPI.getAllGems(params.filters);
        break;

      case 'getGem':
        result = await window.ContextEngineAPI.getGem(params.id);
        break;

      case 'getStats':
        result = await window.ContextEngineAPI.getStats();
        break;

      case 'generateEmbedding':
        result = await window.ContextEngineAPI.generateEmbedding(params.text);
        break;

      case 'getCategoryEmbeddings':
        result = await window.ContextEngineAPI.getCategoryEmbeddings();
        break;

      case 'areCategoryEmbeddingsReady':
        result = await window.ContextEngineAPI.areCategoryEmbeddingsReady();
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Send result back to MAIN world
    document.dispatchEvent(new CustomEvent('dataGems:contextEngine:result', {
      detail: { requestId, result }
    }));
  } catch (error) {
    console.error('[ContextEngineAPI] Bridge: Request failed:', error);
    document.dispatchEvent(new CustomEvent('dataGems:contextEngine:error', {
      detail: { requestId, error: error.message }
    }));
  }
});

