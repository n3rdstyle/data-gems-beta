/**
 * Merge FAB (Floating Action Button)
 * Shows when 2+ data cards are selected
 * Allows user to trigger merge operation
 */

function createMergeFAB(options = {}) {
  const {
    onMerge = null,
    count = 0
  } = options;

  // Create container
  const fab = document.createElement('div');
  fab.className = 'merge-fab';

  // Create button
  const button = document.createElement('button');
  button.className = 'merge-fab__button';
  button.setAttribute('aria-label', `Merge ${count} selected cards`);

  // Create icon (using a merge/combine icon)
  const icon = document.createElement('span');
  icon.className = 'merge-fab__icon';
  // Use two circles merging as icon
  icon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="8" cy="12" r="6"></circle>
      <circle cx="16" cy="12" r="6"></circle>
    </svg>
  `;

  // Create label
  const label = document.createElement('span');
  label.className = 'merge-fab__label';
  label.textContent = `Merge ${count} Cards`;

  // Assemble button
  button.appendChild(icon);
  button.appendChild(label);
  fab.appendChild(button);

  // Add click handler
  button.addEventListener('click', () => {
    if (onMerge) {
      onMerge();
    }
  });

  return {
    element: fab,

    show() {
      fab.classList.add('merge-fab--visible');
    },

    hide() {
      fab.classList.remove('merge-fab--visible');
    },

    updateCount(newCount) {
      label.textContent = `Merge ${newCount} Cards`;
      button.setAttribute('aria-label', `Merge ${newCount} selected cards`);
    },

    destroy() {
      fab.remove();
    }
  };
}
