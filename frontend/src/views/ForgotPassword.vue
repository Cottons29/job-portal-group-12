<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import {
  EnvelopeIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/vue/24/outline'

type Step = 'email' | 'otp' | 'password'

const router = useRouter()
const authStore = useAuthStore()

const step = ref<Step>('email')

const email = ref('')
const code = ref('')
const newPassword = ref('')

const showPassword = ref(false)

const isLoading = ref(false)
const error = ref('')
const success = ref('')

/* ─────────────────────────────
   STEP 1 → SEND OTP
───────────────────────────── */
async function sendOtp() {
  try {
    isLoading.value = true
    error.value = ''
    success.value = ''

    await authStore.forgotPassword(
      email.value,
    )

    success.value =
      'Verification code sent successfully.'

    // ONLY move to OTP step
    step.value = 'otp'
  } catch (err: any) {
    error.value =
      err.response?.data?.message ||
      'Failed to send verification code.'
  } finally {
    isLoading.value = false
  }
}

/* ─────────────────────────────
   STEP 2 → VERIFY OTP
───────────────────────────── */
async function verifyOtp() {
  try {
    isLoading.value = true
    error.value = ''
    success.value = ''

    await authStore.verifyResetOtp({
      email: email.value,
      code: code.value,
    })

    success.value =
      'Verification successful.'

    // ONLY AFTER SUCCESS
    // show password form
    step.value = 'password'
  } catch (err: any) {
    error.value =
      err.response?.data?.message ||
      'Invalid verification code.'
  } finally {
    isLoading.value = false
  }
}

/* ─────────────────────────────
   STEP 3 → RESET PASSWORD
───────────────────────────── */
async function resetPassword() {
  try {
    isLoading.value = true
    error.value = ''
    success.value = ''

    await authStore.resetPassword({
      email: email.value,
      code: code.value,
      newPassword: newPassword.value,
    })

    success.value =
      'Password updated successfully.'

    setTimeout(() => {
      router.push('/auth')
    }, 1200)
  } catch (err: any) {
    error.value =
      err.response?.data?.message ||
      'Failed to reset password.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-page app-page">
    <div class="auth-page__form-panel">

      <!-- Decorative -->
      <div class="auth-page__top-line"></div>
      <div class="auth-page__soft-circle"></div>

      <div
        class="auth-page__form-content bg-surface-container-low p-8 rounded-3xl"
      >

        <!-- Logo -->
        <div class="mb-8">
          <img
            src="/images/logo.png"
            alt="FirstStep Logo"
            class="h-50 w-auto object-contain"
          />
        </div>

        <!-- Heading -->
        <h2
          class="font-display text-[1.85rem] font-bold text-on-surface text-center tracking-tight leading-tight"
        >
          Forgot Password
        </h2>

        <p
          class="mt-2 text-on-surface-variant text-[0.95rem]"
          style="line-height: 1.6"
        >
          Securely recover access to your account.
        </p>

        <!-- Progress -->
        <div class="mt-8 flex items-center justify-center gap-3">

          <div
            :class="[
              'h-2.5 w-2.5 rounded-full transition-all duration-300',
              step === 'email'
                ? 'bg-primary scale-125'
                : 'bg-surface-container-high'
            ]"
          />

          <div class="h-[2px] w-10 bg-surface-container-high" />

          <div
            :class="[
              'h-2.5 w-2.5 rounded-full transition-all duration-300',
              step === 'otp'
                ? 'bg-primary scale-125'
                : 'bg-surface-container-high'
            ]"
          />

          <div class="h-[2px] w-10 bg-surface-container-high" />

          <div
            :class="[
              'h-2.5 w-2.5 rounded-full transition-all duration-300',
              step === 'password'
                ? 'bg-primary scale-125'
                : 'bg-surface-container-high'
            ]"
          />
        </div>

        <!-- Error -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="error"
            class="mt-5 flex items-center gap-2 rounded-2xl bg-red-950/50 px-4 py-3 text-sm text-red-200 border border-red-900/60"
          >
            {{ error }}
          </div>
        </Transition>

        <!-- Success -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="success"
            class="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-950/50 px-4 py-3 text-sm text-emerald-200 border border-emerald-900/60"
          >
            {{ success }}
          </div>
        </Transition>

        <Transition
          mode="out-in"
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >

          <!-- ─────────────────────────────
               STEP 1 → EMAIL
          ───────────────────────────── -->
          <form
            v-if="step === 'email'"
            key="email"
            @submit.prevent="sendOtp"
            class="mt-6 space-y-5"
          >

            <div>
              <label
                class="block text-sm font-semibold text-on-surface mb-2"
              >
                Email Address
              </label>

              <div class="field-shell">
                <span class="pl-5 pr-2 text-on-surface-variant">
                  <EnvelopeIcon class="w-4 h-4" />
                </span>

                <input
                  v-model="email"
                  type="email"
                  placeholder="Enter your email"
                  class="field-control auth-page__input"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="btn-primary auth-page__submit"
            >
              {{
                isLoading
                  ? 'Sending Code...'
                  : 'Send Verification Code'
              }}
            </button>
          </form>

          <!-- ─────────────────────────────
               STEP 2 → OTP
          ───────────────────────────── -->
          <form
            v-else-if="step === 'otp'"
            key="otp"
            @submit.prevent="verifyOtp"
            class="mt-6 space-y-5"
          >

            <div>
              <label
                class="block text-sm font-semibold text-on-surface mb-2"
              >
                Verification Code
              </label>

              <div class="field-shell">
                <span class="pl-5 pr-2 text-on-surface-variant">
                  <ShieldCheckIcon class="w-4 h-4" />
                </span>

                <input
                  v-model="code"
                  type="text"
                  maxlength="6"
                  placeholder="Enter 6-digit code"
                  class="field-control auth-page__input tracking-[0.35em]"
                />
              </div>

              <p
                class="mt-3 text-xs text-on-surface-variant"
              >
                Verification code sent to
                <span
                  class="font-semibold text-on-surface"
                >
                  {{ email }}
                </span>
              </p>
            </div>

            <div class="flex items-center gap-3">

              <button
                type="button"
                @click="step = 'email'"
                class="flex-1 rounded-full bg-surface-container py-3 text-sm font-semibold text-on-surface transition-all duration-200 hover:bg-surface-container-high"
              >
                Back
              </button>

              <button
                type="submit"
                :disabled="isLoading"
                class="flex-1 btn-primary auth-page__submit"
              >
                {{
                  isLoading
                    ? 'Verifying...'
                    : 'Verify Code'
                }}
              </button>
            </div>
          </form>

          <!-- ─────────────────────────────
               STEP 3 → PASSWORD
          ───────────────────────────── -->
          <form
            v-else-if="step === 'password'"
            key="password"
            @submit.prevent="resetPassword"
            class="mt-6 space-y-5"
          >

            <div>
              <label
                class="block text-sm font-semibold text-on-surface mb-2"
              >
                New Password
              </label>

              <div class="field-shell">
                <span class="pl-5 pr-2 text-on-surface-variant">
                  <LockClosedIcon class="w-4 h-4" />
                </span>

                <input
                  v-model="newPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter new password"
                  class="field-control auth-page__input"
                />

                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="pr-5 pl-2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <EyeSlashIcon
                    v-if="showPassword"
                    class="w-4 h-4"
                  />

                  <EyeIcon
                    v-else
                    class="w-4 h-4"
                  />
                </button>
              </div>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="btn-primary auth-page__submit"
            >
              {{
                isLoading
                  ? 'Updating Password...'
                  : 'Reset Password'
              }}
            </button>
          </form>

        </Transition>

        <!-- Back To Login -->
        <button
          type="button"
          @click="router.push('/auth')"
          class="mt-6 w-full text-sm font-semibold text-primary-container hover:text-primary transition-colors"
        >
          Back to Login
        </button>

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