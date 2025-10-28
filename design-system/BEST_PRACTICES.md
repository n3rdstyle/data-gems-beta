# Design System Best Practices

Guidelines for using the Data Gems Design System effectively.

**Last Updated:** 2025-10-28

---

## 📚 Table of Contents

1. [Design Tokens](#design-tokens)
2. [Component Usage](#component-usage)
3. [Accessibility](#accessibility)
4. [CSS Patterns](#css-patterns)
5. [JavaScript Patterns](#javascript-patterns)
6. [Common Mistakes](#common-mistakes)

---

## 🎨 Design Tokens

### Color Usage

#### ✅ Do

**Use semantic color tokens for context:**
```css
color: var(--color-text-primary);
background: var(--color-background);
border-color: var(--color-border);
```

**Use color scales for states:**
```css
/* Light to dark progression */
background: var(--color-primary-20);  /* Hover */
background: var(--color-primary-60);  /* Default */
background: var(--color-primary-80);  /* Active */
```

**Use error scale for error states:**
```css
.error-message {
  color: var(--color-error-60);
  background: var(--color-error-10);
  border-color: var(--color-error-30);
}
```

**Use white overlays on dark backgrounds:**
```css
.button-on-gradient:hover {
  background: var(--overlay-white-20);
}
```

#### ❌ Don't

**Don't use hardcoded colors:**
```css
/* BAD */
color: #f57464;
background: rgb(255, 255, 255);
```

**Don't use direct scale values for semantic purposes:**
```css
/* BAD - use semantic tokens */
color: var(--color-neutral-80);

/* GOOD */
color: var(--color-text-primary);
```

**Don't create new colors without adding to design system:**
```css
/* BAD */
--my-custom-blue: #1234ab;
```

---

### Spacing Usage

#### ✅ Do

**Use spacing tokens for all layout:**
```css
padding: var(--spacing-sm);  /* 16px */
gap: var(--spacing-xs);      /* 8px */
margin-bottom: var(--spacing-md);  /* 24px */
```

**Use semantic spacing tokens:**
```css
/* Within elements */
gap: var(--spacing-element-internal);  /* 8px */

/* Between elements in component */
gap: var(--spacing-component-internal);  /* 16px */

/* Between components */
gap: var(--spacing-screen-internal);  /* 24px */

/* Input vertical padding */
padding: var(--spacing-input-vertical) var(--spacing-sm);  /* 12px 16px */
```

**Follow the spacing hierarchy:**
```
Within elements    →  8px  (--spacing-xs)
Between elements   →  16px (--spacing-sm)
Between components →  24px (--spacing-md)
Between sections   →  32px (--spacing-lg)
Between screens    →  48px (--spacing-xl)
```

#### ❌ Don't

**Don't use arbitrary spacing values:**
```css
/* BAD */
padding: 15px;
margin: 20px;
gap: 14px;
```

**Don't use pixel values for spacing:**
```css
/* BAD */
padding: 16px;  /* Use var(--spacing-sm) */
```

---

### Typography Usage

#### ✅ Do

**Use text style classes for common patterns:**
```html
<h1 class="text-style-h1">Heading</h1>
<p class="text-style-body">Body text</p>
<span class="text-style-caption">Caption</span>
<button class="text-style-button">Button</button>
```

**Use typography tokens for custom styling:**
```css
font-size: var(--font-size-16);
font-weight: var(--font-weight-medium);
line-height: var(--line-height-compact);
letter-spacing: var(--letter-spacing-wide);
```

**Use rem units (already done by tokens):**
```css
/* Tokens already use rem */
font-size: var(--font-size-16);  /* = 1rem = 16px */
```

#### ❌ Don't

**Don't use hardcoded font sizes:**
```css
/* BAD */
font-size: 16px;
font-size: 1.5rem;
```

**Don't use hardcoded line-heights:**
```css
/* BAD */
line-height: 24px;
line-height: 1.5;

/* GOOD */
line-height: var(--line-height-button);
line-height: var(--line-height-body);
```

**Don't set font-family unless overriding:**
```css
/* BAD - already inherited */
font-family: var(--font-family);

/* GOOD - only when needed */
body {
  font-family: var(--font-family);
}
```

---

### Border Radius Usage

#### ✅ Do

**Use semantic radius tokens:**
```css
border-radius: var(--radius-button);  /* 8px */
border-radius: var(--radius-card);    /* 8px */
border-radius: var(--radius-modal);   /* 12px */
border-radius: var(--radius-pill);    /* 1000px */
```

**Use direct tokens when semantic doesn't fit:**
```css
border-radius: var(--radius-sm);  /* 8px */
border-radius: var(--radius-lg);  /* 16px */
```

#### ❌ Don't

**Don't use hardcoded radius values:**
```css
/* BAD */
border-radius: 8px;
border-radius: 12px;
```

---

### Shadow Usage

#### ✅ Do

**Use semantic shadow tokens:**
```css
box-shadow: var(--shadow-card);
box-shadow: var(--shadow-modal);
box-shadow: var(--shadow-bottom-sheet);
```

**Use shadows for elevation hierarchy:**
```css
/* Low elevation */
box-shadow: var(--shadow-sm);

/* Medium elevation */
box-shadow: var(--shadow-md);

/* High elevation */
box-shadow: var(--shadow-lg);
```

#### ❌ Don't

**Don't create custom shadows:**
```css
/* BAD */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

/* GOOD */
box-shadow: var(--shadow-md);
```

---

## 🧩 Component Usage

### Component Selection

#### ✅ Do

**Reuse existing components:**
```html
<!-- Use existing button components -->
<button class="button-primary">Primary Action</button>
<button class="button-secondary">Secondary Action</button>
<button class="button-tertiary">
  <span class="button-tertiary__icon"><!-- icon --></span>
</button>
```

**Use component variants:**
```html
<!-- Button sizes -->
<button class="button-primary button-primary--large">Large</button>
<button class="button-primary button-primary--small">Small</button>

<!-- Button variants -->
<button class="button-primary button-primary--neutral">Neutral</button>
<button class="button-primary button-primary--v2">Compact</button>
```

**Use base modal components for new modals:**
```javascript
import { ModalBottomSheet } from './design-system/components/modal-bottom-sheet/modal-bottom-sheet.js';

const modal = new ModalBottomSheet(document.getElementById('myModal'));
modal.show();
```

#### ❌ Don't

**Don't create duplicate components:**
```css
/* BAD - button-primary already exists */
.my-custom-button {
  background: var(--gradient-sundown);
  border-radius: var(--radius-pill);
  /* ... */
}
```

**Don't modify core components directly:**
```css
/* BAD - creates maintenance issues */
.button-primary {
  background: blue !important;  /* Override */
}
```

**Don't skip component modifiers:**
```html
<!-- BAD -->
<button class="button-primary" style="height: 32px;">Small Button</button>

<!-- GOOD -->
<button class="button-primary button-primary--small">Small Button</button>
```

---

### Component Structure

#### ✅ Do

**Follow BEM naming convention:**
```html
<div class="data-card">
  <div class="data-card__content">
    <p class="data-card__text">Text</p>
    <div class="data-card__actions">
      <button class="data-card__icon-button">Icon</button>
    </div>
  </div>
</div>
```

**Use modifier classes for variants:**
```css
.button-primary--large { /* ... */ }
.button-primary--neutral { /* ... */ }
.modal-bottom-sheet--dark { /* ... */ }
```

**Keep components modular:**
```html
<!-- Each component in its own directory -->
components/
  button-primary/
    button-primary.html
    button-primary.css
    button-primary.js
```

#### ❌ Don't

**Don't use deeply nested selectors:**
```css
/* BAD */
.modal .content .list .item .button { /* ... */ }

/* GOOD */
.modal__button { /* ... */ }
```

---

## ♿ Accessibility

### Semantic HTML

#### ✅ Do

**Use semantic HTML elements:**
```html
<button>Click me</button>
<nav><!-- navigation --></nav>
<main><!-- main content --></main>
<header><!-- header --></header>
<footer><!-- footer --></footer>
```

**Use proper heading hierarchy:**
```html
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
  <h2>Another Section</h2>
```

**Use lists for list content:**
```html
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

#### ❌ Don't

**Don't use divs for interactive elements:**
```html
<!-- BAD -->
<div onclick="...">Click me</div>

<!-- GOOD -->
<button onclick="...">Click me</button>
```

**Don't skip heading levels:**
```html
<!-- BAD -->
<h1>Title</h1>
<h3>Skipped h2</h3>

<!-- GOOD -->
<h1>Title</h1>
<h2>Subtitle</h2>
```

---

### ARIA Attributes

#### ✅ Do

**Add ARIA labels for icons and icon buttons:**
```html
<button class="button-tertiary" aria-label="Close modal">
  <span class="button-tertiary__icon" aria-hidden="true">
    <!-- icon -->
  </span>
</button>
```

**Add ARIA attributes to modals:**
```html
<div class="modal-bottom-sheet"
     role="dialog"
     aria-modal="true"
     aria-labelledby="modalTitle"
     aria-describedby="modalContent">
  <h3 id="modalTitle">Modal Title</h3>
  <div id="modalContent">Content</div>
</div>
```

**Add ARIA attributes to custom controls:**
```html
<div class="toggle"
     role="switch"
     aria-checked="false"
     tabindex="0">
  <!-- toggle UI -->
</div>
```

#### ❌ Don't

**Don't skip ARIA labels on icon-only buttons:**
```html
<!-- BAD -->
<button class="button-tertiary">
  <span class="button-tertiary__icon"><!-- icon --></span>
</button>

<!-- GOOD -->
<button class="button-tertiary" aria-label="Delete">
  <span class="button-tertiary__icon"><!-- icon --></span>
</button>
```

---

### Keyboard Navigation

#### ✅ Do

**Ensure all interactive elements are keyboard accessible:**
```html
<!-- Buttons are naturally keyboard accessible -->
<button>Click me</button>

<!-- Custom interactive elements need tabindex -->
<div role="button" tabindex="0" onkeypress="...">
  Custom button
</div>
```

**Support Escape key for modals:**
```javascript
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.hide();
  }
});
```

**Support Enter/Space for custom buttons:**
```javascript
element.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }
});
```

#### ❌ Don't

**Don't trap focus unintentionally:**
```javascript
/* BAD - focus can't escape */
element.addEventListener('keydown', (e) => {
  e.preventDefault();  /* Prevents all keyboard navigation */
});
```

---

### Color Contrast

#### ✅ Do

**Ensure sufficient color contrast (WCAG AA: 4.5:1):**
```css
/* Good contrast */
color: var(--color-neutral-80);      /* #343a3f */
background: var(--color-neutral-10); /* #ffffff */
/* Contrast ratio: 12.6:1 ✅ */
```

**Test contrast for all text:**
- Body text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

#### ❌ Don't

**Don't use low-contrast color combinations:**
```css
/* BAD - insufficient contrast */
color: var(--color-neutral-50);      /* #98a0a6 */
background: var(--color-neutral-10); /* #ffffff */
/* Contrast ratio: 2.9:1 ❌ (fails WCAG AA) */
```

---

## 🎨 CSS Patterns

### CSS Organization

#### ✅ Do

**Follow the component structure:**
```css
/* 1. Layout properties */
.component {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* 2. Box model */
.component {
  padding: var(--spacing-md);
  margin: 0;
  width: 100%;
}

/* 3. Typography */
.component {
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-primary);
}

