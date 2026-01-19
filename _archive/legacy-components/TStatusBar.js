/**
 * TerminalStatusBar Web Component
 * A flexible status bar component with dynamic fields, alignment, and marquee support
 * 
 * @example Basic Usage:
 * ```javascript
 * const statusBar = document.getElementById('myStatusBar');
 * statusBar.setFields([
 *   { label: 'CPU', value: '42%', width: '25%' },
 *   { label: 'Memory', value: '8GB', width: '25%' },
 *   { label: 'Status', value: 'Running', width: 'auto', align: 'right' }
 * ]);
 * ```
 * 
 * @example With Data Source Integration:
 * ```javascript
 * // Connect to real-time data
 * setInterval(() => {
 *   statusBar.updateFieldValue(0, getCPUUsage() + '%');
 *   statusBar.updateFieldValue(1, getMemoryUsage());
 * }, 1000);
 * ```
 * 
 * @example Advanced Features:
 * ```javascript
 * statusBar.setFields([
 *   {
 *     label: 'File',
 *     value: 'very_long_filename_that_needs_scrolling.txt',
 *     width: '35%',
 *     align: 'left',
 *     marquee: true,  // Enable scrolling for long text
 *     marqueeSpeed: 30,
 *     icon: '<svg>...</svg>',  // Optional icon
 *     displayMode: 'icon-text'  // Show both icon and text
 *   },
 *   {
 *     label: 'Status',
 *     value: 'Connected',
 *     width: 'auto',
 *     align: 'right'
 *   }
 * ]);
 * ```
 * 
 * @features
 * - Dynamic field management
 * - Width control (percentage or auto)
 * - Alignment control (left/center/right) with margin-based positioning
 * - Marquee scrolling for long text
 * - Icon support with multiple display modes
 * - Automatic width validation (prevents >100% total)
 * - Compact mode support
 * - Field separators
 */

import { TComponent } from './TComponent.js';

/**
 * @class TerminalStatusBar
 * @extends TComponent
 * 
 * @property {string} separator - Field separator (default: ' | ')
 * @property {Array} fields - Array of field configurations
 * 
 * @example HTML Usage:
 * ```html
 * <terminal-status-bar id="statusBar" separator=" • " compact>
 * </terminal-status-bar>
 * ```
 * 
 * @example Width Control:
 * - Percentage: '25%' - Takes 25% of available width
 * - Pixels: '100px' - Fixed pixel width
 * - Auto: 'auto' - Shrinks to content size
 * - Total widths are automatically scaled if >95%
 * 
 * @example Alignment Control:
 * - 'left': Default alignment
 * - 'right': First right-aligned field gets margin-left:auto
 * - 'center': Isolated center fields get auto margins
 * - Uses flexbox with justify-content:space-between
 * 
 * @example Data Source Integration:
 * ```javascript
 * // Connect to WebSocket for real-time updates
 * ws.onmessage = (event) => {
 *   const data = JSON.parse(event.data);
 *   statusBar.updateFieldValue(0, data.cpu);
 *   statusBar.updateFieldValue(1, data.memory);
 * };
 * 
 * // Or poll an API
 * async function updateStatus() {
 *   const stats = await fetch('/api/stats').then(r => r.json());
 *   statusBar.setFields([
 *     { label: 'CPU', value: stats.cpu + '%', width: '20%' },
 *     { label: 'RAM', value: stats.ram, width: '20%' },
 *     { label: 'Load', value: stats.load, width: 'auto', align: 'right' }
 *   ]);
 * }
 * setInterval(updateStatus, 5000);
 * ```
 */
export class TStatusBar extends TComponent {
	static get observedAttributes() {
		return ['separator'];
	}

	constructor() {
		super();

		// Initialize props
		this.setProps({
			separator: ' | ',
			fields: []
		});
		
		// Track marquee animations
		this._marqueeAnimations = new Map();
	}

	onAttributeChange(name, oldValue, newValue) {
		switch (name) {
			case 'separator':
				this.setProp('separator', newValue || ' | ');
				break;
		}
	}

