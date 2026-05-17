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
            :compose-actions="composeActions"
            :focus-cards="focusCards"
            :posts="posts"
            :posts-error="postsError"
            :posts-has-more="postsHasMore"
            :posts-loading="postsLoading"
            :posts-loading-more="postsLoadingMore"
            :stories="stories"
            :suggestions="suggestions"
            :user-role="auth.user?.role"
            :user-id="auth.user?.id"
            :user-avatar="userAvatar"
            :user-initials="userInitials"
            :applied-post-ids="appliedPostIds"
            @open-post="openPost"
            @engagement-change="mergeEngagement"
            @apply="handlePostApply"
            @view-applicants="handleViewApplicants"
            @click-composer="handleComposerClick"
            @connect-talent="handleConnectTalent"
            @add-story="showAddStoryModal = true"
        />

        <SettingsSection
            v-else-if="activePage === 'settings'"
            :active-settings-section="activeSettingsSection"
            :auth-loading="auth.isLoading"
            :logout-error="logoutError"
            :passkey-error="passkeyError"
            :passkey-loading="passkeyLoading"
            :passkey-message="passkeyMessage"
            :password-error="passwordError"
            :password-message="passwordMessage"
            :personal-info-rows="personalInfoRows"
            :profile-load-error="profileLoadError"
            :security-rows="securityRows"
            :settings-menu-items="settingsMenuItems"
            :language-options="languageOptions"
            :current-locale="locale"
            @update:active-settings-section="activeSettingsSection = $event"
            @update:locale="locale = $event"
            @open-personal-info-editor="openPersonalInfoEditor"
            @handle-logout="handleLogout"
        />

        <ProfileSection
            v-else-if="activePage === 'profile'"
            :followed-by-avatars="followedByAvatars"
            :initials="initials"
            :profile-bio="profileBio"
            :profile-category="profileCategory"
            :profile-education="profileEducation"
            :profile-form="profileForm"
            :profile-gallery="profileGallery"
            :profile-handle="profileHandle"
            :profile-stats="profileStats"
            :profile-tabs="profileTabs"
            @open-post="openPost"
            @download-resume="downloadResumePdf"
        />

        <CreatePostSection
            v-else-if="activePage === 'create'"
            :can-submit-post="canSubmitPost"
            :is-posting="isPosting"
            :is-uploading-markdown-image="isUploadingMarkdownImage"
            :post-error="postError"
            :post-form="postForm"
            :post-message="postMessage"
            :post-photo-name="postPhotoName"
            :post-photo-preview="postPhotoPreview"
            :post-preview-html="postPreviewHtml"
            @handle-markdown-image-upload="handleMarkdownImageUpload"
            @handle-post-photo-change="handlePostPhotoChange"
            @remove-post-photo="removePostPhoto"
            @submit="submitPost"
            @upload-image="handleEditorUploadImage"
        />

        <SearchSection
            v-else-if="activePage === 'search'"
            :search-query="searchQuery"
            :search-role-filter="searchRoleFilter"
            :search-results="searchResults"
            :is-searching="isSearching"
            :search-error="searchError"
            :user-role="auth.user?.role"
            :user-id="auth.user?.id"
            :applied-post-ids="appliedPostIds"
            @update:search-query="searchQuery = $event"
            @update:search-role-filter="searchRoleFilter = $event"
            @search="searchPosts"
            @open-post="openPost"
            @engagement-change="mergeEngagement"
            @apply="handlePostApply"
            @view-applicants="handleViewApplicants"
        />

        <NotificationsSection
            v-else-if="activePage === 'notifications'"
            :notifications="userNotifications"
            :is-loading="isLoadingNotifications"
            :load-error="loadNotificationsError"
            @mark-read="markNotificationAsRead"
        />
        <MessagesSection
            v-else-if="activePage === 'messages'"
            :user-id="auth.user?.id"
            :user-role="auth.user?.role"
        />

        <Teleport to="body">
          <Transition name="modal">
            <PersonalInfoEditor
                v-if="editingField"
                :editing-field="editingField"
                :edit-value="editValue"
                :is-saving-profile="isSavingProfile"
                :profile-save-error="profileSaveError"
                @close="closePersonalInfoEditor"
                @save="savePersonalInfoEdit"
                @update:edit-value="editValue = $event"
            />
          </Transition>
        </Teleport>

        <Teleport to="body">
          <Transition name="modal">
            <PasswordEditor
                v-if="isPasswordEditorOpen"
                :password-error="passwordError"
                :password-form="passwordForm"
                :password-loading="passwordLoading"
                @close="closePasswordEditor"
                @submit="updatePassword"
            />
          </Transition>
        </Teleport>

        <Teleport to="body">
          <Transition name="modal">
            <PostModal
                v-if="selectedPost"
                :post="selectedPost"
                :user-role="auth.user?.role"
                :user-id="auth.user?.id"
                :applied-post-ids="appliedPostIds"
                @close="closePost"
                @engagement-change="mergeEngagement"
                @apply="handlePostApply"
                @view-applicants="handleViewApplicants"
            />
          </Transition>
        </Teleport>

        <!-- Add Story Modal Overlay -->
        <Teleport to="body">
          <Transition name="modal">
            <div v-if="showAddStoryModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
              <div class="w-full max-w-lg rounded-[1.5rem] bg-white p-6 shadow-2xl transition-all">
                <div class="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 class="font-display text-xl font-black text-slate-900">Add Company Brand Story</h3>
                  <button @click="showAddStoryModal = false" class="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer">
                    Close
                  </button>
                </div>
                <div class="space-y-4">
                  <label class="block">
                    <span class="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                      Quick Status / Story Announcement
                    </span>
                    <textarea
                      v-model="storyText"
                      rows="4"
                      required
                      placeholder="e.g. We just reached 50 team members in Phnom Penh! 🎉 or Hiring Flutter interns next week!"
                      class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                    ></textarea>
                  </label>
                  
                  <div class="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      @click="showAddStoryModal = false"
                      class="rounded-full px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      @click="publishStory"
                      :disabled="isPublishingStory || !storyText.trim()"
                      class="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-black text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                    >
                      {{ isPublishingStory ? 'Publishing...' : 'Publish Story' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </Teleport>

        <!-- Applicants Modal Overlay -->
        <Teleport to="body">
          <Transition name="modal">
            <ApplicantsModal
              v-if="showApplicantsModal"
              :post="activeApplicantsPost"
              :applicants="applicantsList"
              :is-loading="isLoadingApplicants"
              :load-error="loadApplicantsError"
              @close="showApplicantsModal = false"
              @update-status="handleUpdateApplicantStatus"
            />
          </Transition>
        </Teleport>
      </main>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, onUnmounted, reactive, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {isAxiosError} from 'axios'
import {marked} from 'marked'
import {startRegistration} from '@simplewebauthn/browser'
import {useI18n} from 'vue-i18n'

import api from '@/lib/api'
import PlaceholderSidebar from '@/components/placeholder/PlaceholderSidebar.vue'
import HomeSection from '@/components/placeholder/sections/HomeSection.vue'
import SettingsSection from '@/components/placeholder/sections/SettingsSection.vue'
import ProfileSection from '@/components/placeholder/sections/ProfileSection.vue'
import CreatePostSection from '@/components/placeholder/sections/CreatePostSection.vue'
import SearchSection from '@/components/placeholder/sections/SearchSection.vue'
import NotificationsSection from '@/components/placeholder/sections/NotificationsSection.vue'
import MessagesSection from '@/components/placeholder/sections/MessagesSection.vue'
import { io } from 'socket.io-client'
import PersonalInfoEditor from '@/components/placeholder/sections/PersonalInfoEditor.vue'
import PasswordEditor from '@/components/placeholder/sections/PasswordEditor.vue'
import PostModal from '@/components/placeholder/sections/PostModal.vue'
import ApplicantsModal from '@/components/placeholder/sections/ApplicantsModal.vue'
import {useThemeMode} from '@/composables/useThemeMode'
import {useAuthStore} from '@/stores/auth'
import {
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  BriefcaseIcon,
  BuildingStorefrontIcon,
  CameraIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CreditCardIcon,
  EnvelopeIcon,
  HomeIcon,
  IdentificationIcon,
  KeyIcon,
  LanguageIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SquaresPlusIcon,
  UserGroupIcon,
  UserCircleIcon,
  UserIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const {t, locale} = useI18n()
const showSidebarLabels = ref(false)
const {appliedTheme, setThemePreference} = useThemeMode()

const activePage = computed(() => route.name?.toString() || 'home')

const defaultAvatar = 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=160&q=80'

const profileForm = reactive({
  name: 'Student User',
  user_name: '',
  email: 'student@example.com',
  gender: '',
  phone: '',
  avatar: defaultAvatar,
  university: '',
  major: '',
  yearLevel: '',
  bio: '',
  jobType: '',
  expectedSalary: '',
  currency: 'USD',
  skills: [],
  availability: null,
  companyName: '',
  industry: '',
  address: '',
  website: '',
  companyDescription: '',
})

const profileLoadError = ref('')
const profileSaveError = ref('')
const isSavingProfile = ref(false)
const editingField = ref(null)
const editValue = ref('')
const activeSettingsSection = ref('personal')

const languageOptions = [
  {
    label: 'English',
    nativeName: 'English',
    value: 'en',
    description: 'Use FirstStep in English.',
  },
  {
    label: 'Khmer',
    nativeName: 'ភាសាខ្មែរ',
    value: 'km',
    description: 'ប្រើ FirstStep ជាភាសាខ្មែរ។',
  },
  {
    label: 'Chinese (Simplified)',
    nativeName: '简体中文',
    value: 'zh-CN',
    description: '使用简体中文浏览 FirstStep。',
  },
  {
    label: 'Chinese (Traditional)',
    nativeName: '繁體中文',
    value: 'zh-TW',
    description: '使用繁體中文瀏覽 FirstStep。',
  },
  {
    label: 'Japanese',
    nativeName: '日本語',
    value: 'ja',
    description: 'FirstStep を日本語で使用します。',
  },
  {
    label: 'French',
    nativeName: 'Français',
    value: 'fr',
    description: 'Utiliser FirstStep en français.',
  },
]

const passwordForm = reactive({
  current: '',
  next: '',
  confirm: '',
})
const passkeys = ref([])
const passkeyLoading = ref(false)
const passkeyMessage = ref('')
const passkeyError = ref('')
const passwordLoading = ref(false)
const passwordMessage = ref('')
const passwordError = ref('')
const isPasswordEditorOpen = ref(false)
const logoutError = ref('')

const postForm = reactive({
  title: '',
  content: '',
})
const postPhotoFile = ref(null)
const postPhotoPreview = ref('')
const postPhotoName = ref('')
const postMessage = ref('')
const postError = ref('')
const isPosting = ref(false)
const isUploadingMarkdownImage = ref(false)
const posts = ref([])
const postsLoading = ref(false)
const postsLoadingMore = ref(false)
const postsError = ref('')
const postsPage = ref(1)
const postsHasMore = ref(true)
const postsScrollListenerAttached = ref(false)
const postsPerPage = 10
const appliedPostIds = ref(new Set())
const selectedPost = ref(null)
const mainScrollContainer = ref(null)

const showApplicantsModal = ref(false)
const activeApplicantsPost = ref(null)
const applicantsList = ref([])
const isLoadingApplicants = ref(false)
const loadApplicantsError = ref('')

const searchQuery = ref('')
const searchRoleFilter = ref('All')
const searchResults = ref([])
const isSearching = ref(false)
const searchError = ref('')

const userNotifications = ref([])
const isLoadingNotifications = ref(false)
const loadNotificationsError = ref('')

let socket = null

async function fetchNotifications() {
  if (!auth.isAuthenticated) return
  isLoadingNotifications.value = true
  loadNotificationsError.value = ''
  try {
    const { data } = await api.get('/notifications')
    userNotifications.value = data.notifications || []
  } catch (error) {
    loadNotificationsError.value = getErrorMessage(error, 'Failed to load notifications.')
  } finally {
    isLoadingNotifications.value = false
  }
}

async function markNotificationAsRead(id) {
  try {
    await api.patch(`/notifications/${id}/read`)
    const target = userNotifications.value.find(n => n.id === id)
    if (target) target.isRead = true
  } catch (error) {
    console.error('Failed to mark notification read:', error)
  }
}

function initializeSocketConnection() {
  if (socket) return
  const userId = auth.user?.id
  if (!userId) return

  // Connect to the base backend WebSocket Gateway URL
  socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
    query: { userId },
  })

  socket.on('notification.created', payload => {
    // Dynamically insert incoming server push notifications directly into our view array
    userNotifications.value.unshift(payload)
  })
}

const canSubmitPost = computed(() => postForm.title.trim() && postForm.content.trim())
const postPreviewHtml = computed(() => renderMarkdown(postForm.content || 'Start writing your post to see the preview here.'))

const initials = computed(() => {
  const letters = profileForm.name
      .toString()
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  return letters || 'SU'
})

const profileHandle = computed(() => {
  const fallback = profileForm.name
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '.')
      .replace(/^\.|\.$/g, '')

  return profileForm.user_name || fallback || 'Guest'
})

