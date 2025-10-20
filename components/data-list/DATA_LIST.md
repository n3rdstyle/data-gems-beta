# Data List Component

A container component for managing a vertical stack of data cards with consistent spacing and powerful management features.

## Features

- **Vertical Stack**: Cards arranged vertically with 12px gap
- **Dynamic Management**: Add, remove, clear cards
- **State Control**: Set all cards to a specific state
- **Filtering**: Search and filter cards by text
- **Sorting**: Alphabetically sort cards
- **Import/Export**: Save and load list data
- **Event Callbacks**: React to card state changes and list modifications

## Structure

```
Data List (368px wide)
├── Data Card 1
├── 12px gap
├── Data Card 2
├── 12px gap
├── Data Card 3
└── ...
```

## Usage

### HTML

```html
<!-- Include dependencies -->
<link rel="stylesheet" href="design-system/colors.css">
<link rel="stylesheet" href="components/data-card.css">
<link rel="stylesheet" href="components/data-list.css">

<!-- Basic list -->
<div class="data-list">
  <!-- Cards will be added here -->
</div>

<!-- Include scripts -->
<script src="components/data-card.js"></script>
<script src="components/data-list.js"></script>
```

### JavaScript

#### Create and populate a list

```javascript
// Create a new list with data
const list = createDataList({
  data: [
    { name: 'Travel Preferences', state: 'favorited' },
    { name: 'Shopping Habits', state: 'default' },
    { name: 'Food & Dining', state: 'hidden' }
  ],
  onCardStateChange: (card, state) => {
    console.log(`${card.getData()} changed to: ${state}`);
  },
  onListChange: (action, card) => {
    console.log(`List ${action}:`, card);
  }
});

// Append to DOM
document.getElementById('container').appendChild(list.element);
```

#### Initialize existing list

```javascript
const listElement = document.querySelector('.data-list');
const list = new DataList(listElement);
```

## API

### Constructor Options

```javascript
new DataList(element, {
  data: [],                    // Initial data array
  onCardStateChange: (card, state) => {},  // Card state change callback
  onListChange: (action, card) => {}       // List modification callback
});
```

### Methods

#### Managing Cards

##### `addCard(name, state)`
Add a new card to the list.

```javascript
const newCard = list.addCard('Technology Interests', 'default');
```

##### `removeCard(card)`
Remove a specific card.

```javascript
list.removeCard(card);
```

##### `clear()`
Remove all cards from the list.

```javascript
list.clear();
```

#### Querying Cards

##### `getCards()`
Get all cards in the list.

```javascript
const allCards = list.getCards();
```

##### `getCardsByState(state)`
Get cards filtered by state.

```javascript
const favoritedCards = list.getCardsByState('favorited');
const hiddenCards = list.getCardsByState('hidden');
```

##### `getCount()`
Get the total number of cards.

```javascript
const total = list.getCount();
```

#### Bulk Operations

##### `setAllStates(state)`
Set all cards to the same state.

```javascript
list.setAllStates('default');     // Reset all
list.setAllStates('favorited');   // Favorite all
list.setAllStates('hidden');      // Hide all
```

##### `populate(data)`
Replace all cards with new data.

```javascript
list.populate([
  { name: 'Card 1', state: 'default' },
  { name: 'Card 2', state: 'favorited' }
]);
```

#### Import/Export

##### `export()`
Export list data as an array.

```javascript
const data = list.export();
// Returns: [{ name: '...', state: '...' }, ...]

// Save to storage
chrome.storage.local.set({ preferences: data });
```

##### `import(data)`
Import and populate from data array.

```javascript
chrome.storage.local.get(['preferences'], (result) => {
  list.import(result.preferences);
});
```

#### Filtering & Sorting

##### `filter(searchTerm)`
Show only cards matching the search term.

```javascript
list.filter('travel');  // Show only cards containing "travel"
```

##### `clearFilter()`
Show all cards (remove filter).

