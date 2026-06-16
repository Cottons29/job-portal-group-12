import { ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/stores/auth'
import { API_BASE } from '@/lib/api'

// Keep a single persistent socket instance across composable invocations
let socketInstance: Socket | null = null

export function useSocket() {
  const authStore = useAuthStore()
  const isConnected = ref(false)

  const getSocketUrl = () => {
    return API_BASE.replace(/\/api$/, '')
  }

  const connect = (): Socket | null => {
    // If instance already exists, make sure it connects and return it
    if (socketInstance) {
      if (!socketInstance.connected) {
        socketInstance.connect()
      }
      isConnected.value = socketInstance.connected
      return socketInstance
    }

    const userId = authStore.user?.id
    if (!userId) return null

    const url = getSocketUrl()
    socketInstance = io(url, {
      query: { userId },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketInstance.on('connect', () => {
      isConnected.value = true
      console.log('WebSocket connected successfully:', socketInstance?.id)
    })

    socketInstance.on('disconnect', () => {
      isConnected.value = false
      console.log('WebSocket disconnected')
    })

    socketInstance.on('connect_error', (err) => {
      isConnected.value = false
      console.error('WebSocket connection error:', err)
    })

    return socketInstance
  }

  const disconnect = () => {
    if (socketInstance) {
      socketInstance.disconnect()
      socketInstance = null
      isConnected.value = false
    }
  }

  return {
    socket: connect(),
    isConnected,
    connect,
    disconnect,
  }
}