const profileCategory = computed(() => profileForm.major || profileForm.jobType || 'Student profile')
const profileEducation = computed(() => {
  const details = [profileForm.university, profileForm.yearLevel].filter(Boolean)
  return details.length ? details.join(' • ') : 'Add your university and year level in settings.'
})
const profileBio = computed(() => profileForm.bio || 'Showcase your skills, availability, and career goals for employers on FirstStep.')

const profileStats = computed(() => [
  {label: 'posts', value: posts.value.filter(post => post.author?.id === auth.user?.id || post.userId === auth.user?.id).length},
  {label: 'followers', value: auth.user?.role === 'employer' ? '348' : '156'},
  {label: 'skills', value: profileForm.skills?.length || 0},
])

const followedByAvatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&q=80',
]

const profileTabs = computed(() => [
  {label: 'Posts', icon: SquaresPlusIcon, active: true},
  {label: 'Media', icon: CameraIcon, active: false},
  {label: 'Reposts', icon: ArrowRightOnRectangleIcon, active: false},
  {label: 'Tagged', icon: UserCircleIcon, active: false},
])

function getFirstContentImage(value = '') {
  const markdownImage = value.match(/!\[[^\]]*]\(([^\s)]+)(?:\s+"[^"]*")?\)/)
  if (markdownImage?.[1]) return markdownImage[1]

  const htmlImage = value.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i)
  if (htmlImage?.[1]) return htmlImage[1]

  const imageUrl = value.match(/https?:\/\/\S+?\.(?:png|jpe?g|gif|webp|avif)(?:\?\S*)?/i)
  return imageUrl?.[0] || ''
}

