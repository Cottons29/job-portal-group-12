<template>
  <div class="no-scrollbar flex gap-4 overflow-x-auto rounded-[1.5rem] bg-surface-container-low p-4">
    <article v-for="story in stories" :key="story.name" class="min-w-[5.5rem] text-center">
      <div :class="[story.ring, 'mx-auto rounded-full p-1']">
        <div class="grid h-16 w-16 place-items-center rounded-full bg-surface-container-lowest text-lg font-black text-primary">
          {{ story.name.charAt(0) }}
        </div>
      </div>
      <p class="mt-2 truncate text-xs font-black text-on-surface">{{ story.name }}</p>
    </article>
  </div>
</template>

<script setup>
defineProps({
  stories: {
    type: Array,
    required: true,
  },
})
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
