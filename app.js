/**
 * Data Gems Chrome Extension
 * Main application logic - HAS Protocol v0.1
 */

console.log('Data Gems app.js loaded');

// State management - HAS Protocol v0.1
let AppState = null;

// Initialize with default HAS profile
function initializeDefaultProfile() {
  return createInitialProfile({
    name: 'Dennis',
    subtitle: 'Founder',
    email: '',
    age: '',
    gender: '',
    location: '',
    languages: [],
    description: ''
  });
}

// Load data from Chrome storage
async function loadData() {
  try {
    const result = await chrome.storage.local.get(['hasProfile', 'userData', 'preferences']);

    // Check if we have new HAS format
    if (result.hasProfile) {
      AppState = result.hasProfile;
      console.log('Loaded HAS v0.1 profile from storage');
      console.log('📥 Loaded preferences:', AppState.content.preferences.items.map(p => `[${p.state}] ${p.value.substring(0, 20)}`).join('\n'));
    }
    // Legacy format - migrate it
    else if (result.userData || result.preferences) {
      console.log('Legacy data detected - migrating to HAS v0.1...');
      const legacyState = {
        userData: result.userData || {},
        preferences: result.preferences || []
      };
      AppState = migrateLegacyState(legacyState);

      // Save migrated data
      await saveData();
      console.log('Migration complete');
    }
    // No data - create fresh profile
    else {
      console.log('No existing data - creating fresh profile');
      AppState = initializeDefaultProfile();
      await saveData();
    }
  } catch (error) {
    console.log('Error loading data:', error);
    AppState = initializeDefaultProfile();
  }
}

