/**
 * Profile Teaser Component
 * Displays user profile with avatar initial or image and name/subtitle
 */

function createProfileTeaser(options = {}) {
  const {
    name = 'User',
    subtitle = '',
    avatarImage = null,
    showUpload = false,
    variant = 'default', // 'default' or 'large'
    onClick = null,
    onUploadClick = null,
    ariaLabel = ''
  } = options;

  // Create main container
  const container = document.createElement('div');
  container.className = 'profile-teaser';

  if (variant === 'large') {
    container.classList.add('profile-teaser--large');
  }

  if (onClick) {
    container.classList.add('profile-teaser--clickable');
    container.setAttribute('role', 'button');
    container.setAttribute('tabindex', '0');
    if (ariaLabel) {
      container.setAttribute('aria-label', ariaLabel);
    }
  }

  // Create avatar
  const avatar = document.createElement('div');
  avatar.className = 'profile-teaser__avatar';

  if (avatarImage) {
    // Use provided image
    const img = document.createElement('img');
    img.className = 'profile-teaser__avatar-image';
    img.src = avatarImage;
    img.alt = name;
    avatar.appendChild(img);
  } else {
    // Use initial letter
    const initial = document.createElement('div');
    initial.className = 'profile-teaser__avatar-initial';
    initial.textContent = name.charAt(0).toUpperCase();
    avatar.appendChild(initial);
  }

  // Add upload icon/overlay
  let uploadIcon = null;
  if (showUpload) {
    uploadIcon = document.createElement('div');
    uploadIcon.className = 'profile-teaser__avatar-upload';

    // If image exists, add hover-only class and overlay styling
    if (avatarImage) {
      uploadIcon.classList.add('profile-teaser__avatar-upload--hover');
    }

    uploadIcon.innerHTML = typeof getIcon !== 'undefined' ? getIcon('upload') : '↑';
    uploadIcon.setAttribute('role', 'button');
    uploadIcon.setAttribute('aria-label', 'Upload profile picture');
    uploadIcon.style.cursor = 'pointer';

    if (onUploadClick) {
      uploadIcon.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering container onClick
        onUploadClick(e);
      });
    }

    avatar.appendChild(uploadIcon);
  }

  // Create info container
  const info = document.createElement('div');
  info.className = 'profile-teaser__info';

  // Create name
  const nameElement = document.createElement('div');
  nameElement.className = 'profile-teaser__name';
  nameElement.textContent = name;

  // Create subtitle (if provided)
  const subtitleElement = document.createElement('div');
  subtitleElement.className = 'profile-teaser__subtitle';
  subtitleElement.textContent = subtitle;

  info.appendChild(nameElement);
  if (subtitle) {
    info.appendChild(subtitleElement);
  }

  // Assemble component
  container.appendChild(avatar);
  container.appendChild(info);

  // Add click event
  if (onClick) {
    container.addEventListener('click', onClick);
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    });
  }

  // Public API
  return {
    element: container,

    setName(newName) {
      nameElement.textContent = newName;
      // Update initial if no image
      if (!avatarImage) {
        const initial = avatar.querySelector('.profile-teaser__avatar-initial');
        if (initial) {
          initial.textContent = newName.charAt(0).toUpperCase();
        }
      }
    },

    getName() {
      return nameElement.textContent;
    },

    setSubtitle(newSubtitle) {
      subtitleElement.textContent = newSubtitle;
      if (newSubtitle && !info.contains(subtitleElement)) {
        info.appendChild(subtitleElement);
      } else if (!newSubtitle && info.contains(subtitleElement)) {
        info.removeChild(subtitleElement);
      }
    },

    getSubtitle() {
      return subtitleElement.textContent;
    },

    setAvatarImage(imageUrl) {
      // Clear avatar
      avatar.innerHTML = '';

      if (imageUrl) {
        const img = document.createElement('img');
        img.className = 'profile-teaser__avatar-image';
        img.src = imageUrl;
        img.alt = nameElement.textContent;
        avatar.appendChild(img);

        // Add upload icon with hover style if showUpload is true
        if (showUpload && onUploadClick) {
          uploadIcon = document.createElement('div');
          uploadIcon.className = 'profile-teaser__avatar-upload profile-teaser__avatar-upload--hover';
          uploadIcon.innerHTML = typeof getIcon !== 'undefined' ? getIcon('upload') : '↑';
          uploadIcon.setAttribute('role', 'button');
          uploadIcon.setAttribute('aria-label', 'Upload profile picture');
          uploadIcon.style.cursor = 'pointer';

          uploadIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            onUploadClick(e);
          });

          avatar.appendChild(uploadIcon);
        } else {
          uploadIcon = null;
        }
      } else {
        // Fall back to initial
        const initial = document.createElement('div');
        initial.className = 'profile-teaser__avatar-initial';
        initial.textContent = nameElement.textContent.charAt(0).toUpperCase();
        avatar.appendChild(initial);

        // Re-add upload icon (always visible when no image) if showUpload is true
        if (showUpload && onUploadClick) {
          uploadIcon = document.createElement('div');
          uploadIcon.className = 'profile-teaser__avatar-upload';
          uploadIcon.innerHTML = typeof getIcon !== 'undefined' ? getIcon('upload') : '↑';
          uploadIcon.setAttribute('role', 'button');
          uploadIcon.setAttribute('aria-label', 'Upload profile picture');
          uploadIcon.style.cursor = 'pointer';

          uploadIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            onUploadClick(e);
          });

          avatar.appendChild(uploadIcon);
        }
      }
    },

    setClickable(clickable) {
      if (clickable) {
        container.classList.add('profile-teaser--clickable');
        container.setAttribute('role', 'button');
        container.setAttribute('tabindex', '0');
      } else {
        container.classList.remove('profile-teaser--clickable');
        container.removeAttribute('role');
        container.removeAttribute('tabindex');
      }
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createProfileTeaser };
}
