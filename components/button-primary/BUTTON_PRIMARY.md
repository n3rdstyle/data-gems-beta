# Button Primary

Primary action button with gradient background. Used for the most important action on a screen.

## Variants

**Default** - Gradient (sundown)
```html
<button class="button-primary">Click me</button>
```

**Neutral** - Dark background (for gradient backgrounds)
```html
<button class="button-primary button-primary--neutral">Click me</button>
```

**Dark** - Primary dark (for modals)
```html
<button class="button-primary button-primary--dark">Click me</button>
```

**V2** - Compact version (40px height)
```html
<button class="button-primary button-primary--v2">Click me</button>
```

## Sizes

| Size | Height | Class |
|------|--------|-------|
| Large | 48px | `button-primary--large` |
| Medium (default) | 40px | - |
| Small | 32px | `button-primary--small` |

```html
<button class="button-primary button-primary--large">Large</button>
<button class="button-primary">Medium</button>
<button class="button-primary button-primary--small">Small</button>
```

## With Icon

```html
<button class="button-primary">
  <span class="button-primary__icon">
    <svg><!-- icon --></svg>
  </span>
  Button Text
</button>
```

## States

- **Default** - Gradient background
- **Hover** - opacity: 0.9
- **Active** - scale(0.98)
- **Disabled** - opacity: 0.5, cursor: not-allowed

```html
<button class="button-primary" disabled>Disabled</button>
```

## Design Tokens

- Background: `--gradient-sundown`, `--color-neutral-80`, `--color-primary-90`
- Text: `--color-neutral-10` (white)
- Border radius: `--radius-pill`
- Spacing: `--spacing-xs`, `--spacing-sm`
- Typography: `--line-height-button`

## Best Practices

### Do ✅
- Use for primary/most important action
- One primary button per screen
- Clear, action-oriented labels ("Save", "Continue")
- Use neutral variant on gradient backgrounds

### Don't ❌
- Don't use multiple primary buttons
- Don't use for destructive actions
- Don't use for navigation
- Don't make label too long

## Related
- **Button Secondary** - For secondary actions
- **Button Tertiary** - For minimal actions
