# Test Data - Semantic Classification Dataset

## Overview

This is a comprehensive test dataset of **100 data gems** demonstrating the **Category × Semantic Type** matrix classification system.

## File Location

`/Users/d.breuer/Desktop/Data Gems Beta/test-data-semantic.json`

## Structure

Each gem contains:

### Existing Fields
- `id` - Unique identifier
- `value` - Original text (human-readable)
- `collections` - Main category (e.g., ["Fashion"])
- `subCollections` - Subcategory (e.g., ["fashion_shopping"])
- `assurance`, `reliability`, `state` - HSP protocol fields
- `created_at`, `updated_at` - Timestamps

### NEW Semantic Fields
- `semanticType` - Functional classification (how AI uses it)
- `attribute` - Standardized attribute key
- `attributeValue` - Extracted value
- `attributeUnit` - Unit of measurement (optional)
- `attributeLabel` - Human-readable label

## Semantic Type Distribution

### constraint (15 gems)
Hard filters that eliminate options:
- Budget constraints (shoes <150€, dinner <50€, laptop <1500€)
- Dietary restrictions (lactose-free, max 600 kcal)
- Physical constraints (shoe size 42, max flight 3h)
- Location constraints (Hamburg)

### preference (40 gems)
Soft filters for ranking/scoring:
- Likes (favorite cuisine: Mediterranean, color: white)
- Dislikes (cilantro, silence, dress shoes)
- Favorites (restaurants, brands, music, movies)
- Style preferences (casual, cozy, authentic)

### activity (20 gems)
Behavioral patterns and routines:
- Frequency (runs 3x/week, cooks 3x/week, travels 2x/year)
- Routines (morning: water/coffee/workout, evening: read/TV)
- Habits (walks dog daily, works from home 3 days)

### characteristic (15 gems)
Inherent/stable attributes:
- Physical (height 175cm, weight 73kg, shoe size 42)
- Identity (lives in Hamburg, speaks German/English)
- Skills/profession (software developer)
- Possessions (iPhone 15 Pro, dog Max)

### goal (10 gems)
Future objectives:
- Fitness (run marathon, lose 5kg, more sports)
- Career (build startup, master AI/ML)
- Travel (visit Dubai, live in Japan/Australia)
- Lifestyle (update wardrobe, practice latte art)

## Category Coverage

23 categories across all domains:

| Category | Gems | Top Semantic Types |
|----------|------|-------------------|
| **Nutrition** | 15 | preference (8), constraint (4), goal (1) |
| **Fashion** | 10 | preference (5), constraint (2), characteristic (1) |
| **Fitness** | 5 | activity (3), goal (1), preference (1) |
| **Technology** | 8 | preference (4), characteristic (2), activity (2) |
| **Travel** | 11 | preference (5), goal (3), activity (2) |
| **Pets** | 4 | activity (1), constraint (1), preference (1) |
| **Habits** | 5 | activity (5) |
| **Health** | 2 | goal (1), characteristic (1) |
| **Music** | 5 | preference (5) |
| **Movies** | 3 | preference (2), activity (1) |
| **Books** | 3 | preference (2), activity (1) |
| **Family** | 3 | preference (2), characteristic (1) |
| **Goals** | 4 | goal (4) |
| Others | 22 | Mixed |

## Test Scenarios

### Scenario 1: Shopping Query (Sneakers)
**Query:** "Help me find casual sneakers under 150€"

**Expected relevant gems:**
```
✓ @budget <150€                    [Fashion × constraint] (score: 15)
✓ @color white                     [Fashion × preference] (score: 13)
✓ @style casual comfortable        [Fashion × preference] (score: 13)
✓ @brand Adidas Nike               [Fashion × preference] (score: 11)
✓ @size 42                         [Fashion × characteristic] (score: 11)
✓ @activity runs 3x/week           [Fitness × activity] (score: 8)

✗ favorite breakfast: eggs         [Nutrition × preference] (wrong domain)
✗ height 175cm                     [Identity × characteristic] (not useful)
```

**Why selected:**
- Stage 0: Semantic filter includes constraints + preferences + activities
- Stage 1: Category filter selects Fashion (10), Fitness (6)
- Stage 1.5: SubCategory filter selects fashion_shopping, fashion_style, fashion_brands
- Stage 2: Semantic boosting: constraints +5, preferences +3, activities +1

### Scenario 2: Restaurant Recommendation
**Query:** "Recommend a restaurant for my wife and me to dine out tonight"

