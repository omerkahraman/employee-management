import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import '../components/views/employee-list-view.js';
import { i18n } from '../utils/i18n.js';
import { mockEmployeeData, mockMultipleEmployees } from './helpers/test-helpers.js';

describe('EmployeeListView', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <employee-list-view
        .employees="${mockMultipleEmployees}">
      </employee-list-view>
    `);
  });

  it('renders correct number of employee cards', async () => {
    const cards = element.shadowRoot.querySelectorAll('.list-item');
    expect(cards.length).to.equal(mockMultipleEmployees.length);
  });

  it('displays employee information correctly in card format', async () => {
    const firstCard = element.shadowRoot.querySelector('.list-item');
    const employee = mockMultipleEmployees[0];

    const name = firstCard.querySelector('.employee-name');
    expect(name.textContent.trim()).to.equal(`${employee.firstName} ${employee.lastName}`);

    const departmentBadge = firstCard.querySelector('.department-badge');
    const positionBadge = firstCard.querySelector('.position-badge');
    expect(departmentBadge.textContent.trim()).to.equal(employee.department);
    expect(positionBadge.textContent.trim()).to.equal(employee.position);
  });

  it('formats dates correctly', async () => {
    const card = element.shadowRoot.querySelector('.list-item');
    const dateValues = card.querySelectorAll('.detail-value');
    
    const employmentDate = Array.from(dateValues)
      .find(v => v.previousElementSibling.textContent.includes(i18n.t('employee.dateOfEmployment')));
    const birthDate = Array.from(dateValues)
      .find(v => v.previousElementSibling.textContent.includes(i18n.t('employee.dateOfBirth')));

    expect(employmentDate.textContent).to.equal(element.formatDate(mockMultipleEmployees[0].dateOfEmployment));
    expect(birthDate.textContent).to.equal(element.formatDate(mockMultipleEmployees[0].dateOfBirth));
  });

  it('emits edit event when edit button clicked', async () => {
    let editedEmployee = null;
    element.addEventListener('edit-employee', (e) => {
      editedEmployee = e.detail;
    });

    const editButton = element.shadowRoot.querySelector('.action-button');
    editButton.click();

    expect(editedEmployee).to.deep.equal(mockMultipleEmployees[0]);
  });

  it('opens delete dialog when delete button clicked', async () => {
    const deleteButton = element.shadowRoot.querySelectorAll('.action-button')[1];
    deleteButton.click();
    await element.updateComplete;

    expect(element.deleteDialogOpen).to.be.true;
    expect(element.employeeToDelete).to.deep.equal(mockMultipleEmployees[0]);
  });

  it('shows empty state when no employees', async () => {
    element = await fixture(html`
      <employee-list-view .employees="${[]}"></employee-list-view>
    `);

    const cards = element.shadowRoot.querySelectorAll('.list-item');
    expect(cards.length).to.equal(0);
  });

  it('emits delete event when delete is confirmed', async () => {
    let deletedEmployee = null;
    element.addEventListener('delete-employee', (e) => {
      deletedEmployee = e.detail;
    });

    element.deleteEmployee(mockMultipleEmployees[0]);
    await element.updateComplete;
    element._handleDeleteConfirm();

    expect(deletedEmployee).to.deep.equal(mockMultipleEmployees[0]);
  });
 
it('displays contact information correctly', () => {
  const detailItems = element.shadowRoot.querySelectorAll('.detail-item');
  const phoneItem = Array.from(detailItems)
    .find(item => item.querySelector('.detail-label').textContent.includes('Phone'));
  const emailItem = Array.from(detailItems)
    .find(item => item.querySelector('.detail-label').textContent.includes('Email'));

  expect(phoneItem.querySelector('.detail-value').textContent)
    .to.equal(mockMultipleEmployees[0].phone);
  expect(emailItem.querySelector('.detail-value').textContent)
    .to.equal(mockMultipleEmployees[0].email);
});

it('renders all required detail sections', () => {
  const detailItems = element.shadowRoot.querySelectorAll('.detail-item');
  expect(detailItems.length).to.equal(8); 
});

it('renders specific detail sections', () => {
  const detailLabels = Array.from(element.shadowRoot.querySelectorAll('.detail-label'))
    .map(label => label.textContent.trim());
  
  expect(detailLabels).to.include(i18n.t('employee.email'));
  expect(detailLabels).to.include(i18n.t('employee.phone'));
  expect(detailLabels).to.include(i18n.t('employee.dateOfEmployment'));
  expect(detailLabels).to.include(i18n.t('employee.dateOfBirth'));
});
});