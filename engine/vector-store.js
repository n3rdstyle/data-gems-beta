/**
 * Vector Store
 * Context Engine v2 - Dense Vector Search with ANN (HNSW)
 *
 * Implements dense vector search using HNSW (Hierarchical Navigable Small World)
 * for fast approximate nearest neighbor search
 */

import { getGemsCollection } from './database.js';
import { HNSWIndex } from './hnsw-index.js';

/**
 * Cosine similarity between two vectors
 * @param {number[]} vecA - Vector A (384-dim)
 * @param {number[]} vecB - Vector B (384-dim)
 * @returns {number} Similarity score (0-1, higher is more similar)
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);

  if (magnitude === 0) {
    return 0;
  }

  // Normalize to 0-1 range (cosine returns -1 to 1)
  return (dotProduct / magnitude + 1) / 2;
}

/**
 * Vector Store Class
 * Wraps RxDB collection with vector search capabilities + HNSW ANN index
 */
export class VectorStore {
  constructor() {
    this.collection = null;
    this.hnswIndex = null;
    this.indexReady = false;
    this.useANN = true; // Enable ANN by default, fallback to brute-force if needed
  }

  /**
   * Initialize vector store
   */
  async init() {
    this.collection = getGemsCollection();

    if (!this.collection) {
      throw new Error('[VectorStore] Database not initialized');
    }

    // Initialize HNSW index
    await this._initHNSW();

    return this;
  }

  /**
   * Initialize or load HNSW index
   */
  async _initHNSW() {
    try {
      // Try to load persisted index from chrome.storage.local (works in Service Workers)
      const storage = await chrome.storage.local.get(['hnsw_index']);
      const serialized = storage.hnsw_index;

      if (serialized) {
        const data = JSON.parse(serialized);
        this.hnswIndex = HNSWIndex.fromJSON(data);
        this.indexReady = true;
      } else {
        // Build new index from existing gems
        await this._buildHNSW();
      }
    } catch (error) {
      console.error('[VectorStore] Failed to load HNSW index, rebuilding:', error);
      await this._buildHNSW();
    }
  }

  /**
   * Build HNSW index from all gems with vectors
   */
  async _buildHNSW() {
    // Create new index with optimized parameters
    this.hnswIndex = new HNSWIndex({
      M: 16,              // Connections per node (balance between accuracy and memory)
      efConstruction: 200, // Construction quality (higher = better but slower build)
      efSearch: 50        // Search quality (can be adjusted per query)
    });

    // Get all gems with vectors
    const docs = await this.collection.find({
      selector: {
        vector: { $exists: true }
      }
    }).exec();


    let added = 0;
    for (const doc of docs) {
      const gem = doc.toJSON();
      if (gem.vector && Array.isArray(gem.vector) && gem.vector.length > 0) {
        try {
          this.hnswIndex.add(gem.id, gem.vector);
          added++;

          // Log progress every 100 gems
          if (added % 100 === 0) {
          }
        } catch (error) {
          console.warn(`[VectorStore] Failed to add gem ${gem.id} to HNSW:`, error.message);
        }
      }
    }

    this.indexReady = true;

    // Persist index
    await this._saveHNSW();
  }

  /**
   * Save HNSW index to chrome.storage.local
   */
  async _saveHNSW() {
    try {
      const serialized = JSON.stringify(this.hnswIndex.toJSON());
      await chrome.storage.local.set({ hnsw_index: serialized });
      const sizeKB = Math.round(serialized.length / 1024);
    } catch (error) {
      console.error('[VectorStore] Failed to save HNSW index:', error);
      // If storage quota exceeded, continue without persisting
      if (error.message && error.message.includes('QUOTA_BYTES')) {
        console.warn('[VectorStore] chrome.storage.local quota exceeded, index will rebuild on next init');
      }
    }
  }

