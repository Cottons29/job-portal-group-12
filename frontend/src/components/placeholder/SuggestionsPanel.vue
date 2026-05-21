<template>
  <section class="rounded-[1.5rem] bg-surface-container-low p-5 shadow-sm ring-1 ring-white/5">
    <h2 class="font-display text-2xl font-black tracking-tight text-on-surface">{{ $t('home.suggestedForYou') }}</h2>
    <div class="mt-5 space-y-4">
      <div v-for="person in suggestions" :key="person.id" class="flex items-center gap-3">
        <div :class="[person.bg, person.text, 'grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full text-sm font-black']">
          <img v-if="person.avatar" :src="resolveUrl(person.avatar)" class="h-full w-full object-cover" alt="Avatar" />
          <span v-else>{{ person.name.charAt(0).toUpperCase() }}</span>
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-black text-on-surface hover:underline cursor-pointer">{{ person.name }}</p>
          <p class="truncate text-xs font-bold text-on-surface-variant">{{ person.role }}</p>
        </div>
        <button 
          @click="$emit('connect', person.id)"
          class="rounded-full bg-surface-container-lowest px-4 py-1.5 text-xs font-black text-primary hover:bg-surface-container-high transition cursor-pointer"
        >
          Connect
        </button>
      </div>
      <p v-if="!suggestions.length" class="text-center text-xs font-bold text-on-surface-variant/60 py-2">
        No new suggestions available
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { resolveUrl } from '@/lib/api'

export interface Suggestion {
  id: string
  name: string
  role: string
  avatar?: string
  bg: string
  text: string
}

defineProps<{
  suggestions: Suggestion[]
}>()

defineEmits<{
  (e: 'connect', id: string): void
}>()
</script>
