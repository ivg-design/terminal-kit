/**
 * TerminalTreeNode Web Component
 * Individual node component for tree structure
 * Uses existing terminal CSS styles
 */

import { TComponent } from './TComponent.js';

export class TTreeNode extends TComponent {
	static get observedAttributes() {
		return ['expanded', 'selected', 'level', 'has-children', 'icon', 'disabled'];
	}

	constructor() {
		super();

		// Initialize props
		this.setProps({
			expanded: false,
			selected: false,
			level: 0,
			hasChildren: false,
			icon: null,
			disabled: false,
			text: '',
			value: null,
			children: [],
		});
	}

	get componentClass() {
		return 'terminal-tree-node';
	}

	onAttributeChange(name, oldValue, newValue) {
		switch (name) {
			case 'expanded':
				this.setProp('expanded', newValue !== null);
				break;
			case 'selected':
				this.setProp('selected', newValue !== null);
				break;
			case 'level':
				this.setProp('level', parseInt(newValue) || 0);
				break;
			case 'has-children':
				this.setProp('hasChildren', newValue !== null);
				break;
			case 'icon':
				this.setProp('icon', newValue);
				break;
			case 'disabled':
				this.setProp('disabled', newValue !== null);
				break;
		}
	}

	template() {
		const { expanded, selected, level, hasChildren, icon, disabled, text } = this._props;

		// Get node text from slot or prop
		const nodeText = text || this.textContent || '';

		// Build class list
		const classes = ['tree-node'];

		if (selected) classes.push('tree-node--selected');
		if (disabled) classes.push('tree-node--disabled');
		if (hasChildren) classes.push('tree-node--has-children');
		if (expanded) classes.push('tree-node--expanded');

		// Calculate indentation
		const indentStyle = level > 0 ? `style="--indent-level: ${level};"` : '';

		// Build expand/collapse icon
		let expandIcon = '';
		if (hasChildren) {
			expandIcon = expanded
				? '<svg class="tree-node__expand-icon" viewBox="0 0 16 16"><path fill="currentColor" d="M12 6L8 10L4 6h8z"/></svg>'
				: '<svg class="tree-node__expand-icon" viewBox="0 0 16 16"><path fill="currentColor" d="M6 4l4 4l-4 4V4z"/></svg>';
		} else {
			expandIcon = '<span class="tree-node__expand-spacer"></span>';
		}

		// Build node icon
		const nodeIcon = icon ? icon : '';

		return `
			<div 
				class="${classes.join(' ')}" 
				${indentStyle}
				role="treeitem"
				aria-expanded="${hasChildren ? expanded : undefined}"
				aria-selected="${selected}"
				tabindex="${disabled ? -1 : 0}"
			>
				<div class="tree-node__content">
					<div class="tree-node__expand" ${hasChildren ? '' : 'style="visibility: hidden;"'}>
						${expandIcon}
					</div>
					<div class="tree-node__icon">
						${nodeIcon}
					</div>
					<div class="tree-node__text">
						${nodeText}
					</div>
				</div>
				<div class="tree-node__children" ${!expanded ? 'style="display: none;"' : ''}>
					<slot></slot>
				</div>
			</div>
		`;
	}

	afterRender() {
		const node = this.$('.tree-node');
		const expandButton = this.$('.tree-node__expand');
		const content = this.$('.tree-node__content');

		if (node && content) {
			// Handle click events on node content
			this.addListener(content, 'click', (e) => {
				e.stopPropagation();
				if (!this.getProp('disabled')) {
					this.select();
				}
			});

			// Handle expand/collapse clicks
			if (expandButton && this.getProp('hasChildren')) {
				this.addListener(expandButton, 'click', (e) => {
					e.stopPropagation();
					if (!this.getProp('disabled')) {
						this.toggle();
					}
				});
			}

			// Handle keyboard events
			this.addListener(node, 'keydown', (e) => {
				if (this.getProp('disabled')) return;

				switch (e.key) {
					case 'Enter':
					case ' ':
						e.preventDefault();
						this.select();
						break;
					case 'ArrowRight':
						if (this.getProp('hasChildren') && !this.getProp('expanded')) {
							e.preventDefault();
							this.expand();
						}
						break;
					case 'ArrowLeft':
						if (this.getProp('hasChildren') && this.getProp('expanded')) {
							e.preventDefault();
							this.collapse();
						}
						break;
				}
			});

			// Handle hover effects
			this.addListener(content, 'mouseenter', () => {
				if (!this.getProp('disabled')) {
					content.classList.add('hover');
				}
			});

			this.addListener(content, 'mouseleave', () => {
				content.classList.remove('hover');
			});
		}
	}

