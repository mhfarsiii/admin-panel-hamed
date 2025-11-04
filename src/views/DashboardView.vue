<template>
  <div class="dashboard-view">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">داشبورد</h1>
      <p class="text-gray-600">خوش آمدید، {{ authStore.userName }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <!-- Statistics Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Products -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">محصولات</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.totalProducts }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-full">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <router-link to="/products" class="text-sm text-blue-600 hover:text-blue-700">
            مشاهده همه →
          </router-link>
        </div>
      </div>

      <!-- Total Orders -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">سفارشات</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.totalOrders }}</p>
          </div>
          <div class="p-3 bg-green-100 rounded-full">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <router-link to="/orders" class="text-sm text-green-600 hover:text-green-700">
            مشاهده همه →
          </router-link>
        </div>
      </div>

      <!-- Pending Orders -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">سفارشات در انتظار</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.pendingOrders }}</p>
          </div>
          <div class="p-3 bg-yellow-100 rounded-full">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <router-link to="/orders?status=PENDING" class="text-sm text-yellow-600 hover:text-yellow-700">
            مشاهده همه →
          </router-link>
        </div>
      </div>

      <!-- Total Users -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">کاربران</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.totalUsers }}</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-full">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <router-link to="/users" class="text-sm text-purple-600 hover:text-purple-700">
            مشاهده همه →
          </router-link>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Orders -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">آخرین سفارشات</h2>
        </div>
        <div v-if="ordersStore.isLoading" class="p-6">
          <div class="animate-pulse space-y-4">
            <div v-for="i in 5" :key="i" class="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div v-else-if="ordersStore.orders.length === 0" class="p-6 text-center text-gray-500">
          سفارشی موجود نیست
        </div>
        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="order in ordersStore.orders.slice(0, 5)"
            :key="order.id"
            class="p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div>
                <router-link
                  :to="`/orders/${order.id}`"
                  class="font-medium text-gray-900 hover:text-primary-600"
                >
                  {{ order.orderNumber }}
                </router-link>
                <p class="text-sm text-gray-600 mt-1">{{ order.user.name }}</p>
              </div>
              <div class="text-left">
                <p class="font-medium text-gray-900">{{ formatPrice(order.total) }}</p>
                <span
                  :class="getStatusBadgeClass(order.status)"
                  class="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-gray-200">
          <router-link
            to="/orders"
            class="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            مشاهده همه سفارشات
          </router-link>
        </div>
      </div>

      <!-- Pending Reviews -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">نظرات در انتظار تایید</h2>
        </div>
        <div v-if="reviewsStore.isLoading" class="p-6">
          <div class="animate-pulse space-y-4">
            <div v-for="i in 5" :key="i" class="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div v-else-if="reviewsStore.pendingReviews.length === 0" class="p-6 text-center text-gray-500">
          نظری در انتظار تایید نیست
        </div>
        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="review in reviewsStore.pendingReviews.slice(0, 5)"
            :key="review.id"
            class="p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ review.product.name }}</p>
                <p class="text-sm text-gray-600 mt-1">{{ review.user.name }}</p>
                <div class="flex items-center mt-2">
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
                class="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded hover:bg-green-200 transition-colors"
              >
                تایید
              </button>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-gray-200">
          <router-link
            to="/reviews"
            class="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            مشاهده همه نظرات
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
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
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
  @apply p-6;
}
</style> -->

