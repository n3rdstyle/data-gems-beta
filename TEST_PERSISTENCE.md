# Test: Data Persistence

## 🧪 Testanleitung

### 1. Extension neu laden
```
1. chrome://extensions/ öffnen
2. Data Gems Extension finden
3. Reload-Button klicken 🔄
```

### 2. Storage löschen (Fresh Start)
```
1. Extension öffnen
2. F12 drücken (DevTools öffnen)
3. In Console eingeben:
   chrome.storage.local.clear(() => console.log('Storage cleared'));
4. Extension schließen & neu öffnen
```

**Erwartung:** Leere Datenliste (keine Dummy-Daten!)

---

### 3. Neue Preference hinzufügen
```
1. "+ Add" Button klicken
2. Text eingeben: "I love minimalist design"
3. Optional: Collections hinzufügen (z.B. "Style")
4. "Save" klicken
```

**Erwartung:** Preference erscheint in der Liste

---

### 4. Test: Extension schließen & öffnen
```
1. Extension schließen
2. Extension wieder öffnen
```

**Erwartung:** ✅ "I love minimalist design" ist NOCH DA!

---

### 5. Test: Browser neu starten
```
1. Chrome komplett beenden
2. Chrome neu starten
3. Extension öffnen
```

**Erwartung:** ✅ "I love minimalist design" ist IMMER NOCH DA!

---

### 6. Test: Preference editieren
```
1. Auf Preference klicken
2. Text ändern zu: "I love minimalist & sustainable design"
3. State ändern zu: Favorited ⭐
4. "Save" klicken
5. Extension schließen & öffnen
```

**Erwartung:** ✅ Änderungen bleiben erhalten!

---

### 7. Test: Preference löschen
```
1. Auf Preference klicken
2. "Delete" Button klicken
3. Extension schließen & öffnen
```

**Erwartung:** ✅ Preference ist weg!

---

## 🔍 Debug: Storage inspizieren

In DevTools Console:
```javascript
chrome.storage.local.get(['hspProfile'], (result) => {
  console.log('=== HSP PROFILE ===');
  console.log(JSON.stringify(result.hspProfile, null, 2));
  console.log('Preferences:', result.hspProfile?.content?.preferences?.items);
});
```

**Expected Output:**
```json
{
  "hsp": "0.1",
  "content": {
    "preferences": {
      "items": [
        {
          "id": "pref_...",
          "value": "I love minimalist design",
          "state": "default",
          "collections": ["Style"],
          "created_at": "...",
          "updated_at": "..."
        }
      ]
    }
  }
}
```

---

## ✅ Success Criteria

- [ ] Leere Liste bei Fresh Install
- [ ] Neue Preference speichern funktioniert
- [ ] Daten bleiben nach Extension Close erhalten
- [ ] Daten bleiben nach Browser Restart erhalten
- [ ] Edit funktioniert & wird gespeichert
- [ ] Delete funktioniert & wird gespeichert
- [ ] Storage nutzt HSP v0.1 Format

---

## ❌ Known Issues (behoben)

- ~~Dummy-Daten (97 Einträge)~~ → FIXED
- ~~Daten verschwinden nach Close~~ → FIXED
- ~~Callbacks nicht connected~~ → FIXED

---

## 🚀 Next: Clear Data Button

Nach erfolgreichem Test bauen wir den "Clear All Data" Button in Settings ein.
