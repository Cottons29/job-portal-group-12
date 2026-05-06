<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { EnvelopeIcon, ShieldCheckIcon, KeyIcon } from '@heroicons/vue/24/outline'

const step = ref('EMAIL') // 'EMAIL' or 'OTP'
const email = ref('')
const otp = ref('')
const isLoading = ref(false)
const errorMsg = ref('')

const router = useRouter()
const authStore = useAuthStore()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Step 1: Send OTP to the given email
const handleSendOtp = async () => {
  if (!email.value) return
  isLoading.value = true
  errorMsg.value = ''
  
  try {
    await axios.post(`${API_BASE}/auth/send-otp`, { email: email.value }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    step.value = 'OTP' // Transition UI to OTP input
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Failed to send verification code.'
  } finally {
    isLoading.value = false
  }
}

// Step 2: Verify the 6-digit OTP code
const handleVerifyOtp = async () => {
  if (!otp.value || otp.value.length < 6) {
    errorMsg.value = "Please enter the full 6-digit code."
    return
  }
  
  isLoading.value = true
  errorMsg.value = ''
  
  try {
    const { data } = await axios.post(`${API_BASE}/auth/verify-otp`, 
      { 
        email: email.value, 
        code: otp.value,
        userId: authStore.user?.id 
      }, 
      {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }
    )
    
    // Update local user state
    if (authStore.user && data.user) {
      authStore.user.email = data.user.email
    }
    
    // Route completion correctly
    if (authStore.needsOnboarding) {
      router.push('/onboarding')
    } else {
      router.push('/home')
    }
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Invalid or expired code. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen bg-surface font-sans overflow-hidden items-center justify-center relative">
    
    <!-- Decorative Tonal Layers -->
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-primary-container/40 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary-container/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/4 right-20 w-32 h-32 bg-surface-container-high rounded-full blur-xl pointer-events-none"></div>

    <div class="w-full max-w-[560px] p-8 md:p-14 z-10">
      
      <!-- Logo or Icon Graphic -->
      <div class="flex justify-center mb-10">
        <div class="w-24 h-24 bg-surface-container-lowest rounded-[1.75rem] flex items-center justify-center rotate-[-3deg] shadow-lg">
          <ShieldCheckIcon v-if="step === 'EMAIL'" class="w-12 h-12 text-primary" />
          <KeyIcon v-else class="w-12 h-12 text-primary" />
        </div>
      </div>

      <!-- STEP 1: EMAIL ENTRY -->
      <div v-if="step === 'EMAIL'">
        <div class="text-center mb-12">
          <h2 class="font-display text-[2.75rem] font-extrabold text-on-surface tracking-tight leading-tight">
            Secure Your Account
          </h2>
          <p class="mt-4 text-on-surface-variant text-[1.15rem]" style="line-height: 1.6">
            Please provide a recovery email address to protect your FirstStep profile.
          </p>
        </div>

        <div class="bg-surface-container-lowest rounded-[2.5rem] p-10 sm:p-12" style="box-shadow: 0 24px 48px rgba(11, 28, 48, 0.08)">
          <form class="space-y-8" @submit.prevent="handleSendOtp">
            <div>
              <label for="email" class="block text-base font-semibold text-on-surface mb-3">
                Email Address
              </label>
              <div 
                class="flex items-center rounded-[1.5rem] bg-surface-container-low focus-within:bg-surface-container-highest transition-all duration-300"
                :style="'box-shadow: none'"
                @focusin="$event.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 74, 198, 0.2)'"
                @focusout="$event.currentTarget.style.boxShadow = 'none'"
              >
                <span class="pl-6 pr-3 text-on-surface-variant">
                  <EnvelopeIcon class="w-6 h-6 opacity-70" />
                </span>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  v-model="email" 
                  autocomplete="email" 
                  required 
                  class="flex-1 bg-transparent px-3 py-4 text-base text-on-surface placeholder:text-outline-variant outline-none"
                  placeholder="you@university.edu.kh"
                >
              </div>
            </div>

            <!-- Error Alert -->
            <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
              <div v-if="errorMsg" class="flex items-center gap-2 rounded-[1rem] bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
                {{ errorMsg }}
              </div>
            </Transition>

            <div class="pt-6">
              <button 
                type="submit" 
                :disabled="isLoading"
                class="w-full flex items-center justify-center gap-3 rounded-[1.25rem] py-4 md:py-5 text-base font-bold text-on-primary transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
                style="background: #2563eb; box-shadow: 0 8px 32px rgba(0, 74, 198, 0.25)"
              >
                <svg v-if="isLoading" class="w-6 h-6 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isLoading ? 'Sending...' : 'Send Verification Code' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- STEP 2: VERIFY OTP -->
      <div v-else>
        <div class="text-center mb-12">
          <h2 class="font-display text-[2.75rem] font-extrabold text-on-surface tracking-tight leading-tight">
            Check Your Email
          </h2>
          <p class="mt-4 text-on-surface-variant text-[1.15rem]" style="line-height: 1.6">
            We sent a 6-digit security code to <strong class="text-on-surface">{{ email }}</strong>.
          </p>
        </div>

        <div class="bg-surface-container-lowest rounded-[2.5rem] p-10 sm:p-12" style="box-shadow: 0 24px 48px rgba(11, 28, 48, 0.08)">
          <form class="space-y-8" @submit.prevent="handleVerifyOtp">
            <div>
              <label for="otp" class="block text-base font-semibold text-on-surface mb-3 text-center">
                Enter Verification Code
              </label>
              <div class="flex items-center justify-center">
                <input 
                  id="otp" 
                  name="otp" 
                  type="text" 
                  inputmode="numeric"
                  maxlength="6"
                  pattern="\d{6}"
                  v-model="otp" 
                  required 
                  class="w-[200px] text-center tracking-[0.5em] font-mono text-2xl bg-surface-container-low focus:bg-surface-container-highest px-3 py-4 rounded-[1.5rem] text-on-surface outline-none transition-all duration-300"
                  :style="'box-shadow: none'"
                  @focusin="$event.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 74, 198, 0.2)'"
                  @focusout="$event.currentTarget.style.boxShadow = 'none'"
                  placeholder="000000"
                >
              </div>
            </div>

            <!-- Error Alert -->
            <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
              <div v-if="errorMsg" class="flex items-center justify-center gap-2 rounded-[1rem] bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
                {{ errorMsg }}
              </div>
            </Transition>

            <div class="pt-6">
              <button 
                type="submit" 
                :disabled="isLoading"
                class="w-full flex items-center justify-center gap-3 rounded-[1.25rem] py-4 md:py-5 text-base font-bold text-on-primary transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
                style="background: #2563eb; box-shadow: 0 8px 32px rgba(0, 74, 198, 0.25)"
              >
                <svg v-if="isLoading" class="w-6 h-6 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isLoading ? 'Verifying...' : 'Verify Email' }}
              </button>
              
              <div class="mt-4 text-center">
                <button type="button" @click="step = 'EMAIL'" class="text-sm font-semibold text-primary-container hover:text-primary transition-colors cursor-pointer">
                  Change email address
                </button>
              </div>
            </div>
          </form>
        </div>
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
