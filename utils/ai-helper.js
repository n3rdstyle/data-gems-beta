/**
 * AI Helper Module
 * Provides on-device AI capabilities using Chrome's Built-in AI (Gemini Nano)
 * Requires Chrome 127+ with Prompt API enabled
 */

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
      // Check if window.ai is available (Chrome Built-in AI)
      if (!window.ai || !window.ai.languageModel) {
        console.log('[AI Helper] Chrome Built-in AI not available');
        return false;
      }

      const availability = await window.ai.languageModel.capabilities();

      if (availability.available === 'readily') {
        this.isAvailable = true;
        console.log('[AI Helper] AI ready to use');
        return true;
      } else if (availability.available === 'after-download') {
        console.log('[AI Helper] AI model needs to be downloaded first');
        this.isAvailable = false;
        return false;
      } else {
        console.log('[AI Helper] AI not available:', availability.available);
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

        this.session = await window.ai.languageModel.create({
          systemPrompt: `You are a helpful assistant that categorizes user preferences and data.
Your task is to analyze text and suggest relevant category tags.
IMPORTANT: Always respond with ONLY a valid JSON array of category names, nothing else.
Categories should be:
- Concise (1-2 words maximum)
- Relevant to the content
- Capitalized (e.g., "Technology", "Food")
- Limited to maximum 3 categories
- Prefer reusing existing categories when relevant

Example valid response: ["Technology", "Privacy"]
Example valid response: ["Food", "Italian", "Nutrition"]

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
   * @param {number} timeout - Timeout in milliseconds (default: 5000)
   * @returns {Promise<Array<string>>} - Suggested category names
   */
  async suggestCategories(text, existingCategories = [], timeout = 5000) {
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
        prompt += `Existing categories to prefer if relevant: ${existingCategories.join(', ')}\n\n`;
      }

      prompt += `Respond with ONLY a JSON array of 1-3 category names.`;

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
          // Filter and clean categories
          return categories
            .filter(cat => typeof cat === 'string' && cat.trim().length > 0)
            .map(cat => cat.trim())
            .slice(0, 3); // Max 3 categories
        }
      }

      // Fallback: try to parse entire cleaned response as JSON
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        return parsed
          .filter(cat => typeof cat === 'string' && cat.trim().length > 0)
          .map(cat => cat.trim())
          .slice(0, 3);
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
}

// Create singleton instance
const aiHelper = new AIHelper();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AIHelper, aiHelper };
}
