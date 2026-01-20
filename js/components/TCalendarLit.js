/**
 * @fileoverview TCalendarLit - Date picker/calendar component
 * @module components/TCalendarLit
 * @version 3.0.0
 *
 * A FULL profile calendar component with date selection, range selection,
 * multiple views (days/months/years), and date constraints.
 */

import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import componentLogger from '../utils/ComponentLogger.js';
import { caretLeftIcon, caretRightIcon } from '../utils/phosphor-icons.js';

// ============================================================
// BLOCK 1: Static Metadata
// ============================================================

/**
 * @component TCalendarLit
 * @tagname t-cal
 * @description Date picker/calendar component with single/multiple/range selection.
 * @category Form
 * @since 3.0.0
 *
 * @element t-cal
 *
 * @fires date-select - Fired when a date is selected
 * @fires month-change - Fired when the displayed month changes
 * @fires view-change - Fired when the view changes (days/months/years)
 * @fires range-select - Fired when a date range is selected
 *
 * @csspart calendar - The calendar container
 * @csspart header - Calendar header
 * @csspart nav-btn - Navigation buttons
 * @csspart title - Month/year title
 * @csspart weekdays - Weekday header row
 * @csspart day - Individual day cell
 * @csspart day-selected - Selected day
 * @csspart day-today - Today's date
 * @csspart day-disabled - Disabled day
 */
class TCalendarLit extends LitElement {
	/** @static @readonly */
	static tagName = 't-cal';

	/** @static @readonly */
	static version = '3.0.0';

	/** @static @readonly */
	static category = 'Form';

	// ============================================================
	// BLOCK 2: Static Styles
	// ============================================================

