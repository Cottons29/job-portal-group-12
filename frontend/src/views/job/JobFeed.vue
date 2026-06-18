<template>
  <div>
    <div class="mb-8 flex justify-center">
      <div
        class="flex w-full max-w-3xl items-center rounded-full bg-surface-container-lowest px-5 py-2.5 shadow-sm border border-on-surface/5 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200"
      >
        <label class="flex min-w-0 flex-1 items-center gap-3 text-on-surface-variant/60">
          <BriefcaseBusiness class="h-4.5 w-4.5 shrink-0 text-primary" />
          <input
            v-model="keyword"
            type="text"
            placeholder="Search jobs"
            @input="filterJobs"
            @keydown.enter="handleSearch"
            class="min-w-0 flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant/50"
          />
        </label>

        <div class="mx-4 h-7 w-px bg-on-surface/10"></div>

        <label class="flex w-44 items-center gap-3 text-on-surface-variant/60">
          <MapPin class="h-4.5 w-4.5 shrink-0 text-primary" />
          <input
            v-model="location"
            type="text"
            placeholder="Location"
            @input="filterJobs"
            @keydown.enter="handleSearch"
            class="min-w-0 flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant/50"
          />
        </label>

        <button
          type="button"
          aria-label="Search jobs"
          class="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm transition hover:bg-primary/95"
          @click="handleSearch"
        >
          <Search class="h-4.5 w-4.5" />
        </button>

        <button
          type="button"
          aria-label="Toggle filters"
          :class="[
            'ml-2 flex h-10 px-4 shrink-0 items-center gap-2 rounded-full text-xs font-black transition-all duration-200 cursor-pointer',
            showFilters 
              ? 'bg-secondary text-on-secondary shadow-sm' 
              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
          ]"
          @click="showFilters = !showFilters"
        >
          <SlidersHorizontal class="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>
    </div>

    <!-- Advanced Filter Panel -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 max-h-0 overflow-hidden transform -translate-y-2"
      enter-to-class="opacity-100 max-h-[500px] overflow-hidden transform translate-y-0"
      leave-from-class="opacity-100 max-h-[500px] overflow-hidden transform translate-y-0"
      leave-to-class="opacity-0 max-h-0 overflow-hidden transform -translate-y-2"
    >
      <div v-if="showFilters" class="mx-auto max-w-3xl mb-8 rounded-[1.5rem] bg-surface-container-low p-6 border border-on-surface/5 shadow-sm">
        <div class="flex items-center justify-between border-b border-on-surface/5 pb-4 mb-4">
          <h3 class="text-sm font-black text-on-surface uppercase tracking-wider">Discovery Filters</h3>
          <button @click="clearFilters" class="text-xs font-black text-primary hover:underline transition cursor-pointer">Clear All Filters</button>
        </div>

        <div class="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          <!-- Job Type -->
          <div>
            <label class="block mb-2 text-[10px] font-black text-on-surface-variant/80 uppercase tracking-wider">Job Type</label>
            <select v-model="selectedJobType" @change="filterJobs" class="w-full text-xs font-bold border border-on-surface/10 rounded-xl px-3 py-2 bg-surface-container-lowest text-on-surface outline-none focus:ring-1 focus:ring-primary">
              <option value="All">All Job Types</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
              <option value="Full-time">Full-time</option>
            </select>
          </div>

          <!-- Schedule -->
          <div>
            <label class="block mb-2 text-[10px] font-black text-on-surface-variant/80 uppercase tracking-wider">Schedule</label>
            <select v-model="selectedSchedule" @change="filterJobs" class="w-full text-xs font-bold border border-on-surface/10 rounded-xl px-3 py-2 bg-surface-container-lowest text-on-surface outline-none focus:ring-1 focus:ring-primary">
              <option value="All">All Schedules</option>
              <option value="Flexible">Flexible</option>
              <option value="Weekend">Weekend</option>
              <option value="Full-day">Full-day</option>
            </select>
          </div>

          <!-- Payment Frequency -->
          <div>
            <label class="block mb-2 text-[10px] font-black text-on-surface-variant/80 uppercase tracking-wider">Payment Type</label>
            <select v-model="selectedPaymentType" @change="filterJobs" class="w-full text-xs font-bold border border-on-surface/10 rounded-xl px-3 py-2 bg-surface-container-lowest text-on-surface outline-none focus:ring-1 focus:ring-primary">
              <option value="All">All Payment Types</option>
              <option value="Hourly">Hourly</option>
              <option value="Daily">Daily</option>
              <option value="Project">Project</option>
            </select>
          </div>

          <!-- Language -->
          <div>
            <label class="block mb-2 text-[10px] font-black text-on-surface-variant/80 uppercase tracking-wider">Language Required</label>
            <select v-model="selectedLanguage" @change="filterJobs" class="w-full text-xs font-bold border border-on-surface/10 rounded-xl px-3 py-2 bg-surface-container-lowest text-on-surface outline-none focus:ring-1 focus:ring-primary">
              <option value="All">All Languages</option>
              <option value="Khmer">Khmer Only</option>
              <option value="English">English OK</option>
              <option value="Bilingual">Bilingual</option>
            </select>
          </div>
        </div>

        <div class="grid gap-5 sm:grid-cols-2 mt-5 pt-4 border-t border-on-surface/5">
          <!-- Pay Range Min/Max -->
          <div>
            <label class="block mb-2 text-[10px] font-black text-on-surface-variant/80 uppercase tracking-wider">Monthly Pay Range</label>
            <div class="flex items-center gap-2">
              <input v-model="minPayFilter" type="number" placeholder="Min Pay" @input="filterJobs" class="w-full text-xs font-bold border border-on-surface/10 rounded-xl px-3 py-2 bg-surface-container-lowest text-on-surface outline-none focus:ring-1 focus:ring-primary" />
              <span class="text-xs text-on-surface-variant/50">to</span>
              <input v-model="maxPayFilter" type="number" placeholder="Max Pay" @input="filterJobs" class="w-full text-xs font-bold border border-on-surface/10 rounded-xl px-3 py-2 bg-surface-container-lowest text-on-surface outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <div class="flex gap-6">

      <div class="flex-1 space-y-4">

        <!-- Tabs -->
        <div class="flex border-b border-on-surface/5 mb-4">
          <button
            @click="switchTab('all')"
            :class="[
              'px-6 py-3 text-sm font-black border-b-2 transition-colors cursor-pointer',
              activeTab === 'all'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant/70 hover:text-on-surface'
            ]"
          >
            All Jobs
          </button>
          <button
            v-if="authStore.user?.role?.toLowerCase() === 'student'"
            @click="switchTab('recommended')"
            :class="[
              'px-6 py-3 text-sm font-black border-b-2 transition-colors cursor-pointer flex items-center gap-2',
              activeTab === 'recommended'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant/70 hover:text-on-surface'
            ]"
          >
            <span>Recommended Jobs</span>
            <span class="bg-emerald-500/10 text-emerald-600 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider ring-1 ring-emerald-500/20">AI Match</span>
          </button>
        </div>

        <!-- Header -->
        <div class="flex justify-between items-center">
          <p class="text-xs font-semibold text-on-surface-variant/70">
            Showing {{ jobs.length }} opportunities for you
          </p>

          <select v-model="sortBy" @change="filterJobs" class="text-xs font-bold border border-on-surface/10 rounded-xl px-3 py-1.5 bg-surface-container-lowest text-on-surface outline-none focus:ring-1 focus:ring-primary">
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
          </select>
        </div>

        <!-- Job List -->
        <JobList :jobs="jobs" />

        <!-- Pagination -->
        <Pagination
            :currentPage="currentPage"
            :totalPages="totalPages"
            @change="handlePageChange"
        />

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { BriefcaseBusiness, Search, MapPin, SlidersHorizontal } from 'lucide-vue-next'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

