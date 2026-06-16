import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  title?: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration?: number
}

const toasts = ref<Toast[]>([])

export function useToast() {
  const show = (
    message: string,
    options?: { title?: string; type?: Toast['type']; duration?: number }
  ) => {
    const id = Math.random().toString(36).substring(2, 9)
    const toast: Toast = {
      id,
      message,
      title: options?.title || 'Notification',
      type: options?.type || 'info',
      duration: options?.duration !== undefined ? options.duration : 4000,
    }
    toasts.value.push(toast)

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        remove(id)
      }, toast.duration)
    }
  }

  const remove = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toasts,
    show,
    remove,
  }
}
