# Tag List

Horizontal scrolling container for tag components. Supports default (scrolling) and card (wrapping) layouts.

## Features

- ✅ Horizontal scrolling (default)
- ✅ Card variant with wrapping
- ✅ Hidden scrollbar
- ✅ Touch scrolling support
- ✅ Dynamic tag management
- ✅ Single active tag support

## Basic Usage

```javascript
const tagList = createTagList({
  tags: [
    { type: 'filter', label: 'All', count: 42, state: 'active' },
    { type: 'filter', label: 'Favorites', count: 8, state: 'inactive' },
    { type: 'collection', label: 'Work', count: 15, state: 'inactive' },
    { type: 'collection', label: 'Personal', count: 12, state: 'inactive' }
  ],

  onTagClick: (tag) => {
    console.log('Clicked:', tag.getLabel());
    tagList.setActiveTag(tag); // Make only this tag active
  }
});

document.body.appendChild(tagList.element);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tags` | Array<TagConfig> | `[]` | Initial tags to display |
| `onTagClick` | function | `null` | Callback when tag is clicked |

## Tag Config

```javascript
{
  type: 'filter',        // 'filter' or 'collection'
  label: 'All',          // Tag label text
  count: 42,             // Number badge (0 = hidden)
  state: 'active',       // 'active', 'inactive', 'disabled'
  size: 'default',       // 'default' or 'small'
  variant: 'default'     // 'default' or 'card'
}
```

## Variants

### Default (Scrolling)

```javascript
const scrollingList = createTagList({
  tags: [...]
});
```

- **Layout**: Single horizontal row
- **Overflow**: Horizontal scroll
- **Scrollbar**: Hidden
- **Wrap**: No wrapping

### Card (Wrapping)

```javascript
const cardList = createTagList({
  tags: tags.map(tag => ({
    ...tag,
    variant: 'card' // Card variant enables wrapping
  }))
});
```

- **Layout**: Multi-row grid
- **Overflow**: Visible (wraps to new rows)
- **Wrap**: Enabled
- **Use case**: Filter chips, collection badges

## Structure

**Default (Scrolling):**
```
┌─────────────────────────────┐
│ [All] [Favorites] [Work]... │  → Scrollable
└─────────────────────────────┘
```

**Card (Wrapping):**
```
┌─────────────────────────────┐
│ [All] [Favorites] [Work]    │
│ [Personal] [Health]         │  Wraps to rows
└─────────────────────────────┘
```

## API

```javascript
const tagList = createTagList({ tags: [...] });

// Add tags
const newTag = tagList.addTag({
  type: 'collection',
  label: 'Fitness',
  count: 5
});

// Add at specific index
tagList.addTagAtIndex({
  label: 'Health',
  count: 8
}, 2); // Insert at index 2

// Remove tag
tagList.removeTag(tag); // Pass tag instance

// Get all tags
const allTags = tagList.getTags(); // Returns array of tag instances

// Clear all tags
tagList.clear();

// Set active tag (deactivates others)
tagList.setActiveTag(tag);

// Get active tag
const activeTag = tagList.getActiveTag(); // Returns tag instance or undefined

// Access DOM element
tagList.element;
```

## Tag Management

### Adding Tags

```javascript
// Add to end
const tag = tagList.addTag({
  type: 'collection',
  label: 'New Collection',
  count: 0,
  state: 'inactive'
});

// Add at specific position
tagList.addTagAtIndex({
  label: 'Priority',
  count: 10
}, 0); // Insert at beginning
```

### Removing Tags

```javascript
const tag = tagList.getTags()[2]; // Get third tag
tagList.removeTag(tag);
```

### Updating Tags

```javascript
const tags = tagList.getTags();

// Update first tag
tags[0].setLabel('All Preferences');
tags[0].setCount(50);
tags[0].setState('active');
```

## Single Active Tag Pattern

Common pattern for exclusive selection:

