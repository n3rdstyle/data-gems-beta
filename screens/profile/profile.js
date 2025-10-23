/**
 * Profile Screen
 * Complete user profile screen
 * Requires: header.js, profile-teaser.js, input-field.js, dropdown.js, divider.js, collapsible-section.js
 */

function createProfile(options = {}) {
  const {
    profileName = 'Dennis',
    profileSubtitle = 'Founder',
    profileDescription = '',
    email = '',
    age = '',
    gender = '',
    location = '',
    languages = [],
    onClose = null,
    onUploadAvatar = null,
    onSave = null
  } = options;

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

  // Create profile section
  const profileWrapper = document.createElement('div');
  profileWrapper.className = 'profile__profile';
  const profile = createProfileTeaser({
    name: profileName,
    subtitle: profileSubtitle,
    variant: 'large',
    showUpload: true,
    onUploadClick: onUploadAvatar || (() => console.log('Upload avatar clicked'))
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
    collapsed: false
  });

  const descriptionField = createInputField({
    type: 'textarea',
    placeholder: 'Describe yourself here ...',
    value: profileDescription,
    autoResize: true
  });

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
    collapsed: false
  });

  const fieldsContainer = document.createElement('div');
  fieldsContainer.className = 'profile__section-fields';

  // Name field
  const nameFieldGroup = document.createElement('div');
  nameFieldGroup.className = 'profile__field-group';
  const nameLabel = document.createElement('div');
  nameLabel.className = 'profile__field-label';
  nameLabel.textContent = 'Name';
  const nameField = createInputField({
    type: 'text',
    value: profileName
  });
  nameFieldGroup.appendChild(nameLabel);
  nameFieldGroup.appendChild(nameField.element);

  // Email field
  const emailFieldGroup = document.createElement('div');
  emailFieldGroup.className = 'profile__field-group';
  const emailLabel = document.createElement('div');
  emailLabel.className = 'profile__field-label';
  emailLabel.textContent = 'Email';
  const emailField = createInputField({
    type: 'text',
    value: email
  });
  emailFieldGroup.appendChild(emailLabel);
  emailFieldGroup.appendChild(emailField.element);

  // Age field (dropdown)
  const ageFieldGroup = document.createElement('div');
  ageFieldGroup.className = 'profile__field-group';
  const ageLabel = document.createElement('div');
  ageLabel.className = 'profile__field-label';
  ageLabel.textContent = 'Age';
  const ageOptions = [];
  for (let i = 18; i <= 100; i++) {
    ageOptions.push({ value: `${i}`, label: `${i} years` });
  }
  const ageDropdown = createDropdown({
    value: age,
    placeholder: 'Select age',
    options: ageOptions
  });
  ageFieldGroup.appendChild(ageLabel);
  ageFieldGroup.appendChild(ageDropdown.element);

  // Gender field (dropdown)
  const genderFieldGroup = document.createElement('div');
  genderFieldGroup.className = 'profile__field-group';
  const genderLabel = document.createElement('div');
  genderLabel.className = 'profile__field-label';
  genderLabel.textContent = 'Gender';
  const genderDropdown = createDropdown({
    value: gender,
    placeholder: 'Select gender',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
      { value: 'prefer-not-to-say', label: 'Prefer not to say' }
    ]
  });
  genderFieldGroup.appendChild(genderLabel);
  genderFieldGroup.appendChild(genderDropdown.element);

  // Location field
  const locationFieldGroup = document.createElement('div');
  locationFieldGroup.className = 'profile__field-group';
  const locationLabel = document.createElement('div');
  locationLabel.className = 'profile__field-label';
  locationLabel.textContent = 'Location';
  const locationField = createInputField({
    type: 'text',
    value: location
  });
  locationFieldGroup.appendChild(locationLabel);
  locationFieldGroup.appendChild(locationField.element);

  // Language fields (with level dropdowns)
  const languageFieldGroup = document.createElement('div');
  languageFieldGroup.className = 'profile__field-group';
  const languageLabel = document.createElement('div');
  languageLabel.className = 'profile__field-label';
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

  // "Enter more Information" action button
  const expandButton = createActionButton({
    label: 'Enter more Information',
    variant: 'navigation',
    onClick: () => console.log('Enter more Information clicked')
  });

  // Assemble content
  contentWrapper.appendChild(personalDescSection);
  contentWrapper.appendChild(profileInfoSection);
  contentWrapper.appendChild(expandButton.element);

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
