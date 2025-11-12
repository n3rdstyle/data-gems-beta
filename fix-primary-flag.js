// Fix Primary Flag for Existing Gems
// Run this in the service worker console

(async function fixPrimaryFlags() {
  console.log('🔧 Starting primary flag fix...');
  
  try {
    // Wait for Context Engine
    if (!self.ContextEngineAPI?.isReady) {
      console.log('⏳ Initializing Context Engine...');
      await self.ContextEngineAPI?.initialize();
    }
    
    const engine = self.ContextEngineAPI?.engine;
    const collection = engine?.collection;
    
    if (!collection) {
      throw new Error('Collection not available');
    }
    
    // Find all gems WITHOUT isPrimary set to true
    const allDocs = await collection.find().exec();
    console.log(`📊 Total documents: ${allDocs.length}`);
    
    // Filter for gems that should be primary (no parent or parentGem is empty)
    const toFix = allDocs.filter(doc => {
      const data = doc.toJSON();
      const shouldBePrimary = !data.parentGem || data.parentGem === '';
      const isMarkedPrimary = data.isPrimary === true;
      return shouldBePrimary && !isMarkedPrimary;
    });
    
    console.log(`🔍 Found ${toFix.length} gems that need isPrimary flag`);
    
    if (toFix.length === 0) {
      console.log('✅ All gems already have correct flags!');
      return;
    }
    
    // Confirm before fixing
    console.log('⚠️  This will update gems to mark them as primary.');
    console.log('   This is safe and will make them visible in the app.');
    
    // Update each gem
    let fixed = 0;
    for (const doc of toFix) {
      try {
        await doc.update({
          $set: {
            isPrimary: true
          }
        });
        fixed++;
        
        if (fixed % 10 === 0) {
          console.log(`  Progress: ${fixed}/${toFix.length}`);
        }
      } catch (error) {
        console.error(`  Failed to update ${doc.id}:`, error);
      }
    }
    
    console.log(`✅ Fixed ${fixed} gems!`);
    
    // Verify
    const primaryDocs = await collection.find({ selector: { isPrimary: true } }).exec();
    console.log(`\n📊 After fix:`);
    console.log(`  Total documents: ${allDocs.length}`);
    console.log(`  Primary gems: ${primaryDocs.length}`);
    
    console.log('\n🎉 Done! Reload the popup to see all your gems.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();
