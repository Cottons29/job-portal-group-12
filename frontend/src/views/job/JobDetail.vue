<template>
  <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <div v-if="isLoading" class="flex min-h-[400px] items-center justify-center">
      <p class="text-sm font-bold text-on-surface-variant/70">Loading job details...</p>
    </div>
    <div v-else-if="!job" class="flex min-h-[400px] items-center justify-center">
      <p class="text-sm font-bold text-red-500">Job not found.</p>
    </div>
    <div v-else>
      <div class="mb-6">
        <RouterLink
          to="/job-feed"
          class="inline-flex items-center gap-2 text-xs font-black text-primary hover:underline transition"
        >
          ← Back to Job Feed
        </RouterLink>
      </div>
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section class="space-y-10">
          <header>
            <div class="mb-6 h-1.5 w-14 rounded-full bg-primary"></div>
            <h1 class="text-4xl font-black font-display tracking-tight text-on-surface leading-tight">{{ job.title }}</h1>
            <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-on-surface-variant/70">
              <span class="inline-flex items-center gap-2">
                <Building2 class="h-4 w-4 text-primary" />
                {{ job.company }}
              </span>
              <span class="inline-flex items-center gap-2">
                <MapPin class="h-4 w-4 text-primary" />
                {{ job.location }}
              </span>
              <span class="inline-flex items-center gap-2">
                <BriefcaseBusiness class="h-4 w-4 text-primary" />
                {{ job.type }}
              </span>
            </div>
          </header>

          <section>
            <h2 class="mb-3 text-xl font-black font-display text-on-surface leading-tight">Job Description</h2>
            <p class="leading-8 text-sm font-semibold text-on-surface-variant/80">{{ job.description }}</p>
          </section>

          <section>
            <h2 class="mb-4 text-xl font-black font-display text-on-surface leading-tight">Key Responsibilities</h2>
            <ul class="space-y-3 text-sm font-semibold text-on-surface-variant/80">
              <li
                v-for="item in job.responsibilities"
                :key="item"
                class="flex items-start gap-3 leading-7"
              >
                <span class="mt-2.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary"></span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 class="mb-4 text-xl font-black font-display text-on-surface leading-tight">Required Skills & Attributes</h2>
            <div class="mb-5 flex flex-wrap gap-2">
              <span
                v-for="skill in job.skills"
                :key="skill"
                class="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary ring-1 ring-primary/20"
              >
                {{ skill }}
              </span>
            </div>

            <ul class="space-y-3 text-sm font-semibold text-on-surface-variant/80">
              <li
                v-for="item in job.requirements"
                :key="item"
                class="flex items-start gap-3 leading-7"
              >
                <span class="mt-2.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"></span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </section>
        </section>

        <aside class="space-y-5">
          <div class="rounded-3xl border border-on-surface/5 bg-surface-container-lowest p-6 shadow-sm">
            <div class="flex items-center justify-between">
              <p class="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/50">Monthly Salary</p>
              <span class="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-600 ring-1 ring-amber-500/20">
                Student Job
              </span>
            </div>
            <p class="mt-3 text-3xl font-black font-display text-on-surface leading-none">{{ job.salary }}</p>
            <p class="mt-3 text-xs font-semibold text-on-surface-variant/60 leading-relaxed">Negotiable based on experience and weekly commitment.</p>

            <div class="mt-6 space-y-3">
              <!-- Student: Apply / Applied -->
              <template v-if="userRole?.toLowerCase() === 'student' && userId !== job.authorId">
                <button
                  v-if="!isApplied"
                  type="button"
                  @click="emitApply"
                  class="w-full rounded-2xl bg-primary px-4 py-3.5 text-sm font-black text-on-primary shadow-sm hover:bg-primary/95 transition duration-200"
                >
                  Apply Now
                </button>
                <div
                  v-else
                  class="w-full rounded-2xl bg-emerald-500/10 py-3.5 text-center text-sm font-black text-emerald-700 flex items-center justify-center gap-1.5 cursor-default"
                >
                  <CheckCircle2 class="h-4 w-4" />
                  Applied
                </div>
              </template>

              <!-- Employer: View Applicants (if owner) -->
              <template v-else-if="userRole?.toLowerCase() === 'employer' && userId === job.authorId">
                <button
                  type="button"
                  @click="emitViewApplicants"
                  class="w-full rounded-2xl bg-primary px-4 py-3.5 text-sm font-black text-on-primary shadow-sm hover:bg-primary/95 transition duration-200 flex items-center justify-center gap-2"
                >
                  <Users class="h-4 w-4" />
                  View Applicants
                </button>
              </template>

              <!-- General/Fallback Apply (if Guest or other roles) -->
              <template v-else-if="!userId">
                <button
                  type="button"
                  @click="emitApply"
                  class="w-full rounded-2xl bg-primary px-4 py-3.5 text-sm font-black text-on-primary shadow-sm hover:bg-primary/95 transition duration-200"
                >
                  Apply Now
                </button>
              </template>

              <!-- Save / Bookmark Button (Only for students / guests) -->
              <button
                v-if="userRole?.toLowerCase() !== 'employer'"
                type="button"
                @click="toggleBookmark"
                :class="[
                  'w-full rounded-2xl px-4 py-3.5 text-sm font-black transition duration-200 flex items-center justify-center gap-2',
                  isBookmarked 
                    ? 'bg-primary/15 text-primary hover:bg-primary/20' 
                    : 'bg-on-surface/5 text-on-surface hover:bg-on-surface/10'
                ]"
              >
                <Bookmark :class="['h-4 w-4', isBookmarked ? 'fill-primary' : '']" />
                {{ isBookmarked ? 'Saved' : 'Save Job' }}
              </button>
            </div>

            <div class="mt-6 space-y-2 border-t border-on-surface/5 pt-4 text-xs font-semibold text-on-surface-variant/70">
              <p class="inline-flex items-center gap-2">
                <Users class="h-4 w-4 text-primary" />
                {{ job.applicants }} applicants already applied
              </p>
              <p class="inline-flex items-center gap-2">
                <CalendarDays class="h-4 w-4 text-primary" />
                Apply by {{ job.deadline }}
              </p>
            </div>
          </div>

          <div class="rounded-3xl bg-surface-container-low p-6">
            <div class="flex items-start gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-lowest text-primary">
                <Building2 class="h-5 w-5" />
              </div>
              <div>
                <h3 class="text-xl font-black font-display text-on-surface leading-tight">{{ job.company }}</h3>
                <p class="mt-1 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-primary hover:underline transition cursor-pointer">
                  Visit Website
                  <ExternalLink class="h-3 w-3" />
                </p>
              </div>
            </div>
            <p class="mt-3 text-xs font-semibold leading-relaxed text-on-surface-variant/85">
              {{ job.companySummary }}
            </p>

            <div class="mt-5 rounded-2xl border border-dashed border-on-surface/20 bg-surface-container-lowest px-4 py-5 text-center">
              <div class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <ShieldCheck class="h-5 w-5" />
              </div>
              <p class="text-xs font-black text-on-surface">Admin Verified Employer</p>
              <p class="mt-1 text-[9px] font-black uppercase tracking-wider text-on-surface-variant/40">Verified on Sep 2024</p>
            </div>
          </div>

          <div v-if="job.similarRoles?.length">
            <h3 class="mb-3 text-sm font-black font-display text-on-surface">Similar Roles</h3>
            <div class="space-y-3">
              <article
                v-for="role in job.similarRoles"
                :key="role.title"
                class="rounded-2xl border border-on-surface/5 bg-surface-container-lowest px-5 py-3 shadow-sm"
              >
                <p class="text-xs font-black text-on-surface">{{ role.title }}</p>
                <p class="mt-1 text-[10px] font-semibold text-on-surface-variant/60">{{ role.company }}</p>
              </article>
            </div>
          </div>
        </aside>
      </div>

      <footer class="mt-14 border-t border-on-surface/5 pt-6">
        <div class="flex flex-col gap-3 text-[10px] font-semibold text-on-surface-variant/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 FirstStep Editorial. Empowering the next Cambodian talent generation.</p>
          <div class="flex flex-wrap items-center gap-4">
            <a href="#" class="hover:text-on-surface">About Us</a>
            <a href="#" class="hover:text-on-surface">Privacy Policy</a>
            <a href="#" class="hover:text-on-surface">Terms of Service</a>
            <a href="#" class="hover:text-on-surface">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { BriefcaseBusiness, Building2, CalendarDays, ExternalLink, MapPin, ShieldCheck, Users, CheckCircle2, Bookmark } from 'lucide-vue-next'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { usePostStore } from '@/stores/posts'

