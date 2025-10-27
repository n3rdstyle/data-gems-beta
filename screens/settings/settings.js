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
    onAutoBackupToggle = null
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

  // General Section
  const generalSection = document.createElement('div');
  generalSection.className = 'settings__section';

  const generalHeader = createHeader({
    variant: 'compact-plain',
    title: 'General'
  });
  generalHeader.element.classList.add('settings__section-header');
  generalSection.appendChild(generalHeader.element);

  const howToGuide = createActionButton({
    label: 'How-to Guide',
    variant: 'external',
    onClick: onHowToGuide || (() => {})
  });
  generalSection.appendChild(howToGuide.element);

  const faqs = createActionButton({
    label: 'FAQs',
    variant: 'external',
    onClick: onFAQs || (() => {})
  });
  generalSection.appendChild(faqs.element);

  const generalDivider = createDivider();
  generalSection.appendChild(generalDivider.element);

  // Injection Settings Section
  const injectionSection = document.createElement('div');
  injectionSection.className = 'settings__section';

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
  injectionSection.appendChild(autoInject.element);

  const injectionDivider = createDivider();
  injectionSection.appendChild(injectionDivider.element);

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

  const dataCenterDivider = createDivider();
  dataCenterSection.appendChild(dataCenterDivider.element);

  // Legal Section (no header)
  const legalSection = document.createElement('div');
  legalSection.className = 'settings__section';

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
  contentWrapper.appendChild(generalSection);
  contentWrapper.appendChild(injectionSection);
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