// Save data to Chrome storage
async function saveData() {
  try {
    AppState.updated_at = getTimestamp();

    console.log('💾 About to save...');
    try {
      const prefsLog = AppState.content.preferences.items.map(p => `[${p.state}] ${p.value.substring(0, 20)}`).join('\n');
      console.log('💾 Saving preferences:\n' + prefsLog);
    } catch (logErr) {
      console.error('Error logging preferences:', logErr);
    }

    await chrome.storage.local.set({
      hasProfile: AppState
    });
    console.log('✅ HAS v0.1 profile saved to storage');
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Get user identity (helper for backward compatibility)
function getUserData() {
  return getUserIdentity(AppState);
}

// Get preferences (helper for backward compatibility)
// Transforms HAS format to UI format
function getPreferences() {
  const items = AppState?.content?.preferences?.items || [];
  console.log('📦 getPreferences - AppState items:', items.map(i => ({ id: i.id, value: i.value, state: i.state })));
  const mapped = items.map(item => ({
    id: item.id,
    name: item.value,  // UI expects 'name', HAS has 'value'
    state: item.state,
    collections: item.collections
  }));
  console.log('📦 getPreferences - Mapped for UI:', mapped);
  return mapped;
}

// Render current screen
function renderCurrentScreen() {
  const appContainer = document.getElementById('app');
  if (!appContainer) {
    console.error('App container not found');
    return;
  }

  const currentScreen = AppState?.metadata?.currentScreen || 'home';
  appContainer.innerHTML = '';
  let screenComponent;

  try {
    const userData = getUserData();
    const preferences = getPreferences();

    switch (currentScreen) {
      case 'home':
        screenComponent = createHome({
          profileName: userData.name,
          profileSubtitle: userData.subtitle || 'User',
          preferencesData: preferences,
          onProfileClick: () => {
            AppState.metadata.currentScreen = 'profile';
            renderCurrentScreen();
          },
          onMenuButtonClick: (button, index) => {
            if (index === 1) { // Settings button
              AppState.metadata.currentScreen = 'settings';
              renderCurrentScreen();
            }
          },
          onPreferenceAdd: async (value, state, collections) => {
            AppState = addPreference(AppState, value, state, collections);
            await saveData();
            renderCurrentScreen();
          },
          onPreferenceUpdate: async (prefId, updates) => {
            console.log('🔄 onPreferenceUpdate called in app.js:', { prefId, updates });
            console.log('🔍 Updates object:', JSON.stringify(updates, null, 2));
            console.log('BEFORE:', AppState.content.preferences.items.map(p => `[${p.state}] ${p.value.substring(0, 20)}`).join('\n'));
            AppState = updatePreference(AppState, prefId, updates);
            console.log('AFTER:', AppState.content.preferences.items.map(p => `[${p.state}] ${p.value.substring(0, 20)}`).join('\n'));
            await saveData();
            console.log('💾 Data saved, about to re-render');
            renderCurrentScreen();
          },
          onPreferenceDelete: async (prefId) => {
            console.log('🗑️ onPreferenceDelete called in app.js:', { prefId });
            console.log('🗑️ AppState BEFORE delete:');
            console.table(AppState.content.preferences.items.map(p => ({ id: p.id, value: p.value.substring(0, 30), state: p.state })));
            AppState = deletePreference(AppState, prefId);
            console.log('🗑️ AppState AFTER delete:');
            console.table(AppState.content.preferences.items.map(p => ({ id: p.id, value: p.value.substring(0, 30), state: p.state })));
            await saveData();
            console.log('💾 Data saved, about to re-render');
            renderCurrentScreen();
          }
        });
        break;

      case 'profile':
        screenComponent = createProfile({
          profileName: userData.name,
          profileSubtitle: userData.subtitle || 'User',
          profileDescription: userData.description,
          email: userData.email,
          age: userData.age,
          gender: userData.gender,
          location: userData.location,
          languages: userData.languages,
          onClose: () => {
            AppState.metadata.currentScreen = 'home';
            renderCurrentScreen();
          },
          onSave: async (profileData) => {
            // Update each field in HAS structure
            if (profileData.name !== undefined) {
              AppState = updateUserIdentity(AppState, 'name', profileData.name);
            }
            if (profileData.subtitle !== undefined) {
              AppState = updateUserIdentity(AppState, 'subtitle', profileData.subtitle);
            }
            if (profileData.email !== undefined) {
              AppState = updateUserIdentity(AppState, 'email', profileData.email);
            }
            if (profileData.age !== undefined) {
              AppState = updateUserIdentity(AppState, 'age', profileData.age);
            }
            if (profileData.gender !== undefined) {
              AppState = updateUserIdentity(AppState, 'gender', profileData.gender);
            }
            if (profileData.location !== undefined) {
              AppState = updateUserIdentity(AppState, 'location', profileData.location);
            }
            if (profileData.description !== undefined) {
              AppState = updateUserIdentity(AppState, 'description', profileData.description);
            }
            if (profileData.languages !== undefined) {
              AppState = updateUserIdentity(AppState, 'languages', profileData.languages);
            }

            await saveData();
            console.log('Profile updated');
          }
        });
        break;

      case 'settings':
        screenComponent = createSettings({
          onClose: () => {
            AppState.metadata.currentScreen = 'home';
            renderCurrentScreen();
          },
          onBackupData: exportData,
          onUpdateData: importData,
          onClearData: clearAllData,
          onThirdPartyData: importThirdPartyData
        });
        break;

      default:
        AppState.metadata.currentScreen = 'home';
        renderCurrentScreen();
        return;
    }

    if (screenComponent && screenComponent.element) {
      appContainer.appendChild(screenComponent.element);
      console.log('Screen rendered:', currentScreen);
    }
  } catch (error) {
    console.error('Error rendering screen:', error);
  }
}

// Export data (HAS v0.1 format)
function exportData() {
  // Clean metadata - remove internal fields
  const cleanMetadata = {
    schema_version: AppState.metadata.schema_version,
    extension_version: AppState.metadata.extension_version,
    total_preferences: AppState.metadata.total_preferences,
    last_backup: AppState.metadata.last_backup
  };

  // Rebuild content.basic.identity in correct field order
  const identity = {};
  const source = AppState.content.basic.identity;
  identity.name = source.name;
  identity.subtitle = source.subtitle;
  identity.email = source.email;
  identity.age = source.age;
  identity.gender = source.gender;
  identity.location = source.location;
  identity.description = source.description;
  identity.languages = source.languages;

  // Build data in correct HAS v0.1 field order
  const data = {
    // Header fields (in order)
    id: AppState.id,
    has: AppState.has,
    type: AppState.type,
    created_at: AppState.created_at,
    updated_at: AppState.updated_at,

    // Content (with correct field order)
    content: {
      basic: {
        identity: identity
      },
      preferences: AppState.content.preferences
    },

    // Collections
    collections: AppState.collections,

    // Settings
    settings: AppState.settings,

    // Metadata (cleaned)
    metadata: cleanMetadata,

    // Export metadata (at the end)
    exportDate: getTimestamp(),
    exportVersion: '0.1'
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `data-gems-has-profile-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log('HAS v0.1 profile exported');
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

      // Check if it's HAS format
      if (data.has && data.content) {
        AppState = data;
        console.log('Imported HAS v0.1 profile');
      }
      // Legacy format
      else if (data.userData || data.preferences) {
        console.log('Legacy format detected - migrating...');
        AppState = migrateLegacyState(data);
      }
      else {
        throw new Error('Invalid data format');
      }

      await saveData();
      renderCurrentScreen();
      alert('Data imported successfully!');
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Failed to import data: ' + error.message);
    }
  };
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}

// Clear all data
async function clearAllData() {
  const confirmed = confirm(
    'Are you sure you want to delete all your data?\n\n' +
    'This action cannot be undone. All preferences and profile information will be permanently deleted.'
  );

  if (confirmed) {
    try {
      await chrome.storage.local.clear();
      console.log('All data cleared');

      // Reset to fresh profile
      AppState = initializeDefaultProfile();
      await saveData();

      // Go to home screen
      AppState.metadata.currentScreen = 'home';
      renderCurrentScreen();

      alert('All data has been deleted successfully.');
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Failed to clear data: ' + error.message);
    }
  }
}

// Import third party data (Google Sheets)
async function importThirdPartyData() {
  const url = prompt(
    'Import from Google Sheets\n\n' +
    'Please enter the Google Sheets URL:\n' +
    '(The sheet must be accessible to anyone with the link)'
  );

  if (!url) return; // User cancelled

  try {
    // Show loading message
    console.log('Importing Google Sheet...');

    // Import the sheet (title will be fetched automatically)
    const preferenceData = await importGoogleSheet(url);

    // Add to AppState
    AppState = addPreference(
      AppState,
      preferenceData.value,
      preferenceData.state,
      preferenceData.collections
    );

    // Save to storage
    await saveData();

    // Go to home screen to show the new card
    AppState.metadata.currentScreen = 'home';
    renderCurrentScreen();

    alert('Google Sheet imported successfully!');
  } catch (error) {
    console.error('Error importing Google Sheet:', error);
    alert('Failed to import Google Sheet:\n' + error.message);
  }
}

// Initialize
async function init() {
  console.log('Initializing Data Gems with HAS Protocol v0.1...');
  await loadData();

  // Initialize currentScreen in metadata if not present
  if (!AppState.metadata) {
    AppState.metadata = {
      schema_version: '0.1',
      extension_version: '2.0.0',
      total_preferences: AppState?.content?.preferences?.items?.length || 0,
      last_backup: null,
      currentScreen: 'home'
    };
  }
  if (!AppState.metadata.currentScreen) {
    AppState.metadata.currentScreen = 'home';
  }

  renderCurrentScreen();
  console.log('Data Gems initialized successfully!');
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
