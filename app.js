/**
 * Data Gems Chrome Extension
 * Main application logic
 */

console.log('Data Gems app.js loaded');

// State management
const AppState = {
  currentScreen: 'home',
  userData: {
    name: 'Dennis',
    subtitle: 'Founder',
    email: '',
    age: '',
    gender: '',
    location: '',
    languages: [],
    description: ''
  },
  preferences: []
};

// Load data from Chrome storage
async function loadData() {
  try {
    const result = await chrome.storage.local.get(['userData', 'preferences']);
    if (result.userData) {
      AppState.userData = { ...AppState.userData, ...result.userData };
    }
    if (result.preferences) {
      AppState.preferences = result.preferences;
    }
    console.log('Data loaded from storage');
  } catch (error) {
    console.log('Error loading data (maybe not in extension context):', error);
  }
}

// Save data to Chrome storage
async function saveData() {
  try {
    await chrome.storage.local.set({
      userData: AppState.userData,
      preferences: AppState.preferences
    });
    console.log('Data saved to storage');
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Render current screen
function renderCurrentScreen() {
  const appContainer = document.getElementById('app');
  if (!appContainer) {
    console.error('App container not found');
    return;
  }

  appContainer.innerHTML = '';
  let screenComponent;

  try {
    switch (AppState.currentScreen) {
      case 'home':
        screenComponent = createHome({
          profileName: AppState.userData.name,
          profileSubtitle: AppState.userData.subtitle,
          preferencesData: AppState.preferences,
          onProfileClick: () => {
            AppState.currentScreen = 'profile';
            renderCurrentScreen();
          },
          onMenuButtonClick: (button, index) => {
            if (index === 1) { // Settings button
              AppState.currentScreen = 'settings';
              renderCurrentScreen();
            }
          }
        });
        break;

      case 'profile':
        screenComponent = createProfile({
          profileName: AppState.userData.name,
          profileSubtitle: AppState.userData.subtitle,
          profileDescription: AppState.userData.description,
          email: AppState.userData.email,
          age: AppState.userData.age,
          gender: AppState.userData.gender,
          location: AppState.userData.location,
          languages: AppState.userData.languages,
          onClose: () => {
            AppState.currentScreen = 'home';
            renderCurrentScreen();
          }
        });
        break;

      case 'settings':
        screenComponent = createSettings({
          onClose: () => {
            AppState.currentScreen = 'home';
            renderCurrentScreen();
          },
          onBackupData: exportData,
          onUpdateData: importData
        });
        break;

      default:
        AppState.currentScreen = 'home';
        renderCurrentScreen();
        return;
    }

    if (screenComponent && screenComponent.element) {
      appContainer.appendChild(screenComponent.element);
      console.log('Screen rendered:', AppState.currentScreen);
    }
  } catch (error) {
    console.error('Error rendering screen:', error);
  }
}

// Export data
function exportData() {
  const data = {
    userData: AppState.userData,
    preferences: AppState.preferences,
    exportDate: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `data-gems-backup-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import data
function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.userData) AppState.userData = { ...AppState.userData, ...data.userData };
      if (data.preferences) AppState.preferences = data.preferences;
      await saveData();
      renderCurrentScreen();
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Failed to import data.');
    }
  };
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}

// Initialize
async function init() {
  console.log('Initializing Data Gems...');
  await loadData();
  renderCurrentScreen();
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
