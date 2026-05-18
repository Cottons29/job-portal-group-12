import { defineStore } from 'pinia'
import { ref } from 'vue'
import api, { resolveUrl } from '@/lib/api'
import { isAxiosError } from 'axios'

export const useStoryStore = defineStore('stories', () => {
  const stories = ref([])
  const loading = ref(false)
  const error = ref('')

  function mapStoryGroup(group: any) {
    return {
      ...group,
      avatar: resolveUrl(group.avatar),
      stories: (group.stories || []).map((s: any) => ({
        ...s,
        mediaUrl: resolveUrl(s.mediaUrl)
      }))
    }
  }

  async function fetchStories() {
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.get('/stories')
      stories.value = data.map(mapStoryGroup)
    } catch (err) {
      error.value = isAxiosError(err) ? err.response?.data?.message || err.message : 'Failed to fetch stories'
    } finally {
      loading.value = false
    }
  }

  async function addStory(payload: { text?: string; bgColor?: string; media?: File }) {
    const formData = new FormData()
    if (payload.text) formData.append('text', payload.text)
    if (payload.bgColor) formData.append('bgColor', payload.bgColor)
    if (payload.media) formData.append('media', payload.media)

    try {
      await api.post('/stories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      await fetchStories()
    } catch (err) {
      error.value = isAxiosError(err) ? err.response?.data?.message || err.message : 'Failed to add story'
      throw err
    }
  }

  return {
    stories,
    loading,
    error,
    fetchStories,
    addStory
  }
})