const profileGallery = computed(() => posts.value
  .filter(post => post.author?.id === auth.user?.id || post.userId === auth.user?.id)
  .map((post) => ({
    title: post.title || 'Untitled post',
    type: 'Post',
    image: post.imageUrl || getFirstContentImage(post.desc),
    post,
  }))
)

function mergeEngagement(payload) {
  if (!payload?.id) return
  const {id, ...patch} = payload

  const patchList = (listRef) => {
    const list = listRef.value
    const idx = list.findIndex((p) => p.id === id)
    if (idx >= 0) {
      Object.assign(list[idx], patch)
    }
  }

  patchList(posts)
  patchList(searchResults)
  if (selectedPost.value?.id === id) {
    Object.assign(selectedPost.value, patch)
  }
}

async function refreshAppliedPosts() {
  if (!auth.isAuthenticated || auth.user?.role !== 'student') {
    appliedPostIds.value = new Set()
    return
  }
  try {
    const {data} = await api.get('/applications/me')
    const ids = new Set(
        (data.applications || []).map((a) => a.post?.id).filter(Boolean),
    )
    appliedPostIds.value = ids
  } catch {
    appliedPostIds.value = new Set()
  }
}

async function handlePostApply(post) {
  if (!post?.id) return
  try {
    await api.post('/applications', {postId: post.id})
    const next = new Set(appliedPostIds.value)
    next.add(post.id)
    appliedPostIds.value = next
  } catch (error) {
    window.alert(getErrorMessage(error, 'Could not submit application.'))
  }
}

async function handleViewApplicants(post) {
  if (!post?.id) return
  activeApplicantsPost.value = post
  showApplicantsModal.value = true
  isLoadingApplicants.value = true
  loadApplicantsError.value = ''
  try {
    const { data } = await api.get(`/applications/post/${post.id}`)
    applicantsList.value = data.applications || []
  } catch (error) {
    loadApplicantsError.value = getErrorMessage(error, 'Could not load applicants.')
  } finally {
    isLoadingApplicants.value = false
  }
}

async function handleUpdateApplicantStatus({ applicationId, status }) {
  try {
    await api.patch(`/applications/${applicationId}/status`, { status })
    // Update local state list
    const app = applicantsList.value.find(a => a.id === applicationId)
    if (app) app.status = status
  } catch (error) {
    window.alert('Failed to update applicant status.')
  }
}

function checkOpenPostQuery() {
  const raw = route.query.post
  const pid = Array.isArray(raw) ? raw[0] : raw
  if (!pid || typeof pid !== 'string') return
  const found = posts.value.find((p) => p.id === pid)
  if (found) {
    openPost(found)
  }
}

function openPost(post) {
  if (!post) return
  selectedPost.value = post
}

function closePost() {
  selectedPost.value = null
  if (route.query.post) {
    const q = {...route.query}
    delete q.post
    router.replace({query: q})
  }
}

const settingsMenuItems = computed(() => {
  const items = [
  {
    label: t('settings.personalInfo'),
    section: 'personal',
    icon: IdentificationIcon,
    bg: 'bg-[#8fd99b]',
    color: 'text-[#1f6c3b]',
    active: activeSettingsSection.value === 'personal'
  },
  {
    label: t('settings.securitySignIn'),
    section: 'security',
    icon: LockClosedIcon,
    bg: 'bg-[#8ccaff]',
    color: 'text-[#235d84]',
    active: activeSettingsSection.value === 'security'
  },
  {
    label: t('settings.dataPrivacy'),
    section: 'privacy',
    icon: ShieldCheckIcon,
    bg: 'bg-[#d7b7ff]',
    color: 'text-[#5b36a8]',
    active: activeSettingsSection.value === 'privacy'
  },
  {
    label: t('settings.languages'),
    section: 'languages',
    icon: LanguageIcon,
    bg: 'bg-[#f5df7e]',
    color: 'text-[#745b00]',
    active: activeSettingsSection.value === 'languages'
  },
  {
    label: t('settings.logout'),
    section: 'logout',
    icon: ArrowRightOnRectangleIcon,
    bg: 'bg-red-500/15',
    color: 'text-red-300',
    active: activeSettingsSection.value === 'logout'
  }
  ]
  
  if (auth.user && !auth.user.profileCompleted) {
    items.unshift({
      label: 'Complete Profile',
      section: 'profile-setup',
      icon: IdentificationIcon,
      bg: 'bg-primary-container',
      color: 'text-primary',
      active: activeSettingsSection.value === 'profile-setup'
    })
  }
  
  return items
})

const securityRows = computed(() => [
  {
    label: t('settings.security.passkeyLogin'),
    values: [
      passkeys.value.length
          ? t(passkeys.value.length === 1 ? 'settings.security.passkeyAdded' : 'settings.security.passkeysAdded', { count: passkeys.value.length })
          : t('settings.security.passkeyDescription'),
    ],
    icon: KeyIcon,
    buttonLabel: passkeyLoading.value ? t('settings.security.addingPasskey') : t('settings.security.addPasskey'),
    action: addPasskey,
  },
  {
    label: t('settings.security.password'),
    values: [passwordMessage.value || t('settings.security.passwordRecommendation')],
    icon: LockClosedIcon,
    action: openPasswordEditor,
  },
])

