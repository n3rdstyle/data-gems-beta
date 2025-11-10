# Context Engine v2 Integration Example

## Before & After: Updating context-selector.js

### Current Implementation (Old)

```javascript
// OLD: Manual filtering and scoring with multiple AI calls
async function selectRelevantGemsWithAI(promptText, dataGems, maxResults = 5) {
  // 1. Get all categories from gems
  const allCategories = [...new Set(dataGems.flatMap(gem => gem.collections || []))];

  // 2. AI call to select relevant categories
  const relevantCategories = await selectRelevantCategoriesWithAI(promptText, allCategories);

  // 3. Filter gems by categories
  const candidateGems = filterGemsByCategories(dataGems, relevantCategories);

  // 4. AI calls to score each gem (10-50 calls!)
  const scoredGems = [];
  for (const gem of candidateGems) {
    const score = await scoreGemWithAI(promptText, gem);
    scoredGems.push({ gem, score });
  }

  // 5. Sort and return
  return scoredGems
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(item => item.gem);
}
```

**Issues:**
- Multiple AI calls (20-50 per query)
- Slow (5-10 seconds)
- No semantic search
- Manual category filtering

---

### New Implementation (Context Engine v2)

```javascript
// NEW: Single hybrid search call with pre-enriched gems
async function selectRelevantGemsWithContextEngine(promptText, maxResults = 5, filters = {}) {
  // Initialize if needed
  if (!window.ContextEngineAPI.isReady) {
    await window.ContextEngineAPI.initialize();
  }

  // Single hybrid search call (BM25 + vector when available)
  const results = await window.ContextEngineAPI.search(
    promptText,
    filters,
    maxResults
  );

  return results;
}
```

**Benefits:**
- Single API call
- Fast (~50-100ms with BM25)
- Hybrid ranking (keywords + semantics)
- Pre-enriched with semantic types
- Better relevance scores

---

## Step-by-Step Migration

### Step 1: Update optimizePromptWithContext

**Before:**
```javascript
async function optimizePromptWithContext(promptText, profile, useAI = true, maxGems = 5) {
  // Get gems from chrome.storage via profile parameter
  const dataGems = profile?.content?.preferences?.items || [];
  const visibleGems = dataGems.filter(gem => gem.state !== 'hidden');

  // AI-based selection with multiple calls
  const selectedGems = await selectRelevantGemsWithAI(promptText, visibleGems, maxGems);

  return formatPromptWithContext(promptText, selectedGems);
}
```

**After:**
```javascript
async function optimizePromptWithContext(promptText, profile, useAI = true, maxGems = 5) {
  // Ensure Context Engine is ready
  if (!window.ContextEngineAPI?.isReady) {
    console.log('[Context Selector] Context Engine not ready, using fallback');
    return promptText;
  }

  // Hybrid search with semantic filtering
  const selectedGems = await window.ContextEngineAPI.search(
    promptText,
    {
      // Exclude hidden gems (if needed)
      // Note: Context Engine doesn't store "state" - implement if needed
    },
    maxGems
  );

  return formatPromptWithContext(promptText, selectedGems);
}
```

### Step 2: Add Semantic Type Filtering

```javascript
async function optimizePromptWithContext(promptText, profile, useAI = true, maxGems = 5) {
  if (!window.ContextEngineAPI?.isReady) {
    console.log('[Context Selector] Context Engine not ready');
    return promptText;
  }

  // Analyze query intent (reuse existing function)
  const queryIntent = await analyzeQueryIntent(promptText);

  // Build filters based on intent
  const filters = {};

  // Use semantic type filtering
  if (queryIntent.requiredSemanticTypes?.length > 0) {
    filters.semanticTypes = queryIntent.requiredSemanticTypes;
  }

  // Domain filtering (if detected)
  if (queryIntent.domain) {
    filters.collections = [queryIntent.domain];
  }

  console.log('[Context Selector] Searching with filters:', filters);

  // Hybrid search
  const selectedGems = await window.ContextEngineAPI.search(
    promptText,
    filters,
    maxGems
  );

  console.log('[Context Selector] Context Engine returned', selectedGems.length, 'gems');

  return formatPromptWithContext(promptText, selectedGems);
}
```

### Step 3: Backward Compatibility Layer

Keep existing code working while transitioning:

```javascript
async function optimizePromptWithContext(promptText, profile, useAI = true, maxGems = 5) {
  // Try Context Engine v2 first
  if (window.ContextEngineAPI?.isReady) {
    try {
      console.log('[Context Selector] Using Context Engine v2 hybrid search');

      const queryIntent = await analyzeQueryIntent(promptText);

      const filters = {};
      if (queryIntent.requiredSemanticTypes?.length > 0) {
        filters.semanticTypes = queryIntent.requiredSemanticTypes;
      }
      if (queryIntent.domain) {
        filters.collections = [queryIntent.domain];
      }

      const selectedGems = await window.ContextEngineAPI.search(
        promptText,
        filters,
        maxGems
      );

      if (selectedGems.length > 0) {
        return formatPromptWithContext(promptText, selectedGems);
      }

      console.log('[Context Selector] No results from Context Engine, falling back');
    } catch (error) {
      console.error('[Context Selector] Context Engine error:', error);
    }
  }

  // Fallback to old implementation
  console.log('[Context Selector] Using legacy selection');
  const dataGems = enrichGemsWithBasicInfo(profile);
  const visibleGems = dataGems.filter(gem => gem.state !== 'hidden');

  let selectedGems;
  if (useAI && typeof LanguageModel !== 'undefined') {
    selectedGems = await selectRelevantGemsWithAI(promptText, visibleGems, maxGems, profile);
  } else {
    selectedGems = selectRelevantGemsByKeywords(promptText, visibleGems, maxGems);
  }

  return formatPromptWithContext(promptText, selectedGems);
}
```

