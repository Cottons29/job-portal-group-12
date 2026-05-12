<script setup lang="ts">
import { CheckCircleIcon, LanguageIcon } from '@heroicons/vue/24/outline'

defineProps<{
  languageOptions: any[]
  currentLocale: string
}>()

defineEmits<{
  (e: 'update:locale', value: string): void
}>()
</script>

<template>
  <section class="mx-auto min-w-39/40 max-w-2xl">
    <h2 class="mb-2 text-center font-display text-xl font-black tracking-[-0.04em] text-on-surface sm:text-2xl">
      {{ $t('settings.languageTitle') }}
    </h2>
    <p class="mx-auto mb-4 max-w-md text-center text-sm font-bold leading-6 text-on-surface-variant">
      {{ $t('settings.languageDescription') }}
    </p>

    <div class="overflow-hidden rounded-[1.25rem] bg-surface-container-low ring-1 ring-white/5">
      <label
          v-for="(option, index) in languageOptions"
          :key="option.value"
          :class="[
              index === 0 ? 'rounded-t-[1.25rem]' : '',
              index === languageOptions.length - 1 ? 'rounded-b-[1.25rem]' : '',
              currentLocale === option.value ? 'bg-surface-container-high' : 'bg-surface-container-low hover:bg-surface-container-high',
              'flex cursor-pointer items-center gap-3 border-b border-surface px-3 py-3 transition last:border-b-0 sm:px-4'
          ]"
      >
        <input
            :checked="currentLocale === option.value"
            :value="option.value"
            class="sr-only"
            name="app-language"
            type="radio"
            @change="$emit('update:locale', option.value)"
        />
        <span class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#f5df7e]">
          <LanguageIcon class="h-5 w-5 text-[#745b00]"/>
        </span>
        <span class="min-w-0 flex-1">
          <span class="block text-base font-black tracking-[-0.03em] text-on-surface">{{ option.nativeName }}</span>
          <span class="mt-0.5 block text-xs font-bold text-on-surface-variant">
            {{ option.description }}
          </span>
        </span>
        <span
            :class="[
                currentLocale === option.value ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant text-transparent',
                'grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors'
            ]"
            aria-hidden="true"
        >
          <CheckCircleIcon class="h-4 w-4"/>
        </span>
      </label>
    </div>

    <p class="mt-3 rounded-2xl bg-surface-container-low px-4 py-3 text-xs font-bold text-on-surface-variant">
      {{ $t('settings.currentLanguage') }}: {{ languageOptions.find((option) => option.value === currentLocale)?.nativeName }}
    </p>
  </section>
</template>

<style scoped>

</style>