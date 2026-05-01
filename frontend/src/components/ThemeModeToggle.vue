<script setup lang="ts">
import { computed } from 'vue'
import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import { useThemeMode } from '@/composables/useThemeMode'

const props = defineProps({
  embedded: {
    type: Boolean,
    default: false,
  },
})

const { appliedTheme, themePreference, setThemePreference } = useThemeMode()

const modes = [
  { value: 'system', label: 'System', icon: ComputerDesktopIcon },
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
] as const

const themeLabel = computed(() => {
  const activeMode = modes.find((mode) => mode.value === themePreference.value)
  return `${activeMode?.label ?? 'System'} theme, currently ${appliedTheme.value}`
})
</script>

<template>
  <div
    class="theme-mode-toggle"
    :class="{ 'theme-mode-toggle--embedded': props.embedded }"
    role="group"
    :aria-label="themeLabel"
  >
    <button
      v-for="mode in modes"
      :key="mode.value"
      type="button"
      class="theme-mode-toggle__option"
      :class="{ 'theme-mode-toggle__option--active': themePreference === mode.value }"
      :aria-pressed="themePreference === mode.value"
      @click="setThemePreference(mode.value)"
    >
      <component :is="mode.icon" class="theme-mode-toggle__icon" />
      <span>{{ mode.label }}</span>
    </button>
  </div>
</template>