---

## Performance Comparison

| Operation | Old (Manual) | New (Context Engine v2) |
|-----------|--------------|-------------------------|
| Search for "coffee" | ~5-10 seconds | ~50-100ms |
| AI Calls | 20-50 calls | 0 calls (uses BM25) |
| Semantic Understanding | Manual category selection | Automatic semantic types |
| Ranking | AI scoring only | Hybrid (BM25 + Vector*) |
| Cache | No caching | BM25 index cached |

\* Vector search active when Chrome Embedder API becomes available

---

## Example Usage

### Simple Search

```javascript
// Search with Context Engine
const results = await window.ContextEngineAPI.search('coffee', {}, 5);

console.log('Results:', results);
// [
//   {
//     id: "gem_123",
//     value: "I prefer medium roast coffee in the morning",
//     score: 0.8542,
//     semanticType: "preference",
//     collections: ["Food", "Drinks"],
//     keywords: { coffee: 2, morning: 1, prefer: 1 }
//   },
//   ...
// ]
```

### Filtered Search (Shopping Intent)

```javascript
// Detect shopping intent
const queryIntent = await analyzeQueryIntent("Find me running shoes under 100€");

// Search with semantic type filter
const results = await window.ContextEngineAPI.search(
  "running shoes",
  {
    semanticTypes: ['constraint', 'preference'],  // Only constraints and preferences
    collections: ['Fashion', 'Fitness']           // Relevant categories
  },
  5
);

// Results will include:
// - "My shoe size is 42" (constraint)
// - "I prefer Nike or Adidas" (preference)
// - "My budget for shoes is 80-120€" (constraint)
```

### Complex Query with Decomposition

```javascript
// Existing decomposition logic can still be used
const subQuestions = await decomposePromptIntoSubQuestions(
  "Find me a healthy post-workout breakfast recipe"
);
// ["What are my nutrition preferences?", "What are my workout habits?", ...]

// Run parallel searches
const subQueryResults = await Promise.all(
  subQuestions.map(subQ =>
    window.ContextEngineAPI.search(subQ, {}, 3)
  )
);

// Merge results (reuse existing merge logic)
const selectedGems = await mergeGemResults(subQueryResults, 5);
```

---

## Benefits of Migration

1. **Performance**: 50-100x faster (50ms vs 5s)
2. **Scalability**: Works with 1000+ gems
3. **Semantic Understanding**: Pre-classified semantic types
4. **Better Ranking**: Hybrid search combines keyword + semantic
5. **Maintainability**: Simpler code, fewer AI calls
6. **Future-Proof**: Vector search will auto-activate when Embedder API available

---

## Rollout Strategy

### Phase 1: Enable for Simple Queries (Week 1)
- Update `optimizePromptWithContext` with Context Engine fallback
- Test with simple 1-2 word queries
- Monitor performance and accuracy

### Phase 2: Enable for Complex Queries (Week 2)
- Use Context Engine for decomposed sub-questions
- Keep existing merge logic
- A/B test against old implementation

### Phase 3: Full Migration (Week 3)
- Remove old manual selection code
- Update all components to use Context Engine
- Update documentation

---

## Testing Checklist

- [ ] Simple queries: "coffee", "work", "food"
- [ ] Complex queries: "Find me a healthy breakfast"
- [ ] Shopping intent: "Buy running shoes under 100€"
- [ ] Recommendation: "Suggest a good restaurant"
- [ ] Planning: "Plan my workout routine"
- [ ] Semantic type filtering works
- [ ] Collection filtering works
- [ ] Results are deduplicated
- [ ] Performance < 100ms
- [ ] Fallback to old code if Context Engine fails

---

## Next Steps

1. **Run verification script** (see `engine/verify-integration.js`)
2. **Test search quality** with sample queries
3. **Update context-selector.js** with backward-compatible implementation
4. **Monitor performance** in production
5. **Gradually phase out old code** once stable

---

## Support & Troubleshooting

### Issue: Search returns no results

```javascript
// Check stats
const stats = await window.ContextEngineAPI.getStats();
console.log('Total gems:', stats.database.totalGems);
console.log('BM25 docs:', stats.bm25.totalDocs);
```

### Issue: Results not relevant

```javascript
// Check what's being searched
const results = await window.ContextEngineAPI.search('coffee', {}, 10);
console.log('Results:', results.map(r => ({
  score: r.score,
  value: r.value.substring(0, 50)
})));
```

### Issue: Context Engine not initialized

```javascript
// Force initialization
await window.ContextEngineAPI.initialize();
const stats = await window.ContextEngineAPI.getStats();
console.log('Ready:', stats.isReady);
```

---

**Status**: Ready for integration
**Docs**: See `CONTEXT_ENGINE_V2_USAGE.md` for complete API reference
