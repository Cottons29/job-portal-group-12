<script setup lang="ts">
import { computed, onMounted, ref, type Component } from "vue"
import { useI18n } from "vue-i18n"
import { useProfileStore } from "@/stores/profile"
import { useAuthStore } from "@/stores/auth"
import api, { API_BASE, resolveUrl } from "@/lib/api"
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
  BuildingStorefrontIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

function getAvatarUrl(avatar: any): string {
  if (!avatar) return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
  if (avatar instanceof File) {
    try {
      return URL.createObjectURL(avatar)
    } catch {
      return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
    }
  }
  if (typeof avatar !== 'string') {
    return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
  }
  return resolveUrl(avatar)
}

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
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const previewUrl = ref<string | null>(null)

function handleFileSelection(file: File) {
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    profileStore.profileSaveError = 'File too large (exceeds 10MB limit)'
    selectedFile.value = null
    previewUrl.value = null
    return
  }
  
  profileStore.profileSaveError = ''
  selectedFile.value = file
  
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = URL.createObjectURL(file)
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    handleFileSelection(target.files[0])
  }
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    handleFileSelection(event.dataTransfer.files[0])
  }
}

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
      inputType: 'file',
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
    {
      label: 'Student ID Verification',
      field: 'idCardFile',
      values: [
        profileStore.profileForm.isStudentVerified
          ? '✓ Verified Student'
          : profileStore.profileForm.idCardUrl
            ? '⏳ Verification Pending Review'
            : '✗ Not Verified (Click to upload Student ID Card)'
      ],
      icon: ShieldCheckIcon,
      placeholder: 'Upload your Student ID Card (PDF/Image)',
      inputType: 'file',
    }
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
    {
      label: 'Business Patent Verification',
      field: 'patentFile',
      values: [
        profileStore.profileForm.isVerified
          ? '✓ Verified Business / SME'
          : profileStore.profileForm.patentUrl
            ? '⏳ Verification Pending Review'
            : '✗ Not Verified (Click to upload Business Patent)'
      ],
      icon: ShieldCheckIcon,
      placeholder: 'Upload your Business Patent / Document (PDF/Image)',
      inputType: 'file',
    }
  ]

  return isEmployer ? [...baseRows, ...employerRows] : [...baseRows, ...studentRows]
})

function openEditor(row: PersonalInfoRow) {
  editingRow.value = row
  editValue.value = profileStore.profileForm[row.field] || ''
  selectedFile.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  isEditing.value = true
}

async function saveEdit() {
  if (!editingRow.value) return

  const valueToSave = editingRow.value.inputType === 'file' ? selectedFile.value : editValue.value
  if (editingRow.value.inputType === 'file' && !valueToSave) {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }
    isEditing.value = false
    return
  }

  const success = await profileStore.savePersonalInfoEdit(editingRow.value.field, valueToSave)
  if (success) {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }
    isEditing.value = false
    editingRow.value = null
    selectedFile.value = null
  }
}

function closeEditor() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  isEditing.value = false
  profileStore.profileSaveError = ''
}

const isStudent = computed(() => authStore.user?.role?.toLowerCase() === 'student')
const isEmployer = computed(() => authStore.user?.role?.toLowerCase() === 'employer')

const missingRequiredFields = computed(() => {
  const missing: string[] = []
  const profile = profileStore.profileForm
  if (isStudent.value) {
    if (!profile.name || !profile.name.trim()) missing.push('Full Name')
    if (!profile.university || !profile.university.trim()) missing.push('University')
    if (!profile.major || !profile.major.trim()) missing.push('Major')
  } else if (isEmployer.value) {
    if (!profile.companyName || !profile.companyName.trim()) missing.push('Company Name')
    if (!profile.industry || !profile.industry.trim()) missing.push('Industry')
    if (!profile.address || !profile.address.trim()) missing.push('Address')
  }
  return missing
})

