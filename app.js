/**
 * Data Gems Chrome Extension
 * Main application logic - HSP Protocol v0.1
 */

// State management - HSP Protocol v0.1
let AppState = null;

// Initialize with default HSP profile
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

// Backup tracking state
let BackupState = {
  reminderShown: false,
  autoBackupEnabled: false,
  lastBackupCount: 0
};

// Load backup state from Chrome storage
async function loadBackupState() {
  try {
    const result = await chrome.storage.local.get(['backupState']);
    if (result.backupState) {
      BackupState = result.backupState;
    }
  } catch (error) {
    // Silent error handling
  }
}

// Save backup state to Chrome storage
async function saveBackupState() {
  try {
    await chrome.storage.local.set({
      backupState: BackupState
    });
  } catch (error) {
    // Silent error handling
  }
}

// Load data from Chrome storage
async function loadData() {
  try {
    const result = await chrome.storage.local.get(['hspProfile', 'userData', 'preferences']);

    // Check if we have new HSP format
    if (result.hspProfile) {
      AppState = result.hspProfile;

      // Migrate 'has' property to 'hsp' if needed
      if (AppState.has && !AppState.hsp) {
        AppState.hsp = AppState.has;
        delete AppState.has;
        await saveData();
      }

      // Migrate third-party assurance if needed
      const migratedProfile = migrateThirdPartyAssurance(AppState);
      if (migratedProfile !== AppState) {
        AppState = migratedProfile;
        await saveData();
      }
    }
    // Legacy format - migrate it
    else if (result.userData || result.preferences) {
      const legacyState = {
        userData: result.userData || {},
        preferences: result.preferences || []
      };
      AppState = migrateLegacyState(legacyState);

      // Save migrated data
      await saveData();
    }
    // No data - create fresh profile
    else {
      AppState = initializeDefaultProfile();
      await saveData();
    }
  } catch (error) {
    AppState = initializeDefaultProfile();
  }
}

// Save data to Chrome storage
async function saveData() {
  try {
    AppState.updated_at = getTimestamp();

    await chrome.storage.local.set({
      hspProfile: AppState
    });
  } catch (error) {
    // Silent error handling
  }
}

// Get user identity (helper for backward compatibility)
function getUserData() {
  return getUserIdentity(AppState);
}

// Get preferences (helper for backward compatibility)
// Transforms HSP format to UI format
function getPreferences() {
  const items = AppState?.content?.preferences?.items || [];
  const mapped = items.map(item => {
    const pref = {
      id: item.id,
      name: item.value,  // UI expects 'name', HSP has 'value'
      state: item.state,
      collections: item.collections
    };

    // Add source info if sourceUrl exists
    if (item.source_url) {
      pref.source = {
        type: 'google',
        url: item.source_url
      };
    }

    return pref;
  });
  // Reverse to show newest first (newest at top)
  return [...mapped].reverse();
}

