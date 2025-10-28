# Profile Injection Feature

## Übersicht

Das Profile Injection Feature ermöglicht es Benutzern, ihr Data Gems Profil (im HSP Protocol v0.1 Format) mit einem Klick in gängige KI-Chatbots zu injizieren.

## Unterstützte Plattformen

- ✅ **ChatGPT** (chat.openai.com, chatgpt.com)
- ✅ **Claude** (claude.ai)
- ✅ **Gemini** (gemini.google.com)
- ✅ **Perplexity** (perplexity.ai)
- ✅ **Grok** (x.com, twitter.com)

## Funktionsweise

### 1. Automatische Erkennung
- Das Content Script läuft automatisch auf allen unterstützten Plattformen
- Erkennt die Plattform und findet das Prompt-Eingabefeld
- Zeigt den "Inject my profile" Button nur bei **neuen Chats** (leere Eingabefelder)

### 2. Button Position
- Erscheint rechts über der Prompt-Bar
- Gradient-Style (Sundown) im Data Gems Design
- Verschwindet automatisch nach erfolgreicher Injection

### 3. Profil-Format
Das injizierte Profil nutzt das **HSP Protocol v0.1** Format:

```json
{
  "hsp": "0.1",
  "type": "profile",
  "content": {
    "basic": {
      "identity": {
        "name": { "value": "...", "assurance": "self_declared", ... },
        "email": { "value": "...", ... },
        ...
      }
    },
    "preferences": {
      "items": [
        {
          "id": "pref_001",
          "value": "I prefer minimalist design",
          "state": "favorited",
          ...
        }
      ]
    }
  },
  "collections": [...],
}
```

## Datenschutz & Filterung

### Was wird NICHT injiziert:
- ❌ Felder mit `state: "hidden"`
- ❌ Leere Felder (null, "", [])
- ❌ Avatar-Bild (avatarImage)

### Was wird injiziert:
- ✅ Alle sichtbaren Identity-Felder (Name, Email, Age, Gender, Location, Description, Languages)
- ✅ Alle sichtbaren Preferences (nicht hidden)
- ✅ Collections-Metadaten
- ✅ HSP Protocol Metadaten (Assurance, Reliability, Timestamps)

## Installation & Testing

### 1. Extension neu laden
```
1. Öffne chrome://extensions/
2. Finde "Data Gems"
3. Klicke auf "Reload" 🔄
```

### 2. Profil erstellen
```
1. Öffne Data Gems Extension
2. Gehe zu Profile
3. Fülle mindestens Name und eine Preference aus
4. Speichern
```

### 3. Testen auf KI-Plattform
```
1. Öffne eine unterstützte Plattform (z.B. ChatGPT)
2. Starte einen neuen Chat
3. Der "Inject my profile" Button erscheint über der Eingabe
4. Klicke auf den Button
5. Dein Profil wird im JSON-Format eingefügt
6. Button verschwindet automatisch
```

## Debugging

### Console Logs checken
Öffne die Browser DevTools Console auf der KI-Plattform:

```javascript
// Expected logs:
[Data Gems] Profile injector content script loaded
[Data Gems] Platform detected: ChatGPT
[Data Gems] Profile loaded successfully
[Data Gems] Prompt element found
[Data Gems] Profile injected successfully
```

### Button erscheint nicht?

**Mögliche Ursachen:**
1. **Kein Profil vorhanden**: Extension öffnen und Profil anlegen
2. **Chat nicht leer**: Eingabefeld muss leer sein (neuer Chat)
3. **Plattform nicht unterstützt**: Siehe Liste oben
4. **Extension nicht geladen**: Extension neu laden

### Manuell Storage checken
```javascript
chrome.storage.local.get(['hspProfile'], (result) => {
  console.log('Has Profile:', !!result.hspProfile);
  console.log('Preferences:', result.hspProfile?.content?.preferences?.items?.length);
});
```

## Architektur

### Dateien
```
/content-scripts/
  ├── profile-injector.js    # Haupt-Content-Script
  └── profile-injector.css   # Button-Styling

/utils/
  └── profile-formatter.js   # HSP-Profil-Formatierung

manifest.json                # Content Scripts registriert
```

### Content Script Flow
```
1. detectPlatform()           → Erkennt ChatGPT/Claude/etc.
2. findPromptElement()        → Findet Eingabefeld
3. loadProfile()              → Lädt HSP-Profil aus Storage
4. isNewChat()                → Prüft ob Eingabe leer
5. showInjectionButton()      → Zeigt Button
6. handleInjection()          → Formatiert & injiziert Profil
7. hideInjectionButton()      → Entfernt Button
```

### Platform Detection
Jede Plattform hat spezifische CSS-Selektoren:

```javascript
PLATFORMS = {
  CHATGPT: {
    promptInput: '#prompt-textarea, textarea[data-id]',
    inputContainer: '#composer-background'
  },
  CLAUDE: {
    promptInput: 'div[contenteditable="true"][data-placeholder*="message"]',
    inputContainer: 'fieldset'
  },
  ...
}
```

## Zukünftige Erweiterungen

### Geplante Features:
- [ ] Optional: Nur bestimmte Felder injizieren (z.B. nur Name + Preferences)
- [ ] Keyboard Shortcut (z.B. `Ctrl+Shift+I`)
- [ ] Injection-History (letzte 5 Injections tracken)
- [ ] Custom Injection-Templates
- [ ] Multi-Language Support für Injection-Text

### Weitere Plattformen:
- [ ] Microsoft Copilot
- [ ] Meta AI
- [ ] Mistral Chat
- [ ] HuggingChat

## Technische Details

### HSP Protocol v0.1
Das Feature nutzt die vollständige HSP-Struktur:
- **Assurance Levels**: `self_declared`, `derived`, etc.
- **Reliability Levels**: `authoritative`, `high`, `medium`, `low`
- **Timestamps**: `created_at`, `updated_at`
- **State Management**: `default`, `hidden`, `favorited`

### Browser Kompatibilität
- ✅ Chrome/Chromium (Manifest V3)
- ✅ Edge (Manifest V3)
- ⚠️ Firefox (benötigt Manifest V2 Anpassungen)
- ⚠️ Safari (benötigt Safari Extension API)

## Support

Bei Problemen:
1. Console Logs prüfen
2. Extension neu laden
3. Storage löschen und neu testen: `chrome.storage.local.clear()`
4. GitHub Issue erstellen mit Console-Logs

---

**Version:** 1.0.0
**Datum:** 2025-10-27
**Status:** ✅ Implementiert & Bereit für Testing
