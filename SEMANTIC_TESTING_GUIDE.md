# Semantic Classification - Testing Guide

## 📦 Test Dataset Created

**File:** `/Users/d.breuer/Desktop/Data Gems Beta/test-data-semantic-100.json`

**Contents:**
- 100 fully structured gems
- 12 categories
- 5 semantic types
- Ready to import

---

## 📊 Dataset Statistics

### Semantic Type Distribution
| Type | Count | Purpose |
|------|-------|---------|
| **preference** | 38 | Soft ranking (favorites, likes, dislikes) |
| **activity** | 20 | Behavioral patterns (frequency, routines) |
| **goal** | 18 | Future objectives |
| **characteristic** | 14 | Stable attributes (height, location, skills) |
| **constraint** | 10 | Hard filters (budget, dietary, size) |

### Category Distribution
| Category | Count | Key Semantic Types |
|----------|-------|-------------------|
| **Nutrition** | 20 | preference (9), constraint (4), goal (3), activity (4) |
| **Fashion** | 15 | preference (9), constraint (1), characteristic (2), activity (1), goal (1) |
| **Fitness** | 12 | activity (5), goal (3), preference (2), characteristic (1), constraint (1) |
| **Travel** | 12 | preference (6), goal (3), constraint (2), activity (1) |
| **Technology** | 10 | preference (5), activity (2), characteristic (2), goal (1) |
| **Work** | 5 | characteristic (3), activity (1), preference (1) |
| **Pets** | 5 | constraint (2), activity (1), preference (1), characteristic (1) |
| **Habits** | 5 | activity (5) |
| **Health** | 5 | goal (3), characteristic (1) |
| **Goals** | 6 | goal (6) |
| **Identity** | 4 | characteristic (4) |
| **Personality** | 1 | characteristic (1) |

---

## 🚀 How to Import

### Step 1: Open Extension
1. Click Data Gems extension icon
2. Navigate to Settings
3. Click "Import/Export"

### Step 2: Import File
1. Click "Import Data"
2. Select: `/Users/d.breuer/Desktop/Data Gems Beta/test-data-semantic-100.json`
3. Click "Open"
4. Confirm import

### Step 3: Verify
You should see:
- ✓ 100 new preferences imported
- ✓ 12 categories
- ✓ Semantic fields visible in data viewer

---

## 🧪 Test Scenarios

### Scenario 1: Shopping Query (Sneakers) 👟

**Query:** `"Help me find casual sneakers under 150€"`

**Expected Semantic Selection:**
```
Stage 0: Semantic Filter
- Include: constraints, preferences, activities
- Exclude: goals, characteristics (not critical for shopping)
- Result: ~60 gems

Stage 1: Category Filter
- Fashion (primary)
- Fitness (related - running context)
- Result: ~27 gems

Stage 1.5: SubCategory Filter
- fashion_shopping (constraints)
- fashion_style (preferences)
- fashion_brands (preferences)
- fitness_cardio (activity context)
- Result: ~8 gems

Stage 2: Scoring with Semantic Boost
- Budget 150€ [constraint] → 10 + 5 = 15 ✓
- Color white [preference] → 10 + 3 = 13 ✓
- Style casual [preference] → 10 + 3 = 13 ✓
- Brands Adidas Nike [preference] → 9 + 3 = 12 ✓
- Size 42 [characteristic] → 8 + 1 = 9 ✓
```

**Expected Output:**
```
"Help me find casual sneakers under 150€"

@budget 150€
@color white
@style casual comfortable
@brand Adidas Nike
@size 42
```

**Why these 5?**
- Budget: CRITICAL constraint (must have)
- Color/Style: High-value preferences (nice-to-have)
- Brands: Moderate preference (context)
- Size: Characteristic (necessary fit info)

---

### Scenario 2: Restaurant Recommendation 🍽️

**Query:** `"Recommend a restaurant for my wife and me to dine out tonight"`

**Expected Semantic Selection:**
```
Stage 0: Semantic Filter
- Include: constraints, preferences (planning query)
- Prioritize: constraints (budget, dietary)
- Result: ~48 gems

Stage 1: Category Filter
- Nutrition (primary)
- Family (partner preferences)
- Result: ~24 gems

Stage 1.5: SubCategory Filter
- nutrition_eatingout (critical!)
- nutrition_diet (dietary constraints)
- family_partner (partner context)
- Result: ~10 gems

Stage 2: Scoring with Semantic Boost
- Budget 50€ [constraint] → 10 + 5 = 15 ✓
- Dietary lactose-free [constraint] → 10 + 5 = 15 ✓
- Cuisine Mediterranean [preference] → 10 + 3 = 13 ✓
- Ambiance cozy [preference] → 9 + 3 = 12 ✓
- Restaurant Hob's Burger [preference] → 9 + 3 = 12 ✓
```

