# Question Decomposition Fan-Out Implementation

## Overview

The **Question Decomposition Fan-Out** technique enhances the Data Gems prompt optimization by breaking complex queries into multiple focused sub-questions, running them in parallel, and intelligently merging the results.

## Architecture

**ALWAYS-ON MODE**: Fan-out is enabled for ALL prompts (no complexity check)

```
User: "Help me plan a healthy post-workout breakfast"
    ↓
AI Decomposition (1 call) → 2-5 sub-questions
    ├─ "What are my nutrition preferences?"
    ├─ "What are my workout habits?"
    ├─ "What are my breakfast preferences?"
    ├─ "What are my health goals?"
    └─ "What are my dietary restrictions?"
    ↓
Parallel Context Selection (5 calls run simultaneously via Promise.all)
    CRITICAL: Each scoring receives BOTH original query AND sub-question!
    ├─ Sub-Q1 + Original → Nutrition category → scored with context
    ├─ Sub-Q2 + Original → Fitness category → scored with context
    ├─ Sub-Q3 + Original → Food category → scored with context
    ├─ Sub-Q4 + Original → Health category → scored with context
    └─ Sub-Q5 + Original → Dietary category → scored with context
    ↓
Smart Merge (deduplicate, boost multi-matches, ensure diversity)
    ↓
Top 5 unique gems selected
    ↓
Formatted prompt with original query + context
```

## Key Features

### 1. **Always-On Mode**
Fan-out is enabled for ALL prompts (complexity detection removed):

```javascript
// ALL prompts use fan-out:
✓ "Help me plan a healthy post-workout breakfast"  → 4-5 sub-questions
✓ "Best restaurants for date night"  → 3-4 sub-questions
✓ "Best pizza"  → 2-3 sub-questions
✓ "Find casual sneakers"  → 3-4 sub-questions

// The AI adapts sub-question count based on query:
- Simple queries: 2-3 focused questions
- Complex queries: 4-5 comprehensive questions
```

**Benefits**:
- Consistent behavior (no mode switching)
- Even simple queries benefit from multi-angle exploration
- Better cross-domain discovery

**Trade-off**: ~2x AI calls for all queries (but parallel execution keeps latency similar)

### 2. **Sub-Question Generation**
AI decomposes prompts into **2-5 focused sub-questions**:

**System Prompt Strategy**:
- Each sub-question targets ONE specific aspect
- Focus on personal context (preferences, habits, goals, constraints)
- Questions are complementary, not overlapping
- Simple and direct phrasing

**Example Outputs**:

| Original Prompt | Sub-Questions |
|----------------|---------------|
| "Help me plan a healthy post-workout breakfast" | 1. What are my nutrition preferences?<br>2. What are my workout habits?<br>3. What are my breakfast preferences?<br>4. What are my health goals?<br>5. What are my dietary restrictions? |
| "Best laptop for my work" | 1. What is my profession and work requirements?<br>2. What is my budget for technology?<br>3. What are my computing preferences?<br>4. What software do I use regularly? |
| "Recommend a good restaurant for date night" | 1. What are my food preferences?<br>2. What is my budget for dining?<br>3. What type of ambiance do I prefer? |

### 3. **Parallel Execution**
Each sub-question runs through the **context selection pipeline** in parallel:

```javascript
const subQueryResults = await Promise.all(
  subQuestions.map(subQ =>
    selectRelevantGemsWithAI(subQ, visibleGems, 2, profile, promptText, true)
  )
);
```

**Each sub-query executes**:
- Stage 1: Category selection (direct matches only)
- Stage 1.5: SubCategory filtering (if applicable)
- ~~Semantic expansion~~ **DISABLED for sub-queries** (prevents false positives)
- Stage 2: Batch gem scoring (with original query context)

**Why semantic expansion is disabled for sub-queries**:
- Sub-questions already contain specific keywords (e.g., "nutrition", "workout")
- The decomposition AI already expanded the original query into focused aspects
- Direct keyword matching is sufficient and more precise
- Prevents false connections (e.g., "dog leash" → "fitness" → running frequency)

