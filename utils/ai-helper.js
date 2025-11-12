/**
 * AI Helper Module
 * Provides on-device AI capabilities using Chrome's Built-in AI (Gemini Nano)
 * Requires Chrome 138+ with Prompt API
 * Uses LanguageModel API (Extensions)
 */

/**
 * Predefined categories for consistent auto-categorization
 * AI will prefer these categories but can create new ones if needed
 */
const PREDEFINED_CATEGORIES = [
  // Technology & Digital
  'Technology', 'Privacy', 'Security', 'Software', 'Hardware',
  'Internet', 'Social Media', 'AI', 'Development', 'Design',

  // Content & Media
  'Entertainment', 'Music', 'Movies', 'Gaming', 'Books',
  'Podcasts', 'News', 'Blog', 'Video',

  // Lifestyle
  'Food', 'Cooking', 'Travel', 'Health', 'Fitness',
  'Fashion', 'Home', 'Garden', 'Pets',

  // Professional & Education
  'Work', 'Productivity', 'Education', 'Career', 'Finance',
  'Business', 'Marketing', 'Research',

  // Shopping & Services
  'Shopping', 'E-commerce', 'Services', 'Subscriptions',

  // Personal
  'Personal', 'Family', 'Friends', 'Hobbies', 'Sports'
];

class AIHelper {
  constructor() {
    this.session = null;
    this.isAvailable = false;
    this.isInitializing = false;
    this.initPromise = null;
  }

  /**
   * Check if AI capabilities are available in the browser
   * @returns {Promise<boolean>}
   */
  async checkAvailability() {
    try {
      // Check if LanguageModel is available (Chrome Built-in AI - Extensions API)
      if (typeof LanguageModel === 'undefined') {
        console.log('[AI Helper] LanguageModel API not available');
        return false;
      }

      const availability = await LanguageModel.availability();

      if (availability === 'readily' || availability === 'available') {
        this.isAvailable = true;
        console.log('[AI Helper] AI ready to use');
        return true;
      } else if (availability === 'downloadable' || availability === 'after-download') {
        console.log('[AI Helper] AI model needs to be downloaded first');
        this.isAvailable = false;
        return false;
      } else {
        console.log('[AI Helper] AI not available:', availability);
        this.isAvailable = false;
        return false;
      }
    } catch (error) {
      console.error('[AI Helper] Error checking availability:', error);
      this.isAvailable = false;
      return false;
    }
  }

  /**
   * Initialize AI session
   * @returns {Promise<boolean>}
   */
  async initialize() {
    // Return existing session
    if (this.session) {
      return true;
    }

    // Wait for ongoing initialization
    if (this.isInitializing && this.initPromise) {
      return this.initPromise;
    }

    this.isInitializing = true;

    this.initPromise = (async () => {
      try {
        const available = await this.checkAvailability();
        if (!available) {
          this.isInitializing = false;
          return false;
        }

        this.session = await LanguageModel.create({
          language: 'en',
          systemPrompt: `You are a helpful assistant that categorizes user preferences and data.
Your task is to analyze text and suggest relevant category tags.

IMPORTANT: Always respond with ONLY a valid JSON array of category names, nothing else.

Category Selection Rules:
1. PREFER selecting from existing categories when they match the content
2. If no existing category fits well, create a new one in the same style
3. New categories must follow these rules:
   - Concise (1-2 words maximum)
   - Capitalized (e.g., "Technology", "Food")
   - Clear and specific
4. Maximum 1-2 categories per item (only add second if HIGHLY relevant)
5. CRITICAL: Only add categories that are CLEARLY and DIRECTLY relevant
   - If uncertain, prefer fewer categories
   - 1 perfect match is better than 2 approximate matches
   - NEVER add vague categories like "Hobbies", "Personal", "Other", "Lifestyle"
   - Second category must be AS SPECIFIC as the first, not loosely related
   - Example: "My go-to drink: Spezi" → ["Food"] NOT ["Food", "Hobbies"]
   - When in doubt, use ONLY 1 category

Example valid response: ["Technology"]
Example valid response: ["Food", "Italian"]

DO NOT add any explanation, markdown, or extra text. ONLY the JSON array.`
        });

        console.log('[AI Helper] AI session initialized');
        this.isInitializing = false;
        return true;
      } catch (error) {
        console.error('[AI Helper] Error initializing AI session:', error);
        this.session = null;
        this.isInitializing = false;
        return false;
      }
    })();

    return this.initPromise;
  }

