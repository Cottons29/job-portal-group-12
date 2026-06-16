<template>
<div class="rounded-3xl border border-on-surface/5 bg-surface-container-lowest p-6 shadow-sm">
  <div class="mb-4 flex items-start justify-between gap-4">
    <div class="flex items-center gap-3">
      <div
          :class="[
            post.logoBg || 'bg-[#aecbfa]',
            post.logoText || 'text-[#1a4fa3]',
            'grid h-10 w-10 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full text-xs font-black transition hover:opacity-80',
          ]"
          @click.stop="$emit('show-profile', localPost.authorId)"
      >
         <img
            v-if="localPost.authorAvatar"
            :src="resolveUrl(localPost.authorAvatar)"
            class="h-full w-full object-cover"
            alt="Profile Image"
        />
        <span v-else>{{ localPost.company?.charAt(0) }}</span>
      </div>
      <div class="cursor-pointer" @click.stop="$emit('show-profile', localPost.authorId)">
        <div class="flex items-center gap-1.5 flex-wrap">
          <p class="text-sm font-black text-on-surface hover:underline">{{ localPost.company }}</p>
          <span
            v-if="localPost.isVerified"
            class="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-amber-600 ring-1 ring-amber-500/20"
            title="Verified Employer / SME"
          >
            ★ Verified
          </span>
          <span
            v-else-if="localPost.isStudentVerified"
            class="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/20"
            title="Verified Student"
          >
            ✓ Verified
          </span>
        </div>
        <p class="text-[10px] font-bold text-on-surface-variant/70">{{ localPost.meta }}</p>
      </div>
    </div>
    <div class="relative">
      <button
          type="button"
          class="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-on-surface/5 transition"
          @click.stop="showMenu = !showMenu"
      >
        <EllipsisHorizontalIcon class="h-5 w-5"/>
      </button>
      <div
          v-if="showMenu"
          class="absolute right-0 mt-1 w-36 rounded-xl bg-surface-container-lowest border border-on-surface/10 shadow-lg z-10 py-1"
          @click.stop
      >
        <button
            @click="showMenu = false; showReportModal = true"
            class="w-full text-left px-4 py-2 text-xs font-black text-red-500 hover:bg-on-surface/5 flex items-center gap-2"
        >
          <FlagIcon class="h-4 w-4 shrink-0"/>
          Report Post
        </button>
      </div>
    </div>
  </div>

  <div
      :class="[
        'space-y-3',
        { 'cursor-pointer': !full },
      ]"
      @click="!full && $emit('open', localPost)"
  >
    <p v-if="localPost.badge" class="text-xs font-black uppercase tracking-[0.18em] text-primary">
      {{
        localPost.badge === 'Hiring now'
            ? $t('home.hiringNow')
            : localPost.badge === 'Campus opportunity'
                ? $t('home.campusOpportunity')
                : localPost.badge
      }}
    </p>
    <h2 class="font-display text-2xl font-black tracking-[-0.03em] text-on-surface leading-tight">{{ localPost.title }}</h2>
    <div v-if="localPost.isJob" class="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-black">
      <span v-if="localPost.salary" class="text-[13px] font-black text-primary">{{ localPost.salary }}</span>
      <span v-if="localPost.location" class="text-on-surface-variant/70">• {{ localPost.location }}</span>
      <span v-if="localPost.jobType" class="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-primary">{{ localPost.jobType }}</span>
    </div>
    <div :class="['relative max-w-2xl text-sm font-bold leading-relaxed text-on-surface-variant', { 'post-preview': !full }]">
      <div class="post-markdown prose prose-sm text-on-surface-variant" v-html="localPost.descHtml || localPost.desc"/>
      <div v-if="!full" class="post-preview__fade pointer-events-none absolute inset-x-0 bottom-0 h-10"/>
    </div>
    <button
        v-if="!full"
        class="text-xs font-black uppercase tracking-[0.12em] text-primary hover:underline transition"
        type="button"
        @click.stop="$emit('open', localPost)"
    >
      Read Full Post
    </button>
    <img
        v-if="localPost.imageUrl && full"
        :src="localPost.imageUrl"
        :alt="localPost.title"
        class="mt-4 max-h-96 w-full rounded-2xl object-cover"
    />
    <div v-if="localPost.tags?.length" class="mt-4 flex flex-wrap gap-2">
        <span
            v-for="tag in localPost.tags"
            :key="tag"
            class="rounded-full bg-surface-container px-2.5 py-1 text-xs font-black text-primary"
        >
          {{ tag }}
        </span>
    </div>
  </div>

  <div class="mt-5 border-t border-on-surface/5 pt-4 flex flex-wrap items-center justify-between gap-4">
    <div class="flex flex-wrap items-center gap-1.5">
      <button
          type="button"
          class="flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1.5 text-xs font-black text-primary transition hover:bg-primary/10 disabled:opacity-40"
          aria-label="Like post"
          @click.stop="toggleLike"
      >
        <HeartIconSolid v-if="localPost.likedByMe" class="h-4 w-4 text-red-500"/>
        <HeartIcon v-else class="h-4 w-4"/>
        <span>{{ localPost.likeCount ?? 0 }}</span>
      </button>

      <button
          type="button"
          class="flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1.5 text-xs font-black text-primary transition hover:bg-primary/10 disabled:opacity-40"
          aria-label="Comments"
          @click.stop="toggleComments"
      >
        <ChatBubbleOvalLeftEllipsisIcon class="h-4 w-4"/>
        <span>{{ localPost.commentCount ?? 0 }}</span>
      </button>

      <button
          type="button"
          class="flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1.5 text-xs font-black text-primary transition hover:bg-primary/10 disabled:opacity-40"
          aria-label="Share post"
          @click.stop="sharePost"
      >
        <ArrowUpOnSquareIcon class="h-4 w-4"/>
        <span>{{ localPost.shareCount ?? 0 }}</span>
      </button>

      <button
          type="button"
          class="flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1.5 text-xs font-black text-primary transition hover:bg-primary/10 disabled:opacity-40"
          aria-label="Save post"
          @click.stop="toggleBookmark"
      >
        <BookmarkIconSolid v-if="localPost.bookmarkedByMe" class="h-4 w-4 text-amber-600"/>
        <BookmarkIcon v-else class="h-4 w-4"/>
        <span>{{ localPost.bookmarkCount ?? 0 }}</span>
      </button>
    </div>

    <div class="flex items-center gap-2">
      <button
          v-if="userRole?.toLowerCase() === 'student' && userId && userId !== localPost.authorId && localPost.isJob && !appliedPostIds?.has(localPost.id)"
          class="rounded-full bg-[#002f87] px-6 py-2 text-xs font-black text-white hover:bg-opacity-95 shadow-[0_4px_12px_rgba(0,47,135,0.2)] transition duration-150"
          type="button"
          @click.stop="$emit('apply', localPost)"
      >
        Apply now
      </button>
      <button
          v-else-if="userRole?.toLowerCase() === 'student' && userId && userId !== localPost.authorId && localPost.isJob && appliedPostIds?.has(localPost.id)"
          class="flex cursor-default items-center gap-1.5 rounded-full bg-[#8fd99b]/25 px-5 py-2 text-xs font-black text-[#1f6c3b]"
          type="button"
      >
        <CheckCircleIcon class="h-4 w-4"/>
        Applied
      </button>
      <button
          v-else-if="userRole?.toLowerCase() === 'employer' && userId === localPost.authorId && localPost.isJob"
          class="flex items-center gap-1.5 rounded-full bg-[#002f87] px-5 py-2 text-xs font-black text-white hover:bg-opacity-95 transition duration-150"
          type="button"
          @click.stop="$emit('view-applicants', localPost)"
      >
        <UserGroupIcon class="h-4 w-4"/>
        View applicants
      </button>
    </div>
  </div>

  <p v-if="socialError" class="mt-3 text-xs font-bold text-red-400">{{ socialError }}</p>

  <div v-if="showCommentsPanel" class="mt-4 space-y-3 border-t border-outline-variant/40 pt-4">
    <p class="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">Comments</p>
    <p v-if="commentsLoading" class="text-sm font-semibold text-on-surface-variant">Loading comments…</p>
    <p v-else-if="commentsError" class="text-sm font-bold text-red-400">{{ commentsError }}</p>
    <ul v-else class="max-h-64 space-y-3 overflow-y-auto pr-1">
      <li
          v-for="c in comments"
          :key="c.id"
          class="rounded-xl bg-surface-container-low/80 p-3 text-sm text-on-surface"
      >
        <div class="flex items-start gap-3">
          <div class="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-surface-container-high">
            <img v-if="c.author?.avatar" :src="resolveUrl(c.author.avatar)" class="h-full w-full object-cover" alt="Avatar" />
            <div v-else class="grid h-full w-full place-items-center bg-[#d7b7ff] text-xs font-black text-[#6a39b8]">
              {{ (c.author?.name || '?').charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="text-xs font-black text-on-surface hover:underline cursor-pointer" @click="$emit('show-profile', c.author?.id)">
                  {{ c.author?.name || c.author?.user_name || 'Member' }}
                </p>
                <p class="mt-1 whitespace-pre-wrap text-[13px] text-on-surface-variant font-semibold">{{ c.content }}</p>
                <p class="mt-1 text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/80">
                  {{ formatCommentTime(c.createdAt) }}
                </p>
              </div>
              <button
                  v-if="userId && c.author?.id === userId"
                  type="button"
                  class="shrink-0 text-xs font-black text-red-400 hover:underline"
                  @click="removeComment(c.id)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </li>
      <li v-if="!comments.length" class="text-sm font-semibold text-on-surface-variant">No comments yet.</li>
    </ul>

    <div class="flex flex-col gap-2 sm:flex-row sm:items-end">
        <textarea
            v-model="newComment"
            rows="2"
            class="min-h-12 flex-1 resize-y rounded-xl border border-outline-variant/50 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary"
            placeholder="Write a comment…"
            maxlength="2000"
        />
      <button
          type="button"
          class="rounded-full bg-primary px-5 py-2.5 text-sm font-black text-on-primary transition hover:opacity-90 disabled:opacity-40"
          :disabled="commentSubmitting || !newComment.trim()"
          @click="submitComment"
      >
        {{ commentSubmitting ? 'Posting…' : 'Post' }}
      </button>
    </div>
  </div>
  <div v-if="full && authorPosts.length" class="mt-8 border-t border-outline-variant/40 pt-6">
    <h3 class="mb-4 text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
      More from {{ localPost.company }}
    </h3>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <div
          v-for="p in authorPosts"
          :key="p.id"
          class="group relative aspect-square cursor-pointer overflow-hidden rounded-[1.25rem] bg-surface-container-low transition hover:opacity-90"
          @click="$emit('open', p)"
      >
        <img
            v-if="p.imageUrl"
            :src="p.imageUrl"
            :alt="p.title"
            class="h-full w-full object-cover"
        />
        <div v-else class="flex h-full w-full items-center justify-center p-3 text-center">
          <p class="text-[10px] font-bold leading-tight text-on-surface line-clamp-3">{{ p.title }}</p>
        </div>
        <div class="absolute inset-0 bg-black/0 transition group-hover:bg-black/10"/>
      </div>
    </div>
  </div>
  
  <ReportModal
    v-if="showReportModal"
    target-type="post"
    :target-id="localPost.id"
    @close="showReportModal = false"
  />
</div>
</template>

<script setup lang="ts">
  import {computed, onMounted, ref, watch} from 'vue'
  import {
    ArrowUpOnSquareIcon,
    BookmarkIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    CheckCircleIcon,
    EllipsisHorizontalIcon,
    HeartIcon,
    UserGroupIcon,
    FlagIcon,
  } from '@heroicons/vue/24/outline'
  import {BookmarkIcon as BookmarkIconSolid, HeartIcon as HeartIconSolid} from '@heroicons/vue/24/solid'
  import api, { resolveUrl } from '@/lib/api'
  import {isAxiosError} from 'axios'
  import type {Post, PostComment} from '@/types/profile'
  import {usePostStore} from '@/stores/posts'
  import {useAuthStore} from '@/stores/auth'
  import ReportModal from './sections/ReportModal.vue'

  const props = defineProps<{
    post: Post
    full?: boolean
    userRole?: string | null
    userId?: string | null
    appliedPostIds?: Set<string | number>
  }>()

  const showReportModal = ref(false)

  const emit = defineEmits<{
    (e: 'open', post: Post): void
    (e: 'apply', post: Post): void
    (e: 'view-applicants', post: Post): void
    (e: 'engagement-change', payload: { id: string } & Partial<Post>): void
    (e: 'show-profile', authorId: string): void
  }>()

  const postStore = usePostStore()
  const authStore = useAuthStore()
  const localPost = ref<Post>(props.post)
  const socialBusy = ref(false)
  const socialError = ref('')
  const commentsOpen = ref(false)
  const comments = ref<PostComment[]>([])
  const commentsLoading = ref(false)
  const commentsError = ref('')
  const newComment = ref('')
  const showMenu = ref(false)

  async function flagPost() {
    showMenu.value = false
    if (socialBusy.value) return
    socialError.value = ''
    socialBusy.value = true
    try {
      await api.post(`/posts/${localPost.value.id}/flag`)
      alert('Post reported successfully to admins.')
    } catch (error) {
      socialError.value = readErrorMessage(error, 'Could not flag post.')
      alert(socialError.value)
    } finally {
      socialBusy.value = false
    }
  }
  const commentSubmitting = ref(false)

  const authorPosts = ref<Post[]>([])
  const authorPostsLoading = ref(false)

  const showCommentsPanel = computed(() => props.full || commentsOpen.value)

  watch(() => props.post, (newPost) => {
    localPost.value = newPost
  }, { deep: true })

  onMounted(async () => {
    if (props.full) {
      await Promise.all([
        refreshPostData(),
        loadAuthorPosts()
      ])
    }
  })

  async function refreshPostData() {
    // If some critical full-view data is missing, or just to be sure we have latest
    try {
      const { data } = await api.get(`/posts/${localPost.value.id}`)
      localPost.value = postStore.mapPost(data)
    } catch (e) {
      console.error('Failed to refresh post data:', e)
    }
  }

  async function loadAuthorPosts() {
    if (!localPost.value.authorId) return
    authorPostsLoading.value = true
    try {
      const { data } = await api.get('/posts', {
        params: {
          authorId: localPost.value.authorId,
          limit: 6
        }
      })
      authorPosts.value = (data.posts || [])
          .map(postStore.mapPost)
          //@ts-ignore
          .filter(p => p.id !== localPost.value.id)
    } catch (e) {
      console.error('Failed to load author posts:', e)
    } finally {
      authorPostsLoading.value = false
    }
  }

  watch(
      () => showCommentsPanel.value,
      async (open) => {
        if (open) {
          await loadComments()
        }
      },
  )

  function formatCommentTime(iso: string) {
    if (!iso) return ''
    try {
      return new Date(iso).toLocaleString()
    } catch {
      return ''
    }
  }

  function engagementPayload(patch: Partial<Post>) {
    return {id: localPost.value.id, ...patch}
  }

  function readErrorMessage(error: unknown, fallback: string) {
    if (isAxiosError(error)) {
      const msg = error.response?.data?.message
      return Array.isArray(msg) ? msg.join(', ') : msg || fallback
    }
    return fallback
  }

  async function toggleLike() {
    if (socialBusy.value) return
    socialError.value = ''
    
    const previousLiked = localPost.value.likedByMe
    const previousCount = localPost.value.likeCount

    // Optimistic update
    localPost.value.likedByMe = !previousLiked
    localPost.value.likeCount = (previousCount || 0) + (localPost.value.likedByMe ? 1 : -1)
    emit('engagement-change', engagementPayload({
      likedByMe: localPost.value.likedByMe,
      likeCount: localPost.value.likeCount
    }))

    socialBusy.value = true
    try {
      const {data} = await api.post(`/posts/${localPost.value.id}/like`)
      localPost.value.likedByMe = data.liked
      localPost.value.likeCount = data.likeCount
      emit('engagement-change', engagementPayload({likedByMe: data.liked, likeCount: data.likeCount}))
    } catch (error) {
      // Rollback
      localPost.value.likedByMe = previousLiked
      localPost.value.likeCount = previousCount
      emit('engagement-change', engagementPayload({likedByMe: previousLiked, likeCount: previousCount}))
      socialError.value = readErrorMessage(error, 'Could not update like.')
    } finally {
      socialBusy.value = false
    }
  }

  async function toggleBookmark() {
    if (socialBusy.value) return
    socialError.value = ''

    const previousBookmarked = localPost.value.bookmarkedByMe
    const previousCount = localPost.value.bookmarkCount

    // Optimistic update
    localPost.value.bookmarkedByMe = !previousBookmarked
    localPost.value.bookmarkCount = (previousCount || 0) + (localPost.value.bookmarkedByMe ? 1 : -1)
    emit('engagement-change', engagementPayload({
      bookmarkedByMe: localPost.value.bookmarkedByMe,
      bookmarkCount: localPost.value.bookmarkCount
    }))

    socialBusy.value = true
    try {
      const {data} = await api.post(`/posts/${localPost.value.id}/bookmark`)
      localPost.value.bookmarkedByMe = data.bookmarked
      localPost.value.bookmarkCount = data.bookmarkCount
      emit('engagement-change', engagementPayload({bookmarkedByMe: data.bookmarked, bookmarkCount: data.bookmarkCount}))
    } catch (error) {
      // Rollback
      localPost.value.bookmarkedByMe = previousBookmarked
      localPost.value.bookmarkCount = previousCount
      emit('engagement-change', engagementPayload({bookmarkedByMe: previousBookmarked, bookmarkCount: previousCount}))
      socialError.value = readErrorMessage(error, 'Could not update bookmark.')
    } finally {
      socialBusy.value = false
    }
  }

  async function sharePost() {
    if (socialBusy.value) return
    socialError.value = ''

    const previousCount = localPost.value.shareCount

    // Optimistic update
    localPost.value.shareCount = (previousCount || 0) + 1
    emit('engagement-change', engagementPayload({shareCount: localPost.value.shareCount}))

    socialBusy.value = true
    try {
      const {data} = await api.post(`/posts/${localPost.value.id}/share`)
      localPost.value.shareCount = data.shareCount
      emit('engagement-change', engagementPayload({shareCount: data.shareCount}))

      const url = `${window.location.origin}/home?post=${localPost.value.id}`
      const shareText = `${localPost.value.title}\n${url}`
      if (navigator.share) {
        try {
          await navigator.share({title: localPost.value.title, text: shareText, url})
        } catch (e) {
          if ((e as any)?.name !== 'AbortError') {
            await navigator.clipboard.writeText(shareText)
          }
        }
      } else {
        await navigator.clipboard.writeText(shareText)
      }
    } catch (error) {
      // Rollback
      localPost.value.shareCount = previousCount
      emit('engagement-change', engagementPayload({shareCount: previousCount}))
      socialError.value = readErrorMessage(error, 'Could not share this post.')
    } finally {
      socialBusy.value = false
    }
  }

  function toggleComments() {
    commentsOpen.value = !commentsOpen.value
  }

  async function loadComments() {
    commentsError.value = ''
    commentsLoading.value = true
    try {
      const {data} = await api.get(`/posts/${localPost.value.id}/comments`)
      comments.value = Array.isArray(data.comments) ? data.comments : []
    } catch (error) {
      commentsError.value = readErrorMessage(error, 'Failed to load comments.')
    } finally {
      commentsLoading.value = false
    }
  }

  async function submitComment() {
    const text = newComment.value.trim()
    if (!text || commentSubmitting.value) return
    
    const previousComments = [...comments.value]
    const previousCommentCount = localPost.value.commentCount
    
    // Optimistic comment
    const tempId = Date.now()
    const optimisticComment: PostComment = {
      id: tempId,
      author: {
        id: props.userId || authStore.user?.id || 'me',
        user_name: authStore.user?.user_name || 'You'
      },
      content: text,
      createdAt: new Date().toISOString()
    }
    
    comments.value = [...comments.value, optimisticComment]
    localPost.value.commentCount = (previousCommentCount || 0) + 1
    emit('engagement-change', engagementPayload({commentCount: localPost.value.commentCount}))
    
    newComment.value = ''
    commentSubmitting.value = true
    socialError.value = ''
    
    try {
      const {data} = await api.post(`/posts/${localPost.value.id}/comments`, {content: text})
      comments.value = comments.value.map(c => c.id === tempId ? data.comment : c)
      localPost.value.commentCount = data.commentCount
      emit('engagement-change', engagementPayload({commentCount: data.commentCount}))
    } catch (error) {
      // Rollback
      comments.value = previousComments
      localPost.value.commentCount = previousCommentCount
      emit('engagement-change', engagementPayload({commentCount: previousCommentCount}))
      newComment.value = text
      socialError.value = readErrorMessage(error, 'Could not post comment.')
    } finally {
      commentSubmitting.value = false
    }
  }

  async function removeComment(commentId: string | number) {
    socialError.value = ''
    const previousComments = [...comments.value]
    const previousCommentCount = localPost.value.commentCount
    
    // Optimistic remove
    comments.value = comments.value.filter((c) => c.id !== commentId)
    localPost.value.commentCount = Math.max(0, (previousCommentCount || 0) - 1)
    emit('engagement-change', engagementPayload({commentCount: localPost.value.commentCount}))
    
    try {
      const {data} = await api.delete(`/posts/${localPost.value.id}/comments/${commentId}`)
      localPost.value.commentCount = data.commentCount
      emit('engagement-change', engagementPayload({commentCount: data.commentCount}))
    } catch (error) {
      // Rollback
      comments.value = previousComments
      localPost.value.commentCount = previousCommentCount
      emit('engagement-change', engagementPayload({commentCount: previousCommentCount}))
      socialError.value = readErrorMessage(error, 'Could not delete comment.')
    }
  }
</script>

<style scoped>

.post-preview__fade {
  background: linear-gradient(to bottom, transparent, color-mix(in srgb, var(--fs-surface-container-lowest) 100%, transparent));
}

.post-markdown :deep(p + p),
.post-markdown :deep(h1),
.post-markdown :deep(h2),
.post-markdown :deep(h3),
.post-markdown :deep(h4),
.post-markdown :deep(ul),
.post-markdown :deep(ol),
.post-markdown :deep(blockquote),
.post-markdown :deep(img),
.post-markdown :deep(pre) {
  margin-top: 0.75rem;
}

.post-markdown :deep(h1),
.post-markdown :deep(h2),
.post-markdown :deep(h3),
.post-markdown :deep(h4) {
  color: var(--fs-on-surface);
  font-family: var(--font-display),serif;
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.15;
}

.post-markdown :deep(h1) {
  font-size: 1.75rem;
}

.post-markdown :deep(h2) {
  font-size: 1.45rem;
}

.post-markdown :deep(h3) {
  font-size: 1.2rem;
}

.post-markdown :deep(img) {
  max-height: 24rem;
  width: 100%;
  border-radius: 1rem;
  object-fit: cover;
}

.post-preview .post-markdown :deep(img) {
  max-height: 12rem;
}

.post-markdown :deep(ul),
.post-markdown :deep(ol) {
  padding-left: 1.25rem;
}

.post-markdown :deep(ul) {
  list-style: disc;
}

.post-markdown :deep(ol) {
  list-style: decimal;
}

.post-markdown :deep(a) {
  color: var(--fs-primary);
  font-weight: 800;
  text-decoration: underline;
}

.post-markdown :deep(strong) {
  color: var(--fs-on-surface);
  font-weight: 900;
}

.post-markdown :deep(code) {
  border-radius: 0.45rem;
  background: color-mix(in srgb, var(--fs-surface-container-lowest) 80%, transparent);
  padding: 0.15rem 0.35rem;
  color: var(--fs-on-surface);
  font-size: 0.8em;
  font-weight: 800;
}

.post-markdown :deep(pre) {
  overflow-x: auto;
  border-radius: 0.85rem;
  background: color-mix(in srgb, var(--fs-surface-container-lowest) 80%, transparent);
  padding: 0.9rem;
}

.post-markdown :deep(pre code) {
  background: transparent;
  padding: 0;
}
</style>
