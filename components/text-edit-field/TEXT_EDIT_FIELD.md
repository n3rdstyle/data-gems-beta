# Text Edit Field

Editable text field with compact header and dynamic state icons (favorite/hidden). Features contenteditable text box with 3:2 aspect ratio.

## Features

- ✅ ContentEditable text box
- ✅ Compact header with state icons
- ✅ Dynamic icon switching (outline ↔ filled)
- ✅ Favorite and Hidden states
- ✅ 3:2 aspect ratio text box
- ✅ Placeholder support
- ✅ Enter key callback
- ✅ Optional plain header (no icons)

## Basic Usage

```javascript
const textField = createTextEditField({
  title: 'Preference',
  text: 'Initial text value',
  placeholder: 'Enter your preference...',
  favorited: false,
  hidden: false,
  onTextChange: (text) => {
    console.log('Text changed:', text);
  }
});

document.body.appendChild(textField.element);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Preference'` | Header title text |
| `text` | string | `''` | Initial text content |
| `placeholder` | string | `'Enter text...'` | Placeholder when empty |
| `hidden` | boolean | `false` | Initial hidden state |
| `favorited` | boolean | `false` | Initial favorited state |
| `onToggleHidden` | function | `null` | Callback when hidden state changes |
| `onToggleFavorite` | function | `null` | Callback when favorite state changes |
| `onTextChange` | function | `null` | Callback when text changes |
| `onEnter` | function | `null` | Callback when Enter key is pressed |
| `editable` | boolean | `true` | Whether text is editable |
| `headerVariant` | string | `'compact'` | 'compact' (with icons) or 'compact-plain' (without icons) |

## Icon States

The component dynamically switches between three icon states:

### Default State (Neither Favorited nor Hidden)
Shows both icons in outline style:
- 👁 Hidden icon (outline)
- ♡ Heart icon (outline)

### Favorited State
Shows only heart icon in filled style:
- ♥ Heart icon (filled)

### Hidden State
Shows only hidden icon in filled style:
- 👁 Hidden icon (filled)

**Interaction:**
- Click outline heart → Favorited (removes hidden if set)
- Click outline hidden → Hidden (removes favorite if set)
- Click filled heart → Back to default (both icons outline)
- Click filled hidden → Back to default (both icons outline)

## Structure

```
┌─────────────────────────────┐
│ Preference        [👁] [♡]  │  Header (default state)
├─────────────────────────────┤
│                             │
│  Enter your preference...   │  Text box (3:2 aspect ratio)
│                             │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Preference             [♥]  │  Header (favorited)
├─────────────────────────────┤
│  My favorite preference     │
│                             │
└─────────────────────────────┘
```

## API

```javascript
const textField = createTextEditField({
  title: 'Preference',
  text: 'Initial text'
});

// Get/set text
textField.getText(); // Returns current text
textField.setText('New text');

// Clear text
textField.clear();

// Get/set placeholder
textField.setPlaceholder('New placeholder...');

// Editable control
textField.setEditable(false); // Make read-only
textField.setEditable(true); // Make editable
textField.isEditable(); // Returns true/false

// Focus
textField.focus();

// State management
textField.getState(); // Returns { hidden: false, favorited: true }
textField.updateState(false, true); // updateState(hidden, favorited)

// Access header
textField.getHeader(); // Returns header component

// Access DOM element
textField.element;
```

## Behavior

### Text Editing
- Click in text box to edit
- ContentEditable allows formatting paste
- Enter key is prevented (triggers `onEnter` callback instead)
- Shift+Enter is also prevented
- Text changes trigger `onTextChange` callback

### State Icons
- Icons switch automatically based on state
- Only one state can be active at a time (favorited OR hidden)
- Clicking an active icon returns to default state
- Icons are hidden when `headerVariant: 'compact-plain'`

### Aspect Ratio
- Text box maintains 3:2 aspect ratio (width:height)
- Width determines height automatically
- Scrollable when content exceeds height

## Variants

### With Icons (Default)

```javascript
const fieldWithIcons = createTextEditField({
  title: 'Preference',
  headerVariant: 'compact', // Default
  text: 'My preference'
});
```

### Without Icons (Plain)

```javascript
const plainField = createTextEditField({
  title: 'Preference',
  headerVariant: 'compact-plain',
  text: 'My preference'
});
```

### Read-Only

```javascript
const readOnlyField = createTextEditField({
  title: 'Read Only',
  text: 'Cannot edit this',
  editable: false
});
```

## Design Tokens

- Background: `--color-neutral-10`
- Background (disabled): `--color-neutral-20`
- Border: `--color-neutral-30` (default), `--color-primary-70` (focus)
- Text: `--color-neutral-80`
- Placeholder: `--color-text-tertiary`
- Border radius: `--radius-lg`
- Padding: `--spacing-sm`
- Gap: `--spacing-xs`, `--spacing-md`

## Use Cases

- **Data Editor Modal** - Editing preference text
- **User Profiles** - Editable bio/description
- **Notes/Comments** - Quick editable text fields
- **Content Management** - Editable content blocks

## Example: Data Editor Modal Usage

```javascript
const dataEditor = createTextEditField({
  title: 'Preference',
  text: existingPreference.text,
  favorited: existingPreference.favorited,
  hidden: existingPreference.hidden,

  onTextChange: (text) => {
    // Track changes (not saved yet)
    pendingChanges.text = text;
  },

  onEnter: () => {
    // Could trigger save on Enter
    saveChanges();
  }
});

// State changes are deferred until user clicks Save
textField.getState(); // Returns current state
```

## Accessibility

```html
<div class="text-edit-field">
  <div class="header header--compact">
    <h3 class="header__title">Preference</h3>
    <button aria-label="Hide" class="button-tertiary">
      <!-- hidden icon -->
    </button>
    <button aria-label="Favorite" class="button-tertiary">
      <!-- heart icon -->
    </button>
  </div>
  <div
    class="text-edit-field__textbox text-style-body-medium"
    contenteditable="true"
    role="textbox"
    aria-label="Preference text"
    aria-multiline="false"
    data-placeholder="Enter text..."
  >
  </div>
</div>
```

**Best Practices:**
- Use `role="textbox"` for contenteditable
- Provide `aria-label` for context
- Use `aria-multiline="false"` since Enter is prevented
- Ensure header buttons have clear `aria-label` values

## Best Practices

### Do ✅
- Use for editable preference/note fields
- Provide clear placeholder text
- Use state icons to show favorite/hidden status
- Disable editing when in read-only mode
- Handle Enter key for save/submit actions

### Don't ❌
- Don't use for multi-line text (use textarea instead)
- Don't forget to handle text changes
- Don't allow newlines if Enter should trigger save
- Don't mix state icons with plain header

## Related

- **Header (compact variant)** - Used for title and action icons
- **Data Editor Modal** - Uses this component
- **Input Field (textarea)** - For multi-line text input