```javascript
list.clearFilter();
```

##### `sort(ascending)`
Sort cards alphabetically.

```javascript
list.sort(true);   // A-Z
list.sort(false);  // Z-A
```

#### Cleanup

##### `destroy()`
Clean up all event listeners and destroy cards.

```javascript
list.destroy();
```

## Examples

### Complete preference manager

```javascript
// Create list
const list = createDataList({
  data: [],
  onCardStateChange: (card, state) => {
    // Save to storage when state changes
    saveToStorage();
  }
});

document.getElementById('list-container').appendChild(list.element);

// Add search functionality
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', (e) => {
  if (e.target.value) {
    list.filter(e.target.value);
  } else {
    list.clearFilter();
  }
});

// Add sort button
document.getElementById('sort-btn').addEventListener('click', () => {
  list.sort(true);
});

// Add card button
document.getElementById('add-btn').addEventListener('click', () => {
  const name = prompt('Enter preference name:');
  if (name) {
    list.addCard(name, 'default');
    saveToStorage();
  }
});

// Save function
function saveToStorage() {
  const data = list.export();
  chrome.storage.local.set({ preferences: data });
}

// Load on startup
chrome.storage.local.get(['preferences'], (result) => {
  if (result.preferences) {
    list.import(result.preferences);
  }
});
```

### Get statistics

```javascript
const total = list.getCount();
const favorited = list.getCardsByState('favorited').length;
const hidden = list.getCardsByState('hidden').length;
const active = list.getCardsByState('default').length;

console.log(`Total: ${total}`);
console.log(`Favorited: ${favorited}`);
console.log(`Hidden: ${hidden}`);
console.log(`Active: ${active}`);
```

### Batch state updates

```javascript
// Favorite all cards containing "travel"
list.getCards().forEach(card => {
  if (card.getData().toLowerCase().includes('travel')) {
    card.setState('favorited');
  }
});

// Hide all default cards
list.getCardsByState('default').forEach(card => {
  card.setState('hidden');
});
```

### Event tracking

```javascript
const list = new DataList(element, {
  onCardStateChange: (card, state) => {
    // Track analytics
    analytics.track('card_state_changed', {
      name: card.getData(),
      state: state
    });
  },
  onListChange: (action, card) => {
    // Update UI counters
    updateCounters();

    // Log changes
    console.log(`List ${action}`, card ? card.getData() : '');
  }
});
```

## Chrome Extension Integration

### Popup with live search

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="design-system/colors.css">
  <link rel="stylesheet" href="components/data-card.css">
  <link rel="stylesheet" href="components/data-list.css">
  <style>
    body { padding: 16px; width: 400px; }
    .search { width: 100%; padding: 12px; margin-bottom: 16px; border-radius: 8px; }
  </style>
</head>
<body>
  <input type="text" class="search" placeholder="Search preferences...">
  <div class="data-list" id="preferences"></div>

  <script src="components/data-card.js"></script>
  <script src="components/data-list.js"></script>
  <script>
    const list = new DataList(document.getElementById('preferences'));

    // Load from storage
    chrome.storage.local.get(['preferences'], (result) => {
      list.populate(result.preferences || []);
    });

    // Search
    document.querySelector('.search').addEventListener('input', (e) => {
      list.filter(e.target.value);
    });

    // Auto-save on changes
    list.onCardStateChange = () => {
      chrome.storage.local.set({ preferences: list.export() });
    };
  </script>
</body>
</html>
```

## Styling

The component uses the design system colors. The 12px gap between cards matches the Figma design exactly.

### Custom styling

```css
/* Adjust gap */
.data-list {
  gap: 16px;
}

/* Add animations */
.data-list > .data-card {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Notes

- Requires `data-card.js` to be loaded first
- Default width: 368px (matches Figma design)
- Gap between cards: 12px (matches Figma design)
- Cards automatically fill the list width
- All data-card methods and properties are accessible through list cards
