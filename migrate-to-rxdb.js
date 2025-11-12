/**
 * Migration Script: Chrome Storage → RxDB
 *
 * This script migrates preference data from Chrome Storage (HSP profile)
 * to RxDB Context Engine, making RxDB the single source of truth.
 *
 * Usage:
 * 1. Open chrome://extensions/
 * 2. Click "service worker" link under Data Gems extension
 * 3. Copy-paste this entire script into the console
 * 4. Press Enter and wait for completion
 *
 * IMPORTANT: This is a ONE-TIME migration. After running, the extension
 * will use RxDB as the primary database.
 */

(async function migrateToRxDB() {
  console.log('🚀 Starting Chrome Storage → RxDB migration...');
  console.log('⚠️  This will move all preferences to RxDB');

  const startTime = performance.now();

  try {
    // Step 1: Load data from Chrome Storage
    console.log('\n📂 Step 1: Loading data from Chrome Storage...');
    const result = await chrome.storage.local.get(['hspProfile']);

    if (!result.hspProfile) {
      console.error('❌ No HSP profile found in Chrome Storage');
      console.log('ℹ️  Nothing to migrate. You may already be using RxDB.');
      return;
    }

    const hspProfile = result.hspProfile;
    const preferences = hspProfile.content?.preferences?.items || [];

    console.log(`✅ Found ${preferences.length} preferences to migrate`);

    if (preferences.length === 0) {
      console.log('ℹ️  No preferences to migrate.');
      return;
    }

    // Step 2: Initialize Context Engine
    console.log('\n📂 Step 2: Initializing Context Engine...');

    if (!self.ContextEngineAPI) {
      throw new Error('ContextEngineAPI not available. Make sure the extension is loaded.');
    }

    if (!self.ContextEngineAPI.isReady) {
      console.log('⏳ Initializing Context Engine...');
      await self.ContextEngineAPI.initialize();
    }

    console.log('✅ Context Engine ready');

    // Step 3: Convert HSP preferences to RxDB gem format
    console.log('\n📂 Step 3: Converting preferences to RxDB format...');

    const gemsToMigrate = preferences.map(pref => {
      // Convert HSP preference to RxDB gem
      return {
        id: pref.id,
        value: pref.value,
        collections: pref.collections || [],
        subCollections: pref.subCollections || [],
        timestamp: pref.created_at ? new Date(pref.created_at).getTime() : Date.now(),

        // HSP fields
        state: pref.state || 'default',
        assurance: pref.assurance || 'self_declared',
        reliability: pref.reliability || 'authoritative',
        source_url: pref.source_url,
        mergedFrom: pref.mergedFrom,
        created_at: pref.created_at || new Date().toISOString(),
        updated_at: pref.updated_at || new Date().toISOString(),
        topic: pref.topic || '',

        // Primary/child gem fields (all preferences are primary by default)
        isPrimary: true,
        parentGem: '',
        childGems: [],
        isVirtual: false
      };
    });

    console.log(`✅ Converted ${gemsToMigrate.length} preferences`);

    // Step 4: Check for duplicates in RxDB
    console.log('\n📂 Step 4: Checking for existing gems in RxDB...');

    const existingGems = await self.ContextEngineAPI.getStats();
    console.log(`ℹ️  RxDB currently has ${existingGems.totalGems} gems`);

    if (existingGems.totalGems > 0) {
      const proceed = confirm(
        `RxDB already contains ${existingGems.totalGems} gems.\n\n` +
        `Do you want to proceed with migration?\n` +
        `This will ADD ${gemsToMigrate.length} more gems (no duplicates will be removed).`
      );

      if (!proceed) {
        console.log('❌ Migration cancelled by user');
        return;
      }
    }

    // Step 5: Insert gems into RxDB (without auto-enrichment)
    console.log('\n📂 Step 5: Inserting gems into RxDB...');
    console.log('ℹ️  Auto-enrichment disabled for migration (faster)');
    console.log('ℹ️  You can run enrichment later with enrich-gems.js script');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < gemsToMigrate.length; i++) {
      const gem = gemsToMigrate[i];

      try {
        // Insert without auto-enrichment (faster migration)
        await self.ContextEngineAPI.addGem(gem, false);
        successCount++;

        // Log progress every 10 gems
        if ((i + 1) % 10 === 0 || (i + 1) === gemsToMigrate.length) {
          const percent = Math.round(((i + 1) / gemsToMigrate.length) * 100);
          const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
          console.log(`📈 Progress: ${i + 1}/${gemsToMigrate.length} (${percent}%) - Elapsed: ${elapsed}s`);
        }
      } catch (error) {
        console.error(`❌ Failed to insert gem ${gem.id}:`, error);
        errorCount++;
      }
    }

    const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);

    console.log('');
    console.log('✨ ================================');
    console.log('✅ MIGRATION COMPLETE!');
    console.log('✨ ================================');
    console.log(`📊 Results:`);
    console.log(`   ✅ Successfully migrated: ${successCount} gems`);
    console.log(`   ❌ Failed: ${errorCount} gems`);
    console.log(`⏱️  Total time: ${totalTime}s`);
    console.log('');

    // Step 6: Create backup of Chrome Storage
    console.log('📂 Step 6: Creating backup of Chrome Storage...');

    const backupData = {
      profile: hspProfile,
      migratedAt: new Date().toISOString(),
      migratedCount: successCount
    };

    // Save backup
    await chrome.storage.local.set({
      hspProfileBackup: backupData,
      migrationCompleted: true
    });

    console.log('✅ Backup saved to chrome.storage.local.hspProfileBackup');
    console.log('');
    console.log('🎉 Migration successful!');
    console.log('ℹ️  Chrome Storage backup kept for safety');
    console.log('ℹ️  The extension will now use RxDB as primary database');
    console.log('');
    console.log('📝 Next steps:');
    console.log('   1. Reload the extension popup to verify data');
    console.log('   2. Run enrich-gems.js to add AI embeddings');
    console.log('   3. Test export functionality');
    console.log('');

    // Get final stats
    const finalStats = await self.ContextEngineAPI.getStats();
    console.log('📊 Final RxDB Stats:', finalStats);

  } catch (error) {
    console.error('');
    console.error('❌ ================================');
    console.error('❌ MIGRATION FAILED!');
    console.error('❌ ================================');
    console.error('Error:', error);
    console.error('');
    console.error('ℹ️  Your Chrome Storage data is safe and unchanged.');
    console.error('ℹ️  Please report this error to the developer.');
  }
})();
