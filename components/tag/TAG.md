# Tag Component

Pill-shaped interactive tags for filtering and categorization with 3 types and 9 different states.

## Features

- **3 Types**: Collection, Favorites, Hidden
- **9 States**: Active, Inactive, Hover variations for each type
- **Icons**: Heart icon for Favorites, Eye icon for Hidden
- **Counts**: Display number badges
- **Interactive**: Click to toggle, hover effects
- **Design System**: Uses Aurora gradient for Favorites hover

## Tag Types

### Collection
Standard category tags without icons.
- **Active**: Dark background (#343a3f), white text
- **Inactive**: Transparent, dark border
- **Hover**: Transitions to active style

### Favorites
Tags with heart icon for favorited items.
- **Active**: Aurora gradient background, white text/icon
- **Inactive**: Purple border (#c9a2ff), dark text/icon
- **Hover**: Aurora gradient effect

### Hidden
Tags with eye-off icon for hidden items.
- **Active**: Dark background, white text/icon
- **Inactive**: Gray border (#98a0a6), dark text/icon
- **Hover**: Transitions to active style

## Usage

### HTML

```html
<!-- Include dependencies -->
<link rel="stylesheet" href="design-system/colors.css">
<link rel="stylesheet" href="components/tag.css">

<!-- Collection tag -->
<div class="tag" data-type="collection" data-state="inactive">
  <span class="tag__icon"></span>
  <span class="tag__label">Travel</span>
  <span class="tag__count">5</span>
</div>

<!-- Favorites tag -->
<div class="tag" data-type="favorites" data-state="active">
  <span class="tag__icon"></span>
  <span class="tag__label">Favorites</span>
  <span class="tag__count">12</span>
</div>

<!-- Hidden tag -->
<div class="tag" data-type="hidden" data-state="inactive">
  <span class="tag__icon"></span>
  <span class="tag__label">Hidden</span>
  <span class="tag__count">3</span>
</div>

<script src="components/tag.js"></script>
```

### JavaScript

#### Create tags programmatically

```javascript
// Create a collection tag
const collectionTag = createTag({
  type: 'collection',
  state: 'inactive',
  label: 'Travel',
  count: 5,
  onStateChange: (state) => {
    console.log('Tag state changed to:', state);
  },
  onClick: (tag) => {
    console.log('Tag clicked:', tag.getLabel());
  }
});

document.getElementById('container').appendChild(collectionTag.element);

// Create a favorites tag
const favTag = createTag({
  type: 'favorites',
  state: 'active',
  label: 'Favorites',
  count: 12
});

// Create a hidden tag
const hiddenTag = createTag({
  type: 'hidden',
  state: 'inactive',
  label: 'Hidden',
  count: 3
});
```

#### Initialize existing tags

```javascript
const tags = initTags();
```

## API

### Constructor Options

```javascript
new Tag(element, {
  type: 'collection',           // 'collection', 'favorites', 'hidden'
  state: 'inactive',            // 'active', 'inactive'
  label: 'Collection',          // Tag text
  count: 0,                     // Badge number
  onStateChange: (state) => {}, // State change callback
  onClick: (tag) => {}          // Click callback
});
```

### Methods

#### `setState(state)`
Set tag state ('active' or 'inactive').

```javascript
tag.setState('active');
```

#### `getState()`
Get current state.

```javascript
const state = tag.getState(); // 'active' or 'inactive'
```

#### `toggle()`
Toggle between active and inactive.

```javascript
tag.toggle();
```

#### `setType(type)`
Set tag type ('collection', 'favorites', 'hidden').

```javascript
tag.setType('favorites');
```

#### `getType()`
Get current type.

```javascript
const type = tag.getType();
```

#### `setLabel(label)`
Set tag label text.

```javascript
tag.setLabel('Travel Preferences');
```

#### `getLabel()`
Get tag label.

```javascript
const label = tag.getLabel();
```

#### `setCount(count)`
Set badge count.

```javascript
tag.setCount(15);
```

#### `getCount()`
Get badge count.

```javascript
const count = tag.getCount();
```

#### `incrementCount()` / `decrementCount()`
Adjust count.

```javascript
tag.incrementCount(); // count + 1
tag.decrementCount(); // count - 1
```

#### `destroy()`
Clean up event listeners.

```javascript
tag.destroy();
```

## Examples

### Toggle tag on click

```javascript
const tag = createTag({
  type: 'collection',
  label: 'Travel',
  count: 5
});

// Default behavior already toggles on click
```

### Custom click behavior

```javascript
const tag = createTag({
  type: 'favorites',
  label: 'Favorites',
  count: 10,
  onClick: (tag) => {
    // Filter data based on favorites
    filterDataByFavorites();

    // Update other tags
    otherTags.forEach(t => t.setState('inactive'));
    tag.setState('active');
  }
});
```

### Update count dynamically

```javascript
// When a card is favorited
card.onStateChange = (state) => {
  if (state === 'favorited') {
    favoritesTag.incrementCount();
  } else {
    favoritesTag.decrementCount();
  }
};
```

### Tag group for filtering

```javascript
const filterTags = [
  createTag({ type: 'collection', label: 'All', count: 50 }),
  createTag({ type: 'favorites', label: 'Favorites', count: 12 }),
  createTag({ type: 'hidden', label: 'Hidden', count: 5 })
];

filterTags.forEach(tag => {
  tag.onClick = (clickedTag) => {
    // Deactivate all other tags
    filterTags.forEach(t => {
      if (t !== clickedTag) {
        t.setState('inactive');
      }
    });

    // Activate clicked tag
    clickedTag.setState('active');

    // Apply filter
    applyFilter(clickedTag.getType());
  };

  container.appendChild(tag.element);
});
```

## Styling

The component uses design system colors and the Aurora gradient for favorites. All 9 states are automatically handled by CSS.

### Custom styling

```css
/* Adjust padding */
.tag {
  padding: 10px 20px;
}

/* Custom active state color */
.tag[data-type="collection"][data-state="active"] {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
}

/* Add animation */
.tag {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tag:active {
  transform: scale(0.95);
}
```

## Icons

Icons are embedded as inline SVG in the CSS:
- **Heart icon**: For favorites tags
- **Eye-off icon**: For hidden tags
- Colors adjust automatically based on state (white for active, dark for inactive)

## Typography

- **Label**: Instrument Sans Regular, 16px
- **Count**: Instrument Sans Bold, 16px
- Line height: 1.5

## Notes

- Tags auto-toggle on click by default
- Hover effects only apply to inactive states
- Count badge hides when count is 0
- Icons only show for favorites and hidden types
- Fully responsive with smaller font on mobile