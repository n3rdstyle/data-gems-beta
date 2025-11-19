/**
 * AI Helper Module
 * Provides on-device AI capabilities using Chrome's Built-in AI (Gemini Nano)
 * Requires Chrome 138+ with Prompt API
 * Uses LanguageModel API (Extensions)
 */

/**
 * Predefined categories for consistent auto-categorization
 * AI will prefer these categories but can create new ones if needed
 * These categories match the 20 Random Question templates
 */
const PREDEFINED_CATEGORIES = [
  'Arts & Creativity',
  'Emotions',
  'Environment',
  'Family',
  'Future',
  'Habits',
  'Health',
  'Housing & Lifestyle',
  'Learning',
  'Memory',
  'Nutrition',
  'Personal',
  'Philosophy',
  'Politics',
  'Relationships',
  'Shopping',
  'Sports & Hobbies',
  'Technology',
  'Travel',
  'Work'
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
   - Capitalized (e.g., "Technology", "Nutrition")
   - Clear and specific
4. Maximum 1-2 categories per item (only add second if HIGHLY relevant)
5. CRITICAL: Only add categories that are CLEARLY and DIRECTLY relevant
   - If uncertain, prefer fewer categories
   - 1 perfect match is better than 2 approximate matches
   - NEVER add vague categories like "Other", "Miscellaneous", "General"
   - Second category must be AS SPECIFIC as the first, not loosely related
   - Example: "My go-to drink: Spezi" → ["Nutrition"] NOT ["Nutrition", "Personal"]
   - When in doubt, use ONLY 1 category

Example valid response: ["Technology"]
Example valid response: ["Nutrition", "Italian"]

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
      let prompt = `Analyze this text and suggest the SINGLE MOST RELEVANT category:\n\n"${text}"\n\n`;

      if (existingCategories.length > 0) {
        prompt += `EXISTING CATEGORIES - YOU MUST CHOOSE FROM THESE FIRST:\n${existingCategories.join(', ')}\n\n`;
        prompt += `RULES:\n`;
        prompt += `1. If ANY existing category matches, use it (even if not perfect)\n`;
        prompt += `2. Only create a NEW category if NONE of the existing ones fit at all\n`;
        prompt += `3. New categories must be concise (1-3 words) and follow existing naming style\n`;
        prompt += `4. For food/drink preferences, use "Nutrition" if it exists\n`;
        prompt += `5. For sports/exercise, use "Sports & Hobbies" if it exists\n\n`;
      }

      prompt += `Respond with ONLY a JSON array containing exactly 1 category name. Examples: ["Nutrition"] or ["Technology"]`;

      console.log('[AI Helper] Prompt:', prompt);
      console.log('[AI Helper] Existing categories:', existingCategories);

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('AI request timeout')), timeout);
      });

      // Race between AI response and timeout
      const response = await Promise.race([
        this.session.prompt(prompt),
        timeoutPromise
      ]);

      console.log('[AI Helper] Raw AI response:', response);

      // Parse response
      const categories = this.parseCategories(response);

      console.log('[AI Helper] Parsed categories:', categories, 'for text:', text.substring(0, 50) + '...');
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
   * @returns {string} - Normalized category name (or empty string if invalid)
   */
  normalizeCategory(category) {
    // Trim whitespace
    let normalized = category.trim();

    // Remove invalid characters (keep only letters, spaces, and ampersands)
    normalized = normalized.replace(/[^a-zA-Z\s&]/g, '');

    // Remove trailing or leading special characters
    normalized = normalized.replace(/^[&\s]+|[&\s]+$/g, '');

    // If it's just special characters or empty, return empty
    if (!normalized || normalized.length === 0) {
      console.warn('[AI Helper] Invalid category after normalization:', category);
      return '';
    }

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

  /**
   * Generate a topic (question) for given preference text
   * @param {string} text - Preference text
   * @param {number} timeout - Timeout in milliseconds (default: 15000)
   * @returns {Promise<string>} - Generated topic/question
   */
  async generateTopic(text, timeout = 15000) {
    try {
      if (!text || text.trim().length === 0) {
        return '';
      }

      // Initialize if not already done
      if (!this.session) {
        const initialized = await this.initialize();
        if (!initialized) {
          console.log('[AI Helper] AI not available, skipping topic generation');
          return '';
        }
      }

      // Build prompt for topic generation
      const prompt = `Given this user preference, generate a relevant question that this preference answers.

User preference: "${text}"

Requirements:
1. Generate a clear, simple question
2. The question should be conversational and natural
3. Keep it under 100 characters
4. Don't use complex or formal language
5. IMPORTANT: Use open-ended phrasing that matches the preference:
   - If preference says "I like X", ask "What X do you like?" NOT "What's your favorite X?"
   - If preference says "I prefer X", ask "What do you prefer?" or "Do you prefer X or Y?"
   - If preference mentions a specific thing, use plural in question when appropriate
6. Examples:
   - Preference: "I like pizza" → Question: "What foods do you like?"
   - Preference: "I like popcorn" → Question: "What snacks do you like?"
   - Preference: "I prefer dark mode" → Question: "What theme do you prefer?"
   - Preference: "I wake up at 6am" → Question: "What time do you wake up?"
   - Preference: "I love running" → Question: "What activities do you enjoy?"

Respond with ONLY the question, no quotes, no explanation.`;

      console.log('[AI Helper] Generating topic for:', text);

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('AI request timeout')), timeout);
      });

      // Race between AI response and timeout
      const response = await Promise.race([
        this.session.prompt(prompt),
        timeoutPromise
      ]);

      console.log('[AI Helper] Generated topic:', response);

      // Clean response (remove quotes if present)
      let topic = response.trim();
      topic = topic.replace(/^["']|["']$/g, ''); // Remove leading/trailing quotes

      // Limit length
      if (topic.length > 200) {
        topic = topic.substring(0, 200);
      }

      return topic;

    } catch (error) {
      if (error.message === 'AI request timeout') {
        console.warn('[AI Helper] Topic generation timed out after', timeout, 'ms');
      } else {
        console.error('[AI Helper] Error generating topic:', error);
      }
      return '';
    }
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
