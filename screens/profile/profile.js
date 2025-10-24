/**
 * Profile Screen
 * Complete user profile screen
 * Requires: header.js, profile-teaser.js, input-field.js, dropdown.js, divider.js, collapsible-section.js
 */

function createProfile(options = {}) {

  const {
    profileName = 'Dennis',
    profileSubtitle = '',
    profileDescription = '',
    avatarImage = null,
    email = '',
    age = '',
    gender = '',
    location = '',
    languages = [],
    descriptionState = 'default',
    personalInfoState = 'default',
    onClose = null,
    onUploadAvatar = null,
    onSave = null,
    onDescriptionToggle = null,
    onPersonalInfoToggle = null
  } = options;

  // Track original values to detect changes
  const originalValues = {
    name: profileName,
    subtitle: profileSubtitle,
    description: profileDescription,
    email: email,
    age: age,
    gender: gender,
    location: location,
    languages: JSON.stringify(languages)
  };

  let hasChanges = false;
  let saveButton = null;

  // Track current avatar image (mutable)
  let currentAvatarImage = avatarImage;

  // Create main container
  const screenElement = document.createElement('div');
  screenElement.className = 'profile';

  // Create header
  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'profile__header';
  const header = createHeader({
    variant: 'simple',
    title: 'Profile',
    onClose: onClose || (() => console.log('Close clicked'))
  });
  headerWrapper.appendChild(header.element);

  // Function to check if values have changed
  const checkForChanges = () => {
    const currentValues = {
      name: nameField.getValue(),
      description: descriptionField.getValue(),
      email: emailField.getValue(),
      age: ageDropdown.getValue(),
      gender: genderDropdown.getValue(),
      location: locationField.getValue()
    };

    const changed =
      currentValues.name !== originalValues.name ||
      currentValues.description !== originalValues.description ||
      currentValues.email !== originalValues.email ||
      currentValues.age !== originalValues.age ||
      currentValues.gender !== originalValues.gender ||
      currentValues.location !== originalValues.location;

    if (changed && !hasChanges) {
      // Changes detected - show Save button
      hasChanges = true;
      showSaveButton();
    } else if (!changed && hasChanges) {
      // No changes anymore - show Close button
      hasChanges = false;
      showCloseButton();
    }
  };

  // Function to replace close button with save button
  const showSaveButton = () => {
    const closeButtonElement = header.getCloseButton();
    if (closeButtonElement && closeButtonElement.element) {
      // Hide close button
      closeButtonElement.element.style.display = 'none';

      // Create save button (tertiary button with text)
      saveButton = createTertiaryButton({
        text: 'Save',
        onClick: handleSave,
        ariaLabel: 'Save changes'
      });
      saveButton.element.classList.add('header__close');

      // Insert save button after close button
      closeButtonElement.element.parentNode.insertBefore(
        saveButton.element,
        closeButtonElement.element.nextSibling
      );
    }
  };

  // Function to replace save button with close button
  const showCloseButton = () => {
    const closeButtonElement = header.getCloseButton();
    if (closeButtonElement && closeButtonElement.element) {
      // Show close button
      closeButtonElement.element.style.display = '';

      // Remove save button
      if (saveButton && saveButton.element) {
        saveButton.element.remove();
        saveButton = null;
      }
    }
  };

  // Function to handle save
  const handleSave = async () => {
    if (onSave) {
      const profileData = {
        name: nameField.getValue(),
        description: descriptionField.getValue(),
        email: emailField.getValue(),
        age: ageDropdown.getValue(),
        gender: genderDropdown.getValue(),
        location: locationField.getValue()
      };

      await onSave(profileData);

      // Close profile and return to home screen
      if (onClose) {
        onClose();
      }
    }
  };

  // Function to handle avatar upload/change/remove
  const handleAvatarUpload = () => {
    // Use closure variable to track state within modal
    let modalAvatarImage = currentAvatarImage;

    // Show modal with options (similar to data-editor-modal)
    const modalOverlay = createOverlay({
      blur: false,
      opacity: 'default',
      visible: false,
      onClick: () => {
        closeModal();
      }
    });

    // Create modal container
    const modalElement = document.createElement('div');
    modalElement.className = 'avatar-editor-modal';

    // Function to render avatar preview (image or initial)
    const renderAvatarPreview = () => {
      const imagePreview = document.createElement('div');
      imagePreview.className = 'avatar-editor-modal__preview';

      if (modalAvatarImage) {
        // Show image
        const img = document.createElement('img');
        img.src = modalAvatarImage;
        img.alt = 'Profile Picture';
        img.className = 'avatar-editor-modal__image';
        imagePreview.appendChild(img);
      } else {
        // Show initial placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'avatar-editor-modal__image avatar-editor-modal__placeholder';
        const initial = document.createElement('div');
        initial.className = 'avatar-editor-modal__initial';
        initial.textContent = profileName.charAt(0).toUpperCase();
        placeholder.appendChild(initial);
        imagePreview.appendChild(placeholder);
      }

      return imagePreview;
    };

    // Create header (simple-delete variant if image exists, simple variant if no image)
    const headerSection = createHeader({
      variant: modalAvatarImage ? 'simple-delete' : 'simple',
      title: 'Profile Picture',
      onClose: () => {
        closeModal();
      },
      onDelete: modalAvatarImage ? async () => {
        // Remove avatar image
        modalAvatarImage = null;
        currentAvatarImage = null; // Update outer variable
        profile.setAvatarImage(null);

        // Save to profile data
        if (onSave) {
          await onSave({ avatarImage: null });
        }

        // Close modal after delete
        closeModal();
      } : undefined
    });

    // Create content container with image preview
    const contentContainer = document.createElement('div');
    contentContainer.className = 'avatar-editor-modal__content';
    contentContainer.appendChild(renderAvatarPreview());

    // Create buttons section
    const buttonsSection = document.createElement('div');
    buttonsSection.className = 'avatar-editor-modal__buttons';

    const uploadButton = createPrimaryButton({
      label: modalAvatarImage ? 'Change Image' : 'Upload Image',
      variant: 'v2',
      onClick: () => {
        openImageUploadForModal();
      }
    });

    const cancelButton = createTertiaryButton({
      text: 'Cancel',
      onClick: () => {
        closeModal();
      }
    });

    buttonsSection.appendChild(uploadButton.element);
    buttonsSection.appendChild(cancelButton.element);

    // Assemble modal
    modalElement.appendChild(headerSection.element);
    modalElement.appendChild(contentContainer);
    modalElement.appendChild(buttonsSection);

    // Assemble overlay with modal
    modalOverlay.element.appendChild(modalElement);

    const closeModal = () => {
      modalOverlay.hide();
      setTimeout(() => {
        modalOverlay.element.remove();
      }, 300);
    };

    // Function to update modal content after upload/delete
    const updateModalContent = () => {
      // Clear and re-render content
      contentContainer.innerHTML = '';
      contentContainer.appendChild(renderAvatarPreview());

      // Update button label
      uploadButton.setLabel(modalAvatarImage ? 'Change Image' : 'Upload Image');

      // Update header delete button visibility
      // Recreate header with appropriate variant
      const newHeaderSection = createHeader({
        variant: modalAvatarImage ? 'simple-delete' : 'simple',
        title: 'Profile Picture',
        onClose: () => {
          closeModal();
        },
        onDelete: modalAvatarImage ? async () => {
          // Remove avatar image
          modalAvatarImage = null;
          currentAvatarImage = null; // Update outer variable
          profile.setAvatarImage(null);

          // Save to profile data
          if (onSave) {
            await onSave({ avatarImage: null });
          }

          // Close modal after delete
          closeModal();
        } : undefined
      });

      // Replace header
      modalElement.replaceChild(newHeaderSection.element, headerSection.element);
      headerSection.element = newHeaderSection.element;
    };

    // Function to open file dialog for image upload (modal version)
    const openImageUploadForModal = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png, image/jpeg, image/jpg, image/gif, image/webp';

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
          // Check file size (max 2MB)
          if (file.size > 2 * 1024 * 1024) {
            alert('Image size must be less than 2MB');
            return;
          }

          // Read file as data URL
          const reader = new FileReader();
          reader.onload = async (event) => {
            const dataUrl = event.target.result;

            // Update current state
            modalAvatarImage = dataUrl;
            currentAvatarImage = dataUrl; // Update outer variable

            // Update profile teaser image
            profile.setAvatarImage(dataUrl);

            // Save to profile data
            if (onSave) {
              await onSave({ avatarImage: dataUrl });
            }

            // Close modal after upload
            closeModal();
          };
          reader.readAsDataURL(file);
        } catch (error) {
          console.error('Error uploading avatar:', error);
          alert('Failed to upload image: ' + error.message);
        }
      };

      input.click();
    };

    // Add to screen and show
    screenElement.appendChild(modalOverlay.element);
    modalOverlay.show();
  };

  // Create profile section
  const profileWrapper = document.createElement('div');
  profileWrapper.className = 'profile__profile';
  const profile = createProfileTeaser({
    name: profileName,
    subtitle: profileSubtitle,
    avatarImage: avatarImage,
    variant: 'large',
    showUpload: true,
    onUploadClick: handleAvatarUpload
  });
  profileWrapper.appendChild(profile.element);

  // Create scrollable content container
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'profile__content';

  // Personal Description Section
  const personalDescSection = document.createElement('div');
  personalDescSection.className = 'profile__section';

  const personalDescCollapsible = createCollapsibleSection({
    title: 'Personal Description',
    collapsed: descriptionState === 'hidden',
    onToggle: (isHidden) => {
      if (onDescriptionToggle) {
        onDescriptionToggle(isHidden ? 'hidden' : 'default');
      }
    }
  });

  const descriptionField = createInputField({
    type: 'textarea',
    placeholder: 'Describe yourself here ...',
    value: profileDescription,
    autoResize: true,
    onInput: () => {
      checkForChanges();
    }
  });

  // Add CSS class for max-height constraint
  descriptionField.element.classList.add('profile__description-field');

  personalDescCollapsible.addContent(descriptionField.element);
  personalDescSection.appendChild(personalDescCollapsible.element);

  // Add divider after Personal Description
  const divider1 = createDivider();
  personalDescSection.appendChild(divider1.element);

  // Profile Information Section
  const profileInfoSection = document.createElement('div');
  profileInfoSection.className = 'profile__section';

  const profileInfoCollapsible = createCollapsibleSection({
    title: 'Profile Information',
    collapsed: personalInfoState === 'hidden',
    onToggle: (isHidden) => {
      if (onPersonalInfoToggle) {
        onPersonalInfoToggle(isHidden ? 'hidden' : 'default');
      }
    }
  });

  const fieldsContainer = document.createElement('div');
  fieldsContainer.className = 'profile__section-fields';

  // Name field
  const nameFieldGroup = document.createElement('div');
  nameFieldGroup.className = 'profile__field-group';
  const nameLabel = document.createElement('div');
  nameLabel.className = 'profile__field-label text-style-h3';
  nameLabel.textContent = 'Name';
  const nameField = createInputField({
    type: 'text',
    value: profileName,
    onInput: () => {
      checkForChanges();
    }
  });
  nameFieldGroup.appendChild(nameLabel);
  nameFieldGroup.appendChild(nameField.element);

  // Email field
  const emailFieldGroup = document.createElement('div');
  emailFieldGroup.className = 'profile__field-group';
  const emailLabel = document.createElement('div');
  emailLabel.className = 'profile__field-label text-style-h3';
  emailLabel.textContent = 'Email';
  const emailField = createInputField({
    type: 'text',
    value: email,
    onInput: () => {
      checkForChanges();
    }
  });
  emailFieldGroup.appendChild(emailLabel);
  emailFieldGroup.appendChild(emailField.element);

  // Age field (dropdown)
  const ageFieldGroup = document.createElement('div');
  ageFieldGroup.className = 'profile__field-group';
  const ageLabel = document.createElement('div');
  ageLabel.className = 'profile__field-label text-style-h3';
  ageLabel.textContent = 'Age';
  const ageOptions = [];
  for (let i = 18; i <= 100; i++) {
    ageOptions.push({ value: `${i}`, label: `${i} years` });
  }
  const ageDropdown = createDropdown({
    value: age,
    placeholder: 'Select age',
    options: ageOptions,
    onChange: (selectedValue) => {
      checkForChanges();
    }
  });
  ageFieldGroup.appendChild(ageLabel);
  ageFieldGroup.appendChild(ageDropdown.element);

  // Gender field (dropdown)
  const genderFieldGroup = document.createElement('div');
  genderFieldGroup.className = 'profile__field-group';
  const genderLabel = document.createElement('div');
  genderLabel.className = 'profile__field-label text-style-h3';
  genderLabel.textContent = 'Gender';
  const genderDropdown = createDropdown({
    value: gender,
    placeholder: 'Select gender',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
      { value: 'prefer-not-to-say', label: 'Prefer not to say' }
    ],
    onChange: (selectedValue) => {
      checkForChanges();
    }
  });
  genderFieldGroup.appendChild(genderLabel);
  genderFieldGroup.appendChild(genderDropdown.element);

  // Location field
  const locationFieldGroup = document.createElement('div');
  locationFieldGroup.className = 'profile__field-group';
  const locationLabel = document.createElement('div');
  locationLabel.className = 'profile__field-label text-style-h3';
  locationLabel.textContent = 'Location';
  const locationField = createInputField({
    type: 'text',
    value: location,
    onInput: () => {
      checkForChanges();
    }
  });
  locationFieldGroup.appendChild(locationLabel);
  locationFieldGroup.appendChild(locationField.element);

  // Language fields (with level dropdowns)
  const languageFieldGroup = document.createElement('div');
  languageFieldGroup.className = 'profile__field-group';
  const languageLabel = document.createElement('div');
  languageLabel.className = 'profile__field-label text-style-h3';
  languageLabel.textContent = 'Language';

  const languagesContainer = document.createElement('div');
  languagesContainer.style.display = 'flex';
  languagesContainer.style.flexDirection = 'column';
  languagesContainer.style.gap = '8px';

  // Add existing languages
  languages.forEach(lang => {
    const row = document.createElement('div');
    row.className = 'profile__field-row';

    const langField = createInputField({
      type: 'text',
      value: lang.language,
      placeholder: 'Language'
    });

    const levelDropdown = createDropdown({
      value: lang.level,
      placeholder: 'Level',
      options: [
        { value: 'native', label: 'Native' },
        { value: 'very-good', label: 'Very good' },
        { value: 'good', label: 'Good' },
        { value: 'basic', label: 'Basic' }
      ]
    });

    row.appendChild(langField.element);
    row.appendChild(levelDropdown.element);
    languagesContainer.appendChild(row);
  });

  // Add empty row for new language
  const emptyRow = document.createElement('div');
  emptyRow.className = 'profile__field-row';
  const emptyLangField = createInputField({
    type: 'text',
    placeholder: 'Language'
  });
  const emptyLevelDropdown = createDropdown({
    placeholder: 'Level',
    options: [
      { value: 'native', label: 'Native' },
      { value: 'very-good', label: 'Very good' },
      { value: 'good', label: 'Good' },
      { value: 'basic', label: 'Basic' }
    ]
  });
  emptyRow.appendChild(emptyLangField.element);
  emptyRow.appendChild(emptyLevelDropdown.element);
  languagesContainer.appendChild(emptyRow);

  languageFieldGroup.appendChild(languageLabel);
  languageFieldGroup.appendChild(languagesContainer);

  // Add all fields to container
  fieldsContainer.appendChild(nameFieldGroup);
  fieldsContainer.appendChild(emailFieldGroup);
  fieldsContainer.appendChild(ageFieldGroup);
  fieldsContainer.appendChild(genderFieldGroup);
  fieldsContainer.appendChild(locationFieldGroup);
  fieldsContainer.appendChild(languageFieldGroup);

  profileInfoCollapsible.addContent(fieldsContainer);
  profileInfoSection.appendChild(profileInfoCollapsible.element);

  // Add divider after Profile Information
  const divider2 = createDivider();
  profileInfoSection.appendChild(divider2.element);

  // Assemble content
  contentWrapper.appendChild(personalDescSection);
  contentWrapper.appendChild(profileInfoSection);

  // Assemble screen
  screenElement.appendChild(headerWrapper);
  screenElement.appendChild(profileWrapper);
  screenElement.appendChild(contentWrapper);

  // Public API
  return {
    element: screenElement,

    getData() {
      return {
        name: nameField.getValue(),
        subtitle: profileSubtitle,
        description: descriptionField.getValue(),
        email: emailField.getValue(),
        age: ageDropdown.getValue(),
        gender: genderDropdown.getValue(),
        location: locationField.getValue()
      };
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createProfile };
}
