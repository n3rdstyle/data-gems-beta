/**
 * Beta Check-In Modal Component
 * Modal for beta user registration with:
 * - Header (simple variant)
 * - Informational text about beta program
 * - Email input field
 * - Consent checkbox
 * - Action buttons (join/skip)
 * Requires: header.js, button-primary.js, button-tertiary.js, overlay.js
 */

function createBetaCheckinModal(options = {}) {
  const {
    onClose = null,
    onJoin = null,
    onSkip = null,
    initialEmail = ''
  } = options;

  // Create modal overlay using overlay component
  const overlay = createOverlay({
    blur: false,
    opacity: 'default',
    visible: false,
    onClick: () => {
      // Prevent closing on overlay click - user should choose an action
    }
  });

  // Create modal container
  const modalElement = document.createElement('div');
  modalElement.className = 'beta-checkin-modal';

  // Create header (compact-plain variant - without close button)
  const headerSection = createHeader({
    variant: 'compact-plain',
    title: 'Join Beta Community'
  });

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'beta-checkin-modal__content';

  // Create info text
  const infoText = document.createElement('p');
  infoText.className = 'beta-checkin-modal__info';
  infoText.textContent = 'Would you like to receive exclusive updates and gain lifetime premium access after launch?';

  // Create benefits list
  const benefitsList = document.createElement('ul');
  benefitsList.className = 'beta-checkin-modal__benefits';

  const benefits = [
    'Exclusive beta updates & new features',
    'Direct feedback channel to us',
    'Lifetime premium access after official launch'
  ];

  benefits.forEach(benefit => {
    const li = document.createElement('li');
    li.textContent = benefit;
    benefitsList.appendChild(li);
  });

  // Create email input container
  const emailContainer = document.createElement('div');
  emailContainer.className = 'beta-checkin-modal__email-container';

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.className = 'beta-checkin-modal__email-input';
  emailInput.placeholder = 'your@email.com';
  emailInput.required = true;
  emailInput.value = initialEmail || '';

  // Email validation indicator
  const emailValidation = document.createElement('div');
  emailValidation.className = 'beta-checkin-modal__email-validation';
  emailValidation.style.display = 'none';

  emailContainer.appendChild(emailInput);
  emailContainer.appendChild(emailValidation);

  // Create consent checkbox container
  const consentContainer = document.createElement('div');
  consentContainer.className = 'beta-checkin-modal__consent';

  const consentCheckbox = document.createElement('input');
  consentCheckbox.type = 'checkbox';
  consentCheckbox.id = 'beta-consent-checkbox';
  consentCheckbox.className = 'beta-checkin-modal__consent-checkbox';
  consentCheckbox.required = true;

  const consentLabel = document.createElement('label');
  consentLabel.htmlFor = 'beta-consent-checkbox';
  consentLabel.className = 'beta-checkin-modal__consent-label';

  consentLabel.textContent = 'I agree that my email will be stored for beta updates and communication. Only your email and beta user ID, all your other data stays local and safe.';

  consentContainer.appendChild(consentCheckbox);
  consentContainer.appendChild(consentLabel);

  // Create error message element (hidden by default)
  const errorMessage = document.createElement('div');
  errorMessage.className = 'beta-checkin-modal__error';
  errorMessage.style.display = 'none';

  // Add sections to content
  contentContainer.appendChild(infoText);
  contentContainer.appendChild(benefitsList);
  contentContainer.appendChild(emailContainer);
  contentContainer.appendChild(consentContainer);
  contentContainer.appendChild(errorMessage);

  // Create buttons section
  const buttonsSection = document.createElement('div');
  buttonsSection.className = 'beta-checkin-modal__buttons';

  const joinButton = createPrimaryButton({
    label: 'Join Beta Program',
    variant: 'v2',
    disabled: true, // Initially disabled
    onClick: async () => {
      const email = emailInput.value.trim();
      const consentGiven = consentCheckbox.checked;

      // Validation
      if (!email) {
        updateEmailValidationState(); // Show validation state
        showError('Please enter your email address');
        return;
      }

      if (!isValidEmail(email)) {
        updateEmailValidationState(); // Show validation state (error)
        showError('Please enter a valid email address');
        return;
      }

      if (!consentGiven) {
        showError('Please agree to the terms to continue');
        return;
      }

      // Disable button during submission
      joinButton.setDisabled(true);

      try {
        if (onJoin) {
          await onJoin(email, consentGiven);
        }
        if (onClose) {
          onClose(true);
        }
        api.hide();
      } catch (error) {
        joinButton.setDisabled(false);
        showError(error.message || 'Failed to join beta program. Please try again.');
      }
    }
  });

  // Helper to check if form is valid
  const isFormValid = () => {
    const email = emailInput.value.trim();
    const hasValidEmail = email && isValidEmail(email);
    const hasConsent = consentCheckbox.checked;
    return hasValidEmail && hasConsent;
  };

  // Function to update email validation state (live validation)
  const updateEmailValidationState = () => {
    const email = emailInput.value.trim();

    if (email === '') {
      // Empty - hide validation
      emailValidation.style.display = 'none';
      emailInput.classList.remove('beta-checkin-modal__email-input--valid');
      emailInput.classList.remove('beta-checkin-modal__email-input--invalid');
    } else if (isValidEmail(email)) {
      // Valid email - show success
      emailValidation.style.display = 'block';
      emailValidation.textContent = '✓ Valid email';
      emailValidation.className = 'beta-checkin-modal__email-validation beta-checkin-modal__email-validation--valid';
      emailInput.classList.add('beta-checkin-modal__email-input--valid');
      emailInput.classList.remove('beta-checkin-modal__email-input--invalid');
    } else {
      // Invalid email - show error
      emailValidation.style.display = 'block';
      emailValidation.textContent = '✗ Please enter a valid email';
      emailValidation.className = 'beta-checkin-modal__email-validation beta-checkin-modal__email-validation--invalid';
      emailInput.classList.remove('beta-checkin-modal__email-input--valid');
      emailInput.classList.add('beta-checkin-modal__email-input--invalid');
    }
  };

  // Helper to clear validation (reset to default state)
  const clearEmailValidation = () => {
    emailValidation.style.display = 'none';
    emailInput.classList.remove('beta-checkin-modal__email-input--valid');
    emailInput.classList.remove('beta-checkin-modal__email-input--invalid');
  };

  // Email input validation
  emailInput.addEventListener('input', () => {
    updateEmailValidationState();
    // Update button state
    joinButton.setDisabled(!isFormValid());
  });

  // Email focus handler - show validation when focusing
  emailInput.addEventListener('focus', () => {
    if (emailInput.value.trim()) {
      updateEmailValidationState();
    }
  });

  // Email blur handler - hide validation when leaving the field
  emailInput.addEventListener('blur', () => {
    clearEmailValidation();
  });

  // Enable/disable join button based on consent checkbox
  consentCheckbox.addEventListener('change', () => {
    joinButton.setDisabled(!isFormValid());
  });

  // Don't show validation initially - only show when user interacts with field
  // Validation will appear when user focuses the field

  const skipButton = createTertiaryButton({
    text: 'Skip for now',
    ariaLabel: 'Skip for now - You can join in the settings anytime',
    onClick: () => {
      if (onSkip) {
        onSkip();
      }
      if (onClose) {
        onClose(false);
      }
      api.hide();
    }
  });

  buttonsSection.appendChild(joinButton.element);
  buttonsSection.appendChild(skipButton.element);

  // Assemble modal
  modalElement.appendChild(headerSection.element);
  modalElement.appendChild(contentContainer);
  modalElement.appendChild(buttonsSection);

  // Assemble overlay with modal
  overlay.element.appendChild(modalElement);

  // Helper function to show error messages
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 5000);
  }

  // Helper function to validate email
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Store tooltip instance
  let skipButtonTooltip = null;

  // Public API
  const api = {
    element: overlay.element,
    modalElement: modalElement,

    getEmail() {
      return emailInput.value.trim();
    },

    getConsentState() {
      return consentCheckbox.checked;
    },

    show(container) {
      // If container provided, append to container, otherwise append to body
      const target = container || document.body;
      target.appendChild(overlay.element);
      // Show overlay after appending to trigger transition
      setTimeout(() => {
        overlay.show();

        // Initialize tooltip after modal is in DOM
        if (!skipButtonTooltip) {
          skipButtonTooltip = createTooltip(skipButton.element, {
            text: 'You can join in the settings anytime',
            position: 'top-right'
          });
        }
      }, 10);
    },

    hide() {
      overlay.hide();
      // Use timeout to allow fade-out animation
      setTimeout(() => {
        if (overlay.element.parentNode) {
          overlay.element.parentNode.removeChild(overlay.element);
        }
        // Clean up tooltip
        if (skipButtonTooltip) {
          skipButtonTooltip.destroy();
          skipButtonTooltip = null;
        }
      }, 200);
    },

    destroy() {
      if (skipButtonTooltip) {
        skipButtonTooltip.destroy();
        skipButtonTooltip = null;
      }
      overlay.destroy();
    }
  };

  return api;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createBetaCheckinModal };
}