  /**
   * Insert a gem (vector field is optional)
   * @param {Object} gem - Gem object (vector field optional)
   */
  async insert(gem) {
    // Validate vector if present (support both 384-dim and 768-dim)
    if (gem.vector) {
      const validDimensions = [384, 768];
      if (!validDimensions.includes(gem.vector.length)) {
        console.warn(`[VectorStore] Gem ${gem.id} has invalid vector (length: ${gem.vector.length}), removing it`);
        delete gem.vector;
      }
    }

    // Vector is optional - gems without vectors won't be searchable via dense search
    if (!gem.vector) {
    }

    try {
      await this.collection.insert(gem);

      // Add to HNSW index if vector present
      if (gem.vector && this.indexReady) {
        try {
          this.hnswIndex.add(gem.id, gem.vector);

          // Persist index periodically (every 10 insertions to avoid too frequent saves)
          if (this.hnswIndex.size % 10 === 0) {
            await this._saveHNSW();
          }
        } catch (error) {
          console.warn(`[VectorStore] Failed to add gem to HNSW: ${gem.id}`, error.message);
          // Continue without HNSW - will use brute-force search as fallback
        }
      }

    } catch (error) {
      if (error.code === 'CONFLICT') {
        console.warn(`[VectorStore] Gem ${gem.id} already exists, updating...`);
        await this.update(gem.id, gem);
      } else {
        throw error;
      }
    }
  }

  /**
   * Update a gem
   * @param {string} id - Gem ID
   * @param {Object} updates - Fields to update
   */
  async update(id, updates) {
    const doc = await this.collection.findOne(id).exec();

    if (!doc) {
      throw new Error(`[VectorStore] Gem ${id} not found`);
    }

    // Check if data has actually changed
    const hasChanged = this._hasGemChanged(doc, updates);

    if (!hasChanged) {
      return;
    }

    await doc.update({
      $set: updates
    });

    // If vector was updated, update HNSW index
    if (updates.vector && this.indexReady) {
      try {
        // HNSW doesn't have remove(), just overwrite by adding again
        // First delete from internal maps to avoid duplicates
        if (this.hnswIndex.vectors.has(id)) {
          this.hnswIndex.vectors.delete(id);
          this.hnswIndex.layers.delete(id);
          this.hnswIndex.graph.delete(id);
        }

        // Now add the updated vector
        this.hnswIndex.add(id, updates.vector);
        await this._saveHNSW();
      } catch (error) {
        console.warn(`[VectorStore] Failed to update HNSW index for ${id}:`, error.message);
      }
    }

  }

  /**
   * Check if gem data has changed
   * @param {Object} existingDoc - Existing RxDB document
   * @param {Object} updates - New data
   * @returns {boolean} True if data has changed
   */
  _hasGemChanged(existingDoc, updates) {
    // Compare important fields (including vector for re-enrichment detection)
    const fieldsToCompare = ['value', 'collections', 'state', 'topic', 'isPrimary', 'parentGem', 'vector'];

    for (const field of fieldsToCompare) {
      const existingValue = existingDoc[field];
      const newValue = updates[field];

      // Skip if field not in updates
      if (!(field in updates)) continue;

      // Handle arrays (collections, vector)
      if (Array.isArray(existingValue) && Array.isArray(newValue)) {
        // For vectors, check if one exists and the other doesn't
        if (field === 'vector') {
          // If existing has no vector but new does, that's a change
          if (!existingValue || existingValue.length === 0) {
            if (newValue && newValue.length > 0) return true;
          }
          // If existing has vector but new doesn't, that's a change
          else if (!newValue || newValue.length === 0) {
            return true;
          }
          // If both have vectors, check if dimensions differ (384 -> 768 migration)
          else if (existingValue.length !== newValue.length) {
            return true;
          }
          // If same dimension, check if values differ significantly
          // (use threshold to avoid detecting tiny floating point differences)
          else {
            for (let i = 0; i < existingValue.length; i++) {
              if (Math.abs(existingValue[i] - newValue[i]) > 0.0001) {
                return true;
              }
            }
          }
          continue;
        }

        // For other arrays (collections)
        if (existingValue.length !== newValue.length) return true;
        const sortedExisting = [...existingValue].sort();
        const sortedNew = [...newValue].sort();
        if (JSON.stringify(sortedExisting) !== JSON.stringify(sortedNew)) return true;
        continue;
      }

      // Handle simple values
      if (existingValue !== newValue) {
        return true;
      }
    }

    // No changes detected
    return false;
  }

