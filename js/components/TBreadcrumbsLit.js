// ============================================================
// SECTION 1: IMPORTS (REQUIRED)
// ============================================================
import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';

// ============================================================
// SECTION 2: COMPONENT CLASS DECLARATION (REQUIRED)
// ============================================================
/**
 * @component TBreadcrumbsLit
 * @tagname t-bread
 * @description Navigation breadcrumb trail with multiple style variants and separator options.
 * @category Navigation
 * @since 1.0.0
 * @example
 * <t-bread .items=${[{label: 'Home', href: '/'}, {label: 'Products'}, {label: 'Item'}]}></t-bread>
 * <t-bread variant="arrows" .items=${items}></t-bread>
 * <t-bread variant="pills" .items=${items}></t-bread>
 */
export class TBreadcrumbsLit extends LitElement {
	// ----------------------------------------------------------
	// BLOCK 1: STATIC METADATA (REQUIRED)
	// ----------------------------------------------------------
	static tagName = 't-bread';
	static version = '1.0.0';
	static category = 'Navigation';

	// ----------------------------------------------------------
	// BLOCK 2: STATIC STYLES (REQUIRED)
	// ----------------------------------------------------------
	static styles = css`
		/**
		 * TBreadcrumbsLit Component Styles
		 * Navigation breadcrumbs with terminal styling
		 */

		/* Host styles */
		:host {
			display: block;
			--bread-bg: transparent;
			--bread-color: var(--terminal-gray-light, #888);
			--bread-active: var(--terminal-green, #00ff41);
			--bread-hover: var(--terminal-cyan, #00ffff);
			--bread-separator: var(--terminal-gray, #666);
			--bread-glow: rgba(0, 255, 65, 0.2);
		}

		:host([hidden]) {
			display: none !important;
		}

		/* Container */
		.breadcrumbs {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			gap: 4px;
			font-family: var(--font-mono, 'Courier New', monospace);
			font-size: 12px;
			background: var(--bread-bg);
		}

		/* Breadcrumb item */
		.breadcrumb-item {
			display: inline-flex;
			align-items: center;
			gap: 4px;
			color: var(--bread-color);
			text-decoration: none;
			transition: all 0.2s ease;
		}

		.breadcrumb-item[href]:hover {
			color: var(--bread-hover);
			text-shadow: 0 0 8px var(--bread-glow);
		}

		.breadcrumb-item.current {
			color: var(--bread-active);
			font-weight: 600;
		}

		/* Separator */
		.separator {
			color: var(--bread-separator);
			display: inline-flex;
			align-items: center;
			user-select: none;
		}

		.separator svg {
			width: 12px;
			height: 12px;
			fill: currentColor;
		}

		/* Icon */
		.breadcrumb-icon {
			display: inline-flex;
			width: 14px;
			height: 14px;
		}

		.breadcrumb-icon svg {
			width: 100%;
			height: 100%;
			fill: currentColor;
		}

		/* Size variants */
		:host([size="sm"]) .breadcrumbs {
			font-size: 10px;
			gap: 2px;
		}

		:host([size="sm"]) .breadcrumb-icon {
			width: 12px;
			height: 12px;
		}

		:host([size="sm"]) .separator svg {
			width: 10px;
			height: 10px;
		}

		:host([size="lg"]) .breadcrumbs {
			font-size: 14px;
			gap: 6px;
		}

		:host([size="lg"]) .breadcrumb-icon {
			width: 16px;
			height: 16px;
		}

		:host([size="lg"]) .separator svg {
			width: 14px;
			height: 14px;
		}

		/* ========== VARIANT: default (slash separator) ========== */
		:host([variant="default"]) .separator::after {
			content: '/';
			padding: 0 4px;
		}

		/* ========== VARIANT: arrows (chevron separator) ========== */
		:host([variant="arrows"]) .separator {
			padding: 0 2px;
		}

		/* ========== VARIANT: dots (dot separator) ========== */
		:host([variant="dots"]) .separator::after {
			content: '•';
			padding: 0 6px;
		}

		/* ========== VARIANT: dashes (dash separator) ========== */
		:host([variant="dashes"]) .separator::after {
			content: '—';
			padding: 0 6px;
		}

		/* ========== VARIANT: brackets (terminal style) ========== */
		:host([variant="brackets"]) .breadcrumb-item {
			padding: 2px 0;
		}

		:host([variant="brackets"]) .breadcrumb-item::before {
			content: '[';
			color: var(--bread-separator);
		}

		:host([variant="brackets"]) .breadcrumb-item::after {
			content: ']';
			color: var(--bread-separator);
		}

		:host([variant="brackets"]) .separator {
			display: none;
		}

		/* ========== VARIANT: pills (button-like) ========== */
		:host([variant="pills"]) .breadcrumbs {
			gap: 4px;
		}

		:host([variant="pills"]) .breadcrumb-item {
			padding: 4px 10px;
			background: var(--terminal-gray-dark, #2a2a2a);
			border: 1px solid var(--terminal-gray, #444);
			border-radius: 16px;
		}

		:host([variant="pills"]) .breadcrumb-item[href]:hover {
			border-color: var(--bread-hover);
			background: rgba(0, 255, 255, 0.1);
		}

		:host([variant="pills"]) .breadcrumb-item.current {
			background: var(--bread-active);
			color: var(--terminal-black, #0a0a0a);
			border-color: var(--bread-active);
		}

		:host([variant="pills"]) .separator {
			display: none;
		}

		/* ========== VARIANT: path (file path style) ========== */
		:host([variant="path"]) .breadcrumbs::before {
			content: '>';
			color: var(--bread-active);
			margin-right: 4px;
		}

		:host([variant="path"]) .separator::after {
			content: '/';
			padding: 0 2px;
		}

		:host([variant="path"]) .breadcrumb-item {
			font-family: var(--font-mono, monospace);
		}

		/* ========== VARIANT: steps (numbered) ========== */
		:host([variant="steps"]) .breadcrumbs {
			counter-reset: step;
		}

		:host([variant="steps"]) .breadcrumb-item {
			display: inline-flex;
			align-items: center;
			gap: 6px;
		}

		:host([variant="steps"]) .breadcrumb-item::before {
			counter-increment: step;
			content: counter(step);
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 20px;
			height: 20px;
			border-radius: 50%;
			background: var(--terminal-gray-dark, #2a2a2a);
			border: 1px solid var(--bread-separator);
			font-size: 10px;
			font-weight: 700;
		}

		:host([variant="steps"]) .breadcrumb-item.current::before {
			background: var(--bread-active);
			color: var(--terminal-black, #0a0a0a);
			border-color: var(--bread-active);
		}

		:host([variant="steps"]) .separator {
			flex: 0 0 24px;
			height: 1px;
			background: var(--bread-separator);
			margin: 0 4px;
		}

		:host([variant="steps"]) .separator::after {
			display: none;
		}

		/* ========== VARIANT: underline (minimal underlined) ========== */
		:host([variant="underline"]) .breadcrumb-item[href] {
			border-bottom: 1px dashed var(--bread-separator);
			padding-bottom: 2px;
		}

		:host([variant="underline"]) .breadcrumb-item[href]:hover {
			border-bottom-color: var(--bread-hover);
			border-bottom-style: solid;
		}

		:host([variant="underline"]) .breadcrumb-item.current {
			border-bottom: 2px solid var(--bread-active);
			padding-bottom: 1px;
		}

		:host([variant="underline"]) .separator::after {
			content: '›';
			padding: 0 8px;
		}

		/* Collapsed state */
		.collapsed-indicator {
			color: var(--bread-separator);
			cursor: pointer;
			padding: 2px 6px;
		}

		.collapsed-indicator:hover {
			color: var(--bread-hover);
		}

		/* Disabled state */
		:host([disabled]) {
			opacity: 0.5;
			pointer-events: none;
		}
	`;

