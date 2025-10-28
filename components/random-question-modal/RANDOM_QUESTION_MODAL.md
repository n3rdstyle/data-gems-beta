# Random Question Modal

A bottom-sheet modal with gradient background for answering random questions. Features an integrated send button inside the input field.

## Features

- ✅ Dark gradient background (sundown)
- ✅ Send button integrated inside input field
- ✅ Send button disabled when input is empty
- ✅ Enter key submits answer
- ✅ Slide-up animation from bottom
- ✅ Auto-clears input on open

## Usage

### JavaScript

```javascript
const questionModal = createRandomQuestionModal({
  question: 'What is your favorite color?',

  onAnswer: (answer, question) => {
    console.log('Question:', question);
    console.log('Answer:', answer);
    // Save answer to database
  },

  onClose: () => {
    console.log('Modal closed');
  }
});

// Show modal
questionModal.show();

// Hide modal
questionModal.hide();
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `question` | string | '' | The question to display |
| `onAnswer` | function | null | Callback when answer is submitted (answer, question) |
| `onClose` | function | null | Callback when modal is closed |

## API Methods

### show()
Shows the modal with slide-up animation. Clears input field.

```javascript
questionModal.show();
```

### hide()
Hides the modal with slide-down animation.

```javascript
questionModal.hide();
```

### setQuestion(question)
Updates the question text.

```javascript
questionModal.setQuestion('What is your dream vacation?');
```

### destroy()
Removes the modal from DOM.

```javascript
questionModal.destroy();
```

## Structure

```
┌──────────────────────────────┐
│ Question Text         [X]    │ Header
├──────────────────────────────┤
│ ┌──────────────────────┐     │
│ │ Type your answer  [→]│     │ Input with send button
│ └──────────────────────┘     │
└──────────────────────────────┘
```

## Behavior

### Input Field
- Starts empty when modal opens
- Placeholder: "Type your answer"
- Send button appears inside the input field (right side)

### Send Button
- **Disabled** when input is empty (opacity: 0.3)
- **Enabled** when input has text
- Click triggers `onAnswer` callback
- Modal auto-closes after submission

### Keyboard Support
- `Enter` key - Submit answer (if input not empty)
- `Escape` key - Close modal (via parent behavior)

### Submission Flow
1. User types answer
2. Send button becomes enabled
3. User clicks send or presses Enter
4. `onAnswer(answer, question)` is called
5. Modal auto-closes
6. Input field is cleared for next use

## Styling

**Background:** Gradient (sundown)
```css
background: var(--gradient-sundown);
/* linear-gradient(133deg, #F9D8A3 16.05%, #F57464 76.12%) */
```

**Text Color:** White on gradient
```css
color: var(--color-neutral-10);
```

**Input Field:** White background, dark text
```css
background: var(--color-neutral-10);
color: var(--color-neutral-90);
border-color: var(--overlay-white-30);
```

**Send Button:** Tertiary button with custom styling
```css
/* Positioned inside input field */
position: absolute;
right: 4px;
top: 50%;
transform: translateY(-50%);
```

## Dependencies

**Required Components:**
- `input-field.js` - Text input
- `button-tertiary.js` - Close & send buttons

**CSS:**
- `random-question-modal.css`
- `input-field.css`
- `button-tertiary.css`

## Design Tokens

- `--gradient-sundown` (Background)
- `--color-neutral-10` (Text, input background)
- `--color-neutral-90` (Input text)
- `--overlay-white-20` (Close button hover)
- `--overlay-white-30/40/50` (Input border states)
- `--font-size-20` (Question text)
- `--font-weight-medium` (Question text)
- `--spacing-md` (Padding)
- `--radius-lg` (Border radius - top corners)
- `--shadow-bottom-sheet-dark` (Shadow)

## Accessibility

### ARIA Attributes

```javascript
// Close button
ariaLabel: 'Close'

// Send button
ariaLabel: 'Send answer'
```

### Keyboard Navigation
- `Tab` - Focus input field
- `Tab` again - Focus send button (when enabled)
- `Shift+Tab` - Focus close button
- `Enter` - Submit answer
- `Escape` - Close modal

### Screen Reader
- Question text is read as heading
- Input field has placeholder text
- Buttons have aria-labels

## Examples

### Basic Usage

```javascript
const modal = createRandomQuestionModal({
  question: 'What makes you happy?',
  onAnswer: (answer) => {
    saveAnswer(answer);
    showSuccessMessage('Answer saved!');
  }
});

modal.show();
```

### With Question Rotation

```javascript
const questions = [
  'What is your favorite memory?',
  'What are you grateful for today?',
  'What is your dream destination?'
];

let currentQuestionIndex = 0;

const modal = createRandomQuestionModal({
  question: questions[currentQuestionIndex],
  onAnswer: (answer, question) => {
    // Save answer
    saveAnswer({ question, answer });

    // Show next question
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    modal.setQuestion(questions[currentQuestionIndex]);
    modal.show();
  }
});
```

### With Validation

```javascript
const modal = createRandomQuestionModal({
  question: 'What is your email?',
  onAnswer: (answer) => {
    if (!isValidEmail(answer)) {
      alert('Please enter a valid email');
      modal.show(); // Re-open modal
      return;
    }

    saveEmail(answer);
  }
});
```

## Visual Design

**Modal Appearance:**
- Warm gradient background (tan to coral)
- White text for high contrast
- Rounded top corners (16px)
- Dark shadow extending upward
- Slides up from bottom of screen

**Button Integration:**
- Send button "floats" inside input field
- Icon-only button (arrow/send icon)
- Subtle hover state
- Disabled state at 30% opacity

## Use Cases

- Daily reflection prompts
- User feedback collection
- Questionnaires
- Quick surveys
- Onboarding questions
- Feature discovery prompts

## Best Practices

### Do ✅
- Keep questions short and clear
- Provide meaningful `onAnswer` callback
- Validate answers if needed
- Show confirmation after submission
- Use for single-question prompts

### Don't ❌
- Don't use for multi-question forms (use standard modal)
- Don't forget to handle empty submissions (automatically prevented)
- Don't use for critical alerts (use center modal)
- Don't chain multiple questions without user control

## Related Components

- **Modal Bottom-Sheet** - Base bottom-sheet pattern (uses dark variant)
- **Input Field** - Text input component
- **Button Tertiary** - Icon buttons (close, send)

## Pattern: Bottom-Sheet (Dark Variant)

This modal extends the **Modal Bottom-Sheet** pattern with:
- Dark/gradient background instead of white
- Integrated send button in input
- Single-purpose interaction (answer submission)
- Warm, inviting aesthetic

## Changelog

### v1.0.0
- Initial implementation
- Gradient background (sundown)
- Integrated send button
- Enter key support
- Auto-disable when empty
