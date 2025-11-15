/**
 * Context Engine Bridge
 * Entry point for bundling - exports ContextEngineAPI to window/self
 */

import { getContextEngine } from './context-engine.js';
import { migrateToContextEngine, checkMigrationStatus } from './migration.js';

// Global API that will be available in Service Worker
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

      if (migrationStatus.needsMigration) {
        console.log('[Engine Bridge] Running migration...');
        const migrationResult = await migrateToContextEngine({
          autoEnrich: true, // Auto-enrich all gems with embeddings
          clearOldData: false, // Keep old data as backup
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
  }
};

// NOTE: Auto-initialization removed to prevent race condition
// background.js will manually initialize AFTER offscreen document is ready
console.log('[Engine Bridge] Loaded (manual initialization required)');
