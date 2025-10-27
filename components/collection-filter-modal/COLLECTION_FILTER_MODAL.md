# Collection Filter Modal Component

A bottom-sheet style modal for filtering preferences by collections (tags).

## Features

- **Bottom Sheet Design**: Slides up from bottom of screen (mobile UI pattern)
- **Collection Tags**: Display all available collections as filterable tags
- **Multi-Select**: Select multiple collections to filter by
- **Tag States**: Active/inactive visual states
- **Upward Shadow**: Custom shadow effect (`--shadow-bottom-sheet`)
- **Smooth Transitions**: Animated show/hide with backdrop overlay
- **Compact Design**: Optimized for 400px extension width

## UI Pattern

Follows the **Bottom Sheet** mobile UI pattern:
- Positioned at bottom of screen
- Rounded top corners only
- Shadow cast upward
- Overlay backdrop
- Slide-in/out animation

## Usage

### HTML Structure

```html
<!-- Include dependencies -->
<link rel="stylesheet" href="design-system/colors.css">
<link rel="stylesheet" href="design-system/spacing.css">
<link rel="stylesheet" href="design-system/border-radius.css">
<link rel="stylesheet" href="design-system/shadows.css">
<link rel="stylesheet" href="components/overlay/overlay.css">
<link rel="stylesheet" href="components/tag/tag.css">
<link rel="stylesheet" href="components/collection-filter-modal/collection-filter-modal.css">

<!-- Modal with overlay -->
<div class="overlay overlay--fixed" id="filter-overlay">
  <div class="collection-filter-modal">
    <div class="collection-filter-modal__header">
      <h2 class="collection-filter-modal__title">Filter by Collection</h2>
      <button class="collection-filter-modal__close">
        <!-- Close icon -->
      </button>
    </div>
    <div class="collection-filter-modal__tags">
      <!-- Collection tags will be inserted here -->
    </div>
    <div class="collection-filter-modal__actions">
      <button class="button-secondary">Clear All</button>
      <button class="button-primary">Apply Filters</button>
    </div>
  </div>
</div>

<!-- Include JS -->
<script src="components/overlay/overlay.js"></script>
<script src="components/tag/tag.js"></script>
<script src="components/collection-filter-modal/collection-filter-modal.js"></script>
```

### JavaScript

#### Show modal with collections

```javascript
// Create and show collection filter modal
const filterModal = createCollectionFilterModal({
  collections: [
    { id: 'work', name: 'Work', count: 12 },
    { id: 'personal', name: 'Personal', count: 8 },
    { id: 'shopping', name: 'Shopping', count: 5 }
  ],
  selectedCollections: ['work'], // Pre-selected
  onApply: (selected) => {
    console.log('Apply filters:', selected);
    filterDataByCollections(selected);
  },
  onClose: () => {
    console.log('Modal closed');
  }
});

filterModal.show();
```

#### Handle filter application

```javascript
const modal = createCollectionFilterModal({
  collections: getAllCollections(),
  onApply: (selectedIds) => {
    // Filter data list by selected collection IDs
    const filtered = dataCards.filter(card =>
      selectedIds.some(id => card.collections.includes(id))
    );

    // Update UI with filtered results
    updateDataList(filtered);

    // Close modal
    modal.hide();
  }
});
```

## API

### Factory Function: `createCollectionFilterModal(options)`

```javascript
createCollectionFilterModal({
  collections: [],                  // Required - Array of collection objects
  selectedCollections: [],          // Optional - Pre-selected collection IDs
  onApply: (selectedIds) => {},     // Required - Apply filter handler
  onClear: () => {},                // Optional - Clear all filters handler
  onClose: () => {}                 // Optional - Modal close handler
})
```

### Collection Object Structure

```javascript
{
  id: 'work',           // Unique identifier
  name: 'Work',         // Display name
  count: 12,            // Number of items in collection
  icon: 'folder'        // Optional - Icon name
}
```

### Returns

Returns a modal object with methods:

```javascript
{
  show: () => void,                      // Show the modal
  hide: () => void,                      // Hide the modal
  getSelected: () => string[],           // Get array of selected collection IDs
  setSelected: (ids) => void,            // Set selected collections
  updateCollections: (collections) => void // Update available collections
}
```

## Design Tokens Used

### Colors
- `--color-secondary-10` - Modal background
- `--color-neutral-30` - Border color
- `--color-neutral-80` - Text and headings
- `--color-primary-60` - Active tag backgrounds

### Spacing
- `--spacing-sm` (16px) - Modal padding
- `--spacing-md` (24px) - Gap between sections
- `--spacing-xs` (8px) - Gap between tags

### Border Radius
- `--radius-lg` (16px) - Top corners rounded

### Shadows
- `--shadow-bottom-sheet`: `0 -4px 24px rgba(0, 0, 0, 0.15)` - Upward shadow

## CSS Structure

```css
.collection-filter-modal {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-secondary-10);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0; /* Top corners only */
  box-shadow: var(--shadow-bottom-sheet);
  padding: var(--spacing-sm);
  gap: var(--spacing-md);
}
```

## Tag States

Tags within the modal use the tag component with states:

- **Inactive**: Gray background, dark text, shows count
- **Active**: Primary color background, light text, shows count
- **Hover**: Darker shade on both states

## Interaction Flow

1. User clicks "Filter" button
2. Modal slides up from bottom with overlay
3. All collections shown as toggleable tags
4. User taps tags to select/deselect
5. "Clear All" removes all selections
6. "Apply Filters" confirms and closes modal
7. Data list updates with filtered results

## States

- **Hidden**: `opacity: 0`, `pointer-events: none`, translated down
- **Visible**: `opacity: 1`, `pointer-events: auto`, slide-in animation
- **Tag Active**: Collection is selected for filtering
- **Tag Inactive**: Collection is not selected

## Accessibility

- Focus trap within modal when open
- Escape key closes modal without applying
- Click outside (overlay) closes modal without applying
- Clear visual distinction between selected/unselected tags
- Keyboard navigation between tags

## Integration Example

```javascript
// In data-list component
const filterButton = document.querySelector('.filter-button');

filterButton.addEventListener('click', () => {
  const modal = createCollectionFilterModal({
    collections: getCollectionsWithCounts(),
    selectedCollections: currentFilters,
    onApply: (selectedIds) => {
      // Update global filter state
      currentFilters = selectedIds;

      // Filter and re-render data list
      const filtered = filterByCollections(allData, selectedIds);
      renderDataList(filtered);

      // Update filter button state
      filterButton.classList.toggle('active', selectedIds.length > 0);
    },
    onClear: () => {
      // Reset filters
      currentFilters = [];
      renderDataList(allData);
    }
  });

  modal.show();
});
```

## Pairing with Tag List

This modal works in conjunction with the `tag-list` component:

```javascript
// Tag list shows active filters
const tagList = createTagList({
  tags: currentFilters.map(id => getCollectionById(id)),
  onRemove: (tagId) => {
    // Remove from active filters
    currentFilters = currentFilters.filter(id => id !== tagId);
    // Re-filter data
    updateFilteredData();
  }
});
```

## Notes

- This is an untracked component (new) - not yet in git
- Part of the mobile-style bottom sheet pattern family
- Works within 400px extension popup width
- Complements `search-modal` for comprehensive data filtering
- Tags use `data-variant="default"` (pill style) within modal
- Supports both single and multi-select patterns (currently multi-select)

## Future Enhancements

- Add "Select All" / "Deselect All" option
- Remember last selected filters in localStorage
- Show count of filtered results before applying
- Add search within collections for large lists
