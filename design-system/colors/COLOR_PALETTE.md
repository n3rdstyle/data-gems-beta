# Color Palette - Data Gems Chrome Extension

Color palette extracted from Figma design system for the Data Gems Chrome extension.

## Color Scales

### Primary (Blue Brand Colors)
Main brand colors used for primary actions, highlights, and brand elements.

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-primary-10` | `#f5fcff` | Lightest tint, backgrounds |
| `--color-primary-20` | `#e6f8ff` | Light backgrounds, hover states |
| `--color-primary-30` | `#cff1ff` | Subtle accents |
| `--color-primary-40` | `#afe9ff` | Secondary elements |
| `--color-primary-50` | `#7fdeff` | Interactive elements |
| `--color-primary-60` | `#4accf9` | **Primary brand color** |
| `--color-primary-70` | `#13b3eb` | Hover states |
| `--color-primary-80` | `#0e93c4` | Active/pressed states |
| `--color-primary-90` | `#0a7096` | Darkest shade |

### Secondary (Warm Tan/Beige Colors)
Warm neutral colors for softer UI elements and backgrounds.

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-secondary-10` | `#fefbf6` | Warm backgrounds |
| `--color-secondary-20` | `#fcf4e8` | Card backgrounds |
| `--color-secondary-30` | `#faeacf` | Borders, dividers |
| `--color-secondary-40` | `#f9ddb5` | Subtle elements |
| `--color-secondary-50` | `#f9d8a3` | Secondary text |
| `--color-secondary-60` | `#f3be76` | Accent elements |
| `--color-secondary-70` | `#c77f28` | Strong accents |
| `--color-secondary-80` | `#c77f28` | Active states |
| `--color-secondary-90` | `#a5661f` | Darkest warm accent |

### Neutral (Gray Colors)
Main neutral colors for text, borders, and UI structure.

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-neutral-10` | `#ffffff` | White, backgrounds |
| `--color-neutral-20` | `#f8fafb` | Light backgrounds |
| `--color-neutral-30` | `#e6eaec` | Borders, dividers |
| `--color-neutral-40` | `#ccd2d6` | Inactive elements |
| `--color-neutral-50` | `#98a0a6` | Disabled states, tertiary text |
| `--color-neutral-60` | `#6c757c` | Secondary text |
| `--color-neutral-70` | `#50585e` | Headings |
| `--color-neutral-80` | `#343a3f` | **Primary text color** |
| `--color-neutral-90` | `#1e2225` | Darkest shade |

## Semantic Colors

| Variable | Hex | Purpose |
|----------|-----|---------|
| `--color-success` | `#6fe6a8` | Success states, confirmations |
| `--color-warning` | `#f8e87a` | Warnings, cautions |
| `--color-error` | `#f57464` | Errors, destructive actions |
| `--color-info` | `#a8e1ff` | Information, tips |

## Gradients

```css
--gradient-aurora: linear-gradient(45deg, #C9A2FF 42.75%, #7FDEFF 100%);
--gradient-mist: linear-gradient(to bottom, #f5fcff, #f3e8ff);
--gradient-sundown: linear-gradient(133deg, #F9D8A3 16.05%, #F57464 76.12%);
```

**Aurora**: Purple to cyan gradient at 45° angle
**Mist**: Light blue to light purple vertical gradient
**Sundown**: Warm beige/tan to coral gradient at 133° angle

## Usage

### CSS
Import the color palette in your main CSS file:

```css
@import './design-system/colors.css';

/* Use CSS variables */
.button {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: 1px solid var(--color-border);
}

/* Or use utility classes */
<div class="bg-primary text-inverse">Primary Button</div>
```

### JavaScript
Import colors for programmatic use:

```javascript
import { colors, semanticColors } from './design-system/colors.js';

// Use color values
const primaryColor = semanticColors.primary; // #4accf9
const textColor = semanticColors.text.primary; // #343a3f

// Access color scales
const lightBlue = colors.primary[30]; // #cff1ff
const warmBg = colors.secondary[10]; // #fefbf6
```

### HTML
Link the CSS file in your HTML:

```html
<link rel="stylesheet" href="design-system/colors.css">
```

## Semantic Mappings

For consistent usage, use semantic variables instead of direct color values:

- **Primary**: `var(--color-primary)` - Main brand color
- **Backgrounds**: `var(--color-background)`, `var(--color-background-secondary)`
- **Text**: `var(--color-text-primary)`, `var(--color-text-secondary)`
- **Borders**: `var(--color-border)`, `var(--color-border-light)`
- **Surface**: `var(--color-surface)`, `var(--color-surface-hover)`

## Dark Mode

The color system includes automatic dark mode support via `prefers-color-scheme: dark`. The semantic variables will automatically adjust when dark mode is enabled.

## Best Practices

1. **Use semantic variables** for most UI elements instead of direct color values
2. **Maintain contrast ratios** for accessibility (WCAG AA: 4.5:1 for text)
3. **Use primary scale** (blue) for primary actions and brand elements
4. **Use neutral scale** (gray) for text hierarchy and UI structure
5. **Use secondary scale** (tan/beige) for warm, approachable secondary elements
6. **Reserve semantic colors** for specific purposes (success, error, warning, info)
7. **Apply gradients sparingly** for special highlights or hero elements:
   - **Aurora** - Purple gradient for mystical/premium elements
   - **Mist** - Blue gradient for primary highlights
   - **Sundown** - Coral/orange gradient for warm accents
