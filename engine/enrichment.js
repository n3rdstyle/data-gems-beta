/**
 * Gem Enrichment Module
 * Context Engine v2 - Auto-Enrichment with Gemini Nano
 *
 * Enriches gems with:
 * - 384-dim vector embeddings (Gemini Nano Embedder)
 * - Semantic type classification (Gemini Nano LanguageModel)
 * - Keywords for BM25 sparse search
 */

import { tokenize } from './bm25.js';

/**
 * Semantic type classification prompt
 */
const SEMANTIC_TYPE_SYSTEM_PROMPT = `You are a semantic classifier for user preferences and data.

Your task is to classify user data into ONE of these semantic types:

1. **constraint** - Hard filters, must-have requirements
   Examples: Budget limits, dietary restrictions, size requirements, time constraints
   Keywords: max, min, must, only, never, required, limit

2. **preference** - Soft rankings, likes/dislikes, favorites
   Examples: Favorite colors, preferred brands, cuisine preferences, style preferences
   Keywords: prefer, like, favorite, love, enjoy, dislike, hate

3. **activity** - Behavioral patterns, routines, frequency
   Examples: Runs 3x/week, cooks daily, travels yearly, shops monthly
   Keywords: daily, weekly, monthly, often, sometimes, rarely, every, routine

4. **characteristic** - Stable attributes, facts, skills
   Examples: Height, location, profession, skills, language, age
   Keywords: I am, I have, speaks, lives in, works as, born

5. **goal** - Future objectives, aspirations, targets
   Examples: Run marathon, lose weight, learn skill, visit place, achieve milestone
   Keywords: want to, plan to, goal is, aspire, achieve, reach, become

IMPORTANT: Respond with ONLY the semantic type name (constraint, preference, activity, characteristic, or goal).
DO NOT include any explanation, punctuation, or extra text.`;

/**
 * Enrichment Engine
 */
export class Enrichment {
  constructor() {
    this.languageSession = null;
    this.embedderSession = null;
    this.isAvailable = {
      languageModel: false,
      embedder: false
    };
  }

  /**
   * Initialize enrichment engine
   */
  async init() {
    console.log('[Enrichment] Initializing...');

    // Check LanguageModel availability
    await this.initLanguageModel();

    // Check Embedder availability
    await this.initEmbedder();

    console.log('[Enrichment] Initialized:', this.isAvailable);
    return this;
  }

  /**
   * Initialize Language Model for semantic classification
   */
  async initLanguageModel() {
    try {
      if (typeof LanguageModel === 'undefined') {
        console.warn('[Enrichment] LanguageModel API not available');
        return false;
      }

      const availability = await LanguageModel.availability();

      if (availability === 'readily' || availability === 'available') {
        this.languageSession = await LanguageModel.create({
          language: 'en',
          systemPrompt: SEMANTIC_TYPE_SYSTEM_PROMPT
        });

        this.isAvailable.languageModel = true;
        console.log('[Enrichment] LanguageModel ready');
        return true;
      } else {
        console.warn('[Enrichment] LanguageModel not readily available:', availability);
        return false;
      }
    } catch (error) {
      console.error('[Enrichment] Error initializing LanguageModel:', error);
      return false;
    }
  }

  /**
   * Initialize Embedder for vector generation
   */
  async initEmbedder() {
    try {
      if (typeof Embedder === 'undefined') {
        console.warn('[Enrichment] Embedder API not available (Chrome 135+)');
        return false;
      }

      const availability = await Embedder.availability();

      if (availability === 'readily' || availability === 'available') {
        this.embedderSession = await Embedder.create({
          // No configuration needed for default embedder
        });

        this.isAvailable.embedder = true;
        console.log('[Enrichment] Embedder ready');
        return true;
      } else {
        console.warn('[Enrichment] Embedder not readily available:', availability);
        return false;
      }
    } catch (error) {
      console.error('[Enrichment] Error initializing Embedder:', error);
      return false;
    }
  }

