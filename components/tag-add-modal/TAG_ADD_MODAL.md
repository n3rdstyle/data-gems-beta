# Tag Add Modal

A center modal for adding new tags/collections with autocomplete suggestions.

## Features

- ✅ Text input with autocomplete
- ✅ Shows existing tags as suggestions
- ✅ Filters already assigned tags
- ✅ Add button disabled when empty
- ✅ Enter key submits
- ✅ Supports comma-separated tags

## Usage

```javascript
const tagModal = createTagAddModal({
  title: 'Add Collection',
  label: 'Collection Name',
  placeholder: 'Enter collection name...',
  existingTags: ['Work', 'Personal', 'Health'],
  currentCollections: ['Work'],  // Already assigned

  onAdd: (tagNames) => {
    // tagNames can be comma-separated: "Health, Finance"
    console.log('Added:', tagNames);
  },

  onCancel: () => {
    console.log('Cancelled');
  }
});

tagModal.show();
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| `title` | string | Modal title (default: 'Add Collection') |
| `label` | string | Input label (default: 'Collection Name') |
| `placeholder` | string | Input placeholder |
| `existingTags` | Array<string> | All available tags for autocomplete |
| `currentCollections` | Array<string> | Tags already assigned (filtered from suggestions) |
| `onAdd` | function | Callback with tag names (comma-separated) |
| `onCancel` | function | Callback when cancelled |

## Structure

```
┌─────────────────────────┐
│ Add Collection     [X]  │
├─────────────────────────┤
│ Collection Name         │
│ ┌─────────────────────┐ │
│ │ Enter collection... │ │
│ └─────────────────────┘ │
│ Suggestions: Work, ...  │
├─────────────────────────┤
│          [Add] [Cancel] │
└─────────────────────────┘
```

## Behavior

- Input starts empty
- Autocomplete shows as user types
- Filters already assigned collections
- Add button enabled only when input has text
- Enter key triggers Add
- Supports multiple tags: "Work, Personal, Health"

## Dependencies

- `header.js`, `tag-add-field.js`, `button-primary.js`, `button-tertiary.js`, `overlay.js`

## Related

- **Collection Edit Field** - Uses this modal for adding collections
- **Modal Center** - Base center modal pattern
