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
Identify categories that could provide useful personal context for answering the user's request.

Rules:
1. Focus on the PRIMARY topic first (what the query is directly about)
2. Include supportive categories only if highly relevant
3. When in doubt, be INCLUSIVE rather than strict
4. Output 1-3 categories, ranked by confidence (1-10)
5. ALWAYS return at least 1 category if any connection exists

Examples:
- "healthy breakfast" → Nutrition(10), Health(7)
- "post-workout meal" → Nutrition(10), Fitness(6)  [primary = food, not exercise]
- "improve endurance" → Fitness(10), Sports(7), Health(6)
- "Paris for 3 days" → Travel(10)
- "project management tools" → Productivity(10), Work(7), Technology(6)

Output JSON only: [{"category":"Nutrition","score":10}]`
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
      console.log('[Context Selector] AI raw response type check:', categories.map(item => ({
        item,
        type: typeof item,
        hasCategory: item?.category !== undefined,
        hasScore: item?.score !== undefined,
        categoryType: typeof item?.category,
        scoreType: typeof item?.score
      })));

      // Validate and normalize format - expecting [{category, score}] or [{category, confidence}]
      const normalized = categories
        .filter(item => {
          // Handle both old format (string) and new format (object)
          if (typeof item === 'string') {
            console.warn('[Context Selector] Old format detected, converting:', item);
            return true;
          }

          // Check if item has required properties (accept both 'score' and 'confidence')
          const hasCategory = item && typeof item.category === 'string';
          const hasScore = typeof item.score === 'number';
          const hasConfidence = typeof item.confidence === 'number';
          const isValid = hasCategory && (hasScore || hasConfidence);

          if (!isValid && item) {
            console.warn('[Context Selector] Invalid category object:', item, {
              hasCategory,
              hasScore,
              hasConfidence
            });
          }

          return isValid;
        })
        .map(item => {
          // Convert old format to new format
          if (typeof item === 'string') {
            return { category: item, score: 8 }; // Default score for old format
          }

          // Accept both 'score' and 'confidence' properties
          const scoreValue = item.score !== undefined ? item.score : item.confidence;

          return {
            category: item.category,
            score: Math.max(1, Math.min(10, scoreValue)) // Clamp to 1-10
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
 * Use AI to identify relevant SubCategories for a prompt with confidence scores
 * @param {string} promptText - The user's prompt
 * @param {Array} availableSubCategories - Array of available SubCategory keys (e.g., ['fashion_style', 'fashion_brands'])
 * @param {Object} subCategoryRegistry - SubCategory registry with parent info
 * @returns {Promise<Array<{subCategory: string, score: number}>>} Array of {subCategory, score} objects
 */
async function selectRelevantSubCategoriesWithAI(promptText, availableSubCategories, subCategoryRegistry) {
  try {
    // Create AI session for SubCategory selection
    const session = await LanguageModel.create({
      language: 'en',
      systemPrompt: `You are a contextual SubCategory selector.
Select SubCategories that contain useful personal preferences for this query.

Rules:
1. Select SubCategories that are DIRECTLY relevant to the query topic
2. Include SubCategories that provide useful background context
3. Output 3-5 SubCategories, ranked by relevance (1-10)
4. When unsure, be INCLUSIVE - it's better to include than exclude

Examples:
- "healthy breakfast" + Nutrition subcats → nutrition_preferences(9), nutrition_diet(7)
- "post-workout meal" + Nutrition subcats → nutrition_preferences(9), nutrition_cooking(6)
- "improve endurance" + Fitness subcats → fitness_endurance(10), fitness_training(8)
- "comfortable shoes" + Fashion subcats → fashion_style(9), fashion_brands(7)

Output JSON only: [{"subCategory":"nutrition_preferences","score":9}]`
    });

    // Build human-readable SubCategory list
    const subCatDescriptions = availableSubCategories.map(key => {
      const info = subCategoryRegistry[key];
      return `${key} (${info.parent} > ${info.displayName})`;
    }).join(', ');

    const prompt = `User prompt: "${promptText}"

Available SubCategories: ${subCatDescriptions}

