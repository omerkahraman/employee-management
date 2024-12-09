
import './store/employee-store.js';
import './utils/i18n.js';
import './components/views/employee-table-view.js';
import './components/views/employee-list-view.js';
import './components/employee-form.js';
import './components/employee-container.js';
import './layout/app-nav.js';
import './router.js';

// Default lang
const defaultLang = localStorage.getItem('preferred-language') || 'en';
document.documentElement.lang = defaultLang;