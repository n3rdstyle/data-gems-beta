// Debug Script - kopiere das in die Chrome DevTools Console (Popup)

chrome.storage.local.get(null, (result) => {
  console.log('=== COMPLETE STORAGE ===');
  console.log(JSON.stringify(result, null, 2));

  console.log('\n=== KEYS ===');
  console.log(Object.keys(result));

  if (result.hspProfile) {
    console.log('\n=== hspProfile exists ===');
    console.log('Preferences count:', result.hspProfile?.content?.preferences?.items?.length || 0);
  }

  if (result.betaUser) {
    console.log('\n=== betaUser ===');
    console.log(result.betaUser);
  }
});
