<script setup lang="ts">
import { useRouter } from 'vue-router'

export type Action = {
  label: string,
  icon: any,
  color: string,
  to: string,
}

const props = defineProps<{
  actions: Action[],
  imageUrl?: string,
  initials?: string,
}>()

const router = useRouter()

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="rounded-[1.25rem] bg-surface-container-lowest p-5 ring-1 ring-white/5 shadow-sm">
    <div class="flex items-center gap-4">
      <div 
        class="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-[#d7b7ff] text-sm font-black text-[#6a39b8] cursor-pointer hover:opacity-90 transition"
        @click="navigateTo('/profile')"
      >
        <img v-if="imageUrl" :src="imageUrl" alt="User avatar" class="h-full w-full object-cover">
        <span v-else>{{ initials || 'ME' }}</span>
      </div>
      <button 
        @click="navigateTo('/create')"
        class="flex-1 rounded-full bg-surface-container px-5 py-3 text-left text-sm font-bold text-on-surface-variant transition hover:bg-surface-container-high cursor-pointer"
      >
        {{ $t('home.sharePlaceholder') }}
      </button>
    </div>
    <div class="mt-4 grid gap-3 sm:grid-cols-3">
      <button
          v-for="action in actions"
          :key="action.label"
          @click="navigateTo(action.to)"
          class="flex items-center justify-center gap-2 rounded-full bg-surface-container-low px-4 py-2.5 text-sm font-black text-on-surface transition hover:bg-surface-container-high cursor-pointer"
      >
        <component :is="action.icon" :class="['h-5 w-5', action.color]" />
        {{ action.label }}
      </button>
    </div>
  </div>
</template>
