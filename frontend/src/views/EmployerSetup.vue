<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployerProfileStore } from '@/stores/employerProfile'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import {
  ArrowRightIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ShieldCheckIcon,
  CameraIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const profile = useEmployerProfileStore()
const authStore = useAuthStore()

const isDraggingPatent = ref(false)
const logoPreview = ref(null)

const isSaving = ref(false)
const errorMsg = ref('')

const industries = [
  { value: 'technology', label: 'Technology / IT' },
  { value: 'education', label: 'Education' },
  { value: 'finance', label: 'Finance / Banking' },
  { value: 'retail', label: 'Retail / E-Commerce' },
  { value: 'fnb', label: 'Food & Beverage' },
  { value: 'other', label: 'Other' },
]

const locations = [
  { value: 'phnom_penh', label: 'Phnom Penh' },
  { value: 'siem_reap', label: 'Siem Reap' },
  { value: 'battambang', label: 'Battambang' },
  { value: 'sihanoukville', label: 'Sihanoukville' },
  { value: 'other', label: 'Other Province' },
]

function handlePatentDrop(e) {
  isDraggingPatent.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) profile.setPatentFile(file)
}

function handlePatentSelect(e) {
  const file = e.target.files?.[0]
  if (file) profile.setPatentFile(file)
}

