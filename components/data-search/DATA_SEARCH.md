# Data Search

Composite search component combining search field, expand/collapse button, and tag list for filtering.

## Features

- ✅ Search input field
- ✅ Expand/collapse button (chevron)
- ✅ Tag list for collection filtering
- ✅ Collapsible tag section
- ✅ Real-time search
- ✅ Tag state management (favorites/hidden filtering)

## Basic Usage

```javascript
const dataSearch = createDataSearch({
  placeholder: 'Search your preferences',
  tags: [
    { type: 'filter', label: 'All', count: 42, state: 'active' },
    { type: 'filter', label: 'Favorites', count: 8, state: 'inactive' },
    { type: 'filter', label: 'Hidden', count: 3, state: 'inactive' },
    { type: 'collection', label: 'Work', count: 15, state: 'inactive' },
    { type: 'collection', label: 'Personal', count: 12, state: 'inactive' }
  ],
  expandedByDefault: true,

  onSearch: (query) => {
    console.log('Search:', query);
    filterPreferences(query);
  },

  onTagClick: (tag) => {
    console.log('Tag clicked:', tag.getLabel());
    filterByTag(tag);
  }
});

document.body.appendChild(dataSearch.element);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `placeholder` | string | `'Search your preferences'` | Search placeholder text |
| `tags` | Array<TagObject> | `[]` | Tags for filtering |
| `onSearch` | function | `null` | Callback when search input changes |
| `onTagClick` | function | `null` | Callback when tag is clicked |
| `expandedByDefault` | boolean | `true` | Initial expand/collapse state |

## Tag Object

```javascript
{
  type: 'filter',        // 'filter' or 'collection'
  label: 'All',          // Tag label
  count: 42,             // Number of items
  state: 'active'        // 'active', 'inactive', 'disabled'
}
```

## Structure

**Expanded:**
```
┌─────────────────────────────┐
│ [🔍] Search preferences  [▲]│  Top row
├─────────────────────────────┤
│ [All 42] [Favorites 8] ...  │  Tag list (collapsible)
└─────────────────────────────┘
```

**Collapsed:**
```
┌─────────────────────────────┐
│ [🔍] Search preferences  [▼]│  Top row only
└─────────────────────────────┘
```

## API

```javascript
const dataSearch = createDataSearch({
  tags: [...],
  onSearch: (query) => { ... }
});

// Search value
dataSearch.getSearchValue(); // Returns search query
dataSearch.setSearchValue('work'); // Set search value
dataSearch.clearSearch(); // Clear search field

// Tag list
dataSearch.getTagList(); // Returns tag list component

// Expand/collapse
dataSearch.expand(); // Show tag list
dataSearch.collapse(); // Hide tag list
dataSearch.isExpanded(); // Returns true/false

// Access DOM element
dataSearch.element;
```

## Behavior

### Search
- Real-time filtering as user types
- Triggers `onSearch` on every keystroke
- Escape key clears search

### Expand/Collapse
- Chevron button toggles tag list visibility
- **Expanded** - Chevron up (▲), tag list visible
- **Collapsed** - Chevron down (▼), tag list hidden
- State persists during session

### Tag Filtering
- Tags use card variant (with count badges)
- Click tag to filter
- Only one tag active at a time (typically)
- Active tag highlighted

## Layout

**Top Row:**
- Search field (flex: 1, takes remaining space)
- Expand button (fixed width, 40px)
- Gap: `--spacing-xs`

**Bottom Row:**
- Tag list wrapper (flex: 1, scrollable)
- Gap: `--spacing-xs`

**Main Container:**
- Vertical flex layout
- Gap: `12px` (custom, optimal balance)

## Tag State Management

This component is commonly used with Favorites and Hidden filtering:

```javascript
// Initial tags
const tags = [
  { type: 'filter', label: 'All', count: 42, state: 'active' },
  { type: 'filter', label: 'Favorites', count: 8, state: 'inactive' },
  { type: 'filter', label: 'Hidden', count: 3, state: 'inactive' }
];