  /**
   * Delete a gem
   * @param {string} id - Gem ID
   */
  async delete(id) {
    const doc = await this.collection.findOne(id).exec();

    if (!doc) {
      console.warn(`[VectorStore] Gem ${id} not found for deletion`);
      return;
    }

    await doc.remove();

    // Remove from HNSW index
    if (this.indexReady) {
      try {
        // HNSW doesn't have remove(), manually delete from internal maps
        if (this.hnswIndex.vectors.has(id)) {
          this.hnswIndex.vectors.delete(id);
          this.hnswIndex.layers.delete(id);
          this.hnswIndex.graph.delete(id);

          // If this was the entry point, reset it
          if (this.hnswIndex.entryPoint === id) {
            this.hnswIndex.entryPoint = null;
          }
        }

        await this._saveHNSW();
      } catch (error) {
        console.warn(`[VectorStore] Failed to remove from HNSW index: ${id}`, error.message);
      }
    }

  }

  /**
   * Bulk insert gems
   * @param {Array<Object>} gems - Array of gem objects
   */
  async bulkInsert(gems) {

    const results = await this.collection.bulkInsert(gems);

    return results;
  }

  /**
   * Dense vector search with HNSW ANN (fast approximate search)
   * Falls back to brute-force if HNSW unavailable or filters require it
   * @param {number[]} queryVector - Query embedding
   * @param {Object} filters - Filter criteria
   * @param {number} limit - Max results
   * @returns {Promise<Array>} Sorted search results
   */
  async denseSearch(queryVector, filters = {}, limit = 20) {
    const startTime = performance.now();

    // Determine if we can use HNSW or need brute-force
    const hasFilters = (filters.collections?.length > 0) ||
                       filters.dateRange;

    const useHNSW = this.useANN && this.indexReady && !hasFilters;

    if (useHNSW) {
      return await this._denseSearchHNSW(queryVector, filters, limit, startTime);
    } else {
      return await this._denseSearchBruteForce(queryVector, filters, limit, startTime);
    }
  }

  /**
   * Fast HNSW-based search (no filters)
   */
  async _denseSearchHNSW(queryVector, filters, limit, startTime) {
    // Search HNSW index for approximate nearest neighbors
    // Request more candidates to account for deduplication
    const searchK = Math.max(limit * 3, 100);
    const hnswResults = this.hnswIndex.search(queryVector, searchK);


    // Fetch full gems from database for the HNSW results
    const gemPromises = hnswResults.map(async (result) => {
      const doc = await this.collection.findOne(result.id).exec();
      if (!doc) return null;

      const gem = doc.toJSON();
      return {
        id: gem.id,
        score: result.similarity,
        gem,
        isPrimary: gem.isPrimary || false,
        isVirtual: gem.isVirtual || false,
        parentGem: gem.parentGem || null,
        source: 'dense-hnsw'
      };
    });

    const results = (await Promise.all(gemPromises)).filter(r => r !== null);

    // Apply minimum similarity threshold (0.5) - standard for RAG
    // 0.5 = somewhat related (good balance), 0.7 = highly related
    const MIN_SIMILARITY_THRESHOLD = 0.5;
    const filteredResults = results.filter(r => r.score >= MIN_SIMILARITY_THRESHOLD);

    if (filteredResults.length === 0 && results.length > 0) {
      console.warn('[VectorStore] All HNSW results below similarity threshold:', {
        totalResults: results.length,
        threshold: MIN_SIMILARITY_THRESHOLD,
        topScore: results[0]?.score.toFixed(3)
      });
    }

    filteredResults.slice(0, 5).forEach((r, i) => {
      const type = r.isPrimary ? 'PRIMARY' : (r.isVirtual ? 'CHILD' : 'SINGLE');
      console.log(`  ${i + 1}. ${r.gem.value.substring(0, 40)}... (${r.score.toFixed(3)}, ${type})`);
    });

    // Deduplicate
    const deduplicated = await this.deduplicateGemResults(filteredResults);

    return deduplicated.slice(0, limit);
  }

