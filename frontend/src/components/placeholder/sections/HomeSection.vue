<script setup>
import { computed, onMounted, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PlusCircleIcon, BriefcaseIcon, BuildingStorefrontIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/vue/24/outline'
import { usePostStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { useStoryStore } from '@/stores/stories'
import api, { resolveUrl } from '@/lib/api'
import { Building2, MapPin, Banknote, Bookmark } from 'lucide-vue-next'
import StoryStrip from '../StoryStrip.vue'
import ComposeCard from '../ComposeCard.vue'
import PostCard from '../PostCard.vue'
import FocusPanel from '../FocusPanel.vue'
import SuggestionsPanel from '../SuggestionsPanel.vue'
import AddStoryModal from './AddStoryModal.vue'
import StoryViewerModal from './StoryViewerModal.vue'

const { t } = useI18n()
const postStore = usePostStore()
const auth = useAuthStore()
const profileStore = useProfileStore()
const storyStore = useStoryStore()

const isAddStoryModalOpen = ref(false)
const selectedStoryGroup = ref(null)
const activeSection = ref('feed')

const normalFeedPosts = computed(() => postStore.posts.filter(p => !p.isJob))
const jobPosts = computed(() => postStore.posts.filter(p => p.isJob))

const composeActions = computed(() => {
  const isEmployer = auth.user?.role?.toLowerCase() === 'employer'
  if (isEmployer) {
    return [
      {label: t('home.post') || 'Post Update', icon: PlusCircleIcon, color: 'text-[#1a4fa3]', to: '/create'},
      {label: t('navbar.forEmployers') || 'Post a Job', icon: BriefcaseIcon, color: 'text-[#246b36]', to: '/create'},
      {label: t('settings.personal.companyName') || 'My Company', icon: BuildingStorefrontIcon, color: 'text-[#8a4a11]', to: '/profile'},
    ]
  } else {
    return [
      {label: t('home.post') || 'Post', icon: PlusCircleIcon, color: 'text-[#1a4fa3]', to: '/create'},
      {label: t('navbar.browseJobs') || 'Find Jobs', icon: BriefcaseIcon, color: 'text-[#246b36]', to: '/search'},
      {label: t('sidebar.messages') || 'Messages', icon: ChatBubbleOvalLeftEllipsisIcon, color: 'text-[#8a4a11]', to: '/messages'},
    ]
  }
})

const userInitials = computed(() => {
  const name = profileStore.profileForm.name || profileStore.profileForm.companyName || auth.user?.user_name || (auth.user?.phone ? 'User_' + auth.user.phone.slice(-4) : 'ME')
  return name.charAt(0).toUpperCase()
})

const focusCards = computed(() => {
  if (profileStore.focusStats && profileStore.focusStats.length > 0) {
    return profileStore.focusStats.map(stat => {
      let label = stat.label
      if (stat.label === 'Saved jobs') label = t('home.savedJobs')
      else if (stat.label === 'Applications') label = stat.label // Keep dynamic backend string for Applications
      else if (stat.label === 'Profile strength') label = t('home.profileStrength')
      return {
        label,
        value: stat.value,
        desc: stat.desc
      }
    })
  }

  return [
    {label: t('home.savedJobs'), value: '0', desc: 'No saved roles closing soon.'},
    {label: t('home.applications'), value: '0', desc: 'No profile views today.'},
    {label: t('home.profileStrength'), value: '0%', desc: 'Complete your profile details to stand out.'},
  ]
})



const suggestions = ref([])
const loadingSuggestions = ref(false)

async function fetchSuggestions() {
  loadingSuggestions.value = true
  try {
    const res = await api.get('/follows/suggestions')
    suggestions.value = (res.data.suggestions || []).map((u, idx) => {
      const isEmp = u.role?.toLowerCase() === 'employer'
      const name = isEmp ? u.companyName : u.fullName
      const role = isEmp ? 'Employer' : (u.university || 'Student')
      
      const bgs = ['bg-[#8fd99b]', 'bg-[#d7b7ff]', 'bg-[#8ccaff]', 'bg-[#f8a9dc]', 'bg-[#facc15]']
      const texts = ['text-[#246b36]', 'text-[#6a39b8]', 'text-[#235d84]', 'text-[#9b1f70]', 'text-[#8a6d05]']
      
      return {
        id: u.id,
        name: name || u.user_name || (u.phone ? 'User_' + u.phone.slice(-4) : 'User'),
        role: role,
        avatar: u.profileImageUrl || u.logoUrl || '',
        bg: bgs[idx % bgs.length],
        text: texts[idx % texts.length]
      }
    })
  } catch (err) {
    console.error('Failed to fetch suggestions:', err)
  } finally {
    loadingSuggestions.value = false
  }
}

async function handleConnect(userId) {
  const previousSuggestions = [...suggestions.value]
  suggestions.value = suggestions.value.filter(s => s.id !== userId)
  try {
    await api.post(`/follows/toggle/${userId}`)
    profileStore.fetchPersonalInfo()
  } catch (err) {
    suggestions.value = previousSuggestions
    console.error('Failed to toggle follow:', err)
  }
}

async function toggleBookmark(post) {
  const previousBookmarked = post.bookmarkedByMe
  const previousCount = post.bookmarkCount

  // Optimistic update
  post.bookmarkedByMe = !previousBookmarked
  post.bookmarkCount = (previousCount || 0) + (post.bookmarkedByMe ? 1 : -1)

  try {
    const { data } = await api.post(`/posts/${post.id}/bookmark`)
    post.bookmarkedByMe = data.bookmarked
    post.bookmarkCount = data.bookmarkCount
  } catch (error) {
    // Rollback on error
    post.bookmarkedByMe = previousBookmarked
    post.bookmarkCount = previousCount
    console.error('Failed to toggle bookmark', error)
  }
}

defineEmits(['open-post', 'apply', 'view-applicants', 'engagement-change'])

onMounted(() => {
  postStore.fetchPosts()
  postStore.fetchAppliedPosts()
  profileStore.fetchPersonalInfo()
  storyStore.fetchStories()
  fetchSuggestions()
})
</script>

<template>
  <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
    <section class="min-w-0 space-y-6">
      <StoryStrip
        :stories="storyStore.stories"
        :user-avatar="resolveUrl(profileStore.profileForm.avatar)"
        :user-initials="userInitials"
        :current-user-id="auth.user?.id"
        @add-story="isAddStoryModalOpen = true"
        @view-story="selectedStoryGroup = $event"
      />
      <ComposeCard 
        :actions="composeActions" 
        :imageUrl="resolveUrl(profileStore.profileForm.avatar)"
        :initials="userInitials"
      />
      <p v-if="postStore.postsError" class="rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
        {{ postStore.postsError }}
      </p>

      <!-- Section Navigation Tabs -->
      <div class="flex items-center justify-between border-b border-on-surface/5 pb-px mb-2">
        <div class="flex gap-6">
          <button
            @click="activeSection = 'feed'"
            :class="[
              'relative pb-4 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2',
              activeSection === 'feed'
                ? 'text-primary'
                : 'text-on-surface-variant/75 hover:text-on-surface'
            ]"
          >
            <span>💬 Community Feed</span>
            <span 
              :class="[
                'rounded-full px-2 py-0.5 text-[10px] font-black transition-all',
                activeSection === 'feed'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-on-surface/5 text-on-surface-variant/70'
              ]"
            >
              {{ normalFeedPosts.length }}
            </span>
            <span v-if="activeSection === 'feed'" class="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
          </button>
          <button
            @click="activeSection = 'jobs'"
            :class="[
              'relative pb-4 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2',
              activeSection === 'jobs'
                ? 'text-primary'
                : 'text-on-surface-variant/75 hover:text-on-surface'
            ]"
          >
            <span>💼 Job Opportunities</span>
            <span 
              :class="[
                'rounded-full px-2 py-0.5 text-[10px] font-black transition-all',
                activeSection === 'jobs'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-on-surface/5 text-on-surface-variant/70'
              ]"
            >
              {{ jobPosts.length }}
            </span>
            <span v-if="activeSection === 'jobs'" class="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
          </button>
        </div>
      </div>

      <!-- Community Feed Section -->
      <div v-if="activeSection === 'feed'">
        <TransitionGroup name="post-fade" appear>
          <PostCard 
            v-for="post in normalFeedPosts" 
            :key="post.id" 
            :post="post" 
            :user-role="auth.user?.role"
            :user-id="auth.user?.id"
            :applied-post-ids="postStore.appliedPostIds"
            @open="$emit('open-post', $event)"
            @apply="$emit('apply', $event)"
            @view-applicants="$emit('view-applicants', $event)"
            @engagement-change="postStore.mergeEngagement($event)"
            @show-profile="profileStore.showUserProfile($event)"
          />
        </TransitionGroup>
        
        <div 
          v-if="!postStore.postsLoading && normalFeedPosts.length === 0"
          class="rounded-3xl border border-on-surface/5 bg-surface-container-lowest p-8 text-center"
        >
          <p class="text-sm font-semibold text-on-surface-variant/70">No community updates yet.</p>
        </div>
      </div>

      <!-- Beautifully Designed Job Grid Section -->
      <div v-else-if="activeSection === 'jobs'">
        <div class="grid gap-5 sm:grid-cols-2">
          <div 
            v-for="job in jobPosts" 
            :key="job.id"
            class="group flex flex-col justify-between rounded-3xl border border-on-surface/5 bg-surface-container-lowest p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/20"
          >
            <div>
              <div class="flex items-start justify-between gap-4 mb-4">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
                  <Building2 class="h-6 w-6" />
                </div>
                <div class="flex items-center gap-2">
                  <div class="flex flex-wrap justify-end gap-1.5">
                    <span
                      v-if="job.jobType"
                      class="rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-primary ring-1 ring-primary/20"
                    >
                      {{ job.jobType }}
                    </span>
                    <span
                      v-if="job.badge"
                      class="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-600 ring-1 ring-amber-500/20"
                    >
                      {{ job.badge }}
                    </span>
                  </div>

                  <!-- Bookmark Button -->
                  <button
                    @click.stop="toggleBookmark(job)"
                    class="rounded-xl p-2 text-on-surface-variant hover:bg-surface-container-high transition-colors focus:outline-none"
                    aria-label="Bookmark Job"
                  >
                    <Bookmark
                      :class="[
                        'h-4 w-4 transition-all duration-300',
                        job.bookmarkedByMe ? 'fill-primary text-primary scale-110' : 'text-on-surface-variant/50 hover:text-on-surface-variant'
                      ]"
                    />
                  </button>
                </div>
              </div>

              <h3 class="font-display text-base font-black text-on-surface leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {{ job.title }}
              </h3>
              <p class="mt-1 text-xs font-bold text-on-surface-variant/70 mb-4">{{ job.company }}</p>

              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-on-surface-variant/60 mb-4">
                <span class="inline-flex items-center gap-1">
                  <MapPin class="h-3.5 w-3.5 text-primary" />
                  {{ job.location || 'Cambodia' }}
                </span>
                <span class="h-1 w-1 rounded-full bg-on-surface/10"></span>
                <span class="inline-flex items-center gap-1 text-primary font-black">
                  <Banknote class="h-3.5 w-3.5" />
                  {{ job.salary || 'Negotiable' }}
                </span>
              </div>
            </div>

            <div class="mt-4 flex items-center gap-2">
              <RouterLink
                :to="{ name: 'job-detail', params: { id: job.id } }"
                class="flex-1 rounded-2xl bg-primary/10 py-3 text-center text-xs font-black text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-on-primary shadow-sm"
              >
                Apply Now
              </RouterLink>
            </div>
          </div>
        </div>

        <div 
          v-if="!postStore.postsLoading && jobPosts.length === 0"
          class="rounded-3xl border border-on-surface/5 bg-surface-container-lowest p-8 text-center"
        >
          <p class="text-sm font-semibold text-on-surface-variant/70">No job opportunities posted yet.</p>
        </div>
      </div>
      <p v-if="postStore.postsLoadingMore"
         class="rounded-2xl bg-surface-container-low px-4 py-3 text-sm font-bold text-on-surface-variant">
        Loading more posts...
      </p>
      <p v-else-if="postStore.posts.length && !postStore.postsHasMore"
         class="rounded-2xl bg-surface-container-low px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
        You reached the end
      </p>
    </section>

    <aside class="space-y-6 xl:sticky xl:top-28 xl:h-fit">
      <FocusPanel :cards="focusCards"/>
      <SuggestionsPanel :suggestions="suggestions" @connect="handleConnect"/>
    </aside>

    <AddStoryModal
      v-if="isAddStoryModalOpen"
      @close="isAddStoryModalOpen = false"
    />

    <StoryViewerModal
      v-if="selectedStoryGroup"
      :story-group="selectedStoryGroup"
      @close="selectedStoryGroup = null"
    />
  </div>
</template>

<style scoped>
.post-fade-enter-active,
.post-fade-leave-active {
  transition: all 0.5s ease;
}

.post-fade-enter-from,
.post-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
