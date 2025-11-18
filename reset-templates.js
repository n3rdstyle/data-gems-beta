/**
 * Reset template cache in chrome.storage
 * Run this in the browser console (popup or background page) to force reload templates
 */

// Delete the cached templates and reload
chrome.storage.local.remove('questionTemplates', () => {
  console.log('✅ Template cache cleared!');
  console.log('🔄 Initializing templates...');

  // Force reload
  if (typeof initializeRandomQuestions !== 'undefined') {
    initializeRandomQuestions(true).then(() => {
      console.log('✅ Templates reloaded with new questions!');
    }).catch(error => {
      console.error('❌ Error reloading templates:', error);
    });
  } else {
    console.log('⚠️ Please reload the extension to see the new questions');
  }
});
