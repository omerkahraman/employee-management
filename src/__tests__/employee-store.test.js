import { expect } from '@open-wc/testing';
import '../store/employee-store.js';
import { mockEmployeeData, mockMultipleEmployees } from './helpers/test-helpers.js';

describe('EmployeeStore', () => {
  let store;

  beforeEach(() => {
    localStorage.clear();
    store = new window.employeeStore.constructor();
  });

  it('initializes with default data when localStorage is empty', () => {
    expect(store.employees.length).to.be.greaterThan(0);
  });

  it('saves new employee', async () => {
    const newEmployee = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      dateOfEmployment: '2024-01-01',
      dateOfBirth: '1990-01-01',
      phone: '+(90) 555 123 45 67',
      department: 'Tech',
      position: 'Senior'
    };

    const savedEmployee = await store.saveEmployee(newEmployee);
    expect(savedEmployee.id).to.exist;
    expect(store.employees).to.deep.include(savedEmployee);
  });

  it('updates existing employee', async () => {
    const employee = {...mockEmployeeData};
    await store.saveEmployee(employee);
    
    const updatedData = { ...employee, firstName: 'Updated' };
    await store.saveEmployee(updatedData);
    
    const result = store.employees.find(e => e.id === employee.id);
    expect(result.firstName).to.equal('Updated');
  });

  it('validates required fields', async () => {
    const invalidEmployee = {
      firstName: 'Test'
    };

    try {
      await store.saveEmployee(invalidEmployee);
      throw new Error('Should have failed');
    } catch (error) {
      expect(error.message).to.include('required');
    }
  });

  it('validates email uniqueness', async () => {
    const employee1 = { ...mockEmployeeData };
    await store.saveEmployee(employee1);
  
    const employee2 = { ...mockEmployeeData, id: 'different-id' };
    
    try {
      await store.saveEmployee(employee2);
      throw new Error('Should have failed');
    } catch (error) {
      expect(error.message).to.equal('Email address is already in use');
    }
  });

  it('deletes employee', async () => {
    await store.saveEmployee(mockEmployeeData);
    await store.deleteEmployee(mockEmployeeData);
    expect(store.employees).to.not.deep.include(mockEmployeeData);
  });

  it('persists data to localStorage', async () => {
    await store.saveEmployee(mockEmployeeData);
    const storedData = JSON.parse(localStorage.getItem('employees'));
    expect(storedData).to.deep.include(mockEmployeeData);
  });

  it('loads data from localStorage', () => {
    const data = [mockEmployeeData];
    localStorage.setItem('employees', JSON.stringify(data));
    
    const newStore = new window.employeeStore.constructor();
    expect(newStore.employees).to.deep.equal(data);
  });

  it('searches employees', async () => {
    store.employees = mockMultipleEmployees;
    
    const results = await store.searchEmployees(mockEmployeeData.firstName);
    expect(results).to.deep.include(mockEmployeeData);
  });
});