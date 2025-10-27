---
description: Evaluiere Design System Compliance der Browser Extension
argument-hint: [optional: pfad]
---

# Design System Compliance Check

Führe eine umfassende Design System Compliance Prüfung für die Browser Extension durch.

## Anleitung

1. **Design System erkunden**
   - Nutze einen Explore Agent (thoroughness: "medium") um das Design System in `design-system/` zu verstehen
   - Identifiziere alle verfügbaren:
     - Design Tokens (Colors, Spacing, Border-Radius, Typography, Shadows)
     - Komponenten
     - Patterns und Best Practices

2. **Browser Extension erkunden**
   - Nutze einen Explore Agent (thoroughness: "medium") um die Extension zu analysieren:
     - `components/` - Alle UI-Komponenten
     - `screens/` - Alle Screens (home, profile, settings, etc.)
     - `popup.html` - Ladereihenfolge und Struktur
   - Dokumentiere welche Komponenten geladen und verwendet werden

3. **Detaillierte Code-Analyse**
   - Lies relevante CSS-Dateien von Komponenten und Screens
   - Prüfe die tatsächliche Implementierung gegen Design System Standards

4. **Token Compliance Checks**

   Prüfe systematisch die Verwendung von Design Tokens:

   **Colors:**
   - Werden `var(--color-*)` Tokens verwendet?
   - Gibt es hardcoded Hex/RGB Werte?

   **Spacing:**
   - Werden `var(--spacing-*)` Tokens für padding, margin, gap verwendet?
   - Gibt es hardcoded px-Werte für Abstände?

   **Border-Radius:**
   - Werden `var(--radius-*)` Tokens verwendet?
   - Gibt es hardcoded border-radius Werte?

   **Typography:**
   - Werden `.text-style-*` Klassen verwendet?
   - Wird `font-family` redundant definiert?
   - Gibt es hardcoded font-size oder font-weight Werte?

   **Shadows:**
   - Werden `var(--shadow-*)` Tokens verwendet?
   - Gibt es hardcoded box-shadow Werte?

   **Icons:**
   - Werden Icon-Größen konsistent verwendet?
   - Gibt es hardcoded width/height für Icons?

5. **Komponenten-Check**
   - Welche Design System Komponenten werden verwendet?
   - Fehlen Komponenten die existieren sollten?
   - Werden Komponenten korrekt eingesetzt?

6. **Reverse Check: Design System Gaps**

   Identifiziere was in der Extension existiert, aber im Design System fehlt:

   **Komponenten-Gaps:**
   - Welche Komponenten in `components/` sind nicht im Design System dokumentiert?
   - Welche Varianten existieren in der Praxis, die nicht im Design System definiert sind?

   **Pattern-Gaps:**
   - Welche wiederkehrenden UI-Patterns werden verwendet, die standardisiert werden sollten?
   - Gibt es "informelle" Conventions (z.B. konsistent genutzte Abstände, die noch nicht als Token definiert sind)?

   **Token-Gaps:**
   - Werden neue Farben/Abstände/etc. verwendet, die als Design Tokens formalisiert werden sollten?
   - Gibt es mehrfach verwendete Werte, die Token-Kandidaten wären?

   **Screen-Patterns:**
   - Welche Layout-Patterns in `screens/` könnten als wiederverwendbare Komponenten extrahiert werden?

