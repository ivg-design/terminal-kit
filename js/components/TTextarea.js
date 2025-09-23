/**
 * TerminalTextarea Web Component
 * A multiline text input with terminal theme
 */

import { TComponent } from './TComponent.js';

export class TTextarea extends TComponent {
	static get observedAttributes() {
		return ['placeholder', 'value', 'rows', 'readonly', 'disabled', 'resizable', 'line-numbers', 'code-editor',
				'min-width', 'max-width', 'min-height', 'max-height'];
	}

	constructor() {
		super();

		// Initialize props
		this.setProps({
			placeholder: '',
			value: '',
			rows: 10,
			readonly: false,
			disabled: false,
			resizable: true,
			lineNumbers: false,
			codeEditor: false, // Separate flag for code editor mode
			minWidth: null,
			maxWidth: null,
			minHeight: null,
			maxHeight: null
		});
	}

	get componentClass() {
		return 'terminal-textarea';
	}

	onAttributeChange(name, oldValue, newValue) {
		switch (name) {
			case 'placeholder':
				this.setProp('placeholder', newValue || '');
				break;
			case 'value':
				this.setProp('value', newValue || '');
				break;
			case 'rows':
				this.setProp('rows', parseInt(newValue) || 10);
				break;
			case 'readonly':
				this.setProp('readonly', newValue !== null);
				break;
			case 'disabled':
				this.setProp('disabled', newValue !== null);
				break;
			case 'resizable':
				this.setProp('resizable', newValue !== 'false');
				break;
			case 'line-numbers':
				const showLineNumbers = newValue !== null && newValue !== 'false';
				this.setProp('lineNumbers', showLineNumbers);
				// If enabling line numbers, also enable code editor mode
				if (showLineNumbers) {
					this.setProp('codeEditor', true);
				}
				this.updateLineNumbers();
				break;
			case 'code-editor':
				this.setProp('codeEditor', newValue !== null && newValue !== 'false');
				break;
			case 'min-width':
				this.setProp('minWidth', newValue);
				this.updateStyles();
				break;
			case 'max-width':
				this.setProp('maxWidth', newValue);
				this.updateStyles();
				break;
			case 'min-height':
				this.setProp('minHeight', newValue);
				this.updateStyles();
				break;
			case 'max-height':
				this.setProp('maxHeight', newValue);
				this.updateStyles();
				break;
		}
	}

	template() {
		const { placeholder, value, rows, readonly, disabled, resizable, lineNumbers, codeEditor,
				minWidth, maxWidth, minHeight, maxHeight } = this._props;

		const textareaClasses = ['textarea'];
		if (resizable) {
			textareaClasses.push('textarea-resizable');
		}
		if (codeEditor) {
			textareaClasses.push('textarea-with-lines');
		}

		// Build inline styles for size constraints
		const styles = [];
		if (minWidth) styles.push(`min-width: ${minWidth}`);
		if (maxWidth) styles.push(`max-width: ${maxWidth}`);
		if (minHeight) styles.push(`min-height: ${minHeight}`);
		if (maxHeight) styles.push(`max-height: ${maxHeight}`);
		const styleAttr = styles.length > 0 ? `style="${styles.join('; ')}"` : '';

		// Use container structure for code editor mode (with or without line numbers)
		if (codeEditor) {
			const containerClass = lineNumbers ? 'textarea-container with-line-numbers' : 'textarea-container code-editor-mode';
			return `
				<div class="${containerClass}" ${styleAttr}>
					<div class="line-numbers" ${!lineNumbers ? 'style="display: none;"' : ''}></div>
					<textarea
						class="${textareaClasses.join(' ')}"
						placeholder="${placeholder}"
						rows="${rows}"
						${readonly ? 'readonly' : ''}
						${disabled ? 'disabled' : ''}
						spellcheck="false"
					>${value}</textarea>
				</div>
			`;
		} else {
			// Regular textarea without code editor features
			return `
				<textarea
					class="${textareaClasses.join(' ')}"
					placeholder="${placeholder}"
					rows="${rows}"
					${readonly ? 'readonly' : ''}
					${disabled ? 'disabled' : ''}
					${styleAttr}
				>${value}</textarea>
			`;
		}
	}

