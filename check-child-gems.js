// Check Child Gems in RxDB
// Run this in the service worker console

(async function checkChildGems() {
  console.log('🔍 Checking for child gems...');
  
  try {
    if (!self.ContextEngineAPI?.isReady) {
      await self.ContextEngineAPI?.initialize();
    }
    
    const engine = self.ContextEngineAPI?.engine;
    
    // Get all gems (including children)
    const allGems = await engine.getAllGems({});
    console.log('📊 Total gems:', allGems.length);
    
    // Count by type
    const primaryGems = allGems.filter(g => g.isPrimary === true);
    const childGems = allGems.filter(g => g.isVirtual === true);
    const regularGems = allGems.filter(g => !g.isPrimary && !g.isVirtual);
    
    console.log('  Primary gems (isPrimary=true):', primaryGems.length);
    console.log('  Child gems (isVirtual=true):', childGems.length);
    console.log('  Regular gems (neither flag):', regularGems.length);
    
    if (childGems.length > 0) {
      console.log('\n📝 Sample child gems:');
      childGems.slice(0, 3).forEach(gem => {
        console.log({
          id: gem.id,
          parentGem: gem.parentGem,
          value: gem.value.substring(0, 50),
          subTopic: gem.subTopic,
          attribute: gem.attribute
        });
      });
    } else {
      console.log('\n⚠️  No child gems found in database');
    }
    
    console.log('\n✅ Check complete');
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();