const personalInfoRows = computed(() => {
  const isEmployer = auth.user?.role === 'employer'
  const isStudent = auth.user?.role === 'student'

  const baseRows = [
    {
      label: t('settings.personal.profilePicture'),
      field: 'avatar',
      values: [],
      icon: CameraIcon,
      avatar: profileForm.avatar || defaultAvatar,
      placeholder: t('settings.personal.profilePicturePlaceholder'),
      inputType: 'url',
    },
    {
      label: isEmployer ? t('settings.personal.companyName') : t('settings.personal.name'),
      field: isEmployer ? 'companyName' : 'name',
      value: isEmployer ? profileForm.companyName || t('settings.personal.yourCompany') : profileForm.name || t('settings.personal.yourName'),      icon: isEmployer ? BuildingStorefrontIcon : IdentificationIcon,
      placeholder: isEmployer ? t('settings.personal.companyNamePlaceholder') : t('settings.personal.namePlaceholder'),
      inputType: 'text',
    },
    {
      label: t('settings.personal.username'),
      field: 'user_name',
      values: [profileForm.user_name || t('settings.personal.blank')],
      icon: UserCircleIcon,
      placeholder: t('settings.personal.usernamePlaceholder'),
      inputType: 'text',
    },
    {
      label: t('settings.personal.email'),
      field: 'email',
      values: [profileForm.email || t('settings.personal.noEmailLinked')],
      icon: EnvelopeIcon,
      placeholder: t('settings.personal.emailPlaceholder'),
      inputType: 'email',
    },
    {
      label: t('settings.personal.phone'),
      field: 'phone',
      values: [profileForm.phone || t('settings.personal.noPhoneNumber')],
      icon: PhoneIcon,
      placeholder: t('settings.personal.phonePlaceholder'),
      inputType: 'tel',
    },
  ]

  const studentRows = [
    {
      label: t('settings.personal.university'),
      field: 'university',
      values: [profileForm.university || t('settings.personal.notSet')],
      icon: AcademicCapIcon,
      placeholder: t('settings.personal.universityPlaceholder'),
      inputType: 'text',
    },
    {
      label: t('settings.personal.major'),
      field: 'major',
      values: [profileForm.major || t('settings.personal.notSet')],
      icon: SparklesIcon,
      placeholder: t('settings.personal.majorPlaceholder'),
      inputType: 'text',
    },
  ]

  const employerRows = [
    {
      label: t('settings.personal.industry'),
      field: 'industry',
      values: [profileForm.industry || t('settings.personal.notSet')],
      icon: BriefcaseIcon,
      placeholder: t('settings.personal.industryPlaceholder'),
      inputType: 'text',
    },
    {
      label: t('settings.personal.address'),
      field: 'address',
      values: [profileForm.address || t('settings.personal.notSet')],
      icon: HomeIcon,
      placeholder: t('settings.personal.addressPlaceholder'),
      inputType: 'text',
    },
    {
      label: t('settings.personal.website'),
      field: 'website',
      values: [profileForm.website || t('settings.personal.noWebsite')],
      icon: SparklesIcon,
      placeholder: t('settings.personal.websitePlaceholder'),
      inputType: 'url',
    },
  ]

  if (isEmployer) {
    return [...baseRows, ...employerRows]
  }

  return [...baseRows, ...studentRows]
})

const pages = computed(() => {
  const isEmployer = auth.user?.role === 'employer'
  return {
    home: {
      eyebrow: isEmployer ? 'Recruiter Console' : t('home.eyebrow'),
      title: isEmployer
        ? (auth.user?.companyName ? `Welcome back, ${auth.user.companyName}.` : 'Welcome back, employer.')
        : t('home.welcomeBack'),
    },
    search: {
      eyebrow: t('dashboardPages.search.eyebrow'),
      title: isEmployer ? 'Find top student talents.' : t('dashboardPages.search.title'),
      description: isEmployer 
        ? 'Search for qualified student candidates, view major cohorts, and match weekly availability.'
        : t('dashboardPages.search.description'),
      cards: [
        {
          title: isEmployer ? 'Talent sourcing' : t('dashboardPages.search.cards.0.title'),
          description: isEmployer 
            ? 'Search students by major, university, specific skills, and weekly class availability.'
            : t('dashboardPages.search.cards.0.description'),
          icon: MagnifyingGlassIcon,
          bg: 'bg-[#8fd99b]',
          color: 'text-[#1f6c3b]'
        },
        {
          title: isEmployer ? 'University cohorts' : t('dashboardPages.search.cards.1.title'),
          description: isEmployer 
            ? 'Browse and discover top talent hubs and student societies across Phnom Penh.'
            : t('dashboardPages.search.cards.1.description'),
          icon: BuildingStorefrontIcon,
          bg: 'bg-[#ffc28e]',
          color: 'text-[#83460e]'
        },
      ],
    },
    messages: {
      eyebrow: t('dashboardPages.messages.eyebrow'),
      title: isEmployer ? 'Coordinate with student applicants.' : t('dashboardPages.messages.title'),
      description: isEmployer 
        ? 'Chat with candidates, send follow-ups, and coordinate interviews in one shared console.'
        : t('dashboardPages.messages.description'),
      cards: [
        {
          title: isEmployer ? 'Student outreach' : t('dashboardPages.messages.cards.0.title'),
          description: isEmployer 
            ? 'Directly message applicants and send custom offers to top-matching talent.'
            : t('dashboardPages.messages.cards.0.description'),
          icon: ChatBubbleOvalLeftEllipsisIcon,
          bg: 'bg-[#8ccaff]',
          color: 'text-[#235d84]'
        },
        {
          title: isEmployer ? 'Interview sync' : t('dashboardPages.messages.cards.1.title'),
          description: isEmployer 
            ? 'Coordinate calendar dates and send call links to candidates.'
            : t('dashboardPages.messages.cards.1.description'),
          icon: UserCircleIcon,
          bg: 'bg-[#ffc28e]',
          color: 'text-[#83460e]'
        },
      ],
    },
    notifications: {
      eyebrow: t('dashboardPages.notifications.eyebrow'),
      title: isEmployer ? 'Keep track of candidate activity.' : t('dashboardPages.notifications.title'),
      description: isEmployer 
        ? 'Never miss application updates, new candidate matches, or upcoming interviews.'
        : t('dashboardPages.notifications.description'),
      cards: [
        {
          title: isEmployer ? 'New applications' : t('dashboardPages.notifications.cards.0.title'),
          description: isEmployer 
            ? 'Get real-time alerts the second a student submits an application for your roles.'
            : t('dashboardPages.notifications.cards.0.description'),
          icon: BellIcon,
          bg: 'bg-[#d7b7ff]',
          color: 'text-[#5b36a8]'
        },
        {
          title: isEmployer ? 'Match alerts' : t('dashboardPages.notifications.cards.1.title'),
          description: isEmployer 
            ? 'Get prompted when high-scoring candidate profiles match your active job postings.'
            : t('dashboardPages.notifications.cards.1.description'),
          icon: BriefcaseIcon,
          bg: 'bg-[#8fd99b]',
          color: 'text-[#1f6c3b]'
        },
      ],
    },
    create: {
      eyebrow: t('dashboardPages.create.eyebrow'),
      title: isEmployer ? 'Publish recruitment opportunities.' : t('dashboardPages.create.title'),
      description: isEmployer 
        ? 'Create beautiful job openings, physical/virtual events, or share updates with the student network.'
        : t('dashboardPages.create.description'),
      cards: [
        {
          title: isEmployer ? 'Post a Job opening' : t('dashboardPages.create.cards.0.title'),
          description: isEmployer 
            ? 'Publish part-time, internship, or flexible campus roles mapped to student schedules.'
            : t('dashboardPages.create.cards.0.description'),
          icon: PlusCircleIcon,
          bg: 'bg-[#f8a9dc]',
          color: 'text-[#9b1f70]'
        },
        {
          title: isEmployer ? 'Announce recruitment event' : t('dashboardPages.create.cards.1.title'),
          description: isEmployer 
            ? 'Promote virtual campus drives, career talks, or open house events for local students.'
            : t('dashboardPages.create.cards.1.description'),
          icon: BriefcaseIcon,
          bg: 'bg-[#8fd99b]',
          color: 'text-[#1f6c3b]'
        },
      ],
    },
    profile: {
      eyebrow: t('dashboardPages.profile.eyebrow'),
      title: isEmployer ? 'Manage your corporate presence.' : t('dashboardPages.profile.title'),
      description: isEmployer 
        ? 'Build a stunning company page showcasing your brand culture, active jobs, and offices.'
        : t('dashboardPages.profile.description'),
      cards: [
        {
          title: isEmployer ? 'Company branding' : t('dashboardPages.profile.cards.0.title'),
          description: isEmployer 
            ? 'Set your logo, industry sector, description, website, and physical address.'
            : t('dashboardPages.profile.cards.0.description'),
          icon: UserCircleIcon,
          bg: 'bg-[#ffc28e]',
          color: 'text-[#83460e]'
        },
        {
          title: isEmployer ? 'Active job board' : t('dashboardPages.profile.cards.1.title'),
          description: isEmployer 
            ? 'Manage active roles, view applicants count, and close completed postings.'
            : t('dashboardPages.profile.cards.1.description'),
          icon: BriefcaseIcon,
          bg: 'bg-[#a8c0ff]',
          color: 'text-[#243c78]'
        },
      ],
    },
    settings: {
      eyebrow: t('dashboardPages.settings.eyebrow'),
      title: isEmployer ? 'Recruiter Settings' : t('dashboardPages.settings.title'),
      description: isEmployer 
        ? 'Update your company, phone contact information, and account security.'
        : t('dashboardPages.settings.description'),
    },
  }
})

