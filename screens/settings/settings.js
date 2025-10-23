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
    onPrivacyStatement = null,
    onTerms = null,
    onImprint = null,
    onContact = null,
    onWebsite = null,
    onInstagram = null,
    onLinkedIn = null,
    onReddit = null
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
    onClose: onClose || (() => console.log('Settings closed'))
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
    onClick: onHowToGuide || (() => console.log('How-to Guide clicked'))
  });
  generalSection.appendChild(howToGuide.element);

  const faqs = createActionButton({
    label: 'FAQs',
    variant: 'external',
    onClick: onFAQs || (() => console.log('FAQs clicked'))
  });
  generalSection.appendChild(faqs.element);

  const generalDivider = createDivider();
  generalSection.appendChild(generalDivider.element);

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
    onClick: onBackupData || (() => console.log('Backup data clicked'))
  });
  dataCenterSection.appendChild(backupData.element);

  const updateData = createActionButton({
    label: 'Update your data',
    variant: 'cta',
    ctaLabel: 'Import',
    onClick: onUpdateData || (() => console.log('Update data clicked'))
  });
  dataCenterSection.appendChild(updateData.element);

  const dataCenterDivider = createDivider();
  dataCenterSection.appendChild(dataCenterDivider.element);

  // Legal Section (no header)
  const legalSection = document.createElement('div');
  legalSection.className = 'settings__section';

  const privacyStatement = createActionButton({
    label: 'Privacy Statement',
    variant: 'external',
    onClick: onPrivacyStatement || (() => console.log('Privacy Statement clicked'))
  });
  legalSection.appendChild(privacyStatement.element);

  const terms = createActionButton({
    label: 'Terms & Conditions',
    variant: 'external',
    onClick: onTerms || (() => console.log('Terms clicked'))
  });
  legalSection.appendChild(terms.element);

  const imprint = createActionButton({
    label: 'Imprint',
    variant: 'external',
    onClick: onImprint || (() => console.log('Imprint clicked'))
  });
  legalSection.appendChild(imprint.element);

  const contact = createActionButton({
    label: 'Contact & Support',
    variant: 'external',
    onClick: onContact || (() => console.log('Contact clicked'))
  });
  legalSection.appendChild(contact.element);

  const legalDivider = createDivider();
  legalSection.appendChild(legalDivider.element);

  // Assemble content
  contentWrapper.appendChild(generalSection);
  contentWrapper.appendChild(dataCenterSection);
  contentWrapper.appendChild(legalSection);

  // Create footer
  const footerWrapper = document.createElement('div');
  footerWrapper.className = 'settings__footer';
  const footer = createAppFooter({
    appName: 'Data Gems',
    version: 'v2.0.0',
    social: {
      website: onWebsite || (() => console.log('Website clicked')),
      instagram: onInstagram || (() => console.log('Instagram clicked')),
      linkedin: onLinkedIn || (() => console.log('LinkedIn clicked')),
      reddit: onReddit || (() => console.log('Reddit clicked'))
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
