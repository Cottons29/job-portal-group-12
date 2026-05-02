import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import router from './router'
import {initializeThemeMode} from './composables/useThemeMode'
import {useAuthStore} from './stores/auth'

declare global {
    interface Window {
        __setTestUser__: (hasEmail?: boolean, hasProfile?: boolean) => void
    }
}

initializeThemeMode()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
    .use(router)

window.__setTestUser__ = (hasEmail = false, hasProfile = false) => {
    const store = useAuthStore()
    store.token = 'mock-test-token-123'
    // Mock missing email initially
    store.user = {
        id: "1",
        phone: '+85512345678',
        email: hasEmail ? 'test@example.com' : null,
        profileCompleted: hasProfile,
    }
}

router.isReady().then(() => {
    app.mount('#app')
})