	afterRender() {
		const textarea = this.$('textarea');
		if (textarea) {
			// Handle input events
			this.addListener(textarea, 'input', (e) => {
				this._props.value = e.target.value;
				this.emit('input', { value: e.target.value });
				if (this._props.lineNumbers) {
					this.updateLineNumbers();
				}
			});

			// Handle change events
			this.addListener(textarea, 'change', (e) => {
				this.emit('change', { value: e.target.value });
			});

			// Handle focus/blur
			this.addListener(textarea, 'focus', () => {
				this.emit('focus');
			});

			this.addListener(textarea, 'blur', () => {
				this.emit('blur');
			});

			// Code editor mode features
			if (this._props.codeEditor) {
				// Add IDE-like keyboard shortcuts
				this.addListener(textarea, 'keydown', (e) => {
					this.handleIDEKeyboard(e);
				});

				// Handle scroll for line numbers sync (if line numbers are visible)
				if (this._props.lineNumbers) {
					this.addListener(textarea, 'scroll', () => {
						this.syncLineNumbersScroll();
					});

					// Initial line numbers
					this.updateLineNumbers();
				}
			}
		}
	}

	// Public API
	getValue() {
		const textarea = this.$('textarea');
		return textarea ? textarea.value : this._props.value;
	}

	setValue(value) {
		this._props.value = value;
		const textarea = this.$('textarea');
		if (textarea) {
			textarea.value = value;
			if (this._props.lineNumbers) {
				this.updateLineNumbers();
			}
		}
	}

	focus() {
		const textarea = this.$('textarea');
		if (textarea) {
			textarea.focus();
		}
	}

	blur() {
		const textarea = this.$('textarea');
		if (textarea) {
			textarea.blur();
		}
	}

	setReadonly(readonly) {
		this.setProp('readonly', readonly);
		if (readonly) {
			this.setAttribute('readonly', '');
		} else {
			this.removeAttribute('readonly');
		}
	}

	setDisabled(disabled) {
		this.setProp('disabled', disabled);
		if (disabled) {
			this.setAttribute('disabled', '');
		} else {
			this.removeAttribute('disabled');
		}
	}

	setRows(rows) {
		this.setProp('rows', rows);
		this.setAttribute('rows', rows);
	}

	selectAll() {
		const textarea = this.$('textarea');
		if (textarea) {
			textarea.select();
		}
	}

	// Line numbers control
	setLineNumbers(enabled) {
		this.setProp('lineNumbers', enabled);
		if (enabled) {
			this.setAttribute('line-numbers', '');
		} else {
			this.removeAttribute('line-numbers');
		}

		// If in code editor mode, just toggle visibility
		if (this._props.codeEditor) {
			const lineNumbersEl = this.$('.line-numbers');
			const container = this.$('.textarea-container');
			if (lineNumbersEl) {
				lineNumbersEl.style.display = enabled ? 'block' : 'none';
			}
			if (container) {
				if (enabled) {
					container.classList.add('with-line-numbers');
					container.classList.remove('code-editor-mode');
				} else {
					container.classList.remove('with-line-numbers');
					container.classList.add('code-editor-mode');
				}
			}
			if (enabled) {
				this.updateLineNumbers();
			}
		} else {
			// Not in code editor mode, need to switch modes
			if (enabled) {
				this.setProp('codeEditor', true);
				this.render();
			}
		}
	}

	toggleLineNumbers() {
		const newState = !this._props.lineNumbers;
		this.setLineNumbers(newState);
		return newState;
	}

	// Size constraints
	setMinWidth(width) {
		this.setProp('minWidth', width);
		this.setAttribute('min-width', width);
		this.updateStyles();
	}

	setMaxWidth(width) {
		this.setProp('maxWidth', width);
		this.setAttribute('max-width', width);
		this.updateStyles();
	}

