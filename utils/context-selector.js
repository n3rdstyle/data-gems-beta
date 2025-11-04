/**
 * Context Selector
 * Selects the most relevant Data Gems for a given prompt
 */

/**
 * Use AI to identify relevant categories for a prompt
 * @param {string} promptText - The user's prompt
 * @param {Array} allCategories - Array of all available categories
 * @returns {Promise<Array<string>>} Array of relevant category names
 */
async function selectRelevantCategoriesWithAI(promptText, allCategories) {
  try {
    // Create AI session for category selection
    const session = await LanguageModel.create({
      language: 'en',
      systemPrompt: `You are a category relevance analyzer. Given a user prompt and a list of categories,
identify which categories are relevant for finding useful context.

Respond with ONLY a JSON array of relevant category names, nothing else.
Example: ["Training", "Health", "Food"]

If unsure, include the category. It's better to be inclusive than to miss relevant context.`
    });

    const categoriesStr = allCategories.join(', ');
    const prompt = `User prompt: "${promptText}"

Available categories: ${categoriesStr}

Which categories are relevant? Respond with JSON array only:`;

    console.log('[Context Selector] Asking AI for relevant categories...');

    const response = await session.prompt(prompt);
    await session.destroy();

    // Parse response
    const cleaned = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const match = cleaned.match(/\[.*?\]/s);

    if (match) {
      const categories = JSON.parse(match[0]);
      console.log('[Context Selector] AI selected categories:', categories);
      return categories.filter(cat => typeof cat === 'string');
    }

    console.warn('[Context Selector] Could not parse category response:', response);
    return [];

  } catch (error) {
    console.error('[Context Selector] Error selecting categories:', error);
    return [];
  }
}

/**
 * Filter gems by categories
 * @param {Array} dataGems - Array of preference objects
 * @param {Array<string>} categories - Categories to filter by
 * @returns {Array} Filtered gems
 */
function filterGemsByCategories(dataGems, categories) {
  if (!categories || categories.length === 0) {
    return dataGems;
  }

  const categoriesLower = categories.map(cat => cat.toLowerCase());

  return dataGems.filter(gem => {
    if (!gem.collections || gem.collections.length === 0) {
      return false; // Skip gems without categories
    }

    // Check if any of the gem's collections match the selected categories
    return gem.collections.some(col =>
      categoriesLower.includes(col.toLowerCase())
    );
  });
}

/**
 * Select most relevant data gems for a prompt using Gemini Nano AI
 * TWO-STAGE APPROACH:
 * 1. AI selects relevant categories (1 call)
 * 2. Filter gems by categories (fast, local)
 * 3. AI scores only filtered gems (20-50 calls instead of 455)
 *
 * @param {string} promptText - The user's prompt
 * @param {Array} dataGems - Array of preference objects from profile
 * @param {number} maxResults - Maximum number of gems to return (default: 5)
 * @returns {Promise<Array>} Array of selected data gems
 */
