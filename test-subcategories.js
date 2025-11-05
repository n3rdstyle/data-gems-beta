/**
 * SubCategory System Test Script
 * Run this in Browser Console on popup.html to test Phase 1
 */

async function testSubCategorySystem() {
  console.log('=== SubCategory System Test ===\n');

  // Load current profile
  const { hspProfile } = await chrome.storage.local.get(['hspProfile']);

  if (!hspProfile) {
    console.error('❌ No profile found! Please create a profile first.');
    return;
  }

  console.log('✓ Profile loaded');
  console.log('Current gems:', hspProfile.content.preferences.items.length);

  // Initialize registry if not exists
  if (!hspProfile.subCategoryRegistry) {
    console.log('\n📝 Initializing subCategoryRegistry...');
    hspProfile.subCategoryRegistry = {};
  } else {
    console.log('\n✓ subCategoryRegistry exists');
    console.log('Current subcategories:', Object.keys(hspProfile.subCategoryRegistry).length);
  }

  // Test 1: Create SubCategories for Fashion
  console.log('\n--- Test 1: Create SubCategories ---');

  const fashionSubCategories = ['shoes', 'tshirts', 'pants', 'jackets', 'accessories'];

  fashionSubCategories.forEach(subCat => {
    if (!hspProfile.subCategoryRegistry[subCat]) {
      hspProfile.subCategoryRegistry[subCat] = {
        parent: 'Fashion',
        gemCount: 0,
        created_at: new Date().toISOString()
      };
      console.log(`✓ Created: ${subCat} (parent: Fashion)`);
    } else {
      console.log(`→ Already exists: ${subCat}`);
    }
  });

  // Test 2: Add SubCollection to a test gem
  console.log('\n--- Test 2: Add SubCollection to Gem ---');

  // Find a Fashion gem
  const fashionGems = hspProfile.content.preferences.items.filter(gem =>
    gem.collections?.includes('Fashion') ||
    gem.collections?.includes('Lifestyle & Preferences')
  );

  console.log(`Found ${fashionGems.length} Fashion/Lifestyle gems`);

  if (fashionGems.length > 0) {
    const testGem = fashionGems[0];
    console.log(`\nTest Gem: "${testGem.value.substring(0, 50)}..."`);
    console.log('Current collections:', testGem.collections);
    console.log('Current subCollections:', testGem.subCollections || '(none)');

    // Add subCollection if not exists
    if (!testGem.subCollections) {
      testGem.subCollections = ['shoes']; // Example
      testGem.updated_at = new Date().toISOString();
      console.log('✓ Added subCollections: ["shoes"]');
    } else {
      console.log('→ Already has subCollections:', testGem.subCollections);
    }
  }

  // Test 3: Get all SubCategories for Fashion
  console.log('\n--- Test 3: Query SubCategories ---');

  const fashionSubs = Object.entries(hspProfile.subCategoryRegistry)
    .filter(([_, subCat]) => subCat.parent === 'Fashion')
    .map(([name, _]) => name);

  console.log(`Fashion SubCategories (${fashionSubs.length}):`, fashionSubs);

  // Test 4: Count gems per SubCategory (if any have subCollections)
  console.log('\n--- Test 4: Gem Distribution ---');

  const gemsWithSubCollections = hspProfile.content.preferences.items.filter(gem =>
    gem.subCollections && gem.subCollections.length > 0
  );

  console.log(`Gems with subCollections: ${gemsWithSubCollections.length}`);

  if (gemsWithSubCollections.length > 0) {
    console.log('\nSample gems:');
    gemsWithSubCollections.slice(0, 3).forEach(gem => {
      console.log(`- "${gem.value.substring(0, 40)}..." → ${gem.subCollections.join(', ')}`);
    });
  }

  // Save profile
  console.log('\n--- Saving Profile ---');
  await chrome.storage.local.set({ hspProfile });
  console.log('✓ Profile saved');

  // Summary
  console.log('\n=== Test Summary ===');
  console.log(`✓ SubCategory Registry: ${Object.keys(hspProfile.subCategoryRegistry).length} entries`);
  console.log(`✓ Gems with SubCollections: ${gemsWithSubCollections.length}`);
  console.log(`✓ Total Gems: ${hspProfile.content.preferences.items.length}`);

  console.log('\n✅ Phase 1 Test Complete!');
  console.log('Next: Run migration script to assign SubCategories to all Fashion gems');

  return hspProfile;
}

// Auto-run if in browser context
if (typeof chrome !== 'undefined' && chrome.storage) {
  console.log('Run: testSubCategorySystem()');
}
