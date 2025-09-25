/**
 * TPanel Web Component
 * Terminal-style panel with collapsible states, multiple modes, and infinite nesting support
 *
 * Following COMPONENT_CREATION_GUIDE patterns:
 * - Uses addListener() for all event handling (automatic cleanup)
 * - Proper logger integration with componentLogger
 * - No inline styles for animations (uses CSS classes)
 * - Captures initial text content before rendering
 * - Proper attribute/prop handling with type conversions
 * - Clean event emission with detail objects
 */

import { TComponent } from './TComponent.js';
import componentLogger from '../utils/ComponentLogger.js';
import './TButton.js';
import { caretRightFilledIcon, caretDownFilledIcon, caretUpIcon } from '../utils/phosphor-icons.js';

export class TPanel extends TComponent {
    // CRITICAL: Define ALL observed attributes for automatic updates
    static get observedAttributes() {
        return [
            'mode',         // with-header, headless, with-status-bar
            'title',        // Panel title text
            'icon',         // Panel icon SVG
            'collapsed',    // Boolean: presence-based
            'collapsible',  // Boolean: presence-based
            'compact',      // Boolean: presence-based
            'variant',      // standard, control, slide
            'auto-size-actions', // Boolean: auto-adjust action button sizes
            'data-size-mode' // Size mode: large, standard, compact
        ];
    }

    constructor() {
        super();

        // Initialize logger
        this.logger = componentLogger.for('TPanel');

        // Store icons for use in templates
        this.icons = {
            chevronRight: caretRightFilledIcon,
            chevronDown: caretDownFilledIcon,
            maximize: caretUpIcon
        };

        // Capture initial text content BEFORE any rendering
        this._initialTitle = this.textContent || '';

        // Initialize props with ALL default values
        this.setProps({
            mode: 'with-header',   // with-header, headless, with-status-bar
            title: '',
            icon: null,
            collapsed: false,
            collapsible: false,
            compact: false,
            variant: 'standard',    // standard, control, slide
            autoSizeActions: true, // Auto-adjust action button sizes based on panel mode
            // Internal state
            _isAnimating: false,
            _headerHasFocus: false
        });

        // Bind methods for event handlers
        this._handleHeaderClick = this._handleHeaderClick.bind(this);
        this._handleHeaderKeydown = this._handleHeaderKeydown.bind(this);
        this._handleCollapseButtonClick = this._handleCollapseButtonClick.bind(this);
    }

    // Handle ALL attribute changes
    onAttributeChange(name, oldValue, newValue) {
        switch (name) {
            case 'mode':
                // Enum with validation
                const validModes = ['with-header', 'headless', 'with-status-bar'];
                this.setProp('mode', validModes.includes(newValue) ? newValue : 'with-header');
                break;
            case 'title':
                this.setProp('title', newValue || '');
                break;
            case 'icon':
                this.setProp('icon', newValue);
                break;
            case 'collapsed':
                // Boolean: presence = true, absence = false
                this.setProp('collapsed', newValue !== null);
                break;
            case 'collapsible':
                this.setProp('collapsible', newValue !== null);
                break;
            case 'compact':
                this.setProp('compact', newValue !== null);
                this.render(); // Force re-render for compact mode changes
                // Note: action buttons will be updated in afterRender
                break;
            case 'data-size-mode':
                // Size mode changed - update action buttons
                this._updateActionButtons();
                break;
            case 'auto-size-actions':
                this.setProp('autoSizeActions', newValue !== 'false');
                this._updateActionButtons();
                break;
            case 'variant':
                // Enum with validation
                const validVariants = ['standard', 'control', 'slide'];
                this.setProp('variant', validVariants.includes(newValue) ? newValue : 'standard');
                break;
        }
    }

