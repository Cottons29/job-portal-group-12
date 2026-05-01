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
              <p class="text-xs font-black uppercase tracking-[0.22em] text-primary">Account settings</p>
              <h1 class="font-display text-3xl font-black tracking-[-0.04em] text-on-surface sm:text-4xl">
                Manage your profile.
              </h1>
              <p class="mt-2 max-w-2xl text-sm font-semibold text-on-surface-variant">
                Update your name, email address, and password to keep your student account accurate and secure.
              </p>
            </div>
            <RouterLink
                class="inline-flex items-center justify-center rounded-full bg-surface-container-low px-5 py-3 text-sm font-black text-on-surface transition hover:bg-surface-container"
                to="/home"
            >
              Back to dashboard
            </RouterLink>
          </div>
        </header>

        <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <section class="min-w-0 space-y-6">
            <form class="rounded-[2rem] bg-surface-container-low p-5 shadow-sm ring-1 ring-white/5 sm:p-6"
                  @submit.prevent="saveProfile">
              <div class="mb-6 flex items-start gap-4">
                <span
                    class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#a8c0ff] text-xl font-black text-[#243c78]">
                  {{ initials }}
                </span>
                <div>
                  <h2 class="font-display text-2xl font-black tracking-[-0.04em] text-on-surface">Personal
                    information</h2>
                  <p class="mt-1 text-sm font-semibold text-on-surface-variant">Edit the basic details employers and
                    classmates see.</p>
                </div>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <label class="space-y-2">
                  <span class="text-sm font-black text-on-surface">Full name</span>
                  <input
                      v-model="profileForm.name"
                      class="w-full rounded-2xl bg-surface px-4 py-3 text-sm font-bold text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
                      placeholder="Enter your full name"
                      type="text"
                  />
                </label>

                <label class="space-y-2">
                  <span class="text-sm font-black text-on-surface">Email address</span>
                  <input
                      v-model="profileForm.email"
                      class="w-full rounded-2xl bg-surface px-4 py-3 text-sm font-bold text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
                      placeholder="name@example.com"
                      type="email"
                  />
                </label>
              </div>

              <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-xs font-bold text-on-surface-variant">Changes are saved locally until backend profile
                  update APIs are connected.</p>
                <button
                    class="rounded-full bg-primary px-5 py-3 text-sm font-black text-on-primary transition hover:opacity-90"
                    type="submit">
                  Save profile
                </button>
              </div>
            </form>

            <form class="rounded-[2rem] bg-surface-container-low p-5 shadow-sm ring-1 ring-white/5 sm:p-6"
                  @submit.prevent="updatePassword">
              <div class="mb-6">
                <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">Security & sign-in</p>
                <h2 class="mt-1 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">Password and passkeys</h2>
                <p class="mt-1 text-sm font-semibold text-on-surface-variant">Use a strong password and add a passkey for faster, safer sign-in.</p>
              </div>

              <div class="mb-6 rounded-[1.5rem] bg-surface p-4 ring-1 ring-outline/30">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 class="font-display text-xl font-black tracking-[-0.03em] text-on-surface">Passkey login</h3>
                    <p class="mt-1 text-sm font-semibold text-on-surface-variant">Sign in with Face ID, Touch ID, Windows Hello, or your device screen lock.</p>
                  </div>
                  <button
                      class="rounded-full bg-primary px-5 py-3 text-sm font-black text-on-primary transition hover:opacity-90 disabled:opacity-60"
                      :disabled="passkeyLoading"
                      type="button"
                      @click="addPasskey">
                    {{ passkeyLoading ? 'Adding...' : 'Add passkey' }}
                  </button>
                </div>

                <div class="mt-4 space-y-2">
                  <p v-if="passkeyMessage" class="text-sm font-bold text-[#8fd99b]">{{ passkeyMessage }}</p>
                  <p v-if="passkeyError" class="text-sm font-bold text-red-300">{{ passkeyError }}</p>
                  <p v-if="!passkeys.length" class="text-sm font-bold text-on-surface-variant">No passkeys added yet.</p>
                  <div
                      v-for="passkey in passkeys"
                      :key="passkey.id"
                      class="flex items-center justify-between rounded-2xl bg-surface-container-low px-4 py-3 text-sm font-bold text-on-surface ring-1 ring-white/5">
                    <span>Passkey</span>
                    <span class="text-on-surface-variant">Added {{ formatDate(passkey.createdAt) }}</span>
                  </div>
                </div>
              </div>

              <div class="grid gap-4">
                <label class="space-y-2">
                  <span class="text-sm font-black text-on-surface">Current password</span>
                  <input
                      v-model="passwordForm.current"
                      class="w-full rounded-2xl bg-surface px-4 py-3 text-sm font-bold text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
                      placeholder="Enter current password"
                      type="password"
                  />
                </label>

                <div class="grid gap-4 md:grid-cols-2">
                  <label class="space-y-2">
                    <span class="text-sm font-black text-on-surface">New password</span>
                    <input
                        v-model="passwordForm.next"
                        class="w-full rounded-2xl bg-surface px-4 py-3 text-sm font-bold text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
                        placeholder="Create new password"
                        type="password"
                    />
                  </label>

                  <label class="space-y-2">
                    <span class="text-sm font-black text-on-surface">Confirm password</span>
                    <input
                        v-model="passwordForm.confirm"
                        class="w-full rounded-2xl bg-surface px-4 py-3 text-sm font-bold text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
                        placeholder="Repeat new password"
                        type="password"
                    />
                  </label>
                </div>
              </div>

              <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-xs font-bold text-on-surface-variant">
                  {{ passwordMessage || 'Minimum 8 characters with a mix of letters, numbers, and symbols is recommended.' }}
                </p>
                <p v-if="passwordError" class="text-xs font-bold text-red-300">{{ passwordError }}</p>
                <button
                    :disabled="passwordLoading"
                    class="rounded-full bg-[#f5df7e] px-5 py-3 text-sm font-black text-[#745b00] transition hover:opacity-90"
                    type="submit">
                  {{ passwordLoading ? 'Updating...' : 'Update password' }}
                </button>
              </div>
            </form>
          </section>

          <aside class="space-y-6 xl:sticky xl:top-28 xl:h-fit">
            <section class="rounded-[2rem] bg-surface-container-low p-5 ring-1 ring-white/5">
              <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">Preview</p>
              <div class="mt-4 flex items-center gap-3">
                <span
                    class="grid h-12 w-12 place-items-center rounded-full bg-[#ffc28e] text-sm font-black text-[#83460e]">{{
                    initials
                  }}</span>
                <div>
                  <p class="font-black text-on-surface">{{ profileForm.name || 'Your name' }}</p>
                  <p class="text-sm font-bold text-on-surface-variant">{{
                      profileForm.email || 'your.email@example.com'
                    }}</p>
                </div>
              </div>
            </section>

            <section class="rounded-[2rem] bg-[#d7b7ff]/30 p-5 ring-1 ring-white/5">
              <p class="text-xs font-black uppercase tracking-[0.18em] text-[#6a39b8]">Tips</p>
              <ul class="mt-4 space-y-3 text-sm font-bold text-on-surface-variant">
                <li>• Keep your email active so employers can contact you.</li>
                <li>• Use your real name to make your applications easier to verify.</li>
                <li>• Change your password if you suspect someone else knows it.</li>
              </ul>
            </section>
          </aside>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {RouterLink} from 'vue-router'
