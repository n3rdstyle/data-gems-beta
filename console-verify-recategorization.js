/**
 * Console Script: Verify Recategorization
 *
 * Checks if imported JSON has correct Main Categories + SubCategories
 */

(async function verifyRecategorization() {
  console.log('=== Verifying Recategorization ===\n');

  try {
    // Load profile
    const data = await chrome.storage.local.get('hspProfile');
    if (!data.hspProfile) {
      console.error('✗ No profile found!');
      return;
    }

    const profile = data.hspProfile;
    const gems = profile.content.preferences.items || [];
    const registry = profile.subCategoryRegistry || {};

    console.log('📊 Profile Status:');
    console.log(`   Total Gems: ${gems.length}`);
    console.log(`   SubCategory Registry: ${Object.keys(registry).length} SubCategories\n`);

    // Check SubCategory Registry
    if (Object.keys(registry).length === 0) {
      console.error('✗ SubCategory Registry is EMPTY!');
      return;
    }

    console.log('✓ SubCategory Registry OK\n');

    // Analyze gems
    const withBoth = gems.filter(g =>
      g.collections && g.collections.length > 0 &&
      g.subCollections && g.subCollections.length > 0
    );

    const withCategoryOnly = gems.filter(g =>
      g.collections && g.collections.length > 0 &&
      (!g.subCollections || g.subCollections.length === 0)
    );

    const empty = gems.filter(g =>
      (!g.collections || g.collections.length === 0) &&
      (!g.subCollections || g.subCollections.length === 0)
    );

    console.log('📈 Categorization Status:');
    console.log(`   ✓ Fully Categorized: ${withBoth.length} gems (${(withBoth.length/gems.length*100).toFixed(1)}%)`);
    console.log(`   ⚠ Only Category: ${withCategoryOnly.length} gems`);
    console.log(`   ✗ Empty: ${empty.length} gems\n`);

    if (withBoth.length === gems.length) {
      console.log('🎉 SUCCESS! All gems are fully categorized!\n');
    } else if (withBoth.length === 0) {
      console.error('✗ FAILED! No gems are categorized!\n');
      return;
    } else {
      console.log('⚠ PARTIAL: Some gems need recategorization\n');
    }

    // Analyze Main Categories distribution
    const categoryCount = {};
    withBoth.forEach(g => {
      const cat = g.collections[0];
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    console.log('📋 Main Categories Distribution (Top 10):');
    Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([cat, count]) => {
        const percentage = (count / withBoth.length * 100).toFixed(1);
        console.log(`   - ${cat}: ${count} gems (${percentage}%)`);
      });

    console.log('');

    // Analyze SubCategories distribution
    const subCategoryCount = {};
    withBoth.forEach(g => {
      const subCat = g.subCollections[0];
      subCategoryCount[subCat] = (subCategoryCount[subCat] || 0) + 1;
    });

    console.log('📋 SubCategories Distribution (Top 15):');
    Object.entries(subCategoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .forEach(([subCat, count]) => {
        const parent = registry[subCat]?.parent || '?';
        const percentage = (count / withBoth.length * 100).toFixed(1);
        console.log(`   - ${subCat} (${parent}): ${count} gems (${percentage}%)`);
      });

    console.log('');

    // Check for "constraints" SubCategories (fallback indicator)
    const constraintsCount = Object.entries(subCategoryCount)
      .filter(([subCat]) => subCat.endsWith('_constraints'))
      .reduce((sum, [, count]) => sum + count, 0);

    const constraintsPercentage = (constraintsCount / withBoth.length * 100).toFixed(1);

    console.log('📊 Quality Metrics:');
    console.log(`   Specific SubCategories: ${withBoth.length - constraintsCount} gems (${(100 - constraintsPercentage).toFixed(1)}%)`);
    console.log(`   Generic (constraints): ${constraintsCount} gems (${constraintsPercentage}%)\n`);

    if (constraintsPercentage > 70) {
      console.warn('⚠ Warning: >70% of gems use generic "_constraints" SubCategories');
      console.warn('   Consider improving SubCategory rules for better specificity\n');
    } else if (constraintsPercentage > 50) {
      console.log('⚠ Note: ~50% of gems use "_constraints" - this is acceptable but could be improved\n');
    } else {
      console.log('✓ Good specificity: Most gems have specific SubCategories\n');
    }

    // Show sample categorized gems
    console.log('📝 Sample Categorized Gems (random 5):');
    const samples = [];
    for (let i = 0; i < 5 && i < withBoth.length; i++) {
      const randomIndex = Math.floor(Math.random() * withBoth.length);
      samples.push(withBoth[randomIndex]);
    }

    samples.forEach(g => {
      const value = g.value.substring(0, 50).replace(/\n/g, ' ');
      console.log(`   "${value}..."`);
      console.log(`   → ${g.collections[0]} > ${g.subCollections[0]}\n`);
    });

    // Final verdict
    console.log('====================================');
    if (withBoth.length === gems.length) {
      console.log('✓ VERIFICATION PASSED!');
      console.log('====================================\n');
      console.log('✓ All gems are properly categorized');
      console.log('✓ SubCategory Registry is complete');
      console.log('✓ Ready to use the SubCategory system!');
    } else {
      console.log('⚠ VERIFICATION INCOMPLETE');
      console.log('====================================\n');
      console.log(`⚠ ${gems.length - withBoth.length} gems still need categorization`);
      console.log('   Run recategorization script to fix');
    }

  } catch (error) {
    console.error('✗ Verification failed:', error);
  }
})();
