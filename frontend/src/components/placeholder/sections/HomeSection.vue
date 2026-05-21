<script setup>
import { computed, onMounted, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PlusCircleIcon, BriefcaseIcon, BuildingStorefrontIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/vue/24/outline'
import { usePostStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { useStoryStore } from '@/stores/stories'
import api, { resolveUrl } from '@/lib/api'
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
  const name = profileStore.profileForm.name || profileStore.profileForm.companyName || auth.user?.phone || 'ME'
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
        name: name || u.phone || 'User',
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
  try {
    await api.post(`/follows/toggle/${userId}`)
    suggestions.value = suggestions.value.filter(s => s.id !== userId)
    profileStore.fetchPersonalInfo()
  } catch (err) {
    console.error('Failed to toggle follow:', err)
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
      <TransitionGroup name="post-fade" appear>
        <PostCard 
          v-for="post in postStore.posts" 
          :key="post.id" 
          :post="post" 
          :user-role="auth.user?.role"
          :user-id="auth.user?.id"
          :applied-post-ids="postStore.appliedPostIds"
          @open="$emit('open-post', $event)"
          @apply="postStore.handlePostApply($event)"
          @view-applicants="$emit('view-applicants', $event)"
          @engagement-change="postStore.mergeEngagement($event)"
          @show-profile="profileStore.showUserProfile($event)"
        />
      </TransitionGroup>
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