    // Template method - returns HTML string
    template() {
        const { mode, title, icon, collapsed, collapsible, compact, variant, _isAnimating } = this._props;

        // Get title - from prop first, then initial text captured in constructor
        const panelTitle = title || this._initialTitle || '';

        // Build class list properly
        const classes = ['t-pnl'];

        // Add variant class
        if (variant === 'control') {
            classes.push('t-pnl--control');
        } else if (variant === 'slide') {
            classes.push('t-pnl--slide');
        } else if (collapsible) {
            // Collapsible panels don't get standard class
            classes.push('t-pnl--collapsible');
        } else {
            classes.push('t-pnl--standard');
        }

        // Add state classes
        if (collapsible) {
            if (collapsed) {
                classes.push('t-pnl--collapsed');
            } else {
                classes.push('t-pnl--expanded');
            }
        }

        if (compact) {
            classes.push('t-pnl--compact');
        }

        if (_isAnimating) {
            classes.push('t-pnl--animating');
        }

        // Build panel content based on mode
        let content = '';
        switch (mode) {
            case 'with-header':
                content = this._renderWithHeader(panelTitle, icon, collapsible, compact);
                break;
            case 'headless':
                content = this._renderHeadless();
                break;
            case 'with-status-bar':
                content = this._renderWithStatusBar(panelTitle, icon, collapsible);
                break;
            case 'with-footer':
                content = this._renderWithFooter(panelTitle, icon, collapsible, compact);
                break;
            default:
                content = this._renderWithHeader(panelTitle, icon, collapsible, compact);
        }

        // NEVER include <style> tags - styles come from adoptedStyleSheets
        return `
            <div class="${classes.join(' ')}">
                ${content}
            </div>
        `;
    }

    // Helper to render header mode
    _renderWithHeader(title, icon, collapsible, compact) {
        // Get the collapse icon for initial render
        const collapsed = this.getProp('collapsed');
        const collapseIcon = collapsed ? this.icons.chevronRight : this.icons.chevronDown;
        const iconSize = compact ? 12 : 16;
        const scaledCollapseIcon = this._scaleIcon(collapseIcon, iconSize);

        // Render collapse button if collapsible with icon pre-set
        const collapseBtn = collapsible ? `
            <t-btn
                class="t-pnl__collapse-btn"
                type="icon"
                size="${compact ? 'xs' : 'small'}"
                variant="minimal"
                icon="${this._escapeHtml(scaledCollapseIcon)}">
            </t-btn>
        ` : '';

        // Icon if provided - keep the span for layout
        const iconHtml = icon ? `<span class="t-pnl__title-icon">${icon}</span>` : '';

        // Build header attributes for accessibility
        const headerAttrs = collapsible ?
            'role="button" tabindex="0" aria-expanded="false"' : '';

        return `
            <div class="t-pnl__header" ${headerAttrs}>
                ${collapseBtn}
                <div class="t-pnl__title">
                    ${iconHtml}
                    <span class="t-pnl__title-text">${this._escapeHtml(title)}</span>
                </div>
                <div class="t-pnl__actions">
                    <slot name="actions"></slot>
                </div>
            </div>
            <div class="t-pnl__body">
                <slot></slot>
            </div>
            <div class="t-pnl__footer" style="display: none;">
                <slot name="footer"></slot>
            </div>
            <t-btn
                class="t-pnl__footer-toggle"
                type="icon"
                size="xs"
                variant="minimal"
                icon='<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256" fill="currentColor"><path d="M213.66,165.66a8,8,0,0,1-11.32,0L128,91.31,53.66,165.66a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,213.66,165.66Z"/></svg>'
                style="display: none;"></t-btn>
        `;
    }

    // Helper to render headless mode
    _renderHeadless() {
        return `
            <div class="t-pnl__body t-pnl__body--headless">
                <slot></slot>
            </div>
        `;
    }

