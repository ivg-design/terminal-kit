import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TDropdownLit, TDropdownManifest } from '../../js/components/TDropdownLit.js';

describe('TDropdownLit', () => {
  let dropdown;

  beforeEach(() => {
    dropdown = document.createElement('t-drp');
    document.body.appendChild(dropdown);
  });

  afterEach(() => {
    dropdown.remove();
  });

  describe('Manifest Completeness', () => {
    it('should have a valid manifest', () => {
      expect(TDropdownManifest).toBeDefined();
      expect(TDropdownManifest.tagName).toBe('t-drp');
      expect(TDropdownManifest.displayName).toBe('Dropdown');
      expect(TDropdownManifest.version).toBe('1.0.0');
    });

    it('should document all properties', () => {
      const { properties } = TDropdownManifest;

      expect(properties.placeholder).toBeDefined();
      expect(properties.value).toBeDefined();
      expect(properties.options).toBeDefined();
      expect(properties.searchable).toBeDefined();
      expect(properties.disabled).toBeDefined();
      expect(properties.open).toBeDefined();
      expect(properties.width).toBeDefined();
      expect(properties.showIcons).toBeDefined();
    });

    it('should document all methods', () => {
      const { methods } = TDropdownManifest;

      expect(methods.setValue).toBeDefined();
      expect(methods.getValue).toBeDefined();
      expect(methods.openDropdown).toBeDefined();
      expect(methods.closeDropdown).toBeDefined();
      expect(methods.toggle).toBeDefined();
      expect(methods.setOptions).toBeDefined();
      expect(methods.loadData).toBeDefined();
      expect(methods.reset).toBeDefined();
      expect(methods.setMetadata).toBeDefined();
    });

    it('should document all events', () => {
      const { events } = TDropdownManifest;

      expect(events['dropdown-change']).toBeDefined();
      expect(events['dropdown-open']).toBeDefined();
      expect(events['dropdown-close']).toBeDefined();
    });
  });

  describe('Property Functionality', () => {
    it('placeholder property should work', async () => {
      dropdown.placeholder = 'Select option...';
      await dropdown.updateComplete;
      expect(dropdown.placeholder).toBe('Select option...');
      expect(dropdown.getAttribute('placeholder')).toBe('Select option...');
    });

    it('value property should work', async () => {
      dropdown.value = 'folder/file.riv';
      await dropdown.updateComplete;
      expect(dropdown.value).toBe('folder/file.riv');
    });

    it('options property should work', async () => {
      const options = ['opt1', 'opt2', 'opt3'];
      dropdown.options = options;
      await dropdown.updateComplete;
      expect(dropdown.options).toEqual(options);
    });

    it('searchable property should work', async () => {
      dropdown.searchable = false;
      await dropdown.updateComplete;
      expect(dropdown.searchable).toBe(false);
      expect(dropdown.hasAttribute('searchable')).toBe(false);

      dropdown.searchable = true;
      await dropdown.updateComplete;
      expect(dropdown.searchable).toBe(true);
      expect(dropdown.hasAttribute('searchable')).toBe(true);
    });

    it('disabled property should work', async () => {
      dropdown.disabled = true;
      await dropdown.updateComplete;
      expect(dropdown.disabled).toBe(true);
      expect(dropdown.hasAttribute('disabled')).toBe(true);
    });

    it('open property should work', async () => {
      dropdown.open = true;
      await dropdown.updateComplete;
      expect(dropdown.open).toBe(true);
      expect(dropdown.hasAttribute('open')).toBe(true);
    });

    it('width property should work', async () => {
      dropdown.width = '400px';
      await dropdown.updateComplete;
      expect(dropdown.width).toBe('400px');
      expect(dropdown.getAttribute('width')).toBe('400px');
    });

    it('showIcons property should work', async () => {
      dropdown.showIcons = false;
      await dropdown.updateComplete;
      expect(dropdown.showIcons).toBe(false);
      expect(dropdown.hasAttribute('show-icons')).toBe(false);
    });
  });

  describe('Method Functionality', () => {
    it('setValue() should update value', async () => {
      dropdown.setValue('test/value.riv');
      await dropdown.updateComplete;
      expect(dropdown.value).toBe('test/value.riv');
    });

    it('setValue() should handle empty value', async () => {
      dropdown.setValue('');
      await dropdown.updateComplete;
      expect(dropdown.value).toBe('');
    });

    it('getValue() should return current value', async () => {
      dropdown.value = 'folder/file.riv';
      await dropdown.updateComplete;
      expect(dropdown.getValue()).toBe('folder/file.riv');
    });

    it('openDropdown() should open dropdown', async () => {
      dropdown.openDropdown();
      await dropdown.updateComplete;
      expect(dropdown.open).toBe(true);
    });

    it('openDropdown() should not open when disabled', async () => {
      dropdown.disabled = true;
      await dropdown.updateComplete;
      dropdown.openDropdown();
      await dropdown.updateComplete;
      expect(dropdown.open).toBe(false);
    });

    it('closeDropdown() should close dropdown', async () => {
      dropdown.open = true;
      await dropdown.updateComplete;
      dropdown.closeDropdown();
      await dropdown.updateComplete;
      expect(dropdown.open).toBe(false);
    });

    it('toggle() should toggle open state', async () => {
      expect(dropdown.open).toBe(false);

      dropdown.toggle();
      await dropdown.updateComplete;
      expect(dropdown.open).toBe(true);

      dropdown.toggle();
      await dropdown.updateComplete;
      expect(dropdown.open).toBe(false);
    });

    it('toggle() should not toggle when disabled', async () => {
      dropdown.disabled = true;
      await dropdown.updateComplete;
      dropdown.toggle();
      await dropdown.updateComplete;
      expect(dropdown.open).toBe(false);
    });

    it('setOptions() should update options', async () => {
      const options = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' }
      ];
      dropdown.setOptions(options);
      await dropdown.updateComplete;
      expect(dropdown.options).toEqual(options);
    });

    it('loadData() should load folder structure', async () => {
      const data = {
        folders: {
          'Folder1': {
            files: ['file1.riv', 'file2.riv']
          }
        },
        files: ['file3.riv']
      };
      dropdown.loadData(data);
      await dropdown.updateComplete;
      expect(dropdown._data).toEqual(data);
    });

    it('reset() should clear selection and state', async () => {
      dropdown.value = 'folder/file.riv';
      dropdown._folderStates = { 'folder': true };
      dropdown._searchTerm = 'test';
      await dropdown.updateComplete;

      dropdown.reset();
      await dropdown.updateComplete;

      expect(dropdown.value).toBe('');
      expect(dropdown._folderStates).toEqual({});
      expect(dropdown._searchTerm).toBe('');
    });

    it('setMetadata() should update metadata', async () => {
      const metadata = {
        'file1.riv': { description: 'Test file 1' },
        'file2.riv': { description: 'Test file 2' }
      };
      dropdown.setMetadata(metadata);
      await dropdown.updateComplete;
      expect(dropdown._metadata).toEqual(metadata);
    });
  });

  describe('Event Functionality', () => {
    it('should fire dropdown-change event on selection', async () => {
      const data = {
        files: ['test.riv']
      };
      dropdown.loadData(data);
      await dropdown.updateComplete;

      const eventPromise = new Promise(resolve => {
        dropdown.addEventListener('dropdown-change', resolve, { once: true });
      });

      dropdown._selectFile('test.riv', 'test', null);

      const event = await eventPromise;
      expect(event.type).toBe('dropdown-change');
      expect(event.detail.value).toBe('test.riv');
      expect(event.detail.displayName).toBe('test');
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });

    it('should fire dropdown-open event when opened', async () => {
      const eventPromise = new Promise(resolve => {
        dropdown.addEventListener('dropdown-open', resolve, { once: true });
      });

      dropdown.open = true;
      await dropdown.updateComplete;

      const event = await eventPromise;
      expect(event.type).toBe('dropdown-open');
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });

    it('should fire dropdown-close event when closed', async () => {
      dropdown.open = true;
      await dropdown.updateComplete;

      const eventPromise = new Promise(resolve => {
        dropdown.addEventListener('dropdown-close', resolve, { once: true });
      });

      dropdown.closeDropdown();
      await dropdown.updateComplete;

      const event = await eventPromise;
      expect(event.type).toBe('dropdown-close');
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });

    it('all events should have correct bubbles and composed flags', async () => {
      const data = { files: ['test.riv'] };
      dropdown.loadData(data);
      await dropdown.updateComplete;

      // Test dropdown-change
      const changePromise = new Promise(resolve => {
        dropdown.addEventListener('dropdown-change', resolve, { once: true });
      });
      dropdown._selectFile('test.riv', 'test', null);
      const changeEvent = await changePromise;
      expect(changeEvent.bubbles).toBe(true);
      expect(changeEvent.composed).toBe(true);

      // Test dropdown-open
      const openPromise = new Promise(resolve => {
        dropdown.addEventListener('dropdown-open', resolve, { once: true });
      });
      dropdown.open = true;
      await dropdown.updateComplete;
      const openEvent = await openPromise;
      expect(openEvent.bubbles).toBe(true);
      expect(openEvent.composed).toBe(true);

      // Test dropdown-close
      const closePromise = new Promise(resolve => {
        dropdown.addEventListener('dropdown-close', resolve, { once: true });
      });
      dropdown.closeDropdown();
      await dropdown.updateComplete;
      const closeEvent = await closePromise;
      expect(closeEvent.bubbles).toBe(true);
      expect(closeEvent.composed).toBe(true);
    });
  });

  describe('Validation', () => {
    it('should validate options array', () => {
      const validation = TDropdownLit.getPropertyValidation('options');
      expect(validation).toBeDefined();

      // Valid cases
      expect(validation.validate(['opt1', 'opt2'])).toEqual({ valid: true, errors: [] });
      expect(validation.validate([
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' }
      ])).toEqual({ valid: true, errors: [] });

      // Invalid cases
      expect(validation.validate('not an array').valid).toBe(false);
      expect(validation.validate([123]).valid).toBe(false);
      expect(validation.validate([{}]).valid).toBe(false);
    });

    it('should accept simple string options', () => {
      const validation = TDropdownLit.getPropertyValidation('options');
      const result = validation.validate(['option1', 'option2', 'option3']);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should accept object options with value or label', () => {
      const validation = TDropdownLit.getPropertyValidation('options');
      const result = validation.validate([
        { value: 'opt1' },
        { label: 'Option 2' },
        { value: 'opt3', label: 'Option 3' }
      ]);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject invalid option structures', () => {
      const validation = TDropdownLit.getPropertyValidation('options');
      const result = validation.validate([
        { value: 'opt1' },
        {},
        { value: 'opt3' }
      ]);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Rendering', () => {
    it('should render component', async () => {
      await dropdown.updateComplete;
      const container = dropdown.shadowRoot.querySelector('.nested-dropdown-container');
      expect(container).toBeDefined();
    });

    it('should render button', async () => {
      await dropdown.updateComplete;
      const button = dropdown.shadowRoot.querySelector('.nested-dropdown-button');
      expect(button).toBeDefined();
    });

    it('should render panel', async () => {
      await dropdown.updateComplete;
      const panel = dropdown.shadowRoot.querySelector('.nested-dropdown-panel');
      expect(panel).toBeDefined();
    });

    it('should show search when searchable', async () => {
      dropdown.searchable = true;
      dropdown.open = true;
      await dropdown.updateComplete;
      const search = dropdown.shadowRoot.querySelector('.dropdown-search-wrapper');
      expect(search).toBeDefined();
    });

    it('should hide search when not searchable', async () => {
      dropdown.searchable = false;
      dropdown.open = true;
      await dropdown.updateComplete;
      const search = dropdown.shadowRoot.querySelector('.dropdown-search-wrapper');
      expect(search).toBeNull();
    });

    it('should apply disabled class when disabled', async () => {
      dropdown.disabled = true;
      await dropdown.updateComplete;
      const container = dropdown.shadowRoot.querySelector('.nested-dropdown-container');
      expect(container.classList.contains('disabled')).toBe(true);
    });

    it('should apply active class when open', async () => {
      dropdown.open = true;
      await dropdown.updateComplete;
      const button = dropdown.shadowRoot.querySelector('.nested-dropdown-button');
      expect(button.classList.contains('active')).toBe(true);
    });

    it('should hide panel when not open', async () => {
      dropdown.open = false;
      await dropdown.updateComplete;
      const panel = dropdown.shadowRoot.querySelector('.nested-dropdown-panel');
      expect(panel.classList.contains('hidden')).toBe(true);
    });

    it('should render folder structure', async () => {
      const data = {
        folders: {
          'TestFolder': {
            files: ['file1.riv']
          }
        },
        files: []
      };
      dropdown.loadData(data);
      dropdown.open = true;
      await dropdown.updateComplete;

      const folder = dropdown.shadowRoot.querySelector('.tree-folder');
      expect(folder).toBeDefined();
    });

    it('should render files', async () => {
      const data = {
        folders: {},
        files: ['test1.riv', 'test2.riv']
      };
      dropdown.loadData(data);
      dropdown.open = true;
      await dropdown.updateComplete;

      const files = dropdown.shadowRoot.querySelectorAll('.tree-file');
      expect(files.length).toBe(2);
    });

    it('should show icons when showIcons is true', async () => {
      const data = { files: ['test.riv'] };
      dropdown.loadData(data);
      dropdown.showIcons = true;
      dropdown.open = true;
      await dropdown.updateComplete;

      const fileIcon = dropdown.shadowRoot.querySelector('.file-icon');
      expect(fileIcon).toBeDefined();
    });

    it('should hide icons when showIcons is false', async () => {
      const data = { files: ['test.riv'] };
      dropdown.loadData(data);
      dropdown.showIcons = false;
      dropdown.open = true;
      await dropdown.updateComplete;

      const fileIcon = dropdown.shadowRoot.querySelector('.file-icon');
      expect(fileIcon).toBeNull();
    });
  });

  describe('Cleanup Patterns', () => {
    it('should remove document listeners on disconnect', async () => {
      await dropdown.updateComplete;

      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      dropdown.remove();

      expect(removeEventListenerSpy).toHaveBeenCalled();
      removeEventListenerSpy.mockRestore();
    });

    it('should clear timers on disconnect', async () => {
      // Add a timer
      const timerId = setTimeout(() => {}, 1000);
      dropdown._timers.add(timerId);

      await dropdown.updateComplete;
      expect(dropdown._timers.size).toBe(1);

      dropdown.remove();

      expect(dropdown._timers.size).toBe(0);
    });

    it('should handle multiple disconnects safely', async () => {
      await dropdown.updateComplete;

      // First disconnect
      dropdown.disconnectedCallback();

      // Second disconnect should not throw
      expect(() => dropdown.disconnectedCallback()).not.toThrow();
    });
  });

  describe('Logging', () => {
    it('should have logger instance', () => {
      expect(dropdown._logger).toBeDefined();
      expect(dropdown._logger.error).toBeDefined();
      expect(dropdown._logger.warn).toBeDefined();
      expect(dropdown._logger.info).toBeDefined();
      expect(dropdown._logger.debug).toBeDefined();
      expect(dropdown._logger.trace).toBeDefined();
    });
  });

  describe('Data Conversion', () => {
    it('should convert simple options to data structure', async () => {
      const options = ['opt1', 'opt2', 'opt3'];
      dropdown.options = options;
      await dropdown.updateComplete;

      expect(dropdown._data).toBeDefined();
      expect(dropdown._data.files).toEqual(options);
    });

    it('should convert object options to data structure', async () => {
      const options = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' }
      ];
      dropdown.options = options;
      await dropdown.updateComplete;

      expect(dropdown._data).toBeDefined();
      expect(dropdown._data.files).toEqual(['opt1', 'opt2']);
    });

    it('should extract metadata from options', async () => {
      const options = [
        { value: 'opt1', label: 'Option 1', description: 'First option' },
        { value: 'opt2', label: 'Option 2', description: 'Second option' }
      ];
      dropdown.options = options;
      await dropdown.updateComplete;

      expect(dropdown._metadata).toBeDefined();
      expect(dropdown._metadata['opt1']).toBeDefined();
      expect(dropdown._metadata['opt1'].description).toBe('First option');
    });
  });

  describe('Search Functionality', () => {
    it('should filter files by search term', async () => {
      const data = {
        files: ['animation1.riv', 'animation2.riv', 'test.riv']
      };
      dropdown.loadData(data);
      dropdown.searchable = true;
      dropdown.open = true;
      dropdown._searchTerm = 'animation';
      await dropdown.updateComplete;

      const files = dropdown.shadowRoot.querySelectorAll('.tree-file');
      expect(files.length).toBe(2);
    });

    it('should show no results message when search has no matches', async () => {
      const data = {
        files: ['test1.riv', 'test2.riv']
      };
      dropdown.loadData(data);
      dropdown.searchable = true;
      dropdown.open = true;
      dropdown._searchTerm = 'nonexistent';
      await dropdown.updateComplete;

      const noResults = dropdown.shadowRoot.querySelector('.no-results');
      expect(noResults).toBeDefined();
      expect(noResults.textContent).toContain('No matching items');
    });

    it('should clear search on close', async () => {
      dropdown.searchable = true;
      dropdown.open = true;
      dropdown._searchTerm = 'test';
      await dropdown.updateComplete;

      dropdown.closeDropdown();
      await dropdown.updateComplete;

      expect(dropdown._searchTerm).toBe('');
    });
  });

  describe('Folder Functionality', () => {
    it('should toggle folder expand/collapse', async () => {
      const data = {
        folders: {
          'TestFolder': {
            files: ['file1.riv']
          }
        }
      };
      dropdown.loadData(data);
      dropdown.open = true;
      await dropdown.updateComplete;

      expect(dropdown._folderStates['TestFolder']).toBeFalsy();

      dropdown._toggleFolder('TestFolder');
      await dropdown.updateComplete;

      expect(dropdown._folderStates['TestFolder']).toBe(true);

      dropdown._toggleFolder('TestFolder');
      await dropdown.updateComplete;

      expect(dropdown._folderStates['TestFolder']).toBe(false);
    });

    it('should count files in folder recursively', () => {
      const data = {
        folders: {
          'Folder1': {
            files: ['file1.riv', 'file2.riv'],
            folders: {
              'Subfolder': {
                files: ['file3.riv']
              }
            }
          }
        },
        files: ['file4.riv']
      };

      const count = dropdown._countAnimations(data.folders['Folder1']);
      expect(count).toBe(3);
    });
  });
});