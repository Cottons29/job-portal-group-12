<template>
  <div class="rounded-[1.25rem] bg-surface-container-lowest p-5">
    <div class="flex items-center gap-4">
      <div class="relative shrink-0">
        <img
          v-if="avatar"
          :src="avatar"
          class="h-12 w-12 rounded-full object-cover"
          alt="User avatar"
        />
        <div 
          v-else 
          class="grid h-12 w-12 place-items-center rounded-full bg-[#d7b7ff] text-sm font-black text-[#6a39b8]"
        >
          {{ initials }}
        </div>
      </div>
      <button 
        @click="$emit('click-composer')"
        class="flex-1 rounded-full bg-surface-container-low px-5 py-3 text-left text-sm font-bold text-on-surface-variant transition hover:bg-surface-container"
      >
        {{ $t('home.sharePlaceholder') }}
      </button>
    </div>
    <div class="mt-4 grid gap-3 sm:grid-cols-3">
      <button
        v-for="action in actions"
        :key="action.label"
        @click="$emit('click-composer', action.label)"
        class="flex items-center justify-center gap-2 rounded-full bg-surface-container-low px-4 py-2.5 text-sm font-black text-on-surface transition hover:bg-tertiary-fixed cursor-pointer"
      >
        <component :is="action.icon" :class="['h-5 w-5', action.color]" />
        {{ action.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  actions: {
    type: Array,
    required: true,
  },
  avatar: {
    type: String,
    default: null
  },
  initials: {
    type: String,
    default: 'ST'
  }
})

defineEmits(['click-composer'])
</script>
