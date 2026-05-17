<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MagnifyingGlassIcon, UserCircleIcon, BuildingStorefrontIcon, AcademicCapIcon, BriefcaseIcon, CheckBadgeIcon } from '@heroicons/vue/24/outline'
import { usePostStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import PostCard from '../PostCard.vue'
import api from '@/lib/api'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const auth = useAuthStore()

// Tab: 'posts' | 'people'
const activeTab = ref('posts')
const searchQuery = ref(route.query.q?.toString() || '')
const searchRoleFilter = ref('All')
const searchResults = ref([])
const peopleResults = ref([])
const isSearching = ref(false)
const searchError = ref('')

defineEmits(['open-post', 'view-applicants', 'apply', 'engagement-change'])

const tabs = [
  { key: 'posts', label: 'Jobs & Posts' },
  { key: 'people', label: 'People' },
]

async function searchPosts() {
  if (!searchQuery.value.trim()) { searchResults.value = []; return }
  isSearching.value = true
  searchError.value = ''
  try {
    const { data } = await api.get('/posts', {
      params: { q: searchQuery.value, role: searchRoleFilter.value === 'All' ? undefined : searchRoleFilter.value.toLowerCase() }
    })
    searchResults.value = (data.posts || []).map(postStore.mapPost)
  } catch (e) {
    searchError.value = e.response?.data?.message || 'Failed to search posts.'
  } finally { isSearching.value = false }
}

async function searchPeople() {
  if (!searchQuery.value.trim()) { peopleResults.value = []; return }
  isSearching.value = true
  searchError.value = ''
  try {
    const { data } = await api.get('/user/search', { params: { q: searchQuery.value } })
    peopleResults.value = data || []
  } catch (e) {
    searchError.value = e.response?.data?.message || 'Failed to search users.'
  } finally { isSearching.value = false }
}

function runSearch() {
  if (activeTab.value === 'posts') searchPosts()
  else searchPeople()
}

function handleKeyEnter() {
  router.push({ query: { q: searchQuery.value } })
  runSearch()
}

watch(activeTab, () => { searchResults.value = []; peopleResults.value = []; runSearch() })
watch(() => route.query.q, (newQ) => { searchQuery.value = newQ?.toString() || ''; runSearch() })

onMounted(() => {
  postStore.fetchAppliedPosts()
  if (searchQuery.value) runSearch()
})

function getAvatarBg(name) {
  const colors = ['#a78bfa','#34d399','#fb923c','#60a5fa','#f472b6']
  let h = 0
  for (let i = 0; i < (name || '').length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return colors[Math.abs(h) % colors.length]
}
function getInitial(n) { return (n || '?').charAt(0).toUpperCase() }
</script>

<template>
  <div class="min-w-0 space-y-6">
    <!-- Search Bar -->
    <div class="rounded-[1.75rem] bg-surface-container-lowest p-5 shadow-sm ring-1 ring-white/5">
      <form @submit.prevent="handleKeyEnter" class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label class="flex flex-1 items-center gap-3 rounded-full bg-surface-container-high px-5 py-3 ring-1 ring-white/5 focus-within:ring-2 focus-within:ring-primary/60 transition">
          <MagnifyingGlassIcon class="h-4.5 w-4.5 shrink-0 text-on-surface-variant/60" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search jobs, posts, or people..."
            class="flex-1 bg-transparent text-sm font-bold text-on-surface outline-none placeholder:text-on-surface-variant/50"
          />
        </label>

        <div class="flex gap-2">
          <select
            v-model="searchRoleFilter"
            class="rounded-full bg-surface-container-high px-4 py-2.5 text-xs font-black text-on-surface outline-none ring-1 ring-white/5 focus:ring-2 focus:ring-primary/60 transition cursor-pointer"
          >
            <option>All</option>
            <option>Student</option>
            <option>Employer</option>
          </select>

          <button
            type="submit"
            class="rounded-full bg-primary px-6 py-2.5 text-xs font-black text-on-primary shadow-sm transition hover:opacity-90"
          >
            Search
          </button>
        </div>
      </form>

      <!-- Tabs -->
      <nav class="mt-4 flex gap-1">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'rounded-full px-5 py-2 text-xs font-black transition',
            activeTab === tab.key
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Loading -->
    <div v-if="isSearching" class="flex justify-center py-16">
      <div class="h-8 w-8 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
    </div>

    <!-- Error -->
    <p v-else-if="searchError" class="rounded-2xl bg-error-container px-4 py-3 text-sm font-bold text-on-error-container">
      {{ searchError }}
    </p>

    <!-- Posts Tab -->
    <template v-else-if="activeTab === 'posts'">
      <div v-if="!searchQuery.trim()" class="flex flex-col items-center justify-center py-20 text-center gap-3">
        <MagnifyingGlassIcon class="h-12 w-12 text-on-surface-variant/20 stroke-[1]" />
        <h3 class="font-display text-xl font-black text-on-surface">Find your next opportunity</h3>
        <p class="text-sm text-on-surface-variant max-w-sm">Search for jobs, internships, and posts from companies and students across Cambodia.</p>
      </div>

      <div v-else-if="!searchResults.length" class="flex flex-col items-center py-16 text-center gap-2">
        <p class="font-bold text-on-surface">No posts found for "{{ searchQuery }}"</p>
        <p class="text-sm text-on-surface-variant/70">Try different keywords or check People tab</p>
      </div>

      <TransitionGroup v-else name="fade-up" tag="div" class="space-y-4" appear>
        <PostCard
          v-for="post in searchResults"
          :key="post.id"
          :post="post"
          :user-role="auth.user?.role"
          :user-id="auth.user?.id"
          :applied-post-ids="postStore.appliedPostIds"
          @open="$emit('open-post', $event)"
          @apply="$emit('apply', $event)"
          @view-applicants="$emit('view-applicants', $event)"
          @engagement-change="$emit('engagement-change', $event)"
        />
      </TransitionGroup>
    </template>

    <!-- People Tab -->
    <template v-else-if="activeTab === 'people'">
      <div v-if="!searchQuery.trim()" class="flex flex-col items-center justify-center py-20 text-center gap-3">
        <UserCircleIcon class="h-12 w-12 text-on-surface-variant/20 stroke-[1]" />
        <h3 class="font-display text-xl font-black text-on-surface">Find people</h3>
        <p class="text-sm text-on-surface-variant max-w-sm">Search students, employers, and companies by name or username.</p>
      </div>

      <div v-else-if="!peopleResults.length" class="flex flex-col items-center py-16 text-center gap-2">
        <p class="font-bold text-on-surface">No people found for "{{ searchQuery }}"</p>
        <p class="text-sm text-on-surface-variant/70">Try searching by full name, company, or username</p>
      </div>

      <TransitionGroup v-else name="fade-up" tag="div" class="grid gap-3 sm:grid-cols-2" appear>
        <article
          v-for="person in peopleResults"
          :key="person.id"
          class="flex items-start gap-4 rounded-[1.5rem] bg-surface-container-lowest p-5 shadow-sm ring-1 ring-white/5 hover:ring-primary/20 transition-all cursor-pointer group"
        >
          <!-- Avatar -->
          <div class="shrink-0">
            <img v-if="person.avatar" :src="person.avatar" class="h-14 w-14 rounded-full object-cover ring-2 ring-white/10" alt="Avatar" />
            <div v-else class="grid h-14 w-14 place-items-center rounded-full text-xl font-black text-white ring-2 ring-white/10" :style="{ background: getAvatarBg(person.name) }">
              {{ getInitial(person.name) }}
            </div>
          </div>

          <!-- Info -->
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5">
              <h3 class="truncate text-sm font-black text-on-surface group-hover:text-primary transition">{{ person.name }}</h3>
              <span v-if="person.isVerified" title="Verified" class="text-primary">
                <CheckBadgeIcon class="h-4 w-4 shrink-0" />
              </span>
            </div>

            <p v-if="person.handle" class="text-[11px] font-semibold text-on-surface-variant/60">@{{ person.handle }}</p>

            <div class="mt-1.5 flex items-center gap-1.5 flex-wrap">
              <span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
                <component :is="person.role === 'employer' ? BuildingStorefrontIcon : AcademicCapIcon" class="h-3 w-3" />
                {{ person.role }}
              </span>
              <span v-if="person.university" class="text-[10px] font-semibold text-on-surface-variant/60">
                {{ person.university }}
              </span>
            </div>

            <p v-if="person.bio || person.skills?.length" class="mt-2 text-xs text-on-surface-variant/80 line-clamp-2 leading-relaxed">
              {{ person.bio || person.skills?.slice(0,4).join(' · ') }}
            </p>
          </div>
        </article>
      </TransitionGroup>
    </template>
  </div>
</template>

<style scoped>
.fade-up-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.2, 0.64, 1); }
.fade-up-enter-from { opacity: 0; transform: translateY(12px); }
</style>
