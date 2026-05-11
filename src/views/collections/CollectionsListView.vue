<template>
  <div class="collections-list-view text-black dark:text-gray-100 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4 lg:gap-0">
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30"
        >
          <svg class="w-6 h-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h10M4 18h6"
            />
          </svg>
        </div>
        <div>
          <h1 class="text-[14px] lg:text-3xl font-bold text-gray-900 dark:text-gray-100">مدیریت کالکشن‌ها</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1 text-[12px] lg:text-[15px] flex items-center gap-2">
            <span class="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
            {{ collectionsStore.totalCollections }} کالکشن
          </p>
        </div>
      </div>
      <RouterLink
      to="/collections/create"
        class="px-6 py-3 text-[12px] lg:text-[15px] whitespace-nowrap bg-blue-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>افزودن کالکشن جدید</span>
      </RouterLink>
    </div>

    <!-- Filters -->
    <div
      class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">جستجو</label>
          <input
            v-model="filters.q"
            type="text"
            placeholder="جستجو در کالکشن‌ها..."
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm hover:shadow-md"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">وضعیت</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl text-[12px] lg:text-[15px] focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm hover:shadow-md"
            @change="fetchCollections"
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="collectionsStore.isLoading && collections.length === 0"
      class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-8"
    >
      <div class="animate-pulse space-y-4">
        <div
          v-for="i in 5"
          :key="i"
          class="h-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-xl"
        ></div>
      </div>
    </div>

    <!-- Collections Table -->
    <div
      v-else-if="collections.length > 0"
      class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead
            class="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-700 dark:to-gray-800/50 border-b border-gray-200 dark:border-gray-700"
          >
            <tr>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                تصویر
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                عنوان کالکشن
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                اسلاگ
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                تعداد محصولات
              </th>

            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200/50 dark:divide-gray-700/50">
            <tr
              v-for="collection in collections"
              :key="collection.id"
              class="hover:bg-gradient-to-l hover:from-primary-50/30 dark:hover:from-primary-900/30 hover:to-transparent transition-all duration-200 group"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="relative">
                  <img
                    v-if="collection.coverImage"
                    :src="collection.coverImage"
                    :alt="collection.title"
                    class="w-16 h-16 object-cover rounded-xl shadow-sm group-hover:shadow-md transition-shadow"
                  />
                  <div
                    v-else
                    class="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center"
                  >
                    <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ collection.title }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ collection.description || 'بدون توضیحات' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-900 dark:text-gray-100 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {{ collection.slug }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {{ collection.products?.length || 0 }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ collection.sortOrder }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-all font-semibold text-xs"
                    @click="editCollection(collection)"
                  >
                    ویرایش
                  </button>
                  <button
                    type="button"
                    class="px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-all font-semibold text-xs"
                    @click="deleteCollection(collection)"
                  >
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-12 text-center"
    >
      <div
        class="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
      >
        <svg class="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h6" />
        </svg>
      </div>
      <p class="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2">کالکشنی یافت نشد</p>
      <p class="text-gray-500 dark:text-gray-500 text-sm mb-6">شروع کنید و اولین کالکشن خود را اضافه کنید</p>
      <router-link
        to="/collections/create"
        class="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        افزودن اولین کالکشن
      </router-link>
    </div>

    <!-- Create Collection Modal -->
    <BaseModal :modelValue="showCreateModal" v-if="showCreateModal" @close="closeModal">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">ایجاد کالکشن جدید</h3>
      </template>
      <template #body>
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              نام کالکشن (Title) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">توضیحات</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تصویر کالکشن (Cover Image)</label>
            <div class="flex items-center gap-3">
              <input
                v-model="form.coverImage"
                type="text"
                placeholder="آدرس تصویر (اختیاری)"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            <div v-if="form.coverImage" class="mt-3">
              <img :src="form.coverImage" alt="Collection preview" class="h-24 w-full object-cover rounded-lg" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              شناسه محصولات داخل کالکشن (Product IDs)
            </label>
            <textarea
              v-model="productIdsInput"
              rows="2"
              placeholder="شناسه محصولات را با کاما جدا کنید، مثل: prodId1, prodId2, prodId3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ترتیب نمایش</label>
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
              <span class="text-sm text-gray-700 dark:text-gray-300">کالکشن فعال است</span>
            </label>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              @click="closeModal"
            >
              انصراف
            </button>
            <button
              type="submit"
              :disabled="collectionsStore.isLoading"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {{ collectionsStore.isLoading ? 'در حال ذخیره...' : 'ذخیره' }}
            </button>
          </div>
        </form>
      </template>
    </BaseModal>

    <!-- Edit Collection Modal -->
    <BaseModal :modelValue="showEditModal" v-if="showEditModal" @close="closeModal">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">ویرایش کالکشن</h3>
      </template>
      <template #body>
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              نام کالکشن (Title) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">توضیحات</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تصویر کالکشن (Cover Image)</label>
            <div class="flex items-center gap-3">
              <input
                v-model="form.coverImage"
                type="text"
                placeholder="آدرس تصویر (اختیاری)"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            <div v-if="form.coverImage" class="mt-3">
              <img :src="form.coverImage" alt="Collection preview" class="h-24 w-full object-cover rounded-lg" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              شناسه محصولات داخل کالکشن (Product IDs)
            </label>
            <textarea
              v-model="productIdsInput"
              rows="2"
              placeholder="شناسه محصولات را با کاما جدا کنید، مثل: prodId1, prodId2, prodId3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ترتیب نمایش</label>
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
              <span class="text-sm text-gray-700 dark:text-gray-300">کالکشن فعال است</span>
            </label>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              @click="closeModal"
            >
              انصراف
            </button>
            <button
              type="submit"
              :disabled="collectionsStore.isLoading"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {{ collectionsStore.isLoading ? 'در حال ذخیره...' : 'ذخیره' }}
            </button>
          </div>
        </form>
      </template>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal :modelValue="showDeleteModal" v-if="showDeleteModal" @close="showDeleteModal = false">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">حذف کالکشن</h3>
      </template>
      <template #body>
        <p class="text-gray-600 dark:text-gray-400">آیا از حذف کالکشن "{{ collectionToDelete?.title }}" اطمینان دارید؟</p>
        <p class="text-sm text-red-600 dark:text-red-400 mt-2">این عملیات قابل بازگشت نیست.</p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            @click="showDeleteModal = false"
          >
            انصراف
          </button>
          <button
            type="button"
            :disabled="collectionsStore.isLoading"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            @click="confirmDelete"
          >
            {{ collectionsStore.isLoading ? 'در حال حذف...' : 'حذف' }}
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectionsStore } from '@/stores/collections'
import BaseModal from '@/components/BaseModal.vue'
import { uploadImage } from '@/utils/upload'
import type { Collection, CreateCollectionRequest, UpdateCollectionRequest, CollectionsListQuery } from '@/types/types'

