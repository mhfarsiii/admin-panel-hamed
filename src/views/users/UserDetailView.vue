<template>
  <div class="user-detail-view">
    <!-- Loading State -->
    <div v-if="usersStore.isLoading && !user" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <!-- User Details -->
    <div v-else-if="user">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-[14px] lg:text-3xl font-bold text-gray-900">{{ user.name }}</h1>
          <p class="text-gray-600 mt-1 text-[12px] lg:text-[15px]">{{ user.email }}</p>
        </div>
        <router-link
          to="/users"
          class="px-4 py-2 text-[12px] lg:text-[15px] border text-black border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          بازگشت به لیست
        </router-link>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-[1.5rem]">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- User Information -->
          <div class="bg-white rounded-lg shadow p-[1.5rem]">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">اطلاعات کاربر</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">نام کامل</p>
                <p class="font-medium text-gray-900 text-[12px] lg:text-[15px]">{{ user.name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">ایمیل</p>
                <p class="font-medium text-gray-900 text-[12px] lg:text-[15px]">{{ user.email }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">شماره تماس</p>
                <p class="font-medium text-gray-900 text-[12px] lg:text-[15px]">{{ user.phone || '-' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">نقش</p>
                <span
                  :class="getRoleBadgeClass(user.role)"
                  class="inline-block px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ getRoleLabel(user.role) }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-600">وضعیت ایمیل</p>
                <span
                  :class="user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                  class="inline-block px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ user.emailVerified ? 'تایید شده' : 'تایید نشده' }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-600">تاریخ عضویت</p>
                <p class="font-medium text-gray-900 text-[12px] lg:text-[15px]">{{ formatDate(user.createdAt) }}</p>
              </div>
            </div>
          </div>

          <!-- User Orders -->
          <div v-if="user.orders && user.orders.length > 0" class="bg-white rounded-lg shadow">
            <div class="p-[1.5rem] border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">سفارشات کاربر</h2>
            </div>
            <div class="divide-y divide-gray-200">
              <div
                v-for="order in user.orders"
                :key="order.id"
                class="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <router-link
                    :to="`/orders/${order.id}`"
                    class="font-medium text-primary-600 hover:text-primary-900 text-[12px] lg:text-[15px]"
                  >
                    {{ order.orderNumber }}
                  </router-link>
                  <p class="text-sm text-gray-600 mt-1 text-[12px] lg:text-[15px]">
                    {{ formatPrice(order.total) }}
                  </p>
                </div>
                <span
                  :class="getStatusBadgeClass(order.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full text-[12px] lg:text-[15px]"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- User Addresses -->
          <div v-if="user.addresses && user.addresses.length > 0" class="bg-white rounded-lg shadow">
            <div class="p-[1.5rem] border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">آدرس‌های کاربر</h2>
            </div>
            <div class="divide-y divide-gray-200">
              <div
                v-for="address in user.addresses"
                :key="address.id"
                class="p-4"
              >
                <div class="space-y-1 text-sm">
                  <p class="text-[12px] lg:text-[15px]"><strong>گیرنده:</strong> {{ address.receiverName }}</p>
                  <p class="text-[12px] lg:text-[15px]"><strong>شماره تماس:</strong> {{ address.receiverPhone }}</p>
                  <p class="text-[12px] lg:text-[15px]"><strong>استان:</strong> {{ address.province }}</p>
                  <p class="text-[12px] lg:text-[15px]"><strong>شهر:</strong> {{ address.city }}</p>
                  <p class="text-[12px] lg:text-[15px]"><strong>آدرس:</strong> {{ address.address }}</p>
                  <p class="text-[12px] lg:text-[15px]"><strong>کد پستی:</strong> {{ address.postalCode }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Statistics -->
          <div class="bg-white rounded-lg shadow p-[1.5rem]">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">آمار کاربر</h2>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="  text-gray-600 text-[12px] lg:text-[15px]">تعداد سفارشات</span>
                <span class="font-bold text-lg text-gray-900 text-[12px] lg:text-[15px]">
                  {{ user.orders?.length || 0 }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="  text-gray-600 text-[12px] lg:text-[15px]">تعداد آدرس‌ها</span>
                <span class="font-bold text-lg text-gray-900 text-[12px] lg:text-[15px]">
                  {{ user.addresses?.length || 0 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-12">
      <p class="text-gray-600 text-lg mb-4">کاربر یافت نشد</p>
      <router-link
        to="/users"
        class="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        بازگشت به لیست کاربران
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import type { UserRole, OrderStatus } from '@/types/types'

const route = useRoute()
const usersStore = useUsersStore()

// State
const userId = ref(route.params.id as string)

// Computed
const user = computed(() => usersStore.currentUser)

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
 * Get role badge class
 */
const getRoleBadgeClass = (role: UserRole): string => {
  const classes: Record<UserRole, string> = {
    USER: 'bg-blue-100 text-blue-800',
    ADMIN: 'bg-purple-100 text-purple-800',
    SUPER_ADMIN: 'bg-red-100 text-red-800',
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

/**
 * Get role label
 */
const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    USER: 'کاربر عادی',
    ADMIN: 'ادمین',
    SUPER_ADMIN: 'سوپر ادمین',
  }
  return labels[role] || role
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

// Lifecycle
onMounted(() => {
  usersStore.fetchUserById(userId.value)
})
</script>

<style scoped>
.user-detail-view {
  @apply p-[1.5rem];
}
</style>

