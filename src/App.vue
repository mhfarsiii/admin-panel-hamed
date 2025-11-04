<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Login Page (No Layout) -->
    <RouterView v-if="route.name === 'login'" />

    <!-- Admin Panel Layout -->
    <div v-else class="flex h-screen overflow-hidden">
      <!-- Sidebar -->
      <aside
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
        class="fixed inset-y-0 right-0 z-50 w-64 text-black bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static"
      >
        <div class="flex flex-col h-full">
          <!-- Logo -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 class="text-2xl font-bold text-primary-600">پنل ادمین</h1>
            <button
              @click="sidebarOpen = false"
              class="lg:hidden p-2 rounded-lg hover:bg-gray-100"
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
                  :class="route.name === 'dashboard' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-100'"
                  class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                  @click="sidebarOpen = false"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>داشبورد</span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/products"
                  :class="route.path.startsWith('/products') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-100'"
                  class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                  @click="sidebarOpen = false"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>محصولات</span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/categories"
                  :class="route.path.startsWith('/categories') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-100'"
                  class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                  @click="sidebarOpen = false"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>دسته‌بندی‌ها</span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/orders"
                  :class="route.path.startsWith('/orders') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-100'"
                  class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                  @click="sidebarOpen = false"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>سفارشات</span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/users"
                  :class="route.path.startsWith('/users') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-100'"
                  class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                  @click="sidebarOpen = false"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>کاربران</span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/reviews"
                  :class="route.path.startsWith('/reviews') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-100'"
                  class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                  @click="sidebarOpen = false"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <span>نظرات</span>
                </router-link>
              </li>
            </ul>
          </nav>

          <!-- User Section -->
          <div class="p-4 border-t border-gray-200">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <!-- <span class="text-primary-600 font-semibold text-sm">
                  {{ authStore.userName.charAt(0) }}
                </span> -->
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ authStore.userName }}</p>
                <p class="text-xs text-gray-500 truncate">{{ authStore.userEmail }}</p>
              </div>
            </div>
            <button
              @click="handleLogout"
              class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
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
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="flex items-center justify-between px-6 py-4">
            <button
              @click="sidebarOpen = !sidebarOpen"
              class="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div class="text-sm text-gray-600">
              {{ new Date().toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
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
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
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
}
</script>

<style scoped>
/* RTL support for sidebar */
aside {
  direction: rtl;
}
</style>
