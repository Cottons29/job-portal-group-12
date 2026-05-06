<template>
  <span
    :class="[
      showLabels
        ? 'lg:static lg:ml-0 lg:block lg:bg-transparent lg:px-0 lg:py-0 lg:opacity-100 lg:shadow-none'
        : 'lg:invisible lg:pointer-events-none lg:absolute lg:left-[calc(50%+2rem)] lg:top-1/2 lg:block lg:translate-x-1 lg:-translate-y-1/2 lg:opacity-0 lg:shadow-xl lg:ease-out lg:group-hover:visible lg:group-hover:translate-x-0 lg:group-hover:opacity-100',
      desktopOnly ? 'block' : 'hidden',
      'whitespace-nowrap rounded-full bg-(--fs-surface-container-low) px-3 py-2 text-sm font-extrabold leading-tight tracking-[-0.03em] text-(--fs-primary)'
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
