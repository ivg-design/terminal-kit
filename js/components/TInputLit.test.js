import { fixture, html, expect } from '@open-wc/testing';
import './TInputLit.js';

describe('TInputLit', () => {
  // =====================================================
  // SUITE 1: PROPERTIES (Required for FORM-ADVANCED)
  // =====================================================
  describe('Properties', () => {
    let el;

    beforeEach(async () => {
      el = await fixture(html`<t-inp></t-inp>`);
    });

    it('should initialize with default properties', () => {
      expect(el.type).to.equal('text');
      expect(el.placeholder).to.equal('');
      expect(el.value).to.equal('');
      expect(el.disabled).to.be.false;
      expect(el.readonly).to.be.false;
      expect(el.required).to.be.false;
      expect(el.autocomplete).to.equal('off');
      expect(el.label).to.equal('');
      expect(el.helperText).to.equal('');
      expect(el.icon).to.equal('');
    });

    it('should reflect type property', async () => {
      el.type = 'email';
      await el.updateComplete;
      expect(el.getAttribute('type')).to.equal('email');
    });

    it('should reflect disabled property', async () => {
      el.disabled = true;
      await el.updateComplete;
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    it('should reflect required property', async () => {
      el.required = true;
      await el.updateComplete;
      expect(el.hasAttribute('required')).to.be.true;
    });

    it('should handle min/max properties for number type', async () => {
      el.type = 'number';
      el.min = 0;
      el.max = 100;
      await el.updateComplete;
      expect(el.getAttribute('min')).to.equal('0');
      expect(el.getAttribute('max')).to.equal('100');
    });

    it('should handle pattern property', async () => {
      el.pattern = '[A-Za-z]+';
      await el.updateComplete;
      expect(el.getAttribute('pattern')).to.equal('[A-Za-z]+');
    });
  });

  // =====================================================
  // SUITE 2: RENDERING (Required for FORM-ADVANCED)
  // =====================================================
  describe('Rendering', () => {
    it('should render with label', async () => {
      const el = await fixture(html`<t-inp label="Username"></t-inp>`);
      const label = el.shadowRoot.querySelector('.control-label');
      expect(label).to.exist;
      expect(label.textContent).to.equal('Username');
    });

    it('should render input element', async () => {
      const el = await fixture(html`<t-inp></t-inp>`);
      const input = el.shadowRoot.querySelector('input');
      expect(input).to.exist;
    });

    it('should render helper text', async () => {
      const el = await fixture(html`<t-inp helper-text="Enter your username"></t-inp>`);
      const helperText = el.shadowRoot.querySelector('.helper-text');
      expect(helperText).to.exist;
      expect(helperText.textContent).to.equal('Enter your username');
    });

    it('should render error message when error state is set', async () => {
      const el = await fixture(html`<t-inp></t-inp>`);
      el.setError(true, 'Field is required');
      await el.updateComplete;
      const errorMessage = el.shadowRoot.querySelector('.error-message');
      expect(errorMessage).to.exist;
      expect(errorMessage.textContent).to.equal('Field is required');
    });

    it('should render password toggle for password type', async () => {
      const el = await fixture(html`<t-inp type="password"></t-inp>`);
      const toggle = el.shadowRoot.querySelector('.password-toggle');
      expect(toggle).to.exist;
    });

    it('should render number controls for number type', async () => {
      const el = await fixture(html`<t-inp type="number"></t-inp>`);
      const controls = el.shadowRoot.querySelector('.number-controls');
      expect(controls).to.exist;
    });

    it('should render search clear button when search has value', async () => {
      const el = await fixture(html`<t-inp type="search" value="test"></t-inp>`);
      const clearBtn = el.shadowRoot.querySelector('.search-clear');
      expect(clearBtn).to.exist;
    });
  });

  // =====================================================
  // SUITE 3: LOGGING (Required for FORM-ADVANCED)
  // =====================================================
  describe('Logging', () => {
    let el;
    let loggerSpy;

    beforeEach(async () => {
      el = await fixture(html`<t-inp></t-inp>`);
      loggerSpy = sinon.spy(el._logger, 'debug');
    });

    afterEach(() => {
      loggerSpy.restore();
    });

    it('should log when setValue is called', () => {
      el.setValue('test');
      expect(loggerSpy).to.have.been.calledWith('setValue called', { value: 'test' });
    });

    it('should log when getValue is called', () => {
      el.getValue();
      expect(loggerSpy).to.have.been.calledWith('getValue called');
    });

    it('should log when focus is called', () => {
      el.focus();
      expect(loggerSpy).to.have.been.calledWith('focus called');
    });

    it('should log when validate is called', () => {
      el.validate();
      expect(loggerSpy).to.have.been.calledWith('validate called');
    });

    it('should log when clear is called', () => {
      el.clear();
      expect(loggerSpy).to.have.been.calledWith('clear called');
    });
  });

  // =====================================================
  // SUITE 4: VALIDATION (Required for FORM-ADVANCED)
  // =====================================================
  describe('Validation', () => {
    let el;

    beforeEach(async () => {
      el = await fixture(html`<t-inp></t-inp>`);
    });

    it('should validate required field', async () => {
      el.required = true;
      el.value = '';
      const isValid = el.validate();
      expect(isValid).to.be.false;
      expect(el._errorMessage).to.equal('This field is required');
    });

    it('should validate email format', async () => {
      el.type = 'email';
      el.value = 'invalid-email';
      const isValid = el.validate();
      expect(isValid).to.be.false;
      expect(el._errorMessage).to.equal('Invalid email address');
    });

    it('should validate URL format', async () => {
      el.type = 'url';
      el.value = 'not-a-url';
      const isValid = el.validate();
      expect(isValid).to.be.false;
      expect(el._errorMessage).to.equal('Invalid URL');
    });

    it('should validate min/max for number type', async () => {
      el.type = 'number';
      el.min = 0;
      el.max = 100;
      el.value = '150';
      const isValid = el.validate();
      expect(isValid).to.be.false;
      expect(el._errorMessage).to.equal('Value must be at most 100');
    });

    it('should validate minlength', async () => {
      el.minlength = 5;
      el.value = 'abc';
      const isValid = el.validate();
      expect(isValid).to.be.false;
      expect(el._errorMessage).to.equal('Minimum 5 characters required');
    });

    it('should validate maxlength', async () => {
      el.maxlength = 10;
      el.value = 'this is too long';
      const isValid = el.validate();
      expect(isValid).to.be.false;
      expect(el._errorMessage).to.equal('Maximum 10 characters allowed');
    });

    it('should validate pattern', async () => {
      el.pattern = '^[A-Z]+$';
      el.value = 'lowercase';
      const isValid = el.validate();
      expect(isValid).to.be.false;
      expect(el._errorMessage).to.equal('Value does not match required pattern');
    });

    it('should pass validation for valid input', async () => {
      el.type = 'email';
      el.value = 'user@example.com';
      const isValid = el.validate();
      expect(isValid).to.be.true;
      expect(el._errorState).to.be.false;
    });

    it('should validate property using static getPropertyValidation', () => {
      const validation = el.constructor.getPropertyValidation('type');
      expect(validation).to.exist;
      const result = validation.validate('invalid-type');
      expect(result.valid).to.be.false;
      expect(result.errors).to.have.length(1);
    });
  });

  // =====================================================
  // SUITE 5: EVENTS (Required for FORM-ADVANCED)
  // =====================================================
  describe('Events', () => {
    let el;

    beforeEach(async () => {
      el = await fixture(html`<t-inp></t-inp>`);
    });

    it('should emit input-value event on input', async () => {
      const listener = sinon.spy();
      el.addEventListener('input-value', listener);

      const input = el.shadowRoot.querySelector('input');
      input.value = 'test';
      input.dispatchEvent(new Event('input'));

      expect(listener).to.have.been.called;
      expect(listener.firstCall.args[0].detail.value).to.equal('test');
    });

    it('should emit input-change event on blur', async () => {
      const listener = sinon.spy();
      el.addEventListener('input-change', listener);

      const input = el.shadowRoot.querySelector('input');
      input.value = 'test';
      input.dispatchEvent(new Event('blur'));

      expect(listener).to.have.been.called;
      expect(listener.firstCall.args[0].detail.value).to.equal('test');
    });

    it('should emit input-focus event on focus', async () => {
      const listener = sinon.spy();
      el.addEventListener('input-focus', listener);

      const input = el.shadowRoot.querySelector('input');
      input.dispatchEvent(new Event('focus'));

      expect(listener).to.have.been.called;
    });

    it('should emit input-blur event on blur', async () => {
      const listener = sinon.spy();
      el.addEventListener('input-blur', listener);

      const input = el.shadowRoot.querySelector('input');
      input.dispatchEvent(new Event('blur'));

      expect(listener).to.have.been.called;
    });

    it('should emit input-enter event on Enter key', async () => {
      const listener = sinon.spy();
      el.addEventListener('input-enter', listener);

      const input = el.shadowRoot.querySelector('input');
      input.value = 'test';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(listener).to.have.been.called;
      expect(listener.firstCall.args[0].detail.value).to.equal('test');
    });

    it('should emit input-error event on validation error', async () => {
      const listener = sinon.spy();
      el.addEventListener('input-error', listener);

      el.setError(true, 'Test error');

      expect(listener).to.have.been.called;
      expect(listener.firstCall.args[0].detail.message).to.equal('Test error');
    });

    it('should emit input-valid event when validation passes', async () => {
      const listener = sinon.spy();
      el.addEventListener('input-valid', listener);

      el.value = 'test';
      el.setError(false);

      expect(listener).to.have.been.called;
      expect(listener.firstCall.args[0].detail.value).to.equal('test');
    });

    it('should emit input-clear event when cleared', async () => {
      const listener = sinon.spy();
      el.addEventListener('input-clear', listener);

      el.value = 'test';
      el.clear();

      expect(listener).to.have.been.called;
    });
  });

  // =====================================================
  // SUITE 6: FORM PARTICIPATION (Required for FORM-ADVANCED)
  // =====================================================
  describe('Form Participation', () => {
    let el;

    beforeEach(async () => {
      el = await fixture(html`<t-inp></t-inp>`);
    });

    it('should have formAssociated set to true', () => {
      expect(el.constructor.formAssociated).to.be.true;
    });

    it('should have ElementInternals attached', () => {
      expect(el._internals).to.exist;
    });

    it('should update form value when value changes', async () => {
      const setFormValueSpy = sinon.spy(el._internals, 'setFormValue');

      el.value = 'test';
      await el.updateComplete;

      expect(setFormValueSpy).to.have.been.calledWith('test');
      setFormValueSpy.restore();
    });

    it('should set validity when validation fails', async () => {
      const setValiditySpy = sinon.spy(el._internals, 'setValidity');

      el.setError(true, 'Test error');

      expect(setValiditySpy).to.have.been.calledWith(
        { customError: true },
        'Test error'
      );
      setValiditySpy.restore();
    });

    it('should clear validity when validation passes', async () => {
      const setValiditySpy = sinon.spy(el._internals, 'setValidity');

      el.setError(false);

      expect(setValiditySpy).to.have.been.calledWith({});
      setValiditySpy.restore();
    });

    it('should sync form value on firstUpdated', async () => {
      const el2 = document.createElement('t-inp');
      el2.value = 'initial';
      const setFormValueSpy = sinon.spy(el2._internals, 'setFormValue');

      document.body.appendChild(el2);
      await el2.updateComplete;

      expect(setFormValueSpy).to.have.been.calledWith('initial');
      document.body.removeChild(el2);
    });
  });

  // =====================================================
  // SUITE 7: METHODS (Required for FORM-ADVANCED)
  // =====================================================
  describe('Methods', () => {
    let el;

    beforeEach(async () => {
      el = await fixture(html`<t-inp></t-inp>`);
    });

    it('should set value with setValue()', () => {
      el.setValue('test value');
      expect(el.value).to.equal('test value');
    });

    it('should get value with getValue()', () => {
      el.value = 'test value';
      expect(el.getValue()).to.equal('test value');
    });

    it('should focus input with focus()', async () => {
      const input = el.shadowRoot.querySelector('input');
      const focusSpy = sinon.spy(input, 'focus');

      el.focus();

      expect(focusSpy).to.have.been.called;
      focusSpy.restore();
    });

    it('should blur input with blur()', async () => {
      const input = el.shadowRoot.querySelector('input');
      const blurSpy = sinon.spy(input, 'blur');

      el.blur();

      expect(blurSpy).to.have.been.called;
      blurSpy.restore();
    });

    it('should clear value with clear()', () => {
      el.value = 'test';
      el.clear();
      expect(el.value).to.equal('');
    });

    it('should set error state with setError()', async () => {
      el.setError(true, 'Error message');
      await el.updateComplete;

      expect(el._errorState).to.be.true;
      expect(el._errorMessage).to.equal('Error message');

      const errorMsg = el.shadowRoot.querySelector('.error-message');
      expect(errorMsg).to.exist;
      expect(errorMsg.textContent).to.equal('Error message');
    });

    it('should clear error state with setError(false)', async () => {
      el.setError(true, 'Error message');
      await el.updateComplete;

      el.setError(false);
      await el.updateComplete;

      expect(el._errorState).to.be.false;
      expect(el._errorMessage).to.equal('');

      const errorMsg = el.shadowRoot.querySelector('.error-message');
      expect(errorMsg).to.not.exist;
    });
  });
});