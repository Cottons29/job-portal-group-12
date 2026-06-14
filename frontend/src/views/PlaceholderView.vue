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
            :class="[
              'flex-1 bg-surface flex flex-col transition-all duration-200',
              activePage === 'messages'
                ? 'px-4 pt-5 pb-4 sm:px-6 lg:h-[calc(100vh-1rem)] lg:overflow-hidden lg:px-8'
                : 'px-4 pb-28 pt-5 sm:px-6 lg:h-screen lg:overflow-y-auto lg:px-8 lg:pb-10'
            ]">
        <!-- Mobile Top Navbar -->
        <div class="flex items-center justify-between lg:hidden mb-4 border-b border-outline-variant/30 pb-3">
          <div class="flex items-center gap-2">
            <span class="grid h-8 w-8 place-items-center rounded-lg bg-primary text-xs font-black text-on-primary">FS</span>
            <span class="font-display text-lg font-black tracking-tight text-on-surface">FirstStep</span>
          </div>
          <div class="flex items-center gap-2">
            <!-- Theme toggle -->
            <button @click="toggleThemeMode" class="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition" aria-label="Toggle theme">
              <SunIcon v-if="appliedTheme === 'dark'" class="w-5 h-5 text-amber-400" />
              <MoonIcon v-else class="w-5 h-5" />
            </button>
            <!-- Settings Link -->
            <RouterLink to="/settings" class="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition" aria-label="Settings">
              <Cog6ToothIcon class="w-5 h-5" />
            </RouterLink>
          </div>
        </div>

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
            <div v-else-if="activePage === 'job-feed' && auth.user?.role?.toLowerCase() === 'employer'" class="hidden flex-1 justify-end md:flex">
              <RouterLink
                to="/job-posting"
                class="rounded-full bg-primary hover:bg-primary/95 text-on-primary font-bold px-6 py-3 transition shadow-sm text-sm"
              >
                Post Job
              </RouterLink>
            </div>
          </div>
        </header>

        <HomeSection
            v-if="activePage === 'home'"
            @open-post="openPost"
            @apply="triggerApply"
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
            v-else-if="activePage === 'create' && auth.user?.profileCompleted"
        />

        <div v-else-if="isActionRestrictedPage && !auth.user?.profileCompleted" class="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-16 bg-surface-container-low rounded-3xl border border-on-surface/5 shadow-sm">
          <div class="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-display font-extrabold text-on-surface mb-2">Profile Setup Required</h2>
          <p class="text-sm font-semibold text-on-surface-variant/80 mb-6 leading-relaxed">
            To use {{ activePage === 'create' ? 'job posting' : 'real-time messaging' }}, you must complete your profile setup in Settings first.
          </p>
          <button @click="goToSettings" class="bg-primary hover:bg-primary/95 text-on-primary font-bold px-6 py-3 rounded-2xl transition-all shadow-sm">
            Complete Profile Now
          </button>
        </div>

        <SearchSection
            v-else-if="activePage === 'search'"
            @open-post="openPost"
            @apply="triggerApply"
            @view-applicants="handleViewApplicants"
        />

        <NotificationsSection
            v-else-if="activePage === 'notifications'"
        />

        <MessagesSection
            v-else-if="activePage === 'messages' && auth.user?.profileCompleted"
            :user-id="auth.user?.id"
            :user-role="auth.user?.role"
            :initial-chat-user-id="preselectedChatUserId"
            @chat-initialized="preselectedChatUserId = null"
        />

        <JobFeed
            v-else-if="activePage === 'job-feed'"
        />

        <JobDetail
            v-else-if="activePage === 'job-detail'"
            @apply="triggerApply"
            @view-applicants="handleViewApplicants"
        />

        <JobForm
            v-else-if="activePage === 'job-posting'"
        />

        <SavedJobs
            v-else-if="activePage === 'saved-jobs'"
            @open="openPost"
            @apply="triggerApply"
            @view-applicants="handleViewApplicants"
        />



        <Teleport to="body">
          <Transition name="modal">
            <PostModal
                v-if="postStore.selectedPost"
                :applied-post-ids="postStore.appliedPostIds"
                :post="postStore.selectedPost"
                :user-id="auth.user?.id"
                :user-role="auth.user?.role"
                @apply="triggerApply"
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
                @message-user="startMessageChat"
            />
          </Transition>
        </Teleport>
        <Teleport to="body">
          <Transition name="modal">
            <ApplicantsModal
                v-if="isApplicantsModalOpen"
                :post="selectedPostForApplicants"
                :applicants="applicants"
                :is-loading="isLoadingApplicants"
                :load-error="applicantsLoadError"
                @close="isApplicantsModalOpen = false"
                @update-status="handleUpdateApplicantStatus"
                @open-profile="openStudentProfile"
            />
          </Transition>
        </Teleport>

        <Teleport to="body">
          <Transition name="modal">
            <ApplyModal
                v-if="isApplyModalOpen"
                :post="selectedPostForApply"
                :is-submitting="isSubmittingApplication"
                :submit-error="applicationSubmitError"
                @close="isApplyModalOpen = false"
                @submit="submitApplication"
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
import ApplicantsModal from '@/components/placeholder/sections/ApplicantsModal.vue'
import ApplyModal from '@/components/placeholder/sections/ApplyModal.vue'
import api from '@/lib/api'
import JobFeed from '@/views/job/JobFeed.vue'
import JobDetail from '@/views/job/JobDetail.vue'
import JobForm from '@/components/job/JobForm.vue'
import SavedJobs from '@/views/SavedJobs.vue'