const pageContent = computed(() => pages.value[activePage.value] || pages.value.home)

function getErrorMessage(error, fallback) {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}

function escapeHtml(value) {
  return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
}

function sanitizeMarkdownHtml(html) {
  if (typeof DOMParser === 'undefined') return escapeHtml(html)

  const allowedTags = new Set([
    'A', 'BLOCKQUOTE', 'BR', 'CODE', 'DEL', 'EM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
    'HR', 'IMG', 'LI', 'OL', 'P', 'PRE', 'STRONG', 'UL'
  ])
  const allowedAttributes = {
    A: new Set(['href', 'title', 'target', 'rel']),
    IMG: new Set(['src', 'alt', 'title'])
  }
  const parser = new DOMParser()
  const document = parser.parseFromString(html, 'text/html')

  document.body.querySelectorAll('*').forEach((element) => {
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes))
      return
    }

    Array.from(element.attributes).forEach((attribute) => {
      const allowedForTag = allowedAttributes[element.tagName]
      const isSafeAttribute = allowedForTag?.has(attribute.name)
      const value = attribute.value.trim().toLowerCase()

      if (!isSafeAttribute || value.startsWith('javascript:') || value.startsWith('data:')) {
        element.removeAttribute(attribute.name)
      }
    })

    if (element.tagName === 'A') {
      element.setAttribute('target', '_blank')
      element.setAttribute('rel', 'noopener noreferrer')
    }
  })

  return document.body.innerHTML
}

function renderMarkdown(value) {
  return sanitizeMarkdownHtml(marked.parse(value, {async: false, breaks: true}))
}

async function uploadPostImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const {data} = await api.post('/upload/single', formData)
  return data.file?.url || data.file?.streamUrl || ''
}

function buildMarkdownImage(file, url) {
  const altText = file.name.replace(/\.[^.]+$/, '').trim() || 'uploaded image'
  return `![${altText}](${url})`
}

function insertMarkdownImage(markdownImage) {
  const currentContent = postForm.content.trimEnd()
  postForm.content = currentContent ? `${currentContent}\n\n${markdownImage}` : markdownImage
}

async function handleMarkdownImageUpload(event) {
  const files = Array.from(event.target.files || [])
  postError.value = ''
  postMessage.value = ''

  if (!files.length) return

  const invalidFile = files.find((file) => !file.type.startsWith('image/'))
  if (invalidFile) {
    postError.value = 'Please select only image files to upload into markdown.'
    event.target.value = ''
    return
  }

  isUploadingMarkdownImage.value = true
  try {
    const markdownImages = await Promise.all(
        files.map(async (file) => {
          const imageUrl = await uploadPostImage(file)
          if (!imageUrl) throw new Error(`Upload finished, but the file URL was missing for ${file.name}.`)
          return buildMarkdownImage(file, imageUrl)
        }),
    )
    insertMarkdownImage(markdownImages.join('\n\n'))
    postMessage.value = `${markdownImages.length} image(s) uploaded and inserted into your markdown.`
  } catch (error) {
    postError.value = getErrorMessage(error, 'Could not upload the markdown images. Please try again.')
  } finally {
    isUploadingMarkdownImage.value = false
    event.target.value = ''
  }
}

function handlePostPhotoChange(event) {
  const [file] = event.target.files || []
  postError.value = ''

  if (!file) return

  if (!file.type.startsWith('image/')) {
    postError.value = 'Please select an image file for your post photo.'
    event.target.value = ''
    return
  }

  if (postPhotoPreview.value) URL.revokeObjectURL(postPhotoPreview.value)
  postPhotoFile.value = file
  postPhotoName.value = file.name
  postPhotoPreview.value = URL.createObjectURL(file)
}

async function handleEditorUploadImage(file, callback) {
  try {
    const imageUrl = await uploadPostImage(file)
    if (imageUrl) {
      callback(imageUrl)
    }
  } catch (error) {
    postError.value = getErrorMessage(error, 'Could not upload the image. Please try again.')
  }
}

function removePostPhoto() {
  if (postPhotoPreview.value) URL.revokeObjectURL(postPhotoPreview.value)
  postPhotoFile.value = null
  postPhotoPreview.value = ''
  postPhotoName.value = ''
}

async function submitPost() {
  postError.value = ''
  postMessage.value = ''

  if (!canSubmitPost.value) {
    postError.value = 'Please add a title and markdown content before publishing.'
    return
  }

  isPosting.value = true
  try {
    let imageUrl = ''

    if (postPhotoFile.value) {
      imageUrl = await uploadPostImage(postPhotoFile.value)
    }

    const {data} = await api.post('/posts', {
      title: postForm.title.trim(),
      content: postForm.content.trim(),
      imageUrl,
    })

    posts.value = [mapPost(data.post), ...posts.value]
    postMessage.value = 'Post published and saved successfully.'
    postForm.title = ''
    postForm.content = ''
    removePostPhoto()
  } catch (error) {
    postError.value = getErrorMessage(error, 'Could not publish your post. Please try again.')
  } finally {
    isPosting.value = false
  }
}

function mapPost(post) {
  const authorName = post.author?.user_name || post.author?.phone || '<Blank>'
  const createdAt = post.createdAt ? new Date(post.createdAt) : null

  return {
    id: post.id,
    authorId: post.author?.id,
    company: authorName,
    meta: createdAt ? createdAt.toLocaleString() : 'Just now',
    badge: 'Community post',
    title: post.title,
    desc: post.content,
    descHtml: renderMarkdown(post.content || ''),
    imageUrl: post.imageUrl,
    tags: [],
    logoBg: 'bg-[#aecbfa]',
    logoText: 'text-[#1a4fa3]',
    likeCount: post.likeCount ?? 0,
    commentCount: post.commentCount ?? 0,
    shareCount: post.shareCount ?? 0,
    bookmarkCount: post.bookmarkCount ?? 0,
    likedByMe: Boolean(post.likedByMe),
    bookmarkedByMe: Boolean(post.bookmarkedByMe),
  }
}

