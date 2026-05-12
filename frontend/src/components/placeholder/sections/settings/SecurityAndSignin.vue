<script setup lang="ts">
defineProps<{
  securityRows: any[]
  passkeyLoading: boolean
  passkeyMessage?: string
  passkeyError?: string
  passwordError?: string
  passwordMessage?: string
}>()
</script>

<template>
  <section class="mx-auto min-w-39/40 max-w-2xl">
    <h2 class="mb-4 text-center font-display text-xl font-black tracking-[-0.04em] text-on-surface sm:text-2xl">
      {{ $t('settings.securitySignIn') }}
    </h2>

    <div class="overflow-hidden rounded-[1.25rem] bg-surface-container-low ring-1 ring-white/5">
      <article
          v-for="(row, index) in securityRows"
          :key="row.label"
          :class="[
              index === 0 ? 'rounded-t-[1.25rem]' : '',
              index === securityRows.length - 1 ? 'rounded-b-[1.25rem]' : '',
              'flex cursor-pointer items-center gap-3 border-b border-surface last:border-b-0 bg-surface-container-low px-3 py-3 transition hover:bg-surface-container-high sm:px-4'
          ]"
          role="button"
          tabindex="0"
          @click="row.action"
          @keydown.enter.prevent="row.action"
          @keydown.space.prevent="row.action"
      >
        <component :is="row.icon" class="h-4 w-4 shrink-0 text-on-surface-variant"/>
        <div class="min-w-0 flex-1">
          <h3 class="text-base font-black tracking-[-0.03em] text-on-surface">{{ row.label }}</h3>
          <p
              v-for="value in row.values"
              :key="value"
              class="mt-0.5 text-xs font-bold text-on-surface-variant"
          >
            {{ value }}
          </p>
        </div>
        <button
            v-if="row.buttonLabel"
            class="rounded-full bg-primary px-4 py-2 text-xs font-black text-on-primary transition hover:opacity-90 disabled:opacity-60"
            :disabled="passkeyLoading"
            type="button"
            @click.stop="row.action"
        >
          {{ row.buttonLabel }}
        </button>
        <span v-else class="text-lg font-black text-on-surface-variant/70">›</span>
      </article>
    </div>

    <div class="mt-3 space-y-2">
      <p v-if="passkeyMessage" class="rounded-2xl bg-[#8fd99b]/10 px-4 py-3 text-xs font-bold text-[#8fd99b]">
        {{ passkeyMessage }}</p>
      <p v-if="passkeyError" class="rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
        {{ passkeyError }}</p>
      <p v-if="passwordError" class="rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
        {{ passwordError }}</p>
      <p v-if="passwordMessage" class="rounded-2xl bg-[#8fd99b]/10 px-4 py-3 text-xs font-bold text-[#8fd99b]">
        {{ passwordMessage }}</p>
    </div>
  </section>
</template>

<style scoped>

</style>