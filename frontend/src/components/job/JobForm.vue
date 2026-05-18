<template>
  <form
    class="mx-auto max-w-5xl rounded-[8px] bg-white px-6 py-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:px-8"
    @submit.prevent="handleSubmit"
  >
    <div class="mb-8 flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="mb-1 text-xs font-medium text-slate-400">Employer Hub / Post Opportunity</p>
        <h1 class="text-3xl font-bold text-slate-950">Publish New Opportunity</h1>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-blue-600"
        >
          Publish Job
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <div class="grid gap-5 md:grid-cols-2">
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
      </div>

      <div class="grid gap-5 md:grid-cols-2">
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
          <p class="mt-2 text-xs text-slate-400">Number of people to hire for this position.</p>
        </label>

        <label class="block">
          <span class="form-label">Application Deadline</span>
          <input
            v-model="form.deadline"
            type="date"
            :min="today"
            class="form-control h-14 px-4"
          />
          <p class="mt-2 text-xs text-slate-400">Deadline must be today or later.</p>
        </label>
      </div>

      <div class="rounded-[8px] bg-blue-50 px-5 py-5">
        <p class="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
          <Languages class="h-4 w-4 text-blue-600" />
          Language Required
        </p>

        <div class="inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-blue-100">
          <button
            v-for="language in languages"
            :key="language"
            type="button"
            class="h-9 min-w-24 rounded-full px-5 text-xs font-bold transition"
            :class="form.language === language ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-blue-600'"
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
            <span class="hidden text-sm font-semibold text-slate-300 sm:block">to</span>
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

        <aside class="rounded-[8px] bg-amber-200 p-5 text-slate-900 shadow-[0_14px_30px_rgba(245,158,11,0.22)] lg:w-52">
          <Lightbulb class="mb-3 h-5 w-5" />
          <h2 class="mb-1 text-sm font-bold">Pro Tip</h2>
          <p class="text-xs leading-5 text-slate-700">
            Job descriptions with specific requirements get 40% more qualified applicants in Cambodia.
          </p>
        </aside>
      </div>

      <div class="flex flex-col-reverse gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs text-slate-400">Review opportunity details before publishing.</p>

        <div class="flex gap-3">
          <button
            type="button"
            class="rounded-[8px] bg-blue-50 px-6 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
          >
            Need Help?
          </button>
          <button
            type="submit"
            class="inline-flex items-center justify-center gap-2 rounded-[8px] bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <Send class="h-4 w-4" />
            Create Job Posting
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Languages, Lightbulb, Send } from 'lucide-vue-next'

const languages = ['Khmer', 'English', 'Bilingual']

const form = reactive({
  position: '',
  title: '',
  hiresNeeded: 1,
  deadline: '',
  language: 'Khmer',
  description: '',
  requirements: '',
  minPay: '',
  maxPay: '',
  currency: 'USD',
})

const today = new Date().toISOString().split('T')[0]

const handleSubmit = () => {
  console.log('Create job posting:', { ...form })
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
  color: rgb(148 163 184);
}

.form-control {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  background-color: rgb(241 245 249);
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(15 23 42);
  outline: none;
  transition: border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
}

.form-control::placeholder {
  color: rgb(148 163 184);
  font-weight: 500;
}

.form-control:focus {
  border-color: rgb(37 99 235);
  background-color: white;
  box-shadow: 0 0 0 4px rgb(37 99 235 / 0.1);
}
</style>
