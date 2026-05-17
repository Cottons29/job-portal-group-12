<template>
  <div>
    <div class="mb-8 flex justify-center">
      <div
        class="flex w-full max-w-3xl items-center rounded-full bg-white px-4 py-2 shadow-[0_16px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-100"
      >
        <label class="flex min-w-0 flex-1 items-center gap-3 text-slate-400">
          <BriefcaseBusiness class="h-4.5 w-4.5 shrink-0 text-blue-600" />
          <input
            v-model="keyword"
            type="text"
            placeholder="Search jobs"
            @keyup.enter="handleSearch"
            class="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>

        <div class="mx-4 h-7 w-px bg-slate-200"></div>

        <label class="flex w-44 items-center gap-3 text-slate-400">
          <MapPin class="h-4.5 w-4.5 shrink-0 text-blue-600" />
          <input
            v-model="location"
            type="text"
            placeholder="Location"
            @keyup.enter="handleSearch"
            class="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>

        <button
          type="button"
          aria-label="Search jobs"
          class="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 cursor-pointer"
          @click="handleSearch"
        >
          <Search class="h-4.5 w-4.5" />
        </button>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="flex flex-col gap-6 md:flex-row">
      <!-- Sidebar Filters (Option A: High-Fidelity Interactive Feed Filters) -->
      <aside class="w-full shrink-0 space-y-6 md:w-64">
        <div class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div class="mb-4 flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 class="font-bold text-slate-900">Filters</h3>
            <button @click="resetFilters" class="text-xs text-blue-600 hover:text-blue-700 cursor-pointer font-bold">Clear All</button>
          </div>

          <!-- Job Type -->
          <div class="space-y-2">
            <p class="text-xs font-black uppercase tracking-wider text-slate-400">Job Type</p>
            <div class="space-y-1.5 text-sm text-slate-600">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="filters.jobTypes" type="checkbox" value="Part-time" @change="handleFilterChange" class="rounded text-blue-600 focus:ring-blue-500" />
                <span>Part-time</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="filters.jobTypes" type="checkbox" value="Internship" @change="handleFilterChange" class="rounded text-blue-600 focus:ring-blue-500" />
                <span>Internship</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="filters.jobTypes" type="checkbox" value="Remote" @change="handleFilterChange" class="rounded text-blue-600 focus:ring-blue-500" />
                <span>Remote</span>
              </label>
            </div>
          </div>

          <!-- Schedule -->
          <div class="mt-6 space-y-2">
            <p class="text-xs font-black uppercase tracking-wider text-slate-400">Schedule</p>
            <div class="space-y-1.5 text-sm text-slate-600">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="filters.schedule" type="checkbox" value="Weekend" @change="handleFilterChange" class="rounded text-blue-600 focus:ring-blue-500" />
                <span>Weekend Only</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="filters.schedule" type="checkbox" value="Flexible" @change="handleFilterChange" class="rounded text-blue-600 focus:ring-blue-500" />
                <span>Flexible Hours</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="filters.schedule" type="checkbox" value="Full-day" @change="handleFilterChange" class="rounded text-blue-600 focus:ring-blue-500" />
                <span>Full-day</span>
              </label>
            </div>
          </div>

          <!-- Language Required -->
          <div class="mt-6 space-y-2">
            <p class="text-xs font-black uppercase tracking-wider text-slate-400">Language Required</p>
            <div class="space-y-1.5 text-sm text-slate-600">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="filters.languages" type="checkbox" value="Khmer only" @change="handleFilterChange" class="rounded text-blue-600 focus:ring-blue-500" />
                <span>Khmer Only</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="filters.languages" type="checkbox" value="English OK" @change="handleFilterChange" class="rounded text-blue-600 focus:ring-blue-500" />
                <span>English OK</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="filters.languages" type="checkbox" value="Bilingual" @change="handleFilterChange" class="rounded text-blue-600 focus:ring-blue-500" />
                <span>Bilingual</span>
              </label>
            </div>
          </div>
        </div>
      </aside>

      <!-- Feed Opportunities List -->
      <div class="flex-1 space-y-4">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <p v-if="isLoading" class="text-sm text-gray-500">
            Syncing live opportunities...
          </p>
          <p v-else class="text-sm text-gray-500">
            Showing {{ filteredJobs.length }} opportunities for you
          </p>

          <select class="text-sm border rounded px-2 py-1 bg-white outline-none">
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div>

        <div v-if="errorMsg" class="rounded-xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-600">
          {{ errorMsg }}
        </div>

        <!-- Job List -->
        <div v-if="isLoading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="h-28 rounded-xl bg-slate-100 animate-pulse"></div>
        </div>
        <JobList v-else-if="filteredJobs.length" :jobs="filteredJobs" />
        <div v-else class="rounded-xl bg-slate-50 py-12 text-center text-sm font-semibold text-slate-400">
          No matches found for your filter criteria.
        </div>

        <!-- Pagination -->
        <Pagination
            v-if="filteredJobs.length && !isLoading"
            :currentPage="currentPage"
            :totalPages="totalPages"
            @change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { BriefcaseBusiness, Search, MapPin } from 'lucide-vue-next'