**Expected Output:**
```
"Recommend a restaurant for my wife and me to dine out tonight"

@budget <50€ per person
@dietary lactose-free
@cuisine Mediterranean
@ambiance cozy authentic
@favorite Hob's Burger
```

**Why these 5?**
- Budget/Dietary: HARD constraints (eliminate options)
- Cuisine/Ambiance: Strong preferences (rank options)
- Favorite restaurant: Local knowledge (context)

---

### Scenario 3: Dog Leash Shopping 🐕

**Query:** `"I need a new leash for my dog"`

**Expected Semantic Selection:**
```
Stage 0: Semantic Filter
- Include: constraints, preferences, characteristics
- Shopping query → prioritize constraints
- Result: ~58 gems

Stage 1: Category Filter
- Pets (ONLY - no Fitness/Fashion semantic expansion!)
- Result: 5 gems

Stage 1.5: SubCategory Filter
- pets_shopping (constraints)
- pets_products (preferences)
- pets_care (activity context)
- Result: 4 gems

Stage 2: Scoring with Semantic Boost
- Budget 30€ [constraint] → 10 + 5 = 15 ✓
- Type retractable [preference] → 10 + 3 = 13 ✓
- Has dog Max [characteristic] → 8 + 1 = 9 ✓
- Walks 2x daily [activity] → 7 + 1 = 8 ✓
```

**Expected Output:**
```
"I need a new leash for my dog"

@budget <30€
@type retractable
@pet dog Max (Golden Retriever)
@walks 2x daily
```

**Critical Test:** Should NOT include:
- ❌ Baseball cap (Fashion)
- ❌ Runs 3x/week (Fitness)
- ❌ Morning workout (Habits)

**Why?** Semantic expansion is disabled for sub-queries!

---

### Scenario 4: Workout Planning 💪

**Query:** `"Help me plan my morning workout routine"`

**Expected Semantic Selection:**
```
Stage 0: Semantic Filter
- Include: activities, goals, preferences
- Planning query → boost activities & goals
- Result: ~56 gems

Stage 1: Category Filter
- Fitness (primary)
- Habits (morning routines)
- Goals (workout goals)
- Result: ~23 gems

Stage 1.5: SubCategory Filter
- fitness_cardio (workout type)
- fitness_routine (schedule)
- fitness_goals (objectives)
- habits_morning (context)
- Result: ~11 gems

Stage 2: Scoring with Semantic Boost
- Workout time 6am [activity] → 10 + 2 = 12 ✓
- Runs 3x/week [activity] → 10 + 2 = 12 ✓
- Goal marathon [goal] → 9 + 2 = 11 ✓
- Preferred outdoor running [preference] → 8 + 3 = 11 ✓
- Morning routine [activity] → 7 + 2 = 9 ✓
```

**Expected Output:**
```
"Help me plan my morning workout routine"

@time 6am
@activity runs 3x/week
@goal run marathon
@preference outdoor running
@routine water coffee workout
```

**Why these 5?**
- Time: Scheduling constraint
- Activity: Current pattern (frequency)
- Goal: Future objective (marathon)
- Preference: Workout type (outdoor)
- Routine: Morning context

---

### Scenario 5: Tech Purchase 💻

**Query:** `"I need a new laptop for work and coding"`

**Expected Semantic Selection:**
```
Stage 0: Semantic Filter
- Include: constraints, preferences, characteristics
- Shopping query → prioritize constraints
- Result: ~58 gems

Stage 1: Category Filter
- Technology (primary)
- Work (context)
- Result: ~15 gems

Stage 1.5: SubCategory Filter
- technology_shopping (budget)
- technology_brands (preferences)
- technology_devices (current setup)
- work_profession (requirements)
- Result: ~7 gems

Stage 2: Scoring with Semantic Boost
- Budget 1500€ [constraint] → 10 + 5 = 15 ✓
- Preferred Apple [preference] → 10 + 3 = 13 ✓
- Uses iPhone 15 [characteristic] → 8 + 1 = 9 ✓
- Profession developer [characteristic] → 8 + 1 = 9 ✓
- Preferred OS iOS [preference] → 7 + 3 = 10 ✓
```

