<template>
  <div class="collection-create-view text-black dark:text-gray-100 animate-fade-in">
    <div class="mb-6">
      <h1 class="text-[14px] lg:text-3xl font-bold text-gray-900 dark:text-gray-100">ایجاد کالکشن جدید</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1 text-[12px] lg:text-[15px]">
        فرم زیر را تکمیل کنید تا کالکشن جدیدی با محصولات انتخاب‌شده ساخته شود.
      </p>
    </div>

    <form
      class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 space-y-6"
      @submit.prevent="handleSubmit"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              نام کالکشن (Title) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              placeholder="مثلاً: Pastel Vibes"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">توضیحات (اختیاری)</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              placeholder="یک توضیح کوتاه درباره تم یا محتوای این کالکشن..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تصویر کاور کالکشن (Cover Image)
            </label>
            <div class="flex items-center gap-3">
              <input
                v-model="form.coverImage"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="https://cdn.moramor.com/collections/pastel-vibes.jpg"
              />
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageUpload"
              />
              <button
                type="button"
                class="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                :disabled="isUploading"
                @click="imageInput?.click()"
              >
                {{ isUploading ? 'در حال آپلود...' : 'آپلود تصویر' }}
              </button>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              می‌توانید آدرس URL تصویر را وارد کنید یا یک فایل تصویر آپلود کنید.
            </p>
            <div v-if="form.coverImage" class="mt-3">
              <img :src="form.coverImage" alt="Collection preview" class="h-32 w-full object-cover rounded-xl" />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            محصولات داخل کالکشن (Product IDs)
          </label>
          <div
            class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-xl max-h-80 overflow-y-auto p-3 space-y-2 text-sm"
          >
            <div v-if="productsStore.isLoading" class="text-gray-500 dark:text-gray-400 text-xs">
              در حال دریافت لیست محصولات...
            </div>
            <div v-else-if="products.length === 0" class="text-gray-500 dark:text-gray-400 text-xs">
              محصولی برای انتخاب وجود ندارد. ابتدا محصولات را بسازید.
            </div>
            <div
              v-else
              v-for="product in products"
              :key="product.id"
              class="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <input
                v-model="selectedProductIds"
                :value="product.id"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                  {{ product.name }}
                </p>
                <p class="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                  {{ product.id }}
                </p>
              </div>
            </div>
          </div>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            می‌توانید یک یا چند محصول را برای این کالکشن انتخاب کنید.
          </p>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <router-link
          to="/collections"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          انصراف
        </router-link>
        <button
          type="submit"
          :disabled="collectionsStore.isLoading"
          class="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-colors disabled:opacity-50 text-sm font-semibold"
        >
          {{ collectionsStore.isLoading ? 'در حال ایجاد...' : 'ایجاد کالکشن' }}
        </button>
      </div>

      <div
        v-if="collectionsStore.error"
        class="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm border border-red-200 dark:border-red-700"
      >
        {{ collectionsStore.error }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectionsStore } from '@/stores/collections'
import { useProductsStore } from '@/stores/products'
import { uploadImage } from '@/utils/upload'
import type { CreateCollectionRequest } from '@/types/types'

const router = useRouter()
const collectionsStore = useCollectionsStore()
const productsStore = useProductsStore()

const form = ref<Pick<CreateCollectionRequest, 'title' | 'description' | 'coverImage'>>({
  title: '',
  description: '',
  coverImage: '',
})

const selectedProductIds = ref<string[]>([])

const products = computed(() => productsStore.products)

const imageInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  isUploading.value = true

  try {
    const uploaded = await uploadImage(file)
    form.value.coverImage = uploaded.url
  } catch (error: unknown) {
    console.error('Upload image error:', error)
    const message = error instanceof Error ? error.message : 'خطا در آپلود تصویر'
    alert(message)
  } finally {
    isUploading.value = false
    if (imageInput.value) {
      imageInput.value.value = ''
    }
  }
}

const handleSubmit = async () => {
  if (!form.value.title.trim()) {
    return
  }

  const payload: CreateCollectionRequest = {
    title: form.value.title.trim(),
    description: form.value.description?.trim() || undefined,
    coverImage: form.value.coverImage?.trim() || undefined,
    productIds: selectedProductIds.value,
  }

  const created = await collectionsStore.createCollection(payload)

  if (created) {
    await router.push('/collections')
  }
}

onMounted(async () => {
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts({ page: 1, limit: 100 })
  }
})
</script>

