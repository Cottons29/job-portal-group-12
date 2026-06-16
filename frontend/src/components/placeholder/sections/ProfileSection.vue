<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'
import api, { resolveUrl } from '@/lib/api'
import { usePostStore } from '@/stores/posts'
import {CheckCircleIcon, BriefcaseIcon,ClockIcon,ChatBubbleOvalLeftEllipsisIcon, SparklesIcon, TagIcon } from '@heroicons/vue/24/outline'

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
    return profileStore.profileForm.companyName || authStore.user?.user_name || (authStore.user?.phone ? 'User_' + authStore.user.phone.slice(-4) : 'Loading...')
  }
  return profileStore.profileForm.name || authStore.user?.user_name || (authStore.user?.phone ? 'User_' + authStore.user.phone.slice(-4) : 'Loading...')
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
const postTypeFilter = ref('all') // 'all', 'social', 'job'

const profileTabs = computed(() => [
  { id: 'posts', label: t('profilePage.posts'), active: activeTab.value === 'posts' },
  { id: 'highlights', label: t('profilePage.highlights') || 'Highlights', active: activeTab.value === 'highlights' },
  { id: 'tagged', label: t('profilePage.tagged') || 'Tagged', active: activeTab.value === 'tagged' },
  { id: 'savedJobs', label: t('profilePage.savedJobs') || 'SavedJobs', active: activeTab.value === 'savedJobs' },
  
])

const profilePosts = ref([])
const profileHighlights = ref([])
const profileTagged = ref([])
const savedJobs=ref([])


const filteredGallery = computed(() => {
  if (activeTab.value === 'highlights') {
    return profileHighlights.value
  } else if (activeTab.value === 'tagged') {
    return profileTagged.value
  }
  if (activeTab.value === 'savedJobs')
    return savedJobs.value
  
  let posts = profilePosts.value
  
  // Filter by post type for employers
  if (isEmployer.value && postTypeFilter.value !== 'all') {
    const isJob = postTypeFilter.value === 'job'
    posts = posts.filter(p => p.post?.isJob === isJob)
  }
  
  return posts
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
  await  fetchSavedJobs()
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
          id: app.id,
          status: app.status,
          coverLetter: app.coverLetter,
          createdAt: app.createdAt,
          post: postStore.mapPost(app.post),
          image: app.post.imageUrl,
          title: app.post.title
        }))
    }
  } catch (e) {
    console.error('Failed to fetch tagged posts:', e)
  }
}

async function fetchSavedJobs() {
  try {
    const { data } = await api.get('/posts/bookmarks')

    const postStore = usePostStore()

    savedJobs.value = (data.posts || []).map(p => ({
      post: postStore.mapPost(p),
      image: p.imageUrl,
      title: p.title
    }))
  } catch (e) {
    console.error('Failed to fetch saved jobs', e)
  }
}

async function respondToOffer(appId, response) {
  const confirmMsg = response === 'ACCEPT' 
    ? 'Are you sure you want to accept this job offer? This will notify the employer.'
    : 'Are you sure you want to decline this job offer?';
    
  if (!confirm(confirmMsg)) return;

  try {
    const { data } = await api.patch(`/applications/${appId}/respond`, { response });
    const app = profileTagged.value.find(a => a.id === appId);
    if (app) {
      app.status = data.application.status;
    }
  } catch (e) {
    console.error('Failed to respond to offer:', e);
    alert('Failed to respond to offer.');
  }
}