async function submitProfileSetup() {
  if (missingRequiredFields.value.length > 0) {
    alert('Please fill in the following required fields to complete setup: ' + missingRequiredFields.value.join(', '))
    return
  }

  const success = await profileStore.savePersonalInfoEdit('', '')
  if (success) {
    alert('Profile setup completed successfully!')
    await authStore.refreshUser()
  } else {
    alert('Failed to save profile. Please try again.')
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

    <!-- Profile Setup Warning Banner -->
    <div v-if="!authStore.user?.profileCompleted" class="mb-6 rounded-[1.25rem] bg-amber-500/10 border border-amber-500/20 p-5 flex flex-col gap-3">
      <div class="flex items-start gap-3">
        <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/20 text-amber-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </span>
        <div class="flex-1">
          <h4 class="text-sm font-black text-on-surface leading-tight">Profile Setup Incomplete</h4>
          <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">
            Please fill out your profile details to unlock platform features (job applications, posting, messaging).
          </p>
          <p v-if="missingRequiredFields.length > 0" class="text-xs text-amber-600/90 font-bold mt-2">
            Remaining fields: {{ missingRequiredFields.join(', ') }}
          </p>
        </div>
      </div>
    </div>

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
            :src="getAvatarUrl(row.avatar)"
        />
        <span class="text-lg font-black text-on-surface-variant/70">›</span>
      </article>
    </div>

    <!-- Profile Setup Action Button -->
    <div v-if="!authStore.user?.profileCompleted" class="mt-6">
      <button 
        @click="submitProfileSetup"
        class="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary text-on-primary py-3.5 text-sm font-bold shadow-sm hover:bg-primary/95 transition duration-300"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Submit Profile Setup
      </button>
    </div>
    <div v-if="isEditing" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-md rounded-3xl bg-surface p-6 shadow-2xl">
        <h3 class="font-display text-xl font-black text-on-surface">{{ editingRow?.label }}</h3>
        <input
            v-if="editingRow?.inputType !== 'file'"
            v-model="editValue"
            :type="editingRow?.inputType || 'text'"
            :placeholder="editingRow?.placeholder"
            class="mt-4 w-full rounded-2xl bg-surface-container-low px-4 py-3 text-sm font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary"
            @keydown.enter="saveEdit"
        />
        <div v-else class="mt-4">
          <input
              type="file"
              :accept="editingRow?.field === 'avatar' ? 'image/*' : 'image/*,.pdf'"
              class="hidden"
              id="avatar-upload"
              @change="onFileChange"
          />
          <label
              for="avatar-upload"
              :class="[
                'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition aspect-video max-h-48 overflow-hidden relative',
                isDragging 
                  ? 'border-primary bg-primary/10' 
                  : 'border-surface-container-high hover:bg-surface-container-low'
              ]"
              @dragover.prevent="onDragOver"
              @dragleave.prevent="onDragLeave"
              @drop.prevent="onDrop"
          >
            <template v-if="previewUrl && editingRow?.field === 'avatar'">
              <img :src="previewUrl" class="h-full w-full object-cover rounded-xl" />
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <CameraIcon class="h-8 w-8 text-white" />
                <span class="text-white text-xs font-black ml-2">Change Image</span>
              </div>
            </template>
            <template v-else-if="selectedFile">
              <div class="flex flex-col items-center text-center p-4">
                <ShieldCheckIcon class="h-10 w-10 text-emerald-500 mb-2" />
                <span class="text-xs font-black text-on-surface truncate max-w-[200px]">{{ selectedFile.name }}</span>
                <span class="text-[10px] text-on-surface-variant/80 mt-1">Ready to upload</span>
              </div>
            </template>
            <template v-else>
              <component :is="editingRow?.field === 'avatar' ? CameraIcon : ShieldCheckIcon" :class="['h-10 w-10 transition-colors', isDragging ? 'text-primary' : 'text-on-surface-variant']"/>
              <p :class="['mt-2 text-sm font-bold text-center transition-colors px-4', isDragging ? 'text-primary' : 'text-on-surface-variant']">
                {{ editingRow?.field === 'avatar' ? 'Click or drag image to upload' : 'Click or drag verification document (PDF/Image) to upload' }}
              </p>
            </template>
          </label>
          <p v-if="selectedFile" class="mt-2 text-xs font-bold text-on-surface-variant text-center">
            Selected: <span class="text-primary font-black">{{ selectedFile.name }}</span> ({{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB)
          </p>
        </div>
        <p v-if="profileStore.profileSaveError" class="mt-2 text-xs font-bold text-red-300">
          {{ profileStore.profileSaveError }}
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <button
              class="rounded-full px-5 py-2 text-sm font-black text-on-surface-variant transition hover:bg-surface-container-high"
              @click="closeEditor"
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