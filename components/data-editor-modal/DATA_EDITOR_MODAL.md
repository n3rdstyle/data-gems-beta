# Data Editor Modal

A center modal for editing preference data including text content, collections, and state (favorited/hidden).

## Features

- ✅ Edit preference text
- ✅ Manage collections (add/remove tags)
- ✅ Toggle favorite/hidden state
- ✅ Delete preference
- ✅ Deferred save (changes only applied on Save)
- ✅ Save button disabled when text is empty
- ✅ Enter key triggers save

## Usage

### JavaScript

```javascript
const editorModal = createDataEditorModal({
  title: 'Edit Preference',
  preferenceTitle: 'Preference',
  preferenceText: 'My preference text',
  preferenceHidden: false,
  preferenceFavorited: true,
  collections: ['Work', 'Personal'],
  existingTags: ['Work', 'Personal', 'Health', 'Finance'],

  onSave: (data) => {
    console.log('Saved:', data);
    // data = { text, collections, hidden, favorited }
    editorModal.hide();
  },

  onDelete: () => {
    console.log('Deleted');
    // Handle deletion
  },

  onClose: () => {
    console.log('Closed');
  }
});

// Show modal
editorModal.show();

// Programmatic control
editorModal.setText('New text');
editorModal.addCollection('New Tag');
editorModal.hide();
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | 'Settings' | Modal header title |
| `preferenceTitle` | string | 'Preference' | Text field label |
| `preferenceText` | string | '' | Initial text content |
| `preferenceHidden` | boolean | false | Initial hidden state |
| `preferenceFavorited` | boolean | false | Initial favorited state |
| `collections` | Array<string> | [] | Initial collections/tags |
| `existingTags` | Array<string> | [] | All available tags for autocomplete |
| `onSave` | function | null | Callback when Save is clicked |
| `onDelete` | function | null | Callback when Delete is clicked |
| `onClose` | function | null | Callback when modal is closed |

## API Methods

### getText()
Returns the current text content.

```javascript
const text = editorModal.getText();
```

### setText(text)
Sets the text content programmatically.

```javascript
editorModal.setText('New preference text');
```

### getCollections()
Returns array of collection names.

```javascript
const collections = editorModal.getCollections();
// ['Work', 'Personal']
```

### setCollections(collections)
Sets collections programmatically.

```javascript
editorModal.setCollections(['Work', 'Health']);
```

### addCollection(label)
Adds a single collection.

```javascript
editorModal.addCollection('Finance');
```

### clearCollections()
Removes all collections.

```javascript
editorModal.clearCollections();
```

### show(container)
Shows the modal. Optionally append to specific container.

```javascript
editorModal.show();  // Appends to body
editorModal.show(document.getElementById('app'));  // Appends to specific element
```

### hide()
Hides the modal with fade-out animation.

```javascript
editorModal.hide();
```

### destroy()
Cleans up and removes the modal.

```javascript
editorModal.destroy();
```

## Structure

```
┌─────────────────────────────┐
│ Header (with delete button)│
├─────────────────────────────┤
│ Text Edit Field             │
│ - Editable textarea         │
│ - Favorite/Hidden icons     │
├─────────────────────────────┤
│ Collection Edit Field       │
│ - List of collection tags   │
│ - Add collection button     │
├─────────────────────────────┤
│ [Save] [Cancel]             │
└─────────────────────────────┘
```

## Behavior

### Deferred Save
Changes are **not applied immediately**:
- Text edits are buffered
- State changes (favorite/hidden) are buffered
- Collection changes are buffered
- Only when **Save** is clicked, all changes are applied via `onSave` callback

### Save Button State
- **Disabled** when text field is empty
- **Enabled** when text has content
- Click or **Enter key** triggers save

### Delete Flow
1. User clicks trash icon in header
2. `onDelete` callback is triggered
3. Modal auto-closes

### Close Flow
1. User clicks overlay or Cancel button
2. `onClose` callback is triggered (if provided)
3. Modal auto-closes
4. **Changes are discarded** (not saved)

## Dependencies

**Required Components:**
- `overlay.js` - Backdrop overlay
- `header.js` - Header with delete button
- `text-edit-field.js` - Text editor with state
- `collection-edit-field.js` - Collection manager
- `tag-add-modal.js` - For adding new collections
- `button-primary.js` - Save button
- `button-tertiary.js` - Cancel button

**CSS:**
- `data-editor-modal.css`
- All dependency CSS files

## Design Tokens

- `--color-secondary-10` (Background)
- `--color-neutral-30` (Border)
- `--spacing-sm` (16px padding)
- `--spacing-screen-internal` (24px gap between sections)
- `--spacing-element-internal` (8px button gap)
- `--radius-lg` (Border radius)

## Accessibility

```javascript
const editorModal = createDataEditorModal({
  title: 'Edit Preference',  // Provides modal title
  // ...
});
```

**Keyboard Support:**
- `Tab` - Navigate through fields
- `Enter` - Save (when text field focused and not empty)
- `Escape` - Close modal (via overlay)
- Arrow keys - Navigate in text field

**ARIA:**
- Modal has implicit `role="dialog"`
- Header provides `aria-labelledby`
- Text field has label
- Buttons have text labels

## Examples

### Basic Usage

```javascript
const editor = createDataEditorModal({
  title: 'Edit Preference',
  preferenceText: 'I prefer dark chocolate',
  collections: ['Food', 'Personal'],
  onSave: (data) => {
    // Update preference in database
    updatePreference(preferenceId, data);
    editor.hide();
  }
});

editor.show();
```

### With State Management

```javascript
const editor = createDataEditorModal({
  preferenceText: 'My preference',
  preferenceHidden: true,
  preferenceFavorited: false,
  onSave: (data) => {
    console.log('Hidden:', data.hidden);
    console.log('Favorited:', data.favorited);
    // State changes are included in save data
  }
});
```

### With Delete

```javascript
const editor = createDataEditorModal({
  preferenceText: 'To be deleted',
  onDelete: () => {
    if (confirm('Delete this preference?')) {
      deletePreference(preferenceId);
    }
  },
  onSave: (data) => {
    updatePreference(preferenceId, data);
  }
});
```

## Best Practices

### Do ✅
- Provide meaningful title
- Include all available tags in `existingTags` for autocomplete
- Handle `onSave` to persist data
- Handle `onDelete` if deletion is allowed
- Validate text is not empty (save button handles this)

### Don't ❌
- Don't forget to call `hide()` after successful save
- Don't modify state externally during editing (use deferred save pattern)
- Don't allow saving with empty text (automatically prevented)

## Related Components

- **Text Edit Field** - Editable text with state icons
- **Collection Edit Field** - Tag/collection manager
- **Tag Add Modal** - For adding new collections
- **Header (simple-delete variant)** - Header with delete action
- **Modal Center** - Base center modal pattern

## Changelog

### v1.0.0
- Initial implementation
- Deferred save pattern
- State management (favorite/hidden)
- Collection management
- Delete functionality