	static styles = css`
		:host {
			display: block;
			flex-direction: column;
			font-family: var(--t-font-mono, 'JetBrains Mono', monospace);
			background: var(--t-cal-bg, var(--terminal-gray-darkest, #1a1a1a));
			border: 1px solid var(--t-cal-border, var(--terminal-gray-dark, #333));
			color: var(--t-cal-color, var(--terminal-green, #00ff41));
			padding: 8px;
			width: 100%;
			max-width: 100%;
			box-sizing: border-box;
			overflow: hidden;
			user-select: none;
			-webkit-user-select: none;
		}

		:host([inline]) {
			display: inline-flex;
			width: auto;
			max-width: 320px;
		}

		:host([compact]) .calendar-footer {
			display: none;
		}

		:host([compact]) .weekday {
			padding: 1px;
		}

		:host([compact]) .day {
			font-size: 10px;
		}

		.calendar {
			display: flex;
			flex-direction: column;
			height: 100%;
			overflow: hidden;
		}

		.calendar-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 2px;
			flex-shrink: 0;
		}

		.nav-btn {
			background: transparent;
			border: 1px solid var(--terminal-gray-dark, #333);
			color: var(--terminal-green, #00ff41);
			width: 20px;
			height: 20px;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			font-family: inherit;
			font-size: 10px;
			transition: all 0.15s ease;
			flex-shrink: 0;
		}

		.nav-btn svg {
			width: 10px;
			height: 10px;
			fill: currentColor;
		}

		.nav-btn:hover {
			background: var(--terminal-green, #00ff41);
			color: var(--terminal-black, #0a0a0a);
			border-color: var(--terminal-green, #00ff41);
		}

		.nav-btn:disabled {
			opacity: 0.3;
			cursor: not-allowed;
			pointer-events: none;
		}

		.header-title {
			font-size: clamp(9px, 2.5vw, 12px);
			font-weight: bold;
			cursor: pointer;
			padding: 2px 6px;
			transition: all 0.15s ease;
			text-transform: uppercase;
			letter-spacing: 0.02em;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.header-title:hover {
			color: var(--terminal-amber, #ffb000);
		}

		/* Weekday header */
		.weekdays {
			display: grid;
			grid-template-columns: repeat(7, 1fr);
			gap: 1px;
			margin-bottom: 1px;
			flex-shrink: 0;
		}

		.weekday {
			text-align: center;
			font-size: clamp(7px, 1.5vw, 9px);
			color: var(--terminal-gray, #666);
			padding: 1px;
			text-transform: uppercase;
		}

		/* Days grid - auto rows that fill available space evenly */
		.days-grid {
			display: grid;
			grid-template-columns: repeat(7, 1fr);
			grid-auto-rows: 1fr;
			gap: 1px;
			flex: 1;
			min-height: 0;
		}

		.day {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: clamp(9px, 2vw, 12px);
			cursor: pointer;
			border: 1px solid transparent;
			transition: all 0.15s ease;
			position: relative;
			min-width: 0;
			min-height: 0;
		}

		.day:hover:not(.disabled):not(.outside) {
			background: var(--t-cal-hover, rgba(0, 255, 65, 0.1));
			border-color: var(--terminal-green, #00ff41);
		}

		.day.outside {
			color: var(--terminal-gray-dark, #333);
		}

		.day.today {
			font-weight: bold;
			background: rgba(255, 255, 255, 0.05);
		}

		.day.today::after {
			content: '';
			position: absolute;
			bottom: 2px;
			left: 50%;
			transform: translateX(-50%);
			width: 4px;
			height: 2px;
			background: var(--terminal-green-dim, #00cc33);
		}

		.day.selected {
			background: var(--terminal-green, #00ff41);
			color: var(--terminal-black, #0a0a0a);
			font-weight: bold;
		}

		/* Ensure selected overrides today styling */
		.day.selected.today::after {
			background: var(--terminal-black, #0a0a0a);
		}

		.day.in-range {
			background: rgba(0, 255, 65, 0.2);
		}

		.day.range-start {
			background: var(--terminal-green, #00ff41);
			color: var(--terminal-black, #0a0a0a);
			border-radius: 4px 0 0 4px;
		}

		.day.range-end {
			background: var(--terminal-green, #00ff41);
			color: var(--terminal-black, #0a0a0a);
			border-radius: 0 4px 4px 0;
		}

		.day.disabled {
			color: var(--terminal-gray-dark, #333);
			cursor: not-allowed;
		}

		.day.highlighted {
			background: rgba(255, 176, 0, 0.2);
		}

		/* Week numbers */
		:host([show-week-numbers]) .days-grid {
			grid-template-columns: auto repeat(7, 1fr);
		}

		.week-number {
			font-size: 10px;
			color: var(--terminal-gray, #666);
			display: flex;
			align-items: center;
			justify-content: center;
			padding-right: 8px;
		}

		/* Months/Years grid */
		.months-grid,
		.years-grid {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			grid-template-rows: repeat(3, 1fr);
			gap: 4px;
			flex: 1;
			min-height: 0;
		}

		.month-cell,
		.year-cell {
			padding: 4px;
			text-align: center;
			cursor: pointer;
			font-size: clamp(9px, 2vw, 11px);
			border: 1px solid transparent;
			transition: all 0.15s ease;
			text-transform: uppercase;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.month-cell:hover,
		.year-cell:hover {
			background: var(--t-cal-hover, rgba(0, 255, 65, 0.1));
			border-color: var(--terminal-green, #00ff41);
		}

		.month-cell.selected,
		.year-cell.selected {
			background: var(--terminal-green, #00ff41);
			color: var(--terminal-black, #0a0a0a);
		}

		.month-cell.current,
		.year-cell.current {
			border-color: var(--terminal-amber, #ffb000);
		}

		.month-cell.disabled,
		.year-cell.disabled {
			color: var(--terminal-gray-dark, #333);
			cursor: not-allowed;
		}

		/* Footer */
		.calendar-footer {
			display: flex;
			justify-content: space-between;
			margin-top: 4px;
			padding-top: 4px;
			border-top: 1px solid var(--terminal-gray-dark, #333);
			flex-shrink: 0;
		}

		.footer-btn {
			background: transparent;
			border: 1px solid var(--terminal-gray-dark, #333);
			color: var(--terminal-green, #00ff41);
			padding: 3px 8px;
			font-family: inherit;
			font-size: clamp(9px, 1.5vw, 11px);
			cursor: pointer;
			text-transform: uppercase;
			transition: all 0.15s ease;
		}

		.footer-btn:hover {
			background: var(--terminal-green, #00ff41);
			color: var(--terminal-black, #0a0a0a);
			border-color: var(--terminal-green, #00ff41);
		}

		.footer-btn.primary {
			background: var(--terminal-green, #00ff41);
			color: var(--terminal-black, #0a0a0a);
			border-color: var(--terminal-green, #00ff41);
		}

		.footer-btn.primary:hover {
			background: var(--terminal-green-dim, #00cc33);
		}
	`;

