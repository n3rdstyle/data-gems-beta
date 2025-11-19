/**
 * Re-Enrich Script: Add Embeddings to Preferences without Vectors
 * Fixes preferences that were imported without auto-enrichment
 *
 * Run in Extension Console:
 * await import('./re-enrich-missing-embeddings.js')
 */

(async function reEnrichMissingEmbeddings() {
  console.log('🔄 Re-Enriching Preferences without Embeddings...\n');

  try {
    // Ensure Context Engine is ready
    if (!self.ContextEngineAPI?.isReady) {
      console.log('⏳ Initializing Context Engine...');
      await self.ContextEngineAPI.initialize();
    }

    const engine = self.ContextEngineAPI.engine;

    // Get all primary gems (preferences)
    const allGems = await engine.getAllGems({ isPrimary: true });

    // Filter gems without embeddings (and exclude virtual Identity gems)
    const gemsWithoutEmbeddings = allGems.filter(gem =>
      !gem.isVirtual && // Exclude Identity profile fields
      (!gem.vector || gem.vector.length === 0) // No embedding
    );

    console.log(`📊 Found ${allGems.length} total preferences`);
    console.log(`   ✅ With Embeddings: ${allGems.filter(g => g.vector && g.vector.length > 0).length}`);
    console.log(`   ❌ Without Embeddings: ${gemsWithoutEmbeddings.length}\n`);

    if (gemsWithoutEmbeddings.length === 0) {
      console.log('✅ All preferences already have embeddings!\n');
      return { enriched: 0 };
    }

    console.log('🔄 Re-enriching preferences...\n');

    let enrichedCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < gemsWithoutEmbeddings.length; i++) {
      const gem = gemsWithoutEmbeddings[i];

      try {
        // Skip if value is empty
        if (!gem.value || gem.value.trim() === '') {
          console.log(`   ⏭️  Skipped (empty): ${gem.id}`);
          skippedCount++;
          continue;
        }

        console.log(`   [${i + 1}/${gemsWithoutEmbeddings.length}] Enriching: ${gem.id}`);
        console.log(`      Value: "${gem.value.substring(0, 60)}..."`);

        // Re-enrich by updating with same value (triggers enrichment)
        await engine.updateGem(gem.id, {
          value: gem.value // Same value, but force re-enrichment
        }, true); // reEnrich = true

        console.log(`      ✅ Enriched successfully\n`);
        enrichedCount++;

        // Add small delay to avoid overwhelming the system
        if (i < gemsWithoutEmbeddings.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

      } catch (error) {
        console.error(`      ❌ Failed: ${error.message}\n`);
        errorCount++;
      }
    }

    console.log('═'.repeat(80));
    console.log('📊 Re-Enrichment Complete!\n');
    console.log(`   ✅ Enriched: ${enrichedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}\n`);

    if (enrichedCount > 0) {
      console.log('💡 Run debug script again to verify embeddings:');
      console.log('   await import(\'./debug-identity-embeddings.js\')\n');
    }

    return {
      enriched: enrichedCount,
      skipped: skippedCount,
      errors: errorCount
    };

  } catch (error) {
    console.error('❌ Re-enrichment failed:', error);
    throw error;
  }
})();