	// ----------------------------------------------------------
	// BLOCK 3: REACTIVE PROPERTIES (REQUIRED)
	// ----------------------------------------------------------
	static properties = {
		/**
		 * Array of breadcrumb items
		 * @property items
		 * @type {Array<{label: string, href?: string, icon?: string}>}
		 * @default []
		 */
		items: { type: Array },

		/**
		 * Visual variant style
		 * @property variant
		 * @type {'default'|'arrows'|'dots'|'dashes'|'brackets'|'pills'|'path'|'steps'|'underline'}
		 * @default 'default'
		 * @attribute variant
		 * @reflects true
		 */
		variant: { type: String, reflect: true },

		/**
		 * Size variant
		 * @property size
		 * @type {'sm'|'md'|'lg'}
		 * @default 'md'
		 * @attribute size
		 * @reflects true
		 */
		size: { type: String, reflect: true },

		/**
		 * Custom separator character/string
		 * @property separator
		 * @type {string}
		 * @default ''
		 */
		separator: { type: String },

		/**
		 * Maximum items to show before collapsing
		 * @property maxItems
		 * @type {number}
		 * @default 0 (no collapse)
		 * @attribute max-items
		 */
		maxItems: { type: Number, attribute: 'max-items' },

		/**
		 * Disabled state
		 * @property disabled
		 * @type {Boolean}
		 * @default false
		 * @attribute disabled
		 * @reflects true
		 */
		disabled: { type: Boolean, reflect: true }
	};

