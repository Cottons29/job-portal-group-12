<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const profileStore = useProfileStore()
const authStore = useAuthStore()

const initials = computed(() => {
  if (!profileStore.profileForm.name) return '?'
  return profileStore.profileForm.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
})

const profileHandle = computed(() => {
  return profileStore.profileForm.user_name ? `@${profileStore.profileForm.user_name}` : initials.value
})

const profileStats = computed(() => [
  { label: t('profilePage.posts'), value: '0' },
  { label: t('profilePage.followers'), value: '1.2K' },
  { label: t('profilePage.following'), value: '450' }
])

const profileCategory = computed(() => {
  const isEmployer = authStore.user?.role?.toLowerCase() === 'employer'
  return isEmployer ? profileStore.profileForm.industry : `Year ${profileStore.profileForm.yearLevel}`
})

const profileBio = computed(() => {
  const isEmployer = authStore.user?.role?.toLowerCase() === 'employer'
  return isEmployer ? profileStore.profileForm.companyDescription : profileStore.profileForm.bio
})

const profileEducation = computed(() => {
  const isEmployer = authStore.user?.role?.toLowerCase() === 'employer'
  return isEmployer ? profileStore.profileForm.address : `${profileStore.profileForm.university} - ${profileStore.profileForm.major}`
})

const followedByAvatars = [
  'https://i.pravatar.cc/150?u=1',
  'https://i.pravatar.cc/150?u=2',
  'https://i.pravatar.cc/150?u=3'
]

const profileTabs = computed(() => [
  { label: t('profilePage.posts'), active: true },
  { label: t('profilePage.highlights'), active: false },
  { label: t('profilePage.tagged'), active: false },
])

const profileGallery = []

defineEmits(['openPost'])

onMounted(() => {
  profileStore.fetchPersonalInfo()
})
</script>

<template>
  <section class="mx-auto w-full max-w-5xl space-y-4">
    <article class="overflow-hidden rounded-3xl bg-surface-container-low shadow-sm ring-1 ring-white/5">
      <div
          class="h-24 bg-[radial-gradient(circle_at_20%_20%,var(--fs-primary-container),transparent_32%),linear-gradient(135deg,var(--fs-surface-container-high),var(--fs-surface-container-low))] sm:h-32"></div>

      <div class="px-4 pb-5 sm:px-6 sm:pb-6">
        <div class="grid gap-4 lg:grid-cols-[12rem_minmax(0,1fr)]">
          <div class="flex justify-center lg:justify-start">
            <div
                class="-mt-14 grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-surface p-1 shadow-xl ring-4 ring-surface-container-low sm:h-36 sm:w-36">
              <img
                  v-if="profileStore.profileForm.avatar"
                  :src="profileStore.profileForm.avatar"
                  :alt="`${profileStore.profileForm.name} profile photo`"
                  class="h-full w-full rounded-full object-cover"
              />
              <span v-else
                    class="grid h-full w-full place-items-center rounded-full bg-primary text-3xl font-black text-on-primary">
                {{ initials }}
              </span>
            </div>
          </div>

          <div class="pt-2 sm:pt-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="font-display text-2xl font-black tracking-tighter text-on-surface sm:text-3xl">
                    {{ profileHandle }}
                  </h2>
                </div>
                <p class="mt-1 text-base font-black text-on-surface">{{ profileStore.profileForm.name }}</p>
              </div>

              <RouterLink
                  class="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-black text-on-primary transition hover:opacity-90"
                  to="/settings"
              >
                {{ t('profilePage.editProfile') }}
              </RouterLink>
            </div>

            <dl class="mt-4 grid grid-cols-3 gap-2 text-center sm:max-w-lg sm:text-left">
              <div v-for="stat in profileStats" :key="stat.label" class="rounded-2xl bg-surface px-3 py-2">
                <dt class="font-display text-lg font-black tracking-[-0.04em] text-on-surface">
                  {{ stat.value }}
                </dt>
                <dd class="text-[0.625rem] font-black uppercase tracking-[0.12em] text-on-surface-variant">
                  {{ stat.label }}
                </dd>
              </div>
            </dl>

            <div class="mt-4 max-w-2xl space-y-1.5 text-xs font-bold leading-5 text-on-surface sm:text-sm">
              <p class="text-on-surface-variant">{{ profileCategory }}</p>
              <p>{{ profileBio }}</p>
              <p class="text-on-surface-variant">{{ profileEducation }}</p>
              <p v-if="profileStore.profileForm.jobType" class="text-on-surface-variant">
                {{ t('profilePage.lookingFor', { jobType: profileStore.profileForm.jobType }) }}
              </p>
              <a class="inline-flex items-center gap-2 font-black text-primary"
                 href="https://firststep.example/profile" rel="noopener noreferrer" target="_blank">
                🔗 firststep.example/{{ profileHandle }}
              </a>
            </div>

            <div class="mt-4 flex items-center gap-2">
              <div class="flex -space-x-2">
                <img
                    v-for="avatar in followedByAvatars"
                    :key="avatar"
                    :src="avatar"
                    :alt="t('profilePage.connectionAvatarAlt')"
                    class="h-8 w-8 rounded-full border-2 border-surface-container-low object-cover"
                />
              </div>
              <p class="text-xs font-black text-on-surface sm:text-sm">
                {{ t('profilePage.followedBy') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>

    <nav class="flex gap-1 rounded-[1.75rem]  p-2  sm:inline-flex">
      <button
          v-for="tab in profileTabs"
          :key="tab.label"
          :class="[
              tab.active ? 'bg-secondary text-on-primary shadow-sm' : 'bg-secondary/25 text-on-secondary-container hover:bg-secondary/35',
              'flex flex-1 items-center justify-center gap-1.5 rounded-[1.25rem] px-3 py-3 text-xs font-black transition sm:flex-none sm:px-8 sm:text-sm'
          ]"
          type="button"
      >
        <span v-if="tab.active" aria-hidden="true" class="text-base leading-none">✓</span>
        <span>{{ tab.label }}</span>
      </button>
    </nav>

    <section class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <article
          v-for="item in profileGallery"
          :key="item.post?.id || item.title"
          class="group relative aspect-square overflow-hidden rounded-[1.25rem] bg-surface-container-low ring-1 ring-white/5 transition hover:ring-primary/40 focus:outline-none focus:ring-2 focus:ring-primary"
          role="region"
          tabindex="0"
          @click="$emit('openPost', item.post)"
          @keydown.enter.prevent="$emit('openPost', item.post)"
          @keydown.space.prevent="$emit('openPost', item.post)"
      >
        <img
            v-if="item.image"
            :src="item.image"
            :alt="item.title"
            class="h-full w-full object-cover transition duration-150 group-hover:scale-101"
        />
        <div v-else class="grid h-full w-full place-items-center p-5 text-center">
          <h3 class="font-display text-xl font-black tracking-[-0.04em] text-on-surface">{{ item.title }}</h3>
        </div>
      </article>
    </section>
  </section>
</template>