// Components
import JobList from '@/components/job/JobList.vue'
import Pagination from '@/components/common/Pagination.vue'

// Types
import type { Job } from '@/types/job'

const authStore = useAuthStore()
const activeTab = ref('all')
const keyword = ref('')
const location = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const jobs = ref<Job[]>([])
const allLoadedJobs = ref<any[]>([])
const sortBy = ref('Newest')

const showFilters = ref(false)
const selectedJobType = ref('All')
const selectedSchedule = ref('All')
const selectedPaymentType = ref('All')
const selectedLanguage = ref('All')
const minPayFilter = ref('')
const maxPayFilter = ref('')

function clearFilters() {
  selectedJobType.value = 'All'
  selectedSchedule.value = 'All'
  selectedPaymentType.value = 'All'
  selectedLanguage.value = 'All'
  minPayFilter.value = ''
  maxPayFilter.value = ''
  filterJobs()
}

async function fetchJobs() {
  try {
    const { data } = await api.get('/posts?limit=100')
    const posts = data.posts || []
    allLoadedJobs.value = posts.filter((p: any) => p.isJob)
    filterJobs()
  } catch (error) {
    console.error('Failed to fetch jobs:', error)
  }
}

async function fetchRecommendations() {
  try {
    const { data } = await api.get('/posts/recommendations')
    const recs = data.recommendations || []
    allLoadedJobs.value = recs
    filterJobs()
  } catch (error) {
    console.error('Failed to fetch recommendations:', error)
  }
}

