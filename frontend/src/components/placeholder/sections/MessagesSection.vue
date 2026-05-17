<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { PaperAirplaneIcon, ChatBubbleOvalLeftEllipsisIcon, MagnifyingGlassIcon, PhoneIcon, VideoCameraIcon } from '@heroicons/vue/24/outline'
import api from '@/lib/api'

const props = defineProps({
  userId: { type: String, required: true },
  userRole: { type: String, required: true }
})

const contacts = ref([])
const activeContact = ref(null)
const messages = ref([])
const newMessage = ref('')
const isLoadingContacts = ref(false)
const isLoadingMessages = ref(false)
const isSending = ref(false)
const chatContainer = ref(null)
const contactSearch = ref('')
const pollInterval = ref(null)

const filteredContacts = computed(() => {
  if (!contactSearch.value.trim()) return contacts.value
  const q = contactSearch.value.toLowerCase()
  return contacts.value.filter(c => c.name.toLowerCase().includes(q))
})

async function fetchContacts() {
  isLoadingContacts.value = true
  try {
    const { data } = await api.get('/messages/contacts')
    contacts.value = data || []
    if (contacts.value.length > 0 && !activeContact.value) {
      selectContact(contacts.value[0])
    }
  } catch (e) {
    console.error('Failed to load contacts:', e)
  } finally {
    isLoadingContacts.value = false
  }
}

async function fetchMessages(contactId) {
  isLoadingMessages.value = true
  try {
    const { data } = await api.get(`/messages/${contactId}`)
    messages.value = data || []
    scrollToBottom()
  } catch (e) {
    console.error('Failed to load messages:', e)
  } finally {
    isLoadingMessages.value = false
  }
}

function selectContact(contact) {
  activeContact.value = contact
  fetchMessages(contact.id)
}

