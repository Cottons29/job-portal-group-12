<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  PhoneIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const isSignUp = computed(() => auth.mode === 'signup')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

function handleSubmit() {
  if (isSignUp.value) {
    auth.register(router)
  } else {
    auth.login(router)
  }
}
</script>

<template>
  <div class="auth-page app-page min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-200">
    <!-- Hero Section (Desktop) -->
    <div class="hidden lg:flex flex-col items-center justify-center p-12 w-1/2 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-zinc-950 dark:via-blue-950/30 dark:to-zinc-900 relative overflow-hidden">
      <!-- Ambient Soft Gradients (Premium Mesh Vibe) -->
      <div class="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-indigo-200/15 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="relative z-10 flex flex-col items-center text-center max-w-xl">
        <!-- Floating Isometric Illustration Container -->
        <div class="floating-illustration mb-10 transform hover:scale-[1.02] hover:-translate-y-2 transition-all duration-500 ease-out">
          <img
            src="/images/isometric-hero.png"
            alt="Campus to Career Illustration"
            class="w-full max-w-lg object-contain drop-shadow-2xl"
          />
        </div>

        <h1 class="font-display text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight transition-colors">
          Your <span class="text-blue-600 dark:text-blue-500">bridge</span> from campus to career.
        </h1>
        
        <p class="text-slate-600 dark:text-slate-400 text-lg mt-4 max-w-md transition-colors">
          Connect with top local employers in Phnom Penh and find the flexible roles that fit your class schedule.
        </p>
      </div>
      
      <!-- Right border divider -->
      <div class="absolute right-0 top-0 bottom-0 w-px bg-slate-200/80 dark:bg-zinc-850/80"></div>
    </div>

    <!-- Form Panel -->
    <div class="auth-page__form-panel bg-slate-50 dark:bg-zinc-950 transition-colors duration-200">
      <!-- Tonal layering decorative elements -->
      <div class="auth-page__top-line dark:bg-blue-500/10"></div>
      <div class="auth-page__soft-circle dark:bg-indigo-500/5"></div>

      <div class="auth-page__form-content bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-200">
        <!-- Logo -->
        <div class="mb-4 sm:mb-6 flex justify-center">
          <!-- Light Mode: Normal Logo -->
          <img
            src="/images/logo.png"
            alt="FirstStep Logo"
            class="h-20 sm:h-24 w-auto object-contain dark:hidden select-none pointer-events-none"
          />
          <!-- Dark Mode: Color-Preserved Seamless Split Logo -->
          <div class="hidden dark:relative dark:flex h-20 sm:h-24 w-auto justify-center select-none pointer-events-none">
            <!-- Left Part: Chevron Icon (Original Pristine Colors) -->
            <img
              src="/images/logo.png"
              alt="FirstStep Logo Icon"
              class="h-full w-auto object-contain"
              style="clip-path: inset(0 68% 0 0);"
            />
            <!-- Right Part: Text (Inverted & Hue-Rotated to turn Black to White while keeping Blue) -->
            <img
              src="/images/logo.png"
              alt="FirstStep Logo Text"
              class="absolute top-0 left-0 h-full w-auto object-contain"
              style="clip-path: inset(0 0 0 32%); filter: invert(1) hue-rotate(180deg);"
            />
          </div>
        </div>

        <!-- Editorial heading -->
        <h2 class="font-display text-[1.75rem] sm:text-[1.85rem] font-bold text-slate-900 dark:text-white text-center tracking-tight leading-tight transition-colors">
          {{ isSignUp ? t('auth.signupTitle') : t('auth.loginTitle') }}
        </h2>
        <p class="mt-2 text-slate-500 dark:text-slate-400 text-[0.9rem] sm:text-[0.95rem] text-center transition-colors" style="line-height: 1.6">
          {{ isSignUp ? t('auth.signupSubtitle') : t('auth.loginSubtitle') }}
        </p>

        <!-- Login / Sign Up Tabs — tonal layering, no borders -->
        <div class="mt-7 flex rounded-full bg-slate-100 dark:bg-zinc-800 p-1.5 border border-slate-200 dark:border-zinc-700 transition-colors">
          <button
            id="tab-login"
            @click="auth.setMode('login')"
            :class="[
              'flex-1 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer',
              auth.mode === 'login'
                ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
            ]"
          >
            {{ t('auth.logIn') }}
          </button>
          <button
            id="tab-signup"
            @click="auth.setMode('signup')"
            :class="[
              'flex-1 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer',
              auth.mode === 'signup'
                ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
            ]"
          >
            {{ t('auth.signUp') }}
          </button>
        </div>

        <!-- Role Toggle — flat primary active state -->
        <div class="mt-4 flex rounded-full bg-slate-100 dark:bg-zinc-800 p-1.5 border border-slate-200 dark:border-zinc-700 transition-colors">
          <button
            id="role-student"
            @click="auth.setRole('student')"
            :class="[
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer',
              auth.role === 'student'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
            ]"
          >
            <AcademicCapIcon class="w-4 h-4" />
            {{ t('auth.student') }}
          </button>
          <button
            id="role-employer"
            @click="auth.setRole('employer')"
            :class="[
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer',
              auth.role === 'employer'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
            ]"
          >
            <BuildingOfficeIcon class="w-4 h-4" />
            {{ t('auth.employer') }}
          </button>
        </div>

        <!-- Error message -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="auth.error"
            class="mt-4 flex items-center gap-2 rounded-2xl bg-red-950/50 dark:bg-red-950/70 px-4 py-3 text-sm text-red-200 border border-red-900/60"
          >
            {{ auth.error }}
          </div>
        </Transition>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="mt-6 space-y-5">
          <!-- Phone Number -->
          <div>
            <label for="phone-input" class="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 transition-colors">
              {{ t('auth.phoneNumber') }}
            </label>
            <div class="flex items-center rounded-full bg-slate-50 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 dark:bg-zinc-800 dark:border-zinc-700 dark:focus-within:ring-blue-500 dark:focus-within:border-blue-500 transition-all duration-200"
            >
              <span class="flex items-center gap-1.5 pl-5 pr-3 text-sm text-slate-500 dark:text-slate-400">
                <PhoneIcon class="w-4 h-4" />
                <span class="font-semibold text-slate-800 dark:text-slate-200">+855</span>
              </span>
              <input
                id="phone-input"
                v-model="auth.phone"
                type="tel"
                placeholder="12 345 678"
                class="field-control auth-page__input text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none rounded-full"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password-input" class="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 transition-colors">
              {{ t('auth.password') }}
            </label>
            <div class="flex items-center rounded-full bg-slate-50 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 dark:bg-zinc-800 dark:border-zinc-700 dark:focus-within:ring-blue-500 dark:focus-within:border-blue-500 transition-all duration-200"
            >
              <span class="pl-5 pr-2 text-slate-500 dark:text-slate-400">
                <LockClosedIcon class="w-4 h-4" />
              </span>
              <input
                id="password-input"
                v-model="auth.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="field-control auth-page__input text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none rounded-full"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="pr-5 pl-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                <EyeSlashIcon v-if="showPassword" class="w-4 h-4" />
                <EyeIcon v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Confirm Password (Sign Up only) -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-[-8px]"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-[-8px]"
          >
            <div v-if="isSignUp">
              <label for="confirm-password-input" class="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 transition-colors">
                {{ t('auth.confirmPassword') }}
              </label>
              <div class="flex items-center rounded-full bg-slate-50 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 dark:bg-zinc-800 dark:border-zinc-700 dark:focus-within:ring-blue-500 dark:focus-within:border-blue-500 transition-all duration-200"
              >
                <span class="pl-5 pr-2 text-slate-500 dark:text-slate-400">
                  <LockClosedIcon class="w-4 h-4" />
                </span>
                <input
                  id="confirm-password-input"
                  v-model="auth.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirm your password"
                  class="field-control auth-page__input text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none rounded-full"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="pr-5 pl-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label="Toggle confirm password visibility"
                >
                  <EyeSlashIcon v-if="showConfirmPassword" class="w-4 h-4" />
                  <EyeIcon v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
          </Transition>

          <!-- Forgot Password (login only) -->
          <div v-if="!isSignUp" class="flex justify-end">
            <button type="button" class="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer">
              {{ t('auth.forgotPassword') }}
            </button>
          </div>

          <!-- Submit Button — flat primary CTA -->
          <button
            id="submit-btn"
            type="submit"
            :disabled="auth.isLoading"
            class="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-extrabold rounded-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-200 shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
          >
            <svg
              v-if="auth.isLoading"
              class="w-4 h-4 animate-spin text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {{ auth.isLoading ? t('auth.pleaseWait') : (isSignUp ? t('auth.createAccount') : t('auth.continue')) }}
          </button>
        </form>

        <!-- Divider -->
        <div class="my-6 flex items-center gap-4">
          <div class="flex-1 h-px bg-slate-200 dark:bg-zinc-800"></div>
          <span class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-widest uppercase">{{ t('auth.orContinueWith') }}</span>
          <div class="flex-1 h-px bg-slate-200 dark:bg-zinc-800"></div>
        </div>

        <!-- Social Buttons — tonal surface, no borders -->
        <div class="flex items-center justify-center gap-4">
          <button
            v-if="!isSignUp"
            id="btn-passkey"
            type="button"
            @click="auth.loginWithPasskey(router)"
            :disabled="auth.isLoading"
            class="flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-5 py-3 text-sm font-black text-slate-800 dark:text-slate-200 transition-all duration-200 hover:bg-surface-container-high disabled:opacity-60 cursor-pointer border border-slate-200 dark:border-zinc-700"
            style="box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05)"
            aria-label="Continue with passkey"
          >
            {{ t('auth.usePasskey') }}
          </button>
          <button
            id="btn-google"
            type="button"
            class="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all duration-200 cursor-pointer border border-slate-200 dark:border-zinc-700"
            style="box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05)"
            aria-label="Continue with Google"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </button>
          <button
            id="btn-facebook"
            type="button"
            class="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all duration-200 cursor-pointer border border-slate-200 dark:border-zinc-700"
            style="box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05)"
            aria-label="Continue with Facebook"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>
        </div>

        <!-- Terms -->
        <p class="mt-8 text-center text-xs text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">
          {{ t('auth.termsText') }}
          <a href="#" class="text-blue-600 dark:text-blue-400 font-medium underline underline-offset-2 transition-colors">{{ t('auth.termsOfService') }}</a>
          and
          <a href="#" class="text-blue-600 dark:text-blue-400 font-medium underline underline-offset-2 transition-colors">{{ t('auth.privacyPolicy') }}</a>.
        </p>
      </div>
    </div>
  </div>
</template>


<style scoped>
input::placeholder {
  transition: color 0.2s ease;
}
input:focus::placeholder {
  color: transparent;
}

:global(html[data-theme='dark'] .dark-theme-logo) {
  filter: invert(1) hue-rotate(180deg);
  opacity: 0.9;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.floating-illustration {
  animation: float 6s ease-in-out infinite;
}
</style>
