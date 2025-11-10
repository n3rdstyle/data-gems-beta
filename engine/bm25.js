/**
 * BM25 Sparse Keyword Search
 * Context Engine v2 - Sparse Search Component
 *
 * Implements BM25 (Best Matching 25) algorithm for keyword-based search
 * with TF-IDF scoring and length normalization
 */

import { getGemsCollection } from './database.js';

/**
 * BM25 Parameters (tuned for short user preference texts)
 */
const BM25_K1 = 1.5;  // Term frequency saturation (1.2-2.0 typical)
const BM25_B = 0.75;   // Length normalization (0.0 = no normalization, 1.0 = full)

/**
 * Stopwords for German and English (common words to ignore)
 */
const STOPWORDS = new Set([
  // German
  'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einer', 'eines', 'einem',
  'und', 'oder', 'aber', 'doch', 'sondern', 'denn', 'wenn', 'als', 'wie', 'bei',
  'von', 'zu', 'aus', 'mit', 'nach', 'vor', 'über', 'unter', 'zwischen',
  'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'mein', 'dein', 'sein',
  'ist', 'sind', 'war', 'waren', 'hat', 'haben', 'wird', 'werden',
  // English
  'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'else', 'when',
  'at', 'by', 'for', 'with', 'about', 'as', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did'
]);

/**
 * Tokenize and normalize text
 * @param {string} text - Text to tokenize
 * @returns {string[]} Array of normalized tokens
 */
function tokenize(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  return text
    .toLowerCase()
    .replace(/[^\w\säöüß]/g, ' ')  // Keep German umlauts
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOPWORDS.has(token));
}

/**
 * Calculate term frequency for a document
 * @param {string[]} tokens - Document tokens
 * @returns {Object} Term frequency map { word: count }
 */
function calculateTermFrequency(tokens) {
  const tf = {};

  for (const token of tokens) {
    tf[token] = (tf[token] || 0) + 1;
  }

  return tf;
}

/**
 * BM25 Search Engine
 */
export class BM25 {
  constructor() {
    this.collection = null;
    this.stats = {
      totalDocs: 0,
      avgDocLength: 0,
      docFrequencies: {},  // { term: number of docs containing term }
      lastUpdate: null
    };
  }

  /**
   * Initialize BM25 engine
   */
  async init() {
    this.collection = getGemsCollection();

    if (!this.collection) {
      throw new Error('[BM25] Database not initialized');
    }

    console.log('[BM25] Initializing...');
    await this.buildIndex();
    console.log('[BM25] Initialized successfully');

    return this;
  }

  /**
   * Build index statistics from existing gems
   * Calculates document frequencies and average document length
   */
  async buildIndex() {
    console.log('[BM25] Building index...');

    const docs = await this.collection.find().exec();
    const docLengths = [];
    const termDocCounts = {};  // { term: Set of doc IDs }

    for (const doc of docs) {
      const gem = doc.toJSON();
      const tokens = tokenize(gem.value);

      docLengths.push(tokens.length);

      // Track which documents contain each term
      const uniqueTerms = new Set(tokens);
      for (const term of uniqueTerms) {
        if (!termDocCounts[term]) {
          termDocCounts[term] = new Set();
        }
        termDocCounts[term].add(gem.id);
      }
    }

    // Calculate statistics
    this.stats.totalDocs = docs.length;
    this.stats.avgDocLength = docLengths.length > 0
      ? docLengths.reduce((sum, len) => sum + len, 0) / docLengths.length
      : 0;

    // Convert Sets to counts
    this.stats.docFrequencies = {};
    for (const [term, docSet] of Object.entries(termDocCounts)) {
      this.stats.docFrequencies[term] = docSet.size;
    }

    this.stats.lastUpdate = Date.now();

    console.log('[BM25] Index built:', {
      totalDocs: this.stats.totalDocs,
      avgDocLength: this.stats.avgDocLength.toFixed(1),
      uniqueTerms: Object.keys(this.stats.docFrequencies).length,
      lastUpdate: new Date(this.stats.lastUpdate).toISOString()
    });
  }

  /**
   * Calculate IDF (Inverse Document Frequency) for a term
   * @param {string} term - Search term
   * @returns {number} IDF score
   */
  calculateIDF(term) {
    const df = this.stats.docFrequencies[term] || 0;
    const N = this.stats.totalDocs;

    // BM25 IDF formula: log((N - df + 0.5) / (df + 0.5))
    // Add +1 to avoid log(0) for unknown terms
    return Math.log((N - df + 0.5) / (df + 0.5) + 1);
  }

  /**
   * Calculate BM25 score for a document
   * @param {string[]} queryTokens - Tokenized query
   * @param {Object} gem - Gem document
   * @returns {number} BM25 score
   */
  calculateScore(queryTokens, gem) {
    const docTokens = tokenize(gem.value);
    const docLength = docTokens.length;
    const termFreq = calculateTermFrequency(docTokens);

    let score = 0;

    for (const term of queryTokens) {
      const tf = termFreq[term] || 0;

      if (tf === 0) {
        continue;  // Term not in document
      }

      const idf = this.calculateIDF(term);

      // BM25 formula: IDF * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * dl / avgdl))
      const numerator = tf * (BM25_K1 + 1);
      const denominator = tf + BM25_K1 * (
        1 - BM25_B + BM25_B * (docLength / this.stats.avgDocLength)
      );

      score += idf * (numerator / denominator);
    }

    return score;
  }

