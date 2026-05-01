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

        <div v-if="activePage === 'home'" class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
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

        <div v-else-if="activePage === 'settings'"
             class="grid gap-4 xl:grid-cols-[15rem_minmax(0,0.78fr)] xl:justify-start ">
          <aside class="space-y-2 xl:sticky xl:top-28 xl:h-fit">
            <RouterLink
                v-for="item in settingsMenuItems"
                :key="item.label"
                :class="[
                    item.active ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant hover:bg-surface-container-low',
                    'flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-black transition'
                ]"
                :to="item.to"
            >
              <span :class="[item.bg, 'grid h-9 w-9 shrink-0 place-items-center rounded-xl']">
                <component :is="item.icon" :class="[item.color, 'h-4 w-4']"/>
              </span>
              <span class="leading-tight">{{ item.label }}</span>
            </RouterLink>
          </aside>

          <section class="mx-auto min-w-39/40 max-w-2xl">
            <h2 class="mb-4 text-center font-display text-xl font-black tracking-[-0.04em] text-on-surface sm:text-2xl">
              Personal info
            </h2>

            <p v-if="profileLoadError" class="mb-3 rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
              {{ profileLoadError }}
            </p>

            <div class="overflow-hidden rounded-[1.25rem] bg-surface-container-low ring-1 ring-white/5">
              <article
                  v-for="(row, index) in personalInfoRows"
                  :key="row.label"
                  :class="[
                      index === 0 ? 'rounded-t-[1.25rem]' : '',
                      index === personalInfoRows.length - 1 ? 'rounded-b-[1.25rem]' : '',
                      'flex cursor-pointer items-center gap-3 border-b border-surface last:border-b-0 bg-surface-container-low px-3 py-3 transition hover:bg-surface-container-high sm:px-4'
                  ]"
                  role="button"
                  tabindex="0"
                  @click="openPersonalInfoEditor(row)"
                  @keydown.enter.prevent="openPersonalInfoEditor(row)"
                  @keydown.space.prevent="openPersonalInfoEditor(row)"
              >
                <component :is="row.icon" class="h-4 w-4 shrink-0 text-on-surface-variant"/>
                <div class="min-w-0 flex-1">
                  <h3 class="text-base font-black tracking-[-0.03em] text-on-surface">{{ row.label }}</h3>
                  <p
                      v-for="value in row.values"
                      :key="value"
                      class="mt-0.5 truncate text-xs font-bold text-on-surface-variant"
                  >
                    {{ value }}
                  </p>
                </div>
                <img
                    v-if="row.avatar"
                    :alt="row.label"
                    class="h-10 w-10 rounded-full object-cover ring-2 ring-surface-container-low"
                    :src="row.avatar"
                />
                <span class="text-lg font-black text-on-surface-variant/70">›</span>
              </article>
            </div>
          </section>
        </div>

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
          <div
              v-if="editingField"
              class="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-6 backdrop-blur-sm"
              @click.self="closePersonalInfoEditor"
          >
            <form
                class="w-full max-w-md rounded-[1.5rem] bg-surface-container-low p-5 shadow-2xl ring-1 ring-white/10"
                @submit.prevent="savePersonalInfoEdit"
            >
              <div class="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">Edit personal info</p>
                  <h2 class="mt-1 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">
                    {{ editingField.label }}
                  </h2>
                </div>
                <button
                    class="grid h-9 w-9 place-items-center rounded-full bg-surface text-xl font-black text-on-surface-variant transition hover:text-on-surface"
                    type="button"
                    @click="closePersonalInfoEditor"
                >
                  ×
                </button>
              </div>

              <label class="space-y-2">
                <span class="text-sm font-black text-on-surface">{{ editingField.label }}</span>
                <input
                    v-model="editValue"
                    :placeholder="editingField.placeholder"
                    :type="editingField.inputType"
                    class="w-full rounded-2xl bg-surface px-4 py-3 text-sm font-bold text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
                />
              </label>

              <p v-if="profileSaveError" class="mt-3 text-xs font-bold text-red-300">{{ profileSaveError }}</p>

              <div class="mt-6 flex justify-end gap-3">
                <button
                    class="rounded-full px-5 py-3 text-sm font-black text-on-surface-variant transition hover:bg-surface"
                    type="button"
                    @click="closePersonalInfoEditor"
                >
                  Cancel
                </button>
                <button
                    class="rounded-full bg-primary px-5 py-3 text-sm font-black text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="isSavingProfile"
                    type="submit"
                >
                  {{ isSavingProfile ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </form>
          </div>
        </Teleport>
      </main>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {RouterLink, useRoute} from 'vue-router'
import {isAxiosError} from 'axios'

import api from '@/lib/api'
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
const showSidebarLabels = ref(false)
const {appliedTheme, setThemePreference} = useThemeMode()

const activePage = computed(() => route.name?.toString() || 'home')

const defaultAvatar = 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=160&q=80'

const profileForm = reactive({
  name: 'Student User',
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

const passwordForm = reactive({
  current: '',
  next: '',
  confirm: '',
})

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

const settingsMenuItems = [
  {
    label: 'Personal info',
    icon: IdentificationIcon,
    bg: 'bg-[#8fd99b]',
    color: 'text-[#1f6c3b]',
    to: '/settings',
    active: true
  },
  {label: 'Security & sign-in', icon: LockClosedIcon, bg: 'bg-[#8ccaff]', color: 'text-[#235d84]', to: '/settings'},
  {label: 'Data & privacy', icon: ShieldCheckIcon, bg: 'bg-[#d7b7ff]', color: 'text-[#5b36a8]', to: '/settings'},
  // {label: 'People & sharing', icon: UserGroupIcon, bg: 'bg-[#f8a9dc]', color: 'text-[#9b1f70]', to: '/settings'},
  // {label: 'Wallet & subscriptions', icon: CreditCardIcon, bg: 'bg-[#ffc28e]', color: 'text-[#83460e]', to: '/settings'},
]

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
    title: 'Welcome back, student.',
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

function applyProfileData(profile, user) {
  if (profile?.fullName) profileForm.name = profile.fullName
  if (profile?.gender) profileForm.gender = profile.gender
  if (profile?.phone || user?.phone) profileForm.phone = profile?.phone || user.phone
  if (profile?.profileImageUrl) profileForm.avatar = profile.profileImageUrl
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
    const [{data: profileData}, {data: accountData}] = await Promise.all([
      api.get('/student-profile/me'),
      api.get('/auth/me'),
    ])

    applyProfileData(profileData.profile, accountData.user)
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
  if (activePage.value === 'settings') {
    fetchPersonalInfo()
  }
})

function toggleThemeMode() {
  setThemePreference(appliedTheme.value === 'dark' ? 'light' : 'dark')
}

function saveProfile() {
  // TODO: Connect this form to the profile update API when the endpoint is ready.
}

function updatePassword() {
  // TODO: Connect this form to the password update API when the endpoint is ready.
  passwordForm.current = ''
  passwordForm.next = ''
  passwordForm.confirm = ''
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
