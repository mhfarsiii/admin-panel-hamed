/**
 * Main application entry point
 */

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastPlugin from 'vue-toast-notification'
import ToastService from 'primevue/toastservice'

import App from './App.vue'
import router from './router'

// Create Vue app instance
const app = createApp(App)

// Create Pinia instance
const pinia = createPinia()

// Register plugins
app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(ToastPlugin)
app.use(ToastService)

// Mount app
app.mount('#app')
