<script setup>
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'
import { PhotoIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import { useStoryStore } from '@/stores/stories'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['close'])
const { t } = useI18n()
const storyStore = useStoryStore()

const text = ref('')
const bgColor = ref('#6366f1')
const media = ref(null)
const mediaPreview = ref(null)
const loading = ref(false)

const colors = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#22c55e', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#a855f7', // Purple
  '#06b6d4', // Cyan
]

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    media.value = file
    mediaPreview.value = URL.createObjectURL(file)
  }
}

function removeMedia() {
  media.value = null
  mediaPreview.value = null
}

async function handleSubmit() {
  if (!text.value && !media.value) return

  loading.value = true
  try {
    await storyStore.addStory({
      text: text.value,
      bgColor: bgColor.value,
      media: media.value
    })
    emit('close')
  } catch (error) {
    console.error('Failed to add story:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <BaseModal close-label="Close add story" @close="$emit('close')" max-width="max-w-lg lg:max-w-5xl">
    <div class="overflow-hidden rounded-3xl bg-surface-container-lowest shadow-2xl">
      <div class="p-6">
        <h2 class="text-xl font-black text-on-surface">{{ t('stories.addStory') }}</h2>
        <p class="mt-1 text-sm text-on-surface-variant">{{ t('stories.shareMoment') }}</p>

        <div class="mt-6 flex flex-col lg:flex-row gap-8">
          <!-- Preview Area -->
          <div class="w-full lg:w-1/2 mr-5">
            <div
              class="relative flex aspect-12/16 w-full items-center justify-center overflow-hidden rounded-2xl transition-all duration-500 shadow-inner"
              :style="{ background: mediaPreview ? '#000' : bgColor }"
            >
              <img v-if="mediaPreview" :src="mediaPreview" class="h-full w-full object-cover" />

              <textarea
                v-if="!mediaPreview"
                v-model="text"
                class="w-full bg-transparent p-8 text-center text-2xl font-black text-white placeholder-white/50 focus:outline-none resize-none"
                :placeholder="t('stories.startTyping')"
                rows="5"
              ></textarea>

              <button
                v-if="mediaPreview"
                @click="removeMedia"
                class="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70"
              >
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Controls & Actions -->
          <div class="flex flex-col flex-1">
            <div class="flex-1 space-y-6">
              <!-- Background Colors (only for text stories) -->
              <div v-if="!mediaPreview" class="space-y-4">
                <p class="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Background Color</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="color in colors"
                    :key="color"
                    @click="bgColor = color"
                    class="h-10 w-10 rounded-full border-2 transition-transform hover:scale-110"
                    :class="bgColor === color ? 'border-white ring-2 ring-primary shadow-lg' : 'border-transparent'"
                    :style="{ backgroundColor: color }"
                  ></button>
                </div>
              </div>

              <!-- Upload Button -->
              <div class="space-y-4">
                <p class="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Media</p>
                <label class="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-surface-container-low py-4 font-black text-on-surface transition hover:bg-surface-container">
                  <input type="file" class="hidden" accept="image/*" @change="handleFileUpload" />
                  <PhotoIcon class="h-6 w-6 text-primary" />
                  {{ mediaPreview ? t('stories.changePhoto') : t('stories.uploadPhoto') }}
                </label>
              </div>
            </div>

            <!-- Footer -->
            <div class="mt-8 flex gap-3">
              <button
                @click="$emit('close')"
                class="flex-1 rounded-2xl bg-surface-container-low py-4 font-black text-on-surface transition hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                @click="handleSubmit"
                :disabled="loading || (!text && !media)"
                class="flex-1 rounded-2xl bg-primary py-4 font-black text-on-primary shadow-lg transition hover:bg-primary/90 disabled:opacity-50"
              >
                {{ loading ? t('stories.posting') : t('stories.postStory') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>
