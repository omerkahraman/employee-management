import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import '../layout/app-nav.js';

describe('AppNav', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<app-nav></app-nav>`);
  });

  it('initializes with correct language', () => {
    expect(document.documentElement.lang).to.equal('en');
  });

  it('renders logo and brand', () => {
    const logo = element.shadowRoot.querySelector('.brand img');
    const brand = element.shadowRoot.querySelector('.brand-text');
    expect(logo).to.exist;
    expect(brand.textContent).to.equal('ING');
  });

  it('toggles language', async () => {
    const langButton = element.shadowRoot.querySelector('.lang-switch');
    const initialLang = element.currentLanguage;
    
    langButton.click();
    await element.updateComplete;
    
    expect(element.currentLanguage).to.not.equal(initialLang);
    expect(document.documentElement.lang).to.equal(element.currentLanguage);
  });

  it('persists language preference', async () => {
    const langButton = element.shadowRoot.querySelector('.lang-switch');
    langButton.click();
    await element.updateComplete;
    
    const storedLang = localStorage.getItem('preferred-language');
    expect(storedLang).to.equal(element.currentLanguage);
  });

  it('handles navigation clicks', () => {
    const event = new MouseEvent('click');
    Object.defineProperty(event, 'currentTarget', {
      value: { getAttribute: () => '/' }
    });
    event.preventDefault = () => {};

    element._handleClick(event);
  });

  it('renders add new button', () => {
    const addNewButton = element.shadowRoot.querySelector('.add-new');
    expect(addNewButton).to.exist;
  });

  it('shows correct flag based on language', async () => {
    const flag = element.shadowRoot.querySelector('.flag');
    expect(flag.src).to.include('en-flag.png');

    element.currentLanguage = 'tr';
    await element.updateComplete;
    expect(element.shadowRoot.querySelector('.flag').src).to.include('tr-flag.png');
  });
});