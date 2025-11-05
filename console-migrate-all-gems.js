/**
 * Console Script: Migrate ALL Gems to SubCategories
 *
 * Analyzes all gems and assigns appropriate SubCategories using AI
 * Progress updates every 25 gems
 *
 * Usage:
 * 1. Open extension popup
 * 2. Open DevTools (F12)
 * 3. Copy and paste this entire script
 * 4. Wait 7-10 minutes for completion (457 gems × ~1 second each)
 */

(async function migrateAllGems() {
  console.log('=== Starting Full Gem Migration to SubCategories ===\n');

  const results = {
    processed: 0,
    migrated: 0,
    skipped: 0,
    errors: 0,
    subCategoriesUsed: {},
    duration: 0
  };

  const startTime = Date.now();

  try {
    // STEP 1: Load profile
    console.log('[1/5] Loading profile from chrome.storage...');
    const data = await chrome.storage.local.get('hspProfile');
    if (!data.hspProfile) {
      throw new Error('No profile found!');
    }

    const profile = data.hspProfile;
    const gems = profile.content.preferences.items || [];
    console.log(`✓ Profile loaded with ${gems.length} gems\n`);

    // STEP 2: Check/Initialize SubCategory Registry
    console.log('[2/5] Checking SubCategory Registry...');
    if (!profile.subCategoryRegistry || Object.keys(profile.subCategoryRegistry).length === 0) {
      console.log('⚠ Registry is empty or missing! Please run the Taxonomy Setup script first.');
      throw new Error('SubCategory Registry not found. Run console-setup-and-verify.js first!');
    }

    const registryCount = Object.keys(profile.subCategoryRegistry).length;
    console.log(`✓ Registry found with ${registryCount} SubCategories\n`);

    // STEP 3: Initialize AI
    console.log('[3/5] Initializing Chrome Built-in AI (Gemini Nano)...');
    await aiHelper.initialize();

    if (!aiHelper.isAvailable) {
      throw new Error('AI (Gemini Nano) is not available! Please enable Chrome Built-in AI in chrome://flags');
    }

    console.log('✓ AI ready\n');

    // STEP 4: Process all gems
    console.log(`[4/5] Processing ${gems.length} gems...`);
    console.log('⏳ This will take approximately ' + Math.round(gems.length * 1.2 / 60) + ' minutes\n');
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
        // Skip if already has subCollections
        if (gem.subCollections && gem.subCollections.length > 0) {
          results.skipped++;
          continue;
        }

        // Skip if no collections assigned
        if (!gem.collections || gem.collections.length === 0) {
          results.skipped++;
          continue;
        }

        // Ask AI for SubCategory based on gem's main collection
        const subCategory = await suggestSubCategoryForGem(gem, profile.subCategoryRegistry);

        if (subCategory) {
          // Validate SubCategory exists in registry
          if (!profile.subCategoryRegistry[subCategory]) {
            console.warn(`  ⚠ SubCategory "${subCategory}" not in registry, skipping gem: "${gem.value.substring(0, 40)}..."`);
            results.skipped++;
            continue;
          }

          // Add subCollection to gem
          gem.subCollections = [subCategory];
          gem.updated_at = new Date().toISOString();

          // Increment count in registry
          profile.subCategoryRegistry[subCategory].gemCount++;

          // Track usage
          if (!results.subCategoriesUsed[subCategory]) {
            results.subCategoriesUsed[subCategory] = 0;
          }
          results.subCategoriesUsed[subCategory]++;

          results.migrated++;
        } else {
          results.skipped++;
        }

        // Small delay to avoid overwhelming AI
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`  ✗ Error processing gem "${gem.value.substring(0, 40)}...":`, error.message);
        results.errors++;
      }
    }

    console.log('\n✓ All gems processed\n');

    // STEP 5: Save profile
    console.log('[5/5] Saving profile to chrome.storage...');
    await chrome.storage.local.set({ hspProfile: profile });
    console.log('✓ Profile saved\n');

    results.duration = Date.now() - startTime;

    // SUCCESS: Show summary
    console.log('====================================');
    console.log('✓ Migration Complete!');
    console.log('====================================\n');

    console.log('📊 Results:');
    console.log(`   Processed: ${results.processed} gems`);
    console.log(`   Migrated: ${results.migrated} gems`);
    console.log(`   Skipped: ${results.skipped} gems (already had SubCategories or no collections)`);
    console.log(`   Errors: ${results.errors} gems`);
    console.log(`   Duration: ${(results.duration / 1000 / 60).toFixed(1)} minutes\n`);

    console.log('📋 SubCategories Used:');
    const sortedUsage = Object.entries(results.subCategoriesUsed)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    sortedUsage.forEach(([subCat, count]) => {
      const parent = profile.subCategoryRegistry[subCat]?.parent || 'Unknown';
      console.log(`   - ${subCat} (${parent}): ${count} gems`);
    });

    if (Object.keys(results.subCategoriesUsed).length > 15) {
      console.log(`   ... and ${Object.keys(results.subCategoriesUsed).length - 15} more SubCategories`);
    }

    console.log('\n✓ Migration successful! Reload extension to see changes.');

  } catch (error) {
    console.error('✗ Migration failed:', error);
    throw error;
  }

  /**
   * Suggest SubCategory for a gem based on its collections and content
   */
  async function suggestSubCategoryForGem(gem, registry) {
    try {
      // Get main collection (first one)
      const mainCollection = gem.collections[0];

      // Get available SubCategories for this main collection
      const availableSubCats = Object.entries(registry)
        .filter(([key, data]) => data.parent === mainCollection)
        .map(([key, data]) => ({
          key,
          displayName: data.displayName
        }));

      if (availableSubCats.length === 0) {
        // No SubCategories for this collection, skip
        return null;
      }

      // Build prompt with available SubCategories
      const subCatList = availableSubCats
        .map(sub => `- ${sub.key} (${sub.displayName})`)
        .join('\n');

      const prompt = `Analyze this personal data and suggest the MOST SPECIFIC SubCategory.

Main Category: ${mainCollection}
Personal Data: "${gem.value}"

Available SubCategories for ${mainCollection}:
${subCatList}

Instructions:
1. Choose the MOST SPECIFIC SubCategory that matches the data
2. Return ONLY the SubCategory key (e.g., "fashion_style" or "health_physical")
3. If the data doesn't clearly fit any SubCategory, use "${mainCollection.toLowerCase()}_constraints"
4. Return lowercase with underscores, no spaces

Your answer (SubCategory key only):`;

      const response = await aiHelper.session.prompt(prompt);

      // Clean response
      const subCategory = response.trim().toLowerCase().replace(/\s+/g, '_');

      // Validate: Must be in available SubCategories
      const isValid = availableSubCats.some(sub => sub.key === subCategory);

      if (isValid && subCategory.length > 0 && subCategory.length < 100) {
        return subCategory;
      }

      // Fallback: constraints
      const fallback = `${mainCollection.toLowerCase()}_constraints`;
      if (registry[fallback]) {
        return fallback;
      }

      return null;

    } catch (error) {
      console.error('Error suggesting subcategory:', error);
      return null;
    }
  }
})();
