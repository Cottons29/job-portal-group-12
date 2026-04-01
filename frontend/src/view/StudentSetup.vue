<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentProfileStore } from '@/stores/studentProfile'
import {
  AcademicCapIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  UserIcon,
  BookOpenIcon,
  SparklesIcon,
  PencilSquareIcon,
  BanknotesIcon,
  CalendarIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const profile = useStudentProfileStore()

// ── Skill input ──
const skillInput = ref('')
function handleSkillKeydown(e) {
  if (e.key === 'Enter') {
    e.preventDefault()
    profile.addSkill(skillInput.value)
    skillInput.value = ''
  }
}

// ── CV upload ──
const isDragging = ref(false)
function handleDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) profile.setCvFile(file)
}
function handleFileSelect(e) {
  const file = e.target.files?.[0]
  if (file) profile.setCvFile(file)
}

// ── Form submission ──
const isSaving = ref(false)
async function handleSave() {
  isSaving.value = true
  // simulate API call
  await new Promise(r => setTimeout(r, 1500))
  isSaving.value = false
  router.push('/dashboard')
}

// ── Universities list ──
const universities = [
  { value: 'cadt', label: 'Cambodia Academy of Digital Technology (CADT)' },
  { value: 'rupp', label: 'Royal University of Phnom Penh (RUPP)' },
  { value: 'itc', label: 'Institute of Technology of Cambodia (ITC)' },
  { value: 'num', label: 'National University of Management (NUM)' },
  { value: 'uc', label: 'University of Cambodia (UC)' },
  { value: 'other', label: 'Other' },
]

const yearLevels = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Graduate']