  /**
   * Generate 384-dim embedding for text
   * @param {string} text - Text to embed
   * @returns {Promise<number[]|null>} 384-dim vector or null
   */
  async generateEmbedding(text) {
    if (!this.embedderSession) {
      console.warn('[Enrichment] Embedder not available, skipping embedding');
      return null;
    }

    try {
      // Gemini Nano Embedder API returns Float32Array
      const embedding = await this.embedderSession.embed(text);

      // Convert to regular array and ensure 384 dimensions
      const vector = Array.from(embedding);

      if (vector.length !== 384) {
        console.warn(`[Enrichment] Unexpected embedding dimension: ${vector.length}, expected 384`);
        return null;
      }

      return vector;
    } catch (error) {
      console.error('[Enrichment] Error generating embedding:', error);
      return null;
    }
  }

  /**
   * Classify semantic type using AI
   * @param {string} text - Text to classify
   * @returns {Promise<string|null>} Semantic type or null
   */
  async classifySemanticType(text) {
    if (!this.languageSession) {
      console.warn('[Enrichment] LanguageModel not available, skipping classification');
      return null;
    }

    try {
      const prompt = `Classify this text:\n\n"${text}"\n\nSemantic type:`;

      const response = await this.languageSession.prompt(prompt);

      // Parse response (should be just the type name)
      const type = response.trim().toLowerCase();

      // Validate type
      const validTypes = ['constraint', 'preference', 'activity', 'characteristic', 'goal'];
      if (validTypes.includes(type)) {
        return type;
      } else {
        console.warn('[Enrichment] Invalid semantic type from AI:', response);
        return this.fallbackClassification(text);
      }
    } catch (error) {
      console.error('[Enrichment] Error classifying semantic type:', error);
      return this.fallbackClassification(text);
    }
  }

  /**
   * Fallback classification using keyword matching
   * @param {string} text - Text to classify
   * @returns {string} Best guess semantic type
   */
  fallbackClassification(text) {
    const lower = text.toLowerCase();

    // Constraint keywords
    if (/\b(max|min|must|only|never|required|limit|budget|under|below|above)\b/.test(lower)) {
      return 'constraint';
    }

    // Goal keywords
    if (/\b(want to|plan to|goal|aspire|achieve|reach|become|will|going to)\b/.test(lower)) {
      return 'goal';
    }

    // Activity keywords
    if (/\b(daily|weekly|monthly|often|sometimes|rarely|every|times? (a|per)|routine)\b/.test(lower)) {
      return 'activity';
    }

    // Characteristic keywords
    if (/\b(i am|i have|speaks?|lives? in|works? as|born|profession|height|age)\b/.test(lower)) {
      return 'characteristic';
    }

    // Default to preference
    return 'preference';
  }

  /**
   * Extract keywords for BM25 search
   * @param {string} text - Text to extract keywords from
   * @returns {Object} Term frequency map { word: count }
   */
  extractKeywords(text) {
    const tokens = tokenize(text);
    const keywords = {};

    for (const token of tokens) {
      keywords[token] = (keywords[token] || 0) + 1;
    }

    return keywords;
  }