  /**
   * Suggest categories for given text using AI
   * @param {string} text - Text to analyze
   * @param {Array<string>} existingCategories - Already existing categories in the system
   * @param {number} timeout - Timeout in milliseconds (default: 15000)
   * @returns {Promise<Array<string>>} - Suggested category names
   */
  async suggestCategories(text, existingCategories = [], timeout = 15000) {
    try {
      if (!text || text.trim().length === 0) {
        return [];
      }

      // Initialize if not already done
      if (!this.session) {
        const initialized = await this.initialize();
        if (!initialized) {
          console.log('[AI Helper] AI not available, skipping category suggestion');
          return [];
        }
      }

      // Build prompt with context about existing categories
      let prompt = `Analyze this text and suggest relevant categories:\n\n"${text}"\n\n`;

      if (existingCategories.length > 0) {
        prompt += `EXISTING CATEGORIES (prefer these when relevant):\n${existingCategories.join(', ')}\n\n`;
        prompt += `Choose from existing categories OR create new ones if none fit well.\n\n`;
      }

      prompt += `Respond with ONLY a JSON array containing exactly 1 MOST RELEVANT category name. Pick the single best fit.`;

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('AI request timeout')), timeout);
      });

      // Race between AI response and timeout
      const response = await Promise.race([
        this.session.prompt(prompt),
        timeoutPromise
      ]);

      // Parse response
      const categories = this.parseCategories(response);

      console.log('[AI Helper] Suggested categories:', categories, 'for text:', text.substring(0, 50) + '...');
      return categories;

    } catch (error) {
      if (error.message === 'AI request timeout') {
        console.warn('[AI Helper] Request timed out after', timeout, 'ms');
      } else {
        console.error('[AI Helper] Error suggesting categories:', error);
      }
      return [];
    }
  }

  /**
   * Normalize category name to follow style guide
   * @param {string} category - Raw category name
   * @returns {string} - Normalized category name
   */
  normalizeCategory(category) {
    // Trim whitespace
    let normalized = category.trim();

    // Capitalize first letter of each word
    normalized = normalized
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    // Limit to 2 words maximum
    const words = normalized.split(' ');
    if (words.length > 2) {
      normalized = words.slice(0, 2).join(' ');
    }

    return normalized;
  }

  /**
   * Parse AI response to extract category array
   * @param {string} response - AI response text
   * @returns {Array<string>}
   */
  parseCategories(response) {
    try {
      // Clean response (remove markdown code blocks if present)
      let cleaned = response.trim();
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      cleaned = cleaned.replace(/^[^[]*/, ''); // Remove any text before first [
      cleaned = cleaned.replace(/[^\]]*$/, ''); // Remove any text after last ]

      // Try to find JSON array in response
      const jsonMatch = cleaned.match(/\[.*?\]/s);
      if (jsonMatch) {
        const categories = JSON.parse(jsonMatch[0]);
        if (Array.isArray(categories)) {
          // Filter, clean, and normalize categories
          return categories
            .filter(cat => typeof cat === 'string' && cat.trim().length > 0)
            .map(cat => this.normalizeCategory(cat))
            .filter(cat => cat.length > 0) // Remove empty after normalization
            .slice(0, 2); // Max 2 categories
        }
      }

      // Fallback: try to parse entire cleaned response as JSON
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        return parsed
          .filter(cat => typeof cat === 'string' && cat.trim().length > 0)
          .map(cat => this.normalizeCategory(cat))
          .filter(cat => cat.length > 0)
          .slice(0, 2);
      }

      return [];
    } catch (error) {
      console.error('[AI Helper] Error parsing categories:', error, 'Response:', response);
      return [];
    }
  }

  /**
   * Destroy AI session to free resources
   */
  async destroy() {
    if (this.session) {
      try {
        await this.session.destroy();
        console.log('[AI Helper] AI session destroyed');
      } catch (error) {
        console.error('[AI Helper] Error destroying session:', error);
      }
      this.session = null;
      this.isAvailable = false;
      this.isInitializing = false;
      this.initPromise = null;
    }
  }

  /**
   * Get current status
   * @returns {Object}
   */
  getStatus() {
    return {
      isAvailable: this.isAvailable,
      isInitializing: this.isInitializing,
      hasSession: !!this.session
    };
  }

  /**
   * Get predefined categories
   * @returns {Array<string>}
   */
  getPredefinedCategories() {
    return [...PREDEFINED_CATEGORIES];
  }
}

// Create singleton instance and expose globally for content scripts
console.log('[AI Helper] Initializing aiHelper...');
try {
  window.aiHelper = new AIHelper();
  window.dataGemsShared = window.dataGemsShared || {};
  window.dataGemsShared.aiHelper = window.aiHelper;
  console.log('[AI Helper] ✓ aiHelper initialized successfully');
} catch (error) {
  console.error('[AI Helper] ✗ Failed to initialize aiHelper:', error);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AIHelper, aiHelper: window.aiHelper };
}
