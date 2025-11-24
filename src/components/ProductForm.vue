<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Basic Information -->
    <div class="bg-white rounded-lg shadow p-[1.5rem]">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">اطلاعات پایه</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            نام محصول <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            شناسه URL (Slug) <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.slug"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p class="text-xs text-gray-500 mt-1">فقط از حروف انگلیسی، اعداد و خط فاصله استفاده کنید</p>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            قیمت (ریال) <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="form.price"
            type="number"
            required
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">تخفیف (%)</label>
          <input
            v-model.number="form.discount"
            type="number"
            min="0"
            max="100"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            دسته‌بندی <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.categoryId"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">انتخاب دسته‌بندی</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            موجودی <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="form.stock"
            type="number"
            required
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">کد محصول (SKU)</label>
          <input
            v-model="form.sku"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">وزن (گرم)</label>
          <input
            v-model.number="form.weight"
            type="number"
            min="0"
            step="0.1"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <!-- Materials -->
    <div class="bg-white rounded-lg shadow p-[1.5rem]">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">مواد اولیه</h2>

      <div class="space-y-2">
        <div v-for="(material, index) in form.materials || []" :key="index" class="flex gap-2">
          <input
            v-model="form.materials![index]"
            type="text"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="button"
            @click="removeMaterial(index)"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            حذف
          </button>
        </div>
        <button
          type="button"
          @click="addMaterial"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          + افزودن ماده اولیه
        </button>
      </div>
    </div>

    <!-- Images -->
    <div class="bg-white rounded-lg shadow p-[1.5rem]">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">تصاویر محصول</h2>

      <div class="mb-4">
        <input
          ref="imageInput"
          type="file"
          accept="image/*"
          multiple
          @change="handleImageUpload"
          class="hidden"
        />
        <button
          type="button"
          @click="imageInput?.click()"
          :disabled="isUploading"
          class="px-4 py-2 bg-primary-600 text-white bg-black cursor-pointer rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {{ isUploading ? 'در حال آپلود...' : '+ آپلود تصاویر' }}
        </button>
      </div>

      <div v-if="form.images?.length && form.images?.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="(image, index) in form.images" :key="index" class="relative group">
          <img :src="image" alt="Product image" class="w-full h-32 object-cover rounded-lg" />
          <button
            type="button"
            @click="removeImage(index)"
            class="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Dimensions -->
    <div class="bg-white rounded-lg shadow p-[1.5rem]">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">ابعاد (سانتی‌متر)</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">طول</label>
          <input
            v-model.number="form.dimensions!.length"
            type="number"
            min="0"
            step="0.1"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">عرض</label>
          <input
            v-model.number="form.dimensions!.width"
            type="number"
            min="0"
            step="0.1"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ارتفاع</label>
          <input
            v-model.number="form.dimensions!.height"
            type="number"
            min="0"
            step="0.1"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <!-- SEO -->
    <div class="bg-white rounded-lg shadow p-[1.5rem]">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">تنظیمات SEO</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">عنوان متا</label>
          <input
            v-model="form.metaTitle"
            type="text"
            maxlength="60"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p class="text-xs text-gray-500 mt-1">{{ form.metaTitle?.length || 0 }}/60 کاراکتر</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات متا</label>
          <textarea
            v-model="form.metaDescription"
            rows="3"
            maxlength="160"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">{{ form.metaDescription?.length || 0 }}/160 کاراکتر</p>
        </div>
      </div>
    </div>

    <!-- Status -->
    <div class="bg-white rounded-lg shadow p-[1.5rem]">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">وضعیت</h2>

      <div class="space-y-4">
        <label class="flex items-center gap-2">
          <input v-model="form.isActive" type="checkbox" class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
          <span class="text-sm text-gray-700">محصول فعال است</span>
        </label>
        <label class="flex items-center gap-2">
          <input v-model="form.isFeatured" type="checkbox" class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
          <span class="text-sm text-gray-700">محصول ویژه است</span>
        </label>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex items-center justify-end gap-4">
      <router-link
        to="/products"
        class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        انصراف
      </router-link>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="px-6 py-3 bg-primary-600 text-black bg-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
      >
        {{ isSubmitting ? 'در حال ذخیره...' : submitLabel }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, type PropType, computed } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import { uploadImages } from '@/utils/upload'
