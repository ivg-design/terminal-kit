/**
 * TerminalSlider Web Component
 * Range slider for zoom and other numeric controls
 * Uses existing slider.css styles
 */

import { TComponent } from './TComponent.js';

export class TSlider extends TComponent {
	static get observedAttributes() {
		return [
			'min',
			'max',
			'value',
			'step',
			'label',
			'disabled',
			'vertical',
			'compact',
			'variant',
			'icon',
			'icon-size',
			'smooth',
			'show-ticks',
			'major-tick-interval',
		];
	}

	constructor() {
		super();

		// Initialize props
		this.setProps({
			min: 0,
			max: 100,
			value: 50,
			step: 1,
			label: '',
			icon: null,
			iconSize: 'medium', // 'small', 'medium', 'large'
			disabled: false,
			vertical: false,
			compact: false,
			variant: 'default', // 'default', 'value-in-thumb', 'with-input'
			smooth: false, // true for smooth sliding, false for stepped/notched
			showTicks: false,
			majorTickInterval: 5, // Major tick every N steps
			showValue: true,
			showMinMax: false,
			editableValue: true,
		});

		// Internal state
		this.isDragging = false;
		this.startX = 0;
		this.startY = 0;
		this.startValue = 0;

		// Bind methods
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleTrackClick = this.handleTrackClick.bind(this);
		this.handleValueEdit = this.handleValueEdit.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

	onAttributeChange(name, oldValue, newValue) {
		switch (name) {
			case 'min':
				this.setProp('min', parseFloat(newValue) || 0);
				break;
			case 'max':
				this.setProp('max', parseFloat(newValue) || 100);
				break;
			case 'value':
				// Only call setValue if the value actually changed to prevent loops
				const parsedValue = parseFloat(newValue) || 0;
				if (this._props.value !== parsedValue) {
					this._isAttributeUpdate = true;
					this.setValue(parsedValue);
					this._isAttributeUpdate = false;
				}
				break;
			case 'step':
				this.setProp('step', parseFloat(newValue) || 1);
				break;
			case 'label':
				this.setProp('label', newValue || '');
				break;
			case 'disabled':
				this.setProp('disabled', newValue !== null);
				break;
			case 'vertical':
				this.setProp('vertical', newValue !== null);
				break;
			case 'compact':
				this.setProp('compact', newValue !== null);
				break;
			case 'variant':
				this.setProp('variant', newValue || 'default');
				break;
			case 'icon':
				this.setProp('icon', newValue);
				break;
			case 'icon-size':
				this.setProp('iconSize', newValue || 'medium');
				break;
			case 'smooth':
				this.setProp('smooth', newValue !== null);
				break;
			case 'show-ticks':
				this.setProp('showTicks', newValue !== null);
				break;
			case 'major-tick-interval':
				this.setProp('majorTickInterval', parseInt(newValue) || 5);
				break;
		}
	}

	template() {
		const {
			min,
			max,
			value,
			label,
			icon,
			iconSize,
			disabled,
			vertical,
			compact,
			variant,
			smooth,
			showTicks,
			majorTickInterval,
			showValue,
			showMinMax,
		} = this._props;

		// Calculate percentage
		const percent = ((value - min) / (max - min)) * 100;

		// Build classes
		const classes = ['terminal-slider'];
		if (disabled) classes.push('disabled');
		if (vertical) classes.push('vertical');
		if (compact) classes.push('compact');
		if (variant !== 'default') classes.push(variant);
		if (smooth) classes.push('smooth');
		else classes.push('stepped');

		// Determine if we should show value based on variant
		const shouldShowValue = showValue && variant !== 'value-in-thumb';
		const shouldShowValueInThumb = variant === 'value-in-thumb';
		const isInputVariant = variant === 'with-input';

		// Generate tick marks if requested
		let ticksHtml = '';
		if (showTicks && !vertical) {
			const step = this.getProp('step');
			const range = max - min;
			const majorStep = step * majorTickInterval;
			ticksHtml = '<div class="slider-ticks">';

			for (let val = min; val <= max; val += step) {
				const tickPercent = ((val - min) / range) * 100;
				const isMajor = (val - min) % majorStep === 0;
				ticksHtml += `<div class="slider-tick ${isMajor ? 'major' : ''}" style="left: ${tickPercent}%"></div>`;
			}
			ticksHtml += '</div>';
		}

		return `
      <div class="${classes.join(' ')}">
        ${icon ? `<span class="slider-icon icon-${iconSize}">${icon}</span>` : ''}
        ${label ? `<span class="slider-label">${label}</span>` : ''}
        ${showMinMax && !vertical ? `<span class="slider-min">${min}</span>` : ''}
        
        <div class="terminal-slider-wrapper">
          <div class="slider-track">
            ${ticksHtml}
            <div class="slider-track-fill" style="${vertical ? 'height' : 'width'}: ${percent}%"></div>
            <div class="slider-thumb ${this.isDragging ? 'dragging' : ''}" 
                 style="${vertical ? 'bottom' : 'left'}: ${percent}%"
                 tabindex="0">
              ${shouldShowValueInThumb ? `<span class="slider-value-in-thumb">${value}</span>` : ''}
            </div>
          </div>
        </div>
        
        ${showMinMax && !vertical ? `<span class="slider-max">${max}</span>` : ''}
        ${
			shouldShowValue
				? isInputVariant
					? `<input 
            class="slider-value editable"
            type="number" 
            value="${value}" 
            min="${min}" 
            max="${max}" 
            step="${this.getProp('step')}"
          />`
					: `<div class="slider-value">${value}</div>`
				: ''
		}
      </div>
    `;
	}

	afterRender() {
		const thumb = this.$('.slider-thumb');
		const track = this.$('.slider-track');
		const valueInput = this.$('input.slider-value');

		// Thumb events
		if (thumb) {
			this.addListener(thumb, 'mousedown', this.handleMouseDown);
			this.addListener(thumb, 'touchstart', this.handleMouseDown);
			this.addListener(thumb, 'keydown', this.handleKeyDown);
		}

		// Track click
		if (track) {
			this.addListener(track, 'click', this.handleTrackClick);
		}

		// Value input for with-input variant
		if (valueInput) {
			this.addListener(valueInput, 'input', (e) => {
				const val = parseFloat(e.target.value);
				if (!isNaN(val)) {
					this.setValue(val);
				}
			});
			this.addListener(valueInput, 'wheel', (e) => {
				e.preventDefault();
				const delta = e.deltaY < 0 ? this.getProp('step') : -this.getProp('step');
				this.setValue(this.getProp('value') + delta);
			});
		}
	}

	onMount() {
		// Add global mouse listeners
		this.addListener(document, 'mousemove', this.handleMouseMove);
		this.addListener(document, 'mouseup', this.handleMouseUp);
		this.addListener(document, 'touchmove', this.handleMouseMove);
		this.addListener(document, 'touchend', this.handleMouseUp);
	}

	handleMouseDown(e) {
		if (this.getProp('disabled')) return;

		e.preventDefault();
		this.isDragging = true;

		const thumb = this.$('.slider-thumb');
		if (thumb) thumb.classList.add('dragging');

		// Get starting position
		if (e.touches) {
			this.startX = e.touches[0].clientX;
			this.startY = e.touches[0].clientY;
		} else {
			this.startX = e.clientX;
			this.startY = e.clientY;
		}

		this.startValue = this.getProp('value');
	}

	handleMouseMove(e) {
		if (!this.isDragging) return;

		e.preventDefault();

		const { min, max, step, vertical, smooth } = this._props;
		const track = this.$('.slider-track');
		if (!track) return;

		const rect = track.getBoundingClientRect();
		let percent;

		if (vertical) {
			const clientY = e.touches ? e.touches[0].clientY : e.clientY;
			percent = 1 - (clientY - rect.top) / rect.height;
		} else {
			const clientX = e.touches ? e.touches[0].clientX : e.clientX;
			percent = (clientX - rect.left) / rect.width;
		}

		// Clamp to 0-1
		percent = Math.max(0, Math.min(1, percent));

		// Calculate value
		let value = min + percent * (max - min);

		// Only snap to step if not in smooth mode
		if (!smooth || step >= 1) {
			value = Math.round(value / step) * step;
		}

		// Clamp to min/max
		value = Math.max(min, Math.min(max, value));

		this.setValue(value, true); // Pass true to indicate dragging
	}

	handleMouseUp(e) {
		if (!this.isDragging) return;

		this.isDragging = false;

		const thumb = this.$('.slider-thumb');
		if (thumb) thumb.classList.remove('dragging');
	}

	handleTrackClick(e) {
		if (this.getProp('disabled')) return;
		// Don't handle if clicking on thumb or value
		if (
			e.target.classList.contains('slider-thumb') ||
			e.target.classList.contains('slider-value-in-thumb')
		)
			return;

		const { min, max, step, vertical } = this._props;
		const rect = e.currentTarget.getBoundingClientRect();
		let percent;

		if (vertical) {
			percent = 1 - (e.clientY - rect.top) / rect.height;
		} else {
			percent = (e.clientX - rect.left) / rect.width;
		}

		// Calculate value
		let value = min + percent * (max - min);

		// Snap to step
		value = Math.round(value / step) * step;

		// Clamp to min/max
		value = Math.max(min, Math.min(max, value));

		this.setValue(value);
	}

	handleValueEdit(e) {
		const value = parseFloat(e.target.value);
		if (!isNaN(value)) {
			this.setValue(value);
		}
	}

	handleKeyDown(e) {
		if (this.getProp('disabled')) return;

		const { min, max, step } = this._props;
		let value = this.getProp('value');

		switch (e.key) {
			case 'ArrowLeft':
			case 'ArrowDown':
				e.preventDefault();
				value -= step;
				break;
			case 'ArrowRight':
			case 'ArrowUp':
				e.preventDefault();
				value += step;
				break;
			case 'Home':
				e.preventDefault();
				value = min;
				break;
			case 'End':
				e.preventDefault();
				value = max;
				break;
			case 'PageDown':
				e.preventDefault();
				value -= step * 10;
				break;
			case 'PageUp':
				e.preventDefault();
				value += step * 10;
				break;
			default:
				return;
		}

		// Clamp value
		value = Math.max(min, Math.min(max, value));
		this.setValue(value);
	}

	// Public API
	getValue() {
		return this.getProp('value');
	}

	setValue(value, isDragging = false) {
		const { min, max, step, variant, smooth } = this._props;

		// Validate and clamp
		value = parseFloat(value);
		if (isNaN(value)) value = min;

		// Only snap to step if not in smooth mode or for large steps
		if (!smooth || step >= 1) {
			value = Math.round(value / step) * step;
		}

		// Clamp to range
		value = Math.max(min, Math.min(max, value));

		// Round to avoid floating point issues
		const decimals =
			smooth && step < 1 ? 2 : step < 1 ? Math.abs(Math.floor(Math.log10(step))) : 0;
		value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);

		const oldValue = this.getProp('value');
		if (value !== oldValue) {
			// Calculate percentage
			const percentage = ((value - min) / (max - min)) * 100;

			// Don't re-render if input is focused
			const input = this.$('input.slider-value');
			const skipRender = input && input === document.activeElement;

			// Update internal value without rendering
			this._props.value = value;

			// Don't update attribute here - it causes infinite loops
			// The attribute will be updated by external callers if needed

			// Update UI elements directly
			if (!skipRender) {
				// Normal render for non-input changes
				this.render();
			} else {
				// Manual update without re-rendering
				const fillBar = this.$('.slider-track-fill');
				const thumb = this.$('.slider-thumb');
				const valueInThumb = this.$('.slider-value-in-thumb');

				if (fillBar) fillBar.style.width = `${percentage}%`;
				if (thumb) thumb.style.left = `${percentage}%`;
				if (valueInThumb) valueInThumb.textContent = value;
			}

			// Update input field directly if using with-input variant
			if (variant === 'with-input' && input && input !== document.activeElement) {
				input.value = value;
			}

			// Emit appropriate event - but check if we're in an attribute change to prevent loops
			// If this setValue was called from onAttributeChange, don't emit events
			if (!this._isAttributeUpdate) {
				if (isDragging) {
					// Emit slider-input during drag
					this.emit('slider-input', { value, percentage, oldValue });
				} else {
					// Emit slider-change when drag ends or value is set programmatically
					this.emit('slider-change', { value, percentage, oldValue });
				}
			}
		}
	}

