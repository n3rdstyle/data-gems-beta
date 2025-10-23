/**
 * Button Element
 * Base button component with multiple variants
 * Variants: primary, tertiary
 * Sizes: medium, small
 *
 * Primary variants:
 * - default: Solid primary color background
 * - gradient: Sundown gradient background
 * - neutral: Dark gray for use on gradient backgrounds
 *
 * Tertiary variants:
 * - icon: Icon-only button (default 40x40px, small 24x24px)
 * - text: Text button with auto-width
 */

function createButton(options = {}) {
  const {
    variant = 'primary', // 'primary' or 'tertiary'
    purpose = 'default', // 'default', 'gradient', 'neutral' (for primary)
    size = 'medium', // 'medium' or 'small'
    label = 'Button',
    icon = null,
    text = null, // For tertiary text variant
    filled = false, // For tertiary icon variant (filled icon)
    onClick = null,
    disabled = false,
    ariaLabel = ''
  } = options;

  // Create button element
  const button = document.createElement('button');
  button.type = 'button';
  button.disabled = disabled;

  // Apply base class
  button.className = 'button';

  // Determine the actual variant type
  let variantType = variant;
  let variantModifier = purpose;

  if (variant === 'tertiary') {
    // For tertiary, determine if it's icon or text
    variantModifier = text ? 'text' : size;
  }

  // Apply variant and size classes
  if (variant === 'primary') {
    button.classList.add(`button--primary--${size}`);
    if (purpose === 'gradient') {
      button.classList.add('button--primary--gradient');
    } else if (purpose === 'neutral') {
      button.classList.add('button--primary--neutral');
    }
  } else if (variant === 'tertiary') {
    if (text) {
      button.classList.add('button--tertiary--text');
    } else {
      button.classList.add(`button--tertiary--${size}`);
    }
  }

  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }

  let contentContainer;

  // Build button content based on variant
  if (variant === 'primary') {
    // Primary button: just text
    button.textContent = label;
  } else if (variant === 'tertiary') {
    if (text) {
      // Tertiary text button
      contentContainer = document.createElement('span');
      contentContainer.className = 'button__text';
      contentContainer.textContent = text;
      button.appendChild(contentContainer);
    } else if (icon) {
      // Tertiary icon button
      contentContainer = document.createElement('span');
      contentContainer.className = 'button__icon';

      // Get icon SVG from global icon system
      const iconName = filled ? `${icon}Filled` : icon;
      const iconSvg = getIcon(iconName || 'plus');

      contentContainer.innerHTML = iconSvg;
      button.appendChild(contentContainer);
    }
  }

  // Add click event
  if (onClick) {
    button.addEventListener('click', onClick);
  }

  // Public API
  return {
    element: button,
    variant,

    setLabel(newLabel) {
      if (variant === 'primary') {
        button.textContent = newLabel;
      }
    },

    getLabel() {
      if (variant === 'primary') {
        return button.textContent;
      }
      return '';
    },

    setIcon(newIcon) {
      if (variant === 'tertiary' && contentContainer && !text) {
        const svg = getIcon(newIcon);
        contentContainer.innerHTML = svg;
      }
    },

    setText(newText) {
      if (variant === 'tertiary' && contentContainer && text) {
        contentContainer.textContent = newText;
      }
    },

    setDisabled(isDisabled) {
      button.disabled = isDisabled;
    },

    isDisabled() {
      return button.disabled;
    },

    enable() {
      button.disabled = false;
    },

    disable() {
      button.disabled = true;
    },

    toggleCollapsed() {
      button.classList.toggle('collapsed');
    },

    setCollapsed(collapsed) {
      if (collapsed) {
        button.classList.add('collapsed');
      } else {
        button.classList.remove('collapsed');
      }
    },

    isCollapsed() {
      return button.classList.contains('collapsed');
    },

    click() {
      if (!button.disabled) {
        button.click();
      }
    }
  };
}

// Backward compatibility wrappers
function createPrimaryButton(options = {}) {
  const { variant: purpose = 'default', size = 'default', ...rest } = options;

  // Map old variants to new system
  let mappedPurpose = purpose;
  let mappedSize = size === 'default' ? 'medium' : size;

  if (purpose === 'v2') {
    mappedPurpose = 'default';
  }

  return createButton({
    variant: 'primary',
    purpose: mappedPurpose,
    size: mappedSize,
    ...rest
  });
}

function createTertiaryButton(options = {}) {
  const { size = 'default', ...rest } = options;
  const mappedSize = size === 'default' ? 'medium' : size;

  return createButton({
    variant: 'tertiary',
    size: mappedSize,
    ...rest
  });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createButton, createPrimaryButton, createTertiaryButton };
}