async function searchPosts() {
  searchError.value = ''
  isSearching.value = true

  try {
    const params = {
      limit: 20,
    }
    if (searchQuery.value.trim()) params.q = searchQuery.value.trim()
    if (searchRoleFilter.value !== 'All') params.role = searchRoleFilter.value.toUpperCase()

    const {data} = await api.get('/posts', { params })
    searchResults.value = Array.isArray(data.posts) ? data.posts.map(mapPost) : []
  } catch (error) {
    searchError.value = getErrorMessage(error, 'Search failed. Please try again.')
  } finally {
    isSearching.value = false
    nextTick(() => checkOpenPostQuery())
  }
}

async function loadPosts({page = 1, append = false} = {}) {
  if (append) {
    if (postsLoadingMore.value || postsLoading.value || !postsHasMore.value) return
    postsLoadingMore.value = true
  } else {
    postsLoading.value = true
    postsPage.value = 1
    postsHasMore.value = true
  }

  postsError.value = ''

  try {
    const {data} = await api.get('/posts', {
      params: {
        page,
        limit: postsPerPage,
      },
    })
    const nextPosts = Array.isArray(data.posts) ? data.posts.map(mapPost) : []

    if (append) {
      const existingPostIds = new Set(posts.value.map((post) => post.id))
      posts.value = [
        ...posts.value,
        ...nextPosts.filter((post) => !existingPostIds.has(post.id)),
      ]
    } else {
      posts.value = nextPosts
    }

    postsPage.value = data.page || page
    postsHasMore.value = Boolean(data.hasMore)
  } catch (error) {
    postsError.value = getErrorMessage(error, 'Failed to load posts from the backend.')
  } finally {
    postsLoading.value = false
    postsLoadingMore.value = false
    nextTick(() => checkOpenPostQuery())
  }
}

function shouldLoadMorePosts() {
  if (activePage.value !== 'home' || postsLoading.value || postsLoadingMore.value || !postsHasMore.value) {
    return false
  }

  const container = mainScrollContainer.value
  if (!container) return false

  const scrollTarget = container.scrollHeight > container.clientHeight
      ? container
      : document.scrollingElement || document.documentElement

  return scrollTarget.scrollTop + scrollTarget.clientHeight >= scrollTarget.scrollHeight - 240
}

function handleHomeScroll() {
  if (shouldLoadMorePosts()) {
    loadPosts({page: postsPage.value + 1, append: true})
  }
}

function addHomeScrollListener() {
  const container = mainScrollContainer.value
  if (!container || postsScrollListenerAttached.value) return

  container.addEventListener('scroll', handleHomeScroll, {passive: true})
  window.addEventListener('scroll', handleHomeScroll, {passive: true})
  postsScrollListenerAttached.value = true
}

function removeHomeScrollListener() {
  const container = mainScrollContainer.value
  if (!container || !postsScrollListenerAttached.value) return

  container.removeEventListener('scroll', handleHomeScroll)
  window.removeEventListener('scroll', handleHomeScroll)
  postsScrollListenerAttached.value = false
}

function applyProfileData(profile, user) {
  if (profile?.fullName) profileForm.name = profile.fullName
  if (profile?.gender) profileForm.gender = profile.gender
  if (profile?.phone || user?.phone) profileForm.phone = profile?.phone || user.phone
  if (profile?.profileImageUrl) profileForm.avatar = profile.profileImageUrl
  if (profile?.logoUrl) profileForm.avatar = profile.logoUrl

  profileForm.user_name = user?.user_name || ''
  if (user?.email) profileForm.email = user.email

  if (profile?.university) profileForm.university = profile.university
  if (profile?.major) profileForm.major = profile.major
  if (profile?.yearLevel) profileForm.yearLevel = profile.yearLevel
  if (profile?.bio) profileForm.bio = profile.bio
  if (profile?.jobType) profileForm.jobType = profile.jobType
  if (profile?.expectedSalary) profileForm.expectedSalary = profile.expectedSalary
  if (profile?.currency) profileForm.currency = profile.currency
  if (Array.isArray(profile?.skills)) profileForm.skills = profile.skills
  if (profile?.availability) profileForm.availability = profile.availability

  if (profile?.companyName) profileForm.companyName = profile.companyName
  if (profile?.industry) profileForm.industry = profile.industry
  if (profile?.address) profileForm.address = profile.address
  if (profile?.website) profileForm.website = profile.website
  if (profile?.companyDescription) profileForm.companyDescription = profile.companyDescription
}

async function fetchPersonalInfo() {
  profileLoadError.value = ''

  try {
    const isEmployer = auth.user?.role === 'employer'
    const endpoint = isEmployer ? '/employer-profile/me' : '/student-profile/me'

    const [{data: profileData}, accountUser] = await Promise.all([
      api.get(endpoint),
      auth.refreshUser(),
    ])

    applyProfileData(profileData.profile, accountUser)
  } catch (error) {
    profileLoadError.value = getErrorMessage(error, 'Failed to load your personal info.')
  }
}

function openPersonalInfoEditor(row) {
  editingField.value = row
  editValue.value = profileForm[row.field] || ''
  profileSaveError.value = ''
}

function closePersonalInfoEditor() {
  editingField.value = null
  editValue.value = ''
  profileSaveError.value = ''
}

function buildProfileFormData() {
  const formData = new FormData()
  const isEmployer = auth.user?.role === 'employer'

  formData.append('user_name', profileForm.user_name || '')
  formData.append('email', profileForm.email || '')
  formData.append('phone', profileForm.phone || '')

  if (isEmployer) {
    formData.append('companyName', profileForm.companyName || '')
    formData.append('industry', profileForm.industry || '')
    formData.append('address', profileForm.address || '')
    formData.append('website', profileForm.website || '')
    formData.append('companyDescription', profileForm.companyDescription || '')
    formData.append('logoUrl', profileForm.avatar || '')
  } else {
    formData.append('fullName', profileForm.name || 'Student User')
    formData.append('gender', profileForm.gender || '')
    formData.append('profileImageUrl', profileForm.avatar || '')
    formData.append('university', profileForm.university || 'Not set')
    formData.append('major', profileForm.major || 'Not set')
    formData.append('yearLevel', profileForm.yearLevel || '')
    formData.append('bio', profileForm.bio || '')
    formData.append('jobType', profileForm.jobType || '')
    formData.append('expectedSalary', profileForm.expectedSalary || '')
    formData.append('currency', profileForm.currency || 'USD')
    formData.append('skills', JSON.stringify(profileForm.skills || []))
    formData.append('availability', JSON.stringify(profileForm.availability || null))
  }
  return formData
}

async function savePersonalInfoEdit() {
  if (!editingField.value) return

  const field = editingField.value.field
  profileSaveError.value = ''
  isSavingProfile.value = true

  try {
    profileForm[field] = editValue.value.trim()
    const isEmployer = auth.user?.role === 'employer'
    const endpoint = isEmployer ? '/employer-profile/setup' : '/student-profile'

    const {data} = await api.post(endpoint, buildProfileFormData())
    applyProfileData(isEmployer ? data : data.profile, null)
    closePersonalInfoEditor()
  } catch (error) {
    profileSaveError.value = getErrorMessage(error, 'Failed to save your personal info.')
  } finally {
    isSavingProfile.value = false
  }
}

