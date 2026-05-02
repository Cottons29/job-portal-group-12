<script setup>
import StoryStrip from '../StoryStrip.vue'
import ComposeCard from '../ComposeCard.vue'
import PostCard from '../PostCard.vue'
import FocusPanel from '../FocusPanel.vue'
import SuggestionsPanel from '../SuggestionsPanel.vue'

defineProps({
  stories: {
    type: Array,
    required: true
  },
  composeActions: {
    type: Array,
    required: true
  },
  posts: {
    type: Array,
    required: true
  },
  postsLoading: {
    type: Boolean,
    default: false
  },
  postsError: {
    type: String,
    default: ''
  },
  postsLoadingMore: {
    type: Boolean,
    default: false
  },
  postsHasMore: {
    type: Boolean,
    default: true
  },
  focusCards: {
    type: Array,
    required: true
  },
  suggestions: {
    type: Array,
    required: true
  }
})

defineEmits(['open-post'])
</script>

<template>
  <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
    <section class="min-w-0 space-y-6">
      <StoryStrip :stories="stories"/>
      <ComposeCard :actions="composeActions"/>
      <p v-if="postsError" class="rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
        {{ postsError }}
      </p>
      <TransitionGroup name="post-fade" appear>
        <PostCard v-for="post in posts" :key="post.id" :post="post" @open="$emit('open-post', $event)"/>
      </TransitionGroup>
      <p v-if="postsLoadingMore"
         class="rounded-2xl bg-surface-container-low px-4 py-3 text-sm font-bold text-on-surface-variant">
        Loading more posts...
      </p>
      <p v-else-if="posts.length && !postsHasMore"
         class="rounded-2xl bg-surface-container-low px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
        You reached the end
      </p>
    </section>

    <aside class="space-y-6 xl:sticky xl:top-28 xl:h-fit">
      <FocusPanel :cards="focusCards"/>
      <SuggestionsPanel :suggestions="suggestions"/>
    </aside>
  </div>
</template>

<style scoped>
.post-fade-enter-active,
.post-fade-leave-active {
  transition: all 0.5s ease;
}

.post-fade-enter-from,
.post-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