	setMinHeight(height) {
		this.setProp('minHeight', height);
		this.setAttribute('min-height', height);
		this.updateStyles();
	}

	setMaxHeight(height) {
		this.setProp('maxHeight', height);
		this.setAttribute('max-height', height);
		this.updateStyles();
	}

	updateStyles() {
		const { minWidth, maxWidth, minHeight, maxHeight, lineNumbers } = this._props;
		const element = lineNumbers ? this.$('.textarea-container') : this.$('textarea');

		if (element) {
			if (minWidth) element.style.minWidth = minWidth;
			if (maxWidth) element.style.maxWidth = maxWidth;
			if (minHeight) element.style.minHeight = minHeight;
			if (maxHeight) element.style.maxHeight = maxHeight;
		}
	}

	// Line numbers functionality
	updateLineNumbers() {
		if (!this._props.lineNumbers) return;

		const lineNumbersEl = this.$('.line-numbers');
		const textarea = this.$('textarea');

		if (!lineNumbersEl || !textarea) return;

		const value = textarea.value || '';
		const lines = value.split('\n');
		const lineCount = Math.max(lines.length, parseInt(this._props.rows) || 10);

		// Generate line numbers
		let lineNumbersHTML = '';
		for (let i = 1; i <= lineCount; i++) {
			lineNumbersHTML += `<div class="line-number">${i}</div>`;
		}

		lineNumbersEl.innerHTML = lineNumbersHTML;

		// Sync scroll position
		this.syncLineNumbersScroll();
	}

	syncLineNumbersScroll() {
		const lineNumbersEl = this.$('.line-numbers');
		const textarea = this.$('textarea');

		if (lineNumbersEl && textarea) {
			lineNumbersEl.scrollTop = textarea.scrollTop;
		}
	}

	handleIDEKeyboard(e) {
		const textarea = e.target;

		// Tab key - insert tab or spaces
		if (e.key === 'Tab') {
			e.preventDefault();

			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const value = textarea.value;

			if (e.shiftKey) {
				// Shift+Tab - outdent
				if (start === end) {
					// No selection - outdent current line
					const lineStart = value.lastIndexOf('\n', start - 1) + 1;
					const lineEnd = value.indexOf('\n', start);
					const line = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd);

					if (line.startsWith('\t')) {
						// Remove tab
						textarea.value = value.substring(0, lineStart) + line.substring(1) + value.substring(lineEnd === -1 ? value.length : lineEnd);
						textarea.selectionStart = textarea.selectionEnd = Math.max(lineStart, start - 1);
					} else if (line.startsWith('    ')) {
						// Remove 4 spaces
						textarea.value = value.substring(0, lineStart) + line.substring(4) + value.substring(lineEnd === -1 ? value.length : lineEnd);
						textarea.selectionStart = textarea.selectionEnd = Math.max(lineStart, start - 4);
					} else if (line.startsWith(' ')) {
						// Remove leading spaces (up to 4)
						const spaces = line.match(/^ {1,4}/)[0].length;
						textarea.value = value.substring(0, lineStart) + line.substring(spaces) + value.substring(lineEnd === -1 ? value.length : lineEnd);
						textarea.selectionStart = textarea.selectionEnd = Math.max(lineStart, start - spaces);
					}
				} else {
					// Selection - outdent all selected lines
					const lines = this.getSelectedLines(textarea);
					let newValue = value.substring(0, lines.start);
					let offset = 0;

					lines.text.split('\n').forEach((line, i) => {
						if (i > 0) newValue += '\n';
						if (line.startsWith('\t')) {
							newValue += line.substring(1);
							if (i === 0) offset = 1;
						} else if (line.startsWith('    ')) {
							newValue += line.substring(4);
							if (i === 0) offset = 4;
						} else if (line.startsWith(' ')) {
							const spaces = line.match(/^ {1,4}/)?.[0].length || 0;
							newValue += line.substring(spaces);
							if (i === 0) offset = spaces;
						} else {
							newValue += line;
						}
					});

					newValue += value.substring(lines.end);
					textarea.value = newValue;
					textarea.selectionStart = Math.max(lines.start, start - offset);
					textarea.selectionEnd = end - offset * lines.text.split('\n').length;
				}
			} else {
				// Tab - indent
				if (start === end) {
					// No selection - insert tab at cursor
					textarea.value = value.substring(0, start) + '\t' + value.substring(end);
					textarea.selectionStart = textarea.selectionEnd = start + 1;
				} else {
					// Selection - indent all selected lines
					const lines = this.getSelectedLines(textarea);
					const indentedText = lines.text.split('\n').map(line => '\t' + line).join('\n');
					textarea.value = value.substring(0, lines.start) + indentedText + value.substring(lines.end);
					textarea.selectionStart = start + 1;
					textarea.selectionEnd = end + lines.text.split('\n').length;
				}
			}

			// Trigger input event to update line numbers
			textarea.dispatchEvent(new Event('input'));
		}

