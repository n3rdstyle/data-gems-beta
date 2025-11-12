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
    console.log('[ContextEngine] Initializing Context Engine v2...');

    try {
      // 1. Initialize database
      console.log('[ContextEngine] Step 1/5: Initialize database');
      this.db = await initDatabase();
      this.collection = getGemsCollection();

      // 2. Initialize vector store
      console.log('[ContextEngine] Step 2/5: Initialize vector store');
      this.vectorStore = await getVectorStore();

      // 3. Initialize BM25
      console.log('[ContextEngine] Step 3/5: Initialize BM25');
      this.bm25 = await getBM25();

      // 4. Initialize hybrid search
      console.log('[ContextEngine] Step 4/5: Initialize hybrid search');
      this.hybridSearch = await getHybridSearch();

      // 5. Initialize enrichment
      console.log('[ContextEngine] Step 5/5: Initialize enrichment');
      this.enrichment = await getEnrichment();

      this.isReady = true;

      const stats = await getDatabaseStats();
      console.log('[ContextEngine] Context Engine v2 ready!', stats);

      return this;
    } catch (error) {
      console.error('[ContextEngine] Failed to initialize:', error);
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

    console.log(`[ContextEngine] Adding gem: ${gem.id}`);

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
      console.log(`[ContextEngine] Inserting ${childGems.length} child gems for: ${gem.id}`);
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

    console.log(`[ContextEngine] Gem added successfully: ${gem.id}`, {
      childGems: childGems.length
    });
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

    console.log(`[ContextEngine] Updating gem: ${id}`);

    // Get current gem
    const currentGem = await this.vectorStore.getGem(id);
    if (!currentGem) {
      throw new Error(`[ContextEngine] Gem not found: ${id}`);
    }

    // If value changed, re-enrich
    let finalUpdates = updates;
    if (reEnrich && updates.value && updates.value !== currentGem.value) {
      console.log(`[ContextEngine] Value changed, re-enriching: ${id}`);
      const tempGem = { ...currentGem, ...updates };
      finalUpdates = await this.enrichment.enrichGem(tempGem);
    }

    // Update in vector store
    await this.vectorStore.update(id, finalUpdates);

    // Rebuild BM25 index (simple approach for now)
    // TODO: Optimize with incremental update
    await this.bm25.buildIndex();

    console.log(`[ContextEngine] Gem updated successfully: ${id}`);
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

    console.log(`[ContextEngine] Deleting gem: ${id}`);

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

    console.log(`[ContextEngine] Bulk importing ${gems.length} gems...`);

    let enrichedGems = gems;

    // Enrich all gems if requested
    if (autoEnrich) {
      console.log('[ContextEngine] Enriching gems...');
      enrichedGems = await this.enrichment.enrichBatch(gems, {}, onProgress);
    }

    // Bulk insert
    console.log('[ContextEngine] Inserting gems...');
    const results = await this.vectorStore.bulkInsert(enrichedGems);

    // Rebuild BM25 index
    console.log('[ContextEngine] Rebuilding BM25 index...');
    await this.bm25.buildIndex();

    console.log('[ContextEngine] Bulk import complete:', results);
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

    console.log('[ContextEngine] Searching for context:', { query, filters, limit });

    // Generate query embedding
    let queryVector = null;
    if (this.enrichment.isAvailable.embedder) {
      console.log('[ContextEngine] Generating query embedding...');
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

    console.log(`[ContextEngine] Search complete: ${plainResults.length} results`);
    return plainResults;
  }

  /**
   * Search with semantic type filtering
   * @param {Object} params - Search parameters
   * @param {string} params.query - Search query
   * @param {Array<string>} params.semanticTypes - Semantic types to include
   * @param {Object} params.filters - Additional filters
   * @param {number} params.limit - Max results
   * @returns {Promise<Array>}
   */
  async searchBySemanticType({
    query,
    semanticTypes = [],
    filters = {},
    limit = 10
  }) {
    const mergedFilters = {
      ...filters,
      semanticTypes
    };

    return this.search({
      query,
      filters: mergedFilters,
      limit
    });
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
    console.log('[ContextEngine] Rebuilding BM25 index after re-enrichment...');
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

    console.log('[ContextEngine] Rebuilding all indexes...');

    await this.vectorStore.rebuildIndex();
    await this.bm25.buildIndex();

    console.log('[ContextEngine] Indexes rebuilt successfully');
  }

  /**
   * Destroy engine and clean up resources
   */
  async destroy() {
    console.log('[ContextEngine] Destroying Context Engine...');

    if (this.enrichment) {
      await this.enrichment.destroy();
    }

    this.isReady = false;
    console.log('[ContextEngine] Context Engine destroyed');
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
