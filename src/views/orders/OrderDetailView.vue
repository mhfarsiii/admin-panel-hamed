<template>
  <div class="order-detail-view">
    <!-- Loading State -->
    <div v-if="ordersStore.isLoading && !order" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <!-- Order Details -->
    <div v-else-if="order">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">سفارش {{ order.orderNumber }}</h1>
          <p class="text-gray-600 mt-1">{{ formatDate(order.createdAt) }}</p>
        </div>
        <router-link
          to="/orders"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          بازگشت به لیست
        </router-link>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-[1.5rem]">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Order Items -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-[1.5rem] border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">محصولات سفارش</h2>
            </div>
            <div class="divide-y divide-gray-200">
              <div v-for="item in order.items" :key="item.id" class="p-[1.5rem] flex items-center gap-4">
                <img
                  v-if="item.product.images && item.product.images[0]"
                  :src="item.product.images[0]"
                  :alt="item.product.name"
                  class="w-20 h-20 object-cover rounded-lg"
                />
                <div class="flex-1">
                  <router-link
                    :to="`/products/${item.product.id}/edit`"
                    class="font-medium text-gray-900 hover:text-primary-600"
                  >
                    {{ item.product.name }}
                  </router-link>
                  <p class="text-sm text-gray-600 mt-1">تعداد: {{ item.quantity }}</p>
                </div>
                <div class="text-left">
                  <p class="font-medium text-gray-900">{{ formatPrice(item.price) }}</p>
                  <p class="text-sm text-gray-600">جمع: {{ formatPrice(item.price * item.quantity) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="bg-white rounded-lg shadow p-[1.5rem]">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">آدرس ارسال</h2>
            <div class="space-y-2 text-sm">
              <p><strong>گیرنده:</strong> {{ order.address.receiverName }}</p>
              <p><strong>شماره تماس:</strong> {{ order.address.receiverPhone }}</p>
              <p><strong>استان:</strong> {{ order.address.province }}</p>
              <p><strong>شهر:</strong> {{ order.address.city }}</p>
              <p><strong>آدرس:</strong> {{ order.address.address }}</p>
              <p><strong>کد پستی:</strong> {{ order.address.postalCode }}</p>
            </div>
          </div>

          <!-- Admin Note -->
          <div v-if="order.adminNote" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-2">یادداشت ادمین</h3>
            <p class="text-sm text-gray-700">{{ order.adminNote }}</p>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Order Summary -->
          <div class="bg-white rounded-lg shadow p-[1.5rem]">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">خلاصه سفارش</h2>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">جمع جزء:</span>
                <span class="font-medium">{{ formatPrice(order.subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">هزینه ارسال:</span>
                <span class="font-medium">{{ formatPrice(order.shippingCost) }}</span>
              </div>
              <div v-if="order.discount > 0" class="flex justify-between text-green-600">
                <span>تخفیف:</span>
                <span class="font-medium">- {{ formatPrice(order.discount) }}</span>
              </div>
              <div class="pt-3 border-t border-gray-200 flex justify-between text-lg">
                <span class="font-semibold">مجموع:</span>
                <span class="font-bold text-primary-600">{{ formatPrice(order.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Customer Info -->
          <div class="bg-white rounded-lg shadow p-[1.5rem]">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">اطلاعات مشتری</h2>
            <div class="space-y-2 text-sm">
              <p><strong>نام:</strong> {{ order.user.name }}</p>
              <p><strong>ایمیل:</strong> {{ order.user.email }}</p>
              <p v-if="order.user.phone"><strong>تلفن:</strong> {{ order.user.phone }}</p>
            </div>
          </div>

          <!-- Order Status -->
          <div class="bg-white rounded-lg shadow p-[1.5rem]">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">وضعیت سفارش</h2>
            <div class="space-y-4">
              <div>
                <span
                  :class="getStatusBadgeClass(order.status)"
                  class="inline-block px-3 py-1 text-sm font-medium rounded-full"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
              <div>
                <span
                  :class="getPaymentStatusBadgeClass(order.paymentStatus)"
                  class="inline-block px-3 py-1 text-sm font-medium rounded-full"
                >
                  {{ getPaymentStatusLabel(order.paymentStatus) }}
                </span>
              </div>
              <div v-if="order.trackingCode" class="pt-4 border-t border-gray-200">
                <p class="text-sm text-gray-600 mb-1">کد پیگیری:</p>
                <p class="font-mono text-sm font-medium">{{ order.trackingCode }}</p>
              </div>
            </div>
          </div>

          <!-- Update Status -->
          <div class="bg-white rounded-lg shadow p-[1.5rem]">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">به‌روزرسانی وضعیت</h2>
            <form @submit.prevent="handleStatusUpdate" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">وضعیت جدید</label>
                <select
                  v-model="statusForm.status"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
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
                <label class="block text-sm font-medium text-gray-700 mb-2">کد پیگیری</label>
                <input
                  v-model="statusForm.trackingCode"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">یادداشت</label>
                <textarea
                  v-model="statusForm.adminNote"
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="ordersStore.isLoading"
                class="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {{ ordersStore.isLoading ? 'در حال ذخیره...' : 'به‌روزرسانی وضعیت' }}
              </button>
            </form>
          </div>

          <!-- Cancel Order -->
          <button
            v-if="order.status !== 'CANCELLED' && order.status !== 'DELIVERED'"
            @click="showCancelModal = true"
            class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            لغو سفارش
          </button>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-12">
      <p class="text-gray-600 text-lg mb-4">سفارش یافت نشد</p>
      <router-link
        to="/orders"
        class="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        بازگشت به لیست سفارشات
      </router-link>
    </div>

    <!-- Cancel Confirmation Modal -->
    <BaseModal v-if="showCancelModal" @close="showCancelModal = false">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">لغو سفارش</h3>
      </template>
      <template #body>
        <p class="text-gray-600">آیا از لغو این سفارش اطمینان دارید؟</p>
        <p class="text-sm text-red-600 mt-2">این عملیات قابل بازگشت نیست.</p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button
            @click="showCancelModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            انصراف
          </button>
          <button
            @click="handleCancelOrder"
            :disabled="ordersStore.isLoading"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {{ ordersStore.isLoading ? 'در حال لغو...' : 'لغو سفارش' }}
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'
import type { OrderStatus, PaymentStatus, UpdateOrderStatusRequest } from '@/types/types'
import BaseModal from '@/components/BaseModal.vue'

const route = useRoute()
const ordersStore = useOrdersStore()

// State
const orderId = ref(route.params.id as string)
const showCancelModal = ref(false)
const statusForm = ref<UpdateOrderStatusRequest>({
  status: 'PENDING',
  trackingCode: '',
  adminNote: '',
})

// Computed
const order = computed(() => ordersStore.currentOrder)

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
    hour: '2-digit',
    minute: '2-digit',
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
 * Handle status update
 */
const handleStatusUpdate = async () => {
  await ordersStore.updateOrderStatus(orderId.value, statusForm.value)
}

/**
 * Handle cancel order
 */
const handleCancelOrder = async () => {
  const success = await ordersStore.cancelOrder(orderId.value)
  if (success) {
    showCancelModal.value = false
  }
}

/**
 * Initialize form
 */
const initializeForm = () => {
  if (order.value) {
    statusForm.value = {
      status: order.value.status,
      trackingCode: order.value.trackingCode || '',
      adminNote: order.value.adminNote || '',
    }
  }
}

// Lifecycle
onMounted(async () => {
  await ordersStore.fetchOrderById(orderId.value)
  initializeForm()
})
</script>

<style scoped>
.order-detail-view {
  @apply p-[1.5rem];
}
</style>