  /**
   * Sparse keyword search using BM25
   * @param {string} query - Search query
   * @param {Object} filters - Filter criteria
   * @param {number} limit - Max results
   * @returns {Promise<Array>} Sorted search results
   */
  async sparseSearch(query, filters = {}, limit = 20) {
    console.log('[BM25] Sparse search started:', { query, filters, limit });

    // Rebuild index if stale (older than 5 minutes)
    if (!this.stats.lastUpdate || Date.now() - this.stats.lastUpdate > 5 * 60 * 1000) {
      console.log('[BM25] Index stale, rebuilding...');
      await this.buildIndex();
    }

    // Tokenize query
    const queryTokens = tokenize(query);

    if (queryTokens.length === 0) {
      console.warn('[BM25] No valid query tokens');
      return [];
    }

    console.log('[BM25] Query tokens:', queryTokens);

    // Build filtered query
    let rxQuery = this.collection.find();

    // Apply collection filter
    if (filters.collections && filters.collections.length > 0) {
      rxQuery = rxQuery.where('collections').in(filters.collections);
    }

    // Apply semantic type filter
    if (filters.semanticTypes && filters.semanticTypes.length > 0) {
      rxQuery = rxQuery.where('semanticType').in(filters.semanticTypes);
    }

    // Apply date range filter
    if (filters.dateRange) {
      rxQuery = rxQuery.where('timestamp').gte(filters.dateRange.from);
      if (filters.dateRange.to) {
        rxQuery = rxQuery.where('timestamp').lte(filters.dateRange.to);
      }
    }

    // Execute query
    const docs = await rxQuery.exec();

    console.log(`[BM25] Found ${docs.length} candidates`);

    // Calculate BM25 scores
    const results = docs
      .map(doc => {
        const gem = doc.toJSON();
        const score = this.calculateScore(queryTokens, gem);

        return {
          id: gem.id,
          score,
          gem,
          source: 'sparse'
        };
      })
      .filter(result => result.score > 0);  // Only include matches

    // Sort by score (descending) and limit
    const sorted = results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    console.log(`[BM25] Sparse search complete:`, {
      candidates: docs.length,
      matches: results.length,
      returned: sorted.length,
      topScore: sorted[0]?.score.toFixed(3)
    });

    return sorted;
  }

  /**
   * Update index incrementally (when a gem is added/updated)
   * @param {Object} gem - Gem that was added/updated
   */
  async updateIndex(gem) {
    const tokens = tokenize(gem.value);
    const uniqueTerms = new Set(tokens);

    // Update document frequencies
    for (const term of uniqueTerms) {
      this.stats.docFrequencies[term] = (this.stats.docFrequencies[term] || 0) + 1;
    }

    // Update average document length (incremental)
    const oldTotal = this.stats.totalDocs * this.stats.avgDocLength;
    this.stats.totalDocs += 1;
    this.stats.avgDocLength = (oldTotal + tokens.length) / this.stats.totalDocs;

    console.log(`[BM25] Index updated for gem: ${gem.id}`);
  }

  /**
   * Remove gem from index
   * @param {Object} gem - Gem that was removed
   */
  async removeFromIndex(gem) {
    const tokens = tokenize(gem.value);
    const uniqueTerms = new Set(tokens);

    // Update document frequencies
    for (const term of uniqueTerms) {
      if (this.stats.docFrequencies[term]) {
        this.stats.docFrequencies[term] -= 1;

        if (this.stats.docFrequencies[term] <= 0) {
          delete this.stats.docFrequencies[term];
        }
      }
    }

    // Update average document length
    if (this.stats.totalDocs > 1) {
      const oldTotal = this.stats.totalDocs * this.stats.avgDocLength;
      this.stats.totalDocs -= 1;
      this.stats.avgDocLength = (oldTotal - tokens.length) / this.stats.totalDocs;
    } else {
      this.stats.totalDocs = 0;
      this.stats.avgDocLength = 0;
    }

    console.log(`[BM25] Removed gem from index: ${gem.id}`);
  }

  /**
   * Get index statistics
   * @returns {Object} Index stats
   */
  getStats() {
    return {
      totalDocs: this.stats.totalDocs,
      avgDocLength: this.stats.avgDocLength,
      uniqueTerms: Object.keys(this.stats.docFrequencies).length,
      lastUpdate: this.stats.lastUpdate
    };
  }
}

/**
 * Singleton instance
 */
let bm25Instance = null;

/**
 * Get or create BM25 instance
 * @returns {Promise<BM25>}
 */
export async function getBM25() {
  if (!bm25Instance) {
    bm25Instance = new BM25();
    await bm25Instance.init();
  }
  return bm25Instance;
}

/**
 * Export tokenize for use in keyword extraction
 */
export { tokenize };