onMounted(() => {
  initializeSocketConnection()
  refreshAppliedPosts()

  if (activePage.value === 'home' || activePage.value === 'profile') {
    loadPosts()
  }

  if (activePage.value === 'home') {
    nextTick(() => {
       addHomeScrollListener()
       handleHomeScroll()
    })
  }

  if (activePage.value === 'search') {
    searchPosts()
  }

  if (activePage.value === 'settings' || activePage.value === 'profile') {
    fetchPersonalInfo()
  }

  if (activePage.value === 'settings') {
    loadPasskeys()
  }

  if (activePage.value === 'notifications') {
    fetchNotifications()
  }
})

onUnmounted(() => {
  removeHomeScrollListener()
  if (socket) {
    socket.disconnect()
    socket = null
  }
})

watch(activePage, (page, previousPage) => {
  if ((page === 'home' || page === 'profile') && previousPage !== page) {
    loadPosts()
  }

  if (page === 'search' && previousPage !== 'search') {
    searchPosts()
  }

  if (page === 'notifications' && previousPage !== 'notifications') {
    fetchNotifications()
  }

  if (page === 'home') {
    nextTick(() => {
      addHomeScrollListener()
      handleHomeScroll()
    })
  } else {
    removeHomeScrollListener()
  }

  if (page === 'home' || page === 'profile') {
    refreshAppliedPosts()
  }
})

watch(
  () => route.query.post,
  () => {
    nextTick(() => checkOpenPostQuery())
  },
)

watch(
  () => auth.isAuthenticated,
  () => {
    refreshAppliedPosts()
  },
)

function toggleThemeMode() {
  setThemePreference(appliedTheme.value === 'dark' ? 'light' : 'dark')
}

function saveProfile() {
  // TODO: Connect this form to the profile update API when the endpoint is ready.
}

function formatDate(value) {
  return new Date(value).toLocaleDateString()
}

async function loadPasskeys() {
  passkeyError.value = ''

  try {
    const {data} = await api.get('/auth/passkeys')
    passkeys.value = data.passkeys
  } catch (error) {
    passkeyError.value = getErrorMessage(error, 'Could not load passkeys.')
  }
}

function openPasswordEditor() {
  passwordError.value = ''
  isPasswordEditorOpen.value = true
}

function closePasswordEditor() {
  isPasswordEditorOpen.value = false
  passwordError.value = ''
  passwordForm.current = ''
  passwordForm.next = ''
  passwordForm.confirm = ''
}

async function addPasskey() {
  passkeyError.value = ''
  passkeyMessage.value = ''

  if (!window.PublicKeyCredential) {
    passkeyError.value = 'Passkeys are not supported in this browser.'
    return
  }

  passkeyLoading.value = true
  try {
    const {data: options} = await api.post('/auth/passkey/register/options')
    const response = await startRegistration({optionsJSON: options})
    const {data} = await api.post('/auth/passkey/register/verify', {response})
    passkeys.value = data.passkeys
    passkeyMessage.value = 'Passkey added successfully.'
  } catch (error) {
    passkeyError.value = getErrorMessage(error, 'Could not add passkey. Please try again.')
  } finally {
    passkeyLoading.value = false
  }
}

async function handleLogout() {
  logoutError.value = ''

  try {
    await auth.logout(router)
  } catch (error) {
    logoutError.value = getErrorMessage(error, 'Could not logout. Please try again.')
  }
}

async function updatePassword() {
  passwordError.value = ''
  passwordMessage.value = ''

  if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
    passwordError.value = 'Please fill in all password fields.'
    return
  }

  if (passwordForm.next.length < 8) {
    passwordError.value = 'New password must be at least 8 characters.'
    return
  }

  if (passwordForm.next !== passwordForm.confirm) {
    passwordError.value = 'New passwords do not match.'
    return
  }

  passwordLoading.value = true
  try {
    await api.post('/auth/password', {
      currentPassword: passwordForm.current,
      newPassword: passwordForm.next,
    })
    passwordMessage.value = 'Password updated successfully.'
    closePasswordEditor()
  } catch (error) {
    passwordError.value = getErrorMessage(error, 'Could not update password. Check your current password and try again.')
  } finally {
    passwordLoading.value = false
  }
}

function handleHomeSearch() {
  if (!searchQuery.value.trim()) return
  router.push('/search')
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
    }
  ]

  // Only employers see the job posting creation tab
  if (auth.user?.role?.toLowerCase() === 'employer') {
    items.push({
      label: t('sidebar.create') || 'Create Job',
      page: 'create',
      icon: PlusCircleIcon,
      bg: 'bg-[#f8a9dc]',
      color: 'text-[#9b1f70]',
      to: '/create'
    })
  }

  // Only admins see the business moderations dashboard tab
  if (auth.user?.role?.toLowerCase() === 'admin') {
    items.push({
      label: 'Moderation',
      page: 'admin-moderation',
      icon: ShieldCheckIcon,
      bg: 'bg-[#ffbfa3]',
      color: 'text-[#8b3f1a]',
      to: '/admin-moderation'
    })
  }

  items.push({
    label: t('sidebar.profile'),
    page: 'profile',
    icon: UserCircleIcon,
    bg: 'bg-[#ffc28e]',
    color: 'text-[#83460e]',
    to: '/profile'
  })

  return items
})

const sidebarItems = computed(() => navigationItems.value.map((item) => ({
  ...item,
  active: item.page === activePage.value,
})))

const stories = computed(() => {
  const brandsMap = new Map()
  
  const defaultBrands = [
    {name: 'Brown Coffee', ring: 'bg-[#aecbfa]', avatar: null},
    {name: 'RUPP', ring: 'bg-[#d7b7ff]', avatar: null},
    {name: 'Wing Bank', ring: 'bg-[#8fd99b]', avatar: null},
    {name: 'Chip Mong', ring: 'bg-[#ffc28e]', avatar: null},
    {name: 'Smart', ring: 'bg-[#8ccaff]', avatar: null},
    {name: 'Pi Pay', ring: 'bg-[#f8a9dc]', avatar: null},
  ]
  defaultBrands.forEach(b => brandsMap.set(b.name, b))

  posts.value.forEach(post => {
    if (post.userRole === 'employer' || post.author?.role === 'employer') {
      const name = post.company || 'Employer'
      brandsMap.set(name, {
        name,
        ring: 'bg-[#8ccaff]',
        avatar: post.author?.employerProfile?.logoUrl || null
      })
    }
  })

  return Array.from(brandsMap.values()).slice(0, 6)
})

const composeActions = computed(() => {
  const isEmployer = auth.user?.role === 'employer'
  if (isEmployer) {
    return [
      {label: 'Post a Job', icon: BriefcaseIcon, color: 'text-[#1a4fa3]'},
      {label: 'Post an Event', icon: PlusCircleIcon, color: 'text-[#246b36]'},
      {label: 'Company Update', icon: BuildingStorefrontIcon, color: 'text-[#8a4a11]'},
    ]
  }
  return [
    {label: t('home.post'), icon: PlusCircleIcon, color: 'text-[#1a4fa3]'},
    {label: t('home.jobAlert'), icon: BriefcaseIcon, color: 'text-[#246b36]'},
    {label: t('home.company'), icon: BuildingStorefrontIcon, color: 'text-[#8a4a11]'},
  ]
})