	template() {
		const { separator, fields } = this._props;
		
		const classes = ['status-bar'];

		let fieldsHtml = '';
		fields.forEach((field, index) => {
			if (index > 0 && separator) {
				fieldsHtml += `<span class="status-separator">${separator}</span>`;
			}
			
			// Build field HTML with enhanced features
			const fieldClasses = ['status-field'];
			if (field.width && field.width !== 'auto') {
				fieldClasses.push('has-width');
			}
			if (field.marquee) {
				fieldClasses.push('marquee-enabled');
			}
			
			// Add margin class based on alignment
			const marginClass = this.getMarginClass(field, index, fields);
			if (marginClass) {
				fieldClasses.push(marginClass);
			}
			
			// Determine what to display based on displayMode
			const displayMode = field.displayMode || 'text';
			const showIcon = field.icon && (displayMode === 'icon' || displayMode === 'icon-text');
			const showLabel = field.label && (displayMode === 'text' || displayMode === 'icon-text');
			
			// Use validated width
			const width = field.validatedWidth || field.width || 'auto';
			const styles = [];
			if (width !== 'auto') {
				styles.push(`width: ${width}`);
				styles.push(`flex: 0 1 ${width}`); // Allow shrink but not grow
			}
			
			fieldsHtml += `
				<div class="${fieldClasses.join(' ')}" 
				     data-field-index="${index}"
				     style="${styles.join('; ')}">
					${showIcon ? `<span class="field-icon">${field.icon}</span>` : ''}
					${showLabel ? `<span class="field-label">${field.label}:</span>` : ''}
					<div class="field-value-wrapper">
						<span class="field-value">${field.value || ''}</span>
					</div>
				</div>
			`;
		});

		return `<div class="${classes.join(' ')}">${fieldsHtml}</div>`;
	}

	get componentClass() {
		return 't-sta';
	}
	
	afterRender() {
		// Store initial field widths
		this._props.fields.forEach((field, index) => {
			const fieldElement = this.$(`.status-field[data-field-index="${index}"]`);
			if (fieldElement && !fieldElement.dataset.initialWidth) {
				// Store the natural width when first rendered
				fieldElement.dataset.initialWidth = fieldElement.offsetWidth;
			}
		});
		
		// Check and setup marquee for each field if needed
		this._props.fields.forEach((field, index) => {
			if (field.marquee) {
				this.checkMarqueeNeeded(index);
			}
		});
	}
	
	checkMarqueeNeeded(fieldIndex) {
		const fieldElement = this.$(`.status-field[data-field-index="${fieldIndex}"]`);
		const valueElement = fieldElement?.querySelector('.field-value');
		const wrapper = fieldElement?.querySelector('.field-value-wrapper');
		
		if (!valueElement || !fieldElement || !wrapper) return;
		
		// Get the field configuration
		const field = this._props.fields[fieldIndex];
		if (!field.marquee) {
			this.stopMarquee(fieldIndex, fieldElement);
			return;
		}
		
		// Always use the initial width to maintain consistency
		const initialWidth = fieldElement.dataset.initialWidth || fieldElement.offsetWidth;
		
		// Lock the field to its initial width
		fieldElement.style.width = `${initialWidth}px`;
		fieldElement.style.minWidth = `${initialWidth}px`;
		fieldElement.style.maxWidth = `${initialWidth}px`;
		
		// Measure widths - use wrapper width for container
		const containerWidth = wrapper.offsetWidth;
		const textWidth = valueElement.scrollWidth;
		
		// Enable marquee if text overflows
		if (textWidth > containerWidth - 10) { // Small buffer for padding
			this.startMarquee(fieldIndex, fieldElement, valueElement);
		} else {
			this.stopMarquee(fieldIndex, fieldElement);
		}
	}
	
	startMarquee(fieldIndex, fieldElement, valueElement) {
		if (fieldElement.classList.contains('marquee-active')) return;
		
		// Add marquee class
		fieldElement.classList.add('marquee-active');
		
		// Find the value wrapper
		const wrapper = fieldElement.querySelector('.field-value-wrapper');
		if (!wrapper) return;
		
		// Get the field value
		const field = this._props.fields[fieldIndex];
		const value = field.value || '';
		
		// Create marquee structure like dropdown does
		const span = document.createElement('span');
		span.innerHTML = `
			<span class="marquee-text">${value}</span>
			<span class="marquee-text">${value}</span>
		`;
		
		// Replace wrapper content
		wrapper.innerHTML = '';
		wrapper.appendChild(span);
	}
	
