/**
 * Action Button Component
 * Button for navigation, external links, and CTAs
 */

function createActionButton(options = {}) {
  const {
    label = '',
    caption = null, // Optional caption for two-line variant
    variant = 'navigation', // 'navigation', 'external', 'cta'
    ctaLabel = 'Action', // Label for CTA button
    href = null, // URL for navigation/external
    onClick = null,
    disabled = false
  } = options;

  // Create container
  const container = document.createElement('div');
  container.className = `action-button action-button--${variant}`;

  if (disabled) {
    container.classList.add('action-button--disabled');
  }

  // Create label (with or without caption)
  let labelElement;
  let captionElement;

  if (caption) {
    // Two-line variant with wrapper
    const labelWrapper = document.createElement('div');
    labelWrapper.className = 'action-button__label-wrapper';

    labelElement = document.createElement('div');
    labelElement.className = 'action-button__label';
    labelElement.textContent = label;

    captionElement = document.createElement('div');
    captionElement.className = 'action-button__caption';
    captionElement.textContent = caption;

    labelWrapper.appendChild(labelElement);
    labelWrapper.appendChild(captionElement);
    container.appendChild(labelWrapper);
  } else {
    // Single-line variant
    labelElement = document.createElement('div');
    labelElement.className = 'action-button__label';
    labelElement.textContent = label;
    container.appendChild(labelElement);
  }

  // Add variant-specific elements
  if (variant === 'navigation') {
    // Add chevron icon (rotated 270deg for right-pointing)
    const icon = document.createElement('div');
    icon.className = 'action-button__icon';
    icon.innerHTML = typeof getIcon !== 'undefined' ? getIcon('chevronDown') : '→';
    container.appendChild(icon);

    // Click handler for navigation
    if (!disabled) {
      container.addEventListener('click', () => {
        if (onClick) {
          onClick();
        } else if (href) {
          window.location.href = href;
        }
      });
    }

  } else if (variant === 'external') {
    // Add arrow-top-right icon
    const icon = document.createElement('div');
    icon.className = 'action-button__icon';
    icon.innerHTML = typeof getIcon !== 'undefined' ? getIcon('arrowUpRight') : '↗';
    container.appendChild(icon);

    // Click handler for external link
    if (!disabled) {
      container.addEventListener('click', () => {
        if (onClick) {
          onClick();
        } else if (href) {
          window.open(href, '_blank', 'noopener,noreferrer');
        }
      });
    }

  } else if (variant === 'cta') {
    // Add CTA button using Primary Button V2 Small
    const ctaButton = document.createElement('button');
    ctaButton.className = 'action-button__cta-button button-primary button-primary--v2 button-primary--small';
    ctaButton.textContent = ctaLabel;
    ctaButton.type = 'button';

    if (!disabled) {
      ctaButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onClick) {
          onClick();
        }
      });
    } else {
      ctaButton.disabled = true;
    }

    container.appendChild(ctaButton);
  }

  // Accessibility
  container.setAttribute('role', 'button');
  container.setAttribute('tabindex', disabled ? '-1' : '0');

  if (!disabled) {
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        container.click();
      }
    });
  }

  // Public API
  return {
    element: container,

    setLabel(newLabel) {
      labelElement.textContent = newLabel;
    },

    getLabel() {
      return labelElement.textContent;
    },

    setCaption(newCaption) {
      if (captionElement) {
        captionElement.textContent = newCaption;
      }
    },

    getCaption() {
      return captionElement ? captionElement.textContent : null;
    },

    setCtaLabel(newCtaLabel) {
      if (variant === 'cta') {
        const ctaButton = container.querySelector('.action-button__cta-button');
        if (ctaButton) {
          ctaButton.textContent = newCtaLabel;
        }
      }
    },

    disable() {
      container.classList.add('action-button--disabled');
      container.setAttribute('tabindex', '-1');
      if (variant === 'cta') {
        const ctaButton = container.querySelector('.action-button__cta-button');
        if (ctaButton) {
          ctaButton.disabled = true;
        }
      }
    },

    enable() {
      container.classList.remove('action-button--disabled');
      container.setAttribute('tabindex', '0');
      if (variant === 'cta') {
        const ctaButton = container.querySelector('.action-button__cta-button');
        if (ctaButton) {
          ctaButton.disabled = false;
        }
      }
    },

    isDisabled() {
      return container.classList.contains('action-button--disabled');
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createActionButton };
}
