# Tooltip Element

Reusable tooltip component with arrow pointer. Supports multiple positioning options.

## Features

- ✅ Six positioning options
- ✅ Arrow pointer
- ✅ Hover to show
- ✅ Smooth fade animation
- ✅ Class-based or factory function
- ✅ Data attribute support

## Basic Usage

### Factory Function

```javascript
const button = document.getElementById('my-button');

const tooltip = createTooltip(button, {
  text: 'Click to save changes',
  position: 'top'
});

// Tooltip shows on hover automatically
```

### Data Attribute

```html
<button data-tooltip="Click to save" data-tooltip-position="top">
  Save
</button>

<script>
  // Initialize all tooltips
  initTooltips();
</script>
```

### Standalone Element

```javascript
const tooltipContainer = createTooltipElement({
  text: 'Helpful hint',
  position: 'top-right',
  trigger: createButton({ icon: 'info' }).element
});

document.body.appendChild(tooltipContainer);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `text` | string | `''` | Tooltip text content |
| `position` | string | `'top'` | Tooltip position |
| `container` | Element | `null` | Optional existing container |

## Positions

| Position | Description |
|----------|-------------|
| `top` | Above element (centered) |
| `top-right` | Above element (right-aligned) |
| `top-left` | Above element (left-aligned) |
| `bottom` | Below element (centered) |
| `left` | Left of element |
| `right` | Right of element |

## API

### Class API

```javascript
const tooltip = new Tooltip(element, {
  text: 'Tooltip text',
  position: 'top'
});

// Update text
tooltip.setText('New tooltip text');

// Update position
tooltip.setPosition('bottom');

// Show/hide manually
tooltip.show();
tooltip.hide();

// Destroy
tooltip.destroy();
```

### Factory Functions

```javascript
// Create tooltip on existing element
const tooltip = createTooltip(element, {
  text: 'Helpful hint',
  position: 'top'
});

// Create standalone tooltip container
const container = createTooltipElement({
  text: 'Info tooltip',
  position: 'right',
  trigger: triggerElement
});

// Initialize all tooltips with data-tooltip attribute
const tooltips = initTooltips();
```

## Structure

### HTML Output

```html
<div class="tooltip-container">
  <!-- Your trigger element -->
  <button>Hover me</button>

  <!-- Tooltip (hidden by default) -->
  <div class="tooltip tooltip--top">
    Tooltip text
  </div>
</div>
```

### Arrow Position

Each position includes an arrow pointing to the trigger:

```
     ┌──────────┐
     │ Tooltip  │
     └────▼─────┘
     [  Button  ]   (top position)
```

## Positioning Details

### Top
- **Position**: Above element
- **Alignment**: Centered
- **Arrow**: Bottom center

### Top-Right
- **Position**: Above element
- **Alignment**: Right edge
- **Arrow**: Bottom right

### Top-Left
- **Position**: Above element
- **Alignment**: Left edge
- **Arrow**: Bottom left

### Bottom
- **Position**: Below element
- **Alignment**: Centered
- **Arrow**: Top center

### Left
- **Position**: Left of element
- **Alignment**: Vertically centered
- **Arrow**: Right middle

### Right
- **Position**: Right of element
- **Alignment**: Vertically centered
- **Arrow**: Left middle

## Examples

### Button with Tooltip

```javascript
const saveBtn = createButton({
  variant: 'tertiary',
  icon: 'save',
  ariaLabel: 'Save'
});

const tooltip = createTooltip(saveBtn.element, {
  text: 'Save changes',
  position: 'bottom'
});
```

### Icon with Tooltip

```html
<span
  class="icon"
  data-tooltip="Learn more"
  data-tooltip-position="top"
>
  ℹ️
</span>

<script>
  initTooltips();
</script>
```

### Dynamic Tooltip

```javascript
const button = document.getElementById('status-btn');
const tooltip = createTooltip(button, {
  text: 'Offline',
  position: 'right'
});

// Update tooltip based on status
function updateStatus(isOnline) {
  tooltip.setText(isOnline ? 'Online' : 'Offline');
}
```

### Manual Show/Hide

```javascript
const tooltip = createTooltip(element, {
  text: 'Manual tooltip',
  position: 'top'
});

// Show on custom event
customEvent.on('show', () => tooltip.show());
customEvent.on('hide', () => tooltip.hide());
```

## Behavior

### Auto Show/Hide
- Tooltip shows on hover (CSS `:hover`)
- Hides when mouse leaves
- No JavaScript needed for basic show/hide

### Visibility
- **Hidden**: `opacity: 0`, `visibility: hidden`
- **Visible**: `opacity: 1`, `visibility: visible`
- Smooth 0.2s transition

### Pointer Events
- `pointer-events: none` (won't interfere with clicks)
- Non-interactive

## Styling

### Appearance
- **Background**: Dark (`--color-neutral-90`)
- **Text**: White (`--color-secondary-10`)
- **Padding**: Small (`--spacing-xxs` × `--spacing-xs`)
- **Border Radius**: Small (`--radius-sm`)
- **Font Size**: 12px
- **Font Weight**: 500
- **Line Height**: 1.4

### Arrow
- **Size**: 4px border
- **Color**: Matches tooltip background

## Design Tokens

- Background: `--color-neutral-90`
- Text: `--color-secondary-10`
- Padding: `--spacing-xxs`, `--spacing-xs`
- Border radius: `--radius-sm`
- Font size: `12px`
- Z-index: `1000`

## Use Cases

- **Icon Buttons** - Explain icon meaning
- **Disabled Elements** - Explain why disabled
- **Info Icons** - Provide additional context
- **Truncated Text** - Show full text on hover
- **Help Text** - Brief explanations

## Accessibility

```html
<div class="tooltip-container">
  <button
    aria-label="Save changes"
    aria-describedby="tooltip-1"
  >
    💾
  </button>
  <div
    id="tooltip-1"
    class="tooltip tooltip--top"
    role="tooltip"
  >
    Save changes
  </div>
</div>
```

**Best Practices:**
- Use `role="tooltip"` on tooltip element
- Link with `aria-describedby` on trigger
- Provide `aria-label` on trigger (don't rely on tooltip alone)
- Keep text concise (1-2 lines max)
- Don't put critical information in tooltips

## Best Practices

### Do ✅
- Keep text short and concise
- Use for supplementary information
- Position appropriately (avoid off-screen)
- Ensure trigger has accessible label
- Use consistent positioning

### Don't ❌
- Don't put critical info in tooltips
- Don't make tooltips too long
- Don't use for complex content (use popovers)
- Don't forget aria-label on trigger
- Don't rely solely on tooltips for accessibility

## Performance

- Lightweight (no heavy libraries)
- CSS-based show/hide (no JS listeners)
- Minimal DOM manipulation
- Efficient initialization

## Related

- **All Button Components** - Often use tooltips
- **Icons** - Commonly paired with tooltips
- **Disabled Elements** - Use tooltips to explain why
