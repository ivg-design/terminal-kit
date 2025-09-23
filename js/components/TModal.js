/**
 * TerminalModal Web Component
 * A modal component that can house multiple panels with various layout modes
 * Extends TerminalComponent base class for consistency
 */

import { TComponent } from './TComponent.js';

export class TModal extends TComponent {
	static get observedAttributes() {
		return ['layout', 'title', 'backdrop-close', 'escape-close', 'size', 'visible'];
	}

	constructor() {
		super();

		// Initialize props
		this.setProps({
			layout: 'single', // single, 2-column, 2x2, 1-2-1, 2-1
			title: '',
			backdropClose: true,
			escapeClose: true,
			size: 'lg', // sm, md, lg, xl, full
			panels: [],
			visible: false,
		});

		// Bind methods to preserve context
		this._handleBackdropClick = this._handleBackdropClick.bind(this);
		this._handleKeyPress = this._handleKeyPress.bind(this);
		this._handleCloseClick = this._handleCloseClick.bind(this);
	}

	get componentClass() {
		return 'terminal-modal';
	}

	onAttributeChange(name, oldValue, newValue) {
		switch (name) {
			case 'layout':
				this.setProp('layout', newValue || 'single');
				break;
			case 'title':
				this.setProp('title', newValue || '');
				break;
			case 'backdrop-close':
				this.setProp('backdropClose', newValue !== 'false');
				break;
			case 'escape-close':
				this.setProp('escapeClose', newValue !== 'false');
				break;
			case 'size':
				this.setProp('size', newValue || 'lg');
				break;
			case 'visible':
				if (newValue !== null) {
					this.show();
				} else {
					this.hide();
				}
				break;
		}
	}

	template() {
		const { layout, title, size, visible, panels } = this._props;

		const modalClasses = ['modal', `modal-${size}`, 'terminal-modal-content'];
		const backdropClasses = ['modal-backdrop', 'terminal-modal-backdrop'];

		if (visible) {
			backdropClasses.push('open');
		}

		return `
			<div class="${backdropClasses.join(' ')}">
				<div class="${modalClasses.join(' ')}" role="dialog" aria-modal="true" ${title ? `aria-labelledby="modal-title-${this.generateId()}"` : ''}>
					${this._renderHeader()}
					<div class="modal-body terminal-modal-body">
						${this._renderLayout()}
					</div>
				</div>
			</div>
		`;
	}

	_renderHeader() {
		const { title } = this._props;

		return `
			<div class="modal-header terminal-modal-header">
				<div class="modal-title terminal-modal-title" ${title ? `id="modal-title-${this.generateId()}"` : ''}>
					${title || 'Modal'}
				</div>
				<terminal-button
					class="modal-close terminal-modal-close"
					size="large"
					type="icon"
					variant="danger"
					aria-label="Close modal">
				</terminal-button>
			</div>
		`;
	}

	_renderLayout() {
		const { layout, panels } = this._props;

		const layoutClasses = ['terminal-modal-layout', `layout-${layout}`];

		switch (layout) {
			case 'single':
				return this._renderSingleLayout();
			case '2-column':
				return this._renderTwoColumnLayout();
			case '2x2':
				return this._render2x2Layout();
			case '1-2-1':
				return this._render121Layout();
			case '2-1':
				return this._render21Layout();
			default:
				return this._renderSingleLayout();
		}
	}

	_renderSingleLayout() {
		return `
			<div class="terminal-modal-layout layout-single">
				<div class="modal-panel panel-main">
					<slot name="main"></slot>
				</div>
			</div>
		`;
	}

	_renderTwoColumnLayout() {
		return `
			<div class="terminal-modal-layout layout-2-column">
				<div class="modal-panel panel-left">
					<slot name="left"></slot>
				</div>
				<div class="modal-panel panel-right">
					<slot name="right"></slot>
				</div>
			</div>
		`;
	}

	_render2x2Layout() {
		return `
			<div class="terminal-modal-layout layout-2x2">
				<div class="modal-panel panel-top-left">
					<slot name="top-left"></slot>
				</div>
				<div class="modal-panel panel-top-right">
					<slot name="top-right"></slot>
				</div>
				<div class="modal-panel panel-bottom-left">
					<slot name="bottom-left"></slot>
				</div>
				<div class="modal-panel panel-bottom-right">
					<slot name="bottom-right"></slot>
				</div>
			</div>
		`;
	}

	_render121Layout() {
		return `
			<div class="terminal-modal-layout layout-1-2-1">
				<div class="modal-panel panel-top">
					<slot name="top"></slot>
				</div>
				<div class="modal-row">
					<div class="modal-panel panel-middle-left">
						<slot name="middle-left"></slot>
					</div>
					<div class="modal-panel panel-middle-right">
						<slot name="middle-right"></slot>
					</div>
				</div>
				<div class="modal-panel panel-bottom">
					<slot name="bottom"></slot>
				</div>
			</div>
		`;
	}

	_render21Layout() {
		return `
			<div class="terminal-modal-layout layout-2-1">
				<div class="modal-row">
					<div class="modal-panel panel-top-left">
						<slot name="top-left"></slot>
					</div>
					<div class="modal-panel panel-top-right">
						<slot name="top-right"></slot>
					</div>
				</div>
				<div class="modal-panel panel-bottom">
					<slot name="bottom"></slot>
				</div>
			</div>
		`;
	}