	// ----------------------------------------------------------
	// BLOCK 4: INTERNAL STATE (REQUIRED)
	// ----------------------------------------------------------
	/** @private - Expanded state when collapsed */
	_expanded = false;

	// ----------------------------------------------------------
	// BLOCK 5: LOGGER INSTANCE (REQUIRED)
	// ----------------------------------------------------------
	/** @private */
	_logger = null;

	// ----------------------------------------------------------
	// BLOCK 6: CONSTRUCTOR (REQUIRED)
	// ----------------------------------------------------------
	constructor() {
		super();
		this.items = [];
		this.variant = 'default';
		this.size = 'md';
		this.separator = '';
		this.maxItems = 0;
		this.disabled = false;

		this._logger = componentLogger.for('TBreadcrumbsLit');
		this._logger.debug('Component constructed');
	}

	// ----------------------------------------------------------
	// BLOCK 7: LIFECYCLE METHODS (REQUIRED)
	// ----------------------------------------------------------
	connectedCallback() {
		super.connectedCallback();
		this._logger.info('Connected to DOM');
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._logger.info('Disconnected from DOM');
	}

	firstUpdated() {
		this._logger.debug('First update complete');
	}

	updated(changedProperties) {
		this._logger.trace('Updated', { changedProperties: [...changedProperties.keys()] });
	}

	// ----------------------------------------------------------
	// BLOCK 8: PUBLIC API METHODS
	// ----------------------------------------------------------
	/**
	 * Navigate to a specific breadcrumb item
	 * @public
	 * @param {number} index - Index of the item to navigate to
	 * @fires breadcrumb-navigate
	 */
	navigateTo(index) {
		this._logger.debug('navigateTo called', { index });
		const item = this.items[index];
		if (item) {
			this._emitEvent('breadcrumb-navigate', { index, item });
		}
	}

	/**
	 * Expand collapsed breadcrumbs
	 * @public
	 */
	expand() {
		this._logger.debug('expand called');
		this._expanded = true;
		this.requestUpdate();
	}

	/**
	 * Collapse breadcrumbs
	 * @public
	 */
	collapse() {
		this._logger.debug('collapse called');
		this._expanded = false;
		this.requestUpdate();
	}

	// ----------------------------------------------------------
	// BLOCK 9: EVENT EMITTERS
	// ----------------------------------------------------------
	/**
	 * Emit a custom event
	 * @private
	 * @param {string} eventName - Event name
	 * @param {Object} detail - Event detail
	 */
	_emitEvent(eventName, detail) {
		this._logger.trace('Emitting event', { eventName, detail });
		this.dispatchEvent(
			new CustomEvent(eventName, {
				detail,
				bubbles: true,
				composed: true
			})
		);
	}

	// ----------------------------------------------------------
	// BLOCK 10: NESTING SUPPORT (N/A for this component)
	// ----------------------------------------------------------

	// ----------------------------------------------------------
	// BLOCK 11: VALIDATION (N/A for this component)
	// ----------------------------------------------------------

	// ----------------------------------------------------------
	// BLOCK 12: RENDER METHOD (REQUIRED)
	// ----------------------------------------------------------
	/**
	 * Render the component
	 * @returns {import('lit').TemplateResult}
	 */
	render() {
		this._logger.trace('Rendering');

		const items = this._getVisibleItems();

		return html`
			<nav class="breadcrumbs" aria-label="Breadcrumb">
				${items.map((item, index) => this._renderItem(item, index, items.length))}
			</nav>
		`;
	}

	// ----------------------------------------------------------
	// BLOCK 13: PRIVATE HELPERS
	// ----------------------------------------------------------
	/**
	 * Get visible items (handles collapsing)
	 * @private
	 * @returns {Array}
	 */
	_getVisibleItems() {
		if (!this.maxItems || this.maxItems <= 0 || this.items.length <= this.maxItems || this._expanded) {
			return this.items.map((item, index) => ({
				...item,
				_isLast: index === this.items.length - 1,
				_originalIndex: index
			}));
		}

		// Show first, ellipsis, and last items
		const first = { ...this.items[0], _originalIndex: 0 };
		const last = {
			...this.items[this.items.length - 1],
			_isLast: true,
			_originalIndex: this.items.length - 1
		};
		const ellipsis = { _isEllipsis: true, _hiddenCount: this.items.length - 2 };

		return [first, ellipsis, last];
	}

