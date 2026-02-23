<template>
  <div class="login-view min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans" dir="ltr">

    <!-- Left Section: Form -->
    <div class="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 z-10">
      <div class="w-full max-w-md space-y-8    rounded-3xl    px-6 py-8 md:px-8 md:py-10">
        <!-- Logo & Header -->
        <div class="text-left">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Moramor Panel</h1>
          </div>
          <p class="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed">
            Welcome back! Please log in to your account.
          </p>
        </div>

        <!-- Login Form Card -->
        <div class="mt-8">
          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Email -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
              <div class="relative group">
                <input
                  v-model="form.email"
                  type="email"
                  required
                  autocomplete="email"
                  class="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-900 focus:border-transparent transition-all outline-none"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <div class="flex justify-between items-center px-1">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
              </div>
              <div class="relative group">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  autocomplete="current-password"
                  class="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-900 focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <transition name="fade">
              <div v-if="authStore.error" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                {{ authStore.error }}
              </div>
            </transition>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="relative w-full overflow-hidden px-6 py-4 bg-blue-500 dark:bg-primary-500 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 dark:hover:bg-primary-400 transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-primary-500/20"
            >
              <div v-if="authStore.isLoading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Authenticating...</span>
              </div>
              <span v-else>Sign In</span>
            </button>
          </form>
        </div>

        <!-- Role Alert -->
        <div class="mt-8 flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl">
           <svg class="w-5 h-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           <p class="text-xs leading-relaxed text-blue-800 dark:text-blue-400">
             <strong>Note:</strong> Only users with <span class="font-bold underline">ADMIN</span> or <span class="font-bold underline">SUPER_ADMIN</span> roles can access this panel.
           </p>
        </div>

        <!-- Footer -->
        <p class="mt-auto text-center text-gray-400 dark:text-gray-500 text-[11px] md:text-xs">
          © 2026 Moramor. All rights reserved.
        </p>
      </div>
    </div>

    <!-- Right Section: Illustration/Graphic -->
    <div class="hidden md:flex flex-1 relative overflow-hidden " :style="{backgroundImage:'url(/img/87nbv.jpg)',backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat'}">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginRequest } from '@/types/types'

const router = useRouter()
const authStore = useAuthStore()

// State
const form = ref<LoginRequest>({
  email: '',
  password: '',
})

const showPassword = ref(false)

/**
 * Handle login
 */
const handleLogin = async () => {
  try {
    await authStore.login(form.value)

    if (authStore.success && authStore.isAuthenticated) {
      await nextTick()
      const redirect = router.currentRoute.value.query.redirect as string || '/'
      router.replace(redirect)
    }
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<style scoped>
/* Smooth page entry animation */
.login-view {
  animation: pageEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes pageEnter {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Floating animation for the illustration */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

/* Error message fade transition */
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom scrollbar if needed */
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>
