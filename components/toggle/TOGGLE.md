# Toggle

Switch toggle for binary on/off states. 44px wide with smooth animation.

## Features

- ✅ Clean on/off switch animation
- ✅ Smooth thumb transition
- ✅ Optional label
- ✅ Disabled state
- ✅ Programmatic control

## Basic Usage

```javascript
const toggle = createToggle({
  label: 'Dark Mode',
  active: false,
  onChange: (isActive) => {
    console.log('Toggle is now:', isActive ? 'ON' : 'OFF');
  }
});

document.body.appendChild(toggle.element);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `label` | string | `''` | Optional text label |
| `active` | boolean | `false` | Initial state (on/off) |
| `disabled` | boolean | `false` | Disabled state |
| `onChange` | function | `null` | Callback when state changes |

## Structure

```
┌──────────────────────────┐
│ [○    ] Dark Mode        │  OFF state
└──────────────────────────┘

┌──────────────────────────┐
│ [    ○] Dark Mode        │  ON state
└──────────────────────────┘
```

## API

```javascript
const toggle = createToggle({ label: 'Dark Mode' });

// Get current state
toggle.isActive(); // Returns true or false

// Set state programmatically
toggle.setActive(true); // Turn on
toggle.setActive(false); // Turn off

// Toggle state
toggle.toggle(); // Flip current state

// Disable/enable
toggle.setDisabled(true);
toggle.setDisabled(false);

// Update label
toggle.setLabel('New Label');

// Access DOM element
toggle.element;
```

## Dimensions

- **Track**: 44px × 24px
- **Thumb**: 20px × 20px
- **Thumb position**: 2px from edges
- **Travel distance**: 20px

## States

- **Default OFF** - Gray background, thumb on left
- **Active ON** - Primary color background, thumb on right
- **Disabled** - opacity: 0.5, cursor: not-allowed

## Use Cases

- Settings toggles (Dark mode, notifications, etc.)
- Feature enable/disable
- Privacy settings
- Boolean preferences

## Design Tokens

- Track (inactive): `--color-neutral-40`
- Track (active): `--color-primary-90`
- Thumb: `--color-neutral-10` (white)
- Border radius: `--radius-md`
- Shadow: `--shadow-sm`
- Gap: `--spacing-xs`

## Example: Settings List

```javascript
const settings = [
  { id: 'notifications', label: 'Push Notifications', default: true },
  { id: 'darkMode', label: 'Dark Mode', default: false },
  { id: 'autoSave', label: 'Auto-save', default: true }
];

settings.forEach(setting => {
  const toggle = createToggle({
    label: setting.label,
    active: setting.default,
    onChange: (isActive) => {
      saveUserPreference(setting.id, isActive);
    }
  });

  settingsContainer.appendChild(toggle.element);
});
```

## Accessibility

```html
<div class="toggle" role="switch" aria-checked="false" tabindex="0">
  <div class="toggle__track">
    <div class="toggle__thumb"></div>
  </div>
  <span class="toggle__label">Dark Mode</span>
</div>
```

**Best Practices:**
- Add `role="switch"` to the toggle container
- Use `aria-checked` to indicate state
- Provide keyboard support (Space/Enter to toggle)
- Ensure label is descriptive

## Best Practices

### Do ✅
- Use for binary states (on/off, yes/no, enabled/disabled)
- Provide clear labels
- Show immediate feedback on toggle
- Use for settings and preferences

### Don't ❌
- Don't use for actions (use buttons instead)
- Don't use for mutually exclusive options (use radio buttons)
- Don't forget to provide a label
- Don't disable without showing why

## Related

- **Action Button (toggle variant)** - Toggle within a list item
- **Checkbox** - For multi-select options
