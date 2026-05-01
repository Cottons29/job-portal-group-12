import { computed, readonly, ref } from 'vue'

type ThemePreference = 'light' | 'dark' | 'system'
type AppliedTheme = 'light' | 'dark'

const storageKey = 'firststep-theme-mode'
const themePreference = ref<ThemePreference>('system')
const systemTheme = ref<AppliedTheme>('light')
let isInitialized = false
let mediaQuery: MediaQueryList | null = null

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

function getSystemTheme(): AppliedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme() {
  if (typeof document === 'undefined') return

  const appliedTheme = themePreference.value === 'system' ? systemTheme.value : themePreference.value
  document.documentElement.dataset.theme = appliedTheme
  document.documentElement.dataset.themePreference = themePreference.value
  document.documentElement.style.colorScheme = appliedTheme
}

function handleSystemThemeChange(event: MediaQueryListEvent) {
  systemTheme.value = event.matches ? 'dark' : 'light'
  applyTheme()
}

export function initializeThemeMode() {
  if (isInitialized || typeof window === 'undefined') return

  const savedTheme = window.localStorage.getItem(storageKey)
  themePreference.value = isThemePreference(savedTheme) ? savedTheme : 'system'
  systemTheme.value = getSystemTheme()

  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', handleSystemThemeChange)

  applyTheme()
  isInitialized = true
}

export function useThemeMode() {
  initializeThemeMode()

  const appliedTheme = computed<AppliedTheme>(() =>
    themePreference.value === 'system' ? systemTheme.value : themePreference.value,
  )

  function setThemePreference(value: ThemePreference) {
    themePreference.value = value
    window.localStorage.setItem(storageKey, value)
    applyTheme()
  }

  function cycleThemePreference() {
    const order: ThemePreference[] = ['system', 'light', 'dark']
    const currentIndex = order.indexOf(themePreference.value)
    setThemePreference(order[(currentIndex + 1) % order.length])
  }

  return {
    appliedTheme,
    themePreference: readonly(themePreference),
    setThemePreference,
    cycleThemePreference,
  }
}
