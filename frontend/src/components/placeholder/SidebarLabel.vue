<template>
  <span
    :class="[
      showLabels
        ? 'lg:static lg:ml-0 lg:block lg:bg-transparent lg:px-0 lg:py-0 lg:opacity-100 lg:shadow-none'
        : 'lg:absolute lg:left-full lg:ml-3 lg:block lg:opacity-0 lg:shadow-xl lg:group-hover:opacity-100',
      desktopOnly ? 'block' : 'hidden',
      'whitespace-nowrap rounded-full bg-[#2a2b2e] px-3 py-2 text-sm font-extrabold leading-tight tracking-[-0.03em] text-[#f3f4f6] transition-opacity'
    ]"
  >
    <slot />
  </span>
</template>

<script setup>
defineProps({
  showLabels: {
    type: Boolean,
    required: true,
  },
  desktopOnly: {
    type: Boolean,
    default: false,
  },
})
</script>
