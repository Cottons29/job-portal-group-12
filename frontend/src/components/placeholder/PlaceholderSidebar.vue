<script setup>
import {ref, watch} from 'vue'
import {RouterLink} from 'vue-router'
import {Cog6ToothIcon, MoonIcon, SunIcon} from '@heroicons/vue/24/outline'
import SidebarLabel from './SidebarLabel.vue'
import {Bars3Icon} from "@heroicons/vue/24/outline"

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
      'fixed bottom-0 left-0 right-0 z-40 border-t border-outline-variant/50 bg-(--sidebar-bg) px-3 py-2 text-on-surface transition-all duration-300 ease-in-out lg:static lg:flex lg:min-h-screen lg:shrink-0 lg:flex-col lg:border-r lg:border-t-0 lg:px-4 lg:py-5'
    ]"
  >
    <RouterLink to="/home" class="mb-4 hidden justify-center lg:flex">
      <span class="grid h-8 w-8 place-items-center rounded-lg bg-[#a8c0ff] text-sm font-black text-[#25386b]">FS</span>
<!--      <span v-if="labelsVisible" class="whitespace-nowrap">FirstStep</span>-->
    </RouterLink>

    <button
        class="mb-5 hidden items-center justify-center gap-2 rounded-full bg-(--toggle-sidebar-bg) px-2.5 py-2 text-xs font-black text-on-surface transition hover:bg-(--toggle-sidebar-bg-hover) lg:flex"
        type="button"
        @click="$emit('toggle-labels')"
    >
      <Bars3Icon :class="'h-7 w-7 transition-all duration-300 scale-80'"/>
      <span v-if="labelsVisible" class="whitespace-nowrap">{{ $t('sidebar.hideLabels') }}</span>
    </button>

    <nav class="flex items-center justify-between gap-1 lg:flex-col lg:items-stretch lg:justify-start lg:gap-1.5">
      <component
          :is="item.to ? RouterLink : 'button'"
          v-for="item in items"
          :key="item.label"
          :to="item.to"
          :type="item.to ? undefined : 'button'"
          :class="[
          item.active ? 'lg:rounded-full' : 'hover:bg-surface-container-high lg:rounded-full',
          'lg:justify-start lg:gap-3 lg:px-2.5',
          'group relative flex items-center justify-center gap-4 rounded-2xl px-2 py-2 text-left transition-colors lg:py-1.5'
        ]"
      >
        <span
            :class="[
            item.active ? [item.bg, item.color, 'active-sidebar-shape '] : [item.bg, 'rounded-full border-2 border-transparent'],
            'grid h-12 w-12 shrink-0 place-items-center  lg:h-10 lg:w-10'
          ]"
        >
          <component :is="item.icon" :class="[item.color, 'h-7 w-7 transition-all duration-300 lg:h-5 lg:w-5']"/>
        </span>
        <SidebarLabel :show-labels="labelsVisible">{{ item.label }}</SidebarLabel>
      </component>
    </nav>

    <div class="mt-auto hidden border-t border-outline-variant/50 pt-4 lg:block">
      <RouterLink
          :class="[
           'justify-start gap-3 px-2.5',
          'group relative flex w-full items-center rounded-full py-1.5 text-left transition-colors hover:bg-surface-container-high'
        ]"
          to="/settings"
      >
        <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f5df7e]">
          <Cog6ToothIcon class="h-5 w-5 text-[#745b00]"/>
        </span>
        <SidebarLabel :show-labels="labelsVisible" desktop-only>{{ $t('sidebar.settings') }}</SidebarLabel>
      </RouterLink>
    </div>

    <div class="relative mt-3 hidden lg:block">
      <button
          :class="[
           'justify-start gap-3 px-2.5',
          'group flex w-full items-center rounded-full py-1.5 text-left transition-colors hover:bg-surface-container-high'
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
          {{ appliedTheme === 'dark' ? $t('sidebar.lightMode') : $t('sidebar.darkMode') }}
        </SidebarLabel>
      </button>

    </div>
  </aside>
</template>

<style scoped>
.active-sidebar-shape {
  transition: all 0.2s ease-in-out;
  aspect-ratio: 1;
  scale: 1.1;
  --g: /21.98% 21.98% radial-gradient(#000 calc(71% - 1px), #0000 71%) no-repeat;
  mask: 100% 50% var(--g), 92.063% 77.032% var(--g), 70.771% 95.482% var(--g), 42.884% 99.491% var(--g), 17.257% 87.787% var(--g), 2.025% 64.087% var(--g), 2.025% 35.913% var(--g), 17.257% 12.213% var(--g), 42.884% 0.509% var(--g), 70.771% 4.518% var(--g), 92.063% 22.968% var(--g), radial-gradient(100% 100%, #000 37.43%, #0000 calc(37.43% + 1px));
}
</style>