    // Helper to render footer mode
    _renderWithFooter(title, icon, collapsible, compact) {
        // Get the collapse icon for initial render
        const collapsed = this.getProp('collapsed');
        const collapseIcon = collapsed ? this.icons.chevronRight : this.icons.chevronDown;
        const iconSize = compact ? 12 : 16;
        const scaledCollapseIcon = this._scaleIcon(collapseIcon, iconSize);

        // Render collapse button if collapsible with icon pre-set
        const collapseBtn = collapsible ? `
            <t-btn
                class="t-pnl__collapse-btn"
                type="icon"
                size="${compact ? 'xs' : 'small'}"
                variant="minimal"
                icon="${this._escapeHtml(scaledCollapseIcon)}">
            </t-btn>
        ` : '';

        // Icon if provided - keep the span for layout
        const iconHtml = icon ? `<span class="t-pnl__title-icon">${icon}</span>` : '';

        // Build header attributes for accessibility
        const headerAttrs = collapsible ?
            'role="button" tabindex="0" aria-expanded="false"' : '';

        return `
            <div class="t-pnl__header" ${headerAttrs}>
                ${collapseBtn}
                <div class="t-pnl__title">
                    ${iconHtml}
                    <span class="t-pnl__title-text">${this._escapeHtml(title)}</span>
                </div>
                <div class="t-pnl__actions">
                    <slot name="actions"></slot>
                </div>
            </div>
            <div class="t-pnl__body">
                <slot></slot>
            </div>
            <div class="t-pnl__footer" style="display: flex;">
                <slot name="footer"></slot>
            </div>
            <t-btn
                class="t-pnl__footer-toggle"
                type="icon"
                size="xs"
                variant="minimal"
                icon='<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256" fill="currentColor"><path d="M213.66,165.66a8,8,0,0,1-11.32,0L128,91.31,53.66,165.66a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,213.66,165.66Z"/></svg>'
                style="display: none;"></t-btn>
        `;
    }

    _renderWithStatusBar(title, icon, collapsible) {
        // Get the collapse icon for initial render
        const collapsed = this.getProp('collapsed');
        const collapseIcon = collapsed ? this.icons.chevronRight : this.icons.chevronDown;
        const scaledCollapseIcon = this._scaleIcon(collapseIcon, 16);

        // Render collapse button if collapsible with icon pre-set
        const collapseBtn = collapsible ? `
            <t-btn
                class="t-pnl__collapse-btn"
                type="icon"
                size="small"
                variant="minimal"
                icon="${this._escapeHtml(scaledCollapseIcon)}">
            </t-btn>
        ` : '';

        // Icon if provided - keep the span for layout
        const iconHtml = icon ? `<span class="t-pnl__title-icon">${icon}</span>` : '';

        // Build header attributes for accessibility
        const headerAttrs = collapsible ?
            'role="button" tabindex="0" aria-expanded="false"' : '';

        return `
            <div class="t-pnl__header" ${headerAttrs}>
                ${collapseBtn}
                <div class="t-pnl__title">
                    ${iconHtml}
                    <span class="t-pnl__title-text">${this._escapeHtml(title)}</span>
                </div>
                <div class="t-pnl__actions">
                    <slot name="actions"></slot>
                </div>
            </div>
            <div class="t-pnl__body t-pnl__body--with-status">
                <slot></slot>
            </div>
            <div class="t-pnl__status-bar">
                <slot name="status-bar"></slot>
            </div>
        `;
    }

    // CRITICAL: Escape HTML to prevent XSS
    _escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // After render lifecycle - attach event listeners
    afterRender() {
        this._setupPanelInteractivity();
    }

    /**
     * DSD Hydration: Cache DOM elements
     */
    hydrateElements() {
        this._header = this.$('.t-pnl__header');
        this._collapseBtn = this.$('.t-pnl__collapse-btn');
        this._footer = this.$('.t-pnl__footer');
        this._footerToggle = this.$('.t-pnl__footer-toggle');
    }

    /**
     * DSD Hydration: Bind event listeners
     */
    hydrateEventListeners() {
        this._setupPanelInteractivity();
    }

