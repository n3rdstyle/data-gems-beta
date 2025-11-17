/**
 * Context Engine v2 - Test & Demo
 *
 * This file demonstrates how to use the Context Engine v2 API
 * Can be run in the browser console or integrated into the extension
 */

import { getContextEngine } from './context-engine.js';

/**
 * Test data: 10 sample gems for testing
 */
const TEST_GEMS = [
  // Constraints
  {
    id: 'test_constraint_001',
    value: 'Budget for shoes: max 150€',
    collections: ['Fashion'],
    subCollections: ['fashion_shopping'],
    timestamp: Date.now()
  },
  {
    id: 'test_constraint_002',
    value: 'Dietary restriction: lactose-free',
    collections: ['Nutrition'],
    subCollections: ['nutrition_diet'],
    timestamp: Date.now()
  },

  // Preferences
  {
    id: 'test_preference_001',
    value: 'Favorite shoe color: white',
    collections: ['Fashion'],
    subCollections: ['fashion_style'],
    timestamp: Date.now()
  },
  {
    id: 'test_preference_002',
    value: 'Preferred cuisine: Mediterranean',
    collections: ['Nutrition'],
    subCollections: ['nutrition_preferences'],
    timestamp: Date.now()
  },
  {
    id: 'test_preference_003',
    value: 'Favorite brands: Nike, Adidas',
    collections: ['Fashion'],
    subCollections: ['fashion_brands'],
    timestamp: Date.now()
  },

  // Activities
  {
    id: 'test_activity_001',
    value: 'Runs 3 times per week',
    collections: ['Fitness'],
    subCollections: ['fitness_cardio'],
    timestamp: Date.now()
  },
  {
    id: 'test_activity_002',
    value: 'Eats out 2 times per month',
    collections: ['Nutrition'],
    subCollections: ['nutrition_eatingout'],
    timestamp: Date.now()
  },

  // Characteristics
  {
    id: 'test_characteristic_001',
    value: 'Shoe size: 42',
    collections: ['Fashion'],
    subCollections: ['fashion_fit'],
    timestamp: Date.now()
  },
  {
    id: 'test_characteristic_002',
    value: 'Height: 175cm',
    collections: ['Health'],
    subCollections: ['health_measurements'],
    timestamp: Date.now()
  },

  // Goals
  {
    id: 'test_goal_001',
    value: 'Want to run a marathon',
    collections: ['Fitness'],
    subCollections: ['fitness_goals'],
    timestamp: Date.now()
  }
];

/**
 * Test Scenario 1: Initialize and Import
 */
async function testInitializeAndImport() {
  console.log('\n=== TEST 1: Initialize and Import ===\n');

  // Get engine instance
  const engine = await getContextEngine();

  console.log('✓ Engine initialized');

  // Get initial stats
  const statsBefore = await engine.getStats();
  console.log('Stats before import:', statsBefore);

  // Import test gems with auto-enrichment
  console.log('\nImporting 10 test gems with auto-enrichment...');

  const importResults = await engine.bulkImport(
    TEST_GEMS,
    true,  // Auto-enrich
    (current, total) => {
      console.log(`Progress: ${current}/${total} gems enriched`);
    }
  );

  console.log('Import results:', importResults);

  // Get stats after import
  const statsAfter = await engine.getStats();
  console.log('Stats after import:', statsAfter);

  return engine;
}

/**
 * Test Scenario 2: Search for Sneakers
 */
async function testSneakerSearch(engine) {
  console.log('\n=== TEST 2: Search for Sneakers ===\n');

  const query = 'Help me find casual sneakers under 150€';
  console.log('Query:', query);

  const results = await engine.search({
    query,
    filters: {
      collections: ['Fashion', 'Fitness']
    },
    limit: 5,
    useDiversity: true
  });

  console.log(`\nResults: ${results.length} gems found\n`);

  results.forEach((result, index) => {
    console.log(`${index + 1}. [${result.gem.semanticType || 'unclassified'}] ${result.gem.value}`);
    console.log(`   Score: ${result.score.toFixed(4)}`);
    console.log(`   Collections: ${result.gem.collections.join(', ')}`);
    console.log('');
  });

  return results;
}

/**
 * Test Scenario 3: Search for Restaurant
 */
async function testRestaurantSearch(engine) {
  console.log('\n=== TEST 3: Search for Restaurant ===\n');

  const query = 'Recommend a restaurant for dinner tonight';
  console.log('Query:', query);

  const results = await engine.search({
    query,
    filters: {
      collections: ['Nutrition']
    },
    limit: 5,
    useDiversity: true
  });

  console.log(`\nResults: ${results.length} gems found\n`);

  results.forEach((result, index) => {
    console.log(`${index + 1}. [${result.gem.semanticType || 'unclassified'}] ${result.gem.value}`);
    console.log(`   Score: ${result.score.toFixed(4)}`);
    console.log('');
  });

  return results;
}

/**
 * Test Scenario 4: Semantic Type Filtering
 */