	stopMarquee(fieldIndex, fieldElement) {
		if (!fieldElement) return;
		
		fieldElement.classList.remove('marquee-active');
		
		// Keep the width locked to initial width even when marquee stops
		const field = this._props.fields[fieldIndex];
		if (field.marquee) {
			// If marquee is still enabled, keep width locked
			const initialWidth = fieldElement.dataset.initialWidth || fieldElement.offsetWidth;
			fieldElement.style.width = `${initialWidth}px`;
			fieldElement.style.minWidth = `${initialWidth}px`;
			fieldElement.style.maxWidth = `${initialWidth}px`;
		} else {
			// Only remove width lock if marquee is disabled
			fieldElement.style.width = '';
			fieldElement.style.minWidth = '';
			fieldElement.style.maxWidth = '';
		}
		
		// Restore normal value display
		const wrapper = fieldElement.querySelector('.field-value-wrapper');
		if (wrapper) {
			wrapper.innerHTML = `<span class="field-value">${field.value || ''}</span>`;
		}
	}

	/**
	 * PUBLIC API METHODS
	 */
	
	/**
	 * Set all fields at once
	 * @param {Array<Object>} fields - Array of field configurations
	 * @param {string} fields[].label - Field label text
	 * @param {string} fields[].value - Field value text
	 * @param {string} [fields[].width='auto'] - Width (e.g., '25%', '100px', 'auto')
	 * @param {string} [fields[].align='left'] - Alignment ('left', 'center', 'right')
	 * @param {boolean} [fields[].marquee=false] - Enable marquee scrolling
	 * @param {number} [fields[].marqueeSpeed=30] - Marquee scroll speed
	 * @param {string} [fields[].icon] - SVG icon HTML
	 * @param {string} [fields[].displayMode='text'] - Display mode ('text', 'icon', 'icon-text')
	 * 
	 * @example
	 * statusBar.setFields([
	 *   { label: 'CPU', value: '42%', width: '20%' },
	 *   { label: 'RAM', value: '8GB', width: '20%' },
	 *   { label: 'Disk', value: '256GB', width: '30%', align: 'right' }
	 * ]);
	 */
	setFields(fields) {
		// Enhanced fields with default values and width validation
		const enhancedFields = this.validateFieldWidths(fields.map(field => ({
			label: field.label || '',
			value: field.value || '',
			icon: field.icon || null,
			width: field.width || 'auto',
			displayMode: field.displayMode || 'text', // 'text', 'icon', 'icon-text'
			align: field.align || 'left', // 'left', 'center', 'right'
			marquee: field.marquee || false,
			marqueeSpeed: field.marqueeSpeed || 30
		})));
		this.setProp('fields', enhancedFields);
	}

	/**
	 * Add a single field to the status bar
	 * @param {Object} field - Field configuration (same as setFields)
	 * @example
	 * statusBar.addField({
	 *   label: 'Network',
	 *   value: '1Gbps',
	 *   width: '15%',
	 *   align: 'right'
	 * });
	 */
	addField(field) {
		// Enhanced field with defaults
		const enhancedField = {
			label: field.label || '',
			value: field.value || '',
			icon: field.icon || null,
			width: field.width || 'auto',
			displayMode: field.displayMode || 'text',
			align: field.align || 'left',
			marquee: field.marquee || false,
			marqueeSpeed: field.marqueeSpeed || 30
		};
		const fields = this.validateFieldWidths([...this._props.fields, enhancedField]);
		this.setProp('fields', fields);
	}

	/**
	 * Update a field's properties
	 * @param {number} index - Field index
	 * @param {Object} updates - Properties to update
	 * @example
	 * statusBar.updateField(0, { 
	 *   value: '55%',
	 *   marquee: true 
	 * });
	 */
	updateField(index, updates) {
		let fields = [...this._props.fields];
		if (fields[index]) {
			fields[index] = { ...fields[index], ...updates };
			// Re-validate widths if width or alignment changed
			if (updates.width !== undefined || updates.align !== undefined) {
				fields = this.validateFieldWidths(fields);
			}
			this.setProp('fields', fields);
			// Handle marquee updates
			if (updates.value !== undefined || updates.marquee !== undefined) {
				setTimeout(() => {
					const fieldElement = this.$(`.status-field[data-field-index="${index}"]`);
					if (fieldElement && updates.marquee === false) {
						// Clear width locks when marquee is disabled
						fieldElement.style.width = '';
						fieldElement.style.minWidth = '';
						fieldElement.style.maxWidth = '';
						delete fieldElement.dataset.initialWidth;
					}
					this.checkMarqueeNeeded(index);
				}, 0);
			}
		}
	}