    /**
     * Setup panel interactivity (shared between render and hydrate)
     */
    _setupPanelInteractivity() {
        const header = this._header || this.$('.t-pnl__header');
        const collapseBtn = this._collapseBtn || this.$('.t-pnl__collapse-btn');
        const footer = this._footer || this.$('.t-pnl__footer');
        const footerToggle = this._footerToggle || this.$('.t-pnl__footer-toggle');

        // Cache references for future use
        this._header = header;
        this._collapseBtn = collapseBtn;
        this._footer = footer;
        this._footerToggle = footerToggle;

        // Setup header interaction if collapsible
        if (header && this.getProp('collapsible')) {
            // Use addListener for automatic cleanup
            this.addListener(header, 'click', this._handleHeaderClick);
            this.addListener(header, 'keydown', this._handleHeaderKeydown);

            // Update ARIA attributes
            const collapsed = this.getProp('collapsed');
            header.setAttribute('aria-expanded', !collapsed);
        }

        // Setup collapse button
        if (collapseBtn) {
            this._updateCollapseButton();
            // Prevent button click from bubbling to header
            this.addListener(collapseBtn, 'click', this._handleCollapseButtonClick);
        }

        // Setup footer slot monitoring and toggle
        if (footer) {
            const footerSlot = footer.querySelector('slot[name="footer"]');
            if (footerSlot) {
                // Check initial content
                this._checkFooterContent(footerSlot, footer);
                // Monitor changes
                this.addListener(footerSlot, 'slotchange', () => {
                    this._checkFooterContent(footerSlot, footer);
                });
            }
        }

        // Setup footer toggle button
        if (footerToggle) {
            this.addListener(footerToggle, 'click', () => {
                this.toggleFooter();
            });
        }

        // Handle action buttons in the actions slot
        this._updateActionButtons();

        // Log successful setup with nesting info
        const nestedCount = this.querySelectorAll('t-pnl').length;
        if (nestedCount > 0) {
            this.logger.debug('Panel interactivity setup with nested panels', {
                id: this.id || 'unnamed',
                nestedCount,
                isDSD: this._isDSD
            });
        }
    }

    // Event handler for header clicks
    _handleHeaderClick(e) {
        // Don't toggle if clicking on actions or buttons (except collapse button)
        const isAction = e.target.closest('.t-pnl__actions');
        const isNonCollapseBtn = e.target.closest('t-btn') &&
                                !e.target.closest('.t-pnl__collapse-btn');

        if (isAction || isNonCollapseBtn) {
            return;
        }

        // Don't handle if this click is from a nested panel's header
        const clickedHeader = e.target.closest('.t-pnl__header');
        const ourHeader = this.$('.t-pnl__header');
        if (clickedHeader !== ourHeader) {
            return;
        }

        this.toggle();
    }

    // Event handler for collapse button clicks
    _handleCollapseButtonClick(e) {
        e.stopPropagation(); // Prevent bubbling to header
        this.toggle();
    }

