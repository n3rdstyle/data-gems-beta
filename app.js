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

// ============================================================================
// RXDB HELPERS - Context Engine Integration
// ============================================================================

/**
 * Initialize Context Engine if not already ready
 */
async function ensureContextEngine() {
  if (!self.ContextEngineAPI) {
    throw new Error('[App] ContextEngineAPI not available');
  }

  if (!self.ContextEngineAPI.isReady) {
    console.log('[App] Initializing Context Engine...');
    await self.ContextEngineAPI.initialize();
  }

  return self.ContextEngineAPI;
}

/**
 * Get all primary preferences from RxDB
 * @returns {Promise<Array>} Array of preferences
 */
async function getPreferencesFromRxDB() {
  try {
    const api = await ensureContextEngine();

    // Use the proper API method to get all primary gems
    const gems = await api.getAllGems({ isPrimary: true });

    // Sort by created_at descending (newest first)
    const sorted = gems.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA;
    });

    return sorted;
  } catch (error) {
    console.error('[App] Failed to get preferences from RxDB:', error);
    return [];
  }
}

/**
 * Add a new preference to RxDB
 * @param {Object} preference - Preference data
 * @param {boolean} autoEnrich - Auto-enrich with AI (default: true)
 * @returns {Promise<Object>} Created gem
 */
async function addPreferenceToRxDB(preference, autoEnrich = true) {
  try {
    const engine = await ensureContextEngine();

    const gem = {
      id: preference.id || generateId('pref'),
      value: preference.value,
      collections: preference.collections || [],
      subCollections: preference.subCollections || [],
      timestamp: Date.now(),

      // HSP fields
      state: preference.state || 'default',
      assurance: preference.assurance || 'self_declared',
      reliability: preference.reliability || 'authoritative',
      source_url: preference.source_url,
      mergedFrom: preference.mergedFrom,
      created_at: preference.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      topic: preference.topic || '',

      // Primary gem fields
      isPrimary: true,
      parentGem: '',
      childGems: [],
      isVirtual: false
    };

    await engine.addGem(gem, autoEnrich);
    return gem;
  } catch (error) {
    console.error('[App] Failed to add preference to RxDB:', error);
    throw error;
  }
}

/**
 * Update a preference in RxDB
 * @param {string} id - Preference ID
 * @param {Object} updates - Fields to update
 * @param {boolean} reEnrich - Re-enrich if value changed (default: true)
 */
async function updatePreferenceInRxDB(id, updates, reEnrich = true) {
  try {
    const engine = await ensureContextEngine();

    // Add updated_at timestamp
    const finalUpdates = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    await engine.updateGem(id, finalUpdates, reEnrich);
  } catch (error) {
    console.error('[App] Failed to update preference in RxDB:', error);
    throw error;
  }
}

/**
 * Delete a preference from RxDB
 * @param {string} id - Preference ID
 */
async function deletePreferenceFromRxDB(id) {
  try {
    const engine = await ensureContextEngine();
    await engine.deleteGem(id);
  } catch (error) {
    console.error('[App] Failed to delete preference from RxDB:', error);
    throw error;
  }
}

// Selection tracking state for merge feature
let SelectedCards = new Set();
let mergeFAB = null;
let currentPreferenceOptions = null; // Reference to current preference options

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

// Selection management for merge feature
function initializeMergeFAB() {
  if (!mergeFAB) {
    mergeFAB = createMergeFAB({
      count: 0,
      onMerge: handleMergeSelectedCards
    });
    document.body.appendChild(mergeFAB.element);
  }
}

function handleCardSelection(selected, card) {
  if (selected) {
    SelectedCards.add(card.getId());
  } else {
    SelectedCards.delete(card.getId());
  }

  updateMergeFAB();
}

function updateMergeFAB() {
  const count = SelectedCards.size;

  // Use preference options if available, otherwise fall back to FAB
  if (currentPreferenceOptions) {
    // Show/hide trash button based on selection (1+)
    if (count >= 1) {
      currentPreferenceOptions.showTrashButton();
    } else {
      currentPreferenceOptions.hideTrashButton();
    }

    // Show/hide merge button based on selection (1+)
    // Merge button appears at 1+ but is disabled until 2+
    if (count >= 1) {
      currentPreferenceOptions.showMergeButton(count);
      // Enable only if 2+ cards selected
      currentPreferenceOptions.setMergeButtonDisabled(count < 2);
    } else {
      currentPreferenceOptions.hideMergeButton();
    }
  } else {
    // Fallback to old FAB (for backwards compatibility)
    if (!mergeFAB) {
      initializeMergeFAB();
    }

    if (count >= 2) {
      mergeFAB.updateCount(count);
      mergeFAB.show();
    } else {
      mergeFAB.hide();
    }
  }
}

function clearSelection() {
  SelectedCards.clear();

  // Deselect all cards visually
  const allCards = document.querySelectorAll('.data-card');
  allCards.forEach(cardElement => {
    const cardInstance = cardElement._dataCardInstance;
    if (cardInstance && cardInstance.isSelected()) {
      cardInstance.setSelected(false);
    }
  });

  updateMergeFAB();
}

