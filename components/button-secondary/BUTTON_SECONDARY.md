# Button Secondary Component

A secondary action button with outlined style for less prominent actions.

## Features

- **Outlined Style**: Transparent background with colored border
- **3 Variants**: default (primary color), neutral, light
- **Size Options**: Large (48px), Medium (40px), Small (32px)
- **Compact Version**: v2 variant for modals and dense interfaces
- **Interactive States**: Hover, active, focus, disabled
- **Accessible**: Uses rem-based typography for better scalability

## Variants

### Default (Primary Color)
- Primary color border (`--color-primary-70`)
- Primary color text (`--color-primary-90`)
- **Hover**: Light background (`--color-primary-10`), darker border
- **Active**: Slightly darker background (`--color-primary-20`)

### Neutral
- Neutral border (`--color-neutral-80`)
- Neutral text (`--color-neutral-80`)
- **Use case**: On gradient or colored backgrounds

### Light
- Light border and text (`--color-neutral-10`)
- **Use case**: On dark backgrounds
- **Hover**: Semi-transparent white background

### V2 (Compact)
- Same as default but optimized for modals
- Fixed 40px height
- More compact padding

## Sizes

| Size | Height | Padding | Font Size | Use Case |
|------|--------|---------|-----------|----------|
| Large | 48px | 16px 24px | 16px | Prominent secondary CTAs |
| Medium | 40px | 8px 16px | 16px | **Default** - Standard actions |
| Small | 32px | 4px 16px | 14px | Compact interfaces |

## Usage

### HTML

```html
<!-- Include CSS -->
<link rel="stylesheet" href="design-system/colors.css">
<link rel="stylesheet" href="design-system/spacing.css">
<link rel="stylesheet" href="design-system/border-radius.css">
<link rel="stylesheet" href="design-system/typography.css">
<link rel="stylesheet" href="components/button-secondary/button-secondary.css">

<!-- Default secondary button (medium) -->
<button class="button-secondary">
  <span>Secondary Action</span>
</button>

<!-- Large button -->
<button class="button-secondary button-secondary--large">
  <span>Large Secondary</span>
</button>

<!-- Small button -->
<button class="button-secondary button-secondary--small">
  <span>Small</span>
</button>

<!-- Neutral variant -->
<button class="button-secondary button-secondary--neutral">
  <span>Neutral</span>
</button>

<!-- Light variant (for dark backgrounds) -->
<button class="button-secondary button-secondary--light">
  <span>Light</span>
</button>

<!-- V2 compact variant -->
<button class="button-secondary button-secondary--v2">
  <span>Compact</span>
</button>

<!-- With icon -->
<button class="button-secondary">
  <svg>...</svg>
  <span>With Icon</span>
</button>

<!-- Include JS -->
<script src="components/button-secondary/button-secondary.js"></script>
```

### JavaScript

#### Create button programmatically

```javascript
// Create a new secondary button
const button = createButtonSecondary({
  text: 'Click Me',
  variant: 'neutral',
  size: 'medium',
  onClick: () => {
    console.log('Button clicked!');
  }
});

// Append to DOM
document.getElementById('container').appendChild(button);
```

#### With icon

```javascript
const buttonWithIcon = createButtonSecondary({
  text: 'Download',
  variant: 'default',
  size: 'large',
  icon: 'arrowUpRight',
  onClick: handleDownload
});
```

## API

### Factory Function: `createButtonSecondary(options)`

```javascript
createButtonSecondary({
  text: 'Button Text',           // Required - Button label
  variant: 'default',             // Optional - 'default', 'neutral', 'light', 'v2'
  size: 'medium',                 // Optional - 'large', 'medium', 'small'
  icon: null,                     // Optional - Icon name from icon system
  disabled: false,                // Optional - Disabled state
  onClick: () => {}               // Optional - Click handler
})
```

### Returns

Returns a button element (HTMLButtonElement) that can be directly appended to the DOM.

## Design Tokens Used

### Colors
- `--color-primary-70`, `--color-primary-80`, `--color-primary-90` - Primary variant
- `--color-primary-10`, `--color-primary-20` - Hover backgrounds
- `--color-neutral-80`, `--color-neutral-90` - Neutral variant
- `--color-neutral-10`, `--color-neutral-20`, `--color-neutral-30` - Light variant

### Spacing
- `--spacing-xs` (8px) - Medium button padding
- `--spacing-sm` (16px) - Horizontal padding
- `--spacing-md` (24px) - Large button padding
- `--spacing-xxs` (4px) - Small button padding

### Typography
- `--font-size-16` - Large and medium buttons
- `--font-size-14` - Small buttons

### Border Radius
- `--radius-pill` (1000px) - Rounded pill shape

## States

- **Default**: Transparent background with colored border
- **Hover**: Light background fill, slightly darker border
- **Active**: Scale down effect (0.98), darker background
- **Focus**: Outline removed (alternative focus indicator needed)
- **Disabled**: 50% opacity, cursor not-allowed

## Accessibility

- Uses rem-based font sizes for better scalability
- Clear hover and active states
- Disabled state prevents interaction
- High contrast border for visibility

## Notes

- Always pair with a primary button for clear hierarchy
- Use neutral variant on gradient backgrounds to maintain visibility
- Use light variant on dark backgrounds (e.g., modals with dark overlays)
- V2 variant is optimized for modal action buttons
