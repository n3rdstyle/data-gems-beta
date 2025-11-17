/**
 * Engine Bridge
 * Bridges Context Engine v2 (ES6 Module) with classic JavaScript (app.js)
 *
 * Provides global API via window.ContextEngineAPI
 */

import { getContextEngine } from './engine/context-engine.js';
import { migrateToContextEngine, checkMigrationStatus } from './engine/migration.js';

// Global API
window.ContextEngineAPI = {
  engine: null,
  isReady: false,
  isInitializing: false,

  /**
   * Initialize Context Engine and run migration if needed
   */
  async initialize() {
    if (this.isReady || this.isInitializing) {
      return this.engine;
    }

    this.isInitializing = true;

    try {
      console.log('[Engine Bridge] Initializing Context Engine v2...');

      // Check if migration is needed
      const migrationStatus = await checkMigrationStatus();
      console.log('[Engine Bridge] Migration status:', migrationStatus);

      // Run migration if needed
      if (migrationStatus.needsMigration) {
        console.log('[Engine Bridge] Running migration...');

        const migrationResult = await migrateToContextEngine({
          autoEnrich: true,  // Auto-enrich all gems
          clearOldData: false,  // Keep old data as backup
          onProgress: (current, total) => {
            console.log(`[Engine Bridge] Migration progress: ${current}/${total}`);
          }
        });

        console.log('[Engine Bridge] Migration complete:', migrationResult);
      } else {
        console.log('[Engine Bridge] No migration needed');
      }

      // Initialize engine
      this.engine = await getContextEngine();
      this.isReady = true;

      console.log('[Engine Bridge] Context Engine v2 ready!');

      // Log stats
      const stats = await this.engine.getStats();
      console.log('[Engine Bridge] Stats:', stats);

      return this.engine;

    } catch (error) {
      console.error('[Engine Bridge] Initialization failed:', error);
      this.isReady = false;
      throw error;
    } finally {
      this.isInitializing = false;
    }
  },

  /**
   * Search for relevant context
   * @param {string} query - Search query
   * @param {Object} filters - Optional filters
   * @param {number} limit - Max results
   * @returns {Promise<Array>} Search results
   */
  async search(query, filters = {}, limit = 10) {
    if (!this.isReady) {
      await this.initialize();
    }

    return this.engine.search({ query, filters, limit });
  },

  /**
   * Add a new gem
   * @param {Object} gem - Gem data
   * @param {boolean} autoEnrich - Auto-enrich with embeddings
   * @returns {Promise<Object>} Added gem
   */
  async addGem(gem, autoEnrich = true) {
    if (!this.isReady) {
      await this.initialize();
    }

    return this.engine.addGem(gem, autoEnrich);
  },

  /**
   * Update an existing gem
   * @param {string} id - Gem ID
   * @param {Object} updates - Updates
   * @param {boolean} reEnrich - Re-enrich if value changed
   * @returns {Promise<void>}
   */
  async updateGem(id, updates, reEnrich = true) {
    if (!this.isReady) {
      await this.initialize();
    }

    return this.engine.updateGem(id, updates, reEnrich);
  },

  /**
   * Delete a gem
   * @param {string} id - Gem ID
   * @returns {Promise<void>}
   */
  async deleteGem(id) {
    if (!this.isReady) {
      await this.initialize();
    }

    return this.engine.deleteGem(id);
  },

  /**
   * Get all gems
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>}
   */
  async getAllGems(filters = {}) {
    if (!this.isReady) {
      await this.initialize();
    }

    return this.engine.getAllGems(filters);
  },

  /**
   * Get single gem by ID
   * @param {string} id - Gem ID
   * @returns {Promise<Object|null>}
   */
  async getGem(id) {
    if (!this.isReady) {
      await this.initialize();
    }

    return this.engine.getGem(id);
  },

  /**
   * Get engine statistics
   * @returns {Promise<Object>}
   */
  async getStats() {
    if (!this.isReady) {
      await this.initialize();
    }

    return this.engine.getStats();
  },

  /**
   * Batch re-enrich existing gems
   * @param {Object} filters - Optional filters
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>}
   */
  async batchReEnrich(filters = {}, onProgress = null) {
    if (!this.isReady) {
      await this.initialize();
    }

    return this.engine.batchReEnrich(filters, onProgress);
  },

  /**
   * Generate embedding for text
   * @param {string} text - Text to embed
   * @returns {Promise<Array<number>|null>}
   */
  async generateEmbedding(text) {
    if (!this.isReady) {
      await this.initialize();
    }

    return this.engine.generateEmbedding(text);
  },

  /**
   * Get pre-computed category embeddings
   * @returns {Object} Map of category name to embedding vector
   */
  getCategoryEmbeddings() {
    if (!this.isReady) {
      console.warn('[Engine Bridge] Engine not ready, returning empty embeddings');
      return {};
    }

    return this.engine.getCategoryEmbeddings();
  },

  /**
   * Check if category embeddings are ready
   * @returns {boolean}
   */
  areCategoryEmbeddingsReady() {
    if (!this.isReady) {
      return false;
    }

    return this.engine.areCategoryEmbeddingsReady();
  }
};

// Auto-initialize on load
console.log('[Engine Bridge] Loaded, auto-initializing...');
window.ContextEngineAPI.initialize().catch(error => {
  console.error('[Engine Bridge] Auto-initialization failed:', error);
});