// When tag is clicked
onTagClick: (tag) => {
  const label = tag.getLabel().toLowerCase();

  if (label === 'favorites') {
    showOnlyFavorited();
  } else if (label === 'hidden') {
    showOnlyHidden();
  } else if (label === 'all') {
    showAll();
  }

  // Update tag states
  updateTagStates(tag);
}
```

## Example: Home Screen Usage

```javascript
// In home screen
const dataSearch = createDataSearch({
  placeholder: 'Search your preferences',
  tags: [
    { type: 'filter', label: 'All', count: preferences.length, state: 'active' },
    { type: 'filter', label: 'Favorites', count: favoritedCount, state: 'inactive' },
    { type: 'filter', label: 'Hidden', count: hiddenCount, state: 'inactive' },
    ...collections.map(col => ({
      type: 'collection',
      label: col.name,
      count: col.count,
      state: 'inactive'
    }))
  ],

  onSearch: (query) => {
    filterPreferencesByQuery(query);
  },

  onTagClick: (tag) => {
    const label = tag.getLabel();

    // Deactivate all tags
    const allTags = dataSearch.getTagList().getTags();
    allTags.forEach(t => t.setState('inactive'));

    // Activate clicked tag
    tag.setState('active');

    // Filter preferences
    filterPreferencesByTag(label);
  }
});
```

## Example: Search + Tag Filtering Combined

```javascript
let currentTag = 'All';
let currentQuery = '';

const dataSearch = createDataSearch({
  tags: [...],

  onSearch: (query) => {
    currentQuery = query;
    applyFilters(currentQuery, currentTag);
  },

  onTagClick: (tag) => {
    currentTag = tag.getLabel();
    applyFilters(currentQuery, currentTag);
  }
});

function applyFilters(query, tag) {
  let filtered = preferences;

  // Apply tag filter
  if (tag === 'Favorites') {
    filtered = filtered.filter(p => p.favorited);
  } else if (tag === 'Hidden') {
    filtered = filtered.filter(p => p.hidden);
  }

  // Apply search query
  if (query) {
    filtered = filtered.filter(p =>
      p.text.toLowerCase().includes(query.toLowerCase())
    );
  }

  displayPreferences(filtered);
}
```

## Design Tokens

- Gap (main): `12px` (custom, optimal visual balance)
- Gap (rows): `--spacing-xs`
- Uses **Search** component for search field
- Uses **Button Tertiary** for expand button
- Uses **Tag List (card variant)** for tags

## Use Cases

- **Home Screen** - Main search and filter bar
- **Preference Browser** - Filtering preferences by collection
- **Data Management** - Search + category filtering
- **Any List View** - Search + tag-based filtering

## Accessibility

```html
<div class="data-search">
  <div class="data-search__top-row">
    <div class="data-search__search-wrapper">
      <!-- search component -->
    </div>
    <button class="button-tertiary" aria-label="Toggle collections" aria-expanded="true">
      <!-- chevron icon -->
    </button>
  </div>
  <div class="data-search__bottom-row" aria-live="polite">
    <div class="data-search__tag-list-wrapper">
      <!-- tag list -->
    </div>
  </div>
</div>
```

**Best Practices:**
- Use `aria-expanded` on expand button
- Mark tag list as `aria-live="polite"` for dynamic updates
- Ensure tags are keyboard accessible
- Announce filter results to screen readers

## Best Practices

### Do ✅
- Update tag counts dynamically
- Combine search with tag filtering
- Show active tag clearly
- Persist expand/collapse state
- Provide visual feedback on filter

### Don't ❌
- Don't allow multiple active filter tags
- Don't forget to update counts on data changes
- Don't hide expand button if no tags
- Don't make tag list too long (limit visible items)

## Related

- **Search** - Base search component
- **Tag List (card variant)** - Tag filtering
- **Button Tertiary** - Expand/collapse button
- **Home Screen** - Uses this component
