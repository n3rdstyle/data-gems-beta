# Backup Reminder Modal Component

A centered modal that reminds users to backup their preference data regularly.

## Features

- **Centered Modal**: Traditional modal design (vs bottom-sheet)
- **Warning/Reminder UI**: Prompts user action without being intrusive
- **Simple Actions**: Backup now or dismiss
- **Scheduled Reminders**: Can be triggered on a schedule (e.g., weekly, monthly)
- **Accessible**: Clear action buttons with focus management

## Usage

### HTML Structure

```html
<!-- Include dependencies -->
<link rel="stylesheet" href="design-system/colors.css">
<link rel="stylesheet" href="design-system/spacing.css">
<link rel="stylesheet" href="design-system/border-radius.css">
<link rel="stylesheet" href="components/overlay/overlay.css">
<link rel="stylesheet" href="components/button-primary/button-primary.css">
<link rel="stylesheet" href="components/button-secondary/button-secondary.css">
<link rel="stylesheet" href="components/backup-reminder-modal/backup-reminder-modal.css">

<!-- Modal with overlay -->
<div class="overlay overlay--fixed" id="backup-reminder-overlay">
  <div class="backup-reminder-modal">
    <h2 class="backup-reminder-modal__title">Time to Backup Your Data</h2>
    <p class="backup-reminder-modal__message">
      It's been a while since your last backup. Keep your preferences safe by backing them up now.
    </p>
    <div class="backup-reminder-modal__actions">
      <button class="button-secondary">Remind Me Later</button>
      <button class="button-primary">Backup Now</button>
    </div>
  </div>
</div>

<!-- Include JS -->
<script src="components/overlay/overlay.js"></script>
<script src="components/backup-reminder-modal/backup-reminder-modal.js"></script>
```

### JavaScript

#### Show modal

```javascript
// Create and show backup reminder
const reminderModal = createBackupReminderModal({
  onBackup: () => {
    console.log('User chose to backup');
    // Trigger backup flow
    startBackupProcess();
  },
  onDismiss: () => {
    console.log('User dismissed reminder');
    // Schedule next reminder (e.g., in 1 week)
    scheduleNextReminder(7); // days
  }
});

reminderModal.show();
```

#### Schedule reminders

```javascript
// Check last backup date and show reminder if needed
function checkBackupReminder() {
  const lastBackup = getLastBackupDate();
  const daysSinceBackup = getDaysSince(lastBackup);

  if (daysSinceBackup >= 30) {
    // Show reminder if 30+ days since last backup
    const modal = createBackupReminderModal({
      onBackup: handleBackup,
      onDismiss: () => scheduleNextReminder(7)
    });
    modal.show();
  }
}
```

## API

### Factory Function: `createBackupReminderModal(options)`

```javascript
createBackupReminderModal({
  title: 'Time to Backup Your Data',      // Optional - Modal title
  message: 'It\'s been a while...',       // Optional - Reminder message
  onBackup: () => {},                     // Required - Backup action handler
  onDismiss: () => {},                    // Optional - Dismiss action handler
  dismissLabel: 'Remind Me Later',        // Optional - Dismiss button text
  backupLabel: 'Backup Now'               // Optional - Backup button text
})
```

### Returns

Returns a modal object with methods:

```javascript
{
  show: () => void,                       // Show the modal
  hide: () => void,                       // Hide the modal
  updateMessage: (text) => void           // Update reminder message
}
```

## Design Tokens Used

### Colors
- `--color-secondary-10` - Modal background
- `--color-neutral-30` - Border color
- `--color-neutral-80` - Text color

### Spacing
- `--spacing-sm` (16px) - Modal padding
- `--spacing-md` (24px) - Gap between sections
- `--spacing-xs` (8px) - Gap between buttons

### Border Radius
- `--radius-lg` (16px) - Modal corners

### Shadows
- `--shadow-lg` - Modal elevation

## States

- **Hidden**: `opacity: 0`, `pointer-events: none`
- **Visible**: `opacity: 1`, `pointer-events: auto`, centered on screen
- **User Actions**: Backup or Dismiss

## Interaction Flow

1. Modal appears centered with overlay
2. User reads reminder message
3. User clicks "Remind Me Later" → Modal closes, reminder scheduled
4. User clicks "Backup Now" → Backup flow starts, modal closes

## Accessibility

- Focus trap within modal when open
- Escape key dismisses modal (same as "Remind Me Later")
- Click outside overlay dismisses modal
- Clear primary action (Backup Now) vs secondary (Remind Later)

## Integration Example

```javascript
// In background.js or app.js - check on extension open
chrome.runtime.onInstalled.addListener(() => {
  // Set up periodic backup reminder alarm
  chrome.alarms.create('backupReminder', {
    periodInMinutes: 10080 // 7 days
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'backupReminder') {
    // Show backup reminder modal
    showBackupReminder();
  }
});

function showBackupReminder() {
  const modal = createBackupReminderModal({
    onBackup: () => {
      // Open backup screen
      window.location.href = '#/settings/backup';
    },
    onDismiss: () => {
      // Track dismissal
      trackEvent('backup_reminder_dismissed');
    }
  });

  modal.show();
}
```

## Best Practices

- Don't show reminder too frequently (respect user choice)
- Show reminder at appropriate times (e.g., not during active data entry)
- Make backup process easy from reminder modal
- Track when user last saw reminder to avoid spam
- Consider user's backup frequency preference

## Notes

- This is an untracked component (new) - not yet in git
- Part of data safety and user retention strategy
- Works well with settings backup/restore functionality
- Can be triggered manually or on schedule
- Modal uses standard centered pattern (not bottom-sheet)
