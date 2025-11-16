/**
 * Gem Enrichment Module
 * Context Engine v2 - Auto-Enrichment
 *
 * Enriches gems with:
 * - 768-dim vector embeddings (via Offscreen Document + Transformers.js)
 * - Topic extraction (Chrome LanguageModel)
 * - Keywords for BM25 sparse search
 */

import { tokenize } from './bm25.js';

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
   * Initialize Language Model for topic extraction
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
          language: 'en'
          // No system prompt - will be provided per-request
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
   * Initialize Embedder
   * In Service Worker: Uses offscreen document for WASM
   * In other contexts: Would use Transformers.js directly (not needed for now)
   */
  async initEmbedder() {
    try {
      console.log('[Enrichment] Checking embedder availability...');

      // Service Workers can't run WASM due to CSP
      // We'll use message passing to offscreen document instead
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        // Check if offscreen document is available
        this.embedderSession = 'offscreen'; // Marker that we're using offscreen
        this.isAvailable.embedder = true;
        console.log('[Enrichment] Using offscreen document for embeddings');
        return true;
      } else {
        console.warn('[Enrichment] No embedding method available');
        return false;
      }
    } catch (error) {
      console.error('[Enrichment] Error initializing embedder:', error);
      this.isAvailable.embedder = false;
      return false;
    }
  }

  /**
   * Generate 768-dim embedding for text
   * Uses global generateEmbeddingOffscreen function from background.js
   * @param {string} text - Text to embed
   * @returns {Promise<number[]|null>} 768-dim vector or null
   */
  async generateEmbedding(text) {
    console.log('[Enrichment] generateEmbedding() called, embedderSession:', this.embedderSession);
    console.log('[Enrichment] Text length:', text?.length || 0);

    if (!this.embedderSession) {
      console.warn('[Enrichment] Embedder not available, skipping embedding');
      return null;
    }

    try {
      // Use offscreen document for embedding generation
      if (this.embedderSession === 'offscreen') {
        console.log('[Enrichment] Checking for global function...');
        console.log('[Enrichment] typeof self.generateEmbeddingOffscreen:', typeof self.generateEmbeddingOffscreen);

        // Call global function exposed by background.js
        // (Service Workers can't message themselves!)
        if (typeof self.generateEmbeddingOffscreen === 'function') {
          console.log('[Enrichment] Calling self.generateEmbeddingOffscreen()...');
          const embedding = await self.generateEmbeddingOffscreen(text);
          console.log('[Enrichment] Embedding result:', embedding ? `${embedding.length}-dim vector` : 'null');
          return embedding;
        } else {
          console.error('[Enrichment] generateEmbeddingOffscreen not found on global scope!');
          console.error('[Enrichment] Available on self:', Object.keys(self).filter(k => k.includes('Embedding')));
          return null;
        }
      }

      console.warn('[Enrichment] Unknown embedder session type:', this.embedderSession);
      return null;
    } catch (error) {
      console.error('[Enrichment] Error generating embedding:', error);
      return null;
    }
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
   * Extract topic and attributes from text using AI
   * @param {string} text - Text to analyze
   * @param {Array<string>} existingCategories - List of existing categories to choose from
   * @returns {Promise<Object>} { topic: string|null, attributes: Array }
   */
  async extractTopicAndAttributes(text, existingCategories = []) {
    if (!this.languageSession) {
      console.warn('[Enrichment] LanguageModel not available, using fallback extraction');
      return this.fallbackExtraction(text, existingCategories);
    }

    try {
      const categoriesHint = existingCategories.length > 0
        ? `\nAvailable categories: ${existingCategories.join(', ')}`
        : '';

      const prompt = `Analyze this text and extract structured information:

Text: "${text}"${categoriesHint}

IMPORTANT: Return ONLY valid JSON, without markdown code blocks or backticks.

Return JSON with:
1. "topic": Main topic/question (e.g., "Wie ist deine Morning-Routine?") or null if not a question-based preference
2. "attributes": Array of extracted attributes

Each attribute should have:
- "subTopic": Human-readable sub-topic (e.g., "Kaffeeart, die ich gerne trinke")
- "attribute": Machine-readable key (e.g., "coffee_type")
- "value": Extracted value (e.g., "Espresso")
- "unit": Unit if applicable (e.g., "cm", "kg") or null
- "category": Category from available list or suggest new one

Example output:
{
  "topic": "Morning Routine",
  "attributes": [
    {
      "subTopic": "Kaffeeart, die ich trinke",
      "attribute": "coffee_type",
      "value": "Espresso",
      "unit": null,
      "category": "Nutrition"
    }
  ]
}

IMPORTANT:
- If text contains only ONE simple fact, return attributes array with ONE item
- If text is complex with multiple facts, extract ALL attributes
- Return ONLY valid JSON, no explanation`;

      const response = await this.languageSession.prompt(prompt);

      // Clean response: remove markdown code blocks if present
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```')) {
        // Remove markdown code blocks (```json ... ``` or ``` ... ```)
        cleanedResponse = cleanedResponse.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
      }

      const parsed = JSON.parse(cleanedResponse);

      console.log('[Enrichment] AI extraction successful:', {
        topic: parsed.topic,
        attributeCount: parsed.attributes?.length || 0
      });

      return parsed;
    } catch (error) {
      console.error('[Enrichment] AI extraction failed:', error);
      return this.fallbackExtraction(text, existingCategories);
    }
  }

  /**
   * Fallback extraction using pattern matching
   * @param {string} text - Text to analyze
   * @param {Array<string>} existingCategories - Existing categories
   * @returns {Object} { topic: null, attributes: Array }
   */
  fallbackExtraction(text, existingCategories = []) {
    console.log('[Enrichment] Using fallback extraction');

    // Simple pattern matching for common attributes
    const attributes = [];

    // Height
    const heightMatch = text.match(/(\d+)\s*(cm|m|ft|'|")/i);
    if (heightMatch) {
      attributes.push({
        subTopic: 'Body height',
        attribute: 'height',
        value: heightMatch[1],
        unit: heightMatch[2],
        category: existingCategories.includes('Health') ? 'Health' : 'Physical Attributes'
      });
    }

    // Age
    const ageMatch = text.match(/(\d+)\s*years?\s*old|age\s*[:=]\s*(\d+)/i);
    if (ageMatch) {
      attributes.push({
        subTopic: 'Age',
        attribute: 'age',
        value: ageMatch[1] || ageMatch[2],
        unit: 'years',
        category: existingCategories.includes('Identity') ? 'Identity' : 'Personal Info'
      });
    }

    // If no specific patterns matched, treat whole text as single attribute
    if (attributes.length === 0) {
      attributes.push({
        subTopic: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
        attribute: 'general',
        value: text,
        unit: null,
        category: existingCategories[0] || 'General'
      });
    }

    return {
      topic: null,  // No topic detection in fallback
      attributes
    };
  }

  /**
   * Enrich a gem with all metadata (including child gem creation)
   * @param {Object} gem - Gem object (must have 'value' field)
   * @param {Object} options - Enrichment options
   * @returns {Promise<Object>} Enriched gem with metadata
   */
  async enrichGem(gem, options = {}) {
    console.log(`[Enrichment] Enriching gem: ${gem.id}`);

    const enriched = { ...gem };
    const { value } = gem;

    // Set required fields with defaults (for RxDB Dexie index requirements)
    if (enriched.isPrimary === undefined) {
      enriched.isPrimary = false;  // Default: not a primary gem
    }
    if (!enriched.parentGem) {
      enriched.parentGem = '';  // Default: no parent
    }
    if (!enriched.childGems) {
      enriched.childGems = [];  // Default: no children
    }
    if (enriched.isVirtual === undefined) {
      enriched.isVirtual = false;  // Default: visible gem
    }

    if (!value || typeof value !== 'string') {
      console.warn('[Enrichment] Gem has no valid text value, skipping enrichment');
      return enriched;
    }

    // Get existing categories for AI hints
    const existingCategories = Array.isArray(gem.collections) ? gem.collections : [];

    // 1. Extract topic and attributes (NEW!)
    let extraction = null;
    if (options.createChildGems !== false) {
      extraction = await this.extractTopicAndAttributes(value, existingCategories);

      // Set topic on primary gem (only if provided by user or AI extracted)
      if (gem.topic) {
        enriched.topic = gem.topic;  // User-provided topic takes precedence
      } else if (extraction.topic) {
        enriched.topic = extraction.topic;  // AI-extracted topic
      }
    }

    // 2. Generate embedding for primary gem (always try)
    if (this.isAvailable.embedder && options.generateEmbedding !== false) {
      const vector = await this.generateEmbedding(value);
      if (vector) {
        enriched.vector = vector;
        console.log(`[Enrichment] Generated 768-dim embedding for: ${gem.id}`);
      }
    }

    // 3. Extract keywords for BM25 (always do this, no AI needed)
    if (options.extractKeywords !== false) {
      enriched.keywords = this.extractKeywords(value);
      console.log(`[Enrichment] Extracted ${Object.keys(enriched.keywords).length} keywords for: ${gem.id}`);
    }

    // 5. Create child gems if multiple attributes extracted (NEW!)
    if (extraction && extraction.attributes && extraction.attributes.length > 1 && options.createChildGems !== false) {
      enriched.isPrimary = true;
      enriched.childGems = [];

      console.log(`[Enrichment] Creating ${extraction.attributes.length} child gems for: ${gem.id}`);

      for (const attr of extraction.attributes) {
        const childValue = attr.unit ? `${attr.value} ${attr.unit}` : attr.value;

        const childGem = {
          id: `${gem.id}_${attr.attribute}`,
          value: childValue,

          // Collections (can differ from parent!)
          collections: attr.category ? [attr.category] : enriched.collections || [],
          subCollections: enriched.subCollections || [],

          // Topic hierarchy
          topic: enriched.topic || null,  // Inherit from parent
          subTopic: attr.subTopic,  // Specific sub-topic

          // Attribute details
          attribute: attr.attribute,
          attributeValue: attr.value,
          attributeUnit: attr.unit,

          // Relationship
          parentGem: gem.id,
          isVirtual: true,  // Don't show in UI
          isPrimary: false,

          // Timestamp
          timestamp: gem.timestamp || Date.now(),

          // Generate precise vector for child (specific attribute)
          vector: null,  // Will be generated below
          keywords: {}
        };

        // Generate embedding for child gem (PRECISE matching!)
        if (this.isAvailable.embedder) {
          const childEmbeddingText = attr.subTopic
            ? `${attr.subTopic}: ${childValue}`
            : childValue;
          childGem.vector = await this.generateEmbedding(childEmbeddingText);
        }

        // Extract keywords for child
        childGem.keywords = this.extractKeywords(`${attr.subTopic || ''} ${childValue}`);

        // Add child ID to parent
        enriched.childGems.push(childGem.id);

        // Store child gem (will be inserted by Context Engine)
        if (!enriched._childGemsToInsert) {
          enriched._childGemsToInsert = [];
        }
        enriched._childGemsToInsert.push(childGem);

        console.log(`[Enrichment] Created child gem: ${childGem.id}`, {
          subTopic: childGem.subTopic,
          value: childGem.value,
          category: childGem.collections[0]
        });
      }
    }

    // 6. Add enrichment metadata
    enriched.enrichmentVersion = 'v2.1';  // Updated version for child gem support
    enriched.enrichmentTimestamp = Date.now();

    console.log(`[Enrichment] Enrichment complete for: ${gem.id}`, {
      hasVector: !!enriched.vector,
      hasSemanticType: !!enriched.semanticType,
      keywordCount: enriched.keywords ? Object.keys(enriched.keywords).length : 0,
      hasTopic: !!enriched.topic,
      childGemCount: enriched.childGems?.length || 0
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
