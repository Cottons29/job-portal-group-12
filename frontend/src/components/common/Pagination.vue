<template>
  <div class="mt-8 flex items-center justify-between gap-4 text-sm text-slate-700">
    <button
      type="button"
      class="inline-flex min-w-28 items-center gap-2 rounded-full px-3 py-2 font-medium transition hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
    >
      <ArrowLeft class="h-4 w-4" />
      Previous
    </button>

    <div class="flex items-center justify-center gap-1">
      <template v-for="item in visiblePages" :key="item.key">
        <span
          v-if="item.type === 'ellipsis'"
          class="flex h-9 min-w-9 items-center justify-center px-1 text-slate-400"
        >
          ...
        </span>

        <button
          v-else
          type="button"
          class="flex h-9 min-w-9 items-center justify-center rounded-full px-3 font-semibold transition"
          :class="item.page === currentPage
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
            : 'text-slate-700 hover:bg-white hover:text-blue-600'"
          @click="changePage(item.page)"
        >
          {{ item.page }}
        </button>
      </template>
    </div>

    <button
      type="button"
      class="inline-flex min-w-28 items-center justify-end gap-2 rounded-full px-3 py-2 font-medium transition hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
    >
      Next
      <ArrowRight class="h-4 w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'change', page: number): void
}>()

const changePage = (page: number) => {
  if (page < 1 || page > props.totalPages) return
  emit('change', page)
}

const visiblePages = computed(() => {
  const pages = new Set<number>([1, props.totalPages])

  for (let page = props.currentPage - 1; page <= props.currentPage + 1; page += 1) {
    if (page > 1 && page < props.totalPages) {
      pages.add(page)
    }
  }

  const sortedPages = [...pages].sort((a, b) => a - b)
  const items: Array<
    | { type: 'page'; page: number; key: string }
    | { type: 'ellipsis'; key: string }
  > = []

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1]

    if (previousPage && page - previousPage > 1) {
      items.push({ type: 'ellipsis', key: `ellipsis-${previousPage}-${page}` })
    }

    items.push({ type: 'page', page, key: `page-${page}` })
  })

  return items
})
</script>
