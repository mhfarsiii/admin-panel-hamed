<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Login Page (No Layout) -->
    <RouterView v-if="route.name === 'login'" />

    <!-- Admin Panel Layout -->
    <div v-else class="flex h-screen overflow-hidden">
      <!-- Sidebar -->
      <aside
        :class="sidebarOpen ? 'translate-x-[10px]' : '-translate-x-full'"
        class="fixed inset-y-0 right-0 z-50 w-64 text-black bg-gradient-to-b from-white via-white to-gray-50/50 shadow-2xl transform transition-transform translate-x-100 duration-300 ease-in-out lg:translate-x-0 lg:static border-l border-gray-200/50"
      >
        <div class="flex flex-col h-full backdrop-blur-sm">
          <!-- Logo -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200/60 bg-gradient-to-r from-primary-50/50 to-transparent">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-black">پنل ادمین</h1>
            </div>
            <button
              @click="sidebarOpen = false"
              class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 overflow-y-auto p-4">
            <ul class="space-y-2">
              <li>
                <router-link
                  to="/"
                  :class="route.name === 'dashboard'
                    ? 'bg-gradient-to-l from-primary-500 to-primary-600 text-blue-500 shadow-lg shadow-primary-500/30'
                    : 'text-gray-700 hover:bg-gradient-to-l hover:from-gray-50 hover:to-gray-100'"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group"
                  @click="sidebarOpen = false"
                >
                  <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>داشبورد</span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/products"
                  :class="route.path.startsWith('/products')
                    ? 'bg-gradient-to-l from-primary-500 to-primary-600 text-blue-500 shadow-lg shadow-primary-500/30'
                    : 'text-gray-700 hover:bg-gradient-to-l hover:from-gray-50 hover:to-gray-100'"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group"
                  @click="sidebarOpen = false"
                >
                  <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>محصولات</span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/categories"
                  :class="route.path.startsWith('/categories')
                    ? 'bg-gradient-to-l from-primary-500 to-primary-600 text-blue-500 shadow-lg shadow-primary-500/30'
                    : 'text-gray-700 hover:bg-gradient-to-l hover:from-gray-50 hover:to-gray-100'"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group"
                  @click="sidebarOpen = false"
                >
                  <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>دسته‌بندی‌ها</span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/orders"
                  :class="route.path.startsWith('/orders')
                    ? 'bg-gradient-to-l from-primary-500 to-primary-600 text-blue-500 shadow-lg shadow-primary-500/30'
                    : 'text-gray-700 hover:bg-gradient-to-l hover:from-gray-50 hover:to-gray-100'"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group"
                  @click="sidebarOpen = false"
                >
                  <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>سفارشات</span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/users"
                  :class="route.path.startsWith('/users')
                    ? 'bg-gradient-to-l from-primary-500 to-primary-600 text-blue-500 shadow-lg shadow-primary-500/30'
                    : 'text-gray-700 hover:bg-gradient-to-l hover:from-gray-50 hover:to-gray-100'"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group"
                  @click="sidebarOpen = false"
                >
                  <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>کاربران</span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/reviews"
                  :class="route.path.startsWith('/reviews')
                    ? 'bg-gradient-to-l from-primary-500 to-primary-600 text-blue-500 shadow-lg shadow-primary-500/30'
                    : 'text-gray-700 hover:bg-gradient-to-l hover:from-gray-50 hover:to-gray-100'"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group"
                  @click="sidebarOpen = false"
                >
                  <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <span>نظرات</span>
                </router-link>
              </li>
            </ul>
          </nav>

          <!-- User Section -->
          <div class="p-4 border-t border-gray-200/60 bg-gradient-to-t from-gray-50/50 to-transparent">
            <div class="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-sm">
              <div class="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <span class="text-black font-bold text-lg">
                  {{ authStore.userName?.charAt(0)?.toUpperCase() || 'A' }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">{{ authStore.userName }}</p>
                <p class="text-xs text-gray-500 truncate">{{ authStore.userEmail }}</p>
              </div>
            </div>
            <button
              @click="handleLogout"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-50 to-red-100 text-red-600 rounded-xl hover:from-red-100 hover:to-red-200 transition-all duration-200 font-medium shadow-sm hover:shadow-md border border-red-200/50"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>خروج</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-30">
          <div class="flex items-center justify-between px-6 py-4">
            <button
              @click="sidebarOpen = !sidebarOpen"
              class="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div class="flex items-center gap-3">
              <div class="px-4 py-2 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200/50">
                <div class="text-sm font-medium text-gray-700">
                  {{ new Date().toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto p-10">
          <RouterView />
        </main>
      </div>
    </div>

    <!-- Sidebar Overlay (Mobile) -->
    <div
      v-if="sidebarOpen && route.name !== 'login' "
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black/50 bg-opacity-50 z-40 lg:hidden"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// State
const sidebarOpen = ref(false)

/**
 * Handle logout
 */
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  sidebarOpen.value = false
}
</script>

<style scoped>
/* RTL support for sidebar */
aside {
  direction: rtl;
}
</style>
