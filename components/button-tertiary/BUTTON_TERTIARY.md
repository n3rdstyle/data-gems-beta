# Button Tertiary

Minimal button for tertiary actions. Supports both icon-only and text variants.

## Icon Variant

**Default (40x40px)**
```html
<button class="button-tertiary">
  <span class="button-tertiary__icon">
    <svg><!-- 24x24 icon --></svg>
  </span>
</button>
```

**Small (24x24px)**
```html
<button class="button-tertiary button-tertiary--small">
  <span class="button-tertiary__icon">
    <svg><!-- 16x16 icon --></svg>
  </span>
</button>
```

**Filled** - Permanent background
```html
<button class="button-tertiary button-tertiary--filled">
  <span class="button-tertiary__icon">
    <svg><!-- icon --></svg>
  </span>
</button>
```

## Text Variant

```html
<button class="button-tertiary button-tertiary--text">
  <span class="button-tertiary__text">Button Text</span>
</button>
```

**With Icon**
```html
<button class="button-tertiary button-tertiary--text">
  <span class="button-tertiary__icon">
    <svg><!-- icon --></svg>
  </span>
  <span class="button-tertiary__text">Button Text</span>
</button>
```

## Text Sizes

| Size | Height | Class |
|------|--------|-------|
| Large | 48px | `button-tertiary--text button-tertiary--large` |
| Medium | 40px | Default |
| Small | 32px | `button-tertiary--text button-tertiary--small` |

## States

- **Default** - Transparent background
- **Hover** - `--color-neutral-20` background
- **Active** - `--color-neutral-30` background
- **Disabled** - opacity: 0.4

**Filled Variant States:**
- **Default** - `--color-neutral-80` background
- **Hover** - `--color-neutral-70` background
- **Active** - `--color-neutral-90` background

## Use Cases

**Icon-only:**
- Close buttons (X)
- Settings
- Navigation (chevrons)
- Expand/collapse
- Delete/trash

**Text:**
- Cancel buttons
- Back/Skip navigation
- Tertiary actions

## Design Tokens

- Background: `--color-neutral-20` (hover), `--color-neutral-80` (filled)
- Text: `--color-neutral-80`
- Border radius: `--radius-pill` (icon), `--radius-sm` (text)
- Spacing: `--spacing-xs`, `--spacing-sm`

## Best Practices

### Do ✅
- Use for least important actions
- Use icon-only for recognizable actions (X, trash, etc.)
- Add aria-label to icon-only buttons
- Use text variant when action needs clarity

### Don't ❌
- Don't use for primary actions
- Don't forget aria-label on icon-only
- Don't use too many on one screen

## Accessibility

```html
<button class="button-tertiary" aria-label="Close">
  <span class="button-tertiary__icon" aria-hidden="true">
    <svg><!-- icon --></svg>
  </span>
</button>
```

## Related
- **Button Primary** - For primary actions
- **Button Secondary** - For secondary actions