7. **Report erstellen**

   Erstelle einen strukturierten Report mit folgenden Abschnitten:

   ### ✅ Positive Befunde
   - Was funktioniert gut?
   - Welche Bereiche zeigen gute Design System Compliance?

   ### ⚠️ Identifizierte Probleme

   Für jedes Problem:
   - **Problem-Titel**: Klare Beschreibung
   - **Kontext**: Welche Tokens sind verfügbar?
   - **Beispiele**: Konkrete Codezeilen mit Datei:Zeilen-Referenzen
   - **Impact**: Warum ist das ein Problem?
   - **Empfohlene Lösung**: Wie sollte es aussehen?

   Beispiel-Format:
   ```
   Problem 1: Inkonsistente Border-Radius Nutzung

   Border-Radius Tokens vorhanden:
   --radius-xs: 4px
   --radius-sm: 8px
   --radius-md: 12px

   Aber hardcoded verwendet:

   components/button/button.css:12
   border-radius: 8px; /* ❌ Sollte sein: var(--radius-sm) */

   Impact: Inkonsistenz, schwieriger zu warten
   ```

   ### 📊 Zusammenfassung nach Kategorie

   Tabelle mit:
   | Design System Element | Nutzung | Bewertung |
   |----------------------|---------|-----------|
   | Komponenten          | X/Y     | ✅/⚠️/❌   |
   | Farben               | %       | ✅/⚠️/❌   |
   | ...                  | ...     | ...       |

   ### 🎯 Empfehlungen (Priorisiert)

   **Hohe Priorität:**
   1. Problem + Aufwand-Schätzung

   **Mittlere Priorität:**
   2. Problem + Aufwand-Schätzung

   **Niedrige Priorität:**
   3. Problem + Aufwand-Schätzung

   ### 🔄 Design System Gaps (Reverse Check)

   Was fehlt im Design System, das in der Extension existiert?

   **🧩 Fehlende Komponenten**
   - Liste von Komponenten in der Extension, die nicht im Design System dokumentiert sind
   - Beispiele mit Dateipfaden und Verwendungskontext
   - Empfehlung: Sollte ins Design System aufgenommen werden? Warum/Warum nicht?

   **🎨 Potenzielle neue Tokens**
   - Hardcoded Werte, die mehrfach verwendet werden und Token-Kandidaten wären
   - Format: Wert → Vorgeschlagener Token-Name → Verwendungsstellen
   - Beispiel:
     ```
     Farbe: #E8F4F8 (3x verwendet)
     → Vorschlag: --color-info-subtle
     → Vorkommen: components/info-banner/info-banner.css:15, screens/settings/settings.css:42
     ```

   **📐 Wiederkehrende Patterns**
   - UI-Patterns, die standardisiert werden sollten
   - Layout-Strukturen, die als Komponenten extrahiert werden könnten
   - Beispiele mit Kontext und Wiederverwendungspotenzial

   **💡 Empfehlungen für Design System Evolution**
   - Priorisierte Liste: Was sollte als nächstes ins Design System aufgenommen werden?
   - Begründung: Wiederverwendung, Konsistenz, Wartbarkeit

   ### 📈 Gesamtbewertung

   **Design System Compliance: X/100**

   Breakdown:
   - ✅ Komponenten: X% - Bewertung
   - ✅ Farben: X% - Bewertung
   - ⚠️ Spacing: X% - Bewertung
   - ❌ Border-Radius: X% - Bewertung
   - ⚠️ Typography: X% - Bewertung

   **Design System Vollständigkeit: X/100**

   Wie vollständig deckt das Design System die Extension ab?
   - Dokumentierte Komponenten: X/Y (X%)
   - Fehlende Komponenten: Y
   - Potenzielle neue Tokens: Z
   - Standardisierbare Patterns: N

   **Fazit**: Zusammenfassende Bewertung, Compliance-Status und Empfehlungen für die Design System Evolution

## Output-Format

- Verwende Emojis für visuelle Struktur (✅ ⚠️ ❌ 📊 🎯 📈 🔄 🧩 🎨 📐 💡)
- Nutze Datei:Zeilen-Referenzen für alle Code-Beispiele
- Sei spezifisch und konstruktiv
- Priorisiere nach Impact und Aufwand
- Der Report enthält jetzt zwei Perspektiven:
  1. **Compliance Check**: Hält sich die Extension an das Design System?
  2. **Reverse Check**: Was fehlt im Design System, das in der Extension existiert?

## Hinweis

Falls ein spezifischer Pfad als Parameter übergeben wird (z.B. `/design-check components/button`), fokussiere die Analyse nur auf diesen Bereich statt die gesamte Extension zu prüfen.
