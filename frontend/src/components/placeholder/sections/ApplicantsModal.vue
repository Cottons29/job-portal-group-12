<script setup lang="ts">
import { CheckCircleIcon, ClockIcon, XCircleIcon, AcademicCapIcon, BriefcaseIcon, DocumentTextIcon, PaperClipIcon } from '@heroicons/vue/24/outline'
import type { Post } from '@/types/profile'
import { resolveUrl } from '@/lib/api'

export interface Applicant {
  id: string | number
  status: 'PENDING' | 'REVIEWED' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED' | 'HIRED' | 'DECLINED'
  createdAt: string
  coverLetter?: string
  cvUrl?: string
  applicant?: {
    user_name?: string
    email?: string
    avatar?: string
    fullName?: string
    university?: string
    major?: string
    yearLevel?: string
    skills?: string[]
    bio?: string
    cvUrl?: string
  }
}

withDefaults(defineProps<{
  post: Post
  applicants: Applicant[]
  isLoading?: boolean
  loadError?: string
}>(), {
  isLoading: false,
  loadError: ''
})

defineEmits(['close', 'update-status','open-profile'])

const statusConfig = {
  PENDING: { label: 'Pending', icon: ClockIcon, bg: 'bg-[#ffc28e]/20', text: 'text-[#83460e]' },
  REVIEWED: { label: 'Reviewed', icon: ClockIcon, bg: 'bg-[#8ccaff]/20', text: 'text-[#235d84]' },
  INTERVIEW: { label: 'Interview', icon: ClockIcon, bg: 'bg-[#aecbfa]/20', text: 'text-[#1a4fa3]' },
  ACCEPTED: { label: 'Offered', icon: CheckCircleIcon, bg: 'bg-[#8fd99b]/20', text: 'text-[#1f6c3b]' },
  REJECTED: { label: 'Rejected', icon: XCircleIcon, bg: 'bg-red-500/10', text: 'text-red-400' },
  HIRED: { label: 'Hired 🎉', icon: CheckCircleIcon, bg: 'bg-emerald-500/10', text: 'text-emerald-500 font-extrabold' },
  DECLINED: { label: 'Declined', icon: XCircleIcon, bg: 'bg-amber-500/10', text: 'text-amber-500' },
}

const uniMap: Record<string, string> = {
  cadt: 'Cambodia Academy of Digital Technology (CADT)',
  rupp: 'Royal University of Phnom Penh (RUPP)',
  itc: 'Institute of Technology of Cambodia (ITC)',
  num: 'National University of Management (NUM)',
  uc: 'University of Cambodia (UC)',
  other: 'Other Institution'
}

