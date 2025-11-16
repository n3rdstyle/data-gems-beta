// Run this in Service Worker console to fix missing isPrimary flags
// Copy and paste each line one at a time:

self.ContextEngineAPI.engine.updateGem('pref_test_003', {isPrimary: true}, false).then(() => console.log('Fixed pref_test_003'));

self.ContextEngineAPI.engine.updateGem('pref_test_004', {isPrimary: true}, false).then(() => console.log('Fixed pref_test_004'));

self.ContextEngineAPI.engine.updateGem('pref_test_005', {isPrimary: true}, false).then(() => console.log('Fixed pref_test_005'));

self.ContextEngineAPI.engine.updateGem('pref_test_009', {isPrimary: true}, false).then(() => console.log('Fixed pref_test_009'));