async function selectRelevantGemsWithAI(promptText, dataGems, maxResults = 5) {
  try {
    // Check if AI Helper is available
    if (typeof aiHelper === 'undefined' || !aiHelper) {
      console.log('[Context Selector] AI Helper not available, falling back to keyword matching');
      return selectRelevantGemsByKeywords(promptText, dataGems, maxResults);
    }

    // Initialize AI if needed
    const available = await aiHelper.checkAvailability();
    if (!available) {
      console.log('[Context Selector] AI not available, falling back to keyword matching');
      return selectRelevantGemsByKeywords(promptText, dataGems, maxResults);
    }

    await aiHelper.initialize();

    // STAGE 1: Identify relevant categories using AI
    console.log(`[Context Selector] Stage 1: Analyzing ${dataGems.length} gems`);

    // Extract all unique categories from gems
    const allCategories = [...new Set(
      dataGems
        .flatMap(gem => gem.collections || [])
        .filter(Boolean)
    )];

    console.log(`[Context Selector] Found ${allCategories.length} unique categories`);

    let candidateGems = dataGems;

    if (allCategories.length > 0) {
      // Ask AI which categories are relevant
      const relevantCategories = await selectRelevantCategoriesWithAI(promptText, allCategories);

      if (relevantCategories.length > 0) {
        // Filter gems by relevant categories
        candidateGems = filterGemsByCategories(dataGems, relevantCategories);
        console.log(`[Context Selector] Filtered to ${candidateGems.length} gems in ${relevantCategories.length} relevant categories`);
      } else {
        console.log('[Context Selector] AI returned no categories, using all gems');
      }
    } else {
      console.log('[Context Selector] No categories found, processing all gems');
    }

    // If still too many, use keyword matching to reduce before AI scoring
    const MAX_AI_SCORING = 20; // Reduced to 20 for better AI performance

    if (candidateGems.length > MAX_AI_SCORING) {
      console.log(`[Context Selector] Still too many gems (${candidateGems.length}), using keyword pre-filter`);

      // Get favorited gems first (always prioritize these)
      const favorited = candidateGems.filter(gem => gem.state === 'favorited');

      // Use keyword matching on non-favorited gems
      const nonFavorited = candidateGems.filter(gem => gem.state !== 'favorited');
      const keywordFiltered = selectRelevantGemsByKeywords(promptText, nonFavorited, MAX_AI_SCORING - favorited.length);

      // Combine: all favorited + keyword-filtered
      candidateGems = [...favorited, ...keywordFiltered];

      console.log(`[Context Selector] Reduced to ${candidateGems.length} gems (${favorited.length} favorited + ${keywordFiltered.length} keyword-matched)`);
    }

    // If no candidates, fall back to keyword matching on all gems
    if (candidateGems.length === 0) {
      console.log('[Context Selector] No candidates after filtering, using keyword matching on all gems');
      return selectRelevantGemsByKeywords(promptText, dataGems, maxResults);
    }

    // STAGE 2: Score filtered gems with AI
    console.log(`[Context Selector] Stage 2: Scoring ${candidateGems.length} filtered gems with AI`);
    console.log(`[Context Selector] Sample gems to score:`, candidateGems.slice(0, 3).map(g => g.value.substring(0, 60) + '...'));

    // Create AI session for relevance scoring
    const session = await LanguageModel.create({
      language: 'en',
      systemPrompt: `Rate data gem relevance for user prompt. Scale 0-10:
- 8-10: Directly relevant (workout data for workout prompt)
- 5-7: Supporting context (nutrition for workout)
- 2-4: Loosely related
- 0-1: Not relevant

CRITICAL: Output format MUST be a SINGLE digit 0-9 or number 10, NOTHING ELSE.
NO explanations, NO markdown, NO extra text.
Just the number.

Examples:
Input: "Bench Press 3x10" for "plan workout" → Output: 9
Input: "Favorite color blue" for "plan workout" → Output: 0`
    });

    // Score each candidate gem with timeout per gem
    const scoredGems = await Promise.all(
      candidateGems.map(async (gem, index) => {
        try {
          const prompt = `Prompt: "${promptText}"\n\nData gem: "${gem.value}"\n\nRelevance score:`;

          // Add timeout per gem (5 seconds max - increased from 3s)
          const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => resolve('0'), 5000);
          });

          const response = await Promise.race([
            session.prompt(prompt),
            timeoutPromise
          ]);

          // More robust parsing
          const cleaned = response.trim();
          const numberMatch = cleaned.match(/\d+/);
          const score = numberMatch ? parseInt(numberMatch[0]) : 0;

          // Debug logging for first few gems
          if (index < 3) {
            console.log(`[Context Selector] Gem ${index + 1} - Response: "${cleaned}" → Score: ${score}`);
          }

          return {
            gem,
            score: isNaN(score) ? 0 : Math.min(score, 10) // Cap at 10
          };
        } catch (error) {
          console.warn('[Context Selector] Error scoring gem:', error);
          return { gem, score: 0 };
        }
      })
    );

    // Clean up session
    await session.destroy();

    console.log('[Context Selector] AI scoring complete');

    // Sort by score
    scoredGems.sort((a, b) => b.score - a.score);

    // Get results - include items with score > 0
    let results = scoredGems
      .filter(item => item.score > 0)
      .slice(0, maxResults)
      .map(item => item.gem);

    // FALLBACK: If AI gave all 0 scores, fall back to keyword matching
    if (results.length === 0 && candidateGems.length > 0) {
      console.log('[Context Selector] AI scored all gems as 0, falling back to keyword matching');
      // Try keyword matching on the category-filtered gems
      const keywordResults = selectRelevantGemsByKeywords(promptText, candidateGems, maxResults);
      if (keywordResults.length > 0) {
        console.log(`[Context Selector] Keyword matching found ${keywordResults.length} gems`);
        results = keywordResults;
      } else {
        // Last resort: take favorited gems from candidates
        const favorited = candidateGems.filter(gem => gem.state === 'favorited').slice(0, maxResults);
        if (favorited.length > 0) {
          console.log(`[Context Selector] Using ${favorited.length} favorited gems as last resort`);
          results = favorited;
        } else {
          // Really last resort: first N candidates
          console.log(`[Context Selector] Using first ${maxResults} candidates as last resort`);
          results = candidateGems.slice(0, maxResults);
        }
      }
    }

    console.log(`[Context Selector] Selected ${results.length} gems (scores: ${scoredGems.slice(0, 5).map(s => s.score).join(', ')}...)`);

    return results;

  } catch (error) {
    console.error('[Context Selector] AI selection error:', error);
    return selectRelevantGemsByKeywords(promptText, dataGems, maxResults);
  }
}

