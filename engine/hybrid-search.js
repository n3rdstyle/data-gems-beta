/**
 * Hybrid Search Engine
 * Context Engine v2 - Dense + Sparse Fusion
 *
 * Combines vector search (dense) and BM25 (sparse) using:
 * - Reciprocal Rank Fusion (RRF) for score merging
 * - Maximal Marginal Relevance (MMR) for diversity
 */

import { getVectorStore, cosineSimilarity } from './vector-store.js';
import { getBM25 } from './bm25.js';

/**
 * RRF Parameters
 */
const RRF_K = 60;  // Constant for rank normalization (60 is typical)

/**
 * MMR Parameters
 */
const MMR_LAMBDA = 0.7;  // Balance: 0.7 = 70% relevance, 30% diversity

/**
 * Reciprocal Rank Fusion (RRF)
 * Combines multiple ranked result lists into a single ranking
 *
 * Formula: RRF_score(d) = Σ 1 / (k + rank_i(d))
 *
 * @param {Array<Array>} rankedLists - Array of result lists, each with id and score
 * @param {number} k - RRF constant (default: 60)
 * @returns {Array} Merged results with RRF scores
 */
function reciprocalRankFusion(rankedLists, k = RRF_K) {
  const rrfScores = {};  // { id: score }
  const gemData = {};    // { id: gem object }

  // Process each ranked list
  for (const results of rankedLists) {
    results.forEach((result, rank) => {
      const { id, gem } = result;

      // RRF formula: 1 / (k + rank)
      // Rank starts at 0, so we add 1
      const rrfScore = 1 / (k + rank + 1);

      // Accumulate scores
      rrfScores[id] = (rrfScores[id] || 0) + rrfScore;

      // Store gem data
      if (!gemData[id]) {
        gemData[id] = gem;
      }
    });
  }

  // Convert to array and sort by RRF score
  return Object.entries(rrfScores)
    .map(([id, score]) => ({
      id,
      score,
      gem: gemData[id]
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Maximal Marginal Relevance (MMR)
 * Re-ranks results to maximize both relevance and diversity
 *
 * Formula: MMR = argmax[λ * Sim(Di, Q) - (1-λ) * max(Sim(Di, Dj))]
 *
 * Where:
 * - λ (lambda) balances relevance vs diversity (0.7 = 70% relevance, 30% diversity)
 * - Sim(Di, Q) is similarity to query (relevance)
 * - max(Sim(Di, Dj)) is max similarity to already selected docs (redundancy)
 *
 * @param {Array} results - Search results with scores and vectors
 * @param {number[]} queryVector - Query embedding (384-dim)
 * @param {number} limit - Number of results to return
 * @param {number} lambda - Relevance vs diversity balance (0-1)
 * @returns {Array} Re-ranked results with diversity
 */
function maximalMarginalRelevance(results, queryVector, limit, lambda = MMR_LAMBDA) {
  if (!queryVector || results.length === 0) {
    return results.slice(0, limit);
  }

  const selected = [];
  const remaining = [...results];

  // Select first result (highest relevance)
  selected.push(remaining.shift());

  // Iteratively select remaining results
  while (selected.length < limit && remaining.length > 0) {
    let maxScore = -Infinity;
    let maxIndex = -1;

    // Find best candidate balancing relevance and diversity
    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];

      // Skip if no vector available
      if (!candidate.gem.vector) {
        continue;
      }

      // Relevance: similarity to query
      const relevance = cosineSimilarity(candidate.gem.vector, queryVector);

      // Redundancy: max similarity to already selected docs
      let maxSimilarity = 0;
      for (const selectedDoc of selected) {
        if (selectedDoc.gem.vector) {
          const similarity = cosineSimilarity(candidate.gem.vector, selectedDoc.gem.vector);
          maxSimilarity = Math.max(maxSimilarity, similarity);
        }
      }

      // MMR score: balance relevance and diversity
      const mmrScore = lambda * relevance - (1 - lambda) * maxSimilarity;

      if (mmrScore > maxScore) {
        maxScore = mmrScore;
        maxIndex = i;
      }
    }

    // Select best candidate
    if (maxIndex >= 0) {
      selected.push(remaining.splice(maxIndex, 1)[0]);
    } else {
      // No more candidates with vectors, add remaining without MMR
      selected.push(...remaining.splice(0, limit - selected.length));
      break;
    }
  }

  return selected;
}

/**
 * Hybrid Search Engine
 * Combines dense vector search and sparse BM25 search
 */
export class HybridSearch {
  constructor() {
    this.vectorStore = null;
    this.bm25 = null;
  }

  /**
   * Initialize hybrid search engine
   */
  async init() {
    console.log('[HybridSearch] Initializing...');

    this.vectorStore = await getVectorStore();
    this.bm25 = await getBM25();

    console.log('[HybridSearch] Initialized successfully');
    return this;
  }

  /**
   * Hybrid search combining dense + sparse
   *
   * @param {Object} params - Search parameters
   * @param {string} params.query - Search query text
   * @param {number[]} params.queryVector - Query embedding (384-dim)
   * @param {Object} params.filters - Filter criteria (collections, semanticTypes, dateRange)
   * @param {number} params.limit - Max results to return
   * @param {boolean} params.useDiversity - Apply MMR diversity filter
   * @param {Object} params.weights - Search weights { dense: 0.7, sparse: 0.3 }
   * @returns {Promise<Array>} Hybrid search results
   */
  async search({
    query,
    queryVector,
    filters = {},
    limit = 10,
    useDiversity = true,
    weights = { dense: 0.7, sparse: 0.3 }
  }) {
    console.log('[HybridSearch] Starting hybrid search:', {
      query,
      hasVector: !!queryVector,
      filters,
      limit,
      useDiversity
    });

    const rankedLists = [];

    // Dense search (if vector available)
    if (queryVector && queryVector.length === 384) {
      console.log('[HybridSearch] Running dense search...');
      const denseResults = await this.vectorStore.denseSearch(
        queryVector,
        filters,
        limit * 2  // Fetch more for RRF
      );
      rankedLists.push(denseResults);
      console.log(`[HybridSearch] Dense: ${denseResults.length} results`);
    } else {
      console.warn('[HybridSearch] No query vector, skipping dense search');
    }

    // Sparse search (always run for keyword matching)
    console.log('[HybridSearch] Running sparse search...');
    const sparseResults = await this.bm25.sparseSearch(
      query,
      filters,
      limit * 2  // Fetch more for RRF
    );
    rankedLists.push(sparseResults);
    console.log(`[HybridSearch] Sparse: ${sparseResults.length} results`);

    // If no results from either search
    if (rankedLists.every(list => list.length === 0)) {
      console.warn('[HybridSearch] No results from any search method');
      return [];
    }

    // Combine using Reciprocal Rank Fusion
    console.log('[HybridSearch] Applying RRF fusion...');
    let fusedResults = reciprocalRankFusion(rankedLists);

    console.log(`[HybridSearch] RRF: ${fusedResults.length} unique results`);

    // Apply MMR diversity filter if requested
    if (useDiversity && queryVector) {
      console.log('[HybridSearch] Applying MMR diversity filter...');
      fusedResults = maximalMarginalRelevance(fusedResults, queryVector, limit);
      console.log(`[HybridSearch] MMR: ${fusedResults.length} diverse results`);
    } else {
      fusedResults = fusedResults.slice(0, limit);
    }

    console.log('[HybridSearch] Hybrid search complete:', {
      returned: fusedResults.length,
      topScore: fusedResults[0]?.score.toFixed(4)
    });

    return fusedResults;
  }

  /**
   * Dense-only search (faster, no keyword matching)
   * @param {number[]} queryVector - Query embedding
   * @param {Object} filters - Filter criteria
   * @param {number} limit - Max results
   * @returns {Promise<Array>}
   */
  async denseSearch(queryVector, filters = {}, limit = 10) {
    console.log('[HybridSearch] Dense-only search');
    return this.vectorStore.denseSearch(queryVector, filters, limit);
  }

  /**
   * Sparse-only search (faster, no embeddings needed)
   * @param {string} query - Search query
   * @param {Object} filters - Filter criteria
   * @param {number} limit - Max results
   * @returns {Promise<Array>}
   */
  async sparseSearch(query, filters = {}, limit = 10) {
    console.log('[HybridSearch] Sparse-only search');
    return this.bm25.sparseSearch(query, filters, limit);
  }

  /**
   * Get search engine statistics
   * @returns {Object}
   */
  getStats() {
    return {
      vectorStore: this.vectorStore ? 'ready' : 'not initialized',
      bm25: this.bm25 ? this.bm25.getStats() : null
    };
  }
}

/**
 * Singleton instance
 */
let hybridSearchInstance = null;

/**
 * Get or create HybridSearch instance
 * @returns {Promise<HybridSearch>}
 */
export async function getHybridSearch() {
  if (!hybridSearchInstance) {
    hybridSearchInstance = new HybridSearch();
    await hybridSearchInstance.init();
  }
  return hybridSearchInstance;
}

/**
 * Export RRF and MMR for testing/external use
 */
export { reciprocalRankFusion, maximalMarginalRelevance };
