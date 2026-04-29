<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  PhoneIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
} from '@heroicons/vue/24/outline'

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
  <div class="flex min-h-screen bg-surface font-sans">
    <!-- ════════════════════════════════════════════
         LEFT HERO PANEL
         ════════════════════════════════════════════ -->
    <div
      class="hidden lg:flex lg:w-[48%] relative flex-col items-center justify-center overflow-hidden"
      style="background: #D3E4FE"
    >
      <!-- Warm decorative blobs -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-80 h-80 bg-amber-200/25 rounded-full blur-3xl"></div>
      <div class="absolute top-1/4 -right-8 w-52 h-52 bg-orange-100/30 rounded-full blur-2xl"></div>

      <!-- Hero content -->
      <div class="relative z-10 px-10 flex flex-col items-center max-w-[500px]">
        <!-- Illustration card — "surface-on-surface" layering per design rules -->
        <div
          class="w-[320px] h-[320px] xl:w-[360px] xl:h-[360px] mb-10 flex-shrink-0 rounded-[2rem] bg-surface-container-lowest overflow-hidden rotate-[-2deg] hover:rotate-0 transition-transform duration-500"
          style="box-shadow: 0 20px 40px rgba(11, 28, 48, 0.08)"
        >
          <img
            src="/images/hero-illustration.png"
            alt="Students and employers connecting"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Editorial heading — Plus Jakarta Sans, display scale -->
        <h1 class="font-display text-[2.75rem] xl:text-[3.25rem] font-extrabold text-on-surface text-center leading-tight tracking-tight">
          Welcome to
          <span class="block mt-1">First<span style="color: #2196F3">Step</span>.</span>
        </h1>
        <p class="mt-4 text-center text-on-surface-variant text-base xl:text-lg max-w-sm" style="line-height: 1.6">
          The upward ascent for Cambodia's next generation of professional talent.
        </p>
      </div>
    </div>

    <!-- ════════════════════════════════════════════
         RIGHT FORM PANEL
         ════════════════════════════════════════════ -->
    <div class="flex-1 flex items-center justify-center px-6 py-10 relative overflow-hidden bg-surface">
      <!-- Tonal layering decorative elements -->
      <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-surface-container-low rounded-full"></div>
      <div class="absolute top-12 left-12 w-20 h-20 bg-surface-container rounded-full"></div>

      <div class="w-full max-w-[420px] relative z-10">
        <!-- Logo -->
        <div class="mb-8">
          <img
            src="/images/logo.png"
            alt="FirstStep Logo"
            class="h-50 w-auto object-contain"
          />
        </div>

        <!-- Editorial heading -->
        <h2 class="font-display text-[1.85rem] font-bold text-on-surface tracking-tight leading-tight">
          {{ isSignUp ? 'Create your account' : 'Log in or Sign Up' }}
        </h2>
        <p class="mt-2 text-on-surface-variant text-[0.95rem]" style="line-height: 1.6">
          {{ isSignUp ? 'Start your career journey today.' : 'Join thousands of students building their future.' }}
        </p>

        <!-- Login / Sign Up Tabs — tonal layering, no borders -->
        <div class="mt-7 flex rounded-[1.25rem] bg-surface-container-low p-1.5">
          <button
            id="tab-login"
            @click="auth.setMode('login')"
            :class="[
              'flex-1 py-2.5 text-sm font-semibold rounded-[1rem] transition-all duration-300 cursor-pointer',
              auth.mode === 'login'
                ? 'bg-surface-container-lowest text-on-surface'
                : 'text-on-surface-variant hover:text-on-surface',
            ]"
            :style="auth.mode === 'login' ? 'box-shadow: 0 2px 8px rgba(11, 28, 48, 0.06)' : ''"
          >
            Log In
          </button>
          <button
            id="tab-signup"
            @click="auth.setMode('signup')"
            :class="[
              'flex-1 py-2.5 text-sm font-semibold rounded-[1rem] transition-all duration-300 cursor-pointer',
              auth.mode === 'signup'
                ? 'bg-surface-container-lowest text-on-surface'
                : 'text-on-surface-variant hover:text-on-surface',
            ]"
            :style="auth.mode === 'signup' ? 'box-shadow: 0 2px 8px rgba(11, 28, 48, 0.06)' : ''"
          >
            Sign Up
          </button>
        </div>

        <!-- Role Toggle — using primary gradient for active -->
        <div class="mt-4 flex rounded-[1.25rem] bg-surface-container-low p-1.5">
          <button
            id="role-student"
            @click="auth.setRole('student')"
            :class="[
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-[1rem] transition-all duration-300 cursor-pointer',
              auth.role === 'student'
                ? 'bg-gradient-to-r from-primary to-primary-container text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface',
            ]"
            :style="auth.role === 'student' ? 'box-shadow: 0 4px 16px rgba(0, 74, 198, 0.2)' : ''"
          >
            <AcademicCapIcon class="w-4 h-4" />
            Student
          </button>
          <button
            id="role-employer"
            @click="auth.setRole('employer')"
            :class="[
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-[1rem] transition-all duration-300 cursor-pointer',
              auth.role === 'employer'
                ? 'bg-gradient-to-r from-primary to-primary-container text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface',
            ]"
            :style="auth.role === 'employer' ? 'box-shadow: 0 4px 16px rgba(0, 74, 198, 0.2)' : ''"
          >
            <BuildingOfficeIcon class="w-4 h-4" />
            Employer
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
            class="mt-4 flex items-center gap-2 rounded-[1rem] bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {{ auth.error }}
          </div>
        </Transition>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="mt-6 space-y-5">
          <!-- Phone Number -->
          <div>
            <label for="phone-input" class="block text-sm font-semibold text-on-surface mb-2">
              Phone Number
            </label>
            <div class="flex items-center rounded-[1.5rem] bg-surface-container-low focus-within:bg-surface-container-lowest transition-all duration-200"
                 :style="'box-shadow: none'"
                 @focusin="$event.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 74, 198, 0.15)'"
                 @focusout="$event.currentTarget.style.boxShadow = 'none'"
            >
              <span class="flex items-center gap-1.5 pl-5 pr-3 text-sm text-on-surface-variant">
                <PhoneIcon class="w-4 h-4" />
                <span class="font-semibold text-on-surface">+855</span>
              </span>
              <input
                id="phone-input"
                v-model="auth.phone"
                type="tel"
                placeholder="12 345 678"
                class="flex-1 bg-transparent px-2 py-3.5 text-sm text-on-surface placeholder:text-outline-variant outline-none"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password-input" class="block text-sm font-semibold text-on-surface mb-2">
              Password
            </label>
            <div class="flex items-center rounded-[1.5rem] bg-surface-container-low focus-within:bg-surface-container-lowest transition-all duration-200"
                 :style="'box-shadow: none'"
                 @focusin="$event.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 74, 198, 0.15)'"
                 @focusout="$event.currentTarget.style.boxShadow = 'none'"
            >
              <span class="pl-5 pr-2 text-on-surface-variant">
                <LockClosedIcon class="w-4 h-4" />
              </span>
              <input
                id="password-input"
                v-model="auth.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="flex-1 bg-transparent px-2 py-3.5 text-sm text-on-surface placeholder:text-outline-variant outline-none"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="pr-5 pl-2 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
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
              <label for="confirm-password-input" class="block text-sm font-semibold text-on-surface mb-2">
                Confirm Password
              </label>
              <div class="flex items-center rounded-[1.5rem] bg-surface-container-low focus-within:bg-surface-container-lowest transition-all duration-200"
                   :style="'box-shadow: none'"
                   @focusin="$event.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 74, 198, 0.15)'"
                   @focusout="$event.currentTarget.style.boxShadow = 'none'"
              >
                <span class="pl-5 pr-2 text-on-surface-variant">
                  <LockClosedIcon class="w-4 h-4" />
                </span>
                <input
                  id="confirm-password-input"
                  v-model="auth.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirm your password"
                  class="flex-1 bg-transparent px-2 py-3.5 text-sm text-on-surface placeholder:text-outline-variant outline-none"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="pr-5 pl-2 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
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
            <button type="button" class="text-xs font-semibold text-primary-container hover:text-primary transition-colors cursor-pointer">
              Forgot password?
            </button>
          </div>

          <!-- Submit Button — Signature gradient CTA per design rules -->
          <button
            id="submit-btn"
            type="submit"
            :disabled="auth.isLoading"
            class="w-full flex items-center justify-center gap-2 rounded-[1rem] py-3.5 text-sm font-bold text-on-primary transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            style="background: linear-gradient(135deg, #004ac6, #2563eb); box-shadow: 0 8px 24px rgba(0, 74, 198, 0.25)"
          >
            <svg
              v-if="auth.isLoading"
              class="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {{ auth.isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Continue') }}
          </button>
        </form>

        <!-- Divider -->
        <div class="my-6 flex items-center gap-4">
          <div class="flex-1 h-px bg-surface-container"></div>
          <span class="text-[11px] font-semibold text-on-surface-variant tracking-widest uppercase">or continue with</span>
          <div class="flex-1 h-px bg-surface-container"></div>
        </div>

        <!-- Social Buttons — tonal surface, no borders -->
        <div class="flex items-center justify-center gap-4">
          <button
            id="btn-google"
            type="button"
            class="flex items-center justify-center w-12 h-12 rounded-[1rem] bg-surface-container-low hover:bg-surface-container transition-all duration-200 cursor-pointer"
            style="box-shadow: 0 2px 8px rgba(11, 28, 48, 0.05)"
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
            class="flex items-center justify-center w-12 h-12 rounded-[1rem] bg-surface-container-low hover:bg-surface-container transition-all duration-200 cursor-pointer"
            style="box-shadow: 0 2px 8px rgba(11, 28, 48, 0.05)"
            aria-label="Continue with Facebook"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>
        </div>

        <!-- Terms -->
        <p class="mt-8 text-center text-xs text-on-surface-variant leading-relaxed">
          By continuing, you agree to FirstStep's
          <a href="#" class="text-primary-container hover:text-primary font-medium underline underline-offset-2 transition-colors">Terms of Service</a>
          and
          <a href="#" class="text-primary-container hover:text-primary font-medium underline underline-offset-2 transition-colors">Privacy Policy</a>.
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
</style>