function handleMergedInfoClick(mergedFrom, card) {
  console.log('[Merged Info] Showing original cards:', mergedFrom);

  if (!mergedFrom || mergedFrom.length === 0) return;

  // Create originals overlay using design system
  const originalsOverlay = createOverlay({
    blur: false,
    opacity: 'dark',
    visible: false,
    onClick: () => {
      originalsOverlay.hide();
      setTimeout(() => {
        if (originalsOverlay.element.parentNode) {
          originalsOverlay.element.parentNode.removeChild(originalsOverlay.element);
        }
      }, 200);
    }
  });

  // Create originals modal
  const originalsModal = document.createElement('div');
  originalsModal.className = 'data-editor-modal data-editor-modal--originals';

  // Create header
  const originalsHeader = createHeader({
    variant: 'simple',
    title: `Original Cards (${mergedFrom.length})`,
    onClose: () => {
      originalsOverlay.hide();
      setTimeout(() => {
        if (originalsOverlay.element.parentNode) {
          originalsOverlay.element.parentNode.removeChild(originalsOverlay.element);
        }
      }, 200);
    }
  });

  // Create content with cards
  const originalsContent = document.createElement('div');
  originalsContent.className = 'data-editor-modal__originals-content';

  mergedFrom.forEach((original, index) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'data-editor-modal__original-card';

    // Card text
    const cardText = document.createElement('div');
    cardText.className = 'data-editor-modal__original-text text-style-body-medium';
    cardText.textContent = original.text;

    // Card metadata (collections and state)
    const cardMeta = document.createElement('div');
    cardMeta.className = 'data-editor-modal__original-meta';

    // Show collections as tags
    if (original.collections && original.collections.length > 0) {
      const collectionsContainer = document.createElement('div');
      collectionsContainer.className = 'data-editor-modal__original-collections';

      original.collections.forEach(collection => {
        const tag = document.createElement('span');
        tag.className = 'data-editor-modal__original-tag text-style-body-small';
        tag.textContent = collection;
        collectionsContainer.appendChild(tag);
      });

      cardMeta.appendChild(collectionsContainer);
    }

    // Show state icons
    if (original.state === 'favorited' || original.state === 'hidden') {
      const stateIcon = document.createElement('span');
      stateIcon.className = 'data-editor-modal__original-state';
      stateIcon.innerHTML = getIcon(original.state === 'favorited' ? 'heart-filled' : 'visibility-off');
      cardMeta.appendChild(stateIcon);
    }

    cardElement.appendChild(cardText);
    if (cardMeta.children.length > 0) {
      cardElement.appendChild(cardMeta);
    }

    originalsContent.appendChild(cardElement);
  });

  // Assemble originals modal
  originalsModal.appendChild(originalsHeader.element);
  originalsModal.appendChild(originalsContent);

  // Assemble and show
  originalsOverlay.element.appendChild(originalsModal);
  document.body.appendChild(originalsOverlay.element);
  setTimeout(() => originalsOverlay.show(), 10);
}

// Handle delete selected cards
async function handleDeleteSelected() {
  if (SelectedCards.size === 0) {
    return;
  }

  const count = SelectedCards.size;
  const confirmMessage = count === 1
    ? 'Are you sure you want to delete this card?'
    : `Are you sure you want to delete ${count} cards?`;

  if (!confirm(confirmMessage)) {
    return;
  }

  console.log(`[Delete] Deleting ${count} selected cards...`);

  try {
    // Get selected card IDs
    const items = AppState.content.preferences.items;
    const selectedItems = items.filter(item => SelectedCards.has(item.id));

    // Delete each card
    selectedItems.forEach(item => {
      AppState = deletePreference(AppState, item.id);
    });

    // Save data
    await saveData();

    // Clear selection
    clearSelection();

    // Re-render screen
    renderCurrentScreen();

    console.log(`[Delete] Successfully deleted ${count} cards`);
  } catch (error) {
    console.error('[Delete] Error deleting cards:', error);
    alert('Failed to delete cards. Please try again.');
  }
}

async function handleMergeSelectedCards() {
  if (SelectedCards.size < 2) {
    alert('Please select at least 2 cards to merge.');
    return;
  }

  // Get selected card data
  const items = AppState.content.preferences.items;
  const selectedItems = items.filter(item => SelectedCards.has(item.id));

  if (selectedItems.length < 2) {
    alert('Selected cards not found.');
    return;
  }

  console.log(`[Merge] Preparing to merge ${selectedItems.length} cards...`);

  try {
    // Extract texts from selected items
    const texts = selectedItems.map(item => item.value);

    // Generate consolidated text using AI
    const consolidatedText = await generateConsolidatedText(texts);
    console.log('[Merge] Consolidated text:', consolidatedText);

    // Create mergedFrom metadata
    const mergedFrom = selectedItems.map(item => ({
      id: item.id,
      text: item.value,
      timestamp: item.created_at,
      collections: item.collections || [],
      state: item.state || 'default'
    }));

    // Combine all collections from selected cards (remove duplicates)
    const allCollections = [...new Set(selectedItems.flatMap(item => item.collections || []))];

    // Use the most common state (or default if tie)
    const states = selectedItems.map(item => item.state || 'default');
    const stateCount = {};
    states.forEach(state => stateCount[state] = (stateCount[state] || 0) + 1);
    const mostCommonState = Object.keys(stateCount).reduce((a, b) =>
      stateCount[a] > stateCount[b] ? a : b
    );

    // Get all existing tags for the modal
    const allCards = items;
    const userCollections = allCards.flatMap(c => c.collections || []);
    const predefinedCategories = aiHelper.getPredefinedCategories();
    const existingTags = [...new Set([...predefinedCategories, ...userCollections, ...allCollections])];

    // Open Data Editor Modal in merge mode
    const modal = createDataEditorModal({
      title: 'Merge Cards',
      preferenceTitle: 'Merged Preference',
      preferenceText: consolidatedText,
      preferenceHidden: mostCommonState === 'hidden',
      preferenceFavorited: mostCommonState === 'favorited',
      collections: allCollections,
      existingTags: existingTags,
      autoCategorizeEnabled: false, // Disable auto-categorize for merge
      mergedFrom: mergedFrom, // NEW: Pass original cards
      onSave: async (data) => {
        // Save the merged card
        await saveMergedCard(data, mergedFrom, selectedItems);
        modal.hide();
      },
      onDelete: () => {
        // Cancel merge - just close modal
        modal.hide();
      }
    });

    // Show modal
    const screenElement = document.querySelector('.home');
    modal.show(screenElement || document.body);

  } catch (error) {
    console.error('[Merge] Error preparing merge:', error);
    alert(`Failed to prepare merge: ${error.message}`);
  }
}

