/**
 * Script to enrich all gems with embeddings
 * Run this in the Service Worker Console (chrome://extensions → service worker)
 *
 * Usage:
 * 1. Open chrome://extensions/
 * 2. Click "service worker" link under Data Gems extension
 * 3. Copy-paste this entire script into the console
 * 4. Press Enter and wait for completion
 */

(async function enrichAllGems() {
  console.log('🚀 Starting gem enrichment...');
  console.log('⏱️  This will take 1-2 minutes for 100 gems');

  const startTime = performance.now();

  try {
    // Ensure Context Engine is ready
    if (!self.ContextEngineAPI) {
      throw new Error('ContextEngineAPI not available');
    }

    if (!self.ContextEngineAPI.isReady) {
      console.log('⏳ Initializing Context Engine...');
      await self.ContextEngineAPI.initialize();
    }

    console.log('✅ Context Engine ready');

    // Start batch enrichment
    console.log('📊 Starting batch enrichment...');

    const result = await self.ContextEngineAPI.batchReEnrich({}, (current, total) => {
      // Log every 10 gems
      if (current % 10 === 0 || current === total) {
        const percent = Math.round((current / total) * 100);
        const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
        console.log(`📈 Progress: ${current}/${total} (${percent}%) - Elapsed: ${elapsed}s`);
      }
    });

    const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);

    console.log('');
    console.log('✨ ================================');
    console.log('✅ ENRICHMENT COMPLETE!');
    console.log('✨ ================================');
    console.log('📊 Results:', result);
    console.log(`⏱️  Total time: ${totalTime}s`);
    console.log(`⚡ Average: ${(totalTime / result.total).toFixed(2)}s per gem`);
    console.log('');
    console.log('🎉 Your gems now have vector embeddings!');
    console.log('🔍 Vector search is now active');

    // Get final stats
    const stats = await self.ContextEngineAPI.getStats();
    console.log('');
    console.log('📈 Database Stats:');
    console.log(`   Total gems: ${stats.database.totalGems}`);
    console.log(`   With vectors: ${stats.database.gemsWithVectors}`);
    console.log(`   With semantics: ${stats.database.gemsWithSemantics}`);
    console.log(`   Enrichment rate: ${stats.database.enrichmentRate}`);

  } catch (error) {
    console.error('❌ Enrichment failed:', error);
    console.error('Error details:', error.message);
    throw error;
  }
})();
