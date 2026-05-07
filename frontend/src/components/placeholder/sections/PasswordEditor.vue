<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  passwordForm: {
    type: Object,
    required: true
  },
  passwordError: {
    type: String,
    default: ''
  },
  passwordLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'submit'])
</script>

<template>
  <div
      class="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-6 backdrop-blur-sm"
      @click.self="$emit('close')"
  >
    <form
        class="w-full max-w-md rounded-[1.5rem] bg-surface-container-low p-5 shadow-2xl ring-1 ring-white/10"
        @submit.prevent="$emit('submit')"
    >
      <div class="mb-5 flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">{{ t('settings.security.editTitle') }}</p>
          <h2 class="mt-1 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">
            {{ t('settings.security.password') }}
          </h2>
        </div>
        <button
            class="grid h-9 w-9 place-items-center rounded-full bg-surface text-xl font-black text-on-surface-variant transition hover:text-on-surface"
            type="button"
            @click="$emit('close')"
        >
          ×
        </button>
      </div>

      <div class="space-y-4">
        <label class="space-y-2">
          <span class="text-sm font-black text-on-surface">{{ t('settings.security.currentPassword') }}</span>
          <input
              v-model="passwordForm.current"
              class="mt-3 mb-3 w-full rounded-2xl bg-surface px-4 py-3 text-sm font-bold text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
              :placeholder="t('settings.security.currentPasswordPlaceholder')"
              type="password"
          />
        </label>

        <label class="space-y-2">
          <span class="text-sm font-black text-on-surface">{{ t('settings.security.newPassword') }}</span>
          <input
              v-model="passwordForm.next"
              class="mt-3 mb-3 w-full rounded-2xl bg-surface px-4 py-3 text-sm font-bold text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
              :placeholder="t('settings.security.newPasswordPlaceholder')"
              type="password"
          />
        </label>

        <label class="space-y-2">
          <span class="mt-3 mb-3 text-sm font-black text-on-surface">{{ t('settings.security.confirmPassword') }}</span>
          <input
              v-model="passwordForm.confirm"
              class="w-full mt-4 rounded-2xl bg-surface px-4 py-3 text-sm font-bold text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
              :placeholder="t('settings.security.confirmPasswordPlaceholder')"
              type="password"
          />
        </label>
      </div>

      <p v-if="passwordError" class="mt-3 text-xs font-bold text-red-300">{{ passwordError }}</p>
      <p class="mt-3 text-xs font-bold text-on-surface-variant">
        {{ t('settings.security.passwordRecommendation') }}
      </p>

      <div class="mt-6 flex justify-end gap-3">
        <button
            class="rounded-full px-5 py-3 text-sm font-black text-on-surface-variant transition hover:bg-surface"
            type="button"
            @click="$emit('close')"
        >
          {{ t('settings.security.cancel') }}
        </button>
        <button
            class="rounded-full bg-primary px-5 py-3 text-sm font-black text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="passwordLoading"
            type="submit"
        >
          {{ passwordLoading ? t('settings.security.updating') : t('settings.security.save') }}
        </button>
      </div>
    </form>
  </div>
</template>
