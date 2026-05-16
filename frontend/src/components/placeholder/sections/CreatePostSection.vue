<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { DocumentIcon, SparklesIcon } from '@heroicons/vue/24/outline'
import FriendlyEditor from './FriendlyEditor.vue'
import api from '@/lib/api'
import { usePostStore } from '@/stores/posts'
import { marked } from 'marked'
import { isAxiosError } from 'axios'

const { t } = useI18n()
const postStore = usePostStore()

const isMarkdownMode = ref(false)
const isPosting = ref(false)
const isUploadingMarkdownImage = ref(false)
const postError = ref('')
const postMessage = ref('')

const postForm = reactive({
  title: '',
  content: '',
})

const postPhotoFile = ref(null)
const postPhotoPreview = ref('')
const postPhotoName = ref('')

const canSubmitPost = computed(() => {
  return postForm.title.trim().length > 0 && postForm.content.trim().length > 0
})

const postPreviewHtml = computed(() => {
  try {
    const rawHtml = marked.parse(postForm.content || '', { async: false, breaks: true })
    return sanitizeMarkdownHtml(rawHtml)
  } catch (e) {
    return escapeHtml(postForm.content || '')
  }
})

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function sanitizeMarkdownHtml(html) {
  if (typeof DOMParser === 'undefined') return escapeHtml(html)

  const allowedTags = new Set([
    'A', 'BLOCKQUOTE', 'BR', 'CODE', 'DEL', 'EM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
    'HR', 'IMG', 'LI', 'OL', 'P', 'PRE', 'STRONG', 'UL'
  ])
  const allowedAttributes = {
    A: new Set(['href', 'title', 'target', 'rel']),
    IMG: new Set(['src', 'alt', 'title'])
  }
  const parser = new DOMParser()
  const document = parser.parseFromString(html, 'text/html')

  document.body.querySelectorAll('*').forEach((element) => {
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes))
      return
    }

    Array.from(element.attributes).forEach((attribute) => {
      const allowedForTag = allowedAttributes[element.tagName]
      const isSafeAttribute = allowedForTag?.has(attribute.name)
      const value = attribute.value.trim().toLowerCase()

      if (!isSafeAttribute || value.startsWith('javascript:') || value.startsWith('data:')) {
        element.removeAttribute(attribute.name)
      }
    })
  })

  return document.body.innerHTML
}

async function uploadPostImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post('/file-service/upload', formData)
  return data.url
}

async function handleMarkdownImageUpload(event) {
  const files = Array.from(event.target.files)
  if (!files.length) return

  isUploadingMarkdownImage.value = true
  try {
    for (const file of files) {
      const url = await uploadPostImage(file)
      if (url) {
        postForm.content += `\n\n![${file.name}](${url})`
      }
    }
  } catch (error) {
    postError.value = 'Could not upload one or more images.'
  } finally {
    isUploadingMarkdownImage.value = false
    event.target.value = ''
  }
}

async function handleEditorUploadImage(file, callback) {
  try {
    const imageUrl = await uploadPostImage(file)
    if (imageUrl) {
      callback(imageUrl)
    }
  } catch (error) {
    postError.value = 'Could not upload the image. Please try again.'
  }
}

function handlePostPhotoChange(event) {
  const file = event.target.files[0]
  if (!file) return

  if (postPhotoPreview.value) URL.revokeObjectURL(postPhotoPreview.value)
  postPhotoFile.value = file
  postPhotoPreview.value = URL.createObjectURL(file)
  postPhotoName.value = file.name
}

function removePostPhoto() {
  if (postPhotoPreview.value) URL.revokeObjectURL(postPhotoPreview.value)
  postPhotoFile.value = null
  postPhotoPreview.value = ''
  postPhotoName.value = ''
}