	// Public API

	/**
	 * Select this node
	 */
	select() {
		if (this.getProp('disabled')) return;

		this.setProp('selected', true);
		this.setAttribute('selected', '');
		this.emit('node-select', {
			node: this,
			value: this.getProp('value'),
			text: this.getProp('text') || this.textContent,
		});
	}

	/**
	 * Deselect this node
	 */
	deselect() {
		this.setProp('selected', false);
		this.removeAttribute('selected');
		this.emit('node-deselect', {
			node: this,
			value: this.getProp('value'),
			text: this.getProp('text') || this.textContent,
		});
	}

	/**
	 * Expand node (if it has children)
	 */
	expand() {
		if (!this.getProp('hasChildren') || this.getProp('disabled')) return;

		this.setProp('expanded', true);
		this.setAttribute('expanded', '');

		const childrenContainer = this.$('.tree-node__children');
		if (childrenContainer) {
			childrenContainer.style.display = '';
		}

		this.emit('node-expand', {
			node: this,
			value: this.getProp('value'),
			text: this.getProp('text') || this.textContent,
		});
	}

	/**
	 * Collapse node (if it has children)
	 */
	collapse() {
		if (!this.getProp('hasChildren') || this.getProp('disabled')) return;

		this.setProp('expanded', false);
		this.removeAttribute('expanded');

		const childrenContainer = this.$('.tree-node__children');
		if (childrenContainer) {
			childrenContainer.style.display = 'none';
		}

		this.emit('node-collapse', {
			node: this,
			value: this.getProp('value'),
			text: this.getProp('text') || this.textContent,
		});
	}

	/**
	 * Toggle expanded state
	 */
	toggle() {
		if (this.getProp('expanded')) {
			this.collapse();
		} else {
			this.expand();
		}
	}

	/**
	 * Set node text
	 */
	setText(text) {
		this.setProp('text', text);
	}

	/**
	 * Set node value
	 */
	setValue(value) {
		this.setProp('value', value);
	}

	/**
	 * Set node icon
	 */
	setIcon(iconSvg) {
		this.setProp('icon', iconSvg);
		this.setAttribute('icon', iconSvg);
	}

	/**
	 * Set disabled state
	 */
	setDisabled(disabled) {
		this.setProp('disabled', disabled);
		if (disabled) {
			this.setAttribute('disabled', '');
		} else {
			this.removeAttribute('disabled');
		}
	}

	/**
	 * Set level (indentation)
	 */
	setLevel(level) {
		this.setProp('level', level);
		this.setAttribute('level', level.toString());
	}

	/**
	 * Set whether node has children
	 */
	setHasChildren(hasChildren) {
		this.setProp('hasChildren', hasChildren);
		if (hasChildren) {
			this.setAttribute('has-children', '');
		} else {
			this.removeAttribute('has-children');
		}
	}

	/**
	 * Get selected state
	 */
	isSelected() {
		return this.getProp('selected');
	}

	/**
	 * Get expanded state
	 */
	isExpanded() {
		return this.getProp('expanded');
	}

	/**
	 * Get disabled state
	 */
	isDisabled() {
		return this.getProp('disabled');
	}

	/**
	 * Focus this node
	 */
	focus() {
		const node = this.$('.tree-node');
		if (node) {
			node.focus();
		}
	}
}

// Register the component
customElements.define('t-tre-node', TTreeNode);
