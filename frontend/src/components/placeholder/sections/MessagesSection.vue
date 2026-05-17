<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { 
  PaperAirplaneIcon, 
  ChatBubbleOvalLeftEllipsisIcon,
  UserCircleIcon,
  BuildingStorefrontIcon
} from '@heroicons/vue/24/outline'
import api from '@/lib/api'

const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    required: true
  }
})

const contacts = ref([])
const activeContact = ref(null)
const messages = ref([])
const newMessage = ref('')
const isLoadingContacts = ref(false)
const isLoadingMessages = ref(false)
const isSending = ref(false)
const chatContainer = ref(null)

// Load unique chats/contacts list from the backend
async function fetchContacts() {
  isLoadingContacts.value = true
  try {
    const { data } = await api.get('/messages/contacts')
    contacts.value = data || []
    
    // Auto-select first contact if none selected
    if (contacts.value.length > 0 && !activeContact.value) {
      selectContact(contacts.value[0])
    }
  } catch (error) {
    console.error('Failed to load contacts:', error)
  } finally {
    isLoadingContacts.value = false
  }
}

// Load message log with active contact
async function fetchMessages(contactId) {
  isLoadingMessages.value = true
  try {
    const { data } = await api.get(`/messages/${contactId}`)
    messages.value = data || []
    scrollToBottom()
  } catch (error) {
    console.error('Failed to load messages:', error)
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

  // Optimistic UI update
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
    const { data } = await api.post('/messages', {
      receiverId: activeContact.value.id,
      content
    })
    
    // Replace optimistic message with actual DB record
    const idx = messages.value.findIndex(m => m.id === tempMsg.id)
    if (idx !== -1) {
      messages.value[idx] = data
    }
    
    // Refresh contact last message
    fetchContacts()
  } catch (error) {
    console.error('Failed to send message:', error)
    // Remove optimistic message if fail
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

// Short-poll for real-time messaging simulation
let pollInterval = null
onMounted(() => {
  fetchContacts()
  pollInterval = setInterval(() => {
    if (activeContact.value) {
      fetchMessages(activeContact.value.id)
    }
    fetchContacts()
  }, 4000)
})

watch(activeContact, () => {
  scrollToBottom()
})
</script>

<template>
  <div class="grid h-[calc(100vh-8.5rem)] gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
    <!-- Contacts Sidebar -->
    <aside class="flex flex-col rounded-[2rem] bg-surface-container-low p-4 shadow-sm ring-1 ring-white/5">
      <div class="px-3 py-2">
        <h2 class="font-display text-xl font-black text-on-surface">Conversations</h2>
        <p class="text-xs font-bold text-on-surface-variant/80">Connect with local partners & talents</p>
      </div>

      <div class="mt-4 flex-1 overflow-y-auto space-y-2 pr-1">
        <div v-if="isLoadingContacts && contacts.length === 0" class="flex flex-col items-center py-10">
          <div class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p class="mt-2 text-xs font-semibold text-on-surface-variant">Loading chats...</p>
        </div>

        <div v-else-if="contacts.length === 0" class="flex flex-col items-center justify-center py-20 text-center px-4">
          <ChatBubbleOvalLeftEllipsisIcon class="h-10 w-10 text-on-surface-variant/40" />
          <p class="mt-3 text-sm font-bold text-on-surface">No conversations yet</p>
          <p class="mt-1 text-xs text-on-surface-variant/80">
            {{ userRole === 'employer' 
              ? 'Shortlist students from applications or recommended talents to start messaging!' 
              : 'Apply to flexible student jobs or connect with recruiters to begin chatting!' 
            }}
          </p>
        </div>

        <button
          v-else
          v-for="contact in contacts"
          :key="contact.id"
          @click="selectContact(contact)"
          :class="[
            'w-full flex items-center gap-3 rounded-2xl p-3 text-left transition duration-200 outline-none',
            activeContact?.id === contact.id
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container-lowest hover:bg-surface-container-lowest/80 text-on-surface ring-1 ring-white/5'
          ]"
        >
          <div class="relative shrink-0">
            <img
              v-if="contact.avatar"
              :src="contact.avatar"
              class="h-11 w-11 rounded-full object-cover"
              alt="Avatar"
            />
            <div 
              v-else 
              :class="[
                'grid h-11 w-11 place-items-center rounded-full text-sm font-black',
                activeContact?.id === contact.id ? 'bg-on-primary text-primary' : 'bg-[#d7b7ff] text-[#6a39b8]'
              ]"
            >
              {{ contact.name.charAt(0).toUpperCase() }}
            </div>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between">
              <span class="truncate text-sm font-black">{{ contact.name }}</span>
              <span 
                :class="[
                  'text-[10px] font-semibold',
                  activeContact?.id === contact.id ? 'text-on-primary/80' : 'text-on-surface-variant/70'
                ]"
              >
                {{ new Date(contact.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
              </span>
            </div>
            <p 
              :class="[
                'truncate text-xs font-semibold mt-0.5',
                activeContact?.id === contact.id ? 'text-on-primary/80' : 'text-on-surface-variant/90'
              ]"
            >
              {{ contact.lastMessage }}
            </p>
          </div>
        </button>
      </div>
    </aside>

    <!-- Chat View Area -->
    <section class="flex flex-col rounded-[2rem] bg-surface-container-low shadow-sm ring-1 ring-white/5 overflow-hidden">
      <!-- Active Header -->
      <div v-if="activeContact" class="flex items-center justify-between border-b border-white/5 px-6 py-4 bg-surface-container-lowest/40 backdrop-blur-sm">
        <div class="flex items-center gap-3">
          <img
            v-if="activeContact.avatar"
            :src="activeContact.avatar"
            class="h-10 w-10 rounded-full object-cover"
            alt="Avatar"
          />
          <div v-else class="grid h-10 w-10 place-items-center rounded-full bg-[#ffc28e] text-sm font-black text-[#83460e]">
            {{ activeContact.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h3 class="text-sm font-black text-on-surface">{{ activeContact.name }}</h3>
            <span class="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#8fd99b]">
              <span class="h-1.5 w-1.5 rounded-full bg-[#8fd99b] animate-ping" />
              Active
            </span>
          </div>
        </div>
      </div>

      <!-- Messages Thread -->
      <div 
        ref="chatContainer"
        class="flex-1 overflow-y-auto p-6 space-y-4 bg-surface-container-lowest/15"
      >
        <div v-if="!activeContact" class="flex h-full flex-col items-center justify-center text-center">
          <ChatBubbleOvalLeftEllipsisIcon class="h-16 w-16 text-on-surface-variant/30 stroke-[1.25]" />
          <h3 class="mt-4 font-display text-lg font-black text-on-surface">Your inbox is ready</h3>
          <p class="mt-1 text-xs text-on-surface-variant/80 max-w-xs">
            Select a connection from the left sidebar panel to load message logs and start coordinating.
          </p>
        </div>

        <div v-else-if="isLoadingMessages && messages.length === 0" class="flex h-full items-center justify-center">
          <div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="msg in messages" 
            :key="msg.id"
            :class="['flex', msg.senderId === userId ? 'justify-end' : 'justify-start']"
          >
            <div 
              :class="[
                'max-w-[70%] rounded-[1.25rem] px-4 py-3 text-sm font-semibold leading-relaxed shadow-sm',
                msg.senderId === userId
                  ? 'bg-primary text-on-primary rounded-tr-none'
                  : 'bg-surface-container-high text-on-surface rounded-tl-none ring-1 ring-white/5'
              ]"
            >
              <p>{{ msg.content }}</p>
              <span 
                :class="[
                  'block text-[9px] font-semibold mt-1 text-right',
                  msg.senderId === userId ? 'text-on-primary/70' : 'text-on-surface-variant/60'
                ]"
              >
                {{ new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Outbound Message Composer -->
      <div v-if="activeContact" class="p-4 bg-surface-container-lowest/30 border-t border-white/5">
        <form @submit.prevent="sendMessage" class="flex items-center gap-3">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 rounded-full bg-surface-container-low px-5 py-3 text-sm font-bold text-on-surface outline-none placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary transition"
          />
          <button
            type="submit"
            :disabled="!newMessage.trim() || isSending"
            class="grid h-11 w-11 place-items-center rounded-full bg-primary text-on-primary transition hover:opacity-90 disabled:opacity-50 shadow-md shrink-0"
          >
            <PaperAirplaneIcon class="h-5 w-5 -rotate-45 relative left-0.5 -top-0.5" />
          </button>
        </form>
      </div>
    </section>
  </div>
</template>
