/**
 * Profile Formatter for AI Injection
 * Formats HSP Protocol v0.1 profile for injection into AI chat interfaces
 */

/**
 * Format HSP profile for AI injection
 * @param {object} hasProfile - HSP v0.1 profile object
 * @param {object} options - Formatting options
 * @param {boolean} options.includeHidden - Include fields with state "hidden" (default: false)
 * @param {boolean} options.includeMetadata - Include profile metadata (default: false)
 * @param {boolean} options.prettify - Prettify JSON output (default: true)
 * @returns {string} Formatted profile text for injection
 */
function formatProfileForInjection(hasProfile, options = {}) {
  const {
    includeHidden = false,
    includeMetadata = false,
    prettify = true
  } = options;

  if (!hasProfile || !hasProfile.hsp) {
    return 'No profile data available.';
  }

  // Create a filtered copy of the profile
  const filteredProfile = {
    hsp: hasProfile.hsp,
    type: hasProfile.type
  };

  // Filter identity fields
  if (hasProfile.content?.basic?.identity) {
    filteredProfile.content = {
      basic: {
        identity: {}
      }
    };

    const identity = hasProfile.content.basic.identity;
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

      filteredProfile.content.basic.identity[key] = field;
    });
  }

  // Filter preferences
  if (hasProfile.content?.preferences?.items) {
    if (!filteredProfile.content) {
      filteredProfile.content = {};
    }

    filteredProfile.content.preferences = {
      items: hasProfile.content.preferences.items.filter(pref => {
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
    };
  }

  // Include collections (always useful for context)
  if (hasProfile.collections && hasProfile.collections.length > 0) {
    filteredProfile.collections = hasProfile.collections;
  }

  // Include metadata if requested
  if (includeMetadata && hasProfile.metadata) {
    filteredProfile.metadata = {
      schema_version: hasProfile.metadata.schema_version,
      total_preferences: hasProfile.metadata.total_preferences
    };
  }

  // Generate the injection text
  const jsonString = prettify
    ? JSON.stringify(filteredProfile, null, 2)
    : JSON.stringify(filteredProfile);

  const injectionText = `Here is my Data Gems profile in HSP Protocol v${hasProfile.hsp} format:

\`\`\`json
${jsonString}
\`\`\`

Please use this information as context for our conversation.`;

  return injectionText;
}

/**
 * Get a human-readable summary of the profile
 * @param {object} hasProfile - HSP v0.1 profile object
 * @returns {string} Human-readable profile summary
 */
function getProfileSummary(hasProfile) {
  if (!hasProfile || !hasProfile.hsp) {
    return 'No profile available';
  }

  const identity = hasProfile.content?.basic?.identity || {};
  const preferences = hasProfile.content?.preferences?.items || [];

  const name = identity.name?.value || 'User';
  const prefCount = preferences.filter(p => p.state !== 'hidden').length;

  return `${name}'s profile with ${prefCount} preferences`;
}

/**
 * Check if profile has sufficient data for injection
 * @param {object} hasProfile - HSP v0.1 profile object
 * @returns {boolean} True if profile has data worth injecting
 */
function hasInjectableData(hasProfile) {
  if (!hasProfile || !hasProfile.hsp) {
    return false;
  }

  const identity = hasProfile.content?.basic?.identity || {};
  const preferences = hasProfile.content?.preferences?.items || [];

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
