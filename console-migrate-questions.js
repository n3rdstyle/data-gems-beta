/**
 * Console Script: Migrate Random Questions from hspProfile to RxDB
 *
 * This script migrates all answered random questions from hspProfile to RxDB
 * so they appear in the UI.
 *
 * Usage:
 * 1. Open extension popup
 * 2. Open DevTools (F12)
 * 3. Copy and paste this entire script
 * 4. The UI will refresh automatically after migration
 */

(async function migrateRandomQuestions() {
  console.log('=== Random Questions Migration ===\n');

  try {
    // Check API availability
    if (typeof self.ContextEngineAPI === 'undefined') {
      console.error('❌ ContextEngineAPI is undefined');
      return;
    }

    if (!self.ContextEngineAPI.isReady) {
      console.error('❌ ContextEngineAPI not ready. Wait a few seconds and try again.');
      return;
    }

    console.log('✓ ContextEngineAPI is ready\n');

    // Step 1: Get existing gems from RxDB
    console.log('[1/4] Checking existing gems in RxDB...');
    const existingGems = await self.ContextEngineAPI.getAllGems();
    const existingRandomQuestions = existingGems.filter(gem =>
      gem.metadata?.source === 'random_question'
    );
    console.log(`   Found ${existingRandomQuestions.length} random question gems already in RxDB\n`);

    // Step 2: Get random questions from hspProfile
    console.log('[2/4] Loading random questions from hspProfile...');
    const { hspProfile } = await chrome.storage.local.get('hspProfile');

    if (!hspProfile || !hspProfile.content?.preferences?.items) {
      console.log('   No hspProfile data found - nothing to migrate');
      return;
    }

    const profileItems = hspProfile.content.preferences.items.filter(item =>
      item.metadata?.source === 'random_question'
    );
    console.log(`   Found ${profileItems.length} random question items in hspProfile\n`);

    if (profileItems.length === 0) {
      console.log('✅ No random questions to migrate!');
      return;
    }

    // Step 3: Migrate to RxDB
    console.log('[3/4] Migrating to RxDB...');
    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const item of profileItems) {
      try {
        // Check if already exists (by topic)
        const alreadyExists = existingRandomQuestions.some(gem =>
          gem.topic === item.topic &&
          gem.value === item.value
        );

        if (alreadyExists) {
          skippedCount++;
          console.log(`   ⏭️  Skipped (already exists): "${item.topic}"`);
          continue;
        }

        // Create gem for RxDB
        const gemForRxDB = {
          id: generateId('rq'),
          value: item.value,
          topic: item.topic,
          collections: item.collections || [],
          subCollections: [],
          state: 'default',
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),

          // Primary gem fields
          isPrimary: true,
          parentGem: '',
          childGems: [],
          isVirtual: false,

          // Metadata from hspProfile
          metadata: item.metadata || {
            source: 'random_question'
          }
        };

        // Add to RxDB (without auto-enrichment)
        await self.ContextEngineAPI.addGem(gemForRxDB, false);
        migratedCount++;
        console.log(`   ✅ Migrated: "${item.topic}"`);

      } catch (error) {
        errorCount++;
        console.error(`   ❌ Failed to migrate: "${item.topic}"`, error.message);
      }
    }

    // Step 4: Summary
    console.log('\n[4/4] Migration Summary:');
    console.log('─'.repeat(50));
    console.log(`Total items in hspProfile:  ${profileItems.length}`);
    console.log(`✅ Migrated:                ${migratedCount}`);
    console.log(`⏭️  Skipped (duplicates):    ${skippedCount}`);
    console.log(`❌ Errors:                  ${errorCount}`);
    console.log('─'.repeat(50));

    if (migratedCount > 0) {
      console.log('\n🎉 Migration complete! Refreshing UI...');

      // Trigger UI refresh
      if (typeof renderCurrentScreen === 'function') {
        renderCurrentScreen();
        console.log('✅ UI refreshed!');
      } else {
        console.log('💡 Please close and reopen the extension to see your gems');
      }
    } else {
      console.log('\nℹ️ No new items to migrate.');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('Stack trace:', error.stack);
  }
})();
