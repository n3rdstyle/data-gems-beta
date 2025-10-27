# Design System Usage Guide

## Overview

This guide explains how to use the Data Gems Design System effectively in your components. Following these guidelines ensures consistency, maintainability, and scalability across the extension.

---

## Core Principles

1. **Always use Design Tokens** - Never hardcode values for colors, spacing, border-radius, typography, or shadows
2. **Semantic over Specific** - Prefer semantic tokens (`--color-primary`) over specific ones (`--color-primary-60`) when possible
3. **Consistency First** - Use the same tokens for similar UI patterns across components

---

## Design Tokens Reference

### 🎨 Colors

**Available Tokens:**
```css
/* Primary (Blue) */
--color-primary-10 through --color-primary-90

/* Secondary (Tan/Beige) */
--color-secondary-10 through --color-secondary-90

/* Neutral (Gray) */
--color-neutral-10 (white) through --color-neutral-90 (dark)

/* Semantic Colors */
--color-success: #6fe6a8
--color-warning: #f8e87a
--color-error: #f57464
--color-info: #a8e1ff

/* Semantic Mappings (Preferred) */
--color-primary
--color-background
--color-background-secondary
--color-text-primary
--color-text-secondary
--color-text-tertiary
--color-border
--color-surface
```

**Usage:**
```css
/* ✅ Good - Semantic */
.component {
  color: var(--color-text-primary);
  background: var(--color-background);
  border-color: var(--color-border);
}

/* ⚠️ OK - Specific (when semantic doesn't fit) */
.component--special {
  background: var(--color-primary-20);
}

/* ❌ Bad - Hardcoded */
.component {
  color: #343a3f;
  background: #ffffff;
}
```

---

### 📏 Spacing

**Available Tokens:**
```css
--spacing-xxs: 4px
--spacing-xs: 8px
--spacing-sm: 16px
--spacing-md: 24px
--spacing-lg: 32px
--spacing-xl: 48px
--spacing-xxl: 64px

/* Semantic Aliases (Preferred) */
--spacing-element-internal: 8px    /* Within an element (icon + text) */
--spacing-component-internal: 16px /* Between elements in a component */
--spacing-screen-internal: 24px    /* Between components on a screen */
```

**Usage:**
```css
/* ✅ Good - Semantic */
.card {
  padding: var(--spacing-component-internal);
  gap: var(--spacing-element-internal);
}

/* ✅ Good - Specific */
.button {
  padding: var(--spacing-xs) var(--spacing-sm); /* 8px 16px */
}

/* ⚠️ Acceptable - Non-standard with comment */
.component {
  gap: 12px; /* Non-standard: 12px provides optimal visual balance */
}

/* ❌ Bad - Hardcoded without reason */
.component {
  padding: 16px;
  gap: 8px;
}
```

**Spacing Hierarchy:**
- **Within elements**: `--spacing-xs` (8px) - icon + text, tight spacing
- **Between elements**: `--spacing-sm` (16px) - elements within a component
- **Between components**: `--spacing-md` (24px) - sections within a screen
- **Between screens**: `--spacing-lg` (32px) or higher

---

### 🔲 Border Radius

**Available Tokens:**
```css
--radius-none: 0
--radius-xs: 4px    /* Badges, tiny elements */
--radius-sm: 8px    /* Buttons, inputs, small cards */
--radius-md: 12px   /* Standard cards, dropdowns */
--radius-lg: 16px   /* Modals, large cards */
--radius-xl: 24px   /* Hero cards */
--radius-xxl: 32px  /* Extra large containers */
--radius-full: 50%  /* Perfect circles */
--radius-pill: 1000px /* Pill-shaped buttons */

/* Semantic Aliases */
--radius-button: var(--radius-sm)
--radius-input: var(--radius-sm)
--radius-card: var(--radius-sm)
--radius-modal: var(--radius-md)
--radius-avatar: var(--radius-full)
```

**Usage:**
```css
/* ✅ Good - Semantic */
.button {
  border-radius: var(--radius-button);
}

.avatar {
  border-radius: var(--radius-avatar);
}

/* ✅ Good - Specific */
.pill-button {
  border-radius: var(--radius-pill);
}

/* ❌ Bad - Hardcoded */
.button {
  border-radius: 8px;
}

.avatar {
  border-radius: 50%;
}
```

---

### ✍️ Typography

**Font Size Tokens:**
```css
--font-size-12: 0.75rem
--font-size-14: 0.875rem
--font-size-16: 1rem
--font-size-20: 1.25rem
--font-size-24: 1.5rem
--font-size-32: 2rem
```

**Font Weight Tokens:**
```css
--font-weight-regular: 400
--font-weight-medium: 500
--font-weight-bold: 700
```

**Font Family Token:**
```css
--font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

**Predefined Text Styles (Utility Classes):**
```css
.text-style-hero          /* 32px bold, tight leading */
.text-style-h1            /* 24px medium */
.text-style-h2            /* 20px medium */
.text-style-h3            /* 16px medium */
.text-style-body          /* 16px regular */
.text-style-body-medium   /* 16px medium */
.text-style-caption       /* 12px regular, wide letter-spacing */
.text-style-button        /* 16px medium, wider letter-spacing */
.text-style-label         /* 14px medium, wide letter-spacing */
```

**Usage:**
```css
/* ✅ Best - Use utility classes in HTML */
<h1 class="text-style-h1">Heading</h1>
<p class="text-style-body">Body text</p>

