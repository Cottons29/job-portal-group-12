<script setup>
import { CameraIcon } from '@heroicons/vue/24/outline'

defineProps({
  postForm: {
    type: Object,
    required: true
  },
  isPosting: {
    type: Boolean,
    default: false
  },
  canSubmitPost: {
    type: Boolean,
    default: false
  },
  isUploadingMarkdownImage: {
    type: Boolean,
    default: false
  },
  postPhotoPreview: {
    type: String,
    default: ''
  },
  postPhotoName: {
    type: String,
    default: ''
  },
  postError: {
    type: String,
    default: ''
  },
  postMessage: {
    type: String,
    default: ''
  },
  postPreviewHtml: {
    type: String,
    default: ''
  }
})

defineEmits([
  'submit',
  'handleMarkdownImageUpload',
  'handlePostPhotoChange',
  'removePostPhoto'
])
</script>

<template>
  <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
    <form class="space-y-5 rounded-[2rem] bg-surface-container-low p-5 shadow-sm ring-1 ring-white/5 sm:p-6"
          @submit.prevent="$emit('submit')">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">New post</p>
          <h2 class="mt-1 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">Share with your
            network</h2>
        </div>
        <button
            class="rounded-full bg-primary px-5 py-3 text-sm font-black text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isPosting || !canSubmitPost"
            type="submit"
        >
          {{ isPosting ? 'Publishing...' : 'Publish post' }}
        </button>
      </div>

      <label class="block space-y-2">
        <span class="text-sm font-black text-on-surface">Title</span>
        <input
            v-model="postForm.title"
            class="w-full rounded-2xl bg-surface px-4 py-3 text-sm font-bold text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
            maxlength="100"
            placeholder="What do you want to share?"
            type="text"
        />
      </label>

      <label class="block space-y-2">
        <span class="flex flex-wrap items-center justify-between gap-3">
          <span class="text-sm font-black text-on-surface">Markdown content</span>
          <label
              class="inline-flex cursor-pointer items-center rounded-full bg-surface-container-high px-4 py-2 text-xs font-black text-on-surface transition hover:bg-surface-container-highest">
            {{ isUploadingMarkdownImage ? 'Uploading images...' : 'Upload markdown images' }}
            <input
                class="sr-only"
                accept="image/*"
                type="file"
                multiple
                :disabled="isUploadingMarkdownImage || isPosting"
                @change="$emit('handleMarkdownImageUpload', $event)"
            />
          </label>
        </span>
        <textarea
            v-model="postForm.content"
            class="min-h-72 w-full resize-y rounded-[1.25rem] bg-surface px-4 py-3 text-sm font-bold leading-6 text-on-surface outline-none ring-1 ring-outline/30 transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
            placeholder="Write with markdown: **bold**, _italic_, # headings, lists, links, and uploaded images."
        />
      </label>

      <div class="rounded-[1.25rem] border border-dashed border-outline/40 bg-surface/60 p-4">
        <label
            class="flex cursor-pointer flex-col items-center justify-center gap-3 text-center sm:flex-row sm:text-left">
          <span class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#f8a9dc]">
            <CameraIcon class="h-6 w-6 text-[#9b1f70]"/>
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-black text-on-surface">Add a photo</span>
            <span class="block text-xs font-bold text-on-surface-variant">Choose a JPG, PNG, GIF, or WebP image to include with your post.</span>
          </span>
          <span
              class="rounded-full bg-surface-container-high px-4 py-2 text-xs font-black text-on-surface">Browse</span>
          <input class="sr-only" accept="image/*" type="file" @change="$emit('handlePostPhotoChange', $event)"/>
        </label>
        <div v-if="postPhotoPreview" class="mt-4 overflow-hidden rounded-[1.25rem] bg-surface">
          <img :src="postPhotoPreview" :alt="postPhotoName || 'Selected post photo'"
               class="max-h-80 w-full object-cover"/>
          <div class="flex items-center justify-between gap-3 px-4 py-3">
            <p class="truncate text-xs font-bold text-on-surface-variant">{{ postPhotoName }}</p>
            <button class="text-xs font-black text-primary" type="button" @click="$emit('removePostPhoto')">Remove</button>
          </div>
        </div>
      </div>

      <p v-if="postError" class="rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">{{
          postError
        }}</p>
      <p v-if="postMessage" class="rounded-2xl bg-[#8fd99b]/10 px-4 py-3 text-xs font-bold text-[#8fd99b]">
        {{ postMessage }}</p>
    </form>

    <aside class="space-y-5 xl:sticky xl:top-28 xl:h-fit">
      <article class="rounded-[2rem] bg-surface-container-low p-5 shadow-sm ring-1 ring-white/5">
        <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">Preview</p>
        <h2 class="mt-3 font-display text-2xl font-black tracking-[-0.04em] text-on-surface">
          {{ postForm.title || 'Your post title' }}</h2>
        <img v-if="postPhotoPreview" :src="postPhotoPreview" :alt="postPhotoName || 'Post photo preview'"
             class="mt-4 max-h-64 w-full rounded-[1.25rem] object-cover"/>
        <div
            class="mt-4 space-y-3 text-sm font-semibold leading-6 text-on-surface-variant [&_a]:font-black [&_a]:text-primary [&_a]:underline [&_h1]:font-display [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-on-surface [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-on-surface [&_h3]:text-lg [&_h3]:font-black [&_h3]:text-on-surface [&_img]:max-h-72 [&_img]:w-full [&_img]:rounded-[1.25rem] [&_img]:object-cover [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-black [&_strong]"
            v-html="postPreviewHtml"
        ></div>
      </article>

      <article class="rounded-[2rem] bg-surface-container-low p-5 shadow-sm ring-1 ring-white/5">
        <h3 class="font-display text-xl font-black tracking-[-0.04em] text-on-surface">Markdown tips</h3>
        <ul class="mt-3 space-y-2 text-sm font-bold text-on-surface-variant">
          <li><span class="text-primary">#</span> Heading</li>
          <li><span class="text-primary">**bold**</span> and <span class="text-primary">_italic_</span></li>
          <li><span class="text-primary">-</span> Bullet list item</li>
          <li><span class="text-primary">[label](https://example.com)</span> Link</li>
        </ul>
      </article>
    </aside>
  </section>
</template>