import api from '@/lib/api'

// Components
import JobList from '@/components/job/JobList.vue'
import Pagination from '@/components/common/Pagination.vue'

// Types
import type { Job } from '@/types/job'

const keyword = ref('')
const location = ref('')
const isLoading = ref(false)
const errorMsg = ref('')
const jobs = ref<Job[]>([])

const currentPage = ref(1)
const totalPages = ref(1)

const filters = ref({
  jobTypes: [] as string[],
  schedule: [] as string[],
  languages: [] as string[]
})

// Local reactive filtering based on tags, title, description, content
const filteredJobs = computed(() => {
  return jobs.value.filter((job: any) => {
    // Filter by jobTypes
    if (filters.value.jobTypes.length) {
      const hasType = filters.value.jobTypes.some(type => 
        job.tags?.some((t: string) => t.toLowerCase().includes(type.toLowerCase())) ||
        job.title.toLowerCase().includes(type.toLowerCase())
      )
      if (!hasType) return false
    }
    // Filter by schedule
    if (filters.value.schedule.length) {
      const hasSchedule = filters.value.schedule.some(sch => 
        job.tags?.some((t: string) => t.toLowerCase().includes(sch.toLowerCase())) ||
        job.description?.toLowerCase().includes(sch.toLowerCase())
      )
      if (!hasSchedule) return false
    }
    // Filter by languages
    if (filters.value.languages.length) {
      const hasLanguage = filters.value.languages.some(lang => 
        job.tags?.some((t: string) => t.toLowerCase().includes(lang.toLowerCase())) ||
        job.description?.toLowerCase().includes(lang.toLowerCase())
      )
      if (!hasLanguage) return false
    }
    return true
  })
})

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchJobs()
}

function handleFilterChange() {
  currentPage.value = 1
}

function resetFilters() {
  filters.value.jobTypes = []
  filters.value.schedule = []
  filters.value.languages = []
  currentPage.value = 1
  fetchJobs()
}

async function fetchJobs() {
  isLoading.value = true
  errorMsg.value = ''
  try {
    const params: any = {
      page: currentPage.value,
      limit: 10
    }
    if (keyword.value.trim()) {
      params.q = keyword.value.trim()
    }
    const { data } = await api.get('/posts', { params })
    
    jobs.value = (data.posts || []).map((post: any) => {
      const author = post.author
      const company = author?.employerProfile?.companyName || author?.user_name || 'Wing Bank'
      const address = author?.employerProfile?.companyAddress || 'Phnom Penh'
      
      return {
        id: post.id,
        title: post.title,
        company,
        location: address,
        salary: '$250 - $550 USD',
        description: post.content || '',
        tags: post.tags || ['Part-time', 'Flexible', 'English OK'],
        matchScore: post.matchScore
      }
    })
  } catch (err: any) {
    console.error('Failed to sync feed:', err)
    errorMsg.value = 'Failed to load live feed from PostgreSQL.'
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchJobs()
}

onMounted(() => {
  fetchJobs()
})
</script>
