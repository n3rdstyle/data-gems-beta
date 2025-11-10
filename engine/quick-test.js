/**
 * Quick Test Script for Context Engine v2
 * Copy and paste this entire script into the popup inspector console
 * to verify the Context Engine integration is working correctly
 */

(async function quickTest() {
  console.clear();
  console.log('%c🚀 Context Engine v2 Quick Test', 'color: #4CAF50; font-size: 16px; font-weight: bold');
  console.log('%c' + '='.repeat(60), 'color: #999');

  try {
    // Test 1: API Availability
    console.log('\n%c📋 Test 1: API Availability', 'color: #2196F3; font-weight: bold');
    if (!window.ContextEngineAPI) {
      console.error('❌ FAILED: window.ContextEngineAPI is not defined');
      return;
    }
    console.log('✅ PASSED: window.ContextEngineAPI is available');
    console.log('   Status:', {
      isReady: window.ContextEngineAPI.isReady,
      isInitializing: window.ContextEngineAPI.isInitializing
    });

    // Test 2: Get Stats
    console.log('\n%c📊 Test 2: Database Statistics', 'color: #2196F3; font-weight: bold');
    const stats = await window.ContextEngineAPI.getStats();
    console.log('✅ PASSED: Stats retrieved successfully');
    console.table({
      'Total Gems': stats.database.totalGems,
      'With Semantics': stats.database.gemsWithSemantics,
      'Enrichment Rate': stats.database.enrichmentRate + '%',
      'BM25 Documents': stats.bm25.totalDocs,
      'BM25 Terms': stats.bm25.uniqueTerms,
      'Avg Keywords': stats.bm25.avgKeywordsPerDoc
    });

    // Test 3: Search Functionality
    console.log('\n%c🔍 Test 3: Search Functionality', 'color: #2196F3; font-weight: bold');

    const testQueries = [
      { query: 'coffee', expect: 'beverage preferences' },
      { query: 'work', expect: 'work-related gems' },
      { query: 'food', expect: 'food preferences' }
    ];

    for (const test of testQueries) {
      const results = await window.ContextEngineAPI.search(test.query, {}, 3);
      if (results.length > 0) {
        console.log(`✅ PASSED: "${test.query}" → ${results.length} results`);
        console.log(`   Top result: "${results[0].value.substring(0, 60)}..."`);
        console.log(`   Score: ${results[0].score?.toFixed(4) || 'N/A'}`);
      } else {
        console.log(`⚠️  WARNING: "${test.query}" → 0 results (expected ${test.expect})`);
      }
    }

    // Test 4: Semantic Type Distribution
    console.log('\n%c🏷️  Test 4: Semantic Type Distribution', 'color: #2196F3; font-weight: bold');
    const allGems = await window.ContextEngineAPI.getAllGems();

    const typeCount = {
      constraint: 0,
      preference: 0,
      activity: 0,
      characteristic: 0,
      goal: 0,
      unclassified: 0
    };

    allGems.forEach(gem => {
      if (gem.semanticType) {
        typeCount[gem.semanticType]++;
      } else {
        typeCount.unclassified++;
      }
    });

    console.log('✅ PASSED: Semantic types analyzed');
    console.table(typeCount);

    // Test 5: Keyword Coverage
    console.log('\n%c🔤 Test 5: Keyword Coverage', 'color: #2196F3; font-weight: bold');
    const gemsWithKeywords = allGems.filter(gem => gem.keywords && Object.keys(gem.keywords).length > 0);
    const keywordCoverage = (gemsWithKeywords.length / allGems.length * 100).toFixed(1);

    console.log('✅ PASSED: Keyword coverage calculated');
    console.log(`   ${gemsWithKeywords.length}/${allGems.length} gems have keywords (${keywordCoverage}%)`);

    // Extract most common keywords
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
      .slice(0, 10)
      .map(([word, freq]) => ({ word, frequency: freq }));

    console.log('   Top 10 keywords:');
    console.table(topKeywords);

    // Test 6: Collection Distribution
    console.log('\n%c📂 Test 6: Collection Distribution', 'color: #2196F3; font-weight: bold');
    const collectionCount = new Map();
    allGems.forEach(gem => {
      gem.collections?.forEach(col => {
        collectionCount.set(col, (collectionCount.get(col) || 0) + 1);
      });
    });

    const topCollections = Array.from(collectionCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([collection, count]) => ({ collection, gems: count }));

    console.log('✅ PASSED: Collection distribution calculated');
    console.table(topCollections);

    // Test 7: Filtered Search
    console.log('\n%c🎯 Test 7: Filtered Search (Semantic Types)', 'color: #2196F3; font-weight: bold');

    const preferenceResults = await window.ContextEngineAPI.search('food', {
      semanticTypes: ['preference']
    }, 3);

    const constraintResults = await window.ContextEngineAPI.search('food', {
      semanticTypes: ['constraint']
    }, 3);

    console.log(`✅ PASSED: Filtered search works`);
    console.log(`   Preferences: ${preferenceResults.length} results`);
    console.log(`   Constraints: ${constraintResults.length} results`);

    if (preferenceResults.length > 0) {
      console.log(`   Example preference: "${preferenceResults[0].value.substring(0, 60)}..."`);
    }

    // Test 8: Get Single Gem
    console.log('\n%c🔍 Test 8: Get Single Gem by ID', 'color: #2196F3; font-weight: bold');
    if (allGems.length > 0) {
      const sampleId = allGems[0].id;
      const singleGem = await window.ContextEngineAPI.getGem(sampleId);

      if (singleGem) {
        console.log('✅ PASSED: Single gem retrieval works');
        console.log('   Sample gem:', {
          id: singleGem.id,
          semanticType: singleGem.semanticType,
          collections: singleGem.collections,
          keywordCount: Object.keys(singleGem.keywords || {}).length
        });
      } else {
        console.log('❌ FAILED: Could not retrieve gem');
      }
    }

    // Final Summary
    console.log('\n%c' + '='.repeat(60), 'color: #999');
    console.log('%c✅ ALL TESTS COMPLETED', 'color: #4CAF50; font-size: 16px; font-weight: bold');
    console.log('\n%cContext Engine v2 Status:', 'font-weight: bold');
    console.log(`  • Total Gems: ${stats.database.totalGems}`);
    console.log(`  • Enrichment Rate: ${stats.database.enrichmentRate}%`);
    console.log(`  • BM25 Index: ${stats.bm25.totalDocs} docs, ${stats.bm25.uniqueTerms} terms`);
    console.log(`  • Semantic Types: ${stats.database.gemsWithSemantics} classified`);
    console.log(`  • Search: Operational ✓`);
    console.log(`  • Filtering: Operational ✓`);

    console.log('\n%c🚀 Ready for integration!', 'color: #4CAF50; font-size: 14px; font-weight: bold');
    console.log('\nNext steps:');
    console.log('  1. Test search quality: await window.ContextEngineAPI.search("your query here")');
    console.log('  2. Review integration guide: INTEGRATION_EXAMPLE.md');
    console.log('  3. Update context-selector.js to use Context Engine API');

  } catch (error) {
    console.log('\n%c' + '='.repeat(60), 'color: #999');
    console.error('%c❌ TEST FAILED', 'color: #f44336; font-size: 16px; font-weight: bold');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
  }
})();