/**
 * Select most relevant data gems using simple keyword matching
 * @param {string} promptText - The user's prompt
 * @param {Array} dataGems - Array of preference objects from profile
 * @param {number} maxResults - Maximum number of gems to return (default: 5)
 * @returns {Array} Array of selected data gems
 */
function selectRelevantGemsByKeywords(promptText, dataGems, maxResults = 5) {
  if (!dataGems || dataGems.length === 0) {
    return [];
  }

  // Convert prompt to lowercase for case-insensitive matching
  const promptLower = promptText.toLowerCase();

  // Extract keywords from prompt (remove common words)
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'may', 'might', 'must', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'me', 'him', 'them', 'this', 'that', 'these', 'those']);

  const keywords = promptLower
    .split(/\W+/)
    .filter(word => word.length > 2 && !commonWords.has(word));

  // Score each gem based on keyword matches
  const scoredGems = dataGems.map(gem => {
    const gemText = gem.value.toLowerCase();
    let score = 0;

    // Check for exact keyword matches
    keywords.forEach(keyword => {
      if (gemText.includes(keyword)) {
        score += 2;
      }
    });

    // Bonus for favorited items
    if (gem.state === 'favorited') {
      score += 1;
    }

    // Check collection relevance
    if (gem.collections && gem.collections.length > 0) {
      gem.collections.forEach(collection => {
        const collectionLower = collection.toLowerCase();
        if (promptLower.includes(collectionLower)) {
          score += 3;
        }
      });
    }

    return { gem, score };
  });

  // Sort by score and return top N
  return scoredGems
    .filter(item => item.score > 0) // Only include items with some relevance
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(item => item.gem);
}

/**
 * Format selected gems in the specified format
 * @param {string} originalPrompt - The original prompt
 * @param {Array} selectedGems - Array of selected data gems
 * @returns {string} Formatted prompt with context
 */
function formatPromptWithContext(originalPrompt, selectedGems) {
  if (!selectedGems || selectedGems.length === 0) {
    return originalPrompt;
  }

  let formatted = `"${originalPrompt}"\n`;

  selectedGems.forEach(gem => {
    // Determine type from collections or use generic "context"
    let type = 'context';
    if (gem.collections && gem.collections.length > 0) {
      type = gem.collections[0].toLowerCase();
    }

    // Format: @{type} {data}
    formatted += `\n@${type} ${gem.value}`;
  });

  return formatted;
}

/**
 * Main function: Optimize prompt with relevant context
 * @param {string} promptText - The user's prompt
 * @param {object} profile - User profile with preferences
 * @param {boolean} useAI - Whether to use AI for selection (default: true)
 * @param {number} maxGems - Maximum number of gems to include (default: 5)
 * @returns {Promise<string>} Optimized prompt with context
 */
async function optimizePromptWithContext(promptText, profile, useAI = true, maxGems = 5) {
  try {
    // Extract data gems from profile
    const dataGems = profile?.content?.preferences?.items || [];

    // Filter out hidden items
    const visibleGems = dataGems.filter(gem => gem.state !== 'hidden');

    if (visibleGems.length === 0) {
      console.log('[Context Selector] No visible data gems found');
      return promptText;
    }

    console.log('[Context Selector] Analyzing', visibleGems.length, 'data gems');

    // Select relevant gems
    let selectedGems;
    if (useAI && typeof LanguageModel !== 'undefined') {
      selectedGems = await selectRelevantGemsWithAI(promptText, visibleGems, maxGems);
    } else {
      selectedGems = selectRelevantGemsByKeywords(promptText, visibleGems, maxGems);
    }

    console.log('[Context Selector] Selected', selectedGems.length, 'relevant gems');

    // Format and return
    return formatPromptWithContext(promptText, selectedGems);

  } catch (error) {
    console.error('[Context Selector] Error optimizing prompt:', error);
    return promptText; // Return original on error
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    selectRelevantCategoriesWithAI,
    filterGemsByCategories,
    selectRelevantGemsWithAI,
    selectRelevantGemsByKeywords,
    formatPromptWithContext,
    optimizePromptWithContext
  };
}
