# Headline

Section headline/title with optional search icon and active search state.

## Features

- ✅ Large heading text (h2 style)
- ✅ Optional action icon (search, etc.)
- ✅ Active search state with pill button
- ✅ Search term display with cancel
- ✅ Flexible text/icon layout

## Basic Usage

```javascript
const headline = createHeadline({
  text: 'Your Preferences',
  showIcon: true,
  iconName: 'search',
  onIconClick: () => {
    console.log('Search icon clicked');
    openSearchModal();
  }
});

document.body.appendChild(headline.element);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `text` | string | `'Headline'` | Headline text |
| `showIcon` | boolean | `false` | Show action icon |
| `iconName` | string | `'search'` | Icon name (from icon system) |
| `onIconClick` | function | `null` | Click handler for icon |

## Structure

**With Icon:**
```
┌─────────────────────────────┐
│ Your Preferences       [🔍] │  H2 text + icon
└─────────────────────────────┘
```

**Active Search State:**
```
┌─────────────────────────────┐
│ Your Preferences  [work ✕]  │  H2 text + search pill
└─────────────────────────────┘
```

**Text Only:**
```
┌─────────────────────────────┐
│ Your Preferences            │  H2 text only
└─────────────────────────────┘
```

## API

```javascript
const headline = createHeadline({
  text: 'Preferences',
  showIcon: true,
  iconName: 'search'
});

// Get/set text
headline.getText(); // Returns 'Preferences'
headline.setText('All Preferences');

// Set icon click handler
headline.setIconClick(() => {
  showSearch();
});

// Activate search state
headline.setSearchActive('work', () => {
  // Cancel callback
  clearSearch();
  headline.clearSearch();
});

// Clear search (restore icon)
headline.clearSearch();

// Access DOM element
headline.element;
```

## Search State

### Normal State
- Shows icon (if `showIcon: true`)
- Icon is clickable
- No search indication

### Active Search State
- Hides icon
- Shows pill button with search term
- Shows X icon to cancel
- Clicking pill cancels search

## Example: Search Flow

```javascript
const headline = createHeadline({
  text: 'Your Preferences',
  showIcon: true,
  iconName: 'search',

  onIconClick: () => {
    // Open search modal
    const searchModal = createSearchModal({
      onSearch: (query) => {
        // Perform search
        filterPreferences(query);

        // Update headline to show active search
        headline.setSearchActive(query, () => {
          // Cancel search
          showAllPreferences();
          headline.clearSearch();
        });

        // Close modal
        searchModal.close();
      }
    });

    searchModal.show();
  }
});
```

## Example: Home Screen Usage

```javascript
// In home screen
const headline = createHeadline({
  text: 'Your Preferences',
  showIcon: true,
  iconName: 'search',

  onIconClick: () => {
    // Toggle search bar visibility
    searchBar.toggle();
  }
});

// When search has results
if (searchQuery) {
  headline.setSearchActive(searchQuery, () => {
    clearSearchResults();
    searchBar.clear();
    headline.clearSearch();
  });
} else {
  headline.clearSearch();
}
```

## Search Pill Styling

The active search pill displays:
- **Background**: Primary color (`--color-primary-60`)
- **Text**: White (`--color-neutral-10`)
- **Border radius**: Pill (`--radius-pill`)
- **Max width**: 200px (ellipsis for long terms)
- **Hover**: Darker primary (`--color-primary-70`)

## Design Tokens

- Text: `--color-neutral-80`
- Typography: `text-style-h2`
- Icon size: `24x24`
- Icon hover: `--color-neutral-60`
- Search button background: `--color-primary-60`
- Search button text: `--color-neutral-10`
- Border radius: `--radius-pill`
- Gap: `--spacing-xs`

## Use Cases

- **Screen Headers** - Main heading for screens
- **Section Titles** - With or without icons
- **Search Headers** - With search icon and active state
- **Category Headers** - For content sections

## Accessibility

```html
<div class="headline text-style-h2">
  <span class="headline__text">Your Preferences</span>
  <span class="headline__action">
    <span
      class="headline__icon"
      role="button"
      aria-label="Search"
      tabindex="0"
    >
      <!-- icon -->
    </span>
  </span>
</div>
```

**Active Search:**
```html
<div class="headline text-style-h2">
  <span class="headline__text">Your Preferences</span>
  <span class="headline__action">
    <button
      class="headline__search-button"
      aria-label="Active search: work. Click to clear"
    >
      <span class="headline__search-label">work</span>
      <span class="headline__search-cancel">✕</span>
    </button>
  </span>
</div>
```

**Best Practices:**
- Use `role="button"` for icon
- Provide clear `aria-label` for actions
- Make icon keyboard accessible (tabindex)
- Announce search state changes
- Clear aria-label for search pill

## Best Practices

### Do ✅
- Use h2 semantic level for headlines
- Provide clear action icon labels
- Show active search state clearly
- Allow easy search cancellation
- Keep headline text concise

### Don't ❌
- Don't use for page titles (use h1)
- Don't make search term too long (ellipsis at 200px)
- Don't forget to clear search state
- Don't use multiple action icons

## Text Styling

Uses `text-style-h2` from typography system:
- Font size: Larger than body
- Font weight: Medium/semibold
- Color: Neutral 80
- No wrapping (white-space: nowrap)

## Icon Behavior

### Icon Visibility
- Shows when `showIcon: true`
- Hidden when search is active
- Restored when search is cleared

### Icon States
- **Default**: Normal color
- **Hover**: Lighter color (60)
- **Active**: Visual feedback on click

## Related

- **Header** - Alternative component for section headers
- **Search** - Works with search functionality
- **Home Screen** - Uses headline component