	/**
	 * Remove a field by index
	 * @param {number} index - Field index to remove
	 */
	removeField(index) {
		const fields = [...this._props.fields];
		fields.splice(index, 1);
		this.setProp('fields', fields);
	}

	/**
	 * Clear all fields
	 */
	clearFields() {
		this.setProp('fields', []);
	}

	/**
	 * Set the separator between fields
	 * @param {string} separator - Separator string (e.g., ' | ', ' • ', ' - ')
	 * @example
	 * statusBar.setSeparator(' • ');
	 */
	setSeparator(separator) {
		this.setProp('separator', separator);
		this.setAttribute('separator', separator);
	}

	
	/**
	 * HELPER METHODS FOR COMMON OPERATIONS
	 */
	
	/**
	 * Update only the value of a field
	 * @param {number} index - Field index
	 * @param {string} value - New value
	 * @example
	 * // Update CPU usage every second
	 * setInterval(() => {
	 *   statusBar.updateFieldValue(0, getCPUUsage() + '%');
	 * }, 1000);
	 */
	updateFieldValue(index, value) {
		this.updateField(index, { value });
	}
	
	/**
	 * Update only the label of a field
	 * @param {number} index - Field index
	 * @param {string} label - New label
	 */
	updateFieldLabel(index, label) {
		this.updateField(index, { label });
	}
	
	/**
	 * Enable marquee scrolling for a field
	 * @param {number} index - Field index
	 */
	enableFieldMarquee(index) {
		this.updateField(index, { marquee: true });
	}
	
	/**
	 * Disable marquee scrolling for a field
	 * @param {number} index - Field index
	 */
	disableFieldMarquee(index) {
		this.updateField(index, { marquee: false });
	}
	
	/**
	 * INTERNAL METHODS
	 */
	
	/**
	 * Validate and adjust field widths to prevent overflow
	 * Automatically scales down widths if total exceeds 95%
	 * @private
	 */
	validateFieldWidths(fields) {
		// Calculate total width percentage
		let totalPercentage = 0;
		let autoCount = 0;
		const maxAllowedTotal = 95; // Leave 5% for margins/separators
		
		fields.forEach(field => {
			if (field.width && field.width !== 'auto') {
				const match = field.width.match(/(\d+(?:\.\d+)?)%/);
				if (match) {
					totalPercentage += parseFloat(match[1]);
				}
			} else {
				autoCount++;
			}
		});
		
		// If total exceeds max allowed, scale down proportionally
		if (totalPercentage > maxAllowedTotal) {
			const scale = maxAllowedTotal / totalPercentage;
			fields.forEach(field => {
				if (field.width && field.width !== 'auto') {
					const match = field.width.match(/(\d+(?:\.\d+)?)%/);
					if (match) {
						const newWidth = parseFloat(match[1]) * scale;
						field.validatedWidth = `${newWidth.toFixed(1)}%`;
					}
				} else {
					field.validatedWidth = null;
				}
			});
		} else {
			// Clear validated width if not needed
			fields.forEach(field => {
				field.validatedWidth = field.width;
			});
		}
		
		return fields;
	}
	
	/**
	 * Determine margin class for alignment
	 * Uses margin-based positioning for field alignment
	 * @private
	 */
	getMarginClass(field, index, allFields) {
		const align = field.align || 'left';
		const prevAlign = index > 0 ? (allFields[index - 1].align || 'left') : null;
		
		// Detect alignment transitions
		// When transitioning from left/center to right, push right
		if (align === 'right' && prevAlign !== 'right') {
			return 'push-right';
		}
		
		// When transitioning from left to center, push center
		if (align === 'center' && prevAlign === 'left') {
			// Check if next is also center or if this is isolated
			const nextAlign = index < allFields.length - 1 ? (allFields[index + 1].align || 'left') : null;
			if (nextAlign !== 'right') {
				return 'push-center';
			}
		}
		
		// When transitioning from right back to left (rare but possible)
		if (align === 'left' && prevAlign === 'right') {
			return 'push-left';
		}
		
		return null;
	}
	
	onUnmount() {
		// Clean up all marquee animations
		this._props.fields.forEach((field, index) => {
			const fieldElement = this.$(`.status-field[data-field-index="${index}"]`);
			if (fieldElement) {
				this.stopMarquee(index, fieldElement);
			}
		});
	}
}

// Register the component
customElements.define('t-sta', TStatusBar);