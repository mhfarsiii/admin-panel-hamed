<template>
  <div class="reviews-list-view">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">مدیریت نظرات</h1>
      <p class="text-gray-600 mt-1">
        {{ reviewsStore.totalReviews }} نظر
        <span v-if="reviewsStore.pendingReviewsCount > 0" class="text-yellow-600">
          ({{ reviewsStore.pendingReviewsCount }} در انتظار تایید)
        </span>
      </p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex items-center gap-4">
        <button
          @click="setFilter(undefined)"
          :class="filters.approved === undefined ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'"
          class="px-4 py-2 rounded-lg transition-colors"
        >
          همه نظرات
        </button>
        <button
          @click="setFilter(false)"
          :class="filters.approved === false ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'"
          class="px-4 py-2 rounded-lg transition-colors"
        >
          در انتظار تایید
        </button>
        <button
          @click="setFilter(true)"
          :class="filters.approved === true ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'"
          class="px-4 py-2 rounded-lg transition-colors"
        >
          تایید شده
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="reviewsStore.isLoading && reviews.length === 0" class="bg-white rounded-lg shadow p-8">
      <div class="animate-pulse space-y-4">
        <div v-for="i in 5" :key="i" class="h-24 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Reviews List -->
    <div v-else-if="reviews.length > 0" class="space-y-4">
      <div
        v-for="review in reviews"
        :key="review.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <router-link
                  :to="`/products/${review.product.id}/edit`"
                  class="font-medium text-gray-900 hover:text-primary-600"
                >
                  {{ review.product.name }}
                </router-link>
                <span
                  :class="review.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ review.approved ? 'تایید شده' : 'در انتظار' }}
                </span>
              </div>
              <p class="text-sm text-gray-600">{{ review.user.name }} · {{ formatDate(review.createdAt) }}</p>
            </div>
            <div class="flex items-center gap-1">
              <svg
                v-for="i in 5"
                :key="i"
                :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>

          <p class="text-gray-700 mb-4">{{ review.comment }}</p>

          <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
            <button
              v-if="!review.approved"
              @click="approveReview(review.id)"
              :disabled="reviewsStore.isLoading"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              تایید نظر
            </button>
            <button
              @click="deleteReview(review)"
              :disabled="reviewsStore.isLoading"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              حذف نظر
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="meta" class="bg-white rounded-lg shadow px-6 py-4 flex items-center justify-between">
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
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
      <p class="text-gray-600 text-lg">نظری یافت نشد</p>
    </div>

    <!-- Delete Confirmation Modal -->
    <BaseModal :modelValue="showDeleteModal" v-if="showDeleteModal" @close="showDeleteModal = false">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">حذف نظر</h3>
      </template>
      <template #body>
        <p class="text-gray-600">آیا از حذف این نظر اطمینان دارید؟</p>
        <p class="text-sm text-red-600 mt-2">این عملیات قابل بازگشت نیست.</p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            انصراف
          </button>
          <button
            @click="confirmDelete"
            :disabled="reviewsStore.isLoading"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {{ reviewsStore.isLoading ? 'در حال حذف...' : 'حذف' }}
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useReviewsStore } from '@/stores/reviews'
import type { ReviewsListQuery, Review } from '@/types/types'
import BaseModal from '@/components/BaseModal.vue'

const reviewsStore = useReviewsStore()

// State
const filters = ref<ReviewsListQuery>({
  page: 1,
  limit: 20,
  approved: undefined,
})

const showDeleteModal = ref(false)
const reviewToDelete = ref<Review | null>(null)

// Computed
const reviews = computed(() => reviewsStore.reviews)
const meta = computed(() => reviewsStore.meta)

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
 * Set filter
 */
const setFilter = (approved: boolean | undefined) => {
  filters.value.approved = approved
  filters.value.page = 1
  fetchReviews()
}

/**
 * Fetch reviews
 */
const fetchReviews = async () => {
  const query = { ...filters.value }

  // Clean up empty values
  if (query.approved === undefined) delete query.approved

  await reviewsStore.fetchReviews(query)
}

/**
 * Approve review
 */
const approveReview = async (reviewId: string) => {
  await reviewsStore.approveReview(reviewId)
}

/**
 * Delete review
 */
const deleteReview = (review: Review) => {
  reviewToDelete.value = review
  showDeleteModal.value = true
}

/**
 * Confirm delete
 */
const confirmDelete = async () => {
  if (reviewToDelete.value) {
    const success = await reviewsStore.deleteReview(reviewToDelete.value.id)
    if (success) {
      showDeleteModal.value = false
      reviewToDelete.value = null
    }
  }
}

/**
 * Next page
 */
const nextPage = () => {
  if (meta.value && filters?.value?.page && filters.value.page < meta.value.totalPages) {
    filters.value.page++
    fetchReviews()
  }
}

/**
 * Previous page
 */
const previousPage = () => {
  if (filters?.value?.page && filters.value.page > 1) {
    filters.value.page--
    fetchReviews()
  }
}

// Lifecycle
onMounted(() => {
  fetchReviews()
})
</script>

<!-- <style scoped>
.reviews-list-view {
  @apply p-6;
}
</style> -->

