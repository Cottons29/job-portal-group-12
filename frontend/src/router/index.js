import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

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
      component: () => import('@/views/SecureAccount.vue'),
      meta: { title: 'Secure Your Account', requiresAuth: true },
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      redirect: '/onboarding/student',
      meta: { requiresAuth: true },
    },
    {
      path: '/onboarding/student',
      name: 'student-setup',
      component: () => import('@/view/StudentSetup.vue'),
      meta: { title: 'Student Profile Setup', requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/view/PlaceholderView.vue'),
      meta: { title: 'Dashboard', requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  // 1. If a user tries to access a protected route and is NOT authenticated
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/'
  }

  if (authStore.isAuthenticated) {
    // 2. If a user IS authenticated but needsEmailRecovery is true
    if (authStore.needsEmailRecovery) {
      if (to.path !== '/secure-account') {
        return '/secure-account'
      }
      return true
    }
    
    // Prevent navigating back to secure-account when not needed
    if (to.path === '/secure-account' && !authStore.needsEmailRecovery) {
      return '/onboarding'
    }

    // 3. If they have an email but needsOnboarding is true
    if (authStore.needsOnboarding) {
      // Must allow them into the onboarding flow, otherwise redirect
      if (!to.path.startsWith('/onboarding')) {
        return '/onboarding'
      }
      return true
    }
    
    // Prevent going back to onboarding if already complete
    if (to.path.startsWith('/onboarding') && !authStore.needsOnboarding) {
      return '/dashboard'
    }
    
    // Auto-redirect authenticated users away from root or auth pages
    if (to.path === '/' || to.path === '/auth') {
      return '/dashboard'
    }
  }

  return true
})

export default router