	// ============================================================
	// BLOCK 3: Reactive Properties
	// ============================================================

	static properties = {
		/**
		 * Selected date value (Date object or ISO string)
		 * @property {Object|String} value
		 * @default null
		 */
		value: { type: Object },

		/**
		 * Selection mode: 'single', 'multiple', 'range'
		 * @property {String} mode
		 * @default 'single'
		 * @reflects
		 */
		mode: { type: String, reflect: true },

		/**
		 * Current view: 'days', 'months', 'years'
		 * @property {String} view
		 * @default 'days'
		 * @reflects
		 */
		view: { type: String, reflect: true },

		/**
		 * Minimum selectable date (ISO string)
		 * @property {String} min
		 * @default ''
		 */
		min: { type: String },

		/**
		 * Maximum selectable date (ISO string)
		 * @property {String} max
		 * @default ''
		 */
		max: { type: String },

		/**
		 * Array of disabled dates (ISO strings)
		 * @property {Array} disabled
		 * @default []
		 */
		disabled: { type: Array },

		/**
		 * Array of disabled days of week (0=Sun, 6=Sat)
		 * @property {Array} disabledDays
		 * @default []
		 */
		disabledDays: { type: Array, attribute: 'disabled-days' },

		/**
		 * Array of highlighted dates (ISO strings)
		 * @property {Array} highlighted
		 * @default []
		 */
		highlighted: { type: Array },

		/**
		 * Show week numbers
		 * @property {Boolean} showWeekNumbers
		 * @default false
		 * @reflects
		 */
		showWeekNumbers: { type: Boolean, reflect: true, attribute: 'show-week-numbers' },

		/**
		 * Locale for date formatting
		 * @property {String} locale
		 * @default 'en-US'
		 */
		locale: { type: String },

		/**
		 * First day of week (0=Sun, 1=Mon, etc.)
		 * @property {Number} firstDayOfWeek
		 * @default 0
		 */
		firstDayOfWeek: { type: Number, attribute: 'first-day-of-week' },

		/**
		 * Display inline (always visible)
		 * @property {Boolean} inline
		 * @default false
		 * @reflects
		 */
		inline: { type: Boolean, reflect: true },

		/**
		 * Show today button
		 * @property {Boolean} showToday
		 * @default true
		 */
		showToday: { type: Boolean, attribute: 'show-today' },

		/**
		 * Show clear button
		 * @property {Boolean} showClear
		 * @default true
		 */
		showClear: { type: Boolean, attribute: 'show-clear' },

		/**
		 * Compact mode - hides footer and reduces spacing
		 * @property {Boolean} compact
		 * @default false
		 * @reflects
		 */
		compact: { type: Boolean, reflect: true }
	};

	// ============================================================
	// BLOCK 4: Internal State
	// ============================================================

	/** @private - Currently displayed month/year */
	_displayDate = new Date();

	/** @private - Hover date for range preview */
	_hoverDate = null;

	/** @private - Range start date */
	_rangeStart = null;

	// ============================================================
	// BLOCK 5: Logger Instance
	// ============================================================

	/** @private */
	_logger = null;

	// ============================================================
	// BLOCK 6: Constructor
	// ============================================================

	constructor() {
		super();

		// Initialize logger
		this._logger = componentLogger.for('TCalendarLit');

		// Set defaults
		this.value = null;
		this.mode = 'single';
		this.view = 'days';
		this.min = '';
		this.max = '';
		this.disabled = [];
		this.disabledDays = [];
		this.highlighted = [];
		this.showWeekNumbers = false;
		this.locale = 'en-US';
		this.firstDayOfWeek = 0;
		this.inline = false;
		this.showToday = true;
		this.showClear = true;
		this.compact = false;

		this._logger.debug('Component constructed');
	}

	// ============================================================
	// BLOCK 7: Lifecycle Methods
	// ============================================================