async function sendMessage() {
  if (!newMessage.value.trim() || !activeContact.value || isSending.value) return
  const content = newMessage.value.trim()
  newMessage.value = ''
  isSending.value = true

  const tempMsg = {
    id: 'temp-' + Date.now(),
    senderId: props.userId,
    receiverId: activeContact.value.id,
    content,
    createdAt: new Date().toISOString()
  }
  messages.value.push(tempMsg)
  scrollToBottom()

  try {
    const { data } = await api.post('/messages', { receiverId: activeContact.value.id, content })
    const idx = messages.value.findIndex(m => m.id === tempMsg.id)
    if (idx !== -1) messages.value[idx] = data
    fetchContacts()
  } catch (e) {
    console.error('Failed to send:', e)
    messages.value = messages.value.filter(m => m.id !== tempMsg.id)
  } finally {
    isSending.value = false
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatLastTime(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now - d) / 86400000)
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'Yesterday'
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function getInitial(name) {
  return (name || '?').charAt(0).toUpperCase()
}

const avatarColors = ['#a78bfa', '#34d399', '#fb923c', '#60a5fa', '#f472b6', '#facc15']
function getAvatarColor(name) {
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

onMounted(() => {
  fetchContacts()
  pollInterval.value = setInterval(() => {
    if (activeContact.value) fetchMessages(activeContact.value.id)
    fetchContacts()
  }, 4000)
})

onUnmounted(() => {
  if (pollInterval.value) clearInterval(pollInterval.value)
})

watch(activeContact, () => scrollToBottom())
</script>

<template>
  <div class="grid h-[calc(100vh-8rem)] gap-0 overflow-hidden rounded-[2rem] bg-surface-container-low ring-1 ring-white/5 shadow-sm lg:grid-cols-[22rem_1fr]">

    <!-- ═══ CONTACTS SIDEBAR ═══ -->
    <aside class="flex flex-col border-r border-white/5 overflow-hidden">
      <!-- Header -->
      <div class="shrink-0 px-5 pt-5 pb-4">
        <h2 class="font-display text-xl font-black text-on-surface tracking-tight">Messages</h2>
        <p class="mt-0.5 text-xs font-semibold text-on-surface-variant/70">{{ contacts.length }} conversation{{ contacts.length !== 1 ? 's' : '' }}</p>

        <!-- Search -->
        <label class="mt-3 flex items-center gap-2 rounded-2xl bg-surface-container-high px-3 py-2.5 ring-1 ring-white/5 focus-within:ring-primary/50 transition-all">
          <MagnifyingGlassIcon class="h-4 w-4 shrink-0 text-on-surface-variant/60" />
          <input
            v-model="contactSearch"
            type="text"
            placeholder="Search conversations..."
            class="w-full bg-transparent text-sm font-semibold text-on-surface outline-none placeholder:text-on-surface-variant/50"
          />
        </label>
      </div>

      <!-- Contact List -->
      <div class="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        <div v-if="isLoadingContacts && contacts.length === 0" class="flex flex-col items-center py-12">
          <div class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p class="mt-3 text-xs font-bold text-on-surface-variant">Loading chats...</p>
        </div>

        <div v-else-if="contacts.length === 0" class="flex flex-col items-center justify-center py-16 text-center px-4">
          <ChatBubbleOvalLeftEllipsisIcon class="h-10 w-10 text-on-surface-variant/30" />
          <p class="mt-3 text-sm font-bold text-on-surface">No conversations yet</p>
          <p class="mt-1 text-xs text-on-surface-variant/70 leading-relaxed">
            {{ userRole === 'employer' ? 'Connect with talents to start chatting!' : 'Apply to jobs or connect with recruiters!' }}
          </p>
        </div>

        <button
          v-for="contact in filteredContacts"
          :key="contact.id"
          @click="selectContact(contact)"
          :class="[
            'w-full flex items-center gap-3 rounded-2xl p-3 text-left transition-all duration-150 outline-none group',
            activeContact?.id === contact.id
              ? 'bg-primary/15 ring-1 ring-primary/20'
              : 'hover:bg-surface-container-high'
          ]"
        >
          <!-- Avatar -->
          <div class="relative shrink-0">
            <img v-if="contact.avatar" :src="contact.avatar" class="h-11 w-11 rounded-full object-cover" alt="Avatar" />
            <div v-else class="grid h-11 w-11 place-items-center rounded-full text-base font-black text-white" :style="{ background: getAvatarColor(contact.name) }">
              {{ getInitial(contact.name) }}
            </div>
            <!-- Online indicator -->
            <span class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#4ade80] ring-2 ring-surface-container-low" />
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2">
              <span :class="['truncate text-sm font-black', activeContact?.id === contact.id ? 'text-primary' : 'text-on-surface']">
                {{ contact.name }}
              </span>
              <span class="shrink-0 text-[10px] font-semibold text-on-surface-variant/60">
                {{ contact.lastMessageAt ? formatLastTime(contact.lastMessageAt) : '' }}
              </span>
            </div>
            <p class="mt-0.5 truncate text-xs font-semibold text-on-surface-variant/70">
              {{ contact.lastMessage || 'Start the conversation…' }}
            </p>
          </div>
        </button>
      </div>
    </aside>

    <!-- ═══ CHAT PANEL ═══ -->
    <section class="flex flex-col overflow-hidden">

      <!-- Empty state -->
      <div v-if="!activeContact" class="flex h-full flex-col items-center justify-center gap-4 text-center p-8">
        <div class="grid h-20 w-20 place-items-center rounded-[1.5rem] bg-primary/10">
          <ChatBubbleOvalLeftEllipsisIcon class="h-10 w-10 text-primary/60 stroke-[1.25]" />
        </div>
        <div>
          <h3 class="font-display text-xl font-black text-on-surface">Select a conversation</h3>
          <p class="mt-1 text-sm text-on-surface-variant/70 max-w-xs">Choose from your contacts on the left to start messaging</p>
        </div>
      </div>

      <template v-else>
        <!-- Chat Header -->
        <div class="flex shrink-0 items-center justify-between border-b border-white/5 px-6 py-4 bg-surface-container-lowest/50 backdrop-blur-sm">
          <div class="flex items-center gap-3">
            <div class="relative">
              <img v-if="activeContact.avatar" :src="activeContact.avatar" class="h-10 w-10 rounded-full object-cover" alt="Avatar" />
              <div v-else class="grid h-10 w-10 place-items-center rounded-full text-sm font-black text-white" :style="{ background: getAvatarColor(activeContact.name) }">
                {{ getInitial(activeContact.name) }}
              </div>
              <span class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#4ade80] ring-2 ring-surface-container-low" />
            </div>
            <div>
              <h3 class="text-sm font-black text-on-surface">{{ activeContact.name }}</h3>
              <span class="text-[10px] font-bold text-[#4ade80] uppercase tracking-wider">● Active now</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button class="grid h-9 w-9 place-items-center rounded-full hover:bg-surface-container-high transition text-on-surface-variant">
              <PhoneIcon class="h-4.5 w-4.5" />
            </button>
            <button class="grid h-9 w-9 place-items-center rounded-full hover:bg-surface-container-high transition text-on-surface-variant">
              <VideoCameraIcon class="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        <!-- Messages Thread -->
        <div ref="chatContainer" class="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-gradient-to-b from-surface-container-lowest/10 to-transparent">
          <div v-if="isLoadingMessages && messages.length === 0" class="flex h-full items-center justify-center">
            <div class="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>

          <div v-else-if="messages.length === 0" class="flex h-full flex-col items-center justify-center gap-2 text-center">
            <p class="text-sm font-bold text-on-surface-variant">No messages yet</p>
            <p class="text-xs text-on-surface-variant/60">Be the first to say hello! 👋</p>
          </div>

          <TransitionGroup name="msg-slide" appear>
            <div
              v-for="msg in messages"
              :key="msg.id"
              :class="['flex', msg.senderId === props.userId ? 'justify-end' : 'justify-start']"
            >
              <!-- Received: avatar -->
              <div v-if="msg.senderId !== props.userId" class="flex items-end gap-2 max-w-[72%]">
                <div class="grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black text-white" :style="{ background: getAvatarColor(activeContact.name) }">
                  {{ getInitial(activeContact.name) }}
                </div>
                <div class="rounded-[1.25rem] rounded-tl-sm bg-surface-container-high px-4 py-3 text-sm font-semibold text-on-surface ring-1 ring-white/5 shadow-sm">
                  <p class="leading-relaxed">{{ msg.content }}</p>
                  <span class="mt-1 block text-[9px] font-semibold text-on-surface-variant/50">{{ formatTime(msg.createdAt) }}</span>
                </div>
              </div>

              <!-- Sent -->
              <div v-else class="max-w-[72%]">
                <div class="rounded-[1.25rem] rounded-tr-sm bg-primary px-4 py-3 text-sm font-semibold text-on-primary shadow-sm">
                  <p class="leading-relaxed">{{ msg.content }}</p>
                  <span class="mt-1 block text-[9px] font-semibold text-on-primary/60 text-right">{{ formatTime(msg.createdAt) }}</span>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Composer -->
        <div class="shrink-0 px-5 py-4 bg-surface-container-lowest/30 border-t border-white/5">
          <form @submit.prevent="sendMessage" class="flex items-center gap-3">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type a message..."
              class="flex-1 rounded-full bg-surface-container-high px-5 py-3 text-sm font-semibold text-on-surface outline-none placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/60 transition"
              @keydown.enter.exact.prevent="sendMessage"
            />
            <button
              type="submit"
              :disabled="!newMessage.trim() || isSending"
              class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-on-primary shadow-md transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon class="h-5 w-5 -rotate-45 relative left-0.5 -top-0.5" />
            </button>
          </form>
        </div>
      </template>
    </section>
  </div>
</template>

<style scoped>
.msg-slide-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.msg-slide-enter-from { opacity: 0; transform: translateY(12px) scale(0.96); }
</style>