Select the most relevant SubCategories with confidence scores (1-10).
Only include SubCategories that are DIRECTLY related to the query topic.
Respond with JSON array only:`;

    console.log('[Context Selector] Asking AI for relevant SubCategories...');

    const response = await session.prompt(prompt);
    await session.destroy();

    // Parse response
    const cleaned = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const match = cleaned.match(/\[.*?\]/s);

    if (match) {
      const subCategories = JSON.parse(match[0]);
      console.log('[Context Selector] AI raw SubCategory response:', subCategories);
      console.log('[Context Selector] DEBUG: First item structure:', JSON.stringify(subCategories[0]));
      console.log('[Context Selector] DEBUG: Available SubCategories:', availableSubCategories);

      // Validate and normalize
      const normalized = subCategories
        .filter(item => {
          if (typeof item === 'string') {
            console.warn('[Context Selector] Old format detected, converting:', item);
            return availableSubCategories.includes(item);
          }

          // Handle both "subCategory" and "subcategory" (case insensitive)
          const subCatKey = item.subCategory || item.subcategory || item.SubCategory || item.sub_category;
          const scoreValue = item.score || item.confidence;

          const hasSubCategory = subCatKey && typeof subCatKey === 'string';
          const hasScore = typeof scoreValue === 'number';
          const isValid = hasSubCategory && hasScore && availableSubCategories.includes(subCatKey);

          if (!isValid && item) {
            console.warn('[Context Selector] Invalid SubCategory object:', item, {
              subCatKey,
              scoreValue,
              hasSubCategory,
              hasScore,
              inRegistry: availableSubCategories.includes(subCatKey)
            });
          }

          return isValid;
        })
        .map(item => {
          if (typeof item === 'string') {
            return { subCategory: item, score: 8 };
          }

          // Handle both "subCategory" and "subcategory"
          const subCatKey = item.subCategory || item.subcategory || item.SubCategory || item.sub_category;
          const scoreValue = item.score || item.confidence;

          return {
            subCategory: subCatKey,
            score: Math.max(1, Math.min(10, scoreValue))
          };
        });

      console.log('[Context Selector] AI selected SubCategories with confidence:', normalized);
      return normalized;
    }

    console.warn('[Context Selector] Could not parse SubCategory response:', response);
    return [];

  } catch (error) {
    console.error('[Context Selector] Error selecting SubCategories:', error);
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
 * Filter gems by SubCategories
 * @param {Array} dataGems - Array of preference objects
 * @param {Array<{subCategory: string, score: number}>} subCategoriesWithScores - SubCategories with confidence scores
 * @returns {Array} Filtered gems
 */
function filterGemsBySubCategories(dataGems, subCategoriesWithScores) {
  console.log('[Context Selector] Filtering gems by SubCategories:', subCategoriesWithScores);
  console.log('[Context Selector] Total gems before SubCategory filter:', dataGems.length);

  if (!subCategoriesWithScores || subCategoriesWithScores.length === 0) {
    console.log('[Context Selector] No SubCategories provided, returning all gems');
    return dataGems;
  }

  // Extract SubCategory keys
  const subCategoryKeys = subCategoriesWithScores.map(item => item.subCategory);
  console.log('[Context Selector] SubCategories:', subCategoryKeys);

  const filtered = dataGems.filter(gem => {
    if (!gem.subCollections || gem.subCollections.length === 0) {
      return false; // Skip gems without SubCategories
    }

    // Check if any of the gem's subCollections match the selected SubCategories
    const matches = gem.subCollections.some(sub =>
      subCategoryKeys.includes(sub)
    );

    return matches;
  });

  console.log('[Context Selector] Total gems after SubCategory filter:', filtered.length);

  // Log sample of filtered gems
  if (filtered.length > 0) {
    const samples = filtered.slice(0, 3).map(g => ({
      collections: g.collections,
      subCollections: g.subCollections,
      value: g.value.substring(0, 50) + '...'
    }));
    console.log('[Context Selector] Sample SubCategory-filtered gems:', samples);
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
async function selectRelevantGemsWithAI(promptText, dataGems, maxResults = 5, profile = null) {
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
      let relevantCategories = await selectRelevantCategoriesWithAI(promptText, allCategories);

      // OPTIMIZATION: Select all high-confidence categories (score ≥7)
      // This balances precision with recall
      if (relevantCategories.length > 0) {
        const highConfidenceCategories = relevantCategories.filter(cat => cat.score >= 7);

        if (highConfidenceCategories.length > 0) {
          relevantCategories = highConfidenceCategories;
          console.log(`[Context Selector] Selected ${relevantCategories.length} high-confidence categories (≥7):`,
            relevantCategories.map(c => `${c.category}(${c.score})`).join(', '));
        } else {
          // Fallback: If no category scored ≥7, take top 1
          relevantCategories = [relevantCategories[0]];
          console.log(`[Context Selector] No high-confidence categories, using TOP 1: ${relevantCategories[0].category} (${relevantCategories[0].score})`);
        }
      }

      if (relevantCategories.length > 0) {
        // Filter gems by relevant categories
        candidateGems = filterGemsByCategories(dataGems, relevantCategories);
        console.log(`[Context Selector] Filtered to ${candidateGems.length} gems in ${relevantCategories.length} relevant categories`);

        // STAGE 1.5: SubCategory Filtering (ALL categories)
        if (profile?.subCategoryRegistry && candidateGems.length > 0) {
          // Get all SubCategories that belong to the selected Main Categories
          const selectedCategoryNames = relevantCategories.map(c => c.category);
          const availableSubCategories = Object.keys(profile.subCategoryRegistry).filter(subCatKey => {
            const subCatInfo = profile.subCategoryRegistry[subCatKey];
            return selectedCategoryNames.includes(subCatInfo.parent);
          });

          console.log(`[Context Selector] Stage 1.5: Found ${availableSubCategories.length} SubCategories for selected categories`);

          if (availableSubCategories.length > 0) {
            // Ask AI which SubCategories are relevant
            const relevantSubCategories = await selectRelevantSubCategoriesWithAI(
              promptText,
              availableSubCategories,
              profile.subCategoryRegistry
            );

            if (relevantSubCategories.length > 0) {
              // Filter by high-confidence SubCategories (≥6)
              const highConfidenceSubCategories = relevantSubCategories.filter(sub => sub.score >= 6);

              if (highConfidenceSubCategories.length > 0) {
                console.log(`[Context Selector] Stage 1.5: Selected ${highConfidenceSubCategories.length} high-confidence SubCategories (≥6):`,
                  highConfidenceSubCategories.map(s => `${s.subCategory}(${s.score})`).join(', '));

                // Filter gems by selected SubCategories
                const subCategoryFiltered = filterGemsBySubCategories(candidateGems, highConfidenceSubCategories);

                // Only apply SubCategory filter if it returns at least 3 gems
                if (subCategoryFiltered.length >= 3) {
                  candidateGems = subCategoryFiltered;
                  console.log(`[Context Selector] Stage 1.5: Reduced to ${candidateGems.length} gems (${((1 - candidateGems.length / filterGemsByCategories(dataGems, relevantCategories).length) * 100).toFixed(1)}% reduction)`);
                } else {
                  console.log(`[Context Selector] Stage 1.5: Only ${subCategoryFiltered.length} gems after SubCategory filter, keeping all ${candidateGems.length} category-filtered gems`);
                }
              } else {
                console.log(`[Context Selector] Stage 1.5: No high-confidence SubCategories (all < 6), skipping SubCategory filter`);
              }
            } else {
              console.log(`[Context Selector] Stage 1.5: AI returned no relevant SubCategories`);
            }
          }
        }

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

        // Log sample enrichment
        console.log('[Context Selector] Sample enriched gems:', candidateGems.slice(0, 3).map(g => ({
          collections: g.collections,
          subCollections: g.subCollections,
          matchedCategory: g._matchedCategory,
          confidence: g._categoryConfidence,
          value: g.value.substring(0, 50) + '...'
        })));
      } else {
        console.log('[Context Selector] AI returned no categories, using all gems');
      }
    } else {
      console.log('[Context Selector] No categories found, processing all gems');
    }

    // SMART PRE-FILTER: Reduce to top candidates before AI scoring
    const MAX_AI_SCORING = 30; // Score max 30 gems with AI (~30 seconds)

    if (candidateGems.length > MAX_AI_SCORING) {
      console.log(`[Context Selector] Too many gems (${candidateGems.length}), pre-filtering to ${MAX_AI_SCORING}`);

      // Priority 1: Favorited gems (always include)
      const favorited = candidateGems.filter(gem => gem.state === 'favorited');

      // Priority 2: Keyword matching on ALL category-filtered gems
      // (Since we now use TOP 1 category, all gems have same confidence)
      const nonFavorited = candidateGems.filter(gem => gem.state !== 'favorited');
      const keywordMatched = selectRelevantGemsByKeywords(
        promptText,
        nonFavorited,
        MAX_AI_SCORING - favorited.length
      );

      candidateGems = [...favorited, ...keywordMatched].slice(0, MAX_AI_SCORING);
      console.log(`[Context Selector] Pre-filtered to ${candidateGems.length} gems (${favorited.length} favorited, ${keywordMatched.length} keyword-matched)`);
    } else {
      console.log(`[Context Selector] Will score all ${candidateGems.length} category-filtered gems with AI`);
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
      systemPrompt: `You are a helpful assistant that rates relevance.

