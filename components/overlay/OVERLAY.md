# Overlay

Semi-transparent backdrop for modals, dialogs, and overlays. Covers entire screen or container.

## Features

- ✅ Three opacity levels (light, default, dark)
- ✅ Absolute or fixed positioning
- ✅ Smooth fade in/out
- ✅ Click handler
- ✅ Configurable z-index
- ✅ Prevents clicks below when visible

## Basic Usage

```javascript
const overlay = createOverlay({
  opacity: 'default',
  fixed: true,
  visible: false,
  onClick: () => {
    console.log('Overlay clicked');
    modal.close();
    overlay.hide();
  }
});

document.body.appendChild(overlay.element);
overlay.show(); // Fade in
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `opacity` | string | `'default'` | Opacity level: 'light', 'default', 'dark' |
| `fixed` | boolean | `false` | Use fixed positioning (absolute otherwise) |
| `visible` | boolean | `false` | Initially visible |
| `onClick` | function | `null` | Click handler (only triggers when clicking overlay directly) |
| `zIndex` | number | `1000` | Z-index value |

## Opacity Levels

| Level | Token | Description |
|-------|-------|-------------|
| `light` | `--overlay-light` | Subtle backdrop |
| `default` | `--overlay-default` | Standard backdrop |
| `dark` | `--overlay-dark` | Strong backdrop |

## Positioning

### Absolute (default)
- Position relative to parent container
- Parent must have `position: relative`
- Covers parent container

### Fixed
- Position relative to viewport
- Covers entire screen
- Not affected by parent positioning

## API

```javascript
const overlay = createOverlay();

// Show/hide
overlay.show(); // Fade in
overlay.hide(); // Fade out
overlay.toggle(); // Toggle visibility

// Check visibility
overlay.isVisible(); // Returns true/false

// Change opacity level
overlay.setOpacity('light');
overlay.setOpacity('default');
overlay.setOpacity('dark');

// Change z-index
overlay.setZIndex(2000);

// Remove from DOM
overlay.destroy();

// Access DOM element
overlay.element;
```

## Example: Modal with Overlay

```javascript
// Create overlay
const overlay = createOverlay({
  fixed: true,
  opacity: 'default',
  onClick: () => {
    closeModal();
  }
});

// Create modal
const modal = createModal({
  onClose: () => {
    closeModal();
  }
});

function openModal() {
  document.body.appendChild(overlay.element);
  document.body.appendChild(modal.element);
  overlay.show();
  modal.show();
}

function closeModal() {
  overlay.hide();
  modal.hide();
  setTimeout(() => {
    overlay.destroy();
    modal.destroy();
  }, 200); // Wait for fade out
}
```

## Example: Click Detection

```javascript
const overlay = createOverlay({
  onClick: (e) => {
    // Only called when clicking overlay itself
    // NOT when clicking child elements
    console.log('Clicked overlay background');
    closeDialog();
  }
});

// Overlay will ignore clicks on modal content
// Only clicks directly on the overlay backdrop trigger onClick
```

## Example: Stacked Overlays

```javascript
// First modal
const overlay1 = createOverlay({
  opacity: 'default',
  zIndex: 1000
});

// Second modal on top
const overlay2 = createOverlay({
  opacity: 'dark',
  zIndex: 2000
});
```

## Behavior

### Fade Animation
- Smooth 0.2s transition
- Opacity animates from 0 to 1
- `pointer-events` disabled when hidden

### Click Through Prevention
- When visible: Captures all clicks
- When hidden: `pointer-events: none` allows clicks through
- Child elements can still be clicked

### Z-Index Layering
- Default: `1000`
- Modal base components typically use `1001+`
- Can be configured per overlay

## Design Tokens

- Light: `--overlay-light` (rgba)
- Default: `--overlay-default` (rgba)
- Dark: `--overlay-dark` (rgba)
- Transition: `0.2s ease-in-out`

## Use Cases

- **Modal Backdrops** - Behind modal dialogs
- **Bottom Sheets** - Behind bottom-sheet modals
- **Dropdowns** - Behind large dropdowns
- **Loading States** - Prevent interaction during loading
- **Image Galleries** - Darken background for focus

## Accessibility

```html
<div
  class="overlay overlay--visible overlay--fixed"
  role="presentation"
  aria-hidden="true"
>
</div>
```

**Best Practices:**
- Use `role="presentation"` (decorative element)
- Mark as `aria-hidden="true"`
- Don't put interactive content in overlay
- Ensure modal/dialog has proper ARIA attributes

## Best Practices

### Do ✅
- Use fixed positioning for full-screen modals
- Set appropriate z-index for layering
- Close modals when clicking overlay
- Use dark opacity for important modals
- Destroy overlay when modal closes

### Don't ❌
- Don't forget to remove overlay from DOM
- Don't use overlay without a close mechanism
- Don't block overlay clicks for critical UIs
- Don't stack too many overlays (max 2-3)

## Related

- **Modal Bottom-Sheet** - Uses overlay component
- **Modal Center** - Uses overlay component
- **All Modals** - Typically use overlays for backdrop
