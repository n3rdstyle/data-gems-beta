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
   * Insert a gem with vector
   * @param {Object} gem - Gem object with vector field
   */
  async insert(gem) {
    if (!gem.vector || gem.vector.length !== 384) {
      throw new Error('[VectorStore] Gem must have 384-dim vector');
    }

    try {
      await this.collection.insert(gem);
      console.log(`[VectorStore] Inserted gem: ${gem.id}`);
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
   * Dense vector search (cosine similarity)
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
        vector: { $exists: true }  // Only gems with vectors
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

    console.log(`[VectorStore] Found ${docs.length} candidates with vectors`);

    // Calculate similarity scores
    const results = docs.map(doc => {
      const gem = doc.toJSON();
      const score = cosineSimilarity(queryVector, gem.vector);

      return {
        id: gem.id,
        score,
        gem,
        source: 'dense'
      };
    });

    // Sort by score (descending) and limit
    const sorted = results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    console.log(`[VectorStore] Dense search complete:`, {
      candidates: docs.length,
      returned: sorted.length,
      topScore: sorted[0]?.score.toFixed(3)
    });

    return sorted;
  }

  /**
   * Get all gems
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>}
   */
  async getAllGems(filters = {}) {
    let query = this.collection.find();

    if (filters.collections && filters.collections.length > 0) {
      query = query.where('collections').in(filters.collections);
    }

    if (filters.semanticTypes && filters.semanticTypes.length > 0) {
      query = query.where('semanticType').in(filters.semanticTypes);
    }

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
