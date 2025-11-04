<template>
  <div class="categories-list-view">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">مدیریت دسته‌بندی‌ها</h1>
        <p class="text-gray-600 mt-1">{{ categoriesStore.totalCategories }} دسته‌بندی</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>افزودن دسته‌بندی جدید</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="categoriesStore.isLoading && categories.length === 0" class="bg-white rounded-lg shadow p-8">
      <div class="animate-pulse space-y-4">
        <div v-for="i in 5" :key="i" class="h-16 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Categories Grid -->
    <div v-else-if="categories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ category.slug }}</p>
            </div>
            <span
              :class="category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              class="px-2 py-1 text-xs font-medium rounded-full"
            >
              {{ category.isActive ? 'فعال' : 'غیرفعال' }}
            </span>
          </div>

          <p v-if="category.description" class="text-sm text-gray-600 mb-4 line-clamp-2">
            {{ category.description }}
          </p>

          <div class="flex items-center justify-between pt-4 border-t border-gray-200">
            <div class="text-sm text-gray-500">
              ترتیب: {{ category.sortOrder }}
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="editCategory(category)"
                class="text-primary-600 hover:text-primary-900 text-sm font-medium"
              >
                ویرایش
              </button>
              <button
                @click="deleteCategory(category)"
                class="text-red-600 hover:text-red-900 text-sm font-medium"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-lg shadow p-12 text-center">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
      <p class="text-gray-600 text-lg mb-4">دسته‌بندی موجود نیست</p>
      <button
        @click="showCreateModal = true"
        class="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        افزودن اولین دسته‌بندی
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <BaseModal :modelValue="showCreateModal || showEditModal" v-if="showCreateModal || showEditModal" @close="closeModal">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">
          {{ showEditModal ? 'ویرایش دسته‌بندی' : 'ایجاد دسته‌بندی جدید' }}
        </h3>
      </template>
      <template #body>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              نام دسته‌بندی <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              شناسه URL (Slug) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.slug"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ترتیب نمایش</label>
            <input
              v-model.number="form.sortOrder"
              type="number"
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="flex items-center gap-2">
              <input
                v-model="form.isActive"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">دسته‌بندی فعال است</span>
            </label>
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button
            @click="closeModal"
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            انصراف
          </button>
          <button
            @click="handleSubmit"
            :disabled="categoriesStore.isLoading"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {{ categoriesStore.isLoading ? 'در حال ذخیره...' : 'ذخیره' }}
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal :modelValue="showDeleteModal" v-if="showDeleteModal" @close="showDeleteModal = false">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">حذف دسته‌بندی</h3>
      </template>
      <template #body>
        <p class="text-gray-600">آیا از حذف دسته‌بندی "{{ categoryToDelete?.name }}" اطمینان دارید؟</p>
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
            :disabled="categoriesStore.isLoading"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {{ categoriesStore.isLoading ? 'در حال حذف...' : 'حذف' }}
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/types'
import BaseModal from '@/components/BaseModal.vue'

const categoriesStore = useCategoriesStore()

// State
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const categoryToEdit = ref<Category | null>(null)
const categoryToDelete = ref<Category | null>(null)

const form = ref<CreateCategoryRequest>({
  name: '',
  slug: '',
  description: '',
  isActive: true,
  sortOrder: 0,
})

// Computed
const categories = computed(() => categoriesStore.categories)

/**
 * Edit category
 */
const editCategory = (category: Category) => {
  categoryToEdit.value = category
  form.value = {
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    isActive: category.isActive,
    sortOrder: category.sortOrder,
  }
  showEditModal.value = true
}

/**
 * Delete category
 */
const deleteCategory = (category: Category) => {
  categoryToDelete.value = category
  showDeleteModal.value = true
}

/**
 * Handle form submit
 */
const handleSubmit = async () => {
  if (showEditModal.value && categoryToEdit.value) {
    await categoriesStore.updateCategory(categoryToEdit.value.id, form.value as UpdateCategoryRequest)
    if (categoriesStore.success) {
      closeModal()
    }
  } else {
    await categoriesStore.createCategory(form.value)
    if (categoriesStore.success) {
      closeModal()
    }
  }
}

/**
 * Confirm delete
 */
const confirmDelete = async () => {
  if (categoryToDelete.value) {
    const success = await categoriesStore.deleteCategory(categoryToDelete.value.id)
    if (success) {
      showDeleteModal.value = false
      categoryToDelete.value = null
    }
  }
}

/**
 * Close modal
 */
const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  categoryToEdit.value = null
  form.value = {
    name: '',
    slug: '',
    description: '',
    isActive: true,
    sortOrder: 0,
  }
}

// Lifecycle
onMounted(() => {
  categoriesStore.fetchCategories({ includeInactive: true })
})
</script>

<style scoped>
/* .categories-list-view {
  @apply p-6;
} */

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