	afterRender() {
		this._bindEvents();
		this._setupCloseButton();
	}

	_setupCloseButton() {
		// Set the X icon for the close button
		const closeBtn = this.$('.terminal-modal-close');
		if (closeBtn && closeBtn.setIcon) {
			// Using the X icon - we'll need to create a simple inline SVG
			const xIcon = `<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
				<path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>
			</svg>`;
			closeBtn.setIcon(xIcon);
		}
	}

	_bindEvents() {
		// Backdrop click
		const backdrop = this.$('.terminal-modal-backdrop');
		if (backdrop) {
			this.addListener(backdrop, 'click', this._handleBackdropClick);
		}

		// Close button - now listening for the custom button-click event
		const closeBtn = this.$('.terminal-modal-close');
		if (closeBtn) {
			this.addListener(closeBtn, 'button-click', this._handleCloseClick);
		}

		// Keyboard events
		if (this._props.visible) {
			this.addListener(document, 'keydown', this._handleKeyPress);
		}
	}

	_handleBackdropClick(e) {
		// Only close if clicking the backdrop itself, not the modal content
		if (e.target.classList.contains('terminal-modal-backdrop') && this._props.backdropClose) {
			this.close();
		}
	}

	_handleCloseClick(e) {
		e.preventDefault();
		this.close();
	}

	_handleKeyPress(e) {
		if (e.key === 'Escape' && this._props.escapeClose && this._props.visible) {
			this.close();
		}
	}

	// Public API Methods
	show() {
		this.setProp('visible', true);
		// Don't set attribute if already set (avoids infinite loop)
		if (!this.hasAttribute('visible')) {
			this.setAttribute('visible', '');
		}

		// Focus management
		const modal = this.$('.terminal-modal-content');
		if (modal) {
			modal.focus();
		}

		// Prevent body scroll
		document.body.style.overflow = 'hidden';

		this.emit('modal-show');
		return this;
	}

	hide() {
		this.setProp('visible', false);
		// Only remove attribute if it exists (avoids infinite loop)
		if (this.hasAttribute('visible')) {
			this.removeAttribute('visible');
		}

		// Restore body scroll
		document.body.style.overflow = '';

		this.emit('modal-hide');
		return this;
	}

	close() {
		const event = this.emit('modal-before-close');
		if (!event.defaultPrevented) {
			this.hide();
			this.emit('modal-close');
		}
		return this;
	}

	toggle() {
		if (this._props.visible) {
			this.close();
		} else {
			this.show();
		}
		return this;
	}

	setLayout(layout) {
		const validLayouts = ['single', '2-column', '2x2', '1-2-1', '2-1'];
		if (validLayouts.includes(layout)) {
			this.setProp('layout', layout);
			this.setAttribute('layout', layout);
		}
		return this;
	}

	setTitle(title) {
		this.setProp('title', title);
		this.setAttribute('title', title);
		return this;
	}

	setSize(size) {
		const validSizes = ['sm', 'md', 'lg', 'xl', 'full'];
		if (validSizes.includes(size)) {
			this.setProp('size', size);
			this.setAttribute('size', size);
		}
		return this;
	}

	setBackdropClose(enabled) {
		this.setProp('backdropClose', enabled);
		if (enabled) {
			this.setAttribute('backdrop-close', 'true');
		} else {
			this.setAttribute('backdrop-close', 'false');
		}
		return this;
	}

	setEscapeClose(enabled) {
		this.setProp('escapeClose', enabled);
		if (enabled) {
			this.setAttribute('escape-close', 'true');
		} else {
			this.setAttribute('escape-close', 'false');
		}
		return this;
	}

	// Panel content management
	setPanelContent(slotName, content) {
		const slot = this.$(`slot[name="${slotName}"]`);
		if (slot) {
			// Create a wrapper element to hold the content
			const wrapper = document.createElement('div');
			wrapper.innerHTML = content;

			// Replace slot with content
			const parent = slot.parentNode;
			while (wrapper.firstChild) {
				parent.insertBefore(wrapper.firstChild, slot);
			}
			slot.remove();
		}
		return this;
	}

	clearPanel(slotName) {
		this.setPanelContent(slotName, '');
		return this;
	}

	// Utility methods
	isVisible() {
		return this._props.visible;
	}

	getLayout() {
		return this._props.layout;
	}

	getSize() {
		return this._props.size;
	}

	// Loading state
	showLoading() {
		const modal = this.$('.terminal-modal-content');
		if (modal) {
			modal.classList.add('modal-loading');
		}
		return this;
	}

	hideLoading() {
		const modal = this.$('.terminal-modal-content');
		if (modal) {
			modal.classList.remove('modal-loading');
		}
		return this;
	}

	// Lifecycle hooks
	onMount() {
		// If visible attribute is set on mount, show the modal
		if (this.hasAttribute('visible')) {
			this.show();
		} else {
			this.setProp('visible', false);
		}
	}

	onUnmount() {
		// Restore body scroll when modal is destroyed
		document.body.style.overflow = '';

		// Remove global keyboard listener
		this.removeListener(document, 'keydown', this._handleKeyPress);
	}

	// Custom emit that can be prevented
	emit(eventName, detail = {}) {
		const event = new CustomEvent(eventName, {
			detail,
			bubbles: true,
			composed: true,
			cancelable: true,
		});

		this.dispatchEvent(event);
		return event;
	}
}

// Register the component
customElements.define('t-mdl', TModal);
