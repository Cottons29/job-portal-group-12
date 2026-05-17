<script setup>
import { defineProps, defineEmits } from 'vue'
import { CheckCircleIcon, BellIcon, SparklesIcon } from '@heroicons/vue/24/outline'

defineProps({
  notifications: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  loadError: {
    type: String,
    default: ''
  }
})

defineEmits(['mark-read'])
</script>

<template>
  <section class=" w-full max-w-4xl px-4 py-6 md:px-6">
    <!-- Error state banner -->
    <div v-if="loadError" class="mb-6 rounded-3xl bg-error-container p-5 text-on-error-container ring-1 ring-error/20">
      <div class="flex items-center gap-3">
        <span class="grid h-8 w-8 place-items-center rounded-full bg-error text-on-error font-bold text-sm">!</span>
        <p class="text-sm font-bold">{{ loadError }}</p>
      </div>
    </div>

    <!-- Loading state indicator -->
    <div v-if="isLoading" class="flex min-h-[350px] w-full flex-col items-center ">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p class="mt-4 text-sm font-bold text-on-surface-variant">Syncing real-time feed...</p>
    </div>

    <!-- Redesigned full-bleed Material Design 3 zero-state container -->
    <div 
      v-else-if="!notifications.length" 
      class="flex min-h-[400px] w-full flex-col items-center justify-center rounded-[32px]  p-12 text-center "
    >
      <div class="relative grid h-24 w-24 place-items-center rounded-[28px] bg-secondary-container/50 text-secondary transition-transform duration-500 hover:scale-105">
        <BellIcon class="h-12 w-12 stroke-[1.5]" />
        <div class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary ring-4 ring-surface-container-lowest" />
      </div>
      <h3 class="mt-6 font-display text-xl font-bold tracking-tight text-on-surface">You are all caught up!</h3>
      <p class="mt-2 max-w-md text-sm text-on-surface-variant/80 leading-normal">
        No platform events require your attention right now. New submissions or role updates will appear instantly in this timeline.
      </p>
    </div>
    
    <!-- Redesigned elevated item card timelines utilizing MD3 surface mapping -->
    <TransitionGroup name="list-fade" tag="div" class="space-y-4" v-else>
      <article
        v-for="item in notifications"
        :key="item.id"
        :class="[
          'group relative flex flex-col justify-between gap-4 rounded-[28px] p-6 transition-all duration-300 sm:flex-row sm:items-center sm:gap-6',
          item.isRead 
            ? 'bg-surface-container-lowest/80 ring-1 ring-outline-variant/40 text-on-surface-variant' 
            : 'bg-surface-container-low shadow-sm ring-2 ring-primary/20 text-on-surface hover:bg-surface-container-low/80 hover:shadow-md'
        ]"
      >
        <div class="flex items-start gap-4 sm:gap-5">
          <!-- MD3 Dynamic Icon Frame -->
          <div 
            :class="[
              'mt-0.5 grid h-12 w-12 shrink-0 place-items-center rounded-[18px] transition-all duration-300', 
              item.isRead 
                ? 'bg-surface-container text-on-surface-variant/50' 
                : 'bg-primary-container text-on-primary-container group-hover:scale-105'
            ]"
          >
            <BellIcon class="h-6 w-6 stroke-[1.75]" />
          </div>

          <!-- Content Stack -->
          <div class="space-y-1.5">
            <div class="flex items-center gap-2">
              <span 
                v-if="!item.isRead" 
                class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-extrabold text-primary"
              >
                ● NEW
              </span>
              <span class="text-xs font-semibold text-on-surface-variant/70">
                {{ new Date(item.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) }}
              </span>
            </div>
            <p class="text-base font-medium tracking-tight leading-relaxed text-on-surface">
              {{ item.message }}
            </p>
          </div>
        </div>

        <!-- Material Design 3 Tonal Action Button -->
        <div class="flex items-center justify-end sm:shrink-0">
          <button
            v-if="!item.isRead"
            @click="$emit('mark-read', item.id)"
            class="inline-flex items-center gap-2 rounded-full bg-secondary-container px-4 py-2.5 text-xs font-bold text-on-secondary-container tracking-wide transition-all duration-200 hover:bg-primary hover:text-on-primary hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            title="Mark alert as read"
          >
            <CheckCircleIcon class="h-4 w-4 stroke-2" />
            <span>Acknowledge</span>
          </button>
          <span 
            v-else 
            class="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-on-surface-variant/40"
          >
            ✓ Read
          </span>
        </div>
      </article>
    </TransitionGroup>
  </section>
</template>

<style scoped>
/* Smooth Google Material 3 container entry/exit motion specifications */
.list-fade-enter-active,
.list-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.2, 0, 0, 1);
}
.list-fade-enter-from,
.list-fade-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(12px);
}
.list-fade-leave-active {
  position: absolute;
  width: 100%;
}
</style>
