<script setup>
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/vue/24/outline'

defineProps({
  post: {
    type: Object,
    required: true
  },
  applicants: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  loadError: {
    type: String,
    default: ''
  }
})

defineEmits(['close', 'update-status'])

const statusConfig = {
  PENDING: { label: 'Pending', icon: ClockIcon, bg: 'bg-[#ffc28e]/20', text: 'text-[#83460e]' },
  REVIEWED: { label: 'Reviewed', icon: ClockIcon, bg: 'bg-[#8ccaff]/20', text: 'text-[#235d84]' },
  ACCEPTED: { label: 'Accepted', icon: CheckCircleIcon, bg: 'bg-[#8fd99b]/20', text: 'text-[#1f6c3b]' },
  REJECTED: { label: 'Rejected', icon: XCircleIcon, bg: 'bg-red-500/10', text: 'text-red-400' },
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 overflow-y-auto bg-black/65 px-4 py-6 backdrop-blur-sm sm:py-10"
    @click.self="$emit('close')"
  >
    <div class="mx-auto w-full max-w-2xl">
      <div class="mb-3 flex justify-end">
        <button
          class="grid h-10 w-10 place-items-center rounded-full bg-surface-container-low text-2xl font-black text-on-surface-variant opacity-40 shadow-xl ring-1 ring-white/10 transition hover:text-on-surface hover:opacity-100"
          type="button"
          aria-label="Close"
          @click="$emit('close')"
        >
          ×
        </button>
      </div>

      <div class="rounded-[2rem] bg-surface-container-low p-6 shadow-sm ring-1 ring-white/5 sm:p-8">
        <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">Applicants</p>
        <h2 class="mt-2 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">
          {{ post.title }}
        </h2>
        <p class="mt-1 text-sm font-bold text-on-surface-variant">
          {{ applicants.length }} applicant{{ applicants.length !== 1 ? 's' : '' }}
        </p>

        <p v-if="loadError" class="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
          {{ loadError }}
        </p>

        <p v-if="isLoading" class="mt-6 text-sm font-bold text-on-surface-variant">Loading applicants...</p>

        <div v-else-if="applicants.length === 0 && !loadError" class="mt-6 text-center">
          <p class="text-sm font-bold text-on-surface-variant">No applicants yet.</p>
        </div>

        <div v-else class="mt-6 space-y-4">
          <div
            v-for="app in applicants"
            :key="app.id"
            class="rounded-[1.25rem] bg-surface-container-lowest p-5 ring-1 ring-white/5"
          >
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="grid h-11 w-11 place-items-center rounded-full bg-[#d7b7ff] text-sm font-black text-[#6a39b8]">
                  {{ (app.applicant?.user_name || app.applicant?.email || 'U').charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="font-black text-on-surface">
                    {{ app.applicant?.user_name || app.applicant?.email || 'Unknown' }}
                  </p>
                  <p class="text-xs font-bold text-on-surface-variant">
                    Applied {{ new Date(app.createdAt).toLocaleDateString() }}
                  </p>
                </div>
              </div>

              <div :class="[statusConfig[app.status]?.bg, statusConfig[app.status]?.text, 'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black']">
                <component :is="statusConfig[app.status]?.icon" class="h-3.5 w-3.5" />
                {{ statusConfig[app.status]?.label || app.status }}
              </div>
            </div>

            <p v-if="app.coverLetter" class="mt-3 rounded-[1rem] bg-surface-container-low px-4 py-3 text-sm font-semibold leading-6 text-on-surface-variant">
              {{ app.coverLetter }}
            </p>

            <div class="mt-4 flex flex-wrap gap-2">
              <button
                v-for="status in ['REVIEWED', 'ACCEPTED', 'REJECTED']"
                :key="status"
                @click="$emit('update-status', { applicationId: app.id, status })"
                :class="[
                  'rounded-full px-4 py-1.5 text-xs font-black transition',
                  app.status === status
                    ? statusConfig[status].bg + ' ' + statusConfig[status].text
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                ]"
              >
                {{ statusConfig[status].label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