// New function to save the merged card
async function saveMergedCard(data, mergedFrom, selectedItems) {
  try {
    console.log('[Merge] Saving merged card...');

    // Determine new state
    let newState = 'default';
    if (data.favorited) {
      newState = 'favorited';
    } else if (data.hidden) {
      newState = 'hidden';
    }

    // Create new merged preference
    AppState = addPreference(
      AppState,
      data.text,
      newState,
      data.collections,
      [],  // subCollections
      null,  // sourceUrl
      mergedFrom,  // mergedFrom
      data.topic || null  // topic (NEW)
    );

    // Note: mergedFrom is now passed directly to addPreference

    // Delete original selected items
    selectedItems.forEach(item => {
      AppState = deletePreference(AppState, item.id);
    });

    // Save changes
    await saveData();

    // Clear selection
    clearSelection();

    // Refresh UI
    renderCurrentScreen();

    console.log('[Merge] ✓ Successfully merged cards');

  } catch (error) {
    console.error('[Merge] Error saving merged card:', error);
    alert(`Failed to save merged card: ${error.message}`);
    throw error;
  }
}

// Load data from Chrome storage AND RxDB
async function loadData() {
  try {
    const result = await chrome.storage.local.get(['hspProfile', 'userData', 'preferences', 'migrationCompleted']);

    // Always use Context Engine (RxDB) - it's always active now
    const usesRxDB = true;

    // Load profile identity from Chrome Storage
    if (result.hspProfile) {
      AppState = result.hspProfile;

      // Migrate 'has' property to 'hsp' if needed
      if (AppState.has && !AppState.hsp) {
        AppState.hsp = AppState.has;
        delete AppState.has;
        await saveData();
      }

      // AUTO-FIX: Verify SubCategory Registry on startup
      const originalRegistrySize = Object.keys(AppState.subCategoryRegistry || {}).length;
      AppState = ensureValidRegistry(AppState);
      const newRegistrySize = Object.keys(AppState.subCategoryRegistry || {}).length;

      // Save if registry was rebuilt or updated
      if (newRegistrySize !== originalRegistrySize || originalRegistrySize === 0) {
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

    // Load preferences from RxDB if migration is completed
    if (usesRxDB) {
      console.log('[App] Loading preferences from RxDB...');
      try {
        // Wait for Context Engine to be ready before loading preferences
        const maxRetries = 10;
        let retries = 0;
        let preferencesFromRxDB = [];

        while (retries < maxRetries) {
          preferencesFromRxDB = await getPreferencesFromRxDB();

          if (preferencesFromRxDB.length > 0 || retries === maxRetries - 1) {
            break;
          }

          // Context Engine might not be ready yet, wait a bit
          console.log(`[App] Waiting for Context Engine to be ready... (attempt ${retries + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 200));
          retries++;
        }

        console.log(`[App] Loaded ${preferencesFromRxDB.length} preferences from RxDB`);

        // Update AppState cache with RxDB data
        AppState.content.preferences.items = preferencesFromRxDB;
        AppState.metadata.total_preferences = preferencesFromRxDB.length;
      } catch (error) {
        console.error('[App] Failed to load preferences from RxDB:', error);
        console.log('[App] Using Chrome Storage fallback');
        // If RxDB fails, keep Chrome Storage data as fallback
      }
    } else {
      console.log('[App] Using Chrome Storage for preferences (migration not completed)');
      console.log('[App] Run migrate-to-rxdb.js script to enable RxDB storage');
    }
  } catch (error) {
    console.error('[App] Failed to load data:', error);
    AppState = initializeDefaultProfile();
  }
}

// Save data to Chrome storage (profile identity only)
// Note: Preferences are saved to RxDB, not Chrome Storage
async function saveData() {
  try {
    AppState.updated_at = getTimestamp();

    // Save profile identity to Chrome Storage
    // Preferences are stored in RxDB after migration
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

    // Add mergedFrom info if it exists
    if (item.mergedFrom) {
      pref.mergedFrom = item.mergedFrom;
    }

    // Add topic if it exists
    if (item.topic) {
      pref.topic = item.topic;
    }

    return pref;
  });
  // Reverse to show newest first (newest at top)
  return [...mapped].reverse();
}

// Export data (HSP v0.1 format) - defined before renderCurrentScreen
// Now includes data from RxDB (child gems, enrichments, etc.)
async function exportData() {
  // Get beta user data
  const betaUserData = await chrome.storage.local.get(['betaUser', 'migrationCompleted']);
  const betaUser = betaUserData.betaUser || {};
  const usesRxDB = true; // Always use Context Engine (RxDB)

  // Get preferences (from RxDB if migrated, otherwise from AppState)
  let preferences;
  let childGems = [];

  if (usesRxDB) {
    console.log('[Export] Reading preferences from RxDB...');
    try {
      // Get primary gems
      const primaryGems = await getPreferencesFromRxDB();
      console.log(`[Export] Retrieved ${primaryGems.length} primary gems from RxDB`);

      // Get child gems (for complete backup)
      const api = await ensureContextEngine();
      const allChildGems = await api.getAllGems({ isVirtual: true });
      console.log(`[Export] Retrieved ${allChildGems.length} child gems from RxDB`);

      preferences = {
        items: primaryGems
      };
      childGems = allChildGems;
    } catch (error) {
      console.error('[Export] Failed to read from RxDB, using AppState:', error);
      preferences = AppState.content.preferences;
    }
  } else {
    console.log('[Export] Reading preferences from Chrome Storage');
    preferences = AppState.content.preferences;
  }

  // Clean metadata - remove internal fields
  const cleanMetadata = {
    schema_version: AppState.metadata.schema_version,
    extension_version: AppState.metadata.extension_version,
    total_preferences: preferences.items.length,
    total_child_gems: childGems.length,  // NEW: Track child gems count
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
      preferences: preferences,  // Primary gems from RxDB
      childGems: childGems  // NEW: Child gems for semantic search
    },

    // Collections
    collections: AppState.collections,

    // SubCategory Registry
    subCategoryRegistry: AppState.subCategoryRegistry,

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
    exportVersion: '0.1',
    dataSource: usesRxDB ? 'RxDB' : 'ChromeStorage'  // Track data source
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

  console.log(`[Export] Exported ${preferences.items.length} preferences (source: ${usesRxDB ? 'RxDB' : 'Chrome Storage'})`);

  // Update last backup count after successful export
  const currentCount = preferences.items.length;
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

  // Always import subCategoryRegistry if it exists in imported data
  if (importedData.subCategoryRegistry) {
    AppState.subCategoryRegistry = importedData.subCategoryRegistry;
    console.log('[Import] SubCategory Registry imported:', Object.keys(importedData.subCategoryRegistry).length, 'SubCategories');
  }

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
  console.log('[Import] ========================================');
  console.log('[Import] importData() function called!');
  console.log('[Import] ========================================');
  console.log('[Import] Creating file picker...');

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';

  // Add error handler
  input.onerror = (e) => {
    console.error('[Import] ❌ File picker error:', e);
  };

  input.onchange = async (e) => {
    console.log('[Import] ========================================');
    console.log('[Import] File selected!');
    console.log('[Import] File name:', e.target.files[0]?.name);
    console.log('[Import] File size:', e.target.files[0]?.size, 'bytes');
    console.log('[Import] ========================================');

    const file = e.target.files[0];
    if (!file) {
      console.error('[Import] No file selected!');
      return;
    }

    try {
      console.log('[Import] Reading file...');
      const text = await file.text();
      console.log('[Import] ✅ File read, size:', text.length, 'chars');

      console.log('[Import] Parsing JSON...');
      const data = JSON.parse(text);
      console.log('[Import] ✅ JSON parsed successfully');
      console.log('[Import] Data structure:', {
        hasHSP: !!data.hsp,
        hasHAS: !!data.has,
        hasContent: !!data.content,
        hasBeta: !!data.beta
      });

      let importedData;

      // Check if it's HSP format (accept both 'hsp' and legacy 'has')
      if ((data.hsp || data.has) && data.content) {
        console.log('[Import] ✅ Valid HSP format detected');
        importedData = data;

        // Migrate 'has' to 'hsp' if needed
        if (importedData.has && !importedData.hsp) {
          console.log('[Import] Migrating legacy "has" to "hsp"');
          importedData.hsp = importedData.has;
          delete importedData.has;
        }
      } else {
        console.error('[Import] ❌ Invalid format!');
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

      // Always use Context Engine (RxDB) for imports
      // Context Engine is now always active, migration flag is legacy
      if (true) {
        // Import to RxDB
        console.log('[Import] Importing to Context Engine (RxDB)...');

        // Update profile identity in Chrome Storage
        AppState.content.basic.identity = importedData.content.basic.identity;
        AppState.collections = importedData.collections || [];
        AppState.subCategoryRegistry = importedData.subCategoryRegistry || {};
        AppState.settings = importedData.settings || {};
        await saveData();

        // Import preferences to RxDB
        const preferences = importedData.content.preferences.items || [];
        const childGems = importedData.content.childGems || [];
        console.log(`[Import] Found ${preferences.length} preferences in import file`);
        console.log(`[Import] Found ${childGems.length} child gems in import file`);
        console.log('[Import] Sample preference:', preferences[0]);
        console.log('[Import] Checking Context Engine...');

        let engine;
        try {
          engine = await ensureContextEngine();
          console.log('[Import] Context Engine ready:', !!engine);
        } catch (error) {
          console.error('[Import] Context Engine initialization failed:', error);
          alert(`❌ Context Engine failed to initialize:\n${error.message}\n\nPlease reload the extension and try again.`);
          return;
        }

        // Use Context Engine API for importing
        console.log('[Import] Ready to import preferences via Context Engine...');

        let importedCount = 0;
        let errorCount = 0;
        for (let i = 0; i < preferences.length; i++) {
          const pref = preferences[i];

          if (i === 0) {
            console.log('[Import] First preference to import:', {
              id: pref.id,
              value: pref.value,
              collections: pref.collections,
              hasAllFields: !!(pref.id && pref.value)
            });
          }

          try {
            // Prepare gem for import
            const gem = {
              id: pref.id,
              value: pref.value,
              collections: pref.collections || [],
              subCollections: pref.subCollections || [],
              timestamp: pref.created_at ? new Date(pref.created_at).getTime() : Date.now(),

              // HSP fields
              state: pref.state || 'default',
              assurance: pref.assurance || 'self_declared',
              reliability: pref.reliability || 'authoritative',
              source_url: pref.source_url,
              mergedFrom: pref.mergedFrom,
              created_at: pref.created_at || new Date().toISOString(),
              updated_at: pref.updated_at || new Date().toISOString(),
              topic: pref.topic || '',

              // Primary gem fields
              isPrimary: true,
              parentGem: '',
              childGems: [],
              isVirtual: false
            };

            // Use Context Engine API to add gem (with auto-enrichment for fresh embeddings)
            await engine.addGem(gem, true);  // true = generate fresh embeddings
            importedCount++;

            // Log progress every 10 items
            if (importedCount % 10 === 0 || importedCount === preferences.length) {
              console.log(`[Import] Progress: ${importedCount}/${preferences.length}`);
            }
          } catch (error) {
            errorCount++;
            console.error(`[Import] Failed to import preference ${i + 1}/${preferences.length} (ID: ${pref.id}):`, error);
            if (errorCount === 1) {
              // Log full error details for first failure
              console.error('[Import] Full error details:', error.stack || error);
            }
          }
        }

        console.log(`[Import] Primary gems import complete: ${importedCount} succeeded, ${errorCount} failed`);

        // Import child gems (if any)
        let childImportedCount = 0;
        let childErrorCount = 0;

        if (childGems.length > 0) {
          console.log(`[Import] Importing ${childGems.length} child gems...`);

          for (let i = 0; i < childGems.length; i++) {
            const child = childGems[i];

            try {
              // Ensure child gem has correct isPrimary flag
              const childGem = {
                ...child,
                isPrimary: false,
                parentGem: child.parentGem || '',
                isVirtual: false
              };

              // Import child gem (with auto-enrichment for fresh embeddings)
              await engine.addGem(childGem, true);  // true = generate fresh embeddings
              childImportedCount++;

              if (childImportedCount % 10 === 0 || childImportedCount === childGems.length) {
                console.log(`[Import] Child gems progress: ${childImportedCount}/${childGems.length}`);
              }
            } catch (error) {
              childErrorCount++;
              console.error(`[Import] Failed to import child gem ${i + 1}/${childGems.length}:`, error);
            }
          }

          console.log(`[Import] Child gems import complete: ${childImportedCount} succeeded, ${childErrorCount} failed`);
        }

        console.log(`[Import] ✅ Total imported: ${importedCount} primary gems, ${childImportedCount} child gems`);

        // Reload data from RxDB and navigate to home screen
        console.log('[Import] Reloading data from RxDB...');
        await loadData();
        console.log('[Import] ✅ Data reloaded, AppState now has', AppState?.content?.preferences?.items?.length, 'items');

        console.log('[Import] Navigating to home screen...');
        AppState.metadata.currentScreen = 'home';
        renderCurrentScreen();
        console.log('[Import] ✅ UI rendered');

        await checkBetaCheckinModal();
        await checkBackupReminder();

        const totalExpected = preferences.length + childGems.length;
        const totalImported = importedCount + childImportedCount;

        if (totalImported === totalExpected && errorCount === 0 && childErrorCount === 0) {
          alert(`✅ Data imported successfully!\n\n${importedCount} primary gems\n${childImportedCount} child gems\n\nYour data is fully restored!`);
        } else if (totalImported > 0) {
          alert(`⚠️ Partial import:\n${importedCount}/${preferences.length} primary gems\n${childImportedCount}/${childGems.length} child gems\n\nCheck console for errors.`);
        } else {
          alert(`❌ Import failed!\nNo gems imported.\n\nCheck console for errors.`);
        }
      } else {
        // Fallback: Use Chrome Storage (old behavior)
        const mergeResult = await mergeImportedData(importedData);

        if (mergeResult === 'merged') {
          // Data was merged - AppState already updated in mergeImportedData
          AppState.metadata.currentScreen = 'home';

          // AUTO-FIX: Ensure SubCategory Registry is valid after import
          AppState = ensureValidRegistry(AppState);
        } else if (mergeResult === 'no-changes') {
          alert('No new data to import.');
          return;
        }

        await saveData();
        renderCurrentScreen();
        await checkBetaCheckinModal();
        await checkBackupReminder();
        alert('✅ Data imported successfully!');
      }
    } catch (error) {
      console.error('[Import] ❌ FATAL ERROR:', error);
      console.error('[Import] Error stack:', error.stack);
      alert('❌ Error importing data: ' + error.message);
    }
  };

  console.log('[Import] Clicking file picker...');
  input.click();
  console.log('[Import] ✅ File picker triggered (waiting for user selection)');
}

async function debugDataSources() {
  console.log('========================================');
  console.log('DEBUG: DATA SOURCES');
  console.log('========================================');

  // 1. Check AppState
  console.log('1. AppState.content.preferences.items:', AppState?.content?.preferences?.items?.length || 0);
  if (AppState?.content?.preferences?.items?.length > 0) {
    console.log('   First item:', AppState.content.preferences.items[0]);
  }

  // 2. Check Chrome Storage
  const chromeData = await chrome.storage.local.get(['hspProfile']);
  console.log('2. Chrome Storage items:', chromeData?.hspProfile?.content?.preferences?.items?.length || 0);

  // 3. Check RxDB via Context Engine
  try {
    const engine = await ensureContextEngine();
    const rxdbGems = await engine.getAllGems({ isPrimary: true });
    console.log('3. RxDB items (via Context Engine):', rxdbGems.length);
    if (rxdbGems.length > 0) {
      console.log('   First gem:', rxdbGems[0]);
    }
  } catch (error) {
    console.log('3. RxDB ERROR:', error.message);
  }

  // 4. Check IndexedDB directly
  try {
    const databases = await indexedDB.databases();
    console.log('4. IndexedDB databases:', databases.map(db => db.name));
  } catch (error) {
    console.log('4. IndexedDB enumeration not supported');
  }

  console.log('========================================');
}

// Make debug function globally available
window.debugDataSources = debugDataSources;

async function clearAllData() {
  console.log('[Clear] ========================================');
  console.log('[Clear] clearAllData() function called!');
  console.log('[Clear] ========================================');

  const confirmed = confirm('⚠️ Are you sure you want to clear all data? This cannot be undone.');
  if (!confirmed) {
    console.log('[Clear] User cancelled deletion');
    return;
  }

  try {
    console.log('[Clear] Starting data cleanup...');
    chrome.runtime.sendMessage({ action: 'log', message: '[Clear] User initiated data cleanup' });

    // Step 1: Destroy Context Engine and close all DB connections
    console.log('[Clear] Step 1: Destroying Context Engine...');
    try {
      const destroyResponse = await chrome.runtime.sendMessage({ action: 'destroyEngine' });
      console.log('[Clear] Destroy response:', destroyResponse);
      console.log('[Clear] ✅ Context Engine destroyed');
      chrome.runtime.sendMessage({ action: 'log', message: '[Clear] Context Engine destroyed' });

      // Wait for all connections to close
      console.log('[Clear] Waiting 500ms for connections to close...');
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('[Clear] ✅ Wait complete');
    } catch (error) {
      console.error('[Clear] ❌ Could not destroy engine:', error);
      chrome.runtime.sendMessage({ action: 'log', message: `[Clear] Could not destroy engine: ${error.message}` });
    }

    // Step 2: Delete RxDB database (retry if blocked)
    // IMPORTANT: Database name is 'rxdb-datagems-context' NOT 'data-gems-db-v3'
    console.log('[Clear] Step 2: Deleting IndexedDB...');
    const dbName = 'rxdb-datagems-context';
    chrome.runtime.sendMessage({ action: 'log', message: `[Clear] Attempting to delete IndexedDB ${dbName}...` });

    let deleteAttempt = 0;
    const maxAttempts = 3;
    let deleted = false;

    while (deleteAttempt < maxAttempts && !deleted) {
      deleteAttempt++;
      console.log(`[Clear] 🔄 Delete attempt ${deleteAttempt}/${maxAttempts} for ${dbName}...`);

      try {
        await new Promise((resolve, reject) => {
          const request = indexedDB.deleteDatabase(dbName);

          request.onsuccess = () => {
            console.log('[Clear] RxDB database deleted successfully');
            chrome.runtime.sendMessage({ action: 'log', message: '[Clear] ✅ RxDB database deleted successfully' });
            deleted = true;
            resolve();
          };

          request.onerror = () => {
            console.error('[Clear] Failed to delete RxDB database:', request.error);
            chrome.runtime.sendMessage({ action: 'log', message: `[Clear] ❌ Failed to delete RxDB: ${request.error}` });
            reject(request.error);
          };

          request.onblocked = () => {
            console.warn('[Clear] Database deletion blocked - retrying...');
            chrome.runtime.sendMessage({ action: 'log', message: `[Clear] ⚠️  Database deletion BLOCKED (attempt ${deleteAttempt}/${maxAttempts})` });

            // If this was last attempt, give up
            if (deleteAttempt >= maxAttempts) {
              chrome.runtime.sendMessage({ action: 'log', message: '[Clear] ⚠️  CRITICAL: Could not delete database after 3 attempts. Extension reload required.' });
              alert('⚠️ Database deletion blocked!\n\nPlease:\n1. Close ALL tabs using Data Gems\n2. Click "Delete" again\n\nIf problem persists, manually reload the extension.');
              reject(new Error('Database deletion blocked'));
            } else {
              // Wait and retry
              setTimeout(() => reject(new Error('Blocked, retrying...')), 1000);
            }
          };
        });

        break; // Success, exit loop

      } catch (error) {
        if (deleteAttempt < maxAttempts) {
          console.log(`[Clear] Retrying after error: ${error.message}`);
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          throw error; // Last attempt failed, propagate error
        }
      }
    }

    if (!deleted) {
      throw new Error('Failed to delete database after multiple attempts');
    }

    // Step 3: Delete ALL IndexedDB databases (Dexie may create additional internal DBs)
    console.log('[Clear] Step 3: Checking for additional IndexedDB databases...');
    try {
      const databases = await indexedDB.databases();
      console.log('[Clear] Found IndexedDB databases:', databases.map(db => db.name));

      for (const db of databases) {
        if (db.name.includes('rxdb') || db.name.includes('datagems') || db.name.includes('data-gems')) {
          console.log(`[Clear] Deleting additional database: ${db.name}`);
          await indexedDB.deleteDatabase(db.name);
          console.log(`[Clear] ✅ Deleted: ${db.name}`);
        }
      }
    } catch (error) {
      console.warn('[Clear] Could not enumerate databases (not critical):', error);
    }

    // Step 4: Clear HNSW index from chrome.storage.local
    console.log('[Clear] Step 4: Clearing HNSW index...');
    await chrome.storage.local.remove(['hnsw_index']);
    console.log('[Clear] ✅ HNSW index cleared');
    chrome.runtime.sendMessage({ action: 'log', message: '[Clear] HNSW index removed from chrome.storage.local' });

    // Verify HNSW was removed
    const checkHNSW = await chrome.storage.local.get(['hnsw_index']);
    console.log('[Clear] HNSW verification - exists:', !!checkHNSW.hnsw_index);
    chrome.runtime.sendMessage({ action: 'log', message: `[Clear] HNSW verification - exists: ${!!checkHNSW.hnsw_index}` });

    // Step 5: Clear chrome.storage data (AppState)
    console.log('[Clear] Step 5: Resetting AppState...');
    AppState = initializeDefaultProfile();
    await saveData();
    console.log('[Clear] ✅ AppState reset to default');
    chrome.runtime.sendMessage({ action: 'log', message: '[Clear] AppState reset to default' });

    console.log('[Clear] ========================================');
    console.log('[Clear] All cleanup complete!');
    console.log('[Clear] Extension will reload in 500ms...');
    console.log('[Clear] ========================================');
    chrome.runtime.sendMessage({ action: 'log', message: '[Clear] All cleanup complete, extension will reload in 500ms' });

    // Reload the page to reinitialize everything
    renderCurrentScreen();
    alert('✅ All data cleared successfully!\n\nThe extension will reload to reinitialize.');

    // Ensure all async operations complete before reload
    await new Promise(resolve => setTimeout(resolve, 500));

    // Reload extension
    chrome.runtime.reload();

  } catch (error) {
    console.error('[Clear] Error clearing data:', error);
    chrome.runtime.sendMessage({ action: 'log', message: `[Clear] ❌ ERROR: ${error.message}` });
    alert(`❌ Error clearing data: ${error.message}\n\nTry reloading the extension manually.`);
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
        [],  // subCollections
        preferenceData.sourceUrl,
        null,  // mergedFrom
        null  // topic (imported data has no topic)
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
          onPreferenceAdd: async (value, state, collections, topic = null) => {
            console.log('[App] onPreferenceAdd called with topic:', topic);

            // Always use Context Engine (RxDB)
            const usesRxDB = true;

            if (usesRxDB) {
              // Add to RxDB
              try {
                const newPref = await addPreferenceToRxDB({
                  value,
                  state,
                  collections,
                  topic
                });

                console.log('[App] Preference added to RxDB:', newPref.id);

                // Update AppState cache
                AppState.content.preferences.items.unshift(newPref);
                AppState.metadata.total_preferences = AppState.content.preferences.items.length;

                renderCurrentScreen();
                await checkBetaCheckinModal();
                await checkBackupReminder();
              } catch (error) {
                console.error('[App] Failed to add preference to RxDB:', error);
                alert('Failed to save preference. Please try again.');
              }
            } else {
              // Fallback: Use Chrome Storage
              AppState = addPreference(
                AppState,
                value,
                state,
                collections,
                [],  // subCollections
                null,  // sourceUrl
                null,  // mergedFrom
                topic
              );

              await saveData();
              renderCurrentScreen();
              await checkBetaCheckinModal();
              await checkBackupReminder();
            }
          },
          onPreferenceUpdate: async (prefId, updates) => {
            // Always use Context Engine (RxDB)
            const usesRxDB = true;

            if (usesRxDB) {
              // Update in RxDB
              try {
                await updatePreferenceInRxDB(prefId, updates);
                console.log('[App] Preference updated in RxDB:', prefId);

                // Update AppState cache
                const prefIndex = AppState.content.preferences.items.findIndex(p => p.id === prefId);
                if (prefIndex !== -1) {
                  AppState.content.preferences.items[prefIndex] = {
                    ...AppState.content.preferences.items[prefIndex],
                    ...updates,
                    updated_at: new Date().toISOString()
                  };
                }

                renderCurrentScreen();
              } catch (error) {
                console.error('[App] Failed to update preference in RxDB:', error);
                alert('Failed to update preference. Please try again.');
              }
            } else {
              // Fallback: Use Chrome Storage
              AppState = updatePreference(AppState, prefId, updates);
              await saveData();
              renderCurrentScreen();
            }
          },
          onPreferenceDelete: async (prefId) => {
            // Always use Context Engine (RxDB)
            const usesRxDB = true;

            if (usesRxDB) {
              // Delete from RxDB
              try {
                await deletePreferenceFromRxDB(prefId);
                console.log('[App] Preference deleted from RxDB:', prefId);

                // Update AppState cache
                AppState.content.preferences.items = AppState.content.preferences.items.filter(
                  p => p.id !== prefId
                );
                AppState.metadata.total_preferences = AppState.content.preferences.items.length;

                renderCurrentScreen();
              } catch (error) {
                console.error('[App] Failed to delete preference from RxDB:', error);
                alert('Failed to delete preference. Please try again.');
              }
            } else {
              // Fallback: Use Chrome Storage
              AppState = deletePreference(AppState, prefId);
              await saveData();
              renderCurrentScreen();
            }
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

            // Get all existing collections for context (predefined + user-created)
            const existingCollections = [...new Set(items.flatMap(item => item.collections || []))];
            const predefinedCategories = aiHelper.getPredefinedCategories();
            const allCollections = [...new Set([...predefinedCategories, ...existingCollections])];

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
          onMigrateSubCategories: async () => {
            // Confirm with user
            const confirmed = confirm('Migrate Fashion gems to SubCategories?\n\nThis will organize your Fashion gems into granular categories (shoes, tshirts, etc.) for better AI context matching.\n\nThis may take 1-2 minutes.');
            if (!confirmed) return;

            // Create progress overlay
            const progressOverlay = document.createElement('div');
            progressOverlay.style.cssText = `
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.8);
              z-index: 10000;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: white;
              font-family: system-ui;
            `;

            const progressTitle = document.createElement('div');
            progressTitle.textContent = 'Migrating to SubCategories...';
            progressTitle.style.cssText = 'font-size: 20px; font-weight: 600; margin-bottom: 16px;';

            const progressText = document.createElement('div');
            progressText.style.cssText = 'font-size: 16px; margin-bottom: 8px;';
            progressText.textContent = 'Starting...';

            const progressDetail = document.createElement('div');
            progressDetail.style.cssText = 'font-size: 12px; color: #aaa; max-width: 300px; text-align: center;';

            progressOverlay.appendChild(progressTitle);
            progressOverlay.appendChild(progressText);
            progressOverlay.appendChild(progressDetail);
            document.body.appendChild(progressOverlay);

            try {
              // Run migration with progress updates
              const results = await migrateToSubCategories(AppState, (current, total, message) => {
                progressText.textContent = `Processing ${current} of ${total} gems`;
                progressDetail.textContent = message;
                console.log(`[Migration Progress] ${current}/${total}: ${message}`);
              });

              // Save updated profile
              await saveData();

              // Remove progress overlay
              progressOverlay.remove();

              // Show results
              const message = `✓ Migration Complete!\n\nProcessed: ${results.processed}\nMigrated: ${results.migrated}\nSkipped: ${results.skipped}\nErrors: ${results.errors}\n\nNew SubCategories: ${results.subCategoriesCreated.length}\n(${results.subCategoriesCreated.join(', ')})\n\nDuration: ${(results.duration / 1000).toFixed(1)}s`;
              alert(message);

              // Refresh UI
              renderCurrentScreen();

            } catch (error) {
              // Remove progress overlay
              if (progressOverlay.parentNode) {
                progressOverlay.remove();
              }
              console.error('[Migration] Error:', error);
              alert(`Migration failed: ${error.message}`);
            }
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
          },
          onCardSelectionChange: handleCardSelection,
          onMergedInfoClick: handleMergedInfoClick,
          onMergeClick: handleMergeSelectedCards,
          onDeleteSelected: handleDeleteSelected
        });

        // Store reference to preference options for merge button updates
        currentPreferenceOptions = screenComponent.getPreferenceOptions();
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

        const settingsOptions = {
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

            // Get all existing collections for context (predefined + user-created)
            const existingCollections = [...new Set(items.flatMap(item => item.collections || []))];
            const predefinedCategories = aiHelper.getPredefinedCategories();
            const allCollections = [...new Set([...predefinedCategories, ...existingCollections])];

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
          onMigrateSubCategories: async () => {
            // Confirm with user
            const confirmed = confirm('Migrate Fashion gems to SubCategories?\n\nThis will organize your Fashion gems into granular categories (shoes, tshirts, etc.) for better AI context matching.\n\nThis may take 1-2 minutes.');
            if (!confirmed) return;

            // Create progress overlay
            const progressOverlay = document.createElement('div');
            progressOverlay.style.cssText = `
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.8);
              z-index: 10000;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: white;
              font-family: system-ui;
            `;

            const progressTitle = document.createElement('div');
            progressTitle.textContent = 'Migrating to SubCategories...';
            progressTitle.style.cssText = 'font-size: 20px; font-weight: 600; margin-bottom: 16px;';

            const progressText = document.createElement('div');
            progressText.style.cssText = 'font-size: 16px; margin-bottom: 8px;';
            progressText.textContent = 'Starting...';

            const progressDetail = document.createElement('div');
            progressDetail.style.cssText = 'font-size: 12px; color: #aaa; max-width: 300px; text-align: center;';

            progressOverlay.appendChild(progressTitle);
            progressOverlay.appendChild(progressText);
            progressOverlay.appendChild(progressDetail);
            document.body.appendChild(progressOverlay);

            try {
              // Run migration with progress updates
              const results = await migrateToSubCategories(AppState, (current, total, message) => {
                progressText.textContent = `Processing ${current} of ${total} gems`;
                progressDetail.textContent = message;
                console.log(`[Migration Progress] ${current}/${total}: ${message}`);
              });

              // Save updated profile
              await saveData();

              // Remove progress overlay
              progressOverlay.remove();

              // Show results
              const message = `✓ Migration Complete!\n\nProcessed: ${results.processed}\nMigrated: ${results.migrated}\nSkipped: ${results.skipped}\nErrors: ${results.errors}\n\nNew SubCategories: ${results.subCategoriesCreated.length}\n(${results.subCategoriesCreated.join(', ')})\n\nDuration: ${(results.duration / 1000).toFixed(1)}s`;
              alert(message);

              // Refresh UI
              renderCurrentScreen();

            } catch (error) {
              // Remove progress overlay
              if (progressOverlay.parentNode) {
                progressOverlay.remove();
              }
              console.error('[Migration] Error:', error);
              alert(`Migration failed: ${error.message}`);
            }
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
        };

        screenComponent = createSettings(settingsOptions);
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

  // Initialize merge FAB
  initializeMergeFAB();

  // Check if beta check-in modal should be shown
  await checkBetaCheckinModal();
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
