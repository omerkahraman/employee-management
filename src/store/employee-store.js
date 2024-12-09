import { initialEmployees } from "../data/initial-employees";

export class EmployeeStore {
  constructor() {
    const existingData = localStorage.getItem('employees');
    
    this.employees = existingData
      ? JSON.parse(existingData)
      : initialEmployees;

    if (!existingData) {
      this.persistToStorage();
    } 
  }

  /**
   * Retrieve all employees
   * @returns {Promise<Array>} List of employees
   */
  async getEmployees() {
    return this.employees;
  }

  /**
   * Get employee by ID
   * @param {string} id - Employee ID
   * @returns {Object|null} Employee data or null if not found
   */
  async getEmployeeById(id) {
    return this.employees.find(e => e.id === id) || null;
  }

  /**
   * Save or update an employee
   * @param {Object} employee - Employee data to save
   * @returns {Promise<Object>} Saved employee data
   */
  async saveEmployee(employee) {
    if (!this.validateEmployee(employee)) {
      throw new Error('Please fill in all required fields');
    }

    if (this.isEmailTaken(employee)) {
      throw new Error('Email address is already in use');
    }

    if (!employee.id) {
      // Create new employee
      employee.id = Date.now().toString();
      this.employees = [...this.employees, employee];
    } else {
      // Update existing employee
      const index = this.employees.findIndex(e => e.id === employee.id);
      if (index !== -1) {
        this.employees = [
          ...this.employees.slice(0, index),
          employee,
          ...this.employees.slice(index + 1),
        ];
      }
    }
    
    this.persistToStorage();
    return employee;
  }

  /**
   * Delete an employee
   * @param {Object} employee - Employee to delete
   * @returns {Promise<void>}
   */
  async deleteEmployee(employee) {
    this.employees = this.employees.filter(e => e.id !== employee.id);
    this.persistToStorage();
  }
  
  /**
   * Search employees
   * @param {string} query - Search query
   * @returns {Promise<Array>} Filtered employees
   */
  async searchEmployees(query) {
    const searchLower = query.toLowerCase();
    return this.employees.filter(employee => {
      const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      return fullName.includes(searchLower) ||
             employee.email.toLowerCase().includes(searchLower) ||
             employee.department.toLowerCase().includes(searchLower);
    });
  }

  /**
   * Validate employee data
   * @private
   */
  validateEmployee(employee) {
    const requiredFields = [
      'firstName',
      'lastName',
      'dateOfEmployment',
      'dateOfBirth',
      'phone',
      'email',
      'department',
      'position'
    ];

    return requiredFields.every(field => employee[field]);
  }

  /**
   * Check if email is already used by another employee
   * @private
   */
  isEmailTaken(employee) {
    return this.employees.some(e => 
      e.email === employee.email && e.id !== employee.id
    );
  }

  /**
   * Save to localStorage
   * @private
   */
  persistToStorage() {
    try {
      localStorage.setItem('employees', JSON.stringify(this.employees));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      throw new Error('Failed to save data');
    }
  }
}

window.employeeStore = new EmployeeStore();