/**
 * Question Loader Utility
 * Loads and manages random questions from CSV catalog
 */

/**
 * Parse CSV data into question objects
 * @param {string} csvText - Raw CSV text
 * @returns {Array<Object>} Array of question objects
 */
function parseQuestionCSV(csvText) {
  const lines = csvText.split('\n');
  const questions = [];

  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line (handle commas in quotes)
    const columns = parseCSVLine(line);

    if (columns.length >= 7) {
      const [nr, question, answerType, answerOptions, mainCategory, subCategory, subCategoryKey] = columns;

      // Only include if question text exists
      if (question && question.trim()) {
        questions.push({
          id: parseInt(nr) || questions.length + 1,
          question: question.trim(),
          answerType: answerType?.trim() || 'Freitext',
          answerOptions: answerOptions?.trim() || '',
          category: mainCategory?.trim() || 'General',
          subCategory: subCategory?.trim() || '',
          subCategoryKey: subCategoryKey?.trim() || '',
          tag: mainCategory?.trim() || 'General' // For compatibility with existing code
        });
      }
    }
  }

  return questions;
}

/**
 * Parse a single CSV line, respecting quoted commas
 * @param {string} line - CSV line
 * @returns {Array<string>} Array of column values
 */
function parseCSVLine(line) {
  const columns = [];
  let currentColumn = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentColumn += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of column
      columns.push(currentColumn);
      currentColumn = '';
    } else {
      currentColumn += char;
    }
  }

  // Add last column
  columns.push(currentColumn);

  return columns;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array (new copy)
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Load questions from CSV file
 * @returns {Promise<Array<Object>>} Promise resolving to array of shuffled question objects
 */
async function loadRandomQuestions() {
  try {
    const response = await fetch(chrome.runtime.getURL('complete-questions-catalog.csv'));
    if (!response.ok) {
      throw new Error(`Failed to load questions: ${response.statusText}`);
    }

    const csvText = await response.text();
    const questions = parseQuestionCSV(csvText);

    // Shuffle questions for random distribution
    const shuffledQuestions = shuffleArray(questions);

    console.log(`Loaded ${shuffledQuestions.length} random questions`);
    return shuffledQuestions;
  } catch (error) {
    console.error('Error loading random questions:', error);
    // Return fallback questions
    return getFallbackQuestions();
  }
}

/**
 * Get fallback questions if CSV loading fails
 * @returns {Array<Object>} Array of fallback questions
 */
function getFallbackQuestions() {
  return [
    { id: 1, question: 'What is your favorite food?', tag: 'Nutrition', category: 'Nutrition', subCategory: 'Preferences', subCategoryKey: 'nutrition_preferences' },
    { id: 2, question: 'Where is your next travel destination?', tag: 'Travel', category: 'Travel', subCategory: 'Destinations', subCategoryKey: 'travel_destinations' },
    { id: 3, question: 'Coffee or tea?', tag: 'Nutrition', category: 'Nutrition', subCategory: 'Preferences', subCategoryKey: 'nutrition_preferences' },
    { id: 4, question: 'Do you play soccer?', tag: 'Sports', category: 'Sports', subCategory: 'TeamSports', subCategoryKey: 'sports_teamsports' },
    { id: 5, question: 'Which phone do you have?', tag: 'Technology', category: 'Technology', subCategory: 'Devices', subCategoryKey: 'technology_devices' }
  ];
}

/**
 * Filter questions by category
 * @param {Array<Object>} questions - Array of questions
 * @param {string} category - Category to filter by
 * @returns {Array<Object>} Filtered questions
 */
function filterQuestionsByCategory(questions, category) {
  return questions.filter(q => q.category === category || q.tag === category);
}

/**
 * Get a random subset of questions
 * @param {Array<Object>} questions - Array of questions
 * @param {number} count - Number of questions to return
 * @returns {Array<Object>} Random subset of questions
 */
function getRandomSubset(questions, count) {
  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, count);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadRandomQuestions,
    parseQuestionCSV,
    shuffleArray,
    filterQuestionsByCategory,
    getRandomSubset,
    getFallbackQuestions
  };
}