	connectedCallback() {
		super.connectedCallback();
		this._logger.info('Connected to DOM');

		// Initialize display date from value if set
		if (this.value) {
			this._displayDate = this._parseDate(this.value);
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._logger.info('Disconnected from DOM');
	}

	firstUpdated() {
		this._logger.debug('First update complete');
	}

	updated(changedProperties) {
		this._logger.trace('Updated', Object.keys(changedProperties));

		if (changedProperties.has('value') && this.value) {
			const parsed = this._parseDate(this.value);
			if (parsed) {
				this._displayDate = new Date(parsed);
			}
		}
	}

	// ============================================================
	// BLOCK 8: Public API Methods
	// ============================================================

	/**
	 * Select a date
	 * @public
	 * @param {Date|String} date - Date to select
	 */
	selectDate(date) {
		this._logger.debug('selectDate() called', { date });

		const parsed = this._parseDate(date);
		if (!parsed || this._isDisabled(parsed)) return;

		if (this.mode === 'single') {
			this.value = this._formatDateISO(parsed);
		} else if (this.mode === 'multiple') {
			const dates = this._getSelectedDates();
			const iso = this._formatDateISO(parsed);
			const index = dates.indexOf(iso);
			if (index > -1) {
				dates.splice(index, 1);
			} else {
				dates.push(iso);
			}
			// Create new array reference to trigger Lit reactivity
			this.value = [...dates];
		} else if (this.mode === 'range') {
			this._handleRangeSelect(parsed);
		}

		this._emitDateSelect();
	}

	/**
	 * Clear selection
	 * @public
	 */
	clear() {
		this._logger.debug('clear() called');

		this.value = null;
		this._rangeStart = null;
		this._emitDateSelect();
	}

	/**
	 * Go to today
	 * @public
	 */
	goToToday() {
		this._logger.debug('goToToday() called');

		this._displayDate = new Date();
		this.view = 'days';
		this.requestUpdate();
	}

	/**
	 * Navigate to previous month/year/decade
	 * @public
	 */
	previous() {
		this._logger.debug('previous() called');

		if (this.view === 'days') {
			this._displayDate.setMonth(this._displayDate.getMonth() - 1);
		} else if (this.view === 'months') {
			this._displayDate.setFullYear(this._displayDate.getFullYear() - 1);
		} else if (this.view === 'years') {
			this._displayDate.setFullYear(this._displayDate.getFullYear() - 12);
		}

		this._emitMonthChange();
		this.requestUpdate();
	}

	/**
	 * Navigate to next month/year/decade
	 * @public
	 */
	next() {
		this._logger.debug('next() called');

		if (this.view === 'days') {
			this._displayDate.setMonth(this._displayDate.getMonth() + 1);
		} else if (this.view === 'months') {
			this._displayDate.setFullYear(this._displayDate.getFullYear() + 1);
		} else if (this.view === 'years') {
			this._displayDate.setFullYear(this._displayDate.getFullYear() + 12);
		}

		this._emitMonthChange();
		this.requestUpdate();
	}

	/**
	 * Set the view mode
	 * @public
	 * @param {String} view - 'days', 'months', or 'years'
	 */
	setView(view) {
		this._logger.debug('setView() called', { view });

		if (['days', 'months', 'years'].includes(view)) {
			this.view = view;
			this._emitViewChange();
		}
	}

	// ============================================================
	// BLOCK 9: Event Emitters
	// ============================================================

	/**
	 * Emit a custom event
	 * @private
	 */
	_emitEvent(name, detail = {}) {
		this.dispatchEvent(new CustomEvent(name, {
			detail,
			bubbles: true,
			composed: true
		}));
	}

	/**
	 * Emit date-select event
	 * @private
	 */
	_emitDateSelect() {
		this._emitEvent('date-select', {
			value: this.value,
			date: this.value ? this._parseDate(this.value) : null
		});
	}

	/**
	 * Emit month-change event
	 * @private
	 */
	_emitMonthChange() {
		this._emitEvent('month-change', {
			month: this._displayDate.getMonth(),
			year: this._displayDate.getFullYear()
		});
	}

	/**
	 * Emit view-change event
	 * @private
	 */
	_emitViewChange() {
		this._emitEvent('view-change', { view: this.view });
	}

	// ============================================================
	// BLOCK 10: Nesting Support (N/A)
	// ============================================================

	// ============================================================
	// BLOCK 11: Validation
	// ============================================================

	/**
	 * Check if a date is disabled
	 * @private
	 */
	_isDisabled(date) {
		if (!date) return true;

		const iso = this._formatDateISO(date);
		const dayOfWeek = date.getDay();

		// Check disabled days of week
		if (this.disabledDays.includes(dayOfWeek)) return true;

		// Check specific disabled dates
		if (this.disabled.includes(iso)) return true;

		// Check min/max
		if (this.min && date < this._parseDate(this.min)) return true;
		if (this.max && date > this._parseDate(this.max)) return true;

		return false;
	}

	// ============================================================
	// BLOCK 12: Render Method
	// ============================================================

	/**
	 * Render the component
	 * @returns {TemplateResult}
	 */
	render() {
		this._logger.trace('Rendering');

		return html`
			<div class="calendar" part="calendar">
				${this._renderHeader()}
				${this.view === 'days' ? this._renderDays() : ''}
				${this.view === 'months' ? this._renderMonths() : ''}
				${this.view === 'years' ? this._renderYears() : ''}
				${(this.showToday || this.showClear) ? this._renderFooter() : ''}
			</div>
		`;
	}

	// ============================================================
	// BLOCK 13: Private Helpers
	// ============================================================

	/**
	 * Render calendar header
	 * @private
	 */
	_renderHeader() {
		let title = '';

		if (this.view === 'days') {
			title = this._displayDate.toLocaleDateString(this.locale, { month: 'long', year: 'numeric' });
		} else if (this.view === 'months') {
			title = this._displayDate.getFullYear().toString();
		} else if (this.view === 'years') {
			const startYear = Math.floor(this._displayDate.getFullYear() / 12) * 12;
			title = `${startYear} - ${startYear + 11}`;
		}

		return html`
			<div class="calendar-header" part="header">
				<button class="nav-btn" part="nav-btn" @click=${this.previous}>${unsafeHTML(caretLeftIcon)}</button>
				<span class="header-title" part="title" @click=${this._cycleView}>${title}</span>
				<button class="nav-btn" part="nav-btn" @click=${this.next}>${unsafeHTML(caretRightIcon)}</button>
			</div>
		`;
	}

	/**
	 * Render days view
	 * @private
	 */
	_renderDays() {
		const weekdays = this._getWeekdays();
		const days = this._getDaysInMonth();

		return html`
			<div class="weekdays" part="weekdays">
				${this.showWeekNumbers ? html`<div class="weekday">W</div>` : ''}
				${weekdays.map(day => html`<div class="weekday">${day}</div>`)}
			</div>
			<div class="days-grid">
				${days.map((week, weekIndex) => html`
					${this.showWeekNumbers ? html`
						<div class="week-number">${this._getWeekNumber(week.find(d => !d.outside)?.date || week[0].date)}</div>
					` : ''}
					${week.map(day => this._renderDay(day))}
				`)}
			</div>
		`;
	}

	/**
	 * Render a single day cell
	 * @private
	 */
	_renderDay(day) {
		const classes = [
			'day',
			day.outside ? 'outside' : '',
			day.today ? 'today' : '',
			day.selected ? 'selected' : '',
			day.disabled ? 'disabled' : '',
			day.highlighted ? 'highlighted' : '',
			day.inRange ? 'in-range' : '',
			day.rangeStart ? 'range-start' : '',
			day.rangeEnd ? 'range-end' : ''
		].filter(Boolean).join(' ');

		return html`
			<div
				class=${classes}
				part="day ${day.selected ? 'day-selected' : ''} ${day.today ? 'day-today' : ''} ${day.disabled ? 'day-disabled' : ''}"
				@click=${() => !day.disabled && !day.outside && this._handleDayClick(day)}
				@mouseenter=${() => this._handleDayHover(day)}
			>
				${day.date.getDate()}
			</div>
		`;
	}

	/**
	 * Render months view
	 * @private
	 */
	_renderMonths() {
		const months = [];
		const currentMonth = new Date().getMonth();
		const currentYear = new Date().getFullYear();
		const displayYear = this._displayDate.getFullYear();
		const selectedMonth = this.value ? this._parseDate(this.value)?.getMonth() : null;
		const selectedYear = this.value ? this._parseDate(this.value)?.getFullYear() : null;

		for (let i = 0; i < 12; i++) {
			const isCurrent = i === currentMonth && displayYear === currentYear;
			const isSelected = i === selectedMonth && displayYear === selectedYear;

			months.push({
				index: i,
				name: new Date(displayYear, i).toLocaleDateString(this.locale, { month: 'short' }),
				current: isCurrent,
				selected: isSelected
			});
		}

		return html`
			<div class="months-grid">
				${months.map(month => html`
					<div
						class="month-cell ${month.current ? 'current' : ''} ${month.selected ? 'selected' : ''}"
						@click=${() => this._handleMonthClick(month.index)}
					>
						${month.name}
					</div>
				`)}
			</div>
		`;
	}

	/**
	 * Render years view
	 * @private
	 */
	_renderYears() {
		const years = [];
		const currentYear = new Date().getFullYear();
		const startYear = Math.floor(this._displayDate.getFullYear() / 12) * 12;
		const selectedYear = this.value ? this._parseDate(this.value)?.getFullYear() : null;

		for (let i = 0; i < 12; i++) {
			const year = startYear + i;
			years.push({
				year,
				current: year === currentYear,
				selected: year === selectedYear
			});
		}

		return html`
			<div class="years-grid">
				${years.map(year => html`
					<div
						class="year-cell ${year.current ? 'current' : ''} ${year.selected ? 'selected' : ''}"
						@click=${() => this._handleYearClick(year.year)}
					>
						${year.year}
					</div>
				`)}
			</div>
		`;
	}

	/**
	 * Render footer
	 * @private
	 */
	_renderFooter() {
		return html`
			<div class="calendar-footer">
				${this.showClear ? html`
					<button class="footer-btn" @click=${this.clear}>Clear</button>
				` : html`<div></div>`}
				${this.showToday ? html`
					<button class="footer-btn primary" @click=${this.goToToday}>Today</button>
				` : ''}
			</div>
		`;
	}

	/**
	 * Get weekday names
	 * @private
	 */
	_getWeekdays() {
		const days = [];
		const date = new Date(2024, 0, 7 + this.firstDayOfWeek); // Start from a Sunday

		for (let i = 0; i < 7; i++) {
			days.push(date.toLocaleDateString(this.locale, { weekday: 'short' }).slice(0, 2));
			date.setDate(date.getDate() + 1);
		}

		return days;
	}

	/**
	 * Get days in current month with padding
	 * @private
	 */
	_getDaysInMonth() {
		const year = this._displayDate.getFullYear();
		const month = this._displayDate.getMonth();

		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);

		// Adjust for first day of week
		let startOffset = firstDay.getDay() - this.firstDayOfWeek;
		if (startOffset < 0) startOffset += 7;

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const selectedDates = this._getSelectedDates();
		const weeks = [];
		let currentWeek = [];

		// Previous month days
		const prevMonth = new Date(year, month, 0);
		for (let i = startOffset - 1; i >= 0; i--) {
			const date = new Date(year, month - 1, prevMonth.getDate() - i);
			currentWeek.push(this._createDayObject(date, true, today, selectedDates));
		}

		// Current month days
		for (let day = 1; day <= lastDay.getDate(); day++) {
			const date = new Date(year, month, day);
			currentWeek.push(this._createDayObject(date, false, today, selectedDates));

			if (currentWeek.length === 7) {
				weeks.push(currentWeek);
				currentWeek = [];
			}
		}

		// Next month days
		let nextDay = 1;
		while (currentWeek.length < 7) {
			const date = new Date(year, month + 1, nextDay++);
			currentWeek.push(this._createDayObject(date, true, today, selectedDates));
		}
		if (currentWeek.length > 0) {
			weeks.push(currentWeek);
		}

		// Ensure 6 weeks for consistent height
		while (weeks.length < 6) {
			const lastDate = weeks[weeks.length - 1][6].date;
			currentWeek = [];
			for (let i = 1; i <= 7; i++) {
				const date = new Date(lastDate);
				date.setDate(date.getDate() + i);
				currentWeek.push(this._createDayObject(date, true, today, selectedDates));
			}
			weeks.push(currentWeek);
		}

		return weeks;
	}

