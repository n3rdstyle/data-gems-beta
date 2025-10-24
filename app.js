/**
 * Data Gems Chrome Extension
 * Main application logic - HAS Protocol v0.1
 */

console.log('✅ Data Gems app.js loaded - VERSION 2024-10-24-EXPORT-FIX');

// State management - HAS Protocol v0.1
let AppState = null;

// Initialize with default HAS profile
function initializeDefaultProfile() {
  return createInitialProfile({
    name: 'Dennis',
    subtitle: '',
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
      console.log('✅ Loaded HAS v0.1 profile from storage');
    }
    // Legacy format - migrate it
    else if (result.userData || result.preferences) {
      console.log('⚠️ Legacy data detected - migrating to HAS v0.1...');
      const legacyState = {
        userData: result.userData || {},
        preferences: result.preferences || []
      };
      AppState = migrateLegacyState(legacyState);

      // Save migrated data
      await saveData();
      console.log('✅ Migration complete');
    }
    // No data - create fresh profile
    else {
      console.log('📝 No existing data - creating fresh profile');
      AppState = initializeDefaultProfile();
      await saveData();
    }
  } catch (error) {
    console.error('❌ Error loading data:', error);
    AppState = initializeDefaultProfile();
  }
}

// Save data to Chrome storage
async function saveData() {
  try {
    AppState.updated_at = getTimestamp();

    await chrome.storage.local.set({
      hasProfile: AppState
    });
    console.log('💾 Data saved');
  } catch (error) {
    console.error('❌ Error saving data:', error);
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
  const mapped = items.map(item => ({
    id: item.id,
    name: item.value,  // UI expects 'name', HAS has 'value'
    state: item.state,
    collections: item.collections
  }));
  // Reverse to show newest first (newest at top)
  return [...mapped].reverse();
}

// Export data (HAS v0.1 format) - defined before renderCurrentScreen
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
  identity.avatarImage = source.avatarImage;
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
}

// Import/Export helper functions declared before renderCurrentScreen
function hasValue(field) {
  if (!field || !field.value) return false;
  if (typeof field.value === 'string' && field.value.trim() === '') return false;
  if (Array.isArray(field.value) && field.value.length === 0) return false;
  if (field.value === null) return false;
  return true;
}

