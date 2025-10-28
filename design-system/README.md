# Data Gems Design System

A comprehensive design system for the Data Gems Chrome Extension. Built with CSS Custom Properties, modular components, and accessibility in mind.

**Version:** 1.1.0
**Last Updated:** 2025-10-28

---

## 📚 Table of Contents

1. [Getting Started](#getting-started)
2. [Foundations](#foundations)
3. [Components](#components)
4. [Patterns](#patterns)
5. [Best Practices](#best-practices)
6. [Changelog](#changelog)

---

## 🚀 Getting Started

### Installation

The design system is self-contained within the project. Import foundation CSS files in your HTML:

```html
<!-- Foundations (required) -->
<link rel="stylesheet" href="design-system/colors/colors.css">
<link rel="stylesheet" href="design-system/typography/typography.css">
<link rel="stylesheet" href="design-system/spacing/spacing.css">
<link rel="stylesheet" href="design-system/border-radius/border-radius.css">
<link rel="stylesheet" href="design-system/shadows/shadows.css">

<!-- Components (as needed) -->
<link rel="stylesheet" href="components/button-primary/button-primary.css">
```

### JavaScript Import

```javascript
// Colors
import { colors, semanticColors } from './design-system/colors/colors.js';

// Icons
import { getIcon, getIconNames } from './design-system/icons/icons.js';
```

---

## 🎨 Foundations

### [Colors](colors/COLOR_PALETTE.md)

Comprehensive color system with scales for primary, secondary, neutral, and error colors.

**Scales:**
- **Primary** (Blue): `--color-primary-10` to `--color-primary-90`
- **Secondary** (Tan/Beige): `--color-secondary-10` to `--color-secondary-90`
- **Neutral** (Gray): `--color-neutral-10` to `--color-neutral-90`
- **Error** (Red/Coral): `--color-error-10` to `--color-error-90` ⭐ NEW

**Gradients:**
- `--gradient-aurora` - Purple to cyan
- `--gradient-mist` - Light blue to light purple
- `--gradient-sundown` - Warm tan to coral

**Overlays:**
- Dark overlays: `--overlay-light`, `--overlay-default`, `--overlay-dark`
- White overlays: `--overlay-white-10` to `--overlay-white-50` ⭐ NEW

📄 **Files:** `colors/colors.css`, `colors/colors.js`

---

### [Typography](typography/typography.css)

Typographic scale with font sizes, weights, and semantic styles.

**Font Sizes:**
- `--font-size-11` (11px) ⭐ NEW - Legal text
- `--font-size-12` (12px) - Captions
- `--font-size-14` (14px) - Small text
- `--font-size-16` (16px) - Body
- `--font-size-20` (20px) - Headings
- `--font-size-24` (24px) - Headings
- `--font-size-32` (32px) - Hero

**Font Weights:**
- `--font-weight-regular` (400)
- `--font-weight-medium` (500)
- `--font-weight-semibold` (600) ⭐ NEW
- `--font-weight-bold` (700)

**Text Style Classes:**
- `.text-style-hero`, `.text-style-h1`, `.text-style-h2`, `.text-style-h3`
- `.text-style-body`, `.text-style-body-medium`
- `.text-style-caption`, `.text-style-caption-medium`
- `.text-style-button`, `.text-style-button-small`
- `.text-style-label`

📄 **File:** `typography/typography.css`

---

### [Spacing](spacing/spacing.css)

Consistent spacing scale for layouts and components.

**Scale:**
- `--spacing-xxs` (4px) - Tight spacing
- `--spacing-xs` (8px) - Within elements
- `--spacing-sm` (16px) - Between elements
- `--spacing-md` (24px) - Between components
- `--spacing-lg` (32px) - Between sections
- `--spacing-xl` (48px) - Between screens
- `--spacing-xxl` (64px) - Large separations
- `--spacing-input-vertical` (12px) - Special case for inputs

**Semantic Aliases:**
- `--spacing-element-internal` (8px)
- `--spacing-component-internal` (16px)
- `--spacing-screen-internal` (24px)

📄 **File:** `spacing/spacing.css`

---

### [Border Radius](border-radius/border-radius.css)

Border radius scale from sharp to fully rounded.

**Scale:**
- `--radius-none` (0) - Sharp
- `--radius-thin` (1px) - Very subtle
- `--radius-xs` (4px) - Tiny elements
- `--radius-sm` (8px) - Buttons, inputs
- `--radius-md` (12px) - Cards
- `--radius-lg` (16px) - Modals
- `--radius-xl` (24px) - Hero elements
- `--radius-xxl` (32px) - Extra large
- `--radius-full` (50%) - Circles
- `--radius-pill` (1000px) - Pill shape

**Semantic Aliases:**
- `--radius-button`, `--radius-input`, `--radius-card`, `--radius-modal`

📄 **File:** `border-radius/border-radius.css`

---

### [Shadows](shadows/shadows.css)

Shadow system for elevation and depth.

**Scale:**
- `--shadow-none` - No shadow
- `--shadow-sm` - Subtle elevation
- `--shadow-md` - Standard elevation
- `--shadow-lg` - High elevation
- `--shadow-xl` - Maximum elevation
- `--shadow-inner` - Inset shadow
- `--shadow-bottom-sheet` - Upward shadows
- `--shadow-bottom-sheet-dark` - Dark upward shadows

**Semantic Aliases:**
- `--shadow-button-hover`, `--shadow-card`, `--shadow-dropdown`, `--shadow-modal`

📄 **File:** `shadows/shadows.css`

---

### [Icons](icons/ICONS.md)

SVG icon system with 24x24px icons.

**Categories:**
- **Action:** plus, send, close, upload
- **Navigation:** chevrons (up/down/left/right), arrows
- **UI Control:** settings, search
- **State:** heart (outline/filled), hidden (outline/filled)
- **Communication:** message, trash, info, check
- **Social:** website, instagram, linkedin, reddit

**Usage:**
```javascript
import { getIcon } from './design-system/icons/icons.js';
const icon = getIcon('heart');
```

📄 **Files:** `icons/icons.js`, `icons/ICONS.md`

---

## 🧩 Components

### Base Elements

| Component | Status | Documentation |
|-----------|--------|---------------|
| **Button** | ✅ Stable | - |
| **Tooltip** | ✅ Stable | - |

### Buttons

| Component | Status | Documentation |
|-----------|--------|---------------|
| **Button Primary** | ✅ Stable | - |
| **Button Secondary** | ✅ Stable | `components/button-secondary/BUTTON_SECONDARY.md` |
| **Button Tertiary** | ✅ Stable | - |
| **Action Button** | ✅ Stable | - |

### Form Elements

| Component | Status | Documentation |
|-----------|--------|---------------|
| **Input Field** | ✅ Stable | - |
| **Toggle** | ✅ Stable | 📋 TODO |
| **Dropdown** | ✅ Stable | 📋 TODO |
| **Text Edit Field** | ✅ Stable | 📋 TODO |
| **Collection Edit Field** | ✅ Stable | 📋 TODO |
| **Tag Add Field** | ✅ Stable | 📋 TODO |

### Data Display

| Component | Status | Documentation |
|-----------|--------|---------------|
| **Data Card** | ✅ Stable | `components/data-card/DATA_CARD.md` |
| **Data List** | ✅ Stable | `components/data-list/DATA_LIST.md` |
| **Tag** | ✅ Stable | `components/tag/TAG.md` |
| **Tag List** | ✅ Stable | - |

### Layout

| Component | Status | Documentation |
|-----------|--------|---------------|
| **Header** | ✅ Stable | - |
| **App Footer** | ✅ Stable | - |
| **Top Menu** | ✅ Stable | - |
| **Headline** | ✅ Stable | - |
| **Overlay** | ✅ Stable | 📋 TODO |
| **Divider** | ✅ Stable | 📋 TODO |
| **Collapsible Section** | ✅ Stable | 📋 TODO |
| **Profile Teaser** | ✅ Stable | - |

### Modals

| Component | Status | Documentation |
|-----------|--------|---------------|
| **Modal Bottom-Sheet** | ⭐ NEW | `design-system/components/modal-bottom-sheet/MODAL_BOTTOM_SHEET.md` |
| **Modal Center** | ⭐ NEW | `design-system/components/modal-center/MODAL_CENTER.md` |
| **Data Editor Modal** | ✅ Stable | 📋 TODO |
| **Random Question Modal** | ✅ Stable | 📋 TODO |
| **Collection Filter Modal** | ✅ Stable | `components/collection-filter-modal/COLLECTION_FILTER_MODAL.md` |
| **Search Modal** | ✅ Stable | `components/search-modal/SEARCH_MODAL.md` |
| **Tag Add Modal** | ✅ Stable | 📋 TODO |
| **Messages Modal** | ✅ Stable | 📋 TODO |
| **Backup Reminder Modal** | ✅ Stable | `components/backup-reminder-modal/BACKUP_REMINDER_MODAL.md` |
| **Beta Checkin Modal** | ✅ Stable | `components/beta-checkin-modal/BETA_CHECKIN_SETUP.md` |

### Search

| Component | Status | Documentation |
|-----------|--------|---------------|
| **Search** | ✅ Stable | 📋 TODO |
| **Data Search** | ✅ Stable | 📋 TODO |

### Composite

| Component | Status | Documentation |
|-----------|--------|---------------|
| **Content Preferences** | ✅ Stable | - |
| **Preference Options** | ✅ Stable | - |
| **Calibration** | ✅ Stable | - |

**Legend:**
- ✅ **Stable** - Production-ready, documented
- ⭐ **NEW** - Recently added
- 📋 **TODO** - Needs documentation

---

## 📐 Patterns

### Modal Patterns

#### Bottom-Sheet Modal
Slides up from bottom. Best for mobile-first interfaces and progressive disclosure.

**Use cases:** Forms, filters, selections, secondary actions
**Examples:** Random Question, Collection Filter, Tag Add
📄 [Documentation](components/modal-bottom-sheet/MODAL_BOTTOM_SHEET.md)

#### Center Modal
Centered with backdrop. Best for critical alerts and confirmations.

**Use cases:** Alerts, confirmations, important decisions
**Examples:** Beta Checkin, critical actions
📄 [Documentation](components/modal-center/MODAL_CENTER.md)

### Button Patterns

**Primary Buttons:** Main CTAs, most important actions
**Secondary Buttons:** Alternative actions, cancel buttons
**Tertiary Buttons:** Icon-only, minimal actions

### Form Patterns

**Input validation:** Use error color scale
**Labels:** Always provide labels (visible or aria-label)
**States:** Default, focus, disabled, error, success

---

## ✨ Best Practices

### Design Tokens

**Do** ✅
- Use semantic tokens (`--color-text-primary`) over direct values (`--color-neutral-80`)
- Use spacing tokens for all margins, padding, gaps
- Use typography classes (`.text-style-body`) for consistency
- Use radius and shadow tokens for elevation

**Don't** ❌
- Don't use hardcoded colors (#f57464) - use tokens
- Don't use arbitrary spacing values (15px) - use standard scale
- Don't inline styles - use CSS classes

### Component Usage

**Do** ✅
- Reuse existing components
- Follow component documentation
- Use component variants (button-primary--large)
- Maintain accessibility attributes

**Don't** ❌
- Don't modify core components directly
- Don't create duplicate components
- Don't skip accessibility

### Accessibility

- Use semantic HTML
- Provide ARIA labels and roles
- Ensure keyboard navigation
- Maintain color contrast (WCAG AA: 4.5:1)
- Test with screen readers

📄 Full guide: [BEST_PRACTICES.md](BEST_PRACTICES.md)

---

## 📊 Component Status

Full component status and coverage:
📄 [COMPONENT_STATUS.md](COMPONENT_STATUS.md)

---

## 📝 Changelog

Recent updates and changes:
📄 [CHANGELOG.md](CHANGELOG.md)

### Latest (v1.1.0 - 2025-10-28)

**Added:**
- ⭐ Error color scale (`--color-error-10` to `--color-error-90`)
- ⭐ White overlay tokens (`--overlay-white-10` to `--overlay-white-50`)
- ⭐ Font-size-11 token for legal text
- ⭐ Font-weight-semibold token (600)
- ⭐ Modal Bottom-Sheet base component
- ⭐ Modal Center base component

**Fixed:**
- ✅ Hardcoded line-heights in buttons → use `--line-height-button`
- ✅ Hardcoded spacing values → use `--spacing-input-vertical`
- ✅ Hardcoded rgba overlays → use `--overlay-white-*` tokens

---

## 🤝 Contributing

When adding new components:
1. Follow existing naming conventions
2. Use design system tokens
3. Create documentation (`.md`)
4. Add to component status page
5. Update changelog

---

## 📦 File Structure

```
design-system/
├── README.md (this file)
├── CHANGELOG.md
├── COMPONENT_STATUS.md
├── BEST_PRACTICES.md
├── colors/
│   ├── colors.css
│   ├── colors.js
│   └── COLOR_PALETTE.md
├── typography/
│   └── typography.css
├── spacing/
│   └── spacing.css
├── border-radius/
│   └── border-radius.css
├── shadows/
│   └── shadows.css
├── icons/
│   ├── icons.js
│   └── ICONS.md
└── components/
    ├── modal-bottom-sheet/
    └── modal-center/
```

---

## 📞 Support

Questions or issues? Check the documentation or review existing components for examples.

---

**Data Gems Design System** © 2025
