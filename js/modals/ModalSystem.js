/**
 * Modal System
 * Manages all modals and their interactions
 */
import { stateManager } from '../core/StateManager.js';
import logger from '../utils/logger.js';
import { Modal } from './Modal.js';

export class ModalSystem {
	constructor() {
		this.modals = new Map();
		this.activeModal = null;
		this.modalStack = [];
		this.initialized = false;

		// Subscribe to modal state changes
		this.unsubscribe = stateManager.subscribe('ui.modals', (state) => {
			this.syncModals(state);
		});
	}

	/**
	 * Initialize the modal system
	 */
	init() {
		if (this.initialized) return;

		// Add global escape key handler for modal stack
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && this.activeModal) {
				const topModal = this.modalStack[this.modalStack.length - 1];
				if (topModal && topModal.options.closeOnEscape) {
					topModal.close();
				}
			}
		});

		this.initialized = true;
		logger.info('[ModalSystem] Initialized');
	}

	/**
	 * Register a modal
	 */
	register(modal) {
		if (!(modal instanceof Modal)) {
			throw new Error('Modal must be an instance of Modal class');
		}

		this.modals.set(modal.id, modal);
		logger.info(`[ModalSystem] Registered modal: ${modal.id}`);

		return modal;
	}

	/**
	 * Create and register a modal
	 */
	createModal(id, options = {}) {
		const modal = new Modal(id, options);
		this.register(modal);
		return modal;
	}

	/**
	 * Get a modal by ID
	 */
	getModal(id) {
		return this.modals.get(id);
	}

	/**
	 * Open a modal
	 */
	openModal(id, data = null) {
		const modal = this.modals.get(id);
		if (!modal) {
			logger.warn(`[ModalSystem] Modal not found: ${id}`);
			return;
		}

		// Close current modal if not stacking
		if (this.activeModal && !this.isStacking) {
			this.activeModal.close();
		}

		// Add to stack
		if (!this.modalStack.includes(modal)) {
			this.modalStack.push(modal);
		}

		// Set as active
		this.activeModal = modal;

		// Pass data if provided
		if (data && typeof modal.setData === 'function') {
			modal.setData(data);
		}

		// Open the modal
		modal.open();

		logger.info(`[ModalSystem] Opened modal: ${id}`);
	}

	/**
	 * Close a modal
	 */
	closeModal(id) {
		const modal = this.modals.get(id);
		if (modal) {
			modal.close();

			// Remove from stack
			const index = this.modalStack.indexOf(modal);
			if (index > -1) {
				this.modalStack.splice(index, 1);
			}

			// Update active modal
			if (this.activeModal === modal) {
				this.activeModal = this.modalStack[this.modalStack.length - 1] || null;
			}

			logger.info(`[ModalSystem] Closed modal: ${id}`);
		}
	}

	/**
	 * Close all modals
	 */
	closeAll() {
		// Close in reverse order (top to bottom)
		[...this.modalStack].reverse().forEach((modal) => {
			modal.close();
		});

		this.modalStack = [];
		this.activeModal = null;

		logger.info('[ModalSystem] Closed all modals');
	}

	/**
	 * Check if any modal is open
	 */
	hasOpenModals() {
		return this.modalStack.length > 0;
	}

	/**
	 * Get the current active modal
	 */
	getActiveModal() {
		return this.activeModal;
	}

	/**
	 * Create a confirmation modal
	 */
	confirm(options = {}) {
		return new Promise((resolve) => {
			const confirmId = `confirm-${Date.now()}`;

			const modal = this.createModal(confirmId, {
				title: options.title || 'Confirm',
				size: options.size || 'small',
				closable: options.closable !== false,
				closeOnBackdrop: false,
				closeOnEscape: options.closeOnEscape !== false,
			});

			// Set content
			modal.setBody(options.message || 'Are you sure?');

			// Add action buttons
			modal.addActions([
				{
					label: options.cancelLabel || 'Cancel',
					className: 'btn-secondary',
					onClick: () => {
						modal.close();
						this.destroyModal(confirmId);
						resolve(false);
					},
				},
				{
					label: options.confirmLabel || 'Confirm',
					className: options.confirmClass || 'btn-primary',
					onClick: () => {
						modal.close();
						this.destroyModal(confirmId);
						resolve(true);
					},
				},
			]);

			// Open the modal
			modal.open();
		});
	}

	/**
	 * Create an alert modal
	 */
	alert(options = {}) {
		return new Promise((resolve) => {
			const alertId = `alert-${Date.now()}`;

			const modal = this.createModal(alertId, {
				title: options.title || 'Alert',
				size: options.size || 'small',
				closable: true,
				closeOnBackdrop: true,
				closeOnEscape: true,
			});

			// Set content
			modal.setBody(options.message || '');

			// Add action button
			modal.addActions([
				{
					label: options.buttonLabel || 'OK',
					className: 'btn-primary',
					onClick: () => {
						modal.close();
						this.destroyModal(alertId);
						resolve();
					},
				},
			]);

			// Open the modal
			modal.open();
		});
	}

	/**
	 * Create a prompt modal
	 */
	prompt(options = {}) {
		return new Promise((resolve) => {
			const promptId = `prompt-${Date.now()}`;

			const modal = this.createModal(promptId, {
				title: options.title || 'Input',
				size: options.size || 'small',
				closable: true,
				closeOnBackdrop: false,
				closeOnEscape: true,
			});

			// Create input field
			const inputId = `prompt-input-${Date.now()}`;
			const inputHTML = `
				<div class="form-group">
					${options.label ? `<label for="${inputId}">${options.label}</label>` : ''}
					<input 
						type="${options.type || 'text'}" 
						id="${inputId}"
						class="form-control" 
						placeholder="${options.placeholder || ''}"
						value="${options.defaultValue || ''}"
					/>
				</div>
			`;

			modal.setBody(inputHTML);

			// Get input element
			const input = modal.bodyElement.querySelector(`#${inputId}`);

			// Add action buttons
			modal.addActions([
				{
					label: options.cancelLabel || 'Cancel',
					className: 'btn-secondary',
					onClick: () => {
						modal.close();
						this.destroyModal(promptId);
						resolve(null);
					},
				},
				{
					label: options.submitLabel || 'Submit',
					className: 'btn-primary',
					onClick: () => {
						const value = input.value;
						modal.close();
						this.destroyModal(promptId);
						resolve(value);
					},
				},
			]);

			// Open the modal and focus input
			modal.open();
			setTimeout(() => input.focus(), 100);
		});
	}

	/**
	 * Sync modals with state
	 */
	syncModals(state) {
		if (!(state instanceof Map)) return;

		state.forEach((modalState, modalId) => {
			const modal = this.modals.get(modalId);
			if (modal && modalState instanceof Map) {
				const visible = modalState.get('visible');
				if (visible && !modal.isOpen) {
					this.openModal(modalId);
				} else if (!visible && modal.isOpen) {
					this.closeModal(modalId);
				}
			}
		});
	}

	/**
	 * Destroy a modal
	 */
	destroyModal(id) {
		const modal = this.modals.get(id);
		if (modal) {
			modal.destroy();
			this.modals.delete(id);

			// Remove from stack
			const index = this.modalStack.indexOf(modal);
			if (index > -1) {
				this.modalStack.splice(index, 1);
			}

			// Update active modal
			if (this.activeModal === modal) {
				this.activeModal = this.modalStack[this.modalStack.length - 1] || null;
			}

			logger.info(`[ModalSystem] Destroyed modal: ${id}`);
		}
	}

	/**
	 * Destroy all modals
	 */
	destroyAll() {
		this.modals.forEach((modal) => modal.destroy());
		this.modals.clear();
		this.modalStack = [];
		this.activeModal = null;
	}

	/**
	 * Destroy the modal system
	 */
	destroy() {
		// Unsubscribe from state
		if (this.unsubscribe) {
			this.unsubscribe();
		}

		// Destroy all modals
		this.destroyAll();

		this.initialized = false;
		logger.info('[ModalSystem] Destroyed');
	}
}

// Create singleton instance
export const modalSystem = new ModalSystem();
