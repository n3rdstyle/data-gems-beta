/**
 * Console Script: Reset & Recategorize ALL Gems (FAST VERSION)
 *
 * Deletes all existing collections and assigns new ones with SINGLE AI call per gem
 *
 * Usage:
 * 1. Open extension popup
 * 2. Open DevTools (F12)
 * 3. Copy and paste this entire script
 * 4. Wait ~6-8 minutes for completion (457 gems × ~0.8 seconds each)
 */

(async function resetAndRecategorizeFast() {
  console.log('=== Reset & Recategorize ALL Gems (FAST) ===\n');

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

  // Taxonomy: Category -> SubCategories
  const taxonomy = {
    'Identity': ['origin', 'language', 'demographics', 'background', 'selfimage', 'constraints'],
    'Personality': ['traits', 'strengths', 'weaknesses', 'behavior', 'motivation', 'constraints'],
    'Mindset': ['attitude', 'perspective', 'resilience', 'curiosity', 'growth', 'constraints'],
    'Values': ['ethics', 'priorities', 'beliefs', 'integrity', 'purpose', 'constraints'],
    'Habits': ['morning', 'evening', 'digital', 'health', 'productivity', 'constraints'],
    'Health': ['physical', 'mental', 'sleep', 'stress', 'energy', 'constraints'],
    'Nutrition': ['diet', 'preferences', 'restrictions', 'cooking', 'eatingout', 'constraints'],
    'Fitness': ['training', 'mobility', 'recovery', 'endurance', 'strength', 'constraints'],
    'Sports': ['running', 'teamsports', 'outdoor', 'water', 'adventure', 'constraints'],
    'Recovery': ['sleep', 'relaxation', 'mindfulness', 'bodycare', 'balance', 'constraints'],
    'Work': ['role', 'environment', 'collaboration', 'motivation', 'projects', 'constraints'],
    'Career': ['path', 'skills', 'goals', 'achievements', 'network', 'constraints'],
    'Learning': ['topics', 'style', 'courses', 'curiosity', 'knowledge', 'constraints'],
    'Creativity': ['ideas', 'inspiration', 'expression', 'making', 'aesthetics', 'constraints'],
    'Productivity': ['tools', 'focus', 'time', 'systems', 'flow', 'constraints'],
    'Technology': ['devices', 'software', 'ai', 'automation', 'innovation', 'constraints'],
    'Fashion': ['style', 'brands', 'colors', 'accessories', 'trends', 'constraints'],
    'Design': ['visuals', 'interior', 'ux', 'architecture', 'minimalism', 'constraints'],
    'Music': ['genres', 'artists', 'playlists', 'instruments', 'concerts', 'constraints'],
    'Movies': ['genres', 'directors', 'favorites', 'series', 'streaming', 'constraints'],
    'Books': ['genres', 'authors', 'favorites', 'learning', 'fiction', 'constraints'],
    'Media': ['podcasts', 'news', 'social', 'magazines', 'influences', 'constraints'],
    'Art': ['visual', 'modern', 'photography', 'exhibitions', 'expression', 'constraints'],
    'Travel': ['destinations', 'culture', 'experiences', 'bucketlist', 'memories', 'constraints'],
    'Home': ['location', 'interior', 'comfort', 'rituals', 'atmosphere', 'constraints'],
    'Living': ['housing', 'neighborhood', 'lifestyle', 'energy', 'minimalism', 'constraints'],
    'Nature': ['outdoor', 'climate', 'plants', 'animals', 'connection', 'constraints'],
    'Sustainability': ['consumption', 'waste', 'energy', 'food', 'awareness', 'constraints'],
    'Family': ['partner', 'children', 'parents', 'traditions', 'support', 'constraints'],
    'Friends': ['circle', 'trust', 'activities', 'memories', 'loyalty', 'constraints'],
    'Community': ['local', 'online', 'sharedvalues', 'contribution', 'events', 'constraints'],
    'Pets': ['species', 'routine', 'care', 'behavior', 'bond', 'constraints'],
    'Lifestyle': ['routine', 'choices', 'attitude', 'balance', 'aesthetics', 'constraints'],
    'Shopping': ['preferences', 'habits', 'budget', 'online', 'discovery', 'constraints'],
    'Brands': ['favorites', 'trust', 'loyalty', 'image', 'experience', 'constraints'],
    'Consumption': ['products', 'media', 'food', 'fashion', 'tech', 'constraints'],
    'Emotions': ['mood', 'triggers', 'expression', 'regulation', 'empathy', 'constraints'],
    'Goals': ['shortterm', 'longterm', 'personal', 'professional', 'fitness', 'constraints'],
    'Context': ['situation', 'environment', 'device', 'activity', 'interaction', 'constraints'],
    'Behavior': ['online', 'social', 'purchase', 'learning', 'health', 'constraints'],
    'Location': ['city', 'country', 'home', 'work', 'travel', 'constraints'],
    'Time': ['morning', 'afternoon', 'evening', 'weekend', 'season', 'constraints']
  };

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
      throw new Error('AI (Gemini Nano) is not available!');
    }

    console.log('✓ AI ready\n');

    // STEP 5: Recategorize all gems
    console.log(`[5/6] Recategorizing ${gems.length} gems...`);
    console.log('⏳ This will take approximately ' + Math.round(gems.length * 0.8 / 60) + ' minutes (FAST MODE)\n');
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
        // Single AI call for both category and subcategory
        const categorization = await categorizeFast(gem, taxonomy, profile.subCategoryRegistry);

        if (categorization.mainCategory && categorization.subCategory) {
          // Assign to gem
          gem.collections = [categorization.mainCategory];
          gem.subCollections = [categorization.subCategory];
          gem.updated_at = new Date().toISOString();

          // Increment registry count
          profile.subCategoryRegistry[categorization.subCategory].gemCount++;

          // Track usage
          results.categoriesUsed[categorization.mainCategory] =
            (results.categoriesUsed[categorization.mainCategory] || 0) + 1;
          results.subCategoriesUsed[categorization.subCategory] =
            (results.subCategoriesUsed[categorization.subCategory] || 0) + 1;

          results.categorized++;
        } else {
          results.skipped++;
        }

        // Shorter delay (fast mode)
        await new Promise(resolve => setTimeout(resolve, 80));

      } catch (error) {
        console.error(`  ✗ Error: "${gem.value.substring(0, 40)}...":`, error.message);
        results.errors++;
      }
    }

    console.log('\n✓ All gems processed\n');

    // STEP 6: Save profile
    console.log('[6/6] Saving profile to chrome.storage...');
    await chrome.storage.local.set({ hspProfile: profile });
    console.log('✓ Profile saved\n');

    results.duration = Date.now() - startTime;

    // Show summary
    console.log('====================================');
    console.log('✓ Recategorization Complete!');
    console.log('====================================\n');

    console.log('📊 Results:');
    console.log(`   Processed: ${results.processed} gems`);
    console.log(`   Categorized: ${results.categorized} gems`);
    console.log(`   Skipped: ${results.skipped} gems`);
    console.log(`   Errors: ${results.errors} gems`);
    console.log(`   Duration: ${(results.duration / 1000 / 60).toFixed(1)} minutes\n`);

    console.log('📋 Top Categories Used:');
    Object.entries(results.categoriesUsed)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([cat, count]) => console.log(`   - ${cat}: ${count} gems`));

    console.log('\n📋 Top SubCategories Used:');
    Object.entries(results.subCategoriesUsed)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .forEach(([sub, count]) => {
        const parent = profile.subCategoryRegistry[sub]?.parent || '?';
        console.log(`   - ${sub} (${parent}): ${count} gems`);
      });

    console.log('\n✓ Recategorization successful! Reload extension.');

  } catch (error) {
    console.error('✗ Failed:', error);
    throw error;
  }

  /**
   * FAST categorization: Both category and subcategory in ONE prompt
   */
  async function categorizeFast(gem, taxonomy, registry) {
    try {
      const categoryList = Object.keys(taxonomy).join(', ');

      const prompt = `Analyze this personal data and output BOTH category and subcategory.

Personal Data: "${gem.value}"

Categories: ${categoryList}

Instructions:
1. Choose the ONE best category
2. Then choose the best subcategory under that category
3. Output ONLY in this format: "Category|subcategory"
4. Example outputs: "Fashion|style", "Health|physical", "Work|role"
5. Use lowercase for subcategory, capitalize Category

Your answer (Category|subcategory):`;

      const response = await aiHelper.session.prompt(prompt);
      const cleaned = response.trim();

      // Parse response: "Fashion|style"
      const parts = cleaned.split('|');
      if (parts.length !== 2) {
        return { mainCategory: null, subCategory: null };
      }

      const mainCategory = parts[0].trim();
      const subCatShort = parts[1].trim().toLowerCase();

      // Validate category exists
      if (!taxonomy[mainCategory]) {
        return { mainCategory: null, subCategory: null };
      }

      // Build full subcategory key
      const subCategory = `${mainCategory.toLowerCase()}_${subCatShort}`;

      // Validate subcategory exists in registry
      if (!registry[subCategory]) {
        // Try fallback to constraints
        const fallback = `${mainCategory.toLowerCase()}_constraints`;
        if (registry[fallback]) {
          return { mainCategory, subCategory: fallback };
        }
        return { mainCategory: null, subCategory: null };
      }

      return { mainCategory, subCategory };

    } catch (error) {
      console.error('Error categorizing:', error);
      return { mainCategory: null, subCategory: null };
    }
  }
})();
