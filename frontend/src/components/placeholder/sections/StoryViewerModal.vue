<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import BaseModal from './BaseModal.vue'
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import { resolveUrl } from '@/lib/api'

const props = defineProps({
  storyGroup: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const currentIndex = ref(0)
const progress = ref(0)
const DURATION = 5000 // 5 seconds per story
let timer = null

function nextStory() {
  if (currentIndex.value < props.storyGroup.stories.length - 1) {
    currentIndex.value++
    progress.value = 0
  } else {
    emit('close')
  }
}

function prevStory() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    progress.value = 0
  }
}

function startTimer() {
  if (timer) clearInterval(timer)
  const interval = 100
  const step = 100 / (DURATION / interval)
  timer = setInterval(() => {
    progress.value += step
    if (progress.value >= 100) {
      nextStory()
    }
  }, interval)
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <BaseModal close-label="Close story viewer" @close="$emit('close')" max-width="max-w-lg" hide-close-button>
    <div class="relative overflow-hidden rounded-3xl aspect-[9/16]">
      <!-- Header -->
      <div class="absolute top-4 left-4 right-4 z-20 flex items-center gap-3">
        <div class="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/50 bg-surface-container-low">
          <img v-if="storyGroup.avatar" :src="resolveUrl(storyGroup.avatar)" class="h-full w-full object-cover"  alt=""/>
          <div v-else class="grid h-full w-full place-items-center bg-primary text-sm font-black text-white">
            {{ storyGroup.name?.charAt(0).toUpperCase() }}
          </div>
        </div>
        <div>
          <p class="text-sm font-black text-white shadow-sm">{{ storyGroup.name }}</p>
          <p class="text-[10px] font-bold text-white/70">
            {{ new Date(storyGroup.stories[currentIndex].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
          </p>
        </div>
        <button @click="$emit('close')" class="ml-auto grid h-8 w-8 place-items-center rounded-full bg-black/20 text-white backdrop-blur-md transition hover:bg-black/40">
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>

      <!-- Story Content -->
      <div class="h-full w-full flex items-center justify-center">
        <img
          v-if="storyGroup.stories[currentIndex].type === 'photo'"
          :src="resolveUrl(storyGroup.stories[currentIndex].mediaUrl)"
          class="h-full w-full object-cover"
        />
        <div
          v-else
          class="h-full w-full flex items-center justify-center p-12 text-center text-2xl font-black text-white"
          :style="{ backgroundColor: storyGroup.stories[currentIndex].bgColor || '#6366f1' }"
        >
          {{ storyGroup.stories[currentIndex].text }}
        </div>
      </div>

      <!-- Progress Bars -->
      <div class="absolute bottom-4 left-4 right-4 z-20 flex gap-1">
        <div
            v-for="(story, idx) in storyGroup.stories"
            :key="story.id"
            class="h-1 flex-1 rounded-full bg-white/20 overflow-hidden"
        >
          <div
              v-if="idx === currentIndex"
              class="h-full bg-white transition-all duration-100 ease-linear"
              :style="{ width: `${progress}%` }"
          ></div>
          <div
              v-else-if="idx < currentIndex"
              class="h-full bg-white"
          ></div>
        </div>
      </div>

      <!-- Navigation Overlays -->
      <div class="absolute inset-0 z-10 flex">
        <div class="h-full w-1/2 cursor-pointer" @click="prevStory"></div>
        <div class="h-full w-1/2 cursor-pointer" @click="nextStory"></div>
      </div>

      <!-- Navigation Arrows -->
      <button
        v-if="currentIndex > 0"
        @click.stop="prevStory"
        class="absolute left-4 top-1/2 z-20 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/20 text-white backdrop-blur-md transition hover:bg-black/40"
      >
        <ChevronLeftIcon class="h-6 w-6" />
      </button>
      <button
        v-if="currentIndex < storyGroup.stories.length - 1"
        @click.stop="nextStory"
        class="absolute right-4 top-1/2 z-20 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/20 text-white backdrop-blur-md transition hover:bg-black/40"
      >
        <ChevronRightIcon class="h-6 w-6" />
      </button>
    </div>
  </BaseModal>
</template>


<style>
.max-width-modal {
  max-width: 90vw;
}
</style>