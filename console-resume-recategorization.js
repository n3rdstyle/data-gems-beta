/**
 * Console Script: Resume Recategorization (FAST)
 *
 * Continues migration for gems that are NOT yet categorized
 * Skips gems that already have both category and subcategory
 */

(async function resumeRecategorization() {
  console.log('=== Resuming Recategorization (FAST) ===\n');

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
    // Load profile
    console.log('[1/4] Loading profile...');
    const data = await chrome.storage.local.get('hspProfile');
    if (!data.hspProfile) {
      throw new Error('No profile found!');
    }

    const profile = data.hspProfile;
    const gems = profile.content.preferences.items || [];
    console.log(`✓ Profile loaded with ${gems.length} gems\n`);

    // Check registry
    console.log('[2/4] Checking SubCategory Registry...');
    if (!profile.subCategoryRegistry || Object.keys(profile.subCategoryRegistry).length === 0) {
      throw new Error('SubCategory Registry not found!');
    }
    console.log(`✓ Registry OK\n`);

    // Filter: Only gems WITHOUT full categorization
    const uncategorized = gems.filter(g =>
      !g.collections || g.collections.length === 0 ||
      !g.subCollections || g.subCollections.length === 0
    );

    const alreadyCategorized = gems.length - uncategorized.length;

    console.log(`📊 Status:`);
    console.log(`   Already categorized: ${alreadyCategorized} gems`);
    console.log(`   Need categorization: ${uncategorized.length} gems\n`);

    if (uncategorized.length === 0) {
      console.log('✓ All gems already categorized!');
      return;
    }

    // Initialize AI
    console.log('[3/4] Initializing AI...');
    await aiHelper.initialize();
    if (!aiHelper.isAvailable) {
      throw new Error('AI not available!');
    }
    console.log('✓ AI ready\n');

    // Process uncategorized gems
    console.log(`[4/4] Processing ${uncategorized.length} uncategorized gems...`);
    console.log('⏳ Estimated time: ' + Math.round(uncategorized.length * 0.8 / 60) + ' minutes\n');

    for (let i = 0; i < uncategorized.length; i++) {
      const gem = uncategorized[i];
      results.processed++;

      // Progress every 25 gems
      if (i > 0 && i % 25 === 0) {
        const percentage = Math.round((i / uncategorized.length) * 100);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
        const estimated = Math.round((elapsed / i) * (uncategorized.length - i));
        console.log(`⏳ ${i}/${uncategorized.length} (${percentage}%) - ${elapsed}s elapsed, ~${estimated}s remaining`);
      }

      try {
        const categorization = await categorizeFast(gem, taxonomy, profile.subCategoryRegistry);

        if (categorization.mainCategory && categorization.subCategory) {
          gem.collections = [categorization.mainCategory];
          gem.subCollections = [categorization.subCategory];
          gem.updated_at = new Date().toISOString();

          profile.subCategoryRegistry[categorization.subCategory].gemCount++;

          results.categoriesUsed[categorization.mainCategory] =
            (results.categoriesUsed[categorization.mainCategory] || 0) + 1;
          results.subCategoriesUsed[categorization.subCategory] =
            (results.subCategoriesUsed[categorization.subCategory] || 0) + 1;

          results.categorized++;
        } else {
          results.skipped++;
        }

        await new Promise(resolve => setTimeout(resolve, 80));

      } catch (error) {
        console.error(`  ✗ Error: "${gem.value.substring(0, 40)}..."`);
        results.errors++;
      }
    }

    console.log('\n✓ Processing complete\n');

    // Save
    console.log('Saving...');
    await chrome.storage.local.set({ hspProfile: profile });
    console.log('✓ Saved\n');

    results.duration = Date.now() - startTime;

    // Summary
    console.log('====================================');
    console.log('✓ Resume Complete!');
    console.log('====================================\n');

    console.log('📊 Results:');
    console.log(`   Processed: ${results.processed} gems`);
    console.log(`   Categorized: ${results.categorized} gems`);
    console.log(`   Skipped: ${results.skipped} gems`);
    console.log(`   Errors: ${results.errors} gems`);
    console.log(`   Duration: ${(results.duration / 1000 / 60).toFixed(1)} minutes`);

    console.log('\n✓ Done! Total categorized: ' + (alreadyCategorized + results.categorized) + '/' + gems.length);

  } catch (error) {
    console.error('✗ Failed:', error);
  }

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

      const parts = cleaned.split('|');
      if (parts.length !== 2) {
        return { mainCategory: null, subCategory: null };
      }

      const mainCategory = parts[0].trim();
      const subCatShort = parts[1].trim().toLowerCase();

      if (!taxonomy[mainCategory]) {
        return { mainCategory: null, subCategory: null };
      }

      const subCategory = `${mainCategory.toLowerCase()}_${subCatShort}`;

      if (!registry[subCategory]) {
        const fallback = `${mainCategory.toLowerCase()}_constraints`;
        if (registry[fallback]) {
          return { mainCategory, subCategory: fallback };
        }
        return { mainCategory: null, subCategory: null };
      }

      return { mainCategory, subCategory };

    } catch (error) {
      return { mainCategory: null, subCategory: null };
    }
  }
})();
