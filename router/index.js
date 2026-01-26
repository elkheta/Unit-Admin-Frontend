import { createRouter, createWebHistory } from 'vue-router';

// Lazy-loaded pages for code splitting
const SignInPage = () => import('../pages/auth/SignInPage.vue');
const RegisterPage = () => import('../pages/auth/RegisterPage.vue');
const MainPage = () => import('../pages/MainPage.vue');
const UnitsPage = () => import('../pages/UnitsPage.vue');
const UnitSettingsPage = () => import('../pages/UnitSettingsPage.vue');
const UnitStudentListPage = () => import('../pages/UnitStudentListPage.vue');
const LabelsPage = () => import('../pages/LabelsPage.vue');

const routes = [
  {
    path: '/',
    redirect: '/signin'
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignInPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path: '/dashboard/main',
    name: 'Main',
    component: MainPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/units',
    name: 'UnitsList',
    component: UnitsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/units/:slug/students',
    name: 'UnitStudentList',
    component: UnitStudentListPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/units/:slug/settings',
    name: 'UnitSettings',
    component: UnitSettingsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/labels',
    name: 'Labels',
    component: LabelsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    redirect: '/dashboard/main'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

import { isAuthenticated } from '../utils/auth.js';

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const userIsAuthenticated = isAuthenticated();

  if (to.meta.requiresAuth && !userIsAuthenticated) {
    next('/signin');
  } else if ((to.path === '/signin' || to.path === '/register') && userIsAuthenticated) {
    next('/dashboard/main');
  } else if (to.path === '/dashboard' && userIsAuthenticated) {
    next('/dashboard/main');
  } else {
    next();
  }
});

export default router;
