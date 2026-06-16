<template>
  <form
    class="mx-auto max-w-5xl rounded-3xl border border-on-surface/5 bg-surface-container-lowest px-6 py-7 shadow-sm sm:px-8"
    @submit.prevent="handleSubmit"
  >
    <div class="mb-8 flex flex-col gap-4 border-b border-on-surface/5 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="mb-1 text-xs font-semibold text-on-surface-variant/50">Employer Hub / Post Opportunity</p>
        <h1 class="text-2xl font-black font-display text-on-surface">Publish New Opportunity</h1>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="rounded-full px-5 py-2.5 text-xs font-black text-on-surface-variant/85 transition hover:bg-on-surface/5 hover:text-on-surface"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-full bg-primary px-6 py-3 text-xs font-black text-on-primary shadow-sm hover:bg-primary/95 transition-all duration-200"
        >
          Publish Job
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <div class="grid gap-5 md:grid-cols-3">
        <label class="block">
          <span class="form-label">Position</span>
          <input
            v-model="form.position"
            type="text"
            placeholder="e.g. Frontend Developer"
            class="form-control h-14"
          />
        </label>

        <label class="block">
          <span class="form-label">Job Title</span>
          <input
            v-model="form.title"
            type="text"
            placeholder="e.g. Senior Creative Lead"
            class="form-control h-14"
          />
        </label>

        <label class="block">
          <span class="form-label">Location</span>
          <input
            v-model="form.location"
            type="text"
            placeholder="e.g. Phnom Penh"
            class="form-control h-14"
          />
        </label>
      </div>

      <div class="grid gap-5 md:grid-cols-3">
        <label class="block">
          <span class="form-label">Hires Needed</span>
          <input
            v-model.number="form.hiresNeeded"
            type="number"
            min="1"
            step="1"
            placeholder="1"
            class="form-control h-14 px-4"
          />
          <p class="mt-2 text-[10px] font-semibold text-on-surface-variant/50">Number of people to hire for this position.</p>
        </label>

        <label class="block">
          <span class="form-label">Job Type</span>
          <select
            v-model="form.jobType"
            class="form-control h-14 px-4"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Freelance">Freelance</option>
            <option value="Internship">Internship</option>
          </select>
          <p class="mt-2 text-[10px] font-semibold text-on-surface-variant/50">Type of employment.</p>
        </label>

        <label class="block">
          <span class="form-label">Application Deadline</span>
          <input
            v-model="form.deadline"
            type="date"
            :min="today"
            class="form-control h-14 px-4"
          />
          <p class="mt-2 text-[10px] font-semibold text-on-surface-variant/50">Deadline must be today or later.</p>
        </label>
      </div>

      <div class="grid gap-5 md:grid-cols-2">
        <label class="block">
          <span class="form-label">Schedule</span>
          <select
            v-model="form.schedule"
            class="form-control h-14 px-4"
          >
            <option value="Flexible">Flexible</option>
            <option value="Weekend">Weekend</option>
            <option value="Full-day">Full-day</option>
          </select>
          <p class="mt-2 text-[10px] font-semibold text-on-surface-variant/50">Work schedule/shifts.</p>
        </label>

        <label class="block">
          <span class="form-label">Payment Frequency</span>
          <select
            v-model="form.paymentType"
            class="form-control h-14 px-4"
          >
            <option value="Hourly">Hourly</option>
            <option value="Daily">Daily</option>
            <option value="Project">Project</option>
          </select>
          <p class="mt-2 text-[10px] font-semibold text-on-surface-variant/50">How the candidate will be paid.</p>
        </label>
      </div>

      <div class="rounded-2xl bg-surface-container-low px-5 py-5 border border-on-surface/5">
        <p class="mb-4 flex items-center gap-2 text-sm font-black text-on-surface">
          <Languages class="h-4 w-4 text-primary" />
          Language Required
        </p>

        <div class="inline-flex rounded-full bg-surface-container-lowest p-1 shadow-sm border border-on-surface/5">
          <button
            v-for="language in languages"
            :key="language"
            type="button"
            class="h-9 min-w-24 rounded-full px-5 text-xs font-bold transition"
            :class="form.language === language ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'"
            @click="form.language = language"
          >
            {{ language }}
          </button>
        </div>
      </div>

      <label class="block">
        <span class="form-label">Job Description</span>
        <textarea
          v-model="form.description"
          rows="6"
          placeholder="Describe the mission and the impact of this role..."
          class="form-control resize-none py-4"
        ></textarea>
      </label>

      <label class="block">
        <span class="form-label">Requirements</span>
        <textarea
          v-model="form.requirements"
          rows="5"
          placeholder="List technical skills, education, and soft skills..."
          class="form-control resize-none py-4"
        ></textarea>
      </label>

      <div class="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <fieldset>
          <legend class="form-label">Estimated Pay Range</legend>

          <div class="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr_auto]">
            <input
              v-model="form.minPay"
              type="number"
              min="0"
              placeholder="Min"
              class="form-control h-14"
            />
            <span class="hidden text-sm font-semibold text-on-surface-variant/40 sm:block">to</span>
            <input
              v-model="form.maxPay"
              type="number"
              min="0"
              placeholder="Max"
              class="form-control h-14"
            />
            <select v-model="form.currency" class="form-control h-14 sm:w-28">
              <option>USD</option>
              <option>KHR</option>
            </select>
          </div>
        </fieldset>

        <aside class="rounded-3xl bg-amber-500/10 border border-amber-500/20 p-5 text-amber-600 lg:w-52">
          <Lightbulb class="mb-3 h-5 w-5" />
          <h2 class="mb-1 text-sm font-black">Pro Tip</h2>
          <p class="text-xs leading-5 text-amber-600/90 font-semibold">
            Job descriptions with specific requirements get 40% more qualified applicants in Cambodia.
          </p>
        </aside>
      </div>

      <div v-if="submitError" class="mt-4 p-3 bg-red-500/10 text-red-400 text-xs font-bold rounded-2xl border border-red-500/20">
        {{ submitError }}
      </div>

      <div class="flex flex-col-reverse gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs font-semibold text-on-surface-variant/50">Review opportunity details before publishing.</p>

        <div class="flex gap-3">
          <button
            type="button"
            class="rounded-full bg-on-surface/5 px-6 py-3 text-xs font-black text-on-surface transition hover:bg-on-surface/10"
            :disabled="isSubmitting"
          >
            Need Help?
          </button>
          <button
            type="submit"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-xs font-black text-on-primary shadow-sm hover:bg-primary/95 transition disabled:opacity-50"
            :disabled="isSubmitting"
          >
            <Send class="h-4 w-4" />
            {{ isSubmitting ? 'Publishing...' : 'Create Job Posting' }}
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Languages, Lightbulb, Send } from 'lucide-vue-next'
import api from '@/lib/api'