	/**
	 * Create day object for rendering
	 * @private
	 */
	_createDayObject(date, outside, today, selectedDates) {
		const iso = this._formatDateISO(date);
		const isSelected = selectedDates.includes(iso);
		const isInRange = this._isInRange(date);

		// Range start: either from active selection or completed range
		const rangeStartDate = this._rangeStart || (this.value?.start ? this._parseDate(this.value.start) : null);
		const rangeEndDate = this.value?.end ? this._parseDate(this.value.end) : null;

		const rangeStart = this.mode === 'range' && rangeStartDate && this._isSameDay(date, rangeStartDate);
		const rangeEnd = this.mode === 'range' && rangeEndDate && this._isSameDay(date, rangeEndDate);

		return {
			date,
			outside,
			today: this._isSameDay(date, today),
			selected: isSelected,
			disabled: this._isDisabled(date),
			highlighted: this.highlighted.includes(iso),
			inRange: isInRange && !rangeStart && !rangeEnd,
			rangeStart,
			rangeEnd
		};
	}

	/**
	 * Check if date is in selected range
	 * @private
	 */
	_isInRange(date) {
		if (this.mode !== 'range') return false;

		// For completed range selection, use value.start and value.end
		let start = this._rangeStart || (this.value?.start ? this._parseDate(this.value.start) : null);
		let end = this._hoverDate || (this.value?.end ? this._parseDate(this.value.end) : null);

		if (!start || !end) return false;

		if (start > end) [start, end] = [end, start];

		return date >= start && date <= end;
	}

