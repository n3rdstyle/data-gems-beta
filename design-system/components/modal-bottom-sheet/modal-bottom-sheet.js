/**
 * Bottom-Sheet Modal Component
 * Provides show/hide functionality with animation
 */

export class ModalBottomSheet {
  constructor(modalElement) {
    this.modal = modalElement;
    this.overlay = null;
    this.isVisible = false;

    // Bind methods
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
  }

  /**
   * Show the modal
   * @param {boolean} withOverlay - Show backdrop overlay (default: true)
   */
  show(withOverlay = true) {
    if (this.isVisible) return;

    // Show overlay if requested
    if (withOverlay) {
      this.createOverlay();
    }

    // Show modal with animation
    requestAnimationFrame(() => {
      this.modal.classList.add('visible');
      this.isVisible = true;
    });

    // Add escape key listener
    document.addEventListener('keydown', this.handleEscapeKey);

    // Emit custom event
    this.modal.dispatchEvent(new CustomEvent('modal-shown', {
      bubbles: true
    }));
  }

  /**
   * Hide the modal
   */
  hide() {
    if (!this.isVisible) return;

    // Hide modal with animation
    this.modal.classList.remove('visible');
    this.isVisible = false;

    // Remove overlay after animation
    setTimeout(() => {
      this.removeOverlay();
    }, 300); // Match CSS transition duration

    // Remove escape key listener
    document.removeEventListener('keydown', this.handleEscapeKey);

    // Emit custom event
    this.modal.dispatchEvent(new CustomEvent('modal-hidden', {
      bubbles: true
    }));
  }

  /**
   * Toggle modal visibility
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Create backdrop overlay
   */
  createOverlay() {
    if (this.overlay) return;

    this.overlay = document.createElement('div');
    this.overlay.className = 'overlay visible';
    this.overlay.style.zIndex = '1000'; // Below modal (1001)
    this.overlay.addEventListener('click', this.handleOverlayClick);

    document.body.appendChild(this.overlay);
  }

  /**
   * Remove backdrop overlay
   */
  removeOverlay() {
    if (!this.overlay) return;

    this.overlay.classList.remove('visible');
    setTimeout(() => {
      this.overlay.remove();
      this.overlay = null;
    }, 300); // Match overlay fade duration
  }

  /**
   * Handle overlay click - close modal
   */
  handleOverlayClick() {
    this.hide();
  }

  /**
   * Handle escape key - close modal
   */
  handleEscapeKey(event) {
    if (event.key === 'Escape') {
      this.hide();
    }
  }

  /**
   * Destroy the modal instance
   */
  destroy() {
    this.hide();
    document.removeEventListener('keydown', this.handleEscapeKey);
    if (this.overlay) {
      this.overlay.removeEventListener('click', this.handleOverlayClick);
    }
  }
}

/**
 * Helper function to initialize modal from DOM
 * @param {string} selector - CSS selector for modal element
 * @returns {ModalBottomSheet} Modal instance
 */
export function initModal(selector) {
  const modalElement = document.querySelector(selector);
  if (!modalElement) {
    console.error(`Modal not found: ${selector}`);
    return null;
  }
  return new ModalBottomSheet(modalElement);
}

export default ModalBottomSheet;
