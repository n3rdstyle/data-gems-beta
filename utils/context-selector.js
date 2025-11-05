/**
 * Context Selector
 * Selects the most relevant Data Gems for a given prompt
 */

/**
 * Use AI to identify relevant categories for a prompt with confidence scores
 * @param {string} promptText - The user's prompt
 * @param {Array} allCategories - Array of all available categories
 * @returns {Promise<Array<{category: string, score: number}>>} Array of {category, score} objects
 */
async function selectRelevantCategoriesWithAI(promptText, allCategories) {
  try {
    // Create AI session for category selection
    const session = await LanguageModel.create({
      language: 'en',
      systemPrompt: `You are a contextual category selector.
Your goal is to identify all categories that are semantically or contextually relevant
to the user's prompt, including both direct and supportive connections.

Rules:
1. Include a category if the prompt implies its topic, even indirectly.
   Example: "prepare for summer" implies "Training" and "Nutrition".
2. Prefer precision but do not abstain when weak signals exist.
3. Output up to 3 categories, ranked by confidence (1–10).
4. If no category shows any connection, return [].

Output format (JSON array of objects):
[{"category":"Training","score":9},
 {"category":"Nutrition","score":6}]

Purpose: map the prompt into specific, atomic knowledge domains.`
    });

    const categoriesStr = allCategories.join(', ');
    const prompt = `User prompt: "${promptText}"

Available categories: ${categoriesStr}

Select relevant categories with confidence scores (1-10). Include both direct and supportive connections.
Respond with JSON array only:`;

    console.log('[Context Selector] Asking AI for relevant categories...');

    const response = await session.prompt(prompt);
    await session.destroy();

    // Parse response
    const cleaned = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const match = cleaned.match(/\[.*?\]/s);

    if (match) {
      const categories = JSON.parse(match[0]);
      console.log('[Context Selector] AI raw response:', categories);

      // Validate and normalize format - expecting [{category, score}]
      const normalized = categories
        .filter(item => {
          // Handle both old format (string) and new format (object)
          if (typeof item === 'string') {
            console.warn('[Context Selector] Old format detected, converting:', item);
            return true;
          }
          return item && typeof item.category === 'string' && typeof item.score === 'number';
        })
        .map(item => {
          // Convert old format to new format
          if (typeof item === 'string') {
            return { category: item, score: 8 }; // Default score for old format
          }
          return {
            category: item.category,
            score: Math.max(1, Math.min(10, item.score)) // Clamp to 1-10
          };
        });

      console.log('[Context Selector] AI selected categories with confidence:', normalized);
      return normalized;
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
 * @param {Array<{category: string, score: number}>} categoriesWithScores - Categories with confidence scores
 * @returns {Array} Filtered gems
 */
function filterGemsByCategories(dataGems, categoriesWithScores) {
  console.log('[Context Selector] Filtering gems by categories:', categoriesWithScores);
  console.log('[Context Selector] Total gems before filter:', dataGems.length);

  if (!categoriesWithScores || categoriesWithScores.length === 0) {
    console.log('[Context Selector] No categories provided, returning all gems');
    return dataGems;
  }

  // Extract category names (lowercase) for matching
  const categoriesLower = categoriesWithScores.map(item => item.category.toLowerCase());
  console.log('[Context Selector] Categories (lowercase):', categoriesLower);

  const filtered = dataGems.filter(gem => {
    if (!gem.collections || gem.collections.length === 0) {
      return false; // Skip gems without categories
    }

    // Check if any of the gem's collections match the selected categories
    const matches = gem.collections.some(col =>
      categoriesLower.includes(col.toLowerCase())
    );

    return matches;
  });

  console.log('[Context Selector] Total gems after filter:', filtered.length);

  // Log sample of filtered gems
  if (filtered.length > 0) {
    const samples = filtered.slice(0, 3).map(g => ({
      collections: g.collections,
      value: g.value.substring(0, 50) + '...'
    }));
    console.log('[Context Selector] Sample filtered gems:', samples);
  }

  return filtered;
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

        // Enrich each gem with its matching category and confidence score
        // A gem might match multiple categories - use the one with highest confidence
        candidateGems = candidateGems.map(gem => {
          const matchingCategories = relevantCategories.filter(catInfo =>
            gem.collections && gem.collections.some(col =>
              col.toLowerCase() === catInfo.category.toLowerCase()
            )
          );

          // Find the highest confidence category
          const bestMatch = matchingCategories.reduce((best, current) =>
            current.score > best.score ? current : best
          , matchingCategories[0] || { category: 'unknown', score: 5 });

          return {
            ...gem,
            _matchedCategory: bestMatch.category,
            _categoryConfidence: bestMatch.score
          };
        });
      } else {
        console.log('[Context Selector] AI returned no categories, using all gems');
      }
    } else {
      console.log('[Context Selector] No categories found, processing all gems');
    }

    // NO KEYWORD PRE-FILTER - Score all category-filtered gems with AI (testing phase)
    console.log(`[Context Selector] Will score all ${candidateGems.length} category-filtered gems with AI (no pre-filter)`);

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
      systemPrompt: `You are a contextual relevance scorer.
Given a user prompt, its category, and one data gem, rate how relevant the gem is
to the user's intent and context.

Rules:
1. Rate semantic relevance on a 0–10 scale.
   - 9–10: Directly fulfills or specifies the core intent.
   - 6–8 : Indirectly supports it or adds meaningful context.
   - 3–5 : Loosely related or situational.
   - 0–2 : Not relevant.
2. Use both explicit and implied meaning, not keyword overlap.
3. Optionally use the provided category_confidence as a weak signal of overall contextual fit.
4. Output only a single number from 0 to 10 — no text, no explanation, no markdown.

Examples:
prompt = "plan my workout"
category = "Training"
gem = "Bench Press 3x10"          → 9
gem = "Protein intake: 160g/day"  → 7
gem = "Favorite cuisine: Italian" → 0`
    });

    // Score each candidate gem with timeout per gem
    const scoredGems = await Promise.all(
      candidateGems.map(async (gem, index) => {
        try {
          // Build prompt with category context
          const category = gem._matchedCategory || 'unknown';
          const categoryConfidence = gem._categoryConfidence || 5;

          const prompt = `prompt = "${promptText}"
category = "${category}"
category_confidence = ${categoryConfidence}
gem = "${gem.value}"

Relevance score:`;

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

    // Sort by score (highest first)
    scoredGems.sort((a, b) => b.score - a.score);

    // Log score distribution
    const scoreDistribution = scoredGems.reduce((acc, item) => {
      const bucket = Math.floor(item.score / 2) * 2; // Group by 0-1, 2-3, 4-5, etc.
      acc[bucket] = (acc[bucket] || 0) + 1;
      return acc;
    }, {});
    console.log('[Context Selector] Score distribution:', scoreDistribution);

    // STRICT CUTOFF: Try ≥7 first (high-quality matches)
    let results = scoredGems
      .filter(item => item.score >= 7)
      .slice(0, maxResults)
      .map(item => item.gem);

    console.log(`[Context Selector] Found ${results.length} gems with score ≥7`);

    // FALLBACK 1: If too few results, try ≥5 (medium-quality matches)
    if (results.length < 3) {
      console.log('[Context Selector] Too few high-quality results, trying score ≥5');
      results = scoredGems
        .filter(item => item.score >= 5)
        .slice(0, maxResults)
        .map(item => item.gem);
      console.log(`[Context Selector] Found ${results.length} gems with score ≥5`);
    }

    // FALLBACK 2: If still too few, use keyword matching
    if (results.length === 0 && candidateGems.length > 0) {
      console.log('[Context Selector] AI scored all gems as 0, trying fallback strategies...');

      // Try keyword matching on the category-filtered gems (but with stricter threshold)
      const keywordResults = selectRelevantGemsByKeywords(promptText, candidateGems, maxResults);

      // Only use keyword results if they have decent scores
      if (keywordResults.length > 0) {
        console.log(`[Context Selector] Keyword matching found ${keywordResults.length} potential gems`);
        results = keywordResults;
      } else {
        // No good keyword matches - try favorited gems
        const favorited = candidateGems.filter(gem => gem.state === 'favorited').slice(0, maxResults);
        if (favorited.length > 0) {
          console.log(`[Context Selector] Using ${favorited.length} favorited gems`);
          results = favorited;
        } else {
          // Give up - return empty rather than random irrelevant gems
          console.log('[Context Selector] No relevant gems found, returning empty');
          results = [];
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
  console.log(`[Context Selector] Keyword matching on ${dataGems.length} gems for prompt: "${promptText}"`);

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

  console.log('[Context Selector] Extracted keywords:', keywords);

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
  const results = scoredGems
    .filter(item => item.score > 0) // Only include items with some relevance
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  console.log(`[Context Selector] Keyword matching found ${results.length} gems with scores:`,
    results.slice(0, 5).map(r => ({
      score: r.score,
      collections: r.gem.collections,
      value: r.gem.value.substring(0, 40) + '...'
    }))
  );

  return results.map(item => item.gem);
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