/* 4. Visual */
.component {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}

/* 5. Animation */
.component {
  transition: all 0.2s ease;
}
```

**Use CSS custom properties for component-specific values:**
```css
.component {
  --component-width: 368px;
  --component-max-height: 70vh;

  width: var(--component-width);
  max-height: var(--component-max-height);
}
```

#### ❌ Don't

**Don't mix concerns:**
```css
/* BAD - hard to scan */
.component {
  background: white;
  display: flex;
  font-size: 16px;
  padding: 16px;
  transition: all 0.2s;
  color: #333;
  border-radius: 8px;
}
```

---

### Transitions & Animations

#### ✅ Do

**Use consistent transition durations:**
```css
/* Fast: 0.2s for hovers */
.button:hover {
  transition: background-color 0.2s ease;
}

/* Medium: 0.3s for show/hide */
.modal {
  transition: transform 0.3s ease-in-out;
}
```

**Transition specific properties:**
```css
/* GOOD - performant */
transition: transform 0.2s ease, opacity 0.2s ease;
```

#### ❌ Don't

**Don't transition 'all':**
```css
/* BAD - triggers layout recalculation */
transition: all 0.2s;

/* GOOD */
transition: background-color 0.2s, transform 0.2s;
```

---

## 🔧 JavaScript Patterns

### Component Initialization

#### ✅ Do

**Use classes for component logic:**
```javascript
class MyComponent {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.element.addEventListener('click', () => {
      this.handleClick();
    });
  }

  handleClick() {
    // Logic
  }
}