function switchTab(tab: string) {
  activeTab.value = tab
  if (tab === 'all') {
    fetchJobs()
  } else {
    fetchRecommendations()
  }
}

function filterJobs() {
  let filtered = [...allLoadedJobs.value]

  if (keyword.value.trim()) {
    const q = keyword.value.toLowerCase().replace(/[^a-z0-9]/g, '')
    filtered = filtered.filter(j => {
      const title = (j.title || '').toLowerCase().replace(/[^a-z0-9]/g, '')
      const company = (j.company || j.author?.user_name || '').toLowerCase().replace(/[^a-z0-9]/g, '')
      const content = (j.content || '').toLowerCase().replace(/[^a-z0-9]/g, '')
      return title.includes(q) || company.includes(q) || content.includes(q)
    })
  }

  if (location.value.trim()) {
    const loc = location.value.toLowerCase().replace(/[^a-z0-9]/g, '')
    filtered = filtered.filter(j => {
      const jLoc = (j.location || '').toLowerCase().replace(/[^a-z0-9]/g, '')
      return jLoc.includes(loc)
    })
  }

  // Job Type Filter
  if (selectedJobType.value !== 'All') {
    filtered = filtered.filter(j => j.jobType === selectedJobType.value)
  }

  // Schedule Filter
  if (selectedSchedule.value !== 'All') {
    filtered = filtered.filter(j => j.schedule === selectedSchedule.value)
  }

  // Payment Type Filter
  if (selectedPaymentType.value !== 'All') {
    filtered = filtered.filter(j => j.paymentType === selectedPaymentType.value)
  }

  // Language Filter
  if (selectedLanguage.value !== 'All') {
    filtered = filtered.filter(j => j.language === selectedLanguage.value)
  }

  // Pay Range Filter
  if (minPayFilter.value) {
    const minVal = parseFloat(minPayFilter.value)
    filtered = filtered.filter(j => {
      if (!j.salary) return false
      const nums = j.salary.match(/\d+(\.\d+)?/g)?.map(Number) || []
      if (nums.length === 0) return false
      const maxSal = Math.max(...nums)
      return maxSal >= minVal
    })
  }
  if (maxPayFilter.value) {
    const maxVal = parseFloat(maxPayFilter.value)
    filtered = filtered.filter(j => {
      if (!j.salary) return false
      const nums = j.salary.match(/\d+(\.\d+)?/g)?.map(Number) || []
      if (nums.length === 0) return false
      const minSal = Math.min(...nums)
      return minSal <= maxVal
    })
  }

  // Sort by date
  filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime()
    const dateB = new Date(b.createdAt || 0).getTime()
    return sortBy.value === 'Newest' ? dateB - dateA : dateA - dateB
  })

  jobs.value = filtered.map((p: any) => ({
    id: String(p.id),
    title: p.title,
    company: p.company || p.author?.user_name || 'Employer',
    salary: p.salary || 'Competitive',
    location: p.location || 'Phnom Penh',
    tags: p.skills && p.skills.length > 0 ? p.skills : (p.jobType ? [p.jobType] : ['Full-time']),
    matchScore: p.matchScore
  }))

  totalPages.value = Math.ceil(jobs.value.length / 10) || 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleSearch = () => {
  filterJobs()
}

onMounted(() => {
  fetchJobs()
})
</script>
