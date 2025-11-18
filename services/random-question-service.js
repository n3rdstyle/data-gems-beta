/**
 * Random Question Service
 * Orchestrates question generation, template management, and answer storage
 */

/**
 * Initialize the random question system
 * @param {boolean} forceReload - Force reload templates from files
 * @returns {Promise<void>}
 */
async function initializeRandomQuestions(forceReload = false) {
  try {
    console.log('🚀 Initializing Random Question System...');
    await initializeTemplates(forceReload);
    const stats = await getTemplateStats();
    console.log(`✅ Random Question System Ready!`);
    console.log(`   📊 ${stats.totalFields} total questions`);
    console.log(`   ✅ ${stats.answeredFields} answered (${stats.percentComplete}%)`);
    console.log(`   ❓ ${stats.unansweredFields} remaining`);
  } catch (error) {
    console.error('❌ Failed to initialize random questions:', error);
    throw error;
  }
}

/**
 * Get a random unanswered question from all templates
 * @returns {Promise<Object|null>} Question object or null if no questions available
 */
async function getRandomQuestion() {
  try {
    const templates = await loadTemplatesFromStorage();

    if (!templates) {
      throw new Error('No templates loaded. Please initialize first.');
    }

    // Collect all unanswered questions from all templates
    const allQuestions = [];

    for (const [categoryKey, template] of Object.entries(templates)) {
      const fields = extractFieldsFromTemplate(template.data, categoryKey);

      // Add category info to each field
      fields.forEach(field => {
        allQuestions.push({
          ...field,
          categoryName: template.category
        });
      });
    }

    if (allQuestions.length === 0) {
      console.log('🎉 All questions have been answered!');
      return null;
    }

    // Shuffle and pick one
    const shuffled = [...allQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const selectedQuestion = shuffled[0];

    console.log(`🎲 Selected question from ${selectedQuestion.categoryName}:`);
    console.log(`   "${selectedQuestion.question}"`);
    console.log(`   Remaining: ${allQuestions.length - 1} questions`);

    return selectedQuestion;
  } catch (error) {
    console.error('Error getting random question:', error);
    throw error;
  }
}

/**
 * Save an answer and create a gem
 * @param {Object} questionData - Question data object
 * @param {string} answer - User's answer
 * @returns {Promise<Object>} Created gem object
 */
async function saveAnswer(questionData, answer) {
  try {
    const { question, category, categoryName, subcategoryKey, fieldName } = questionData;

    // Create gem object for RxDB
    const gemForRxDB = {
      text: answer,
      topic: question,
      collections: [categoryName],
      subCollections: [],
      state: 'default',
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        source: 'random_question',
        template: category,
        field: fieldName,
        subcategory: subcategoryKey,
        answeredAt: new Date().toISOString()
      }
    };

    // Create gem object for hspProfile (different structure)
    const gemForProfile = {
      topic: question,
      value: answer,
      collections: [categoryName],
      children: [],
      metadata: {
        source: 'random_question',
        template: category,
        field: fieldName,
        subcategory: subcategoryKey,
        answeredAt: new Date().toISOString()
      }
    };

    // Track the inserted gem for return value
    let insertedGem = null;

    // 1. Save to RxDB (for UI display) via Background message passing
    try {
      // Transform to ContextEngineAPI format
      const gemForAPI = {
        id: generateId('rq'), // Generate unique ID for random question
        value: answer,
        collections: [categoryName],
        subCollections: [],
        state: 'default',
        timestamp: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        topic: question,

        // Primary gem fields
        isPrimary: true,
        parentGem: '',
        childGems: [],
        isVirtual: false,

        // Metadata
        metadata: {
          source: 'random_question',
          template: category,
          field: fieldName,
          subcategory: subcategoryKey,
          answeredAt: new Date().toISOString()
        }
      };

      // Send message to background to add gem
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          action: 'contextEngine.addGem',
          gem: gemForAPI,
          autoEnrich: false // Don't auto-enrich random questions
        }, (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      });

      if (response.success) {
        insertedGem = response.gem;
        console.log('✅ Gem saved to RxDB via Background:', insertedGem.id);
      } else {
        console.error('❌ Failed to save to RxDB:', response.error);
      }
    } catch (rxdbError) {
      console.error('❌ Failed to save to RxDB:', rxdbError);
      console.error('   Error details:', rxdbError.message);
      // Continue anyway to save to profile
    }

    // 2. Save to hspProfile (for export)
    const profileData = await new Promise((resolve, reject) => {
      chrome.storage.local.get('hspProfile', (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.hspProfile);
        }
      });
    });

    if (profileData) {
      if (!profileData.content.preferences.items) {
        profileData.content.preferences.items = [];
      }

      profileData.content.preferences.items.push(gemForProfile);

      await new Promise((resolve, reject) => {
        chrome.storage.local.set({ hspProfile: profileData }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    }

    // 3. Update template field
    await updateTemplateField(category, subcategoryKey, fieldName, answer);

    console.log(`💎 Answer saved as gem:`);
    console.log(`   Q: ${question}`);
    console.log(`   A: ${answer}`);
    console.log(`   Collection: ${categoryName}`);

    return insertedGem || gemForRxDB;
  } catch (error) {
    console.error('Error saving answer:', error);
    throw error;
  }
}

/**
 * Get statistics about question progress
 * @returns {Promise<Object>} Stats object
 */
async function getQuestionStats() {
  return await getTemplateStats();
}

/**
 * Reset all templates to empty state
 * @returns {Promise<void>}
 */
async function resetAllTemplates() {
  try {
    await initializeTemplates(true);
    console.log('All templates reset to empty state');
  } catch (error) {
    console.error('Error resetting templates:', error);
    throw error;
  }
}

/**
 * Get questions by category
 * @param {string} categoryKey - Category key (e.g., 'travel')
 * @returns {Promise<Array>} Array of question objects
 */
async function getQuestionsByCategory(categoryKey) {
  try {
    const templates = await loadTemplatesFromStorage();

    if (!templates || !templates[categoryKey]) {
      return [];
    }

    const template = templates[categoryKey];
    const fields = extractFieldsFromTemplate(template.data, categoryKey);

    return fields.map(field => ({
      ...field,
      categoryName: template.category
    }));
  } catch (error) {
    console.error('Error getting questions by category:', error);
    return [];
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeRandomQuestions,
    getRandomQuestion,
    saveAnswer,
    getQuestionStats,
    resetAllTemplates,
    getQuestionsByCategory
  };
}
