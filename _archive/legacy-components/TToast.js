/**
 * TerminalToast Web Component
 * Toast notification system with queue management and auto-dismiss
 * Uses toast.css styles
 */

import { TComponent } from './TComponent.js';

export class TToast extends TComponent {
	static get observedAttributes() {
		return ['type', 'message', 'duration', 'dismissible', 'position'];
	}

	constructor() {
		super();

		// Initialize props
		this.setProps({
			type: 'info', // success, error, warning, info
			message: '',
			duration: 5000, // Auto-dismiss timer in ms (0 = no auto-dismiss)
			dismissible: true, // Show close button
			position: 'top-right', // top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
			visible: false,
			id: null,
		});

		// Toast management
		this._dismissTimer = null;
		this._isAnimating = false;
	}

	static get componentClass() {
		return 'terminal-toast-container';
	}

	onAttributeChange(name, oldValue, newValue) {
		switch (name) {
			case 'type':
				this.setProp('type', newValue || 'info');
				break;
			case 'message':
				this.setProp('message', newValue || '');
				break;
			case 'duration':
				this.setProp('duration', parseInt(newValue) || 5000);
				break;
			case 'dismissible':
				this.setProp('dismissible', newValue !== null);
				break;
			case 'position':
				this.setProp('position', newValue || 'top-right');
				break;
		}
	}

	template() {
		const { type, message, dismissible, visible } = this._props;

		if (!message || !visible) {
			return '';
		}

		// Get icon for toast type
		const icon = this.getTypeIcon(type);

		return `
			<div class="toast toast-${type} ${visible ? 'toast-visible' : ''}">
				<div class="toast-content">
					<div class="toast-icon">
						${icon}
					</div>
					<div class="toast-message">
						${this.escapeHtml(message)}
					</div>
					${
						dismissible
							? `
						<button class="toast-close" type="button" aria-label="Close">
							<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
								<path d="M6 4.586L10.293.293a1 1 0 111.414 1.414L7.414 6l4.293 4.293a1 1 0 01-1.414 1.414L6 7.414l-4.293 4.293a1 1 0 01-1.414-1.414L4.586 6 .293 1.707A1 1 0 011.707.293L6 4.586z"/>
							</svg>
						</button>
					`
							: ''
					}
				</div>
			</div>
		`;
	}

	afterRender() {
		const closeBtn = this.$('.toast-close');
		const toast = this.$('.toast');

		// Add close button listener
		if (closeBtn) {
			this.addListener(closeBtn, 'click', () => {
				this.dismiss();
			});
		}

		// Add toast click listener (for additional interactions)
		if (toast) {
			this.addListener(toast, 'click', (e) => {
				if (e.target !== closeBtn) {
					this.emit('toast-click', {
						type: this.getProp('type'),
						message: this.getProp('message'),
						id: this.getProp('id'),
					});
				}
			});
		}

		// Start auto-dismiss timer
		this.startDismissTimer();
	}

	onMount() {
		// Position the toast container
		this.updatePosition();

		// Add to global toast manager if it exists
		if (window.TerminalToastManager) {
			window.TToastManager.addToast(this);
		}
	}

	onUnmount() {
		this.clearDismissTimer();

		// Remove from global toast manager if it exists
		if (window.TerminalToastManager) {
			window.TToastManager.removeToast(this.getProp('id'));
		}
	}

	// Public API Methods

	/**
	 * Show the toast
	 */
	show(options = {}) {
		if (options.message) this.setProp('message', options.message);
		if (options.type) this.setProp('type', options.type);
		if (options.duration !== undefined) this.setProp('duration', options.duration);
		if (options.dismissible !== undefined) this.setProp('dismissible', options.dismissible);

		this.setProp('visible', true);
		this.setProp('id', options.id || this.generateId('toast'));

		this.emit('toast-show', {
			id: this.getProp('id'),
			type: this.getProp('type'),
			message: this.getProp('message'),
		});

		// Trigger entrance animation
		requestAnimationFrame(() => {
			const toast = this.$('.toast');
			if (toast) {
				toast.classList.add('toast-entering');
				setTimeout(() => {
					toast.classList.remove('toast-entering');
				}, 300);
			}
		});

		return this;
	}

	/**
	 * Dismiss the toast
	 */
	dismiss() {
		if (this._isAnimating) return;

		this._isAnimating = true;
		this.clearDismissTimer();

		const toast = this.$('.toast');
		if (toast) {
			toast.classList.add('toast-leaving');

			setTimeout(() => {
				this.setProp('visible', false);
				this._isAnimating = false;

				this.emit('toast-dismiss', {
					id: this.getProp('id'),
					type: this.getProp('type'),
					message: this.getProp('message'),
				});

				// Remove from DOM after animation
				setTimeout(() => {
					if (this.parentNode) {
						this.parentNode.removeChild(this);
					}
				}, 50);
			}, 300);
		} else {
			this.setProp('visible', false);
			this._isAnimating = false;
		}

		return this;
	}

