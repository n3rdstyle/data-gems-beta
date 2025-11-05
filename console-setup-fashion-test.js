/**
 * Console Script: Setup Fashion Test Data with SubCategories
 *
 * Creates a clean test environment with:
 * - Fashion (Main Category)
 * - 6 SubCategories: Style, Brands, Colors, Accessories, Trends, Constraints
 * - Sample gems for each SubCategory
 *
 * Usage:
 * 1. Open extension popup
 * 2. Open DevTools (F12)
 * 3. Copy and paste this entire script
 */

(async function setupFashionTestData() {
  console.log('=== Setting up Fashion Test Data ===');

  try {
    // Load profile
    console.log('[1/4] Loading profile...');
    const data = await chrome.storage.local.get('hspProfile');
    if (!data.hspProfile) {
      throw new Error('No profile found!');
    }

    const profile = data.hspProfile;
    console.log('✓ Profile loaded');

    // Clear existing Fashion gems (optional - comment out if you want to keep)
    console.log('[2/4] Clearing existing Fashion gems...');
    const originalCount = profile.content.preferences.items.length;
    profile.content.preferences.items = profile.content.preferences.items.filter(gem => {
      const collections = gem.collections || [];
      return !collections.some(col =>
        col === 'Fashion' ||
        col === 'Lifestyle & Preferences' ||
        col === 'Lifestyle'
      );
    });
    const removedCount = originalCount - profile.content.preferences.items.length;
    console.log(`✓ Removed ${removedCount} Fashion gems`);

    // Initialize SubCategory Registry
    console.log('[3/4] Creating SubCategory Registry...');
    profile.subCategoryRegistry = {
      style: {
        parent: 'Fashion',
        gemCount: 0,
        created_at: new Date().toISOString()
      },
      brands: {
        parent: 'Fashion',
        gemCount: 0,
        created_at: new Date().toISOString()
      },
      colors: {
        parent: 'Fashion',
        gemCount: 0,
        created_at: new Date().toISOString()
      },
      accessories: {
        parent: 'Fashion',
        gemCount: 0,
        created_at: new Date().toISOString()
      },
      trends: {
        parent: 'Fashion',
        gemCount: 0,
        created_at: new Date().toISOString()
      },
      constraints: {
        parent: 'Fashion',
        gemCount: 0,
        created_at: new Date().toISOString()
      }
    };
    console.log('✓ Created 6 SubCategories under Fashion');

    // Create sample gems for each SubCategory
    console.log('[4/4] Creating sample gems...');

    const sampleGems = [
      // Style (aesthetic preferences)
      { value: 'I prefer minimalist, clean designs', subCategory: 'style' },
      { value: 'I love streetwear and urban fashion', subCategory: 'style' },
      { value: 'My style is casual and comfortable', subCategory: 'style' },
      { value: 'I prefer timeless, classic pieces over trendy items', subCategory: 'style' },

      // Brands (favorite brands)
      { value: 'Favorite sneaker brand: Nike', subCategory: 'brands' },
      { value: 'I love Uniqlo for basics', subCategory: 'brands' },
      { value: 'Adidas has the best sportswear', subCategory: 'brands' },
      { value: 'H&M is my go-to for affordable fashion', subCategory: 'brands' },

      // Colors (color preferences)
      { value: 'Favorite clothing colors: black, white, grey', subCategory: 'colors' },
      { value: 'I avoid bright neon colors', subCategory: 'colors' },
      { value: 'I prefer earth tones and neutral colors', subCategory: 'colors' },
      { value: 'Blue is my favorite color for shirts', subCategory: 'colors' },

      // Accessories (bags, jewelry, etc.)
      { value: 'I wear a simple black leather watch daily', subCategory: 'accessories' },
      { value: 'I prefer minimalist jewelry (simple chain necklace)', subCategory: 'accessories' },
      { value: 'Favorite bag style: backpack (black or grey)', subCategory: 'accessories' },
      { value: 'I always wear silver accessories, never gold', subCategory: 'accessories' },

      // Trends (fashion trends)
      { value: 'I follow sneaker culture and collect limited editions', subCategory: 'trends' },
      { value: 'Oversized clothing trend is perfect for my style', subCategory: 'trends' },
      { value: 'I am interested in sustainable fashion trends', subCategory: 'trends' },

      // Constraints (size, budget, allergies, etc.)
      { value: 'Shoe size: EU 42 / US 9', subCategory: 'constraints' },
      { value: 'T-shirt size: Medium', subCategory: 'constraints' },
      { value: 'Budget: prefer items under €100', subCategory: 'constraints' },
      { value: 'I have sensitive skin, prefer natural fabrics (cotton, linen)', subCategory: 'constraints' }
    ];

    // Add gems to profile
    sampleGems.forEach(sample => {
      const gem = {
        id: `pref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        value: sample.value,
        assurance: 'self_declared',
        reliability: 'authoritative',
        state: 'default',
        collections: ['Fashion'],
        subCollections: [sample.subCategory],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      profile.content.preferences.items.push(gem);
      profile.subCategoryRegistry[sample.subCategory].gemCount++;
    });

    console.log(`✓ Created ${sampleGems.length} sample gems`);

    // Save profile
    console.log('[5/5] Saving profile...');
    await chrome.storage.local.set({ hspProfile: profile });
    console.log('✓ Profile saved');

    // Print summary
    console.log('');
    console.log('=== Setup Complete ===');
    console.log(`Total gems in profile: ${profile.content.preferences.items.length}`);
    console.log('');
    console.log('SubCategory Registry:');
    Object.keys(profile.subCategoryRegistry).forEach(subCat => {
      const data = profile.subCategoryRegistry[subCat];
      console.log(`  - ${subCat}: ${data.gemCount} gems (parent: ${data.parent})`);
    });
    console.log('');
    console.log('✓ Test data ready! Reload the extension to see changes.');
    console.log('');
    console.log('Test queries to try:');
    console.log('  - "recommend comfortable sneakers"');
    console.log('  - "what are my favorite colors?"');
    console.log('  - "suggest minimalist accessories"');
    console.log('  - "what brands do I like?"');

  } catch (error) {
    console.error('✗ Setup failed:', error);
    throw error;
  }
})();
