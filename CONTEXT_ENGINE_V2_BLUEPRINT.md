# Context Engine v2 - Technical Blueprint

**Version:** 2.0
**Status:** Design Phase
**Date:** 2025-11-10

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Required Tools & Technologies](#2-required-tools--technologies)
3. [Data Flow Diagram](#3-data-flow-diagram)
4. [Component Specifications](#4-component-specifications)
5. [Data Schemas](#5-data-schemas)
6. [API Interfaces](#6-api-interfaces)
7. [Nano Prompts](#7-nano-prompts)
8. [Algorithms](#8-algorithms)
9. [Implementation Phases](#9-implementation-phases)

---

## 1. Architecture Overview

### 1.1 Core Principles

**Separation of Concerns:**
- **Nano** = Semantic Intelligence (thinking, understanding, classification)
- **Engine** = Retrieval Infrastructure (searching, indexing, caching)

**Design Philosophy:**
> "Nano kann denken, aber nicht suchen" (Nano can think, but not search)

### 1.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    EXTENSION UI LAYER                        │
│  (Sidebar, Chat Interface, Settings)                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ User Query + Token Budget
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   ORCHESTRATOR LAYER                         │
│  - Coordinates Nano ↔ Engine communication                   │
│  - Manages pipeline execution (7 stages)                     │
│  - Handles error recovery & fallbacks                        │
└───────────┬────────────────────────┬────────────────────────┘
            │                        │
            │ Semantic Tasks         │ Retrieval Tasks
            ▼                        ▼
┌───────────────────────┐  ┌────────────────────────────────┐
│   NANO LAYER          │  │   ENGINE LAYER                 │
│                       │  │                                │
│ • Intent Classifier   │  │ • Vector Store (RxDB)          │
│ • Facet Generator     │  │ • Hybrid Search (Custom)       │
│ • Category Router     │  │   - Dense (RxDB Vector)        │
│ • Facet Ranker        │  │   - Sparse (BM25)              │
│ • Semantic Scorer     │  │   - Merge (RRF)                │
│ • Compressor          │  │ • MMR Calculator (Custom)      │
│                       │  │ • Token Budget Manager         │
│                       │  │ • Cache Manager                │
│                       │  │ • Indexing Service             │
└───────────────────────┘  └────────────┬───────────────────┘
                                        │
                                        │ CRUD Operations
                                        ▼
                           ┌────────────────────────────────┐
                           │   STORAGE LAYER                │
                           │                                │
                           │ • RxDB (IndexedDB backend)     │
                           │   - Structured gems            │
                           │   - Vector embeddings          │
                           │   - Indexes                    │
                           │ • Cache (recent queries)       │
                           └────────────────────────────────┘
```

### 1.3 7-Stage Pipeline

| Stage | Component | Responsibility | Type |
|-------|-----------|----------------|------|
| **0** | Auto-Enrichment | Add semantic metadata on save | NANO |
| **1** | Intent Classifier | Detect query type + domain | NANO |
| **2** | Facet Generator | Create 5 sub-questions | NANO |
| **3** | Category Router | Select categories per facet | NANO |
| **4** | Hybrid Retrieval | Dense + Sparse + MMR search | ENGINE |
| **5** | Facet Ranker | Score facet importance 0-1 | NANO |
| **6** | Scorer & Selector | Threshold + budget distribution | NANO + ENGINE |
| **7** | Compressor | Create 5 semantic text blocks | NANO |

---

## 2. Required Tools & Technologies

### 2.1 Core Dependencies

| Tool | Purpose | Installation | Notes |
|------|---------|--------------|-------|
| **RxDB** | Reactive database with vector plugin | `npm install rxdb rxjs` | Pure JavaScript, runs in browser |
| **Gemini Nano** | On-device AI for semantic tasks | Chrome Built-in AI API | Requires Chrome 127+ with flags enabled |
| **IndexedDB** | Storage backend for RxDB | Native Browser API | No installation needed |
| **BM25 (Custom)** | Sparse keyword search | Custom implementation (~200 lines) | For hybrid search |

### 2.2 RxDB Vector Configuration

**Why RxDB Vector?**
- Pure JavaScript (no WASM/CSP issues)
- Runs entirely in browser (no server needed)
- IndexedDB backend for persistence
- Reactive queries (real-time updates)
- Proven in production (used by many apps)
- Open source (Apache 2.0)

**Hybrid Search:** We implement custom (RxDB provides dense vector search, we add BM25 sparse search + RRF merging)

**Setup:**
```javascript
import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBVectorPlugin } from 'rxdb/plugins/vector';

// Create database
const db = await createRxDatabase({
  name: 'data_gems_db',
  storage: getRxStorageDexie(),
  multiInstance: false
});

// Add vector plugin
db.addCollections({
  gems: {
    schema: {
      version: 0,
      primaryKey: 'id',
      type: 'object',
      properties: {
        id: { type: 'string', maxLength: 100 },
        value: { type: 'string' },
        collections: { type: 'array', items: { type: 'string' } },
        semanticType: { type: 'string' },
        vector: { type: 'array', items: { type: 'number' } }, // 384-dim embedding
        timestamp: { type: 'number' }
      },
      required: ['id', 'value', 'vector'],
      indexes: ['collections', 'semanticType', 'timestamp']
    },
    vector: {
      field: 'vector',
      dimensions: 384,
      metric: 'cosine'
    }
  }
});
```

**Note:** Hybrid search and MMR are implemented manually (see Section 8 for algorithms).

### 2.3 Gemini Nano Setup

**Required Chrome Flags:**
```
chrome://flags/#prompt-api-for-gemini-nano
chrome://flags/#optimization-guide-on-device-model
```

**Capabilities:**
- Text embedding (384 dimensions)
- Classification
- Summarization
- Question answering
- JSON-structured output

**Limitations:**
- Max input: ~8K tokens
- Max output: ~2K tokens
- Temperature: 0 (deterministic, good for classification)

### 2.4 Chrome Extension Configuration

**Manifest v3 Requirements:**

```json
{
  "manifest_version": 3,
  "name": "Data Gems",
  "permissions": [
    "unlimitedStorage",  // For large IndexedDB (vectors)
    "storage"            // For chrome.storage API (settings only)
  ],
  "host_permissions": [
    // None needed - fully local!
  ],
  "background": {
    "service_worker": "service-worker.js",
    "type": "module"
  }
}
```

**Storage Quotas:**
- `unlimitedStorage` permission: IndexedDB has **no size limit** (only disk space)
- Without this permission: Limited to ~5MB (too small for vectors)

**Privacy-First:**
- ✅ All data stays local (IndexedDB on user's computer)
- ✅ No host_permissions needed (no external API calls)
- ✅ Gemini Nano runs locally (no data sent to Google)
- ✅ No analytics, no telemetry

**Development Tools:**

| Tool | Purpose | Required? |
|------|---------|-----------|
| Chrome Extension Manifest v3 | Extension framework | ✅ Yes |
| ES Modules | Code organization | ✅ Yes |
| Service Worker | Background processing | ✅ Yes (for extension) |
| Stylelint | CSS linting | ✅ Yes (existing) |

---

## 3. Data Flow Diagram

### 3.1 Complete Pipeline Flow

```
┌──────────────────────────────────────────────────────────────────┐
│ USER INPUT                                                       │
│ "Help me find casual sneakers under 150€"                       │
│ Token Budget: 500                                                │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAGE 1: Intent Classifier (NANO)                               │
│ Input: User query                                                │
│ Output: { type: "shopping", domain: "Fashion" }                 │
│ Duration: ~50ms                                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAGE 2: Facet Generator (NANO)                                 │
│ Input: Query + Intent                                            │
│ Output: [                                                        │
│   "What is my budget for shoes?",                               │
│   "What style and color do I prefer?",                          │
│   "What size and fit requirements do I have?",                  │
│   "What brands do I prefer or avoid?",                          │
│   "What activities will I use these shoes for?"                 │
│ ]                                                                │
│ Duration: ~200ms                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAGE 3: Category Router (NANO)                                 │
│ Input: 5 facets + available categories                          │
│ Output: {                                                        │
│   facet_0: ["Fashion"],                                         │
│   facet_1: ["Fashion"],                                         │
│   facet_2: ["Fashion"],                                         │
│   facet_3: ["Fashion"],                                         │
│   facet_4: ["Fashion", "Fitness"]                               │
│ }                                                                │
│ Duration: ~100ms                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAGE 4: Hybrid Retrieval (ENGINE)                              │
│ For each facet:                                                  │
│   1. Dense search (vector similarity) → Top 20 candidates       │
│   2. Sparse search (keyword matching) → Top 20 candidates       │
│   3. Merge results (union)                                      │
│   4. Apply MMR (diversity filter) → Top 10 diverse gems         │
│                                                                  │
│ Result: 5 facets × 10 gems each = 50 candidate gems             │
│ Duration: ~150ms (parallel processing)                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAGE 5: Facet Importance Ranker (NANO)                         │
│ Input: Original query + 5 facets                                │
│ Output: {                                                        │
│   facet_0: 1.0,   // Budget (critical)                          │
│   facet_1: 0.9,   // Style/color (very important)               │
│   facet_2: 0.7,   // Size/fit (important)                       │
│   facet_3: 0.5,   // Brands (nice-to-have)                      │
│   facet_4: 0.4    // Activities (context)                       │
│ }                                                                │
│ Duration: ~100ms                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAGE 6: Scoring & Selection (NANO + ENGINE)                    │
│                                                                  │
│ Step 1: Semantic Scoring (NANO)                                 │
│   For each gem in each facet:                                   │
│     base_score = similarity(gem, facet_question)                │
│     semantic_boost = boost_by_type(gem.semanticType, intent)   │
│     final_score = base_score + semantic_boost                   │
│                                                                  │
│ Step 2: Token Budget Distribution (ENGINE)                      │
│   facet_0_budget = 500 × (1.0 / 4.5) = 111 tokens               │
│   facet_1_budget = 500 × (0.9 / 4.5) = 100 tokens               │
│   facet_2_budget = 500 × (0.7 / 4.5) = 78 tokens                │
│   facet_3_budget = 500 × (0.5 / 4.5) = 56 tokens                │
│   facet_4_budget = 500 × (0.4 / 4.5) = 44 tokens                │
│   (Reserve ~110 tokens for formatting)                          │
│                                                                  │
│ Step 3: Threshold-based Selection (ENGINE)                      │
│   For each facet:                                                │
│     1. Filter: score >= 0.7 (high confidence)                   │
│     2. Sort by score descending                                 │
│     3. Pack gems until budget exhausted (~25 tokens/gem)        │
│     4. Apply MMR for diversity (lambda=0.5)                     │
│                                                                  │
│ Result: {                                                        │
│   facet_0: [gem_budget_150, gem_budget_shoes],                 │
│   facet_1: [gem_color_white, gem_style_casual],                │
│   facet_2: [gem_size_42],                                       │
│   facet_3: [gem_brands_adidas],                                 │
│   facet_4: [gem_runs_3x_week]                                   │
│ }                                                                │
│ Duration: ~200ms                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAGE 7: Semantic Compression & Assembly (NANO)                 │
│                                                                  │
│ For each facet:                                                  │
│   Input: List of selected gems                                  │
│   Process: Merge redundant info, extract key facts             │
│   Output: Compressed semantic text block (50-120 tokens)        │
│                                                                  │
│ Example:                                                         │
│   facet_0 gems: [                                               │
│     "Budget for shoes: max 150€",                               │
│     "Sneaker budget: 100-150€"                                  │
│   ]                                                              │
│   Compressed: "@budget max 150€ for sneakers"                   │
│                                                                  │
│ Final Assembly:                                                  │
│   Position 1 (facet_0): "@budget max 150€ for sneakers"        │
│   Position 2 (facet_1): "@style casual comfortable; @color..."  │
│   Position 3 (facet_2): "@size EU 42; @fit wide toe box"       │
│   Position 4 (facet_3): "@brands Adidas, Nike"                 │
│   Position 5 (facet_4): "@activity runs 3x/week outdoors"      │
│                                                                  │
│ Duration: ~150ms                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ OUTPUT TO AI CHAT                                                │
│                                                                  │
│ System: Here is relevant context about the user:                │
│                                                                  │
│ Budget & Constraints:                                            │
│ @budget max 150€ for sneakers                                   │
│                                                                  │
│ Style Preferences:                                               │
│ @style casual comfortable; @color white or neutral tones        │
│                                                                  │
│ Size & Fit:                                                      │
│ @size EU 42; @fit wide toe box                                  │
│                                                                  │
│ Brand Preferences:                                               │
│ @brands Adidas, Nike                                            │
│                                                                  │
│ Usage Context:                                                   │
│ @activity runs 3x/week outdoors                                 │
│                                                                  │
│ User: Help me find casual sneakers under 150€                   │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Auto-Enrichment Flow (Stage 0)

```
┌──────────────────────────────────────────────────────────────────┐
│ USER SAVES NEW GEM                                               │
│ "Budget for shoes: max 150€"                                     │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAGE 0a: Semantic Classification (NANO)                        │
│ Input: Gem value                                                 │
│ Output: {                                                        │
│   semanticType: "constraint",                                   │
│   attribute: "budget_shoes",                                    │
│   attributeValue: "150",                                        │
│   attributeUnit: "€"                                            │
│ }                                                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAGE 0b: Generate Embeddings (ENGINE)                          │
│ Input: Gem value + metadata                                     │
│ Output: {                                                        │
│   dense_vector: [0.234, -0.567, ...],  // 384 dims             │
│   sparse_vector: {                      // BM25 keywords        │
│     "budget": 2.5,                                              │
│     "shoes": 1.8,                                               │
│     "150": 1.2,                                                 │
│     "€": 1.0                                                    │
│   }                                                              │
│ }                                                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STAGE 0c: Store to Dual Storage (ENGINE)                        │
│                                                                  │
│ RxDB (IndexedDB backend):                                        │
│ {                                                                │
│   id: "pref_001",                                               │
│   value: "Budget for shoes: max 150€",                         │
│   collections: ["Fashion"],                                     │
│   subCollections: ["fashion_shopping"],                         │
│   semanticType: "constraint",                                   │
│   attribute: "budget_shoes",                                    │
│   attributeValue: "150",                                        │
│   attributeUnit: "€",                                           │
│   timestamp: 1699564800,                                        │
│   vector: [0.234, -0.567, ...],        // 384-dim embedding    │
│   keywords: {                           // For BM25 sparse search│
│     "budget": 2.5,                                              │
│     "shoes": 1.8,                                               │
│     "150": 1.2,                                                 │
│     "€": 1.0                                                    │
│   }                                                              │
│ }                                                                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. Component Specifications

### 4.1 NANO Components

#### 4.1.1 Intent Classifier

**Purpose:** Detect query type and domain category

**Input:**
```javascript
{
  query: string,              // User query
  availableCategories: string[] // User's actual categories
}
```

**Output:**
```javascript
{
  type: 'shopping' | 'recommendation' | 'planning' | 'information',
  domain: string | null       // One of availableCategories or null
}
```

**Model:** Gemini Nano (classification task)

**Prompt:** See Section 7.1

**Performance:** ~50ms

---

#### 4.1.2 Facet Generator

**Purpose:** Decompose query into 5 orthogonal sub-questions

**Input:**
```javascript
{
  query: string,
  intent: { type: string, domain: string | null }
}
```

**Output:**
```javascript
{
  facets: [
    { id: 0, question: string, rationale: string },
    { id: 1, question: string, rationale: string },
    { id: 2, question: string, rationale: string },
    { id: 3, question: string, rationale: string },
    { id: 4, question: string, rationale: string }
  ]
}
```

**Model:** Gemini Nano (generation task)

**Prompt:** See Section 7.2

**Performance:** ~200ms

**Quality Criteria:**
- Orthogonal (no overlap)
- Comprehensive (cover all angles)
- Specific (answerable from gems)
- Diverse semantic types (constraints, preferences, activities, etc.)

---

#### 4.1.3 Category Router

**Purpose:** Select relevant categories for each facet

**Input:**
```javascript
{
  facets: Array<{ id: number, question: string }>,
  availableCategories: string[],
  originalQuery: string
}
```

**Output:**
```javascript
{
  facet_0: ['Fashion'],
  facet_1: ['Fashion'],
  facet_2: ['Fashion'],
  facet_3: ['Fashion', 'Technology'],
  facet_4: ['Fitness', 'Habits']
}
```

**Model:** Gemini Nano (classification task)

**Prompt:** See Section 7.3

**Performance:** ~100ms

**Rules:**
- Each facet can have 0-3 categories
- No arbitrary category limits
- Cross-domain exploration encouraged for contextual facets

---

#### 4.1.4 Facet Importance Ranker

**Purpose:** Assign importance score 0-1 to each facet based on original query

**Input:**
```javascript
{
  originalQuery: string,
  facets: Array<{ id: number, question: string }>,
  intent: { type: string, domain: string | null }
}
```

**Output:**
```javascript
{
  facet_0: 1.0,   // Critical
  facet_1: 0.9,   // Very important
  facet_2: 0.7,   // Important
  facet_3: 0.5,   // Nice-to-have
  facet_4: 0.4    // Contextual
}
```

**Model:** Gemini Nano (scoring task)

**Prompt:** See Section 7.4

**Performance:** ~100ms

**Heuristics:**
- Shopping queries: Constraints > Preferences > Context
- Planning queries: Goals > Activities > Preferences
- Recommendation queries: Preferences > Constraints > Context

---

#### 4.1.5 Semantic Scorer

**Purpose:** Calculate relevance score with semantic type boosting

**Input:**
```javascript
{
  gem: Gem,
  facetQuestion: string,
  intent: { type: string, domain: string | null },
  baseScore: number // From vector similarity
}
```

**Output:**
```javascript
{
  finalScore: number,         // 0-1
  breakdown: {
    baseScore: number,
    semanticBoost: number,
    reasoning: string
  }
}
```

**Model:** Gemini Nano (scoring task)

**Prompt:** See Section 7.5

**Performance:** ~50ms per gem (batch processing recommended)

**Boosting Rules:**
```javascript
const SEMANTIC_BOOSTS = {
  shopping: {
    constraint: +0.15,
    preference: +0.10,
    characteristic: +0.05,
    activity: +0.03,
    goal: +0.01
  },
  recommendation: {
    preference: +0.12,
    constraint: +0.10,
    characteristic: +0.05,
    activity: +0.03,
    goal: +0.02
  },
  planning: {
    goal: +0.10,
    activity: +0.08,
    preference: +0.05,
    constraint: +0.05,
    characteristic: +0.02
  },
  information: {
    characteristic: +0.08,
    preference: +0.05,
    activity: +0.03,
    constraint: +0.02,
    goal: +0.02
  }
};
```

---

#### 4.1.6 Semantic Compressor

**Purpose:** Merge multiple gems into semantic text block

**Input:**
```javascript
{
  gems: Gem[],
  facetQuestion: string,
  tokenBudget: number  // 50-120 tokens
}
```

**Output:**
```javascript
{
  compressedText: string,
  tokensUsed: number,
  gemsIncluded: number
}
```

**Model:** Gemini Nano (summarization task)

**Prompt:** See Section 7.6

**Performance:** ~150ms for 5 facets

**Format Rules:**
- Use `@attribute value` format
- Remove redundancy
- Preserve critical constraints
- Group related info
- No conversational fluff

**Example:**
```
Input gems:
- "Budget for shoes: max 150€"
- "Sneaker budget: 100-150€"
- "Prefer spending 120€ on shoes"

Output:
@budget 100-150€ for sneakers, prefer ~120€
```

---

### 4.2 ENGINE Components

#### 4.2.1 Vector Store Interface

**Purpose:** Abstract RxDB operations

**API:**
```javascript
class VectorStore {
  constructor(rxDatabase) {
    this.db = rxDatabase;
    this.collection = rxDatabase.gems;
  }

  async insert(gem: Gem): Promise<void>
  async search(query: string, filters: Filter, limit: number): Promise<SearchResult[]>
  async hybridSearch(query: string, filters: Filter, limit: number): Promise<SearchResult[]>
  async delete(gemId: string): Promise<void>
  async update(gemId: string, gem: Partial<Gem>): Promise<void>
  async bulkInsert(gems: Gem[]): Promise<void>
}

interface SearchResult {
  id: string
  score: number
  gem: Gem
  source: 'dense' | 'sparse' | 'hybrid'
}

interface Filter {
  collections?: string[]
  semanticTypes?: string[]
  dateRange?: { from: number, to: number }
}
```

**Implementation:** RxDB wrapper with custom hybrid search

---

#### 4.2.2 Hybrid Search

**Purpose:** Combine dense vector search (RxDB) + sparse keyword search (BM25 custom)

**Algorithm:**
```javascript
async function hybridSearch(query, filters, limit) {
  // Step 1: Generate query embedding (Nano)
  const queryEmbedding = await generateEmbedding(query);

  // Step 2: Parallel searches
  const [denseResults, sparseResults] = await Promise.all([
    this.denseSearch(queryEmbedding, filters, limit * 2),
    this.sparseSearch(query, filters, limit * 2)
  ]);

  // Step 3: Merge with reciprocal rank fusion
  const merged = reciprocalRankFusion(denseResults, sparseResults);

  // Step 4: Apply MMR for diversity
  const diverse = applyMMR(merged, limit, lambda=0.5);

  return diverse;
}

// Dense Vector Search (RxDB Vector Plugin)
async function denseSearch(queryVector, filters, limit) {
  let query = this.collection.find();

  // Apply filters
  if (filters.collections && filters.collections.length > 0) {
    query = query.where('collections').in(filters.collections);
  }
  if (filters.semanticTypes && filters.semanticTypes.length > 0) {
    query = query.where('semanticType').in(filters.semanticTypes);
  }

  // Vector similarity search
  const results = await query
    .vectorSearch({ vector: queryVector, limit })
    .exec();

  return results.map(doc => ({
    id: doc.id,
    score: doc._vectorScore,
    gem: doc.toJSON()
  }));
}

// Sparse Keyword Search (Custom BM25)
async function sparseSearch(queryText, filters, limit) {
  const bm25 = new BM25(this.collection, {
    k1: 1.5,  // Term frequency saturation
    b: 0.75   // Length normalization
  });

  const scores = await bm25.search(queryText, filters);

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
```

**Reciprocal Rank Fusion (RRF):**
```javascript
function reciprocalRankFusion(results1, results2, k=60) {
  const scores = new Map();

  results1.forEach((result, rank) => {
    scores.set(result.id, (scores.get(result.id) || 0) + 1 / (k + rank + 1));
  });

  results2.forEach((result, rank) => {
    scores.set(result.id, (scores.get(result.id) || 0) + 1 / (k + rank + 1));
  });

  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ id, score }));
}
```

**Performance:** ~150ms for 5 parallel facet searches

---

#### 4.2.3 MMR Calculator

**Purpose:** Ensure diversity, avoid redundancy

**Algorithm:**
```javascript
function applyMMR(candidates, limit, lambda=0.5) {
  const selected = [];
  const remaining = [...candidates];

  // Start with highest-scoring candidate
  selected.push(remaining.shift());

  while (selected.length < limit && remaining.length > 0) {
    let maxScore = -Infinity;
    let maxIndex = -1;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];

      // Relevance score
      const relevance = candidate.score;

      // Maximum similarity to already selected
      const maxSimilarity = Math.max(
        ...selected.map(s => cosineSimilarity(candidate.vector, s.vector))
      );

      // MMR score
      const mmrScore = lambda * relevance - (1 - lambda) * maxSimilarity;

      if (mmrScore > maxScore) {
        maxScore = mmrScore;
        maxIndex = i;
      }
    }

    if (maxIndex >= 0) {
      selected.push(remaining.splice(maxIndex, 1)[0]);
    }
  }

  return selected;
}
```

**Lambda Parameter:**
- `lambda = 1.0`: Pure relevance (no diversity)
- `lambda = 0.5`: Balanced (recommended)
- `lambda = 0.0`: Pure diversity (not recommended)

**Performance:** O(n²) but acceptable for n ≤ 20

---

#### 4.2.4 Token Budget Manager

**Purpose:** Distribute token budget across facets based on importance

**Algorithm:**
```javascript
function distributeBudget(totalBudget, facetImportances, reserveTokens=110) {
  const availableBudget = totalBudget - reserveTokens;
  const totalImportance = Object.values(facetImportances).reduce((a, b) => a + b, 0);

  const distribution = {};

  for (const [facetId, importance] of Object.entries(facetImportances)) {
    distribution[facetId] = Math.floor(availableBudget * (importance / totalImportance));
  }

  return distribution;
}
```

**Example:**
```javascript
Input:
  totalBudget: 500
  facetImportances: { 0: 1.0, 1: 0.9, 2: 0.7, 3: 0.5, 4: 0.4 }

Output:
  {
    0: 111,  // (500-110) × (1.0/3.5)
    1: 100,  // (500-110) × (0.9/3.5)
    2: 78,   // (500-110) × (0.7/3.5)
    3: 56,   // (500-110) × (0.5/3.5)
    4: 45    // (500-110) × (0.4/3.5)
  }
```

**Gem Packing:**
```javascript
function packGems(gems, tokenBudget, avgTokensPerGem=25) {
  const packed = [];
  let usedTokens = 0;

  for (const gem of gems) {
    const gemTokens = estimateTokens(gem.value);

    if (usedTokens + gemTokens <= tokenBudget) {
      packed.push(gem);
      usedTokens += gemTokens;
    } else {
      break;
    }
  }

  return { gems: packed, tokensUsed: usedTokens };
}
```

---

#### 4.2.5 Cache Manager

**Purpose:** Cache recent query results to reduce computation

**Strategy:**
- LRU cache with max 50 entries
- Cache key: `hash(query + tokenBudget + timestamp_hour)`
- TTL: 1 hour
- Invalidate on gem create/update/delete

**Implementation:**
```javascript
class CacheManager {
  constructor(maxSize = 50) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  getCacheKey(query, budget) {
    const hour = Math.floor(Date.now() / 3600000);
    return `${hash(query)}_${budget}_${hour}`;
  }

  get(query, budget) {
    const key = this.getCacheKey(query, budget);
    return this.cache.get(key);
  }

  set(query, budget, result) {
    const key = this.getCacheKey(query, budget);

    if (this.cache.size >= this.maxSize) {
      // Delete oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, result);
  }

  invalidateAll() {
    this.cache.clear();
  }
}
```

---

#### 4.2.6 Indexing Service

**Purpose:** Manage RxDB document updates with embeddings

**Operations:**
- **Incremental indexing:** Add/update single gem
- **Batch indexing:** Bulk import on data restore
- **Re-indexing:** Rebuild all embeddings (manual trigger)

**Background Worker:**
```javascript
// service-worker.js
class IndexingService {
  constructor(rxDatabase) {
    this.db = rxDatabase;
    this.queue = [];
    this.processing = false;
  }

  async enqueue(operation) {
    this.queue.push(operation);

    if (!this.processing) {
      this.processQueue();
    }
  }

  async processQueue() {
    this.processing = true;

    while (this.queue.length > 0) {
      const operation = this.queue.shift();

      try {
        if (operation.type === 'insert') {
          await this.indexGem(operation.gem);
        } else if (operation.type === 'delete') {
          await this.db.gems.findOne(operation.gemId).remove();
        } else if (operation.type === 'update') {
          await this.reindexGem(operation.gemId);
        }
      } catch (error) {
        console.error('Indexing error:', error);
      }
    }

    this.processing = false;
  }

  async indexGem(gem) {
    // Generate embeddings
    const embeddings = await this.generateEmbeddings(gem);

    // Store in RxDB (includes vector in document)
    await this.db.gems.insert({
      id: gem.id,
      value: gem.value,
      collections: gem.collections,
      subCollections: gem.subCollections,
      semanticType: gem.semanticType,
      attribute: gem.attribute,
      attributeValue: gem.attributeValue,
      attributeUnit: gem.attributeUnit,
      vector: embeddings.dense,      // 384-dim array
      keywords: embeddings.sparse,    // { word: score }
      timestamp: gem.timestamp || Date.now()
    });
  }

  async generateEmbeddings(gem) {
    // Dense embedding from Gemini Nano
    const session = await LanguageModel.create();
    const dense = await session.embed(gem.value);

    // Sparse keywords (TF only, IDF calculated on search)
    const sparse = this.extractKeywords(gem.value);

    return { dense, sparse };
  }

  extractKeywords(text) {
    // Tokenize and count word frequencies
    const words = text.toLowerCase()
      .split(/\W+/)
      .filter(w => w.length > 2 && !STOPWORDS.includes(w));

    const freq = {};
    words.forEach(w => {
      freq[w] = (freq[w] || 0) + 1;
    });

    return freq;
  }
}

const STOPWORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
  'in', 'with', 'to', 'for', 'of', 'as', 'by', 'from', 'that'
]);
```

---

## 5. Data Schemas

### 5.1 Gem Schema (Enhanced)

```typescript
interface Gem {
  // EXISTING FIELDS (unchanged)
  id: string;                    // "pref_001"
  value: string;                 // User-entered text
  collections: string[];         // ["Fashion"]
  subCollections?: string[];     // ["fashion_shopping"]
  timestamp?: number;            // Unix timestamp

  // NEW: Semantic Metadata (auto-enriched)
  semanticType?: 'constraint' | 'preference' | 'activity' | 'characteristic' | 'goal';
  attribute?: string;            // "budget_shoes"
  attributeValue?: string;       // "150"
  attributeUnit?: string;        // "€"

  // NEW: Vector Embeddings (not stored in IndexedDB, only in Qdrant)
  // dense_vector: number[];     // 384-dim vector (in Qdrant only)
  // sparse_vector: object;      // BM25 keywords (in Qdrant only)

  // NEW: Quality Metadata
  enrichmentVersion?: string;    // "v2.0" (for migration tracking)
  enrichmentTimestamp?: number;  // When auto-enriched
  userVerified?: boolean;        // Manual correction flag
}
```

**Backward Compatibility:**
- All new fields are optional
- Existing gems without semantic metadata work normally
- Auto-enrichment runs on first edit if missing

---

### 5.2 Intent Schema

```typescript
interface Intent {
  type: 'shopping' | 'recommendation' | 'planning' | 'information';
  domain: string | null;         // One of user's categories or null
  confidence?: number;           // 0-1 (optional, from Nano)
}
```

---

### 5.3 Facet Schema

```typescript
interface Facet {
  id: number;                    // 0-4
  question: string;              // "What is my budget for shoes?"
  rationale?: string;            // Why this facet matters
  categories: string[];          // ["Fashion"]
  importance: number;            // 0-1
  gems: Gem[];                   // Selected gems for this facet
  compressedText?: string;       // Final semantic block
  tokensUsed?: number;           // Tokens consumed
}
```

---

### 5.4 Search Result Schema

```typescript
interface SearchResult {
  id: string;
  score: number;                 // 0-1
  gem: Gem;
  source: 'dense' | 'sparse' | 'hybrid';
}
```

---

### 5.5 Context Output Schema

```typescript
interface ContextOutput {
  facets: Facet[];               // Always 5 facets
  totalTokensUsed: number;
  totalGemsIncluded: number;
  processingTime: number;        // ms
  cacheHit: boolean;

  // Final formatted text for AI
  formattedContext: string;
}
```

**Example:**
```javascript
{
  "facets": [
    {
      "id": 0,
      "question": "What is my budget?",
      "importance": 1.0,
      "gems": [/* 2 gems */],
      "compressedText": "@budget max 150€ for sneakers",
      "tokensUsed": 8
    },
    // ... 4 more facets
  ],
  "totalTokensUsed": 487,
  "totalGemsIncluded": 12,
  "processingTime": 650,
  "cacheHit": false,
  "formattedContext": "Budget & Constraints:\n@budget max 150€...\n\nStyle Preferences:\n..."
}
```

---

## 6. API Interfaces

### 6.1 Extension UI ↔ Orchestrator

```typescript
// From UI to Orchestrator
interface ContextRequest {
  query: string;
  tokenBudget: number;           // Default: 500
  options?: {
    forceRefresh?: boolean;      // Skip cache
    debugMode?: boolean;         // Return intermediate stages
  }
}

// From Orchestrator to UI
interface ContextResponse {
  success: boolean;
  context: ContextOutput | null;
  error?: string;
  debug?: {
    intent: Intent;
    facets: Facet[];
    timings: Record<string, number>;
  }
}

// API call
async function getContext(request: ContextRequest): Promise<ContextResponse>
```

---

### 6.2 Orchestrator ↔ Nano

```typescript
// Intent Classification
async function classifyIntent(query: string, categories: string[]): Promise<Intent>

// Facet Generation
async function generateFacets(query: string, intent: Intent): Promise<Facet[]>

// Category Routing
async function routeCategories(facets: Facet[], categories: string[], query: string): Promise<Record<number, string[]>>

// Facet Ranking
async function rankFacets(query: string, facets: Facet[], intent: Intent): Promise<Record<number, number>>

// Semantic Scoring
async function scoreBatch(gems: Gem[], facetQuestion: string, intent: Intent, baseScores: number[]): Promise<number[]>

// Compression
async function compressGems(gems: Gem[], facetQuestion: string, tokenBudget: number): Promise<string>
```

---

### 6.3 Orchestrator ↔ Engine

```typescript
// Hybrid Search
async function hybridSearch(query: string, filters: Filter, limit: number): Promise<SearchResult[]>

// MMR
function applyMMR(results: SearchResult[], limit: number, lambda: number): SearchResult[]

// Budget Distribution
function distributeBudget(total: number, importances: Record<number, number>): Record<number, number>

// Gem Packing
function packGems(gems: Gem[], budget: number): { gems: Gem[], tokensUsed: number }

// Cache
function getCached(query: string, budget: number): ContextOutput | null
function setCached(query: string, budget: number, result: ContextOutput): void
```

---

### 6.4 Engine ↔ RxDB

```typescript
// RxDB wrapper
interface VectorStoreClient {
  // CRUD
  insert(gem: Gem): Promise<void>
  delete(id: string): Promise<void>
  update(id: string, updates: Partial<Gem>): Promise<void>
  bulkInsert(gems: Gem[]): Promise<void>

  // Search
  denseSearch(vector: number[], filter: Filter, limit: number): Promise<SearchResult[]>
  sparseSearch(query: string, filter: Filter, limit: number): Promise<SearchResult[]>
  hybridSearch(query: string, filter: Filter, limit: number): Promise<SearchResult[]>

  // Utilities
  countGems(filter?: Filter): Promise<number>
  getAllGems(): Promise<Gem[]>
  rebuildIndex(): Promise<void>
}
```

---

## 7. Nano Prompts

### 7.1 Intent Classifier Prompt

**System Prompt:**
```
You are a query classifier for a personal data assistant.

Your task: Classify user queries into TYPE and DOMAIN.

CRITICAL RULES:
1. ONLY use values from the provided lists - DO NOT invent new values
2. Return EXACTLY this JSON format: {"type": "VALUE", "domain": "VALUE_OR_NULL"}
3. DO NOT add extra fields or modify field names
4. Pick the CLOSEST match even if not perfect
5. For domain: select from user's actual categories, or null if none match

Available types:
- shopping: User wants to buy/find a product
- recommendation: User wants suggestions (restaurant, movie, etc.)
- planning: User wants to plan activity/routine
- information: User wants to learn/understand something

Available domains: Will be provided per-query (user's actual categories)

Examples:
- "Find me sneakers" → {"type": "shopping", "domain": "Fashion"}
- "Recommend a café" → {"type": "recommendation", "domain": "Nutrition"}
- "Plan my workout" → {"type": "planning", "domain": "Fitness"}
- "What is React?" → {"type": "information", "domain": "Technology"}
- "Buy groceries" → {"type": "shopping", "domain": "Nutrition"}

Output JSON only, no explanation.
```

**User Prompt Template:**
```
User query: "{query}"

Available type values: shopping, recommendation, planning, information
Available domain values: {categories.join(', ')}, null

Classify the query. Return JSON only:
```

---

### 7.2 Facet Generator Prompt

**System Prompt:**
```
You are a question decomposition specialist.

Your task: Break down a user query into EXACTLY 5 orthogonal sub-questions that explore different angles of what information would be relevant from the user's personal data.

CRITICAL RULES:
1. Generate EXACTLY 5 sub-questions (no more, no less)
2. Questions must be ORTHOGONAL (no overlap, different aspects)
3. Questions must be SPECIFIC and answerable from personal data gems
4. Cover diverse semantic types: constraints, preferences, activities, characteristics, goals
5. Return JSON array format

Guidelines by query type:
- Shopping: budget, style/color, size/fit, brands, usage context
- Recommendation: constraints, preferences, past experiences, companions, timing
- Planning: goals, current routines, preferences, constraints, past patterns
- Information: background knowledge, interests, skill level, use case, related experience

Output format:
[
  {"id": 0, "question": "...", "rationale": "..."},
  {"id": 1, "question": "...", "rationale": "..."},
  {"id": 2, "question": "...", "rationale": "..."},
  {"id": 3, "question": "...", "rationale": "..."},
  {"id": 4, "question": "...", "rationale": "..."}
]
```

**User Prompt Template:**
```
User query: "{query}"
Intent type: {intent.type}
Intent domain: {intent.domain || 'unknown'}

Generate 5 orthogonal sub-questions to find relevant personal data.
Return JSON array only:
```

---

### 7.3 Category Router Prompt

**System Prompt:**
```
You are a category routing specialist.

Your task: For each sub-question, select the most relevant categories from the user's available categories.

CRITICAL RULES:
1. ONLY use categories from the provided list - DO NOT invent categories
2. Each facet can have 0-3 categories
3. Return EXACTLY this JSON format: {"0": [...], "1": [...], "2": [...], "3": [...], "4": [...]}
4. Empty array [] is valid if no category matches
5. Cross-domain exploration is ENCOURAGED for contextual facets

Guidelines:
- Facet asking about budget/style in fashion → ["Fashion"]
- Facet asking about dietary needs → ["Nutrition"]
- Facet asking about workout habits → ["Fitness", "Habits"]
- Facet asking about general characteristics → ["Identity", "Health"]
- Facet asking about usage context → (can select multiple related categories)

Output JSON only, no explanation.
```

**User Prompt Template:**
```
Original query: "{originalQuery}"

Facets:
{facets.map(f => `${f.id}: ${f.question}`).join('\n')}

Available categories: {categories.join(', ')}

For each facet ID (0-4), select relevant categories (0-3 per facet).
Return JSON object only:
```

---

### 7.4 Facet Importance Ranker Prompt

**System Prompt:**
```
You are a facet importance evaluator.

Your task: Rate each facet's importance (0-1) for answering the original user query.

CRITICAL RULES:
1. Return scores between 0.0 and 1.0
2. At least one facet must score 1.0 (most critical)
3. Return EXACTLY this JSON format: {"0": 1.0, "1": 0.9, "2": 0.7, "3": 0.5, "4": 0.3}
4. Consider query type when scoring

Scoring guidelines by query type:

Shopping queries:
- Constraints (budget, size) → 0.9-1.0
- Preferences (style, color) → 0.7-0.9
- Context (activities, usage) → 0.3-0.5

Recommendation queries:
- Constraints (dietary, budget) → 0.8-1.0
- Preferences (cuisine, ambiance) → 0.7-0.9
- Past experiences → 0.5-0.7
- Contextual (companions, timing) → 0.3-0.5

Planning queries:
- Goals → 0.8-1.0
- Current activities/routines → 0.7-0.9
- Preferences → 0.5-0.7
- Constraints → 0.4-0.6

Information queries:
- Background knowledge → 0.7-1.0
- Interests → 0.6-0.8
- Use case → 0.5-0.7

Output JSON only, no explanation.
```

**User Prompt Template:**
```
Original query: "{originalQuery}"
Intent type: {intent.type}

Facets:
{facets.map(f => `${f.id}: ${f.question}`).join('\n')}

Rate importance (0-1) for each facet ID.
Return JSON object only:
```

---

### 7.5 Semantic Scorer Prompt

**System Prompt:**
```
You are a semantic relevance scorer.

Your task: Calculate how relevant a gem is to answering a specific facet question, considering its semantic type.

Input:
- Gem value (text)
- Gem semantic type (constraint, preference, activity, characteristic, goal)
- Facet question
- Query intent type
- Base similarity score (from vector search)

Output: Final score (0-1) with semantic type boost applied

Boosting rules:
Shopping queries:
- constraint: +0.15
- preference: +0.10
- characteristic: +0.05
- activity: +0.03
- goal: +0.01

Recommendation queries:
- preference: +0.12
- constraint: +0.10
- characteristic: +0.05
- activity: +0.03
- goal: +0.02

Planning queries:
- goal: +0.10
- activity: +0.08
- preference: +0.05
- constraint: +0.05
- characteristic: +0.02

Information queries:
- characteristic: +0.08
- preference: +0.05
- activity: +0.03
- constraint: +0.02
- goal: +0.02

Final score = baseScore + boost (capped at 1.0)

Return JSON: {"score": 0.85, "boost": 0.15, "reasoning": "..."}
```

**User Prompt Template:**
```
Gem value: "{gem.value}"
Gem semantic type: {gem.semanticType || 'unknown'}
Facet question: "{facetQuestion}"
Intent type: {intent.type}
Base score: {baseScore}

Calculate final relevance score with semantic boost.
Return JSON only:
```

**Note:** For performance, this should be batched (score multiple gems in one call)

---

### 7.6 Semantic Compressor Prompt

**System Prompt:**
```
You are a semantic compression specialist.

Your task: Merge multiple personal data gems into a concise semantic text block.

CRITICAL RULES:
1. Use @attribute value format
2. Remove redundancy (merge overlapping info)
3. Preserve ALL critical constraints (budget, dietary, size, etc.)
4. Group related attributes
5. NO conversational fluff, NO explanations
6. Target: 50-120 tokens per block
7. Multiple values for same attribute → combine (e.g., "@color white, beige, neutral")

Format examples:
Good: "@budget max 150€ for sneakers"
Bad: "The user has mentioned that their budget is around 150 euros for sneakers"

Good: "@style casual comfortable; @color white neutral tones"
Bad: "User prefers casual style and likes white or neutral colors"

Good: "@cuisine Mediterranean Italian; @ambiance cozy authentic; @dietary lactose-free"
Bad: "The user enjoys Mediterranean and Italian cuisine in a cozy atmosphere, and needs lactose-free options"

Return compressed text only, no JSON wrapper.
```

**User Prompt Template:**
```
Facet question: "{facetQuestion}"
Token budget: {tokenBudget} tokens

Gems to compress:
{gems.map(g => `- ${g.value}`).join('\n')}

Compress into semantic @attribute value format.
Target: {tokenBudget} tokens.
Return compressed text only:
```

---

## 8. Algorithms

### 8.1 BM25 Sparse Search (Custom Implementation)

**Purpose:** Keyword-based search using BM25 (Best Matching 25) algorithm

**Formula:**
```
score(doc, query) = Σ IDF(term) × (TF(term) × (k1 + 1)) / (TF(term) + k1 × (1 - b + b × (docLength / avgDocLength)))

where:
  IDF(term) = log((N - df(term) + 0.5) / (df(term) + 0.5))
  TF(term) = term frequency in document
  N = total number of documents
  df(term) = document frequency (how many docs contain term)
  k1 = term frequency saturation parameter (default: 1.5)
  b = length normalization parameter (default: 0.75)
```

**Implementation:**
```javascript
class BM25 {
  constructor(collection, options = {}) {
    this.collection = collection;
    this.k1 = options.k1 || 1.5;
    this.b = options.b || 0.75;
    this.avgDocLength = null;
    this.docCount = null;
    this.idfCache = new Map();
  }

  async search(queryText, filters, limit = 20) {
    // Tokenize query
    const queryTerms = this.tokenize(queryText);

    // Get all documents (filtered)
    const docs = await this.getFilteredDocs(filters);

    // Calculate stats if needed
    if (!this.avgDocLength) {
      await this.calculateStats(docs);
    }

    // Score each document
    const scores = [];
    for (const doc of docs) {
      const score = this.scoreDocument(doc, queryTerms);
      if (score > 0) {
        scores.push({ id: doc.id, score, gem: doc.toJSON() });
      }
    }

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  scoreDocument(doc, queryTerms) {
    let score = 0;
    const docLength = this.getDocLength(doc);

    for (const term of queryTerms) {
      const tf = this.getTermFrequency(doc, term);
      if (tf === 0) continue;

      const idf = this.getIDF(term);
      const numerator = tf * (this.k1 + 1);
      const denominator = tf + this.k1 * (1 - this.b + this.b * (docLength / this.avgDocLength));

      score += idf * (numerator / denominator);
    }

    return score;
  }

  getTermFrequency(doc, term) {
    // Get from pre-computed keywords field
    return doc.keywords?.[term] || 0;
  }

  getIDF(term) {
    if (this.idfCache.has(term)) {
      return this.idfCache.get(term);
    }

    // Count how many documents contain this term
    const df = this.getDocumentFrequency(term);
    const idf = Math.log((this.docCount - df + 0.5) / (df + 0.5));

    this.idfCache.set(term, idf);
    return idf;
  }

  getDocumentFrequency(term) {
    // Count docs where keywords[term] exists
    // In practice, cache this during initialization
    return this.dfCache.get(term) || 0;
  }

  getDocLength(doc) {
    // Sum of all term frequencies
    return Object.values(doc.keywords || {}).reduce((sum, freq) => sum + freq, 0);
  }

  async calculateStats(docs) {
    this.docCount = docs.length;

    let totalLength = 0;
    const dfMap = new Map();

    for (const doc of docs) {
      totalLength += this.getDocLength(doc);

      // Count document frequencies
      for (const term of Object.keys(doc.keywords || {})) {
        dfMap.set(term, (dfMap.get(term) || 0) + 1);
      }
    }

    this.avgDocLength = totalLength / this.docCount;
    this.dfCache = dfMap;
  }

  tokenize(text) {
    return text.toLowerCase()
      .split(/\W+/)
      .filter(w => w.length > 2 && !STOPWORDS.includes(w));
  }

  async getFilteredDocs(filters) {
    let query = this.collection.find();

    if (filters?.collections) {
      query = query.where('collections').in(filters.collections);
    }
    if (filters?.semanticTypes) {
      query = query.where('semanticType').in(filters.semanticTypes);
    }

    return await query.exec();
  }
}
```

**Complexity:**
- Pre-processing: O(n × m) where n = docs, m = avg doc length
- Query: O(n × k) where k = query terms
- With caching: ~50ms for 1000 docs

---

### 8.2 Hybrid Search Algorithm

**Pseudocode:**
```
function hybridSearch(query, filters, limit):
  // Step 1: Generate query embeddings
  queryVector = await generateEmbedding(query)
  queryKeywords = extractKeywords(query)

  // Step 2: Parallel dense + sparse search
  denseResults = await vectorStore.denseSearch(
    vector: queryVector,
    filter: filters,
    limit: limit * 2
  )

  sparseResults = await vectorStore.sparseSearch(
    keywords: queryKeywords,
    filter: filters,
    limit: limit * 2
  )

  // Step 3: Reciprocal Rank Fusion
  mergedResults = reciprocalRankFusion(denseResults, sparseResults, k=60)

  // Step 4: Apply MMR for diversity
  diverseResults = applyMMR(mergedResults, limit, lambda=0.5)

  return diverseResults
```

**Complexity:**
- Dense search: O(n log k) where n = collection size, k = limit
- Sparse search: O(m log k) where m = keyword matches
- RRF: O(k)
- MMR: O(k²)
- Total: O(n log k) dominated by vector search

---

### 8.3 Reciprocal Rank Fusion (RRF)

**Formula:**
```
score(doc) = Σ [1 / (k + rank(doc, query_i))]
```

**Implementation:**
```javascript
function reciprocalRankFusion(resultLists, k=60) {
  const scores = new Map();

  for (const results of resultLists) {
    results.forEach((result, rank) => {
      const currentScore = scores.get(result.id) || 0;
      const rrfScore = 1 / (k + rank + 1);
      scores.set(result.id, currentScore + rrfScore);
    });
  }

  return Array.from(scores.entries())
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score);
}
```

**Why RRF?**
- No parameter tuning needed (unlike weighted fusion)
- Robust to different score scales
- Gives equal importance to dense + sparse
- Industry standard (Elasticsearch, Vespa)

---

### 8.4 Maximal Marginal Relevance (MMR)

**Formula:**
```
MMR = argmax [λ × Relevance(d) - (1-λ) × max Similarity(d, d_i)]
         d∈R\S                              d_i∈S

where:
  R = candidate set
  S = selected set
  λ = relevance vs diversity trade-off (0-1)
```

**Implementation:**
```javascript
function applyMMR(candidates, limit, lambda=0.5) {
  if (candidates.length <= limit) return candidates;

  const selected = [];
  const remaining = [...candidates];

  // Start with highest relevance
  selected.push(remaining.shift());

  while (selected.length < limit && remaining.length > 0) {
    let bestScore = -Infinity;
    let bestIndex = -1;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];

      // Relevance component
      const relevance = candidate.score;

      // Diversity component (max similarity to selected)
      const similarities = selected.map(s =>
        cosineSimilarity(candidate.vector, s.vector)
      );
      const maxSimilarity = Math.max(...similarities);

      // MMR score
      const mmrScore = lambda * relevance - (1 - lambda) * maxSimilarity;

      if (mmrScore > bestScore) {
        bestScore = mmrScore;
        bestIndex = i;
      }
    }

    if (bestIndex >= 0) {
      selected.push(remaining.splice(bestIndex, 1)[0]);
    } else {
      break; // No more candidates
    }
  }

  return selected;
}
```

**Lambda Tuning:**
- λ = 1.0: Pure relevance (no diversity) → Redundant results
- λ = 0.7: Relevance-focused with some diversity
- λ = 0.5: **Balanced (recommended)** → Good trade-off
- λ = 0.3: Diversity-focused
- λ = 0.0: Pure diversity → May include irrelevant results

---

### 8.5 Token Budget Distribution

**Algorithm:**
```javascript
function distributeBudget(totalBudget, facetImportances, reserveTokens=110) {
  // Reserve tokens for formatting overhead
  const availableBudget = totalBudget - reserveTokens;

  // Calculate total importance
  const totalImportance = Object.values(facetImportances)
    .reduce((sum, importance) => sum + importance, 0);

  // Proportional distribution
  const distribution = {};
  let allocated = 0;

  for (const [facetId, importance] of Object.entries(facetImportances)) {
    const budget = Math.floor(availableBudget * (importance / totalImportance));
    distribution[facetId] = budget;
    allocated += budget;
  }

  // Distribute remaining tokens to highest-importance facet
  const remaining = availableBudget - allocated;
  if (remaining > 0) {
    const topFacet = Object.entries(facetImportances)
      .sort((a, b) => b[1] - a[1])[0][0];
    distribution[topFacet] += remaining;
  }

  return distribution;
}
```

**Example:**
```
Input:
  totalBudget = 500
  facetImportances = {0: 1.0, 1: 0.9, 2: 0.7, 3: 0.5, 4: 0.4}
  totalImportance = 3.5
  availableBudget = 390

Output:
  facet_0: 111 tokens  (390 × 1.0/3.5)
  facet_1: 100 tokens  (390 × 0.9/3.5)
  facet_2: 78 tokens   (390 × 0.7/3.5)
  facet_3: 56 tokens   (390 × 0.5/3.5)
  facet_4: 45 tokens   (390 × 0.4/3.5)

  Reserve: 110 tokens (for headers, formatting)
  Total: 500 tokens
```

---

### 8.6 Threshold-based Selection

**Algorithm:**
```javascript
function selectGemsWithThreshold(
  candidates,      // Scored gems
  tokenBudget,     // Available tokens
  threshold=0.7,   // Minimum score
  avgTokens=25     // Avg tokens per gem
) {
  // Filter by threshold
  const qualified = candidates.filter(gem => gem.score >= threshold);

  if (qualified.length === 0) {
    return { gems: [], tokensUsed: 0 }; // Empty facet OK
  }

  // Sort by score descending
  qualified.sort((a, b) => b.score - a.score);

  // Pack gems until budget exhausted
  const selected = [];
  let tokensUsed = 0;

  for (const gem of qualified) {
    const gemTokens = estimateTokens(gem.value);

    if (tokensUsed + gemTokens <= tokenBudget) {
      selected.push(gem);
      tokensUsed += gemTokens;
    } else {
      break; // Budget full
    }
  }

  // Apply MMR for diversity (if multiple gems selected)
  if (selected.length > 1) {
    const diverse = applyMMR(selected, selected.length, lambda=0.5);
    return { gems: diverse, tokensUsed };
  }

  return { gems: selected, tokensUsed };
}
```

**Threshold Tuning:**
- 0.9: Very strict (only near-perfect matches)
- **0.7: Recommended** (high confidence)
- 0.5: Moderate (more gems, lower quality)
- 0.3: Lenient (risk of irrelevant gems)

---

### 8.7 Token Estimation

**Simple heuristic:**
```javascript
function estimateTokens(text) {
  // GPT-style tokenization: ~1 token per 4 characters
  // More accurate: Use tiktoken library
  return Math.ceil(text.length / 4);
}
```

**Better approach (with tiktoken):**
```javascript
import { encode } from 'gpt-tokenizer';

function estimateTokens(text) {
  return encode(text).length;
}
```

---

## 9. Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Goals:**
- Set up RxDB with Vector plugin
- Implement basic vector storage
- Create auto-enrichment for new gems

**Tasks:**
1. Install RxDB dependencies: `npm install rxdb rxjs`
2. Create RxDB database with gems collection
3. Add Vector plugin configuration (384-dim embeddings)
4. Create VectorStore wrapper class
5. Implement BM25 class (~200 LOC)
6. Implement `indexGem()` function
7. Add auto-enrichment on gem save:
   - Semantic type classification (Nano)
   - Embedding generation (Nano)
   - Keyword extraction for BM25
   - Store in RxDB
8. Test with 10 manual gems

**Deliverables:**
- ✅ RxDB configured with IndexedDB backend
- ✅ Vector plugin working
- ✅ BM25 implementation complete
- ✅ Auto-enrichment working
- ✅ 10 test gems indexed with vectors + keywords

---

### Phase 2: Nano Integration (Week 3-4)

**Goals:**
- Implement all 6 Nano components
- Test individual components

**Tasks:**
1. Create Nano prompt templates
2. Implement Intent Classifier
3. Implement Facet Generator
4. Implement Category Router
5. Implement Facet Ranker
6. Implement Semantic Scorer
7. Implement Semantic Compressor
8. Unit tests for each component

**Deliverables:**
- ✅ All 6 Nano components working
- ✅ Unit tests passing
- ✅ Prompt templates refined

---

### Phase 3: Engine Implementation (Week 5-6)

**Goals:**
- Implement hybrid search (RxDB + BM25)
- Implement RRF merging
- Implement MMR
- Implement token budget manager

**Tasks:**
1. Implement dense vector search (RxDB Vector plugin)
2. Integrate BM25 sparse search (from Phase 1)
3. Implement RRF merging (~50 LOC)
4. Implement MMR algorithm (~100 LOC)
5. Implement hybrid search coordinator
6. Implement token budget distribution
7. Implement threshold-based selection
8. Implement cache manager
9. Integration testing with all components

**Deliverables:**
- ✅ Dense search working (RxDB)
- ✅ Sparse search working (BM25)
- ✅ Hybrid search combining both via RRF
- ✅ MMR reducing redundancy
- ✅ Token budget respected
- ✅ Cache improving performance
- ✅ All ~350 LOC custom code tested

---

### Phase 4: Orchestrator (Week 7)

**Goals:**
- Connect Nano + Engine
- Implement 7-stage pipeline
- End-to-end testing

**Tasks:**
1. Create Orchestrator class
2. Implement pipeline flow:
   - Stage 1: Intent → Nano
   - Stage 2: Facets → Nano
   - Stage 3: Category routing → Nano
   - Stage 4: Hybrid search → Engine
   - Stage 5: Facet ranking → Nano
   - Stage 6: Scoring + selection → Nano + Engine
   - Stage 7: Compression → Nano
3. Add error handling & fallbacks
4. Integration tests

**Deliverables:**
- ✅ End-to-end pipeline working
- ✅ All 5 test scenarios passing (from SEMANTIC_TESTING_GUIDE.md)

---

### Phase 5: UI Integration (Week 8)

**Goals:**
- Integrate with existing chat UI
- Add debug mode
- Polish user experience

**Tasks:**
1. Update chat API to use new Context Engine
2. Add loading states
3. Add debug panel (show facets, timings, etc.)
4. Add manual facet editing (advanced mode)
5. User testing

**Deliverables:**
- ✅ Seamless integration
- ✅ Debug mode for transparency
- ✅ Positive user feedback

---

### Phase 6: Migration & Batch Enrichment (Week 9-10)

**Goals:**
- Migrate existing gems
- Bulk auto-enrichment
- Data quality validation

**Tasks:**
1. Create migration script:
   - Read all existing gems from IndexedDB
   - Auto-enrich semantic metadata
   - Generate embeddings
   - Store in Qdrant
2. Add manual correction UI (for wrong classifications)
3. Analytics dashboard (show semantic type distribution)
4. Validation reports

**Deliverables:**
- ✅ All existing gems enriched
- ✅ Manual correction tools available
- ✅ Data quality > 90%

---

### Phase 7: Optimization (Week 11-12)

**Goals:**
- Performance tuning
- Cache optimization
- Production readiness

**Tasks:**
1. Profile bottlenecks
2. Optimize Nano batch calls
3. Tune MMR lambda
4. Tune threshold values
5. Cache hit rate optimization
6. Load testing (1000+ gems)
7. Error monitoring

**Deliverables:**
- ✅ Context selection < 1 second
- ✅ Cache hit rate > 40%
- ✅ Handles 1000+ gems smoothly

---

## Appendix A: Technology Comparison

### Why RxDB Vector + Custom Hybrid over Alternatives?

| Feature | RxDB + Custom | Qdrant Edge | Chroma | Weaviate | Voy (WASM) | Custom IndexedDB |
|---------|---------------|-------------|--------|----------|------------|------------------|
| Browser-native | ✅ Yes (JS) | ⚠️ Beta only | ❌ Server | ❌ Server | ✅ Yes (WASM) | ✅ Yes |
| Dense search | ✅ Built-in | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes (k-d tree) | ❌ Manual |
| Sparse search | ⚠️ Custom BM25 | ✅ Built-in | ✅ Built-in | ✅ BM25 | ❌ No | ❌ Manual |
| Hybrid search | ⚠️ Custom RRF | ✅ Built-in | ✅ Built-in | ✅ Built-in | ❌ No | ❌ Manual |
| MMR | ⚠️ Custom (~100 LOC) | ✅ Built-in | ❌ No | ✅ Yes | ❌ No | ❌ Manual |
| Persistence | ✅ IndexedDB | ✅ IndexedDB | N/A | N/A | ⚠️ Must serialize | ✅ IndexedDB |
| Incremental updates | ✅ Yes | ✅ Yes | N/A | N/A | ❌ Immutable index | ✅ Yes |
| Performance | ✅ Good (JS) | ✅ Fast (WASM) | N/A | N/A | ✅ Very fast (WASM) | ⚠️ Slower |
| Setup complexity | ✅ Simple | ⚠️ Beta access | ❌ Server | ❌ Server | ✅ Simple | ⚠️ High effort |
| Chrome Extension CSP | ✅ No issues | ⚠️ Unknown | N/A | N/A | ⚠️ Needs wasm-unsafe-eval | ✅ No issues |
| License | ✅ Apache 2.0 | ✅ Apache 2.0 | ✅ Apache 2.0 | ✅ BSD | ✅ MIT | N/A |
| Production ready | ✅ Yes | ⚠️ Beta | N/A | N/A | ⚠️ v0.x | ⚠️ Depends |
| Custom code needed | ⚠️ ~350 LOC | ❌ None | N/A | N/A | ⚠️ ~400 LOC | ⚠️ ~1000+ LOC |

**Winner: RxDB + Custom Hybrid**

**Pros:**
- ✅ Production-ready today (no beta access needed)
- ✅ Pure JavaScript (no CSP issues)
- ✅ Incremental updates (no index rebuild)
- ✅ Good documentation & community
- ✅ Proven in production apps
- ✅ Full control over algorithms

**Cons:**
- ⚠️ Need to implement BM25 (~200 LOC)
- ⚠️ Need to implement RRF (~50 LOC)
- ⚠️ Need to implement MMR (~100 LOC)
- ⚠️ Total custom code: ~350 LOC

**Alternative Considered: Qdrant Edge**
- Would be perfect, but private beta with unclear timeline
- Can migrate later if it becomes available
- Blueprint already designed to support both

**Why NOT Voy:**
- Immutable index (rebuild on every update)
- No hybrid search (vector only)
- No MMR
- More custom code needed than RxDB

---

## Appendix B: Open Questions & Future Work

### Open Questions

1. **Optimal MMR lambda value:**
   - Current: 0.5 (balanced)
   - Consider: A/B test different values (0.3, 0.5, 0.7)

2. **Semantic type classification accuracy:**
   - Current: Nano-based auto-enrichment
   - Future: Fine-tuned model on labeled dataset?

3. **Token budget defaults:**
   - Current: 500 tokens
   - Should this vary by query type?
   - Shopping: 600 (more constraints)
   - Information: 400 (less context needed)

4. **Cache invalidation strategy:**
   - Current: 1-hour TTL
   - Better: Smart invalidation based on gem edit relevance

### Future Enhancements

**v2.1: Multi-language Support**
- Detect query language
- Use language-specific embeddings
- Cross-lingual semantic search

**v2.2: Temporal Awareness**
- Consider gem freshness (recent gems > old)
- Decay factor based on timestamp
- "Current preferences" vs "historical data"

**v2.3: User Feedback Loop**
- Track which gems were actually useful (implicit feedback)
- Boost gems that led to positive interactions
- Personalized scoring weights

**v2.4: Cross-User Learning**
- Anonymous aggregate patterns (privacy-preserving)
- "Users who saved X also saved Y"
- Improve semantic classification

**v2.5: Advanced Facets**
- Dynamic facet count (3-7 instead of fixed 5)
- Adaptive facet generation based on gem distribution
- Hierarchical facets (main + sub-facets)

---

## Appendix C: Performance Benchmarks (Target)

| Operation | Target | Notes |
|-----------|--------|-------|
| **Stage 1:** Intent classification | < 50ms | Nano classification |
| **Stage 2:** Facet generation | < 200ms | Nano generation |
| **Stage 3:** Category routing | < 100ms | Nano classification (5 facets) |
| **Stage 4:** Hybrid search (5 facets) | < 150ms | Parallel execution |
| **Stage 5:** Facet ranking | < 100ms | Nano scoring |
| **Stage 6:** Scoring + selection | < 200ms | Nano batch scoring |
| **Stage 7:** Compression | < 150ms | Nano summarization (5 blocks) |
| **Total pipeline** | **< 1 second** | End-to-end |
| **Cache hit** | < 50ms | Read from cache |
| **Auto-enrichment (save)** | < 300ms | Background, non-blocking |

**Assumptions:**
- Gemini Nano running locally (no network latency)
- 500 gems in collection
- Modern browser (Chrome 127+)
- Decent hardware (M1 Mac or equivalent)

---

## Appendix D: Error Handling & Fallbacks

### Nano Failures

**Scenario 1: Nano not available (browser not supported)**
```javascript
Fallback: Use regex-based intent detection (existing system)
Impact: Lower accuracy but functional
```

**Scenario 2: Nano timeout (> 5 seconds)**
```javascript
Fallback: Use cached last successful result or simple keyword matching
Impact: Degraded quality for this query only
```

**Scenario 3: Nano returns invalid JSON**
```javascript
Fallback: Retry once, then use regex fallback
Impact: Slight delay + degraded quality
```

### Engine Failures

**Scenario 4: Qdrant Edge initialization fails**
```javascript
Fallback: Use pure IndexedDB search (no vectors, keyword-only)
Impact: Slower, less accurate
Alert user: "Advanced search unavailable"
```

**Scenario 5: Embedding generation fails**
```javascript
Fallback: Skip dense search, use sparse-only
Impact: Lower recall but functional
```

### General Strategies

1. **Graceful degradation:** Always have a fallback
2. **Error logging:** Track failures to fix in updates
3. **User communication:** Inform when advanced features unavailable
4. **Auto-retry:** Transient failures get 1 retry
5. **Timeout limits:** No operation > 5 seconds

---

## Appendix E: Privacy & Security

### Data Storage

**What's stored locally:**
- All gems (IndexedDB)
- All vectors (Qdrant Edge → IndexedDB)
- Cache (IndexedDB, 1-hour TTL)

**What's NEVER sent to server:**
- User gems
- User queries
- Context outputs
- Embeddings

### Gemini Nano Privacy

**On-device processing:**
- All Nano operations run locally in browser
- No data sent to Google servers
- Model downloaded once, runs offline

### Security Considerations

1. **Content Security Policy:** Strict CSP for extension
2. **XSS Protection:** Sanitize all user inputs
3. **Data encryption:** IndexedDB not encrypted by default
   - Future: Add optional encryption for sensitive gems
4. **Export/Backup:** Provide encrypted export option

---

## Appendix F: Auto-Backup & Sync Strategy

### Problem: Data Loss on New Chrome Instance

**Current Limitation:**
- IndexedDB is bound to browser profile + device
- New Chrome profile = Empty database
- New computer = Empty database
- Chrome reinstall = Data loss

**Solution: Layered Backup Strategy**

---

### Phase 1 (v1.0): Manual Export/Import + Reminder

**Already implemented** ✅

```javascript
// Existing functionality
Settings → Export Data → gems_backup_2025-11-10.json
Settings → Import Data → Select file
```

**Add: Backup Reminder**
```javascript
// Show reminder every 2 weeks
if (daysSinceLastBackup > 14) {
  showNotification({
    title: "Backup Reminder",
    message: "You haven't backed up your Data Gems in 2 weeks. Export now?",
    actions: ["Export Now", "Remind Later"]
  });
}
```

**Deliverable:** Low-friction backup without auto-sync complexity

---

### Phase 2 (v1.5): Auto-Backup to Cloud Folder

**Feature: File System Access API + User's Cloud**

```javascript
// User selects folder once
const dirHandle = await window.showDirectoryPicker({
  mode: 'readwrite',
  startIn: 'documents'
});

// Save permission for future use
await chrome.storage.local.set({
  backupDirHandle: dirHandle
});

// Auto-backup every 5 minutes (if changes detected)
setInterval(async () => {
  if (hasChanges()) {
    await autoBackup(dirHandle);
  }
}, 5 * 60 * 1000);
```

**Auto-Restore on Start:**
```javascript
// On extension startup
async function autoRestore() {
  const dirHandle = await chrome.storage.local.get('backupDirHandle');

  if (dirHandle) {
    const backupFile = await dirHandle.getFileHandle('data-gems-backup.json');
    const content = await backupFile.getFile().then(f => f.text());
    const backup = JSON.parse(content);

    // Compare with local DB
    if (backup.timestamp > localDB.timestamp) {
      await mergeBackup(backup);
    }
  }
}
```

**User's Cloud Options:**
- Dropbox folder
- iCloud Drive folder
- OneDrive folder
- Google Drive folder (if installed)
- Custom folder

**Benefits:**
- ✅ Quasi-automatic sync (via user's own cloud)
- ✅ Privacy-first (user's own infrastructure)
- ✅ Works across devices
- ✅ No server costs
- ✅ Version history (if user wants)

**Limitations:**
- ⚠️ Requires File System Access API (Chrome 86+)
- ⚠️ User must have cloud folder set up
- ⚠️ Conflict resolution needed (if editing on 2 devices simultaneously)

---

### Phase 3 (v2.0 - Optional): Cloud Sync Service

**Only if many users request it**

```javascript
Settings:
  [ ] Enable Cloud Sync (optional)
      → End-to-end encrypted
      → Requires account (email + password)
      → Server: self-hosted or managed
```

**Architecture:**
```
Client 1 (Chrome Profile A)
    ↕ E2E encrypted sync
Server (sync.data-gems.com)
    ↕ E2E encrypted sync
Client 2 (Chrome Profile B)
```

**Privacy:**
- End-to-end encryption (server cannot read data)
- Zero-knowledge architecture
- Optional (default: off)

**Costs:**
- Server infrastructure
- Account management
- Email verification
- Support burden

**Decision:** Defer to v2.0+, only if user demand is high

---

### Conflict Resolution Strategy

**Scenario:** User edits gems on 2 devices simultaneously

**Approach: Last-Write-Wins with Merge**
```javascript
function mergeBackup(remoteBackup, localDB) {
  const merged = {};

  // For each gem
  for (const id of allGemIds) {
    const remote = remoteBackup.gems[id];
    const local = localDB.gems[id];

    if (!local) {
      // Deleted locally or new remote → use remote
      merged[id] = remote;
    } else if (!remote) {
      // Deleted remotely or new local → use local
      merged[id] = local;
    } else {
      // Both exist → compare timestamps
      if (remote.timestamp > local.timestamp) {
        merged[id] = remote;  // Remote is newer
      } else {
        merged[id] = local;   // Local is newer
      }
    }
  }

  return merged;
}
```

**Edge Case: Simultaneous edits (< 1 minute apart)**
```
Show warning:
"Conflict detected: Gem X was edited on both devices.
 Keep: [Local version] [Remote version] [Merge both]"
```

---

### Backup Format

**JSON Structure:**
```json
{
  "version": "2.0",
  "timestamp": 1699564800,
  "device": "macbook-pro",
  "gemsCount": 500,
  "gems": [
    {
      "id": "pref_001",
      "value": "Budget for shoes: max 150€",
      "collections": ["Fashion"],
      "semanticType": "constraint",
      "vector": [0.234, -0.567, ...],  // Optional: exclude to reduce size
      "timestamp": 1699564700
    }
  ],
  "settings": {
    "categories": ["Fashion", "Nutrition", "Fitness"],
    "preferences": { ... }
  }
}
```

**Optimization Options:**
- **Full backup** (with vectors): ~2 MB for 1000 gems
- **Compact backup** (without vectors): ~200 KB for 1000 gems
  - Vectors can be regenerated on restore

---

### Implementation Timeline

| Phase | Feature | Timeline | Effort |
|-------|---------|----------|--------|
| Phase 1 | Backup reminder | v1.0 (now) | 1 day |
| Phase 2 | Auto-backup to cloud folder | v1.5 (2-3 months) | 1 week |
| Phase 3 | Cloud sync service | v2.0+ (6+ months, if requested) | 2-3 weeks |

**Recommendation:** Start with Phase 1 (reminder), ship v1.0, gather feedback, then decide on Phase 2.

---

## Appendix G: Glossary

| Term | Definition |
|------|------------|
| **Dense Search** | Vector similarity search using embeddings |
| **Sparse Search** | Keyword-based search (BM25, TF-IDF) |
| **Hybrid Search** | Combination of dense + sparse search |
| **RRF** | Reciprocal Rank Fusion (merging algorithm) |
| **MMR** | Maximal Marginal Relevance (diversity filter) |
| **Facet** | Sub-question exploring one dimension of context |
| **Semantic Type** | Classification of gem function (constraint, preference, etc.) |
| **Nano** | Gemini Nano (on-device AI) |
| **Engine** | Retrieval infrastructure (search, indexing) |
| **Orchestrator** | Coordinator between Nano and Engine |
| **Token Budget** | Maximum tokens for context (e.g., 500) |
| **Enrichment** | Auto-adding semantic metadata to gems |
| **Qdrant Edge** | Browser-based vector database |

---

## Document Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2025-11-10 | Initial blueprint created with Qdrant Edge |
| v2.0 | 2025-11-10 | **Major revision:** Replaced Qdrant Edge with RxDB Vector + Custom Hybrid Search. Added BM25 implementation, Chrome Extension config, Auto-Backup strategy |

---

**End of Technical Blueprint**
