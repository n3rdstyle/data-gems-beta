/**
 * Action Button Component
 * Button for navigation, external links, and CTAs
 */

function createActionButton(options = {}) {
  const {
    label = '',
    caption = null, // Optional caption for two-line variant
    variant = 'navigation', // 'navigation', 'external', 'cta', 'secondary', 'toggle'
    ctaLabel = 'Action', // Label for CTA or secondary button
    href = null, // URL for navigation/external
    onClick = null,
    disabled = false,
    toggleActive = false, // Active state for toggle variant
    onToggleChange = null // Callback for toggle state change
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
  let toggleInstance = null;

  if (variant === 'toggle') {
    // Toggle variant - always two-line with caption and toggle
    const labelWrapper = document.createElement('div');
    labelWrapper.className = 'action-button__label-wrapper';

    // Only create label element if label is not empty
    if (label) {
      labelElement = document.createElement('div');
      labelElement.className = 'action-button__label text-style-h3';
      labelElement.textContent = label;
      labelWrapper.appendChild(labelElement);
    }

    // Caption row with toggle
    const captionRow = document.createElement('div');
    captionRow.className = 'action-button__caption-row';

    captionElement = document.createElement('div');
    captionElement.className = 'action-button__caption text-style-caption-medium';
    captionElement.textContent = caption || '';

    toggleInstance = createToggle({
      active: toggleActive,
      disabled: disabled,
      onChange: (isActive) => {
        if (onToggleChange) {
          onToggleChange(isActive);
        }
      }
    });

    captionRow.appendChild(captionElement);
    captionRow.appendChild(toggleInstance.element);

    labelWrapper.appendChild(captionRow);
    container.appendChild(labelWrapper);

  } else if (caption) {
    // Two-line variant with wrapper
    const labelWrapper = document.createElement('div');
    labelWrapper.className = 'action-button__label-wrapper';

    labelElement = document.createElement('div');
    labelElement.className = 'action-button__label text-style-h3';
    labelElement.textContent = label;

    captionElement = document.createElement('div');
    captionElement.className = 'action-button__caption text-style-caption-medium';
    captionElement.textContent = caption;

    labelWrapper.appendChild(labelElement);
    labelWrapper.appendChild(captionElement);
    container.appendChild(labelWrapper);
  } else {
    // Single-line variant
    labelElement = document.createElement('div');
    labelElement.className = 'action-button__label text-style-h3';
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

  } else if (variant === 'secondary') {
    // Add Secondary button using Secondary Button V2 Small
    const secondaryButtonInstance = createSecondaryButton({
      label: ctaLabel,
      variant: 'v2',
      size: 'small',
      disabled: disabled,
      onClick: (e) => {
        if (onClick) {
          onClick();
        }
      }
    });

    secondaryButtonInstance.element.classList.add('action-button__secondary-button');
    container.appendChild(secondaryButtonInstance.element);
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

    // Toggle variant methods
    getToggleState() {
      return toggleInstance ? toggleInstance.isActive() : null;
    },

    setToggleState(value) {
      if (toggleInstance) {
        toggleInstance.setActive(value);
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
      } else if (variant === 'toggle' && toggleInstance) {
        toggleInstance.setDisabled(true);
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
      } else if (variant === 'toggle' && toggleInstance) {
        toggleInstance.setDisabled(false);
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
