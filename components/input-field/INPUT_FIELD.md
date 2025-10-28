# Input Field

Reusable input and textarea component with label, validation, character count, and multiple variants.

## Features

- ✅ Text input or textarea
- ✅ Email validation (live feedback)
- ✅ Search variant with icon
- ✅ Character counter
- ✅ Helper text and error messages
- ✅ Auto-resize textarea
- ✅ Disabled state
- ✅ Required field indicator

## Basic Usage

```javascript
const input = createInputField({
  type: 'text',
  label: 'Full Name',
  placeholder: 'Enter your name...',
  value: '',
  required: true,
  onChange: (value) => {
    console.log('Input value:', value);
  }
});

document.body.appendChild(input.element);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | `'text'` | Input type: 'text', 'email', 'search', 'textarea' |
| `label` | string | `''` | Label text |
| `placeholder` | string | `''` | Placeholder text |
| `value` | string | `''` | Initial value |
| `disabled` | boolean | `false` | Disabled state |
| `required` | boolean | `false` | Shows asterisk (*) after label |
| `maxLength` | number | `null` | Maximum character limit |
| `showCount` | boolean | `false` | Show character counter |
| `autoResize` | boolean | `false` | Auto-resize textarea to fit content |
| `helperText` | string | `''` | Helper text below input |
| `errorMessage` | string | `''` | Error message (shows error state) |
| `validateEmail` | boolean | `false` | Enable live email validation |
| `id` | string | `null` | Custom ID (auto-generated if not provided) |
| `name` | string | `null` | Form name attribute |
| `onChange` | function | `null` | Callback on change |
| `onInput` | function | `null` | Callback on input |
| `onFocus` | function | `null` | Callback on focus |
| `onBlur` | function | `null` | Callback on blur |
| `onKeyPress` | function | `null` | Callback on key press |
| `onKeyDown` | function | `null` | Callback on key down |

## Variants

### Text Input (Default)

```javascript
const textInput = createInputField({
  type: 'text',
  label: 'Username',
  placeholder: 'Enter username...',
  maxLength: 20,
  showCount: true
});
```

### Email with Validation

```javascript
const emailInput = createInputField({
  type: 'email',
  label: 'Email Address',
  placeholder: 'you@example.com',
  validateEmail: true, // Shows ✓ Valid or ✗ Invalid in real-time
  onChange: (value) => {
    console.log('Email:', value);
  }
});
```

### Search Input

```javascript
const searchInput = createInputField({
  type: 'search',
  placeholder: 'Search...',
  onInput: (value) => {
    performSearch(value);
  }
});
```

### Textarea

```javascript
const textarea = createInputField({
  type: 'textarea',
  label: 'Description',
  placeholder: 'Enter description...',
  autoResize: true, // Grows with content
  maxLength: 500,
  showCount: true
});
```

### With Helper Text

```javascript
const passwordInput = createInputField({
  type: 'text',
  label: 'Password',
  placeholder: 'Enter password...',
  helperText: 'Must be at least 8 characters'
});
```

### With Error State

```javascript
const errorInput = createInputField({
  type: 'text',
  label: 'Username',
  value: 'ab',
  errorMessage: 'Username must be at least 3 characters'
});
```

## API

```javascript
const input = createInputField({ label: 'Name' });

// Get value
input.getValue(); // Returns current value

// Set value
input.setValue('New value');

// Clear input
input.clear();

// Focus/blur
input.focus();
input.blur();

// Disable/enable
input.disable();
input.enable();
input.isDisabled(); // Returns true/false

// Error handling
input.setError('This field is required');
input.clearError();

// Email validation (if validateEmail: true)
input.clearValidation(); // Hide validation messages

// Access underlying input element
input.getInputElement();

// Update placeholder
input.setPlaceholder('New placeholder...');

// Access container element
input.element;
```

## Structure

**Text Input:**
```
┌─────────────────────────┐
│ Full Name *             │  Label (required)
│ ┌─────────────────────┐ │
│ │ Enter your name... │ │  Input
│ └─────────────────────┘ │
│ Helper text here        │  Helper text
└─────────────────────────┘
```

**Search Input:**
```
┌─────────────────────────┐
│ [🔍] Search...          │  Icon + input
└─────────────────────────┘
```

**Email Validation:**
```
┌─────────────────────────┐
│ Email Address           │
│ ┌─────────────────────┐ │
│ │ user@example.com   │ │  Valid state
│ └─────────────────────┘ │
│ ✓ Valid email           │  Success message
└─────────────────────────┘
```

**Error State:**
```
┌─────────────────────────┐
│ Username                │
│ ┌─────────────────────┐ │
│ │ ab                 │ │  Red border
│ └─────────────────────┘ │
│ Must be at least 3 chars│  Error message
└─────────────────────────┘
```

## States

- **Default** - White background, neutral border
- **Focus** - Dark border
- **Hover** - Darker border (on input)
- **Disabled** - Gray background, lighter text, not-allowed cursor
- **Error** - Red border, error message shown
- **Valid (email)** - Green border, success message
- **Invalid (email)** - Red border, error message

## Email Validation Behavior

When `validateEmail: true` or `type: 'email'`:

1. **On focus**: If field has value, validation appears
2. **On input**: Validation updates in real-time
3. **On blur**: Validation hides (returns to default state)
4. **Empty**: No validation shown
5. **Valid**: ✓ Valid email (green)
6. **Invalid**: ✗ Please enter a valid email (red)

## Character Counter

When `showCount: true` and `maxLength` is set:

```
Current / Maximum
15 / 100          (Normal)
105 / 100         (Over limit - red text)
```

## Design Tokens

- Background: `--color-neutral-10`
- Background (disabled): `--color-neutral-20`
- Border: `--color-neutral-40` (default), `--color-neutral-80` (focus)
- Border (error): `--color-error`
- Border (success): `--color-success`
- Text: `--color-neutral-80`
- Placeholder: `--color-neutral-50`
- Error text: `--color-error`
- Success text: `--color-success`
- Helper text: `--color-neutral-60`
- Border radius: `--radius-sm`
- Padding: `--spacing-input-vertical`, `--spacing-sm`
- Gap: `--spacing-xs`

## Use Cases

- **Text**: Names, usernames, titles
- **Email**: Email addresses with validation
- **Search**: Search bars, filters
- **Textarea**: Descriptions, comments, long-form text
- **Forms**: Contact forms, settings, user profiles

## Accessibility

```html
<div class="input-field">
  <label class="input-field__label" for="input-field-1">
    Full Name *
  </label>
  <div class="input-field__wrapper">
    <input
      id="input-field-1"
      class="input-field__input"
      type="text"
      placeholder="Enter your name..."
      required
      aria-required="true"
      aria-invalid="false"
    />
  </div>
  <div class="input-field__helper">This will be visible to others</div>
</div>
```

**Best Practices:**
- Always provide a label (for accessibility and clarity)
- Use `aria-required` for required fields
- Use `aria-invalid` for error states
- Use `aria-describedby` to link error messages
- Ensure sufficient color contrast

## Best Practices

### Do ✅
- Always provide a label
- Use appropriate input type
- Show validation feedback clearly
- Provide helpful placeholder text
- Use helper text for additional context
- Limit maxLength for short inputs

### Don't ❌
- Don't use placeholder as a label replacement
- Don't make error messages too technical
- Don't disable without showing why
- Don't forget to validate on submit
- Don't use search type for everything (only for search!)

## Related

- **Text Edit Field** - Editable field with state management
- **Tag Add Field** - Input with tag autocomplete
- **Search** - Full search component with results
