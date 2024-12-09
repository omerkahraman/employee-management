const { LitElement, html, css } = window.lit;
const { Router } = window.VaadinRouter;
import { i18n } from '../../utils/i18n.js';
import '../confirmation-dialog.js';
import { EditIcon, DeleteIcon } from '../icons/icons.js';

export class EmployeeListView extends LitElement {
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
  
      .list-container {
        background: white;
        padding: 16px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 20px;
      }
  
      .list-item {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        transition: all 0.3s ease;
        overflow: hidden;
      }
  
      .list-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      }
  
      .employee-header {
        padding: 16px;
        border-bottom: 1px solid #f0f0f0;
      }
  
      .employee-name {
        font-size: 17px;
        font-weight: 500;
        color: #333;
        margin-bottom: 8px;
      }
  
      .employee-role {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
  
      .department-badge {
        background: #f5f5f5;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        color: #666;
      }
  
      .position-badge {
        background: #FFE4E0;
        color: #ff6200;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
      }
  
      .employee-details {
        padding: 16px;
      }
  
      .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px dashed #f0f0f0;
      }
  
      .detail-item:last-child {
        border-bottom: none;
      }
  
      .detail-label {
        font-size: 13px;
        color: #666;
      }
  
      .detail-value {
        font-size: 13px;
        color: #333;
        font-weight: 500;
      }
  
      .actions {
        display: flex;
        padding: 12px 16px;
        background: #f9f9f9;
        gap: 8px;
      }
  
      .action-button {
        flex: 1;
        background: none;
        border: 1px solid #ff6200;
        border-radius: 6px;
        cursor: pointer;
        color: #ff6200;
        padding: 8px;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        transition: all 0.2s;
      }
  
      .action-button:hover {
        background: #ff6200;
        color: white;
      }
  
      @media (max-width: 768px) {
        .list-container {
          grid-template-columns: 1fr;
          padding: 12px;
        }
  
        .list-item {
          margin-bottom: 16px;
        }
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
    return html`
      <div class="list-container">
        ${this.employees.map(employee => html`
          <div class="list-item">
            <div class="employee-header">
              <div class="employee-name">
                ${employee.firstName} ${employee.lastName}
              </div>
              <div class="employee-role">
                <span class="department-badge">${employee.department}</span>
                <span class="position-badge">${employee.position}</span>
              </div>
            </div>
            
            <div class="employee-details">
              <div class="detail-item">
                <span class="detail-label">${i18n.t('employee.email')}</span>
                <span class="detail-value">${employee.email}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">${i18n.t('employee.phone')}</span>
                <span class="detail-value">${employee.phone}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">${i18n.t('employee.dateOfEmployment')}</span>
                <span class="detail-value">${this.formatDate(employee?.dateOfEmployment)}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">${i18n.t('employee.dateOfBirth')}</span>
                <span class="detail-value">${this.formatDate(employee?.dateOfBirth)}</span>
              </div>
            </div>
  
            <div class="actions">
              <button 
                class="action-button" 
                @click="${() => this.editEmployee(employee)}"
                title="${i18n.t('employee.edit')}"
              >
                ${EditIcon} ${i18n.t('employee.edit')}
              </button>
              <button 
                class="action-button" 
                @click="${() => this.deleteEmployee(employee)}"
                title="${i18n.t('employee.delete')}"
              >
                ${DeleteIcon} ${i18n.t('employee.delete')}
              </button>
            </div>
          </div>
        `)}
      </div>
      <delete-confirmation-dialog
        ?open="${this.deleteDialogOpen}"
        employeeName="${this.employeeToDelete?.firstName} ${this.employeeToDelete?.lastName}"
        @cancel="${this._handleDeleteCancel}"
        @confirm="${this._handleDeleteConfirm}"
      ></delete-confirmation-dialog>
    `;
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
}

customElements.define('employee-list-view', EmployeeListView);