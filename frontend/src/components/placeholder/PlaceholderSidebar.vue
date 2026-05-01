<template>
  <aside
      :class="[
      showLabels ? 'lg:w-[13rem]' : 'lg:w-[5.5rem]',
      'fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#1b1c1e] px-3 py-2 text-white transition-all duration-300 lg:static lg:flex lg:min-h-screen lg:shrink-0 lg:flex-col lg:border-r lg:border-t-0 lg:px-4 lg:py-5'
    ]"
  >
    <RouterLink to="/dashboard" class="mb-4 hidden justify-center lg:flex">
      <span class="grid h-8 w-8 place-items-center rounded-lg bg-[#a8c0ff] text-sm font-black text-[#25386b]">FS</span>
    </RouterLink>

    <button
        class="mb-5 hidden items-center justify-center gap-2 rounded-full bg-white/10 px-2.5 py-2 text-xs font-black text-white transition hover:bg-white/16 lg:flex"
        type="button"
        @click="$emit('toggle-labels')"
    >
      <span class="grid h-6 w-6 place-items-center rounded-full bg-[#2a2b2e] text-[0.65rem]">
        {{ showLabels ? '↤' : '↦' }}
      </span>
      <span v-if="showLabels" class="whitespace-nowrap">Hide labels</span>
    </button>

    <nav class="flex items-center justify-between gap-1 lg:flex-col lg:items-stretch lg:justify-start lg:gap-1.5">
      <button
          v-for="item in items"
          :key="item.label"
          :class="[
          item.active ? 'lg:rounded-full' : 'hover:bg-white/8 lg:rounded-full',
          showLabels ? 'lg:justify-start lg:gap-3 lg:px-2.5' : 'lg:justify-center lg:gap-0 lg:px-0',
          'group relative flex items-center justify-center gap-4 rounded-2xl px-2 py-2 text-left transition-colors lg:py-1.5'
        ]"
      >
        <span :class="[item.bg, 'grid h-12 w-12 shrink-0 place-items-center rounded-full lg:h-10 lg:w-10']">
          <component :is="item.icon" :class="[item.color, 'h-7 w-7 lg:h-5 lg:w-5']"/>
        </span>
        <SidebarLabel :show-labels="showLabels">{{ item.label }}</SidebarLabel>
      </button>
    </nav>

    <div class="mt-auto hidden border-t border-white/10 pt-4 lg:block">
      <button
          :class="[
          showLabels ? 'justify-start gap-3 px-2.5' : 'justify-center gap-0 px-0',
          'group relative flex w-full items-center rounded-full py-1.5 text-left transition-colors hover:bg-white/8'
        ]"
          type="button"
      >
        <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f5df7e]">
          <Cog6ToothIcon class="h-5 w-5 text-[#745b00]"/>
        </span>
        <SidebarLabel :show-labels="showLabels" desktop-only>Settings</SidebarLabel>
      </button>
    </div>

    <div class="relative mt-3 hidden lg:block">
      <button
          :class="[
          showLabels ? 'justify-start gap-3 px-2.5' : 'justify-center gap-0 px-0',
          'group flex w-full items-center rounded-full py-1.5 text-left transition-colors hover:bg-white/8'
        ]"
          type="button"
          :aria-pressed="appliedTheme === 'dark'"
          @click="$emit('toggle-theme')"
      >
        <span
            :class="[
            appliedTheme === 'dark' ? 'bg-[#fff3a3]' : 'bg-[#1f2f52]',
            'grid h-10 w-10 shrink-0 place-items-center rounded-2xl transition-colors'
          ]"
        >
          <component
              :is="appliedTheme === 'dark' ? SunIcon : MoonIcon"
              :class="[
              appliedTheme === 'dark' ? 'text-[#7a5b00]' : 'text-[#a8c0ff]',
              'h-5 w-5 transition-colors'
            ]"
          />
        </span>
        <SidebarLabel :show-labels="showLabels" desktop-only>
          {{ appliedTheme === 'dark' ? 'Light mode' : 'Dark mode' }}
        </SidebarLabel>
      </button>
    </div>
  </aside>
</template>

<script setup>
import {RouterLink} from 'vue-router'
import {Cog6ToothIcon, MoonIcon, SunIcon} from '@heroicons/vue/24/outline'
import SidebarLabel from './SidebarLabel.vue'

defineProps({
  items: {
    type: Array,
    required: true,
  },
  showLabels: {
    type: Boolean,
    required: true,
  },
  appliedTheme: {
    type: String,
    required: true,
  },
})

defineEmits(['toggle-labels', 'toggle-theme'])
</script>
