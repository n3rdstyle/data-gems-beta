# Divider

Simple horizontal divider line for separating content sections.

## Features

- ✅ Thin 1px line
- ✅ Full width
- ✅ Semantic `<hr>` element
- ✅ Neutral color

## Basic Usage

```javascript
const divider = createDivider();
document.body.appendChild(divider.element);
```

## API

```javascript
const divider = createDivider();

// Access DOM element
divider.element; // Returns <hr> element
```

## Structure

```
─────────────────────────────  (1px line)
```

## Styling

- **Width**: 100%
- **Height**: 1px
- **Color**: `--color-neutral-30`
- **Margin**: 0
- **Padding**: 0
- **Border**: none

## Use Cases

### Between List Items

```javascript
const list = document.createElement('div');

items.forEach((item, index) => {
  list.appendChild(createItem(item).element);

  // Add divider between items (not after last)
  if (index < items.length - 1) {
    list.appendChild(createDivider().element);
  }
});
```

### In Modals

```javascript
const modal = document.createElement('div');
modal.appendChild(header.element);
modal.appendChild(createDivider().element);
modal.appendChild(content.element);
modal.appendChild(createDivider().element);
modal.appendChild(footer.element);
```

### In Settings

```javascript
const settings = document.createElement('div');
settings.appendChild(createToggle({ label: 'Dark Mode' }).element);
settings.appendChild(createDivider().element);
settings.appendChild(createToggle({ label: 'Notifications' }).element);
settings.appendChild(createDivider().element);
settings.appendChild(createToggle({ label: 'Auto-save' }).element);
```

### In Action Lists

```javascript
const menu = document.createElement('div');
menu.appendChild(createActionButton({ label: 'Settings' }).element);
menu.appendChild(createDivider().element);
menu.appendChild(createActionButton({ label: 'Help' }).element);
menu.appendChild(createDivider().element);
menu.appendChild(createActionButton({ label: 'Sign Out' }).element);
```

## HTML Output

```html
<hr class="divider" />
```

## Design Tokens

- Color: `--color-neutral-30`
- Height: `1px`
- Border: `none`

## Accessibility

- Uses semantic `<hr>` element
- Screen readers announce as separator/divider
- No additional ARIA needed

**Best Practices:**
```html
<hr class="divider" role="separator" aria-orientation="horizontal" />
```

## Best Practices

### Do ✅
- Use between distinct sections
- Use in lists to separate items
- Use in modals to separate header/content/footer
- Use semantic `<hr>` element (not `<div>`)

### Don't ❌
- Don't use after last item in a list
- Don't use too frequently (creates visual noise)
- Don't use when whitespace is sufficient
- Don't use custom elements when `<hr>` is semantic

## Spacing

Dividers don't include spacing. Use parent container gaps:

```css
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 16px; /* Space between divider and content */
}
```

Or manual spacing:

```css
.content-section {
  margin-bottom: 16px;
}

.divider {
  margin-bottom: 16px;
}
```

## Related

- **Action Button** - Often separated by dividers
- **Modal Components** - Use dividers to separate sections
- **Settings Lists** - Use dividers between options
