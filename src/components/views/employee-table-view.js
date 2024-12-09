const { LitElement, html, css } = window.lit;
const { Router } = window.VaadinRouter;
import { i18n } from '../../utils/i18n.js';
import '../confirmation-dialog.js';
import { EditIcon, DeleteIcon } from '../icons/icons.js';

export class EmployeeTableView extends LitElement {
  static get properties() {
    return {
      employees: { type: Array },
      deleteDialogOpen: { type: Boolean },
      employeeToDelete: { type: Object }
    };
  }

  constructor() {
    super();
    this.deleteDialogOpen = false;
    this.employeeToDelete = null;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .table-container {
        width: 100%;
        overflow-x: auto;
        background: white;
        max-width: 1800px;
        margin: 0 auto;
        -webkit-overflow-scrolling: touch; 
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #f5f5f5;
      }

      th {
        color: #ff6200;
        font-weight: normal;
        font-size: 14px;
      }

      td {
        font-size: 14px;
        color: #444;
      }

      tr:hover {
        background-color: #f9f9f9;
      }

      .checkbox-cell {
        width: 40px;
        text-align: center;
      }

      input[type="checkbox"] {
        width: 14px;
        height: 14px;
        cursor: pointer;
        margin: 0;
        accent-color: #ff6200;
      }

      input[type="checkbox"]:hover {
        opacity: 0.8;
      }

      .actions {
      display: flex;
      gap: 8px;
    }

    .action-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
    }

    .action-button:hover {
      transform: scale(1.1);
    }

    @media (min-width: 1024px) {
      table {
        min-width: 100%;
      }
    }

     @media (max-width: 1023px) {
      table {
        min-width: 900px; 
      }

      th, td {
        padding: 10px;
        font-size: 13px;
      }
    }

    @media (max-width: 768px) {
      .table-container {
        margin: 0 -16px; 
      }

      table {
        min-width: 750px;
      }

      th, td {
        padding: 8px;
        font-size: 12px;
      }

      .actions {
        gap: 4px;
      }

      .action-button {
        padding: 3px;
      }

      input[type="checkbox"] {
        width: 14px;
        height: 14px;
      }
    }

    .table-container::-webkit-scrollbar {
      height: 6px;
    }

    .table-container::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .table-container::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 3px;
    }

    .table-container::-webkit-scrollbar-thumb:hover {
      background: #ccc;
    }

    `;
  }

  formatDate(date) {
    if (!date) return '-'; 
    try {
      return new Date(date).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return '-'; 
    }
  }
  
  
  render() {
    if (!Array.isArray(this.employees) || this.employees.length === 0) {
      return html`<div class="no-data-message">${i18n.t('employee.noEmployees')}</div>`;
    }

    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th class="checkbox-cell">
                <input 
                  type="checkbox" 
                  @change="${this._handleSelectAll}"
                  aria-label="${i18n.t('employeeList.selectAll')}"
                >
              </th>
              <th>${i18n.t('employee.firstName')}</th>
              <th>${i18n.t('employee.lastName')}</th>
              <th>${i18n.t('employee.dateOfEmployment')}</th>
              <th>${i18n.t('employee.dateOfBirth')}</th>
              <th>${i18n.t('employee.phone')}</th>
              <th>${i18n.t('employee.email')}</th>
              <th>${i18n.t('employee.department')}</th>
              <th>${i18n.t('employee.position')}</th>
              <th>${i18n.t('employee.actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${this.employees.map(employee => html`
              <tr>
                <td class="checkbox-cell">
                  <input 
                    type="checkbox" 
                    .value="${employee?.id || ''}"
                    @change="${(e) => this._handleIndividualCheckbox(e, employee.id)}"
                    aria-label="Select employee"
                  >
                </td>
                <td>${employee?.firstName || ''}</td>
                <td>${employee?.lastName || ''}</td>
                <td>${this.formatDate(employee?.dateOfEmployment)}</td>
                <td>${this.formatDate(employee?.dateOfBirth)}</td>
                <td>${employee?.phone || ''}</td>
                <td>${employee?.email || ''}</td>
                <td>${employee?.department || ''}</td>
                <td>${employee?.position || ''}</td>
                <td>
                  <div class="actions">
                    <button 
                      class="action-button" 
                      @click="${() => this.editEmployee(employee)}"
                      title="${i18n.t('employeeList.edit')}"
                    >
                      ${EditIcon}
                    </button>
                    <button 
                      class="action-button" 
                      @click="${() => this.deleteEmployee(employee)}"
                      title="${i18n.t('employeeList.delete')}"
                    >
                      ${DeleteIcon}
                    </button>
                  </div>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>
      <confirmation-dialog
        ?open="${this.deleteDialogOpen}"
        type="delete"
        employeeName="${this.employeeToDelete?.firstName} ${this.employeeToDelete?.lastName}"
        @cancel="${this._handleDeleteCancel}"
        @confirm="${this._handleDeleteConfirm}"
      ></confirmation-dialog>

    `;
  }


  _formatDate(dateString) {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  }

  editEmployee(employee) {
    this.dispatchEvent(new CustomEvent('edit-employee', {
      detail: employee,
      bubbles: true,
      composed: true
    }));
  }

  deleteEmployee(employee) {
    this.employeeToDelete = employee;
    this.deleteDialogOpen = true;
  }

  _handleDeleteCancel() {
    this.deleteDialogOpen = false;
    this.employeeToDelete = null;
  }

  _handleDeleteConfirm() {
    this.dispatchEvent(new CustomEvent('delete-employee', {
      detail: this.employeeToDelete,
      bubbles: true,
      composed: true
    }));
    this.deleteDialogOpen = false;
    this.employeeToDelete = null;
  }

  _handleSelectAll(e) {
    const checkboxes = this.shadowRoot?.querySelectorAll('tbody input[type="checkbox"]');
    if (!checkboxes) return;
    // const headerCheckbox = this.shadowRoot.querySelector('thead input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      if(checkbox){
        checkbox.checked = e.target.checked
      }
    });
  
    if (!this._selectedEmployees) {
      this._selectedEmployees = new Set();
    }
  
    if (e.target.checked) {
      this.employees.forEach(emp => this._selectedEmployees.add(emp.id));
    } else {
      this._selectedEmployees.clear();
    }
  }

  _handleIndividualCheckbox(e, employeeId) {
    if (!this._selectedEmployees) {
      this._selectedEmployees = new Set();
    }
  
    const headerCheckbox = this.shadowRoot.querySelector('thead input[type="checkbox"]');
    const allCheckboxes = this.shadowRoot.querySelectorAll('tbody input[type="checkbox"]');
  
    if (e.target.checked) {
      this._selectedEmployees.add(employeeId);
    } else {
      this._selectedEmployees.delete(employeeId);
    }
  
    headerCheckbox.checked = Array.from(allCheckboxes).every(cb => cb.checked);
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('employees')) {
      requestAnimationFrame(() => {
        const checkboxes = this.shadowRoot.querySelectorAll('tbody input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
          const employeeId = checkbox.value;
          checkbox.checked = this._selectedEmployees?.has(employeeId) || false;
        });
        
        const headerCheckbox = this.shadowRoot.querySelector('thead input[type="checkbox"]');
        headerCheckbox.checked = checkboxes.length > 0 && 
          Array.from(checkboxes).every(cb => cb.checked);
      });
    }
  }
}

customElements.define('employee-table-view', EmployeeTableView);