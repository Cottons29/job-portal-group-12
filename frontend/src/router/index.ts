import {createRouter, createWebHistory} from 'vue-router'
import type {RouteRecordRaw} from 'vue-router'
import {useAuthStore} from '@/stores/auth'

declare module 'vue-router' {
    interface RouteMeta {
        title?: string
        public?: boolean
        requiresAuth?: boolean
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'welcome',
        component: () => import('@/views/LandingPage.vue'),
    },
    {
        path: '/auth',
        name: 'auth',
        component: () => import('@/views/AuthView.vue'),
    },
    {
        path: '/about-us',
        name: 'about-us',
        component: () => import('@/views/AboutUs.vue'),
        meta: {title: 'About Us', public: true},
    },
    {
        path: '/privacy-policy',
        name: 'privacy-policy',
        component: () => import('@/views/PrivacyPolicy.vue'),
        meta: {title: 'Privacy Policy', public: true},
    },
    {
        path: '/terms-of-service',
        name: 'terms-of-service',
        component: () => import('@/views/TermsOfService.vue'),
        meta: {title: 'Terms of Service', public: true},
    },
    {
        path: '/contact',
        name: 'contact',
        component: () => import('@/views/Contact.vue'),
        meta: {title: 'Contact', public: true},
    },
    {
        path: '/secure-account',
        name: 'secure-account',
        component: () => import('@/views/SecureAccount.vue'),
        meta: {title: 'Secure Your Account', requiresAuth: true},
    },
    {
        path: '/onboarding',
        name: 'onboarding',
        redirect: '/onboarding/student',
        meta: {requiresAuth: true},
    },
    {
        path: '/onboarding/student',
        name: 'student-setup',
        component: () => import('@/views/StudentSetup.vue'),
        meta: {title: 'Student Profile Setup', requiresAuth: true},
    },
    {
        path: '/onboarding/employer',
        name: 'employer-setup',
        component: () => import('@/views/EmployerSetup.vue'),
        meta: {title: 'Employer Profile Setup', requiresAuth: true},
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/PlaceholderView.vue'),
        meta: {title: 'Home', requiresAuth: true},
    },
    {
        path: '/search',
        name: 'search',
        component: () => import('@/views/PlaceholderView.vue'),
        meta: {title: 'Search', requiresAuth: true},
    },
    {
        path: '/messages',
        name: 'messages',
        component: () => import('@/views/PlaceholderView.vue'),
        meta: {title: 'Messages', requiresAuth: true},
    },
    {
        path: '/notifications',
        name: 'notifications',
        component: () => import('@/views/PlaceholderView.vue'),
        meta: {title: 'Notifications', requiresAuth: true},
    },
    {
        path: '/create',
        name: 'create',
        component: () => import('@/views/PlaceholderView.vue'),
        meta: {title: 'Create', requiresAuth: true},
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/PlaceholderView.vue'),
        meta: {title: 'Profile', requiresAuth: true},
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/PlaceholderView.vue'),
        meta: {title: 'Settings', requiresAuth: true},
    },
    {
        path: '/admin/moderation',
        name: 'admin-moderation',
        component: () => import('@/views/AdminModerationDashboard.vue'),
        meta: {title: 'Admin Moderation', requiresAuth: false},
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    await authStore.initializeSession()

    // 1. If a user tries to access a protected route and is NOT authenticated
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return '/'
    }

    if (to.meta.public) {
        return true
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
                return authStore.user?.role === 'employer' 
                    ? '/onboarding/employer' 
                    : '/onboarding/student'
            }
            return true
        }

        // Prevent going back to onboarding if already complete
        if (to.path.startsWith('/onboarding') && !authStore.needsOnboarding) {
            return '/home'
        }

        // Auto-redirect authenticated users away from root or auth pages
        if (to.path === '/' || to.path === '/auth') {
            return '/home'
        }
    }

    return true
})

export default router