// Export data (HSP v0.1 format) - defined before renderCurrentScreen
async function exportData() {
  // Get beta user data
  const betaUserData = await chrome.storage.local.get(['betaUser']);
  const betaUser = betaUserData.betaUser || {};

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

  // Build data in correct HSP v0.1 field order
  const data = {
    // Header fields (in order)
    id: AppState.id,
    hsp: AppState.hsp,
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

    // Beta user info (if available)
    beta: betaUser.betaId ? {
      betaId: betaUser.betaId,
      betaEmail: betaUser.email,
      isBetaUser: true
    } : undefined,

    // Export metadata (at the end)
    exportDate: getTimestamp(),
    exportVersion: '0.1'
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `data-gems-hsp-profile-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Update last backup count after successful export
  const currentCount = AppState?.metadata?.total_preferences || 0;
  BackupState.lastBackupCount = currentCount;
  await saveBackupState();
}

// Check if backup reminder should be shown (after 10 preferences, only once)
async function checkBackupReminder() {
  const currentCount = AppState?.metadata?.total_preferences || 0;

  // Show reminder after 10 preferences, but only once
  if (currentCount >= 10 && !BackupState.reminderShown) {
    showBackupReminderModal();
    BackupState.reminderShown = true;
    await saveBackupState();
  }

  // Check for auto-backup trigger (after 50 and every 50 thereafter)
  if (BackupState.autoBackupEnabled) {
    await checkAutoBackup();
  }
}

// Check and trigger auto-backup if needed
async function checkAutoBackup() {
  const currentCount = AppState?.metadata?.total_preferences || 0;
  const lastBackupCount = BackupState.lastBackupCount || 0;

  // Trigger auto-backup at 50 and then every 50 entries (50, 100, 150, 200, ...)
  if (currentCount >= 50) {
    // Calculate the current milestone (e.g., 450 -> 450, 437 -> 400)
    const currentMilestone = Math.floor(currentCount / 50) * 50;
    // Calculate the last milestone we backed up
    const lastMilestone = Math.floor(lastBackupCount / 50) * 50;

    // Trigger backup if we've reached a new milestone
    if (currentMilestone > lastMilestone) {
      exportData();
      // exportData updates lastBackupCount internally
    }
  }
}

// Show backup reminder modal
function showBackupReminderModal() {
  const modal = createBackupReminderModal({
    autoBackupEnabled: BackupState.autoBackupEnabled,
    onClose: async (autoBackupState) => {
      BackupState.autoBackupEnabled = autoBackupState;
      await saveBackupState();
    },
    onExport: () => {
      exportData();
    },
    onAutoBackupToggle: async (isActive) => {
      BackupState.autoBackupEnabled = isActive;
      await saveBackupState();
    }
  });

  modal.show();
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
      // Overwrite conflicting fields and merge all preferences
      identityFields.forEach(fieldName => {
        const importedField = importedData.content.basic.identity[fieldName];

        if (hasValue(importedField)) {
          AppState.content.basic.identity[fieldName] = importedField;
        }
      });

      // Add all imported preferences (avoid duplicates)
      importedPrefs.forEach(importedPref => {
        const existingPref = existingPrefs.find(p => p.value === importedPref.value);
        if (!existingPref) {
          AppState.content.preferences.items.push(importedPref);
        }
      });

      return 'merged';
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

      // Check if it's HSP format (accept both 'hsp' and legacy 'has')
      if ((data.hsp || data.has) && data.content) {
        importedData = data;

        // Migrate 'has' to 'hsp' if needed
        if (importedData.has && !importedData.hsp) {
          importedData.hsp = importedData.has;
          delete importedData.has;
        }
      } else {
        alert('Unknown format. Please import a valid HSP v0.1 profile.');
        return;
      }

      // Restore beta user data if present in backup
      if (importedData.beta && importedData.beta.betaId) {
        const currentBetaData = await chrome.storage.local.get(['betaUser']);
        const currentBetaUser = currentBetaData.betaUser || {};

        // Only restore if not already checked in
        if (!currentBetaUser.checkedIn) {
          await chrome.storage.local.set({
            betaUser: {
              ...currentBetaUser,
              checkedIn: true,
              betaId: importedData.beta.betaId,
              email: importedData.beta.betaEmail || null
            }
          });
          console.log('✅ Beta user data restored from backup');
        }
      }

      // Merge imported data with existing data (with conflict detection)
      const mergeResult = await mergeImportedData(importedData);

      if (mergeResult === 'merged') {
        // Data was merged - AppState already updated in mergeImportedData
        AppState.metadata.currentScreen = 'home';
      } else if (mergeResult === 'no-changes') {
        alert('No new data to import.');
        return;
      }

      await saveData();
      renderCurrentScreen();
      // Check if beta check-in modal should be shown
      await checkBetaCheckinModal();
      // Check if backup reminder should be shown
      await checkBackupReminder();
      alert('✅ Data imported successfully!');
    } catch (error) {
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
  AppState.metadata.currentScreen = 'third-party-data';
  renderCurrentScreen();
}

async function handleGoogleSheetsImport(url) {
  try {
    // Import the sheet data
    const preferenceData = await importGoogleSheet(url);

    // Check if this sheet has already been imported (by URL)
    const existingPrefs = AppState.content.preferences.items || [];
    const alreadyImported = existingPrefs.find(p => p.source_url === preferenceData.sourceUrl);

    if (alreadyImported) {
      // Update existing preference
      const prefIndex = existingPrefs.findIndex(p => p.source_url === preferenceData.sourceUrl);
      AppState.content.preferences.items[prefIndex] = {
        ...alreadyImported,
        value: preferenceData.value,
        state: preferenceData.state,
        collections: preferenceData.collections,
        source_url: preferenceData.sourceUrl,
        updated_at: getTimestamp()
      };
    } else {
      // Add as new preference
      AppState = addPreference(
        AppState,
        preferenceData.value,
        preferenceData.state,
        preferenceData.collections,
        preferenceData.sourceUrl
      );
    }

    await saveData();

    // Refresh the screen to show updated list
    renderCurrentScreen();

    // Check if beta check-in modal should be shown
    await checkBetaCheckinModal();
    // Check if backup reminder should be shown
    await checkBackupReminder();

    alert('✅ Google Sheet imported successfully!');
  } catch (error) {
    throw error;
  }
}

function getImportedSheets() {
  const preferences = AppState.content.preferences.items || [];
  return preferences
    .filter(p => p.source_url && p.source_url.includes('docs.google.com/spreadsheets'))
    .map(p => {
      // Extract title from the value (first line)
      const title = p.value.split('\n')[0] || 'Untitled Sheet';
      return {
        url: p.source_url,
        title: title,
        id: p.id
      };
    });
}

// Render current screen
async function renderCurrentScreen() {
  const appContainer = document.getElementById('app');
  if (!appContainer) {
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
        // Get beta user status for home screen (for settings access)
        const homeBetaUserData = await chrome.storage.local.get(['betaUser']);
        const homeBetaUser = homeBetaUserData.betaUser || {};
        const homeIsBetaUser = homeBetaUser.checkedIn === true;

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
            // Update each field in HSP structure
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
            // Check if beta check-in modal should be shown
            await checkBetaCheckinModal();
            // Check if backup reminder should be shown
            await checkBackupReminder();
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
          },
          getAutoInjectEnabled: () => AppState?.settings?.injection?.auto_inject || false,
          onAutoInjectToggle: async (isEnabled) => {
            // Ensure settings.injection exists
            if (!AppState.settings) {
              AppState.settings = {};
            }
            if (!AppState.settings.injection) {
              AppState.settings.injection = {};
            }

            // Update the setting
            AppState.settings.injection.auto_inject = isEnabled;
            await saveData();
          },
          getAutoBackupEnabled: () => BackupState.autoBackupEnabled,
          onAutoBackupToggle: async (isEnabled) => {
            BackupState.autoBackupEnabled = isEnabled;
            await saveBackupState();
          },
          getAutoCategorizeEnabled: () => AppState?.settings?.categorization?.auto_categorize ?? true,
          onAutoCategorizeToggle: async (isEnabled) => {
            // Ensure settings.categorization exists
            if (!AppState.settings) {
              AppState.settings = {};
            }
            if (!AppState.settings.categorization) {
              AppState.settings.categorization = {};
            }

            // Update the setting
            AppState.settings.categorization.auto_categorize = isEnabled;
            await saveData();
          },
          onBulkAutoCategorize: async () => {
            // Get all preferences without collections
            const items = AppState?.content?.preferences?.items || [];
            const itemsWithoutCollections = items.filter(item =>
              !item.collections || item.collections.length === 0
            );

            if (itemsWithoutCollections.length === 0) {
              alert('No cards without collections found.');
              return;
            }

            // Get all existing collections for context
            const allCollections = [...new Set(items.flatMap(item => item.collections || []))];

            // Confirm with user
            const confirmed = confirm(`Auto-categorize ${itemsWithoutCollections.length} cards without collections?`);
            if (!confirmed) return;

            let categorizedCount = 0;

            // Process each item
            for (const item of itemsWithoutCollections) {
              try {
                const suggestions = await aiHelper.suggestCategories(item.value, allCollections);
                if (suggestions.length > 0) {
                  item.collections = suggestions;
                  categorizedCount++;
                }
              } catch (error) {
                console.error('[Bulk Auto-Categorize] Error for item:', item.id, error);
              }
            }

            // Save updated data
            await saveData();

            // Show result
            alert(`✓ ${categorizedCount} cards auto-categorized`);

            // Refresh UI
            renderCurrentScreen();
          },
          isBetaUser: homeIsBetaUser,
          onJoinBeta: () => {
            console.log('🎯 [Home] Join Beta button clicked from Settings!');
            // Open beta check-in modal
            const currentEmail = AppState?.content?.basic?.identity?.email?.value || '';
            const modal = createBetaCheckinModal({
              initialEmail: currentEmail,
              onClose: (joined) => {
                console.log('🎯 [Home] Beta modal closed, joined:', joined);
                if (joined) {
                  // Refresh to update settings
                  renderCurrentScreen();
                }
              },
              onJoin: async (email, consentGiven) => {
                console.log('🎯 [Home] Join clicked from home settings, email:', email);
                const result = await chrome.runtime.sendMessage({
                  action: 'betaCheckin',
                  email: email,
                  consentGiven: consentGiven
                });

                if (!result.success) {
                  throw new Error(result.error || 'Failed to join beta program');
                }

                // Update profile
                const identityEmail = AppState?.content?.basic?.identity?.email;
                if (identityEmail && (!identityEmail.value || identityEmail.value === '')) {
                  identityEmail.value = email;
                  identityEmail.updated_at = getTimestamp();
                }

                const identitySubtitle = AppState?.content?.basic?.identity?.subtitle;
                if (identitySubtitle) {
                  identitySubtitle.value = 'Beta User';
                  identitySubtitle.updated_at = getTimestamp();
                }

                await saveData();
                renderCurrentScreen();
                console.log('✅ [Home] Beta check-in successful from home settings!');
              },
              onSkip: async () => {
                console.log('🎯 [Home] Skip clicked from home settings');
                await chrome.runtime.sendMessage({ action: 'betaSkipped' });
              }
            });
            modal.show();
          },
          onRevokeBeta: async () => {
            console.log('🎯 [Home] Revoke Beta button clicked from Settings!');

            // Confirm revocation
            const confirmed = confirm('Are you sure you want to leave the beta community? Your beta ID, email, and profile data will be removed from our database.');
            if (!confirmed) return;

            try {
              // Call background script to delete from Supabase and reset local storage
              const result = await chrome.runtime.sendMessage({
                action: 'betaRevoke'
              });

              if (!result.success) {
                throw new Error(result.error || 'Failed to revoke beta status');
              }

              // Remove email from profile if it exists
              const identityEmail = AppState?.content?.basic?.identity?.email;
              if (identityEmail && identityEmail.value) {
                identityEmail.value = '';
                identityEmail.updated_at = getTimestamp();
              }

              // Remove subtitle if it was "Beta User"
              const identitySubtitle = AppState?.content?.basic?.identity?.subtitle;
              if (identitySubtitle && identitySubtitle.value === 'Beta User') {
                identitySubtitle.value = '';
                identitySubtitle.updated_at = getTimestamp();
              }

              await saveData();
              console.log('✅ [Home] Beta status revoked successfully');

              // Refresh to update settings
              renderCurrentScreen();
            } catch (error) {
              console.error('❌ [Home] Failed to revoke beta status:', error);
              alert('Failed to revoke beta status. Please try again.');
            }
          }
        });
        break;

      case 'profile':
        const profileOnSave = async (profileData) => {
          // Update each field in HSP structure
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
        // Get beta user status
        const betaUserData = await chrome.storage.local.get(['betaUser']);
        const betaUser = betaUserData.betaUser || {};
        // Show join button if NOT checked in (even if skipped)
        const isBetaUser = betaUser.checkedIn === true;
        console.log('🎯 [Settings] Beta user data:', betaUser);
        console.log('🎯 [Settings] checkedIn:', betaUser.checkedIn);
        console.log('🎯 [Settings] skipped:', betaUser.skipped);
        console.log('🎯 [Settings] Is beta user?', isBetaUser);
        console.log('🎯 [Settings] About to call createSettings with isBetaUser:', isBetaUser);
        console.log('🎯 [Settings] typeof onJoinBeta:', typeof (() => {}));

        screenComponent = createSettings({
          onClose: () => {
            AppState.metadata.currentScreen = 'home';
            renderCurrentScreen();
          },
          onBackupData: () => exportData(),
          onUpdateData: () => importData(),
          onClearData: () => clearAllData(),
          onThirdPartyData: () => importThirdPartyData(),
          autoInjectEnabled: AppState?.settings?.injection?.auto_inject || false,
          onAutoInjectToggle: async (isEnabled) => {
            // Ensure settings.injection exists
            if (!AppState.settings) {
              AppState.settings = {};
            }
            if (!AppState.settings.injection) {
              AppState.settings.injection = {};
            }

            // Update the setting
            AppState.settings.injection.auto_inject = isEnabled;
            await saveData();
          },
          autoBackupEnabled: BackupState.autoBackupEnabled,
          onAutoBackupToggle: async (isEnabled) => {
            BackupState.autoBackupEnabled = isEnabled;
            await saveBackupState();
          },
          autoCategorizeEnabled: AppState?.settings?.categorization?.auto_categorize ?? true,
          onAutoCategorizeToggle: async (isEnabled) => {
            // Ensure settings.categorization exists
            if (!AppState.settings) {
              AppState.settings = {};
            }
            if (!AppState.settings.categorization) {
              AppState.settings.categorization = {};
            }

            // Update the setting
            AppState.settings.categorization.auto_categorize = isEnabled;
            await saveData();
          },
          onBulkAutoCategorize: async () => {
            // Get all preferences without collections
            const items = AppState?.content?.preferences?.items || [];
            const itemsWithoutCollections = items.filter(item =>
              !item.collections || item.collections.length === 0
            );

            if (itemsWithoutCollections.length === 0) {
              alert('No cards without collections found.');
              return;
            }

            // Get all existing collections for context
            const allCollections = [...new Set(items.flatMap(item => item.collections || []))];

            // Confirm with user
            const confirmed = confirm(`Auto-categorize ${itemsWithoutCollections.length} cards without collections?`);
            if (!confirmed) return;

            let categorizedCount = 0;

            // Process each item
            for (const item of itemsWithoutCollections) {
              try {
                const suggestions = await aiHelper.suggestCategories(item.value, allCollections);
                if (suggestions.length > 0) {
                  item.collections = suggestions;
                  categorizedCount++;
                }
              } catch (error) {
                console.error('[Bulk Auto-Categorize] Error for item:', item.id, error);
              }
            }

            // Save updated data
            await saveData();

            // Show result
            alert(`✓ ${categorizedCount} cards auto-categorized`);

            // Refresh UI
            renderCurrentScreen();
          },
          isBetaUser: isBetaUser,
          onJoinBeta: () => {
            console.log('🎯 [Settings] Join Beta button clicked!');
            // Open beta check-in modal
            const currentEmail = AppState?.content?.basic?.identity?.email?.value || '';
            console.log('🎯 [Settings] Current email:', currentEmail);
            const modal = createBetaCheckinModal({
              initialEmail: currentEmail,
              onClose: (joined) => {
                console.log('🎯 [Settings] Beta modal closed, joined:', joined);
                // Refresh settings to hide the beta button if joined
                if (joined) {
                  renderCurrentScreen();
                }
              },
              onJoin: async (email, consentGiven) => {
                console.log('🎯 [Settings] Join clicked from settings, email:', email);
                // Send to background script
                const result = await chrome.runtime.sendMessage({
                  action: 'betaCheckin',
                  email: email,
                  consentGiven: consentGiven
                });

                if (!result.success) {
                  throw new Error(result.error || 'Failed to join beta program');
                }

                // Update profile with email (if empty) and beta subtitle
                const identityEmail = AppState?.content?.basic?.identity?.email;
                if (identityEmail && (!identityEmail.value || identityEmail.value === '')) {
                  identityEmail.value = email;
                  identityEmail.updated_at = getTimestamp();
                }

                // Set subtitle to "Beta User"
                const identitySubtitle = AppState?.content?.basic?.identity?.subtitle;
                if (identitySubtitle) {
                  identitySubtitle.value = 'Beta User';
                  identitySubtitle.updated_at = getTimestamp();
                }

                // Save updated profile
                await saveData();
                renderCurrentScreen();

                console.log('✅ [Settings] Beta check-in successful from settings!');
              },
              onSkip: async () => {
                console.log('🎯 [Settings] Skip clicked from settings');
                // Update skip counter
                await chrome.runtime.sendMessage({ action: 'betaSkipped' });
              }
            });
            console.log('🎯 [Settings] Modal created, calling show()...');
            modal.show();
            console.log('🎯 [Settings] Modal.show() called');
          },
          onRevokeBeta: async () => {
            console.log('🎯 [Settings] Revoke Beta button clicked!');

            // Confirm revocation
            const confirmed = confirm('Are you sure you want to leave the beta community? Your beta ID, email, and profile data will be removed from our database.');
            if (!confirmed) return;

            try {
              // Call background script to delete from Supabase and reset local storage
              const result = await chrome.runtime.sendMessage({
                action: 'betaRevoke'
              });

              if (!result.success) {
                throw new Error(result.error || 'Failed to revoke beta status');
              }

              // Remove email from profile if it exists
              const identityEmail = AppState?.content?.basic?.identity?.email;
              if (identityEmail && identityEmail.value) {
                identityEmail.value = '';
                identityEmail.updated_at = getTimestamp();
              }

              // Remove subtitle if it was "Beta User"
              const identitySubtitle = AppState?.content?.basic?.identity?.subtitle;
              if (identitySubtitle && identitySubtitle.value === 'Beta User') {
                identitySubtitle.value = '';
                identitySubtitle.updated_at = getTimestamp();
              }

              await saveData();
              console.log('✅ [Settings] Beta status revoked successfully');

              // Refresh settings to show join button again
              renderCurrentScreen();
            } catch (error) {
              console.error('❌ [Settings] Failed to revoke beta status:', error);
              alert('Failed to revoke beta status. Please try again.');
            }
          }
        });
        break;

      case 'third-party-data':
        screenComponent = createThirdPartyData({
          onClose: () => {
            AppState.metadata.currentScreen = 'settings';
            renderCurrentScreen();
          },
          onImport: async (url) => {
            await handleGoogleSheetsImport(url);
          },
          importedSheets: getImportedSheets()
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
    // Silent error handling
  }
}

/**
 * Beta Check-In Modal Logic
 */
async function checkBetaCheckinModal() {
  console.log('🎯 [App] Checking Beta Check-In Modal...');
  try {
    // Ask background script if modal should be shown
    console.log('🎯 [App] Sending message to background script...');
    const response = await chrome.runtime.sendMessage({ action: 'checkBetaReminder' });
    console.log('🎯 [App] Response from background:', response);

    if (response.shouldShow) {
      console.log('✅ [App] Modal should show! Creating modal...');

      // Get current email from profile
      const currentEmail = AppState?.content?.basic?.identity?.email?.value || '';

      // Show beta check-in modal
      const modal = createBetaCheckinModal({
        initialEmail: currentEmail,
        onClose: (joined) => {
          console.log('🎯 [App] Modal closed, joined:', joined);
        },
        onJoin: async (email, consentGiven) => {
          console.log('🎯 [App] Join clicked, email:', email);
          // Send to background script
          const result = await chrome.runtime.sendMessage({
            action: 'betaCheckin',
            email: email,
            consentGiven: consentGiven
          });

          if (!result.success) {
            throw new Error(result.error || 'Failed to join beta program');
          }

          // Update profile with email (if empty) and beta subtitle
          const identityEmail = AppState?.content?.basic?.identity?.email;
          if (identityEmail && (!identityEmail.value || identityEmail.value === '')) {
            identityEmail.value = email;
            identityEmail.updated_at = getTimestamp();
          }

          // Set subtitle to "Beta User"
          const identitySubtitle = AppState?.content?.basic?.identity?.subtitle;
          if (identitySubtitle) {
            identitySubtitle.value = 'Beta User';
            identitySubtitle.updated_at = getTimestamp();
          }

          // Save updated profile
          await saveData();
          renderCurrentScreen();

          console.log('✅ [App] Beta check-in successful! Profile updated.');
        },
        onSkip: async () => {
          console.log('🎯 [App] Skip clicked');
          // Update skip counter
          await chrome.runtime.sendMessage({ action: 'betaSkipped' });
        }
      });

      modal.show();
      console.log('✅ [App] Modal.show() called');
    } else {
      console.log('❌ [App] Modal should NOT show');
    }
  } catch (error) {
    // Silent error - don't disrupt user experience
    console.error('❌ [App] Beta check-in error:', error);
  }
}

// Initialize
async function init() {
  await loadData();
  await loadBackupState();

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

  // Check if beta check-in modal should be shown
  await checkBetaCheckinModal();
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
