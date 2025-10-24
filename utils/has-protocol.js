/**
 * HAS Protocol Utilities
 * Helper functions for MVP v0.1 data structure
 */

/**
 * Generate a unique ID with prefix
 * @param {string} prefix - Prefix for the ID (e.g., 'pref', 'col', 'profile')
 * @returns {string} Generated ID
 */
function generateId(prefix = 'id') {
  // Simple timestamp-based ID (good enough for MVP)
  // In production, use crypto.randomUUID() or similar
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}_${timestamp}${random}`;
}

/**
 * Get current timestamp in ISO8601 format
 * @returns {string} ISO8601 timestamp
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Create a field object with HAS protocol metadata
 * @param {*} value - The field value
 * @param {string} assurance - Assurance level ('self_declared', 'derived', etc.)
 * @param {string} reliability - Reliability level ('authoritative', 'high', 'medium', 'low')
 * @returns {object} Field object
 */
function createField(value, assurance = 'self_declared', reliability = 'high') {
  return {
    value,
    assurance,
    reliability,
    updated_at: getTimestamp()
  };
}

/**
 * Create a new preference object
 * @param {string} value - Preference text
 * @param {string} state - State ('default', 'favorited', 'hidden')
 * @param {Array<string>} collections - Collection IDs
 * @returns {object} Preference object
 */
function createPreference(value, state = 'default', collections = []) {
  return {
    id: generateId('pref'),
    value,
    assurance: 'self_declared',
    reliability: 'authoritative',
    state,
    collections,
    created_at: getTimestamp(),
    updated_at: getTimestamp()
  };
}

/**
 * Update a field's value and timestamp
 * @param {object} field - Field object
 * @param {*} newValue - New value
 * @returns {object} Updated field
 */
function updateField(field, newValue) {
  return {
    ...field,
    value: newValue,
    updated_at: getTimestamp()
  };
}

/**
 * Create initial HAS profile structure
 * @param {object} userData - Legacy user data
 * @returns {object} HAS v0.1 profile
 */
function createInitialProfile(userData = {}) {
  // Create identity fields in correct order
  const identity = {};
  identity.name = createField(userData.name || '', 'self_declared', 'high');
  identity.subtitle = createField(userData.subtitle || '', 'self_declared', 'high');
  identity.email = createField(userData.email || '', 'self_declared', 'high');
  identity.age = createField(userData.age || null, 'self_declared', 'medium');
  identity.gender = createField(userData.gender || null, 'self_declared', 'high');
  identity.location = createField(userData.location || '', 'self_declared', 'high');
  identity.description = createField(userData.description || '', 'self_declared', 'authoritative');
  identity.languages = createField(userData.languages || [], 'self_declared', 'high');

  return {
    id: generateId('profile'),
    has: '0.1',
    type: 'profile',
    created_at: getTimestamp(),
    updated_at: getTimestamp(),

    content: {
      basic: {
        identity: identity
      },
      preferences: {
        items: []
      }
    },

    collections: [
      {
        id: generateId('col'),
        name: 'favorites',
        label: 'Favorites',
        created_at: getTimestamp()
      }
    ],

    settings: {
      ui: {
        theme: 'light',
        compact_mode: false
      },
      privacy: {
        store_locally_only: true,
        auto_clear_after_days: null
      }
    },

    metadata: {
      schema_version: '0.1',
      extension_version: '2.0.0',
      total_preferences: 0,
      last_backup: null
    }
  };
}

/**
 * Migrate legacy AppState to HAS v0.1
 * @param {object} legacyState - Old AppState format
 * @returns {object} HAS v0.1 profile
 */
function migrateLegacyState(legacyState) {
  let profile = createInitialProfile(legacyState.userData);

  // Migrate preferences
  if (Array.isArray(legacyState.preferences)) {
    // Collect all unique collection labels from preferences
    const allCollectionLabels = new Set();

    profile.content.preferences.items = legacyState.preferences.map(pref => {
      const collections = pref.collections || [];
      collections.forEach(label => allCollectionLabels.add(label));

      if (typeof pref === 'string') {
        return createPreference(pref);
      } else {
        return createPreference(
          pref.text || pref.value || '',
          pref.state || 'default',
          collections
        );
      }
    });

    // Register all collections found in preferences
    if (allCollectionLabels.size > 0) {
      profile = registerCollections(profile, Array.from(allCollectionLabels));
    }
  }

  profile.metadata.total_preferences = profile.content.preferences.items.length;

  return profile;
}

/**
 * Get user identity data (for backward compatibility with UI)
 * @param {object} profile - HAS v0.1 profile
 * @returns {object} User identity object
 */
function getUserIdentity(profile) {
  const identity = profile?.content?.basic?.identity || {};
  return {
    name: identity.name?.value || '',
    subtitle: identity.subtitle?.value || '',
    email: identity.email?.value || '',
    age: identity.age?.value || null,
    gender: identity.gender?.value || null,
    location: identity.location?.value || '',
    description: identity.description?.value || '',
    languages: identity.languages?.value || []
  };
}

/**
 * Update user identity field
 * @param {object} profile - HAS v0.1 profile
 * @param {string} fieldName - Field name (e.g., 'name', 'email')
 * @param {*} value - New value
 * @returns {object} Updated profile
 */
function updateUserIdentity(profile, fieldName, value) {
  // Deep clone to avoid mutating the original profile
  const updatedProfile = JSON.parse(JSON.stringify(profile));

  if (!updatedProfile.content.basic.identity[fieldName]) {
    updatedProfile.content.basic.identity[fieldName] = createField(value);
  } else {
    updatedProfile.content.basic.identity[fieldName] = updateField(
      updatedProfile.content.basic.identity[fieldName],
      value
    );
  }

  updatedProfile.updated_at = getTimestamp();
  return updatedProfile;
}

/**
 * Register new collections in the collections array
 * @param {object} profile - HAS v0.1 profile
 * @param {Array<string>} collectionLabels - Array of collection labels (e.g., ['Nutrition', 'Sports'])
 * @returns {object} Updated profile
 */
function registerCollections(profile, collectionLabels) {
  // Deep clone to avoid mutating the original profile
  const updatedProfile = JSON.parse(JSON.stringify(profile));

  // Get existing collection labels (lowercase for comparison)
  const existingLabels = new Set(
    updatedProfile.collections.map(col => col.label.toLowerCase())
  );

  // Add new collections that don't exist yet
  collectionLabels.forEach(label => {
    if (label && !existingLabels.has(label.toLowerCase())) {
      updatedProfile.collections.push({
        id: generateId('col'),
        name: label.toLowerCase().replace(/\s+/g, '_'), // Convert to snake_case
        label: label,
        created_at: getTimestamp()
      });
      existingLabels.add(label.toLowerCase());
    }
  });

  return updatedProfile;
}

/**
 * Add a preference to the profile
 * @param {object} profile - HAS v0.1 profile
 * @param {string} value - Preference text
 * @param {string} state - State ('default', 'favorited', 'hidden')
 * @param {Array<string>} collections - Collection labels (e.g., ['Nutrition', 'Sports'])
 * @returns {object} Updated profile
 */
function addPreference(profile, value, state = 'default', collections = []) {
  // Deep clone to avoid mutating the original profile
  let updatedProfile = JSON.parse(JSON.stringify(profile));

  // Register new collections first
  if (collections.length > 0) {
    updatedProfile = registerCollections(updatedProfile, collections);
  }

  const newPref = createPreference(value, state, collections);

  updatedProfile.content.preferences.items.push(newPref);
  updatedProfile.metadata.total_preferences = updatedProfile.content.preferences.items.length;
  updatedProfile.updated_at = getTimestamp();

  return updatedProfile;
}

/**
 * Update a preference
 * @param {object} profile - HAS v0.1 profile
 * @param {string} prefId - Preference ID
 * @param {object} updates - Fields to update (can include 'collections')
 * @returns {object} Updated profile
 */
function updatePreference(profile, prefId, updates) {
  console.log('🔧 updatePreference called:', { prefId, updates });
  console.log('BEFORE:', profile.content.preferences.items.map(p => `[${p.state}] ${p.value.substring(0, 20)}`).join('\n'));

  // Deep clone to avoid mutating the original profile
  let updatedProfile = JSON.parse(JSON.stringify(profile));
  const prefIndex = updatedProfile.content.preferences.items.findIndex(p => p.id === prefId);

  if (prefIndex === -1) {
    console.warn(`Preference with id ${prefId} not found`);
    return profile;
  }

  console.log(`📍 Updating index ${prefIndex}`);

  // Register new collections if collections are being updated
  if (updates.collections && Array.isArray(updates.collections)) {
    updatedProfile = registerCollections(updatedProfile, updates.collections);
  }

  updatedProfile.content.preferences.items[prefIndex] = {
    ...updatedProfile.content.preferences.items[prefIndex],
    ...updates,
    updated_at: getTimestamp()
  };

  console.log('AFTER:', updatedProfile.content.preferences.items.map(p => `[${p.state}] ${p.value.substring(0, 20)}`).join('\n'));

  updatedProfile.updated_at = getTimestamp();
  return updatedProfile;
}

/**
 * Delete a preference
 * @param {object} profile - HAS v0.1 profile
 * @param {string} prefId - Preference ID
 * @returns {object} Updated profile
 */
function deletePreference(profile, prefId) {
  console.log('🗑️ deletePreference called:', { prefId });
  console.log('📋 BEFORE delete:');
  console.table(profile.content.preferences.items.map(p => ({ id: p.id, value: p.value.substring(0, 30), state: p.state })));

  // Deep clone to avoid mutating the original profile
  const updatedProfile = JSON.parse(JSON.stringify(profile));

  updatedProfile.content.preferences.items = updatedProfile.content.preferences.items.filter(
    p => p.id !== prefId
  );

  console.log('📋 AFTER delete:');
  console.table(updatedProfile.content.preferences.items.map(p => ({ id: p.id, value: p.value.substring(0, 30), state: p.state })));

  updatedProfile.metadata.total_preferences = updatedProfile.content.preferences.items.length;
  updatedProfile.updated_at = getTimestamp();

  return updatedProfile;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateId,
    getTimestamp,
    createField,
    createPreference,
    updateField,
    createInitialProfile,
    migrateLegacyState,
    getUserIdentity,
    updateUserIdentity,
    addPreference,
    updatePreference,
    deletePreference
  };
}
