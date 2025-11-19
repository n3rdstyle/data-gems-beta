/**
 * Profile Formatter for AI Injection
 * Formats HSP Protocol v0.1 profile for injection into AI chat interfaces
 */

/**
 * Format HSP profile for AI injection
 * @param {object} hspProfile - HSP v0.1 profile object
 * @param {object} options - Formatting options
 * @param {boolean} options.includeHidden - Include fields with state "hidden" (default: false)
 * @param {boolean} options.includeMetadata - Include profile metadata (default: false)
 * @param {boolean} options.prettify - Prettify JSON output (default: true)
 * @returns {string} Formatted profile text for injection
 */
function formatProfileForInjection(hspProfile, options = {}) {
  const {
    includeHidden = false,
    includeMetadata = false,
    prettify = true
  } = options;

  if (!hspProfile || !hspProfile.hsp) {
    return 'No profile data available.';
  }

  // Create a filtered copy of the profile
  const filteredProfile = {
    hsp: hspProfile.hsp,
    type: hspProfile.type
  };

  // Filter identity fields
  if (hspProfile.content?.basic?.identity) {
    filteredProfile.content = {
      basic: {
        identity: {}
      }
    };

    const identity = hspProfile.content.basic.identity;
    Object.keys(identity).forEach(key => {
      const field = identity[key];

      // Skip hidden fields unless includeHidden is true
      if (!includeHidden && field.state === 'hidden') {
        return;
      }

      // Skip empty or null values
      if (field.value === null || field.value === '' ||
          (Array.isArray(field.value) && field.value.length === 0)) {
        return;
      }

      // Skip avatarImage (binary data not useful for AI)
      if (key === 'avatarImage') {
        return;
      }

      // Remove internal fields that LLM doesn't need
      const { embedding, vector, keywords, enrichmentTimestamp, enrichmentVersion, ...cleanField } = field;
      filteredProfile.content.basic.identity[key] = cleanField;
    });
  }

  // Filter preferences
  if (hspProfile.content?.preferences?.items) {
    if (!filteredProfile.content) {
      filteredProfile.content = {};
    }

    filteredProfile.content.preferences = {
      items: hspProfile.content.preferences.items
        .filter(pref => {
          // Skip hidden preferences unless includeHidden is true
          if (!includeHidden && pref.state === 'hidden') {
            return false;
          }
          // Skip empty preferences
          if (!pref.value || pref.value.trim() === '') {
            return false;
          }
          return true;
        })
        .map(pref => {
          // Remove internal fields that LLM doesn't need (including _childGemsToInsert)
          const { vector, keywords, enrichmentTimestamp, enrichmentVersion, _childGemsToInsert, ...cleanPref } = pref;
          return cleanPref;
        })
    };
  }

  // Include collections (always useful for context)
  // Only send collection labels (LLM doesn't need IDs, timestamps, etc.)
  if (hspProfile.collections && hspProfile.collections.length > 0) {
    filteredProfile.collections = hspProfile.collections.map(col => col.label);
  }

  // Include metadata if requested
  if (includeMetadata && hspProfile.metadata) {
    filteredProfile.metadata = {
      schema_version: hspProfile.metadata.schema_version,
      total_preferences: hspProfile.metadata.total_preferences
    };
  }

  // Generate the injection text
  const jsonString = prettify
    ? JSON.stringify(filteredProfile, null, 2)
    : JSON.stringify(filteredProfile);

  const injectionText = `Here is my Data Gems profile in HSP Protocol v${hspProfile.hsp} format:

\`\`\`json
${jsonString}
\`\`\`

Please use this information as context for our conversation.`;

  return injectionText;
}

/**
 * Get a human-readable summary of the profile
 * @param {object} hspProfile - HSP v0.1 profile object
 * @returns {string} Human-readable profile summary
 */
function getProfileSummary(hspProfile) {
  if (!hspProfile || !hspProfile.hsp) {
    return 'No profile available';
  }

  const identity = hspProfile.content?.basic?.identity || {};
  const preferences = hspProfile.content?.preferences?.items || [];

  const name = identity.name?.value || 'User';
  const prefCount = preferences.filter(p => p.state !== 'hidden').length;

  return `${name}'s profile with ${prefCount} preferences`;
}

/**
 * Check if profile has sufficient data for injection
 * @param {object} hspProfile - HSP v0.1 profile object
 * @returns {boolean} True if profile has data worth injecting
 */
function hasInjectableData(hspProfile) {
  if (!hspProfile || !hspProfile.hsp) {
    return false;
  }

  const identity = hspProfile.content?.basic?.identity || {};
  const preferences = hspProfile.content?.preferences?.items || [];

  // Check if there's at least one non-empty identity field (excluding avatarImage)
  const hasIdentityData = Object.keys(identity).some(key => {
    if (key === 'avatarImage') return false;
    const field = identity[key];
    return field && field.value && field.value !== '' &&
           (!Array.isArray(field.value) || field.value.length > 0) &&
           field.state !== 'hidden';
  });

  // Check if there's at least one visible preference
  const hasPreferences = preferences.some(p =>
    p.value && p.value.trim() !== '' && p.state !== 'hidden'
  );

  return hasIdentityData || hasPreferences;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatProfileForInjection,
    getProfileSummary,
    hasInjectableData
  };
}