	/**
	 * Render a single breadcrumb item
	 * @private
	 */
	_renderItem(item, index, totalVisible) {
		const isLast = item._isLast || index === totalVisible - 1;

		if (item._isEllipsis) {
			return html`
				<span
					class="collapsed-indicator"
					@click=${this._handleEllipsisClick}
					title="Show ${item._hiddenCount} more items"
				>...</span>
				${!isLast ? this._renderSeparator() : ''}
			`;
		}

		const Tag = item.href && !isLast ? 'a' : 'span';
		const classes = `breadcrumb-item ${isLast ? 'current' : ''}`;

		return html`
			${Tag === 'a'
				? html`
					<a
						class=${classes}
						href=${item.href}
						@click=${(e) => this._handleItemClick(e, item._originalIndex)}
					>
						${item.icon ? html`<span class="breadcrumb-icon">${this._renderIcon(item.icon)}</span>` : ''}
						${item.label}
					</a>
				`
				: html`
					<span
						class=${classes}
						@click=${(e) => this._handleItemClick(e, item._originalIndex)}
					>
						${item.icon ? html`<span class="breadcrumb-icon">${this._renderIcon(item.icon)}</span>` : ''}
						${item.label}
					</span>
				`
			}
			${!isLast ? this._renderSeparator() : ''}
		`;
	}

	/**
	 * Render separator based on variant
	 * @private
	 */
	_renderSeparator() {
		// Custom separator takes precedence
		if (this.separator) {
			return html`<span class="separator">${this.separator}</span>`;
		}

		// Arrows variant uses SVG chevron
		if (this.variant === 'arrows') {
			return html`
				<span class="separator">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="9 18 15 12 9 6"></polyline>
					</svg>
				</span>
			`;
		}

		// Other variants use CSS ::after content
		return html`<span class="separator"></span>`;
	}

	/**
	 * Render icon (supports SVG string or named icon)
	 * @private
	 */
	_renderIcon(icon) {
		if (icon.startsWith('<svg')) {
			const template = document.createElement('template');
			template.innerHTML = icon.trim();
			return html`${template.content.cloneNode(true)}`;
		}
		// Return as text if not SVG
		return icon;
	}

	/**
	 * Handle item click
	 * @private
	 */
	_handleItemClick(e, index) {
		const item = this.items[index];

		// Always emit event
		this._emitEvent('breadcrumb-click', { index, item });

		// If no href or last item, prevent default
		if (!item.href || index === this.items.length - 1) {
			e.preventDefault();
		}
	}

	/**
	 * Handle ellipsis click to expand
	 * @private
	 */
	_handleEllipsisClick() {
		this.expand();
		this._emitEvent('breadcrumb-expand', {});
	}

	// ----------------------------------------------------------
	// MANIFEST GENERATION
	// ----------------------------------------------------------
	/**
	 * Generate component manifest
	 * @returns {Object}
	 */
	static generateManifest() {
		return {
			tagName: this.tagName,
			version: this.version,
			category: this.category,
			description: 'Navigation breadcrumb trail with multiple style variants',
			properties: Object.entries(this.properties).map(([name, config]) => ({
				name,
				type: config.type?.name || 'unknown',
				attribute: config.attribute || name,
				reflects: config.reflect || false
			})),
			events: [
				{ name: 'breadcrumb-click', description: 'Fired when a breadcrumb item is clicked' },
				{ name: 'breadcrumb-navigate', description: 'Fired when navigateTo() is called' },
				{ name: 'breadcrumb-expand', description: 'Fired when collapsed breadcrumbs are expanded' }
			],
			slots: [],
			cssVariables: [
				{ name: '--bread-bg', description: 'Background color', default: 'transparent' },
				{ name: '--bread-color', description: 'Text color for non-active items', default: 'var(--terminal-gray-light)' },
				{ name: '--bread-active', description: 'Color for active/current item', default: 'var(--terminal-green)' },
				{ name: '--bread-hover', description: 'Hover color', default: 'var(--terminal-cyan)' },
				{ name: '--bread-separator', description: 'Separator color', default: 'var(--terminal-gray)' }
			]
		};
	}
}

// ============================================================
// SECTION 3: REGISTRATION (REQUIRED)
// ============================================================
if (!customElements.get(TBreadcrumbsLit.tagName)) {
	customElements.define(TBreadcrumbsLit.tagName, TBreadcrumbsLit);
}

export default TBreadcrumbsLit;