**Expected relevant gems:**
```
✓ @budget <50€ per person          [Nutrition × constraint] (score: 15)
✓ @dietary lactose-free            [Nutrition × constraint] (score: 15)
✓ @cuisine Mediterranean           [Nutrition × preference] (score: 13)
✓ @restaurant Hob's Burger          [Nutrition × preference] (score: 13)
✓ @ambiance cozy authentic         [Nutrition × preference] (score: 13)
✓ @partner_preference Italian      [Family × preference] (score: 11)

✗ favorite color: white            [Fashion × preference] (wrong domain)
✗ runs 3x/week                     [Fitness × activity] (irrelevant)
```

**Why selected:**
- Stage 0: Prioritizes constraints for planning queries
- Stage 1: Category filter selects Nutrition (10), Family (7)
- Stage 1.5: SubCategory filter selects nutrition_eatingout (critical!)
- Stage 2: Constraints scored highest, partner preferences included

### Scenario 3: Dog Leash Shopping
**Query:** "I need a new leash for my dog"

**Expected relevant gems:**
```
✓ @budget <30€                     [Pets × constraint] (score: 15)
✓ @type retractable                [Pets × preference] (score: 13)
✓ @pet dog Max                     [Pets × characteristic] (score: 11)
✓ @walks 2x daily                  [Pets × activity] (score: 8)

✗ baseball cap                     [Fashion × preference] (wrong domain)
✗ runs 3x/week                     [Fitness × activity] (wrong domain)
```

**Why selected:**
- Stage 0: Shopping query → includes constraints + preferences
- Stage 1: Category filter selects ONLY Pets (no semantic expansion to Fitness!)
- Stage 1.5: SubCategory filter selects pets_shopping, pets_products, pets_care
- Stage 2: Constraints boosted highest

### Scenario 4: Workout Planning
**Query:** "Help me plan my morning workout routine"

**Expected relevant gems:**
```
✓ @time 6am                        [Fitness × activity] (score: 13)
✓ @activity runs 3x/week           [Fitness × activity] (score: 13)
✓ @goal run marathon               [Fitness × goal] (score: 12)
✓ @level intermediate              [Fitness × characteristic] (score: 11)
✓ @preference outdoor running      [Fitness × preference] (score: 11)
✓ @routine water coffee workout    [Habits × activity] (score: 8)

✗ favorite breakfast               [Nutrition × preference] (different context)
```

**Why selected:**
- Stage 0: Planning query → includes activities + goals + preferences
- Stage 1: Category filter selects Fitness (10), Habits (7), Goals (6)
- Stage 1.5: SubCategory filter selects fitness_cardio, fitness_routine, habits_morning
- Stage 2: Activities and goals boosted for planning queries

## How to Import

### Option 1: Import via UI
1. Open Data Gems extension
2. Go to Settings → Import/Export
3. Select `test-data-semantic.json`
4. Click Import

### Option 2: Manual Copy
```bash
# Copy to downloads for easy import
cp "/Users/d.breuer/Desktop/Data Gems Beta/test-data-semantic.json" ~/Downloads/
```

## Testing Checklist

### Phase 1: Verify Structure
- [ ] Import test data successfully
- [ ] Verify all 100 gems loaded
- [ ] Check semantic fields are present
- [ ] Verify SubCategory Registry populated

### Phase 2: Test Semantic Filtering
- [ ] Test constraint filtering (budget queries)
- [ ] Test preference ranking (style queries)
- [ ] Test activity context (routine queries)
- [ ] Test goal alignment (improvement queries)

### Phase 3: Test Category × Semantic Matrix
- [ ] Fashion shopping query (sneakers)
- [ ] Nutrition query (restaurant)
- [ ] Pets query (dog leash)
- [ ] Fitness planning query (workout)
- [ ] Travel planning query (vacation)

### Phase 4: Test Edge Cases
- [ ] Query with no constraints → should include preferences
- [ ] Query with constraints → should prioritize constraints
- [ ] Cross-domain query → should select multiple categories
- [ ] Simple query → should not over-select

## Expected Output Format

When context is selected, output should be:

```
"Help me find casual sneakers under 150€"

@budget 150€
@color white
@style casual comfortable
@brand Adidas, Nike
@size 42
@activity runs 3x/week
```

Clean, semantic, structured! 🎯

## Notes

- All gems have both semantic metadata AND original `value` field for backward compatibility
- Semantic types are based on **function** (how AI uses them), not content
- The matrix ensures gems are selected by BOTH domain relevance AND functional utility
- German and English mixed intentionally to test language-agnostic semantic processing
