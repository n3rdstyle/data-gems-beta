/**
 * Context Engine v2
 * Main Orchestrator for Data Gems Context Selection
 *
 * Provides a unified API for:
 * - Auto-enrichment of gems (embeddings + semantic classification)
 * - Hybrid search (dense vector + sparse keyword)
 * - Context-aware ranking and filtering
 */

import { initDatabase, getDatabase, getGemsCollection, getDatabaseStats } from './database.js';
import { getVectorStore } from './vector-store.js';
import { getBM25 } from './bm25.js';
import { getHybridSearch } from './hybrid-search.js';
import { getEnrichment } from './enrichment.js';

/**
 * Context Engine Class
 * Orchestrates all components for intelligent context selection
 */
export class ContextEngine {
  constructor() {
    this.db = null;
    this.collection = null;
    this.vectorStore = null;
    this.bm25 = null;
    this.hybridSearch = null;
    this.enrichment = null;
    this.isReady = false;
  }

  /**
   * Initialize Context Engine
   * Sets up all components: database, vector store, BM25, hybrid search, enrichment
   */
  async init() {

    try {
      // 1. Initialize database
      this.db = await initDatabase();
      this.collection = getGemsCollection();

      // 2. Initialize vector store
      this.vectorStore = await getVectorStore();

      // 3. Initialize BM25
      this.bm25 = await getBM25();

      // 4. Initialize hybrid search
      this.hybridSearch = await getHybridSearch();

      // 5. Initialize enrichment
      this.enrichment = await getEnrichment();

      this.isReady = true;

      const stats = await getDatabaseStats();
      console.log('[ContextEngine] Context Engine v2 ready!', stats);

      // 6. Start background task: Pre-compute category embeddings (non-blocking)
      this._initializeCategoryEmbeddingsBackground().catch(error => {
        console.error('[ContextEngine] Background category embedding failed:', error);
      });

      return this;
    } catch (error) {
      console.error('[ContextEngine] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Background task: Initialize category embeddings
   * Runs async after Context Engine is ready
   * @private
   */
  async _initializeCategoryEmbeddingsBackground() {
    try {
      // Extract all unique categories from gems
      const allGems = await this.vectorStore.getAllGems();
      const categories = [...new Set(
        allGems
          .flatMap(gem => {
            const gemData = gem.toJSON ? gem.toJSON() : gem;
            return gemData.collections || gemData._data?.collections || [];
          })
          .filter(Boolean)
      )];

      if (categories.length === 0) {
        return;
      }


      // Initialize embeddings in background (non-blocking)
      await this.enrichment.initializeCategoryEmbeddings(categories, true);

      console.log('[ContextEngine] ✅ Background category embedding complete');
    } catch (error) {
      console.error('[ContextEngine] Background category embedding error:', error);
      throw error;
    }
  }

  /**
   * Add a new gem with auto-enrichment
   * @param {Object} gem - Gem object (must have id and value)
   * @param {boolean} autoEnrich - Auto-enrich with embeddings and semantic type
   * @returns {Promise<Object>} Enriched gem
   */
  async addGem(gem, autoEnrich = true) {
    if (!this.isReady) {
      throw new Error('[ContextEngine] Engine not initialized');
    }


    // Enrich gem if requested
    let enrichedGem = gem;
    if (autoEnrich) {
      enrichedGem = await this.enrichment.enrichGem(gem);
    }

    // Extract child gems to insert (if any)
    const childGems = enrichedGem._childGemsToInsert || [];
    delete enrichedGem._childGemsToInsert;  // Remove temp property

    // Insert primary gem into vector store (which wraps RxDB collection)
    await this.vectorStore.insert(enrichedGem);

    // Insert child gems
    if (childGems.length > 0) {
      for (const childGem of childGems) {
        await this.vectorStore.insert(childGem);

        // Update BM25 index for child
        if (childGem.keywords) {
          await this.bm25.updateIndex(childGem);
        }
      }
    }

    // Update BM25 index for primary gem
    if (enrichedGem.keywords) {
      await this.bm25.updateIndex(enrichedGem);
    }

    // Auto-embed new categories
    if (enrichedGem.collections && enrichedGem.collections.length > 0) {
      const existingEmbeddings = this.enrichment.getCategoryEmbeddings();
      const newCategories = enrichedGem.collections.filter(cat => !existingEmbeddings[cat]);

      if (newCategories.length > 0) {
        await this.enrichment.initializeCategoryEmbeddings(newCategories);
      }
    }

    return enrichedGem;
  }

  /**
   * Update an existing gem
   * @param {string} id - Gem ID
   * @param {Object} updates - Fields to update
   * @param {boolean} reEnrich - Re-enrich if value changed
   * @returns {Promise<void>}
   */
  async updateGem(id, updates, reEnrich = true) {
    if (!this.isReady) {
      throw new Error('[ContextEngine] Engine not initialized');
    }


    // Get current gem
    const currentGem = await this.vectorStore.getGem(id);
    if (!currentGem) {
      throw new Error(`[ContextEngine] Gem not found: ${id}`);
    }

    // If value changed OR reEnrich requested, re-enrich
    let finalUpdates = updates;
    const shouldEnrich = reEnrich && (
      (updates.value && updates.value !== currentGem.value) || // Value changed
      (!currentGem.vector || currentGem.vector.length === 0)    // No embedding yet
    );

    if (shouldEnrich) {
      console.log(`[ContextEngine] Re-enriching gem: ${id}`);
      const tempGem = { ...currentGem, ...updates };
      finalUpdates = await this.enrichment.enrichGem(tempGem);
    }

    // Update in vector store
    await this.vectorStore.update(id, finalUpdates);

    // Rebuild BM25 index (simple approach for now)
    // TODO: Optimize with incremental update
    await this.bm25.buildIndex();

  }

  /**
   * Delete a gem
   * @param {string} id - Gem ID
   * @returns {Promise<void>}
   */
  async deleteGem(id) {
    if (!this.isReady) {
      throw new Error('[ContextEngine] Engine not initialized');
    }


    // Get gem before deletion (for BM25 index update)
    const gem = await this.vectorStore.getGem(id);

    // Delete from vector store
    await this.vectorStore.delete(id);

    // Update BM25 index
    if (gem && gem.keywords) {
      await this.bm25.removeFromIndex(gem);
    }

    console.log(`[ContextEngine] Gem deleted successfully: ${id}`);
  }

  /**
   * Bulk import gems with optional auto-enrichment
   * @param {Array<Object>} gems - Array of gems to import
   * @param {boolean} autoEnrich - Auto-enrich all gems
   * @param {Function} onProgress - Progress callback (current, total)
   * @returns {Promise<Object>} Import results
   */
  async bulkImport(gems, autoEnrich = true, onProgress = null) {
    if (!this.isReady) {
      throw new Error('[ContextEngine] Engine not initialized');
    }


    let enrichedGems = gems;

    // Enrich all gems if requested
    if (autoEnrich) {
      enrichedGems = await this.enrichment.enrichBatch(gems, {}, onProgress);
    }

    // Bulk insert
    const results = await this.vectorStore.bulkInsert(enrichedGems);

    // Rebuild BM25 index
    await this.bm25.buildIndex();

    return results;
  }

  /**
   * Search for relevant context
   * @param {Object} params - Search parameters
   * @param {string} params.query - Search query text
   * @param {Object} params.filters - Filters (collections, semanticTypes, dateRange)
   * @param {number} params.limit - Max results
   * @param {boolean} params.useDiversity - Apply MMR diversity filter
   * @returns {Promise<Array>} Ranked context results
   */
  async search({
    query,
    filters = {},
    limit = 10,
    useDiversity = true
  }) {
    if (!this.isReady) {
      throw new Error('[ContextEngine] Engine not initialized');
    }


    // Generate query embedding
    let queryVector = null;
    if (this.enrichment.isAvailable.embedder) {
      queryVector = await this.enrichment.generateEmbedding(query);
    }

    // Hybrid search
    const results = await this.hybridSearch.search({
      query,
      queryVector,
      filters,
      limit,
      useDiversity
    });

    // Convert results from { id, score, gem } to plain gem objects with score attached
    const plainResults = results.map(result => ({
      ...result.gem,
      score: result.score
    }));

    return plainResults;
  }

  /**
   * Get all gems (with optional filters)
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>}
   */
  async getAllGems(filters = {}) {
    if (!this.isReady) {
      throw new Error('[ContextEngine] Engine not initialized');
    }

    return this.vectorStore.getAllGems(filters);
  }

  /**
   * Get a single gem by ID
   * @param {string} id - Gem ID
   * @returns {Promise<Object|null>}
   */
  async getGem(id) {
    if (!this.isReady) {
      throw new Error('[ContextEngine] Engine not initialized');
    }

    return this.vectorStore.getGem(id);
  }

  /**
   * Generate embedding for text
   * @param {string} text - Text to embed
   * @returns {Promise<Array<number>|null>} Embedding vector or null
   */
  async generateEmbedding(text) {
    if (!this.isReady) {
      throw new Error('[ContextEngine] Engine not initialized');
    }

    if (!this.enrichment.isAvailable.embedder) {
      console.warn('[ContextEngine] Embedder not available');
      return null;
    }

    return this.enrichment.generateEmbedding(text);
  }

  /**
   * Get pre-computed category embeddings
   * @returns {Object} Map of category name to embedding vector
   */
  getCategoryEmbeddings() {
    if (!this.isReady) {
      throw new Error('[ContextEngine] Engine not initialized');
    }

    return this.enrichment.getCategoryEmbeddings();
  }

  /**
   * Check if category embeddings are ready
   * @returns {boolean} True if ready
   */
  areCategoryEmbeddingsReady() {
    if (!this.isReady) {
      return false;
    }

    return this.enrichment.areCategoryEmbeddingsReady();
  }

  /**
   * Get database statistics
   * @returns {Promise<Object>}
   */
  async getStats() {
    if (!this.isReady) {
      throw new Error('[ContextEngine] Engine not initialized');
    }

    const dbStats = await getDatabaseStats();
    const bm25Stats = this.bm25.getStats();
    const enrichmentStatus = this.enrichment.getStatus();

    return {
      database: dbStats,
      bm25: bm25Stats,
      enrichment: enrichmentStatus,
      isReady: this.isReady
    };
  }

  /**
   * Batch re-enrich existing gems
   * Useful for migration from old data format
   * @param {Object} filters - Optional filters for which gems to re-enrich
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>} Re-enrichment results
   */
  async batchReEnrich(filters = {}, onProgress = null) {
    if (!this.isReady) {
      throw new Error('[ContextEngine] Engine not initialized');
    }

    console.log('[ContextEngine] Starting batch re-enrichment...');

    // Get all gems matching filters
    const gems = await this.getAllGems(filters);

    console.log(`[ContextEngine] Found ${gems.length} gems to re-enrich`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < gems.length; i++) {
      const gem = gems[i];

      try {
        // Re-enrich
        const enriched = await this.enrichment.enrichGem(gem);

        // Update in database
        await this.vectorStore.update(gem.id, enriched);

        successCount++;

        if (onProgress) {
          onProgress(i + 1, gems.length, successCount, errorCount);
        }
      } catch (error) {
        console.error(`[ContextEngine] Error re-enriching gem ${gem.id}:`, error);
        errorCount++;
      }
    }

    // Rebuild BM25 index
    await this.bm25.buildIndex();

    const results = {
      total: gems.length,
      success: successCount,
      errors: errorCount
    };

    console.log('[ContextEngine] Batch re-enrichment complete:', results);
    return results;
  }

  /**
   * Rebuild all indexes
   * @returns {Promise<void>}
   */
  async rebuildIndexes() {
    if (!this.isReady) {
      throw new Error('[ContextEngine] Engine not initialized');
    }


    await this.vectorStore.rebuildIndex();
    await this.bm25.buildIndex();

  }

  /**
   * Destroy engine and clean up resources
   */
  async destroy() {

    // Destroy enrichment
    if (this.enrichment) {
      await this.enrichment.destroy();
    }

    // Clear vector store and HNSW index from memory
    if (this.vectorStore) {
      this.vectorStore.hnswIndex = null;
      this.vectorStore.indexReady = false;
    }

    // CRITICAL: Close RxDB database connection
    // This ensures IndexedDB can be deleted without being blocked
    try {
      const { closeDatabase } = await import('./database.js');
      await closeDatabase();
    } catch (error) {
      console.warn('[ContextEngine] Error closing database:', error);
    }

    // Reset singleton instance so fresh engine is created on next init
    contextEngineInstance = null;

    this.isReady = false;
  }
}

/**
 * Singleton instance
 */
let contextEngineInstance = null;

/**
 * Get or create ContextEngine instance
 * @returns {Promise<ContextEngine>}
 */
export async function getContextEngine() {
  if (!contextEngineInstance) {
    contextEngineInstance = new ContextEngine();
    await contextEngineInstance.init();
  }
  return contextEngineInstance;
}

/**
 * Reset singleton (for testing)
 */
export function resetContextEngine() {
  contextEngineInstance = null;
}