	/**
	 * Get selected dates array
	 * @private
	 */
	_getSelectedDates() {
		if (!this.value) return [];

		if (this.mode === 'single') {
			return [this.value];
		} else if (this.mode === 'multiple') {
			return Array.isArray(this.value) ? this.value : [this.value];
		} else if (this.mode === 'range') {
			const dates = [];
			if (this.value.start) dates.push(this.value.start);
			if (this.value.end) dates.push(this.value.end);
			return dates;
		}

		return [];
	}

	/**
	 * Handle range selection
	 * @private
	 */
	_handleRangeSelect(date) {
		if (!this._rangeStart) {
			this._rangeStart = date;
			this.value = { start: this._formatDateISO(date), end: null };
		} else {
			let start = this._rangeStart;
			let end = date;

			if (start > end) [start, end] = [end, start];

			this.value = {
				start: this._formatDateISO(start),
				end: this._formatDateISO(end)
			};
			this._rangeStart = null;

			this._emitEvent('range-select', { start, end, value: this.value });
		}
	}

	/**
	 * Handle day click
	 * @private
	 */
	_handleDayClick(day) {
		this.selectDate(day.date);
	}

	/**
	 * Handle day hover (for range preview)
	 * @private
	 */
	_handleDayHover(day) {
		if (this.mode === 'range' && this._rangeStart && !day.outside) {
			this._hoverDate = day.date;
			this.requestUpdate();
		}
	}

