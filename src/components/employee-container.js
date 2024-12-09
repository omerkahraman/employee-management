const { LitElement, html, css } = window.lit;
const { Router } = window.VaadinRouter;  
import { i18n } from '../utils/i18n.js';
import { EmployeeStore } from '../store/employee-store.js';

import './views/employee-table-view.js';
import './views/employee-list-view.js';
import './employee-form.js';

export class EmployeeContainer extends LitElement {
    static get properties() {
      return {
        employees: { type: Array },
        viewMode: { type: String, reflect: true },
        searchTerm: { type: String },
        currentPage: { type: Number },
        totalPages: { type: Number },
        //showEmployeeForm: { type: Boolean },
        //employeeToEdit: { type: Object },
        employeeStore: { type: Object },
      };
    }

    static get styles() {
        return css`
          :host {
            display: block;
            background-color: #f5f5f5;
          }
      
          .container {
            max-width: 1800px;
            margin: 0 auto;
          }
      
          .top-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
          }
      
          .title {
            color: #ff6200;
            font-size: 16px;
            font-weight: normal;
          }
      
          .controls {
            display: flex;
            align-items: center;
            gap: 24px;
          }
      
          .search-box {
            position: relative;
          }
      
          .search-input {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 300px;
            font-size: 14px;
            transition: all 0.2s ease;
          }
      
          .search-input:focus {
            outline: none;
            border-color: #ff6200;
            box-shadow: 0 0 0 2px rgba(255, 75, 38, 0.1);
          }
      
          .view-controls {
            display: flex;
            gap: 8px;
          }
      
          .view-button {
            background: none;
            border: none;
            padding: 8px;
            cursor: pointer;
            color: #666;
            display: flex;
            align-items: center;
          }
      
          .view-button.active {
            color: #ff6200;
          }
      
          .view-button:hover {
            color: #ff6200;
          }
      
          @media (max-width: 768px) {
            .top-section {
              flex-direction: column;
              align-items: flex-start;
              gap: 16px;
            }
      
            .controls {
              width: 100%;
              flex-direction: column;
              align-items: flex-start;
            }
      
            .search-box {
              width: 100%;
            }
      
            .search-input {
              width: 100%;
            }
      
            .view-controls {
              width: 100%;
              justify-content: flex-end;
            }
          }

          .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 16px;
            gap: 8px;
          }

          .pagination-button {
            min-width: 32px;
            height: 32px;
            border: none;
            background: none;
            color: #666;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: all 0.2s;
          }

          .pagination-button:hover {
            color: #ff6200;
          }

          .pagination-button.active {
            background: #ff6200;
            color: white;
            border-radius: 50%;
          }

          .pagination-button:disabled {
            cursor: not-allowed;
            opacity: 0.5;
          }

          .pagination-arrow {
            color: #ff6200;
          }

          .pagination-dots {
            color: #666;
            margin: 0 4px;
          }

          @media (max-width: 768px) {
            .pagination {
              padding: 12px;
              flex-wrap: wrap;
            }
          }
        `;
      }

      constructor() {
        super();
        this.employees = [];
        this.viewMode = 'table';
        this.searchTerm = '';
        this.currentPage = 1;
        this.totalPages = 1;
        this.employeeStore = window.employeeStore; 
      }

      connectedCallback() {
        super.connectedCallback();
        this.loadEmployees();
      }
    
      async loadEmployees() {
        try {
          this.employees = await this.employeeStore.getEmployees();
          console.log('Loaded employees:', this.employees); 
        } catch (error) {
          console.error('Error loading employees:', error);
        }
    }

    render() {
        return html`
          <div class="container">
            <div class="top-section">
          <div class="title">${i18n.t('employeeList.title')}</div>
        
          <div class="controls">
            <div class="search-box">
              <input
                type="text"
                class="search-input"
                placeholder="${i18n.t('employeeList.search')}"
                .value="${this.searchTerm}"
                @input="${this.handleSearch}"
              />
            </div>

            <div class="view-controls">
              <button 
                class="view-button ${this.viewMode === 'list' ? 'active' : ''}"
                @click="${() => this.switchViewMode('list')}"
                title="${i18n.t('employeeList.switchToList')}"
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
                </svg>
              </button>
              <button 
                class="view-button ${this.viewMode === 'table' ? 'active' : ''}"
                @click="${() => this.switchViewMode('table')}"
                title="${i18n.t('employeeList.switchToTable')}"
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M4 4h16v16H4V4zm2 4v3h5V8H6zm7 0v3h5V8h-5zm5 5h-5v3h5v-3zm-7 0H6v3h5v-3z"/>
                </svg>
              </button>
            </div>
          </div>
      </div>
  
            ${this.viewMode === 'table'
              ? html`<employee-table-view 
                  .employees="${this.filteredEmployees}"
                  @edit-employee="${this.editEmployee}"
                  @delete-employee="${this.deleteEmployee}"
                ></employee-table-view>`
              : html`<employee-list-view
                  .employees="${this.filteredEmployees}"
                  @edit-employee="${this.editEmployee}"
                  @delete-employee="${this.deleteEmployee}"
                ></employee-list-view>`
            }
  
            ${this.renderPagination()}
          </div>
        `;
      }

