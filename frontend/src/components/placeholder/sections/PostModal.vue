<script setup>
import PostCard from '../PostCard.vue'

defineProps({
  post: {
    type: Object,
    required: true
  },
  userRole: {
    type: String,
    default: null
  },
  userId: {
    type: String,
    default: null
  },
  appliedPostIds: {
    type: Object,
    default: () => new Set()
  }
})

defineEmits(['close', 'engagement-change', 'apply', 'view-applicants'])
</script>

<template>
  <div
      class="fixed inset-0 z-50 overflow-y-auto bg-black/65 px-4 py-6 backdrop-blur-sm sm:py-10"
      @click.self="$emit('close')"
  >
    <div class="mx-auto w-full max-w-4xl">
      <div class="mb-3 flex justify-end">
        <button
            class="grid opacity-40 h-10 w-10 offset place-items-center rounded-full bg-surface-container-low text-2xl font-black text-on-surface-variant shadow-xl ring-1 ring-white/10 transition hover:opacity-100 hover:text-on-surface"
            type="button"
            aria-label="Close post"
            @click="$emit('close')"
        >
          ×
        </button>
      </div>
      <PostCard
        class=" ml-10 mr-10"
        :post="post"
        :user-role="userRole"
        :user-id="userId"
        :applied-post-ids="appliedPostIds"
        full
        @engagement-change="$emit('engagement-change', $event)"
        @apply="$emit('apply', $event)"
        @view-applicants="$emit('view-applicants', $event)"
      />
    </div>
  </div>
</template>