async function mergeImportedData(importedData) {
  const conflicts = [];
  const additions = [];

  // Check identity fields for conflicts
  const identityFields = ['name', 'subtitle', 'avatarImage', 'email', 'age', 'gender', 'location', 'description', 'languages'];
  identityFields.forEach(fieldName => {
    const existingField = AppState.content.basic.identity[fieldName];
    const importedField = importedData.content.basic.identity[fieldName];

    if (hasValue(existingField) && hasValue(importedField)) {
      // Both have values - potential conflict
      if (JSON.stringify(existingField.value) !== JSON.stringify(importedField.value)) {
        conflicts.push({
          field: fieldName,
          existing: existingField.value,
          imported: importedField.value
        });
      }
    } else if (!hasValue(existingField) && hasValue(importedField)) {
      // Only imported has value - add it
      additions.push(fieldName);
    }
  });

  // Check preferences for conflicts
  const existingPrefs = AppState.content.preferences.items || [];
  const importedPrefs = importedData.content.preferences.items || [];

  importedPrefs.forEach(importedPref => {
    const existingPref = existingPrefs.find(p => p.value === importedPref.value);
    if (!existingPref) {
      additions.push(`preference: ${importedPref.value.substring(0, 50)}...`);
    }
  });

  // Show confirmation dialog if there are conflicts
  if (conflicts.length > 0) {
    const conflictDetails = conflicts.map(c => {
      const existingStr = typeof c.existing === 'string' ? c.existing : JSON.stringify(c.existing);
      const importedStr = typeof c.imported === 'string' ? c.imported : JSON.stringify(c.imported);
      return `\n• ${c.field}:\n  Current: "${existingStr}"\n  Import: "${importedStr}"`;
    }).join('\n');

    const confirmed = confirm(
      `⚠️ The following fields already have values:\n${conflictDetails}\n\n` +
      `Do you want to OVERWRITE these ${conflicts.length} field(s)?\n\n` +
      `Click OK to overwrite, or Cancel to keep your existing data and only import new fields.`
    );

    if (!confirmed) {
      // Only merge non-conflicting data
      identityFields.forEach(fieldName => {
        const existingField = AppState.content.basic.identity[fieldName];
        const importedField = importedData.content.basic.identity[fieldName];

        if (!hasValue(existingField) && hasValue(importedField)) {
          AppState.content.basic.identity[fieldName] = importedField;
        }
      });

      // Add new preferences only
      importedPrefs.forEach(importedPref => {
        const existingPref = existingPrefs.find(p => p.value === importedPref.value);
        if (!existingPref) {
          AppState.content.preferences.items.push(importedPref);
        }
      });

      return 'merged';
    } else {
      // Overwrite everything
      return 'overwrite';
    }
  } else if (additions.length > 0) {
    // No conflicts, just additions
    identityFields.forEach(fieldName => {
      const existingField = AppState.content.basic.identity[fieldName];
      const importedField = importedData.content.basic.identity[fieldName];

      if (!hasValue(existingField) && hasValue(importedField)) {
        AppState.content.basic.identity[fieldName] = importedField;
      }
    });

    // Add new preferences
    importedPrefs.forEach(importedPref => {
      const existingPref = existingPrefs.find(p => p.value === importedPref.value);
      if (!existingPref) {
        AppState.content.preferences.items.push(importedPref);
      }
    });

    return 'merged';
  } else {
    // No changes needed
    return 'no-changes';
  }
}

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

      let importedData;

      // Check if it's HAS format
      if (data.has && data.content) {
        console.log('✅ HAS format detected');
        importedData = data;
      } else {
        console.log('❌ Unknown format');
        alert('Unknown format. Please import a valid HAS v0.1 profile.');
        return;
      }

      // Merge imported data with existing data (with conflict detection)
      const mergeResult = await mergeImportedData(importedData);

      if (mergeResult === 'overwrite') {
        // User chose to overwrite - use imported data directly
        AppState = importedData;
        AppState.metadata.currentScreen = 'home';
      } else if (mergeResult === 'merged') {
        // Data was merged - AppState already updated in mergeImportedData
        AppState.metadata.currentScreen = 'home';
      } else if (mergeResult === 'no-changes') {
        alert('No new data to import.');
        return;
      }

      await saveData();
      renderCurrentScreen();
      alert('✅ Data imported successfully!');
    } catch (error) {
      console.error('Error importing data:', error);
      alert('❌ Error importing data: ' + error.message);
    }
  };
  input.click();
}

function clearAllData() {
  const confirmed = confirm('⚠️ Are you sure you want to clear all data? This cannot be undone.');
  if (confirmed) {
    AppState = initializeDefaultProfile();
    saveData();
    renderCurrentScreen();
    alert('✅ All data cleared successfully!');
  }
}