type JobDetail = {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  deadline: string
  applicants: number
  description: string
  responsibilities: string[]
  skills: string[]
  requirements: string[]
  companySummary: string
  similarRoles: Array<{ title: string; company: string }>
}

const route = useRoute()
const job = ref<JobDetail | null>(null)
const rawPost = ref<any>(null)
const isLoading = ref(true)
const isBookmarked = ref(false)
const bookmarkCount = ref(0)

const authStore = useAuthStore()
const postStore = usePostStore()

const userId = computed(() => authStore.user?.id)
const userRole = computed(() => authStore.user?.role)
const isApplied = computed(() => {
  return job.value ? postStore.appliedPostIds.has(job.value.id) : false
})

const emit = defineEmits<{
  (e: 'apply', post: any): void
  (e: 'view-applicants', post: any): void
}>()

function emitApply() {
  if (rawPost.value) {
    emit('apply', rawPost.value)
  }
}

function emitViewApplicants() {
  if (rawPost.value) {
    emit('view-applicants', rawPost.value)
  }
}

async function toggleBookmark() {
  if (!job.value) return
  const previousState = isBookmarked.value
  const previousCount = bookmarkCount.value

  // Optimistic update
  isBookmarked.value = !previousState
  bookmarkCount.value = previousCount + (isBookmarked.value ? 1 : -1)

  try {
    const { data } = await api.post(`/posts/${job.value.id}/bookmark`)
    isBookmarked.value = data.bookmarked
    bookmarkCount.value = data.bookmarkCount
  } catch (error) {
    // Rollback
    isBookmarked.value = previousState
    bookmarkCount.value = previousCount
    console.error('Failed to toggle bookmark:', error)
  }
}

