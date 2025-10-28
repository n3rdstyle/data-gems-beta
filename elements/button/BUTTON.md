# Button Element

Base button component supporting primary and tertiary variants. Foundation for all button components.

## Features

- ✅ Primary variant (solid, gradient, neutral)
- ✅ Tertiary variant (icon, text)
- ✅ Multiple sizes (medium, small)
- ✅ Icon support
- ✅ Disabled state
- ✅ Collapse/expand state (for tertiary)

## Basic Usage

```javascript
// Primary button
const primaryBtn = createButton({
  variant: 'primary',
  purpose: 'default',
  size: 'medium',
  label: 'Save Changes',
  onClick: () => {
    saveData();
  }
});

// Tertiary icon button
const tertiaryBtn = createButton({
  variant: 'tertiary',
  size: 'medium',
  icon: 'close',
  ariaLabel: 'Close',
  onClick: () => {
    closeModal();
  }
});

document.body.appendChild(primaryBtn.element);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | string | `'primary'` | Button variant: 'primary', 'tertiary' |
| `purpose` | string | `'default'` | Primary purpose: 'default', 'gradient', 'neutral' |
| `size` | string | `'medium'` | Button size: 'medium', 'small' |
| `label` | string | `'Button'` | Button text (primary variant) |
| `icon` | string | `null` | Icon name (tertiary variant) |
| `text` | string | `null` | Text label (tertiary text variant) |
| `filled` | boolean | `false` | Use filled icon (tertiary variant) |
| `onClick` | function | `null` | Click handler |
| `disabled` | boolean | `false` | Disabled state |
| `ariaLabel` | string | `''` | Accessibility label |

## Variants

### Primary Button

**Default (Solid):**
```javascript
const btn = createButton({
  variant: 'primary',
  purpose: 'default',
  size: 'medium',
  label: 'Continue'
});
```

**Gradient:**
```javascript
const btn = createButton({
  variant: 'primary',
  purpose: 'gradient',
  label: 'Get Started'
});
```

**Neutral (for gradient backgrounds):**
```javascript
const btn = createButton({
  variant: 'primary',
  purpose: 'neutral',
  label: 'Cancel'
});
```

### Tertiary Button

**Icon (Medium 40x40):**
```javascript
const btn = createButton({
  variant: 'tertiary',
  size: 'medium',
  icon: 'settings',
  ariaLabel: 'Settings'
});
```

**Icon (Small 24x24):**
```javascript
const btn = createButton({
  variant: 'tertiary',
  size: 'small',
  icon: 'close',
  ariaLabel: 'Close'
});
```

**Icon (Filled):**
```javascript
const btn = createButton({
  variant: 'tertiary',
  icon: 'heart',
  filled: true, // Uses heartFilled icon
  ariaLabel: 'Unfavorite'
});
```

**Text:**
```javascript
const btn = createButton({
  variant: 'tertiary',
  text: 'Cancel',
  onClick: () => { ... }
});
```

## Sizes

### Primary

| Size | Height | Class |
|------|--------|-------|
| Medium | 40px | `button--primary--medium` |
| Small | 32px | `button--primary--small` |

### Tertiary

| Size | Dimensions | Class |
|------|------------|-------|
| Medium (icon) | 40x40px | `button--tertiary--medium` |
| Small (icon) | 24x24px | `button--tertiary--small` |
| Text | Auto width | `button--tertiary--text` |

## API

```javascript
const btn = createButton({ variant: 'primary', label: 'Save' });

// Label (primary only)
btn.setLabel('Update');
btn.getLabel(); // Returns 'Update'

// Icon (tertiary only)
btn.setIcon('check');

// Text (tertiary text variant only)
btn.setText('Confirm');

// Disabled state
btn.setDisabled(true);
btn.isDisabled(); // Returns true
btn.enable();
btn.disable();

// Collapse state (for expand buttons)
btn.setCollapsed(true); // Rotates icon 180°
btn.toggleCollapsed(); // Toggle collapse state
btn.isCollapsed(); // Returns true/false

// Programmatic click
btn.click(); // Triggers onClick (if not disabled)

// Access DOM element
btn.element;
```

## States

### Primary Button
- **Default**: Solid primary color
- **Hover**: Lighter shade
- **Active**: Even lighter + scale(0.98)
- **Disabled**: opacity: 0.5

### Tertiary Button
- **Default**: Transparent
- **Hover**: Light gray background
- **Active**: Darker gray background
- **Disabled**: opacity: 0.5, transparent on hover

## Collapse State

Useful for expand/collapse buttons:

```javascript
const expandBtn = createButton({
  variant: 'tertiary',
  icon: 'chevronUp',
  ariaLabel: 'Toggle section'
});

// Collapsed state rotates icon 180°
expandBtn.setCollapsed(true); // Icon points down
expandBtn.setCollapsed(false); // Icon points up
```

## Backward Compatibility

```javascript
// Old API (still supported)
const primaryBtn = createPrimaryButton({
  variant: 'gradient',
  size: 'default',
  label: 'Save'
});

const tertiaryBtn = createTertiaryButton({
  icon: 'close',
  size: 'default',
  ariaLabel: 'Close'
});

// Maps to new createButton API internally
```

## Design Tokens

**Primary:**
- Background (default): `--color-primary-90`
- Background (gradient): `--gradient-sundown`
- Background (neutral): `--color-neutral-80`
- Text: `--color-secondary-10` or `--color-neutral-10`
- Border radius: `32px` (pill)
- Padding: `8px 16px`

**Tertiary:**
- Background (hover): `--color-neutral-20`
- Background (active): `--color-neutral-30`
- Text/Icon: `--color-neutral-80`
- Border radius: `1000px` (circle for icon), `8px` (for text)
- Icon size: 24px (medium), 16px (small)

## Use Cases

- **Primary**: Main actions (Save, Continue, Submit)
- **Primary (gradient)**: Hero CTAs, special actions
- **Primary (neutral)**: Actions on gradient backgrounds
- **Tertiary (icon)**: Close buttons, settings, navigation
- **Tertiary (text)**: Cancel, Skip, Back

## Accessibility

```html
<!-- Primary button -->
<button class="button button--primary--medium text-style-body-medium">
  Save Changes
</button>

<!-- Tertiary icon button -->
<button
  class="button button--tertiary--medium"
  aria-label="Close dialog"
  type="button"
>
  <span class="button__icon">
    <!-- icon SVG -->
  </span>
</button>

<!-- Tertiary text button -->
<button class="button button--tertiary--text">
  <span class="button__text text-style-body-medium">Cancel</span>
</button>
```

**Best Practices:**
- Always provide `aria-label` for icon-only buttons
- Use semantic `type="button"` (not submit unless in form)
- Ensure sufficient color contrast
- Provide visible focus indicator

## Best Practices

### Do ✅
- Use primary for main action
- Provide aria-label for icon buttons
- Use filled icons for active/selected state
- Disable during loading/processing
- Use appropriate size for context

### Don't ❌
- Don't use multiple primary buttons together
- Don't forget aria-label on icon buttons
- Don't use tertiary for important actions
- Don't make buttons too small (min 24x24)

## Related

- **Button Primary** - Higher-level primary button component
- **Button Tertiary** - Higher-level tertiary button component
- **Action Button** - List-item button pattern
- **All Modal Components** - Use buttons for actions
