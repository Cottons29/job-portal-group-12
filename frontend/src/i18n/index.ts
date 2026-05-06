import { createI18n } from 'vue-i18n'
import { watch } from 'vue'
import en from '../locales/en'
import km from '../locales/km'

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: 'en', // Default locale
  fallbackLocale: 'en',
  messages: {
    en,
    km,
  },
})

// Sync the html lang attribute with the active locale
watch(
  () => i18n.global.locale.value,
  (lang) => {
    document.documentElement.setAttribute('lang', lang)
  },
  { immediate: true }
)

export default i18n
