const { LitElement, html, css } = window.lit;
const { Router } = window.VaadinRouter;
import { i18n } from '../utils/i18n.js'; 

export class AppNav extends LitElement {
  static get properties() {
    return {
      currentLanguage: { type: String },
      baseUrl: { type: String }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        background: #f5f5f5;
        padding: 12px 24px;
      }

      nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1900px;
        margin: 0 auto;
        background-color: #fff;
        padding: 5px 10px;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
      }

      .brand img {
        height: 20px;
      }

      .brand-text {
        color: #ff6200;
        font-weight: 600;
        font-size: 14px;
      }

      .nav-right {
        display: flex;
        align-items: center;
      }

      .employees-link {
        display: flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        color: #ff6200;
      }

      .employees-icon {
        width: 20px;
        height: 20px;
      }

      .employees-link span {
        font-size: 10px;
      }

      .add-new {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 8px 16px;
        background: #fff;
        color: #ff6200;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 10px;
        font-weight: 200;
      }

      .add-new:hover {
        opacity: 0.9;
      }

      .lang-switch {
        cursor: pointer;
        border: none;
        background: none;
        padding: 0;
      }

      .flag {
        width: 20px;
        height: 16px;
        border-radius: 2px;
      }
    `;
  }

  constructor() {
    super();
    this.baseUrl = window.location.origin;
    this.currentLanguage = localStorage.getItem('preferred-language') || 'en';
    document.documentElement.lang = this.currentLanguage ;
  }

  render() {
    return html`
      <nav>
        <a href="/" class="brand" @click="${this._handleClick}">
          <img src="./src/assets/ing-logo.png" alt="ING Logo">
          <span class="brand-text">ING</span>
        </a>

        <div class="nav-right">
          <a href="/" class="employees-link" @click="${this._handleClick}">
            <svg class="employees-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M16 17v2H2v-2s0-4 7-4 7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59 5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7z"/>
            </svg>
            <span>${i18n.t('nav.employees')}</span>
          </a>

          <div class="add-new" @click="${() => Router.go('/employees/new')}">
            + ${i18n.t('nav.addNew')}</span>
          </div>

          <button class="lang-switch" @click="${this._toggleLanguage}">
            ${this.currentLanguage === 'tr' 
              ? html`<img class="flag" src="${this.baseUrl}/src/assets/tr-flag.png" alt="Turkish">` 
              : html`<img class="flag" src="${this.baseUrl}/src/assets/en-flag.png" alt="English">`}
          </button>
        </div>
      </nav>
    `;
  }

  _handleClick(e) {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    Router.go(href);
  }

  _toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'tr' ? 'en' : 'tr';
    localStorage.setItem('preferred-language', this.currentLanguage);
    document.documentElement.lang = this.currentLanguage;
    
    window.dispatchEvent(new CustomEvent('language-changed', { 
      detail: { 
        language: this.currentLanguage,
        timestamp: Date.now()
      }
    }));

    const updateComponents = () => {
      const components = [
        'employee-container',
        'employee-table-view',
        'employee-list-view'
      ];
  
      components.forEach(selector => {
        const component = document.querySelector(selector);
        if (component) component.requestUpdate();
      });
    };

    this.requestUpdate();
    updateComponents();
  }
}

customElements.define('app-nav', AppNav);