# Tooltip Element

Eine wiederverwendbare Tooltip-Komponente mit mehreren Positionierungsoptionen.

## Features

- 6 verschiedene Positionierungen: top, top-right, top-left, bottom, left, right
- Automatisches Hover-Verhalten
- Konsistente Farben (Primary Button Stil: `--color-primary-90` / `--color-secondary-10`)
- Fade-in/Fade-out Animation
- Arrow Pointer für bessere Orientierung

## Verwendung

### HTML Markup (empfohlen)

```html
<div class="tooltip-container">
  <div class="trigger-element">
    <!-- Ihr Trigger-Element (Icon, Button, etc.) -->
  </div>
  <div class="tooltip tooltip--top-right">Integrated via Google</div>
</div>
```

### JavaScript Factory Function

```javascript
// Tooltip an ein Element anhängen
const icon = document.querySelector('.info-icon');
const tooltip = createTooltip(icon, {
  text: 'Integrated via Google',
  position: 'top-right'
});

// Text aktualisieren
tooltip.setText('New tooltip text');

// Position ändern
tooltip.setPosition('bottom');

// Manuell ein-/ausblenden
tooltip.show();
tooltip.hide();
```

### Data Attribute (Auto-Init)

```html
<div data-tooltip="Integrated via Google" data-tooltip-position="top-right">
  <!-- Ihr Trigger-Element -->
</div>

<script>
  // Alle Tooltips initialisieren
  initTooltips();
</script>
```

## Positionierungen

- `tooltip--top` - Über dem Element (zentriert)
- `tooltip--top-right` - Über dem Element (rechts ausgerichtet)
- `tooltip--top-left` - Über dem Element (links ausgerichtet)
- `tooltip--bottom` - Unter dem Element (zentriert)
- `tooltip--left` - Links vom Element
- `tooltip--right` - Rechts vom Element

## Beispiel: Data Card Integration

```javascript
// In data-card.js
const tooltipContainer = document.createElement('div');
tooltipContainer.className = 'tooltip-container';

const infoIcon = document.createElement('div');
infoIcon.className = 'data-card__source-icon';
infoIcon.innerHTML = ICONS.info;

const tooltip = document.createElement('div');
tooltip.className = 'tooltip tooltip--top-right';
tooltip.textContent = 'Integrated via Google';

tooltipContainer.appendChild(infoIcon);
tooltipContainer.appendChild(tooltip);
```

## CSS Anpassungen

Die Tooltip-Farben verwenden das Primary Button Farbschema:
- Background: `var(--color-primary-90)` - #0a7096 (dunkelblau)
- Text: `var(--color-secondary-10)` - #fefbf6 (warm beige/cream)

## Demo

Öffne `tooltip.html` im Browser, um alle Positionierungen und Verwendungsbeispiele zu sehen.
