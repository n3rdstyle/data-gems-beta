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
    this.categoryEmbeddings = null;
    this.categoryEmbeddingsReady = false;
    this.categoryEmbeddingsInitializing = false;
    this.isAvailable = {
      languageModel: false,
      embedder: false
    };
  }

  /**
   * Initialize enrichment engine
   */
  async init() {

    // Check LanguageModel availability
    await this.initLanguageModel();

    // Check Embedder availability
    await this.initEmbedder();

    // Load pre-computed category embeddings
    await this.loadCategoryEmbeddings();

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

      // Service Workers can't run WASM due to CSP
      // We'll use message passing to offscreen document instead
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        // Check if offscreen document is available
        this.embedderSession = 'offscreen'; // Marker that we're using offscreen
        this.isAvailable.embedder = true;
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

    if (!this.embedderSession) {
      console.warn('[Enrichment] Embedder not available, skipping embedding');
      return null;
    }

    try {
      // Use offscreen document for embedding generation
      if (this.embedderSession === 'offscreen') {

        // Send message to background.js, which forwards to offscreen document
        // This works from popup context (unlike direct function call)
        return new Promise((resolve, reject) => {
          chrome.runtime.sendMessage(
            {
              target: 'offscreen',
              type: 'generateEmbedding',
              text
            },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error('[Enrichment] Chrome runtime error:', chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
                return;
              }

              if (response?.success === false) {
                console.error('[Enrichment] Embedding generation failed:', response.error);
                resolve(null);
                return;
              }

              resolve(response?.embedding || null);
            }
          );
        });
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
      }
    }

    // 3. Extract keywords for BM25 (always do this, no AI needed)
    if (options.extractKeywords !== false) {
      enriched.keywords = this.extractKeywords(value);
    }

    // 5. Create child gems if multiple attributes extracted (NEW!)
    if (extraction && extraction.attributes && extraction.attributes.length > 1 && options.createChildGems !== false) {
      enriched.isPrimary = true;
      enriched.childGems = [];


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
      }
    }

    // 6. Add enrichment metadata
    enriched.enrichmentVersion = 'v2.1';  // Updated version for child gem support
    enriched.enrichmentTimestamp = Date.now();

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
  /**
   * Load pre-computed category embeddings from storage
   */
  async loadCategoryEmbeddings() {
    try {
      const storage = await chrome.storage.local.get(['category_embeddings']);
      if (storage.category_embeddings) {
        this.categoryEmbeddings = JSON.parse(storage.category_embeddings);
        this.categoryEmbeddingsReady = true;
      } else {
        this.categoryEmbeddings = {};
        this.categoryEmbeddingsReady = false;
      }
    } catch (error) {
      console.error('[Enrichment] Error loading category embeddings:', error);
      this.categoryEmbeddings = {};
      this.categoryEmbeddingsReady = false;
    }
  }

  /**
   * Save category embeddings to storage
   */
  async saveCategoryEmbeddings() {
    try {
      const serialized = JSON.stringify(this.categoryEmbeddings);
      await chrome.storage.local.set({ category_embeddings: serialized });
      const sizeKB = Math.round(serialized.length / 1024);
    } catch (error) {
      console.error('[Enrichment] Error saving category embeddings:', error);
    }
  }

  /**
   * Initialize or update category embeddings
   * @param {Array<string>} categories - List of category names
   * @param {boolean} background - Run in background (non-blocking)
   */
  async initializeCategoryEmbeddings(categories, background = false) {
    if (this.categoryEmbeddingsInitializing) {
      return;
    }

    if (!this.isAvailable.embedder) {
      console.warn('[Enrichment] Embedder not available, cannot initialize category embeddings');
      return;
    }

    const newCategories = categories.filter(cat => !this.categoryEmbeddings[cat]);

    if (newCategories.length === 0) {
      this.categoryEmbeddingsReady = true;
      return;
    }

    this.categoryEmbeddingsInitializing = true;

    if (background) {
    } else {
    }

    for (const category of newCategories) {
      try {
        const embedding = await this.generateEmbedding(category);
        if (embedding) {
          this.categoryEmbeddings[category] = embedding;
        }
      } catch (error) {
        console.error(`[Enrichment] Failed to embed category ${category}:`, error);
      }
    }

    // Save to storage
    await this.saveCategoryEmbeddings();
    this.categoryEmbeddingsReady = true;
    this.categoryEmbeddingsInitializing = false;
  }

  /**
   * Get category embeddings
   * @returns {Object} Map of category name to embedding vector
   */
  getCategoryEmbeddings() {
    return this.categoryEmbeddings || {};
  }

  /**
   * Check if category embeddings are ready
   * @returns {boolean} True if ready
   */
  areCategoryEmbeddingsReady() {
    return this.categoryEmbeddingsReady;
  }

  async destroy() {
    if (this.languageSession) {
      try {
        await this.languageSession.destroy();
      } catch (error) {
        console.error('[Enrichment] Error destroying LanguageModel:', error);
      }
      this.languageSession = null;
    }

    if (this.embedderSession) {
      try {
        await this.embedderSession.destroy();
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
