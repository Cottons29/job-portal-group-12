<script setup lang="ts">
import {computed, ref} from "vue";
import api from "@/lib/api";
import {useI18n} from "vue-i18n";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  BuildingStorefrontIcon,
  CameraIcon,
  EnvelopeIcon,
  HomeIcon,
  IdentificationIcon,
  PhoneIcon,
  SparklesIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline'

const {t} = useI18n()

const userProfile = ref()

async function loadProfile() {
  try {
    const response = await api.get("/student-profile/me")
    userProfile.value = response.data
  } catch (error) {
    console.log('Error loading user profile:', error)
  }
}

loadProfile()

const personalInfoRows = computed(() => {
  if (!userProfile.value || !userProfile.value.profile) return []
  const profile = userProfile.value.profile
  const isEmployer = profile.role?.toLowerCase() === 'employer'

  const baseRows = [
    {
      label: t('settings.personal.profilePicture'),
      field: 'avatar',
      values: [],
      icon: CameraIcon,
      avatar: profile.profileImageUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      placeholder: t('settings.personal.profilePicturePlaceholder'),
      inputType: 'url',
    },
    // {
    //   label: isEmployer ? t('settings.personal.companyName') : t('settings.personal.name'),
    //   field: isEmployer ? 'companyName' : 'fullName',
    //   values: [isEmployer ? profile.companyName || t('settings.personal.yourCompany') : profile.fullName || t('settings.personal.yourName')],
    //   icon: isEmployer ? BuildingStorefrontIcon : IdentificationIcon,
    //   placeholder: isEmployer ? t('settings.personal.companyNamePlaceholder') : t('settings.personal.namePlaceholder'),
    //   inputType: 'text',
    // },
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

  const studentRows = [
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

  const employerRows = [
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

defineEmits<{
  (e: 'openPersonalInfoEditor', row: any): void
}>()
</script>

<template>
  <section class="mx-auto min-w-39/40 max-w-2xl">
    <h2 class="mb-4 text-center font-display text-xl font-black tracking-[-0.04em] text-on-surface sm:text-2xl">
      {{ $t('settings.personalInfo') }}
    </h2>

    <div v-if="userProfile" class="overflow-hidden rounded-[1.25rem] bg-surface-container-low ring-1 ring-white/5">
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
          @click="$emit('openPersonalInfoEditor', row)"
          @keydown.enter.prevent="$emit('openPersonalInfoEditor', row)"
          @keydown.space.prevent="$emit('openPersonalInfoEditor', row)"
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
  </section>
</template>

<style scoped>

</style>