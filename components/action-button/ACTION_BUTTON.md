# Action Button

A list-item button for navigation, external links, and actions. Displays label with optional caption and trailing icon/button.

## Variants

### Navigation (Internal Link)
Shows chevron-right icon.

```html
<div class="action-button action-button--navigation">
  <span class="action-button__label">Settings</span>
  <span class="action-button__icon"><!-- chevron --></span>
</div>
```

### External Link
Shows arrow-up-right icon.

```html
<div class="action-button action-button--external">
  <span class="action-button__label">Visit Website</span>
  <span class="action-button__icon"><!-- arrow --></span>
</div>
```

### With Caption
Two-line variant with label + caption.

```html
<div class="action-button action-button--navigation">
  <div class="action-button__label-wrapper">
    <span class="action-button__label">Beta Community</span>
    <span class="action-button__caption">Join our Discord server</span>
  </div>
  <span class="action-button__icon"><!-- icon --></span>
</div>
```

### With CTA Button
Shows primary button instead of icon.

```html
<div class="action-button action-button--cta">
  <div class="action-button__label-wrapper">
    <span class="action-button__label">Get Early Access</span>
    <span class="action-button__caption">Be the first to try new features</span>
  </div>
  <button class="button-primary button-primary--v2 button-primary--small action-button__cta-button">
    Join
  </button>
</div>
```

### With Secondary Button
Shows secondary button instead of icon.

```html
<div class="action-button action-button--secondary">
  <span class="action-button__label">Export Data</span>
  <button class="button-secondary button-secondary--v2 button-secondary--small action-button__secondary-button">
    Export
  </button>
</div>
```

### With Toggle
Shows caption row with toggle switch.

```html
<div class="action-button">
  <div class="action-button__label-wrapper">
    <span class="action-button__label">Dark Mode</span>
    <div class="action-button__caption-row">
      <span class="action-button__caption">Enable dark theme</span>
      <div class="toggle action-button__toggle" data-state="off">
        <!-- toggle component -->
      </div>
    </div>
  </div>
</div>
```

## Structure

```
┌──────────────────────────────┐
│ Label                     [→]│
└──────────────────────────────┘

┌──────────────────────────────┐
│ Label                         │
│ Caption                   [→]│
└──────────────────────────────┘

┌──────────────────────────────┐
│ Label                         │
│ Caption              [Button] │
└──────────────────────────────┘
```

## CSS Classes

| Class | Description |
|-------|-------------|
| `.action-button` | Base class |
| `.action-button--navigation` | Navigation variant (chevron) |
| `.action-button--external` | External link variant (arrow) |
| `.action-button--cta` | With CTA button |
| `.action-button--secondary` | With secondary button |
| `.action-button--disabled` | Disabled state |
| `.action-button__label` | Main label text |
| `.action-button__caption` | Secondary text |
| `.action-button__icon` | Trailing icon (16x16) |
| `.action-button__cta-button` | CTA button |
| `.action-button__secondary-button` | Secondary button |
| `.action-button__toggle` | Toggle switch |

## States

- **Default** - Normal state
- **Hover** - opacity: 0.8
- **Disabled** - opacity: 0.5, cursor: not-allowed

## Use Cases

- **Navigation** - Link to settings, profile, screens
- **External** - Open external websites, help docs
- **CTA** - Call-to-action within a list
- **Toggle** - Settings with on/off state
- **Actions** - Export, backup, share buttons

## Design Tokens

- Text: `--color-neutral-80`
- Icon: `--color-neutral-80`
- Spacing: `--spacing-xs` (gap between elements)

## JavaScript Usage

```javascript
const actionButton = createActionButton({
  label: 'Settings',
  caption: 'Manage your preferences',
  variant: 'navigation',
  onClick: () => {
    navigateTo('/settings');
  }
});
```

## Best Practices

### Do ✅
- Use navigation variant for internal links
- Use external variant for external URLs
- Provide caption for clarity when needed
- Use consistent icon sizes (16px)

### Don't ❌
- Don't use for primary screen actions
- Don't make caption too long
- Don't mix multiple action types

## Accessibility

- Use semantic `<button>` or `<a>` elements
- Provide aria-label for icon-only actions
- Ensure color contrast for text
- Support keyboard navigation

## Related

- **Button Primary/Secondary** - Used in CTA/secondary variants
- **Toggle** - Used in toggle variant
- **Top Menu** - Uses action button pattern
