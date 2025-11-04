<template>
  <div class="not-found-view">
    <div class="text-center">
      <div class="mb-8">
        <svg
          class="w-32 h-32 text-gray-400 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">صفحه مورد نظر یافت نشد</h2>
      <p class="text-gray-600 mb-8">
        متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
      </p>

      <div class="flex items-center justify-center gap-4">
        <button
          @click="goBack"
          class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          بازگشت به صفحه قبل
        </button>
        <router-link
          to="/"
          class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          بازگشت به داشبورد
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * Go back to previous page
 */
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found-view {
  @apply min-h-screen flex items-center justify-center p-6;
}
</style>