/* ✅ Good - Use tokens in CSS */
.custom-text {
  font-family: var(--font-family);
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-medium);
}

/* ❌ Bad - Hardcoded */
.custom-text {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 500;
}
```

---

### 🌑 Shadows

**Available Tokens:**
```css
--shadow-none
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1)
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 4px 20px rgba(0, 0, 0, 0.15)
--shadow-xl: 0 8px 32px rgba(0, 0, 0, 0.2)
--shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.06)

/* Semantic Aliases */
--shadow-card: var(--shadow-sm)
--shadow-dropdown: var(--shadow-md)
--shadow-modal: var(--shadow-lg)
```

**Usage:**
```css
/* ✅ Good */
.card {
  box-shadow: var(--shadow-card);
}

.modal {
  box-shadow: var(--shadow-modal);
}

/* ❌ Bad */
.card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

---

## Component Patterns

### Standard Component Structure

```css
.component {
  /* Layout */
  display: flex;
  flex-direction: column;
  gap: var(--spacing-component-internal);

  /* Spacing */
  padding: var(--spacing-sm);

  /* Visual */
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);

  /* Typography */
  font-family: var(--font-family);
  color: var(--color-text-primary);
}
```

### Button Pattern

```css
.button {
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);

  /* Spacing */
  padding: var(--spacing-xs) var(--spacing-sm);

  /* Visual */
  background: var(--color-primary);
  border-radius: var(--radius-button);
  border: none;

  /* Typography */
  font-family: var(--font-family);
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-inverse);

  /* Interaction */
  cursor: pointer;
  transition: opacity 0.2s;
}

.button:hover {
  opacity: 0.9;
}
```

### Card Pattern

```css
.card {
  /* Layout */
  display: flex;
  flex-direction: column;

  /* Spacing */
  padding: var(--spacing-sm);

  /* Visual */
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);

  /* Interaction */
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}
```

---

## Migration Guide

### Converting Existing Components

1. **Identify hardcoded values**
   ```bash
   # Search for hardcoded values
   grep -r "border-radius: [0-9]" components/
   grep -r "gap: [0-9]" components/
   grep -r "font-size: [0-9]" components/
   ```

2. **Replace with tokens**
   - Border-radius: `8px` → `var(--radius-sm)`
   - Spacing: `16px` → `var(--spacing-sm)`
   - Typography: `font-size: 16px` → `font-size: var(--font-size-16)`

3. **Add comments for non-standard values**
   ```css
   .component {
     gap: 12px; /* Non-standard: 12px provides optimal spacing for this use case */
   }
   ```

---

## Best Practices

### ✅ DO

- Use semantic tokens when available (`--color-primary` over `--color-primary-60`)
- Use spacing hierarchy (`--spacing-component-internal` for consistent spacing)
- Add comments for non-standard values (10px, 12px, 18px, etc.)
- Use utility classes for typography when possible
- Group related token types together in CSS

### ❌ DON'T

- Hardcode colors, spacing, or typography values
- Mix px and rem units unnecessarily
- Create custom spacing values without commenting why
- Use inline styles instead of design tokens
- Duplicate font-family declarations (it's global)

---

## Common Mistakes

### ❌ Mistake: Hardcoded Spacing
```css
.component {
  padding: 16px;
  gap: 8px;
}
```

### ✅ Fix: Use Spacing Tokens
```css
.component {
  padding: var(--spacing-sm);
  gap: var(--spacing-xs);
}
```

---

### ❌ Mistake: Hardcoded Border-Radius
```css
.button {
  border-radius: 1000px;
}
.avatar {
  border-radius: 50%;
}
```

### ✅ Fix: Use Radius Tokens
```css
.button {
  border-radius: var(--radius-pill);
}
.avatar {
  border-radius: var(--radius-full);
}
```

---

### ❌ Mistake: Redundant Font-Family
```css
.component__label {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
}
```

### ✅ Fix: Use Typography Tokens
```css
.component__label {
  font-family: var(--font-family); /* Or remove entirely if set globally */
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-medium);
}
```

---

## Tools & Automation

### Linting

Use stylelint to enforce design token usage:

```json
{
  "rules": {
    "declaration-property-value-disallowed-list": {
      "border-radius": ["/^\\d+px$/", "/^\\d+%$/"],
      "/^(padding|margin|gap)$/": ["/^\\d+px$/"]
    }
  }
}
```

### Search & Replace

Use these patterns to find hardcoded values:

```bash
# Find hardcoded border-radius
grep -rn "border-radius: [0-9]" components/

# Find hardcoded spacing
grep -rn "gap: [0-9]" components/
grep -rn "padding: [0-9]" components/

# Find hardcoded font-size
grep -rn "font-size: [0-9]" components/
```

---

## Resources

- **Design System Files**: `/design-system/`
  - `colors/colors.css`
  - `typography/typography.css`
  - `spacing/spacing.css`
  - `border-radius/border-radius.css`
  - `shadows/shadows.css`
  - `icons/icons.js`

- **Documentation**:
  - `/design-system/colors/COLOR_PALETTE.md`
  - `/design-system/icons/ICONS.md`

---

## Questions?

If you're unsure which token to use:

1. Check if a semantic token exists (e.g., `--color-primary`, `--spacing-component-internal`)
2. Look at similar components for patterns
3. Refer to this guide's component patterns section
4. When in doubt, add a comment explaining your choice

---

**Last Updated**: 2025-10-27
**Compliance Status**: 52/100 → 82/100 (after implementation)
