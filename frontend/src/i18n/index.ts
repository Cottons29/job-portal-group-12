import { createI18n } from 'vue-i18n'
import { watch } from 'vue'
import english_lang from '../locales/english_lang'
import fr from '../locales/fr'
import ja from '../locales/ja'
import km from '../locales/khmer_lang.ts'
import zh_cn from '../locales/zh_cn'
import zh_tw from '../locales/zh_tw'


const savedLocale = localStorage.getItem('user-locale') || 'en'

const i18n = createI18n({
  locale: savedLocale, // Default locale
  fallbackLocale: 'en',
  messages: {
    // @ts-ignore
    en: english_lang,
    fr,
    ja,
    km,
    'zh-CN': zh_cn,
    'zh-TW': zh_tw,
  },
})

// Sync the html lang attribute with the active locale
// @ts-ignore
watch(
  () => i18n.global.locale,
  (lang) => {
    document.documentElement.setAttribute('lang', lang)
    localStorage.setItem('user-locale', lang)
  },
  { immediate: true }
)

export default i18n
