/**
 * Console Script: Rebuild SubCategory Registry
 *
 * Scans all gems and rebuilds the subCategoryRegistry from their subCollections
 */

(async function rebuildRegistry() {
  console.log('=== Rebuilding SubCategory Registry ===\n');

  try {
    // Load profile
    const data = await chrome.storage.local.get('hspProfile');
    if (!data.hspProfile) {
      console.error('✗ No profile found!');
      return;
    }

    const profile = data.hspProfile;
    const gems = profile.content.preferences.items || [];

    console.log(`📊 Total Gems: ${gems.length}\n`);

    // Build registry from existing gems
    const registry = {};

    gems.forEach(gem => {
      const collections = gem.collections || [];
      const subCollections = gem.subCollections || [];

      // Only process gems with valid subCollections
      if (Array.isArray(subCollections) && subCollections.length > 0) {
        subCollections.forEach(subCatKey => {
          // Initialize registry entry if it doesn't exist
          if (!registry[subCatKey]) {
            // Try to infer parent category from subCategory key
            // Format: "fitness_training" → parent: "Fitness"
            const parts = subCatKey.split('_');
            const parentGuess = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);

            // Check if gem has matching collection
            const matchingCollection = collections.find(col =>
              col.toLowerCase() === parts[0].toLowerCase()
            );

            registry[subCatKey] = {
              parent: matchingCollection || parentGuess,
              displayName: parts.slice(1).map(p =>
                p.charAt(0).toUpperCase() + p.slice(1)
              ).join(' ') || 'Constraints',
              gemCount: 0,
              created_at: new Date().toISOString()
            };
          }

          // Increment gem count
          registry[subCatKey].gemCount++;
        });
      }
    });

    console.log(`✓ Built registry with ${Object.keys(registry).length} SubCategories\n`);

    // Show top 20 SubCategories
    const sorted = Object.entries(registry)
      .sort((a, b) => b[1].gemCount - a[1].gemCount)
      .slice(0, 20);

    console.log('📈 Top 20 SubCategories by gem count:');
    sorted.forEach(([key, data]) => {
      console.log(`   ${key} (${data.parent}): ${data.gemCount} gems`);
    });

    // Update profile
    profile.subCategoryRegistry = registry;

    // Save back
    await chrome.storage.local.set({ hspProfile: profile });

    console.log('\n✓ Registry saved to profile!');
    console.log('\n🎯 Next steps:');
    console.log('   1. Reload the extension');
    console.log('   2. Test "Recommend me new running shoes" again');
    console.log('   3. Stage 1.5 should now work and reduce gems from ~64 to ~15-20');

  } catch (error) {
    console.error('✗ Error:', error);
  }
})();
