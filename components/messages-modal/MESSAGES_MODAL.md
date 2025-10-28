# Messages Modal

A bottom-sheet modal for displaying a list of messages or notifications.

## Features

- ✅ Scrollable list of messages
- ✅ Each message is clickable
- ✅ Shows title and preview
- ✅ Dividers between messages
- ✅ Navigation chevron icons

## Usage

```javascript
const messagesModal = createMessagesModal({
  messages: [
    {
      id: 1,
      title: 'Welcome to Data Gems!',
      preview: 'Get started by adding your first preference'
    },
    {
      id: 2,
      title: 'New Feature: Collections',
      preview: 'Organize your preferences with collections'
    }
  ],

  onMessageClick: (message) => {
    console.log('Clicked:', message.title);
    // Navigate to message detail or perform action
  },

  onClose: () => {
    console.log('Modal closed');
  }
});

messagesModal.show();
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| `messages` | Array<{id, title, preview}> | List of messages to display |
| `onMessageClick` | function | Callback when message is clicked |
| `onClose` | function | Callback when modal is closed |

## Structure

```
┌─────────────────────────┐
│ Messages           [X]  │
├─────────────────────────┤
│ Welcome to Data Gems!   │
│ Get started by...    [→]│
├─────────────────────────┤
│ New Feature            │
│ Organize your...     [→]│
├─────────────────────────┤
│ ...                     │
└─────────────────────────┘
```

## Message Object

```javascript
{
  id: number,          // Unique identifier
  title: string,       // Main message text
  preview: string      // Secondary text/preview
}
```

## Behavior

- Messages are displayed in order
- Each message has title (bold) and preview (lighter)
- Click triggers `onMessageClick` with full message object
- Dividers between messages (hidden for last item)
- Scrollable when many messages

## Dependencies

- `header.js`, `action-button.js`, `divider.js`

## Use Cases

- Notifications center
- Announcements
- Updates feed
- Help tips
- Feature discovery

## Related

- **Action Button (navigation variant)** - Used for message items
- **Modal Bottom-Sheet** - Base bottom-sheet pattern
