const { LitElement, html, css } = window.lit;
import { i18n } from '../utils/i18n.js';

export class ConfirmationDialog extends LitElement {
  static get properties() {
    return {
      open: { type: Boolean },
      type: { type: String }, // delete or edit 
      employeeName: { type: String }
    };
  }

  static get styles() {
    return css`
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        /* padding: 16px; */
      }

      .overlay.show {
        opacity: 1;
        visibility: visible;
      }

      .dialog {
        background: white;
        border-radius: 8px;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-20px);
        transition: transform 0.3s ease;
      }

      .overlay.show .dialog {
        transform: translateY(0);
      }

      .dialog-header {
      padding: 16px 24px;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dialog-title {
      color: #ff6200;
      font-size: 20px;
      font-weight: 500;
      flex: 1;
      white-space: nowrap;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 20px;
      color: #666;
      cursor: pointer;
      padding: 4px;
      margin-left: auto; 
      min-width: 24px;
      display: flex;
      align-items: center;
      justify-content: end;
    }

      .dialog-content {
        padding: 24px;
        color: #333;
        font-size: 14px;
        line-height: 1.5;
      }

      .dialog-actions {
        padding: 16px 24px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      button {
        padding: 12px;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        border: none;
        width: 100%;
        transition: all 0.2s;
      }

      .proceed-button {
        background: #ff6200;
        color: white;
        transition: opacity 0.2s ease;
      }

      .proceed-button:hover {
        opacity: 0.85;
      }

      .cancel-button {
        background: white;
        color: #333;
        border: 1px solid #ddd;
      }

      .cancel-button:hover {
        background: #f5f5f5;
      }

      @media (max-width: 480px) {
        .overlay {
          padding: 12px;
        }

        .dialog-header {
          padding: 12px 16px;
        }

        .dialog-content {
          padding: 16px;
        }

        .dialog-actions {
          padding: 12px 16px;
        }

        .dialog-title {
          font-size: 18px;
        }

        button {
          padding: 10px;
          font-size: 13px;
        }
      }
    `;
  }

  render() {
    return html`
      <div class="overlay ${this.open ? 'show' : ''}" @click="${this._handleOverlayClick}">
        <div class="dialog" @click="${this._stopPropagation}">
          <div class="dialog-header">
            <div class="dialog-title">${this._getTitle()}</div>
            <button class="close-button" @click="${this._cancel}" 
                    aria-label="${i18n.t('dialog.close')}">✕</button>
          </div>
          <div class="dialog-content">
            ${this._getMessage()}
          </div>
          <div class="dialog-actions">
            <button class="proceed-button" @click="${this._confirm}">
              ${i18n.t('dialog.proceed')}
            </button>
            <button class="cancel-button" @click="${this._cancel}">
              ${i18n.t('dialog.cancel')}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  _getTitle() {
    const titles = {
      delete: i18n.t('dialog.deleteTitle'),
      save: i18n.t('dialog.saveTitle')
    };
    return titles[this.type] || '';
  }

  _getMessage() {
    const messages = {
      delete: i18n.t('dialog.deleteMessage', { employeeName: this.employeeName }),
      save: i18n.t('dialog.saveMessage', { employeeName: this.employeeName })
    };
    return messages[this.type] || '';
  }

  _handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      this._cancel();
    }
  }

  _stopPropagation(e) {
    e.stopPropagation();
  }

  _cancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
  }

  _confirm() {
    this.dispatchEvent(new CustomEvent('confirm'));
  }
}

customElements.define('confirmation-dialog', ConfirmationDialog);