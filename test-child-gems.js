// Test Child Gem Creation
// Run this in the service worker console to test if AI can create child gems

(async function testChildGemCreation() {
  console.log('🧪 Testing child gem creation...');

  try {
    if (!self.ContextEngineAPI?.isReady) {
      await self.ContextEngineAPI?.initialize();
    }

    const engine = self.ContextEngineAPI?.engine;

    // Create a complex test preference that SHOULD generate child gems
    const testGem = {
      id: 'test_' + Date.now(),
      value: "I am 175cm tall, weigh 70kg, prefer coffee over tea, and exercise 3 times per week",
      collections: ['Personal'],
      subCollections: [],
      timestamp: Date.now(),
      state: 'default',
      assurance: 'self_declared',
      reliability: 'authoritative',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      topic: ''
    };

    console.log('📝 Adding test gem (should create multiple child gems)...');
    console.log('   Value:', testGem.value);

    // Add with enrichment enabled
    const result = await engine.addGem(testGem, true);

    console.log('\n✅ Gem added:', result.id);
    console.log('   isPrimary:', result.isPrimary);
    console.log('   childGems count:', result.childGems?.length || 0);

    if (result.childGems && result.childGems.length > 0) {
      console.log('   ✅ SUCCESS! Child gems were created:');
      result.childGems.forEach((childId, i) => {
        console.log(`      ${i + 1}. ${childId}`);
      });

      // Fetch the child gems to see their content
      console.log('\n📝 Child gem details:');
      for (const childId of result.childGems) {
        const child = await engine.getGem(childId);
        if (child) {
          console.log(`   ${child.id}:`);
          console.log(`      subTopic: ${child.subTopic}`);
          console.log(`      value: ${child.value}`);
          console.log(`      attribute: ${child.attribute}`);
        }
      }
    } else {
      console.log('   ⚠️  NO child gems created');
      console.log('   This means AI extraction either:');
      console.log('   1. Found only 1 attribute (expected for simple text)');
      console.log('   2. Failed and used fallback extraction');
    }

    console.log('\n🧹 Cleanup: Deleting test gem...');
    await engine.deleteGem(testGem.id);
    console.log('   ✅ Test gem deleted');

    console.log('\n✅ Test complete');

  } catch (error) {
    console.error('❌ Error:', error);
  }
})();
