/**
 * Center Modal Component
 * Reuses ModalBottomSheet logic but for centered modals
 */

import { ModalBottomSheet } from '../modal-bottom-sheet/modal-bottom-sheet.js';

export class ModalCenter extends ModalBottomSheet {
  /**
   * Show the modal with fade-in animation
   */
  show(withOverlay = true) {
    if (this.isVisible) return;

    // Show overlay
    if (withOverlay) {
      this.createOverlay();
    }

    // Show modal with animation (uses 'visible' class)
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
   * Hide the modal with fade-out animation
   */
  hide() {
    if (!this.isVisible) return;

    // Hide modal
    this.modal.classList.remove('visible');
    this.isVisible = false;

    // Remove overlay after animation
    setTimeout(() => {
      this.removeOverlay();
    }, 200); // Match CSS transition duration

    // Remove escape key listener
    document.removeEventListener('keydown', this.handleEscapeKey);

    // Emit custom event
    this.modal.dispatchEvent(new CustomEvent('modal-hidden', {
      bubbles: true
    }));
  }
}

/**
 * Helper function to initialize modal from DOM
 */
export function initModal(selector) {
  const modalElement = document.querySelector(selector);
  if (!modalElement) {
    console.error(`Modal not found: ${selector}`);
    return null;
  }
  return new ModalCenter(modalElement);
}

export default ModalCenter;