      renderPagination() {
        const itemsPerPage = this.viewMode === 'table' ? 12 : 8;
        const totalPages = Math.ceil(this.employees.length / itemsPerPage); 
        let pages = [];
      
       
        pages.push(html`
          <button 
            class="pagination-button pagination-arrow" 
            ?disabled="${this.currentPage === 1}"
            @click="${() => this.navigatePage(this.currentPage - 1)}"
          >
            ‹
          </button>
        `);
      
      
        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
      
        if (startPage > 1) {
          pages.push(html`
            <button class="pagination-button" @click="${() => this.navigatePage(1)}">1</button>
            ${startPage > 2 ? html`<span class="pagination-dots">...</span>` : ''}
          `);
        }
      
        for (let i = startPage; i <= endPage; i++) {
          pages.push(html`
            <button 
              class="pagination-button ${i === this.currentPage ? 'active' : ''}"
              @click="${() => this.navigatePage(i)}"
            >
              ${i}
            </button>
          `);
        }
      
        if (endPage < totalPages) {
          pages.push(html`
            ${endPage < totalPages - 1 ? html`<span class="pagination-dots">...</span>` : ''}
            <button 
              class="pagination-button"
              @click="${() => this.navigatePage(totalPages)}"
            >
              ${totalPages}
            </button>
          `);
        }
      
        
        pages.push(html`
          <button 
            class="pagination-button pagination-arrow" 
            ?disabled="${this.currentPage === totalPages}"
            @click="${() => this.navigatePage(this.currentPage + 1)}"
          >
            ›
          </button>
        `);
      
        return html`<div class="pagination">${pages}</div>`;
      }

      _renderListView() {
        return html`
          <div class="list-view">
            ${this.filteredEmployees.map(employee => html`
              <div class="list-item">
                <div class="checkbox-cell">
                  <input type="checkbox">
                </div>
                <div class="employee-info">
                  <div>${employee.firstName} ${employee.lastName}</div>
                  <div>${employee.department}</div>
                  <div>${employee.position}</div>
                  <div>${employee.email}</div>
                  <div>${employee.phone}</div>
                  <div>${employee.dateOfEmployment}</div>
                </div>
                <div class="actions">
                  <button @click="${() => this.editEmployee(employee)}">Edit</button>
                  <button @click="${() => this.deleteEmployee(employee)}">Delete</button>
                </div>
              </div>
            `)}
          </div>
        `;
      }

      get filteredEmployees() {
        let filtered = [...this.employees];
        
        if (this.searchTerm) {
          const searchLower = this.searchTerm.toLowerCase();
          filtered = filtered.filter(employee => {
            const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
            return fullName.includes(searchLower) ||
                   employee.email.toLowerCase().includes(searchLower) ||
                   employee.department.toLowerCase().includes(searchLower);
          });
        }
        
        const itemsPerPage = this.viewMode === 'table' ? 12 : 8;

        this.totalPages = Math.ceil(filtered.length / itemsPerPage); 
        const startIndex = (this.currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        return filtered.slice(startIndex, endIndex);
      }
  
      switchViewMode(mode) {
        this.viewMode = mode;
        this.currentPage = 1;
      }
  
      handleSearch(event) {
        this.searchTerm = event.target.value;
        this.currentPage = 1;
      }
  
      navigatePage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
        }
      }
  
      editEmployee(e) {
        const employee = e.detail;
        Router.go(`/employees/${employee.id}/edit`);
      }
  
      async deleteEmployee(e) {
        const employee = e.detail;
        await this.employeeStore.deleteEmployee(employee);
        this.loadEmployees();
      }
 
}

customElements.define('employee-container', EmployeeContainer);