import type { Product, CreateProductRequest, UpdateProductRequest } from '@/types/types'

// Props
const props = defineProps({
  product: {
    type: Object as PropType<Product | null>,
    default: null,
  },
  submitLabel: {
    type: String,
    default: 'ذخیره',
  },
})

// Emits
const emit = defineEmits<{
  submit: [data: CreateProductRequest | UpdateProductRequest]
}>()

// Stores
const categoriesStore = useCategoriesStore()

// Refs
const imageInput = ref<HTMLInputElement>()
const isUploading = ref(false)
const isSubmitting = ref(false)

// Form data
const form = ref<CreateProductRequest>({
  name: '',
  slug: '',
  description: '',
  price: 0,
  discount: 0,
  categoryId: '',
  materials: [],
  images: [],
  stock: 0,
  sku: '',
  weight: 0,
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
  },
  isFeatured: false,
  isActive: true,
  metaTitle: '',
  metaDescription: '',
})

// Computed
const categories = computed(() => categoriesStore.activeCategories)

// Ensure dimensions is always defined
if (!form.value.dimensions) {
  form.value.dimensions = { length: 0, width: 0, height: 0 }
}

/**
 * Add material
 */
const addMaterial = () => {
  form.value.materials?.push('')
}

/**
 * Remove material
 */
const removeMaterial = (index: number) => {
  form.value.materials?.splice(index, 1)
}

/**
 * Handle image upload
 */
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (!files || files.length === 0) return

  isUploading.value = true

  try {
    const fileArray = Array.from(files)
    const uploadedImages = await uploadImages(fileArray)

    if (form.value.images) {
      form.value.images.push(...uploadedImages.map((img) => img.url))
    }
  } catch (error: unknown) {
    console.error('Upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'خطا در آپلود تصاویر'
    alert(errorMessage)
  } finally {
    isUploading.value = false
    if (imageInput.value) {
      imageInput.value.value = ''
    }
  }
}

/**
 * Remove image
 */
const removeImage = (index: number) => {
  form.value.images?.splice(index, 1)
}

/**
 * Handle form submit
 */
const handleSubmit = () => {
  isSubmitting.value = true

  // Clean up form data
  const data = { ...form.value }

  // Remove empty materials
  data.materials = data.materials?.filter((m) => m.trim() !== '')

  // Remove dimensions if all values are 0
  if (data.dimensions && data.dimensions.length === 0 && data.dimensions.width === 0 && data.dimensions.height === 0) {
    delete data.dimensions
  }

  // Remove weight if 0
  if (data.weight === 0) {
    delete data.weight
  }

  emit('submit', data)

  setTimeout(() => {
    isSubmitting.value = false
  }, 1000)
}

/**
 * Load product data for editing
 */
const loadProductData = () => {
  if (props.product) {
    form.value = {
      name: props.product.name,
      slug: props.product.slug,
      description: props.product.description || '',
      price: props.product.price,
      discount: props.product.discount || 0,
      categoryId: props.product.categoryId,
      materials: props.product.materials || [],
      images: props.product.images || [],
      stock: props.product.stock,
      sku: props.product.sku || '',
      weight: props.product.weight || 0,
      dimensions: props.product.dimensions || { length: 0, width: 0, height: 0 },
      isFeatured: props.product.isFeatured || false,
      isActive: props.product.isActive !== false,
      metaTitle: props.product.metaTitle || '',
      metaDescription: props.product.metaDescription || '',
    }
  }
}

// Lifecycle
onMounted(async () => {
  await categoriesStore.fetchCategories()
  loadProductData()
})
</script>