function exportCV() {
  window.print()
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
                  <span
                    v-else-if="!isEmployer && profileStore.profileForm.isStudentVerified"
                    class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/20"
                    title="Student Verified"
                  >
                    <!-- Heroicon added here -->
                    <CheckCircleIcon class="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Verified Student</span>
                  </span>

                 <span
                    v-else-if="!isEmployer && profileStore.profileForm.idCardUrl"
                    class="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700 ring-1 ring-amber-500/20"
                    title="Student verification is pending"
                  >
                    <!-- Heroicon component matching the amber theme -->
                    <ClockIcon class="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Verification Pending</span>
                  </span>

                <span
                  v-if="isEmployer && profileStore.profileForm.isVerified"
                  class="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-500 ring-1 ring-amber-500/20"
                  title="Verified Employer"
                >
                  <!-- Heroicon added here matching the amber styling -->
                  <BriefcaseIcon class="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Verified</span>
                </span>
             <span
              v-if="isEmployer && profileStore.profileForm.patentUrl && !profileStore.profileForm.isVerified"
              class="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-500 ring-1 ring-amber-500/20"
              title="Employer verification is pending"
            > 
              <!-- Replaced with ClockIcon for better visual clarity -->
              <ClockIcon class="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Pending</span>
            </span>


                </div>
                <p class="mt-2 text-base text-on-surface font-thin">{{ profileHandle }}</p>
              </div>

              <div class="flex items-center gap-2">
                <button
                    v-if="!isEmployer"
                    @click="exportCV"
                    class="inline-flex items-center justify-center gap-1.5 rounded-full bg-secondary text-on-primary hover:opacity-90 px-4 py-2 text-xs font-black transition cursor-pointer"
                    type="button"
                >
                  <span>📄</span>
                  <span>Export CV</span>
                </button>
                <RouterLink
                    class="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-black text-on-primary transition hover:opacity-90"
                    to="/settings"
                >
                  {{ t('profilePage.editProfile') }}
                </RouterLink>
              </div>
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
              <p v-if="profileBio"> {{  profileBio }}</p>
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
    <div>{{ profileTabs[3].id }}</div>
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

    <!-- Post Type Filter for Employers (Posts Tab Only) -->
    <div v-if="isEmployer && activeTab === 'posts'" class="flex rounded-2xl bg-surface-container-low p-1 max-w-[20rem]">
      <button
        type="button"
        @click="postTypeFilter = 'all'"
        :class="[
          'flex-1 text-center py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all',
          postTypeFilter === 'all' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
        ]"
      >
        All Posts
      </button>
      <button
        type="button"
        @click="postTypeFilter = 'social'"
        :class="[
          'flex-1 text-center py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all',
          postTypeFilter === 'social' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
        ]"
      >
        Social
      </button>
      <button
        type="button"
        @click="postTypeFilter = 'job'"
        :class="[
          'flex-1 text-center py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all',
          postTypeFilter === 'job' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
        ]"
      >
        Jobs
      </button>
    </div>
    <!-- Applications List for Students -->
    <div v-if="activeTab === 'tagged' && !isEmployer" class="space-y-4">
      <div v-if="filteredGallery.length === 0" class="flex flex-col items-center justify-center py-16 text-center px-4 bg-surface-container-low rounded-3xl border border-on-surface/5">
        <div class="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary mb-3">
          <component :is="emptyStateIcon" class="h-8 w-8 text-primary" />
        </div>
        <h3 class="font-display text-lg font-black text-on-surface">{{ emptyStateTitle }}</h3>
        <p class="mt-1 text-xs text-on-surface-variant/70 max-w-xs leading-relaxed">{{ emptyStateDesc }}</p>
      </div>

      <div
        v-else
        v-for="app in filteredGallery"
        :key="app.id"
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-surface-container-low border border-on-surface/5 transition duration-150 hover:border-primary/20"
      >
        <div class="flex items-start gap-4">
          <div class="h-12 w-12 shrink-0 grid place-items-center rounded-2xl bg-[#aecbfa] text-[#1a4fa3] font-black text-sm overflow-hidden">
            <img v-if="app.post?.authorAvatar" :src="app.post.authorAvatar" class="h-full w-full object-cover" />
            <span v-else>{{ app.post?.company?.charAt(0) || 'J' }}</span>
          </div>
          <div>
            <h4 class="font-display text-lg font-black text-on-surface hover:underline cursor-pointer" @click="$emit('openPost', app.post)">
              {{ app.post?.title || app.title }}
            </h4>
            <p class="text-xs font-bold text-on-surface-variant mt-0.5">
              {{ app.post?.company }} • Applied on {{ new Date(app.createdAt).toLocaleDateString() }}
            </p>
            <div v-if="app.status === 'ACCEPTED'" class="mt-2 text-xs font-semibold text-[#1f6c3b] bg-[#8fd99b]/15 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5">
            <!-- Heroicon component with matching text color -->
            <CheckCircleIcon class="w-4 h-4 text-[#1f6c3b] shrink-0" />
            <span>Congratulations! You got the job offer! Keep an eye on your inbox/messages.</span>
            </div>
            <div v-else-if="app.status === 'REJECTED'" class="mt-2 text-xs font-semibold text-red-700 bg-red-500/10 px-3 py-1.5 rounded-xl inline-block">
              Thank you for applying. The employer has decided to pursue other applicants for this role.
            </div>
            <div v-else-if="app.status === 'INTERVIEW'" class="mt-2 text-xs font-semibold text-[#1a4fa3] bg-[#aecbfa]/15 px-3 py-1.5 rounded-xl inline-block">
              Great news! The employer has invited you for an interview. Please check your messages.
            </div>
            <div v-else-if="app.status === 'REVIEWED'" class="mt-2 text-xs font-semibold text-[#1a4fa3] bg-[#aecbfa]/15 px-3 py-1.5 rounded-xl inline-block">
              Your application is currently under review by the hiring team.
            </div>
            <div v-else class="mt-2 text-xs font-semibold text-on-surface-variant/80 bg-surface-container-high px-3 py-1.5 rounded-xl inline-block">
              Application submitted and pending initial employer review.
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 sm:self-center">
          <span :class="[
            'px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full ring-1',
            app.status === 'ACCEPTED' ? 'bg-[#8fd99b]/20 text-[#1f6c3b] ring-[#8fd99b]/35' :
            app.status === 'HIRED' ? 'bg-emerald-500/20 text-emerald-700 ring-emerald-500/35' :
            app.status === 'DECLINED' ? 'bg-amber-500/20 text-amber-700 ring-amber-500/35' :
            app.status === 'REJECTED' ? 'bg-red-500/15 text-red-500 ring-red-500/25' :
            app.status === 'REVIEWED' ? 'bg-primary/10 text-primary ring-primary/20' :
            app.status === 'INTERVIEW' ? 'bg-[#aecbfa]/25 text-[#1a4fa3] ring-[#aecbfa]/35' :
            'bg-surface-container-highest text-on-surface-variant ring-on-surface/5'
          ]">
            {{ app.status }}
          </span>
          <template v-if="app.status === 'ACCEPTED'">
            <button
              type="button"
              class="rounded-full bg-emerald-500 hover:bg-emerald-600 px-3.5 py-1.5 text-xs font-black text-white transition cursor-pointer"
              @click="respondToOffer(app.id, 'ACCEPT')"
            >
              Accept Offer
            </button>
            <button
              type="button"
              class="rounded-full bg-surface-container-high hover:bg-surface-container-highest px-3.5 py-1.5 text-xs font-black text-red-500 transition cursor-pointer"
              @click="respondToOffer(app.id, 'DECLINE')"
            >
              Decline
            </button>
          </template>
          <button
            v-else
            type="button"
            class="rounded-full bg-surface-container-high hover:bg-surface-container-highest px-4 py-2 text-xs font-black text-on-surface transition cursor-pointer"
            @click="$emit('openPost', app.post)"
          >
            View Job
          </button>
        </div>
      </div>
    </div>
    <!-- Render saved jobs for student -->
    <div v-if="activeTab === 'savedJobs' && !isEmployer" class="space-y-4">
      
      <div v-if="filteredGallery.length === 0" class="flex flex-col items-center justify-center py-16 text-center px-4 bg-surface-container-low rounded-3xl border border-on-surface/5">
        <div class="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary mb-3">
          <component :is="emptyStateIcon" class="h-8 w-8 text-primary" />
        </div>
        <h3 class="font-display text-lg font-black text-on-surface">No saved jobs</h3>
        <p class="mt-1 text-xs text-on-surface-variant/70 max-w-xs leading-relaxed">Bookmarked jobs will appear here for quick access.</p>
      </div>

      <div
        v-else
        v-for="item in filteredGallery"
        :key="item.post?.id"
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-surface-container-low border border-on-surface/5 transition duration-150 hover:border-primary/20"
      >
        <div class="flex items-start gap-4">
          <div class="h-12 w-12 shrink-0 grid place-items-center rounded-2xl bg-[#aecbfa] text-[#1a4fa3] font-black text-sm overflow-hidden">
            <img v-if="item.post?.authorAvatar" :src="resolveUrl(item.post.authorAvatar)" class="h-full w-full object-cover" />
            <span v-else>{{ item.post?.company?.charAt(0) || 'J' }}</span>
          </div>
          <div>
            <h4 class="font-display text-lg font-black text-on-surface hover:underline cursor-pointer" @click="$emit('openPost', item.post)">
              {{ item.post?.title || item.title }}
            </h4>
            <p class="text-xs font-bold text-on-surface-variant mt-0.5">
              {{ item.post?.company || 'Employer' }} • {{ item.post?.location || 'Phnom Penh' }}
            </p>
            <div class="mt-2 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-xl inline-block">
              {{ item.post?.salary || 'Competitive Pay' }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 sm:self-center">
          <button
            type="button"
            class="rounded-full bg-primary hover:opacity-90 px-5 py-2.5 text-xs font-black text-on-primary transition cursor-pointer"
            @click="$emit('openPost', item.post)"
          >
            View & Apply
          </button>
        </div>
      </div>
    </div>

    

    <section v-else class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
          <h3 class="font-display text-xl font-black tracking-[-0.04em] text-on-surface"> {{ item.title }} </h3>
          <!-- <h3 class="font-display text-xl font-black tracking-[-0.04em] text-on-surface"> {{ item }} </h3> -->

        </div>
         
      </article>
  
    </section>
    
  </section>

  <!-- ═══ PRINT-ONLY CV RESUME TEMPLATE ═══ -->
  <div v-if="!isEmployer" id="cv-print-template">
    <!-- Resume Header -->
    <div class="resume-header">
      <div class="resume-header-left">
        <img v-if="profileStore.profileForm.avatar" :src="resolveUrl(profileStore.profileForm.avatar)" class="resume-avatar" />
        <div v-else class="resume-avatar-placeholder">{{ initials }}</div>
        <div>
          <h1 class="resume-name">{{ displayName }}</h1>
          <p class="resume-subtitle">{{ profileStore.profileForm.major }} Student • {{ profileStore.profileForm.university }}</p>
          <p class="resume-handle">{{ profileHandle }}</p>
        </div>
      </div>
      <div v-if="profileStore.profileForm.isStudentVerified" class="resume-badge">
        ✓ Verified Student
      </div>
    </div>

    <!-- Resume Content Grid -->
    <div class="resume-grid">
      <!-- Left Sidebar Column -->
      <div class="resume-col-sidebar">
        <!-- Contact Details Section -->
        <div class="resume-section">
          <h3 class="resume-section-title">Contact Info</h3>
          <ul class="resume-contact-list">
            <li v-if="profileStore.profileForm.phone">📞 {{ profileStore.profileForm.phone }}</li>
            <li v-if="profileStore.profileForm.email">✉️ {{ profileStore.profileForm.email }}</li>
            <li v-if="profileStore.profileForm.website">🔗 {{ profileStore.profileForm.website }}</li>
          </ul>
        </div>

        <!-- Skills Section -->
        <div class="resume-section" v-if="profileStore.profileForm.skills?.length">
          <h3 class="resume-section-title">Core Skills</h3>
          <div class="resume-skills-grid">
            <span v-for="skill in profileStore.profileForm.skills" :key="skill" class="resume-skill-tag">
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Availability Section -->
        <div class="resume-section" v-if="availabilitySummary.length">
          <h3 class="resume-section-title">Weekly Availability</h3>
          <div class="resume-availability-list">
            <div v-for="item in availabilitySummary" :key="item.day" class="resume-avail-row">
              <span class="resume-avail-day">{{ item.day }}:</span>
              <span class="resume-avail-slots">{{ item.slots }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Main Column -->
      <div class="resume-col-main">
        <!-- Bio / Profile Summary -->
        <div class="resume-section">
          <h3 class="resume-section-title">Professional Summary</h3>
          <p class="resume-bio">{{ profileStore.profileForm.bio || 'Motivated student seeking part-time or internship opportunities to apply skills and gain practical industry experience.' }}</p>
        </div>

        <!-- Education Section -->
        <div class="resume-section">
          <h3 class="resume-section-title">Education</h3>
          <div class="resume-edu-card">
            <h4 class="resume-edu-uni">{{ profileStore.profileForm.university || 'University' }}</h4>
            <p class="resume-edu-major">Bachelor of Science in {{ profileStore.profileForm.major || 'Field of Study' }}</p>
            <p class="resume-edu-year" v-if="profileStore.profileForm.yearLevel">Current Status: Year {{ profileStore.profileForm.yearLevel }} Student</p>
          </div>
        </div>

        <!-- Career Preferences Section -->
        <div class="resume-section">
          <h3 class="resume-section-title">Career Preferences</h3>
          <div class="resume-prefs-grid">
            <div>
              <span class="resume-pref-label">Preferred Placement:</span>
              <span class="resume-pref-value capitalize">{{ profileStore.profileForm.jobType || 'Any Part-Time / Internship' }}</span>
            </div>
            <div v-if="expectedSalaryText">
              <span class="resume-pref-label">Expected Salary:</span>
              <span class="resume-pref-value">{{ expectedSalaryText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#cv-print-template {
  display: none;
}

@media print {
  body * {
    visibility: hidden !important;
  }
  
  #cv-print-template, #cv-print-template * {
    visibility: visible !important;
  }
  
  #cv-print-template {
    display: block !important;
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    min-height: 100% !important;
    background: white !important;
    color: #0b1c30 !important;
    font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  
  .resume-header {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    border-bottom: 2px solid #e2e8f0 !important;
    padding-bottom: 20px !important;
    margin-bottom: 25px !important;
  }
  
  .resume-header-left {
    display: flex !important;
    align-items: center !important;
    gap: 20px !important;
  }
  
  .resume-avatar {
    width: 80px !important;
    height: 80px !important;
    border-radius: 50% !important;
    object-fit: cover !important;
    border: 2px solid #e2e8f0 !important;
  }
  
  .resume-avatar-placeholder {
    width: 80px !important;
    height: 80px !important;
    border-radius: 50% !important;
    background: #2563eb !important;
    color: white !important;
    display: grid !important;
    place-items: center !important;
    font-size: 24px !important;
    font-weight: 900 !important;
  }
  
  .resume-name {
    font-size: 26px !important;
    font-weight: 800 !important;
    color: #0f172a !important;
    margin: 0 0 4px 0 !important;
    letter-spacing: -0.02em !important;
  }
  
  .resume-subtitle {
    font-size: 14px !important;
    font-weight: 600 !important;
    color: #475569 !important;
    margin: 0 !important;
  }
  
  .resume-handle {
    font-size: 12px !important;
    color: #64748b !important;
    margin: 2px 0 0 0 !important;
  }
  
  .resume-badge {
    background: #ecfdf5 !important;
    color: #065f46 !important;
    border: 1px solid #a7f3d0 !important;
    font-size: 11px !important;
    font-weight: 800 !important;
    text-transform: uppercase !important;
    padding: 6px 12px !important;
    border-radius: 9999px !important;
  }
  
  .resume-grid {
    display: grid !important;
    grid-template-columns: 240px 1fr !important;
    gap: 30px !important;
  }
  
  .resume-col-sidebar {
    border-right: 1px solid #f1f5f9 !important;
    padding-right: 20px !important;
  }
  
  .resume-section {
    margin-bottom: 25px !important;
  }
  
  .resume-section-title {
    font-size: 13px !important;
    font-weight: 800 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.1em !important;
    color: #1e3a8a !important;
    border-bottom: 1.5px solid #e2e8f0 !important;
    padding-bottom: 6px !important;
    margin: 0 0 12px 0 !important;
  }
  
  .resume-contact-list {
    list-style: none !important;
    padding: 0 !important;
    margin: 0 !important;
    font-size: 12px !important;
    color: #334155 !important;
  }
  
  .resume-contact-list li {
    margin-bottom: 8px !important;
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
  }
  
  .resume-skills-grid {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 6px !important;
  }
  
  .resume-skill-tag {
    background: #f8fafc !important;
    color: #334155 !important;
    border: 1px solid #e2e8f0 !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    padding: 4px 8px !important;
    border-radius: 6px !important;
  }
  
  .resume-avail-row {
    font-size: 11px !important;
    margin-bottom: 6px !important;
    display: flex !important;
    justify-content: space-between !important;
  }
  
  .resume-avail-day {
    font-weight: 800 !important;
    color: #1e293b !important;
  }
  
  .resume-avail-slots {
    color: #475569 !important;
  }
  
  .resume-bio {
    font-size: 13px !important;
    line-height: 1.6 !important;
    color: #334155 !important;
    margin: 0 !important;
    white-space: pre-line !important;
  }
  
  .resume-edu-card {
    background: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
    padding: 14px !important;
    border-radius: 12px !important;
  }
  
  .resume-edu-uni {
    font-size: 14px !important;
    font-weight: 800 !important;
    color: #0f172a !important;
    margin: 0 0 4px 0 !important;
  }
  
  .resume-edu-major {
    font-size: 12px !important;
    font-weight: 600 !important;
    color: #475569 !important;
    margin: 0 !important;
  }
  
  .resume-edu-year {
    font-size: 11px !important;
    color: #64748b !important;
    margin: 6px 0 0 0 !important;
  }
  
  .resume-prefs-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 15px !important;
  }
  
  .resume-pref-label {
    display: block !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    color: #64748b !important;
    text-transform: uppercase !important;
    margin-bottom: 2px !important;
  }
  
  .resume-pref-value {
    font-size: 13px !important;
    font-weight: 800 !important;
    color: #0f172a !important;
  }
  
  @page {
    size: A4 !important;
    margin: 15mm !important;
  }
}
</style>