  /**
   * Brute-force search (used when filters applied or HNSW unavailable)
   */
  async _denseSearchBruteForce(queryVector, filters, limit, startTime) {
    // Build query with filters
    let query = this.collection.find({
      selector: {
        vector: { $exists: true }
      }
    });

    // Apply collection filter
    if (filters.collections && filters.collections.length > 0) {
      query = query.where('collections').in(filters.collections);
    }

    // Apply date range filter
    if (filters.dateRange) {
      query = query.where('timestamp').gte(filters.dateRange.from);
      if (filters.dateRange.to) {
        query = query.where('timestamp').lte(filters.dateRange.to);
      }
    }

    // Execute query
    const docs = await query.exec();


    // Calculate similarity scores for ALL gems
    const results = docs.map(doc => {
      const gem = doc.toJSON();
      const score = cosineSimilarity(queryVector, gem.vector);

      return {
        id: gem.id,
        score,
        gem,
        isPrimary: gem.isPrimary || false,
        isVirtual: gem.isVirtual || false,
        parentGem: gem.parentGem || null,
        source: 'dense-bruteforce'
      };
    });

    // Sort by score (descending)
    const sorted = results.sort((a, b) => b.score - a.score);

    sorted.slice(0, 5).forEach((r, i) => {
      const type = r.isPrimary ? 'PRIMARY' : (r.isVirtual ? 'CHILD' : 'SINGLE');
      console.log(`  ${i + 1}. ${r.gem.value.substring(0, 40)}... (${r.score.toFixed(3)}, ${type})`);
    });

    // Deduplicate
    const deduplicated = await this.deduplicateGemResults(sorted);

    return deduplicated.slice(0, limit);
  }

