/**
 * Console Script: Check Recategorization Progress
 *
 * Monitors the current status of gem categorization
 */

(async function checkProgress() {
  console.log('=== Checking Recategorization Progress ===\n');

  try {
    const data = await chrome.storage.local.get('hspProfile');
    if (!data.hspProfile) {
      console.error('✗ No profile found!');
      return;
    }

    const profile = data.hspProfile;
    const gems = profile.content.preferences.items || [];

    // Count categorization status
    const withBoth = gems.filter(g =>
      g.collections && g.collections.length > 0 &&
      g.subCollections && g.subCollections.length > 0
    );

    const withCategory = gems.filter(g =>
      g.collections && g.collections.length > 0 &&
      (!g.subCollections || g.subCollections.length === 0)
    );

    const empty = gems.filter(g =>
      (!g.collections || g.collections.length === 0) &&
      (!g.subCollections || g.subCollections.length === 0)
    );

    const onlySub = gems.filter(g =>
      (!g.collections || g.collections.length === 0) &&
      g.subCollections && g.subCollections.length > 0
    );

    console.log('📊 Current Status:');
    console.log(`   Total Gems: ${gems.length}`);
    console.log(`   ✓ Fully Categorized (Category + SubCategory): ${withBoth.length}`);
    console.log(`   ⚠ Only Category (no SubCategory): ${withCategory.length}`);
    console.log(`   ⚠ Only SubCategory (no Category): ${onlySub.length}`);
    console.log(`   ✗ Empty (no categorization): ${empty.length}\n`);

    // Progress percentage
    const progress = ((withBoth.length / gems.length) * 100).toFixed(1);
    console.log(`📈 Progress: ${progress}% (${withBoth.length}/${gems.length})`);

    // Show last 5 categorized gems
    if (withBoth.length > 0) {
      console.log('\n✓ Last 5 categorized gems:');
      withBoth.slice(-5).forEach(g => {
        console.log(`   - "${g.value.substring(0, 40)}..." → ${g.collections[0]} > ${g.subCollections[0]}`);
      });
    }

    // Show sample empty gems
    if (empty.length > 0) {
      console.log('\n⏳ Sample gems still waiting (first 5):');
      empty.slice(0, 5).forEach(g => {
        console.log(`   - "${g.value.substring(0, 50)}..."`);
      });
    }

    console.log('\n💡 Tip: Run this script again in 30 seconds to see progress');

  } catch (error) {
    console.error('✗ Check failed:', error);
  }
})();