// Skill color classes (exact match to design)
const skillColors = [
  'bg-[#2563eb] text-white', // Vue.js (blue)
  'bg-[#d97706] text-white', // English (orange/yellow)
  'bg-[#e2e8f0] text-slate-700', // UI Design (gray)
]
function getSkillColor(index) {
  return skillColors[index % skillColors.length]
}
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
    <!-- Main Content Container -->
    <div class="w-full max-w-4xl mx-auto px-4 md:px-6 pt-12 pb-24 flex-1">
      <!-- Step Indicator -->
      <div class="flex justify-center mb-6">
        <div class="inline-flex items-center justify-center rounded-full bg-[#eef2ff] px-4 py-1.5 min-w-[100px]">
          <span class="text-[11px] font-bold text-[#2563eb]">
            Step {{ profile.currentStep }} of {{ profile.totalSteps }}
          </span>
        </div>
      </div>

      <!-- Page Title -->
      <div class="text-center mb-10">
        <h1 class="font-display text-[2.25rem] md:text-[2.75rem] font-extrabold text-[#0b1c30] tracking-tight leading-tight">
          <template v-if="profile.currentStep === 1">
            First<span class="text-[#2563eb]">Step</span> Profile Setup
          </template>
          <template v-else>
            Finalize Your Profile
          </template>
        </h1>
        <p class="mt-3 text-slate-600 text-sm md:text-[15px] max-w-lg mx-auto leading-relaxed">
          <template v-if="profile.currentStep === 1">
            Let's build your professional foundation. Tell us about your academic journey and your growing skill set.
          </template>
          <template v-else>
            Tell us more about your preferences to match you with the perfect opportunities.
          </template>
        </p>
      </div>

      <!-- FORM CONTENT -->
      <Transition
        enter-active-class="transition-all duration-400 ease-out"
        enter-from-class="opacity-0 translate-y-6"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-6"
        mode="out-in"
      >
        <!-- ═══════ STEP 1: Academic Info ═══════ -->
        <div v-if="profile.currentStep === 1" key="step1" class="max-w-3xl mx-auto">
          <div class="rounded-[2rem] bg-white p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <!-- Full Name -->
            <div class="mb-6">
              <label class="flex items-center gap-2 text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-3">
                <UserIcon class="w-4 h-4" />
                Full Name <span class="text-[#2563eb]">*</span>
              </label>
              <div class="rounded-full bg-[#f8fafc] focus-within:bg-white transition-all duration-200 border border-transparent focus-within:border-[#2563eb] focus-within:ring-4 focus-within:ring-[#2563eb]/10">
                <input
                  id="full-name"
                  v-model="profile.fullName"
                  type="text"
                  placeholder="e.g. Sopheap Sothiphak"
                  class="w-full bg-transparent px-6 py-3.5 text-sm text-slate-800 placeholder:text-slate-300 outline-none rounded-full"
                />
              </div>
            </div>

            <!-- University -->
            <div class="mb-6">
              <label class="flex items-center gap-2 text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-3">
                <AcademicCapIcon class="w-4 h-4" />
                University <span class="text-[#2563eb]">*</span>
              </label>
              <div class="relative rounded-full bg-[#f8fafc] focus-within:bg-white transition-all duration-200 border border-transparent focus-within:border-[#2563eb] focus-within:ring-4 focus-within:ring-[#2563eb]/10">
                <select
                  id="university"
                  v-model="profile.university"
                  class="w-full appearance-none bg-transparent px-6 py-3.5 pr-12 text-sm text-slate-800 outline-none cursor-pointer rounded-full"
                >
                  <option value="" disabled>Select your institution</option>
                  <option v-for="uni in universities" :key="uni.value" :value="uni.value">
                    {{ uni.label }}
                  </option>
                </select>
                <ChevronDownIcon class="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <!-- Major + Year Level (side by side) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label class="flex items-center gap-2 text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-3">
                  <BookOpenIcon class="w-4 h-4" />
                  Major / Field of Study <span class="text-[#2563eb]">*</span>
                </label>
                <div class="rounded-full bg-[#f8fafc] focus-within:bg-white transition-all duration-200 border border-transparent focus-within:border-[#2563eb] focus-within:ring-4 focus-within:ring-[#2563eb]/10">
                  <input
                    id="major"
                    v-model="profile.major"
                    type="text"
                    placeholder="e.g. Computer Science"
                    class="w-full bg-transparent px-6 py-3.5 text-sm text-slate-800 placeholder:text-slate-300 outline-none rounded-full"
                  />
                </div>
              </div>
              <div>
                <label class="flex items-center gap-2 text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-3">
                  <SparklesIcon class="w-4 h-4" />
                  Year Level
                </label>
                <div class="relative rounded-full bg-[#f8fafc] focus-within:bg-white transition-all duration-200 border border-transparent focus-within:border-[#2563eb] focus-within:ring-4 focus-within:ring-[#2563eb]/10">
                  <select
                    id="year-level"
                    v-model="profile.yearLevel"
                    class="w-full appearance-none bg-transparent px-6 py-3.5 pr-12 text-sm text-slate-800 outline-none cursor-pointer rounded-full"
                  >
                    <option v-for="y in yearLevels" :key="y" :value="y">{{ y }}</option>
                  </select>
                  <ChevronDownIcon class="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <!-- Skills & Expertise -->
            <div class="mb-6">
              <label class="flex items-center gap-2 text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-3">
                <SparklesIcon class="w-4 h-4" />
                Skills & Expertise
              </label>
              <div class="rounded-3xl bg-[#f8fafc] p-4 min-h-[100px] focus-within:bg-white transition-all duration-200 border border-transparent focus-within:border-[#2563eb] focus-within:ring-4 focus-within:ring-[#2563eb]/10">
                <!-- Tags -->
                <div class="flex flex-wrap gap-2 mb-2" v-if="profile.skills.length">
                  <span
                    v-for="(skill, i) in profile.skills"
                    :key="skill"
                    :class="[getSkillColor(i), 'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200']"
                  >
                    {{ skill }}
                    <button
                      @click="profile.removeSkill(i)"
                      class="hover:opacity-70 transition-opacity cursor-pointer"
                      :aria-label="'Remove ' + skill"
                    >
                      <XMarkIcon class="w-3.5 h-3.5" />
                    </button>
                  </span>
                </div>
                <input
                  v-model="skillInput"
                  @keydown="handleSkillKeydown"
                  type="text"
                  placeholder="Add more..."
                  class="w-full bg-transparent px-2 py-1 text-sm text-slate-800 placeholder:text-slate-300 outline-none"
                />
              </div>
              <p class="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                Press <kbd class="px-1.5 py-0.5 rounded bg-[#f1f5f9] text-[#2563eb] font-bold tracking-wider">ENTER</kbd> to add a skill
              </p>
            </div>

            <!-- Professional Bio -->
            <div class="mb-8">
              <label class="flex items-center gap-2 text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-3">
                <PencilSquareIcon class="w-4 h-4" />
                Professional Bio
              </label>
              <div class="rounded-3xl bg-[#f8fafc] focus-within:bg-white transition-all duration-200 border border-transparent focus-within:border-[#2563eb] focus-within:ring-4 focus-within:ring-[#2563eb]/10">
                <textarea
                  id="bio"
                  v-model="profile.bio"
                  rows="3"
                  placeholder="Tell us about your passions, goals, and what makes you unique..."
                  class="w-full bg-transparent px-6 py-5 text-sm text-slate-800 placeholder:text-slate-300 outline-none resize-none rounded-3xl"
                ></textarea>
              </div>
            </div>

            <!-- Footer: Trust badge + Next Step CTA -->
            <div class="flex items-center justify-between flex-wrap gap-4 mt-6">
              <div class="flex items-center gap-2 text-[12px] text-slate-500">
                <ShieldCheckIcon class="w-4 h-4 text-[#2563eb]" />
                Your data is safe with First<span class="font-semibold text-[#2563eb]">Step</span>
              </div>
              <button
                id="next-step-btn"
                @click="profile.nextStep()"
                :disabled="!profile.step1Valid"
                class="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold text-white transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-[#85a9ff] hover:bg-[#2563eb] shadow-md shadow-blue-500/20 disabled:shadow-none bg-[#98b8fd] text-white"
                :class="!profile.step1Valid ? 'bg-[#98b8fd] opacity-100 shadow-transparent' : 'bg-[#155dfc]'"
              >
                Next Step
                <ArrowRightIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <!-- Step 1 Dots -->
          <div class="mt-8 flex items-center justify-center gap-2">
            <div class="w-8 h-1.5 rounded-full bg-[#2563eb]"></div>
            <div class="w-4 h-1.5 rounded-full bg-slate-200"></div>
          </div>
        </div>

        <!-- ═══════ STEP 2: Career & CV ═══════ -->
        <div v-else key="step2" class="max-w-4xl mx-auto w-full">
          <!-- Back button -> Optional? No Back button in image, but helpful for UX. Adding as a subtle top left link -->
          <div class="mb-4">
             <button @click="profile.prevStep()" class="text-xs font-bold text-slate-500 hover:text-[#2563eb] flex items-center gap-1 cursor-pointer transition-colors">
               <ArrowLeftIcon class="w-3 h-3" /> Back
             </button>
          </div>

          <div class="space-y-6">
            <!-- Row 1: Job Types & Expected Pay -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Preferred Job Types Card -->
              <div class="rounded-3xl bg-white p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 class="text-base font-bold text-slate-800 mb-5">Preferred Job Types</h3>
                <div class="relative rounded-full bg-[#f8fafc] focus-within:bg-white transition-all duration-200 border border-transparent focus-within:border-[#2563eb]/20">
                  <select v-model="profile.jobType" class="w-full appearance-none bg-transparent px-6 py-3.5 text-sm text-slate-600 outline-none cursor-pointer rounded-full">
                    <option value="" disabled>Select job type...</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                  <ChevronDownIcon class="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <!-- Expected Pay Card -->
              <div class="rounded-3xl bg-white p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 class="text-base font-bold text-slate-800 mb-5">Expected Pay</h3>
                <div class="flex items-stretch gap-2">
                  <div class="flex-1 rounded-full bg-[#f8fafc] focus-within:bg-white transition-all duration-200 border border-transparent focus-within:border-[#2563eb]/20">
                    <input v-model="profile.expectedSalary" type="text" placeholder="Enter amount" class="w-full bg-transparent px-6 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none rounded-full" />
                  </div>
                  <!-- Currency Toggle -->
                  <div class="flex rounded-full bg-[#f8fafc] p-[3px] self-center">
                    <button @click="profile.currency = 'USD'" :class="['px-5 py-2 text-[11px] font-bold rounded-full transition-all duration-300 cursor-pointer', profile.currency === 'USD' ? 'bg-[#155dfc] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800']">USD</button>
                    <button @click="profile.currency = 'KHR'" :class="['px-5 py-2 text-[11px] font-bold rounded-full transition-all duration-300 cursor-pointer', profile.currency === 'KHR' ? 'bg-[#155dfc] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800']">KHR</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Row 2: Weekly Availability Card -->
            <div class="rounded-3xl bg-white p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 class="flex items-center gap-2 text-base font-bold text-slate-800 mb-8">
                <CalendarIcon class="w-5 h-5 text-[#155dfc]" />
                Weekly Availability
              </h3>
              <!-- Schedule Grid -->
              <div class="w-full overflow-x-auto pb-4">
                <table class="w-full text-center border-separate border-spacing-y-3 border-spacing-x-2 min-w-[600px]">
                  <thead>
                    <tr>
                      <th class="w-24"></th>
                      <th v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day" class="text-[11px] font-bold text-slate-600 pb-2">{{ day }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="timeSlot in ['morning', 'afternoon', 'evening']" :key="timeSlot">
                      <td class="text-[10px] font-bold text-slate-500 tracking-wider uppercase text-left w-24 pr-2 align-middle">{{ timeSlot }}</td>
                      <td v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="`${day}-${timeSlot}`" class="w-[12%]">
                        <button
                          @click="profile.availability[day][timeSlot] = !profile.availability[day][timeSlot]"
                          :class="[
                            'w-full h-10 md:h-12 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer',
                            profile.availability[day][timeSlot]
                              ? 'bg-[#155dfc] text-white shadow-sm'
                              : 'bg-[#eef2ff] hover:bg-blue-100'
                          ]"
                        >
                          <CheckCircleIcon v-if="profile.availability[day][timeSlot]" class="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Row 3: Upload CV Card -->
            <div class="rounded-3xl bg-white p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 class="text-base font-bold text-slate-800 mb-6">Upload Your CV</h3>
              <div
                :class="[
                  'relative rounded-3xl p-10 text-center transition-all duration-300 cursor-pointer border-[1.5px] border-dashed',
                  isDragging
                    ? 'border-[#2563eb] bg-blue-50/50'
                    : 'border-slate-300 bg-white hover:border-[#2563eb]'
                ]"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                @drop.prevent="handleDrop"
                @click="$refs.cvInput.click()"
              >
                <input ref="cvInput" type="file" accept=".pdf" class="hidden" @change="handleFileSelect" />
                <template v-if="!profile.cvFileName">
                  <div class="mx-auto w-12 h-12 rounded-full bg-[#eef2ff] flex items-center justify-center mb-4">
                    <CloudArrowUpIcon class="w-6 h-6 text-[#155dfc] font-bold" />
                  </div>
                  <p class="text-[14px] font-bold text-slate-800 mb-1">
                    Drag and Drop your PDF CV here
                  </p>
                  <p class="text-[11px] text-slate-500 mb-4">
                    Max file size: 5MB
                  </p>
                  <p class="text-xs font-bold text-[#155dfc] underline underline-offset-4 decoration-[#155dfc]/30 hover:decoration-[#155dfc] transition-colors">
                    Or Browse Files
                  </p>
                </template>
                <template v-else>
                  <div class="mx-auto w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-4">
                    <CheckCircleIcon class="w-7 h-7 text-green-500" />
                  </div>
                  <p class="text-[14px] font-bold text-slate-800 mb-1">
                    {{ profile.cvFileName }}
                  </p>
                  <p class="text-[11px] text-slate-500 mb-4">
                    Click to replace file
                  </p>
                </template>
              </div>
            </div>

            <!-- Complete Profile Button Section -->
            <div class="mt-10 flex justify-center pb-8 border-b border-transparent">
              <button
                id="save-btn"
                @click="handleSave"
                :disabled="isSaving"
                class="inline-flex items-center gap-2 px-10 py-3.5 justify-center rounded-full text-sm font-bold text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-[#155dfc] hover:bg-blue-800 shadow-md shadow-blue-500/20"
              >
                {{ isSaving ? 'Saving...' : 'Complete Profile' }}
                <ArrowRightIcon v-if="!isSaving" class="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
input::placeholder,
textarea::placeholder {
  transition: color 0.2s ease;
}
input:focus::placeholder,
textarea:focus::placeholder {
  color: transparent;
}
select option {
  background: white;
  color: #0b1c30;
}
</style>
