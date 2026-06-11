<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { 
  XMarkIcon, 
  BellIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ExclamationCircleIcon 
} from '@heroicons/vue/24/outline'

const { toasts, remove } = useToast()

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return CheckCircleIcon
    case 'warning': return ExclamationTriangleIcon
    case 'error': return ExclamationCircleIcon
    default: return BellIcon
  }
}

const getTypeClasses = (type: string) => {
  switch (type) {
    case 'success': return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
    case 'warning': return 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300'
    case 'error': return 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-300'
    default: return 'border-primary/20 bg-primary/10 text-primary dark:text-primary-container'
  }
}
</script>

<template>
  <div class="fixed top-5 right-5 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
    <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur-xl bg-surface-container-lowest/80 transition-all duration-300',
          getTypeClasses(toast.type)
        ]"
      >
        <!-- Icon -->
        <component :is="getIcon(toast.type)" class="h-5 w-5 shrink-0 mt-0.5" />
        
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h4 class="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/80">{{ toast.title }}</h4>
          <p class="mt-0.5 text-xs font-bold leading-relaxed text-on-surface">{{ toast.message }}</p>
        </div>

        <!-- Close Button -->
        <button
          @click="remove(toast.id)"
          class="shrink-0 p-0.5 rounded-full hover:bg-on-surface/5 transition text-on-surface-variant hover:text-on-surface"
        >
          <XMarkIcon class="h-4 w-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
}
</style>
