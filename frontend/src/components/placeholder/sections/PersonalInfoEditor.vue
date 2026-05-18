<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  editingField: {
    type: Object,
    required: true
  },
  editValue: {
    type: String,
    required: true
  },
  profileSaveError: {
    type: String,
    default: ''
  },
  isSavingProfile: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:editValue', 'close', 'save'])
</script>

<template>
  <div
      class="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-6 backdrop-blur-sm"
      @click.self="$emit('close')"
  >
    <form
        class="w-full max-w-md rounded-[1.5rem] bg-surface-container-low p-5 shadow-2xl ring-1 ring-white/10"
        @submit.prevent="$emit('save')"
    >
      <div class="mb-5 flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">{{ t('settings.personal.editTitle') }}</p>
          <h2 class="mt-1 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">
            {{ editingField.label }}
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

      <label class="space-y-2">
        <span class="text-sm font-black text-on-surface">{{ t('settings.personal.enterField', { field: editingField.label }) }}</span>
        <input
            :value="editValue"
            @input="$emit('update:editValue', $event.target.value)"
            :placeholder="editingField.placeholder"
            :type="editingField.inputType"
            class="w-full mt-4 rounded-2xl bg-surface px-4 py-3 text-sm font-bold text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
        />
      </label>

      <p v-if="profileSaveError" class="mt-3 text-xs font-bold text-red-300">{{ profileSaveError }}</p>

      <div class="mt-6 flex justify-end gap-3">
        <button
            class="rounded-full px-5 py-3 text-sm font-black text-on-surface-variant transition hover:bg-surface"
            type="button"
            @click="$emit('close')"
        >
          {{ t('settings.personal.cancel') }}
        </button>
        <button
            class="rounded-full bg-primary px-5 py-3 text-sm font-black text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isSavingProfile"
            type="submit"
        >
          {{ isSavingProfile ? t('settings.personal.saving') : t('settings.personal.save') }}
        </button>
      </div>
    </form>
  </div>
</template>
