import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import '../components/employee-container.js';
import { mockEmployeeData, mockMultipleEmployees } from './helpers/test-helpers.js';

describe('EmployeeContainer', () => {
  let element;

  beforeEach(async () => {
    window.employeeStore = {
      getEmployees: async () => mockMultipleEmployees,
      deleteEmployee: async () => true
    };

    element = await fixture(html`<employee-container></employee-container>`);
  });

  it('loads employees on initialization', async () => {
    expect(element.employees).to.deep.equal(mockMultipleEmployees);
  });

  it('switches view mode correctly', async () => {
    expect(element.viewMode).to.equal('table');
    
    element.switchViewMode('list');
    await element.updateComplete;
    expect(element.viewMode).to.equal('list');
  });

  it('handles search correctly', async () => {
    const searchInput = element.shadowRoot.querySelector('.search-input');
    searchInput.value = 'John';
    searchInput.dispatchEvent(new Event('input'));
    
    expect(element.searchTerm).to.equal('John');
    expect(element.currentPage).to.equal(1);
  });

  it('filters employees based on search term', async () => {
    element.searchTerm = 'John';
    await element.updateComplete;

    const filtered = element.filteredEmployees;
    expect(filtered.length).to.be.lessThanOrEqual(mockMultipleEmployees.length);
  });

  it('handles pagination navigation', async () => {
    element.employees = Array(20).fill(mockEmployeeData);
    await element.updateComplete;
  
    element.navigatePage(2);
    await element.updateComplete;
    expect(element.currentPage).to.equal(2);
  
    element.navigatePage(1);
    await element.updateComplete;
    expect(element.currentPage).to.equal(1);
  });

  it('calculates total pages correctly', async () => {
    element.employees = Array(20).fill(mockEmployeeData);
    await element.updateComplete;
    
    expect(Math.ceil(element.employees.length / 12)).to.equal(element.totalPages);
  });

  it('renders different views based on viewMode', async () => {
    expect(element.shadowRoot.querySelector('employee-table-view')).to.exist;
    
    element.viewMode = 'list';
    await element.updateComplete;
    expect(element.shadowRoot.querySelector('employee-list-view')).to.exist;
  });
});