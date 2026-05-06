<!-- components/job/JobList.vue -->
<template>
  <div class="space-y-4">
    <JobCard v-for="job in jobs" :key="job.id" :job="job" />
  </div>
</template>

<script setup lang="ts">
import JobCard from './JobCard.vue'
import type { Job } from '@/types/job'

defineProps<{
  jobs: Job[]
}>()
</script>