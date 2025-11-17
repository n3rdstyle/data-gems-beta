/**
 * Console Script: Debug Gem Storage
 *
 * Compares gems in RxDB vs hspProfile to identify storage/display issues:
 * - Shows all gems in RxDB (what UI should display)
 * - Shows all items in hspProfile (what gets exported)
 * - Highlights mismatches
 *
 * Usage:
 * 1. Open extension popup
 * 2. Open DevTools (F12)
 * 3. Copy and paste this entire script
 */

(async function debugGemStorage() {
  console.log('=== Gem Storage Debug ===\n');

  try {
    // Check RxDB via ContextEngineAPI
    console.log('[1/3] Checking RxDB via ContextEngineAPI...');

    if (typeof self.ContextEngineAPI === 'undefined') {
      console.error('❌ ContextEngineAPI is undefined');
      console.log('💡 Make sure the extension is fully loaded');
      return;
    }

    if (!self.ContextEngineAPI.isReady) {
      console.error('❌ ContextEngineAPI not ready');
      console.log('💡 Try waiting a few seconds and run again');
      return;
    }

    // Get all gems from RxDB using the API
    const rxdbGems = await self.ContextEngineAPI.getAllGems();
    console.log(`✓ RxDB initialized with ${rxdbGems.length} gems\n`);

    // Filter for random_question gems
    const randomQuestionGems = rxdbGems.filter(gem =>
      gem.metadata?.source === 'random_question'
    );

    console.log(`📊 RxDB Random Question Gems: ${randomQuestionGems.length}`);

    if (randomQuestionGems.length > 0) {
      console.log('\nLatest 5 Random Question Gems in RxDB:');
      randomQuestionGems
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        .slice(0, 5)
        .forEach((gem, i) => {
          console.log(`\n${i + 1}. ${gem.topic}`);
          console.log(`   Answer: ${gem.value}`);
          console.log(`   Collection: ${gem.collections?.[0] || 'none'}`);
          console.log(`   Created: ${gem.created_at}`);
          console.log(`   ID: ${gem.id}`);
        });
    }

    // Check hspProfile
    console.log('\n\n[2/3] Checking hspProfile...');

    const { hspProfile } = await chrome.storage.local.get('hspProfile');

    if (!hspProfile) {
      console.warn('⚠️ hspProfile not found in chrome.storage.local');
    } else {
      const profileItems = hspProfile.content?.preferences?.items || [];
      const randomQuestionItems = profileItems.filter(item =>
        item.metadata?.source === 'random_question'
      );

      console.log(`✓ hspProfile has ${randomQuestionItems.length} random question items`);

      if (randomQuestionItems.length > 0) {
        console.log('\nLatest 5 Random Question Items in hspProfile:');
        randomQuestionItems
          .slice(-5)
          .reverse()
          .forEach((item, i) => {
            console.log(`\n${i + 1}. ${item.topic}`);
            console.log(`   Answer: ${item.value}`);
            console.log(`   Collection: ${item.collections?.[0] || 'none'}`);
          });
      }
    }

    // Compare counts
    console.log('\n\n[3/3] Comparison:');
    console.log('─'.repeat(50));
    console.log(`RxDB (UI):        ${randomQuestionGems.length} gems`);
    console.log(`hspProfile:       ${hspProfile?.content?.preferences?.items?.filter(i => i.metadata?.source === 'random_question').length || 0} items`);
    console.log('─'.repeat(50));

    const countMismatch = randomQuestionGems.length !== (hspProfile?.content?.preferences?.items?.filter(i => i.metadata?.source === 'random_question').length || 0);

    if (countMismatch) {
      console.warn('\n⚠️ MISMATCH DETECTED!');
      console.log('RxDB and hspProfile have different counts.');
      console.log('This suggests some saves may have failed.');
    } else if (randomQuestionGems.length === 0) {
      console.log('\nℹ️ No random question gems found in either storage.');
      console.log('This is expected if no questions have been answered yet.');
    } else {
      console.log('\n✅ Storage counts match!');
    }

    // Test: Can we query gems?
    console.log('\n\n🔍 Testing UI Query...');
    const allGems = await self.ContextEngineAPI.getAllGems();

    // Sort by created_at descending
    const sortedGems = allGems.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA;
    });

    console.log(`✓ UI query returned ${sortedGems.length} total gems`);

    if (sortedGems.length > 0) {
      console.log('\nMost recent gem:');
      const latest = sortedGems[0];
      console.log({
        topic: latest.topic,
        value: latest.value,
        collections: latest.collections,
        created_at: latest.created_at,
        source: latest.metadata?.source
      });
    }

    console.log('\n✅ Debug complete!\n');

  } catch (error) {
    console.error('❌ Error during debug:', error);
    console.log('\nStack trace:', error.stack);
  }
})();
