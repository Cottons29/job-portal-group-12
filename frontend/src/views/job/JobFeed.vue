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
            class="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>

        <button
          type="button"
          aria-label="Search jobs"
          class="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
          @click="handleSearch"
        >
          <Search class="h-4.5 w-4.5" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex gap-6">

      <div class="flex-1 space-y-4">

        <!-- Tabs -->
        <div class="flex border-b border-slate-200 mb-4">
          <button
            @click="switchTab('all')"
            :class="[
              'px-6 py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer',
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            ]"
          >
            All Jobs
          </button>
          <button
            v-if="authStore.user?.role?.toLowerCase() === 'student'"
            @click="switchTab('recommended')"
            :class="[
              'px-6 py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2',
              activeTab === 'recommended'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            ]"
          >
            <span>Recommended Jobs</span>
            <span class="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">AI Match</span>
          </button>
        </div>

        <!-- Header -->
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-500">
            Showing {{ jobs.length }} opportunities for you
          </p>

          <select class="text-sm border rounded px-2 py-1">
            <option>Newest</option>
            <option>Oldest</option>
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
import { BriefcaseBusiness, Search, MapPin } from 'lucide-vue-next'
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
  let filtered = allLoadedJobs.value

  if (keyword.value.trim()) {
    const q = keyword.value.toLowerCase()
    filtered = filtered.filter(j => 
      j.title?.toLowerCase().includes(q) || 
      j.company?.toLowerCase().includes(q) || 
      j.content?.toLowerCase().includes(q)
    )
  }

  if (location.value.trim()) {
    const loc = location.value.toLowerCase()
    filtered = filtered.filter(j => 
      j.location?.toLowerCase().includes(loc)
    )
  }

  jobs.value = filtered.map((p: any) => ({
    id: String(p.id),
    title: p.title,
    company: p.company || p.author?.user_name || 'Employer',
    salary: p.salary || 'Competitive',
    location: p.location || 'Phnom Penh',
    tags: p.tags || (p.jobType ? [p.jobType] : ['Full-time']),
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
