<script setup>
import { ref } from 'vue'
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  isSubmitting: {
    type: Boolean,
    default: false
  },
  submitError: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'submit'])

const coverLetter = ref('')

function handleSubmit() {
  emit('submit', { postId: props.post.id, coverLetter: coverLetter.value.trim() })
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 overflow-y-auto bg-black/65 px-4 py-6 backdrop-blur-sm sm:py-10"
    @click.self="$emit('close')"
  >
    <div class="mx-auto w-full max-w-lg">
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
        <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">Apply</p>
        <h2 class="mt-2 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">
          {{ post.title }}
        </h2>
        <p class="mt-1 text-sm font-bold text-on-surface-variant">
          Posted by {{ post.company }}
        </p>

        <form class="mt-6 space-y-5" @submit.prevent="handleSubmit">
          <label class="block space-y-2">
            <span class="text-sm font-black text-on-surface">Cover letter <span class="font-semibold text-on-surface-variant">(optional)</span></span>
            <textarea
              v-model="coverLetter"
              class="min-h-36 w-full resize-y rounded-[1.25rem] bg-surface px-4 py-3 text-sm font-bold leading-6 text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
              placeholder="Tell the employer why you're a great fit for this role..."
              maxlength="3000"
            />
            <p class="text-right text-xs font-bold text-on-surface-variant">
              {{ coverLetter.length }} / 3000
            </p>
          </label>

          <p v-if="submitError" class="rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
            {{ submitError }}
          </p>

          <button
            type="submit"
            class="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-black text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="isSubmitting"
          >
            <PaperAirplaneIcon class="h-5 w-5" />
            {{ isSubmitting ? 'Submitting...' : 'Submit application' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