const collectionsStore = useCollectionsStore()
const router = useRouter()

// State
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const collectionToEdit = ref<Collection | null>(null)
const collectionToDelete = ref<Collection | null>(null)
const imageInput = ref<HTMLInputElement>()
const isUploading = ref(false)

type StatusFilter = '' | 'active' | 'inactive'

const filters = ref<{ q: string; status: StatusFilter }>({
  q: '',
  status: '',
})

interface CollectionForm {
  title: string
  slug: string
  description: string
  coverImage: string
  isActive: boolean
  sortOrder: number
}

const form = ref<CollectionForm>({
  title: '',
  slug: '',
  description: '',
  coverImage: '',
  isActive: true,
  sortOrder: 0,
})

const productIdsInput = ref('')

// Computed
const collections = computed(() => collectionsStore.collections)


/**
 * Fetch collections with filters
 */
const fetchCollections = async () => {
  const query: CollectionsListQuery = {}

  if (filters.value.q) {
    query.q = filters.value.q
  }

  if (filters.value.status === 'active') {
    query.isActive = true
  } else if (filters.value.status === 'inactive') {
    query.isActive = false
  }

  await collectionsStore.fetchCollections(query)
}

/**
 * Debounced search
 */
let searchTimeout: number
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = window.setTimeout(() => {
    fetchCollections()
  }, 500)
}

/**
 * Edit collection
 */
const editCollection = (collection: Collection) => {
  if (!collection.slug) return
  router.push({
    name: 'collections-edit',
    params: { slug: collection.slug },
  })
}

/**
 * Delete collection
 */
const deleteCollection = (collection: Collection) => {
  collectionToDelete.value = collection
  showDeleteModal.value = true
}

/**
 * Handle image upload
 */
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

/**
 * Handle form submit
 */
const handleSubmit = async () => {
  const productIds = productIdsInput.value
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0)

  if (collectionToEdit.value && showEditModal.value) {
    const updatePayload: UpdateCollectionRequest = {
      title: form.value.title,
      slug: form.value.slug || undefined,
      description: form.value.description || undefined,
      coverImage: form.value.coverImage || undefined,
      productIds: productIds.length ? productIds : undefined,
      isActive: form.value.isActive,
      sortOrder: form.value.sortOrder,
    }

    await collectionsStore.updateCollection(collectionToEdit.value.id, updatePayload)
    if (collectionsStore.success) {
      closeModal()
    }
  } else {
    const payload: CreateCollectionRequest = {
      title: form.value.title,
      description: form.value.description || undefined,
      coverImage: form.value.coverImage || undefined,
      productIds,
    }

    await collectionsStore.createCollection(payload)
    if (collectionsStore.success) {
      closeModal()
    }
  }
}

/**
 * Confirm delete
 */
const confirmDelete = async () => {
  if (collectionToDelete.value) {
    const success = await collectionsStore.deleteCollection(collectionToDelete.value.id)
    if (success) {
      showDeleteModal.value = false
      collectionToDelete.value = null
    }
  }
}

/**
 * Close modal
 */
const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  collectionToEdit.value = null
  form.value = {
    title: '',
    slug: '',
    description: '',
    coverImage: '',
    isActive: true,
    sortOrder: 0,
  }
  productIdsInput.value = ''
}

onMounted(async () => {
  await fetchCollections()
})
</script>
