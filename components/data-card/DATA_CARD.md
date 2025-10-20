# Data Card Component

A flexible card component for displaying preference data with multiple states.

## Features

- **3 States**: default, favorited, hidden
- **Hover Effects**: Visual feedback on all states
- **Interactive**: Click to toggle between states
- **Customizable**: Easy to modify text and behavior
- **Responsive**: Adapts to container width

## States

### Default
- White background
- Light gray border (`#e6eaec`)
- Dark text (`#343a3f`)
- **Hover**: Dark border (`#343a3f`)

### Favorited
- White background
- Purple border (`#c9a2ff`)
- Dark text (`#343a3f`)
- **Hover**: Blue border (`#13b3eb`)

### Hidden
- Light gray background (`#f8fafb`)
- Light gray border (`#e6eaec`)
- Muted text (`#98a0a6`)
- **Hover**: Dark border and text

## Usage

### HTML

```html
<!-- Include the CSS -->
<link rel="stylesheet" href="design-system/colors.css">
<link rel="stylesheet" href="components/data-card.css">

<!-- Basic card -->
<div class="data-card" data-state="default">
  <div class="data-card__content">
    <p class="data-card__text">Preference Data</p>
  </div>
</div>

<!-- Include the JS -->
<script src="components/data-card.js"></script>
```

### JavaScript

#### Initialize existing cards

```javascript
// Auto-initialize all cards on the page
const cards = initDataCards();
```

#### Create cards programmatically

```javascript
// Create a new card
const myCard = createDataCard({
  state: 'default',
  data: 'My Custom Data',
  onStateChange: (newState) => {
    console.log('State changed to:', newState);
  }
});

// Append to DOM
document.getElementById('container').appendChild(myCard.element);
```

#### Manual instantiation

```javascript
const cardElement = document.querySelector('.data-card');
const card = new DataCard(cardElement, {
  state: 'favorited',
  data: 'Shopping Preferences',
  onStateChange: (state) => {
    // Handle state changes
    console.log('New state:', state);
  }
});
```

## API

### Constructor Options

```javascript
new DataCard(element, {
  state: 'default',           // Initial state: 'default', 'favorited', 'hidden'
  data: 'Preference Data',    // Text content
  onStateChange: (state) => {} // Callback when state changes
});
```

### Methods

#### `setState(state)`
Set the card state.

```javascript
card.setState('favorited');
```

#### `getState()`
Get the current state.

```javascript
const currentState = card.getState(); // 'default', 'favorited', or 'hidden'
```

#### `toggleState()`
Toggle to the next state (default → favorited → hidden → default).

```javascript
card.toggleState();
```

#### `setData(data)`
Update the card text.

```javascript
card.setData('New Preference Name');
```

#### `getData()`
Get the current text.

```javascript
const text = card.getData();
```

#### `destroy()`
Clean up event listeners.

```javascript
card.destroy();
```

## Examples

### Toggle state on click

```javascript
const card = new DataCard(element, {
  state: 'default',
  data: 'Click to toggle'
});

// Default behavior already toggles on click
```

### Custom click behavior

```javascript
const card = new DataCard(element, {
  state: 'default',
  data: 'Travel Preferences',
  onStateChange: (state) => {
    // Save to storage
    chrome.storage.local.set({ [`pref_${card.getData()}`]: state });
  }
});

// Override click behavior
card.handleClick = function() {
  if (this.getState() === 'default') {
    this.setState('favorited');
  } else {
    this.setState('default');
  }
};
```

### Dynamic card list

```javascript
const preferences = [
  { name: 'Travel', state: 'favorited' },
  { name: 'Food', state: 'default' },
  { name: 'Shopping', state: 'hidden' }
];

const container = document.getElementById('preferences-list');

preferences.forEach(pref => {
  const card = createDataCard({
    state: pref.state,
    data: pref.name
  });
  container.appendChild(card.element);
});
```

## Styling

The component uses CSS custom properties from the design system. Ensure `design-system/colors.css` is included before `data-card.css`.

### Custom styling

```css
/* Override card width */
.data-card {
  width: 100%;
  max-width: 500px;
}

/* Custom hover effect */
.data-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
```

## Chrome Extension Integration

### Popup example

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="design-system/colors.css">
  <link rel="stylesheet" href="components/data-card.css">
</head>
<body>
  <div id="preferences"></div>

  <script src="components/data-card.js"></script>
  <script>
    // Load preferences from storage
    chrome.storage.local.get(['preferences'], (result) => {
      const prefs = result.preferences || [];
      const container = document.getElementById('preferences');

      prefs.forEach(pref => {
        const card = createDataCard({
          state: pref.state,
          data: pref.name,
          onStateChange: (newState) => {
            // Update storage
            pref.state = newState;
            chrome.storage.local.set({ preferences: prefs });
          }
        });
        container.appendChild(card.element);
      });
    });
  </script>
</body>
</html>
```

## Typography

The component uses **Instrument Sans Medium**:
- Font weight: 500
- Font size: 16px
- Line height: 1.5

Make sure to include the font in your project:

```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@500&display=swap" rel="stylesheet">
```

Or install locally for offline use in your Chrome extension.