		// Enter key - auto-indent new line
		if (e.key === 'Enter') {
			const start = textarea.selectionStart;
			const value = textarea.value;
			const lineStart = value.lastIndexOf('\n', start - 1) + 1;
			const currentLine = value.substring(lineStart, start);

			// Get indentation from current line
			const indent = currentLine.match(/^[\t ]*/)[0];

			// Check if we should increase indent (e.g., after {, [, ( )
			const trimmedLine = currentLine.trim();
			const shouldIncreaseIndent = /[{[\(]$/.test(trimmedLine);

			// Insert new line with proper indentation
			e.preventDefault();
			const newIndent = shouldIncreaseIndent ? indent + '\t' : indent;
			textarea.value = value.substring(0, start) + '\n' + newIndent + value.substring(textarea.selectionEnd);
			textarea.selectionStart = textarea.selectionEnd = start + 1 + newIndent.length;

			// Trigger input event to update line numbers
			textarea.dispatchEvent(new Event('input'));
		}

		// Ctrl/Cmd + / - Toggle line comment
		if ((e.ctrlKey || e.metaKey) && e.key === '/') {
			e.preventDefault();
			const lines = this.getSelectedLines(textarea);
			const value = textarea.value;

			// Detect if all selected lines are commented
			const selectedLines = lines.text.split('\n');
			const allCommented = selectedLines.every(line => line.trim().startsWith('//') || line.trim() === '');

			let newText;
			if (allCommented) {
				// Uncomment
				newText = selectedLines.map(line => {
					const trimmed = line.trim();
					if (trimmed.startsWith('// ')) {
						return line.replace('// ', '');
					} else if (trimmed.startsWith('//')) {
						return line.replace('//', '');
					}
					return line;
				}).join('\n');
			} else {
				// Comment
				newText = selectedLines.map(line => {
					if (line.trim() === '') return line;
					return line.replace(/^(\s*)/, '$1// ');
				}).join('\n');
			}

			textarea.value = value.substring(0, lines.start) + newText + value.substring(lines.end);
			textarea.selectionStart = lines.start;
			textarea.selectionEnd = lines.start + newText.length;

			// Trigger input event
			textarea.dispatchEvent(new Event('input'));
		}

		// Ctrl/Cmd + D - Duplicate line
		if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
			e.preventDefault();
			const lines = this.getSelectedLines(textarea);
			const value = textarea.value;

			textarea.value = value.substring(0, lines.end) + '\n' + lines.text + value.substring(lines.end);
			textarea.selectionStart = lines.end + 1;
			textarea.selectionEnd = lines.end + 1 + lines.text.length;

			// Trigger input event
			textarea.dispatchEvent(new Event('input'));
		}
	}

	getSelectedLines(textarea) {
		const value = textarea.value;
		let start = textarea.selectionStart;
		let end = textarea.selectionEnd;

		// Expand selection to full lines
		while (start > 0 && value[start - 1] !== '\n') {
			start--;
		}
		while (end < value.length && value[end] !== '\n') {
			end++;
		}

		return {
			start: start,
			end: end,
			text: value.substring(start, end)
		};
	}
}

// Register the component
customElements.define('t-txt', TTextarea);