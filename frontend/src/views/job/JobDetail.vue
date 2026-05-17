<template>
  <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <p class="mb-4 text-sm text-slate-500">Job Details - {{ activeJob.title }}</p>
    
    <div v-if="isLoading" class="flex min-h-[400px] w-full flex-col items-center justify-center">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      <p class="mt-4 text-sm font-bold text-slate-500">Loading opportunity details...</p>
    </div>

    <div v-else class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section class="space-y-10">
        <header>
          <div class="mb-6 h-1.5 w-14 rounded-full bg-blue-600"></div>
          <h1 class="text-[60px] font-bold leading-[1.03] text-slate-900">{{ activeJob.title }}</h1>
          <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
            <span class="inline-flex items-center gap-2">
              <Building2 class="h-4 w-4 text-blue-600" />
              {{ activeJob.company }}
            </span>
            <span class="inline-flex items-center gap-2">
              <MapPin class="h-4 w-4 text-blue-600" />
              {{ activeJob.location }}
            </span>
            <span class="inline-flex items-center gap-2">
              <BriefcaseBusiness class="h-4 w-4 text-blue-600" />
              {{ activeJob.type }}
            </span>
          </div>
        </header>

        <section>
          <h2 class="mb-3 text-[44px] font-semibold leading-tight text-slate-900">Job Description</h2>
          <p class="leading-8 text-slate-700 whitespace-pre-wrap">{{ activeJob.description }}</p>
        </section>

        <section>
          <h2 class="mb-4 text-[44px] font-semibold leading-tight text-slate-900">Key Responsibilities</h2>
          <ul class="space-y-3 text-slate-700">
            <li
              v-for="item in activeJob.responsibilities"
              :key="item"
              class="flex items-start gap-3 leading-7"
            >
              <span class="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 class="mb-4 text-[44px] font-semibold leading-tight text-slate-900">Required Skills</h2>
          <div class="mb-5 flex flex-wrap gap-2">
            <span
              v-for="skill in activeJob.skills"
              :key="skill"
              class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
            >
              {{ skill }}
            </span>
          </div>

          <ul class="space-y-3 text-slate-700">
            <li
              v-for="item in activeJob.requirements"
              :key="item"
              class="flex items-start gap-3 leading-7"
            >
              <span class="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </section>
      </section>

      <aside class="space-y-5">
        <div class="rounded-2xl border-2 border-slate-700 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="text-xs font-semibold uppercase text-slate-500">Monthly Salary</p>
            <span class="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-700">
              Student Job
            </span>
          </div>
          <p class="mt-3 text-4xl font-bold text-slate-900">{{ activeJob.salary }}</p>
          <p class="mt-3 text-sm text-slate-500">Negotiable based on experience and weekly commitment.</p>

          <div class="mt-6 space-y-3">
            <button
              type="button"
              @click="showApplyModal = true"
              class="w-full rounded-full bg-blue-600 px-4 py-3.5 text-xl font-bold text-white transition hover:bg-blue-700 cursor-pointer"
            >
              Apply Now
            </button>
            <button
              type="button"
              @click="toggleSaveJob"
              class="w-full rounded-full bg-slate-200 px-4 py-3.5 text-xl font-semibold text-blue-700 transition hover:bg-slate-300 cursor-pointer"
            >
              {{ isSaved ? '✓ Saved to Bookmarks' : 'Save Job' }}
            </button>
          </div>

          <!-- Option B: AI Recommendation Match Card -->
          <div v-if="activeJob.matchScore !== undefined" class="mt-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-5 shadow-sm">
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-800">
                <Sparkles class="h-4 w-4 text-blue-600 animate-pulse" />
                AI Match Score
              </span>
              <span class="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-black text-white">
                {{ activeJob.matchScore }}%
              </span>
            </div>

            <p class="mt-3 text-xs text-slate-600 leading-relaxed">
              Our match engine computed compatibility based on your profile skills and major tags.
            </p>

            <!-- Match Meter -->
            <div class="mt-3 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000" :style="{ width: activeJob.matchScore + '%' }"></div>
            </div>

            <div class="mt-4 flex items-center justify-between text-[11px] font-bold text-blue-700">
              <span>High Compatibility</span>
              <button @click="showMatchBreakdown = true" class="underline hover:text-blue-800 cursor-pointer font-bold bg-transparent border-none p-0 outline-none">
                Skills Breakdown →
              </button>
            </div>
          </div>

          <div class="mt-6 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
            <p class="inline-flex items-center gap-2">
              <Users class="h-4 w-4 text-blue-600" />
              {{ activeJob.applicants }} applicant(s)
            </p>
            <p class="inline-flex items-center gap-2">
              <CalendarDays class="h-4 w-4 text-blue-600" />
              Apply by {{ activeJob.deadline }}
            </p>
          </div>
        </div>

        <div class="rounded-3xl bg-slate-100 p-6">
          <div class="flex items-start gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-600">
              <Building2 class="h-5 w-5" />
            </div>
            <div>
              <h3 class="text-3xl font-semibold text-slate-900">{{ activeJob.company }}</h3>
              <p class="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                Visit Website
                <ExternalLink class="h-3.5 w-3.5" />
              </p>
            </div>
          </div>
          <p class="mt-3 text-sm leading-6 text-slate-600">
            {{ activeJob.companySummary }}
          </p>

          <div class="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5 text-center">
            <div class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <ShieldCheck class="h-5 w-5" />
            </div>
            <p class="text-sm font-bold text-slate-900">Admin Verified Employer</p>
            <p class="mt-1 text-[11px] uppercase text-slate-500">Verified on Sep 2024</p>
          </div>
        </div>

        <div>
          <h3 class="mb-3 text-lg font-semibold text-slate-900">Similar Roles</h3>
          <div class="space-y-3">
            <article
              v-for="role in activeJob.similarRoles"
              :key="role.title"
              class="rounded-full bg-white px-5 py-3 shadow-sm ring-1 ring-slate-100"
            >
              <p class="text-sm font-semibold text-slate-900">{{ role.title }}</p>
              <p class="mt-1 text-xs text-slate-500">{{ role.company }}</p>
            </article>
          </div>
        </div>
      </aside>
    </div>

    <!-- Apply Modal Overlay -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showApplyModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div class="w-full max-w-lg rounded-[1.5rem] bg-white p-6 shadow-2xl transition-all">
            <div class="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 class="font-display text-xl font-black text-slate-900">Apply to {{ activeJob.title }}</h3>
              <button @click="showApplyModal = false" class="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer">
                Close
              </button>
            </div>
            
            <div class="space-y-4">
              <!-- Autofill Banner -->
              <div class="rounded-xl bg-blue-50/50 p-4 text-xs text-blue-800 ring-1 ring-blue-500/20">
                <strong>✨ Profile Autofill Active:</strong> Your university profile credentials will be automatically shared with <strong>{{ activeJob.company }}</strong>.
              </div>

              <label class="block">
                <span class="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  Cover Note / Email to Employer (Required)
                </span>
                <textarea
                  v-model="applicationForm.coverLetter"
                  rows="3"
                  required
                  placeholder="e.g. Dear Hiring Manager, I am very excited about this student role..."
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                ></textarea>
              </label>

              <label class="block">
                <span class="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  Portfolio / Website Link (Optional)
                </span>
                <input
                  v-model="applicationForm.portfolioUrl"
                  type="url"
                  placeholder="e.g. https://myportfolio.com"
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                />
              </label>

              <label class="block">
                <span class="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  Override CV / Resume Link (Optional)
                </span>
                <input
                  v-model="applicationForm.resumeUrl"
                  type="url"
                  placeholder="e.g. https://mycloud.com/resume.pdf"
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                />
              </label>
              
              <div class="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  @click="showApplyModal = false"
                  class="rounded-full px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  @click="submitApplication"
                  :disabled="isSubmittingApp || !applicationForm.coverLetter.trim()"
                  class="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-black text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                >
                  {{ isSubmittingApp ? 'Submitting...' : 'Submit Application' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Match Breakdown Modal Overlay (Option B) -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showMatchBreakdown" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div class="w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-2xl transition-all">
            <div class="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 class="font-display text-xl font-black text-slate-900 flex items-center gap-2">
                <Sparkles class="h-5 w-5 text-blue-600" />
                AI Compatibility Breakdown
              </h3>
              <button @click="showMatchBreakdown = false" class="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer">
                Close
              </button>
            </div>
            
            <div class="space-y-4">
              <div class="text-center py-4">
                <span class="text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {{ activeJob.matchScore }}% Match
                </span>
                <p class="mt-2 text-xs text-slate-500 font-semibold">Overall Recommendation Compatibility</p>
              </div>

              <div class="space-y-3 rounded-2xl bg-slate-50 p-4">
                <div>
                  <p class="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Matched Skills</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span class="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-500/20">Figma</span>
                    <span class="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-500/20">Vue.js</span>
                    <span class="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-500/20">Prototyping</span>
                  </div>
                </div>

                <div class="border-t border-slate-200/60 pt-2">
                  <p class="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Recommended Skills</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span class="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-500/20">Tailwind CSS</span>
                    <span class="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-500/20">TypeScript</span>
                  </div>
                </div>
              </div>

              <p class="text-xs text-slate-500 leading-relaxed text-center">
                💡 <em>Tip: Add Tailwind CSS or TypeScript to your profile to boost your application match score to 100%!</em>
              </p>

              <div class="flex justify-end pt-2">
                <button
                  type="button"
                  @click="showMatchBreakdown = false"
                  class="rounded-full bg-slate-100 hover:bg-slate-200 px-6 py-2 text-sm font-black text-slate-700 transition cursor-pointer"
                >
                  Awesome!
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <footer class="mt-14 border-t border-slate-200 pt-6">
      <div class="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 FirstStep Editorial. Empowering the next generation of Cambodian talent.</p>
        <div class="flex flex-wrap items-center gap-4">
          <a href="#" class="hover:text-slate-700">About Us</a>
          <a href="#" class="hover:text-slate-700">Privacy Policy</a>
          <a href="#" class="hover:text-slate-700">Terms of Service</a>
          <a href="#" class="hover:text-slate-700">Contact Support</a>
        </div>
      </div>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { BriefcaseBusiness, Building2, CalendarDays, ExternalLink, MapPin, ShieldCheck, Users, Sparkles } from 'lucide-vue-next'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

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
  matchScore?: number
}

const route = useRoute()
const auth = useAuthStore()
const liveJob = ref<any>(null)
const isLoading = ref(false)
const errorMsg = ref('')
const isSaved = ref(false)

const showApplyModal = ref(false)
const showMatchBreakdown = ref(false)
const isSubmittingApp = ref(false)
const applicationForm = ref({
  coverLetter: '',
  portfolioUrl: '',
  resumeUrl: ''
})

const jobById: Record<string, JobDetail> = {
  '1': {
    id: '1',
    title: 'UI/UX Designer',
    company: 'Slack',
    location: 'Paris, France',
    type: 'Part-time',
    salary: '$4500/month',
    deadline: 'Nov 30, 2026',
    applicants: 23,
    description: 'Design intuitive product flows and visual systems for collaboration tools.',
    responsibilities: [
      'Create wireframes and prototypes for key user journeys.',
      'Collaborate with product and engineering on feature delivery.',
      'Maintain design consistency across the product surface.',
    ],
    skills: ['Figma', 'Prototyping', 'UX Research', 'Design Systems'],
    requirements: [
      'Strong portfolio of digital product work.',
      '2+ years of product design experience.',
      'Comfort working in cross-functional teams.',
    ],
    companySummary: 'Slack builds collaboration software used by teams worldwide.',
    similarRoles: [
      { title: 'Product Designer Intern', company: 'Notion • Paris' },
      { title: 'Junior UX Designer', company: 'Figma • Remote' },
    ],
  },
  '2': {
    id: '2',
    title: 'Frontend Developer',
    company: 'Google',
    location: 'Remote',
    type: 'Full-time',
    salary: '$6000/month',
    deadline: 'Dec 12, 2026',
    applicants: 34,
    description: 'Build fast, reliable web interfaces for high-traffic applications.',
    responsibilities: [
      'Develop reusable UI components with Vue and TypeScript.',
      'Optimize performance and accessibility for critical flows.',
      'Partner with backend engineers on API-driven features.',
    ],
    skills: ['Vue', 'TypeScript', 'Tailwind CSS', 'Testing'],
    requirements: [
      'Solid JavaScript and modern frontend fundamentals.',
      'Experience integrating REST APIs.',
      'Ability to ship maintainable production code.',
    ],
    companySummary: 'Google creates products and platforms used by billions of users.',
    similarRoles: [
      { title: 'Frontend Engineer Intern', company: 'YouTube • Remote' },
      { title: 'UI Developer Trainee', company: 'Google Maps • Hybrid' },
    ],
  },
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

const activeJob = computed(() => {
  if (liveJob.value) {
    return {
      id: liveJob.value.id,
      title: liveJob.value.title,
      company: liveJob.value.author?.employerProfile?.companyName || liveJob.value.author?.user_name || 'Wing Bank',
      location: liveJob.value.author?.employerProfile?.companyAddress || 'Phnom Penh, Cambodia',
      type: 'Part-time',
      salary: '$300 - $550 USD',
      deadline: 'Dec 31, 2026',
      applicants: liveJob.value.commentCount || 0,
      description: liveJob.value.content || '',
      responsibilities: [
        'Contribute to features and visual prototypes.',
        'Collaborate with developers and stakeholders.'
      ],
      skills: ['Communication', 'Teamwork', 'Khmer & English'],
      requirements: [
        'Willingness to learn and grow.',
        'Enrolled in University/College.'
      ],
      companySummary: liveJob.value.author?.employerProfile?.companySummary || 'A leading local business in Cambodia.',
      similarRoles: [
        { title: 'Frontend Developer Trainee', company: 'Google • Remote' },
        { title: 'UX Research Intern', company: 'Slack • Hybrid' }
      ],
      matchScore: liveJob.value.matchScore !== undefined ? liveJob.value.matchScore : 85
    }
  }
  
  const id = String(route.params.id || '')
  const mockJob = jobById[id] ?? fallbackJob
  return {
    ...mockJob,
    matchScore: 85
  }
})

async function fetchLiveJob() {
  const id = String(route.params.id || '')
  if (!id || ['1', '2'].includes(id)) return
  isLoading.value = true
  errorMsg.value = ''
  try {
    const { data } = await api.get(`/posts/${id}`)
    liveJob.value = data.post
    isSaved.value = data.post.bookmarkedByMe || false
  } catch (err: any) {
    console.error('Failed to fetch singular job post:', err)
  } finally {
    isLoading.value = false
  }
}

async function toggleSaveJob() {
  try {
    const { data } = await api.post(`/posts/${activeJob.value.id}/bookmark`)
    isSaved.value = data.bookmarked
    window.alert(data.bookmarked ? 'Job added to bookmarks!' : 'Job removed from bookmarks!')
  } catch (e) {
    window.alert('Authentication required to save jobs.')
  }
}

async function submitApplication() {
  if (!auth.isAuthenticated) {
    window.alert('Please log in first to apply.')
    return
  }
  isSubmittingApp.value = true
  try {
    await api.post('/applications', {
      postId: activeJob.value.id,
      coverLetter: applicationForm.value.coverLetter,
      portfolioUrl: applicationForm.value.portfolioUrl,
      resumeUrl: applicationForm.value.resumeUrl
    })
    window.alert('Application submitted successfully! Recruiter has been notified.')
    showApplyModal.value = false
  } catch (err: any) {
    const msg = err.response?.data?.message || 'Could not submit application.'
    window.alert(msg)
  } finally {
    isSubmittingApp.value = false
  }
}

onMounted(() => {
  fetchLiveJob()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
