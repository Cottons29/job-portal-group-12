<template>
  <div class="min-h-screen bg-[#18191b] text-on-surface lg:overflow-hidden">
    <div class="mx-auto flex min-h-screen max-w-360 bg-surface">
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
            @open-post="openPost"
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
            @update:active-settings-section="activeSettingsSection = $event"
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
        />


        <section v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article
              v-for="card in pageContent.cards"
              :key="card.title"
              class="rounded-[2rem] bg-surface-container-low p-6 shadow-sm ring-1 ring-white/5"
          >
            <span :class="[card.bg, 'grid h-12 w-12 place-items-center rounded-2xl']">
              <component :is="card.icon" :class="[card.color, 'h-6 w-6']"/>
            </span>
            <h2 class="mt-5 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">{{ card.title }}</h2>
            <p class="mt-2 text-sm font-semibold leading-6 text-on-surface-variant">{{ card.description }}</p>
          </article>
        </section>

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
                @close="closePost"
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

import api from '@/lib/api'
import PlaceholderSidebar from '@/components/placeholder/PlaceholderSidebar.vue'
import HomeSection from '@/components/placeholder/sections/HomeSection.vue'
import SettingsSection from '@/components/placeholder/sections/SettingsSection.vue'
import ProfileSection from '@/components/placeholder/sections/ProfileSection.vue'
import CreatePostSection from '@/components/placeholder/sections/CreatePostSection.vue'
import PersonalInfoEditor from '@/components/placeholder/sections/PersonalInfoEditor.vue'
import PasswordEditor from '@/components/placeholder/sections/PasswordEditor.vue'
import PostModal from '@/components/placeholder/sections/PostModal.vue'
import {useThemeMode} from '@/composables/useThemeMode'
import {useAuthStore} from '@/stores/auth'
import {
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
  LockClosedIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
  SquaresPlusIcon,
  UserGroupIcon,
  UserCircleIcon,
  UserIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
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
})

const profileLoadError = ref('')
const profileSaveError = ref('')
const isSavingProfile = ref(false)
const editingField = ref(null)
const editValue = ref('')
const activeSettingsSection = ref('personal')

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
const selectedPost = ref(null)
const mainScrollContainer = ref(null)

const canSubmitPost = computed(() => postForm.title.trim() && postForm.content.trim())
const postPreviewHtml = computed(() => renderMarkdown(postForm.content || 'Start writing your post to see the preview here.'))