function handleLogoSelect(e) {
  const file = e.target.files?.[0]
  if (file) {
    profile.setLogoFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

async function handleSave() {
  isSaving.value = true
  errorMsg.value = ''
  
  try {
    const formData = new FormData()
    formData.append('companyName', profile.companyName)
    formData.append('industry', profile.industry)
    formData.append('location', profile.location)
    
    if (profile.logoFile) {
      formData.append('logoFile', profile.logoFile)
    }
    if (profile.patentFile) {
      formData.append('patentFile', profile.patentFile)
    }

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    
    await axios.post(`${API_BASE}/employer-profile/setup`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authStore.token}`
      }
    })
    
    authStore.user.profileCompleted = true
    router.push('/dashboard')
  } catch (err) {
    console.error('Failed to save profile:', err)
    errorMsg.value = err.response?.data?.message || 'Failed to complete profile. Please try again.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
    <div class="w-full max-w-3xl mx-auto px-4 md:px-6 pt-12 pb-24 flex-1">
      
      <!-- Step Indicator -->
      <div class="mb-4">
        <div class="inline-flex items-center justify-center rounded-full bg-[#eef2ff] px-3 py-1 mb-4">
          <span class="text-[10px] font-bold text-[#2563eb] uppercase tracking-wider">
            Onboarding Journey
          </span>
        </div>
        <div class="flex items-end justify-between border-b-2 border-slate-200 pb-4 relative">
          <h1 class="font-display text-3xl md:text-4xl font-extrabold text-[#0b1c30] tracking-tight">
            Setup Your Company Profile
          </h1>
          <div class="text-[12px] font-bold text-[#2563eb]">Step {{ profile.currentStep }} of {{ profile.totalSteps }}</div>
          <!-- Progress bar overlay on the border -->
          <div class="absolute bottom-[-2px] left-0 h-[2px] bg-[#2563eb] transition-all duration-300" :style="{ width: `${(profile.currentStep / profile.totalSteps) * 100}%` }"></div>
        </div>
      </div>

      <!-- Main Form Card -->
      <div class="mt-8 rounded-[2rem] bg-white p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        
        <!-- Company Branding (Logo) -->
        <div class="mb-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div class="relative group cursor-pointer" @click="$refs.logoInput.click()">
            <input ref="logoInput" type="file" accept="image/png, image/jpeg" class="hidden" @change="handleLogoSelect" />
            <div class="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-[#f8fafc] overflow-hidden group-hover:border-[#2563eb] transition-colors relative">
              <img v-if="logoPreview" :src="logoPreview" class="w-full h-full object-cover" />
              <CameraIcon v-else class="w-8 h-8 text-slate-400" />
            </div>
            <div class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#155dfc] text-white flex items-center justify-center shadow-lg transform translate-x-1/4 translate-y-1/4">
              <CloudArrowUpIcon class="w-4 h-4" />
            </div>
          </div>
          <div class="text-center md:text-left flex-1">
            <h3 class="text-[15px] font-bold text-slate-800 mb-1">Company Branding</h3>
            <p class="text-[12px] text-slate-500 max-w-sm leading-relaxed">
              Upload a clear square logo (PNG/JPG). This will appear on all your job postings and company page.
            </p>
          </div>
        </div>

        <!-- Company Name -->
        <div class="mb-6">
          <label class="block text-[11px] font-bold text-slate-700 mb-2">Company Name</label>
          <div class="rounded-full bg-[#f8fafc] focus-within:bg-white transition-all duration-200 border border-transparent focus-within:border-[#2563eb]/20">
            <input
              v-model="profile.companyName"
              type="text"
              placeholder="e.g. Creative Flow Digital"
              class="w-full bg-transparent px-6 py-3.5 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none rounded-full"
            />
          </div>
        </div>

        <!-- Industry & Location -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-2">Industry</label>
            <div class="relative rounded-full bg-[#f8fafc] focus-within:bg-white transition-all duration-200 border border-transparent focus-within:border-[#2563eb]/20">
              <select
                v-model="profile.industry"
                class="w-full appearance-none bg-transparent px-6 py-3.5 pr-12 text-[13px] text-slate-800 outline-none cursor-pointer rounded-full"
              >
                <option value="" disabled>Select industry</option>
                <option v-for="ind in industries" :key="ind.value" :value="ind.value">{{ ind.label }}</option>
              </select>
              <ChevronDownIcon class="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-2">Location</label>
            <div class="relative rounded-full bg-[#f8fafc] focus-within:bg-white transition-all duration-200 border border-transparent focus-within:border-[#2563eb]/20">
              <select
                v-model="profile.location"
                class="w-full appearance-none bg-transparent px-6 py-3.5 pr-12 text-[13px] text-slate-800 outline-none cursor-pointer rounded-full"
              >
                <option value="" disabled>Select city</option>
                <option v-for="loc in locations" :key="loc.value" :value="loc.value">{{ loc.label }}</option>
              </select>
              <ChevronDownIcon class="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <!-- Verification Document Upload -->
        <div class="mb-2">
          <label class="flex items-center gap-2 text-[14px] font-bold text-slate-800 mb-4">
            <ShieldCheckIcon class="w-5 h-5 text-[#b48011]" /> <!-- Gold shield to match the design icon color ideally -->
            Employer Verification
          </label>
          <div
            :class="[
              'relative rounded-[2rem] p-10 text-center transition-all duration-300 cursor-pointer border-[1.5px] border-dashed bg-[#f8fafc]',
              isDraggingPatent
                ? 'border-[#2563eb] bg-blue-50/50'
                : 'border-slate-300 hover:border-[#2563eb]'
            ]"
            @dragover.prevent="isDraggingPatent = true"
            @dragleave="isDraggingPatent = false"
            @drop.prevent="handlePatentDrop"
            @click="$refs.patentInput.click()"
          >
            <input ref="patentInput" type="file" accept=".pdf,image/png,image/jpeg" class="hidden" @change="handlePatentSelect" />
            
            <template v-if="!profile.patentFileName">
              <div class="mx-auto w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                <CloudArrowUpIcon class="w-6 h-6 text-[#155dfc] font-bold" />
              </div>
              <p class="text-[13px] font-bold text-slate-800 mb-1 uppercase tracking-wider">
                Upload Business Patent / Registration
              </p>
              <p class="text-[11px] text-slate-500">
                PDF, PNG or JPG format (Max 5MB). Required to receive <br/>
                your <span class="text-[#155dfc] font-semibold">"Verified Employer"</span> badge and start posting jobs.
              </p>
            </template>
            <template v-else>
              <div class="mx-auto w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <CheckCircleIcon class="w-7 h-7 text-green-500" />
              </div>
              <p class="text-[14px] font-bold text-slate-800 mb-1">
                {{ profile.patentFileName }}
              </p>
              <p class="text-[11px] text-slate-500">
                Click to replace file
              </p>
            </template>
          </div>
        </div>

      </div>

      <!-- Footer Buttons -->
      <div class="mt-8 flex items-center justify-between">
        <button class="text-[13px] font-bold text-[#155dfc] hover:text-blue-800 transition-colors">
          Save as Draft
        </button>
        <div class="flex flex-col items-end">
          <div v-if="errorMsg" class="mb-2 text-xs text-red-600 font-medium">{{ errorMsg }}</div>
          <button
            @click="handleSave"
            :disabled="isSaving || !profile.step1Valid"
            class="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-[13px] font-bold text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-[#155dfc] hover:bg-blue-800 shadow-md shadow-blue-500/20"
          >
            {{ isSaving ? 'Saving...' : 'Next: Verification Details' }}
            <ArrowRightIcon v-if="!isSaving" class="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
select option {
  background: white;
  color: #0b1c30;
}
</style>
