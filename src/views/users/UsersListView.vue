<template>
  <div class="users-list-view text-black">
    <div class="mb-6">
      <h1 class="text-[14px] lg:text-3xl font-bold text-gray-900">مدیریت کاربران</h1>
      <p class="text-gray-600 mt-1 text-[12px] lg:text-[15px]">{{ usersStore.totalUsers }} کاربر</p>
    </div>

    <!-- Loading State -->
    <div v-if="usersStore.isLoading && users.length === 0" class="bg-white rounded-lg shadow p-8">
      <div class="animate-pulse space-y-4">
        <div v-for="i in 5" :key="i" class="h-20 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Users Table -->
    <div v-else-if="users.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ایمیل</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">شماره تماس</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نقش</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ عضویت</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.phone || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getRoleBadgeClass(user.role)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ getRoleLabel(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ user.emailVerified ? 'تایید شده' : 'تایید نشده' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link
                  :to="`/users/${user.id}`"
                  class="text-primary-600 hover:text-primary-900"
                >
                  مشاهده جزئیات
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
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <p class="text-gray-600 text-lg">کاربری یافت نشد</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import type { UsersListQuery, UserRole } from '@/types/types'

const usersStore = useUsersStore()

// State
const filters = ref<UsersListQuery>({
  page: 1,
  limit: 20,
})

// Computed
const users = computed(() => usersStore.users)
const meta = computed(() => usersStore.meta)

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
 * Fetch users
 */
const fetchUsers = async () => {
  await usersStore.fetchUsers(filters.value)
}

/**
 * Next page
 */
const nextPage = () => {
  if (meta.value && filters?.value?.page && filters.value.page < meta.value.totalPages) {
    filters.value.page++
    fetchUsers()
  }
}

/**
 * Previous page
 */
const previousPage = () => {
  if (filters?.value?.page && filters.value.page > 1) {
    filters.value.page--
    fetchUsers()
  }
}

// Lifecycle
onMounted(() => {
  fetchUsers()
})
</script>

<!-- <style scoped>
.users-list-view {
  @apply p-[1.5rem];
}
</style> -->

