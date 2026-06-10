<script lang="ts" setup>
  import {useI18n} from 'vue-i18n'
  import {computed, ref, watch} from 'vue'
  import BaseModal from './BaseModal.vue'
  import type {UserProfile} from '@/types/profile'
  import api, { resolveUrl } from '@/lib/api'
  import { useAuthStore } from '@/stores/auth'

  const {t} = useI18n()

  const props = defineProps<{
    user: UserProfile
  }>()

  defineEmits(['close', 'openPost'])

  const authStore = useAuthStore()
  const isFollowing = ref(false)
  const isSelf = computed(() => authStore.user?.id === props.user?.id)

  const followersCount = ref(0)
  const followingCount = ref(0)

  const initials = computed(() => {
    if (!props.user?.name) return '?'
    return props.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
  })

  const profileStats = computed(() => [
    {label: t('profilePage.posts'), value: props.user?.postCount || 0},
    {label: t('profilePage.followers') || 'Connections', value: followersCount.value},
    {label: t('profilePage.following') || 'Following', value: followingCount.value}
  ])

  async function checkFollowStatus() {
    if (isSelf.value || !props.user?.id) return
    try {
      const res = await api.get(`/follows/status/${props.user.id}`)
      isFollowing.value = res.data.followed
    } catch (err) {
      console.error('Failed to check follow status:', err)
    }
  }

  async function handleConnectToggle() {
    if (isSelf.value || !props.user?.id) return
    try {
      const res = await api.post(`/follows/toggle/${props.user.id}`)
      isFollowing.value = res.data.followed
      
      if (res.data.followed) {
        followersCount.value++
      } else {
        followersCount.value = Math.max(0, followersCount.value - 1)
      }
    } catch (err) {
      console.error('Failed to toggle follow status:', err)
    }
  }

  watch(() => props.user, (newVal) => {
    if (newVal) {
      followersCount.value = newVal.followersCount || 0
      followingCount.value = newVal.followingCount || 0
      checkFollowStatus()
    }
  }, { immediate: true })

  console.log('User profile:', props.user)
</script>

<template>
<BaseModal close-label="Close profile" @close="$emit('close')">
  <div class="relative overflow-hidden rounded-4xl bg-surface-container-low shadow-2xl ring-1 ring-white/10">
    <div
        class="h-32 bg-[radial-gradient(circle_at_20%_20%,var(--fs-primary-container),transparent_32%),linear-gradient(135deg,var(--fs-surface-container-high),var(--fs-surface-container-low))] sm:h-48"></div>

    <div class="px-6 pb-8 sm:px-10">
      <div class="grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <div class="flex justify-center lg:justify-start">
          <div
              class="-mt-16 grid h-32 w-32 place-items-center overflow-hidden rounded-full bg-surface p-1 shadow-xl ring-4 ring-surface-container-low sm:h-44 sm:w-44 lg:-mt-20">
            <img
                v-if="user.avatar"
                :src="resolveUrl(user.avatar)"
                :alt="`${user.name} profile photo`"
                class="h-full w-full rounded-full object-cover"
            />
            <span v-else
                  class="grid h-full w-full place-items-center rounded-full bg-primary text-4xl font-black text-on-primary">
                {{ initials }}
              </span>
          </div>
        </div>

        <div class="pt-4">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 class="font-display text-3xl font-black tracking-tighter text-on-surface sm:text-4xl">
                 {{ user.user_name ?? 'NotSet' }}
              </h2>
              <div class="mt-1 flex items-center gap-1.5 flex-wrap">
                <p class="text-xl font-black text-on-surface">{{ user.name }}</p>
                <span
                  v-if="user.isVerified"
                  class="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-600 ring-1 ring-amber-500/20"
                  title="Verified Employer / SME"
                >
                  ★ Verified
                </span>
                <span
                  v-else-if="user.isStudentVerified"
                  class="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/20"
                  title="Verified Student"
                >
                  ✓ Verified
                </span>
              </div>
            </div>
            <button
              v-if="!isSelf && user.id"
              @click="handleConnectToggle"
              :class="[
                'rounded-full px-6 py-2.5 text-sm font-black transition cursor-pointer shadow-sm',
                isFollowing 
                  ? 'bg-surface-container-high text-on-surface hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 border border-transparent' 
                  : 'bg-primary text-on-primary hover:opacity-90'
              ]"
            >
              {{ isFollowing ? 'Connected' : 'Connect' }}
            </button>
          </div>

          <dl class="mt-6 grid grid-cols-3 gap-3 text-center sm:max-w-lg sm:text-left">
            <div v-for="stat in profileStats" :key="stat.label" class="rounded-2xl bg-surface px-4 py-3 shadow-sm">
              <dt class="font-display text-xl font-black tracking-[-0.04em] text-on-surface">
                {{ stat.value }}
              </dt>
              <dd class="text-[0.7rem] font-black uppercase tracking-[0.12em] text-on-surface-variant">
                {{ stat.label }}
              </dd>
            </div>
          </dl>

          <div class="mt-6 max-w-2xl space-y-2 text-sm font-bold leading-6 text-on-surface sm:text-base">
            <p v-if="user.category" class="text-on-surface-variant">{{ user.category }}</p>
            <p v-if="user.bio">{{ user.bio }}</p>
            <p v-else class="italic text-on-surface-variant/60">{{ t('profilePage.noBio') || 'No bio provided' }}</p>
            <p v-if="user.education" class="text-on-surface-variant">{{ user.education }}</p>
            <a v-if="user.user_name" class="inline-flex items-center gap-2 font-black text-primary hover:underline"
               href="#" @click.prevent>
              🔗 firststep.example/{{ user.user_name }}
            </a>
          </div>
        </div>
      </div>

      <div v-if="user.posts?.length" class="mt-10 border-t border-t-gray-500 pt-10">
        <h3 class="mb-6 font-display text-2xl font-black tracking-tight text-on-surface">Posts</h3>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div
              v-for="post in user.posts"
              :key="post.id"
              class="group relative aspect-square cursor-pointer overflow-hidden rounded-3xl bg-surface-container-high shadow-sm transition hover:scale-[1.02] hover:shadow-md"
              @click="$emit('openPost', post)"
          >
            <img
                v-if="post.imageUrl"
                :src="post.imageUrl"
                :alt="post.title"
                class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full w-full items-center justify-center p-6 text-center">
              <p class="font-display text-lg font-black leading-tight text-on-surface line-clamp-3">{{ post.title }}</p>
            </div>
            <div class="absolute inset-0 bg-black/0 transition group-hover:bg-black/5"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</BaseModal>
</template>


<style scoped>
</style>
