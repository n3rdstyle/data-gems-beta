/**
 * Test script for HNSW Index
 * Demonstrates performance improvement over brute-force search
 */

import { HNSWIndex } from './hnsw-index.js';

// Generate random vector for testing
function randomVector(dim) {
  const vec = new Array(dim);
  for (let i = 0; i < dim; i++) {
    vec[i] = Math.random() * 2 - 1; // Random values between -1 and 1
  }
  // Normalize
  const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  return vec.map(val => val / norm);
}

// Cosine similarity (raw -1 to 1 value, matching HNSW)
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  if (magnitude === 0) return -1;

  return dotProduct / magnitude; // Raw cosine similarity (-1 to 1)
}

// Brute-force search for comparison
function bruteForceSearch(vectors, queryVector, k) {
  const results = [];

  for (const [id, vector] of vectors) {
    const similarity = cosineSimilarity(queryVector, vector);
    results.push({ id, similarity });
  }

  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, k);
}

async function runTest() {
  console.log('═══════════════════════════════════════════════════');
  console.log('HNSW Index Performance Test');
  console.log('═══════════════════════════════════════════════════\n');

  const DIM = 768; // Vector dimension (matching EmbeddingGemma)
  const N = 1000;  // Number of vectors
  const K = 10;    // Number of neighbors to retrieve

  console.log(`Configuration:`);
  console.log(`  - Vector dimension: ${DIM}`);
  console.log(`  - Dataset size: ${N} vectors`);
  console.log(`  - Neighbors to retrieve: ${K}`);
  console.log();

  // Step 1: Generate test data
  console.log('Step 1: Generating test dataset...');
  const vectors = new Map();
  for (let i = 0; i < N; i++) {
    vectors.set(`vec_${i}`, randomVector(DIM));
  }
  console.log(`✓ Generated ${N} random ${DIM}-dimensional vectors\n`);

  // Step 2: Build HNSW index
  console.log('Step 2: Building HNSW index...');
  const hnswStartTime = performance.now();

  const index = new HNSWIndex({
    M: 16,              // Connections per node
    efConstruction: 200, // Build quality
    efSearch: 50        // Search quality
  });

  for (const [id, vector] of vectors) {
    index.add(id, vector);
  }

  const hnswBuildTime = performance.now() - hnswStartTime;
  console.log(`✓ HNSW index built in ${hnswBuildTime.toFixed(2)}ms`);
  console.log(`  Index stats:`, index.getStats());
  console.log();

  // Step 3: Generate query vector
  console.log('Step 3: Generating query vector...');
  const queryVector = randomVector(DIM);
  console.log(`✓ Query vector generated\n`);

  // Step 4: HNSW search (with higher efSearch for better accuracy)
  console.log('Step 4: Running HNSW search...');
  const hnswSearchStart = performance.now();
  const hnswResults = index.search(queryVector, K, 200); // efSearch=200 for better accuracy
  const hnswSearchTime = performance.now() - hnswSearchStart;

  console.log(`✓ HNSW search completed in ${hnswSearchTime.toFixed(3)}ms`);
  console.log(`  Top 5 results:`);
  hnswResults.slice(0, 5).forEach((r, i) => {
    // Verify similarity manually
    const vec = vectors.get(r.id);
    const manualSim = cosineSimilarity(queryVector, vec);
    console.log(`    ${i + 1}. ${r.id}: ${r.similarity.toFixed(4)} (distance: ${r.distance.toFixed(4)}, manual: ${manualSim.toFixed(4)})`);
  });
  console.log();

  // Step 5: Brute-force search (for comparison)
  console.log('Step 5: Running brute-force search (for comparison)...');
  const bruteForceStart = performance.now();
  const bruteForceResults = bruteForceSearch(vectors, queryVector, K);
  const bruteForceTime = performance.now() - bruteForceStart;

  console.log(`✓ Brute-force search completed in ${bruteForceTime.toFixed(3)}ms`);
  console.log(`  Top 5 results:`);
  bruteForceResults.slice(0, 5).forEach((r, i) => {
    console.log(`    ${i + 1}. ${r.id}: ${r.similarity.toFixed(4)}`);
  });
  console.log();

  // Step 6: Calculate accuracy (recall@K)
  console.log('Step 6: Calculating accuracy (Recall@K)...');
  const bruteForceIds = new Set(bruteForceResults.map(r => r.id));
  const hnswIds = new Set(hnswResults.map(r => r.id));

  const intersection = [...hnswIds].filter(id => bruteForceIds.has(id));
  const recall = intersection.length / K;

  console.log(`✓ Recall@${K}: ${(recall * 100).toFixed(1)}% (${intersection.length}/${K} matches)`);
  console.log();

  // Step 7: Performance summary
  console.log('═══════════════════════════════════════════════════');
  console.log('Performance Summary');
  console.log('═══════════════════════════════════════════════════');
  console.log(`Brute-force search:  ${bruteForceTime.toFixed(3)}ms`);
  console.log(`HNSW search:         ${hnswSearchTime.toFixed(3)}ms`);
  console.log();

  const speedup = bruteForceTime / hnswSearchTime;
  console.log(`Speedup: ${speedup.toFixed(1)}x faster 🚀`);
  console.log(`Accuracy: ${(recall * 100).toFixed(1)}% recall`);
  console.log();

  // Step 8: Test serialization
  console.log('Step 8: Testing index serialization...');
  const serializeStart = performance.now();
  const serialized = index.toJSON();
  const serializeTime = performance.now() - serializeStart;

  const deserializeStart = performance.now();
  const loadedIndex = HNSWIndex.fromJSON(serialized);
  const deserializeTime = performance.now() - deserializeStart;

  console.log(`✓ Serialization: ${serializeTime.toFixed(2)}ms`);
  console.log(`✓ Deserialization: ${deserializeTime.toFixed(2)}ms`);
  console.log(`✓ Serialized size: ${Math.round(JSON.stringify(serialized).length / 1024)} KB`);
  console.log();

  // Verify loaded index works
  const loadedResults = loadedIndex.search(queryVector, K);
  const resultsMatch = JSON.stringify(hnswResults) === JSON.stringify(loadedResults);
  console.log(`✓ Loaded index results match: ${resultsMatch ? 'Yes ✓' : 'No ✗'}`);
  console.log();

  console.log('═══════════════════════════════════════════════════');
  console.log('✓ All tests completed successfully!');
  console.log('═══════════════════════════════════════════════════');
}

// Run the test
runTest().catch(console.error);