const focusCards = computed(() => {
  const isEmployer = auth.user?.role === 'employer'
  if (isEmployer) {
    return [
      {label: 'Active Postings', value: '4', desc: 'Your active job postings on FirstStep.'},
      {label: 'New Applicants', value: '12', desc: 'Review new candidates waiting for your response today.'},
      {label: 'Interviews', value: '3', desc: 'Upcoming interviews scheduled this week.'},
    ]
  }
  return [
    {label: t('home.savedJobs'), value: '8', desc: 'Three saved roles close in the next 48 hours.'},
    {label: t('home.applications'), value: '5', desc: 'Two employers viewed your student profile today.'},
    {label: t('home.profileStrength'), value: '86%', desc: 'Add availability to improve match ranking.'},
  ]
})

const suggestions = computed(() => {
  const uniqueAuthors = new Map()
  
  posts.value.forEach(post => {
    const author = post.author
    if (author && author.id !== auth.user?.id) {
      const isEmp = author.role === 'employer'
      const name = isEmp
        ? author.employerProfile?.companyName || author.user_name || 'Hiring Manager'
        : author.studentProfile?.fullName || author.user_name || 'Fellow Talent'
      const role = isEmp
        ? author.employerProfile?.companyName ? 'Recruiter · Active hiring' : 'Mentor'
        : author.studentProfile?.major ? `${author.studentProfile.major} · ${author.studentProfile.university}` : 'Student'
      
      uniqueAuthors.set(author.id, {
        id: author.id,
        name,
        role,
        bg: isEmp ? 'bg-[#8fd99b]' : 'bg-[#d7b7ff]',
        text: isEmp ? 'text-[#246b36]' : 'text-[#6a39b8]',
        actionText: 'Connect'
      })
    }
  })

  const list = Array.from(uniqueAuthors.values())
  if (list.length < 3) {
    const fallbacks = [
      { id: '16c9fd2e-b01b-4d9b-a46c-df5e2229842b', name: 'Sokha R.', role: 'Recruiter · Wing Bank', bg: 'bg-[#8fd99b]', text: 'text-[#246b36]', actionText: 'Connect' },
      { id: '7e92d86d-02bb-4286-88f8-4469c7b40ce8', name: 'Dara Mentor', role: 'Mentor · Product Design', bg: 'bg-[#d7b7ff]', text: 'text-[#6a39b8]', actionText: 'Connect' },
      { id: 'b209aedb-f6b4-45cb-9192-0b0a60535276', name: 'Dyna K.', role: 'Computer Science · RUPP', bg: 'bg-[#8ccaff]', text: 'text-[#235d84]', actionText: 'Connect' }
    ]
    fallbacks.forEach(f => {
      if (list.length < 3 && f.id !== auth.user?.id && !uniqueAuthors.has(f.id)) {
        list.push(f)
      }
    })
  }
  return list.slice(0, 3)
})

const userAvatar = computed(() => {
  return auth.user?.role === 'employer'
    ? profileForm.avatar
    : profileForm.profileImageUrl
})

const userInitials = computed(() => {
  const name = auth.user?.role === 'employer'
    ? profileForm.companyName || auth.user?.user_name || 'E'
    : profileForm.fullName || auth.user?.user_name || 'S'
  return name.charAt(0).toUpperCase()
})

function handleComposerClick() {
  activePage.value = 'create'
  router.push('/create')
}

const showAddStoryModal = ref(false)
const storyText = ref('')
const isPublishingStory = ref(false)

async function publishStory() {
  if (isPublishingStory.value) return
  isPublishingStory.value = true
  try {
    await api.post('/posts', {
      title: 'Brand Story Update',
      content: storyText.value
    })
    storyText.value = ''
    showAddStoryModal.value = false
    await loadPosts()
  } catch (e) {
    console.error('Failed to publish brand story:', e)
    window.alert('Could not publish story update.')
  } finally {
    isPublishingStory.value = false
  }
}

async function handleConnectTalent(person) {
  try {
    // Toggle follow in database!
    await api.post(`/follows/toggle/${person.id}`)
    
    // Post an initial connection message
    await api.post('/messages', {
      receiverId: person.id,
      content: `Hello ${person.name}! I saw your profile on the recommendations panel and would love to connect!`
    })
  } catch (e) {
    console.error('Failed to toggle follow/send connection message:', e)
  }
  // Redirect to messages page
  activePage.value = 'messages'
  router.push('/messages')
}

function downloadResumePdf() {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return
  
  const skillsList = (profileForm.skills || [])
    .map(s => `<span class="skill-tag">${s}</span>`)
    .join(' ')
    
  printWindow.document.write(`
    <html>
      <head>
        <title>\${profileForm.fullName || profileForm.name || 'Resume'} - Professional Profile</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            color: #1e293b;
            line-height: 1.6;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 24px;
            margin-bottom: 24px;
          }
          .name {
            font-size: 32px;
            font-weight: 800;
            color: #2563eb;
            margin: 0;
            letter-spacing: -0.03em;
          }
          .title {
            font-size: 16px;
            font-weight: 600;
            color: #64748b;
            margin-top: 4px;
          }
          .section {
            margin-bottom: 24px;
          }
          .section-title {
            font-size: 14px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #2563eb;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 6px;
            margin-bottom: 12px;
          }
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .card {
            background: #f8fafc;
            border-radius: 8px;
            padding: 16px;
            border: 1px solid #f1f5f9;
          }
          .skill-tag {
            display: inline-block;
            background: #eff6ff;
            color: #1e40af;
            padding: 6px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
            margin: 4px;
          }
          .bio {
            color: #475569;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="name">\${profileForm.fullName || profileForm.name || 'Student Profile'}</h1>
          <p class="title">\${profileCategory.value || 'Candidate'}</p>
          <p style="font-size:12px; color:#64748b; margin-top:8px;">
            📍 \${profileEducation.value || 'Phnom Penh, Cambodia'} | 📞 \${profileForm.phone || 'No phone listed'} | ✉|️ \${auth.user?.email || ''}
          </p>
        </div>
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <p class="bio">\${profileBio.value || 'No summary bio uploaded.'}</p>
        </div>
        <div class="section">
          <div class="section-title">Education & Details</div>
          <div class="grid-2">
            <div class="card">
              <strong>University</strong>
              <p style="margin:4px 0 0; font-size:14px; color:#475569;">\${profileForm.university || 'N/A'}</p>
            </div>
            <div class="card">
              <strong>Expected Salary</strong>
              <p style="margin:4px 0 0; font-size:14px; color:#475569;">\${profileForm.expectedSalary ? profileForm.expectedSalary + ' ' + (profileForm.currency || 'USD') : 'Open to offers'}</p>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Skills & Core Expertise</div>
          <div style="margin-left:-4px;">
            \${skillsList.length ? skillsList : '<p style="font-size:14px; color:#64748b;">No skills listed.</p>'}
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 1000);
          }
        <\/script>
      </body>
    </html>
  `)
  printWindow.document.close()
}
</script>
