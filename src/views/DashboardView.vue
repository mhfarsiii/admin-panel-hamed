<template>
  <div class="dashboard-view animate-fade-in py-3">
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
          <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">داشبورد</h1>
          <p class="text-gray-600 flex items-center gap-2">
            <span class="text-primary-600 font-medium text-[12px] lg:text-[16px]">خوش آمدید،</span>
            <span class="font-semibold text-[12px] lg:text-[16px]">{{ authStore.userName }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="relative">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
        <div class="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-primary-400 opacity-20"></div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Products -->
      <div class="group bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-lg border border-blue-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center justify-between mb-4">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 mb-1">محصولات</p>
            <p class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{{ stats.totalProducts }}</p>
          </div>
          <div class="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <router-link to="/products" class="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 group-hover:gap-3 transition-all">
          مشاهده همه
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <!-- Total Orders -->
      <div class="group bg-gradient-to-br from-white to-green-50/30 rounded-2xl shadow-lg border border-green-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center justify-between mb-4">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 mb-1">سفارشات</p>
            <p class="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">{{ stats.totalOrders }}</p>
          </div>
          <div class="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <router-link to="/orders" class="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 group-hover:gap-3 transition-all">
          مشاهده همه
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <!-- Pending Orders -->
      <div class="group bg-gradient-to-br from-white to-yellow-50/30 rounded-2xl shadow-lg border border-yellow-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center justify-between mb-4">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 mb-1">سفارشات در انتظار</p>
            <p class="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">{{ stats.pendingOrders }}</p>
          </div>
          <div class="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <router-link to="/orders?status=PENDING" class="inline-flex items-center gap-2 text-sm font-semibold text-yellow-600 hover:text-yellow-700 group-hover:gap-3 transition-all">
          مشاهده همه
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <!-- Total Users -->
      <div class="group bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-lg border border-purple-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center justify-between mb-4">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 mb-1">کاربران</p>
            <p class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">{{ stats.totalUsers }}</p>
          </div>
          <div class="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <router-link to="/users" class="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 group-hover:gap-3 transition-all">
          مشاهده همه
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Orders -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div class="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-transparent">
          <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            آخرین سفارشات
          </h2>
        </div>
        <div v-if="ordersStore.isLoading" class="p-6">
          <div class="animate-pulse space-y-4">
            <div v-for="i in 5" :key="i" class="h-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl"></div>
          </div>
        </div>
        <div v-else-if="ordersStore.orders.length === 0" class="p-6 text-center text-gray-500">
          <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p class="text-sm">سفارشی موجود نیست</p>
        </div>
        <div v-else class="divide-y divide-gray-200/50">
          <div
            v-for="order in ordersStore.orders.slice(0, 5)"
            :key="order.id"
            class="p-4 hover:bg-gradient-to-l hover:from-primary-50/30 hover:to-transparent transition-all duration-200 group"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {{ order.orderNumber.slice(-2) }}
                </div>
                <div>
                  <router-link
                    :to="`/orders/${order.id}`"
                    class="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                  >
                    {{ order.orderNumber }}
                  </router-link>
                  <p class="text-sm text-gray-600 mt-1">{{ order.user.name }}</p>
                </div>
              </div>
              <div class="text-left">
                <p class="font-bold text-gray-900">{{ formatPrice(order.total) }}</p>
                <span
                  :class="getStatusBadgeClass(order.status)"
                  class="inline-block px-2.5 py-1 text-xs font-semibold rounded-full mt-1.5"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-transparent">
          <router-link
            to="/orders"
            class="block text-center text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            مشاهده همه سفارشات →
          </router-link>
        </div>
      </div>

      <!-- Pending Reviews -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div class="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-transparent">
          <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            نظرات در انتظار تایید
          </h2>
        </div>
        <div v-if="reviewsStore.isLoading" class="p-6">
          <div class="animate-pulse space-y-4">
            <div v-for="i in 5" :key="i" class="h-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl"></div>
          </div>
        </div>
        <div v-else-if="reviewsStore.pendingReviews.length === 0" class="p-6 text-center text-gray-500">
          <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <p class="text-sm">نظری در انتظار تایید نیست</p>
        </div>
        <div v-else class="divide-y divide-gray-200/50">
          <div
            v-for="review in reviewsStore.pendingReviews.slice(0, 5)"
            :key="review.id"
            class="p-4 hover:bg-gradient-to-l hover:from-primary-50/30 hover:to-transparent transition-all duration-200"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="font-semibold text-gray-900">{{ review.product.name }}</p>
                <p class="text-sm text-gray-600 mt-1">{{ review.user.name }}</p>
                <div class="flex items-center mt-2 gap-1">
                  <div class="flex">
                    <svg
                      v-for="i in 5"
                      :key="i"
                      :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
              <button
                @click="approveReview(review.id)"
                class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                تایید
              </button>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-transparent">
          <router-link
            to="/reviews"
            class="block text-center text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            مشاهده همه نظرات →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import { useOrdersStore } from '@/stores/orders'
import { useUsersStore } from '@/stores/users'
import { useReviewsStore } from '@/stores/reviews'
import type { OrderStatus } from '@/types/types'

// Stores
const authStore = useAuthStore()
const productsStore = useProductsStore()
const ordersStore = useOrdersStore()
const usersStore = useUsersStore()
const reviewsStore = useReviewsStore()

// Loading state
const isLoading = ref(true)

// Statistics
const stats = computed(() => ({
  totalProducts: productsStore.totalProducts,
  totalOrders: ordersStore.totalOrders,
  pendingOrders: ordersStore.pendingOrdersCount,
  totalUsers: usersStore.totalUsers,
}))

/**
 * Format price to Persian currency
 */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: 'IRR',
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Get status badge class
 */
const getStatusBadgeClass = (status: OrderStatus): string => {
  const classes: Record<OrderStatus, string> = {
    PENDING: 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200',
    CONFIRMED: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200',
    PROCESSING: 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border border-purple-200',
    SHIPPED: 'bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-800 border border-indigo-200',
    DELIVERED: 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200',
    CANCELLED: 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200',
    REFUNDED: 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200',
  }
  return classes[status] || 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200'
}

/**
 * Get status label in Persian
 */
const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    PENDING: 'در انتظار',
    CONFIRMED: 'تایید شده',
    PROCESSING: 'در حال پردازش',
    SHIPPED: 'ارسال شده',
    DELIVERED: 'تحویل داده شده',
    CANCELLED: 'لغو شده',
    REFUNDED: 'بازپرداخت شده',
  }
  return labels[status] || status
}

/**
 * Approve review
 */
const approveReview = async (reviewId: string) => {
  await reviewsStore.approveReview(reviewId)
}

/**
 * Fetch dashboard data
 */
const fetchDashboardData = async () => {
  isLoading.value = true

  try {
    await Promise.all([
      productsStore.fetchProducts({ limit: 1 }),
      ordersStore.fetchOrders({ limit: 10 }),
      usersStore.fetchUsers({ limit: 1 }),
      reviewsStore.fetchReviews({ approved: false, limit: 10 }),
    ])
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchDashboardData()
})
</script>

<!-- <style scoped>
.dashboard-view {
  @apply p-[1.5rem];
}
</style> -->



