/**
 * TAvatarLit Component Tests
 * DISPLAY profile component
 * Testing pattern: Properties, Methods, Events, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TAvatarLit.js';

describe('TAvatarLit', () => {
	let avatar;

	beforeEach(async () => {
		avatar = await fixture(html`<t-avt initials="JD"></t-avt>`);
	});

	afterEach(() => {
		avatar?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(avatar.constructor.tagName).toBe('t-avt');
		});

		it('should have correct version', () => {
			expect(avatar.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(avatar.constructor.category).toBe('Display');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptyAvatar = document.createElement('t-avt');
			expect(emptyAvatar.src).toBe('');
			expect(emptyAvatar.alt).toBe('');
			expect(emptyAvatar.initials).toBe('');
			expect(emptyAvatar.icon).toBe('');
			expect(emptyAvatar.size).toBe('md');
			expect(emptyAvatar.shape).toBe('circle');
			expect(emptyAvatar.status).toBe(null);
			expect(emptyAvatar.statusPosition).toBe('bottom-right');
			expect(emptyAvatar.clickable).toBe(false);
			expect(emptyAvatar.border).toBe(false);
		});

		it('should update src property', async () => {
			avatar.src = 'https://example.com/avatar.jpg';
			await avatar.updateComplete;
			expect(avatar.src).toBe('https://example.com/avatar.jpg');
		});

		it('should update alt property', async () => {
			avatar.alt = 'John Doe';
			await avatar.updateComplete;
			expect(avatar.alt).toBe('John Doe');
			expect(avatar.getAttribute('alt')).toBe('John Doe');
		});

		it('should update initials property', async () => {
			avatar.initials = 'AB';
			await avatar.updateComplete;
			expect(avatar.initials).toBe('AB');
			expect(avatar.getAttribute('initials')).toBe('AB');
		});

		it('should update size property', async () => {
			avatar.size = 'lg';
			await avatar.updateComplete;
			expect(avatar.size).toBe('lg');
			expect(avatar.getAttribute('size')).toBe('lg');
		});

		it('should update shape property', async () => {
			avatar.shape = 'square';
			await avatar.updateComplete;
			expect(avatar.shape).toBe('square');
			expect(avatar.getAttribute('shape')).toBe('square');
		});

		it('should update status property', async () => {
			avatar.status = 'online';
			await avatar.updateComplete;
			expect(avatar.status).toBe('online');
			expect(avatar.getAttribute('status')).toBe('online');
		});

		it('should update statusPosition property', async () => {
			avatar.statusPosition = 'top-right';
			await avatar.updateComplete;
			expect(avatar.statusPosition).toBe('top-right');
			expect(avatar.getAttribute('status-position')).toBe('top-right');
		});

		it('should update clickable property', async () => {
			avatar.clickable = true;
			await avatar.updateComplete;
			expect(avatar.clickable).toBe(true);
			expect(avatar.hasAttribute('clickable')).toBe(true);
		});

		it('should update border property', async () => {
			avatar.border = true;
			await avatar.updateComplete;
			expect(avatar.border).toBe(true);
			expect(avatar.hasAttribute('border')).toBe(true);
		});

		it('should set properties from attributes', async () => {
			const withAttrs = await fixture(html`
				<t-avt
					initials="XY"
					alt="Test User"
					size="xl"
					shape="rounded"
					status="busy"
					status-position="top-left"
					clickable
					border
				></t-avt>
			`);

			expect(withAttrs.initials).toBe('XY');
			expect(withAttrs.alt).toBe('Test User');
			expect(withAttrs.size).toBe('xl');
			expect(withAttrs.shape).toBe('rounded');
			expect(withAttrs.status).toBe('busy');
			expect(withAttrs.statusPosition).toBe('top-left');
			expect(withAttrs.clickable).toBe(true);
			expect(withAttrs.border).toBe(true);

			withAttrs.remove();
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		it('setStatus() should update status', async () => {
			avatar.setStatus('online');
			await avatar.updateComplete;
			expect(avatar.status).toBe('online');
		});

		it('setStatus() should allow all status values', async () => {
			const statuses = ['online', 'offline', 'busy', 'away'];
			for (const status of statuses) {
				avatar.setStatus(status);
				await avatar.updateComplete;
				expect(avatar.status).toBe(status);
			}
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		it('should fire avatar-click when clicked and clickable', async () => {
			avatar.clickable = true;
			await avatar.updateComplete;

			const handler = vi.fn();
			avatar.addEventListener('avatar-click', handler);

			const avatarEl = avatar.shadowRoot.querySelector('.avatar');
			avatarEl.click();

			expect(handler).toHaveBeenCalled();
		});

		it('should not fire avatar-click when not clickable', async () => {
			avatar.clickable = false;
			await avatar.updateComplete;

			const handler = vi.fn();
			avatar.addEventListener('avatar-click', handler);

			const avatarEl = avatar.shadowRoot.querySelector('.avatar');
			avatarEl.click();

			expect(handler).not.toHaveBeenCalled();
		});

		it('avatar-click should bubble', async () => {
			avatar.clickable = true;
			await avatar.updateComplete;

			const handler = vi.fn();
			document.body.addEventListener('avatar-click', handler);

			const avatarEl = avatar.shadowRoot.querySelector('.avatar');
			avatarEl.click();

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);

			document.body.removeEventListener('avatar-click', handler);
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await avatar.updateComplete;
			expect(avatar.shadowRoot).toBeTruthy();
		});

		it('should render avatar element', async () => {
			await avatar.updateComplete;
			const avatarEl = avatar.shadowRoot.querySelector('.avatar');
			expect(avatarEl).toBeTruthy();
		});

		it('should render initials', async () => {
			await avatar.updateComplete;
			const initials = avatar.shadowRoot.querySelector('.avatar-initials');
			expect(initials).toBeTruthy();
			expect(initials.textContent).toBe('JD');
		});

		it('should truncate initials to 2 characters', async () => {
			avatar.initials = 'ABCD';
			await avatar.updateComplete;

			const initials = avatar.shadowRoot.querySelector('.avatar-initials');
			expect(initials.textContent).toBe('AB');
		});

		it('should render image when src is provided', async () => {
			avatar.src = 'https://example.com/avatar.jpg';
			avatar.initials = ''; // Clear initials
			await avatar.updateComplete;

			const img = avatar.shadowRoot.querySelector('.avatar-image');
			expect(img).toBeTruthy();
			expect(img.src).toContain('avatar.jpg');
		});

		it('should render fallback icon when no src or initials', async () => {
			avatar.src = '';
			avatar.initials = '';
			await avatar.updateComplete;

			const icon = avatar.shadowRoot.querySelector('.avatar-icon');
			expect(icon).toBeTruthy();
		});

		it('should render status indicator when status is set', async () => {
			avatar.status = 'online';
			await avatar.updateComplete;

			const status = avatar.shadowRoot.querySelector('.avatar-status');
			expect(status).toBeTruthy();
			expect(status.classList.contains('online')).toBe(true);
		});

		it('should position status indicator correctly', async () => {
			avatar.status = 'online';
			avatar.statusPosition = 'top-right';
			await avatar.updateComplete;

			const status = avatar.shadowRoot.querySelector('.avatar-status');
			expect(status.classList.contains('top-right')).toBe(true);
		});

		it('should not render status when status is null', async () => {
			avatar.status = null;
			await avatar.updateComplete;

			const status = avatar.shadowRoot.querySelector('.avatar-status');
			expect(status).toBeFalsy();
		});

		it('should have correct role for clickable avatar', async () => {
			avatar.clickable = true;
			await avatar.updateComplete;

			const avatarEl = avatar.shadowRoot.querySelector('.avatar');
			expect(avatarEl.getAttribute('role')).toBe('button');
		});

		it('should have correct role for non-clickable avatar', async () => {
			avatar.clickable = false;
			await avatar.updateComplete;

			const avatarEl = avatar.shadowRoot.querySelector('.avatar');
			expect(avatarEl.getAttribute('role')).toBe('img');
		});
	});

	// ======================================================
	// SUITE 6: Image Error Handling
	// ======================================================
	describe('Image Error Handling', () => {
		it('should track image error state', () => {
			expect(avatar._imageError).toBe(false);
		});

		it('should reset image error when src changes', async () => {
			avatar._imageError = true;
			avatar.src = 'https://example.com/new-avatar.jpg';
			await avatar.updateComplete;
			expect(avatar._imageError).toBe(false);
		});
	});

	// ======================================================
	// SUITE 7: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(avatar._logger).toBeTruthy();
		});
	});
});
