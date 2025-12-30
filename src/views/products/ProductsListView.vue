<template>
  <div class="products-list-view text-black animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4 lg:gap-0">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
          <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div>
          <h1 class="text-[14px] lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">مدیریت محصولات</h1>
          <p class="text-gray-600 mt-1 text-[12px] lg:text-[15px] flex items-center gap-2">
            <span class="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
            {{ productsStore.totalProducts }} محصول
          </p>
        </div>
      </div>
      <router-link
        to="/products/create"
        class="px-6 py-3 text-[12px] lg:text-[15px] whitespace-nowrap bg-gradient-to-r from-primary-600 to-primary-700 text-white bg-blue-500 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>افزودن محصول جدید</span>
      </router-link>
    </div>

    <!-- Filters -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">جستجو</label>
          <input
            v-model="filters.q"
            type="text"
            placeholder="جستجو در محصولات..."
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm hover:shadow-md"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
          <select
            v-model="filters.category"
            class="w-full px-4 py-3 border text-[12px] lg:text-[15px] border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm hover:shadow-md"
            @change="fetchProducts"
          >
            <option value="">همه دسته‌بندی‌ها</option>
            <option v-for="category in categoriesStore.categories" :key="category.id" :value="category.slug">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">مرتب‌سازی</label>
          <select
            v-model="filters.sort"
            class="w-full px-4 py-3 border border-gray-300 text-[12px] lg:text-[15px] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm hover:shadow-md"
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
          <label class="block text-sm font-medium text-gray-700 mb-2">نوع محصول</label>
          <select
            v-model="filters.featured"
            class="w-full px-4 py-3 border border-gray-300 text-[12px] lg:text-[15px] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm hover:shadow-md"
            @change="fetchProducts"
          >
            <option value="">همه محصولات</option>
            <option value="true">محصولات ویژه</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="productsStore.isLoading && products.length === 0" class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
      <div class="animate-pulse space-y-4">
        <div v-for="i in 5" :key="i" class="h-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl"></div>
      </div>
    </div>

    <!-- Products Table -->
    <div v-else-if="products.length > 0" class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                تصویر
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                نام محصول
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                دسته‌بندی
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                قیمت
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                موجودی
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                وضعیت
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200/50">
            <tr v-for="product in products" :key="product.id" class="hover:bg-gradient-to-l hover:from-primary-50/30 hover:to-transparent transition-all duration-200 group">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="relative">
                  <img
                    v-if="product.images && product.images[0]"
                    :src="product.images[0]"
                    :alt="product.name"
                    class="w-16 h-16 object-cover rounded-xl shadow-sm group-hover:shadow-md transition-shadow"
                  />
                  <div v-else class="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-semibold text-gray-900">{{ product.name }}</div>
                <div class="text-xs text-gray-500 mt-1">{{ product.slug }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-900 px-3 py-1 bg-gray-100 rounded-lg">
                  {{ product.category?.name || '-' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-gray-900">
                  {{ formatPrice(product.price) }}
                </div>
                <div v-if="product.discount > 0" class="text-xs font-semibold text-green-600 mt-1 px-2 py-0.5 bg-green-50 rounded-lg inline-block">
                  {{ product.discount }}% تخفیف
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'text-green-700 bg-green-50': product.stock > 10,
                    'text-yellow-700 bg-yellow-50': product.stock > 0 && product.stock <= 10,
                    'text-red-700 bg-red-50': product.stock === 0,
                  }"
                  class="text-sm font-bold px-3 py-1 rounded-lg"
                >
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col gap-1.5">
                  <span
                    :class="product.isActive ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200' : 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200'"
                    class="px-3 py-1 text-xs font-semibold rounded-full inline-block w-fit"
                  >
                    {{ product.isActive ? 'فعال' : 'غیرفعال' }}
                  </span>
                  <span
                    v-if="product.isFeatured"
                    class="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 text-xs font-semibold rounded-full inline-block w-fit border border-blue-200"
                  >
                    ⭐ ویژه
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2">
                  <router-link
                    :to="`/products/${product.id}/edit`"
                    class="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-all font-semibold text-xs"
                  >
                    ویرایش
                  </router-link>
                  <button
                    @click="deleteProduct(product)"
                    class="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all font-semibold text-xs"
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
      <div v-if="meta" class="px-6 py-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-transparent flex items-center justify-between">
        <div class="text-sm text-gray-700 font-medium">
          نمایش <span class="font-bold text-primary-600">{{ (meta.page - 1) * meta.limit + 1 }}</span> تا
          <span class="font-bold text-primary-600">{{ Math.min(meta.page * meta.limit, meta.total) }}</span> از
          <span class="font-bold text-gray-900">{{ meta.total }}</span>
        </div>
        <div class="flex gap-2">
          <button
            @click="previousPage"
            :disabled="meta.page === 1"
            :class="meta.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700'"
            class="px-4 py-2 border border-gray-300 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            ← قبلی
          </button>
          <button
            @click="nextPage"
            :disabled="meta.page === meta.totalPages"
            :class="meta.page === meta.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700'"
            class="px-4 py-2 border border-gray-300 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            بعدی →
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center">
      <div class="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <p class="text-gray-600 text-lg font-medium mb-2">محصولی یافت نشد</p>
      <p class="text-gray-500 text-sm mb-6">شروع کنید و اولین محصول خود را اضافه کنید</p>
      <router-link
        to="/products/create"
        class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-black rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
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
  @apply p-[1.5rem];
}
</style> -->

<style scoped>

  input::placeholder{
    font-size: 13px;
  }
</style>

