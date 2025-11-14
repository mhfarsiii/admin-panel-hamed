<template>
  <div class="orders-list-view text-black">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">مدیریت سفارشات</h1>
      <p class="text-gray-600 mt-1">{{ ordersStore.totalOrders }} سفارش</p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="fetchOrders"
          >
            <option value="">همه وضعیت‌ها</option>
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
          <select
            v-model="filters.paymentStatus"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="fetchOrders"
          >
            <option value="">همه وضعیت‌های پرداخت</option>
            <option value="UNPAID">پرداخت نشده</option>
            <option value="PAID">پرداخت شده</option>
            <option value="FAILED">پرداخت ناموفق</option>
            <option value="REFUNDED">بازپرداخت شده</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="ordersStore.isLoading && orders.length === 0" class="bg-white rounded-lg shadow p-8">
      <div class="animate-pulse space-y-4">
        <div v-for="i in 5" :key="i" class="h-20 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Orders Table -->
    <div v-else-if="orders.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">شماره سفارش</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">مشتری</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">مبلغ</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">پرداخت</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link
                  :to="`/orders/${order.id}`"
                  class="text-sm font-medium text-primary-600 hover:text-primary-900"
                >
                  {{ order.orderNumber }}
                </router-link>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ order.user.name }}</div>
                <div class="text-sm text-gray-500">{{ order.user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ formatPrice(order.total) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(order.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getPaymentStatusBadgeClass(order.paymentStatus)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getPaymentStatusLabel(order.paymentStatus) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link :to="`/orders/${order.id}`" class="text-primary-600 hover:text-primary-900">
                  مشاهده
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="meta" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          نمایش {{ (meta.page - 1) * meta.limit + 1 }} تا {{ Math.min(meta.page * meta.limit, meta.total) }} از {{ meta.total }}
        </div>
        <div class="flex gap-2">
          <button
            @click="previousPage"
            :disabled="meta.page === 1"
            :class="meta.page === 1 ? 'opacity-50 cursor-not-allowed' : ''"
            class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
          >
            قبلی
          </button>
          <button
            @click="nextPage"
            :disabled="meta.page === meta.totalPages"
            :class="meta.page === meta.totalPages ? 'opacity-50 cursor-not-allowed' : ''"
            class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
          >
            بعدی
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-lg shadow p-12 text-center">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <p class="text-gray-600 text-lg">سفارشی یافت نشد</p>
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
    UNPAID: 'bg-red-100 text-red-800',
    PAID: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
    PARTIALLY_REFUNDED: 'bg-yellow-100 text-yellow-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
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

