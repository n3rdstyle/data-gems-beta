# CSS Linting Setup Guide

This document explains how to set up and use CSS linting to enforce Design System compliance.

---

## Installation

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `stylelint` - CSS linter
- `stylelint-config-standard` - Standard stylelint configuration

---

## Usage

### Lint All CSS Files

```bash
npm run lint:css
```

This checks all `.css` files (except those in `.stylelintignore`) for:
- Hardcoded border-radius values
- Hardcoded spacing values (padding, margin, gap)
- Hardcoded font-size and font-weight values
- Hardcoded color values (hex, rgb, rgba)

### Auto-fix Issues

```bash
npm run lint:css:fix
```

⚠️ **Note**: Some issues cannot be auto-fixed and require manual intervention.

### Detailed Report

```bash
npm run lint:css:report
```

Shows a detailed report with line numbers and suggestions.

---

## Rules Enforced

### 🔴 Border-Radius

**Disallowed:**
```css
.component {
  border-radius: 8px;        /* ❌ */
  border-radius: 50%;        /* ❌ */
  border-radius: 1000px;     /* ❌ */
}
```

**Required:**
```css
.component {
  border-radius: var(--radius-sm);   /* ✅ */
  border-radius: var(--radius-full); /* ✅ */
  border-radius: var(--radius-pill); /* ✅ */
}
```

---

### 🔴 Spacing (padding, margin, gap)

**Disallowed:**
```css
.component {
  padding: 16px;      /* ❌ */
  margin: 8px;        /* ❌ */
  gap: 24px;          /* ❌ */
}
```

**Required:**
```css
.component {
  padding: var(--spacing-sm);   /* ✅ */
  margin: var(--spacing-xs);    /* ✅ */
  gap: var(--spacing-md);       /* ✅ */
}
```

**Exception - Non-standard values with comments:**
```css
.component {
  gap: 12px; /* Non-standard: 12px provides optimal visual balance */ /* ✅ */
}
```

---

### 🔴 Typography (font-size, font-weight)

**Disallowed:**
```css
.component {
  font-size: 16px;    /* ❌ */
  font-weight: 500;   /* ❌ */
}
```

**Required:**
```css
.component {
  font-size: var(--font-size-16);           /* ✅ */
  font-weight: var(--font-weight-medium);   /* ✅ */
}
```

---

### 🔴 Colors

**Disallowed:**
```css
.component {
  color: #343a3f;                 /* ❌ */
  background-color: #ffffff;      /* ❌ */
  background: rgba(0, 0, 0, 0.5); /* ❌ */
}
```

**Required:**
```css
.component {
  color: var(--color-text-primary);     /* ✅ */
  background-color: var(--color-background); /* ✅ */
  background: var(--overlay-default);   /* ✅ */
}
```

---

## Exemptions

Files in `.stylelintignore` are exempt from linting:

- `node_modules/` - Dependencies
- `design-system/**/*.css` - Design system definitions (these define the tokens)
- `dist/` and `build/` - Build output
- `vendor/` - Third-party code

---

## Integration

### Pre-commit Hook (Optional)

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/sh
npm run lint:css
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

### VS Code Integration (Optional)

Install the Stylelint extension:
```
ext install stylelint.vscode-stylelint
```

Add to `.vscode/settings.json`:
```json
{
  "css.validate": false,
  "stylelint.enable": true,
  "stylelint.validate": ["css"],
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true
  }
}
```

---

## Troubleshooting

### Error: "Cannot find module 'stylelint'"

**Solution:** Run `npm install`

### Warning: "Unexpected unknown at-rule"

**Solution:** This is usually fine for CSS custom properties. Ignore or add to exemptions.

### Many errors after setup

**Solution:** This is expected if the codebase hasn't been using design tokens. Follow the migration guide in `DESIGN_SYSTEM_USAGE.md`.

---

## Continuous Improvement

### Adding New Rules

Edit `.stylelintrc.json` to add more rules. See [Stylelint Rules](https://stylelint.io/user-guide/rules/) for options.

### Customizing Messages

Edit the `message` field in `.stylelintrc.json` rules to provide better guidance.

---

## Resources

- [Stylelint Documentation](https://stylelint.io/)
- [Design System Usage Guide](./DESIGN_SYSTEM_USAGE.md)
- [Design System Compliance Report](./DESIGN_SYSTEM_COMPLIANCE_REPORT.md)

---

**Last Updated**: 2025-10-27
