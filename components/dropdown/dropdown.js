/**
 * Dropdown Component
 * Custom select-style dropdown
 */

function createDropdown(options = {}) {
  const {
    value = '',
    placeholder = 'Select an option',
    options: dropdownOptions = [],
    onChange = null,
    disabled = false
  } = options;

  // State
  let isOpen = false;
  let selectedValue = value;

  // Create container
  const container = document.createElement('div');
  container.className = 'dropdown';

  // Create trigger button
  const trigger = document.createElement('button');
  trigger.className = 'dropdown__trigger text-style-body';
  trigger.type = 'button';
  trigger.disabled = disabled;

  if (!selectedValue) {
    trigger.classList.add('dropdown__trigger--placeholder');
  }

  // Create value display
  const valueDisplay = document.createElement('div');
  valueDisplay.className = 'dropdown__value';

  const selectedOption = dropdownOptions.find(opt => opt.value === selectedValue);
  valueDisplay.textContent = selectedOption ? selectedOption.label : placeholder;

  // Create icon
  const icon = document.createElement('div');
  icon.className = 'dropdown__icon';
  icon.innerHTML = typeof getIcon !== 'undefined' ? getIcon('chevronDown') : '▼';

  trigger.appendChild(valueDisplay);
  trigger.appendChild(icon);

  // Create menu
  const menu = document.createElement('div');
  menu.className = 'dropdown__menu';

  // Create options
  dropdownOptions.forEach(opt => {
    const optionElement = document.createElement('div');
    optionElement.className = 'dropdown__option text-style-body';
    optionElement.textContent = opt.label;
    optionElement.dataset.value = opt.value;

    if (opt.value === selectedValue) {
      optionElement.classList.add('dropdown__option--selected');
    }

    optionElement.addEventListener('click', () => {
      // Update selected value
      selectedValue = opt.value;
      valueDisplay.textContent = opt.label;
      trigger.classList.remove('dropdown__trigger--placeholder');

      // Update selected class
      menu.querySelectorAll('.dropdown__option').forEach(el => {
        el.classList.remove('dropdown__option--selected');
      });
      optionElement.classList.add('dropdown__option--selected');

      // Close menu
      closeMenu();

      // Trigger onChange callback
      if (onChange) {
        onChange(selectedValue, opt);
      }
    });

    menu.appendChild(optionElement);
  });

  // Toggle menu
  const toggleMenu = () => {
    if (disabled) return;

    isOpen = !isOpen;
    if (isOpen) {
      openMenu();
    } else {
      closeMenu();
    }
  };

  const openMenu = () => {
    isOpen = true;
    menu.classList.add('dropdown__menu--open');
    trigger.classList.add('dropdown__trigger--open');
  };

  const closeMenu = () => {
    isOpen = false;
    menu.classList.remove('dropdown__menu--open');
    trigger.classList.remove('dropdown__trigger--open');
  };

  // Event listeners
  trigger.addEventListener('click', toggleMenu);

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target) && isOpen) {
      closeMenu();
    }
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
    }
  });

  // Assemble component
  container.appendChild(trigger);
  container.appendChild(menu);

  // Public API
  return {
    element: container,

    getValue() {
      return selectedValue;
    },

    setValue(newValue) {
      selectedValue = newValue;
      const selectedOption = dropdownOptions.find(opt => opt.value === newValue);

      if (selectedOption) {
        valueDisplay.textContent = selectedOption.label;
        trigger.classList.remove('dropdown__trigger--placeholder');

        // Update selected class
        menu.querySelectorAll('.dropdown__option').forEach(el => {
          el.classList.remove('dropdown__option--selected');
          if (el.dataset.value === newValue) {
            el.classList.add('dropdown__option--selected');
          }
        });
      } else {
        valueDisplay.textContent = placeholder;
        trigger.classList.add('dropdown__trigger--placeholder');
      }
    },

    open() {
      openMenu();
    },

    close() {
      closeMenu();
    },

    disable() {
      trigger.disabled = true;
    },

    enable() {
      trigger.disabled = false;
    },

    isDisabled() {
      return trigger.disabled;
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createDropdown };
}
