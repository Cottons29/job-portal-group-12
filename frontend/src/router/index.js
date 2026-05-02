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
      redirect: '/onboarding/student',
    },
    {
      path: '/onboarding/student',
      name: 'student-setup',
      component: () => import('@/view/StudentSetup.vue'),
      meta: { title: 'Student Profile Setup' },
    },
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/view/PlaceholderView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'job-feed',
          name: 'jobs',
          component: () => import('@/view/job/JobFeed.vue'),
          meta: { title: 'Jobs' },
        },
        {
          path: 'job-posting',
          name: 'job-posting',
          component: () => import('@/view/job/JobPosting.vue'),
          meta: { title: 'Post Job' },
        },
      ],
    },
  ],
})

export default router
