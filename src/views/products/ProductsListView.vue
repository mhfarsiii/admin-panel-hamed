<template>
  <div class="products-list-view text-black">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">مدیریت محصولات</h1>
        <p class="text-gray-600 mt-1">{{ productsStore.totalProducts }} محصول</p>
      </div>
      <router-link
        to="/products/create"
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>افزودن محصول جدید</span>
      </router-link>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <input
            v-model="filters.q"
            type="text"
            placeholder="جستجو در محصولات..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <select
            v-model="filters.category"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="fetchProducts"
          >
            <option value="">همه دسته‌بندی‌ها</option>
            <option v-for="category in categoriesStore.categories" :key="category.id" :value="category.slug">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <select
            v-model="filters.sort"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="fetchProducts"
          >
            <option value="">مرتب‌سازی</option>
            <option value="newest">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="price-asc">قیمت (کم به زیاد)</option>
            <option value="price-desc">قیمت (زیاد به کم)</option>
            <option value="popular">محبوب‌ترین</option>
          </select>
        </div>
        <div>
          <select
            v-model="filters.featured"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="fetchProducts"
          >
            <option value="">همه محصولات</option>
            <option value="true">محصولات ویژه</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="productsStore.isLoading && products.length === 0" class="bg-white rounded-lg shadow p-8">
      <div class="animate-pulse space-y-4">
        <div v-for="i in 5" :key="i" class="h-20 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Products Table -->
    <div v-else-if="products.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تصویر
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                نام محصول
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                دسته‌بندی
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                قیمت
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                موجودی
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                وضعیت
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <img
                  v-if="product.images && product.images[0]"
                  :src="product.images[0]"
                  :alt="product.name"
                  class="w-16 h-16 object-cover rounded-lg"
                />
                <div v-else class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                <div class="text-sm text-gray-500">{{ product.slug }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">
                  {{ product.category?.name || '-' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatPrice(product.price) }}
                </div>
                <div v-if="product.discount > 0" class="text-xs text-green-600">
                  {{ product.discount }}% تخفیف
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'text-green-600': product.stock > 10,
                    'text-yellow-600': product.stock > 0 && product.stock <= 10,
                    'text-red-600': product.stock === 0,
                  }"
                  class="text-sm font-medium"
                >
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ product.isActive ? 'فعال' : 'غیرفعال' }}
                </span>
                <span
                  v-if="product.isFeatured"
                  class="mr-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                >
                  ویژه
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2">
                  <router-link
                    :to="`/products/${product.id}/edit`"
                    class="text-primary-600 hover:text-primary-900"
                  >
                    ویرایش
                  </router-link>
                  <button
                    @click="deleteProduct(product)"
                    class="text-red-600 hover:text-red-900"
                  >
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="meta" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          نمایش {{ (meta.page - 1) * meta.limit + 1 }} تا
          {{ Math.min(meta.page * meta.limit, meta.total) }} از {{ meta.total }}
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
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
      <p class="text-gray-600 text-lg mb-4">محصولی یافت نشد</p>
      <router-link
        to="/products/create"
        class="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        افزودن اولین محصول
      </router-link>
    </div>

    <!-- Delete Confirmation Modal -->
    <BaseModal :modelValue="showDeleteModal" v-if="showDeleteModal" @close="showDeleteModal = false">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">حذف محصول</h3>
      </template>
      <template #body>
        <p class="text-gray-600">آیا از حذف محصول "{{ productToDelete?.name }}" اطمینان دارید؟</p>
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
            :disabled="productsStore.isLoading"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {{ productsStore.isLoading ? 'در حال حذف...' : 'حذف' }}
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useCategoriesStore } from '@/stores/categories'
import type { Product, ProductsListQuery } from '@/types/types'
import BaseModal from '@/components/BaseModal.vue'

// Stores
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

// State
const filters = ref<ProductsListQuery>({
  page: 1,
  limit: 16,
  q: '',
  category: '',
  sort: undefined,
  featured: undefined,
})

const showDeleteModal = ref(false)
const productToDelete = ref<Product | null>(null)

// Computed
const products = computed(() => productsStore.products)
const meta = computed(() => productsStore.meta)

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
 * Fetch products with filters
 */
const fetchProducts = async () => {
  const query = { ...filters.value }

  // Clean up empty values
  if (!query.q) delete query.q
  if (!query.category) delete query.category
  if (!query.sort) delete query.sort
  if (query.featured === undefined || query.featured === false) delete query.featured
  else query.featured = query.featured === true || query.featured === true

  await productsStore.fetchProducts(query)
}

/**
 * Debounced search
 */
let searchTimeout: number
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filters.value.page = 1
    fetchProducts()
  }, 500)
}

/**
 * Next page
 */
const nextPage = () => {
  if (meta.value && filters?.value?.page && filters.value.page < meta.value.totalPages) {
    filters.value.page++
    fetchProducts()
  }
}

/**
 * Previous page
 */
const previousPage = () => {
  if (filters?.value?.page && filters.value.page > 1) {
    filters.value.page--
    fetchProducts()
  }
}

/**
 * Delete product
 */
const deleteProduct = (product: Product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

/**
 * Confirm delete
 */
const confirmDelete = async () => {
  if (productToDelete.value) {
    const success = await productsStore.deleteProduct(productToDelete.value.id)
    if (success) {
      showDeleteModal.value = false
      productToDelete.value = null
    }
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchProducts(),
    categoriesStore.fetchCategories(),
  ])
})
</script>

<!-- <style scoped>
.products-list-view {
  @apply p-6;
}
</style> -->

