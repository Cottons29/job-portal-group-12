<template>
  <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <p class="mb-4 text-sm text-slate-500">Job Details - {{ job.title }}</p>
    <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section class="space-y-10">
        <header>
          <div class="mb-6 h-1.5 w-14 rounded-full bg-blue-600"></div>
          <h1 class="text-[60px] font-bold leading-[1.03] text-slate-900">{{ job.title }}</h1>
          <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
            <span class="inline-flex items-center gap-2">
              <Building2 class="h-4 w-4 text-blue-600" />
              {{ job.company }}
            </span>
            <span class="inline-flex items-center gap-2">
              <MapPin class="h-4 w-4 text-blue-600" />
              {{ job.location }}
            </span>
            <span class="inline-flex items-center gap-2">
              <BriefcaseBusiness class="h-4 w-4 text-blue-600" />
              {{ job.type }}
            </span>
          </div>
        </header>

        <section>
          <h2 class="mb-3 text-[44px] font-semibold leading-tight text-slate-900">Job Description</h2>
          <p class="leading-8 text-slate-700">{{ job.description }}</p>
        </section>

        <section>
          <h2 class="mb-4 text-[44px] font-semibold leading-tight text-slate-900">Key Responsibilities</h2>
          <ul class="space-y-3 text-slate-700">
            <li
              v-for="item in job.responsibilities"
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
              v-for="skill in job.skills"
              :key="skill"
              class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
            >
              {{ skill }}
            </span>
          </div>

          <ul class="space-y-3 text-slate-700">
            <li
              v-for="item in job.requirements"
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
          <p class="mt-3 text-4xl font-bold text-slate-900">{{ job.salary }}</p>
          <p class="mt-3 text-sm text-slate-500">Negotiable based on experience and weekly commitment.</p>

          <div class="mt-6 space-y-3">
            <button
              type="button"
              class="w-full rounded-full bg-blue-600 px-4 py-3.5 text-xl font-bold text-white transition hover:bg-blue-700"
            >
              Apply Now
            </button>
            <button
              type="button"
              class="w-full rounded-full bg-slate-200 px-4 py-3.5 text-xl font-semibold text-blue-700 transition hover:bg-slate-300"
            >
              Save Job
            </button>
          </div>

          <div class="mt-6 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
            <p class="inline-flex items-center gap-2">
              <Users class="h-4 w-4 text-blue-600" />
              {{ job.applicants }} applicants already applied
            </p>
            <p class="inline-flex items-center gap-2">
              <CalendarDays class="h-4 w-4 text-blue-600" />
              Apply by {{ job.deadline }}
            </p>
          </div>
        </div>

        <div class="rounded-3xl bg-slate-100 p-6">
          <div class="flex items-start gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-600">
              <Building2 class="h-5 w-5" />
            </div>
            <div>
              <h3 class="text-3xl font-semibold text-slate-900">{{ job.company }}</h3>
              <p class="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                Visit Website
                <ExternalLink class="h-3.5 w-3.5" />
              </p>
            </div>
          </div>
          <p class="mt-3 text-sm leading-6 text-slate-600">
            {{ job.companySummary }}
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
              v-for="role in job.similarRoles"
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { BriefcaseBusiness, Building2, CalendarDays, ExternalLink, MapPin, ShieldCheck, Users } from 'lucide-vue-next'

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

const job = computed(() => {
  const id = String(route.params.id || '')
  return jobById[id] ?? fallbackJob
})
</script>
