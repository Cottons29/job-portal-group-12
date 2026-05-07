<template>
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

    <div
        :class="[
        post.heroBg,
        'rounded-[1.25rem] p-5',
        { 'cursor-pointer transition-opacity hover:opacity-90': !full }
      ]"
        @click="!full && $emit('open', post)"
    >
      <p class="text-xs font-black uppercase tracking-[0.2em] text-primary" v-if="post.badge">
        {{ post.badge === 'Hiring now' ? $t('home.hiringNow') : (post.badge === 'Campus opportunity' ? $t('home.campusOpportunity') : post.badge) }}
      </p>
      <h2 class="mt-3 font-display text-3xl font-black tracking-[-0.04em] text-on-surface">{{ post.title }}</h2>
      <div :class="['relative mt-3 max-w-2xl', { 'post-preview': !full }]">
        <div
            class="post-markdown prose prose-sm text-on-surface-variant"
            v-html="post.descHtml || post.desc"
        />
        <div v-if="!full" class="post-preview__fade pointer-events-none absolute inset-x-0 bottom-0 h-16" />
      </div>
      <button
          v-if="!full"
          class="mt-3 rounded-full bg-surface-container-lowest/80 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-primary transition hover:bg-surface-container-lowest"
          type="button"
          @click.stop="$emit('open', post)"
      >
        Read full post
      </button>
      <img
          v-if="post.imageUrl && full"
          :src="post.imageUrl"
          :alt="post.title"
          class="mt-5 max-h-96 w-full rounded-[1rem] object-cover"
      />
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
        {{ $t('home.applyNow') }}
      </button>
    </div>
  </div>
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
  full: {
    type: Boolean,
    default: false
  }
})

defineEmits(['open'])

const actions = [
  { label: 'Like post', icon: HeartIcon },
  { label: 'Comment on post', icon: ChatBubbleOvalLeftEllipsisIcon },
  { label: 'Share post', icon: PaperAirplaneIcon },
]
</script>

<style scoped>
.post-preview {
  max-height: 14rem;
  overflow: hidden;
}

.post-preview__fade {
  background: linear-gradient(to bottom, transparent, color-mix(in srgb, var(--fs-surface-container-lowest) 100%, transparent));
}

.post-markdown :deep(p + p),
.post-markdown :deep(h1),
.post-markdown :deep(h2),
.post-markdown :deep(h3),
.post-markdown :deep(h4),
.post-markdown :deep(ul),
.post-markdown :deep(ol),
.post-markdown :deep(blockquote),
.post-markdown :deep(img),
.post-markdown :deep(pre) {
  margin-top: 0.75rem;
}

.post-markdown :deep(h1),
.post-markdown :deep(h2),
.post-markdown :deep(h3),
.post-markdown :deep(h4) {
  color: var(--fs-on-surface);
  font-family: var(--font-display);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.15;
}

.post-markdown :deep(h1) {
  font-size: 1.75rem;
}

.post-markdown :deep(h2) {
  font-size: 1.45rem;
}

.post-markdown :deep(h3) {
  font-size: 1.2rem;
}

.post-markdown :deep(img) {
  max-height: 24rem;
  width: 100%;
  border-radius: 1rem;
  object-fit: cover;
}

.post-preview .post-markdown :deep(img) {
  max-height: 12rem;
}

.post-markdown :deep(ul),
.post-markdown :deep(ol) {
  padding-left: 1.25rem;
}

.post-markdown :deep(ul) {
  list-style: disc;
}

.post-markdown :deep(ol) {
  list-style: decimal;
}

.post-markdown :deep(a) {
  color: var(--fs-primary);
  font-weight: 800;
  text-decoration: underline;
}

.post-markdown :deep(strong) {
  color: var(--fs-on-surface);
  font-weight: 900;
}

.post-markdown :deep(code) {
  border-radius: 0.45rem;
  background: color-mix(in srgb, var(--fs-surface-container-lowest) 80%, transparent);
  padding: 0.15rem 0.35rem;
  color: var(--fs-on-surface);
  font-size: 0.8em;
  font-weight: 800;
}

.post-markdown :deep(pre) {
  overflow-x: auto;
  border-radius: 0.85rem;
  background: color-mix(in srgb, var(--fs-surface-container-lowest) 80%, transparent);
  padding: 0.9rem;
}

.post-markdown :deep(pre code) {
  background: transparent;
  padding: 0;
}
</style>