Rate how relevant data is to a user's request on a 0-10 scale:
- 10: Perfectly matches their need
- 7-9: Very helpful and relevant
- 4-6: Somewhat related
- 1-3: Barely related
- 0: Not related at all

Think about semantic meaning, not just keywords.

Provide your rating and optionally a brief reason.`
    });

    // Score each candidate gem SEQUENTIALLY (not parallel - AI sessions don't handle parallel well)
    const scoredGems = [];

    console.log(`[Context Selector] Scoring ALL ${candidateGems.length} filtered gems`);

    for (let index = 0; index < candidateGems.length; index++) {
      const gem = candidateGems[index];
      try {
        // Build prompt with category context
        const category = gem._matchedCategory || 'unknown';
        const categoryConfidence = gem._categoryConfidence || 5;

        const prompt = `Task: Rate how useful this personal data would be as CONTEXT for an AI assistant answering the user's request.

Context is useful if it helps the AI understand the user's preferences, background, or constraints - even if it doesn't directly answer the question.

User request: "${promptText}"

Personal data: "${gem.value.substring(0, 200)}"

Relevance scale:
- 10 = Extremely useful context (directly relevant to preferences/needs)
- 7-9 = Very useful context (helps understand user's style/preferences)
- 4-6 = Somewhat useful (provides background but not critical)
- 1-3 = Minimally useful (weak connection)
- 0 = Not useful (completely unrelated)

Examples:
- Request: "recommend shoes" + Data: "favorite shoe: white sneakers" → 9 (shows preferences!)
- Request: "recommend shoes" + Data: "favorite color: blue" → 5 (background info)
- Request: "recommend shoes" + Data: "favorite food: pizza" → 0 (unrelated)

Your rating (just the number):`;

        // Debug: log first 10 gems, then every 50th
        if (index < 10 || index % 50 === 0) {
          console.log(`[Context Selector] Gem ${index + 1}/${candidateGems.length}:`, {
            category,
            categoryConfidence,
            gemValue: gem.value.substring(0, 80) + '...'
          });
        }

        // NO TIMEOUT for testing - let AI take as long as it needs
        const response = await session.prompt(prompt);

        // More robust parsing - extract number from natural language
        const cleaned = response.trim();

        // Try to find a score in format "8/10", "score: 7", "rating: 9", or just "5"
        let score = 0;

        // Check for "X/10" or "X out of 10" pattern first
        const outOfTenMatch = cleaned.match(/(\d+)\s*(?:\/|out of)\s*10/i);
        if (outOfTenMatch) {
          score = parseInt(outOfTenMatch[1]);
        } else {
          // Look for any number 0-10
          const numbers = cleaned.match(/\d+/g);
          if (numbers) {
            // Find first number that's 0-10
            for (const num of numbers) {
              const n = parseInt(num);
              if (n >= 0 && n <= 10) {
                score = n;
                break;
              }
            }
          }
        }

        // Debug logging for first 10 gems, then every 50th
        if (index < 10 || index % 50 === 0) {
          console.log(`[Context Selector] Gem ${index + 1} Score: ${score}`, cleaned.length > 50 ? `(response: ${cleaned.substring(0, 50)}...)` : `(response: ${cleaned})`);
        }

        // Log high-scoring gems (≥7)
        if (score >= 7) {
          console.log(`[Context Selector] ✓ HIGH SCORE ${score}: "${gem.value.substring(0, 80)}..."`);
        }

        scoredGems.push({
          gem,
          score: isNaN(score) ? 0 : Math.min(score, 10) // Cap at 10
        });
      } catch (error) {
        console.warn('[Context Selector] Error scoring gem:', error);
        scoredGems.push({ gem, score: 0 });
      }
    }

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

    // NO MATCH DETECTION: If no gems scored ≥7, the query is likely irrelevant
    // Return empty to avoid adding random context
    const highQualityCount = scoredGems.filter(item => item.score >= 7).length;

    if (highQualityCount === 0) {
      console.log('[Context Selector] ⚠️ No gems scored ≥7, query appears irrelevant to profile');
      console.log('[Context Selector] Returning empty to avoid irrelevant context');
      return [];
    }

    // STRICT CUTOFF: Only use high-quality matches (≥7)
    let results = scoredGems
      .filter(item => item.score >= 7)
      .slice(0, maxResults)
      .map(item => item.gem);

    console.log(`[Context Selector] Found ${results.length} gems with score ≥7`);

    // Deduplicate gems by ID to prevent repetition
    const seenIds = new Set();
    const beforeDedup = results.length;
    results = results.filter(gem => {
      if (seenIds.has(gem.id)) {
        console.log(`[Context Selector] Skipping duplicate gem: ${gem.value.substring(0, 40)}...`);
        return false;
      }
      seenIds.add(gem.id);
      return true;
    });

    if (beforeDedup !== results.length) {
      console.log(`[Context Selector] Removed ${beforeDedup - results.length} duplicate gems`);
    }

    console.log(`[Context Selector] Selected ${results.length} unique gems (scores: ${scoredGems.slice(0, 5).map(s => s.score).join(', ')}...)`);

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

  // Start with original prompt
  let formatted = `${originalPrompt}\n\n`;

  // Add introductory text
  formatted += `Please consider the following personal information about me:\n\n`;

  selectedGems.forEach(gem => {
    // Determine type from collections or use generic "context"
    let type = 'context';
    if (gem.collections && gem.collections.length > 0) {
      type = gem.collections[0].toLowerCase().replace(/\s+/g, '_');
    }

    // Format the value with more complete information
    let value = gem.value.trim();

    // If multiline, include more content but format compactly
    const lines = value.split('\n').filter(line => line.trim().length > 0);
    if (lines.length > 1) {
      // For structured data (like Training/Protein logs), include all items
      value = lines[0]; // Title/header line

      // Include all data lines (up to 8 items to keep it reasonable)
      if (lines.length > 1) {
        const dataLines = lines.slice(1, Math.min(lines.length, 9));
        // Use line breaks within the gem data
        value = `${value}\n${dataLines.join('\n')}`;
      }
    }

    // More generous character limit for structured data
    if (value.length > 400) {
      // Try to cut at a natural line break
      const truncated = value.substring(0, 397);
      const lastNewline = truncated.lastIndexOf('\n');
      if (lastNewline > 200) {
        value = value.substring(0, lastNewline) + '\n...';
      } else {
        value = truncated + '...';
      }
    }

    // Format: @type value (each gem on new line with blank line between)
    formatted += `@${type} ${value}\n\n`;
  });

  return formatted.trim(); // Remove trailing newlines
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
      selectedGems = await selectRelevantGemsWithAI(promptText, visibleGems, maxGems, profile);
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
    selectRelevantSubCategoriesWithAI,
    filterGemsByCategories,
    filterGemsBySubCategories,
    selectRelevantGemsWithAI,
    selectRelevantGemsByKeywords,
    formatPromptWithContext,
    optimizePromptWithContext
  };
}