const fallbackJob: JobDetail = {
  id: '0',
  title: 'Senior Software Intern',
  company: 'NexGen Solutions',
  location: 'Phnom Penh, Cambodia',
  type: 'Full-time',
  salary: '$200 - $350',
  deadline: 'Nov 30, 2026',
  applicants: 34,
  description:
    'Join our engineering team to solve practical product challenges and deliver scalable features.',
  responsibilities: [
    'Develop and maintain high-quality code using modern web tools.',
    'Participate in planning and team collaboration.',
    'Assist in debugging and performance improvements.',
  ],
  skills: ['JavaScript', 'React.js', 'Node.js', 'TypeScript', 'Tailwind CSS'],
  requirements: [
    'Pursuing a degree in Computer Science or related field.',
    'Strong understanding of data structures and algorithms.',
    'Excellent problem-solving and communication skills.',
  ],
  companySummary:
    'NexGen Solutions is a Cambodia-based software company focused on practical fintech platforms.',
  similarRoles: [
    { title: 'UI Design Intern', company: 'Creative Hub • Phnom Penh' },
    { title: 'Frontend Developer Trainee', company: 'DataStream Co. • Remote' },
  ],
}

async function fetchJobDetail() {
  const jobId = route.params.id
  if (!jobId) {
    job.value = fallbackJob
    isLoading.value = false
    return
  }

  isLoading.value = true
  try {
    const { data } = await api.get(`/posts/${jobId}`)
    if (data) {
      rawPost.value = data
      isBookmarked.value = Boolean(data.bookmarkedByMe)
      bookmarkCount.value = data.bookmarkCount || 0
      job.value = {
        id: String(data.id),
        title: data.title,
        company: data.company || data.author?.user_name || 'Employer',
        location: data.location || 'Phnom Penh',
        type: data.jobType || 'Part-time',
        salary: data.salary || 'Competitive',
        deadline: data.deadline || 'Flexible',
        applicants: 0,
        description: data.content,
        responsibilities: [
          'Participate in regular team updates and check-ins.',
          'Execute day-to-day role assignments as instructed.',
          'Uphold company standards and product quality.'
        ],
        skills: data.tags || [],
        requirements: [
          'Strong enthusiasm to learn and grow.',
          'Good team collaboration and communication.',
          'Basic domain knowledge relevant to the role.'
        ],
        companySummary: data.author?.bio || 'Verified SME Employer on FirstStep.',
        similarRoles: []
      }
    } else {
      job.value = fallbackJob
    }
  } catch (error) {
    console.error('Failed to fetch job details:', error)
    job.value = fallbackJob
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchJobDetail()
})
</script>
