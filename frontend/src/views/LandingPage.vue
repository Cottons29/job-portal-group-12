<template>
  <div class="min-h-screen overflow-hidden bg-surface text-on-surface">
    <header class="sticky top-0 z-50 px-4 py-4">
      <div
          class="mx-auto flex max-w-7xl items-center justify-between rounded-[1rem] bg-surface-container-lowest/80 px-4 py-3 shadow-[0_20px_60px_rgba(11,28,48,0.08)] backdrop-blur-xl sm:px-6">
        <RouterLink to="/" class="flex items-center gap-3">
          <span
              class="grid h-11 w-11 place-items-center rounded-lg bg-primary text-sm font-black text-on-primary shadow-[0_12px_30px_rgba(0,74,198,0.28)]">FS</span>
          <span class="font-display text-xl font-black tracking-tight text-on-surface">FirstStep</span>
        </RouterLink>

        <div class="flex items-center gap-2">
          <RouterLink to="/auth"
                      class="hidden rounded-full border-2 border-transparent px-4 py-2 text-sm font-extrabold text-primary transition-colors hover:border-primary hover:bg-surface-container-low sm:inline-flex">
            Log in
          </RouterLink>
          <RouterLink to="/auth"
                      class="rounded-full border-2 border-transparent bg-primary px-5 py-2.5 text-sm font-extrabold text-on-primary transition-all hover:border-primary hover:bg-primary-container hover:text-primary">
            Get started
          </RouterLink>
        </div>
      </div>
    </header>

    <main>
      <section class="relative px-4 pb-16 pt-8 sm:pb-24 lg:pt-12">
        <div
            class="absolute left-1/2 top-0 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary-container/10 blur-3xl"></div>
        <div class="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div class="space-y-8">
            <div
                class="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
              <SparklesIcon class="h-4 w-4"/>
              student career hub
            </div>

            <div class="space-y-6">
              <h1 class="font-display text-5xl font-black leading-[0.95] tracking-[-0.045em] text-on-surface sm:text-6xl lg:text-7xl">
                Your first career step should feel clear, local, and exciting.
              </h1>
              <p class="max-w-2xl text-lg leading-8 text-on-surface-variant">
                Discover student-friendly roles, trusted Cambodian SMEs, and campus opportunities through a softer
                Material Design 3 experience built around focus, movement, and confidence.
              </p>
            </div>

            <div class="rounded-[1rem] bg-surface-container p-2 shadow-[0_24px_70px_rgba(11,28,48,0.08)]">
              <div
                  class="flex flex-col gap-3 rounded-[0.75rem] bg-surface-container-lowest p-3 sm:flex-row sm:items-center">
                <div
                    class="flex flex-1 items-center gap-3 rounded-[0.625rem] bg-surface-container-low px-4 py-3 transition-colors focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/20">
                  <MagnifyingGlassIcon class="h-5 w-5 text-primary"/>
                  <input type="text" placeholder="Search jobs, skills, companies..."
                         class="w-full bg-transparent text-sm font-semibold text-on-surface outline-none placeholder:text-on-surface-variant/70"/>
                </div>
                <button
                    class="rounded-[0.625rem] border-2 border-transparent bg-primary px-7 py-3 text-sm font-black text-on-primary shadow-[0_16px_35px_rgba(0,74,198,0.25)] transition-all hover:border-primary hover:bg-primary-container hover:text-primary">
                  Search jobs
                </button>
              </div>
            </div>

            <div class="flex flex-wrap gap-3">
              <button v-for="chip in quickChips" :key="chip.label"
                      :class="[
                        chip.bg,
                        chip.text,
                        'rounded-full border-2 border-transparent px-4 py-2 text-sm font-extrabold transition-all hover:border-primary hover:bg-tertiary-fixed hover:text-on-surface'
                      ]">
                {{ chip.label }}
              </button>
            </div>
          </div>

          <div class="relative">
            <div class="absolute -right-4 top-10 hidden h-28 w-28 rounded-[1rem] bg-tertiary-fixed md:block"></div>
            <div class="absolute -left-4 bottom-8 hidden h-20 w-20 rounded-[0.75rem] bg-primary/10 md:block"></div>

            <div class="relative rounded-[1.5rem] bg-surface-container p-4 shadow-[0_30px_90px_rgba(11,28,48,0.12)]">
              <div class="rounded-[1.25rem] bg-surface-container-lowest p-6">
                <div class="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p class="text-xs font-black uppercase tracking-[0.22em] text-primary">Featured match</p>
                    <h2 class="mt-2 font-display text-3xl font-black tracking-tight text-on-surface">Senior Barista &
                      Shift Lead</h2>
                  </div>
                  <span
                      class="rounded-full bg-tertiary-fixed px-3 py-1 text-xs font-black text-on-surface">$18.50/hr</span>
                </div>

                <div class="mb-6 rounded-[1rem] bg-primary p-6 text-on-primary">
                  <div class="flex items-center gap-4">
                    <div
                        class="grid h-14 w-14 place-items-center rounded-lg bg-gray-100/99 text-lg font-black backdrop-blur">
                      B
                    </div>
                    <div>
                      <p class="font-black">Brown Coffee</p>
                      <p class="text-sm text-gray/50">BKK1, Phnom Penh · 5h ago</p>
                    </div>
                  </div>
                  <p class="mt-8 max-w-sm text-sm leading-6 text-gray/85">Lead weekend shifts, mentor junior staff, and
                    build real customer-service experience while you study.</p>
                </div>

                <div class="grid grid-cols-3 gap-3">
                  <div v-for="stat in stats" :key="stat.label"
                       :class="[
                         stat.bg,
                         'rounded-[0.75rem] p-4 text-center'
                       ]">
                    <component :is="stat.icon" :class="['mx-auto mb-2 h-5 w-5', stat.iconColor]"/>
                    <p :class="['text-xl font-black', stat.textColor]">{{ stat.value }}</p>
                    <p :class="['mt-1 text-[11px] font-bold leading-tight', stat.labelColor]">{{ stat.label }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="partners" class="px-4 py-10">
        <div class="mx-auto max-w-7xl rounded-[1.5rem] bg-surface-container-low px-5 py-6 sm:px-8">
          <div class="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p class="text-xs font-black uppercase tracking-[0.2em] text-primary">Trusted network</p>
              <h2 class="mt-2 font-display text-3xl font-black tracking-tight text-on-surface">Active partners around
                campus</h2>
            </div>
            <RouterLink to="/auth" class="text-sm font-black text-primary hover:text-primary-container">Join the
              network
            </RouterLink>
          </div>
          <div class="no-scrollbar flex gap-4 overflow-x-auto pb-1">
            <div v-for="partner in partners" :key="partner.name"
                 class="min-w-[11rem] rounded-[1rem] bg-surface-container-lowest p-4 shadow-[0_18px_40px_rgba(11,28,48,0.06)]">
              <div
                  class="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-sm font-black text-primary">
                {{ partner.name.charAt(0) }}
              </div>
              <h3 class="font-black text-on-surface">{{ partner.name }}</h3>
              <p class="mt-1 text-xs font-bold text-on-surface-variant">{{ partner.status }}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pathways" class="px-4 py-16">
        <div class="mx-auto max-w-7xl">
          <div class="mb-10 max-w-2xl">
            <p class="text-xs font-black uppercase tracking-[0.2em] text-primary">Explore pathways</p>
            <h2 class="mt-3 font-display text-4xl font-black tracking-[-0.03em] text-on-surface sm:text-5xl">Choose a
              path that fits your semester.</h2>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article v-for="category in categories" :key="category.title"
                     class="group rounded-[1.125rem] bg-surface-container-lowest p-6">
              <div
                  :class="[
                    category.iconBg,
                    category.iconColor,
                    'mb-8 grid h-14 w-14 place-items-center rounded-lg transition-colors'
                  ]">
                <component :is="category.icon" class="h-7 w-7"/>
              </div>
              <h3 class="text-lg font-black text-on-surface">{{ category.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-on-surface-variant">{{ category.desc }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="px-4 py-8">
        <div class="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
          <div v-for="(step, index) in steps" :key="step.title"
               class="relative rounded-[1.25rem] bg-surface-container-low p-6">
            <div class="mb-8 flex items-center justify-between">
              <span class="grid h-12 w-12 place-items-center rounded-lg bg-primary text-lg font-black text-on-primary">{{
                  index + 1
                }}</span>
              <CheckCircleIcon class="h-7 w-7 text-primary"/>
            </div>
            <h3 class="font-display text-2xl font-black tracking-tight text-on-surface">{{ step.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-on-surface-variant">{{ step.desc }}</p>
          </div>
        </div>
      </section>

      <section id="opportunities" class="px-4 py-16">
        <div class="mx-auto max-w-7xl">
          <div class="mb-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p class="text-xs font-black uppercase tracking-[0.2em] text-primary">Featured opportunities</p>
              <h2 class="mt-3 font-display text-4xl font-black tracking-[-0.03em] text-on-surface sm:text-5xl">Fresh
                roles, designed for student schedules.</h2>
            </div>
            <RouterLink to="/auth"
                        class="inline-flex w-fit rounded-full border-2 border-transparent bg-surface-container-high px-5 py-3 text-sm font-black text-primary transition-colors hover:border-primary hover:bg-tertiary-fixed">
              See all 200+ jobs
            </RouterLink>
          </div>

          <div class="grid gap-5 lg:grid-cols-3">
            <article v-for="job in jobs" :key="job.title"
                     class="flex rounded-[1.25rem] bg-surface-container-low p-3 transition-all">
              <div class="flex w-full flex-col rounded-[1rem] bg-surface-container-lowest p-5">
                <div class="mb-7 flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <span
                        class="grid h-12 w-12 place-items-center rounded-lg bg-surface-container text-sm font-black text-primary">{{
                        job.company.charAt(0)
                      }}</span>
                    <div>
                      <p class="text-sm font-black text-on-surface">{{ job.company }}</p>
                      <p class="text-xs font-bold text-on-surface-variant">{{ job.location }}</p>
                    </div>
                  </div>
                  <span class="text-xs font-black text-primary">{{ job.time }}</span>
                </div>

                <h3 class="font-display text-2xl font-black leading-tight tracking-tight text-on-surface">{{
                    job.title
                  }}</h3>
                <p class="mt-2 text-sm font-black text-primary">{{ job.wage }}</p>
                <p class="mt-4 flex-1 text-sm leading-6 text-on-surface-variant">{{ job.desc }}</p>

                <div class="mt-7 flex items-center gap-3">
                  <button
                      class="flex-1 rounded-[0.625rem] border-2 border-transparent bg-primary px-4 py-3 text-sm font-black text-on-primary transition-colors hover:border-primary hover:bg-primary-container hover:text-primary">
                    Apply now
                  </button>
                  <button
                      class="grid h-12 w-12 place-items-center rounded-[0.625rem] border-2 border-transparent bg-surface-container-low text-on-surface-variant transition-colors hover:border-primary hover:bg-tertiary-fixed hover:text-on-surface"
                      aria-label="Save job">
                    <BookmarkIcon class="h-5 w-5"/>
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="px-4 py-12">
        <div class="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div class="rounded-[1.5rem] bg-primary p-8 text-on-primary shadow-[0_28px_80px_rgba(0,74,198,0.2)] sm:p-10">
            <p class="text-xs font-black uppercase tracking-[0.2em] text-gray/70">For employers</p>
            <h2 class="mt-4 font-display text-4xl font-black tracking-[-0.03em]">Hire local talent without the portal
              fatigue.</h2>
            <p class="mt-4 text-sm leading-7 text-gray/80">Post open roles, surface campus-ready candidates, and support
              the next generation of Cambodian professionals.</p>
            <button
                class="mt-8 rounded-full border-2 border-transparent bg-white px-6 py-3 text-sm font-black text-primary transition-all  hover:border-primary hover:bg-tertiary-fixed/80">
              Post a job
            </button>
          </div>

          <div class="rounded-3xl bg-surface-container-low p-6 sm:p-8">
            <div class="mb-6 flex items-center justify-between">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.2em] text-primary">Live demand</p>
                <h2 class="mt-2 font-display text-3xl font-black tracking-tight text-on-surface">Campus role gaps</h2>
              </div>
              <BriefcaseIcon class="h-9 w-9 text-primary"/>
            </div>
            <div class="grid gap-3 sm:grid-cols-3">
              <div v-for="gap in roleGaps" :key="gap.role" class="rounded-[0.875rem] bg-surface-container-lowest p-5">
                <p class="font-black text-on-surface">{{ gap.role }}</p>
                <span
                    class="mt-4 inline-flex rounded-full bg-tertiary-fixed px-3 py-1 text-[11px] font-black text-on-surface">High Demand</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="px-4 pb-20 pt-8">
        <div
            class="mx-auto max-w-7xl rounded-[1.5rem] bg-surface-container-lowest p-8 text-center shadow-[0_24px_70px_rgba(11,28,48,0.08)] sm:p-12">
          <h2 class="mx-auto max-w-3xl font-display text-4xl font-black tracking-[-0.03em] text-on-surface sm:text-5xl">
            Ready to turn your next free afternoon into experience?</h2>
          <p class="mx-auto mt-4 max-w-xl text-sm leading-7 text-on-surface-variant">Create your free account to save
            jobs, track applications, and follow SMEs that match your goals.</p>
          <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <RouterLink to="/auth"
                        class="rounded-full border-2 border-transparent bg-primary px-7 py-3 text-sm font-black text-on-primary transition-colors hover:border-primary hover:bg-primary-container hover:text-primary">
              Create account
            </RouterLink>
            <RouterLink to="/about-us"
                        class="rounded-full border-2 border-transparent bg-surface-container-high px-7 py-3 text-sm font-black text-primary transition-colors hover:border-primary hover:bg-tertiary-fixed">
              Learn about FirstStep
            </RouterLink>
          </div>
        </div>
      </section>
    </main>

    <footer class="px-4 pb-8">
      <div
          class="mx-auto flex max-w-7xl flex-col justify-between gap-4 rounded-[1rem] bg-surface-container-low px-6 py-5 text-xs font-bold text-on-surface-variant sm:flex-row sm:items-center">
        <p>© 2024 FirstStep Editor, empowering the next generation.</p>
        <div class="flex flex-wrap gap-4">
          <RouterLink to="/privacy-policy" class="hover:text-primary">Privacy Policy</RouterLink>
          <RouterLink to="/terms-of-service" class="hover:text-primary">Terms of Service</RouterLink>
          <RouterLink to="/contact" class="hover:text-primary">Contact Support</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import {
  MagnifyingGlassIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  BuildingStorefrontIcon,
  PaintBrushIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  ChatBubbleOvalLeftIcon,
  BookmarkIcon,
  SparklesIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'

const quickChips = [
  {label: 'Marketing', bg: 'bg-[#aecbfa]', text: 'text-[#1a4fa3]'},
  {label: 'Design', bg: 'bg-[#d7b7ff]', text: 'text-[#6a39b8]'},
  {label: 'Tech', bg: 'bg-[#8ccaff]', text: 'text-[#235d84]'},
  {label: 'Part-time', bg: 'bg-[#8fd99b]', text: 'text-[#246b36]'},
  {label: 'Internships', bg: 'bg-[#ffc28e]', text: 'text-[#8a4a11]'},
]

const partners = [
  {name: 'Brown Coffee', status: 'Recently Active'},
  {name: 'Chip Mong', status: 'Featured SME'},
  {name: 'RUPP', status: 'University'},
  {name: 'Smart Axiata', status: 'Featured SME'},
  {name: 'Wing Bank', status: 'Recently Active'},
  {name: 'Pi Pay', status: 'Featured SME'},
  {name: 'Foodpanda', status: 'Recently Active'},
]

const stats = [
  {
    value: '50+',
    label: 'Trusted Employers',
    icon: BuildingStorefrontIcon,
    bg: 'bg-[#aecbfa]',
    iconColor: 'text-[#1a4fa3]',
    textColor: 'text-[#1a4fa3]',
    labelColor: 'text-[#1a4fa3]/80'
  },
  {
    value: '1.2k+',
    label: 'Active Students',
    icon: AcademicCapIcon,
    bg: 'bg-[#d7b7ff]',
    iconColor: 'text-[#6a39b8]',
    textColor: 'text-[#6a39b8]',
    labelColor: 'text-[#6a39b8]/80'
  },
  {
    value: '200+',
    label: 'Active Jobs',
    icon: BriefcaseIcon,
    bg: 'bg-[#8fd99b]',
    iconColor: 'text-[#246b36]',
    textColor: 'text-[#246b36]',
    labelColor: 'text-[#246b36]/80'
  },
]

const categories = [
  {
    title: 'Academic Tutoring',
    desc: 'Peer teaching, mentoring, and subject-support work close to campus.',
    icon: AcademicCapIcon,
    iconBg: 'bg-[#aecbfa]',
    iconColor: 'text-[#1a4fa3]'
  },
  {
    title: 'Retail',
    desc: 'Customer service and sales roles with flexible student-friendly shifts.',
    icon: BuildingStorefrontIcon,
    iconBg: 'bg-[#8fd99b]',
    iconColor: 'text-[#246b36]'
  },
  {
    title: 'Hospitality',
    desc: 'Cafes, restaurants, events, and guest-facing experience builders.',
    icon: ChatBubbleOvalLeftIcon,
    iconBg: 'bg-[#8ccaff]',
    iconColor: 'text-[#235d84]'
  },
  {
    title: 'Creative',
    desc: 'Design, writing, media, and content work for growing local brands.',
    icon: PaintBrushIcon,
    iconBg: 'bg-[#d7b7ff]',
    iconColor: 'text-[#6a39b8]'
  },
  {
    title: 'Tech Support',
    desc: 'IT helpdesk, software assistance, and practical digital operations.',
    icon: ComputerDesktopIcon,
    iconBg: 'bg-[#f8a9dc]',
    iconColor: 'text-[#9b1f70]'
  },
  {
    title: 'Admin',
    desc: 'Data entry, document support, coordination, and organization roles.',
    icon: DocumentTextIcon,
    iconBg: 'bg-[#ffc28e]',
    iconColor: 'text-[#8a4a11]'
  },
]

const steps = [
  {
    title: 'Create Profile',
    desc: 'Build a clean student profile that highlights availability, skills, and study schedule.'
  },
  {title: 'Quick Apply', desc: 'Use focused job cards and simple filters to apply to the right opportunities faster.'},
  {
    title: 'Start Working',
    desc: 'Track applications, follow trusted SMEs, and gain experience that compounds over time.'
  },
]

const jobs = [
  {
    company: 'Brown Coffee',
    location: 'BKK1, Phnom Penh',
    time: '5h ago',
    title: 'Senior Barista & Shift Lead',
    wage: '$18.50/hr',
    desc: 'Lead weekend shifts and train new junior staff in coffee preparation and customer service.'
  },
  {
    company: 'RUPP Writing Center',
    location: 'Toul Kork, Phnom Penh',
    time: '1d ago',
    title: 'Peer Writing Consultant',
    wage: '$15.00/hr',
    desc: 'Assist undergraduate students with essay structure, grammar, and academic writing techniques.'
  },
  {
    company: 'Chip Mong Supermarket',
    location: 'Sen Sok, Phnom Penh',
    time: '2d ago',
    title: 'Logistics & Inventory Associate',
    wage: '$16.00/hr',
    desc: 'Manage stock room organization, track incoming deliveries, and support floor replenishment.'
  },
]

const roleGaps = [
  {role: 'English-Khmer Translators'},
  {role: 'Data Entry Specialists'},
  {role: 'Social Media Management'},
]
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