  /**
   * Deduplicate search results: Merge primary and child gems
   * Returns only primary gems, using child's score if better
   * @param {Array} results - Search results with score, gem, isPrimary, isVirtual, parentGem
   * @returns {Promise<Array>} Deduplicated results
   */
  async deduplicateGemResults(results) {
    const gemMap = new Map();  // primaryGemId -> best result

    for (const result of results) {
      if (result.isPrimary) {
        // ═══════════════════════════════════════════════
        // PRIMARY GEM
        // ═══════════════════════════════════════════════
        const primaryId = result.id;

        if (!gemMap.has(primaryId)) {
          gemMap.set(primaryId, {
            gem: result.gem,
            score: result.score,
            matchSource: 'primary',  // Matched via primary gem
            matchedAttribute: null,
            matchedSubTopic: null,
            source: result.source
          });
        } else {
          // Primary already in map (via child) → update if primary scores better
          const existing = gemMap.get(primaryId);
          if (result.score > existing.score) {
            existing.score = result.score;
            existing.matchSource = 'primary';
            existing.matchedAttribute = null;
            existing.matchedSubTopic = null;
          }
        }

      } else if (result.isVirtual) {
        // ═══════════════════════════════════════════════
        // CHILD GEM (Virtual)
        // ═══════════════════════════════════════════════
        const parentId = result.parentGem;

        if (!parentId) {
          console.warn('[VectorStore] Child gem has no parentGem:', result.id);
          continue;
        }

        if (!gemMap.has(parentId)) {
          // Parent not seen yet → fetch parent and add with child's score
          const parentGem = await this.getGem(parentId);

          if (!parentGem) {
            console.warn('[VectorStore] Parent gem not found:', parentId);
            continue;
          }

          gemMap.set(parentId, {
            gem: parentGem,
            score: result.score,  // ✅ Use Child's Score!
            matchSource: 'child',
            matchedAttribute: result.gem.attribute || null,
            matchedSubTopic: result.gem.subTopic || null,
            source: result.source
          });
        } else {
          // Parent already in map → update if child scores better
          const existing = gemMap.get(parentId);
          if (result.score > existing.score) {
            existing.score = result.score;
            existing.matchSource = 'child';
            existing.matchedAttribute = result.gem.attribute || null;
            existing.matchedSubTopic = result.gem.subTopic || null;
          }
        }

      } else {
        // ═══════════════════════════════════════════════
        // REGULAR GEM (neither primary nor child)
        // ═══════════════════════════════════════════════
        const gemId = result.id;

        if (!gemMap.has(gemId)) {
          gemMap.set(gemId, {
            gem: result.gem,
            score: result.score,
            matchSource: 'single',
            matchedAttribute: null,
            matchedSubTopic: null,
            source: result.source
          });
        }
      }
    }

    // Convert map to array and sort by score
    const deduplicated = Array.from(gemMap.values())
      .sort((a, b) => b.score - a.score)
      .map(item => ({
        id: item.gem.id,
        score: item.score,
        gem: item.gem,
        source: item.source,
        matchSource: item.matchSource,  // 'primary', 'child', or 'single'
        matchedAttribute: item.matchedAttribute,
        matchedSubTopic: item.matchedSubTopic
      }));

    deduplicated.slice(0, 3).forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.gem.value.substring(0, 40)}... (${r.score.toFixed(3)})`);
    });

    return deduplicated;
  }

  /**
   * Get all gems
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>}
   */
  async getAllGems(filters = {}) {
    // Build selector
    const selector = {};

    if (filters.isPrimary !== undefined) {
      selector.isPrimary = filters.isPrimary;
    }

    if (filters.collections && filters.collections.length > 0) {
      selector.collections = { $in: filters.collections };
    }

    // Build query
    let query = this.collection.find({
      selector: Object.keys(selector).length > 0 ? selector : {}
    });

    const docs = await query.exec();
    return docs.map(doc => doc.toJSON());
  }

  /**
   * Count gems
   * @param {Object} filters - Optional filters
   * @returns {Promise<number>}
   */
  async countGems(filters = {}) {
    let query = this.collection.count();

    if (filters.collections && filters.collections.length > 0) {
      query = query.where('collections').in(filters.collections);
    }

    return await query.exec();
  }

  /**
   * Get a single gem by ID
   * @param {string} id - Gem ID
   * @returns {Promise<Object|null>}
   */
  async getGem(id) {
    const doc = await this.collection.findOne(id).exec();
    return doc ? doc.toJSON() : null;
  }

  /**
   * Rebuild HNSW index from all vectors in database
   */
  async rebuildIndex() {
    await this._buildHNSW();
  }

  /**
   * Get HNSW index statistics
   */
  getIndexStats() {
    if (!this.indexReady || !this.hnswIndex) {
      return { ready: false };
    }

    return {
      ready: true,
      ...this.hnswIndex.getStats()
    };
  }
}

/**
 * Singleton instance
 */
let vectorStoreInstance = null;

/**
 * Get or create VectorStore instance
 * @returns {Promise<VectorStore>}
 */
export async function getVectorStore() {
  if (!vectorStoreInstance) {
    vectorStoreInstance = new VectorStore();
    await vectorStoreInstance.init();
  }
  return vectorStoreInstance;
}

/**
 * Export cosine similarity for use in MMR
 */
export { cosineSimilarity };
