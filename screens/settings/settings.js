/**
 * Settings Screen
 * Complete settings screen with sections for general, data center, legal info, and footer
 * Requires: header.js, action-button.js, divider.js, app-footer.js
 */

function createSettings(options = {}) {
  const {
    onClose = null,
    onHowToGuide = null,
    onFAQs = null,
    onBackupData = null,
    onUpdateData = null,
    onClearData = null,
    onThirdPartyData = null,
    onPrivacyStatement = null,
    onTerms = null,
    onImprint = null,
    onContact = null,
    onWebsite = null,
    onInstagram = null,
    onLinkedIn = null,
    onReddit = null,
    autoInjectEnabled = false,
    onAutoInjectToggle = null,
    autoBackupEnabled = false,
    onAutoBackupToggle = null,
    autoCategorizeEnabled = true,
    onAutoCategorizeToggle = null,
    onBulkAutoCategorize = null,
    onMigrateSubCategories = null,  // NEW: SubCategory migration
    onFindDuplicates = null,  // NEW: Find & merge duplicates
    isBetaUser = false,
    onJoinBeta = null,
    onRevokeBeta = null
  } = options;

  // Create main container
  const screenElement = document.createElement('div');
  screenElement.className = 'settings';

  // Create header
  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'settings__header';
  const header = createHeader({
    variant: 'simple',
    title: 'Settings',
    onClose: onClose || (() => {})
  });
  headerWrapper.appendChild(header.element);

  // Create scrollable content container
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'settings__content';

  // Beta Community Section (always show, but with different button) - RIGHT UNDER HEADER
  const betaCommunitySection = document.createElement('div');
  betaCommunitySection.className = 'settings__section settings__section--beta-teaser';

  if (!isBetaUser) {
    // Not a beta user - show Join button with CTA variant
    const joinBeta = createActionButton({
      label: 'Join Beta Community',
      caption: 'Get exclusive updates and lifetime premium access',
      variant: 'cta',
      ctaLabel: 'Join',
      onClick: () => {
        if (onJoinBeta) {
          onJoinBeta();
        }
      }
    });
    betaCommunitySection.appendChild(joinBeta.element);
  } else {
    // Is a beta user - show Revoke button with secondary variant
    const revokeBeta = createActionButton({
      label: 'Beta Community',
      caption: 'You are a member of the beta community',
      variant: 'secondary',
      ctaLabel: 'Revoke',
      onClick: () => {
        if (onRevokeBeta) {
          onRevokeBeta();
        }
      }
    });
    betaCommunitySection.appendChild(revokeBeta.element);
  }

  // Configuration Section
  const configurationSection = document.createElement('div');
  configurationSection.className = 'settings__section';

  const configurationHeader = createHeader({
    variant: 'compact-plain',
    title: 'Configuration'
  });
  configurationHeader.element.classList.add('settings__section-header');
  configurationSection.appendChild(configurationHeader.element);

  // Auto-inject toggle as action button with toggle variant
  const autoInject = createActionButton({
    label: 'Auto-inject profile',
    caption: 'Automatically inject your profile when opening a new chat in supported AI platforms',
    variant: 'toggle',
    toggleActive: autoInjectEnabled,
    onToggleChange: (isActive) => {
      if (onAutoInjectToggle) {
        onAutoInjectToggle(isActive);
      }
    }
  });
  configurationSection.appendChild(autoInject.element);

  // Auto-categorization toggle
  const autoCategorize = createActionButton({
    label: 'Auto-categorization',
    caption: 'Automatically suggest categories for new preferences using on-device AI',
    variant: 'toggle',
    toggleActive: autoCategorizeEnabled,
    onToggleChange: (isActive) => {
      if (onAutoCategorizeToggle) {
        onAutoCategorizeToggle(isActive);
      }
    }
  });
  configurationSection.appendChild(autoCategorize.element);

  const configurationDivider = createDivider();
  configurationSection.appendChild(configurationDivider.element);

  // Data Center Section
  const dataCenterSection = document.createElement('div');
  dataCenterSection.className = 'settings__section';

  const dataCenterHeader = createHeader({
    variant: 'compact-plain',
    title: 'Data Center'
  });
  dataCenterHeader.element.classList.add('settings__section-header');
  dataCenterSection.appendChild(dataCenterHeader.element);

  const backupData = createActionButton({
    label: 'Backup your data',
    variant: 'cta',
    ctaLabel: 'Export',
    onClick: () => {
      if (onBackupData) {
        onBackupData();
      }
    }
  });
  dataCenterSection.appendChild(backupData.element);

  // Auto-backup toggle as action button with toggle variant
  const autoBackup = createActionButton({
    label: '',
    caption: 'Automatically export backup after 50 entries and every 50 entries thereafter',
    variant: 'toggle',
    toggleActive: autoBackupEnabled,
    onToggleChange: (isActive) => {
      if (onAutoBackupToggle) {
        onAutoBackupToggle(isActive);
      }
    }
  });
  dataCenterSection.appendChild(autoBackup.element);

  const updateData = createActionButton({
    label: 'Update your data',
    variant: 'cta',
    ctaLabel: 'Import',
    onClick: onUpdateData || (() => {})
  });
  dataCenterSection.appendChild(updateData.element);

  const clearData = createActionButton({
    label: 'Clear all data',
    variant: 'cta',
    ctaLabel: 'Delete',
    onClick: onClearData || (() => {})
  });
  dataCenterSection.appendChild(clearData.element);

  const thirdPartyData = createActionButton({
    label: 'Third Party Data',
    variant: 'navigation',
    onClick: onThirdPartyData || (() => {})
  });
  dataCenterSection.appendChild(thirdPartyData.element);

  const bulkAutoCategorize = createActionButton({
    label: 'Auto-categorize all cards',
    caption: 'Apply AI category suggestions to all existing cards without collections',
    variant: 'cta',
    ctaLabel: 'Run',
    onClick: () => {
      if (onBulkAutoCategorize) {
        onBulkAutoCategorize();
      }
    }
  });
  dataCenterSection.appendChild(bulkAutoCategorize.element);

  // NEW: SubCategory Migration Button
  const migrateSubCategories = createActionButton({
    label: 'Migrate to SubCategories (Beta)',
    caption: 'Organize Fashion gems into granular subcategories (shoes, tshirts, etc.) for better AI context matching',
    variant: 'cta',
    ctaLabel: 'Migrate',
    onClick: () => {
      if (onMigrateSubCategories) {
        onMigrateSubCategories();
      }
    }
  });
  dataCenterSection.appendChild(migrateSubCategories.element);

  // Find & Merge Duplicates Button
  const findDuplicates = createActionButton({
    label: 'Find & Merge Duplicates',
    caption: 'Scan all gems to find and consolidate similar entries (runs in background)',
    variant: 'cta',
    ctaLabel: 'Scan',
    onClick: () => {
      console.log('[Settings] Find Duplicates button clicked!');
      console.log('[Settings] onFindDuplicates exists?', typeof onFindDuplicates);
      if (onFindDuplicates) {
        console.log('[Settings] Calling onFindDuplicates...');
        onFindDuplicates();
      } else {
        console.error('[Settings] onFindDuplicates is not defined!');
      }
    }
  });
  dataCenterSection.appendChild(findDuplicates.element);

  const dataCenterDivider = createDivider();
  dataCenterSection.appendChild(dataCenterDivider.element);

  // Legal Section (no header)
  const legalSection = document.createElement('div');
  legalSection.className = 'settings__section';

  const howToGuide = createActionButton({
    label: 'How-to Guide',
    variant: 'external',
    onClick: onHowToGuide || (() => {})
  });
  legalSection.appendChild(howToGuide.element);

  const faqs = createActionButton({
    label: 'FAQs',
    variant: 'external',
    onClick: onFAQs || (() => {})
  });
  legalSection.appendChild(faqs.element);

  const privacyStatement = createActionButton({
    label: 'Privacy Statement',
    variant: 'external',
    onClick: onPrivacyStatement || (() => {})
  });
  legalSection.appendChild(privacyStatement.element);

  const terms = createActionButton({
    label: 'Terms & Conditions',
    variant: 'external',
    onClick: onTerms || (() => {})
  });
  legalSection.appendChild(terms.element);

  const imprint = createActionButton({
    label: 'Imprint',
    variant: 'external',
    onClick: onImprint || (() => {})
  });
  legalSection.appendChild(imprint.element);

  const contact = createActionButton({
    label: 'Contact & Support',
    variant: 'external',
    onClick: onContact || (() => {})
  });
  legalSection.appendChild(contact.element);

  const legalDivider = createDivider();
  legalSection.appendChild(legalDivider.element);

  // Assemble content
  contentWrapper.appendChild(betaCommunitySection);
  contentWrapper.appendChild(configurationSection);
  contentWrapper.appendChild(dataCenterSection);
  contentWrapper.appendChild(legalSection);

  // Create footer
  const footerWrapper = document.createElement('div');
  footerWrapper.className = 'settings__footer';
  const footer = createAppFooter({
    appName: 'Data Gems',
    version: 'v2.0.0',
    social: {
      website: onWebsite || (() => {}),
      instagram: onInstagram || (() => {}),
      linkedin: onLinkedIn || (() => {}),
      reddit: onReddit || (() => {})
    }
  });
  footerWrapper.appendChild(footer.element);

  // Assemble screen
  screenElement.appendChild(headerWrapper);
  screenElement.appendChild(contentWrapper);
  screenElement.appendChild(footerWrapper);

  // Public API
  return {
    element: screenElement
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createSettings };
}
