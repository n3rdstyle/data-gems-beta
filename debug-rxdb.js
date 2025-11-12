// Debug script to check RxDB database state
// Run this in the service worker console

(async function debugRxDB() {
  console.log('🔍 Starting RxDB debug...');
  
  try {
    // Check migration flag
    const storage = await chrome.storage.local.get(['migrationCompleted', 'hspProfile']);
    console.log('📦 Chrome Storage:');
    console.log('  migrationCompleted:', storage.migrationCompleted);
    console.log('  hspProfile exists:', !!storage.hspProfile);
    console.log('  hspProfile preferences count:', storage.hspProfile?.content?.preferences?.items?.length || 0);
    
    // Check Context Engine
    console.log('\n🔧 Context Engine:');
    console.log('  ContextEngineAPI exists:', !!self.ContextEngineAPI);
    console.log('  isReady:', self.ContextEngineAPI?.isReady);
    
    if (!self.ContextEngineAPI?.isReady) {
      console.log('  ⚠️ Context Engine not ready, initializing...');
      await self.ContextEngineAPI?.initialize();
    }
    
    // Check collection
    const engine = self.ContextEngineAPI?.engine;
    console.log('  Engine exists:', !!engine);
    console.log('  Collection exists:', !!engine?.collection);
    
    if (engine?.collection) {
      // Count all docs
      const allDocs = await engine.collection.find().exec();
      console.log('\n📊 RxDB Stats:');
      console.log('  Total documents:', allDocs.length);
      
      // Count primary gems
      const primaryDocs = await engine.collection.find({ selector: { isPrimary: true } }).exec();
      console.log('  Primary gems:', primaryDocs.length);
      
      // Show last 5 primary gems
      console.log('\n📝 Last 5 Primary Gems:');
      const last5 = primaryDocs.slice(-5).map(doc => {
        const data = doc.toJSON();
        return {
          id: data.id,
          value: data.value.substring(0, 50) + '...',
          created_at: data.created_at
        };
      });
      console.table(last5);
      
      // Check for the specific gem that was just saved
      const justSaved = await engine.collection.findOne('pref_mhw45p0njx4qt').exec();
      console.log('\n🔍 Just saved gem (pref_mhw45p0njx4qt):', justSaved ? 'FOUND' : 'NOT FOUND');
      if (justSaved) {
        const data = justSaved.toJSON();
        console.log('  Value:', data.value);
        console.log('  Created:', data.created_at);
        console.log('  Has vector:', !!data.vector);
      }
    }
    
    console.log('\n✅ Debug complete');
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
})();
