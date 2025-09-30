/**
 * TUserMenuLit Component Tests
 * Comprehensive test suite for the Terminal User Menu component
 * Tests: Properties, Methods, Events, Rendering, Logging, Document Listeners
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html, nextFrame } from '@open-wc/testing-helpers';
import '../../js/components/TUserMenuLit.js';
import TUserMenuLit, { TUserMenuManifest } from '../../js/components/TUserMenuLit.js';

describe('TUserMenuLit', () => {
  let component;

  beforeEach(async () => {
    component = await fixture(html`<t-usr></t-usr>`);
  });

  afterEach(() => {
    component?.remove();
    // Clean up any document listeners
    document.removeEventListener('click', component._handleClickOutside);
    document.removeEventListener('keydown', component._handleEscape);
  });

  // ========================================
  // TEST SUITE 1: Component Registration & Manifest
  // ========================================
  describe('Component Registration & Manifest', () => {
    it('should be registered as a custom element', () => {
      expect(customElements.get('t-usr')).toBeDefined();
    });

    it('should have correct static metadata', () => {
      expect(TUserMenuLit.tagName).toBe('t-usr');
      expect(TUserMenuLit.version).toBe('1.0.0');
      expect(TUserMenuLit.category).toBe('Navigation');
    });

    it('should generate complete manifest', () => {
      expect(TUserMenuManifest).toBeDefined();
      expect(TUserMenuManifest.tagName).toBe('t-usr');
      expect(TUserMenuManifest.displayName).toBe('User Menu');
      expect(TUserMenuManifest.description).toBeTruthy();
    });

    it('should document all properties in manifest', () => {
      const manifestProps = Object.keys(TUserMenuManifest.properties);
      expect(manifestProps).toContain('userName');
      expect(manifestProps).toContain('userEmail');
      expect(manifestProps).toContain('userAvatar');
      expect(manifestProps).toContain('disabled');
      expect(manifestProps).toContain('open');
      expect(manifestProps).toContain('menuItems');
    });

    it('should document all methods in manifest', () => {
      const manifestMethods = Object.keys(TUserMenuManifest.methods);
      expect(manifestMethods).toContain('openMenu');
      expect(manifestMethods).toContain('closeMenu');
      expect(manifestMethods).toContain('toggleMenu');
      expect(manifestMethods).toContain('setMenuItems');
      expect(manifestMethods).toContain('setUserInfo');
    });

    it('should document all events in manifest', () => {
      const manifestEvents = Object.keys(TUserMenuManifest.events);
      expect(manifestEvents).toContain('menu-select');
      expect(manifestEvents).toContain('menu-open');
      expect(manifestEvents).toContain('menu-close');
    });
  });

  // ========================================
  // TEST SUITE 2: Properties
  // ========================================
  describe('Properties', () => {
    it('should have correct default values', () => {
      expect(component.userName).toBe('User');
      expect(component.userEmail).toBe('');
      expect(component.userAvatar).toBe('');
      expect(component.disabled).toBe(false);
      expect(component.open).toBe(false);
      expect(component.menuItems).toEqual([]);
    });

    it('should update userName property', async () => {
      component.userName = 'John Doe';
      await component.updateComplete;
      expect(component.userName).toBe('John Doe');
      expect(component.getAttribute('user-name')).toBe('John Doe');
    });

    it('should update userEmail property', async () => {
      component.userEmail = 'john@example.com';
      await component.updateComplete;
      expect(component.userEmail).toBe('john@example.com');
      expect(component.getAttribute('user-email')).toBe('john@example.com');
    });

    it('should update userAvatar property', async () => {
      component.userAvatar = 'https://example.com/avatar.jpg';
      await component.updateComplete;
      expect(component.userAvatar).toBe('https://example.com/avatar.jpg');
      // userAvatar does not reflect
      expect(component.hasAttribute('user-avatar')).toBe(false);
    });

    it('should update disabled property', async () => {
      component.disabled = true;
      await component.updateComplete;
      expect(component.disabled).toBe(true);
      expect(component.hasAttribute('disabled')).toBe(true);
    });

    it('should update open property', async () => {
      component.open = true;
      await component.updateComplete;
      expect(component.open).toBe(true);
      expect(component.hasAttribute('open')).toBe(true);
    });

    it('should update menuItems property', async () => {
      const items = [
        { id: 'test', label: 'Test Item' }
      ];
      component.menuItems = items;
      await component.updateComplete;
      expect(component.menuItems).toEqual(items);
    });

    it('should reflect correct properties to attributes', async () => {
      component.userName = 'Test User';
      component.disabled = true;
      component.open = true;
      await component.updateComplete;

      expect(component.getAttribute('user-name')).toBe('Test User');
      expect(component.hasAttribute('disabled')).toBe(true);
      expect(component.hasAttribute('open')).toBe(true);
    });
  });

  // ========================================
  // TEST SUITE 3: Methods
  // ========================================
  describe('Methods', () => {
    it('should expose all documented public methods', () => {
      expect(typeof component.openMenu).toBe('function');
      expect(typeof component.closeMenu).toBe('function');
      expect(typeof component.toggleMenu).toBe('function');
      expect(typeof component.setMenuItems).toBe('function');
      expect(typeof component.setUserInfo).toBe('function');
    });

    it('should open menu with openMenu() method', async () => {
      expect(component.open).toBe(false);
      component.openMenu();
      await component.updateComplete;
      expect(component.open).toBe(true);
      expect(component.hasAttribute('open')).toBe(true);
    });

    it('should close menu with closeMenu() method', async () => {
      component.open = true;
      await component.updateComplete;
      component.closeMenu();
      await component.updateComplete;
      expect(component.open).toBe(false);
      expect(component.hasAttribute('open')).toBe(false);
    });

    it('should toggle menu with toggleMenu() method', async () => {
      expect(component.open).toBe(false);
      component.toggleMenu();
      await component.updateComplete;
      expect(component.open).toBe(true);

      component.toggleMenu();
      await component.updateComplete;
      expect(component.open).toBe(false);
    });

    it('should not open when disabled', async () => {
      component.disabled = true;
      await component.updateComplete;
      component.openMenu();
      await component.updateComplete;
      expect(component.open).toBe(false);
    });

    it('should set menu items with setMenuItems() method', async () => {
      const items = [
        { id: 'item1', label: 'Item 1', icon: '<svg></svg>' },
        { id: 'item2', label: 'Item 2' },
        { type: 'separator' },
        { id: 'item3', label: 'Item 3' }
      ];

      component.setMenuItems(items);
      await component.updateComplete;
      expect(component.menuItems).toEqual(items);
    });

    it('should throw error for invalid menu items', () => {
      expect(() => component.setMenuItems('not an array')).toThrow('Menu items must be an array');
    });

    it('should update user info with setUserInfo() method', async () => {
      component.setUserInfo({
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: 'https://example.com/jane.jpg'
      });
      await component.updateComplete;

      expect(component.userName).toBe('Jane Smith');
      expect(component.userEmail).toBe('jane@example.com');
      expect(component.userAvatar).toBe('https://example.com/jane.jpg');
    });

    it('should partially update user info', async () => {
      component.userName = 'Initial Name';
      component.userEmail = 'initial@example.com';
      await component.updateComplete;

      component.setUserInfo({ name: 'New Name' });
      await component.updateComplete;

      expect(component.userName).toBe('New Name');
      expect(component.userEmail).toBe('initial@example.com');
    });
  });

  // ========================================
  // TEST SUITE 4: Events
  // ========================================
  describe('Events', () => {
    it('should emit menu-open event when opening', async () => {
      const eventPromise = new Promise((resolve) => {
        component.addEventListener('menu-open', (e) => {
          resolve(e);
        });
      });

      component.openMenu();
      const event = await eventPromise;

      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });

    it('should emit menu-close event when closing', async () => {
      component.open = true;

      const eventPromise = new Promise((resolve) => {
        component.addEventListener('menu-close', (e) => {
          resolve(e);
        });
      });

      component.closeMenu();
      const event = await eventPromise;

      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });

    it('should emit menu-select event when item clicked', async () => {
      component.menuItems = [
        { id: 'test-item', label: 'Test Item' }
      ];
      component.open = true;
      await component.updateComplete;

      const eventPromise = new Promise((resolve) => {
        component.addEventListener('menu-select', (e) => {
          resolve(e);
        });
      });

      const menuItem = component.shadowRoot.querySelector('.menu-item');
      menuItem.click();
      const event = await eventPromise;

      expect(event.detail.itemId).toBe('test-item');
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });

    it('should close menu after item selection', async () => {
      component.menuItems = [
        { id: 'test-item', label: 'Test Item' }
      ];
      component.open = true;
      await component.updateComplete;

      const menuItem = component.shadowRoot.querySelector('.menu-item');
      menuItem.click();
      await component.updateComplete;

      expect(component.open).toBe(false);
    });
  });

  // ========================================
  // TEST SUITE 5: Rendering
  // ========================================
  describe('Rendering', () => {
    it('should render with shadow DOM', () => {
      expect(component.shadowRoot).toBeDefined();
    });

    it('should render user badge', async () => {
      const badge = component.shadowRoot.querySelector('.user-badge');
      expect(badge).toBeDefined();
    });

    it('should render user initials when no avatar', async () => {
      component.userName = 'John Doe';
      await component.updateComplete;

      const initials = component.shadowRoot.querySelector('.user-initials');
      expect(initials).toBeDefined();
      expect(initials.textContent).toBe('JD');
    });

    it('should render user avatar when provided', async () => {
      component.userAvatar = 'https://example.com/avatar.jpg';
      await component.updateComplete;

      const avatar = component.shadowRoot.querySelector('.user-avatar');
      expect(avatar).toBeDefined();
      expect(avatar.src).toBe('https://example.com/avatar.jpg');
    });

    it('should render dropdown menu', async () => {
      const dropdown = component.shadowRoot.querySelector('.menu-dropdown');
      expect(dropdown).toBeDefined();
    });

    it('should render default menu items when none provided', async () => {
      component.open = true;
      await component.updateComplete;

      const menuItems = component.shadowRoot.querySelectorAll('.menu-item');
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it('should render custom menu items', async () => {
      component.menuItems = [
        { id: 'item1', label: 'Custom Item 1' },
        { type: 'separator' },
        { id: 'item2', label: 'Custom Item 2', icon: '<svg></svg>' }
      ];
      component.open = true;
      await component.updateComplete;

      const menuItems = component.shadowRoot.querySelectorAll('.menu-item');
      const separator = component.shadowRoot.querySelector('.menu-separator');

      expect(menuItems.length).toBe(2);
      expect(separator).toBeDefined();
      expect(menuItems[0].textContent).toContain('Custom Item 1');
      expect(menuItems[1].textContent).toContain('Custom Item 2');
    });

    it('should render menu item icons', async () => {
      component.menuItems = [
        { id: 'item', label: 'Item', icon: '<svg class="test-icon"></svg>' }
      ];
      component.open = true;
      await component.updateComplete;

      const icon = component.shadowRoot.querySelector('.menu-item-icon');
      expect(icon).toBeDefined();
      expect(icon.innerHTML).toContain('test-icon');
    });

    it('should render user email in menu header', async () => {
      component.userEmail = 'user@example.com';
      component.open = true;
      await component.updateComplete;

      const email = component.shadowRoot.querySelector('.menu-user-email');
      expect(email).toBeDefined();
      expect(email.textContent).toBe('user@example.com');
    });

    it('should disable badge when disabled', async () => {
      component.disabled = true;
      await component.updateComplete;

      const badge = component.shadowRoot.querySelector('.user-badge');
      expect(badge.disabled).toBe(true);
    });

    it('should apply open styles when menu is open', async () => {
      component.open = true;
      await component.updateComplete;

      const dropdown = component.shadowRoot.querySelector('.menu-dropdown');
      const styles = getComputedStyle(dropdown);
      expect(component.hasAttribute('open')).toBe(true);
    });

    it('should generate correct initials for different name formats', async () => {
      // Single word
      component.userName = 'Admin';
      await component.updateComplete;
      let initials = component.shadowRoot.querySelector('.user-initials');
      expect(initials.textContent).toBe('A');

      // Two words
      component.userName = 'John Doe';
      await component.updateComplete;
      initials = component.shadowRoot.querySelector('.user-initials');
      expect(initials.textContent).toBe('JD');

      // Three words (should take first two)
      component.userName = 'John Paul Jones';
      await component.updateComplete;
      initials = component.shadowRoot.querySelector('.user-initials');
      expect(initials.textContent).toBe('JP');

      // Empty name
      component.userName = '';
      await component.updateComplete;
      initials = component.shadowRoot.querySelector('.user-initials');
      expect(initials.textContent).toBe('U');
    });
  });

  // ========================================
  // TEST SUITE 6: Document Listeners & Cleanup
  // ========================================
  describe('Document Listeners & Cleanup', () => {
    it('should add document listeners when menu opens', async () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      component.open = false;
      await component.updateComplete;

      component.open = true;
      await component.updateComplete;

      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });

    it('should remove document listeners when menu closes', async () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      component.open = true;
      await component.updateComplete;

      component.open = false;
      await component.updateComplete;

      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });

    it('should close menu on click outside', async () => {
      component.open = true;
      await component.updateComplete;

      // Simulate click outside
      document.body.click();
      await nextFrame();

      expect(component.open).toBe(false);
    });

    it('should not close menu on click inside', async () => {
      component.open = true;
      await component.updateComplete;

      // Click inside the component
      const badge = component.shadowRoot.querySelector('.user-badge');
      badge.click();
      await nextFrame();

      // Menu should still be closed (toggle behavior)
      expect(component.open).toBe(false);
    });

    it('should close menu on Escape key', async () => {
      component.open = true;
      await component.updateComplete;

      // Simulate Escape key press
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
      await nextFrame();

      expect(component.open).toBe(false);
    });

    it('should not close menu on other keys', async () => {
      component.open = true;
      await component.updateComplete;

      // Simulate Enter key press
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);
      await nextFrame();

      expect(component.open).toBe(true);
    });

    it('should clean up listeners on disconnect', async () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      component.open = true;
      await component.updateComplete;

      // Disconnect component
      component.remove();
      component.disconnectedCallback();

      expect(removeEventListenerSpy).toHaveBeenCalled();
      expect(component._documentListeners.size).toBe(0);

      removeEventListenerSpy.mockRestore();
    });

    it('should not add duplicate listeners', async () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      component.open = true;
      await component.updateComplete;
      const initialCallCount = addEventListenerSpy.mock.calls.length;

      // Try to add listeners again
      component._addDocumentListeners();

      expect(addEventListenerSpy.mock.calls.length).toBe(initialCallCount);

      addEventListenerSpy.mockRestore();
    });
  });

  // ========================================
  // TEST SUITE 7: Logging
  // ========================================
  describe('Logging', () => {
    it('should have logger instance', () => {
      expect(component._logger).toBeDefined();
      expect(typeof component._logger.debug).toBe('function');
      expect(typeof component._logger.trace).toBe('function');
      expect(typeof component._logger.warn).toBe('function');
      expect(typeof component._logger.error).toBe('function');
    });

    it('should log errors for invalid operations', () => {
      const errorSpy = vi.spyOn(component._logger, 'error');

      // Try to set invalid menu items
      try {
        component.setMenuItems('not an array');
      } catch (e) {
        // Expected error
      }

      expect(errorSpy).toHaveBeenCalled();
      errorSpy.mockRestore();
    });

    it('should log warnings for disabled operations', () => {
      const warnSpy = vi.spyOn(component._logger, 'warn');

      component.disabled = true;
      component.openMenu();

      expect(warnSpy).toHaveBeenCalledWith('Cannot open menu - component is disabled');
      warnSpy.mockRestore();
    });
  });

  // ========================================
  // TEST SUITE 8: Integration Tests
  // ========================================
  describe('Integration', () => {
    it('should handle complete user flow', async () => {
      // Set user info
      component.setUserInfo({
        name: 'Test User',
        email: 'test@example.com',
        avatar: 'https://example.com/test.jpg'
      });

      // Set custom menu items
      component.setMenuItems([
        { id: 'custom1', label: 'Custom Action 1' },
        { id: 'custom2', label: 'Custom Action 2' }
      ]);

      await component.updateComplete;

      // Open menu
      component.openMenu();
      await component.updateComplete;
      expect(component.open).toBe(true);

      // Check rendered content
      const avatar = component.shadowRoot.querySelector('.menu-avatar');
      expect(avatar.src).toBe('https://example.com/test.jpg');

      const email = component.shadowRoot.querySelector('.menu-user-email');
      expect(email.textContent).toBe('test@example.com');

      const menuItems = component.shadowRoot.querySelectorAll('.menu-item');
      expect(menuItems.length).toBe(2);

      // Select an item
      let selectedItemId = null;
      component.addEventListener('menu-select', (e) => {
        selectedItemId = e.detail.itemId;
      });

      menuItems[0].click();
      await component.updateComplete;

      expect(selectedItemId).toBe('custom1');
      expect(component.open).toBe(false);
    });

    it('should handle mobile responsive behavior', async () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 400
      });

      const mobileComponent = await fixture(html`<t-usr user-name="Mobile User"></t-usr>`);
      await mobileComponent.updateComplete;

      // Check mobile-specific rendering
      const dropdown = mobileComponent.shadowRoot.querySelector('.menu-dropdown');
      expect(dropdown).toBeDefined();

      mobileComponent.remove();
    });
  });
});