function getUniLabel(key?: string) {
  if (!key) return 'Unknown University'
  return uniMap[key.toLowerCase()] || key
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 overflow-y-auto bg-black/65 px-4 py-6 backdrop-blur-sm sm:py-10"
    @click.self="$emit('close')"
  >
    <div class="mx-auto w-full max-w-2xl">
      <!-- Top Close Button -->
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

      <!-- Modal Container -->
      <div class="rounded-[2.5rem] bg-surface-container-low p-6 shadow-2xl ring-1 ring-white/5 sm:p-8">
        <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">Applicants Pipeline</p>
        <h2 class="mt-2 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">
          {{ post.title }}
        </h2>
        <p class="mt-1 text-sm font-bold text-on-surface-variant">
          {{ applicants.length }} candidate{{ applicants.length !== 1 ? 's' : '' }} applied
        </p>

        <!-- Load Error -->
        <p v-if="loadError" class="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
          {{ loadError }}
        </p>

        <!-- Loading State -->
        <p v-if="isLoading" class="mt-6 text-sm font-bold text-on-surface-variant">Loading applicants...</p>

        <!-- Empty State -->
        <div v-else-if="applicants.length === 0 && !loadError" class="mt-6 text-center py-10 bg-surface rounded-2xl border border-dashed border-outline/25">
          <p class="text-sm font-bold text-on-surface-variant">No candidates have applied for this position yet.</p>
        </div>

        <!-- Applicants List -->
        <div v-else class="mt-6 space-y-5">
          <div
            v-for="app in applicants"
            :key="app.id"
            class="rounded-3xl bg-surface-container-lowest p-6 ring-1 ring-white/5 border border-on-surface/5 space-y-4"
          >
            <!-- Applicant Header / Identity Card -->
            <div class="flex flex-wrap items-start justify-between gap-3 border-b border-on-surface/5 pb-4">
              <div class="flex items-center gap-3">
                <div class="grid h-12 w-12 place-items-center rounded-full bg-[#d7b7ff] text-base font-black text-[#6a39b8] shrink-0">
                  {{ (app.applicant?.fullName || app.applicant?.user_name || app.applicant?.email || 'U').charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <p
                      class="font-black text-on-surface text-base cursor-pointer transition-all duration-150 hover:underline hover:opacity-75"
                      @click="$emit('open-profile', app.applicant)"
                    >
                      {{ app.applicant?.fullName || app.applicant?.user_name || 'Candidate' }}
                    </p>
                    <span
                      v-if="app.applicant?.isStudentVerified"
                      class="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/20"
                      title="Verified Student"
                    >
                      ✓ Verified
                    </span>
                  </div>
                  <p class="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                    {{ app.applicant?.email }} • Applied {{ new Date(app.createdAt).toLocaleDateString() }}
                  </p>
                </div>
              </div>

              <!-- Pipeline Status Badge -->
              <div :class="[statusConfig[app.status]?.bg, statusConfig[app.status]?.text, 'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider shrink-0']">
                <component :is="statusConfig[app.status]?.icon" class="h-3.5 w-3.5" />
                {{ statusConfig[app.status]?.label || app.status }}
              </div>
            </div>

            <!-- Student Bio/Tagline -->
            <p v-if="app.applicant?.bio" class="text-xs text-on-surface-variant/85 italic leading-5">
              "{{ app.applicant.bio }}"
            </p>

            <!-- Student Academic Info -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface p-4 rounded-2xl border border-on-surface/5">
              <div class="flex items-start gap-2 text-xs">
                <AcademicCapIcon class="h-4.5 w-4.5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p class="font-black text-on-surface">Education</p>
                  <p class="text-on-surface-variant/90 mt-0.5 leading-4">
                    {{ getUniLabel(app.applicant?.university) }}
                  </p>
                  <p v-if="app.applicant?.major || app.applicant?.yearLevel" class="text-[11px] text-on-surface-variant mt-0.5">
                    {{ app.applicant.major }} <span v-if="app.applicant.yearLevel">• {{ app.applicant.yearLevel }}</span>
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-2 text-xs">
                <BriefcaseIcon class="h-4.5 w-4.5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p class="font-black text-on-surface">Job Preference</p>
                  <p class="text-on-surface-variant/90 mt-0.5">
                    Seeking: {{ app.applicant?.jobType || 'Flexible' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Skills List -->
            <div v-if="app.applicant?.skills?.length" class="flex flex-wrap gap-1.5">
              <span
                v-for="skill in app.applicant.skills"
                :key="skill"
                class="rounded-full bg-surface-container px-2.5 py-1 text-[10px] font-bold text-on-surface-variant"
              >
                {{ skill }}
              </span>
            </div>

            <!-- Cover Letter Text -->
            <div v-if="app.coverLetter" class="space-y-1.5">
              <p class="text-[10px] font-black uppercase text-on-surface-variant tracking-wider">Candidate Cover Letter</p>
              <div class="rounded-2xl bg-surface-container-low p-4 text-xs font-semibold leading-5 text-on-surface-variant border border-on-surface/5">
                {{ app.coverLetter }}
              </div>
            </div>

            <!-- Resume/CV Download Links -->
            <div class="flex items-center justify-between flex-wrap gap-3 bg-surface/40 p-3 rounded-2xl border border-on-surface/5">
              <span class="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                <PaperClipIcon class="h-4 w-4 text-primary" />
                Resume Attachment:
              </span>
               <a
                v-if="app.cvUrl"
                :href="resolveUrl(app.cvUrl)"
                target="_blank"
                class="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 px-3.5 py-1.5 text-xs font-black text-primary transition"
              >
                <DocumentTextIcon class="h-4 w-4" />
                Download Custom Resume
              </a>
              <a
                v-else-if="app.applicant?.cvUrl"
                :href="resolveUrl(app.applicant.cvUrl)"
                target="_blank"
                class="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 px-3.5 py-1.5 text-xs font-black text-primary transition"
              >
                <DocumentTextIcon class="h-4 w-4" />
                Download Profile Resume
              </a>
              <span v-else class="text-xs text-on-surface-variant/65 italic">
                No CV attached
              </span>
            </div>

            <!-- Pipeline Actions -->
            <div class="pt-2 border-t border-on-surface/5">
              <p class="text-[10px] font-black uppercase text-on-surface-variant tracking-wider mb-2.5">Update Pipeline Stage</p>
              <div v-if="app.status === 'HIRED'" class="rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/25">
                <p class="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  🎉 Offer Accepted! This candidate has joined the company.
                </p>
              </div>
              <div v-else-if="app.status === 'DECLINED'" class="rounded-xl bg-amber-500/10 p-3 border border-amber-500/25">
                <p class="text-xs font-bold text-amber-600">
                  Offer Declined. The candidate has declined this job offer.
                </p>
              </div>
              <div v-else class="flex flex-wrap gap-2">
                <button
                  v-for="status in ['REVIEWED', 'INTERVIEW', 'ACCEPTED', 'REJECTED']"
                  :key="status"
                  @click="$emit('update-status', { applicationId: app.id, status })"
                  :class="[
                    'rounded-full px-4 py-2 text-xs font-black transition border',
                    app.status === status
                      ? statusConfig[status].bg + ' ' + statusConfig[status].text + ' border-transparent'
                      : 'bg-surface hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border-outline/20'
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
  </div>
</template>
