/**
 * Vector Store
 * Context Engine v2 - Dense Vector Search (RxDB-based)
 *
 * Implements dense vector search using cosine similarity
 */

import { getGemsCollection } from './database.js';

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
 * Wraps RxDB collection with vector search capabilities
 */
export class VectorStore {
  constructor() {
    this.collection = null;
  }

  /**
   * Initialize vector store
   */
  async init() {
    this.collection = getGemsCollection();

    if (!this.collection) {
      throw new Error('[VectorStore] Database not initialized');
    }

    console.log('[VectorStore] Initialized successfully');
    return this;
  }

  /**
   * Insert a gem (vector field is optional)
   * @param {Object} gem - Gem object (vector field optional)
   */
  async insert(gem) {
    // Validate vector if present
    if (gem.vector && gem.vector.length !== 384) {
      console.warn(`[VectorStore] Gem ${gem.id} has invalid vector (length: ${gem.vector.length}), removing it`);
      delete gem.vector;
    }

    // Vector is optional - gems without vectors won't be searchable via dense search
    if (!gem.vector) {
      console.log(`[VectorStore] Inserting gem without vector: ${gem.id}`);
    }

    try {
      await this.collection.insert(gem);
      console.log(`[VectorStore] Inserted gem: ${gem.id}${gem.vector ? ' (with vector)' : ' (no vector)'}`);
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

    await doc.update({
      $set: updates
    });

    console.log(`[VectorStore] Updated gem: ${id}`);
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
    console.log(`[VectorStore] Deleted gem: ${id}`);
  }

  /**
   * Bulk insert gems
   * @param {Array<Object>} gems - Array of gem objects
   */
  async bulkInsert(gems) {
    console.log(`[VectorStore] Bulk inserting ${gems.length} gems...`);

    const results = await this.collection.bulkInsert(gems);

    console.log(`[VectorStore] Bulk insert complete:`, {
      success: results.success.length,
      error: results.error.length
    });

    return results;
  }

  /**
   * Dense vector search (cosine similarity) with deduplication
   * @param {number[]} queryVector - Query embedding (384-dim)
   * @param {Object} filters - Filter criteria
   * @param {number} limit - Max results
   * @returns {Promise<Array>} Sorted search results
   */
  async denseSearch(queryVector, filters = {}, limit = 20) {
    console.log('[VectorStore] Dense search started', {
      vectorDim: queryVector.length,
      filters,
      limit
    });

    // Build query with filters
    let query = this.collection.find({
      selector: {
        vector: { $exists: true }  // Only gems with vectors (both primary and child)
      }
    });

    // Apply collection filter
    if (filters.collections && filters.collections.length > 0) {
      query = query.where('collections').in(filters.collections);
    }

    // Apply semantic type filter
    if (filters.semanticTypes && filters.semanticTypes.length > 0) {
      query = query.where('semanticType').in(filters.semanticTypes);
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

    console.log(`[VectorStore] Found ${docs.length} candidates (primary + child gems)`);

    // Calculate similarity scores for ALL gems (primary and child)
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
        source: 'dense'
      };
    });

    // Sort by score (descending)
    const sorted = results.sort((a, b) => b.score - a.score);

    console.log('[VectorStore] Top 5 raw matches before deduplication:');
    sorted.slice(0, 5).forEach((r, i) => {
      const type = r.isPrimary ? 'PRIMARY' : (r.isVirtual ? 'CHILD' : 'SINGLE');
      console.log(`  ${i + 1}. ${r.gem.value.substring(0, 40)}... (${r.score.toFixed(3)}, ${type})`);
    });

    // Deduplicate: Merge primary and child gems
    const deduplicated = await this.deduplicateGemResults(sorted);

    console.log(`[VectorStore] Dense search complete:`, {
      candidates: docs.length,
      afterDeduplication: deduplicated.length,
      returned: Math.min(deduplicated.length, limit),
      topScore: deduplicated[0]?.score.toFixed(3)
    });

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

    console.log('[VectorStore] Deduplication summary:');
    deduplicated.slice(0, 3).forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.gem.value.substring(0, 40)}... (${r.score.toFixed(3)})`);
      console.log(`     Source: ${r.matchSource}${r.matchedSubTopic ? `, matched "${r.matchedSubTopic}"` : ''}`);
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

    if (filters.semanticTypes && filters.semanticTypes.length > 0) {
      selector.semanticType = { $in: filters.semanticTypes };
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
   * Rebuild index (placeholder for future optimization)
   */
  async rebuildIndex() {
    console.log('[VectorStore] Index rebuild requested');
    // RxDB handles indexing automatically
    // This is a placeholder for future optimizations
    console.log('[VectorStore] Index rebuild complete');
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
