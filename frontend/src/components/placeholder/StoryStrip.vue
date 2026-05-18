<script setup>
import { computed } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  stories: {
    type: Array,
    default: () => []
  },
  userAvatar: {
    type: String,
    default: null
  },
  userInitials: {
    type: String,
    default: 'ME'
  },
  currentUserId: {
    type: String,
    default: null
  }
})

console.log('User Avatar:', props.userAvatar)

const emit = defineEmits(['add-story', 'view-story'])

const currentUserStoryGroup = computed(() =>
  props.stories.find(group => group.id === props.currentUserId)
)

const otherStories = computed(() =>
  props.stories.filter(group => group.id !== props.currentUserId)
)

const ringColors = ['ring-purple-400', 'ring-pink-400', 'ring-blue-400', 'ring-green-400', 'ring-orange-400', 'ring-yellow-400']
function getRingColor(name, idx) {
  return ringColors[idx % ringColors.length]
}
function getInitial(name) { return (name || '?').charAt(0).toUpperCase() }

function handleUserStoryClick() {
  if (currentUserStoryGroup.value) {
    emit('view-story', currentUserStoryGroup.value)
  } else {
    emit('add-story')
  }
}
</script>

<template>
  <div class="no-scrollbar flex gap-3 overflow-x-auto rounded-3xl bg-surface-container-low p-4">
    <!-- Add Story -->
    <article class="flex min-w-21 flex-col items-center gap-1.5 cursor-pointer group" @click="handleUserStoryClick">
      <div :class="['relative mx-auto rounded-full p-0.5 ring-2 transition-all duration-300 group-hover:ring-primary', currentUserStoryGroup ? 'ring-primary' : 'ring-dashed ring-primary/50']">
        <div class="grid h-17 w-17 place-items-center overflow-hidden rounded-full bg-surface-container-lowest">
          <img v-if="userAvatar" :src="userAvatar.replace('files', 'api/files')" class="h-full w-full object-cover" alt="Your story" />
          <span v-else class="text-lg font-black text-primary">{{ userInitials }}</span>
        </div>
        <div
          class="absolute -bottom-0.5 -right-0.5 grid h-6 w-6 place-items-center rounded-full bg-white ring-2 ring-surface-container-low shadow"
          @click.stop="$emit('add-story')"
        >
          <PlusIcon class="h-3.5 w-3.5 text-black" />
        </div>
      </div>
      <p class="w-20 truncate text-center text-[11px] font-black text-primary">
        {{ currentUserStoryGroup ? 'Your Story' : 'Add Story' }}
      </p>
    </article>

    <!-- Real stories from API (grouped by author) -->
    <article
      v-for="(storyGroup, idx) in otherStories"
      :key="storyGroup.id"
      class="flex min-w-21 flex-col items-center gap-1.5 cursor-pointer group"
      @click="$emit('view-story', storyGroup)"
    >
      <div :class="['relative mx-auto rounded-full p-0.5 ring-2 transition-all duration-300 group-hover:scale-105', getRingColor(storyGroup.name, idx)]">
        <div class="grid h-17 w-17 place-items-center overflow-hidden rounded-full bg-surface-container-lowest">
          <!-- Photo story thumbnail -->
          <img
            v-if="storyGroup.stories?.[0]?.mediaUrl"
            :src="storyGroup.stories[0].mediaUrl"
            class="h-full w-full object-cover"
            :alt="storyGroup.name"
          />
          <!-- Avatar -->
          <img
            v-else-if="storyGroup.avatar"
            :src="storyGroup.avatar"
            class="h-full w-full object-cover"
            :alt="storyGroup.name"
          />
          <!-- Text story: show first letter on color bg -->
          <div
            v-else
            class="grid h-full w-full place-items-center text-xl font-black text-white"
            :style="{ background: storyGroup.stories?.[0]?.bgColor || '#6366f1' }"
          >
            {{ getInitial(storyGroup.name) }}
          </div>
        </div>
        <!-- Story count badge -->
        <div v-if="storyGroup.stories?.length > 1" class="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-surface-container-low text-[10px] font-black text-on-surface ring-2 ring-surface-container-low shadow">
          {{ storyGroup.stories.length }}
        </div>
      </div>
      <p class="w-20 truncate text-center text-[11px] font-black text-on-surface group-hover:text-primary transition-colors">{{ storyGroup.name }}</p>
    </article>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