import {useThemeMode} from '@/composables/useThemeMode'
import {useAuthStore} from '@/stores/auth'
import {usePostStore} from '@/stores/posts'
import {useProfileStore} from '@/stores/profile'
import {useSocket} from '@/composables/useSocket'
import {useToast} from '@/composables/useToast'

import {
  BellIcon,
  BriefcaseIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/vue/24/outline'
import MessagesSection from "@/components/placeholder/sections/MessagesSection.vue";

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

const { socket } = useSocket()
const { show } = useToast()
const unreadNotificationsCount = ref(0)

async function fetchUnreadNotifications() {
  try {
    const { data } = await api.get('/notifications')
    const list = data.notifications || []
    unreadNotificationsCount.value = list.filter(n => !n.isRead).length
  } catch (err) {
    console.error('Failed to fetch unread notifications:', err)
  }
}

watch(() => route.path, () => {
  fetchUnreadNotifications()
})

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
  'job-feed': {
    eyebrow: t('dashboardPages.job-feed.eyebrow'),
    title: t('dashboardPages.job-feed.title'),
    description: t('dashboardPages.job-feed.description'),
  },
  'job-detail': {
    eyebrow: t('dashboardPages.job-detail.eyebrow'),
    title: t('dashboardPages.job-detail.title'),
    description: t('dashboardPages.job-detail.description'),
  },
  'job-posting': {
    eyebrow: t('dashboardPages.job-posting.eyebrow'),
    title: t('dashboardPages.job-posting.title'),
    description: t('dashboardPages.job-posting.description'),
  },
  'saved-jobs': {
    eyebrow: 'SAVED CONTENT',
    title: t('home.savedJobs'),
    description: 'Review the job opportunities you have bookmarked.',
  },
}))

const pageContent = computed(() => {
  const content = pages.value[activePage.value] || pages.value.home
  if (activePage.value === 'profile') {
    const isEmployer = auth.user?.role?.toLowerCase() === 'employer'
    return {
      ...content,
      title: isEmployer ? 'Build your company profile.' : 'Build your student profile.',
      description: isEmployer 
        ? 'Manage your branding, business patent verification status, and post jobs in the same navigation shell.'
        : 'Showcase your skills, availability, and application progress in the same navigation shell.'
    }
  }
  return content
})

function openPost(post) {
  postStore.selectedPost = post
}

const isApplyModalOpen = ref(false)
const selectedPostForApply = ref(null)
const isSubmittingApplication = ref(false)
const applicationSubmitError = ref('')

function triggerApply(postOrId) {
  const post = typeof postOrId === 'object' && postOrId !== null ? postOrId : null
  const postId = post ? post.id : postOrId

  if (!auth.user?.profileCompleted) {
    alert('Profile Setup Required: Please complete your profile in Settings first to apply for jobs.')
    return
  }

  if (post) {
    selectedPostForApply.value = post
  } else {
    selectedPostForApply.value = postStore.posts.find(p => p.id === postId) || { id: postId, title: 'Job Post' }
  }

  isApplyModalOpen.value = true
  applicationSubmitError.value = ''
}

