
const createMockFunction = () => {
  const fn = (...args) => {
    fn.calls.push(args);
    return fn.returnValue;
  };
  fn.calls = [];
  fn.mockReturnValue = (value) => {
    fn.returnValue = value;
    return fn;
  };
  fn.mockClear = () => {
    fn.calls = [];
  };
  return fn;
};

export const expect = (actual) => ({
  to: {
    equal: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${actual} to equal ${expected}`);
      }
    },
    be: {
      true: () => {
        if (actual !== true) {
          throw new Error(`Expected ${actual} to be true`);
        }
      },
      false: () => {
        if (actual !== false) {
          throw new Error(`Expected ${actual} to be false`);
        }
      }
    },
    contain: (expected) => {
      if (!actual.includes(expected)) {
        throw new Error(`Expected ${actual} to contain ${expected}`);
      }
    }
  }
});

export const mockEmployeeData = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  dateOfEmployment: '2023-01-15',
  dateOfBirth: '1990-05-20',
  phone: '+(90) 532 123 45 67',
  email: 'john@company.com',
  department: 'Analytics',
  position: 'Senior'
};

export const mockMultipleEmployees = [
  mockEmployeeData,
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfEmployment: '2023-02-01',
    dateOfBirth: '1992-08-15',
    phone: '+(90) 533 234 56 78',
    email: 'jane@company.com',
    department: 'Tech',
    position: 'Medior'
  }
];

export const createTestElement = async (elementTag) => {
  const element = document.createElement(elementTag);
  document.body.appendChild(element);
  await element.updateComplete;
  return element;
};

export const cleanupTestElement = (element) => {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
};

export const mockLocalStorage = {
  store: {},
  clear() {
    this.store = {};
  },
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  removeItem(key) {
    delete this.store[key];
  }
};

export const mockRouter = {
  go: createMockFunction()
};

export const createInputEvent = (value) => {
  return {
    target: { value },
    preventDefault: () => {}
  };
};