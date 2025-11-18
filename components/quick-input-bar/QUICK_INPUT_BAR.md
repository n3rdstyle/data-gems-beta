# Quick Input Bar Component

**Status**: ✅ Implemented
**Location**: `/components/quick-input-bar/`
**Dependencies**: `input-field.js`, `button-tertiary.js`, `button-primary.js`, `tag.js`, `random-question-service.js`

## Overview

The Quick Input Bar is a bottom-fixed component that provides a streamlined interface for adding preferences. It combines direct text input with contextual question suggestions, eliminating the need for multiple clicks to add new data.

## Features

- **Direct Input**: Type and send preferences immediately (0-click workflow)
- **Question Tags**: 3 rotating question suggestions displayed as clickable tags
- **Smart States**: Automatically adapts to empty, normal, and selection modes
- **Refresh Questions**: Cycle through different question suggestions
- **Advanced Options**: + button for full data editor modal access

## States

### Normal State
- Input field with send button
- 3 question tag suggestions (horizontal scroll)
- Refresh button for cycling questions
- + button for advanced add

### Selection State (when cards are selected)
- Merge button (shows count, disabled if < 2 cards)
- Trash button for bulk delete
- Hides input field temporarily

### Empty State (no preferences yet)
- Large "Add your first preference" CTA button

## Usage

```javascript
const quickInputBar = createQuickInputBar({
  onQuickAdd: (text, topic) => {
    // Save preference with optional topic from question
  },
  onPlusClick: () => {
    // Open advanced modal
  },
  onRandomQuestionClick: () => {
    // Optional: open full random question modal
  },
  onMergeClick: () => {
    // Handle merge action
  },
  onDeleteClick: () => {
    // Handle delete selected
  },
  getAutoCategorizeEnabled: () => {
    // Return whether auto-categorize is enabled
  }
});

// Initialize (loads questions asynchronously)
await quickInputBar.initialize();
```

## Public API

```javascript
// State management
quickInputBar.setState('normal' | 'selection' | 'empty')

// Selection state methods
quickInputBar.setMergeCount(count)
quickInputBar.setMergeDisabled(disabled)

// Question management
quickInputBar.refreshQuestions()

// Input management
quickInputBar.clearInput()

// Visibility
quickInputBar.hide()
quickInputBar.show()
```

## Implementation Notes

### Question Tag Flow
1. User clicks question tag
2. Tag becomes active (highlighted)
3. Input placeholder updates to show question
4. User types answer
5. On send: Answer saved with question's topic
6. Input clears, tag deactivates

### Quick Add Flow
1. User types directly in input field
2. Send button enables when text present
3. On send/enter: `onQuickAdd(text, topic)` called
4. Input clears automatically
5. No modal needed - instant save

### Integration with Random Questions
- Component automatically loads 3 random questions on init
- Uses existing `random-question-service.js`
- Questions rotate when user clicks refresh button
- Each question has associated topic for categorization

## Design Decisions

### Why This Approach?
- **Faster workflow**: 0-click for quick adds vs 2-3 clicks with modal
- **Discoverability**: Questions visible without needing to click
- **Flexibility**: + button still available for advanced options
- **Progressive disclosure**: Simple by default, powerful when needed

### Replaced Component
This component replaces `preference-options` which had:
- Overlay-based UI (required clicks to show)
- Random question button (opened modal)
- Less visible question discovery

## Testing Checklist

- [ ] Quick add works (type + send)
- [ ] Question tags clickable and update placeholder
- [ ] Answer with selected question saves with correct topic
- [ ] Refresh button cycles through questions
- [ ] + button opens data editor modal
- [ ] Selection mode shows merge/trash buttons
- [ ] Merge button disabled with < 2 cards
- [ ] Empty state shows large CTA
- [ ] Scroll behavior hides bar when scrolling down
- [ ] Component initializes questions on load
