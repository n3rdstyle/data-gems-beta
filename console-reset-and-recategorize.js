/**
 * Console Script: Reset & Recategorize ALL Gems
 *
 * Deletes all existing collections and subCollections, then assigns new ones
 * using the Taxonomy structure with AI analysis
 *
 * Usage:
 * 1. Open extension popup
 * 2. Open DevTools (F12)
 * 3. Copy and paste this entire script
 * 4. Wait ~10-15 minutes for completion (457 gems × ~1.5 seconds each)
 */

(async function resetAndRecategorize() {
  console.log('=== Reset & Recategorize ALL Gems ===\n');

  const results = {
    processed: 0,
    categorized: 0,
    skipped: 0,
    errors: 0,
    categoriesUsed: {},
    subCategoriesUsed: {},
    duration: 0
  };

  const startTime = Date.now();

  // Main Categories from Taxonomy
  const mainCategories = [
    'Identity', 'Personality', 'Mindset', 'Values', 'Habits', 'Health',
    'Nutrition', 'Fitness', 'Sports', 'Recovery', 'Work', 'Career',
    'Learning', 'Creativity', 'Productivity', 'Technology', 'Fashion',
    'Design', 'Music', 'Movies', 'Books', 'Media', 'Art', 'Travel',
    'Home', 'Living', 'Nature', 'Sustainability', 'Family', 'Friends',
    'Community', 'Pets', 'Lifestyle', 'Shopping', 'Brands', 'Consumption',
    'Emotions', 'Goals', 'Context', 'Behavior', 'Location', 'Time'
  ];

  try {
    // STEP 1: Load profile
    console.log('[1/6] Loading profile from chrome.storage...');
    const data = await chrome.storage.local.get('hspProfile');
    if (!data.hspProfile) {
      throw new Error('No profile found!');
    }

    const profile = data.hspProfile;
    const gems = profile.content.preferences.items || [];
    console.log(`✓ Profile loaded with ${gems.length} gems\n`);

    // STEP 2: Check SubCategory Registry
    console.log('[2/6] Checking SubCategory Registry...');
    if (!profile.subCategoryRegistry || Object.keys(profile.subCategoryRegistry).length === 0) {
      throw new Error('SubCategory Registry not found. Run console-setup-and-verify.js first!');
    }

    const registryCount = Object.keys(profile.subCategoryRegistry).length;
    console.log(`✓ Registry found with ${registryCount} SubCategories\n`);

    // STEP 3: Reset all collections and subCollections
    console.log('[3/6] Resetting all collections and subCollections...');
    gems.forEach(gem => {
      gem.collections = [];
      gem.subCollections = [];
    });
    console.log(`✓ Reset complete - all ${gems.length} gems now have empty collections\n`);

    // STEP 4: Initialize AI
    console.log('[4/6] Initializing Chrome Built-in AI (Gemini Nano)...');
    await aiHelper.initialize();

    if (!aiHelper.isAvailable) {
      throw new Error('AI (Gemini Nano) is not available! Please enable Chrome Built-in AI in chrome://flags');
    }

    console.log('✓ AI ready\n');

    // STEP 5: Recategorize all gems
    console.log(`[5/6] Recategorizing ${gems.length} gems...`);
    console.log('⏳ This will take approximately ' + Math.round(gems.length * 1.5 / 60) + ' minutes\n');
    console.log('Progress updates every 25 gems:\n');

    for (let i = 0; i < gems.length; i++) {
      const gem = gems[i];
      results.processed++;

      // Progress update every 25 gems
      if (i > 0 && i % 25 === 0) {
        const percentage = Math.round((i / gems.length) * 100);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
        const estimated = Math.round((elapsed / i) * (gems.length - i));
        console.log(`⏳ ${i}/${gems.length} (${percentage}%) - ${elapsed}s elapsed, ~${estimated}s remaining`);
      }

      try {
        // Ask AI for Main Category AND SubCategory
        const categorization = await categorizeGem(gem, mainCategories, profile.subCategoryRegistry);

        if (categorization.mainCategory && categorization.subCategory) {
          // Assign to gem
          gem.collections = [categorization.mainCategory];
          gem.subCollections = [categorization.subCategory];
          gem.updated_at = new Date().toISOString();

          // Increment count in registry
          profile.subCategoryRegistry[categorization.subCategory].gemCount++;

          // Track usage
          if (!results.categoriesUsed[categorization.mainCategory]) {
            results.categoriesUsed[categorization.mainCategory] = 0;
          }
          results.categoriesUsed[categorization.mainCategory]++;

          if (!results.subCategoriesUsed[categorization.subCategory]) {
            results.subCategoriesUsed[categorization.subCategory] = 0;
          }
          results.subCategoriesUsed[categorization.subCategory]++;

          results.categorized++;
        } else {
          console.warn(`  ⚠ Could not categorize: "${gem.value.substring(0, 40)}..."`);
          results.skipped++;
        }

        // Small delay to avoid overwhelming AI
        await new Promise(resolve => setTimeout(resolve, 150));

      } catch (error) {
        console.error(`  ✗ Error processing gem "${gem.value.substring(0, 40)}...":`, error.message);
        results.errors++;
      }
    }

    console.log('\n✓ All gems processed\n');

    // STEP 6: Save profile
    console.log('[6/6] Saving profile to chrome.storage...');
    await chrome.storage.local.set({ hspProfile: profile });
    console.log('✓ Profile saved\n');

    results.duration = Date.now() - startTime;

    // SUCCESS: Show summary
    console.log('====================================');
    console.log('✓ Recategorization Complete!');
    console.log('====================================\n');

    console.log('📊 Results:');
    console.log(`   Processed: ${results.processed} gems`);
    console.log(`   Categorized: ${results.categorized} gems`);
    console.log(`   Skipped: ${results.skipped} gems (could not categorize)`);
    console.log(`   Errors: ${results.errors} gems`);
    console.log(`   Duration: ${(results.duration / 1000 / 60).toFixed(1)} minutes\n`);

    console.log('📋 Main Categories Used (Top 10):');
    const sortedCategories = Object.entries(results.categoriesUsed)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    sortedCategories.forEach(([category, count]) => {
      console.log(`   - ${category}: ${count} gems`);
    });

    console.log('\n📋 SubCategories Used (Top 15):');
    const sortedSubCategories = Object.entries(results.subCategoriesUsed)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    sortedSubCategories.forEach(([subCat, count]) => {
      const parent = profile.subCategoryRegistry[subCat]?.parent || 'Unknown';
      console.log(`   - ${subCat} (${parent}): ${count} gems`);
    });

    if (Object.keys(results.subCategoriesUsed).length > 15) {
      console.log(`   ... and ${Object.keys(results.subCategoriesUsed).length - 15} more SubCategories`);
    }

    console.log('\n✓ Recategorization successful! Reload extension to see changes.');

  } catch (error) {
    console.error('✗ Recategorization failed:', error);
    throw error;
  }

  /**
   * Categorize a gem: determine Main Category AND SubCategory
   */
  async function categorizeGem(gem, mainCategories, registry) {
    try {
      // STEP 1: Ask AI for Main Category
      const categoryPrompt = `Analyze this personal data and choose the MOST RELEVANT main category.

Personal Data: "${gem.value}"

Available Main Categories:
${mainCategories.map(cat => `- ${cat}`).join('\n')}

Instructions:
1. Choose the ONE category that BEST fits this data
2. Return ONLY the category name (e.g., "Fashion" or "Health")
3. Be specific - don't default to generic categories
4. Consider what the data is primarily about

Your answer (category name only):`;

      const categoryResponse = await aiHelper.session.prompt(categoryPrompt);
      const mainCategory = categoryResponse.trim();

      // Validate Main Category
      if (!mainCategories.includes(mainCategory)) {
        console.warn(`  ⚠ Invalid category "${mainCategory}" for: "${gem.value.substring(0, 40)}..."`);
        return { mainCategory: null, subCategory: null };
      }

      // STEP 2: Get available SubCategories for this Main Category
      const availableSubCats = Object.entries(registry)
        .filter(([key, data]) => data.parent === mainCategory)
        .map(([key, data]) => ({
          key,
          displayName: data.displayName
        }));

      if (availableSubCats.length === 0) {
        console.warn(`  ⚠ No SubCategories found for ${mainCategory}`);
        return { mainCategory: null, subCategory: null };
      }

      // STEP 3: Ask AI for SubCategory
      const subCatList = availableSubCats
        .map(sub => `- ${sub.key} (${sub.displayName})`)
        .join('\n');

      const subCategoryPrompt = `Now choose the MOST SPECIFIC SubCategory for this data.

Main Category: ${mainCategory}
Personal Data: "${gem.value}"

Available SubCategories for ${mainCategory}:
${subCatList}

Instructions:
1. Choose the MOST SPECIFIC SubCategory that matches the data
2. Return ONLY the SubCategory key (e.g., "fashion_style" or "health_physical")
3. If unsure, use "${mainCategory.toLowerCase()}_constraints"
4. Return lowercase with underscores

Your answer (SubCategory key only):`;

      const subCategoryResponse = await aiHelper.session.prompt(subCategoryPrompt);
      const subCategory = subCategoryResponse.trim().toLowerCase().replace(/\s+/g, '_');

      // Validate SubCategory
      const isValid = availableSubCats.some(sub => sub.key === subCategory);

      if (!isValid) {
        // Fallback to constraints
        const fallback = `${mainCategory.toLowerCase()}_constraints`;
        if (registry[fallback]) {
          return { mainCategory, subCategory: fallback };
        }
        return { mainCategory: null, subCategory: null };
      }

      return { mainCategory, subCategory };

    } catch (error) {
      console.error('Error categorizing gem:', error);
      return { mainCategory: null, subCategory: null };
    }
  }
})();
