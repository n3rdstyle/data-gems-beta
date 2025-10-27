# Claude Code Instructions for Data Gems Beta

## Git und Deployment

- **GitHub Push Policy**: Führe `git push` **NUR** aus, wenn ich explizit darauf hinweise
- Git commits sind erlaubt und sollten nach Fertigstellung von Features erfolgen
- Verwende aussagekräftige Commit-Nachrichten im konventionellen Format

## Projekt-Struktur

### Komponenten
- Alle Komponenten befinden sich in `components/[component-name]/`
- Jede Komponente hat ihre eigene HTML, CSS und JS Datei
- JavaScript-Module verwenden ES6 Module Syntax

### Screens
- Screens befinden sich in `screens/[screen-name]/`
- Folgen derselben Struktur wie Komponenten (HTML, CSS, JS)

## Design System First

**WICHTIG**: Vor der Implementierung neuer Features:
1. Prüfe immer zuerst, ob Inhalte aus dem Designsystem verwendet werden können:
   - **Foundations**: Farben, Typografie, Spacing, Icons (siehe `styles/variables.css`)
   - **Elemente**: Buttons, Input-Felder, etc. (in `components/`)
   - **Komponenten**: Cards, Headers, Modals, etc. (in `components/`)
2. Verwende existierende Komponenten und erweitere sie, statt neue zu erstellen
3. Halte dich an die Design Tokens und Variablen
4. Bei Unsicherheit: Prüfe `/design-check` Slash Command oder vorhandene Komponenten

## Code-Style

### CSS
- Verwende CSS Custom Properties für Theming (siehe `styles/variables.css`)
- Halte dich an die bestehende Benennungskonvention für Klassen
- Nutze Stylelint-Konfiguration für Linting

### JavaScript
- Verwende moderne ES6+ Syntax
- Implementiere Web Components wo sinnvoll
- State Management über HTML Attribute und Custom Events

## Testing

- Teste Änderungen im Browser vor dem Commit
- Überprüfe die Manifest-Datei bei strukturellen Änderungen
- Validiere CSS mit Stylelint

## Browser Extension Spezifika

- Dies ist eine Browser Extension - beachte Chrome Extension APIs
- Manifest v3 wird verwendet
- Beachte Content Security Policy Einschränkungen
