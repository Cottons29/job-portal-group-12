<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'
import api, { resolveUrl } from '@/lib/api'
import { usePostStore } from '@/stores/posts'
import { ChatBubbleOvalLeftEllipsisIcon, SparklesIcon, TagIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
const profileStore = useProfileStore()
const authStore = useAuthStore()

const isEmployer = computed(() => authStore.user?.role?.toLowerCase() === 'employer')

const initials = computed(() => {
  const targetName = isEmployer.value ? profileStore.profileForm.companyName : profileStore.profileForm.name
  if (!targetName) return '?'
  return targetName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
})

const profileHandle = computed(() => {
  return profileStore.profileForm.user_name ? `@${profileStore.profileForm.user_name}` : initials.value
})

const displayName = computed(() => {
  if (isEmployer.value) {
    return profileStore.profileForm.companyName || authStore.user?.phone || 'Loading...'
  }
  return profileStore.profileForm.name || authStore.user?.phone || 'Loading...'
})

const followersCount = ref(0)
const followingCount = ref(0)

const profileStats = computed(() => [
  { label: t('profilePage.posts'), value: profilePosts.value.length.toString() },
  { label: t('profilePage.followers'), value: followersCount.value.toString() },
  { label: t('profilePage.following'), value: followingCount.value.toString() }
])

const profileCategory = computed(() => {
  return isEmployer.value ? profileStore.profileForm.industry : (profileStore.profileForm.yearLevel ? `Year ${profileStore.profileForm.yearLevel}` : '')
})

const profileBio = computed(() => {
  return isEmployer.value ? profileStore.profileForm.companyDescription : profileStore.profileForm.bio
})

const profileEducation = computed(() => {
  if (isEmployer.value) return profileStore.profileForm.address
  const u = profileStore.profileForm.university
  const m = profileStore.profileForm.major
  if (u && m) return `${u} - ${m}`
  return u || m || ''
})

const availabilitySummary = computed(() => {
  const av = profileStore.profileForm.availability
  if (!av) return []
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const slots = ['morning', 'afternoon', 'evening']
  
  const result = []
  for (const day of days) {
    if (av[day]) {
      const activeSlots = slots.filter(slot => av[day][slot])
      if (activeSlots.length > 0) {
        result.push({
          day: day.charAt(0).toUpperCase() + day.slice(1, 3),
          slots: activeSlots.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')
        })
      }
    }
  }
  return result
})

const expectedSalaryText = computed(() => {
  const salary = profileStore.profileForm.expectedSalary
  const curr = profileStore.profileForm.currency || 'USD'
  if (!salary) return ''
  return curr === 'USD' ? `$${salary}` : `${Number(salary).toLocaleString()} KHR`
})

const followedByAvatars = ref([])

const activeTab = ref('posts')

const profileTabs = computed(() => [
  { id: 'posts', label: t('profilePage.posts'), active: activeTab.value === 'posts' },
  { id: 'highlights', label: t('profilePage.highlights') || 'Highlights', active: activeTab.value === 'highlights' },
  { id: 'tagged', label: t('profilePage.tagged') || 'Tagged', active: activeTab.value === 'tagged' },
])

const profilePosts = ref([])
const profileHighlights = ref([])
const profileTagged = ref([])

const filteredGallery = computed(() => {
  if (activeTab.value === 'highlights') {
    return profileHighlights.value
  } else if (activeTab.value === 'tagged') {
    return profileTagged.value
  }
  return profilePosts.value
})

const emptyStateIcon = computed(() => {
  if (activeTab.value === 'highlights') return SparklesIcon
  if (activeTab.value === 'tagged') return TagIcon
  return ChatBubbleOvalLeftEllipsisIcon
})

const emptyStateTitle = computed(() => {
  if (activeTab.value === 'highlights') return 'No highlights yet'
  if (activeTab.value === 'tagged') return 'No tagged posts'
  return 'No posts yet'
})

const emptyStateDesc = computed(() => {
  if (activeTab.value === 'highlights') {
    return 'Posts that receive likes or comments from the community will appear here as highlights.'
  }
  if (activeTab.value === 'tagged') {
    return isEmployer.value
      ? 'When other members mention your company handle in their posts, they will show up here.'
      : 'Jobs or opportunities you have applied to will appear here.'
  }
  return 'Share updates, hiring news, or insights with the campus network to get started!'
})

defineEmits(['openPost'])

onMounted(async () => {
  profileStore.fetchPersonalInfo()
  fetchFollowStats()
  await fetchUserPosts()
  await fetchTaggedPosts()
})

async function fetchFollowStats() {
  try {
    const [followersRes, followingRes] = await Promise.all([
      api.get('/follows/followers'),
      api.get('/follows/following')
    ])
    followersCount.value = followersRes.data.followers?.length || 0
    followingCount.value = followingRes.data.following?.length || 0
    
    // Set dynamic follower connection avatars
    followedByAvatars.value = (followersRes.data.followers || []).slice(0, 3).map(f => {
      return resolveUrl(f.profileImageUrl || f.logoUrl)
    })
  } catch (e) {
    console.error('Failed to fetch follow stats:', e)
  }
}

async function fetchUserPosts() {
  try {
    const { data } = await api.get('/posts', {
      params: {
        authorId: authStore.user?.id
      }
    })
    const postStore = usePostStore()
    const mapped = (data.posts || []).map(p => ({
      post: postStore.mapPost(p),
      image: p.imageUrl,
      title: p.title
    }))
    profilePosts.value = mapped
    profileHighlights.value = mapped.filter(item => {
      return (item.post?.likeCount > 0) || (item.post?.commentCount > 0)
    })
  } catch (e) {
    console.error('Failed to fetch user posts:', e)
  }
}

async function fetchTaggedPosts() {
  try {
    const postStore = usePostStore()
    if (isEmployer.value) {
      const { data } = await api.get('/posts', { params: { limit: 50 } })
      const username = profileStore.profileForm.user_name
      if (!username) {
        profileTagged.value = []
        return
      }
      
      const mentionStr = `@${username}`.toLowerCase()
      const mentionedPosts = (data.posts || []).filter(p => {
        return p.author?.id !== authStore.user?.id &&
               p.content?.toLowerCase().includes(mentionStr)
      })
      
      profileTagged.value = mentionedPosts.map(p => ({
        post: postStore.mapPost(p),
        image: p.imageUrl,
        title: p.title
      }))
    } else {
      const { data } = await api.get('/applications/me')
      profileTagged.value = (data.applications || [])
        .filter(app => app.post)
        .map(app => ({
          post: postStore.mapPost(app.post),
          image: app.post.imageUrl,
          title: app.post.title
        }))
    }
  } catch (e) {
    console.error('Failed to fetch tagged posts:', e)
  }
}
</script>

<template>
  <section class="mx-auto w-full max-w-5xl space-y-4">
    <article class="overflow-hidden rounded-3xl bg-surface-container-low ring-1 ring-white/5">
      <div
          class="h-24 bg-[radial-gradient(circle_at_20%_20%,var(--fs-primary-container),transparent_32%),linear-gradient(135deg,var(--fs-surface-container-high),var(--fs-surface-container-low))] sm:h-32"></div>

      <div class="px-4 pb-5 sm:px-6 sm:pb-6">
        <div class="grid gap-4 lg:grid-cols-[12rem_minmax(0,1fr)]">
          <div class="flex justify-center lg:justify-start">
            <div
                class="-mt-14 grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-surface p-1 shadow-xl ring-4 ring-surface-container-low sm:h-36 sm:w-36">
              <img
                  v-if="profileStore.profileForm.avatar"
                  :src="resolveUrl(profileStore.profileForm.avatar)"
                  :alt="`${displayName} profile photo`"
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
                    {{ displayName }}
                  </h2>
                  <span
                    v-if="isEmployer && profileStore.profileForm.isVerified"
                    class="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-500 ring-1 ring-amber-500/20"
                    title="Verified Employer"
                  >
                    ★ Verified
                  </span>
                </div>
                <p class="mt-2 text-base text-on-surface font-thin">{{ profileHandle }}</p>
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
              <p v-if="profileCategory" class="text-on-surface-variant">{{ profileCategory }}</p>
              <p v-if="profileBio">{{ profileBio }}</p>
              <p v-if="profileEducation" class="text-on-surface-variant">{{ profileEducation }}</p>
              <p v-if="profileStore.profileForm.jobType" class="text-on-surface-variant">
                {{ t('profilePage.lookingFor', { jobType: profileStore.profileForm.jobType }) }}
                <span v-if="expectedSalaryText"> • {{ expectedSalaryText }}</span>
              </p>
              <a v-if="profileStore.profileForm.website" class="inline-flex items-center gap-2 font-black text-primary"
                 :href="profileStore.profileForm.website.startsWith('http') ? profileStore.profileForm.website : `https://${profileStore.profileForm.website}`" rel="noopener noreferrer" target="_blank">
                🔗 {{ profileStore.profileForm.website }}
              </a>
            </div>

            <!-- Skills Tags (For Student) -->
            <div v-if="!isEmployer && profileStore.profileForm.skills?.length" class="mt-4 flex flex-wrap gap-2">
              <span
                  v-for="skill in profileStore.profileForm.skills"
                  :key="skill"
                  class="rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary"
              >
                {{ skill }}
              </span>
            </div>

            <!-- Availability (For Student) -->
            <div v-if="!isEmployer && availabilitySummary.length" class="mt-4 rounded-2xl bg-surface-container-high/40 p-4">
              <p class="text-xs font-black uppercase tracking-[0.12em] text-on-surface-variant mb-2">Weekly Availability</p>
              <div class="flex flex-wrap gap-3">
                <div 
                  v-for="item in availabilitySummary" 
                  :key="item.day" 
                  class="flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1.5 text-xs font-bold text-on-surface"
                >
                  <span class="font-black text-primary">{{ item.day }}:</span>
                  <span class="text-on-surface-variant">{{ item.slots }}</span>
                </div>
              </div>
            </div>

            <div v-if="followersCount > 0" class="mt-4 flex items-center gap-2">
              <div class="flex -space-x-2" v-if="followedByAvatars.length">
                <img
                    v-for="avatar in followedByAvatars"
                    :key="avatar"
                    :src="avatar"
                    :alt="t('profilePage.connectionAvatarAlt')"
                    class="h-8 w-8 rounded-full border-2 border-surface-container-low object-cover"
                />
              </div>
              <p class="text-xs font-black text-on-surface sm:text-sm">
                {{ `Connected with ${followersCount} follower${followersCount !== 1 ? 's' : ''} in your network` }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>

    <nav class="flex gap-1 rounded-[1.75rem] p-2 sm:inline-flex">
      <button
          v-for="tab in profileTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
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
      <!-- Empty State -->
      <div v-if="filteredGallery.length === 0" class="col-span-full flex flex-col items-center justify-center py-16 text-center px-4 bg-surface-container-low rounded-3xl border border-on-surface/5">
        <div class="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary mb-3">
          <component :is="emptyStateIcon" class="h-8 w-8 text-primary" />
        </div>
        <h3 class="font-display text-lg font-black text-on-surface">{{ emptyStateTitle }}</h3>
        <p class="mt-1 text-xs text-on-surface-variant/70 max-w-xs leading-relaxed">{{ emptyStateDesc }}</p>
      </div>

      <article
          v-else
          v-for="item in filteredGallery"
          :key="item.post?.id || item.title"
          class="group relative aspect-square overflow-hidden rounded-[1.25rem] bg-surface-container-low ring-1 ring-white/5 transition hover:ring-primary/40 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
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
        <div v-else class="grid h-full w-full place-items-center p-5 text-center bg-surface-container-high/30">
          <h3 class="font-display text-xl font-black tracking-[-0.04em] text-on-surface">{{ item.title }}</h3>
        </div>
      </article>
    </section>
  </section>
</template>
