/**
 * App Footer Component
 * Footer with app name, version and social media links
 * Requires: icons.js, app-footer.css
 */

function createAppFooter(options = {}) {
  const {
    appName = 'Data Gems',
    version = 'v2.0.0',
    social = {
      website: null,
      instagram: null,
      linkedin: null,
      reddit: null
    }
  } = options;

  // Create footer container
  const footer = document.createElement('div');
  footer.className = 'app-footer';

  // Create version section
  const versionContainer = document.createElement('div');
  versionContainer.className = 'app-footer__version';

  const appNameSpan = document.createElement('span');
  appNameSpan.className = 'app-footer__app-name';
  appNameSpan.textContent = appName;

  const versionSpan = document.createElement('span');
  versionSpan.className = 'app-footer__version-number';
  versionSpan.textContent = version;

  versionContainer.appendChild(appNameSpan);
  versionContainer.appendChild(versionSpan);

  // Create social links section
  const socialContainer = document.createElement('div');
  socialContainer.className = 'app-footer__social';

  const socialIcons = [
    { name: 'website', onClick: social.website },
    { name: 'instagram', onClick: social.instagram },
    { name: 'linkedin', onClick: social.linkedin },
    { name: 'reddit', onClick: social.reddit }
  ];

  socialIcons.forEach(({ name, onClick }) => {
    const link = document.createElement('a');
    link.className = 'app-footer__social-link';
    link.setAttribute('aria-label', name.charAt(0).toUpperCase() + name.slice(1));
    link.innerHTML = getIcon(name);

    if (onClick) {
      link.style.cursor = 'pointer';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        onClick();
      });
    }

    socialContainer.appendChild(link);
  });

  // Assemble footer
  footer.appendChild(versionContainer);
  footer.appendChild(socialContainer);

  // Public API
  return {
    element: footer,

    setVersion(newVersion) {
      versionSpan.textContent = newVersion;
    },

    setAppName(newAppName) {
      appNameSpan.textContent = newAppName;
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createAppFooter };
}
