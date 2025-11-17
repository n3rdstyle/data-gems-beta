/**
 * Console Script: Quick Test Question System
 *
 * Quick test to verify the question system is working:
 * 1. Initializes templates (force reload)
 * 2. Gets a random question
 * 3. Shows what it looks like
 *
 * Usage:
 * 1. Open extension popup
 * 2. Open DevTools (F12)
 * 3. Copy and paste this entire script
 */

(async function testQuestionSystem() {
  console.log('=== Quick Test: Question System ===\n');

  try {
    // Step 1: Initialize (force reload)
    console.log('[1/3] Initializing templates...');
    await initializeRandomQuestions(true);
    console.log('');

    // Step 2: Get random question
    console.log('[2/3] Getting random question...');
    const question = await getRandomQuestion();

    if (!question) {
      console.warn('⚠️ No questions available (all answered?)');
      return;
    }

    console.log('');

    // Step 3: Display question details
    console.log('[3/3] Question Details:\n');
    console.log('📝 Question:');
    console.log(`   "${question.question}"`);
    console.log('');
    console.log('📂 Category:', question.categoryName);
    console.log('🔑 Field:', question.fieldName);
    console.log('📁 Subcategory:', question.subcategoryKey);
    console.log('');

    // Show what a gem would look like
    console.log('💎 If user answers "Example answer", gem would be:');
    console.log({
      topic: question.question,
      value: "Example answer",
      collections: [question.categoryName],
      metadata: {
        source: 'random_question',
        template: question.category,
        field: question.fieldName,
        subcategory: question.subcategoryKey
      }
    });
    console.log('');

    // Get stats
    const stats = await getQuestionStats();
    console.log('📊 Progress:');
    console.log(`   Total: ${stats.totalFields}`);
    console.log(`   Answered: ${stats.answeredFields} (${stats.percentComplete}%)`);
    console.log(`   Remaining: ${stats.unansweredFields}`);
    console.log('');

    console.log('✅ Test complete! System is working.\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n💡 Troubleshooting:');
    console.log('   - Check if templates are in templates/ folder');
    console.log('   - Check manifest.json web_accessible_resources');
    console.log('   - Try reloading the extension');
  }
})();
