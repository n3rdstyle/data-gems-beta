/**
 * SubCategory Migration Utility
 * Migrates Fashion gems to SubCategory system
 */

/**
 * Migrate Fashion gems to SubCategories
 * @param {object} profile - HSP Profile
 * @param {function} onProgress - Progress callback (current, total, message)
 * @returns {Promise<object>} Migration result
 */
async function migrateToSubCategories(profile, onProgress = null) {
  console.log('[SubCategory Migration] Starting migration...');

  const results = {
    processed: 0,
    migrated: 0,
    skipped: 0,
    errors: 0,
    subCategoriesCreated: [],
    duration: 0
  };

  const startTime = Date.now();

  try {
    // Initialize registry if not exists
    if (!profile.subCategoryRegistry) {
      profile.subCategoryRegistry = {};
      console.log('[SubCategory Migration] Initialized registry');
    }

    // Find Fashion gems (including "Lifestyle & Preferences")
    const gems = profile.content.preferences.items || [];
    const fashionGems = gems.filter(gem => {
      const collections = gem.collections || [];
      return collections.some(col =>
        col === 'Fashion' ||
        col === 'Lifestyle & Preferences' ||
        col === 'Lifestyle'
      );
    });

    console.log(`[SubCategory Migration] Found ${fashionGems.length} Fashion/Lifestyle gems`);

    if (fashionGems.length === 0) {
      console.log('[SubCategory Migration] No Fashion gems found');
      return results;
    }

    // Initialize AI helper
    await aiHelper.initialize();
    const aiAvailable = aiHelper.isAvailable;

    if (!aiAvailable) {
      console.error('[SubCategory Migration] AI not available! Cannot migrate.');
      throw new Error('AI (Gemini Nano) is not available. Please enable Chrome Built-in AI.');
    }

    console.log('[SubCategory Migration] AI ready, processing gems...');

    // Process each gem
    for (let i = 0; i < fashionGems.length; i++) {
      const gem = fashionGems[i];
      results.processed++;

      // Report progress
      if (onProgress) {
        onProgress(i + 1, fashionGems.length, `Processing "${gem.value.substring(0, 40)}..."`);
      }

      try {
        // Skip if already has subCollections
        if (gem.subCollections && gem.subCollections.length > 0) {
          console.log(`[SubCategory Migration] Skipping (already migrated): ${gem.id}`);
          results.skipped++;
          continue;
        }

        // Ask AI for SubCategory
        const subCategory = await suggestSubCategoryForGem(gem);

        if (subCategory) {
          // Add to registry if new
          if (!profile.subCategoryRegistry[subCategory]) {
            profile.subCategoryRegistry[subCategory] = {
              parent: 'Fashion',
              gemCount: 0,
              created_at: new Date().toISOString()
            };
            results.subCategoriesCreated.push(subCategory);
            console.log(`[SubCategory Migration] Created new: ${subCategory}`);
          }

          // Add subCollection to gem
          gem.subCollections = [subCategory];
          gem.updated_at = new Date().toISOString();

          // Increment count
          profile.subCategoryRegistry[subCategory].gemCount++;

          results.migrated++;
          console.log(`[SubCategory Migration] Migrated: "${gem.value.substring(0, 40)}..." → ${subCategory}`);
        } else {
          console.warn(`[SubCategory Migration] No subcategory suggested for: ${gem.id}`);
          results.skipped++;
        }

        // Small delay to avoid overwhelming AI
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`[SubCategory Migration] Error processing gem ${gem.id}:`, error);
        results.errors++;
      }
    }

    results.duration = Date.now() - startTime;

    console.log('[SubCategory Migration] Complete!', results);
    return results;

  } catch (error) {
    console.error('[SubCategory Migration] Fatal error:', error);
    throw error;
  }
}

/**
 * Ask AI to suggest a SubCategory for a Fashion gem
 * @param {object} gem - Gem object
 * @returns {Promise<string|null>} SubCategory name or null
 */
async function suggestSubCategoryForGem(gem) {
  try {
    const prompt = `Analyze this Fashion/Lifestyle item and suggest ONE specific subcategory.

Item: "${gem.value}"

Choose the MOST SPECIFIC subcategory from these options, or create a new one:
- shoes (footwear, sneakers, boots, sandals)
- tshirts (t-shirts, tops, shirts)
- pants (trousers, jeans, shorts)
- jackets (coats, hoodies, outerwear)
- dresses (dresses, skirts)
- accessories (bags, belts, jewelry, watches)
- underwear (socks, underwear, lingerie)
- sportswear (athletic wear, gym clothes)
- style_preferences (fashion style, aesthetic preferences)
- colors (favorite colors, color preferences)
- brands (favorite brands, brand preferences)
- other (if none of the above fit)

Rules:
1. Return ONLY the subcategory name (lowercase, no spaces, use underscores)
2. Be as specific as possible (shoes > accessories)
3. If it's about preferences/style rather than specific items, use "style_preferences"
4. If unsure, use "other"

Output ONLY the subcategory name, nothing else:`;

    const response = await aiHelper.session.prompt(prompt);

    // Clean response
    const subCategory = response.trim().toLowerCase().replace(/\s+/g, '_');

    // Validate (basic check)
    if (subCategory.length > 0 && subCategory.length < 50) {
      return subCategory;
    }

    return null;

  } catch (error) {
    console.error('[SubCategory Migration] Error suggesting subcategory:', error);
    return null;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { migrateToSubCategories, suggestSubCategoryForGem };
}
