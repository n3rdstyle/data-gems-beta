/**
 * Template Loader Service
 * Loads question templates from JSON files and manages them in chrome.storage
 */

/**
 * Template file names and their category mappings
 */
const TEMPLATE_FILES = [
  { file: 'arts_creativity_context_profile_template.json', category: 'Arts & Creativity', key: 'arts_creativity' },
  { file: 'emotions_context_profile_template.json', category: 'Emotions', key: 'emotions' },
  { file: 'environment_context_profile_template.json', category: 'Environment', key: 'environment' },
  { file: 'family_context_profile_template.json', category: 'Family', key: 'family' },
  { file: 'future_context_profile_template.json', category: 'Future', key: 'future' },
  { file: 'habits_context_profile_template.json', category: 'Habits', key: 'habits' },
  { file: 'health_context_profile_template.json', category: 'Health', key: 'health' },
  { file: 'housing_lifestyle_context_profile_template.json', category: 'Housing & Lifestyle', key: 'housing_lifestyle' },
  { file: 'personal_context_profile_template.json', category: 'Personal', key: 'personal' },
  { file: 'learning_context_profile_template.json', category: 'Learning', key: 'learning' },
  { file: 'memory_context_profile_template.json', category: 'Memory', key: 'memory' },
  { file: 'nutrition_context_profile_template.json', category: 'Nutrition', key: 'nutrition' },
  { file: 'philosophy_context_profile_template.json', category: 'Philosophy', key: 'philosophy' },
  { file: 'politics_context_profile_template.json', category: 'Politics', key: 'politics' },
  { file: 'relationships_context_profile_template.json', category: 'Relationships', key: 'relationships' },
  { file: 'shopping_context_profile_template.json', category: 'Shopping', key: 'shopping' },
  { file: 'sports_hobbies_context_profile_template.json', category: 'Sports & Hobbies', key: 'sports_hobbies' },
  { file: 'technology_context_profile_template.json', category: 'Technology', key: 'technology' },
  { file: 'travel_context_profile_template.json', category: 'Travel', key: 'travel' },
  { file: 'work_context_profile_template.json', category: 'Work', key: 'work' }
];

/**
 * Load a single template file
 * @param {string} fileName - Template file name
 * @returns {Promise<Object>} Template data
 */
async function loadTemplateFile(fileName) {
  try {
    const response = await fetch(chrome.runtime.getURL(`templates/${fileName}`));
    if (!response.ok) {
      throw new Error(`Failed to load template ${fileName}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading template ${fileName}:`, error);
    return null;
  }
}

/**
 * Load all templates from JSON files
 * @returns {Promise<Object>} All templates organized by category
 */
async function loadAllTemplates() {
  console.log('🔄 Loading question templates from JSON files...');

  const templates = {};
  let successCount = 0;
  let failCount = 0;

  for (const templateConfig of TEMPLATE_FILES) {
    const templateData = await loadTemplateFile(templateConfig.file);

    if (templateData) {
      templates[templateConfig.key] = {
        category: templateConfig.category,
        key: templateConfig.key,
        data: templateData,
        lastUpdated: new Date().toISOString(),
        fileName: templateConfig.file
      };
      successCount++;
      console.log(`  ✓ ${templateConfig.category}`);
    } else {
      failCount++;
      console.warn(`  ✗ Failed to load ${templateConfig.category}`);
    }
  }

  console.log(`✅ Loaded ${successCount}/${TEMPLATE_FILES.length} templates`);
  if (failCount > 0) {
    console.warn(`⚠️ ${failCount} templates failed to load`);
  }
  return templates;
}

/**
 * Save templates to chrome.storage
 * @param {Object} templates - Templates object
 * @returns {Promise<void>}
 */
async function saveTemplatesToStorage(templates) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ questionTemplates: templates }, () => {
      if (chrome.runtime.lastError) {
        console.error('❌ Failed to save templates:', chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        console.log('💾 Templates saved to storage');
        resolve();
      }
    });
  });
}

/**
 * Load templates from chrome.storage
 * @returns {Promise<Object>} Templates object
 */
async function loadTemplatesFromStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('questionTemplates', (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.questionTemplates || null);
      }
    });
  });
}

/**
 * Initialize templates - load from storage or from files if not present
 * @param {boolean} forceReload - Force reload from files even if storage exists
 * @returns {Promise<Object>} Templates object
 */
async function initializeTemplates(forceReload = false) {
  try {
    // Check if templates exist in storage
    const existingTemplates = await loadTemplatesFromStorage();

    if (existingTemplates && !forceReload) {
      console.log('Using templates from storage');
      return existingTemplates;
    }

    // Load templates from files
    console.log('Loading templates from files...');
    const templates = await loadAllTemplates();

    // Save to storage for future use
    await saveTemplatesToStorage(templates);

    return templates;
  } catch (error) {
    console.error('Error initializing templates:', error);
    throw error;
  }
}

/**
 * Update a specific field in a template
 * @param {string} categoryKey - Category key (e.g., 'travel')
 * @param {string} subcategoryKey - Subcategory key (e.g., 'identity_travel_style')
 * @param {string} fieldName - Field name (e.g., 'travel_persona')
 * @param {any} value - New value
 * @returns {Promise<void>}
 */
async function updateTemplateField(categoryKey, subcategoryKey, fieldName, value) {
  try {
    const templates = await loadTemplatesFromStorage();

    if (!templates || !templates[categoryKey]) {
      throw new Error(`Template ${categoryKey} not found`);
    }

    // Update the field
    if (!templates[categoryKey].data[subcategoryKey]) {
      templates[categoryKey].data[subcategoryKey] = {};
    }

    templates[categoryKey].data[subcategoryKey][fieldName] = value;
    templates[categoryKey].lastUpdated = new Date().toISOString();

    // Save back to storage
    await saveTemplatesToStorage(templates);

    console.log(`Updated ${categoryKey}.${subcategoryKey}.${fieldName}`);
  } catch (error) {
    console.error('Error updating template field:', error);
    throw error;
  }
}

/**
 * Get statistics about template completion
 * @returns {Promise<Object>} Statistics object
 */
async function getTemplateStats() {
  const templates = await loadTemplatesFromStorage();

  if (!templates) {
    return {
      totalFields: 0,
      answeredFields: 0,
      unansweredFields: 0,
      percentComplete: 0
    };
  }

  let totalFields = 0;
  let answeredFields = 0;

  for (const template of Object.values(templates)) {
    for (const subcategory of Object.values(template.data)) {
      if (typeof subcategory === 'object' && !Array.isArray(subcategory)) {
        for (const value of Object.values(subcategory)) {
          totalFields++;

          const isEmpty =
            value === '' ||
            value === null ||
            value === undefined ||
            (Array.isArray(value) && value.length === 0) ||
            value === 0 ||
            value === false;

          if (!isEmpty) {
            answeredFields++;
          }
        }
      }
    }
  }

  const unansweredFields = totalFields - answeredFields;
  const percentComplete = totalFields > 0 ? Math.round((answeredFields / totalFields) * 100) : 0;

  return {
    totalFields,
    answeredFields,
    unansweredFields,
    percentComplete
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadAllTemplates,
    saveTemplatesToStorage,
    loadTemplatesFromStorage,
    initializeTemplates,
    updateTemplateField,
    getTemplateStats
  };
}
