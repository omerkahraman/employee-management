const { LitElement, html, css } = window.lit;
const { Router } = window.VaadinRouter;
import { i18n } from '../utils/i18n.js';
import './confirmation-dialog.js';
import { EmployeeStore } from "../store/employee-store.js";

export class EmployeeForm extends LitElement {
  static get properties() {
    return {
      employee: { type: Object },
      mode: { type: String },
      errors: { type: Array },
      dialogOpen: { type: Boolean }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 1rem;
      }

      .form-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 2rem;
        background: white;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .form-title {
        color: #ff6200;
        font-size: 24px;
        margin-bottom: 2rem;
        }

        .form-field {
        margin-bottom: 1.5rem;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            color: #444;
            font-size: 14px;
        }

        input, select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            color: #333;
        }

      input:focus, select:focus {
        outline: none;
        border-color: #ff6200;
        box-shadow: 0 0 0 2px rgba(255,75,38,0.15);
        }

        .error {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #dc3545;
            font-size: 13px;
            margin-top: 4px;
        }

        .error-icon {
        font-size: 16px;
        }

      .buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;
      }

      button {
        padding: 0.5rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      button.primary {
        background: #ff6200;
        color: white;
        }

        button.secondary {
        background: white;
        color: #ff6200;
        border: 1px solid #ff6200;
        }

      button:hover {
        opacity: 0.9;
      }

      @media (max-width: 768px) {
        .form-container {
          padding: 1rem;
          margin: 1rem;
        }

        .buttons {
            flex-direction: column-reverse; 
            gap: 0.5rem;
        }

        button {
          width: 100%;
        }

        .form-field {
         margin-bottom: 1rem;
        }
      }
    `;
  }

  constructor() {
    super();
    this.employee = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: 'Analytics',
      position: 'Junior'
    };
    this.mode = 'create';
    this.errors = [];
    this.store = window.employeeStore;
    this.dialogOpen = false;
    this.handleLanguageChange = () => {
      this.requestUpdate();
    };
    window.addEventListener('language-changed', this.handleLanguageChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('language-changed', this.handleLanguageChange);
  }
  

  render() {
    return html`
      <div class="form-container">
        <h2 class="form-title">
          ${this.mode === 'create' 
            ? i18n.t('employeeForm.createTitle') 
            : i18n.t('employeeForm.editTitle')}
        </h2>

        <div class="form-field">
          <label for="firstName">${i18n.t('employeeForm.firstName')}</label>
          <input 
            type="text" 
            id="firstName"
            .value="${this.employee.firstName}"
            @input="${this.updateField}"
            name="firstName"
          />
        </div>

        <div class="form-field">
          <label for="lastName">${i18n.t('employeeForm.lastName')}</label>
          <input 
            type="text" 
            id="lastName"
            .value="${this.employee.lastName}"
            @input="${this.updateField}"
            name="lastName"
          />
        </div>

        <div class="form-field">
          <label for="dateOfEmployment">${i18n.t('employeeForm.dateOfEmployment')}</label>
          <input 
            type="date" 
            id="dateOfEmployment"
            .value="${this.employee.dateOfEmployment}"
            @input="${this.updateField}"
            name="dateOfEmployment"
            min="${this.employee.dateOfBirth || ''}"
          />
        </div>

        <div class="form-field">
          <label for="dateOfBirth">${i18n.t('employeeForm.dateOfBirth')}</label>
          <input 
            type="date" 
            id="dateOfBirth"
            .value="${this.employee.dateOfBirth}"
            @input="${this.updateField}"
            name="dateOfBirth"
            max="${new Date().toISOString().split('T')[0]}"
          />
        </div>

        <div class="form-field">
          <label for="phone">${i18n.t('employeeForm.phone')}</label>
          <input 
            type="tel" 
            id="phone"
            .value="${this.employee.phone}"
            @input="${this.updateField}"
            name="phone"
            pattern="[0-9]{10,}"
          />
        </div>

        <div class="form-field">
          <label for="email">${i18n.t('employeeForm.email')}</label>
          <input 
            type="email" 
            id="email"
            .value="${this.employee.email}"
            @input="${this.updateField}"
            name="email"
          />
        </div>

        <div class="form-field">
          <label for="department">${i18n.t('employeeForm.department')}</label>
          <select 
            id="department"
            .value="${this.employee.department}"
            @change="${this.updateField}"
            name="department"
          >
            <option value="Analytics">${i18n.t('employeeForm.departments.analytics')}</option>
            <option value="Tech">${i18n.t('employeeForm.departments.tech')}</option>
          </select>
        </div>

        <div class="form-field">
          <label for="position">${i18n.t('employeeForm.position')}</label>
          <select 
            id="position"
            .value="${this.employee.position}"
            @change="${this.updateField}"
            name="position"
          >
            <option value="Junior">${i18n.t('employeeForm.positions.junior')}</option>
            <option value="Medior">${i18n.t('employeeForm.positions.medior')}</option>
            <option value="Senior">${i18n.t('employeeForm.positions.senior')}</option>
          </select>
        </div>

        ${this.errors.length > 0 ? html`
          <div class="errors">
            ${this.errors.map(error => html`
            <div class="error">
                <span class="error-icon">⚠️</span>
                ${error}
            </div>
            `)}
         </div>
        ` : ''}

        <div class="buttons">
          <button class="secondary" @click="${this.cancel}">
            ${i18n.t('employeeForm.cancel')}
          </button>
          <button class="primary" @click="${this.save}">
            ${i18n.t('employeeForm.save')}
          </button>
        </div>
      </div>
      <confirmation-dialog
        ?open="${this.dialogOpen}"
        type="save"
        employeeName="${this.employee?.firstName} ${this.employee?.lastName}"
        @cancel="${this._handleDialogCancel}"
        @confirm="${this._handleDialogConfirm}"
      ></confirmation-dialog>
    `;
  }

  updateField(e) {
    const { name, value } = e.target;
    this.employee = {
      ...this.employee,
      [name]: value
    };
  }

  validate() {
    const errors = [];
    const today = new Date();
    const birthDate = new Date(this.employee.dateOfBirth);
    const employmentDate = new Date(this.employee.dateOfEmployment);
    
    if (!this.employee.firstName) {
      errors.push(`${i18n.t('employeeForm.firstName')} ${i18n.t('validation.required')}`);
    }
    if (!this.employee.lastName) {
      errors.push(`${i18n.t('employeeForm.lastName')} ${i18n.t('validation.required')}`);
    }
    if (!this.employee.email) {
      errors.push(`${i18n.t('employeeForm.email')} ${i18n.t('validation.required')}`);
    }
    if (!this.employee.dateOfEmployment) {
      errors.push(`${i18n.t('employeeForm.dateOfEmployment')} ${i18n.t('validation.required')}`);
    }
    if (!this.employee.dateOfBirth) {
      errors.push(`${i18n.t('employeeForm.dateOfBirth')} ${i18n.t('validation.required')}`);
    }

    // date controls
    if (birthDate > today) {
      errors.push(i18n.t('validation.invalidBirthDate'));
    }

    if (employmentDate < birthDate) {
      errors.push(i18n.t('validation.invalidEmploymentDate'));
    }

    const birthYear = birthDate.getFullYear();
    const employmentYear = employmentDate.getFullYear();

    if (birthYear.toString().length > 4 || employmentYear.toString().length > 4) {
      errors.push(i18n.t('validation.invalidYearLength'));
    }

    // Format controls
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.employee.email && !emailRegex.test(this.employee.email)) {
      errors.push(i18n.t('validation.invalidEmail'));
    }
    
    const phoneRegex = /^[0-9]{10,}$/;
    if (this.employee.phone && !phoneRegex.test(this.employee.phone)) {
      errors.push(i18n.t('validation.invalidPhone'));
    }
  
    this.errors = errors;
    return errors.length === 0;
  }

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  async save() {
    if (!this.validate()) return;
   
    if (this.mode === 'edit') {
      this.dialogOpen = true;
    } else {
      await this._saveToDB(); 
    }
   }

   _handleDialogCancel() {
    this.dialogOpen = false;
   }

   async _handleDialogConfirm() {
    await this._saveToDB();
    this.dialogOpen = false;
   }

   async _saveToDB() {
    try {
      await this.store.saveEmployee(this.employee);
      Router.go('/');
    } catch (error) {
      this.errors = [error.message];
    }
   }
  
  cancel() {
    Router.go('/'); 
  }

  async connectedCallback() {
    super.connectedCallback();
    
    const location = window.location.pathname;
    const matches = location.match(/\/employees\/(.+)\/edit/);
    
    if (matches && matches[1]) {
      const employeeId = matches[1];
      this.mode = 'edit';
      
      try {
        const employeeData = await this.store.getEmployeeById(employeeId);
        if (employeeData) {
          this.employee = {
            ...employeeData,
            id: employeeId
          };
        } else {
          console.error('Employee not found');
          Router.go('/'); 
        }
      } catch (error) {
        console.error('Error loading employee:', error);
        this.errors = [error.message];
      }
    } else {
      this.mode = 'create';
      this.employee = {
        firstName: '',
        lastName: '',
        dateOfEmployment: '',
        dateOfBirth: '',
        phone: '',
        email: '',
        department: 'Analytics',
        position: 'Junior'
      };
    }
  }
}

customElements.define('employee-form', EmployeeForm);