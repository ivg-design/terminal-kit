/**
 * Base Modal Class
 * Foundation for all modal dialogs
 */
import { stateManager } from '../core/StateManager.js';

export class Modal {
	constructor(id, options = {}) {
		this.id = id;
		this.element = null;
		this.backdropElement = null;
		this.isOpen = false;
		this.isClosing = false;

		// Default options
		this.options = {
			title: options.title || '',
			closable: options.closable !== false,
			closeOnBackdrop: options.closeOnBackdrop !== false,
			closeOnEscape: options.closeOnEscape !== false,
			size: options.size || 'medium', // small, medium, large, full
			className: options.className || '',
			statePath: options.statePath || `ui.modals.${id}`,
			...options,
		};

		// Subscribe to state changes
		this.unsubscribe = stateManager.subscribe(this.options.statePath, (state) => {
			if (state instanceof Map) {
				const visible = state.get('visible');
				if (visible && !this.isOpen) {
					this.open();
				} else if (!visible && this.isOpen) {
					this.close();
				}
			}
		});

		// Bind escape key handler
		this.handleEscape = (e) => {
			if (e.key === 'Escape' && this.options.closeOnEscape) {
				this.close();
			}
		};
	}

	/**
	 * Create modal DOM elements
	 */
	create() {
		if (this.element) return this.element;

		// Create backdrop
		this.backdropElement = document.createElement('div');
		this.backdropElement.className = 'modal-backdrop';
		this.backdropElement.dataset.modalId = this.id;

		if (this.options.closeOnBackdrop) {
			this.backdropElement.addEventListener('click', (e) => {
				if (e.target === this.backdropElement) {
					this.close();
				}
			});
		}

		// Create modal container
		this.element = document.createElement('div');
		this.element.className =
			`modal modal-${this.options.size} ${this.options.className}`.trim();
		this.element.id = `modal-${this.id}`;
		this.element.dataset.modalId = this.id;

		// Create modal content structure
		this.element.innerHTML = `
			<div class="modal-header">
				<h2 class="modal-title">${this.options.title}</h2>
				${
					this.options.closable
						? `
					<button class="btn btn-icon modal-close" aria-label="Close">
						<span aria-hidden="true">×</span>
					</button>
				`
						: ''
				}
			</div>
			<div class="modal-body"></div>
			<div class="modal-footer"></div>
		`;

		// Attach close button handler
		if (this.options.closable) {
			const closeBtn = this.element.querySelector('.modal-close');
			if (closeBtn) {
				closeBtn.addEventListener('click', () => this.close());
			}
		}

		// Store references
		this.headerElement = this.element.querySelector('.modal-header');
		this.bodyElement = this.element.querySelector('.modal-body');
		this.footerElement = this.element.querySelector('.modal-footer');

		// Append modal to backdrop
		this.backdropElement.appendChild(this.element);

		// Lifecycle hook
		this.onCreate();

		return this.element;
	}

	/**
	 * Open modal
	 */
	open() {
		if (this.isOpen) return;

		// Create if not exists
		if (!this.element) {
			this.create();
		}

		// Add to DOM
		document.body.appendChild(this.backdropElement);

		// Force reflow for animation
		this.backdropElement.offsetHeight;

		// Add open classes
		this.backdropElement.classList.add('modal-backdrop-open');
		this.element.classList.add('modal-open');

		// Add escape key listener
		if (this.options.closeOnEscape) {
			document.addEventListener('keydown', this.handleEscape);
		}

		// Prevent body scroll
		document.body.style.overflow = 'hidden';

		// Update state
		this.isOpen = true;
		stateManager.set(`${this.options.statePath}.visible`, true);

		// Focus first focusable element
		this.focusFirstElement();

		// Lifecycle hook
		this.onOpen();
	}

