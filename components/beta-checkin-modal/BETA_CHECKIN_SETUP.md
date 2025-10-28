# Beta Check-In System - Setup Guide

## Übersicht

Das Beta Check-In System zeigt Usern **zeitversetzt** (nach 5 Minuten ODER 10+ Data Gems) ein Modal, um sich für das Beta-Programm zu registrieren.

## ✅ Was bereits implementiert ist

- **Beta Check-In Modal Komponente** (`beta-checkin-modal.js`)
- **Background Script mit Alarm System** (`background.js`)
- **Popup Integration** (`app.js` + `popup.html`)
- **Supabase Integration** (muss konfiguriert werden)
- **Lokale Beta ID Generierung**
- **Skip-Funktion mit Counter** (max. 3x skippable)

## 🔧 Setup-Schritte

### 1. Supabase Tabelle erstellen

#### In Supabase Dashboard:

1. **Gehe zu**: `Table Editor` → `New Table`

2. **Table Name**: `beta_users`

3. **Enable Row Level Security**: ✅ JA

4. **Columns** (zusätzlich zu automatischen `id` und `created_at`):
   - `beta_id` - `text` - NOT NULL
   - `email` - `text` - NOT NULL
   - `joined_at` - `timestamp with time zone` - Default: `now()`
   - `consent_given` - `boolean` - Default: `false`
   - `feedback_count` - `int4` - Default: `0` - NULLABLE
   - `last_active` - `timestamp with time zone` - NULLABLE

5. **SQL Editor** → Führe aus:

```sql
-- Unique Constraints
ALTER TABLE beta_users
ADD CONSTRAINT beta_users_beta_id_unique UNIQUE (beta_id);

ALTER TABLE beta_users
ADD CONSTRAINT beta_users_email_unique UNIQUE (email);

-- Indexes
CREATE INDEX idx_beta_users_beta_id ON beta_users(beta_id);
CREATE INDEX idx_beta_users_email ON beta_users(email);
```

#### Row Level Security Policies:

**Policy 1 - INSERT:**
1. Gehe zu `Authentication` → `Policies` → `beta_users`
2. `New Policy` → `Create a custom policy`
3. **Policy Name**: `Enable insert for all users`
4. **Policy Command**: `INSERT`
5. **USING expression**: `true`
6. **WITH CHECK expression**: `true`

**Policy 2 - DELETE:**
1. `New Policy` → `Create a custom policy`
2. **Policy Name**: `Enable delete for all users`
3. **Policy Command**: `DELETE`
4. **USING expression**: `true`

**Oder via SQL (empfohlen):**
```sql
-- Insert Policy
CREATE POLICY "Enable insert for all users"
ON beta_users FOR INSERT TO public WITH CHECK (true);

-- Delete Policy
CREATE POLICY "Enable delete for all users"
ON beta_users FOR DELETE TO public USING (true);
```

### 2. Supabase Credentials einfügen

1. **Gehe zu**: `Project Settings` → `API`

2. **Kopiere**:
   - **Project URL**: z.B. `https://abcdefg.supabase.co`
   - **anon public key**: langer String

3. **Öffne**: `background.js` (Zeile 198-200)

4. **Ersetze**:
```javascript
const SUPABASE_URL = 'https://deine-projekt-id.supabase.co';
const SUPABASE_ANON_KEY = 'dein_anon_key_hier';
```

### 3. Extension neu laden

1. Gehe zu `chrome://extensions/`
2. Klicke auf **Reload** bei Data Gems
3. Extension öffnen

## 📋 Wie es funktioniert

### Eintrags-basierte Anzeige

Das Modal wird gezeigt, wenn:
- ✅ 5+ Data Gems gespeichert wurden
- ✅ User hat noch nicht eingecheckt
- ✅ User hat nicht mehr als 2x geskippt

### User Flow

```
Installation
    ↓
[5 Gems gespeichert]
    ↓
Beta Check-In Modal erscheint (sofort beim 5. Eintrag)
    ↓
Option 1: Join → Email + Consent → Supabase
Option 2: Skip → Counter +1 (max. 3x)
    ↓
[10 Gems erreicht]
    ↓
Backup Reminder Modal erscheint
```

### Daten-Speicherung

**Lokal (chrome.storage.local)**:
```javascript
betaUser: {
  installDate: "2025-10-28T...",
  checkedIn: true/false,
  betaId: "beta_uuid",
  email: "user@example.com",
  skipped: true/false,
  skipCount: 0-3
}
```

**Supabase (beta_users Tabelle)**:
```javascript
{
  beta_id: "beta_uuid",
  email: "user@example.com",
  joined_at: "2025-10-28T...",
  consent_given: true
}
```

## 🧪 Testing

### Modal testen (ohne Warten):

1. Öffne `components/beta-checkin-modal/beta-checkin-modal.html` im Browser
2. Klicke auf "Show Beta Check-In Modal"

### Vollständigen Flow testen:

1. **Extension neu installieren**:
   - Gehe zu `chrome://extensions/`
   - Entferne Data Gems
   - Lade es neu hoch

2. **Storage zurücksetzen** (für Wiederholungen):
```javascript
// In der Chrome Console (Extension Popup)
chrome.storage.local.remove('betaUser');
```

3. **5 Einträge hinzufügen**:
   - Nach dem 5. Eintrag erscheint das Modal sofort!

## 📊 Beta User Daten abrufen

### In Supabase:

```sql
-- Alle Beta Users
SELECT * FROM beta_users ORDER BY joined_at DESC;

-- Anzahl Beta Users
SELECT COUNT(*) FROM beta_users;

-- Neue Registrierungen heute
SELECT * FROM beta_users
WHERE joined_at >= CURRENT_DATE;
```

## 🔒 Datenschutz-Konformität

- ✅ **Consent Checkbox**: User muss explizit zustimmen
- ✅ **Transparenz**: Klare Info was gespeichert wird
- ✅ **Lokal-First**: Daten bleiben lokal, nur Email wird übertragen
- ✅ **Skip Option**: Keine Pflicht zur Registrierung
- ✅ **RLS aktiviert**: Row Level Security in Supabase

## 🎨 Modal anpassen

### Texte ändern:

**Datei**: `components/beta-checkin-modal/beta-checkin-modal.js`

- **Zeile 52**: Info-Text
- **Zeile 58-63**: Benefits-Liste
- **Zeile 94**: Consent-Text

### Styling ändern:

**Datei**: `components/beta-checkin-modal/beta-checkin-modal.css`

- Farben, Spacing, etc. über CSS Custom Properties

## 🚀 Nächste Schritte

Nach Beta-Phase:
1. Lifetime Premium für Beta-User aktivieren
2. Beta-Badge in Extension anzeigen
3. Dankes-Email an Beta-User senden
4. Account-System mit Beta-ID Verknüpfung bauen

## 📝 Wichtig für Launch

- ❗ Supabase Credentials einfügen (sonst wird nichts gespeichert)
- ❗ Testing durchführen
- ❗ Datenschutzerklärung aktualisieren
- ❗ Optional: Newsletter-Tool integrieren (z.B. Mailchimp)

---

Bei Fragen oder Problemen → `background.js` Console logs checken!