    // Event handler for keyboard interaction
    _handleHeaderKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggle();
        }
    }

    // Check and update footer visibility
    _checkFooterContent(footerSlot, footer) {
        const hasContent = footerSlot.assignedNodes().length > 0;
        footer.style.display = hasContent ? 'flex' : 'none';

        // Show/hide footer toggle based on content
        const footerToggle = this.$('.t-pnl__footer-toggle');
        if (footerToggle) {
            footerToggle.style.display = hasContent ? 'none' : 'none';  // Initially hidden when footer is visible
        }
    }

    // Update collapse button icon
    _updateCollapseButton() {
        const btn = this.$('.t-pnl__collapse-btn');
        if (!btn || !btn.setIcon) return;

        const collapsed = this.getProp('collapsed');
        const compact = this.getProp('compact');

        // Choose icon based on state
        const icon = collapsed ? caretRightFilledIcon : caretDownFilledIcon;

        // Scale icon based on size
        const iconSize = compact ? 12 : 16;
        const scaledIcon = this._scaleIcon(icon, iconSize);

        btn.setIcon(scaledIcon);
    }

    // Scale icon helper
    _scaleIcon(iconSvg, size) {
        if (!iconSvg) return iconSvg;

        let scaled = iconSvg;
        scaled = scaled.replace(/width="[^"]*"/i, `width="${size}"`);
        scaled = scaled.replace(/height="[^"]*"/i, `height="${size}"`);

        // If no width/height attributes exist, add them
        if (!scaled.includes('width=')) {
            scaled = scaled.replace('<svg', `<svg width="${size}" height="${size}"`);
        }

        return scaled;
    }

    // Update action button sizes based on panel mode
    _updateActionButtons() {
        // Only update if auto-sizing is enabled
        if (!this.getProp('autoSizeActions')) return;

        // Get the actions slot element within our shadow DOM
        const actionsSlot = this.$('slot[name="actions"]');
        if (!actionsSlot) return;

        // Get the assigned elements (buttons from light DOM)
        const assignedElements = actionsSlot.assignedElements();

        // Get size mode from data attribute or determine from compact prop
        const sizeMode = this.getAttribute('data-size-mode') || (this.getProp('compact') ? 'compact' : 'standard');

        assignedElements.forEach(element => {
            // Find buttons within the assigned element
            const buttons = element.tagName === 'T-BTN' ? [element] : element.querySelectorAll('t-btn');

            buttons.forEach(btn => {
                // Don't override if button has data-no-auto-size attribute
                if (btn.hasAttribute('data-no-auto-size')) return;

                // Determine the button size based on panel mode
                let buttonSize = null;

                switch(sizeMode) {
                    case 'compact':
                        buttonSize = 'xs';
                        break;
                    case 'standard':
                        buttonSize = 'small';
                        break;
                    case 'large':
                        // Large mode: use default size (no attribute)
                        buttonSize = null;
                        break;
                    default:
                        // Default to small for unknown modes
                        buttonSize = 'small';
                }

                // Apply the size
                if (buttonSize) {
                    btn.setAttribute('size', buttonSize);
                } else {
                    // Large mode: remove size attribute to use default
                    btn.removeAttribute('size');
                }

                // Ensure type is icon if not already set
                if (!btn.getAttribute('type')) {
                    btn.setAttribute('type', 'icon');
                }
            });
        });
    }

    // Lifecycle: Component connected to DOM
    connectedCallback() {
        super.connectedCallback();
        this.logger.debug('Panel connected', {
            id: this.id || 'unnamed',
            mode: this.getProp('mode')
        });
    }

    // Lifecycle: Component removed from DOM
    disconnectedCallback() {
        super.disconnectedCallback();
        // Cleanup handled automatically by addListener
        this.logger.debug('Panel disconnected', {
            id: this.id || 'unnamed'
        });
    }

    // ========== PUBLIC API ==========

    /**
     * Toggle the panel's collapsed state
     * @returns {boolean} The new collapsed state
     */
    toggle() {
        if (!this.getProp('collapsible')) {
            this.logger.warn('Attempted to toggle non-collapsible panel');
            return this.getProp('collapsed');
        }

        const newState = !this.getProp('collapsed');
        this.setProp('collapsed', newState);

        // Update attribute
        if (newState) {
            this.setAttribute('collapsed', '');
        } else {
            this.removeAttribute('collapsed');
        }

        // Update UI
        this._updateCollapseButton();

        // Update ARIA
        const header = this.$('.t-pnl__header');
        if (header) {
            header.setAttribute('aria-expanded', !newState);
        }

        // Emit event with detail
        this.emit('panel-toggle', {
            collapsed: newState,
            panelId: this.id || null
        });

        this.logger.info('Panel toggled', {
            id: this.id || 'unnamed',
            collapsed: newState
        });

        return newState;
    }

    /**
     * Collapse the panel
     */
    collapse() {
        if (!this.getProp('collapsible')) {
            this.logger.warn('Attempted to collapse non-collapsible panel');
            return;
        }

        if (!this.getProp('collapsed')) {
            this.setProp('collapsed', true);
            this.setAttribute('collapsed', '');
            this._updateCollapseButton();

            // Update ARIA
            const header = this.$('.t-pnl__header');
            if (header) {
                header.setAttribute('aria-expanded', 'false');
            }

            this.emit('panel-collapse', {
                panelId: this.id || null
            });

            this.logger.debug('Panel collapsed', {
                id: this.id || 'unnamed'
            });
        }
    }

    /**
     * Expand the panel (and parent panels if nested)
     */
    expand() {
        if (!this.getProp('collapsible')) {
            this.logger.warn('Attempted to expand non-collapsible panel');
            return;
        }

        // First, expand parent panels if needed
        const parentPanels = this._getParentPanels();
        if (parentPanels.length > 0) {
            this.logger.debug('Expanding parent panels', {
                count: parentPanels.length
            });

            parentPanels.forEach(panel => {
                if (panel.expand) {
                    panel.expand();
                }
            });
        }

        // Then expand this panel
        if (this.getProp('collapsed')) {
            this.setProp('collapsed', false);
            this.removeAttribute('collapsed');
            this._updateCollapseButton();

            // Update ARIA
            const header = this.$('.t-pnl__header');
            if (header) {
                header.setAttribute('aria-expanded', 'true');
            }

            this.emit('panel-expand', {
                panelId: this.id || null
            });

            this.logger.debug('Panel expanded', {
                id: this.id || 'unnamed'
            });
        }
    }

    /**
     * Toggle footer visibility
     */
    toggleFooter() {
        const footer = this.$('.t-pnl__footer');
        const footerToggle = this.$('.t-pnl__footer-toggle');

        if (!footer || !footerToggle) return;

        if (footer.style.display === 'none') {
            // Show footer
            footer.style.display = 'flex';
            footerToggle.style.display = 'none';
        } else {
            // Hide footer
            footer.style.display = 'none';
            footerToggle.style.display = 'flex'; // Use flex for proper centering
        }
    }

    /**
     * Check if panel is collapsed
     * @returns {boolean} True if collapsed
     */
    isCollapsed() {
        return this.getProp('collapsed');
    }

    /**
     * Set the panel title
     * @param {string} title - The new title
     */
    setTitle(title) {
        this.setProp('title', title);
        this.setAttribute('title', title);

        // Update only the title text without re-rendering
        const titleText = this.$('.t-pnl__title-text');
        if (titleText) {
            titleText.textContent = title;
        }
    }

    /**
     * Get the panel title
     * @returns {string} The current title
     */
    getTitle() {
        return this.getProp('title');
    }

    /**
     * Set the panel icon
     * @param {string} iconSvg - SVG string for the icon
     */
    setIcon(iconSvg) {
        this.setProp('icon', iconSvg);
        if (iconSvg) {
            this.setAttribute('icon', iconSvg);
        } else {
            this.removeAttribute('icon');
        }
        // Icon changes require re-render
        this.render();
    }

    /**
     * Set the panel mode
     * @param {string} mode - One of: 'with-header', 'headless', 'with-status-bar'
     */
    setMode(mode) {
        const validModes = ['with-header', 'headless', 'with-status-bar'];
        if (validModes.includes(mode)) {
            this.setProp('mode', mode);
            this.setAttribute('mode', mode);
            // Mode changes require re-render
            this.render();
        } else {
            this.logger.error('Invalid panel mode', { mode });
        }
    }

    /**
     * Get nested panels
     * @returns {Array<TPanel>} Array of nested panel elements
     */
    getNestedPanels() {
        return Array.from(this.querySelectorAll('t-pnl'));
    }

    /**
     * Get parent panels (for nested structures)
     * @returns {Array<TPanel>} Array of parent panel elements
     */
    _getParentPanels() {
        const parents = [];
        let element = this.parentElement;

        while (element) {
            // Walk up the DOM tree looking for parent panels
            if (element.tagName === 'T-PNL') {
                parents.push(element);
            }
            element = element.parentElement;
        }

        return parents.reverse(); // Return top-most parent first
    }

    /**
     * Collapse all nested panels
     */
    collapseAll() {
        const nested = this.getNestedPanels();

        this.logger.info('Collapsing all nested panels', {
            id: this.id || 'unnamed',
            nestedCount: nested.length
        });

        // Collapse nested panels first (bottom-up)
        nested.forEach(panel => {
            if (panel.collapse) {
                panel.collapse();
            }
        });

        // Then collapse this panel
        this.collapse();
    }

    /**
     * Expand all nested panels
     */
    expandAll() {
        const nested = this.getNestedPanels();

        this.logger.info('Expanding all nested panels', {
            id: this.id || 'unnamed',
            nestedCount: nested.length
        });

        // Expand this panel first
        this.expand();

        // Then expand nested panels (top-down)
        nested.forEach(panel => {
            if (panel.expand) {
                panel.expand();
            }
        });
    }

    /**
     * Make panel collapsible
     */
    makeCollapsible() {
        this.setProp('collapsible', true);
        this.setAttribute('collapsible', '');
        this.render(); // Re-render to add collapse button
    }

    /**
     * Make panel non-collapsible
     */
    makeNonCollapsible() {
        this.setProp('collapsible', false);
        this.removeAttribute('collapsible');
        this.setProp('collapsed', false); // Expand if collapsed
        this.removeAttribute('collapsed');
        this.render(); // Re-render to remove collapse button
    }
}

// Register the component - MUST be at end of file
customElements.define('t-pnl', TPanel);