async function submitPost() {
  postError.value = ''
  postMessage.value = ''

  if (!canSubmitPost.value) {
    postError.value = 'Please add a title and content before publishing.'
    return
  }

  isPosting.value = true
  try {
    let imageUrl = ''
    if (postPhotoFile.value) {
      imageUrl = await uploadPostImage(postPhotoFile.value)
    }

    const { data } = await api.post('/posts', {
      title: postForm.title.trim(),
      content: postForm.content.trim(),
      imageUrl,
    })

    postStore.posts = [postStore.mapPost(data.post), ...postStore.posts]
    postMessage.value = 'Post published and saved successfully.'
    postForm.title = ''
    postForm.content = ''
    removePostPhoto()
  } catch (error) {
    postError.value = isAxiosError(error) ? error.response?.data?.message || error.message : 'Could not publish your post.'
  } finally {
    isPosting.value = false
  }
}
</script>

<template>
  <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
    <form class="space-y-5 rounded-[2rem] bg-surface-container-lowest p-5 shadow-sm ring-1 ring-white/5 sm:p-6"
          @submit.prevent="submitPost">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">{{ t('createPost.newPost') }}</p>
          <h2 class="mt-1 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">
            {{ t('createPost.shareWithNetwork') }}
          </h2>
        </div>
        <button
            class="rounded-full bg-primary px-5 py-3 text-sm font-black text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isPosting || !canSubmitPost"
            type="submit"
        >
          {{ isPosting ? t('createPost.publishing') : t('createPost.publishPost') }}
        </button>
      </div>

      <label class="block space-y-2">
        <span class="text-sm font-black text-on-surface">{{ t('createPost.title') }}</span>
        <input
            v-model="postForm.title"
            class="w-full rounded-2xl bg-surface px-4 py-3 text-sm font-bold text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
            maxlength="100"
            :placeholder="t('createPost.titlePlaceholder')"
            type="text"
        />
      </label>

      <div class="block space-y-2">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-4">
