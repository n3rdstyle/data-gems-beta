# Collection Edit Field

Tag list field with compact header and plus button. Displays collections as small removable tags.

## Features

- ✅ Compact header with title
- ✅ Plus button for adding collections
- ✅ Tag list with small tags
- ✅ Click tags to remove
- ✅ Dynamic tag management

## Basic Usage

```javascript
const collectionField = createCollectionEditField({
  title: 'Collections',
  collections: ['Work', 'Personal', 'Health'],

  onAddCollection: () => {
    // Show modal to add new collection
    showAddCollectionModal();
  },

  onTagClick: (tag) => {
    console.log('Tag clicked:', tag.getLabel());
    // Tag is automatically removed when clicked
  }
});

document.body.appendChild(collectionField.element);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Collections'` | Header title text |
| `collections` | Array<string> | `[]` | Initial collection names |
| `onAddCollection` | function | `null` | Callback when plus button clicked |
| `onTagClick` | function | `null` | Callback when tag is clicked |
| `onRemoveTag` | function | `null` | Callback when tag is removed |

## Structure

```
┌─────────────────────────────┐
│ Collections            [+]  │  Header with plus button
├─────────────────────────────┤
│ [Work] [Personal] [Health]  │  Tag list (small tags)
└─────────────────────────────┘
```

## API

```javascript
const field = createCollectionEditField({
  title: 'Collections',
  collections: ['Work', 'Personal']
});

// Get title
field.getTitle(); // Returns 'Collections'

// Set title
field.setTitle('My Collections');

// Get collections
field.getCollections(); // Returns ['Work', 'Personal']

// Add collection
const newTag = field.addCollection('Health');

// Remove collection
field.removeCollection(newTag); // Pass tag component

// Clear all
field.clearCollections();

// Set collections (replaces all)
field.setCollections(['Work', 'Personal', 'Fitness']);

// Access header component
field.getHeader();

// Access plus button
field.getPlusButton();

// Access tag list
field.getTagList();

// Access DOM element
field.element;
```

## Behavior

### Adding Collections
1. User clicks plus button
2. `onAddCollection` callback is triggered
3. Show modal/input to get collection name
4. Call `addCollection(name)` to add to list

### Removing Collections
1. User clicks a tag
2. Tag is automatically removed from list
3. `onTagClick` callback is triggered with tag component
4. Optional: Call `onRemoveTag` for additional cleanup

## Example: With Tag Add Modal

```javascript
const collectionField = createCollectionEditField({
  title: 'Collections',
  collections: ['Work'],

  onAddCollection: () => {
    // Show modal for adding new collection
    const modal = createTagAddModal({
      title: 'Add Collection',
      label: 'Collection Name',
      placeholder: 'Enter collection name...',
      existingTags: ['Work', 'Personal', 'Health', 'Fitness'],
      currentCollections: collectionField.getCollections(),

      onAdd: (tagNames) => {
        // Add comma-separated tags
        const tags = tagNames.split(',').map(t => t.trim());
        tags.forEach(tag => {
          if (tag && !collectionField.getCollections().includes(tag)) {
            collectionField.addCollection(tag);
          }
        });
        modal.hide();
      },

      onCancel: () => {
        modal.hide();
      }
    });

    modal.show();
  },

  onTagClick: (tag) => {
    console.log('Removed:', tag.getLabel());
    // Tag is already removed, just log it
  }
});
```

## Example: Data Editor Modal Usage

```javascript
// In Data Editor Modal
const collectionField = createCollectionEditField({
  title: 'Collections',
  collections: card.collections, // Existing collections

  onAddCollection: () => {
    showAddCollectionModal();
  }
});

// On save
const updatedCollections = collectionField.getCollections();
updateCard(cardId, { collections: updatedCollections });
```

## Tag Properties

All tags in the list have these properties:
- **Size**: `small` (compact tags)
- **State**: `active` (clickable/removable)
- **Type**: Collection tag

Tags are created using the `createTagList` component with these settings:

```javascript
{
  label: 'Work',
  size: 'small',
  state: 'active'
}
```

## Design Tokens

- Uses **Header (compact)** component for header
- Uses **Tag List** component for tags
- Gap: `--spacing-xs`
- Padding: `--spacing-md`

## Use Cases

- **Data Editor Modal** - Managing card collections
- **Preference Settings** - Organizing preferences by collection
- **Tag Management** - Any tag/label management interface
- **Category Assignment** - Assigning categories to items

## Accessibility

```html
<div class="collection-edit-field">
  <div class="header header--compact">
    <h3 class="header__title">Collections</h3>
    <button class="button-tertiary" aria-label="Add collection">
      <!-- plus icon -->
    </button>
  </div>
  <div class="tag-list">
    <button class="tag tag--small tag--active" aria-label="Remove Work">
      Work
    </button>
    <button class="tag tag--small tag--active" aria-label="Remove Personal">
      Personal
    </button>
  </div>
</div>
```

**Best Practices:**
- Provide `aria-label` for plus button
- Each tag should have `aria-label` indicating it's removable
- Consider adding confirmation for tag removal

## Best Practices

### Do ✅
- Show existing collections clearly
- Provide autocomplete/suggestions when adding
- Filter out already-assigned collections from suggestions
- Support keyboard navigation
- Limit number of collections per item

### Don't ❌
- Don't allow duplicate collections
- Don't forget to validate collection names
- Don't make tags too large (use small size)
- Don't remove tags without user confirmation for critical data

## Related

- **Tag Add Modal** - Used for adding new collections
- **Tag List** - Underlying component for displaying tags
- **Tag** - Individual tag component
- **Header (compact)** - Used for title and plus button
- **Data Editor Modal** - Uses this component