  /**
   * Enrich a gem with all metadata
   * @param {Object} gem - Gem object (must have 'value' field)
   * @param {Object} options - Enrichment options
   * @returns {Promise<Object>} Enriched gem with metadata
   */
  async enrichGem(gem, options = {}) {
    console.log(`[Enrichment] Enriching gem: ${gem.id}`);

    const enriched = { ...gem };
    const { value } = gem;

    if (!value || typeof value !== 'string') {
      console.warn('[Enrichment] Gem has no valid text value, skipping enrichment');
      return enriched;
    }

    // 1. Generate embedding (always try)
    if (this.isAvailable.embedder && options.generateEmbedding !== false) {
      const vector = await this.generateEmbedding(value);
      if (vector) {
        enriched.vector = vector;
        console.log(`[Enrichment] Generated 384-dim embedding for: ${gem.id}`);
      }
    }

    // 2. Classify semantic type (always try)
    if (this.isAvailable.languageModel && options.classifySemanticType !== false) {
      const semanticType = await this.classifySemanticType(value);
      if (semanticType) {
        enriched.semanticType = semanticType;
        console.log(`[Enrichment] Classified as: ${semanticType} for: ${gem.id}`);
      }
    } else if (options.classifySemanticType !== false) {
      // Use fallback if AI not available
      enriched.semanticType = this.fallbackClassification(value);
      console.log(`[Enrichment] Fallback classified as: ${enriched.semanticType} for: ${gem.id}`);
    }

    // 3. Extract keywords for BM25 (always do this, no AI needed)
    if (options.extractKeywords !== false) {
      enriched.keywords = this.extractKeywords(value);
      console.log(`[Enrichment] Extracted ${Object.keys(enriched.keywords).length} keywords for: ${gem.id}`);
    }

    // 4. Add enrichment metadata
    enriched.enrichmentVersion = 'v2.0';
    enriched.enrichmentTimestamp = Date.now();

    console.log(`[Enrichment] Enrichment complete for: ${gem.id}`, {
      hasVector: !!enriched.vector,
      hasSemanticType: !!enriched.semanticType,
      keywordCount: enriched.keywords ? Object.keys(enriched.keywords).length : 0
    });

    return enriched;
  }

  /**
   * Batch enrich multiple gems
   * @param {Array<Object>} gems - Array of gems to enrich
   * @param {Object} options - Enrichment options
   * @param {Function} onProgress - Progress callback (current, total)
   * @returns {Promise<Array<Object>>} Enriched gems
   */
  async enrichBatch(gems, options = {}, onProgress = null) {
    console.log(`[Enrichment] Batch enriching ${gems.length} gems...`);

    const enriched = [];

    for (let i = 0; i < gems.length; i++) {
      const gem = gems[i];

      try {
        const enrichedGem = await this.enrichGem(gem, options);
        enriched.push(enrichedGem);

        if (onProgress) {
          onProgress(i + 1, gems.length);
        }
      } catch (error) {
        console.error(`[Enrichment] Error enriching gem ${gem.id}:`, error);
        // Add original gem if enrichment fails
        enriched.push(gem);
      }
    }

    console.log(`[Enrichment] Batch enrichment complete: ${enriched.length}/${gems.length}`);
    return enriched;
  }

  /**
   * Get enrichment status
   * @returns {Object}
   */
  getStatus() {
    return {
      languageModel: {
        available: this.isAvailable.languageModel,
        hasSession: !!this.languageSession
      },
      embedder: {
        available: this.isAvailable.embedder,
        hasSession: !!this.embedderSession
      }
    };
  }

  /**
   * Destroy sessions to free resources
   */
  async destroy() {
    if (this.languageSession) {
      try {
        await this.languageSession.destroy();
        console.log('[Enrichment] LanguageModel session destroyed');
      } catch (error) {
        console.error('[Enrichment] Error destroying LanguageModel:', error);
      }
      this.languageSession = null;
    }

    if (this.embedderSession) {
      try {
        await this.embedderSession.destroy();
        console.log('[Enrichment] Embedder session destroyed');
      } catch (error) {
        console.error('[Enrichment] Error destroying Embedder:', error);
      }
      this.embedderSession = null;
    }

    this.isAvailable = {
      languageModel: false,
      embedder: false
    };
  }
}

/**
 * Singleton instance
 */
let enrichmentInstance = null;

/**
 * Get or create Enrichment instance
 * @returns {Promise<Enrichment>}
 */
export async function getEnrichment() {
  if (!enrichmentInstance) {
    enrichmentInstance = new Enrichment();
    await enrichmentInstance.init();
  }
  return enrichmentInstance;
}