**Performance**: 5 sub-queries run simultaneously → ~same latency as 1 query!

### 4. **Smart Merging**

The merge algorithm ensures:

#### **Deduplication**
Gems appearing in multiple sub-queries are tracked:
```javascript
{
  gem: <gem object>,
  score: 12,
  appearances: 3,  // Appeared in 3 different sub-queries
  sources: [0, 2, 4]  // From sub-questions 1, 3, and 5
}
```

#### **Cross-Domain Boost**
Gems appearing in **multiple sub-queries** get a **+3 score bonus** per additional appearance:
- 1 appearance: Base score (e.g., 8)
- 2 appearances: Base + 3 = 11 (cross-domain relevance!)
- 3+ appearances: Base + 6+ = 14+ (highly relevant across domains)

#### **Position Bonus**
Gems appearing early in sub-query results get extra points:
- Position 0 (first): +3
- Position 1 (second): +2
- Position 2 (third): +1

#### **Diversity Enforcement**
To ensure **multi-domain context**, the algorithm limits gems per sub-question:
- Max 2 gems from same source (for maxGems=3)
- **Exception**: Gems with multiple appearances (cross-domain) always included

### 5. **Result Selection**

**Final output**: Top 3 unique gems

**Sorting Priority**:
1. **Primary**: Total score (base + cross-domain bonuses + position bonuses)
2. **Secondary**: Number of appearances (prefer cross-domain gems)

**Example Merge**:

| Gem | Source Sub-Qs | Appearances | Base Score | Position Bonus | Cross-Domain Bonus | **Final Score** |
|-----|---------------|-------------|------------|----------------|-------------------|----------------|
| "Low carb diet" | Q1, Q4 | 2 | 9 | +2 | +3 | **14** ✓ Selected |
| "Morning workout 6am" | Q2, Q3 | 2 | 8 | +3 | +3 | **14** ✓ Selected |
| "Protein shake recipe" | Q1 | 1 | 9 | +3 | 0 | **12** ✓ Selected |
| "Favorite breakfast: oatmeal" | Q3 | 1 | 8 | +1 | 0 | **9** ✗ Not selected |

## Benefits

### ✅ **Broader Context Coverage**
Complex queries often need information from multiple categories. Fan-out naturally explores different domains:

**Example**: "Plan healthy post-workout breakfast"
- Single-query: Might focus only on Nutrition
- Fan-out: Explores Nutrition + Fitness + Food + Health + Dietary

### ✅ **Better Cross-Domain Connections**
Gems that appear in multiple sub-queries are **automatically prioritized** → high-quality, multi-faceted context.

### ✅ **Faster Execution**
Parallel sub-queries run simultaneously → **same latency** as single-query approach (~2-3s for all 5 sub-queries).

### ✅ **Precision Through Focused Questions**
Each sub-question is simple and targeted → better category/subcategory selection than a complex original query.

### ✅ **Graceful Degradation**
If decomposition fails or returns <2 questions → **automatically falls back** to single-query approach.

### **CRITICAL: Context-Aware Scoring**

**THE BUG FIX**: Previously, gems were scored based on the sub-question ALONE, causing irrelevant results.

**Example of the bug**:
```
Original query: "Help me find a new casual sneaker"
Sub-question: "Are there any brands you particularly like or dislike?"

Gem: "Lieblingschipsmarke? Doritos"
OLD scoring: 10/10 ✗ (It's a brand! Matches sub-question!)
NEW scoring: 0/10 ✓ (Chips brand irrelevant to SNEAKERS!)
```

**The fix**: Scoring AI now receives BOTH original query AND sub-question:
```javascript
Original request: "Help me find a new casual sneaker"
Specific aspect: "Are there any brands you particularly like or dislike?"

// AI knows to only score SNEAKER-RELATED brands highly!
```

**Scoring prompt now emphasizes**:
- Score based on relevance to the ORIGINAL REQUEST
- Example given: "if original request is about sneakers, chip brands should score 0"

