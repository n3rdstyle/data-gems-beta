# Tag Add Field

Input field with label and optional tag list for autocomplete. Used for adding collections with clickable suggestions.

## Features

- ✅ Text input with label
- ✅ Optional tag list for autocomplete
- ✅ Click tags to add to input
- ✅ Comma-separated tag support
- ✅ Filters system and assigned tags
- ✅ Enter key submission

## Basic Usage

```javascript
const tagField = createTagAddField({
  title: 'Collection Name',
  placeholder: 'Enter collection name...',
  existingTags: ['Work', 'Personal', 'Health', 'Fitness'],
  currentCollections: ['Work'], // Already assigned

  onInput: (value) => {
    console.log('Input changed:', value);
  },

  onEnter: (value) => {
    console.log('Enter pressed with:', value);
    // Add tag logic here
  }
});

document.body.appendChild(tagField.element);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Collection Name'` | Label text |
| `placeholder` | string | `'Enter collection name...'` | Input placeholder |
| `existingTags` | Array<string> | `[]` | All available tags for autocomplete |
| `currentCollections` | Array<string> | `[]` | Tags already assigned (filtered out) |
| `onInput` | function | `null` | Callback when input changes |
| `onEnter` | function | `null` | Callback when Enter is pressed |

## Structure

```
┌─────────────────────────────┐
│ Collection Name             │  Label
│ ┌─────────────────────────┐ │
│ │ Enter collection name...│ │  Input
│ └─────────────────────────┘ │
│ [Personal] [Health] [Fitness]│  Tag suggestions (small)
└─────────────────────────────┘
```

## API

```javascript
const field = createTagAddField({
  title: 'Collection Name',
  existingTags: ['Work', 'Personal']
});

// Get value
field.getValue(); // Returns trimmed input value

// Set value
field.setValue('Work, Personal');

// Clear input and selections
field.clear();

// Focus input
field.focus();

// Get selected tags
field.getSelectedTags(); // Returns array of active tag labels

// Access DOM element
field.element;
```

## Behavior

### Tag Filtering
The component automatically filters out:
- System tags: 'All', 'Favorites', 'Hidden'
- Already assigned collections (from `currentCollections`)

### Tag Interaction
1. User clicks a tag in the suggestion list
2. Tag toggles between inactive (outline) and active (filled)
3. Active tags are added to input as comma-separated values
4. Input value updates automatically

### Input Behavior
- Manual typing is preserved
- Clicking tags appends to existing input
- Enter key triggers `onEnter` callback
- Comma-separated values supported

## Example: In Tag Add Modal

```javascript
const modal = createTagAddModal({
  title: 'Add Collection',
  label: 'Collection Name',
  placeholder: 'Enter collection name...',
  existingTags: ['Work', 'Personal', 'Health', 'Fitness', 'Travel'],
  currentCollections: ['Work'], // Already assigned to this card

  onAdd: (tagNames) => {
    // tagNames = "Personal, Health" (comma-separated)
    const tags = tagNames.split(',').map(t => t.trim());
    tags.forEach(tag => addCollection(tag));
  }
});

// Internally uses:
const tagField = createTagAddField({
  title: 'Collection Name',
  placeholder: 'Enter collection name...',
  existingTags: ['Personal', 'Health', 'Fitness', 'Travel'], // 'Work' filtered out
  currentCollections: ['Work']
});
```

## Example: Manual + Click Combination

```javascript
const field = createTagAddField({
  existingTags: ['Work', 'Personal', 'Health'],
  onEnter: (value) => {
    console.log('Value:', value);
    // User types "MyTag" manually, clicks "Health" → "MyTag, Health"
  }
});

// User flow:
// 1. Types "MyTag" in input
// 2. Clicks "Health" tag
// 3. Input shows: "MyTag, Health"
// 4. Presses Enter
// 5. onEnter receives: "MyTag, Health"
```

## Tag List Properties

Suggestion tags are displayed as:
- **Type**: `collection`
- **Size**: `small`
- **State**: `inactive` (initially)
- **Count**: `0` (not shown)

Clicking a tag toggles its state:
- `inactive` → `active` (adds to input)
- `active` → `inactive` (removes from input)

## Design Tokens

- Label text: `--color-neutral-100`
- Input background: `--color-neutral-0`
- Input border: `--color-primary-40` (default), `--color-primary-60` (focus)
- Input text: `--color-neutral-100`
- Placeholder: `--color-neutral-40`
- Border radius: `--radius-sm`
- Padding: `--spacing-sm`
- Gap: `12px` (custom, optimal for this component)
- Font size: `--font-size-16`
- Font weight: `--font-weight-regular`

## Use Cases

- **Tag Add Modal** - Adding collections to a preference card
- **Tag Management** - Any tag/label input with autocomplete
- **Category Selection** - Selecting from existing or creating new
- **Multi-select Input** - Comma-separated value input with suggestions

## Accessibility

```html
<div class="tag-add-field">
  <label class="tag-add-field__label text-style-h3">
    Collection Name
  </label>
  <input
    type="text"
    class="tag-add-field__input"
    placeholder="Enter collection name..."
    aria-label="Collection name input"
  />
  <div class="tag-add-field__tag-list" role="list" aria-label="Tag suggestions">
    <button class="tag tag--small" role="listitem" aria-pressed="false">
      Personal
    </button>
  </div>
</div>
```

**Best Practices:**
- Use semantic `<label>` element
- Provide `aria-label` for input
- Use `aria-pressed` for toggle tags
- Use `role="list"` for tag container

## Best Practices

### Do ✅
- Filter out already-assigned tags
- Support both manual input and tag selection
- Show relevant suggestions based on context
- Clear selections after submission
- Handle comma-separated values

### Don't ❌
- Don't show system tags in suggestions
- Don't allow duplicate tags
- Don't forget to trim whitespace
- Don't make tag list too long (limit to ~10-15)
- Don't clear input on every tag click

## Related

- **Tag Add Modal** - Uses this component
- **Tag List** - Displays tag suggestions
- **Input Field** - Base input component
- **Collection Edit Field** - Displays assigned collections
