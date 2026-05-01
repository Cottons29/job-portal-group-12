<template>
  <section class="rounded-[1.5rem] bg-surface-container-low p-5">
    <div class="mb-5 flex items-center justify-between">
      <div>
        <p class="text-xs font-black uppercase tracking-[0.2em] text-primary">Today</p>
        <h2 class="font-display text-2xl font-black tracking-tight text-on-surface">Your focus</h2>
      </div>
      <SparklesIcon class="h-7 w-7 text-primary" />
    </div>
    <div class="grid gap-3">
      <div v-for="focus in cards" :key="focus.label" class="rounded-[1rem] bg-surface-container-lowest p-4">
        <div class="flex items-center justify-between">
          <p class="font-black text-on-surface">{{ focus.label }}</p>
          <span class="rounded-full bg-tertiary-fixed px-3 py-1 text-xs font-black text-on-surface">{{ focus.value }}</span>
        </div>
        <p class="mt-2 text-xs font-bold leading-5 text-on-surface-variant">{{ focus.desc }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { SparklesIcon } from '@heroicons/vue/24/outline'

defineProps({
  cards: {
    type: Array,
    required: true,
  },
})
</script>
