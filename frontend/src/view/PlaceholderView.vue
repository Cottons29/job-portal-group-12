<template>
  <div class="min-h-screen bg-[#18191b] text-on-surface lg:overflow-hidden">
    <div class="mx-auto flex min-h-screen max-w-[1440px] bg-surface">
      <PlaceholderSidebar
          :items="sidebarItems"
          :show-labels="showSidebarLabels"
          :applied-theme="appliedTheme"
          @toggle-labels="showSidebarLabels = !showSidebarLabels"
          @toggle-theme="toggleThemeMode"
      />

      <main class="flex-1 bg-surface px-4 pb-28 pt-5 sm:px-6 lg:h-screen lg:overflow-y-auto lg:px-8 lg:pb-10">
        <header class="stickyV -mx-4 mb-6 bg-surface/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-black uppercase tracking-[0.22em] text-primary">Home feed</p>
              <h1 class="font-display text-3xl font-black tracking-[-0.04em] text-on-surface sm:text-4xl">
                Welcome back, student.
              </h1>
            </div>
            <div class="hidden flex-1 justify-end md:flex">
              <label
                  class="flex w-full max-w-sm items-center gap-3 rounded-full bg-surface-container-low px-5 py-3 text-sm font-bold text-on-surface-variant">
                <MagnifyingGlassIcon class="h-5 w-5 text-primary"/>
                <input
                    class="w-full bg-transparent outline-none placeholder:text-on-surface-variant/70"
                    placeholder="Search jobs, people, companies"
                />
              </label>
            </div>
          </div>
        </header>

        <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <section class="min-w-0 space-y-6">
            <StoryStrip :stories="stories"/>
            <ComposeCard :actions="composeActions"/>
            <PostCard v-for="post in posts" :key="post.title" :post="post"/>
          </section>

          <aside class="space-y-6 xl:sticky xl:top-28 xl:h-fit">
            <FocusPanel :cards="focusCards"/>
            <SuggestionsPanel :suggestions="suggestions"/>
          </aside>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'

import ComposeCard from '@/components/placeholder/ComposeCard.vue'
import FocusPanel from '@/components/placeholder/FocusPanel.vue'
import PlaceholderSidebar from '@/components/placeholder/PlaceholderSidebar.vue'
import PostCard from '@/components/placeholder/PostCard.vue'
import StoryStrip from '@/components/placeholder/StoryStrip.vue'
import SuggestionsPanel from '@/components/placeholder/SuggestionsPanel.vue'
import {useThemeMode} from '@/composables/useThemeMode'
import {
  BellIcon,
  BriefcaseIcon,
  BuildingStorefrontIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline'

const showSidebarLabels = ref(false)
const {appliedTheme, setThemePreference} = useThemeMode()

function toggleThemeMode() {
  setThemePreference(appliedTheme.value === 'dark' ? 'light' : 'dark')
}

const sidebarItems = [
  {label: 'Home', icon: HomeIcon, bg: 'bg-[#a8c0ff]', color: 'text-[#243c78]', active: true},
  {label: 'Search', icon: MagnifyingGlassIcon, bg: 'bg-[#8fd99b]', color: 'text-[#1f6c3b]'},
  {label: 'Message', icon: ChatBubbleOvalLeftEllipsisIcon, bg: 'bg-[#8ccaff]', color: 'text-[#235d84]'},
  {label: 'Notification', icon: BellIcon, bg: 'bg-[#d7b7ff]', color: 'text-[#5b36a8]'},
  {label: 'Create', icon: PlusCircleIcon, bg: 'bg-[#f8a9dc]', color: 'text-[#9b1f70]'},
  {label: 'Profile', icon: UserCircleIcon, bg: 'bg-[#ffc28e]', color: 'text-[#83460e]'},
]

const stories = [
  {name: 'Brown Coffee', ring: 'bg-[#aecbfa]'},
  {name: 'RUPP', ring: 'bg-[#d7b7ff]'},
  {name: 'Wing Bank', ring: 'bg-[#8fd99b]'},
  {name: 'Chip Mong', ring: 'bg-[#ffc28e]'},
  {name: 'Smart', ring: 'bg-[#8ccaff]'},
  {name: 'Pi Pay', ring: 'bg-[#f8a9dc]'},
]

const composeActions = [
  {label: 'Post', icon: PlusCircleIcon, color: 'text-[#1a4fa3]'},
  {label: 'Job alert', icon: BriefcaseIcon, color: 'text-[#246b36]'},
  {label: 'Company', icon: BuildingStorefrontIcon, color: 'text-[#8a4a11]'},
]

const posts = [
  {
    company: 'Brown Coffee Careers',
    meta: 'BKK1, Phnom Penh · 18 min ago',
    badge: 'Hiring now',
    title: 'Weekend barista shift lead for students',
    desc: 'A flexible weekend role for students who love hospitality, teamwork, and learning customer experience in a fast-growing local brand.',
    tags: ['Part-time', '$18.50/hr', 'Weekend shifts'],
    logoBg: 'bg-[#aecbfa]',
    logoText: 'text-[#1a4fa3]',
    heroBg: 'bg-[#aecbfa]/35',
  },
  {
    company: 'RUPP Writing Center',
    meta: 'Campus network · 2h ago',
    badge: 'Campus opportunity',
    title: 'Peer writing consultant applications are open',
    desc: 'Help other students structure essays, improve grammar, and build confidence while strengthening your own communication portfolio.',
    tags: ['Tutoring', '$15/hr', 'On campus'],
    logoBg: 'bg-[#d7b7ff]',
    logoText: 'text-[#6a39b8]',
    heroBg: 'bg-[#d7b7ff]/35',
  },
]

const focusCards = [
  {label: 'Saved jobs', value: '8', desc: 'Three saved roles close in the next 48 hours.'},
  {label: 'Applications', value: '5', desc: 'Two employers viewed your student profile today.'},
  {label: 'Profile strength', value: '86%', desc: 'Add availability to improve match ranking.'},
]

const suggestions = [
  {name: 'Sokha Recruiter', role: 'Hospitality roles near BKK1', bg: 'bg-[#8fd99b]', text: 'text-[#246b36]'},
  {name: 'Dara Mentor', role: 'RUPP alumni · Product design', bg: 'bg-[#d7b7ff]', text: 'text-[#6a39b8]'},
  {name: 'Smart Careers', role: 'Internships and campus events', bg: 'bg-[#8ccaff]', text: 'text-[#235d84]'},
]
</script>
