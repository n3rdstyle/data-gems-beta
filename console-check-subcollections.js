/**
 * Console Script: Check SubCollections Data Quality
 *
 * Identifies gems with invalid subCollections
 */

(async function checkSubCollections() {
  console.log('=== Checking SubCollections Data Quality ===\n');

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

    // Analyze subCollections
    const stats = {
      validArray: 0,
      emptyArray: 0,
      null: 0,
      undefined: 0,
      string: 0,
      other: 0
    };

    const invalidGems = [];

    gems.forEach((gem, index) => {
      if (gem.subCollections === undefined) {
        stats.undefined++;
        invalidGems.push({ index, id: gem.id, type: 'undefined', value: gem.value.substring(0, 50) });
      } else if (gem.subCollections === null) {
        stats.null++;
        invalidGems.push({ index, id: gem.id, type: 'null', value: gem.value.substring(0, 50) });
      } else if (typeof gem.subCollections === 'string') {
        stats.string++;
        invalidGems.push({ index, id: gem.id, type: 'string', subCollections: gem.subCollections, value: gem.value.substring(0, 50) });
      } else if (Array.isArray(gem.subCollections)) {
        if (gem.subCollections.length === 0) {
          stats.emptyArray++;
        } else {
          stats.validArray++;
        }
      } else {
        stats.other++;
        invalidGems.push({ index, id: gem.id, type: typeof gem.subCollections, value: gem.value.substring(0, 50) });
      }
    });

    console.log('📈 SubCollections Status:');
    console.log(`   ✓ Valid Array (with data): ${stats.validArray} gems (${(stats.validArray/gems.length*100).toFixed(1)}%)`);
    console.log(`   ⊘ Empty Array: ${stats.emptyArray} gems (${(stats.emptyArray/gems.length*100).toFixed(1)}%)`);
    console.log(`   ✗ Undefined: ${stats.undefined} gems`);
    console.log(`   ✗ Null: ${stats.null} gems`);
    console.log(`   ✗ String: ${stats.string} gems`);
    console.log(`   ✗ Other type: ${stats.other} gems\n`);

    if (invalidGems.length > 0) {
      console.log(`⚠️ Found ${invalidGems.length} gems with INVALID subCollections:\n`);
      invalidGems.slice(0, 10).forEach(gem => {
        console.log(`[${gem.index}] Type: ${gem.type}, Value: "${gem.value}..."`);
        if (gem.subCollections) {
          console.log(`    subCollections value: ${gem.subCollections}`);
        }
      });
      if (invalidGems.length > 10) {
        console.log(`\n... and ${invalidGems.length - 10} more invalid gems`);
      }
    } else {
      console.log('🎉 All gems have valid subCollections arrays!');
    }

    // Action items
    if (stats.undefined > 0 || stats.null > 0 || stats.string > 0 || stats.other > 0) {
      console.log('\n⚡ ACTION REQUIRED:');
      console.log('Your gems have invalid subCollections that need to be fixed.');
      console.log('Run console-reset-and-recategorize.js to re-categorize all gems.');
    }

  } catch (error) {
    console.error('✗ Error:', error);
  }
})();
