const { Router } = window.VaadinRouter;

const routes = [
  {
    path: '/',
    component: 'employee-container'
  },
  {
    path: '/employees/new',
    component: 'employee-form'
  },
  {
    path: '/employees/:id/edit',
    component: 'employee-form'
  }
];

const outlet = document.querySelector('main');
const router = new Router(outlet);
router.setRoutes(routes);