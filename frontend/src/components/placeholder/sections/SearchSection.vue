<script setup>
import PostCard from '../PostCard.vue'

defineProps({
  searchQuery: {
    type: String,
    required: true
  },
  searchRoleFilter: {
    type: String,
    required: true
  },
  searchResults: {
    type: Array,
    required: true
  },
  isSearching: {
    type: Boolean,
    default: false
  },
  searchError: {
    type: String,
    default: ''
  },
  userRole: {
    type: String,
    default: null
  },
  userId: {
    type: String,
    default: null
  },
  appliedPostIds: {
    type: Set,
    default: () => new Set()
  }
})

defineEmits(['update:searchQuery', 'update:searchRoleFilter', 'search', 'open-post', 'apply', 'view-applicants'])
</script>

<template>
  <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
    <section class="min-w-0 space-y-6">
      
      <!-- Search Bar & Filters -->
      <div class="rounded-4xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-white/5 sm:p-6">
        <form @submit.prevent="$emit('search')" class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            class="flex-1 rounded-full bg-surface-container-low px-5 py-3 text-sm font-bold text-on-surface outline-none  transition placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary"
            placeholder="Search jobs, skills, or keywords..."
            type="text"
          />
          <button
            type="submit"
            class="rounded-full bg-primary px-6 py-3 text-sm font-black text-on-primary transition hover:opacity-90 disabled:opacity-50"
            :disabled="isSearching"
          >
            {{ isSearching ? 'Searching...' : 'Search' }}
          </button>
        </form>
        
        <div class="mt-4 flex flex-wrap items-center gap-2">
          <span class="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">Filter by:</span>
          <button
            v-for="role in ['All', 'Employer', 'Student']"
            :key="role"
            @click="$emit('update:searchRoleFilter', role); $emit('search')"
            :class="[
              'rounded-full px-4 py-1.5 text-xs font-black transition',
              searchRoleFilter === role 
                ? 'bg-primary text-on-primary shadow-sm' 
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
            ]"
          >
            {{ role }}
          </button>
        </div>
      </div>

      <!-- Results -->
      <p v-if="searchError" class="rounded-2xl bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
        {{ searchError }}
      </p>
      
      <div v-if="!isSearching && searchResults.length === 0 && searchQuery" class="rounded-[2rem] bg-surface-container-lowest p-10 text-center ring-1 ring-white/5">
        <h3 class="font-display text-xl font-black text-on-surface">No results found</h3>
        <p class="mt-2 text-sm font-semibold text-on-surface-variant">Try adjusting your search terms or filters.</p>
      </div>

      <TransitionGroup name="post-fade" appear>
        <PostCard 
          v-for="post in searchResults" 
          :key="post.id" 
          :post="post" 
          :user-role="userRole"
          :user-id="userId"
          :applied-post-ids="appliedPostIds"
          @open="$emit('open-post', $event)"
          @apply="$emit('apply', $event)"
          @view-applicants="$emit('view-applicants', $event)"
        />
      </TransitionGroup>
      
    </section>
  </div>
</template>

<style scoped>
.post-fade-enter-active,
.post-fade-leave-active {
  transition: all 0.5s ease;
}

.post-fade-enter-from,
.post-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
