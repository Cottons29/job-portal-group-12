<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/lib/api'
import PostCard from '@/components/placeholder/PostCard.vue'
import { usePostStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const posts = ref([])
const loading = ref(false)
const error = ref('')

const postStore = usePostStore()
const auth = useAuthStore()

async function fetchSavedJobs() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/posts/bookmarks')
    posts.value = (data.posts || []).map((p) => postStore.mapPost(p))
  } catch (e) {
    console.error('Failed to fetch saved jobs', e)
    error.value = 'Failed to load saved jobs.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSavedJobs()
})
</script>

<template>
  <section class="mx-auto max-w-3xl space-y-4">
    <h1 class="font-display text-2xl font-black">{{ t('home.savedJobs') }}</h1>

    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

    <div v-if="loading" class="rounded-2xl bg-surface-container-low px-4 py-3 text-sm font-bold text-on-surface-variant">
      Loading saved jobs...
    </div>

    <div v-else-if="posts.length === 0" class="rounded-2xl bg-surface-container-low px-4 py-6 text-center text-sm font-bold text-on-surface-variant">
      No saved jobs yet.
    </div>

    <div v-else class="space-y-4">
      <PostCard
        v-for="p in posts"
        :key="p.id"
        :post="p"
        :user-role="auth.user?.role"
        :user-id="auth.user?.id"
        @open="$emit('open', $event)"
        @apply="$emit('apply', $event)"
        @view-applicants="$emit('view-applicants', $event)"
        @engagement-change="(payload) => { /* no-op for now */ }"
      />
    </div>
  </section>
</template>

<style scoped>
</style>
