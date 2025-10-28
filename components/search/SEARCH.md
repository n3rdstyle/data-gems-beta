# Search

Simple search input field with pill-shaped styling and search icon. Built on top of Input Field component.

## Features

- ✅ Pill-shaped border radius
- ✅ Search icon (left side)
- ✅ Escape key to clear
- ✅ Enter key callback
- ✅ Real-time search input
- ✅ Silent clear option

## Basic Usage

```javascript
const search = createSearch({
  placeholder: 'Search your preferences',
  onInput: (value) => {
    console.log('Search query:', value);
    performSearch(value);
  }
});

document.body.appendChild(search.element);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `placeholder` | string | `'Search your preferences'` | Placeholder text |
| `onInput` | function | `null` | Callback when input changes |
| `onClear` | function | `null` | Callback when search is cleared |
| `onEnter` | function | `null` | Callback when Enter is pressed |

## Structure

```
┌─────────────────────────────┐
│ [🔍] Search your preferences│  Pill-shaped search input
└─────────────────────────────┘
```

## API

```javascript
const search = createSearch({
  placeholder: 'Search...'
});

// Get current value
search.getValue(); // Returns search query

// Set value programmatically
search.setValue('work');

// Clear search
search.clear(); // Triggers onClear and onInput callbacks
search.clear(true); // Silent clear (no callbacks)

// Focus/blur
search.focus();
search.blur();

// Update placeholder
search.setPlaceholder('Search preferences...');

// Access DOM element
search.element;
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Escape** | Clear search field |
| **Enter** | Trigger onEnter callback |

## Behavior

### Real-time Search
- Every keystroke triggers `onInput` callback
- Use for live filtering/searching
- Debounce if needed for API calls

### Clearing
- **Escape key**: Clears field and triggers callbacks
- **Programmatic clear**: `clear()` triggers callbacks, `clear(true)` is silent
- Clearing triggers both `onClear` and `onInput('')` callbacks

### Enter Key
- Triggers `onEnter` callback with current value
- Use for "submit search" functionality
- Does not clear field automatically

## Example: Live Filter

```javascript
const search = createSearch({
  placeholder: 'Search preferences...',
  onInput: (query) => {
    const filtered = preferences.filter(pref =>
      pref.text.toLowerCase().includes(query.toLowerCase())
    );
    displayPreferences(filtered);
  },

  onClear: () => {
    displayPreferences(preferences); // Show all
  }
});
```

## Example: Search with Debounce

```javascript
let debounceTimer;

const search = createSearch({
  placeholder: 'Search...',
  onInput: (query) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performExpensiveSearch(query);
    }, 300); // Wait 300ms after user stops typing
  }
});
```

## Example: Enter to Search

```javascript
const search = createSearch({
  placeholder: 'Press Enter to search...',
  onEnter: (query) => {
    if (query.trim()) {
      performSearch(query);
      logSearchQuery(query);
    }
  }
});
```

## Design Tokens

- Border radius: `--radius-pill` (fully rounded ends)
- Border: `--color-neutral-50` (default), `--color-neutral-70` (hover), `--color-neutral-80` (focus)
- Font size: `--font-size-16`
- Icon: Search icon (16x16, left-aligned)
- Inherits all Input Field design tokens

## Differences from Input Field

| Feature | Search | Input Field |
|---------|--------|-------------|
| Border radius | Pill | Small radius |
| Border color | Darker default | Lighter default |
| Icon | Always shown | Optional |
| Width variation | Normal | Normal |

## Use Cases

- **Preference Search** - Filter user preferences
- **Global Search** - Search across entire app
- **Filter Bar** - Quick filtering of lists
- **Live Search** - Real-time results as you type

## Accessibility

```html
<div class="search">
  <div class="input-field input-field--search">
    <div class="input-field__wrapper">
      <div class="input-field__search-icon" aria-hidden="true">
        <!-- search icon -->
      </div>
      <input
        class="input-field__input"
        type="text"
        placeholder="Search your preferences"
        role="searchbox"
        aria-label="Search preferences"
      />
    </div>
  </div>
</div>
```

**Best Practices:**
- Use `role="searchbox"` on input element
- Provide `aria-label` for context
- Mark search icon as `aria-hidden="true"`
- Announce search results to screen readers

## Best Practices

### Do ✅
- Provide clear placeholder text
- Implement debouncing for expensive searches
- Show search results/count
- Clear search on Escape
- Support keyboard navigation

### Don't ❌
- Don't perform expensive operations on every keystroke
- Don't forget to handle empty search (show all results)
- Don't use for forms (use regular input instead)
- Don't forget to trim whitespace

## Related

- **Input Field (search variant)** - Base component
- **Data Search** - Search + tag list composite
- **Tag List** - For showing search filters
