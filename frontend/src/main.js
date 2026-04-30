import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

window.__setTestUser__ = (hasEmail = false, hasProfile = false) => {
  const store = useAuthStore()
  store.token = 'mock-test-token-123'
  // Mock missing email initially
  store.user = { 
    id: 1, 
    phone: '+85512345678', 
    email: hasEmail ? 'test@example.com' : null,
    profileCompleted: hasProfile
  }
}

app.mount('#app')
