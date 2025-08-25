import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import App from './App.vue'
import router from './router'
import ToastPlugin from 'vue-toast-notification'
import ToastService from 'primevue/toastservice'
import axios from 'axios'
import { initializeAuth, removeAuthToken } from './utils/auth'

// Extend Window interface
declare global {
  interface Window {
    setAuthToken: (token: string | null) => void
  }
}

// Initialize authentication state
initializeAuth()

// Add axios response interceptor to handle authentication errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      removeAuthToken()
      // Redirect to login page
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(router)
app.use(PrimeVue)
app.use(ToastPlugin)
app.use(ToastService)

app.mount('#app')
