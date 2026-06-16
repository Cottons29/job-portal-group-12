<!-- components/job/JobCard.vue -->
<template>
  <article
    class="group flex items-center justify-between gap-6 rounded-3xl border border-on-surface/5 bg-surface-container-lowest px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
  >
    <div class="flex min-w-0 items-center gap-5">
      <div
        class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
      >
        <Building2 class="h-6 w-6" />
      </div>

      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div class="min-w-0">
            <h3 class="truncate text-base font-black font-display text-on-surface">{{ job.title }}</h3>
            <p class="mt-0.5 text-xs font-semibold text-on-surface-variant/70">{{ job.company }}</p>
          </div>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in job.tags"
              :key="tag"
              class="rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider"
              :class="tagClass(tag)"
            >
              {{ tag }}
            </span>
            <span
              v-if="job.matchScore !== undefined"
              class="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-600 ring-1 ring-emerald-500/20"
            >
              ★ {{ job.matchScore }}% Match
            </span>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span class="inline-flex items-center gap-1.5 font-black text-on-surface">
            <Banknote class="h-4 w-4 text-primary" />
            {{ job.salary }}
          </span>
          <span class="h-1 w-1 rounded-full bg-on-surface/10"></span>
          <span class="text-on-surface-variant/70">{{ job.location }}</span>
        </div>
      </div>
    </div>

    <RouterLink
      :to="{ name: 'job-detail', params: { id: job.id } }"
      class="shrink-0 rounded-full bg-primary px-6 py-3 text-xs font-black text-on-primary shadow-sm hover:bg-primary/95 transition-all duration-200"
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

  if (normalizedTag.includes('remote') || normalizedTag.includes('freelance')) {
    return 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20'
  }

  if (normalizedTag.includes('part') || normalizedTag.includes('internship')) {
    return 'bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20'
  }

  if (normalizedTag.includes('full')) {
    return 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20'
  }

  return 'bg-on-surface/5 text-on-surface-variant ring-1 ring-on-surface/10'
}
</script>
