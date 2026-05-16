<template>
  <div class="min-h-screen bg-surface text-on-surface lg:overflow-hidden">
    <div class="mx-auto flex min-h-screen w-full bg-surface">
      <PlaceholderSidebar
          :items="sidebarItems"
          :show-labels="showSidebarLabels"
          :applied-theme="appliedTheme"
          @toggle-labels="showSidebarLabels = !showSidebarLabels"
          @toggle-theme="toggleThemeMode"
      />

      <main ref="mainScrollContainer"
            class="flex-1 bg-surface px-4 pb-28 pt-5 sm:px-6 lg:h-screen lg:overflow-y-auto lg:px-8 lg:pb-10">
        <header class="stickyV -mx-4 mb-6 bg-surface/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-xs font-black uppercase tracking-[0.22em] text-primary">{{ pageContent.eyebrow }}</p>
              <h1 class="font-display text-3xl font-black tracking-[-0.04em] text-on-surface sm:text-4xl">
                {{ pageContent.title }}
              </h1>
              <p v-if="pageContent.description" class="mt-2 max-w-2xl text-sm font-semibold text-on-surface-variant">
                {{ pageContent.description }}
              </p>
            </div>
            <div v-if="activePage === 'home'" class="hidden flex-1 justify-end md:flex">
              <label
                  class="flex w-full max-w-sm items-center gap-3 rounded-full bg-surface-container-low px-5 py-3 text-sm font-bold text-on-surface-variant transition-all focus-within:ring-2 focus-within:ring-primary">
                <MagnifyingGlassIcon class="h-5 w-5 text-primary"/>
                <input
                    v-model="searchQuery"
                    class="w-full bg-transparent outline-none placeholder:text-on-surface-variant/70"
                    :placeholder="t('home.searchPlaceholder')"
                    @keydown.enter="handleHomeSearch"
                />
              </label>
            </div>
          </div>
        </header>

        <HomeSection
            v-if="activePage === 'home'"
            @open-post="openPost"
            @view-applicants="handleViewApplicants"
        />

        <SettingsSection
            v-else-if="activePage === 'settings'"
            :current-locale="locale"
            @update:locale="locale = $event"
        />

        <ProfileSection
            v-else-if="activePage === 'profile'"
            @open-post="openPost"
        />

        <CreatePostSection
            v-else-if="activePage === 'create'"
        />

        <SearchSection
            v-else-if="activePage === 'search'"
            @open-post="openPost"
            @view-applicants="handleViewApplicants"
        />

        <NotificationsSection
            v-else-if="activePage === 'notifications'"
        />

        <Teleport to="body">
          <Transition name="modal">
            <PostModal
                v-if="postStore.selectedPost"
                :applied-post-ids="postStore.appliedPostIds"
                :post="postStore.selectedPost"
                :user-id="auth.user?.id"
                :user-role="auth.user?.role"
                @apply="postStore.handlePostApply($event)"
                @close="postStore.selectedPost = null"
                @engagement-change="postStore.mergeEngagement($event)"
                @view-applicants="handleViewApplicants"
            />
          </Transition>
        </Teleport>

        <Teleport to="body">
          <Transition name="modal">
            <ProfileModal
                v-if="profileStore.isProfileModalOpen"
                :user="profileStore.selectedUserProfile || { name: profileStore.isProfileLoading ? 'Loading...' : 'User' }"
                @close="profileStore.closeProfileModal"
            />
          </Transition>
        </Teleport>
      </main>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'

import PlaceholderSidebar from '@/components/placeholder/PlaceholderSidebar.vue'
import HomeSection from '@/components/placeholder/sections/HomeSection.vue'
import SettingsSection from '@/components/placeholder/sections/SettingsSection.vue'
import ProfileSection from '@/components/placeholder/sections/ProfileSection.vue'
import CreatePostSection from '@/components/placeholder/sections/CreatePostSection.vue'
import SearchSection from '@/components/placeholder/sections/SearchSection.vue'
import NotificationsSection from '@/components/placeholder/sections/NotificationsSection.vue'
import PostModal from '@/components/placeholder/sections/PostModal.vue'
import ProfileModal from '@/components/placeholder/sections/ProfileModal.vue'

import {useThemeMode} from '@/composables/useThemeMode'
import {useAuthStore} from '@/stores/auth'
import {usePostStore} from '@/stores/posts'
import {useProfileStore} from '@/stores/profile'

