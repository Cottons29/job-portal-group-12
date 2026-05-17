<template>
  <div class="no-scrollbar flex gap-4 overflow-x-auto rounded-[1.5rem] bg-surface-container-low p-4">
    <!-- Add Story Card -->
    <article class="min-w-[5.5rem] text-center cursor-pointer group" @click="$emit('add-story')">
      <div class="mx-auto rounded-full p-1 ring-2 ring-primary/40 group-hover:ring-primary transition-all duration-300 relative">
        <div class="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-surface-container-lowest text-lg font-black text-primary">
          <img v-if="userAvatar" :src="userAvatar" class="h-full w-full object-cover" alt="User avatar" />
          <span v-else>{{ userInitials }}</span>
        </div>
        <div class="absolute bottom-0 right-0 rounded-full bg-primary p-1 text-white ring-2 ring-surface-container-low">
          <PlusIcon class="h-3 w-3" />
        </div>
      </div>
      <p class="mt-2 truncate text-xs font-black text-on-surface group-hover:text-primary transition-colors">Add Story</p>
    </article>

    <!-- Map Dynamic Stories Feed -->
    <article v-for="story in stories" :key="story.name" class="min-w-[5.5rem] text-center">
      <div :class="[story.ring, 'mx-auto rounded-full p-1']">
        <div class="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-surface-container-lowest text-lg font-black text-primary">
          <img v-if="story.avatar" :src="story.avatar" class="h-full w-full object-cover" />
          <span v-else>{{ story.name.charAt(0) }}</span>
        </div>
      </div>
      <p class="mt-2 truncate text-xs font-black text-on-surface">{{ story.name }}</p>
    </article>
  </div>
</template>

<script setup>
import { PlusIcon } from '@heroicons/vue/24/solid'

defineProps({
  stories: {
    type: Array,
    required: true,
  },
  userAvatar: {
    type: String,
    default: null
  },
  userInitials: {
    type: String,
    default: 'ST'
  }
})

defineEmits(['add-story'])
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