<!--            <span class="text-sm font-black text-on-surface">-->
<!--              {{ isMarkdownMode ? 'Markdown content' : 'Friendly editor' }}-->
<!--            </span>-->
            <div class="flex items-center rounded-full bg-surface-container-high p-1">
              <button
                type="button"
                @click="isMarkdownMode = false"
                :class="[
                  'flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider transition',
                  !isMarkdownMode ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                ]"
              >
                <SparklesIcon class="h-3 w-3" />
                {{ t('createPost.friendly') }}
              </button>
              <button
                type="button"
                @click="isMarkdownMode = true"
                :class="[
                  'flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider transition',
                  isMarkdownMode ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                ]"
              >
                <DocumentIcon class="h-3 w-3" />
                {{ t('createPost.markdown') }}
              </button>
            </div>
          </div>
          <label
              v-if="isMarkdownMode"
              class="inline-flex cursor-pointer items-center rounded-full bg-surface-container-high px-4 py-2 text-xs font-black text-on-surface transition hover:bg-surface-container-highest">
            {{ isUploadingMarkdownImage ? t('createPost.uploadingImages') : t('createPost.uploadMarkdownImages') }}
            <input
                class="sr-only"
                accept="image/*"
                type="file"
                multiple
                :disabled="isUploadingMarkdownImage || isPosting"
                @change="handleMarkdownImageUpload"
            />
          </label>
        </div>

        <textarea
            v-if="isMarkdownMode"
            v-model="postForm.content"
            class="min-h-72 w-full resize-y rounded-[1.25rem] bg-surface px-4 py-3 text-sm font-bold leading-6 text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
            :placeholder="t('createPost.markdownPlaceholder')"
        />
        <FriendlyEditor
          v-else
          v-model="postForm.content"
          :placeholder="t('createPost.friendlyPlaceholder')"
          @uploadImage="handleEditorUploadImage"
        />
      </div>

      <p v-if="postError" class="rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">{{
          postError
        }}</p>
      <p v-if="postMessage" class="rounded-2xl bg-[#8fd99b]/10 px-4 py-3 text-xs font-bold text-[#8fd99b]">
        {{ postMessage }}</p>
    </form>

    <aside class="space-y-5 xl:sticky xl:top-28 xl:h-fit">
      <article class="rounded-[2rem] bg-surface-container-low p-5 shadow-sm ring-1 ring-white/5">
        <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">{{ t('createPost.preview') }}</p>
        <h2 class="mt-3 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">
          {{ postForm.title || t('createPost.previewTitleFallback') }}</h2>
        <img v-if="postPhotoPreview" :src="postPhotoPreview" :alt="postPhotoName || t('createPost.postPhotoPreviewAlt')"
             class="mt-4 max-h-64 w-full rounded-[1.25rem] object-cover"/>
        <div
            class="create-post-preview mt-4 text-sm font-semibold leading-6 text-on-surface-variant"
            v-html="postPreviewHtml"
        ></div>
      </article>

      <article class="rounded-[2rem] bg-surface-container-low p-5 shadow-sm ring-1 ring-white/5">
        <h3 class="font-display text-xl font-black tracking-[-0.04em] text-on-surface">{{ t('createPost.markdownTips') }}</h3>
        <ul class="mt-3 space-y-2 text-sm font-bold text-on-surface-variant">
          <li><span class="text-primary">#</span> {{ t('createPost.headingTip') }}</li>
          <li><span class="text-primary">**bold**</span> {{ t('createPost.emphasisTip') }} <span class="text-primary">_italic_</span></li>
          <li><span class="text-primary">-</span> {{ t('createPost.bulletTip') }}</li>
          <li><span class="text-primary">[label](https://example.com)</span> {{ t('createPost.linkTip') }}</li>
        </ul>
      </article>
    </aside>
  </section>
</template>

<style scoped>
.create-post-preview :deep(p + p),
.create-post-preview :deep(h1),
.create-post-preview :deep(h2),
.create-post-preview :deep(h3),
.create-post-preview :deep(h4),
.create-post-preview :deep(ul),
.create-post-preview :deep(ol),
.create-post-preview :deep(blockquote),
.create-post-preview :deep(img),
.create-post-preview :deep(pre) {
  margin-top: 0.75rem;
}

.create-post-preview :deep(h1),
.create-post-preview :deep(h2),
.create-post-preview :deep(h3),
.create-post-preview :deep(h4) {
  color: var(--fs-on-surface);
  font-family: var(--font-display);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.15;
}

.create-post-preview :deep(h1) {
  font-size: 1.75rem;
}

.create-post-preview :deep(h2) {
  font-size: 1.45rem;
}

.create-post-preview :deep(h3) {
  font-size: 1.2rem;
}

.create-post-preview :deep(a) {
  color: var(--fs-primary);
  font-weight: 900;
  text-decoration: underline;
}

.create-post-preview :deep(strong) {
  color: var(--fs-on-surface);
  font-weight: 900;
}

.create-post-preview :deep(ul),
.create-post-preview :deep(ol) {
  padding-left: 1.25rem;
}

.create-post-preview :deep(ul) {
  list-style: disc;
}

.create-post-preview :deep(ol) {
  list-style: decimal;
}

.create-post-preview :deep(blockquote) {
  border-left: 4px solid var(--fs-primary);
  padding-left: 1rem;
}

.create-post-preview :deep(code) {
  border-radius: 0.375rem;
  background: var(--fs-surface-container-high);
  padding: 0.125rem 0.375rem;
}

.create-post-preview :deep(pre) {
  overflow-x: auto;
  border-radius: 1rem;
  background: var(--fs-surface-container-lowest);
  padding: 1rem;
}

.create-post-preview :deep(pre code) {
  background: transparent;
  padding: 0;
}

.create-post-preview :deep(img) {
  max-height: 18rem;
  width: 100%;
  border-radius: 1.25rem;
  object-fit: cover;
}
</style>