function importThirdPartyData() {
  alert('Third-party data import is not yet implemented.');
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
          profileSubtitle: userData.subtitle || '',
          profileDescription: userData.description,
          avatarImage: userData.avatarImage,
          email: userData.email,
          age: userData.age,
          gender: userData.gender,
          location: userData.location,
          languages: userData.languages,
          preferencesData: preferences,
          usedRandomQuestions: AppState?.metadata?.usedRandomQuestions || [],
          onProfileClick: () => {
            AppState.metadata.currentScreen = 'profile';
            renderCurrentScreen();
          },
          getProfileData: () => {
            // Return current profile data from AppState
            return getUserData();
          },
          onProfileSave: async (profileData) => {
            // Update each field in HAS structure
            if (profileData.name !== undefined) {
              AppState = updateUserIdentity(AppState, 'name', profileData.name);
            }
            if (profileData.subtitle !== undefined) {
              AppState = updateUserIdentity(AppState, 'subtitle', profileData.subtitle);
            }
            if (profileData.avatarImage !== undefined) {
              AppState = updateUserIdentity(AppState, 'avatarImage', profileData.avatarImage);
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

            // Update header profile teaser
            const updatedUserData = getUserData();
            screenComponent.updateHeaderProfile({
              name: updatedUserData.name,
              subtitle: updatedUserData.subtitle,
              avatarImage: updatedUserData.avatarImage
            });
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
            AppState = updatePreference(AppState, prefId, updates);
            await saveData();
            renderCurrentScreen();
          },
          onPreferenceDelete: async (prefId) => {
            AppState = deletePreference(AppState, prefId);
            await saveData();
            renderCurrentScreen();
          },
          onRandomQuestionUsed: async (questionText) => {
            // Add to used questions array
            if (!AppState.metadata.usedRandomQuestions) {
              AppState.metadata.usedRandomQuestions = [];
            }
            if (!AppState.metadata.usedRandomQuestions.includes(questionText)) {
              AppState.metadata.usedRandomQuestions.push(questionText);
              await saveData();
            }
          },
          onBackupData: exportData,
          onUpdateData: importData,
          onClearData: clearAllData,
          onThirdPartyData: importThirdPartyData,
          onDescriptionToggle: async (state) => {
            AppState = updateUserIdentityState(AppState, 'description', state);
            await saveData();
          },
          onPersonalInfoToggle: async (state) => {
            // Update all personal info fields to the same state
            AppState = updateUserIdentityState(AppState, 'email', state);
            AppState = updateUserIdentityState(AppState, 'age', state);
            AppState = updateUserIdentityState(AppState, 'gender', state);
            AppState = updateUserIdentityState(AppState, 'location', state);
            await saveData();
          }
        });
        break;

      case 'profile':
        const profileOnSave = async (profileData) => {
          // Update each field in HAS structure
          if (profileData.name !== undefined) {
            AppState = updateUserIdentity(AppState, 'name', profileData.name);
          }
          if (profileData.subtitle !== undefined) {
            AppState = updateUserIdentity(AppState, 'subtitle', profileData.subtitle);
          }
          if (profileData.avatarImage !== undefined) {
            AppState = updateUserIdentity(AppState, 'avatarImage', profileData.avatarImage);
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
        };

        screenComponent = createProfile({
          profileName: userData.name,
          profileSubtitle: userData.subtitle || 'User',
          avatarImage: userData.avatarImage,
          profileDescription: userData.description,
          descriptionState: userData.descriptionState,
          email: userData.email,
          age: userData.age,
          gender: userData.gender,
          location: userData.location,
          languages: userData.languages,
          personalInfoState: (userData.emailState === 'hidden' && userData.ageState === 'hidden' && userData.genderState === 'hidden' && userData.locationState === 'hidden') ? 'hidden' : 'default',
          onClose: () => {
            AppState.metadata.currentScreen = 'home';
            renderCurrentScreen();
          },
          onSave: profileOnSave,
          onDescriptionToggle: async (state) => {
            AppState = updateUserIdentityState(AppState, 'description', state);
            await saveData();
          },
          onPersonalInfoToggle: async (state) => {
            // Update all personal info fields to the same state
            AppState = updateUserIdentityState(AppState, 'email', state);
            AppState = updateUserIdentityState(AppState, 'age', state);
            AppState = updateUserIdentityState(AppState, 'gender', state);
            AppState = updateUserIdentityState(AppState, 'location', state);
            await saveData();
          }
        });
        break;

      case 'settings':
        screenComponent = createSettings({
          onClose: () => {
            AppState.metadata.currentScreen = 'home';
            renderCurrentScreen();
          },
          onBackupData: () => exportData(),
          onUpdateData: () => importData(),
          onClearData: () => clearAllData(),
          onThirdPartyData: () => importThirdPartyData()
        });
        break;

      default:
        AppState.metadata.currentScreen = 'home';
        renderCurrentScreen();
        return;
    }

    if (screenComponent && screenComponent.element) {
      appContainer.appendChild(screenComponent.element);
    }
  } catch (error) {
    console.error('Error rendering screen:', error);
  }
}

// Initialize
async function init() {
  console.log('🚀 Initializing Data Gems with HAS Protocol v0.1...');
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
  // Always reset to home screen on extension load
  AppState.metadata.currentScreen = 'home';

  renderCurrentScreen();
  console.log('✅ Data Gems initialized successfully!');
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
