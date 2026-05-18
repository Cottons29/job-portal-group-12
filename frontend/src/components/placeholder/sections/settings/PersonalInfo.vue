<script setup lang="ts">
import { computed, onMounted, ref, type Component } from "vue"
import { useI18n } from "vue-i18n"
import { useProfileStore } from "@/stores/profile"
import { useAuthStore } from "@/stores/auth"
import api from "@/lib/api"
import {
  AcademicCapIcon,
  BriefcaseIcon,
  CameraIcon,
  EnvelopeIcon,
  HomeIcon,
  PhoneIcon,
  SparklesIcon,
  UserCircleIcon,
  IdentificationIcon,
  BuildingStorefrontIcon
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const profileStore = useProfileStore()
const authStore = useAuthStore()

export interface PersonalInfoRow {
  label: string
  field: string
  values: string[]
  icon: Component
  avatar?: string
  placeholder: string
  inputType: string
}

const isEditing = ref(false)
const editingRow = ref<PersonalInfoRow | null>(null)
const editValue = ref('')

const personalInfoRows = computed<PersonalInfoRow[]>(() => {
  const profile = profileStore.profileForm
  const isEmployer = authStore.user?.role?.toLowerCase() === 'employer'

  const baseRows: PersonalInfoRow[] = [
    {
      label: t('settings.personal.profilePicture'),
      field: 'avatar',
      values: [],
      icon: CameraIcon,
      avatar: profile.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      placeholder: t('settings.personal.profilePicturePlaceholder'),
      inputType: 'url',
    },
    {
       label: isEmployer ? t('settings.personal.companyName') : t('settings.personal.name'),
       field: isEmployer ? 'companyName' : 'name',
       values: [isEmployer ? profile.companyName || t('settings.personal.yourCompany') : profile.name || t('settings.personal.yourName')],
       icon: isEmployer ? BuildingStorefrontIcon : IdentificationIcon,
       placeholder: isEmployer ? t('settings.personal.companyNamePlaceholder') : t('settings.personal.namePlaceholder'),
       inputType: 'text',
    },
    {
      label: t('settings.personal.username'),
      field: 'user_name',
      values: [profile.user_name || t('settings.personal.blank')],
      icon: UserCircleIcon,
      placeholder: t('settings.personal.usernamePlaceholder'),
      inputType: 'text',
    },
    {
      label: t('settings.personal.email'),
      field: 'email',
      values: [profile.email || t('settings.personal.noEmailLinked')],
      icon: EnvelopeIcon,
      placeholder: t('settings.personal.emailPlaceholder'),
      inputType: 'email',
    },
    {
      label: t('settings.personal.phone'),
      field: 'phone',
      values: [profile.phone || t('settings.personal.noPhoneNumber')],
      icon: PhoneIcon,
      placeholder: t('settings.personal.phonePlaceholder'),
      inputType: 'tel',
    },
  ]

  const studentRows: PersonalInfoRow[] = [
    {
      label: t('settings.personal.university'),
      field: 'university',
      values: [profile.university || t('settings.personal.notSet')],
      icon: AcademicCapIcon,
      placeholder: t('settings.personal.universityPlaceholder'),
      inputType: 'text',
    },
    {
      label: t('settings.personal.major'),
      field: 'major',
      values: [profile.major || t('settings.personal.notSet')],
      icon: SparklesIcon,
      placeholder: t('settings.personal.majorPlaceholder'),
      inputType: 'text',
    },
  ]

  const employerRows: PersonalInfoRow[] = [
    {
      label: t('settings.personal.industry'),
      field: 'industry',
      values: [profile.industry || t('settings.personal.notSet')],
      icon: BriefcaseIcon,
      placeholder: t('settings.personal.industryPlaceholder'),
      inputType: 'text',
    },
    {
      label: t('settings.personal.address'),
      field: 'address',
      values: [profile.address || t('settings.personal.notSet')],
      icon: HomeIcon,
      placeholder: t('settings.personal.addressPlaceholder'),
      inputType: 'text',
    },
    {
      label: t('settings.personal.website'),
      field: 'website',
      values: [profile.website || t('settings.personal.noWebsite')],
      icon: SparklesIcon,
      placeholder: t('settings.personal.websitePlaceholder'),
      inputType: 'url',
    },
  ]

  return isEmployer ? [...baseRows, ...employerRows] : [...baseRows, ...studentRows]
})

function openEditor(row: PersonalInfoRow) {
  editingRow.value = row
  editValue.value = profileStore.profileForm[row.field] || ''
  isEditing.value = true
}

async function saveEdit() {
  if (!editingRow.value) return
  const success = await profileStore.savePersonalInfoEdit(editingRow.value.field, editValue.value)
  if (success) {
    isEditing.value = false
    editingRow.value = null
  }
}

onMounted(() => {
  profileStore.fetchPersonalInfo()
})
</script>

<template>
  <section class="mx-auto min-w-39/40 max-w-2xl">
    <h2 class="mb-4 text-center font-display text-xl font-black tracking-[-0.04em] text-on-surface sm:text-2xl">
      {{ $t('settings.personalInfo') }}
    </h2>

    <div class="overflow-hidden rounded-[1.25rem] bg-surface-container-low ring-1 ring-white/5">
      <article
          v-for="(row, index) in personalInfoRows"
          :key="row.label"
          :class="[
              index === 0 ? 'rounded-t-[1.25rem]' : '',
              index === personalInfoRows.length - 1 ? 'rounded-b-[1.25rem]' : '',
              'flex cursor-pointer items-center gap-3 border-b border-surface last:border-b-0 bg-surface-container-low px-3 py-3 transition hover:bg-surface-container-high sm:px-4'
          ]"
          role="region"
          tabindex="0"
          @click="openEditor(row)"
          @keydown.enter.prevent="openEditor(row)"
          @keydown.space.prevent="openEditor(row)"
      >
        <component :is="row.icon" class="h-4 w-4 shrink-0 text-on-surface-variant"/>
        <div class="min-w-0 flex-1">
          <h3 class="text-base font-black tracking-[-0.03em] text-on-surface">{{ row.label }}</h3>
          <p
              v-for="value in row.values"
              :key="value"
              class="mt-0.5 truncate text-xs font-bold text-on-surface-variant"
          >
            {{ value }}
          </p>
        </div>
        <img

            v-if="row.avatar"
            :alt="row.label"
            class="h-10 w-10 rounded-full object-cover ring-2 ring-surface-container-low"
            :src="row.avatar"
        />
        <span class="text-lg font-black text-on-surface-variant/70">›</span>
      </article>
    </div>
    <div v-if="isEditing" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-md rounded-3xl bg-surface p-6 shadow-2xl">
        <h3 class="font-display text-xl font-black text-on-surface">{{ editingRow?.label }}</h3>
        <input
            v-model="editValue"
            :type="editingRow?.inputType || 'text'"
            :placeholder="editingRow?.placeholder"
            class="mt-4 w-full rounded-2xl bg-surface-container-low px-4 py-3 text-sm font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary"
            @keydown.enter="saveEdit"
        />
        <p v-if="profileStore.profileSaveError" class="mt-2 text-xs font-bold text-red-300">
          {{ profileStore.profileSaveError }}
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <button
              class="rounded-full px-5 py-2 text-sm font-black text-on-surface-variant transition hover:bg-surface-container-high"
              @click="isEditing = false"
          >
            Cancel
          </button>
          <button
              class="rounded-full bg-primary px-5 py-2 text-sm font-black text-on-primary transition hover:opacity-90 disabled:opacity-50"
              :disabled="profileStore.isSavingProfile"
              @click="saveEdit"
          >
            {{ profileStore.isSavingProfile ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>