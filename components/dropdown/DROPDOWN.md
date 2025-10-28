# Dropdown

Custom select-style dropdown with styled options. Replaces native `<select>` with custom-styled component.

## Features

- ✅ Custom styling (unlike native select)
- ✅ Keyboard support (Escape to close)
- ✅ Click outside to close
- ✅ Placeholder support
- ✅ Selected state highlighting
- ✅ Scrollable menu (max 240px)

## Basic Usage

```javascript
const dropdown = createDropdown({
  value: 'option2',
  placeholder: 'Select an option',
  options: [
    { value: 'option1', label: 'First Option' },
    { value: 'option2', label: 'Second Option' },
    { value: 'option3', label: 'Third Option' }
  ],
  onChange: (value, option) => {
    console.log('Selected:', value, option.label);
  }
});

document.body.appendChild(dropdown.element);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | string | `''` | Initial selected value |
| `placeholder` | string | `'Select an option'` | Placeholder text when no selection |
| `options` | Array<{value, label}> | `[]` | Dropdown options |
| `onChange` | function | `null` | Callback when selection changes |
| `disabled` | boolean | `false` | Disabled state |

## Option Object

```javascript
{
  value: 'unique-id',     // Unique identifier
  label: 'Display Text'   // What the user sees
}
```

## Structure

```
┌─────────────────────────┐
│ Select an option     [▼]│  Closed state
└─────────────────────────┘

┌─────────────────────────┐
│ Second Option        [▲]│  Open state
├─────────────────────────┤
│ First Option            │
│ Second Option       ✓   │  Selected
│ Third Option            │
│ ...                     │
└─────────────────────────┘
```

## API

```javascript
const dropdown = createDropdown({
  options: [
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' }
  ]
});

// Get current value
dropdown.getValue(); // Returns 'red' or 'blue'

// Set value programmatically
dropdown.setValue('blue');

// Open/close menu
dropdown.open();
dropdown.close();

// Disable/enable
dropdown.disable();
dropdown.enable();
dropdown.isDisabled(); // Returns true/false

// Access DOM element
dropdown.element;
```

## States

- **Default** - White background, neutral border
- **Hover** - Darker border color
- **Open** - Info color border, menu visible, icon rotated 180°
- **Placeholder** - Lighter text color
- **Selected option** - Primary background, highlighted
- **Disabled** - Cannot interact

## Use Cases

- Sorting options (A-Z, Newest, etc.)
- Category selection
- Filter menus
- Settings with predefined options
- Language/region selection

## Design Tokens

- Background: `--color-neutral-10`
- Border: `--color-neutral-40` (default), `--color-neutral-50` (hover), `--color-info` (open)
- Text: `--color-neutral-80`
- Placeholder: `--color-neutral-50`
- Selected background: `--color-primary-10`
- Selected text: `--color-primary-70`
- Border radius: `--radius-sm`
- Padding: `--spacing-input-vertical`, `--spacing-sm`
- Shadow: `--shadow-md`

## Example: Sort Dropdown

```javascript
const sortDropdown = createDropdown({
  placeholder: 'Sort by...',
  options: [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'alpha-az', label: 'A → Z' },
    { value: 'alpha-za', label: 'Z → A' }
  ],
  onChange: (value, option) => {
    sortItems(value);
    console.log('Sorting by:', option.label);
  }
});

filterBar.appendChild(sortDropdown.element);
```

## Example: Dynamic Options

```javascript
// Create dropdown with initial options
const categoryDropdown = createDropdown({
  options: []
});

// Fetch and populate options dynamically
fetch('/api/categories')
  .then(res => res.json())
  .then(categories => {
    // Update dropdown by recreating with new options
    // (Note: Current implementation requires recreation for dynamic options)
    const newDropdown = createDropdown({
      options: categories.map(cat => ({
        value: cat.id,
        label: cat.name
      })),
      onChange: (value) => {
        loadCategoryItems(value);
      }
    });

    // Replace old dropdown
    categoryDropdown.element.replaceWith(newDropdown.element);
  });
```

## Accessibility

- Use semantic button element for trigger
- Provide clear labels for each option
- Support keyboard navigation (Escape to close)
- Consider adding arrow key navigation for options
- Ensure sufficient color contrast

**Recommendations:**
```html
<div class="dropdown" role="combobox" aria-expanded="false" aria-haspopup="listbox">
  <button class="dropdown__trigger" aria-label="Select option">
    <div class="dropdown__value">Second Option</div>
    <div class="dropdown__icon">▼</div>
  </button>
  <div class="dropdown__menu" role="listbox">
    <div class="dropdown__option" role="option" aria-selected="true">
      Second Option
    </div>
  </div>
</div>
```

## Best Practices

### Do ✅
- Use for 4-15 options (too few → radio buttons, too many → search/autocomplete)
- Provide clear, concise option labels
- Show selected state clearly
- Use placeholder to hint at purpose
- Close menu on selection

### Don't ❌
- Don't use for binary choices (use toggle instead)
- Don't make options too long (use ellipsis)
- Don't forget to handle empty states
- Don't use for navigation (use menu instead)

## Related

- **Input Field (search variant)** - For searchable dropdowns
- **Radio Buttons** - For fewer, visible options
- **Autocomplete** - For many options with search
