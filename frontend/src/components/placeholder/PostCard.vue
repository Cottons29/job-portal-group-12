<template>
  <article class="rounded-[1.5rem] bg-surface-container-low p-3">
    <div class="rounded-[1.25rem] bg-surface-container-lowest p-5">
      <div class="mb-5 flex items-start justify-between gap-4">
        <div class="flex items-center gap-3">
          <div :class="[post.logoBg, post.logoText, 'grid h-12 w-12 place-items-center rounded-full text-sm font-black']">
            {{ post.company.charAt(0) }}
          </div>
          <div>
            <p class="font-black text-on-surface">{{ post.company }}</p>
            <p class="text-xs font-bold text-on-surface-variant">{{ post.meta }}</p>
          </div>
        </div>
        <EllipsisHorizontalIcon class="h-6 w-6 text-on-surface-variant" />
      </div>

      <div :class="[post.heroBg, 'rounded-[1.25rem] p-6']">
        <p class="text-xs font-black uppercase tracking-[0.2em] text-primary">{{ post.badge }}</p>
        <h2 class="mt-3 font-display text-3xl font-black tracking-[-0.04em] text-on-surface">{{ post.title }}</h2>
        <p class="mt-3 max-w-2xl text-sm leading-7 text-on-surface-variant">{{ post.desc }}</p>
        <div class="mt-6 flex flex-wrap gap-2">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="rounded-full bg-surface-container-lowest/80 px-3 py-1.5 text-xs font-black text-primary"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <div class="mt-5 flex items-center justify-between gap-3 border-t border-outline-variant/60 pt-4">
        <div class="flex gap-2">
          <button
            v-for="action in actions"
            :key="action.label"
            class="grid h-11 w-11 place-items-center rounded-full bg-surface-container-low text-primary transition hover:bg-tertiary-fixed"
            :aria-label="action.label"
          >
            <component :is="action.icon" class="h-5 w-5" />
          </button>
        </div>
        <button class="rounded-full border-2 border-transparent bg-primary px-5 py-2.5 text-sm font-black text-on-primary transition hover:border-primary hover:bg-primary-container hover:text-primary">
          Apply now
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import {
  ChatBubbleOvalLeftEllipsisIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from '@heroicons/vue/24/outline'

defineProps({
  post: {
    type: Object,
    required: true,
  },
})

const actions = [
  { label: 'Like post', icon: HeartIcon },
  { label: 'Comment on post', icon: ChatBubbleOvalLeftEllipsisIcon },
  { label: 'Share post', icon: PaperAirplaneIcon },
]
</script>
