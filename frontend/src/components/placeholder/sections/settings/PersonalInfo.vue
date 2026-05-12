<script setup lang="ts">
defineProps<{
  profileLoadError?: string
  personalInfoRows: any[]
}>()

defineEmits<{
  (e: 'openPersonalInfoEditor', row: any): void
}>()
</script>

<template>
  <section class="mx-auto min-w-39/40 max-w-2xl">
    <h2 class="mb-4 text-center font-display text-xl font-black tracking-[-0.04em] text-on-surface sm:text-2xl">
      {{ $t('settings.personalInfo') }}
    </h2>

    <p v-if="profileLoadError" class="mb-3 rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
      {{ profileLoadError }}
    </p>

    <div class="overflow-hidden rounded-[1.25rem] bg-surface-container-low ring-1 ring-white/5">
      <article
          v-for="(row, index) in personalInfoRows"
          :key="row.label"
          :class="[
              index === 0 ? 'rounded-t-[1.25rem]' : '',
              index === personalInfoRows.length - 1 ? 'rounded-b-[1.25rem]' : '',
              'flex cursor-pointer items-center gap-3 border-b border-surface last:border-b-0 bg-surface-container-low px-3 py-3 transition hover:bg-surface-container-high sm:px-4'
          ]"
          role="button"
          tabindex="0"
          @click="$emit('openPersonalInfoEditor', row)"
          @keydown.enter.prevent="$emit('openPersonalInfoEditor', row)"
          @keydown.space.prevent="$emit('openPersonalInfoEditor', row)"
      >
        <component :is="row.icon" class="h-4 w-4 shrink-0 text-on-surface-variant"/>
        <div class="min-w-0 flex-1">
          <h3 class="text-base font-black tracking-[-0.03em] text-on-surface">{{ row.label }}</h3>
          <p
              v-for="value in row.values"
              :key="value"
              class="mt-0.5 truncate text-xs font-bold text-on-surface-variant"
          >
            {{ value }}
          </p>
        </div>
        <img
            v-if="row.avatar"
            :alt="row.label"
            class="h-10 w-10 rounded-full object-cover ring-2 ring-surface-container-low"
            :src="row.avatar"
        />
        <span class="text-lg font-black text-on-surface-variant/70">›</span>
      </article>
    </div>
  </section>
</template>

<style scoped>

</style>