	/**
	 * Handle month click
	 * @private
	 */
	_handleMonthClick(month) {
		this._displayDate.setMonth(month);
		this.view = 'days';
		this._emitMonthChange();
	}

	/**
	 * Handle year click
	 * @private
	 */
	_handleYearClick(year) {
		this._displayDate.setFullYear(year);
		this.view = 'months';
	}

	/**
	 * Cycle through views
	 * @private
	 */
	_cycleView() {
		if (this.view === 'days') {
			this.setView('months');
		} else if (this.view === 'months') {
			this.setView('years');
		} else {
			this.setView('days');
		}
	}

	/**
	 * Parse date from various formats
	 * @private
	 */
	_parseDate(value) {
		if (!value) return null;
		if (value instanceof Date) return new Date(value);
		if (typeof value === 'string') return new Date(value + 'T00:00:00');
		return null;
	}

	/**
	 * Format date to ISO string (YYYY-MM-DD)
	 * @private
	 */
	_formatDateISO(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	/**
	 * Check if two dates are the same day
	 * @private
	 */
	_isSameDay(date1, date2) {
		if (!date1 || !date2) return false;
		return date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate();
	}

	/**
	 * Get ISO week number
	 * @private
	 */
	_getWeekNumber(date) {
		const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
		const dayNum = d.getUTCDay() || 7;
		d.setUTCDate(d.getUTCDate() + 4 - dayNum);
		const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
	}
}

// ============================================================
// Registration
// ============================================================

if (!customElements.get(TCalendarLit.tagName)) {
	customElements.define(TCalendarLit.tagName, TCalendarLit);
}

export default TCalendarLit;
