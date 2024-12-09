import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import '../components/employee-form.js';
import { i18n } from '../utils/i18n.js';
import { mockEmployeeData } from './helpers/test-helpers.js';

describe('EmployeeForm', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employee-form></employee-form>`);
  });

  it('renders in create mode by default', async () => {
    expect(element.mode).to.equal('create');
    expect(element.shadowRoot.querySelector('.form-title').textContent.trim())
      .to.equal(i18n.t('employeeForm.createTitle'));
  });

  it('loads employee data in edit mode', async () => {
    element.employee = mockEmployeeData;
    element.mode = 'edit';
    await element.updateComplete;

    expect(element.shadowRoot.querySelector('#firstName').value)
      .to.equal(mockEmployeeData.firstName);
    expect(element.shadowRoot.querySelector('#lastName').value)
      .to.equal(mockEmployeeData.lastName);
  });

  it('validates required fields', async () => {
    const saveButton = element.shadowRoot.querySelector('button.primary');
    saveButton.click();
    await element.updateComplete;

    const errors = element.shadowRoot.querySelectorAll('.error');
    expect(errors.length).to.be.greaterThan(0);
  });

  it('validates email format', async () => {
    element.employee = {
      ...mockEmployeeData,
      email: 'invalid-email'
    };
    element.validate();
    await element.updateComplete;

    const errors = Array.from(element.shadowRoot.querySelectorAll('.error'))
      .map(error => error.textContent);
    expect(errors.some(error => error.includes(i18n.t('validation.invalidEmail')))).to.be.true;
  });

  it('validates date of birth not in future', async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    
    element.employee = {
      ...mockEmployeeData,
      dateOfBirth: futureDate.toISOString().split('T')[0]
    };
    element.validate();
    await element.updateComplete;

    const errors = element.shadowRoot.querySelectorAll('.error');
    expect(errors.length).to.be.greaterThan(0);
  });

  it('updates employee data when input changes', async () => {
    const firstNameInput = element.shadowRoot.querySelector('#firstName');
    firstNameInput.value = 'Test Name';
    firstNameInput.dispatchEvent(new Event('input'));
    await element.updateComplete;

    expect(element.employee.firstName).to.equal('Test Name');
  });

  it('handles department selection', async () => {
    const departmentSelect = element.shadowRoot.querySelector('#department');
    departmentSelect.value = 'Tech';
    departmentSelect.dispatchEvent(new Event('change'));
    await element.updateComplete;

    expect(element.employee.department).to.equal('Tech');
  });

  it('handles position selection', async () => {
    const positionSelect = element.shadowRoot.querySelector('#position');
    positionSelect.value = 'Senior';
    positionSelect.dispatchEvent(new Event('change'));
    await element.updateComplete;

    expect(element.employee.position).to.equal('Senior');
  });
});