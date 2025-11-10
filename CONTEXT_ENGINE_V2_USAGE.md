# Context Engine v2 - Usage Guide

## ✅ Integration Status

**Status**: Fully operational
**Migration**: ✅ Complete (100/100 gems migrated)
**Database**: RxDB with IndexedDB (Dexie storage)
**Enrichment**: ✅ Active (Semantic classification + Keywords)

---

## Quick Start

### 1. Verify Integration

Open the popup inspector console and run:

```javascript
await window.ContextEngineAPI.getStats()
```

Expected output:
```javascript
{
  database: {
    totalGems: 100,
    gemsWithVectors: 0,      // Will populate when Embedder API available
    gemsWithSemantics: 100,
    enrichmentRate: "100.0"
  },
  bm25: {
    totalDocs: 100,
    uniqueTerms: 280,
    avgKeywordsPerDoc: 4.1
  },
  enrichment: {
    promptApi: true,
    embedder: false,         // Chrome Built-in AI not yet available
    summarizer: false
  },
  isReady: true
}
```

### 2. Comprehensive Verification

Load the verification script:

```javascript
// Copy and paste content from: engine/verify-integration.js
```

---

## API Reference

### Search for Context

```javascript
// Basic search
const results = await window.ContextEngineAPI.search(
  'coffee',      // query
  {},            // filters (optional)
  10             // limit (optional)
);

// With filters
const results = await window.ContextEngineAPI.search('work', {
  collections: ['Routine', 'Work'],
  semanticTypes: ['preference', 'constraint']
}, 5);

// Result format:
// [
//   {
//     id: "gem_123",
//     value: "I prefer coffee in the morning",
//     score: 0.8542,
//     collections: ["Food", "Drinks"],
//     semanticType: "preference",
//     keywords: { coffee: 2, morning: 1, ... }
//   }
// ]
```

### Add New Gem

```javascript
const newGem = {
  id: `gem_${Date.now()}`,
  value: "I prefer working from home on Fridays",
  collections: ["Work"],
  subCollections: ["Remote Work"],
  timestamp: Date.now()
};

// Auto-enrichment will add:
// - semanticType
// - attribute
// - attributeValue
// - keywords
// - vector (when Embedder API available)
const enrichedGem = await window.ContextEngineAPI.addGem(newGem, true);

console.log('Added:', enrichedGem);
// {
//   ...newGem,
//   semanticType: "preference",
//   attribute: "work location",
//   attributeValue: "home",
//   keywords: { work: 1, home: 1, friday: 1, ... }
// }
```

### Update Gem

```javascript
await window.ContextEngineAPI.updateGem(
  'gem_123',
  { value: 'Updated text', collections: ['NewCollection'] },
  true  // re-enrich if value changed
);
```

### Delete Gem

```javascript
await window.ContextEngineAPI.deleteGem('gem_123');
```

### Get All Gems

```javascript
// All gems
const allGems = await window.ContextEngineAPI.getAllGems();

// With filters
const filteredGems = await window.ContextEngineAPI.getAllGems({
  collections: ['Food'],
  semanticTypes: ['preference']
});
```

### Get Single Gem

```javascript
const gem = await window.ContextEngineAPI.getGem('gem_123');
```

---

## Semantic Types

Context Engine v2 automatically classifies each gem into one of these types:

| Type | Description | Example |
|------|-------------|---------|
| **constraint** | Hard limitations or requirements | "I cannot eat gluten" |
| **preference** | Likes, dislikes, desires | "I prefer tea over coffee" |
| **activity** | Actions, habits, routines | "I go jogging every morning" |
| **characteristic** | Personal attributes, traits | "I am introverted" |
| **goal** | Objectives, aspirations | "I want to learn Spanish" |

---

## Migration Details

### What Happened

1. **Data Source**: Existing gems from `chrome.storage.local` (HSP profile format)
2. **Target**: RxDB with IndexedDB backend
3. **Enrichment**: Each gem was enriched with:
   - Semantic type classification (using Chrome Prompt API)
   - Attribute extraction (attribute, attributeValue, attributeUnit)
   - Keyword extraction (for BM25 search)
4. **Indexes**: BM25 index built with 280 unique terms

### Schema

```javascript
{
  id: string,                    // Primary key
  value: string,                 // The gem text
  collections: string[],         // Categories
  subCollections: string[],      // Sub-categories
  timestamp: number,             // Creation timestamp

  // Enrichment metadata
  semanticType: string,          // 'constraint' | 'preference' | ...
  attribute: string,             // Extracted attribute
  attributeValue: string,        // Value of attribute
  attributeUnit: string,         // Unit (if applicable)

  // Vector embeddings (future)
  vector: number[],              // 384-dim embedding

  // Keywords for BM25
  keywords: {                    // word → frequency
    [word: string]: number
  },

  // Quality metadata
  enrichmentVersion: string,
  enrichmentTimestamp: number,
  userVerified: boolean
}
```

---

## Integration with Existing Code

### Example: Update context-selector.js