async function submitApplication({ postId, coverLetter, cvUrl }) {
  isSubmittingApplication.value = true
  applicationSubmitError.value = ''
  try {
    await postStore.handlePostApply(postId, coverLetter, cvUrl)
    isApplyModalOpen.value = false
    selectedPostForApply.value = null
    postStore.selectedPost = null
  } catch (err) {
    console.error(err)
    applicationSubmitError.value = err.response?.data?.message || 'Failed to submit application.'
  } finally {
    isSubmittingApplication.value = false
  }
}

const isApplicantsModalOpen = ref(false)
const selectedPostForApplicants = ref(null)
const applicants = ref([])
const isLoadingApplicants = ref(false)
const applicantsLoadError = ref('')

async function handleViewApplicants(postOrId) {
  const post = typeof postOrId === 'object' && postOrId !== null ? postOrId : null
  const postId = post ? post.id : postOrId

  if (post) {
    selectedPostForApplicants.value = post
  } else {
    selectedPostForApplicants.value = postStore.posts.find(p => p.id === postId) || { id: postId, title: 'Job Post' }
  }

  isApplicantsModalOpen.value = true
  isLoadingApplicants.value = true
  applicantsLoadError.value = ''
  applicants.value = []

  try {
    const res = await api.get(`/applications/post/${postId}`)
    applicants.value = res.data.applications || []
  } catch (err) {
    console.error('Failed to load applicants:', err)
    applicantsLoadError.value = 'Failed to load applicants.'
  } finally {
    isLoadingApplicants.value = false
  }
}
const preselectedChatUserId = ref(null)
function startMessageChat(userId) {
  profileStore.closeProfileModal()
  preselectedChatUserId.value = userId
  router.push({ name: 'messages' })
}
function openStudentProfile(student) {
  isApplicantsModalOpen.value = false
  profileStore.selectedUserProfile = student
  profileStore.isProfileModalOpen = true
}
async function handleUpdateApplicantStatus({ applicationId, status }) {
  try {
    await api.patch(`/applications/${applicationId}/status`, { status })
    const app = applicants.value.find(a => a.id === applicationId)
    if (app) {
      app.status = status
    }
  } catch (err) {
    console.error('Failed to update status:', err)
    alert('Failed to update status.')
  }
}

function handleHomeSearch() {
  if (!searchQuery.value.trim()) return
  router.push({ name: 'search', query: { q: searchQuery.value } })
}

function toggleThemeMode() {
  setThemePreference(appliedTheme.value === 'dark' ? 'light' : 'dark')
}

const isActionRestrictedPage = computed(() => {
  return ['create', 'messages'].includes(activePage.value)
})

function goToSettings() {
  router.push('/settings')
}

const navigationItems = computed(() => {
  const items = [
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
      label: t('sidebar.jobs'),
      page: 'job-feed',
      icon: BriefcaseIcon,
      bg: 'bg-[#ffda79]',
      color: 'text-[#845c08]',
      to: '/job-feed'
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
      to: '/notifications',
      badge: unreadNotificationsCount.value
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
  ]

  const userRole = auth.user?.role?.toUpperCase()
  if (userRole === 'ADMIN') {
    items.push({
      label: 'Admin Moderation',
      page: 'admin-moderation',
      icon: ShieldCheckIcon,
      bg: 'bg-amber-100',
      color: 'text-amber-700',
      to: '/admin/moderation'
    })
  }

  return items
})

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
  
  fetchUnreadNotifications()
  
  if (socket) {
    socket.on('notification.created', (notif) => {
      unreadNotificationsCount.value++
      
      // Toast if not on Notifications page
      if (route.name !== 'notifications') {
        show(notif.message, { title: 'New Notification', type: 'info' })
      }
    })
    
    socket.on('message.received', (msg) => {
      // Toast if not on Messages page
      if (route.name !== 'messages') {
        const preview = msg.content.startsWith('[IMAGE]') 
          ? '📷 Sent a photo' 
          : msg.content.startsWith('[FILE]') 
            ? '📁 Shared a file' 
            : msg.content
        show(preview, { title: 'New Message', type: 'success' })
      }
    })
  }
})

onUnmounted(() => {
  if (mainScrollContainer.value) {
    mainScrollContainer.value.removeEventListener('scroll', handleHomeScroll)
  }
  if (socket) {
    socket.off('notification.created')
    socket.off('message.received')
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
