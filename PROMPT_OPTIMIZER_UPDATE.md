# Prompt Optimizer Update - Local Context Injection

## Änderungen vom XX.XX.2025

### Was wurde geändert?

Der Prompt Optimizer nutzt jetzt **lokale Verarbeitung** statt n8n Workflow:

#### Vorher (n8n):
```
User Prompt → n8n Webhook → AI Analysis → Optimized Prompt
              (Cloud, 10-20s, API Kosten)
```

#### Jetzt (Lokal):
```
User Prompt → Context Selector → Relevance Matching → Formatted Prompt
              (Lokal, 1-3s, kostenlos)
```

---

## Neue Funktionalität

### Format
```
"{original prompt}"

@{type} {data gem 1}
@{type} {data gem 2}
@{type} {data gem 3}
@{type} {data gem 4}
@{type} {data gem 5}
```

**Beispiel:**
```
"Write a professional email to my boss about the project status"

@work Project deadline: March 15th
@work Current progress: 80% complete
@work Team: 5 developers, 2 designers
@personal Preferred communication style: Direct and concise
@work Boss name: Sarah Johnson
```

---

## Neue Dateien

1. **`utils/context-selector.js`**
   - Wählt relevante Data Gems basierend auf Prompt
   - Unterstützt Gemini Nano AI für intelligente Auswahl
   - Fallback auf Keyword-Matching

2. **Änderungen in `content-scripts/prompt-optimizer.js`**
   - n8n Webhook Call auskommentiert (nicht gelöscht!)
   - Neue lokale Optimierung implementiert
   - Schnellere Response-Zeiten

3. **`manifest.json`**
   - `ai-helper.js` und `context-selector.js` zu Content Scripts hinzugefügt

---

## Relevanz-Auswahl

### Mit Gemini Nano (wenn verfügbar):
- AI bewertet jedes Data Gem auf Skala 0-10
- Nur Gems mit Score > 0 werden verwendet
- Top 5 relevanteste Gems werden ausgewählt

### Ohne Gemini Nano (Fallback):
- Keyword-Matching zwischen Prompt und Gems
- Bonus-Punkte für favorisierte Items
- Collection-Matching (z.B. "work" im Prompt → "Work" Collection)

---

## Vorteile

✅ **Schneller**: 1-3s statt 10-20s
✅ **Kostenlos**: Keine API-Kosten
✅ **Privat**: Alles bleibt lokal
✅ **Offline**: Funktioniert ohne Internet
✅ **Transparent**: User sieht direkt welcher Kontext hinzugefügt wird

---

## n8n Reaktivierung

Falls n8n wieder benötigt wird:

1. Öffne `content-scripts/prompt-optimizer.js`
2. Entferne den neuen Code (Zeile 272-288)
3. Entferne `/*` und `*/` um auskommentierten n8n Code (Zeile 293-434)
4. Aktiviere N8N_WEBHOOK_URL (Zeile 12)

---

## Testing

### Manueller Test:
1. Extension laden/reloaden
2. Zu ChatGPT/Claude/Gemini navigieren
3. Prompt eingeben: "Help me plan my workout"
4. "Optimize with Context" Button klicken
5. Prüfen ob Format korrekt ist:
   ```
   "Help me plan my workout"

   @training Exercise: Bench Press
   @training Sets: 3x10
   ...
   ```

### Console Logs prüfen:
```javascript
[Context Selector] Analyzing X data gems
[Context Selector] Selected Y relevant gems
[Data Gems] Optimized prompt: ...
```

---

## Bekannte Einschränkungen

- Maximal 5 Data Gems pro Prompt
- Gemini Nano muss in Chrome installiert sein (sonst Keyword-Fallback)
- Hidden Gems werden nicht berücksichtigt
- Collections werden als "type" verwendet

---

## Nächste Schritte (Optional)

1. **User Settings**: Toggle zwischen lokal/cloud
2. **Anzahl konfigurierbar**: User kann max Gems wählen (3, 5, 10)
3. **Manual Selection**: User kann Gems manuell auswählen
4. **Better Formatting**: Markdown-Support, Kategorien gruppieren