Replace the existing search logic with Context Engine v2:

```javascript
// OLD: Manual chrome.storage.local queries
const result = await chrome.storage.local.get(['hspProfile']);
const items = result.hspProfile?.content?.preferences?.items || [];
const filtered = items.filter(item =>
  item.value.toLowerCase().includes(query.toLowerCase())
);

// NEW: Use Context Engine v2 hybrid search
const results = await window.ContextEngineAPI.search(query, {
  collections: selectedCollections,
  semanticTypes: ['preference', 'constraint']
}, 10);
```

### Example: Add preference from calibration

```javascript
// In calibration.js or preference-options.js
async function savePreference(preferenceText, collection, subCollection) {
  const newGem = {
    id: `gem_${Date.now()}`,
    value: preferenceText,
    collections: [collection],
    subCollections: [subCollection],
    timestamp: Date.now()
  };

  // Auto-enrich and save
  await window.ContextEngineAPI.addGem(newGem, true);

  console.log('✅ Preference saved and enriched');
}
```

---

## Search Ranking

Context Engine v2 uses **hybrid search** combining:

1. **BM25 (Keyword-based)**: Fast sparse search using keyword frequency
2. **Vector Search** (when available): Dense semantic similarity
3. **Reciprocal Rank Fusion**: Combines both scores with configurable weights

Current configuration:
- BM25 weight: 0.7 (70%)
- Vector weight: 0.3 (30%)
- K parameter (RRF): 60

---

## Performance

- **Database**: IndexedDB with Dexie (unlimited storage)
- **Initialization**: ~200-500ms on first popup open
- **Search**: ~50-100ms for BM25 (vector search pending API availability)
- **Add Gem**: ~500ms (includes enrichment with Prompt API)
- **Bulk Import**: ~10-15 seconds for 100 gems (with enrichment)

---

## Troubleshooting

### Issue: `window.ContextEngineAPI is undefined`

**Cause**: Bundle not loaded or script order issue

**Fix**:
1. Check popup inspector console for errors
2. Verify `engine-bridge.bundle.js` is loaded in popup.html
3. Check if bundling was successful

### Issue: Search returns no results

**Cause**: BM25 index not built or database empty

**Fix**:
```javascript
const stats = await window.ContextEngineAPI.getStats();
console.log('Total gems:', stats.database.totalGems);
console.log('BM25 docs:', stats.bm25.totalDocs);
```

### Issue: Embedder API not available

**Status**: Normal - Chrome Built-in AI Embedder API not yet released

**Impact**: Vector search disabled, BM25 keyword search works fine

**Future**: When Embedder API becomes available:
1. Re-run enrichment: `await engine.batchReEnrich()`
2. Vector search will activate automatically

---

## Next Steps

### 1. Update UI Components

- **data-search.js**: Use `window.ContextEngineAPI.search()` instead of manual filtering
- **calibration.js**: Use `window.ContextEngineAPI.addGem()` when saving preferences
- **data-list.js**: Use `window.ContextEngineAPI.getAllGems()` to fetch gems

### 2. Enable Semantic Filtering

Add UI for filtering by semantic type:

```javascript
const preferences = await window.ContextEngineAPI.getAllGems({
  semanticTypes: ['preference']
});

const constraints = await window.ContextEngineAPI.getAllGems({
  semanticTypes: ['constraint']
});
```

### 3. Test Search Quality

Run searches with different queries and evaluate ranking:

```javascript
// In popup inspector console
const queries = ['coffee', 'work', 'food', 'exercise', 'sleep'];
for (const q of queries) {
  const results = await window.ContextEngineAPI.search(q, {}, 5);
  console.log(`"${q}":`, results.map(r => r.value.substring(0, 40)));
}
```

### 4. Monitor Performance

```javascript
console.time('search');
await window.ContextEngineAPI.search('coffee');
console.timeEnd('search');
```

---

## Future Enhancements

When Chrome Built-in AI APIs become available:

1. **Embedder API**: Enable vector embeddings for semantic search
2. **Summarizer API**: Auto-generate gem summaries
3. **Language Model API**: Enhanced attribute extraction

Current workaround: Using Prompt API for classification (working)

---

## Files Reference

- `engine/database.js` - RxDB setup and schema
- `engine/vector-store.js` - Vector storage and retrieval
- `engine/bm25.js` - Keyword search index
- `engine/hybrid-search.js` - Combines vector + BM25
- `engine/enrichment.js` - Semantic classification + keyword extraction
- `engine/context-engine.js` - Main orchestrator (API)
- `engine/migration.js` - chrome.storage → RxDB migration
- `engine-bridge.js` - ES6 → classic JS bridge
- `engine-bridge.bundle.js` - Bundled version (loaded in popup)

---

## Support

For issues or questions:

1. Check console logs in popup inspector
2. Run verification script: `engine/verify-integration.js`
3. Check database stats: `await window.ContextEngineAPI.getStats()`

**Status**: ✅ Operational - Ready for integration with UI components
