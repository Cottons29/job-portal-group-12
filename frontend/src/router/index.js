import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/auth',
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/view/AuthView.vue'),
    },
    {
      path: '/secure-account',
      name: 'secure-account',
      component: () => import('@/view/PlaceholderView.vue'),
      meta: { title: 'Secure Your Account' },
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/view/PlaceholderView.vue'),
      meta: { title: 'Complete Your Profile' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/view/PlaceholderView.vue'),
      meta: { title: 'Dashboard' },
    },
  ],
})

export default router
