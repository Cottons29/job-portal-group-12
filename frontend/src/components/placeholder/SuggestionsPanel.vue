<template>
  <section class="rounded-[1.5rem] bg-surface-container-low p-5">
    <h2 class="font-display text-2xl font-black tracking-tight text-on-surface">{{ $t('home.suggestedForYou') }}</h2>
    <div class="mt-5 space-y-4">
      <div v-for="person in suggestions" :key="person.name" class="flex items-center gap-3">
        <div :class="[person.bg, person.text, 'grid h-12 w-12 place-items-center rounded-full text-sm font-black']">
          {{ person.name.charAt(0) }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-black text-on-surface">{{ person.name }}</p>
          <p class="truncate text-xs font-bold text-on-surface-variant">{{ person.role }}</p>
        </div>
        <button class="rounded-full bg-surface-container-lowest px-3 py-1.5 text-xs font-black text-primary hover:bg-tertiary-fixed">
          {{ $t('home.follow') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  suggestions: {
    type: Array,
    required: true,
  },
})
</script>