// Initialize
const component = new MyComponent(document.getElementById('myComponent'));
```

**Use custom events for component communication:**
```javascript
// Emit event
this.element.dispatchEvent(new CustomEvent('modal-shown', {
  bubbles: true,
  detail: { modalId: this.id }
}));

// Listen for event
element.addEventListener('modal-shown', (e) => {
  console.log('Modal shown:', e.detail.modalId);
});
```

#### ❌ Don't

**Don't use global variables:**
```javascript
/* BAD */
var myModal = new Modal();  /* Global variable */

/* GOOD */
const myModal = new Modal();  /* Module-scoped */
```

---

## ⚠️ Common Mistakes

### 1. Not Using Semantic Tokens

**❌ Wrong:**
```css
color: var(--color-neutral-80);
```

**✅ Correct:**
```css
color: var(--color-text-primary);
```

---

### 2. Hardcoded Values

**❌ Wrong:**
```css
padding: 16px;
border-radius: 8px;
color: #f57464;
```

**✅ Correct:**
```css
padding: var(--spacing-sm);
border-radius: var(--radius-sm);
color: var(--color-error-60);
```

---

### 3. Modifying Core Components

**❌ Wrong:**
```css
.button-primary {
  background: blue !important;
}
```

**✅ Correct:**
```css
/* Create a variant or new component */
.button-primary--custom {
  background: var(--color-primary-70);
}
```

---

### 4. Skipping Accessibility

**❌ Wrong:**
```html
<div onclick="close()">X</div>
```

**✅ Correct:**
```html
<button aria-label="Close" onclick="close()">
  <span aria-hidden="true">×</span>
</button>
```

---

### 5. Deep Nesting

**❌ Wrong:**
```css
.modal .content .list .item .button { }
```

**✅ Correct:**
```css
.modal__button { }
```

---

### 6. Inline Styles

**❌ Wrong:**
```html
<div style="padding: 16px; background: white;">Content</div>
```

**✅ Correct:**
```html
<div class="container">Content</div>
```
```css
.container {
  padding: var(--spacing-sm);
  background: var(--color-background);
}
```

---

## 📋 Checklist

Before committing code, ensure:

- [ ] All colors use design tokens
- [ ] All spacing uses design tokens
- [ ] All typography uses tokens or classes
- [ ] Border radius uses tokens
- [ ] Shadows use tokens
- [ ] No hardcoded values
- [ ] Semantic HTML is used
- [ ] ARIA attributes are present
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA
- [ ] Component follows BEM naming
- [ ] No !important flags (unless absolutely necessary)
- [ ] Transitions are performant
- [ ] Code is documented

---

## 📚 Resources

- [Design System README](README.md)
- [Component Status](COMPONENT_STATUS.md)
- [Changelog](CHANGELOG.md)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

**Questions?** Review existing components for examples or consult the design system documentation.