const router = useRouter()
const languages = ['Khmer', 'English', 'Bilingual']
const isSubmitting = ref(false)
const submitError = ref('')

const form = reactive({
  position: '',
  title: '',
  location: '',
  jobType: 'Part-time',
  hiresNeeded: 1,
  deadline: '',
  language: 'Khmer',
  schedule: 'Flexible',
  paymentType: 'Hourly',
  description: '',
  requirements: '',
  minPay: '',
  maxPay: '',
  currency: 'USD',
})

const today = new Date().toISOString().split('T')[0]

const handleSubmit = async () => {
  if (isSubmitting.value) return
  submitError.value = ''

  const jobTitle = form.title?.trim() || form.position?.trim()
  if (!jobTitle) {
    submitError.value = 'Job Title or Position is required.'
    return
  }

  const jobContent = form.description?.trim()
  if (!jobContent) {
    submitError.value = 'Job Description is required.'
    return
  }

  isSubmitting.value = true
  try {
    // 1. Calculate pay range display
    const payStr = form.minPay && form.maxPay
      ? `$${form.minPay} - $${form.maxPay}`
      : form.minPay
      ? `From $${form.minPay}`
      : 'Competitive'

    // 2. Parse requirements lines
    const reqLines = form.requirements
      .split(/[\n,;]+/)
      .map(line => line.trim().replace(/^[-*•]\s*/, ''))
      .filter(Boolean)

    // 3. Extract skill tags using common keywords
    const skillKeywords = [
      'javascript', 'typescript', 'vue', 'react', 'node', 'express', 'python',
      'java', 'c++', 'c#', 'sql', 'php', 'swift', 'kotlin', 'flutter',
      'tailwind', 'css', 'html', 'git', 'docker', 'aws', 'figma'
    ]
    const searchString = `${jobTitle} ${jobContent} ${form.requirements}`.toLowerCase()
    const extractedSkills = skillKeywords.filter(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      return regex.test(searchString)
    }).map(s => s === 'javascript' ? 'JavaScript' : s === 'typescript' ? 'TypeScript' : s === 'vue' ? 'Vue.js' : s === 'react' ? 'React.js' : s === 'node' ? 'Node.js' : s.toUpperCase())

    const payload = {
      title: jobTitle,
      content: jobContent,
      isJob: true,
      salary: payStr,
      location: form.location?.trim() || 'Phnom Penh',
      jobType: form.jobType,
      language: form.language,
      schedule: form.schedule,
      paymentType: form.paymentType,
      hiresNeeded: form.hiresNeeded,
      deadline: form.deadline || undefined,
      skills: extractedSkills,
      requirements: reqLines,
    }

    await api.post('/posts', payload)
    router.push('/job-feed')
  } catch (error: any) {
    console.error('Failed to publish job:', error)
    submitError.value = error.response?.data?.message || 'Failed to publish job opportunity.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-on-surface-variant, rgb(148 163 184));
  opacity: 0.7;
}

.form-control {
  width: 100%;
  border-radius: 1rem;
  border: 1px solid transparent;
  background-color: var(--color-surface-container-low, rgb(241 245 249));
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-on-surface, rgb(15 23 42));
  outline: none;
  transition: border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
}

.form-control::placeholder {
  color: var(--color-on-surface-variant, rgb(148 163 184));
  opacity: 0.5;
  font-weight: 500;
}

.form-control:focus {
  border-color: var(--color-primary, rgb(37 99 235));
  background-color: var(--color-surface-container-lowest, white);
  box-shadow: 0 0 0 4px rgba(var(--color-primary-rgb, 37, 99, 235), 0.1);
}
</style>
