import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import api from '@/lib/api'

export const useAuthStore = defineStore('auth', () => {
  // ── Form state ──
  const mode = ref('login') // 'login' | 'signup'
  const role = ref('student') // 'student' | 'employer'
  const phone = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const isLoading = ref(false)
  const error = ref('')

  // ── Authenticated user ──
  const user = ref(null)
  const token = ref(localStorage.getItem('fs_token') || '')

  // ── Computed guards (used by router beforeEach) ──
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const needsEmailRecovery = computed(() => isAuthenticated.value && !user.value?.email)
  const needsOnboarding = computed(() => isAuthenticated.value && !!user.value?.email && !user.value?.profileCompleted)

  // ── Actions ──
  function resetForm() {
    phone.value = ''
    password.value = ''
    confirmPassword.value = ''
    error.value = ''
  }

  function setMode(newMode) {
    mode.value = newMode
    error.value = ''
  }

  function setRole(newRole) {
    role.value = newRole
  }

  async function login(router) {
    error.value = ''

    if (!phone.value || !password.value) {
      error.value = 'Please fill in all fields.'
      return
    }

    isLoading.value = true
    try {
      const { data } = await api.post('/auth/login', {
        phone: `+855${phone.value.replace(/\s/g, '')}`,
        password: password.value,
        role: role.value,
      })

      token.value = data.token
      user.value = data.user
      localStorage.setItem('fs_token', data.token)

      // ── Post-login redirect logic ──
      if (!data.user.email) {
        router.push('/secure-account')
      } else if (!data.user.profileCompleted) {
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      error.value =
        err.response?.data?.message || 'Login failed. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  async function register(router) {
    error.value = ''

    if (!phone.value || !password.value || !confirmPassword.value) {
      error.value = 'Please fill in all fields.'
      return
    }

    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match.'
      return
    }

    if (password.value.length < 6) {
      error.value = 'Password must be at least 6 characters.'
      return
    }

    isLoading.value = true
    try {
      const { data } = await api.post('/auth/register', {
        phone: `+855${phone.value.replace(/\s/g, '')}`,
        password: password.value,
        role: role.value,
      })

      token.value = data.token
      user.value = data.user
      localStorage.setItem('fs_token', data.token)

      // New registrations always go to secure-account first
      router.push('/secure-account')
    } catch (err) {
      error.value =
        err.response?.data?.message || 'Registration failed. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  function logout(router) {
    user.value = null
    token.value = ''
    localStorage.removeItem('fs_token')
    resetForm()
    router.push('/auth')
  }

  return {
    mode,
    role,
    phone,
    password,
    confirmPassword,
    isLoading,
    error,
    user,
    token,
    isAuthenticated,
    needsEmailRecovery,
    needsOnboarding,
    resetForm,
    setMode,
    setRole,
    login,
    register,
    logout,
  }
})