	/**
	 * Close modal
	 */
	close() {
		if (!this.isOpen || this.isClosing) return;

		this.isClosing = true;

		// Remove open classes
		this.backdropElement.classList.remove('modal-backdrop-open');
		this.element.classList.remove('modal-open');

		// Add closing classes for animation
		this.backdropElement.classList.add('modal-backdrop-closing');
		this.element.classList.add('modal-closing');

		// Remove after animation
		setTimeout(() => {
			if (this.backdropElement && this.backdropElement.parentNode) {
				this.backdropElement.parentNode.removeChild(this.backdropElement);
			}

			// Restore body scroll
			document.body.style.overflow = '';

			// Remove escape key listener
			if (this.options.closeOnEscape) {
				document.removeEventListener('keydown', this.handleEscape);
			}

			// Update state
			this.isOpen = false;
			this.isClosing = false;
			stateManager.set(`${this.options.statePath}.visible`, false);

			// Lifecycle hook
			this.onClose();
		}, 300); // Match CSS transition duration
	}

	/**
	 * Set modal title
	 */
	setTitle(title) {
		const titleElement = this.element?.querySelector('.modal-title');
		if (titleElement) {
			titleElement.textContent = title;
		}
		this.options.title = title;
	}

	/**
	 * Set modal body content
	 */
	setBody(content) {
		if (!this.bodyElement) return;

		if (typeof content === 'string') {
			this.bodyElement.innerHTML = content;
		} else if (content instanceof HTMLElement) {
			this.bodyElement.innerHTML = '';
			this.bodyElement.appendChild(content);
		}
	}

	/**
	 * Set modal footer content
	 */
	setFooter(content) {
		if (!this.footerElement) return;

		if (typeof content === 'string') {
			this.footerElement.innerHTML = content;
		} else if (content instanceof HTMLElement) {
			this.footerElement.innerHTML = '';
			this.footerElement.appendChild(content);
		} else if (content === null) {
			this.footerElement.style.display = 'none';
		}
	}

	/**
	 * Add action buttons to footer
	 */
	addActions(actions = []) {
		if (!this.footerElement) return;

		this.footerElement.innerHTML = '';
		this.footerElement.style.display = '';

		const buttonContainer = document.createElement('div');
		buttonContainer.className = 'modal-actions';

		actions.forEach((action) => {
			const button = document.createElement('button');
			button.className = `btn ${action.className || ''}`.trim();
			button.textContent = action.label;

			if (action.onClick) {
				button.addEventListener('click', (e) => {
					action.onClick(e, this);
				});
			}

			buttonContainer.appendChild(button);
		});

		this.footerElement.appendChild(buttonContainer);
	}

	/**
	 * Focus first focusable element
	 */
	focusFirstElement() {
		const focusableElements = this.element?.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);

		if (focusableElements && focusableElements.length > 0) {
			focusableElements[0].focus();
		}
	}

	/**
	 * Show loading state
	 */
	showLoading(message = 'Loading...') {
		this.setBody(`
			<div class="modal-loading">
				<div class="loading-spinner"></div>
				<div class="loading-text">${message}</div>
			</div>
		`);
	}

	/**
	 * Show error state
	 */
	showError(message) {
		this.setBody(`
			<div class="modal-error">
				<div class="error-icon">!</div>
				<div class="error-message">${message}</div>
			</div>
		`);
	}

	/**
	 * Lifecycle hooks
	 */
	onCreate() {}
	onOpen() {}
	onClose() {}

	/**
	 * Destroy modal
	 */
	destroy() {
		// Close if open
		if (this.isOpen) {
			this.close();
		}

		// Unsubscribe from state
		if (this.unsubscribe) {
			this.unsubscribe();
		}

		// Remove from DOM if exists
		if (this.backdropElement && this.backdropElement.parentNode) {
			this.backdropElement.parentNode.removeChild(this.backdropElement);
		}

		// Clear references
		this.element = null;
		this.backdropElement = null;
		this.headerElement = null;
		this.bodyElement = null;
		this.footerElement = null;
	}
}
