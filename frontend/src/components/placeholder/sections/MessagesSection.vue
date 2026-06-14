<script setup>
  import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
  import { 
    PaperAirplaneIcon, 
    ChatBubbleOvalLeftEllipsisIcon, 
    MagnifyingGlassIcon, 
    PhoneIcon, 
    VideoCameraIcon,
    PaperClipIcon,
    ArrowDownTrayIcon,
    DocumentIcon,
    PhotoIcon,
    XMarkIcon
  } from '@heroicons/vue/24/outline'
  import api, { resolveUrl } from '@/lib/api'
  import { useAuthStore } from '@/stores/auth'
  import { useSocket } from '@/composables/useSocket'

  const props = defineProps({
    userId: { type: String, required: true },
    userRole: { type: String, required: true },
    initialChatUserId: { type: String, default: null }
  })

  const emit = defineEmits(['chat-initialized'])

  const authStore = useAuthStore()
  const { socket } = useSocket()

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

  async function selectInitialOrFirstContact() {
    if (props.initialChatUserId) {
      const existing = contacts.value.find(c => c.id === props.initialChatUserId)
      if (existing) {
        selectContact(existing)
        emit('chat-initialized')
      } else {
        try {
          const { data } = await api.get(`/profile/${props.initialChatUserId}`)
          if (data && data.profile) {
            const u = data.profile
            const isEmp = u.user?.role?.toLowerCase() === 'employer' || u.companyName
            const name = isEmp
              ? u.companyName || u.user_name || 'Employer'
              : u.fullName || u.user_name || 'Student'
            const avatar = isEmp ? u.logoUrl : u.profileImageUrl

            const newContact = {
              id: u.id,
              name,
              avatar,
              lastMessage: null,
              lastMessageAt: null
            }
            contacts.value.unshift(newContact)
            selectContact(newContact)
          }
        } catch (err) {
          console.error('Failed to load initial chat user:', err)
          if (contacts.value.length > 0) {
            selectContact(contacts.value[0])
          }
        } finally {
          emit('chat-initialized')
        }
      }
    } else if (contacts.value.length > 0 && !activeContact.value) {
      selectContact(contacts.value[0])
    }
  }

  async function fetchContacts() {
    isLoadingContacts.value = true
    try {
      const { data } = await api.get('/messages/contacts')
      contacts.value = data || []
      await selectInitialOrFirstContact()
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

  const pendingAttachment = ref(null)

  async function sendMessage() {
    if (!authStore.user?.profileCompleted) {
      alert('Profile Setup Required: Please complete your profile in Settings first to unlock messaging.')
      return
    }
    const hasText = newMessage.value.trim()
    const hasAttach = pendingAttachment.value
    
    if (!hasText && !hasAttach) return
    if (!activeContact.value || isSending.value) return
    isSending.value = true
    
    try {
      // 1. Send attachment first if present
      if (hasAttach) {
        const content = hasAttach.type === 'image'
          ? `[IMAGE] ${hasAttach.url}`
          : `[FILE] ${hasAttach.url}|${hasAttach.name}|${hasAttach.size}`
          
        const { data } = await api.post('/messages', {
          receiverId: activeContact.value.id,
          content
        })
        messages.value.push(data)
        pendingAttachment.value = null
      }
      
      // 2. Send text message if present
      if (hasText) {
        const content = hasText
        newMessage.value = ''
        const { data } = await api.post('/messages', {
          receiverId: activeContact.value.id,
          content
        })
        messages.value.push(data)
      }
      
      scrollToBottom()
      fetchContacts()
    } catch (e) {
      console.error('Failed to send:', e)
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
    
    // Register socket listener for real-time incoming messages
    if (socket) {
      socket.on('message.received', (msg) => {
        // If message is related to current chat thread, append it
        if (activeContact.value && (msg.senderId === activeContact.value.id || msg.receiverId === activeContact.value.id)) {
          // Avoid duplicate messages
          if (!messages.value.some(m => m.id === msg.id)) {
            messages.value.push(msg)
            scrollToBottom()
          }
        }
        
        // Refresh contact list/previews in real-time
        fetchContacts()
      })
    }

    // fallback background polling every 15 seconds
    pollInterval.value = setInterval(() => {
      fetchContacts()
    }, 15000)
  })

  onUnmounted(() => {
    if (pollInterval.value) clearInterval(pollInterval.value)
    if (socket) {
      socket.off('message.received')
    }
  })

  watch(activeContact, () => scrollToBottom())
  watch(() => props.initialChatUserId, (newId) => {
    if (newId) {
      selectInitialOrFirstContact()
    }
  })

  const fileInput = ref(null)
  const isUploadingFile = ref(false)
  const lightboxImage = ref(null)

  function openImageModal(url) {
    lightboxImage.value = url
  }

  function parseMessage(content) {
    if (!content) return { type: 'text', text: '' }
    if (content.startsWith('[IMAGE]')) {
      return {
        type: 'image',
        url: content.substring(7).trim()
      }
    } else if (content.startsWith('[FILE]')) {
      const parts = content.substring(6).trim().split('|')
      return {
        type: 'file',
        url: parts[0] || '',
        name: parts[1] || 'Document',
        size: parts[2] || 'Unknown size'
      }
    }
    return {
      type: 'text',
      text: content
    }
  }

  function formatLastMessage(content) {
    if (!content) return 'Start the conversation…'
    if (content.startsWith('[IMAGE]')) return '📷 Sent a photo'
    if (content.startsWith('[FILE]')) {
      const parts = content.substring(6).trim().split('|')
      return `📁 ${parts[1] || 'Shared a file'}`
    }
    return content
  }

  async function handleFileUpload(event) {
    const target = event.target
    if (!target.files || target.files.length === 0 || !activeContact.value) return
    const file = target.files[0]
    
    isUploadingFile.value = true
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const { data } = await api.post('/upload/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      const fileUrl = data.file.url
      const originalName = data.file.originalname
      const isImg = file.type.startsWith('image/')
      
      let sizeStr = `${(file.size / 1024).toFixed(1)} KB`
      if (file.size > 1024 * 1024) {
        sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      }
      
      pendingAttachment.value = {
        url: fileUrl,
        name: originalName,
        size: sizeStr,
        type: isImg ? 'image' : 'file'
      }
    } catch (err) {
      console.error('Failed to upload file:', err)
    } finally {
      isUploadingFile.value = false
      if (fileInput.value) fileInput.value.value = ''
    }
  }

  const mediaInput = ref(null)

  async function handleMediaUpload(event) {
    const target = event.target
    if (!target.files || target.files.length === 0 || !activeContact.value) return
    const file = target.files[0]
    
    isUploadingFile.value = true
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const { data } = await api.post('/upload/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      const fileUrl = data.file.url
      const originalName = data.file.originalname
      
      let sizeStr = `${(file.size / 1024).toFixed(1)} KB`
      if (file.size > 1024 * 1024) {
        sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      }
      
      pendingAttachment.value = {
        url: fileUrl,
        name: originalName,
        size: sizeStr,
        type: 'image'
      }
    } catch (err) {
      console.error('Failed to upload media:', err)
    } finally {
      isUploadingFile.value = false
      if (mediaInput.value) mediaInput.value.value = ''
    }
  }
</script>

<template>
<div class="grid flex-1 min-h-0 gap-0 overflow-hidden rounded-3xl border border-on-surface/10 bg-surface-container-lowest shadow-sm lg:grid-cols-[22.5rem_1fr] relative">

  <!-- ═══ CONTACTS SIDEBAR ═══ -->
  <aside class="flex flex-col border-r border-white/5 overflow-hidden">
    <!-- Header -->
    <div class="shrink-0 px-5 pt-5 pb-4">
      <h2 class="font-display text-xl font-black text-on-surface tracking-tight">Messages</h2>
      <p class="mt-0.5 text-xs font-semibold text-on-surface-variant/70">{{ contacts.length }} conversation{{ contacts.length !== 1 ? 's' : '' }}</p>

      <!-- Search -->
      <label class="mt-3 flex items-center gap-2.5 rounded-full bg-surface-container-low px-4 py-2 border border-on-surface/5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
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
            'w-full flex items-center gap-3 p-3.5 text-left transition-all duration-150 outline-none group border-b border-on-surface/5',
            activeContact?.id === contact.id
              ? 'bg-primary/[0.04] border-l-4 border-primary pl-2.5'
              : 'hover:bg-surface-container-low border-l-4 border-transparent pl-2.5'
          ]"
      >
        <!-- Avatar -->
        <div class="relative shrink-0">
          <img v-if="contact.avatar" :src="resolveUrl(contact.avatar)" class="h-11 w-11 rounded-full object-cover" alt="Avatar" />
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
            {{ formatLastMessage(contact.lastMessage) }}
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
      <div class="flex shrink-0 items-center justify-between border-b border-on-surface/10 px-6 py-4 bg-surface-container-lowest">
        <div class="flex items-center gap-3">
          <div class="relative">
            <img v-if="activeContact.avatar" :src="resolveUrl(activeContact.avatar)" class="h-10 w-10 rounded-full object-cover border border-on-surface/5" alt="Avatar" />
            <div v-else class="grid h-10 w-10 place-items-center rounded-full text-sm font-black text-white" :style="{ background: getAvatarColor(activeContact.name) }">
              {{ getInitial(activeContact.name) }}
            </div>
            <span class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#4ade80] ring-2 ring-surface-container-lowest" />
          </div>
          <div>
            <h3 class="text-sm font-black text-on-surface leading-tight">{{ activeContact.name }}</h3>
            <span class="text-[10px] font-bold text-[#4ade80] uppercase tracking-wider mt-0.5 block">● Active now</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="grid h-10 w-10 place-items-center rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition">
            <PhoneIcon class="h-4.5 w-4.5" />
          </button>
          <button class="grid h-10 w-10 place-items-center rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition">
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
            <div v-if="msg.senderId !== props.userId" class="flex items-end gap-2.5 max-w-[75%]">
              <div class="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black text-white shadow-sm" :style="{ background: getAvatarColor(activeContact.name) }">
                {{ getInitial(activeContact.name) }}
              </div>
              
              <div v-if="parseMessage(msg.content).type === 'image'" class="overflow-hidden rounded-2xl shadow-md border border-on-surface/5 hover:opacity-95 transition cursor-pointer max-w-xs">
                <img :src="resolveUrl(parseMessage(msg.content).url)" class="max-h-60 w-full object-cover" @click="openImageModal(parseMessage(msg.content).url)" alt="Shared photo" />
              </div>
              
              <div v-else-if="parseMessage(msg.content).type === 'file'" class="flex items-center gap-3 rounded-2xl bg-surface-container-high p-3.5 border border-on-surface/10 max-w-xs shadow-sm">
                <div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <DocumentIcon class="h-5 w-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-xs font-bold text-on-surface leading-tight max-w-[12rem]">{{ parseMessage(msg.content).name }}</p>
                  <p class="text-[10px] font-semibold text-on-surface-variant/70 mt-0.5">{{ parseMessage(msg.content).size }}</p>
                </div>
                <a :href="resolveUrl(parseMessage(msg.content).url)" target="_blank" download class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-container-highest text-on-surface-variant hover:bg-on-surface hover:text-surface-container-lowest transition-all">
                  <ArrowDownTrayIcon class="h-4.5 w-4.5" />
                </a>
              </div>
              
              <div v-else class="rounded-[1.25rem] rounded-tl-sm bg-surface-container-high px-4 py-3 text-sm font-semibold text-on-surface ring-1 ring-white/5 shadow-sm border border-on-surface/5">
                <p class="leading-relaxed font-medium">{{ msg.content }}</p>
                <span class="mt-1 block text-[9px] font-semibold text-on-surface-variant/50">{{ formatTime(msg.createdAt) }}</span>
              </div>
            </div>

            <!-- Sent -->
            <div v-else class="max-w-[75%]">
              <div v-if="parseMessage(msg.content).type === 'image'" class="overflow-hidden rounded-2xl shadow-md border border-primary/20 hover:opacity-95 transition cursor-pointer max-w-xs">
                <img :src="resolveUrl(parseMessage(msg.content).url)" class="max-h-60 w-full object-cover" @click="openImageModal(parseMessage(msg.content).url)" alt="Shared photo" />
              </div>
              
              <div v-else-if="parseMessage(msg.content).type === 'file'" class="flex items-center gap-3 rounded-2xl bg-primary/10 p-3.5 border border-primary/20 max-w-xs shadow-sm text-on-surface">
                <div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-on-primary">
                  <DocumentIcon class="h-5 w-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-xs font-bold text-on-surface leading-tight max-w-[12rem]">{{ parseMessage(msg.content).name }}</p>
                  <p class="text-[10px] font-semibold text-on-surface-variant/70 mt-0.5">{{ parseMessage(msg.content).size }}</p>
                </div>
                <a :href="resolveUrl(parseMessage(msg.content).url)" target="_blank" download class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-on-primary transition-all">
                  <ArrowDownTrayIcon class="h-4.5 w-4.5" />
                </a>
              </div>
              
              <div v-else class="rounded-[1.25rem] rounded-tr-sm bg-primary px-4 py-3 text-sm font-semibold text-on-primary shadow-sm">
                <p class="leading-relaxed font-medium">{{ msg.content }}</p>
                <span class="mt-1 block text-[9px] font-semibold text-on-primary/60 text-right">{{ formatTime(msg.createdAt) }}</span>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Composer -->
      <div class="shrink-0 px-5 py-4 bg-surface-container-lowest border-t border-on-surface/10">
        <!-- Pending Attachment Preview -->
        <div v-if="pendingAttachment" class="mb-3 flex items-center justify-between gap-3 rounded-2xl bg-surface-container-high/90 p-3 border border-on-surface/10 shadow-sm animate-fade-in">
          <div class="flex items-center gap-3 min-w-0">
            <!-- Icon/Preview -->
            <div class="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-primary/10 text-primary grid place-items-center">
              <img v-if="pendingAttachment.type === 'image'" :src="resolveUrl(pendingAttachment.url)" class="h-full w-full object-cover" />
              <DocumentIcon v-else class="h-5 w-5" />
            </div>
            <!-- Details -->
            <div class="min-w-0">
              <p class="truncate text-xs font-bold text-on-surface">{{ pendingAttachment.name }}</p>
              <p class="text-[10px] font-semibold text-on-surface-variant/60 mt-0.5">{{ pendingAttachment.size }}</p>
            </div>
          </div>
          <!-- Remove button -->
          <button type="button" @click="pendingAttachment = null" class="grid h-8 w-8 place-items-center rounded-full hover:bg-surface-container-highest transition text-on-surface-variant">
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>

        <form @submit.prevent="sendMessage" class="flex items-center gap-2">
          <!-- Hidden File Input -->
          <input
              type="file"
              ref="fileInput"
              class="hidden"
              @change="handleFileUpload"
          />
          <!-- Hidden Media Input -->
          <input
              type="file"
              ref="mediaInput"
              class="hidden"
              accept="image/*,video/*"
              @change="handleMediaUpload"
          />
          
          <!-- Upload trigger buttons -->
          <div class="flex items-center gap-1 shrink-0">
            <!-- Media Upload trigger button -->
            <button
                type="button"
                :disabled="isUploadingFile"
                @click="$refs.mediaInput.click()"
                class="grid h-10 w-10 place-items-center rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Send Photo/Video"
            >
              <PhotoIcon class="h-5 w-5" />
            </button>
            
            <!-- File Upload trigger button -->
            <button
                type="button"
                :disabled="isUploadingFile"
                @click="$refs.fileInput.click()"
                class="grid h-10 w-10 place-items-center rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Send File"
            >
              <div v-if="isUploadingFile" class="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <PaperClipIcon v-else class="h-5 w-5" />
            </button>
          </div>

          <input
              v-model="newMessage"
              type="text"
              placeholder="Type a message..."
              class="flex-1 rounded-xl bg-surface-container-low border border-on-surface/5 px-4 py-2.5 text-sm font-medium text-on-surface outline-none placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              @keydown.enter.exact.prevent="sendMessage"
          />
          <button
              type="submit"
              :disabled="(!newMessage.trim() && !pendingAttachment) || isSending"
              class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-on-primary shadow-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <PaperAirplaneIcon class="h-4.5 w-4.5 -rotate-45 relative left-0.5" />
          </button>
        </form>
      </div>
    </template>
  </section>

  <!-- Image Lightbox Modal -->
  <div v-if="lightboxImage" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" @click="lightboxImage = null">
    <div class="relative max-h-screen max-w-screen-lg">
      <img :src="resolveUrl(lightboxImage)" class="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl" />
      <button @click="lightboxImage = null" class="absolute -top-12 right-0 text-white hover:text-gray-300 font-bold text-lg bg-black/40 px-3 py-1 rounded-full">
        Close
      </button>
    </div>
  </div>
</div>
</template>

<style scoped>
.msg-slide-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.msg-slide-enter-from { opacity: 0; transform: translateY(12px) scale(0.96); }
</style>
