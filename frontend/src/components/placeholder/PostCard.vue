<template>
  <div class="rounded-[1.25rem] bg-surface-container-lowest p-5">
    <div class="mb-5 flex items-start justify-between gap-4">
      <div class="flex items-center gap-3">
        <div
          :class="[
            post.logoBg,
            post.logoText,
            'grid h-12 w-12 cursor-pointer place-items-center rounded-full text-sm font-black transition hover:opacity-80',
          ]"
          @click.stop="$emit('show-profile', post.authorId)"
        >
          {{ post.company.charAt(0) }}
        </div>
        <div class="cursor-pointer" @click.stop="$emit('show-profile', post.authorId)">
          <p class="font-black text-on-surface hover:underline">{{ post.company }}</p>
          <p class="text-xs font-bold text-on-surface-variant">{{ post.meta }}</p>
        </div>
      </div>
      <EllipsisHorizontalIcon class="h-6 w-6 text-on-surface-variant" />
    </div>

    <div
      :class="[

        'rounded-[1.25rem] p-5',
        { 'cursor-pointer transition-opacity hover:opacity-90': !full },
      ]"
      @click="!full && $emit('open', post)"
    >
      <p v-if="post.badge" class="text-xs font-black uppercase tracking-[0.2em] text-primary">
        {{
          post.badge === 'Hiring now'
            ? $t('home.hiringNow')
            : post.badge === 'Campus opportunity'
              ? $t('home.campusOpportunity')
              : post.badge
        }}
      </p>
      <h2 class="mt-3 font-display text-3xl font-black tracking-[-0.04em] text-on-surface">{{ post.title }}</h2>
      <div :class="['relative mt-3 max-w-2xl', { 'post-preview': !full }]">
        <div class="post-markdown prose prose-sm text-on-surface-variant" v-html="post.descHtml || post.desc" />
        <div v-if="!full" class="post-preview__fade pointer-events-none absolute inset-x-0 bottom-0 h-16" />
      </div>
      <button
        v-if="!full"
        class="mt-3 rounded-full bg-surface-container-lowest/80 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-primary transition hover:bg-surface-container-lowest"
        type="button"
        @click.stop="$emit('open', post)"
      >
        Read full post
      </button>
      <img
        v-if="post.imageUrl && full"
        :src="post.imageUrl"
        :alt="post.title"
        class="mt-5 max-h-96 w-full rounded-[1rem] object-cover"
      />
      <div class="mt-6 flex flex-wrap gap-2">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="rounded-full bg-surface-container-lowest/80 px-3 py-1.5 text-xs font-black text-primary"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/60 pt-4">
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-2 text-xs font-black text-primary transition hover:bg-tertiary-fixed disabled:opacity-40"
          :disabled="socialBusy"
          aria-label="Like post"
          @click.stop="toggleLike"
        >
          <HeartIconSolid v-if="post.likedByMe" class="h-5 w-5 text-red-500" />
          <HeartIcon v-else class="h-5 w-5" />
          <span>{{ post.likeCount ?? 0 }}</span>
        </button>

        <button
          type="button"
          class="flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-2 text-xs font-black text-primary transition hover:bg-tertiary-fixed disabled:opacity-40"
          :disabled="socialBusy"
          aria-label="Comments"
          @click.stop="toggleComments"
        >
          <ChatBubbleOvalLeftEllipsisIcon class="h-5 w-5" />
          <span>{{ post.commentCount ?? 0 }}</span>
        </button>

        <button
          type="button"
          class="flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-2 text-xs font-black text-primary transition hover:bg-tertiary-fixed disabled:opacity-40"
          :disabled="socialBusy"
          aria-label="Share post"
          @click.stop="sharePost"
        >
          <ArrowUpOnSquareIcon class="h-5 w-5" />
          <span>{{ post.shareCount ?? 0 }}</span>
        </button>

        <button
          type="button"
          class="flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-2 text-xs font-black text-primary transition hover:bg-tertiary-fixed disabled:opacity-40"
          :disabled="socialBusy"
          aria-label="Save post"
          @click.stop="toggleBookmark"
        >
          <BookmarkIconSolid v-if="post.bookmarkedByMe" class="h-5 w-5 text-amber-600" />
          <BookmarkIcon v-else class="h-5 w-5" />
          <span>{{ post.bookmarkCount ?? 0 }}</span>
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          v-if="userRole?.toLowerCase() === 'student' && userId && userId !== post.authorId && !appliedPostIds.has(post.id)"
          class="rounded-full border-2 border-transparent bg-primary px-5 py-2.5 text-sm font-black text-on-primary transition hover:border-primary hover:bg-primary-container hover:text-primary"
          type="button"
          @click.stop="$emit('apply', post)"
        >
          {{ $t('home.applyNow') }}
        </button>
        <button
          v-else-if="userRole?.toLowerCase() === 'student' && userId && userId !== post.authorId && appliedPostIds.has(post.id)"
          class="flex cursor-default items-center gap-2 rounded-full border-2 border-transparent bg-[#8fd99b]/20 px-5 py-2.5 text-sm font-black text-[#1f6c3b]"
          type="button"
        >
          <CheckCircleIcon class="h-4 w-4" />
          Applied
        </button>
        <button
          v-else-if="userRole?.toLowerCase() === 'employer' && userId === post.authorId"
          class="flex items-center gap-2 rounded-full border-2 border-transparent bg-primary px-5 py-2.5 text-sm font-black text-on-primary transition hover:border-primary hover:bg-primary-container hover:text-primary"
          type="button"
          @click.stop="$emit('view-applicants', post)"
        >
          <UserGroupIcon class="h-4 w-4" />
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
          class="rounded-xl bg-surface-container-low/80 px-3 py-2 text-sm text-on-surface"
        >
          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="text-xs font-black text-primary">
                {{ c.author?.user_name || c.author?.phone || 'Member' }}
              </p>
              <p class="mt-1 whitespace-pre-wrap text-on-surface-variant">{{ c.content }}</p>
              <p class="mt-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/80">
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
        </li>
        <li v-if="!comments.length" class="text-sm font-semibold text-on-surface-variant">No comments yet.</li>
      </ul>

      <div class="flex flex-col gap-2 sm:flex-row sm:items-end">
        <textarea
          v-model="newComment"
          rows="2"
          class="min-h-[3rem] flex-1 resize-y rounded-xl border border-outline-variant/50 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary"
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
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import {
  ArrowUpOnSquareIcon,
  BookmarkIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CheckCircleIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline'
import { BookmarkIcon as BookmarkIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid'
import api from '@/lib/api'
import { isAxiosError } from 'axios'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  full: {
    type: Boolean,
    default: false,
  },
  userRole: {
    type: String,
    default: null,
  },
  userId: {
    type: String,
    default: null,
  },
  appliedPostIds: {
    type: Object,
    default: () => new Set(),
  },
})

