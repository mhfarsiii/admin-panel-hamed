<template>
  <div class="product-edit-view">
    <!-- Loading State -->
    <div v-if="productsStore.isLoading && !product" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <!-- Product Form -->
    <div v-else-if="product">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">ویرایش محصول</h1>
        <p class="text-gray-600 mt-1">{{ product.name }}</p>
      </div>

      <ProductForm :product="product" submit-label="ذخیره تغییرات" @submit="handleSubmit" />

      <!-- Error Message -->
      <div
        v-if="productsStore.error"
        class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
      >
        {{ productsStore.error }}
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-12">
      <p class="text-gray-600 text-lg mb-4">محصول یافت نشد</p>
      <router-link
        to="/products"
        class="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        بازگشت به لیست محصولات
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import ProductForm from '@/components/ProductForm.vue'
import type { UpdateProductRequest } from '@/types/types'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()

const productId = ref(route.params.id as string)

const product = computed(() => productsStore.currentProduct)

/**
 * Handle form submission
 */
const handleSubmit = async (data: UpdateProductRequest) => {
  const updatedProduct = await productsStore.updateProduct(productId.value, data)

  if (updatedProduct) {
    router.push('/products')
  }
}

// Lifecycle
onMounted(async () => {
  await productsStore.fetchProductById(productId.value)
})
</script>

<style scoped>
.product-edit-view {
  @apply p-[1.5rem];
}
</style>

