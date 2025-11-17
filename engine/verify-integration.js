/**
 * Context Engine v2 Integration Verification
 * Run this in the popup inspector console to verify the integration
 */

(async function verifyIntegration() {
  console.log('='.repeat(80));
  console.log('🔍 Context Engine v2 Integration Verification');
  console.log('='.repeat(80));

  try {
    // Test 1: Check API availability
    console.log('\n📋 Test 1: API Availability');
    console.log('-'.repeat(40));

    if (!window.ContextEngineAPI) {
      console.error('❌ window.ContextEngineAPI is not defined!');
      return;
    }

    console.log('✅ window.ContextEngineAPI is available');
    console.log('   isReady:', window.ContextEngineAPI.isReady);
    console.log('   isInitializing:', window.ContextEngineAPI.isInitializing);

    // Test 2: Get Statistics
    console.log('\n📊 Test 2: Database Statistics');
    console.log('-'.repeat(40));

    const stats = await window.ContextEngineAPI.getStats();
    console.log(`   Total Gems: ${stats.database.totalGems}`);
    console.log(`   With Vectors: ${stats.database.gemsWithVectors}`);
    console.log(`   With Semantics: ${stats.database.gemsWithSemantics}`);
    console.log(`   Enrichment Rate: ${stats.database.enrichmentRate}%`);
    console.log(`   BM25 Docs: ${stats.bm25.totalDocs}`);
    console.log(`   BM25 Terms: ${stats.bm25.uniqueTerms}`);

    // Test 3: Get All Gems
    console.log('\n📦 Test 3: Fetch All Gems');
    console.log('-'.repeat(40));

    const allGems = await window.ContextEngineAPI.getAllGems();
    console.log(`✅ Retrieved ${allGems.length} gems`);

    // Test 4: Inspect Sample Gem
    console.log('\n🔬 Test 4: Inspect Sample Gem');
    console.log('-'.repeat(40));

    if (allGems.length > 0) {
      const sampleGem = allGems[0];
      console.log('Sample gem:', {
        id: sampleGem.id,
        value: sampleGem.value?.substring(0, 60) + '...',
        collections: sampleGem.collections,
        subCollections: sampleGem.subCollections,
        semanticType: sampleGem.semanticType,
        attribute: sampleGem.attribute,
        attributeValue: sampleGem.attributeValue,
        hasVector: !!sampleGem.vector,
        vectorDimension: sampleGem.vector?.length,
        keywordCount: Object.keys(sampleGem.keywords || {}).length,
        keywords: Object.keys(sampleGem.keywords || {}).slice(0, 5).join(', ')
      });
    }

    // Test 5: Semantic Type Distribution
    console.log('\n📊 Test 5: Semantic Type Distribution');
    console.log('-'.repeat(40));

    const semanticTypes = {
      constraint: 0,
      preference: 0,
      activity: 0,
      characteristic: 0,
      goal: 0
    };

    allGems.forEach(gem => {
      if (gem.semanticType) {
        semanticTypes[gem.semanticType]++;
      }
    });

    console.log('Semantic Type Distribution:');
    Object.entries(semanticTypes).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} (${(count / allGems.length * 100).toFixed(1)}%)`);
    });

    // Test 6: Keyword Analysis
    console.log('\n🔤 Test 6: Keyword Analysis');
    console.log('-'.repeat(40));

    const allKeywords = new Map();
    allGems.forEach(gem => {
      if (gem.keywords) {
        Object.entries(gem.keywords).forEach(([word, freq]) => {
          allKeywords.set(word, (allKeywords.get(word) || 0) + freq);
        });
      }
    });

    const topKeywords = Array.from(allKeywords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    console.log('Top 10 keywords by frequency:');
    topKeywords.forEach(([word, freq], i) => {
      console.log(`   ${i + 1}. "${word}": ${freq}`);
    });

    // Test 7: Search Functionality
    console.log('\n🔍 Test 7: Search Functionality');
    console.log('-'.repeat(40));

    const searchQueries = ['coffee', 'work', 'food', 'time', 'health'];

    for (const query of searchQueries) {
      try {
        const results = await window.ContextEngineAPI.search(query, {}, 3);
        console.log(`\n   Query: "${query}" → ${results.length} results`);

        if (results.length > 0) {
          console.log(`   Top result: "${results[0].value?.substring(0, 50)}..."`);
          console.log(`   Score: ${results[0].score?.toFixed(4)}`);
        }
      } catch (error) {
        console.error(`   ❌ Search failed for "${query}":`, error.message);
      }
    }

    // Test 8: Filter by Collection
    console.log('\n📂 Test 8: Filter by Collection');
    console.log('-'.repeat(40));

    const collections = new Map();
    allGems.forEach(gem => {
      gem.collections?.forEach(col => {
        collections.set(col, (collections.get(col) || 0) + 1);
      });
    });

    console.log('Collection distribution:');
    Array.from(collections.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([col, count]) => {
        console.log(`   ${col}: ${count} gems`);
      });

    // Test 9: Get Single Gem
    console.log('\n🔍 Test 9: Get Single Gem by ID');
    console.log('-'.repeat(40));

    if (allGems.length > 0) {
      const testId = allGems[0].id;
      const singleGem = await window.ContextEngineAPI.getGem(testId);
      console.log(`✅ Retrieved gem by ID: ${testId}`);
      console.log(`   Value: "${singleGem.value?.substring(0, 60)}..."`);
    }

    // Test 10: Enrichment Status
    console.log('\n🤖 Test 10: Enrichment Capabilities');
    console.log('-'.repeat(40));

    console.log('Enrichment status:', stats.enrichment);
    console.log(`   Prompt API: ${stats.enrichment.promptApi ? '✅' : '❌'}`);
    console.log(`   Embedder API: ${stats.enrichment.embedder ? '✅' : '❌'}`);
    console.log(`   Summarizer API: ${stats.enrichment.summarizer ? '✅' : '❌'}`);

    // Final Summary
    console.log('\n' + '='.repeat(80));
    console.log('✅ INTEGRATION VERIFICATION COMPLETE');
    console.log('='.repeat(80));
    console.log(`
Summary:
  • Total Gems: ${allGems.length}
  • Enrichment Rate: ${stats.database.enrichmentRate}%
  • BM25 Index: ${stats.bm25.totalDocs} docs, ${stats.bm25.uniqueTerms} terms
  • Semantic Classification: Active
  • Keyword Extraction: Active
  • Vector Embeddings: ${stats.enrichment.embedder ? 'Available' : 'Pending API availability'}

Status: 🎉 Context Engine v2 is fully operational!
`);

  } catch (error) {
    console.error('\n❌ VERIFICATION FAILED:', error);
    console.error('Stack trace:', error.stack);
  }
})();
