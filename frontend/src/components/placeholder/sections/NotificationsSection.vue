<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import { isAxiosError } from 'axios'
import { CheckCircleIcon, BellIcon } from '@heroicons/vue/24/outline'

const notifications = ref([])
const isLoading = ref(false)
const loadError = ref('')

async function fetchNotifications() {
  isLoading.value = true
  loadError.value = ''
  try {
    const { data } = await api.get('/notifications')
    notifications.value = data.notifications || []
  } catch (error) {
    loadError.value = isAxiosError(error) ? error.response?.data?.message || error.message : 'Failed to load notifications.'
  } finally {
    isLoading.value = false
  }
}

async function markNotificationAsRead(id) {
  try {
    await api.post(`/notifications/${id}/read`)
    const target = notifications.value.find((n) => n.id === id)
    if (target) target.isRead = true
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
  }
}

onMounted(() => {
  fetchNotifications()
})
</script>

<template>
  <section class="max-w-3xl space-y-6">
    <div v-if="loadError" class="rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
      {{ loadError }}
    </div>

    <div v-if="isLoading" class="rounded-2xl bg-surface-container-low p-8 text-center text-sm font-bold text-on-surface-variant">
      Loading notifications...
    </div>
    <div v-else-if="!notifications.length" class="rounded-2xl bg-surface-container-low p-12 text-center">
      <BellIcon class="mx-auto h-12 w-12 text-on-surface-variant/40" />
      <p class="mt-3 text-sm font-bold text-on-surface-variant">You are all caught up!</p>
      <p class="mt-1 text-xs text-on-surface-variant/70">No notifications to display right now.</p>
    </div>
    
    <TransitionGroup name="fade" tag="div" class="space-y-3" v-else>
      <div
        v-for="item in notifications"
        :key="item.id"
        :class="[
          'flex items-start justify-between gap-4 rounded-2xl border p-5 transition-all',
          item.isRead 
            ? 'bg-surface-container-lowest/50 border-outline-variant/30 text-on-surface-variant/80' 
            : 'bg-surface-container-low border-primary/20 text-on-surface shadow-sm'
        ]"
      >
        <div class="flex items-start gap-4">
          <div :class="['mt-0.5 rounded-full p-2.5', item.isRead ? 'bg-surface-container' : 'bg-primary-container text-primary']">
            <BellIcon class="h-5 w-5" />
          </div>
          <div>
            <p class="text-sm font-semibold leading-relaxed">{{ item.message }}</p>
            <p class="mt-1 text-xs font-bold text-on-surface-variant/60">
              {{ new Date(item.createdAt).toLocaleString() }}
            </p>
          </div>
        </div>

        <button
          v-if="!item.isRead"
          @click="markNotificationAsRead(item.id)"
          class="flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-on-primary"
          title="Mark as read"
        >
          <CheckCircleIcon class="h-4 w-4" />
          <span>Read</span>
        </button>
        <span v-else class="text-xs font-bold uppercase tracking-wider text-on-surface-variant/40">Read</span>
      </div>
    </TransitionGroup>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
