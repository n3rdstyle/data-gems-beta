# 🔍 Storage Debug Guide

## Schritt 1: Extension neu laden
```
1. chrome://extensions/
2. Data Gems Extension finden
3. Reload Button 🔄 klicken
```

---

## Schritt 2: Extension öffnen & Console checken

```
1. Extension Icon klicken
2. Rechtsklick im Extension Popup → "Inspect" (oder F12)
3. Tab "Console" öffnen
```

**Was du sehen solltest:**
```
Data Gems app.js loaded
Initializing Data Gems with HSP Protocol v0.1...
🆕 No existing data - creating fresh profile
✅ HSP v0.1 profile saved to storage
✅ Total preferences: 0
✅ Fresh profile created and saved
Screen rendered: home
Data Gems initialized successfully!
```

---

## Schritt 3: Neue Preference hinzufügen

```
1. "+ Add" Button klicken
2. Text eingeben: "Test Preference"
3. "Save" klicken
```

**Was du in Console sehen solltest:**
```
🔵 onPreferenceAdd called: {value: "Test Preference", state: "default", collections: []}
🔵 AppState after add: [{id: "pref_...", value: "Test Preference", ...}]
✅ HSP v0.1 profile saved to storage
✅ Total preferences: 1
🔵 Data saved to storage
```

**WICHTIG:** Wenn du **NICHT** diese Logs siehst, dann wird `onPreferenceAdd` nicht aufgerufen!

---

## Schritt 4: Storage manuell checken

In Console eingeben:
```javascript
chrome.storage.local.get(['hasProfile'], (result) => {
  console.log('=== STORAGE CHECK ===');
  console.log('Has Profile?', !!result.hasProfile);
  console.log('Preferences:', result.hasProfile?.content?.preferences?.items?.length || 0);
  console.log('Full data:', result.hasProfile);
});
```

**Expected Output:**
```
=== STORAGE CHECK ===
Has Profile? true
Preferences: 1
Full data: {id: "profile_...", has: "0.1", content: {...}}
```

---

## Schritt 5: Extension schließen & neu öffnen

```
1. Extension Popup schließen (X)
2. Extension Icon erneut klicken
```

**Was du in Console sehen solltest:**
```
Data Gems app.js loaded
Initializing Data Gems with HSP Protocol v0.1...
✅ Loaded HSP v0.1 profile from storage
✅ Preferences loaded: 1
Screen rendered: home
Data Gems initialized successfully!
```

**Preference sollte in der Liste sein!**

---

## 🐛 Mögliche Probleme:

### Problem 1: `onPreferenceAdd` wird nicht aufgerufen
**Symptom:** Keine 🔵 Logs in Console

**Ursache:** home.js nutzt die Callbacks nicht

**Check:** In home.js nach `onPreferenceAdd(` suchen

---

### Problem 2: Storage Permission fehlt
**Symptom:** `Error saving data: ... permission denied`

**Check in manifest.json:**
```json
"permissions": ["storage"]  // ✅ Muss da sein
```

---

### Problem 3: Extension Context Problem
**Symptom:** `chrome.storage is undefined`

**Lösung:** Extension muss neu geladen werden

---

## 🔧 Quick Fix Commands

### Storage komplett löschen:
```javascript
chrome.storage.local.clear(() => console.log('Storage cleared'));
```

### Storage Inhalt ansehen:
```javascript
chrome.storage.local.get(null, (items) => {
  console.log('All storage:', items);
});
```

### Manuell Preference hinzufügen (Test):
```javascript
chrome.storage.local.get(['hasProfile'], async (result) => {
  const profile = result.hasProfile;
  profile.content.preferences.items.push({
    id: 'test_001',
    value: 'Manual test preference',
    state: 'default',
    collections: [],
    assurance: 'self_declared',
    reliability: 'authoritative',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  await chrome.storage.local.set({ hasProfile: profile });
  console.log('Manual preference added! Close & reopen extension.');
});
```

---

## 📊 Was ich sehen muss:

Bitte schick mir die Console Logs von:
1. ✅ Extension öffnen (erste Logs)
2. ✅ Preference hinzufügen (🔵 Logs)
3. ✅ Extension schließen & öffnen (zweite Logs)

Dann kann ich sehen, wo genau das Problem ist!
