#!/usr/bin/env node

/**
 * CSS Bundle Builder
 * Combines all CSS files into a single bundle for faster popup loading
 */

const fs = require('fs');
const path = require('path');

// CSS files in load order (from popup.html)
const cssFiles = [
  // Design System Foundations
  'design-system/colors/colors.css',
  'design-system/typography/typography.css',
  'design-system/spacing/spacing.css',
  'design-system/border-radius/border-radius.css',
  'design-system/shadows/shadows.css',

  // Elements
  'elements/tooltip/tooltip.css',
  'components/overlay/overlay.css',
  'components/input-field/input-field.css',
  'components/divider/divider.css',
  'components/toggle/toggle.css',
  'components/dropdown/dropdown.css',

  // Components
  'components/data-card/data-card.css',
  'components/data-list/data-list.css',
  'components/tag/tag.css',
  'components/tag-list/tag-list.css',
  'components/search/search.css',
  'components/button-primary/button-primary.css',
  'components/button-secondary/button-secondary.css',
  'components/button-tertiary/button-tertiary.css',
  'components/headline/headline.css',
  'components/data-search/data-search.css',
  'components/content-preferences/content-preferences.css',
  'components/top-menu/top-menu.css',
  'components/profile-teaser/profile-teaser.css',
  'components/header/header.css',
  'components/calibration/calibration.css',
  'components/preference-options/preference-options.css',
  'components/text-edit-field/text-edit-field.css',
  'components/collection-edit-field/collection-edit-field.css',
  'components/data-editor-modal/data-editor-modal.css',
  'components/tag-add-field/tag-add-field.css',
  'components/tag-add-modal/tag-add-modal.css',
  'components/collection-filter-modal/collection-filter-modal.css',
  'components/search-modal/search-modal.css',
  'components/random-question-modal/random-question-modal.css',
  'components/quick-input-bar/quick-input-bar.css',
  'components/collapsible-section/collapsible-section.css',
  'components/action-button/action-button.css',
  'components/messages-modal/messages-modal.css',
  'components/backup-reminder-modal/backup-reminder-modal.css',
  'components/beta-checkin-modal/beta-checkin-modal.css',
  'components/duplicate-consolidation-modal/duplicate-consolidation-modal.css',
  'components/merge-fab/merge-fab.css',
  'components/app-footer/app-footer.css',
  'components/import-progress-bar/import-progress-bar.css',

  // Screens
  'screens/home/home.css',
  'screens/profile/profile.css',
  'screens/settings/settings.css'
];

const baseDir = __dirname;
const outputFile = path.join(baseDir, 'popup.bundle.css');

let bundledCss = '/* Data Gems - Bundled CSS */\n';
bundledCss += `/* Generated: ${new Date().toISOString()} */\n\n`;

console.log('📦 Building CSS bundle...');

for (const file of cssFiles) {
  const filePath = path.join(baseDir, file);

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    bundledCss += `\n/* ========================================\n`;
    bundledCss += ` * ${file}\n`;
    bundledCss += ` * ======================================== */\n\n`;
    bundledCss += content;
    bundledCss += '\n';
    console.log(`✓ ${file}`);
  } catch (error) {
    console.error(`✗ Failed to read ${file}:`, error.message);
    process.exit(1);
  }
}

// Write bundle
fs.writeFileSync(outputFile, bundledCss, 'utf8');

const stats = fs.statSync(outputFile);
const sizeMB = (stats.size / 1024).toFixed(2);

console.log(`\n✅ Bundle created: popup.bundle.css (${sizeMB} KB)`);
console.log(`   Combined ${cssFiles.length} CSS files`);
