/**
 * Console Script: Debug Question Templates
 *
 * Shows detailed information about loaded question templates:
 * - How many templates are loaded
 * - Questions per category
 * - Total statistics
 * - Sample questions from each category
 *
 * Usage:
 * 1. Open extension popup
 * 2. Open DevTools (F12)
 * 3. Copy and paste this entire script
 */

(async function debugQuestionTemplates() {
  console.log('=== Question Templates Debug ===\n');

  try {
    // Load templates from storage
    console.log('[1/3] Loading templates from storage...');
    const { questionTemplates } = await chrome.storage.local.get('questionTemplates');

    if (!questionTemplates) {
      console.error('❌ No templates found in storage!');
      console.log('\n💡 Tip: Try initializing templates first:');
      console.log('   await initializeRandomQuestions(true);');
      return;
    }

    console.log(`✓ Templates loaded: ${Object.keys(questionTemplates).length} categories\n`);

    // Analyze each category
    console.log('[2/3] Analyzing categories...\n');

    const categoryStats = [];
    let totalFields = 0;
    let totalAnswered = 0;
    let totalUnanswered = 0;

    for (const [categoryKey, template] of Object.entries(questionTemplates)) {
      let fieldsInCategory = 0;
      let answeredInCategory = 0;
      let unansweredInCategory = 0;
      const sampleQuestions = [];

      // Extract fields from template
      for (const [subcategoryKey, subcategoryData] of Object.entries(template.data)) {
        if (typeof subcategoryData === 'object' && !Array.isArray(subcategoryData)) {
          for (const [fieldName, fieldValue] of Object.entries(subcategoryData)) {
            fieldsInCategory++;

            const isEmpty =
              fieldValue === '' ||
              fieldValue === null ||
              fieldValue === undefined ||
              (Array.isArray(fieldValue) && fieldValue.length === 0) ||
              fieldValue === 0 ||
              fieldValue === false;

            if (isEmpty) {
              unansweredInCategory++;

              // Generate sample question
              if (sampleQuestions.length < 3) {
                const question = generateQuestionPreview(fieldName, categoryKey, subcategoryKey);
                sampleQuestions.push(question);
              }
            } else {
              answeredInCategory++;
            }
          }
        }
      }

      totalFields += fieldsInCategory;
      totalAnswered += answeredInCategory;
      totalUnanswered += unansweredInCategory;

      categoryStats.push({
        key: categoryKey,
        name: template.category,
        total: fieldsInCategory,
        answered: answeredInCategory,
        unanswered: unansweredInCategory,
        percentComplete: fieldsInCategory > 0 ? Math.round((answeredInCategory / fieldsInCategory) * 100) : 0,
        samples: sampleQuestions
      });
    }

    // Sort by number of unanswered questions
    categoryStats.sort((a, b) => b.unanswered - a.unanswered);

    // Display statistics
    console.log('📊 CATEGORY STATISTICS:\n');
    console.table(categoryStats.map(cat => ({
      'Category': cat.name,
      'Total Fields': cat.total,
      'Answered': cat.answered,
      'Unanswered': cat.unanswered,
      'Complete %': `${cat.percentComplete}%`
    })));

    // Display sample questions
    console.log('\n💬 SAMPLE QUESTIONS (3 per category):\n');
    categoryStats.forEach(cat => {
      if (cat.samples.length > 0) {
        console.log(`\n${cat.name} (${cat.unanswered} questions):`);
        cat.samples.forEach((q, i) => {
          console.log(`  ${i + 1}. ${q}`);
        });
      }
    });

    // Overall statistics
    console.log('\n[3/3] Overall Statistics:\n');
    console.log(`📈 Total Fields: ${totalFields}`);
    console.log(`✅ Answered: ${totalAnswered} (${Math.round((totalAnswered / totalFields) * 100)}%)`);
    console.log(`❓ Unanswered: ${totalUnanswered} (${Math.round((totalUnanswered / totalFields) * 100)}%)`);

    // Test getting a random question
    console.log('\n🎲 Testing Random Question Generation...');
    try {
      const randomQuestion = await getRandomQuestion();
      if (randomQuestion) {
        console.log(`✓ Got random question from ${randomQuestion.categoryName}:`);
        console.log(`  "${randomQuestion.question}"`);
        console.log(`  Field: ${randomQuestion.fieldName}`);
        console.log(`  Subcategory: ${randomQuestion.subcategoryKey}`);
      } else {
        console.log('ℹ️ All questions have been answered!');
      }
    } catch (error) {
      console.error('❌ Error getting random question:', error);
    }

    console.log('\n✓ Debug complete!\n');

  } catch (error) {
    console.error('❌ Error during debug:', error);
    console.log('\n💡 Make sure the extension is loaded and services are available.');
  }
})();

/**
 * Helper: Generate a preview of what the question would look like
 */
function generateQuestionPreview(fieldName, category, subcategory) {
  // Simple field name to question conversion for preview
  const cleaned = fieldName
    .replace(/_/g, ' ')
    .replace(/^preferred /, '')
    .replace(/^favorite /, '')
    .replace(/^main /, '');

  const isPlural = fieldName.endsWith('s') || fieldName.includes('activities') || fieldName.includes('motivations');

  if (isPlural) {
    return `What are your ${cleaned}?`;
  } else {
    return `What is your ${cleaned}?`;
  }
}
