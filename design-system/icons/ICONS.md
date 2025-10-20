# Icon System

The icon system provides a consistent set of 24x24px SVG icons used throughout the design system.

## Usage

### JavaScript

```javascript
// Import the icon system
const { getIcon, getIconNames } = require('./icons.js');

// Get a specific icon
const addIcon = getIcon('add');

// Get all available icon names
const iconNames = getIconNames();
```

### HTML

```html
<!-- Include the icon system -->
<script src="design-system/icons.js"></script>

<!-- Use an icon -->
<div class="icon-container">
  <script>
    document.currentScript.parentElement.innerHTML = getIcon('add');
  </script>
</div>
```

## Available Icons

### Action Icons
- **add** - Plus icon for adding items
- **close** - X icon for closing/dismissing

### Navigation Icons
- **expand** - Chevron up for expanding
- **chevronUp** - Chevron pointing up
- **chevronDown** - Chevron pointing down

### UI Control Icons
- **minimize** - Minimize/shrink icon
- **maximize** - Maximize/expand icon
- **settings** - Gear/settings icon

### State Icons
- **heart** - Filled heart for favorited state
- **heartOutline** - Outline heart for unfavorited state
- **hidden** - Eye-off icon for hidden items
- **eye** - Eye icon for visible items

## Icon Specifications

- **Size**: 24x24px
- **Stroke width**: 2px
- **Stroke cap**: round
- **Stroke join**: round
- **Color**: Uses `currentColor` to inherit from parent

## Styling

Icons inherit color from their parent element's color:

```css
.icon-red {
  color: #ff0000;
}
```

```html
<div class="icon-red">
  <!-- Icon will be red -->
</div>
```

## Component Integration

The icon system is used by:
- **Button Tertiary** - Uses add, expand, close icons
- **Tag Component** - Uses heart and hidden icons
- **Data Search** - Uses add and expand icons

## Adding New Icons

To add a new icon:

1. Add the SVG markup to the `ICONS` object in `icons.js`
2. Use 24x24px viewBox
3. Use `currentColor` for stroke/fill
4. Use 2px stroke width
5. Document the icon in this file
