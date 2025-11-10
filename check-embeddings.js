/**
 * Check if gems have embeddings
 * Run in Service Worker Console
 */

(async function checkEmbeddings() {
  console.log('🔍 Checking gem embeddings...');

  try {
    if (!self.ContextEngineAPI?.isReady) {
      await self.ContextEngineAPI.initialize();
    }

    // Get stats
    const stats = await self.ContextEngineAPI.getStats();
    console.log('📊 Stats:', stats);

    // Get all gems
    const gems = await self.ContextEngineAPI.getAllGems();
    console.log(`📦 Total gems: ${gems.length}`);

    // Check how many have vectors
    const withVectors = gems.filter(g => g.vector && Array.isArray(g.vector) && g.vector.length === 384);
    const withoutVectors = gems.filter(g => !g.vector || !Array.isArray(g.vector) || g.vector.length !== 384);

    console.log(`✅ Gems WITH vectors (384-dim): ${withVectors.length}`);
    console.log(`❌ Gems WITHOUT vectors: ${withoutVectors.length}`);

    if (withVectors.length > 0) {
      console.log('📝 Sample gem with vector:', {
        id: withVectors[0].id,
        value: withVectors[0].value.substring(0, 50),
        vectorDim: withVectors[0].vector.length,
        vectorSample: withVectors[0].vector.slice(0, 5)
      });
    }

    if (withoutVectors.length > 0) {
      console.log('📝 Sample gem WITHOUT vector:', {
        id: withoutVectors[0].id,
        value: withoutVectors[0].value.substring(0, 50),
        hasVector: !!withoutVectors[0].vector,
        vectorType: typeof withoutVectors[0].vector
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
})();
