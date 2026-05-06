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

// Components
// import JobSearchBar from '@/components/search/JobSearchBar.vue'
// import FilterSidebar from '@/components/filter/FilterSidebar.vue'
import JobList from '@/components/job/JobList.vue'
import Pagination from '@/components/common/Pagination.vue'

// Types
import type { Job } from '@/types/job'
const keyword = ref('')
const location = ref('')


const currentPage = ref(1)
const totalPages = ref(5)

const handlePageChange = (page: number) => {
  currentPage.value = page

  console.log('Go to page:', page)

  // later → call API with page
}
// TEMP DATA (replace later with API)
const jobs = ref<Job[]>([
  {
    id: '1',
    title: 'UI/UX Designer',
    company: 'Slack',
    location: 'Paris, France',
    salary: '$4500/month',
    tags: ['Part-time', 'Remote'],
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Google',
    location: 'Remote',
    salary: '$6000/month',
    tags: ['Full-time'],
  },
  {
    id: '3',
    title: 'Graphic Design Intern',
    company: 'Lumina Creative',
    location: 'Phnom Penh',
    salary: '$150 - $250 USD',
    tags: ['Remote', 'Part-time'],
  },
  {
    id: '4',
    title: 'Marketing Assistant',
    company: 'Vanguard Retail Group',
    location: 'Phnom Penh',
    salary: '$180 - $280 USD',
    tags: ['Weekend', 'Flexible'],
  },
  {
    id: '5',
    title: 'Software Intern',
    company: 'NexGen Solutions',
    location: 'Phnom Penh',
    salary: '$200 - $300 USD',
    tags: ['Part-time', 'Remote'],
  },
  {
    id: '6',
    title: 'Content Writer',
    company: 'Bluebird Media',
    location: 'Hybrid',
    salary: '$120 - $220 USD',
    tags: ['Part-time', 'Flexible'],
  },
  {
    id: '7',
    title: 'Data Entry Assistant',
    company: 'CoreLink Services',
    location: 'Remote',
    salary: '$100 - $180 USD',
    tags: ['Remote', 'Contract'],
  },
])

const handleSearch = () => {
  console.log(keyword.value, location.value)
}

//  Fetch data later
onMounted(() => {
  // fetchJobs()
})
</script>
