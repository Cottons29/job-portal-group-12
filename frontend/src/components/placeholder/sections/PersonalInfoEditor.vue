<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CameraIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import api from '@/lib/api'

const { t } = useI18n()
const auth = useAuthStore()

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

const emit = defineEmits(['update:editValue', 'close', 'save'])

const isUploading = ref(false)
const uploadError = ref('')
const fileInput = ref(null)

async function handleFileSelect(event) {
  const file = event.target.files?.[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Please select a valid image file.'
    return
  }

  // Validate file size (Max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = 'File is too large. Max 5MB allowed.'
    return
  }

  isUploading.value = true
  uploadError.value = ''

  try {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post('/upload/single', formData)
    const url = data.file?.url || data.file?.streamUrl || ''
    if (url) {
      emit('update:editValue', url)
    } else {
      throw new Error('Upload succeeded, but no URL was returned.')
    }
  } catch (err) {
    console.error('Profile image upload error:', err)
    uploadError.value = 'Failed to upload profile picture. Please try again.'
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div
      class="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-6 backdrop-blur-sm"
      @click.self="$emit('close')"
  >
    <form
        class="w-full max-w-md rounded-[2rem] bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 transition-colors duration-200"
        @submit.prevent="$emit('save')"
    >
      <!-- Header -->
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-500">{{ t('settings.personal.editTitle') }}</p>
          <h2 class="mt-1 font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {{ editingField.label }}
          </h2>
        </div>
        <button
            class="grid h-9 w-9 place-items-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xl font-bold text-slate-500 dark:text-slate-400 transition cursor-pointer"
            type="button"
            @click="$emit('close')"
        >
          ×
        </button>
      </div>

      <!-- Profile Picture Upload Flow -->
      <div v-if="editingField.field === 'avatar'" class="flex flex-col items-center justify-center py-6">
        <!-- Hidden File Input -->
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileSelect"
        />

        <!-- Avatar Circle Container -->
        <div 
          class="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 dark:border-zinc-800 shadow-md group cursor-pointer bg-slate-50 dark:bg-zinc-950 flex items-center justify-center transition-all duration-300 hover:scale-105"
          @click="!isUploading && fileInput.click()"
        >
          <!-- Current Image / Preview -->
          <img 
            v-if="editValue" 
            :src="editValue" 
            alt="Profile Preview" 
            class="w-full h-full object-cover transition-opacity duration-300"
            :class="{ 'opacity-40': isUploading }"
          />
          <div v-else class="w-full h-full bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-extrabold text-3xl">
            {{ auth.user?.name?.charAt(0)?.toUpperCase() || 'FS' }}
          </div>

          <!-- Hover / Upload Overlay -->
          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-300 text-white select-none">
            <CameraIcon class="w-6 h-6 stroke-2" />
            <span class="text-[10px] font-black uppercase tracking-wider">Change</span>
          </div>

          <!-- Loading Spinner Overlay -->
          <div v-if="isUploading" class="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
            <ArrowPathIcon class="w-8 h-8 animate-spin" />
          </div>
        </div>

        <!-- Helpful instructions & error display -->
        <div class="mt-4 text-center">
          <button 
            type="button" 
            class="text-sm font-extrabold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            @click="fileInput.click()"
            :disabled="isUploading"
          >
            Upload Photo
          </button>
          <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Supports PNG, JPG or WebP. Max 5MB.
          </p>
          <p v-if="uploadError" class="mt-2 text-xs font-bold text-red-500 dark:text-red-400">
            {{ uploadError }}
          </p>
        </div>
      </div>

      <!-- Default Text Input for other fields -->
      <label v-else class="space-y-2 block">
        <span class="text-sm font-black text-slate-700 dark:text-slate-300">{{ t('settings.personal.enterField', { field: editingField.label }) }}</span>
        <input
            :value="editValue"
            @input="$emit('update:editValue', $event.target.value)"
            :placeholder="editingField.placeholder"
            :type="editingField.inputType"
            class="w-full mt-2 rounded-2xl bg-slate-50 dark:bg-zinc-950 px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-zinc-800 transition placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
        />
      </label>

      <!-- API Save Error -->
      <p v-if="profileSaveError" class="mt-4 text-xs font-bold text-red-500 dark:text-red-400">{{ profileSaveError }}</p>

      <!-- Footer Actions -->
      <div class="mt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-zinc-800/80 pt-4">
        <button
            class="rounded-full px-5 py-3 text-sm font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition cursor-pointer"
            type="button"
            @click="$emit('close')"
        >
          {{ t('settings.personal.cancel') }}
        </button>
        <button
            class="rounded-full bg-blue-600 dark:bg-blue-500 px-5 py-3 text-sm font-black text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isSavingProfile || isUploading"
            type="submit"
        >
          {{ isSavingProfile ? t('settings.personal.saving') : t('settings.personal.save') }}
        </button>
      </div>
    </form>
  </div>
</template>
