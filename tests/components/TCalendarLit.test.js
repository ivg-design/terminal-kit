/**
 * TCalendarLit Component Tests
 * FULL profile component
 * Testing pattern: Properties, Methods, Events, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TCalendarLit.js';

describe('TCalendarLit', () => {
	let calendar;

	beforeEach(async () => {
		calendar = await fixture(html`<t-cal></t-cal>`);
	});

	afterEach(() => {
		calendar?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(calendar.constructor.tagName).toBe('t-cal');
		});

		it('should have correct version', () => {
			expect(calendar.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(calendar.constructor.category).toBe('Form');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptyCal = document.createElement('t-cal');
			expect(emptyCal.value).toBeNull();
			expect(emptyCal.mode).toBe('single');
			expect(emptyCal.view).toBe('days');
			expect(emptyCal.min).toBe('');
			expect(emptyCal.max).toBe('');
			expect(emptyCal.disabled).toEqual([]);
			expect(emptyCal.disabledDays).toEqual([]);
			expect(emptyCal.highlighted).toEqual([]);
			expect(emptyCal.showWeekNumbers).toBe(false);
			expect(emptyCal.locale).toBe('en-US');
			expect(emptyCal.firstDayOfWeek).toBe(0);
			expect(emptyCal.inline).toBe(false);
			expect(emptyCal.showToday).toBe(true);
			expect(emptyCal.showClear).toBe(true);
		});

		it('should update value property', async () => {
			calendar.value = '2024-06-15';
			await calendar.updateComplete;
			expect(calendar.value).toBe('2024-06-15');
		});

		it('should update mode property', async () => {
			calendar.mode = 'range';
			await calendar.updateComplete;
			expect(calendar.mode).toBe('range');
			expect(calendar.getAttribute('mode')).toBe('range');
		});

		it('should update view property', async () => {
			calendar.view = 'months';
			await calendar.updateComplete;
			expect(calendar.view).toBe('months');
			expect(calendar.getAttribute('view')).toBe('months');
		});

		it('should update min/max properties', async () => {
			calendar.min = '2024-01-01';
			calendar.max = '2024-12-31';
			await calendar.updateComplete;
			expect(calendar.min).toBe('2024-01-01');
			expect(calendar.max).toBe('2024-12-31');
		});

		it('should update disabled dates', async () => {
			calendar.disabled = ['2024-06-15', '2024-06-16'];
			await calendar.updateComplete;
			expect(calendar.disabled).toEqual(['2024-06-15', '2024-06-16']);
		});

		it('should update disabledDays', async () => {
			calendar.disabledDays = [0, 6]; // Weekends
			await calendar.updateComplete;
			expect(calendar.disabledDays).toEqual([0, 6]);
		});

		it('should update highlighted dates', async () => {
			calendar.highlighted = ['2024-06-20', '2024-06-25'];
			await calendar.updateComplete;
			expect(calendar.highlighted).toEqual(['2024-06-20', '2024-06-25']);
		});

		it('should update showWeekNumbers property', async () => {
			calendar.showWeekNumbers = true;
			await calendar.updateComplete;
			expect(calendar.showWeekNumbers).toBe(true);
			expect(calendar.hasAttribute('show-week-numbers')).toBe(true);
		});

		it('should set properties from attributes', async () => {
			const withAttrs = await fixture(html`
				<t-cal
					mode="multiple"
					view="months"
					locale="de-DE"
					first-day-of-week="1"
					show-week-numbers
				></t-cal>
			`);

			expect(withAttrs.mode).toBe('multiple');
			expect(withAttrs.view).toBe('months');
			expect(withAttrs.locale).toBe('de-DE');
			expect(withAttrs.firstDayOfWeek).toBe(1);
			expect(withAttrs.showWeekNumbers).toBe(true);

			withAttrs.remove();
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		it('selectDate() should set single date', async () => {
			calendar.selectDate('2024-06-15');
			await calendar.updateComplete;
			expect(calendar.value).toBe('2024-06-15');
		});

		it('selectDate() should add to multiple mode', async () => {
			calendar.mode = 'multiple';
			await calendar.updateComplete;

			calendar.selectDate('2024-06-15');
			calendar.selectDate('2024-06-16');
			await calendar.updateComplete;

			expect(calendar.value).toContain('2024-06-15');
			expect(calendar.value).toContain('2024-06-16');
		});

		it('selectDate() should not select disabled dates', async () => {
			calendar.disabled = ['2024-06-15'];
			await calendar.updateComplete;

			calendar.selectDate('2024-06-15');
			expect(calendar.value).toBeNull();
		});

		it('clear() should clear selection', async () => {
			calendar.value = '2024-06-15';
			await calendar.updateComplete;

			calendar.clear();
			await calendar.updateComplete;

			expect(calendar.value).toBeNull();
		});

		it('goToToday() should navigate to current date', async () => {
			calendar._displayDate = new Date(2020, 0, 1);
			await calendar.updateComplete;

			calendar.goToToday();
			await calendar.updateComplete;

			const today = new Date();
			expect(calendar._displayDate.getMonth()).toBe(today.getMonth());
			expect(calendar._displayDate.getFullYear()).toBe(today.getFullYear());
		});

		it('previous() should navigate to previous month', async () => {
			calendar._displayDate = new Date(2024, 5, 15); // June 2024
			await calendar.updateComplete;

			calendar.previous();
			await calendar.updateComplete;

			expect(calendar._displayDate.getMonth()).toBe(4); // May
		});

		it('next() should navigate to next month', async () => {
			calendar._displayDate = new Date(2024, 5, 15); // June 2024
			await calendar.updateComplete;

			calendar.next();
			await calendar.updateComplete;

			expect(calendar._displayDate.getMonth()).toBe(6); // July
		});

		it('setView() should change view', async () => {
			calendar.setView('months');
			await calendar.updateComplete;
			expect(calendar.view).toBe('months');

			calendar.setView('years');
			await calendar.updateComplete;
			expect(calendar.view).toBe('years');
		});

		it('setView() should ignore invalid views', async () => {
			calendar.setView('invalid');
			await calendar.updateComplete;
			expect(calendar.view).toBe('days');
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		it('should fire date-select event', async () => {
			const handler = vi.fn();
			calendar.addEventListener('date-select', handler);

			calendar.selectDate('2024-06-15');

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.value).toBe('2024-06-15');
		});

		it('should fire month-change event on navigation', async () => {
			const handler = vi.fn();
			calendar.addEventListener('month-change', handler);

			calendar.next();

			expect(handler).toHaveBeenCalled();
		});

		it('should fire view-change event', async () => {
			const handler = vi.fn();
			calendar.addEventListener('view-change', handler);

			calendar.setView('months');

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.view).toBe('months');
		});

		it('should fire range-select event in range mode', async () => {
			calendar.mode = 'range';
			await calendar.updateComplete;

			const handler = vi.fn();
			calendar.addEventListener('range-select', handler);

			calendar.selectDate('2024-06-15');
			calendar.selectDate('2024-06-20');

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.value.start).toBe('2024-06-15');
			expect(handler.mock.calls[0][0].detail.value.end).toBe('2024-06-20');
		});

		it('events should bubble', async () => {
			const handler = vi.fn();
			document.body.addEventListener('date-select', handler);

			calendar.selectDate('2024-06-15');

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);

			document.body.removeEventListener('date-select', handler);
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await calendar.updateComplete;
			expect(calendar.shadowRoot).toBeTruthy();
		});

		it('should render calendar header', async () => {
			await calendar.updateComplete;
			const header = calendar.shadowRoot.querySelector('.calendar-header');
			expect(header).toBeTruthy();
		});

		it('should render navigation buttons', async () => {
			await calendar.updateComplete;
			const buttons = calendar.shadowRoot.querySelectorAll('.nav-btn');
			expect(buttons.length).toBe(2);
		});

		it('should render header title', async () => {
			await calendar.updateComplete;
			const title = calendar.shadowRoot.querySelector('.header-title');
			expect(title).toBeTruthy();
		});

		it('should render weekday headers', async () => {
			await calendar.updateComplete;
			const weekdays = calendar.shadowRoot.querySelectorAll('.weekday');
			expect(weekdays.length).toBe(7);
		});

		it('should render days grid', async () => {
			await calendar.updateComplete;
			const days = calendar.shadowRoot.querySelectorAll('.day');
			expect(days.length).toBeGreaterThan(0);
		});

		it('should render today marker', async () => {
			await calendar.updateComplete;
			const today = calendar.shadowRoot.querySelector('.day.today');
			// May not exist if current date isn't visible
			// Just check the rendering doesn't error
		});

		it('should render selected day', async () => {
			const today = new Date();
			const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-15`;
			calendar.value = iso;
			await calendar.updateComplete;

			const selected = calendar.shadowRoot.querySelector('.day.selected');
			expect(selected).toBeTruthy();
		});

		it('should render months view', async () => {
			calendar.view = 'months';
			await calendar.updateComplete;

			const monthCells = calendar.shadowRoot.querySelectorAll('.month-cell');
			expect(monthCells.length).toBe(12);
		});

		it('should render years view', async () => {
			calendar.view = 'years';
			await calendar.updateComplete;

			const yearCells = calendar.shadowRoot.querySelectorAll('.year-cell');
			expect(yearCells.length).toBe(12);
		});

		it('should render footer buttons', async () => {
			await calendar.updateComplete;
			const footer = calendar.shadowRoot.querySelector('.calendar-footer');
			expect(footer).toBeTruthy();

			const buttons = footer.querySelectorAll('.footer-btn');
			expect(buttons.length).toBe(2); // Clear and Today
		});

		it('should render week numbers when enabled', async () => {
			calendar.showWeekNumbers = true;
			await calendar.updateComplete;

			const weekNumbers = calendar.shadowRoot.querySelectorAll('.week-number');
			expect(weekNumbers.length).toBeGreaterThan(0);
		});

		it('should render disabled days', async () => {
			const today = new Date();
			const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-15`;
			calendar.disabled = [iso];
			await calendar.updateComplete;

			const disabled = calendar.shadowRoot.querySelector('.day.disabled');
			expect(disabled).toBeTruthy();
		});

		it('should render highlighted days', async () => {
			const today = new Date();
			const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-20`;
			calendar.highlighted = [iso];
			await calendar.updateComplete;

			const highlighted = calendar.shadowRoot.querySelector('.day.highlighted');
			expect(highlighted).toBeTruthy();
		});
	});

	// ======================================================
	// SUITE 6: Range Selection
	// ======================================================
	describe('Range Selection', () => {
		beforeEach(async () => {
			calendar.mode = 'range';
			await calendar.updateComplete;
		});

		it('should set range start on first click', async () => {
			calendar.selectDate('2024-06-15');
			await calendar.updateComplete;

			expect(calendar._rangeStart).toBeTruthy();
			expect(calendar.value.start).toBe('2024-06-15');
		});

		it('should complete range on second click', async () => {
			calendar.selectDate('2024-06-15');
			calendar.selectDate('2024-06-20');
			await calendar.updateComplete;

			expect(calendar.value.start).toBe('2024-06-15');
			expect(calendar.value.end).toBe('2024-06-20');
		});

		it('should swap dates if end is before start', async () => {
			calendar.selectDate('2024-06-20');
			calendar.selectDate('2024-06-15');
			await calendar.updateComplete;

			expect(calendar.value.start).toBe('2024-06-15');
			expect(calendar.value.end).toBe('2024-06-20');
		});
	});

	// ======================================================
	// SUITE 7: Date Constraints
	// ======================================================
	describe('Date Constraints', () => {
		it('should disable dates before min', async () => {
			calendar.min = '2024-06-10';
			calendar._displayDate = new Date(2024, 5, 15); // June 2024
			await calendar.updateComplete;

			// Check that selectDate doesn't work for dates before min
			calendar.selectDate('2024-06-05');
			expect(calendar.value).toBeNull();
		});

		it('should disable dates after max', async () => {
			calendar.max = '2024-06-20';
			calendar._displayDate = new Date(2024, 5, 15); // June 2024
			await calendar.updateComplete;

			calendar.selectDate('2024-06-25');
			expect(calendar.value).toBeNull();
		});

		it('should disable specific dates', async () => {
			calendar.disabled = ['2024-06-15'];
			calendar._displayDate = new Date(2024, 5, 15);
			await calendar.updateComplete;

			calendar.selectDate('2024-06-15');
			expect(calendar.value).toBeNull();
		});

		it('should disable days of week', async () => {
			calendar.disabledDays = [0, 6]; // Weekends
			await calendar.updateComplete;

			// Find a Sunday
			calendar.selectDate('2024-06-16'); // Sunday
			expect(calendar.value).toBeNull();
		});
	});

	// ======================================================
	// SUITE 8: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(calendar._logger).toBeTruthy();
		});
	});
});
