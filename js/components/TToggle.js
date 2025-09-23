/**
 * TerminalToggle Web Component
 * Toggle switch with label and icon that all switch together
 * Uses existing toggle.css styles
 */

import { TComponent } from './TComponent.js';

export class TToggle extends TComponent {
	static get observedAttributes() {
		return [
			'checked',
			'label',
			'disabled',
			'size',
			'icon',
			'layout',
			'on-label',
			'off-label',
			'on-icon',
			'off-icon',
			'equal-states',
			'variant',
			'error',
		];
	}

	constructor() {
		super();

		// Initialize props
		this.setProps({
			checked: false,
			label: '',
			disabled: false,
			size: 'default', // small, default, large
			layout: 'label-toggle', // 'label-toggle', 'icon-label-toggle', 'icon-toggle', 'switching', 'icon-switching'
			variant: 'toggle', // 'toggle' or 'checkbox'
			error: false, // Error state for checkbox variant
			icon: null,
			onLabel: '',
			offLabel: '',
			onIcon: null,
			offIcon: null,
			onText: 'ON',
			offText: 'OFF',
			showStates: false,
			equalStates: false, // For work/personal, A/B type toggles
		});

		// Bind methods
		this.handleClick = this.handleClick.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

	onAttributeChange(name, oldValue, newValue) {
		switch (name) {
			case 'checked':
				this.setProp('checked', newValue !== null && newValue !== 'false');
				break;
			case 'label':
				this.setProp('label', newValue || '');
				break;
			case 'disabled':
				this.setProp('disabled', newValue !== null);
				break;
			case 'size':
				this.setProp('size', newValue || 'default');
				break;
			case 'icon':
				this.setProp('icon', newValue);
				break;
			case 'layout':
				this.setProp('layout', newValue || 'label-toggle');
				break;
			case 'on-label':
				this.setProp('onLabel', newValue || '');
				break;
			case 'off-label':
				this.setProp('offLabel', newValue || '');
				break;
			case 'on-icon':
				this.setProp('onIcon', newValue);
				break;
			case 'off-icon':
				this.setProp('offIcon', newValue);
				break;
			case 'equal-states':
				this.setProp('equalStates', newValue !== null);
				break;
			case 'variant':
				this.setProp('variant', newValue || 'toggle');
				break;
			case 'error':
				this.setProp('error', newValue !== null && newValue !== 'false');
				break;
		}
	}

	template() {
		const {
			checked,
			label,
			disabled,
			size,
			layout,
			variant,
			error,
			icon,
			onLabel,
			offLabel,
			onIcon,
			offIcon,
			showStates,
			onText,
			offText,
			equalStates,
		} = this._props;

		// Build classes
		const classes = ['terminal-toggle'];
		if (checked) classes.push('checked');
		if (disabled) classes.push('disabled');
		if (size !== 'default') classes.push(size);
		if (layout) classes.push(`layout-${layout}`);
		if (equalStates) classes.push('equal-states');
		if (error && variant === 'checkbox') classes.push('error');

		// Determine what to show based on layout and state
		let displayIcon = icon;
		let displayLabel = label;

		if (layout === 'switching' || layout === 'icon-switching') {
			displayIcon = checked ? onIcon : offIcon;
			displayLabel = checked ? onLabel : offLabel;
		}

		// Render based on layout
		let content = '';
		const toggleElement =
			variant === 'checkbox'
				? '<div class="toggle-checkbox"></div>'
				: '<div class="toggle-switch"></div>';

		switch (layout) {
			case 'icon-toggle':
				content = `
		${displayIcon ? `<span class="toggle-icon">${displayIcon}</span>` : ''}
		${toggleElement}
        `;
				break;
			case 'icon-label-toggle':
				content = `
		${displayIcon ? `<span class="toggle-icon">${displayIcon}</span>` : ''}
		${displayLabel ? `<span class="toggle-label">${displayLabel}</span>` : ''}
		${toggleElement}
        `;
				break;
			case 'icon-switching':
				content = `
		${displayIcon ? `<span class="toggle-icon switching-icon">${displayIcon}</span>` : ''}
		${toggleElement}
        `;
				break;
			case 'switching':
				content = `
		${displayIcon ? `<span class="toggle-icon switching-icon">${displayIcon}</span>` : ''}
		${displayLabel ? `<span class="toggle-label switching-label">${displayLabel}</span>` : ''}
		${toggleElement}
        `;
				break;
			case 'label-toggle':
			default:
				content = `
		${displayLabel ? `<span class="toggle-label">${displayLabel}</span>` : ''}
		${toggleElement}
        `;
				break;
		}

		return `
	<div class="${classes.join(' ')}" tabindex="${disabled ? -1 : 0}" role="switch" aria-checked="${checked}">
        ${content}
        ${
			showStates
				? `
		<div class="toggle-states">
            <span class="toggle-state-off">${offText}</span>
            <span class="toggle-state-on">${onText}</span>
		</div>
        `
				: ''
		}
	</div>
    `;
	}

	afterRender() {
		const toggle = this.$('.terminal-toggle');

		if (toggle) {
			// Click handler
			this.addListener(toggle, 'click', this.handleClick);

			// Keyboard handler
			this.addListener(toggle, 'keydown', this.handleKeyDown);
		}
	}

	handleClick(e) {
		if (this.getProp('disabled')) return;

		e.preventDefault();
		this.toggle();
	}

	handleKeyDown(e) {
		if (this.getProp('disabled')) return;

		// Handle space and enter keys
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			this.toggle();
		}
	}

	toggle() {
		const newState = !this.getProp('checked');
		this.setChecked(newState);
	}

	// Public API
	isChecked() {
		return this.getProp('checked');
	}

	setChecked(checked) {
		const oldValue = this.getProp('checked');
		checked = Boolean(checked);

		if (checked !== oldValue) {
			this.setProp('checked', checked);
			// Update the attribute for external visibility
			if (checked) {
				this.setAttribute('checked', '');
			} else {
				this.removeAttribute('checked');
			}

			// Emit custom toggle-change event
			this.emit('toggle-change', { checked, oldValue });

			// Also emit native change event for form integration
			const changeEvent = new Event('change', {
				bubbles: true,
				cancelable: true,
			});
			this.dispatchEvent(changeEvent);
		}
	}

	check() {
		this.setChecked(true);
	}

	uncheck() {
		this.setChecked(false);
	}

	disable() {
		this.setProp('disabled', true);
		const toggle = this.$('.terminal-toggle');
		if (toggle) {
			toggle.classList.add('disabled');
			toggle.tabIndex = -1;
		}
	}

	enable() {
		this.setProp('disabled', false);
		const toggle = this.$('.terminal-toggle');
		if (toggle) {
			toggle.classList.remove('disabled');
			toggle.tabIndex = 0;
		}
	}

	setLabel(label) {
		this.setProp('label', label);
	}

	setIcon(iconSvg) {
		this.setProp('icon', iconSvg);
	}

	setSize(size) {
		this.setProp('size', size);
	}

	setStateTexts(onText, offText) {
		this.setProps({ onText, offText, showStates: true });
	}

	hideStates() {
		this.setProp('showStates', false);
	}

	showStates() {
		this.setProp('showStates', true);
	}
}

// Register the component
customElements.define('t-tog', TToggle);
