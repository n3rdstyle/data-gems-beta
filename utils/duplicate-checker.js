/**
 * Duplicate Checker Utility
 * Uses Gemini Nano to detect similar gems and prevent duplicates
 */

/**
 * Check if a gem text is similar to any existing gems
 * @param {string} newText - The text of the gem being saved
 * @param {Array} existingGems - Array of existing preference objects
 * @param {number} threshold - Similarity threshold (0-100), default 80
 * @returns {Promise<Object|null>} Similar gem object or null if no match
 */
async function checkForDuplicates(newText, existingGems, threshold = 80) {
  try {
    // Check if AI Helper is available
    if (typeof aiHelper === 'undefined' || !aiHelper) {
      console.log('[Duplicate Checker] AI Helper not available');
      return null;
    }

    // Initialize AI if needed
    const available = await aiHelper.checkAvailability();
    if (!available) {
      console.log('[Duplicate Checker] AI not available');
      return null;
    }

    await aiHelper.initialize();

    // Create AI session for similarity checking
    const session = await LanguageModel.create({
      language: 'en',
      systemPrompt: `You are a similarity detector for user preferences.
Compare a new preference text with existing preferences and rate similarity.

Rules:
1. Consider semantic meaning, not just exact words
2. "I eat meat" and "Do you like meat? Yes" are 85% similar (same topic, different phrasing)
3. "Favorite color: blue" and "I like blue" are 90% similar
4. "Running is my hobby" and "I hate running" are 20% similar (opposite meanings)
5. Rate similarity from 0-100

Output format (just the number):
85`
    });

    console.log(`[Duplicate Checker] Checking ${existingGems.length} existing gems for similarity`);

    let mostSimilar = null;
    let highestScore = 0;

    // Check each existing gem
    for (const gem of existingGems) {
      const prompt = `New preference: "${newText}"

Existing preference: "${gem.value}"

How similar are these? (0-100, just the number):`;

      try {
        const response = await session.prompt(prompt);
        const score = parseInt(response.trim());

        if (!isNaN(score) && score > highestScore && score >= threshold) {
          highestScore = score;
          mostSimilar = {
            gem: gem,
            similarity: score
          };
        }

        // Log high similarity matches
        if (score >= threshold) {
          console.log(`[Duplicate Checker] Found similar gem (${score}%):`, gem.value.substring(0, 60) + '...');
        }
      } catch (error) {
        console.warn('[Duplicate Checker] Error checking gem:', error);
        continue;
      }
    }

    await session.destroy();

    if (mostSimilar) {
      console.log(`[Duplicate Checker] Most similar gem: ${mostSimilar.similarity}%`);
      return mostSimilar;
    }

    console.log('[Duplicate Checker] No similar gems found');
    return null;

  } catch (error) {
    console.error('[Duplicate Checker] Error:', error);
    return null;
  }
}

/**
 * Generate consolidated text from multiple gems using AI
 * @param {Array<string>} texts - Array of gem texts to consolidate
 * @returns {Promise<string>} Consolidated text
 */
async function generateConsolidatedText(texts) {
  try {
    // Check if AI Helper is available
    if (typeof aiHelper === 'undefined' || !aiHelper) {
      // Fallback: just concatenate with line breaks
      return texts.join('\n\n---\n\n');
    }

    const available = await aiHelper.checkAvailability();
    if (!available) {
      return texts.join('\n\n---\n\n');
    }

    await aiHelper.initialize();

    const session = await LanguageModel.create({
      language: 'en',
      systemPrompt: `You are a preference consolidation assistant.
Merge multiple preference texts into ONE SHORT, DIRECT statement.

Rules:
1. Be as concise as possible - use the minimum words needed
2. Combine redundant information
3. Do NOT add alternatives, clarifications, or meta-comments
4. Do NOT use parentheses like "(or...)" or "(slightly more formal...)"
5. Output PLAIN TEXT only - no markdown formatting (no **, __, etc.)
6. Write one simple sentence, no explanations

Example:
Input 1: "I prioritize testing"
Input 2: "Testing is important to me"
Output: Testing is a priority

Bad output: "Prioritize testing. (Or, slightly more formal: Testing is a high priority.)"
Good output: "Testing is a priority"

Output only the shortest consolidated statement, nothing else.`
    });

    const prompt = `Merge into ONE SHORT sentence:

${texts.map((text, i) => `${i + 1}. ${text}`).join('\n\n')}

Merged:`;

    const response = await session.prompt(prompt);
    await session.destroy();

    // Remove any markdown formatting that might have been added
    const cleanText = response.trim()
      .replace(/\*\*/g, '')  // Remove bold **text**
      .replace(/__/g, '')    // Remove bold __text__
      .replace(/\*/g, '')    // Remove italic *text*
      .replace(/_([^_]+)_/g, '$1')  // Remove italic _text_
      .replace(/`/g, '');    // Remove code `text`

    return cleanText;

  } catch (error) {
    console.error('[Duplicate Checker] Error generating consolidated text:', error);
    // Fallback: concatenate
    return texts.join('\n\n---\n\n');
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkForDuplicates,
    generateConsolidatedText
  };
}
