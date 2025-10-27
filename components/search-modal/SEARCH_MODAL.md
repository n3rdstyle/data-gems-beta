# Search Modal Component

A bottom-sheet style modal for searching and filtering preference data.

## Features

- **Bottom Sheet Design**: Slides up from bottom of screen
- **Full-Width Search**: Prominent search input field
- **Search Results**: Displays filtered data cards
- **Upward Shadow**: Custom shadow effect for bottom sheet (`--shadow-bottom-sheet-dark`)
- **Smooth Transitions**: Animated show/hide with backdrop
- **Responsive**: Adapts to 400px extension width

## UI Pattern

This component follows the **Bottom Sheet** mobile UI pattern:
- Positioned at bottom of screen
- Rounded top corners
- Shadow cast upward
- Overlay backdrop
- Slide-in animation

## Usage

### HTML Structure

```html
<!-- Include dependencies -->
<link rel="stylesheet" href="design-system/colors.css">
<link rel="stylesheet" href="design-system/spacing.css">
<link rel="stylesheet" href="design-system/border-radius.css">
<link rel="stylesheet" href="design-system/shadows.css">
<link rel="stylesheet" href="components/overlay/overlay.css">
<link rel="stylesheet" href="components/search-modal/search-modal.css">

<!-- Modal with overlay -->
<div class="overlay overlay--fixed" id="search-overlay">
  <div class="search-modal">
    <div class="search-modal__header">
      <input type="text" class="search-modal__input" placeholder="Search preferences...">
      <button class="search-modal__close">
        <!-- Close icon -->
      </button>
    </div>
    <div class="search-modal__results">
      <!-- Search results (data cards) will be inserted here -->
    </div>
  </div>
</div>

<!-- Include JS -->
<script src="components/overlay/overlay.js"></script>
<script src="components/search-modal/search-modal.js"></script>
```

### JavaScript

#### Show modal

```javascript
// Create and show search modal
const searchModal = createSearchModal({
  placeholder: 'Search your preferences...',
  onSearch: (query) => {
    console.log('Searching for:', query);
    // Return filtered results
    return filterPreferences(query);
  },
  onClose: () => {
    console.log('Modal closed');
  }
});

searchModal.show();
```

#### Handle search

```javascript
const modal = createSearchModal({
  onSearch: (searchQuery) => {
    // Filter data based on query
    const results = dataCards.filter(card =>
      card.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Return results to display in modal
    return results;
  }
});
```

## API

### Factory Function: `createSearchModal(options)`

```javascript
createSearchModal({
  placeholder: 'Search...',       // Optional - Input placeholder text
  onSearch: (query) => {},        // Required - Search handler, should return results
  onClose: () => {},              // Optional - Close handler
  initialQuery: ''                // Optional - Pre-filled search query
})
```

### Returns

Returns a modal object with methods:

```javascript
{
  show: () => void,              // Show the modal
  hide: () => void,              // Hide the modal
  setQuery: (text) => void,      // Set search input value
  getQuery: () => string,        // Get current search query
  updateResults: (cards) => void // Update displayed results
}
```

## Design Tokens Used

### Colors
- `--color-secondary-10` - Modal background
- `--color-neutral-30` - Border color
- `--color-neutral-80` - Text color

### Spacing
- `--spacing-sm` (16px) - Internal padding
- `--spacing-md` (24px) - Section spacing

### Border Radius
- `--radius-lg` (16px) - Top corners only

### Shadows
- `--shadow-bottom-sheet-dark`: `0 -4px 24px rgba(0, 0, 0, 0.25)` - Upward shadow

## CSS Structure

```css
.search-modal {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-secondary-10);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0; /* Top corners only */
  box-shadow: var(--shadow-bottom-sheet-dark);
  padding: var(--spacing-sm);
  gap: var(--spacing-md);
}
```

## States

- **Hidden**: `opacity: 0`, `pointer-events: none`, translated down
- **Visible**: `opacity: 1`, `pointer-events: auto`, translated to position
- **Searching**: Shows loading indicator or filtered results

## Interaction Flow

1. User clicks search trigger button
2. Modal slides up from bottom with overlay
3. User types in search field
4. Results filter in real-time
5. User clicks result or close button
6. Modal slides down and hides

## Accessibility

- Focus trap within modal when open
- Escape key closes modal
- Click outside (on overlay) closes modal
- Search input receives focus on open

## Integration Example

```javascript
// In home screen
const searchButton = document.querySelector('.search-button');
const allPreferences = getAllPreferences();

searchButton.addEventListener('click', () => {
  const modal = createSearchModal({
    placeholder: 'Search your preferences...',
    onSearch: (query) => {
      return allPreferences.filter(pref =>
        pref.text.toLowerCase().includes(query.toLowerCase())
      );
    },
    onClose: () => {
      // Optional: Track analytics
      trackEvent('search_modal_closed');
    }
  });

  modal.show();
});
```

## Notes

- This is an untracked component (new) - not yet in git
- Part of the mobile-style bottom sheet pattern family
- Works within the 400x600px extension popup constraints
- Pairs well with `collection-filter-modal` for advanced filtering