const emit = defineEmits(['open', 'apply', 'view-applicants', 'engagement-change', 'show-profile'])

const socialBusy = ref(false)
const socialError = ref('')
const commentsOpen = ref(false)
const comments = ref([])
const commentsLoading = ref(false)
const commentsError = ref('')
const newComment = ref('')
const commentSubmitting = ref(false)

const showCommentsPanel = computed(() => props.full || commentsOpen.value)

watch(
  () => showCommentsPanel.value,
  async (open) => {
    if (open) {
      await loadComments()
    }
  },
)

function formatCommentTime(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return ''
  }
}

function engagementPayload(patch) {
  return { id: props.post.id, ...patch }
}

function readErrorMessage(error, fallback) {
  if (isAxiosError(error)) {
    const msg = error.response?.data?.message
    return Array.isArray(msg) ? msg.join(', ') : msg || fallback
  }
  return fallback
}

async function toggleLike() {
  socialError.value = ''
  socialBusy.value = true
  try {
    const { data } = await api.post(`/posts/${props.post.id}/like`)
    emit('engagement-change', engagementPayload({ likedByMe: data.liked, likeCount: data.likeCount }))
  } catch (error) {
    socialError.value = readErrorMessage(error, 'Could not update like.')
  } finally {
    socialBusy.value = false
  }
}

async function toggleBookmark() {
  socialError.value = ''
  socialBusy.value = true
  try {
    const { data } = await api.post(`/posts/${props.post.id}/bookmark`)
    emit(
      'engagement-change',
      engagementPayload({ bookmarkedByMe: data.bookmarked, bookmarkCount: data.bookmarkCount }),
    )
  } catch (error) {
    socialError.value = readErrorMessage(error, 'Could not update bookmark.')
  } finally {
    socialBusy.value = false
  }
}

async function sharePost() {
  socialError.value = ''
  socialBusy.value = true
  try {
    const { data } = await api.post(`/posts/${props.post.id}/share`)
    emit('engagement-change', engagementPayload({ shareCount: data.shareCount }))
    const url = `${window.location.origin}/home?post=${props.post.id}`
    const shareText = `${props.post.title}\n${url}`
    if (navigator.share) {
      try {
        await navigator.share({ title: props.post.title, text: shareText, url })
      } catch (e) {
        if (e?.name !== 'AbortError') {
          await navigator.clipboard.writeText(shareText)
        }
      }
    } else {
      await navigator.clipboard.writeText(shareText)
    }
  } catch (error) {
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
    const { data } = await api.get(`/posts/${props.post.id}/comments`)
    comments.value = Array.isArray(data.comments) ? data.comments : []
  } catch (error) {
    commentsError.value = readErrorMessage(error, 'Failed to load comments.')
  } finally {
    commentsLoading.value = false
  }
}

async function submitComment() {
  const text = newComment.value.trim()
  if (!text) return
  commentSubmitting.value = true
  socialError.value = ''
  try {
    const { data } = await api.post(`/posts/${props.post.id}/comments`, { content: text })
    newComment.value = ''
    comments.value = [...comments.value, data.comment]
    emit('engagement-change', engagementPayload({ commentCount: data.commentCount }))
  } catch (error) {
    socialError.value = readErrorMessage(error, 'Could not post comment.')
  } finally {
    commentSubmitting.value = false
  }
}

async function removeComment(commentId) {
  socialError.value = ''
  try {
    const { data } = await api.delete(`/posts/${props.post.id}/comments/${commentId}`)
    comments.value = comments.value.filter((c) => c.id !== commentId)
    emit('engagement-change', engagementPayload({ commentCount: data.commentCount }))
  } catch (error) {
    socialError.value = readErrorMessage(error, 'Could not delete comment.')
  }
}
</script>

<style scoped>
.post-preview {
  max-height: 14rem;
  overflow: hidden;
}

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
  font-family: var(--font-display);
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