import {startRegistration} from '@simplewebauthn/browser'

import PlaceholderSidebar from '@/components/placeholder/PlaceholderSidebar.vue'
import {useThemeMode} from '@/composables/useThemeMode'
import api from '@/lib/api'
import {
  BellIcon,
  BriefcaseIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  Cog6ToothIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline'

const showSidebarLabels = ref(false)
const {appliedTheme, setThemePreference} = useThemeMode()

const profileForm = reactive({
  name: 'Student User',
  email: 'student@example.com',
})

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

const initials = computed(() => {
  const fallback = 'SU'
  const letters = profileForm.name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  return letters || fallback
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
  try {
    const {data} = await api.get('/auth/passkeys')
    passkeys.value = data.passkeys
  } catch (err) {
    passkeyError.value = 'Could not load passkeys.'
  }
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
  } catch (err) {
    passkeyError.value = 'Could not add passkey. Please try again.'
  } finally {
    passkeyLoading.value = false
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
  } catch (err) {
    passwordError.value = 'Could not update password. Check your current password and try again.'
  } finally {
    passwordLoading.value = false
  }

  passwordForm.current = ''
  passwordForm.next = ''
  passwordForm.confirm = ''
}

onMounted(loadPasskeys)

const sidebarItems = [
  {label: 'Home', icon: HomeIcon, bg: 'bg-[#a8c0ff]', color: 'text-[#243c78]', to: '/dashboard'},
  {label: 'Search', icon: MagnifyingGlassIcon, bg: 'bg-[#8fd99b]', color: 'text-[#1f6c3b]'},
  {label: 'Message', icon: ChatBubbleOvalLeftEllipsisIcon, bg: 'bg-[#8ccaff]', color: 'text-[#235d84]'},
  {label: 'Notification', icon: BellIcon, bg: 'bg-[#d7b7ff]', color: 'text-[#5b36a8]'},
  {label: 'Create', icon: PlusCircleIcon, bg: 'bg-[#f8a9dc]', color: 'text-[#9b1f70]'},
  {label: 'Profile', icon: UserCircleIcon, bg: 'bg-[#ffc28e]', color: 'text-[#83460e]'},
  {label: 'Settings', icon: Cog6ToothIcon, bg: 'bg-[#f5df7e]', color: 'text-[#745b00]', to: '/settings', active: true},
]
</script>
