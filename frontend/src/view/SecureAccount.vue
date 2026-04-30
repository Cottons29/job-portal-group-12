<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { EnvelopeIcon } from '@heroicons/vue/24/outline'

const email = ref('')
const isLoading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

async function handleSave() {
  if (!email.value) return
  isLoading.value = true
  
  // Simulate API call to save email
  await new Promise(r => setTimeout(r, 1000))
  
  // In a real app the store needs to be updated. Here we mock it.
  if (authStore.user) {
    authStore.user.email = email.value
  }
  
  isLoading.value = false
  
  // Now router rules evaluate to true for router guard to forward us to onboarding
  router.push('/onboarding')
}
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 font-sans">
    <div class="max-w-md w-full bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_20px_40px_rgba(11,28,48,0.06)] border border-slate-100">
      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <span class="text-[1.75rem] font-extrabold tracking-tight text-[#0b1c30]">
          First<span class="text-[#2563eb]">Step</span>
        </span>
      </div>

      <!-- Text Content -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-slate-800 mb-3">Secure Your Account</h1>
        <p class="text-sm text-slate-500 leading-relaxed">
          Please provide an email address. We use this for free password recovery to help you avoid SMS fees.
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSave" class="space-y-6">
        <div>
          <label class="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-3 text-left">
            Email Address <span class="text-[#2563eb]">*</span>
          </label>
          <div class="relative rounded-full bg-[#f8fafc] focus-within:bg-white transition-all duration-200 border border-transparent focus-within:border-[#2563eb]/20 focus-within:ring-4 focus-within:ring-[#2563eb]/10">
            <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <EnvelopeIcon class="h-5 w-5 text-slate-400" />
            </div>
            <input
              v-model="email"
              type="email"
              required
              placeholder="you@example.com"
              class="w-full bg-transparent pl-12 pr-6 py-3.5 text-sm text-slate-800 placeholder:text-slate-300 outline-none rounded-full"
            />
          </div>
        </div>

        <div class="pt-2">
          <button
            type="submit"
            :disabled="isLoading || !email"
            class="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-[#2563eb] hover:bg-blue-700 shadow-md shadow-blue-500/25 disabled:shadow-none cursor-pointer"
          >
            <svg v-if="isLoading" class="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Saving...' : 'Save & Continue' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
