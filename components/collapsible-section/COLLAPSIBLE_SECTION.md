# Collapsible Section

Section with toggle-enabled header and hideable content. Toggle is disabled until fields have values.

## Features

- ✅ Compact header with toggle
- ✅ Smart toggle enablement (disabled when fields empty)
- ✅ Content visibility toggle
- ✅ Hidden state styling (grayed out)
- ✅ Automatic field monitoring
- ✅ Flexible content support

## Basic Usage

```javascript
const section = createCollapsibleSection({
  title: 'Optional Information',
  content: [
    createInputField({ label: 'Bio', type: 'textarea' }).element,
    createInputField({ label: 'Website', type: 'text' }).element
  ],
  collapsed: false,

  onToggle: (isHidden) => {
    console.log('Section is now:', isHidden ? 'hidden' : 'visible');
  }
});

document.body.appendChild(section.element);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `''` | Section title text |
| `content` | Element or Array | `null` | DOM element(s) to display in section |
| `collapsed` | boolean | `false` | Initially hidden/collapsed |
| `onToggle` | function | `null` | Callback when toggle state changes |

## Structure

**Visible (Toggle Active):**
```
┌─────────────────────────────┐
│ Optional Information    [●] │  Toggle ON
├─────────────────────────────┤
│ Bio                         │
│ ┌─────────────────────────┐ │
│ │ Enter your bio...       │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Hidden (Toggle Inactive):**
```
┌─────────────────────────────┐
│ Optional Information    [○] │  Toggle OFF
├─────────────────────────────┤
│ Bio                         │  Grayed out
│ ┌─────────────────────────┐ │
│ │ Enter your bio...       │ │  Grayed out
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

## API

```javascript
const section = createCollapsibleSection({
  title: 'Section Title',
  content: [...]
});

// Show/hide content
section.show(); // Make content visible (toggle ON)
section.hide(); // Hide content (toggle OFF, grayed out)
section.toggle(); // Toggle state

// Check state
section.isHidden(); // Returns true if hidden
section.isCollapsed(); // Alias for isHidden()

// Title management
section.getTitle(); // Returns title text
section.setTitle('New Title');

// Content management
section.setContent(newElement); // Replace all content
section.setContent([element1, element2]); // Replace with array
section.addContent(newElement); // Append new content
section.getContentContainer(); // Returns content container element

// Force toggle state update
section.updateToggleState(); // Re-check if fields have values

// Legacy aliases
section.expand(); // Same as show()
section.collapse(); // Same as hide()

// Access DOM element
section.element;
```

## Smart Toggle Behavior

### Initial State
- Toggle starts **disabled** (opacity: 0.3, not clickable)
- Cannot toggle until at least one field has a value

### When Fields Are Filled
- Component monitors all inputs, textareas, selects, and dropdowns
- When any field gets a value → toggle becomes **enabled**
- Toggle shows at full opacity and becomes clickable

### Toggle States
- **Active** (ON) - Content visible, normal styling
- **Inactive** (OFF) - Content visible but grayed out
- **Disabled** - Cannot toggle (no field values yet)

## Hidden State Styling

When toggle is OFF (section hidden), the following styles apply:

### Input Fields
- Background: Light gray (`--color-neutral-20`)
- Border: Light gray (`--color-neutral-30`)
- Text: Muted (`--color-neutral-50`)
- Placeholder: Muted with lower opacity

### Dropdowns
- Background: Light gray
- Selected value: Muted text
- Placeholder: Muted

### Labels
- Text: Muted (`--color-neutral-50`)

## Example: Profile Section

```javascript
const bioSection = createCollapsibleSection({
  title: 'Bio',
  content: createInputField({
    type: 'textarea',
    placeholder: 'Tell us about yourself...',
    maxLength: 500
  }).element,
  collapsed: false
});

// Initially: toggle is disabled (bio is empty)
// User types in bio: toggle becomes enabled
// User toggles OFF: bio field becomes grayed out but value remains
```

## Example: Multiple Fields

```javascript
const contactSection = createCollapsibleSection({
  title: 'Contact Information',
  content: [
    createInputField({ label: 'Phone', type: 'text' }).element,
    createInputField({ label: 'Email', type: 'email' }).element,
    createInputField({ label: 'Address', type: 'textarea' }).element
  ],

  onToggle: (isHidden) => {
    if (isHidden) {
      console.log('Contact info hidden from public profile');
    } else {
      console.log('Contact info visible on public profile');
    }
  }
});

// Toggle enables when ANY field has a value
```

## Example: Dynamic Content

```javascript
const section = createCollapsibleSection({
  title: 'Additional Details',
  content: []
});

// Add content dynamically
const nameField = createInputField({ label: 'Full Name' });
section.addContent(nameField.element);

const emailField = createInputField({ label: 'Email' });
section.addContent(emailField.element);

// Update toggle state after programmatic changes
section.updateToggleState();
```

## Field Monitoring

The component automatically monitors these elements:
- `<input>` elements
- `<textarea>` elements
- `<select>` elements
- Dropdowns (`.dropdown__selected`)

**Events monitored:**
- `input` event
- `change` event

**Initial check:**
- Runs 100ms after creation
- Call `updateToggleState()` after programmatic updates

## Design Tokens

- Gap (internal): `--spacing-component-internal` (16px)
- Hidden background: `--color-neutral-20`
- Hidden border: `--color-neutral-30`
- Hidden text: `--color-neutral-50`
- Uses **Header (compact-toggle variant)**

## Use Cases

- **Optional Profile Fields** - Bio, website, social links
- **Advanced Settings** - Settings that can be hidden from display
- **Collapsible Forms** - Hide/show form sections
- **Privacy Controls** - Hide personal information from public view

## Accessibility

```html
<div class="collapsible-section">
  <div class="collapsible-section__header">
    <!-- Header with toggle -->
  </div>
  <div class="collapsible-section__content" aria-hidden="false">
    <!-- Content -->
  </div>
</div>
```

**Best Practices:**
- Use `aria-expanded` on toggle button
- Update `aria-hidden` on content based on state
- Provide clear toggle labels
- Announce state changes to screen readers

## Best Practices

### Do ✅
- Use for optional sections
- Monitor fields automatically
- Gray out hidden content (don't hide completely)
- Disable toggle when all fields are empty
- Provide clear section titles

### Don't ❌
- Don't use for required fields
- Don't completely hide content (use gray styling)
- Don't forget to call `updateToggleState()` after programmatic updates
- Don't use for sections that should always be visible

## Behavior Notes

### Toggle Inversion
- **Toggle Active** (ON) = Content visible with normal styling
- **Toggle Inactive** (OFF) = Content visible but grayed out
- This is inverted from typical collapse behavior

### Content Visibility
- Content is **always visible** in DOM
- Hidden state only changes styling (grayed out)
- This allows users to see what's hidden
- Useful for privacy/visibility controls

## Related

- **Header (compact-toggle variant)** - Used for section header
- **Input Field** - Common content type
- **Dropdown** - Common content type
- **Profile Screen** - Uses collapsible sections
