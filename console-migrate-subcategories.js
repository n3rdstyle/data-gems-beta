/**
 * Console Script: Migrate Fashion Gems to SubCategories
 *
 * Run this in the Browser Extension Popup console to quickly migrate Fashion gems.
 *
 * Usage:
 * 1. Open extension popup
 * 2. Open DevTools (F12)
 * 3. Copy and paste this entire script
 * 4. The script will automatically start and show progress
 */

(async function migrateFashionToSubCategories() {
  console.log('=== Starting Fashion SubCategory Migration ===');

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
    // Load profile from chrome.storage
    console.log('[1/5] Loading profile...');
    const data = await chrome.storage.local.get('hspProfile');
    if (!data.hspProfile) {
      throw new Error('No profile found! Make sure you have data in the extension.');
    }

    const profile = data.hspProfile;
    console.log(`✓ Profile loaded (${profile.content.preferences.items.length} total gems)`);

    // Initialize registry if not exists
    if (!profile.subCategoryRegistry) {
      profile.subCategoryRegistry = {};
      console.log('✓ Initialized subCategoryRegistry');
    }

    // Find Fashion gems
    console.log('[2/5] Finding Fashion/Lifestyle gems...');
    const gems = profile.content.preferences.items || [];
    const fashionGems = gems.filter(gem => {
      const collections = gem.collections || [];
      return collections.some(col =>
        col === 'Fashion' ||
        col === 'Lifestyle & Preferences' ||
        col === 'Lifestyle'
      );
    });

    console.log(`✓ Found ${fashionGems.length} Fashion/Lifestyle gems`);

    if (fashionGems.length === 0) {
      console.log('No Fashion gems to migrate!');
      return results;
    }

    // Initialize AI
    console.log('[3/5] Initializing Chrome Built-in AI (Gemini Nano)...');
    await aiHelper.initialize();

    if (!aiHelper.isAvailable) {
      throw new Error('AI (Gemini Nano) is not available! Please enable Chrome Built-in AI in chrome://flags');
    }

    console.log('✓ AI ready');

    // Process gems
    console.log(`[4/5] Processing ${fashionGems.length} gems...`);
    console.log('(This may take a few minutes - watch for progress updates below)');
    console.log('');

    for (let i = 0; i < fashionGems.length; i++) {
      const gem = fashionGems[i];
      results.processed++;

      // Progress every 10 gems
      if (i % 10 === 0) {
        const percentage = Math.round((i / fashionGems.length) * 100);
        console.log(`⏳ Progress: ${i}/${fashionGems.length} (${percentage}%)`);
      }

      try {
        // Skip if already has subCollections
        if (gem.subCollections && gem.subCollections.length > 0) {
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
            console.log(`  ✓ Created new SubCategory: "${subCategory}"`);
          }

          // Add subCollection to gem
          gem.subCollections = [subCategory];
          gem.updated_at = new Date().toISOString();

          // Increment count
          profile.subCategoryRegistry[subCategory].gemCount++;

          results.migrated++;
        } else {
          console.warn(`  ⚠ No subcategory suggested for: "${gem.value.substring(0, 40)}..."`);
          results.skipped++;
        }

        // Small delay to avoid overwhelming AI
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`  ✗ Error processing gem "${gem.value.substring(0, 40)}...":`, error.message);
        results.errors++;
      }
    }

    // Save profile
    console.log('[5/5] Saving profile...');
    await chrome.storage.local.set({ hspProfile: profile });
    console.log('✓ Profile saved');

    results.duration = Date.now() - startTime;

    // Print summary
    console.log('');
    console.log('=== Migration Complete ===');
    console.log(`✓ Processed: ${results.processed} gems`);
    console.log(`✓ Migrated: ${results.migrated} gems`);
    console.log(`⊘ Skipped: ${results.skipped} gems (already had SubCategories)`);
    console.log(`✗ Errors: ${results.errors} gems`);
    console.log(`✓ Duration: ${(results.duration / 1000).toFixed(1)} seconds`);
    console.log('');

    if (results.subCategoriesCreated.length > 0) {
      console.log(`✓ Created ${results.subCategoriesCreated.length} new SubCategories:`);
      results.subCategoriesCreated.forEach(sub => console.log(`  - ${sub}`));
    }

    console.log('');
    console.log('SubCategory Registry:');
    Object.keys(profile.subCategoryRegistry).forEach(subCat => {
      const data = profile.subCategoryRegistry[subCat];
      console.log(`  - ${subCat}: ${data.gemCount} gems (parent: ${data.parent})`);
    });

    console.log('');
    console.log('✓ Migration successful! Reload the extension to see changes.');

    return results;

  } catch (error) {
    console.error('✗ Migration failed:', error);
    throw error;
  }

  /**
   * Ask AI to suggest a SubCategory for a Fashion gem
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
      console.error('Error suggesting subcategory:', error);
      return null;
    }
  }
})();