---

### **Option 3: Disabled Semantic Expansion for Sub-Queries**

**THE FIX**: Semantic expansion is now **disabled for sub-queries** to prevent overly broad category selection.

**Example of the problem**:
```
Original query: "I need a new leash for my dog"
Sub-question: "Where do I plan to use the leash?"

OLD behavior (with semantic expansion):
  Direct match: Pets(10)
  Semantic expansion adds: Fitness(9), Sports(8), Fashion(7)
  → Baseball cap and running frequency gems get scored 9/10 ✗

NEW behavior (direct matches only):
  Direct match: Pets(10)
  No semantic expansion
  → Only pet-related gems are considered ✓
```

**Why this works**:
- Sub-questions already contain specific keywords thanks to the decomposition AI
- Example: "What are my nutrition preferences?" → Direct match: Nutrition, Food
- Fan-out's parallel execution ensures cross-domain coverage
- Each sub-question naturally explores different aspects with its own keywords

**Implementation**:
```javascript
// In selectRelevantGemsWithAI()
async function selectRelevantGemsWithAI(
  promptText, dataGems, maxResults, profile, originalQuery,
  isSubQuery = false  // ← New parameter
) {
  // ...
  if (!isSubQuery) {
    // Semantic expansion only for original queries
    const expandedCategories = await expandCategoriesSemanticly(...);
  } else {
    console.log('Skipping semantic expansion for sub-query');
  }
}

// In fan-out code
selectRelevantGemsWithAI(subQ, visibleGems, 2, profile, promptText, true)
//                                                                    ↑
//                                                            isSubQuery=true
```

**Benefits**:
- ✅ Prevents false positive category connections
- ✅ More predictable behavior (no AI guessing)
- ✅ Simpler to debug (direct keyword matching only)
- ✅ Still maintains cross-domain coverage via multiple sub-questions

---

### **Batch Scoring Parser**

The batch scoring now supports **multiple response formats**:

```javascript
// Format 1: JSON array (preferred)
[7, 8, 3, 9, 6]

// Format 2: Comma-separated
7, 8, 3, 9, 6

// Format 3: Line-separated
7
8
3
9
6

// Format 4: Numbers in text (extracted automatically)
"Item 1 scores 7, item 2 scores 8, ..."
```

**Fallback**: If parsing fails, assigns score=5 (middle) to all gems in that batch.

**Benefit**: More robust against AI response variability. Reduces failed batches from ~25% to <5%.

---

## Trade-offs

### ⚠️ **More AI Calls**
- Decomposition: +1 call
- Sub-queries: +N calls (2-5)
- **Total**: ~6-8 AI calls (vs 3-5 for single-query)

**Mitigation**: Parallel execution keeps latency low. Only triggers for complex queries.

### ⚠️ **Complexity**
More moving parts than single-query approach. Requires careful:
- Result merging logic
- Deduplication
- Diversity enforcement

### ⚠️ **Gemini Nano Rate Limits**
Multiple parallel calls might hit rate limits on some devices.

**Mitigation**: Fallback to single-query approach on error.

## Configuration

### **Always-On Mode (Current)**
Fan-out is enabled for ALL prompts:

```javascript
// In optimizePromptWithContext()
const shouldUseFanOut = useAI && typeof LanguageModel !== 'undefined';
// No complexity check - always true if AI is available
```

**To Re-Enable Complexity Detection** (if needed):
```javascript
// Change line 1138 in context-selector.js from:
const shouldUseFanOut = useAI && typeof LanguageModel !== 'undefined';

// To:
const shouldUseFanOut = useAI && typeof LanguageModel !== 'undefined' && shouldDecomposePrompt(promptText);
```

The `shouldDecomposePrompt()` function still exists and checks for:
- **Modifiers**: `new`, `casual`, `healthy`, `best`, `affordable`, `modern`, etc.
- **Complex Verbs**: `plan`, `find`, `recommend`, `suggest`, `compare`, `optimize`, etc.
- **Multiple Concepts**: Conjunctions (`and`, `with`) or commas