import {
  BellIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const postStore = usePostStore()
const profileStore = useProfileStore()
const {t, locale} = useI18n()

const showSidebarLabels = ref(false)
const {appliedTheme, setThemePreference} = useThemeMode()

const activePage = computed(() => route.name?.toString() || 'home')
const searchQuery = ref('')

const pages = computed(() => ({
  home: {
    eyebrow: t('dashboardPages.home.eyebrow'),
    title: t('dashboardPages.home.title'),
    description: t('dashboardPages.home.description'),
  },
  search: {
    eyebrow: t('dashboardPages.search.eyebrow'),
    title: t('dashboardPages.search.title'),
    description: t('dashboardPages.search.description'),
  },
  messages: {
    eyebrow: t('dashboardPages.messages.eyebrow'),
    title: t('dashboardPages.messages.title'),
    description: t('dashboardPages.messages.description'),
  },
  notifications: {
    eyebrow: t('dashboardPages.notifications.eyebrow'),
    title: t('dashboardPages.notifications.title'),
    description: t('dashboardPages.notifications.description'),
  },
  create: {
    eyebrow: t('dashboardPages.create.eyebrow'),
    title: t('dashboardPages.create.title'),
    description: t('dashboardPages.create.description'),
  },
  profile: {
    eyebrow: t('dashboardPages.profile.eyebrow'),
    title: t('dashboardPages.profile.title'),
    description: t('dashboardPages.profile.description'),
  },
  settings: {
    eyebrow: t('dashboardPages.settings.eyebrow'),
    title: t('dashboardPages.settings.title'),
    description: t('dashboardPages.settings.description'),
  },
}))

const pageContent = computed(() => pages.value[activePage.value] || pages.value.home)

function openPost(post) {
  postStore.selectedPost = post
}

function handleViewApplicants(postId) {
  router.push(`/posts/${postId}/applicants`)
}

function handleHomeSearch() {
  if (!searchQuery.value.trim()) return
  router.push({ name: 'search', query: { q: searchQuery.value } })
}

function toggleThemeMode() {
  setThemePreference(appliedTheme.value === 'dark' ? 'light' : 'dark')
}

const navigationItems = computed(() => [
  {label: t('sidebar.home'), page: 'home', icon: HomeIcon, bg: 'bg-[#a8c0ff]', color: 'text-[#243c78]', to: '/home'},
  {
    label: t('sidebar.search'),
    page: 'search',
    icon: MagnifyingGlassIcon,
    bg: 'bg-[#8fd99b]',
    color: 'text-[#1f6c3b]',
    to: '/search'
  },
  {
    label: t('sidebar.messages'),
    page: 'messages',
    icon: ChatBubbleOvalLeftEllipsisIcon,
    bg: 'bg-[#8ccaff]',
    color: 'text-[#235d84]',
    to: '/messages'
  },
  {
    label: t('sidebar.notifications'),
    page: 'notifications',
    icon: BellIcon,
    bg: 'bg-[#d7b7ff]',
    color: 'text-[#5b36a8]',
    to: '/notifications'
  },
  {label: t('sidebar.create'), page: 'create', icon: PlusCircleIcon, bg: 'bg-[#f8a9dc]', color: 'text-[#9b1f70]', to: '/create'},
  {
    label: t('sidebar.profile'),
    page: 'profile',
    icon: UserCircleIcon,
    bg: 'bg-[#ffc28e]',
    color: 'text-[#83460e]',
    to: '/profile'
  },
])

const sidebarItems = computed(() => navigationItems.value.map((item) => ({
  ...item,
  active: item.page === activePage.value,
})))

const mainScrollContainer = ref(null)

function handleHomeScroll() {
  if (!mainScrollContainer.value || activePage.value !== 'home') return
  const {scrollTop, scrollHeight, clientHeight} = mainScrollContainer.value
  if (scrollTop + clientHeight >= scrollHeight - 200) {
    postStore.fetchPosts({ page: postStore.postsPage + 1, append: true })
  }
}

onMounted(() => {
  if (mainScrollContainer.value) {
    mainScrollContainer.value.addEventListener('scroll', handleHomeScroll)
  }
})

onUnmounted(() => {
  if (mainScrollContainer.value) {
    mainScrollContainer.value.removeEventListener('scroll', handleHomeScroll)
  }
})

watch(activePage, (newPage) => {
  if (newPage === 'home') {
    nextTick(() => {
      if (mainScrollContainer.value) {
         mainScrollContainer.value.scrollTop = 0
      }
    })
  }
})
</script>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
