# Center Modal

A modal dialog that appears in the center of the screen with a backdrop overlay. Best for critical alerts, confirmations, and important actions.

## Features

- ✅ Centered with backdrop
- ✅ Fade-in/scale animation
- ✅ Responsive (max 480px width)
- ✅ Header, content, footer structure
- ✅ Escape key to close
- ✅ Click outside to close

## Usage

### HTML Structure

```html
<!-- Overlay must wrap the modal -->
<div class="overlay visible">
  <div class="modal-center visible" id="myModal">
    <!-- Header -->
    <div class="modal-center__header">
      <h3 class="modal-center__title">Modal Title</h3>
      <button class="button-tertiary modal-center__close">
        <!-- Close icon -->
      </button>
    </div>

    <!-- Content -->
    <div class="modal-center__content">
      <p>Your content here...</p>
    </div>

    <!-- Footer -->
    <div class="modal-center__footer">
      <button class="button-secondary button-secondary--v2">
        Cancel
      </button>
      <button class="button-primary button-primary--v2">
        Confirm
      </button>
    </div>
  </div>
</div>
```

### JavaScript

```javascript
import { ModalCenter } from './modal-center.js';

const modal = new ModalCenter(document.getElementById('myModal'));

// Show modal
modal.show();

// Hide modal
modal.hide();
```

## CSS Classes

| Class | Description |
|-------|-------------|
| `.modal-center` | Base modal class |
| `.modal-center.visible` | Shown state (fade in) |
| `.modal-center__header` | Header container |
| `.modal-center__title` | Modal title |
| `.modal-center__close` | Close button |
| `.modal-center__content` | Content area |
| `.modal-center__footer` | Footer with actions |
| `.modal-center--no-footer` | Without footer |
| `.modal-center--no-header` | Without header |

## Design Tokens

- `--color-secondary-10` (Background)
- `--color-neutral-30` (Border)
- `--color-neutral-80` (Title)
- `--spacing-sm` (Padding: 16px)
- `--spacing-screen-internal` (Gap: 24px)
- `--radius-lg` (Border radius)

## Examples in Extension

- `beta-checkin-modal` - Uses this pattern

## Best Practices

### Do ✅
- Use for critical alerts and confirmations
- Keep content concise and scannable
- Provide clear primary and secondary actions
- Always show backdrop overlay

### Don't ❌
- Don't use for non-critical information (use bottom-sheet instead)
- Don't nest center modals
- Don't exceed 480px width
- Don't forget accessibility attributes

## Related Components

- **Bottom-Sheet Modal** - For less critical actions
- **Overlay** - Backdrop for modals

## Changelog

### v1.0.0 (2025-10-28)
- Initial release
- Extends ModalBottomSheet logic
