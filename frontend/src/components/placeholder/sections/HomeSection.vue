<script setup>
import { computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { PlusCircleIcon, BriefcaseIcon, BuildingStorefrontIcon } from '@heroicons/vue/24/outline'
import { usePostStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import StoryStrip from '../StoryStrip.vue'
import ComposeCard from '../ComposeCard.vue'
import PostCard from '../PostCard.vue'
import FocusPanel from '../FocusPanel.vue'
import SuggestionsPanel from '../SuggestionsPanel.vue'

const { t } = useI18n()
const postStore = usePostStore()
const auth = useAuthStore()
const profileStore = useProfileStore()

const stories = [
  {name: 'Brown Coffee', ring: 'bg-[#aecbfa]'},
  {name: 'RUPP', ring: 'bg-[#d7b7ff]'},
  {name: 'Wing Bank', ring: 'bg-[#8fd99b]'},
  {name: 'Chip Mong', ring: 'bg-[#ffc28e]'},
  {name: 'Smart', ring: 'bg-[#8ccaff]'},
  {name: 'Pi Pay', ring: 'bg-[#f8a9dc]'},
]

const composeActions = computed(() => [
  {label: t('home.post'), icon: PlusCircleIcon, color: 'text-[#1a4fa3]'},
  {label: t('home.jobAlert'), icon: BriefcaseIcon, color: 'text-[#246b36]'},
  {label: t('home.company'), icon: BuildingStorefrontIcon, color: 'text-[#8a4a11]'},
])

const focusCards = computed(() => [
  {label: t('home.savedJobs'), value: '8', desc: 'Three saved roles close in the next 48 hours.'},
  {label: t('home.applications'), value: '5', desc: 'Two employers viewed your student profile today.'},
  {label: t('home.profileStrength'), value: '86%', desc: 'Add availability to improve match ranking.'},
])

const suggestions = [
  {name: 'Sokha Recruiter', role: 'Hospitality roles near BKK1', bg: 'bg-[#8fd99b]', text: 'text-[#246b36]'},
  {name: 'Dara Mentor', role: 'RUPP alumni · Product design', bg: 'bg-[#d7b7ff]', text: 'text-[#6a39b8]'},
  {name: 'Smart Careers', role: 'Internships and campus events', bg: 'bg-[#8ccaff]', text: 'text-[#235d84]'},
]

defineEmits(['open-post', 'apply', 'view-applicants', 'engagement-change'])

onMounted(() => {
  postStore.fetchPosts()
  postStore.fetchAppliedPosts()
})
</script>

<template>
  <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
    <section class="min-w-0 space-y-6">
      <StoryStrip :stories="stories"/>
      <ComposeCard :actions="composeActions"/>
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
      <SuggestionsPanel :suggestions="suggestions"/>
    </aside>
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
