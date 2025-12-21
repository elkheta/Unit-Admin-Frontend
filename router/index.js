import { createRouter, createWebHistory } from 'vue-router';
import SignInPage from '../pages/auth/SignInPage.vue';
import RegisterPage from '../pages/auth/RegisterPage.vue';
import MainPage from '../pages/MainPage.vue';
import UnitsListPage from '../pages/UnitsListPage.vue';
import LabelsPage from '../pages/LabelsPage.vue';

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
    component: UnitsListPage,
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

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/signin');
  } else if ((to.path === '/signin' || to.path === '/register') && isAuthenticated) {
    next('/dashboard/main');
  } else if (to.path === '/dashboard' && isAuthenticated) {
    next('/dashboard/main');
  } else {
    next();
  }
});

export default router;