async function testSemanticFiltering(engine) {
  console.log('\n=== TEST 4: Semantic Type Filtering ===\n');

  // Search for constraints only
  console.log('Searching for CONSTRAINTS only...\n');

  const constraintResults = await engine.searchBySemanticType({
    query: 'shopping for shoes',
    semanticTypes: ['constraint'],
    limit: 5
  });

  console.log(`Results: ${constraintResults.length} constraints found\n`);
  constraintResults.forEach((result, index) => {
    console.log(`${index + 1}. ${result.gem.value}`);
    console.log(`   Score: ${result.score.toFixed(4)}`);
    console.log('');
  });

  // Search for preferences only
  console.log('Searching for PREFERENCES only...\n');

  const preferenceResults = await engine.searchBySemanticType({
    query: 'shoe preferences',
    semanticTypes: ['preference'],
    limit: 5
  });

  console.log(`Results: ${preferenceResults.length} preferences found\n`);
  preferenceResults.forEach((result, index) => {
    console.log(`${index + 1}. ${result.gem.value}`);
    console.log(`   Score: ${result.score.toFixed(4)}`);
    console.log('');
  });

  return { constraintResults, preferenceResults };
}

/**
 * Test Scenario 5: Manual Gem Operations
 */
async function testManualOperations(engine) {
  console.log('\n=== TEST 5: Manual Gem Operations ===\n');

  // Add a new gem
  console.log('Adding new gem...');
  const newGem = await engine.addGem({
    id: 'test_manual_001',
    value: 'Prefers sustainable and eco-friendly shoe brands',
    collections: ['Fashion', 'Sustainability'],
    subCollections: ['fashion_brands', 'sustainability_products'],
    timestamp: Date.now()
  }, true);

  console.log('✓ Gem added:', newGem.id);
  console.log('  Semantic type:', newGem.semanticType);
  console.log('  Has vector:', !!newGem.vector);
  console.log('  Keywords:', Object.keys(newGem.keywords || {}).length);

  // Update the gem
  console.log('\nUpdating gem...');
  await engine.updateGem('test_manual_001', {
    value: 'Strongly prefers sustainable and eco-friendly shoe brands like Allbirds'
  }, true);

  const updatedGem = await engine.getGem('test_manual_001');
  console.log('✓ Gem updated:', updatedGem.value);

  // Delete the gem
  console.log('\nDeleting gem...');
  await engine.deleteGem('test_manual_001');
  console.log('✓ Gem deleted');

  const deletedGem = await engine.getGem('test_manual_001');
  console.log('  Verify deletion:', deletedGem === null ? 'Success' : 'Failed');
}

/**
 * Test Scenario 6: Get All Gems
 */
async function testGetAllGems(engine) {
  console.log('\n=== TEST 6: Get All Gems ===\n');

  // Get all gems
  const allGems = await engine.getAllGems();
  console.log(`Total gems: ${allGems.length}`);

  // Count by semantic type
  const typeCount = {};
  allGems.forEach(gem => {
    const type = gem.semanticType || 'unclassified';
    typeCount[type] = (typeCount[type] || 0) + 1;
  });

  console.log('\nGems by semantic type:');
  Object.entries(typeCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

  // Get Fashion gems only
  const fashionGems = await engine.getAllGems({
    collections: ['Fashion']
  });
  console.log(`\nFashion gems: ${fashionGems.length}`);

  return allGems;
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Context Engine v2 - Test Suite          ║');
  console.log('╚════════════════════════════════════════════╝');

  try {
    // Test 1: Initialize and import
    const engine = await testInitializeAndImport();

    // Test 2: Search for sneakers
    await testSneakerSearch(engine);

    // Test 3: Search for restaurant
    await testRestaurantSearch(engine);

    // Test 4: Semantic filtering
    await testSemanticFiltering(engine);

    // Test 5: Manual operations
    await testManualOperations(engine);

    // Test 6: Get all gems
    await testGetAllGems(engine);

    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║   All tests completed successfully! ✓     ║');
    console.log('╚════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.error(error.stack);
  }
}

/**
 * Quick test (for development)
 */
async function quickTest() {
  console.log('=== Quick Test ===\n');

  const engine = await getContextEngine();
  console.log('✓ Engine initialized');

  const stats = await engine.getStats();

  return engine;
}

// Export test functions
export {
  runAllTests,
  quickTest,
  testInitializeAndImport,
  testSneakerSearch,
  testRestaurantSearch,
  testSemanticFiltering,
  testManualOperations,
  testGetAllGems,
  TEST_GEMS
};

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  console.log('Context Engine v2 Test Suite loaded!');
  console.log('Run: runAllTests() to start all tests');
  console.log('Run: quickTest() for a quick check');

  // Make functions globally available
  window.ContextEngineTests = {
    runAllTests,
    quickTest,
    testInitializeAndImport,
    testSneakerSearch,
    testRestaurantSearch,
    testSemanticFiltering,
    testManualOperations,
    testGetAllGems
  };
}
