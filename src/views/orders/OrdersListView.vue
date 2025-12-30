<template>
  <div class="orders-list-view text-black dark:text-gray-100 animate-fade-in">
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 dark:shadow-primary-600/30">
          <svg class="w-6 h-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div>
          <h1 class="text-[14px] lg:text-3xl font-bold text-gray-900 dark:text-gray-100">مدیریت سفارشات</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1 text-[12px] lg:text-[15px] flex items-center gap-2">
            <span class="w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-full animate-pulse"></span>
            {{ ordersStore.totalOrders }} سفارش
          </p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">وضعیت سفارش</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-[12px] lg:text-[15px] rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 transition-all shadow-sm hover:shadow-md"
            @change="fetchOrders"
          >
            <option value="" selected>همه وضعیت‌ها</option>
            <option value="PENDING">در انتظار</option>
            <option value="CONFIRMED">تایید شده</option>
            <option value="PROCESSING">در حال پردازش</option>
            <option value="SHIPPED">ارسال شده</option>
            <option value="DELIVERED">تحویل داده شده</option>
            <option value="CANCELLED">لغو شده</option>
            <option value="REFUNDED">بازپرداخت شده</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">وضعیت پرداخت</label>
          <select
            v-model="filters.paymentStatus"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-[12px] lg:text-[15px] rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 transition-all shadow-sm hover:shadow-md"
            @change="fetchOrders"
          >
            <option value="" selected>همه وضعیت‌های پرداخت</option>
            <option value="UNPAID">پرداخت نشده</option>
            <option value="PAID">پرداخت شده</option>
            <option value="FAILED">پرداخت ناموفق</option>
            <option value="REFUNDED">بازپرداخت شده</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="ordersStore.isLoading && orders.length === 0" class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-8">
      <div class="animate-pulse space-y-4">
        <div v-for="i in 5" :key="i" class="h-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-xl"></div>
      </div>
    </div>

    <!-- Orders Table -->
    <div v-else-if="orders.length > 0" class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-700 dark:to-gray-600/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">شماره سفارش</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">مشتری</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">مبلغ</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">وضعیت</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">پرداخت</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">تاریخ</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">عملیات</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200/50 dark:divide-gray-700/50">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gradient-to-l hover:from-primary-50/30 dark:hover:from-primary-900/30 hover:to-transparent transition-all duration-200 group">
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link
                  :to="`/orders/${order.id}`"
                  class="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center gap-2 group-hover:gap-3"
                >
                  <span>{{ order.orderNumber }}</span>
                  <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    {{ order.user.name?.charAt(0)?.toUpperCase() || 'U' }}
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ order.user.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ order.user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ formatPrice(order.total) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(order.status)" class="px-3 py-1.5 text-xs font-semibold rounded-full inline-flex items-center gap-1 shadow-sm">
                  <span class="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getPaymentStatusBadgeClass(order.paymentStatus)" class="px-3 py-1.5 text-xs font-semibold rounded-full inline-flex items-center gap-1 shadow-sm">
                  <span class="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
                  {{ getPaymentStatusLabel(order.paymentStatus) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link
                  :to="`/orders/${order.id}`"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  مشاهده
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="meta" class="px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 dark:from-gray-700/50 to-transparent flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-300 font-medium">
          نمایش <span class="font-bold text-primary-600 dark:text-primary-400">{{ (meta.page - 1) * meta.limit + 1 }}</span> تا
          <span class="font-bold text-primary-600 dark:text-primary-400">{{ Math.min(meta.page * meta.limit, meta.total) }}</span> از
          <span class="font-bold text-gray-900 dark:text-gray-100">{{ meta.total }}</span>
        </div>
        <div class="flex gap-2">
          <button
            @click="previousPage"
            :disabled="meta.page === 1"
            :class="meta.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-700 dark:hover:text-primary-300'"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            ← قبلی
          </button>
          <button
            @click="nextPage"
            :disabled="meta.page === meta.totalPages"
            :class="meta.page === meta.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-700 dark:hover:text-primary-300'"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            بعدی →
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-12 text-center">
      <div class="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <p class="text-gray-600 dark:text-gray-400 text-lg font-medium">سفارشی یافت نشد</p>
      <p class="text-gray-500 dark:text-gray-500 text-sm mt-2">هیچ سفارشی با فیلترهای انتخابی شما مطابقت ندارد</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import type { OrdersListQuery, OrderStatus, PaymentStatus } from '@/types/types'

const ordersStore = useOrdersStore()

// State
const filters = ref<OrdersListQuery>({
  page: 1,
  limit: 20,
  status: undefined,
  paymentStatus: undefined,
})

// Computed
const orders = computed(() => ordersStore.orders)
const meta = computed(() => ordersStore.meta)

/**
 * Format price
 */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: 'IRR',
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Format date
 */
const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Get status badge class
 */
const getStatusBadgeClass = (status: OrderStatus): string => {
  const classes: Record<OrderStatus, string> = {
    PENDING: 'bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700',
    CONFIRMED: 'bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700',
    PROCESSING: 'bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700',
    SHIPPED: 'bg-gradient-to-r from-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:to-indigo-800/30 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700',
    DELIVERED: 'bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700',
    CANCELLED: 'bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700',
    REFUNDED: 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600',
  }
  return classes[status] || 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
}

/**
 * Get status label
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
 * Get payment status badge class
 */
const getPaymentStatusBadgeClass = (status: PaymentStatus): string => {
  const classes: Record<PaymentStatus, string> = {
    UNPAID: 'bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700',
    PAID: 'bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700',
    FAILED: 'bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700',
    REFUNDED: 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600',
    PARTIALLY_REFUNDED: 'bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700',
  }
  return classes[status] || 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
}

/**
 * Get payment status label
 */
const getPaymentStatusLabel = (status: PaymentStatus): string => {
  const labels: Record<PaymentStatus, string> = {
    UNPAID: 'پرداخت نشده',
    PAID: 'پرداخت شده',
    FAILED: 'پرداخت ناموفق',
    REFUNDED: 'بازپرداخت شده',
    PARTIALLY_REFUNDED: 'بازپرداخت جزئی',
  }
  return labels[status] || status
}

/**
 * Fetch orders
 */
const fetchOrders = async () => {
  const query = { ...filters.value }

  // Clean up empty values
  if (!query.status) delete query.status
  if (!query.paymentStatus) delete query.paymentStatus

  await ordersStore.fetchOrders(query)
}

/**
 * Next page
 */
const nextPage = () => {
  if (meta.value && filters?.value?.page && filters.value.page < meta.value.totalPages) {
    filters.value.page++
    fetchOrders()
  }
}

/**
 * Previous page
 */
const previousPage = () => {
  if (filters?.value?.page && filters.value.page > 1) {
    filters.value.page--
    fetchOrders()
  }
}

// Lifecycle
onMounted(() => {
  fetchOrders()
})
</script>

<!-- <style scoped>
.orders-list-view {
  @apply p-[1.5rem];
}
</style> -->