```javascript
const tagList = createTagList({
  tags: [...],

  onTagClick: (clickedTag) => {
    // Make only clicked tag active
    tagList.setActiveTag(clickedTag);

    // Perform action based on tag
    filterBy(clickedTag.getLabel());
  }
});
```

## Example: Filter Tags

```javascript
const filterTags = createTagList({
  tags: [
    { type: 'filter', label: 'All', count: 42, state: 'active', size: 'small' },
    { type: 'filter', label: 'Favorites', count: 8, state: 'inactive', size: 'small' },
    { type: 'filter', label: 'Hidden', count: 3, state: 'inactive', size: 'small' }
  ],

  onTagClick: (tag) => {
    const label = tag.getLabel().toLowerCase();

    // Exclusive selection
    tagList.setActiveTag(tag);

    // Filter content
    if (label === 'all') {
      showAll();
    } else if (label === 'favorites') {
      showFavorited();
    } else if (label === 'hidden') {
      showHidden();
    }
  }
});
```

## Example: Collection Tags

```javascript
const collectionTags = createTagList({
  tags: collections.map(col => ({
    type: 'collection',
    label: col.name,
    count: col.items.length,
    state: 'inactive',
    variant: 'card' // Wrapping layout
  })),

  onTagClick: (tag) => {
    // Toggle tag state
    if (tag.getState() === 'active') {
      tag.setState('inactive');
    } else {
      tag.setState('active');
    }

    // Filter by all active collections
    const activeTags = tagList.getTags().filter(t => t.getState() === 'active');
    const activeCollections = activeTags.map(t => t.getLabel());
    filterByCollections(activeCollections);
  }
});
```

## Example: Dynamic Tag List

```javascript
const tagList = createTagList({ tags: [] });

// Fetch tags from API
fetch('/api/collections')
  .then(res => res.json())
  .then(collections => {
    collections.forEach(col => {
      tagList.addTag({
        type: 'collection',
        label: col.name,
        count: col.count,
        state: 'inactive'
      });
    });
  });
```

## Scrolling Behavior

### Hidden Scrollbar
- Scrollbar is hidden but scrolling works
- Supports mouse wheel scrolling
- Supports touch scrolling on mobile
- Smooth scrolling on iOS (`-webkit-overflow-scrolling: touch`)

### Overflow
- **X-axis**: Auto scroll (default variant)
- **Y-axis**: Hidden
- **Card variant**: No scroll, wraps instead

## Design Tokens

- Gap: `--spacing-xs` (8px)
- Uses **Tag** component for individual tags

## Use Cases

- **Filter Bars** - All, Favorites, Hidden filters
- **Collection Lists** - User-created collections
- **Category Navigation** - Browse by category
- **Search Filters** - Active search filters
- **Tag Clouds** - Popular tags

## Accessibility

```html
<div class="tag-list" role="list" aria-label="Filter tags">
  <button class="tag" role="listitem" aria-pressed="true">
    All <span class="tag__count">42</span>
  </button>
  <button class="tag" role="listitem" aria-pressed="false">
    Favorites <span class="tag__count">8</span>
  </button>
</div>
```

**Best Practices:**
- Use `role="list"` on container
- Use `role="listitem"` on tags
- Use `aria-pressed` for toggle state
- Provide `aria-label` for context
- Ensure keyboard navigation between tags

## Best Practices

### Do ✅
- Use card variant for wrapping layout
- Hide scrollbar for cleaner look
- Support keyboard navigation
- Provide visual feedback on click
- Update counts dynamically

### Don't ❌
- Don't show scrollbar (use hidden)
- Don't allow horizontal scroll in card variant
- Don't forget to handle empty state
- Don't make tags too small to click

## Performance

- Efficient DOM manipulation (only affected tags updated)
- Minimal re-renders
- Smooth scrolling performance
- Handles large tag lists (100+)

## Related

- **Tag** - Individual tag component
- **Data Search** - Uses tag list for filters
- **Collection Edit Field** - Uses tag list for collections
