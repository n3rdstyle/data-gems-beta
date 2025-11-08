/**
 * Context Selector
 * Selects the most relevant Data Gems for a given prompt
 */

/**
 * Enrich data gems with basic profile information
 * Converts .basic.identity fields to characteristic gems
 * @param {Object} profile - HSP profile
 * @returns {Array} Combined array of preference gems + basic info gems
 */
function enrichGemsWithBasicInfo(profile) {
  const gems = profile?.content?.preferences?.items || [];
  const basicInfo = profile?.content?.basic?.identity || {};

  const basicGems = [];

  // Location (critical for restaurants, travel, local services)
  if (basicInfo.location?.value) {
    basicGems.push({
      id: 'basic_location',
      value: `Lives in: ${basicInfo.location.value}`,
      collections: ['Identity'],
      subCollections: ['identity_location'],
      semanticType: 'characteristic',
      attribute: 'current_location',
      attributeValue: basicInfo.location.value,
      assurance: 'self_declared',
      reliability: 'authoritative',
      state: 'default',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  // Age (affects recommendations)
  if (basicInfo.age?.value) {
    basicGems.push({
      id: 'basic_age',
      value: `Age: ${basicInfo.age.value}`,
      collections: ['Identity'],
      subCollections: ['identity_basic'],
      semanticType: 'characteristic',
      attribute: 'age',
      attributeValue: basicInfo.age.value.toString(),
      assurance: 'self_declared',
      reliability: 'authoritative',
      state: 'default',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  // Languages (keyboard, content, regional preferences)
  if (basicInfo.languages?.value) {
    const langs = Array.isArray(basicInfo.languages.value)
      ? basicInfo.languages.value.join(', ')
      : basicInfo.languages.value;
    basicGems.push({
      id: 'basic_languages',
      value: `Speaks: ${langs}`,
      collections: ['Identity'],
      subCollections: ['identity_skills'],
      semanticType: 'characteristic',
      attribute: 'languages',
      attributeValue: langs,
      assurance: 'self_declared',
      reliability: 'authoritative',
      state: 'default',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  // Gender (affects recommendations)
  if (basicInfo.gender?.value) {
    basicGems.push({
      id: 'basic_gender',
      value: `Gender: ${basicInfo.gender.value}`,
      collections: ['Identity'],
      subCollections: ['identity_basic'],
      semanticType: 'characteristic',
      attribute: 'gender',
      attributeValue: basicInfo.gender.value,
      assurance: 'self_declared',
      reliability: 'authoritative',
      state: 'default',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  if (basicGems.length > 0) {
    console.log(`[Context Selector] Enriched with ${basicGems.length} basic info gems:`,
      basicGems.map(g => g.attribute).join(', '));
  }

  return [...basicGems, ...gems];
}

/**
 * Analyze query using AI to detect intent and requirements
 * @param {string} query - User's query
 * @returns {Promise<Object>} Query intent object
 */
async function analyzeQueryIntent(query) {
  const lowerQuery = query.toLowerCase();

  // Default intent (fallback)
  let type = 'information';
  let domain = null;

  try {
    // Use AI to analyze query intent
    const session = await LanguageModel.create({
      language: 'en',
      systemPrompt: `You are a query classifier. Select the best matching type and domain from the provided lists.

CRITICAL RULES:
1. ONLY use values from the lists provided - DO NOT invent new values
2. Return EXACTLY this format: {"type": "VALUE_FROM_TYPE_LIST", "domain": "VALUE_FROM_DOMAIN_LIST"}
3. DO NOT add extra fields, DO NOT modify field names
4. Pick the CLOSEST match even if not perfect

Examples showing correct selection:
- "Find me a café" → {"type": "recommendation", "domain": "nutrition"}
- "I need sneakers" → {"type": "shopping", "domain": "fashion"}
- "Plan workout" → {"type": "planning", "domain": "fitness"}
- "What is React?" → {"type": "information", "domain": "technology"}

Output JSON only: {"type": "...", "domain": "..."}`
    });

    const typeList = 'shopping, recommendation, planning, information';
    const domainList = 'fashion, nutrition, technology, fitness, travel, null';

    const response = await session.prompt(`User query: "${query}"

Available type values: ${typeList}
Available domain values: ${domainList}

Select the best matching type and domain from the lists above.
Return JSON only:`);

    await session.destroy();

    console.log('[Context Selector] AI raw response:', response);

    // Parse JSON response
    const cleaned = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const jsonMatch = cleaned.match(/\{[^}]+\}/);

    if (jsonMatch) {
      console.log('[Context Selector] Extracted JSON:', jsonMatch[0]);
      const result = JSON.parse(jsonMatch[0]);

      // Check if required fields exist
      if (!result.hasOwnProperty('type') || !result.hasOwnProperty('domain')) {
        console.warn('[Context Selector] AI returned JSON with wrong field names:', Object.keys(result).join(', '));
        console.warn('[Context Selector] Expected fields: "type", "domain"');
        throw new Error('Invalid JSON field names');
      }

      // Validate type
      const validTypes = ['shopping', 'recommendation', 'planning', 'information'];
      if (validTypes.includes(result.type)) {
        type = result.type;
      } else {
        console.warn('[Context Selector] AI returned invalid type:', result.type);
        throw new Error('Invalid type value');
      }

      // Validate domain
      const validDomains = ['fashion', 'nutrition', 'technology', 'fitness', 'travel'];
      if (validDomains.includes(result.domain)) {
        domain = result.domain;
      } else if (result.domain === null) {
        domain = null;
      } else {
        console.warn('[Context Selector] AI returned invalid domain:', result.domain);
        throw new Error('Invalid domain value');
      }

      console.log('[Context Selector] ✓ AI detected intent:', { type, domain });
    } else {
      console.warn('[Context Selector] AI response not JSON, using fallback. Response:', response.substring(0, 200));
      throw new Error('Invalid JSON response');
    }
  } catch (error) {
    console.warn('[Context Selector] AI intent detection failed, using regex fallback:', error);

    // FALLBACK: Regex patterns (in case AI fails)
    if (lowerQuery.match(/recommend|suggest|best|top|good|which|what.*should|find (me |us )?(a |an |the )?(café|restaurant|place|bar|hotel|gym)/i)) {
      type = 'recommendation';
    } else if (lowerQuery.match(/plan|schedule|organize|prepare|help me (plan|organize)/i)) {
      type = 'planning';
    } else if (lowerQuery.match(/buy|purchase|shop|need (a |an |the )?(new )?(shoe|sneaker|laptop|phone|shirt|product)|get (a |an |the )?(new )?(shoe|laptop|phone)|want to buy/i)) {
      type = 'shopping';
    }

    if (lowerQuery.match(/shoe|sneaker|boot|clothing|shirt|pant|jacket|dress|fashion|wear/i)) {
      domain = 'fashion';
    } else if (lowerQuery.match(/food|restaurant|meal|diet|eat|dinner|lunch|breakfast|cuisine|café|cafe|coffee|bar|bistro|bakery/i)) {
      domain = 'nutrition';
    } else if (lowerQuery.match(/laptop|computer|phone|device|tech|software|app/i)) {
      domain = 'technology';
    } else if (lowerQuery.match(/workout|exercise|fitness|gym|run|train|sport/i)) {
      domain = 'fitness';
    } else if (lowerQuery.match(/travel|trip|vacation|hotel|flight|destination/i)) {
      domain = 'travel';
    }
  }

  // Detect budget mention (regex is fine for numbers)
  const budgetMatch = lowerQuery.match(/(\d+)\s*€|under\s*(\d+)|max\s*(\d+)|budget.*?(\d+)/i);
  const budget = budgetMatch ? parseInt(budgetMatch[1] || budgetMatch[2] || budgetMatch[3] || budgetMatch[4]) : null;

  // Required semantic types by query type
  const requiredTypes = {
    shopping: ['constraint', 'preference', 'characteristic'],
    planning: ['goal', 'activity', 'preference'],
    recommendation: ['preference', 'constraint', 'characteristic'],
    information: ['characteristic', 'preference']
  };

  // Critical constraints by domain (for shopping/recommendation)
  let criticalConstraints = [];
  if (domain === 'fashion') criticalConstraints = ['budget', 'size'];
  else if (domain === 'technology') criticalConstraints = ['budget'];
  else if (domain === 'nutrition') criticalConstraints = ['budget', 'dietary', 'location'];
  else if (domain === 'travel') criticalConstraints = ['budget', 'location'];

  const intent = {
    type,
    domain,
    budget,
    requiredSemanticTypes: requiredTypes[type] || ['preference'],
    needsConstraints: type === 'shopping' || type === 'recommendation',
    criticalConstraints: (type === 'shopping' || type === 'recommendation') ? criticalConstraints : []
  };

  console.log('[Context Selector] Final intent:', JSON.stringify(intent));

  return intent;
}

/**
 * Calculate semantic type boost based on query intent
 * @param {string} semanticType - Gem's semantic type
 * @param {Object} queryIntent - Analyzed query intent
 * @returns {number} Boost value to add to score
 */
function getSemanticBoost(semanticType, queryIntent) {
  if (!semanticType) return 0;

  // Base semantic boost (applies to all queries)
  let boost = 0;
  if (semanticType === 'constraint') boost = 5;
  else if (semanticType === 'preference') boost = 3;
  else if (semanticType === 'characteristic') boost = 1;
  else if (semanticType === 'activity') boost = 1;
  else if (semanticType === 'goal') boost = 1;

  // Query-specific boost
  let queryBoost = 0;
  if (queryIntent.type === 'shopping') {
    // Shopping: constraints are CRITICAL
    if (semanticType === 'constraint') queryBoost = 2;
    if (semanticType === 'preference') queryBoost = 1;
  } else if (queryIntent.type === 'planning') {
    // Planning: goals and activities are important
    if (semanticType === 'goal') queryBoost = 2;
    if (semanticType === 'activity') queryBoost = 1;
  } else if (queryIntent.type === 'recommendation') {
    // Recommendation: preferences and constraints
    if (semanticType === 'preference') queryBoost = 2;
    if (semanticType === 'constraint') queryBoost = 1;
  }

  return boost + queryBoost;
}

/**
 * Check if an activity gem is relevant to the query context
 * @param {Object} gem - Data gem
 * @param {string} originalQuery - Original user query
 * @param {Object} queryIntent - Query intent object
 * @returns {boolean} True if relevant
 */
function isActivityRelevantToQuery(gem, originalQuery, queryIntent) {
  // For shopping queries, only include activities that affect product choice
  if (queryIntent.type === 'shopping') {
    const query = originalQuery.toLowerCase();
    const value = gem.value.toLowerCase();

    // Workout time is NOT relevant to BUYING products (only to USING them)
    if (value.includes('workout time') || value.includes('wake-up time')) {
      return false;
    }

    // Frequency activities are relevant if they relate to the product
    if (queryIntent.domain === 'fitness' && value.match(/runs?|workout|exercise|gym/i)) {
      return true; // Running frequency IS relevant to buying running shoes
    }

    if (queryIntent.domain === 'fashion' && value.match(/shop|wear|dress/i)) {
      return true; // Shopping frequency IS relevant
    }

    // Most other activities are not relevant to shopping
    return false;
  }

  // For planning/recommendation queries, activities are relevant
  return true;
}

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

CRITICAL RULES:
1. ONLY select categories from the "Available categories" list provided
2. NEVER invent or guess category names - use EXACT names from the list
3. Focus on the PRIMARY topic first (what the query is directly about)
4. Include supportive categories only if highly relevant
5. When in doubt, be INCLUSIVE rather than strict
6. Output 1-3 categories, ranked by confidence (1-10)
7. ALWAYS return at least 1 category if any connection exists

Examples (categories shown are examples - use actual provided list):
- "healthy breakfast" + list contains "Nutrition" → Nutrition(10), Health(7)
- "post-workout meal" + list contains "Nutrition" → Nutrition(10), Fitness(6)
- "improve endurance" + list contains "Fitness" → Fitness(10), Sports(7), Health(6)
- "cuisine" + list contains "Nutrition" (not "Food") → Nutrition(10)
- "Paris for 3 days" + list contains "Travel" → Travel(10)

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

          // Check if item has required properties (accept 'score', 'confidence', or 'confidence_score')
          const hasCategory = item && typeof item.category === 'string';
          const hasScore = typeof item.score === 'number';
          const hasConfidence = typeof item.confidence === 'number';
          const hasConfidenceScore = typeof item.confidence_score === 'number';
          const isValid = hasCategory && (hasScore || hasConfidence || hasConfidenceScore);

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

          // Accept 'score', 'confidence', or 'confidence_score' properties
          const scoreValue = item.score !== undefined ? item.score : (item.confidence !== undefined ? item.confidence : item.confidence_score);

          return {
            category: item.category,
            score: Math.max(1, Math.min(10, scoreValue)) // Clamp to 1-10
          };
        });

      // CRITICAL: Validate that selected categories actually exist in allCategories
      const validCategories = normalized.filter(item => {
        const exists = allCategories.includes(item.category);
        if (!exists) {
          console.warn(`[Context Selector] ⚠️  AI selected non-existent category "${item.category}" - rejecting (available: ${allCategories.join(', ')})`);
        }
        return exists;
      });

      console.log('[Context Selector] AI selected categories with confidence:', validCategories);
      return validCategories;
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
 * @param {string} promptText - The user's prompt (sub-question)
 * @param {Array} availableSubCategories - Array of available SubCategory keys (e.g., ['fashion_style', 'fashion_brands'])
 * @param {Object} subCategoryRegistry - SubCategory registry with parent info
 * @param {string} originalQuery - The original user query for context (optional)
 * @returns {Promise<Array<{subCategory: string, score: number}>>} Array of {subCategory, score} objects
 */
async function selectRelevantSubCategoriesWithAI(promptText, availableSubCategories, subCategoryRegistry, originalQuery = null) {
  try {
    // Create AI session for SubCategory selection
    const session = await LanguageModel.create({
      language: 'en',
      systemPrompt: `You are a contextual SubCategory selector.
Select SubCategories that contain useful personal preferences for this query.

CRITICAL: You receive TWO pieces of context:
1. Original request - the user's actual goal/question
2. Specific aspect - what particular information we're looking for

Score SubCategories based on relevance to the ORIGINAL REQUEST, using the specific aspect as a filter.

Rules:
1. Select SubCategories that are DIRECTLY relevant to the ORIGINAL REQUEST topic
2. Include SubCategories that provide useful background context
3. Output 3-5 SubCategories, ranked by relevance (1-10)
4. When unsure, be INCLUSIVE - it's better to include than exclude
5. Consider domain-specific subcategories (e.g., "eatingout" for restaurants, not just "diet")

Examples:
- Original: "healthy breakfast" + Aspect: "nutrition preferences" → nutrition_preferences(9), nutrition_diet(7)
- Original: "post-workout meal" + Aspect: "nutrition preferences" → nutrition_preferences(9), nutrition_cooking(6)
- Original: "restaurant recommendation" + Aspect: "dietary restrictions" → nutrition_eatingout(10), nutrition_preferences(7)
- Original: "improve endurance" + Aspect: "fitness habits" → fitness_endurance(10), fitness_training(8)
- Original: "comfortable shoes" + Aspect: "style preferences" → fashion_style(9), fashion_brands(7)

Output JSON only: [{"subCategory":"nutrition_preferences","score":9}]`
    });

    // Build human-readable SubCategory list
    const subCatDescriptions = availableSubCategories.map(key => {
      const info = subCategoryRegistry[key];
      return `${key} (${info.parent} > ${info.displayName})`;
    }).join(', ');

    // Build prompt with original query context if available
    let prompt;
    if (originalQuery) {
      prompt = `Original request: "${originalQuery}"
Specific aspect: "${promptText}"

Available SubCategories: ${subCatDescriptions}

Select the most relevant SubCategories with confidence scores (1-10).
Score based on relevance to the ORIGINAL REQUEST, using the specific aspect as guidance.
Respond with JSON array only:`;
    } else {
      prompt = `User prompt: "${promptText}"

Available SubCategories: ${subCatDescriptions}

Select the most relevant SubCategories with confidence scores (1-10).
Only include SubCategories that are DIRECTLY related to the query topic.
Respond with JSON array only:`;
    }

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
          const scoreValue = item.score || item.confidence || item.confidence_score || item.confidenceScore;

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
          const scoreValue = item.score || item.confidence || item.confidence_score || item.confidenceScore;

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
 * Expand categories semantically by asking AI for related categories
 * @param {string} promptText - The user's prompt
 * @param {Array<{category: string, score: number}>} selectedCategories - Initially selected categories
 * @param {Array<string>} allCategories - All available categories
 * @returns {Promise<Array<{category: string, score: number}>>} Expanded categories with scores
 */
async function expandCategoriesSemanticly(promptText, selectedCategories, allCategories) {
  try {
    // Get category names
    const selectedNames = selectedCategories.map(c => c.category);
    const otherCategories = allCategories.filter(cat => !selectedNames.includes(cat));

    if (otherCategories.length === 0) {
      return selectedCategories; // No categories to expand into
    }

    // Create AI session for semantic expansion
    const session = await LanguageModel.create({
      language: 'en',
      systemPrompt: `You are a semantic category expansion assistant.
Your task is to identify categories that are CLOSELY RELATED to the primary categories for a given query.

Only suggest categories that would provide valuable context for understanding the user's request.
Be conservative - only add categories with clear semantic relationships.

Output JSON only: [{"category":"CategoryName","score":6}]`
    });

    const prompt = `User query: "${promptText}"

Primary categories already selected: ${selectedNames.join(', ')}

Other available categories: ${otherCategories.join(', ')}

Which of the OTHER categories are closely related and would provide useful context?

Rules:
- Only suggest categories with CLEAR semantic relationships
- Give lower scores (5-6) to related categories vs primary (7-10)
- Maximum 2-3 related categories
- If no categories are clearly related, return empty array []

Return JSON array with related categories and scores (5-6):`;

    console.log('[Context Selector] Asking AI for semantically related categories...');

    const response = await session.prompt(prompt);
    await session.destroy();

    // Parse response
    const cleaned = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const match = cleaned.match(/\[.*?\]/s);

    if (match) {
      const relatedCategories = JSON.parse(match[0]);

      // Filter and validate
      const validRelated = relatedCategories
        .filter(item => {
          const hasCategory = item && typeof item.category === 'string';
          const hasScore = typeof item.score === 'number';
          const isOtherCategory = otherCategories.includes(item.category);
          return hasCategory && hasScore && isOtherCategory;
        })
        .map(item => ({
          category: item.category,
          score: Math.max(1, Math.min(10, item.score))
        }));

      console.log('[Context Selector] Semantically related categories:', validRelated);

      // Combine original + related
      return [...selectedCategories, ...validRelated];
    }

    console.log('[Context Selector] No related categories found');
    return selectedCategories;

  } catch (error) {
    console.error('[Context Selector] Error expanding categories semantically:', error);
    return selectedCategories; // Return original on error
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
    // Safety check: ensure subCollections exists and is an array
    if (!gem.subCollections || !Array.isArray(gem.subCollections) || gem.subCollections.length === 0) {
      return false; // Skip gems without valid SubCategories
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
async function selectRelevantGemsWithAI(promptText, dataGems, maxResults = 5, profile = null, originalQuery = null, isSubQuery = false, queryIntent = null) {
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

    // STAGE 0: Semantic Type Pre-Filter
    // Use provided intent if available (from fan-out), otherwise analyze
    if (!queryIntent) {
      queryIntent = await analyzeQueryIntent(originalQuery || promptText);
      console.log('[Context Selector] Stage 0: Query intent analysis:', {
        type: queryIntent.type,
        domain: queryIntent.domain,
        requiredTypes: queryIntent.requiredSemanticTypes,
        needsConstraints: queryIntent.needsConstraints
      });
    } else {
      console.log('[Context Selector] Stage 0: Using pre-analyzed query intent:', {
        type: queryIntent.type,
        domain: queryIntent.domain
      });
    }

    let semanticFilteredGems = dataGems;
    if (queryIntent.requiredSemanticTypes && queryIntent.requiredSemanticTypes.length > 0) {
      const beforeCount = dataGems.length;
      semanticFilteredGems = dataGems.filter(gem =>
        !gem.semanticType || // Include gems without semantic type (backward compatibility)
        queryIntent.requiredSemanticTypes.includes(gem.semanticType)
      );
      console.log(`[Context Selector] Stage 0: Semantic filter ${beforeCount} → ${semanticFilteredGems.length} gems (kept: ${queryIntent.requiredSemanticTypes.join(', ')})`);
    } else {
      console.log('[Context Selector] Stage 0: No semantic filtering applied (all types allowed)');
    }

    // STAGE 1: Identify relevant categories using AI
    console.log(`[Context Selector] Stage 1: Analyzing ${semanticFilteredGems.length} gems`);

    // Extract all unique categories from gems
    const allCategories = [...new Set(
      semanticFilteredGems
        .flatMap(gem => gem.collections || [])
        .filter(Boolean)
    )];

    console.log(`[Context Selector] Found ${allCategories.length} unique categories`);

    let candidateGems = semanticFilteredGems;
    let stage15Applied = false; // Track if Stage 1.5 filtering was successfully applied

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
        // SEMANTIC EXPANSION: Ask AI for related categories
        // Skip for sub-queries to prevent overly broad category selection
        if (!isSubQuery) {
          const expandedCategories = await expandCategoriesSemanticly(
            promptText,
            relevantCategories,
            allCategories
          );

          if (expandedCategories.length > relevantCategories.length) {
            console.log(`[Context Selector] Semantically expanded ${relevantCategories.length} → ${expandedCategories.length} categories:`,
              expandedCategories.map(c => `${c.category}(${c.score})`).join(', '));
            relevantCategories = expandedCategories;
          }
        } else {
          console.log(`[Context Selector] Skipping semantic expansion for sub-query (using direct matches only)`);
        }

        // Filter gems by relevant (possibly expanded) categories
        candidateGems = filterGemsByCategories(semanticFilteredGems, relevantCategories);
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
            // Pass originalQuery for context-aware selection (if this is a sub-query)
            const relevantSubCategories = await selectRelevantSubCategoriesWithAI(
              promptText,
              availableSubCategories,
              profile.subCategoryRegistry,
              originalQuery || promptText  // Use original query if available, else use promptText
            );

            if (relevantSubCategories.length > 0) {
              // Filter by high-confidence SubCategories (≥6)
              const highConfidenceSubCategories = relevantSubCategories.filter(sub => sub.score >= 6);

              if (highConfidenceSubCategories.length > 0) {
                console.log(`[Context Selector] Stage 1.5: Selected ${highConfidenceSubCategories.length} high-confidence SubCategories (≥6):`,
                  highConfidenceSubCategories.map(s => `${s.subCategory}(${s.score})`).join(', '));

                // Filter gems by selected SubCategories
                const subCategoryFiltered = filterGemsBySubCategories(candidateGems, highConfidenceSubCategories);

                // Apply SubCategory filter if it returns any gems
                if (subCategoryFiltered.length > 0) {
                  candidateGems = subCategoryFiltered;
                  stage15Applied = true; // Mark that Stage 1.5 successfully filtered
                  console.log(`[Context Selector] Stage 1.5: Reduced to ${candidateGems.length} gems (${((1 - candidateGems.length / filterGemsByCategories(semanticFilteredGems, relevantCategories).length) * 100).toFixed(1)}% reduction)`);
                } else {
                  console.log(`[Context Selector] Stage 1.5: No gems after SubCategory filter, keeping all ${candidateGems.length} category-filtered gems`);
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

    // Score ALL filtered gems with batch scoring (no artificial limit)
    console.log(`[Context Selector] Will score all ${candidateGems.length} ${stage15Applied ? 'SubCategory-' : 'category-'}filtered gems with AI using batch scoring`);

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

    // Score gems in BATCHES for better performance
    const scoredGems = [];
    const BATCH_SIZE = 10; // Score 10 gems per AI call
    const totalBatches = Math.ceil(candidateGems.length / BATCH_SIZE);

    console.log(`[Context Selector] Scoring ${candidateGems.length} gems in ${totalBatches} batches of ${BATCH_SIZE}`);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const startIdx = batchIndex * BATCH_SIZE;
      const endIdx = Math.min(startIdx + BATCH_SIZE, candidateGems.length);
      const batch = candidateGems.slice(startIdx, endIdx);

      try {
        // Build batch prompt
        const gemsList = batch.map((gem, i) => {
          const shortValue = gem.value.substring(0, 150).replace(/\n/g, ' ');
          return `${i + 1}. "${shortValue}"`;
        }).join('\n\n');

        // Use original query if available (for sub-question scoring)
        const contextDescription = originalQuery
          ? `Original request: "${originalQuery}"\nSpecific aspect: "${promptText}"`
          : `User request: "${promptText}"`;

        const prompt = `Task: Rate how useful each personal data item would be as CONTEXT for an AI assistant answering the user's request.

${contextDescription}

Personal data items:
${gemsList}

Relevance scale:
- 10 = Extremely useful context (directly relevant to the ORIGINAL request)
- 7-9 = Very useful context (helps understand user's style/preferences for the ORIGINAL request)
- 4-6 = Somewhat useful (provides background but not critical)
- 1-3 = Minimally useful (weak connection to ORIGINAL request)
- 0 = Not useful (completely unrelated to ORIGINAL request)

IMPORTANT: Score based on relevance to the ORIGINAL REQUEST, not just the specific aspect!
For example, if the original request is about "sneakers", chip brands should score 0 even if the specific aspect is "brands".

Return ONLY a JSON array of scores in order, e.g.: [8, 3, 9, 0, 7, ...]
IMPORTANT: Return exactly ${batch.length} scores, one for each item above.`;

        console.log(`[Context Selector] Batch ${batchIndex + 1}/${totalBatches} (gems ${startIdx + 1}-${endIdx})`);

        const response = await session.prompt(prompt);

        // Parse response - try multiple formats
        const cleaned = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');

        let scores = null;

        // Try 1: JSON array format [7, 8, 3, 9, ...]
        const jsonMatch = cleaned.match(/\[[\d,\s]+\]/);
        if (jsonMatch) {
          try {
            scores = JSON.parse(jsonMatch[0]);
          } catch (e) {
            console.warn(`[Context Selector] JSON parse failed:`, e);
          }
        }

        // Try 2: Comma-separated numbers "7, 8, 3, 9" or "7,8,3,9"
        if (!scores) {
          const commaMatch = cleaned.match(/^[\d,\s]+$/);
          if (commaMatch) {
            scores = cleaned.split(/,\s*/).map(s => parseInt(s)).filter(n => !isNaN(n));
          }
        }

        // Try 3: Line-separated numbers
        if (!scores) {
          const lines = cleaned.split(/\n+/).map(line => line.trim()).filter(Boolean);
          if (lines.every(line => /^\d+$/.test(line))) {
            scores = lines.map(line => parseInt(line));
          }
        }

        // Try 4: Extract all numbers from response
        if (!scores) {
          const numbers = cleaned.match(/\d+/g);
          if (numbers && numbers.length === batch.length) {
            scores = numbers.map(n => parseInt(n));
            console.log(`[Context Selector] Batch ${batchIndex + 1}: Extracted ${scores.length} numbers from text`);
          }
        }

        // Validate and apply scores
        if (scores && Array.isArray(scores) && scores.length === batch.length) {
          batch.forEach((gem, i) => {
            const score = Math.max(0, Math.min(10, parseInt(scores[i]) || 0));

            // Log high-scoring gems
            if (score >= 7) {
              console.log(`[Context Selector] ✓ HIGH SCORE ${score}: "${gem.value.substring(0, 80)}..."`);
            }

            scoredGems.push({ gem, score });
          });

          console.log(`[Context Selector] Batch ${batchIndex + 1} scores:`, scores);
        } else {
          console.warn(`[Context Selector] Batch ${batchIndex + 1}: Expected ${batch.length} scores, got ${scores?.length || 0}. Response: "${cleaned.substring(0, 200)}". Using fallback.`);
          // Fallback: assign middle scores
          batch.forEach(gem => scoredGems.push({ gem, score: 5 }));
        }

      } catch (error) {
        console.warn(`[Context Selector] Error scoring batch ${batchIndex + 1}:`, error);
        // Fallback: assign middle scores to entire batch
        batch.forEach(gem => scoredGems.push({ gem, score: 5 }));
      }
    }

    // Clean up session
    await session.destroy();

    console.log('[Context Selector] AI scoring complete');

    // Apply semantic boosting
    console.log('[Context Selector] Applying semantic type boosting...');
    scoredGems.forEach(item => {
      const baseScore = item.score;
      const semanticBoost = getSemanticBoost(item.gem.semanticType, queryIntent);

      // Filter out irrelevant activities
      if (item.gem.semanticType === 'activity') {
        const isRelevant = isActivityRelevantToQuery(item.gem, originalQuery || promptText, queryIntent);
        if (!isRelevant) {
          console.log(`[Context Selector] 🚫 Filtering irrelevant activity: "${item.gem.value.substring(0, 60)}..."`);
          item.score = 0; // Set to 0 to remove it
          return;
        }
      }

      if (semanticBoost > 0) {
        item.score = baseScore + semanticBoost;
        console.log(`[Context Selector] 📈 Boost ${item.gem.semanticType || 'none'}: ${baseScore} → ${item.score} (+${semanticBoost}) | "${item.gem.value.substring(0, 60)}..."`);
      }
    });

    // Remove filtered activities (score = 0)
    const beforeFilterCount = scoredGems.length;
    const filteredScoredGems = scoredGems.filter(item => item.score > 0);
    if (filteredScoredGems.length < beforeFilterCount) {
      console.log(`[Context Selector] Removed ${beforeFilterCount - filteredScoredGems.length} irrelevant activities`);
    }

    // Sort by score (highest first)
    filteredScoredGems.sort((a, b) => b.score - a.score);

    // Log score distribution
    const scoreDistribution = filteredScoredGems.reduce((acc, item) => {
      const bucket = Math.floor(item.score / 2) * 2; // Group by 0-1, 2-3, 4-5, etc.
      acc[bucket] = (acc[bucket] || 0) + 1;
      return acc;
    }, {});
    console.log('[Context Selector] Score distribution:', scoreDistribution);

    // NO MATCH DETECTION: If no gems scored ≥7, the query is likely irrelevant
    // Return empty to avoid adding random context
    const highQualityCount = filteredScoredGems.filter(item => item.score >= 7).length;

    if (highQualityCount === 0) {
      console.log('[Context Selector] ⚠️ No gems scored ≥7, query appears irrelevant to profile');
      console.log('[Context Selector] Returning empty to avoid irrelevant context');
      return [];
    }

    // STRICT CUTOFF: Only use high-quality matches (≥7)
    let results = filteredScoredGems
      .filter(item => item.score >= 7)
      .slice(0, maxResults)
      .map(item => {
        // Attach the AI relevance score to the gem for merge scoring
        return {
          ...item.gem,
          _aiRelevanceScore: item.score
        };
      });

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

    console.log(`[Context Selector] Selected ${results.length} unique gems (scores: ${filteredScoredGems.slice(0, 5).map(s => s.score).join(', ')}...)`);

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

  // Sort by score and return top N (respecting maxResults limit)
  const results = scoredGems
    .filter(item => item.score > 0) // Only include items with some relevance
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults); // IMPORTANT: Respect maxResults limit

  console.log(`[Context Selector] Keyword matching found ${results.length} gems (limit: ${maxResults}) with scores:`,
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
 * Check if prompt is complex enough to benefit from decomposition
 * @param {string} promptText - The user's prompt
 * @returns {boolean} True if prompt should be decomposed
 */
function shouldDecomposePrompt(promptText) {
  // Simple heuristics for complexity detection
  const wordCount = promptText.split(/\s+/).length;
  const hasMultipleConcepts = /\band\b|\bwith\b|,/.test(promptText);

  // Expanded modifiers: descriptive adjectives that suggest multiple constraints
  const hasModifiers = /\b(healthy|best|good|great|perfect|ideal|new|casual|comfortable|affordable|budget|premium|quality|specific|detailed|comprehensive|professional|modern|classic|stylish|elegant|practical|durable|reliable|efficient|effective|quick|easy|simple|advanced|beginner|intermediate|expert)\b/i.test(promptText);

  // Action verbs that suggest complex requests
  const hasComplexVerbs = /\b(plan|create|design|build|develop|recommend|suggest|find|choose|select|compare|optimize|improve|enhance)\b/i.test(promptText);

  // Decompose if:
  // - Long query (>10 words)
  // - Medium query (>6 words) with multiple concepts OR modifiers
  // - Medium query (>6 words) with complex action verbs

  const shouldDecompose = wordCount > 10 ||
                          (wordCount > 6 && (hasMultipleConcepts || hasModifiers)) ||
                          (wordCount > 5 && hasComplexVerbs);

  console.log('[Context Selector] Complexity check:', {
    wordCount,
    hasMultipleConcepts,
    hasModifiers,
    hasComplexVerbs,
    shouldDecompose
  });

  return shouldDecompose;
}

/**
 * Decompose complex prompt into focused sub-questions
 * @param {string} promptText - The user's prompt
 * @returns {Promise<Array<string>>} Array of sub-questions (2-5 questions)
 */
async function decomposePromptIntoSubQuestions(promptText) {
  try {
    const session = await LanguageModel.create({
      language: 'en',
      systemPrompt: `You are a prompt decomposition expert.
Decompose user requests into 2-5 focused sub-questions that target specific aspects of personal context.

CRITICAL RULES:
1. Only ask questions DIRECTLY RELEVANT to the original query
   - If the query mentions "pizza", DO NOT ask "What cuisine do you like?"
   - If the query mentions "sneakers", DO NOT ask generic "shoe preferences"
   - Focus on the SPECIFIC topic, not general categories

2. Only ask about GAPS in the information needed
   - Don't ask about things already specified in the query
   - Don't ask generic questions that don't help answer the specific request

3. Each sub-question should target ONE specific aspect:
   - Specific preferences within the topic
   - Budget/constraints
   - Style/aesthetics preferences
   - Brand preferences
   - Practical requirements

4. Output 2-5 questions (adjust based on query complexity):
   - Simple queries: 2-3 FOCUSED questions
   - Complex queries: 4-5 SPECIFIC questions

5. Questions should be complementary, not overlapping

Examples:

Input: "Help me plan a healthy post-workout breakfast"
Output:
1. What are my nutrition preferences?
2. What are my workout habits?
3. What are my breakfast preferences?
4. What are my health goals?
5. What are my dietary restrictions?

Input: "Recommend a good restaurant for date night"
Output:
1. What type of cuisine do I prefer for special occasions?
2. What is my budget for date night dining?
3. What type of ambiance or atmosphere do I enjoy?

Input: "Best laptop for my work"
Output:
1. What is my profession and work requirements?
2. What is my budget for technology?
3. What are my computing preferences?
4. What software do I use regularly?

Input: "Best pizza"
Output:
1. What are my pizza topping preferences?
2. What is my budget for dining out?

Input: "Help me find a new casual sneaker"
Output:
1. What is my casual fashion style?
2. What sneaker brands do I prefer or avoid?
3. What is my budget for casual footwear?
4. What colors or aesthetics do I prefer for shoes?

Input: "Recommend a good Italian restaurant"
Output:
1. What are my Italian food preferences (pasta, pizza, seafood, etc.)?
2. What is my budget for dining out?
3. What location or neighborhood do I prefer?

IMPORTANT: Focus on the SPECIFIC topic mentioned in the query. Don't ask generic questions!

Output ONLY a JSON array of strings.`
    });

    const prompt = `Decompose this into 2-5 focused sub-questions:

"${promptText}"

Return ONLY a JSON array: ["question 1", "question 2", ...]`;

    console.log('[Context Selector] Asking AI to decompose prompt...');

    const response = await session.prompt(prompt);
    await session.destroy();

    // Parse JSON array
    const cleaned = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const match = cleaned.match(/\[.*?\]/s);

    if (match) {
      const questions = JSON.parse(match[0]);

      // Validate: must be array of strings, 2-5 items
      if (Array.isArray(questions) &&
          questions.length >= 2 &&
          questions.length <= 5 &&
          questions.every(q => typeof q === 'string')) {
        console.log('[Context Selector] Decomposed into', questions.length, 'sub-questions:', questions);
        return questions;
      } else {
        console.warn('[Context Selector] Invalid decomposition format:', questions);
        return [];
      }
    }

    console.warn('[Context Selector] Could not parse decomposition response:', response);
    return [];

  } catch (error) {
    console.error('[Context Selector] Error decomposing prompt:', error);
    return [];
  }
}

/**
 * Merge gem results from multiple sub-queries with smart deduplication and diversity
 * @param {Array<Array>} subQueryResults - Array of gem arrays from each sub-question
 * @param {number} maxGems - Maximum number of gems to return
 * @returns {Array} Merged and deduplicated gems
 */
async function mergeGemResults(subQueryResults, maxGems, originalQuery = null, profile = null) {
  console.log('[Context Selector] Merging results from', subQueryResults.length, 'sub-queries');

  // Track gem frequency and source sub-questions
  const gemMap = new Map(); // gem.id → {gem, score, sources: [subQ indices], appearances}

  subQueryResults.forEach((gems, subQIndex) => {
    gems.forEach((gem, position) => {
      if (gemMap.has(gem.id)) {
        // Gem appears in multiple sub-queries → boost score significantly
        const entry = gemMap.get(gem.id);
        entry.score += 3; // Strong bonus for multi-match (cross-domain relevance!)
        entry.appearances += 1;
        entry.sources.push(subQIndex);

        // Bonus for appearing early in multiple results
        if (position < 2) {
          entry.score += 1;
        }
      } else {
        // New gem
        // Use AI relevance score (from batch scoring), fallback to category confidence
        const baseScore = gem._aiRelevanceScore || gem._categoryConfidence || 8;

        // Bonus for appearing early in a result
        const positionBonus = Math.max(0, 3 - position);

        // BOOST: Extra bonus for very high-scoring gems (9-10)
        // These are highly relevant and should be prioritized
        const highScoreBonus = baseScore >= 9 ? 2 : 0;

        gemMap.set(gem.id, {
          gem,
          score: baseScore + positionBonus + highScoreBonus,
          sources: [subQIndex],
          appearances: 1
        });
      }
    });
  });

  // Convert to array and sort by score
  const allGems = Array.from(gemMap.values())
    .sort((a, b) => {
      // Primary: Sort by score
      if (b.score !== a.score) return b.score - a.score;
      // Secondary: Prefer gems that appeared in multiple sub-queries
      return b.appearances - a.appearances;
    });

  console.log('[Context Selector] Total unique gems after merge:', allGems.length);
  console.log('[Context Selector] Top scored gems:', allGems.slice(0, 5).map(e => ({
    appearances: e.appearances,
    mergeScore: e.score,
    aiScore: e.gem._aiRelevanceScore || 'N/A',
    value: e.gem.value.substring(0, 40) + '...'
  })));

  // CONSTRAINT VALIDATION: Ensure critical constraints are included for shopping queries
  if (originalQuery) {
    const queryIntent = await analyzeQueryIntent(originalQuery);

    if (queryIntent.needsConstraints && queryIntent.criticalConstraints.length > 0) {
      console.log('[Context Selector] 🔍 Checking for critical constraints:', queryIntent.criticalConstraints);

      // Get all available constraint gems from all sub-query results
      const allConstraintGems = [];
      subQueryResults.forEach(gems => {
        gems.forEach(gem => {
          if (gem.semanticType === 'constraint') {
            // Check if this constraint matches a critical constraint
            const attribute = gem.attribute?.toLowerCase() || '';
            const value = gem.value.toLowerCase();
            const isCritical = queryIntent.criticalConstraints.some(cc => {
              const ccLower = cc.toLowerCase();
              return attribute.includes(ccLower) || value.includes(ccLower);
            });

            if (isCritical) {
              // Check if already in allGems
              const existingEntry = allGems.find(e => e.gem.id === gem.id);
              if (existingEntry) {
                // Boost existing constraint
                console.log(`[Context Selector] ⚡ Boosting critical constraint "${gem.value.substring(0, 50)}..." (${existingEntry.score} → ${existingEntry.score + 10})`);
                existingEntry.score += 10;
              } else {
                // Add missing constraint
                allConstraintGems.push(gem);
              }
            }
          }
        });
      });

      // Add missing critical constraints to allGems
      allConstraintGems.forEach(gem => {
        console.log(`[Context Selector] ➕ Force-adding critical constraint: "${gem.value.substring(0, 60)}..."`);
        allGems.unshift({
          gem,
          score: 20, // Very high score to prioritize
          sources: [0],
          appearances: 1
        });
      });

      // Re-sort after constraint boosting
      if (allConstraintGems.length > 0) {
        allGems.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return b.appearances - a.appearances;
        });
        console.log('[Context Selector] ✓ Re-sorted with constraint boost');
      }
    }
  }

  // Diversity selection: Ensure we get context from different sub-questions
  const selected = [];
  const sourceCount = new Map(); // Track how many gems from each source

  for (const entry of allGems) {
    if (selected.length >= maxGems) break;

    // Diversity: limit gems per source (60% of maxGems)
    // maxGems=3 → max 2 per source, maxGems=5 → max 3 per source
    const primarySource = entry.sources[0];
    const currentCount = sourceCount.get(primarySource) || 0;
    const maxPerSource = Math.ceil(maxGems * 0.6);

    // Exception: If gem appears in multiple sub-queries (cross-domain), always include
    if (entry.appearances > 1 || currentCount < maxPerSource) {
      selected.push(entry.gem);
      sourceCount.set(primarySource, currentCount + 1);

      console.log(`[Context Selector] Selected gem (appearances: ${entry.appearances}, mergeScore: ${entry.score}, aiScore: ${entry.gem._aiRelevanceScore || 'N/A'}): ${entry.gem.value.substring(0, 60)}...`);
    }
  }

  console.log('[Context Selector] Final selection:', selected.length, 'gems with diversity from', sourceCount.size, 'sub-queries');

  return selected;
}

/**
 * Main function: Optimize prompt with relevant context using question decomposition fan-out
 * @param {string} promptText - The user's prompt
 * @param {object} profile - User profile with preferences
 * @param {boolean} useAI - Whether to use AI for selection (default: true)
 * @param {number} maxGems - Maximum number of gems to include (default: 5)
 * @returns {Promise<string>} Optimized prompt with context
 */
async function optimizePromptWithContext(promptText, profile, useAI = true, maxGems = 5) {
  try {
    // Extract data gems from profile + enrich with basic info
    const dataGems = enrichGemsWithBasicInfo(profile);

    // Filter out hidden items
    const visibleGems = dataGems.filter(gem => gem.state !== 'hidden');

    if (visibleGems.length === 0) {
      console.log('[Context Selector] No visible data gems found');
      return promptText;
    }

    console.log('[Context Selector] Analyzing', visibleGems.length, 'data gems');

    // ALWAYS use fan-out decomposition (no complexity check)
    const shouldUseFanOut = useAI && typeof LanguageModel !== 'undefined';

    if (shouldUseFanOut) {
      console.log('[Context Selector] 🔀 Using Question Decomposition Fan-Out (always-on mode)');

      // OPTIMIZATION: Analyze intent ONCE before decomposition (not per sub-query)
      const queryIntent = await analyzeQueryIntent(promptText);
      console.log('[Context Selector] Pre-analyzed query intent:', {
        type: queryIntent.type,
        domain: queryIntent.domain
      });

      // Decompose into sub-questions
      const subQuestions = await decomposePromptIntoSubQuestions(promptText);

      if (subQuestions.length >= 2) {
        console.log('[Context Selector] Decomposed into', subQuestions.length, 'sub-questions');

        // Run each sub-question through existing pipeline IN PARALLEL
        // IMPORTANT: Pass original query so scoring AI knows the full context
        // IMPORTANT: Pass isSubQuery=true to disable semantic expansion (use direct category matches only)
        // IMPORTANT: Pass queryIntent to avoid re-analyzing intent 5 times
        const subQueryResults = await Promise.all(
          subQuestions.map(subQ =>
            selectRelevantGemsWithAI(subQ, visibleGems, Math.ceil(maxGems / 1.5), profile, promptText, true, queryIntent)
          )
        );

        console.log('[Context Selector] Sub-query results:', subQueryResults.map((r, i) =>
          `Q${i + 1}: ${r.length} gems`
        ).join(', '));

        // Merge results with smart deduplication and diversity
        const selectedGems = await mergeGemResults(subQueryResults, maxGems, promptText, profile);

        console.log('[Context Selector] ✓ Fan-out complete: Selected', selectedGems.length, 'unique gems');

        // Format and return
        return formatPromptWithContext(promptText, selectedGems);
      } else {
        console.log('[Context Selector] Decomposition failed or returned <2 questions, falling back to single-query');
      }
    }

    // Fallback: Use single-query approach (original behavior)
    console.log('[Context Selector] Using single-query approach');
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
    expandCategoriesSemanticly,
    filterGemsByCategories,
    filterGemsBySubCategories,
    selectRelevantGemsWithAI,
    selectRelevantGemsByKeywords,
    formatPromptWithContext,
    optimizePromptWithContext,
    shouldDecomposePrompt,
    decomposePromptIntoSubQuestions,
    mergeGemResults
  };
}
