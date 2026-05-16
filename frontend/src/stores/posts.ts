import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/api'
import { isAxiosError } from 'axios'
import { marked } from 'marked'

export const usePostStore = defineStore('posts', () => {
  const posts = ref([])
  const postsLoading = ref(false)
  const postsLoadingMore = ref(false)
  const postsError = ref('')
  const postsPage = ref(1)
  const postsHasMore = ref(true)
  const postsPerPage = 10
  const appliedPostIds = ref(new Set())
  const selectedPost = ref(null)
  // @ts-ignore
  function mapPost(post) {
    const authorName = post.author?.user_name || post.author?.phone || '<Blank>'
    const createdAt = post.createdAt ? new Date(post.createdAt) : null

    return {
      id: post.id,
      authorId: post.author?.id,
      company: authorName,
      meta: createdAt ? createdAt.toLocaleString() : 'Just now',
      badge: 'Community post',
      title: post.title,
      desc: post.content,
      descHtml: renderMarkdown(post.content || ''),
      imageUrl: post.imageUrl,
      tags: [],
      logoBg: 'bg-[#aecbfa]',
      logoText: 'text-[#1a4fa3]',
      likeCount: post.likeCount ?? 0,
      commentCount: post.commentCount ?? 0,
      shareCount: post.shareCount ?? 0,
      bookmarkCount: post.bookmarkCount ?? 0,
      likedByMe: Boolean(post.likedByMe),
      bookmarkedByMe: Boolean(post.bookmarkedByMe),
    }
  }
  // @ts-ignore
  function renderMarkdown(value) {
    try {
        return marked.parse(value || '', {async: false, breaks: true})
    } catch (e) {
        return value || ''
    }
  }

  async function fetchPosts({ page = 1, append = false } = {}) {
    if (append) {
      if (postsLoadingMore.value || postsLoading.value || !postsHasMore.value) return
      postsLoadingMore.value = true
    } else {
      postsLoading.value = true
      postsPage.value = 1
      postsHasMore.value = true
    }

    postsError.value = ''

    try {
      const { data } = await api.get('/posts', {
        params: {
          page,
          limit: postsPerPage,
        },
      })

      const mapped = (data.posts || []).map(mapPost)

      if (append) {
        // @ts-ignore
        posts.value = [...posts.value, ...mapped]
        postsPage.value = page
      } else {
        posts.value = mapped
      }

      postsHasMore.value = mapped.length === postsPerPage
    } catch (error) {
      postsError.value = isAxiosError(error) ? error.response?.data?.message || error.message : 'Failed to load posts.'
    } finally {
      postsLoading.value = false
      postsLoadingMore.value = false
    }
  }

  async function fetchAppliedPosts() {
    try {
      const { data } = await api.get('/posts/applied/ids')
      appliedPostIds.value = new Set(data.appliedPostIds || [])
    } catch (error) {
      console.error('Failed to refresh applied posts:', error)
    }
  }
  // @ts-ignore
  function mergeEngagement({ id, type, count, active }) {
    // @ts-ignore
    const target = posts.value.find((p) => p.id === id)
    if (!target) return

    if (type === 'like') {
      // @ts-ignore
      target.likeCount = count
      // @ts-ignore
      target.likedByMe = active
    } else if (type === 'bookmark') {
      // @ts-ignore
      target.bookmarkCount = count
      // @ts-ignore
      target.bookmarkedByMe = active
    }

    // @ts-ignore
    if (selectedPost.value && selectedPost.value.id === id) {
       if (type === 'like') {
         // @ts-ignore
          selectedPost.value.likeCount = count
         // @ts-ignore
          selectedPost.value.likedByMe = active
        } else if (type === 'bookmark') {
         // @ts-ignore
          selectedPost.value.bookmarkCount = count
         // @ts-ignore
          selectedPost.value.bookmarkedByMe = active
        }
    }
  }
  // @ts-ignore
  async function handlePostApply(postId) {
    if (appliedPostIds.value.has(postId)) return

    try {
      await api.post(`/posts/${postId}/apply`)
      appliedPostIds.value.add(postId)
    } catch (error) {
      console.error('Failed to apply for post:', error)
      throw error
    }
  }

  return {
    posts,
    postsLoading,
    postsLoadingMore,
    postsError,
    postsPage,
    postsHasMore,
    appliedPostIds,
    selectedPost,
    fetchPosts,
    fetchAppliedPosts,
    mergeEngagement,
    handlePostApply,
    mapPost
  }
})
