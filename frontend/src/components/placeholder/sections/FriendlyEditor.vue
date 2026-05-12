<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { watch, onBeforeUnmount } from 'vue'
import {
  BoldIcon,
  ItalicIcon,
  ListBulletIcon,
  LinkIcon,
  PhotoIcon,
  HashtagIcon,
} from '@heroicons/vue/20/solid'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Write something...'
  }
})

const emit = defineEmits(['update:modelValue', 'uploadImage'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Markdown.configure({
      html: false,
      breaks: true,
      linkify: true,
      transformPastedText: true,
      transformCopiedText: true,
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'rounded-[1.25rem] max-h-72 w-full object-cover my-4',
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary underline font-black',
      },
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm focus:outline-none max-w-none min-h-[18rem] px-4 py-3 text-sm font-bold leading-6 text-on-surface',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.storage.markdown.getMarkdown())
  },
})

watch(() => props.modelValue, (value) => {
  if (!editor.value) return
  const isSame = editor.value.storage.markdown.getMarkdown() === value
  if (isSame) return
  editor.value.commands.setContent(value, false)
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const addImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      emit('uploadImage', file, (url) => {
        editor.value.chain().focus().setImage({ src: url }).run()
      })
    }
  }
  input.click()
}

const setLink = () => {
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)

  if (url === null) return
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}
</script>

<template>
  <div v-if="editor" class="overflow-hidden rounded-[1.25rem] bg-surface transition-all focus-within:ring-2 focus-within:ring-primary">
    <div class="flex flex-wrap items-center gap-1 border-b border-outline/20 bg-surface-container-low p-2">
      <button
        type="button"
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'bg-primary/20 text-primary': editor.isActive('bold') }"
        class="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high transition"
        title="Bold"
      >
        <BoldIcon class="h-5 w-5" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'bg-primary/20 text-primary': editor.isActive('italic') }"
        class="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high transition"
        title="Italic"
      >
        <ItalicIcon class="h-5 w-5" />
      </button>
      <div class="mx-1 h-6 w-px bg-outline/20"></div>
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'bg-primary/20 text-primary': editor.isActive('heading', { level: 1 }) }"
        class="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high transition"
        title="Heading 1"
      >
        <HashtagIcon class="h-5 w-5" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-primary/20 text-primary': editor.isActive('bulletList') }"
        class="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high transition"
        title="Bullet List"
      >
        <ListBulletIcon class="h-5 w-5" />
      </button>
      <div class="mx-1 h-6 w-px bg-outline/20"></div>
      <button
        type="button"
        @click="setLink"
        :class="{ 'bg-primary/20 text-primary': editor.isActive('link') }"
        class="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high transition"
        title="Link"
      >
        <LinkIcon class="h-5 w-5" />
      </button>
      <button
        type="button"
        @click="addImage"
        class="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high transition"
        title="Add Image"
      >
        <PhotoIcon class="h-5 w-5" />
      </button>
    </div>
    <EditorContent :editor="editor" />
  </div>
</template>

<style>
.prose :where(p):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
}

.prose :where(h1):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
  font-family: inherit;
  font-weight: 900;
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.prose :where(strong):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
  color: var(--fs-on-surface);
  font-weight: 900;
}

.prose :where(ul):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.prose :where(ol):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
  list-style-type: decimal;
  padding-left: 1.5rem;
}

.prose :where(blockquote):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
  margin-block: 1rem;
  border-left: 4px solid var(--fs-primary);
  padding-left: 1rem;
  color: var(--fs-on-surface-variant);
}

.prose :where(pre):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
  overflow-x: auto;
  border-radius: 1rem;
  background: var(--fs-surface-container-lowest);
  padding: 1rem;
}

.prose :where(code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
  border-radius: 0.375rem;
  background: var(--fs-surface-container-high);
  padding: 0.125rem 0.375rem;
}

.prose :where(pre code):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
  background: transparent;
  padding: 0;
}
</style>
