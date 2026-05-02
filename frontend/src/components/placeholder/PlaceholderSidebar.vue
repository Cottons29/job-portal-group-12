
<script setup>
import {ref, watch} from 'vue'
import {RouterLink} from 'vue-router'
import {Cog6ToothIcon, MoonIcon, SunIcon} from '@heroicons/vue/24/outline'
import SidebarLabel from './SidebarLabel.vue'
import { Bars3Icon } from "@heroicons/vue/24/outline"

const props = defineProps({
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

const labelsVisible = ref(props.showLabels)
const sidebarExpanded = ref(props.showLabels)

watch(
    () => props.showLabels,
    (showLabels) => {
      sidebarExpanded.value = showLabels
      labelsVisible.value = showLabels
    }
)
</script>


<template>
  <aside
      :class="[
      sidebarExpanded ? 'lg:w-52' : 'lg:w-22',
      'fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#1b1c1e] px-3 py-2 text-white transition-all duration-300 ease-in-out lg:static lg:flex lg:min-h-screen lg:shrink-0 lg:flex-col lg:border-r lg:border-t-0 lg:px-4 lg:py-5'
    ]"
  >
    <RouterLink to="/home" class="mb-4 hidden justify-center lg:flex">
      <span class="grid h-8 w-8 place-items-center rounded-lg bg-[#a8c0ff] text-sm font-black text-[#25386b]">FS</span>
    </RouterLink>

    <button
        class="mb-5 hidden items-center justify-center gap-2 rounded-full bg-white/10 px-2.5 py-2 text-xs font-black text-white transition hover:bg-white/16 lg:flex"
        type="button"
        @click="$emit('toggle-labels')"
    >
      <Bars3Icon :class="'h-7 w-7 transition-all duration-300 lg:h-5 lg:w-5'"/>
      <span v-if="labelsVisible" class="whitespace-nowrap">Hide labels</span>
    </button>

    <nav class="flex items-center justify-between gap-1 lg:flex-col lg:items-stretch lg:justify-start lg:gap-1.5">
      <component
          :is="item.to ? RouterLink : 'button'"
          v-for="item in items"
          :key="item.label"
          :to="item.to"
          :type="item.to ? undefined : 'button'"
          :class="[
          item.active ? 'lg:rounded-full' : 'hover:bg-white/8 lg:rounded-full',
          'lg:justify-start lg:gap-3 lg:px-2.5',
          'group relative flex items-center justify-center gap-4 rounded-2xl px-2 py-2 text-left transition-colors lg:py-1.5'
        ]"
      >
        <span
            :class="[
            item.active ? [item.bg, item.color, 'active-sidebar-shape border-2 border-current'] : [item.bg, 'rounded-full border-2 border-transparent'],
            'grid h-12 w-12 shrink-0 place-items-center transition-all duration-300 lg:h-10 lg:w-10'
          ]"
        >
          <component :is="item.icon" :class="[item.color, 'h-7 w-7 transition-all duration-300 lg:h-5 lg:w-5']"/>
        </span>
        <SidebarLabel :show-labels="labelsVisible">{{ item.label }}</SidebarLabel>
      </component>
    </nav>

    <div class="mt-auto hidden border-t border-white/10 pt-4 lg:block">
      <RouterLink
          :class="[
           'justify-start gap-3 px-2.5',
          'group relative flex w-full items-center rounded-full py-1.5 text-left transition-colors hover:bg-white/8'
        ]"
          to="/settings"
      >
        <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f5df7e]">
          <Cog6ToothIcon class="h-5 w-5 text-[#745b00]"/>
        </span>
        <SidebarLabel :show-labels="labelsVisible" desktop-only>Settings</SidebarLabel>
      </RouterLink>
    </div>

    <div class="relative mt-3 hidden lg:block">
      <button
          :class="[
           'justify-start gap-3 px-2.5',
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
        <SidebarLabel :show-labels="labelsVisible" desktop-only>
          {{ appliedTheme === 'dark' ? 'Light mode' : 'Dark mode' }}
        </SidebarLabel>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.active-sidebar-shape {
  clip-path: polygon(
      50% 0%,
      61% 10%,
      76% 8%,
      88% 19%,
      87% 35%,
      100% 50%,
      87% 65%,
      88% 81%,
      76% 92%,
      61% 90%,
      50% 100%,
      39% 90%,
      24% 92%,
      12% 81%,
      13% 65%,
      0% 50%,
      13% 35%,
      12% 19%,
      24% 8%,
      39% 10%
  );
}
</style>
