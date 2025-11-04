<template>
  <div class="product-create-view">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">ایجاد محصول جدید</h1>
      <p class="text-gray-600 mt-1">فرم زیر را تکمیل کنید تا محصول جدیدی ایجاد شود</p>
    </div>

    <ProductForm submit-label="ایجاد محصول" @submit="handleSubmit" />

    <!-- Error Message -->
    <div
      v-if="productsStore.error"
      class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
    >
      {{ productsStore.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import ProductForm from '@/components/ProductForm.vue'
import type { CreateProductRequest, UpdateProductRequest } from '@/types/types'

const router = useRouter()
const productsStore = useProductsStore()

/**
 * Handle form submission
 */
const handleSubmit = async (data: CreateProductRequest | UpdateProductRequest) => {
  // Type guard: ensure required fields for create are present
  if ('name' in data && 'slug' in data && 'categoryId' in data && 'stock' in data && 'price' in data) {
    const product = await productsStore.createProduct(data as CreateProductRequest)

    if (product) {
      router.push('/products')
    }
  }
}
</script>

<!-- <style scoped>
.product-create-view {
  @apply p-6;
}
</style> -->

