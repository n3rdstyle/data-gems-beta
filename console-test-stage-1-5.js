/**
 * Test Improved Stage 1.5 SubCategory Filtering
 *
 * Run this in the extension console to test the new AI-based SubCategory filtering.
 */

(async function testStage15() {
  console.log('=== Testing Improved Stage 1.5 SubCategory Filtering ===\n');

  // Test query
  const testQuery = "I need comfortable shoes for everyday wear";
  console.log(`🧪 Test Query: "${testQuery}"\n`);

  // Load profile
  const result = await chrome.storage.local.get('hspProfile');
  const profile = result.hspProfile;

  if (!profile) {
    console.error('❌ No profile found');
    return;
  }

  const gems = profile.content?.preferences?.items || [];
  const visibleGems = gems.filter(gem => gem.state !== 'hidden');
  console.log(`✓ Loaded ${visibleGems.length} visible gems\n`);

  // Use the context selector function (already loaded in extension)
  if (typeof optimizePromptWithContext === 'undefined') {
    console.error('❌ Context selector not loaded. Make sure you\'re in the extension popup.');
    return;
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Starting context selection with NEW Stage 1.5...\n');

  try {
    const optimizedPrompt = await optimizePromptWithContext(testQuery, profile, true, 5);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ CONTEXT SELECTION COMPLETE!\n');

    // Extract selected gems from the optimized prompt
    const contextLines = optimizedPrompt.split('\n').filter(line => line.startsWith('@'));
    console.log(`📊 Selected ${contextLines.length} gems for context\n`);

    if (contextLines.length > 0) {
      console.log('Selected context:');
      contextLines.forEach((line, i) => {
        console.log(`  ${i + 1}. ${line.substring(0, 100)}...`);
      });
    }

    console.log('\n💡 Check the console logs above to see:');
    console.log('   • Stage 1: Main Category selection (e.g., Fashion)');
    console.log('   • Stage 1.5: SubCategory selection (e.g., fashion_style, fashion_brands)');
    console.log('   • Filtering progress and reduction percentage');
    console.log('   • Stage 2: AI scoring of final filtered gems');

  } catch (error) {
    console.error('❌ Error during context selection:', error);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

})();
