<!-- components/job/JobCard.vue -->
<template>
  <article
    class="group flex items-center justify-between gap-6 rounded-[28px] bg-white px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)]"
  >
    <div class="flex min-w-0 items-center gap-5">
      <div
        class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-50 text-blue-600 ring-1 ring-blue-100"
      >
        <Building2 class="h-6 w-6" />
      </div>

      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div class="min-w-0">
            <h3 class="truncate text-base font-bold text-slate-950">{{ job.title }}</h3>
            <p class="mt-0.5 text-sm text-slate-500">{{ job.company }}</p>
          </div>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in job.tags"
              :key="tag"
              class="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide"
              :class="tagClass(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span class="inline-flex items-center gap-1.5 font-bold text-slate-900">
            <Banknote class="h-4 w-4 text-blue-600" />
            {{ job.salary }}
          </span>
          <span class="h-1 w-1 rounded-full bg-slate-300"></span>
          <span class="text-slate-500">Posted 2 days ago</span>
        </div>
      </div>
    </div>

    <RouterLink
      :to="{ name: 'job-detail', params: { id: job.id } }"
      class="shrink-0 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-blue-600"
    >
      Apply Now
    </RouterLink>
  </article>
</template>

<script setup lang="ts">
import { Banknote, Building2 } from 'lucide-vue-next'
import type { Job } from '@/types/job'

defineProps<{
  job: Job
}>()

const tagClass = (tag: string) => {
  const normalizedTag = tag.toLowerCase()

  if (normalizedTag.includes('remote')) {
    return 'bg-blue-100 text-blue-700'
  }

  if (normalizedTag.includes('part')) {
    return 'bg-amber-100 text-amber-700'
  }

  if (normalizedTag.includes('full')) {
    return 'bg-emerald-100 text-emerald-700'
  }

  return 'bg-slate-100 text-slate-600'
}
</script>