	/**
	 * Update toast message
	 */
	updateMessage(message) {
		this.setProp('message', message);
		// Reset dismiss timer
		this.startDismissTimer();
		return this;
	}

	/**
	 * Update toast type
	 */
	updateType(type) {
		this.setProp('type', type);
		return this;
	}

	// Private Methods

	startDismissTimer() {
		this.clearDismissTimer();

		const duration = this.getProp('duration');
		if (duration > 0 && this.getProp('visible')) {
			this._dismissTimer = setTimeout(() => {
				this.dismiss();
			}, duration);
		}
	}

	clearDismissTimer() {
		if (this._dismissTimer) {
			clearTimeout(this._dismissTimer);
			this._dismissTimer = null;
		}
	}

	updatePosition() {
		const position = this.getProp('position');
		this.className = `terminal-toast-container toast-${position}`;
	}

	getTypeIcon(type) {
		const icons = {
			success: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
				<path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm3.707 5.293a1 1 0 0 0-1.414-1.414L7 7.586 5.707 6.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z"/>
			</svg>`,
			error: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
				<path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 4a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V5a1 1 0 0 0-1-1zm0 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
			</svg>`,
			warning: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
				<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5a.905.905 0 0 0-.9.995l.35 3.507a.553.553 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 5zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
			</svg>`,
			info: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
				<path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm1 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm-1 2a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V7a1 1 0 0 0-1-1z"/>
			</svg>`,
		};

		return icons[type] || icons.info;
	}

	escapeHtml(text) {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	}
}

/**
 * Global Toast Manager
 * Manages toast positioning and queue
 */
class TToastManager {
	constructor() {
		this.toasts = new Map();
		this.containers = new Map();
		this.maxToasts = 5; // Maximum toasts per position
	}

	/**
	 * Show a toast notification
	 */
	show(message, type = 'info', options = {}) {
		const toastOptions = {
			message,
			type,
			id: options.id || `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			duration: options.duration !== undefined ? options.duration : 5000,
			dismissible: options.dismissible !== false,
			position: options.position || 'top-right',
			...options,
		};

		// Create toast element
		const toast = document.createElement('terminal-toast');
		toast.show(toastOptions);

		// Get or create position container
		const container = this.getPositionContainer(toastOptions.position);
		container.appendChild(toast);

		// Manage toast queue for this position
		this.manageQueue(toastOptions.position);

		return toastOptions.id;
	}

	/**
	 * Dismiss a toast by ID
	 */
	dismiss(id) {
		const toast = this.toasts.get(id);
		if (toast) {
			toast.dismiss();
		}
	}

	/**
	 * Dismiss all toasts
	 */
	dismissAll() {
		this.toasts.forEach((toast) => toast.dismiss());
	}

	/**
	 * Add toast to manager
	 */
	addToast(toast) {
		const id = toast.getProp('id');
		if (id) {
			this.toasts.set(id, toast);
		}
	}

	/**
	 * Remove toast from manager
	 */
	removeToast(id) {
		if (id) {
			this.toasts.delete(id);
		}
	}

	getPositionContainer(position) {
		if (!this.containers.has(position)) {
			const container = document.createElement('div');
			container.className = `toast-position-container toast-${position}`;
			document.body.appendChild(container);
			this.containers.set(position, container);
		}
		return this.containers.get(position);
	}

	manageQueue(position) {
		const container = this.containers.get(position);
		if (container) {
			const toasts = container.querySelectorAll('terminal-toast');
			if (toasts.length > this.maxToasts) {
				// Remove oldest toasts
				for (let i = 0; i < toasts.length - this.maxToasts; i++) {
					toasts[i].dismiss();
				}
			}
		}
	}

	// Convenience methods
	success(message, options = {}) {
		return this.show(message, 'success', options);
	}

	error(message, options = {}) {
		return this.show(message, 'error', options);
	}

	warning(message, options = {}) {
		return this.show(message, 'warning', options);
	}

	info(message, options = {}) {
		return this.show(message, 'info', options);
	}
}

// Register the component
customElements.define('t-tst', TToast);

// Create global instance
if (typeof window !== 'undefined' && !window.TToastManager) {
	window.TToastManager = new TToastManager();
}

// Export for module usage
export { TToastManager };
