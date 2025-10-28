# Bottom-Sheet Modal

A modal dialog that slides up from the bottom of the screen. Commonly used for mobile-first interfaces and progressive disclosure patterns.

## Features

- ✅ Slide-up animation from bottom
- ✅ Backdrop overlay (optional)
- ✅ Flexible height (max 70vh)
- ✅ Light and dark variants
- ✅ Header, content, footer structure
- ✅ Escape key to close
- ✅ Click outside to close
- ✅ Custom events

## Anatomy

```
┌─────────────────────────────┐
│ Header (with close button) │
├─────────────────────────────┤
│                             │
│ Content (scrollable)        │
│                             │
├─────────────────────────────┤
│ Footer (actions)            │
└─────────────────────────────┘
```

## Variants

### Light (Default)
White background with neutral borders. Best for most use cases.

```html
<div class="modal-bottom-sheet">
  <!-- content -->
</div>
```

### Dark
Gradient background (sundown). Best for special actions or highlighting.

```html
<div class="modal-bottom-sheet modal-bottom-sheet--dark">
  <!-- content -->
</div>
```

### Optional Modifiers

**Without Footer:**
```html
<div class="modal-bottom-sheet modal-bottom-sheet--no-footer">
  <!-- content -->
</div>
```

**Without Header:**
```html
<div class="modal-bottom-sheet modal-bottom-sheet--no-header">
  <!-- content -->
</div>
```

## Structure

### Complete Example

```html
<!-- Modal HTML -->
<div class="modal-bottom-sheet" id="myModal">
  <!-- Header -->
  <div class="modal-bottom-sheet__header">
    <h3 class="modal-bottom-sheet__title">Modal Title</h3>
    <button class="button-tertiary modal-bottom-sheet__close" onclick="myModalInstance.hide()">
      <!-- Close icon -->
    </button>
  </div>

  <!-- Content -->
  <div class="modal-bottom-sheet__content">
    <p>Your content here...</p>
  </div>

  <!-- Footer -->
  <div class="modal-bottom-sheet__footer">
    <button class="button-secondary button-secondary--v2" onclick="myModalInstance.hide()">
      Cancel
    </button>
    <button class="button-primary button-primary--v2">
      Confirm
    </button>
  </div>
</div>
```

### JavaScript

```javascript
import { ModalBottomSheet } from './modal-bottom-sheet.js';

// Initialize
const myModalInstance = new ModalBottomSheet(document.getElementById('myModal'));

// Show modal (with overlay)
myModalInstance.show();

// Show modal (without overlay)
myModalInstance.show(false);

// Hide modal
myModalInstance.hide();

// Toggle modal
myModalInstance.toggle();

// Listen to events
myModalInstance.modal.addEventListener('modal-shown', () => {
  console.log('Modal opened');
});

myModalInstance.modal.addEventListener('modal-hidden', () => {
  console.log('Modal closed');
});

// Cleanup
myModalInstance.destroy();
```

### Helper Function

```javascript
import { initModal } from './modal-bottom-sheet.js';

// Initialize from selector
const modal = initModal('#myModal');
modal.show();
```

## CSS Classes

### Root

| Class | Description |
|-------|-------------|
| `.modal-bottom-sheet` | Base modal class |
| `.modal-bottom-sheet--dark` | Dark variant with gradient |
| `.modal-bottom-sheet--no-footer` | Without footer |
| `.modal-bottom-sheet--no-header` | Without header |
| `.modal-bottom-sheet.visible` | Shown state (slide up) |

### Structure

| Class | Description |
|-------|-------------|
| `.modal-bottom-sheet__header` | Header container |
| `.modal-bottom-sheet__title` | Modal title (h3) |
| `.modal-bottom-sheet__close` | Close button |
| `.modal-bottom-sheet__content` | Scrollable content area |
| `.modal-bottom-sheet__footer` | Footer with actions |

## Design Tokens Used

### Colors
- `--color-neutral-10` (Light background)
- `--color-neutral-80` (Title color)
- `--color-neutral-30` (Footer border)
- `--overlay-white-20` (Dark variant hover)

### Gradients
- `--gradient-sundown` (Dark variant background)

### Spacing
- `--spacing-md` (Padding, gaps)
- `--spacing-sm` (Content gaps)
- `--spacing-xs` (Button gaps)

### Shadows
- `--shadow-bottom-sheet` (Light variant)
- `--shadow-bottom-sheet-dark` (Dark variant)

### Border Radius
- `--radius-lg` (Top corners)

### Typography
- `--font-size-20` (Title)
- `--font-weight-medium` (Title)
- `--line-height-compact` (Title)

## Behavior

### Show/Hide
- **Show:** Slides up from bottom with 300ms ease-in-out transition
- **Hide:** Slides down with 300ms ease-in-out transition
- **Overlay:** Fades in/out with modal (optional)

### Interactions
- **Escape Key:** Closes modal
- **Click Overlay:** Closes modal
- **Close Button:** Closes modal (manual implementation)

### Z-Index
- **Modal:** 1001
- **Overlay:** 1000

## Accessibility

### Required Attributes

```html
<div class="modal-bottom-sheet"
     role="dialog"
     aria-modal="true"
     aria-labelledby="modalTitle"
     aria-describedby="modalContent">

  <div class="modal-bottom-sheet__header">
    <h3 class="modal-bottom-sheet__title" id="modalTitle">Title</h3>
    <button class="button-tertiary" aria-label="Close modal">
      <!-- icon -->
    </button>
  </div>

  <div class="modal-bottom-sheet__content" id="modalContent">
    <!-- content -->
  </div>
</div>
```

### Focus Management
- Focus should move to modal when opened
- Focus should trap within modal
- Focus should return to trigger element when closed

### Keyboard Navigation
- `Escape` - Close modal
- `Tab` - Navigate through focusable elements
- `Shift+Tab` - Navigate backwards

## Examples in Extension

This pattern is used in:
- `random-question-modal` (dark variant)
- `collection-filter-modal` (light variant)
- `search-modal` (light variant)
- `tag-add-modal` (light variant)
- `messages-modal` (light variant)
- `backup-reminder-modal` (light variant)
- `data-editor-modal` (light variant)

## Best Practices

### Do ✅
- Use light variant for standard modals
- Use dark variant for special actions or highlights
- Keep content concise (max 70vh)
- Provide clear actions in footer
- Use backdrop overlay for focus
- Allow closing via Escape and overlay click

### Don't ❌
- Don't use for critical alerts (use center modal instead)
- Don't exceed 70vh height (use scrolling)
- Don't nest bottom-sheet modals
- Don't forget close button
- Don't use without accessibility attributes

## Related Components

- **Center Modal** - For critical alerts and confirmations
- **Overlay** - Backdrop for modals
- **Button Tertiary** - Close button
- **Button Primary/Secondary** - Action buttons

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Changelog

### v1.0.0 (2025-10-28)
- Initial release
- Light and dark variants
- JavaScript API
- Accessibility features