const initials = computed(() => {
  const letters = profileForm.name
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
  {label: 'posts', value: posts.value.length || 6},
  {label: 'followers', value: '1.2K'},
  {label: 'following', value: profileForm.skills.length || 9},
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

const profileGallery = computed(() => posts.value.map((post) => ({
  title: post.title || 'Untitled post',
  type: 'Post',
  image: post.imageUrl || getFirstContentImage(post.desc),
  post,
})))

function openPost(post) {
  if (!post) return
  selectedPost.value = post
}

function closePost() {
  selectedPost.value = null
}

const settingsMenuItems = computed(() => [
  {
    label: 'Personal info',
    section: 'personal',
    icon: IdentificationIcon,
    bg: 'bg-[#8fd99b]',
    color: 'text-[#1f6c3b]',
    active: activeSettingsSection.value === 'personal'
  },
  {
    label: 'Security & sign-in',
    section: 'security',
    icon: LockClosedIcon,
    bg: 'bg-[#8ccaff]',
    color: 'text-[#235d84]',
    active: activeSettingsSection.value === 'security'
  },
  {
    label: 'Data & privacy',
    section: 'privacy',
    icon: ShieldCheckIcon,
    bg: 'bg-[#d7b7ff]',
    color: 'text-[#5b36a8]',
    active: activeSettingsSection.value === 'privacy'
  },
  {
    label: 'Logout',
    section: 'logout',
    icon: ArrowRightOnRectangleIcon,
    bg: 'bg-red-500/15',
    color: 'text-red-300',
    active: activeSettingsSection.value === 'logout'
  },
  // {label: 'People & sharing', icon: UserGroupIcon, bg: 'bg-[#f8a9dc]', color: 'text-[#9b1f70]', to: '/settings'},
  // {label: 'Wallet & subscriptions', icon: CreditCardIcon, bg: 'bg-[#ffc28e]', color: 'text-[#83460e]', to: '/settings'},
])

const securityRows = computed(() => [
  {
    label: 'Passkey login',
    values: [
      passkeys.value.length
          ? `${passkeys.value.length} passkey${passkeys.value.length === 1 ? '' : 's'} added`
          : 'Sign in with Face ID, Touch ID, Windows Hello, or your device screen lock.',
    ],
    icon: KeyIcon,
    buttonLabel: passkeyLoading.value ? 'Adding...' : 'Add passkey',
    action: addPasskey,
  },
  {
    label: 'Password',
    values: [passwordMessage.value || 'Minimum 8 characters with a mix of letters, numbers, and symbols is recommended.'],
    icon: LockClosedIcon,
    action: openPasswordEditor,
  },
])

const personalInfoRows = computed(() => [
  {
    label: 'Profile picture',
    field: 'avatar',
    values: [],
    icon: CameraIcon,
    avatar: profileForm.avatar || defaultAvatar,
    placeholder: 'Paste profile image URL',
    inputType: 'url',
  },
  {
    label: 'Name',
    field: 'name',
    values: [profileForm.name || 'Your name'],
    icon: IdentificationIcon,
    placeholder: 'Enter your full name',
    inputType: 'text',
  },
  {
    label: 'Username',
    field: 'user_name',
    values: [profileForm.user_name || '<Blank>'],
    icon: UserCircleIcon,
    placeholder: 'Enter your username',
    inputType: 'text',
  },
  {
    label: 'Gender',
    field: 'gender',
    values: [profileForm.gender || 'Not set'],
    icon: UserIcon,
    placeholder: 'Enter your gender',
    inputType: 'text',
  },
  {
    label: 'Email',
    field: 'email',
    values: [profileForm.email || 'No email linked'],
    icon: EnvelopeIcon,
    placeholder: 'Enter your email address',
    inputType: 'email',
  },
  {
    label: 'Phone',
    field: 'phone',
    values: [profileForm.phone || 'No phone number'],
    icon: PhoneIcon,
    placeholder: 'Enter your phone number',
    inputType: 'tel',
  },
])

const pages = {
  home: {
    eyebrow: 'Home feed',
    title: `Welcome back, ${profileForm.user_name || 'Guest'}`,
  },
  search: {
    eyebrow: 'Search',
    title: 'Find jobs, people, and companies.',
    description: 'Use this area to discover opportunities without leaving the dashboard layout.',
    cards: [
      {
        title: 'Job search',
        description: 'Search part-time work, internships, and campus opportunities matched to your skills.',
        icon: MagnifyingGlassIcon,
        bg: 'bg-[#8fd99b]',
        color: 'text-[#1f6c3b]'
      },
      {
        title: 'Company discovery',
        description: 'Browse employers, saved companies, and new hiring teams in one place.',
        icon: BuildingStorefrontIcon,
        bg: 'bg-[#ffc28e]',
        color: 'text-[#83460e]'
      },
    ],
  },
  messages: {
    eyebrow: 'Message',
    title: 'Keep conversations organized.',
    description: 'Messages from recruiters, classmates, and mentors can live inside this shared dashboard shell.',
    cards: [
      {
        title: 'Recruiter inbox',
        description: 'Review employer follow-ups and interview requests as soon as messaging is connected.',
        icon: ChatBubbleOvalLeftEllipsisIcon,
        bg: 'bg-[#8ccaff]',
        color: 'text-[#235d84]'
      },
      {
        title: 'Saved contacts',
        description: 'Keep important contacts ready for future application updates.',
        icon: UserCircleIcon,
        bg: 'bg-[#ffc28e]',
        color: 'text-[#83460e]'
      },
    ],
  },
  notifications: {
    eyebrow: 'Notification',
    title: 'See important updates.',
    description: 'Application alerts, account reminders, and platform news are shown in the same dashboard experience.',
    cards: [
      {
        title: 'Application alerts',
        description: 'Track status changes, deadlines, and employer activity from one place.',
        icon: BellIcon,
        bg: 'bg-[#d7b7ff]',
        color: 'text-[#5b36a8]'
      },
      {
        title: 'Job reminders',
        description: 'Get notified when saved jobs are closing or matching roles are posted.',
        icon: BriefcaseIcon,
        bg: 'bg-[#8fd99b]',
        color: 'text-[#1f6c3b]'
      },
    ],
  },
  create: {
    eyebrow: 'Create',
    title: 'Create something new.',
    description: 'Start posts, job alerts, or profile updates from inside the placeholder layout.',
    cards: [
      {
        title: 'Create post',
        description: 'Share updates, questions, or availability with your student job network.',
        icon: PlusCircleIcon,
        bg: 'bg-[#f8a9dc]',
        color: 'text-[#9b1f70]'
      },
      {
        title: 'Job alert',
        description: 'Prepare saved alerts for roles that fit your schedule and interests.',
        icon: BriefcaseIcon,
        bg: 'bg-[#8fd99b]',
        color: 'text-[#1f6c3b]'
      },
    ],
  },
  profile: {
    eyebrow: 'Profile',
    title: 'Build your student profile.',
    description: 'Showcase your skills, availability, and application progress in the same navigation shell.',
    cards: [
      {
        title: 'Student summary',
        description: 'Add your headline, study program, experience, and preferred job types.',
        icon: UserCircleIcon,
        bg: 'bg-[#ffc28e]',
        color: 'text-[#83460e]'
      },
      {
        title: 'Profile strength',
        description: 'Complete key sections to improve employer matching and visibility.',
        icon: BriefcaseIcon,
        bg: 'bg-[#a8c0ff]',
        color: 'text-[#243c78]'
      },
    ],
  },
  settings: {
    eyebrow: 'Account settings',
    title: 'Manage your profile.',
    description: 'Update your name, email address, and password to keep your student account accurate and secure.',
  },
}

const pageContent = computed(() => pages[activePage.value] || pages.home)

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

function renderMarkdown(value) {
  return marked
      .parse(escapeHtml(value), {async: false, breaks: true})
      .replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ')
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
  const authorName = post.author?.user_name || '<Blank>'
  const createdAt = post.createdAt ? new Date(post.createdAt) : null

  return {
    id: post.id,
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
    // heroBg: 'bg-[#aecbfa]/35',
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
}

async function fetchPersonalInfo() {
  profileLoadError.value = ''

  try {
    const [{data: profileData}, accountUser] = await Promise.all([
      api.get('/student-profile/me'),
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
  formData.append('fullName', profileForm.name || 'Student User')
  formData.append('user_name', profileForm.user_name || '')
  formData.append('email', profileForm.email || '')
  formData.append('gender', profileForm.gender || '')
  formData.append('phone', profileForm.phone || '')
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
  return formData
}

async function savePersonalInfoEdit() {
  if (!editingField.value) return

  const field = editingField.value.field
  profileSaveError.value = ''
  isSavingProfile.value = true

  try {
    profileForm[field] = editValue.value.trim()
    const {data} = await api.post('/student-profile', buildProfileFormData())
    applyProfileData(data.profile, null)
    closePersonalInfoEditor()
  } catch (error) {
    profileSaveError.value = getErrorMessage(error, 'Failed to save your personal info.')
  } finally {
    isSavingProfile.value = false
  }
}

onMounted(() => {
  if (activePage.value === 'home' || activePage.value === 'profile') {
    loadPosts()
  }

  if (activePage.value === 'home') {
    nextTick(() => {
      addHomeScrollListener()
      handleHomeScroll()
    })
  }

  if (activePage.value === 'settings' || activePage.value === 'profile') {
    fetchPersonalInfo()
  }

  if (activePage.value === 'settings') {
    loadPasskeys()
  }
})

onUnmounted(() => {
  removeHomeScrollListener()
})

watch(activePage, (page, previousPage) => {
  if ((page === 'home' || page === 'profile') && previousPage !== page) {
    loadPosts()
  }

  if (page === 'home') {
    nextTick(() => {
      addHomeScrollListener()
      handleHomeScroll()
    })
  } else {
    removeHomeScrollListener()
  }
})

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

const navigationItems = [
  {label: 'Home', page: 'home', icon: HomeIcon, bg: 'bg-[#a8c0ff]', color: 'text-[#243c78]', to: '/home'},
  {
    label: 'Search',
    page: 'search',
    icon: MagnifyingGlassIcon,
    bg: 'bg-[#8fd99b]',
    color: 'text-[#1f6c3b]',
    to: '/search'
  },
  {
    label: 'Message',
    page: 'messages',
    icon: ChatBubbleOvalLeftEllipsisIcon,
    bg: 'bg-[#8ccaff]',
    color: 'text-[#235d84]',
    to: '/messages'
  },
  {
    label: 'Notification',
    page: 'notifications',
    icon: BellIcon,
    bg: 'bg-[#d7b7ff]',
    color: 'text-[#5b36a8]',
    to: '/notifications'
  },
  {label: 'Create', page: 'create', icon: PlusCircleIcon, bg: 'bg-[#f8a9dc]', color: 'text-[#9b1f70]', to: '/create'},
  {
    label: 'Profile',
    page: 'profile',
    icon: UserCircleIcon,
    bg: 'bg-[#ffc28e]',
    color: 'text-[#83460e]',
    to: '/profile'
  },
]

const sidebarItems = computed(() => navigationItems.map((item) => ({
  ...item,
  active: item.page === activePage.value,
})))

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