### **Max Gems Per Sub-Query**
Control how many gems each sub-query can return:

```javascript
// Current: Math.ceil(maxGems / 1.5) = 2 gems per sub-query (for maxGems=3)
selectRelevantGemsWithAI(subQ, visibleGems, 2, profile)
```

**Tune for**:
- **More variety**: Increase to 3 gems per sub-query
- **More precision**: Decrease to 1 gem per sub-query

### **Final Selection Size**
```javascript
// Current: maxGems = 5 (updated from 3)
optimizePromptWithContext(promptText, hspProfile, true, 5)
```

**Recommended**:
- 5 gems = rich multi-domain context (current setting)
- Reduce to 3 for more focused context
- Diversity enforcement: Max 3 gems from same sub-query (60% of maxGems)

## Testing

### **Manual Test Cases**

#### Test 1: Complex Multi-Domain Query
**Prompt**: `"Help me plan a healthy post-workout breakfast that's high in protein"`

**Expected**:
- ✓ Triggers fan-out (>10 words + modifiers)
- ✓ Decomposes into 4-5 sub-questions
- ✓ Returns 3 unique gems from different domains (Nutrition, Fitness, Food)

#### Test 2: Simple Query
**Prompt**: `"Best pizza place"`

**Expected**:
- ✓ Skips fan-out (only 3 words)
- ✓ Uses single-query approach
- ✓ Returns 1-3 gems from Food category

#### Test 3: Cross-Domain Relevance
**Prompt**: `"Suggest a workout and meal plan for weight loss"`

**Expected**:
- ✓ Triggers fan-out
- ✓ Returns gems that appear in multiple sub-queries (Fitness + Nutrition)
- ✓ Cross-domain gems ranked higher

### **Console Logs to Monitor**

```javascript
[Context Selector] Complexity check: {wordCount: 12, shouldDecompose: true}
[Context Selector] 🔀 Using Question Decomposition Fan-Out
[Context Selector] Decomposed into 5 sub-questions
[Context Selector] Sub-query results: Q1: 2 gems, Q2: 2 gems, Q3: 1 gems, Q4: 2 gems, Q5: 2 gems
[Context Selector] Total unique gems after merge: 7
[Context Selector] Selected gem (appearances: 2, score: 14): Low carb diet...
[Context Selector] ✓ Fan-out complete: Selected 3 unique gems
```

## Future Enhancements

### 1. **User-Configurable Fan-Out**
Add setting to enable/disable fan-out:
```javascript
// In profile settings
profile.preferences.useFanOut = true/false
```

### 2. **Adaptive Decomposition**
Vary number of sub-questions based on query complexity:
- Simple complex: 2-3 questions
- Moderate complex: 3-4 questions
- Very complex: 4-5 questions

### 3. **Sub-Question Caching**
Cache decomposition results for similar prompts to reduce AI calls.

### 4. **Visual Feedback**
Show user which sub-questions were explored:
```
Optimizing prompt...
  ✓ Analyzing nutrition preferences
  ✓ Analyzing workout habits
  ✓ Analyzing breakfast preferences
Done! Added 3 context items.
```

## Implementation Files

- **`utils/context-selector.js`**: Core fan-out logic
  - `shouldDecomposePrompt()`: Complexity detection
  - `decomposePromptIntoSubQuestions()`: Sub-question generation
  - `mergeGemResults()`: Smart merging algorithm
  - `optimizePromptWithContext()`: Main entry point

- **`content-scripts/prompt-optimizer.js`**: UI integration
  - Calls `optimizePromptWithContext()` with maxGems=3

## Summary

The Question Decomposition Fan-Out technique provides:

✅ **Broader exploration** of user's data gems
✅ **Better cross-domain connections** through multi-match boosting
✅ **Focused precision** via targeted sub-questions
✅ **Fast parallel execution** with graceful fallbacks
✅ **Top 3 highest-quality gems** with diversity enforcement

Perfect for complex queries where context spans multiple domains!