	setMin(min) {
		this.setProp('min', parseFloat(min) || 0);
		// Revalidate current value
		if (this.getProp('value') < min) {
			this.setValue(min);
		}
	}

	setMax(max) {
		this.setProp('max', parseFloat(max) || 100);
		// Revalidate current value
		if (this.getProp('value') > max) {
			this.setValue(max);
		}
	}

	setStep(step) {
		this.setProp('step', parseFloat(step) || 1);
		// Re-snap current value
		this.setValue(this.getProp('value'));
	}

	setRange(min, max) {
		this.setMin(min);
		this.setMax(max);
	}

	disable() {
		this.setProp('disabled', true);
	}

	enable() {
		this.setProp('disabled', false);
	}

	reset() {
		const { min, max } = this._props;
		this.setValue((min + max) / 2);
	}

	increment() {
		this.setValue(this.getProp('value') + this.getProp('step'));
	}

	decrement() {
		this.setValue(this.getProp('value') - this.getProp('step'));
	}

	setVariant(variant) {
		this.setProp('variant', variant);
	}

	setIcon(iconSvg) {
		this.setProp('icon', iconSvg);
	}

	setSmooth(smooth) {
		this.setProp('smooth', smooth);
	}

	setShowTicks(show) {
		this.setProp('showTicks', show);
	}
}

// Register the component
customElements.define('t-sld', TSlider);