**Expected Output:**
```
"I need a new laptop for work and coding"

@budget <1500€
@brand Apple
@device iPhone 15 Pro (ecosystem)
@profession software developer
@os iOS
```

---

## ✅ Testing Checklist

### Phase 1: Data Import
- [ ] Import test-data-semantic-100.json
- [ ] Verify 100 gems loaded
- [ ] Check semantic fields visible in UI
- [ ] Confirm 12 categories present

### Phase 2: Semantic Field Validation
- [ ] Open Data Gems viewer
- [ ] Select a gem with `semanticType: constraint`
- [ ] Verify fields shown: attribute, attributeValue, attributeUnit
- [ ] Check different semantic types display correctly

### Phase 3: Context Selection Tests
Run each test scenario and verify:

**Test 1: Sneakers**
- [ ] Query returns Fashion + Fitness gems
- [ ] Budget constraint is first/highest priority
- [ ] Color and style preferences included
- [ ] Running activity provides context
- [ ] NO food/travel gems selected

**Test 2: Restaurant**
- [ ] Query returns Nutrition gems
- [ ] Budget and dietary constraints prioritized
- [ ] Cuisine and ambiance preferences included
- [ ] SubCategory `nutrition_eatingout` selected (not just `nutrition_preferences`)
- [ ] Partner preferences considered

**Test 3: Dog Leash**
- [ ] Query returns ONLY Pets gems
- [ ] NO Fashion gems (baseball cap)
- [ ] NO Fitness gems (running)
- [ ] Budget constraint prioritized
- [ ] Leash type preference included

**Test 4: Workout**
- [ ] Query returns Fitness + Habits gems
- [ ] Activities and goals prioritized (not just preferences)
- [ ] Morning context included
- [ ] NO food/fashion gems

**Test 5: Laptop**
- [ ] Query returns Technology + Work gems
- [ ] Budget constraint first
- [ ] Brand preferences included
- [ ] Profession context relevant
- [ ] Ecosystem compatibility considered

### Phase 4: Edge Cases
- [ ] Query with no semantic matches → fallback gracefully
- [ ] Query matching multiple domains → smart cross-domain selection
- [ ] Simple query ("pizza") → doesn't over-select
- [ ] Complex query (multi-domain) → selects from multiple categories

### Phase 5: Output Format
- [ ] Context displayed in clean `@type value` format
- [ ] Constraints shown first
- [ ] Preferences shown second
- [ ] Activities/characteristics shown last
- [ ] No duplicate information

---

## 🐛 Common Issues & Solutions

### Issue 1: Import fails with "Cannot read properties"
**Cause:** Wrong data structure
**Solution:** Use `test-data-semantic-100.json` (correct structure)

### Issue 2: Semantic fields not showing
**Cause:** UI not updated to display new fields
**Solution:** Semantic fields are in data, but UI may not show them yet

### Issue 3: All gems selected (not filtering)
**Cause:** Semantic filtering not implemented in context-selector.js
**Solution:** Semantic metadata exists, but filtering logic needs implementation

### Issue 4: Wrong category selected
**Cause:** Category selection AI needs better prompting
**Solution:** Already fixed with category validation (commit e534628)

### Issue 5: SubCategory selection misses relevant gems
**Cause:** SubCategory selection missing original query context
**Solution:** Already fixed with original query context (commit 40ef461)

---

## 📈 Success Metrics

**Good Result:**
- ✅ 80%+ relevant gems in top 5
- ✅ Constraints prioritized for shopping queries
- ✅ Cross-domain gems when appropriate
- ✅ Clean, semantic output format

**Needs Improvement:**
- ⚠️ <60% relevant gems
- ⚠️ Constraints not prioritized
- ⚠️ Missing obvious context
- ⚠️ False positive cross-domain selection

---

## 🎯 Next Steps

After testing with this dataset:

1. **Validate Structure** ✓
   - Import works
   - All fields present
   - Categories correct

2. **Implement Semantic Filtering** (TODO)
   - Add Stage 0 semantic pre-filter
   - Add semantic type boosting in Stage 2
   - Update output formatter

3. **Test & Refine**
   - Run all 5 test scenarios
   - Measure accuracy
   - Tune boosting values

4. **Migration Tool** (Future)
   - Create UI to add semantic metadata to existing gems
   - Batch AI enrichment
   - Manual review and correction

---

## 📝 Notes

- Dataset is in **English** for easier testing
- All semantic fields are **optional** (backward compatible)
- Original `value` field always preserved
- Semantic types based on **function**, not content
- Matrix ensures **domain + function** filtering

Ready to test! 🚀
