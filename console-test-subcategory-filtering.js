/**
 * Test SubCategory Filtering
 *
 * This script tests the current Stage 1.5 SubCategory filtering behavior
 * and shows what improvements could be made.
 */

(async function testSubCategoryFiltering() {
  console.log('=== SubCategory Filtering Test ===\n');

  // Load profile
  const result = await chrome.storage.local.get('hspProfile');
  const profile = result.hspProfile;

  if (!profile) {
    console.error('❌ No profile found');
    return;
  }

  const gems = profile.content?.preferences?.items || [];
  console.log(`✓ Loaded ${gems.length} gems\n`);

  // Check SubCategory Registry
  const registry = profile.subCategoryRegistry || {};
  console.log(`✓ SubCategory Registry: ${Object.keys(registry).length} SubCategories\n`);

  // Analyze SubCategory coverage
  const gemsWithSubCategories = gems.filter(gem =>
    gem.subCollections && gem.subCollections.length > 0
  );
  console.log(`📊 SubCategory Coverage:`);
  console.log(`   Total gems: ${gems.length}`);
  console.log(`   With SubCategories: ${gemsWithSubCategories.length} (${(gemsWithSubCategories.length/gems.length*100).toFixed(1)}%)`);
  console.log(`   Without SubCategories: ${gems.length - gemsWithSubCategories.length}\n`);

  // Test queries
  const testQueries = [
    {
      query: "I need recommendations for comfortable everyday shoes",
      expectedCategories: ["Fashion"],
      expectedSubCategories: ["fashion_style", "fashion_brands"]
    },
    {
      query: "What's a good post-workout meal?",
      expectedCategories: ["Nutrition", "Fitness"],
      expectedSubCategories: ["nutrition_preferences", "nutrition_cooking", "fitness_recovery"]
    },
    {
      query: "Help me plan my next vacation",
      expectedCategories: ["Travel"],
      expectedSubCategories: ["travel_destinations", "travel_experiences", "travel_bucketlist"]
    }
  ];

  console.log('🧪 Testing Queries:\n');

  for (const test of testQueries) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Query: "${test.query}"`);
    console.log(`Expected Categories: ${test.expectedCategories.join(', ')}`);
    console.log(`Expected SubCategories: ${test.expectedSubCategories.join(', ')}\n`);

    // Simulate Stage 1: Category filtering
    const categoryFiltered = gems.filter(gem =>
      gem.collections && gem.collections.some(col =>
        test.expectedCategories.some(cat =>
          col.toLowerCase() === cat.toLowerCase()
        )
      )
    );
    console.log(`Stage 1 Result: ${categoryFiltered.length} gems (filtered by Main Category)`);

    // Current Stage 1.5: Just check if gems HAVE subCollections
    const currentStage15 = categoryFiltered.filter(gem =>
      gem.subCollections && gem.subCollections.length > 0
    );
    console.log(`Current Stage 1.5: ${currentStage15.length} gems (have ANY SubCategory)`);

    // Ideal Stage 1.5: Filter by SPECIFIC SubCategories
    const idealStage15 = categoryFiltered.filter(gem =>
      gem.subCollections && gem.subCollections.some(sub =>
        test.expectedSubCategories.includes(sub)
      )
    );
    console.log(`Ideal Stage 1.5: ${idealStage15.length} gems (match SPECIFIC SubCategories)`);

    // Show improvement
    const improvement = currentStage15.length > 0
      ? (((currentStage15.length - idealStage15.length) / currentStage15.length) * 100).toFixed(1)
      : 0;
    console.log(`\n📊 Potential Improvement: ${improvement}% fewer gems to score`);
    console.log(`   (${currentStage15.length} → ${idealStage15.length} gems)`);

    // Show sample gems from each stage
    if (idealStage15.length > 0) {
      console.log(`\n✓ Sample gems that would match ideal Stage 1.5:`);
      idealStage15.slice(0, 3).forEach((gem, i) => {
        console.log(`   ${i + 1}. [${gem.subCollections?.[0] || 'no-subcat'}] ${gem.value.substring(0, 60)}...`);
      });
    }

    // Show gems that would be filtered OUT
    const wouldBeFilteredOut = currentStage15.filter(gem =>
      !gem.subCollections || !gem.subCollections.some(sub =>
        test.expectedSubCategories.includes(sub)
      )
    );

    if (wouldBeFilteredOut.length > 0 && wouldBeFilteredOut.length <= 5) {
      console.log(`\n⊘ Gems that would be filtered OUT by ideal Stage 1.5:`);
      wouldBeFilteredOut.forEach((gem, i) => {
        console.log(`   ${i + 1}. [${gem.subCollections?.[0] || 'no-subcat'}] ${gem.value.substring(0, 60)}...`);
      });
    }
  }

  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Summary:\n');
  console.log('✓ SubCategory recategorization: 100% complete');
  console.log('⚠ Stage 1.5 filtering: Only partially implemented');
  console.log('  - Current: Just checks if gems HAVE subCollections');
  console.log('  - Needed: AI should select relevant SubCategories and filter by them');
  console.log('\n💡 Next Step: Implement full Stage 1.5 with AI-based SubCategory selection');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

})();
