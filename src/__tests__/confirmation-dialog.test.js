import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import '../components/confirmation-dialog.js';
import { i18n } from '../utils/i18n.js';

describe('ConfirmationDialog', () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`
      <confirmation-dialog
        .open="${false}"
        .type="${'delete'}"
        .employeeName="${'John Doe'}">
      </confirmation-dialog>
    `);
  });

  it('initializes correctly', () => {
    expect(element).to.exist;
    expect(element.employeeName).to.equal('John Doe');
    expect(element.type).to.equal('delete');
  });

  it('renders when open is true', async () => {
    expect(element.shadowRoot.querySelector('.overlay').classList.contains('show')).to.be.false;
    
    element.setAttribute('open', '');
    await element.updateComplete;
    
    expect(element.shadowRoot.querySelector('.overlay').classList.contains('show')).to.be.true;
  });

  it('displays correct message based on type', async () => {
    // Test delete message
    element.setAttribute('open', '');
    await element.updateComplete;
    let content = element.shadowRoot.querySelector('.dialog-content');
    expect(content.textContent).to.include('John Doe');
    
    // Test save message
    element.type = 'save';
    await element.updateComplete;
    content = element.shadowRoot.querySelector('.dialog-content');
    expect(content.textContent).to.include('John Doe');
  });

  it('emits cancel event when cancel button clicked', async () => {
    let cancelCalled = false;
    element.addEventListener('cancel', () => {
      cancelCalled = true;
    });

    element.setAttribute('open', '');
    await element.updateComplete;

    const cancelButton = element.shadowRoot.querySelector('.cancel-button');
    cancelButton.click();

    expect(cancelCalled).to.be.true;
  });

  it('emits confirm event when confirm button clicked', async () => {
    let confirmCalled = false;
    element.addEventListener('confirm', () => {
      confirmCalled = true;
    });

    element.setAttribute('open', '');
    await element.updateComplete;

    const confirmButton = element.shadowRoot.querySelector('.proceed-button');
    confirmButton.click();

    expect(confirmCalled).to.be.true;
  });

  it('shows correct title based on type', async () => {
    element.setAttribute('open', '');
    await element.updateComplete;

    // Test delete title
    let title = element.shadowRoot.querySelector('.dialog-title');
    expect(title.textContent).to.equal(i18n.t('dialog.deleteTitle'));

    // Test save title
    element.type = 'save';
    await element.updateComplete;
    title = element.shadowRoot.querySelector('.dialog-title');
    expect(title.textContent).to.equal(i18n.t('dialog.saveTitle'));
  });

  it('shows correct button text', async () => {
    element.setAttribute('open', '');
    await element.updateComplete;

    const proceedButton = element.shadowRoot.querySelector('.proceed-button');
    const cancelButton = element.shadowRoot.querySelector('.cancel-button');

    expect(proceedButton.textContent.trim()).to.equal(i18n.t('dialog.proceed'));
    expect(cancelButton.textContent.trim()).to.equal(i18n.t('dialog.cancel'));
  });

  it('handles accessibility attributes correctly', async () => {
    element.setAttribute('open', '');
    await element.updateComplete;

    const closeButton = element.shadowRoot.querySelector('.close-button');
    expect(closeButton.getAttribute('aria-label')).to.equal(i18n.t('dialog.close'));
  });
});