/**
 * Test single embedding generation
 * Run in Service Worker Console to verify message passing works
 */

(async function testEmbedding() {
  console.log('🧪 Testing embedding generation...');

  try {
    // Ensure Context Engine is initialized
    if (!self.ContextEngineAPI?.isReady) {
      console.log('⏳ Initializing Context Engine...');
      await self.ContextEngineAPI.initialize();
    }

    console.log('✅ Context Engine ready');

    // Test embedding generation for a simple text
    const testText = 'Budget for shoes: max 150€';
    console.log(`📝 Generating embedding for: "${testText}"`);

    // Get enrichment instance
    const { getEnrichment } = await import('./engine/enrichment.js');
    const enrichment = await getEnrichment();

    console.log('🔧 Enrichment status:', enrichment.getStatus());

    // Generate embedding
    const startTime = performance.now();
    const embedding = await enrichment.generateEmbedding(testText);
    const duration = ((performance.now() - startTime) / 1000).toFixed(2);

    if (embedding) {
      console.log('✅ SUCCESS!');
      console.log(`📊 Embedding generated in ${duration}s`);
      console.log(`📐 Dimension: ${embedding.length}`);
      console.log(`🔢 Sample values: [${embedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}...]`);
    } else {
      console.error('❌ FAILED: No embedding returned');
      console.log('💡 Check if offscreen document is running');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Stack:', error.stack);
  }
})();
