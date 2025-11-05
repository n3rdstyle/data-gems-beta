/**
 * Console Script: Verify SubCategory Taxonomy
 *
 * Checks if SubCategory Registry was created successfully
 */

(async function verifyTaxonomy() {
  console.log('=== Verifying SubCategory Taxonomy ===');

  try {
    // Load profile
    const data = await chrome.storage.local.get('hspProfile');
    if (!data.hspProfile) {
      console.error('✗ No profile found!');
      return;
    }

    const profile = data.hspProfile;

    // Check registry
    if (!profile.subCategoryRegistry) {
      console.error('✗ No subCategoryRegistry found!');
      return;
    }

    const registry = profile.subCategoryRegistry;
    const subCatCount = Object.keys(registry).length;

    console.log(`✓ SubCategory Registry exists with ${subCatCount} SubCategories`);
    console.log('');

    // Group by parent
    const grouped = {};
    Object.keys(registry).forEach(subCatKey => {
      const parent = registry[subCatKey].parent;
      if (!grouped[parent]) {
        grouped[parent] = [];
      }
      grouped[parent].push(subCatKey);
    });

    const categoryCount = Object.keys(grouped).length;
    console.log(`✓ ${categoryCount} Main Categories found`);
    console.log('');

    // Show first 5 categories with their subcategories
    console.log('Sample Categories (first 5):');
    Object.keys(grouped).sort().slice(0, 5).forEach(parent => {
      console.log(`  ${parent} (${grouped[parent].length} SubCategories):`);
      grouped[parent].forEach(sub => {
        console.log(`    - ${sub}`);
      });
    });

    console.log('');
    console.log('Full list of Categories:');
    console.log(Object.keys(grouped).sort().join(', '));

    console.log('');
    console.log('✓ Taxonomy verification complete!');

  } catch (error) {
    console.error('✗ Verification failed:', error);
  }
})();
