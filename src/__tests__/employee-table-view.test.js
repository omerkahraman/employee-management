import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import '../components/views/employee-table-view.js';
import { i18n } from '../utils/i18n.js';
import { mockEmployeeData, mockMultipleEmployees } from './helpers/test-helpers.js';

describe('EmployeeTableView', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <employee-table-view
        .employees="${mockMultipleEmployees}">
      </employee-table-view>
    `);
  });

  it('renders table headers correctly', async () => {
    const headers = element.shadowRoot.querySelectorAll('th');
    expect(headers.length).to.equal(10); 
  });

  it('renders correct number of rows', async () => {
    const rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(mockMultipleEmployees.length);
  });

  it('formats dates correctly', async () => {
    const dateCell = element.shadowRoot.querySelector('td:nth-child(4)');
    const formattedDate = element.formatDate(mockMultipleEmployees[0].dateOfEmployment);
    expect(dateCell.textContent).to.equal(formattedDate);
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

  it('handles select all checkbox', async () => {
    const selectAllCheckbox = element.shadowRoot.querySelector('thead input[type="checkbox"]');
    selectAllCheckbox.click();
    await element.updateComplete;

    const rowCheckboxes = element.shadowRoot.querySelectorAll('tbody input[type="checkbox"]');
    rowCheckboxes.forEach(checkbox => {
      expect(checkbox.checked).to.be.true;
    });
  });

  it('shows no data message when employees array is empty', async () => {
    element = await fixture(html`
      <employee-table-view .employees="${[]}"></employee-table-view>
    `);
    await element.updateComplete;
  
    const noDataMessage = element.shadowRoot.querySelector('.no-data-message');
    expect(noDataMessage).to.exist;
    expect(noDataMessage.textContent.trim()).to.equal(i18n.t('employee.noEmployees'));
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
});