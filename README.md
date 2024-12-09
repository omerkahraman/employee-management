# Employee Management System

A web application that enables HR personnel to manage company employee information.

## Features

- View employee list (table and list view)
- Add new employee
- Edit existing employee information 
- Delete employee
- Search and filtering
- Pagination
- Multi-language support (TR/EN)
- Responsive design

## Technologies

- LitElement JavaScript
- Vaadin Router
- Web Components
- Custom Event Handling
- LocalStorage
- Shadow DOM
- ES6+ JavaScript

## Installation

To run the project locally:

1.Clone the project
```bash
git clone https://github.com/omerkahraman/employee-management

2.Go to project directory
cd employee-management

3.Install dependencies
npm install

4.Start the application
npm start

Structure
src/
├── components/
│   ├── views/
│   │   ├── employee-table-view.js
│   │   └── employee-list-view.js
│   ├── confirmation-dialog.js
│   └── employee-form.js
├── store/
│   └── employee-store.js
├── utils/
│   └── i18n.js
└── layout/
    └── app-nav.js


Feature Details

Employee Management

  - Add, edit, delete employees
  - Detailed form validations
  - Action confirmation dialogs

List View

  - Switch between table and card view
  - Optimized design for each view
  - Responsive behavior

Search and Filtering

  - Real-time search by name, email and department
  - Paginated results
  - Optimized number of records per page

Multi-language Support

  - Turkish and English language support
  - Instant language switching
  - Localization for all text


Testing
To run tests:
npm run test

To view test coverage report:
npm run test:coverage

Notes
  - Data is stored in browser using LocalStorage (Default data are listed when the project is first opened.)
  - Responsive design supports mobile and tablet views
  - Minimum supported browser versions can be added