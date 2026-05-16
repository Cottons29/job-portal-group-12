<script lang="ts" setup>
import DataAndPrivacy from "@/components/placeholder/sections/settings/DataAndPrivacy.vue";
import Languages from "@/components/placeholder/sections/settings/Languages.vue";
import Logout from "@/components/placeholder/sections/settings/Logout.vue";
import SecurityAndSignin from "@/components/placeholder/sections/settings/SecurityAndSignin.vue";
import PersonalInfo from "@/components/placeholder/sections/settings/PersonalInfo.vue";
import {computed, ref} from "vue";
import {
  ArrowRightOnRectangleIcon,
  IdentificationIcon,
  LanguageIcon,
  LockClosedIcon,
  ShieldCheckIcon
} from "@heroicons/vue/24/outline";
import {useI18n} from "vue-i18n";

const {t, locale} = useI18n()

defineProps({
  currentLocale: {
    type: String,
    required: true
  }
});

const activeSettingsSection = ref('personal')

const settingsMenuItems = computed(() => [
  {
    label: t('settings.personalInfo'),
    section: 'personal',
    icon: IdentificationIcon,
    bg: 'bg-[#8fd99b]',
    color: 'text-[#1f6c3b]',
    active: activeSettingsSection.value === 'personal'
  },
  {
    label: t('settings.securitySignIn'),
    section: 'security',
    icon: LockClosedIcon,
    bg: 'bg-[#8ccaff]',
    color: 'text-[#235d84]',
    active: activeSettingsSection.value === 'security'
  },
  {
    label: t('settings.dataPrivacy'),
    section: 'privacy',
    icon: ShieldCheckIcon,
    bg: 'bg-[#d7b7ff]',
    color: 'text-[#5b36a8]',
    active: activeSettingsSection.value === 'privacy'
  },
  {
    label: t('settings.languages'),
    section: 'languages',
    icon: LanguageIcon,
    bg: 'bg-[#f5df7e]',
    color: 'text-[#745b00]',
    active: activeSettingsSection.value === 'languages'
  },
  {
    label: t('settings.logout'),
    section: 'logout',
    icon: ArrowRightOnRectangleIcon,
    bg: 'bg-red-500/15',
    color: 'text-red-300',
    active: activeSettingsSection.value === 'logout'
  },
])

const languageOptions = [
  {
    label: 'English',
    nativeName: 'English',
    value: 'en',
    description: 'Use FirstStep in English.',
  },
  {
    label: 'Khmer',
    nativeName: 'ភាសាខ្មែរ',
    value: 'km',
    description: 'ប្រើ FirstStep ជាភាសាខ្មែរ។',
  },
  {
    label: 'Chinese (Simplified)',
    nativeName: '简体中文',
    value: 'zh-CN',
    description: '使用简体中文浏览 FirstStep。',
  },
  {
    label: 'Chinese (Traditional)',
    nativeName: '繁體中文',
    value: 'zh-TW',
    description: '使用繁體中文瀏覽 FirstStep。',
  },
  {
    label: 'Japanese',
    nativeName: '日本語',
    value: 'ja',
    description: 'FirstStep を日本語で使用します。',
  },
  {
    label: 'French',
    nativeName: 'Français',
    value: 'fr',
    description: 'Utiliser FirstStep en français.',
  },
]

defineEmits<{
  (e: 'update:locale', value: string): void
}>()
</script>

<template>
  <div class="grid gap-10 md:grid-cols-[15rem_minmax(0,1fr)] md:justify-start lg:gap-30 xl:grid-cols-[15rem_minmax(0,0.78fr)]">
    <aside class="space-y-2 md:sticky md:top-28 md:h-fit">
      <button
          v-for="item in settingsMenuItems"
          :key="item.label"
          :class="[
              item.active ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant hover:bg-surface-container-low',
              'flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-left text-sm font-black transition'
          ]"
          type="button"
          @click="() => {activeSettingsSection = item.section}"
      >
        <span :class="[item.bg, 'grid h-9 w-9 shrink-0 place-items-center rounded-xl']">
          <component :is="item.icon" :class="[item.color, 'h-4 w-4']"/>
        </span>
        <span class="leading-tight">{{ item.label }}</span>
      </button>
    </aside>

    <PersonalInfo
        v-if="activeSettingsSection === 'personal'"
    />

    <SecurityAndSignin
        v-else-if="activeSettingsSection === 'security'"
    />

    <DataAndPrivacy
        v-else-if="activeSettingsSection === 'privacy'"
    />

    <Languages
        v-else-if="activeSettingsSection === 'languages'"
        :language-options="languageOptions"
        :current-locale="currentLocale"
        @update:locale="$emit('update:locale', $event)"
    />

    <Logout
        v-else-if="activeSettingsSection === 'logout'"
    />
  </div>
</template>
