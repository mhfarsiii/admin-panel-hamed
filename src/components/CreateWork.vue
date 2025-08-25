<template>
  <div class="w-full flex flex-col gap-4 mt-10">
    <form @submit.prevent="handleSubmit" class="w-full flex flex-col gap-10">
      <div class="w-full flex flex-col gap-3">
        <label for="workTitle" class="text-white">
          - Work Title -
        </label>
        <input v-model="formData.title" type="text" id="workTitle" placeholder="Enter Work Title"
          class="w-full p-2 rounded-md bg-gray-800 text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500" />
      </div>
      <div class="w-full flex flex-col gap-3">
        <label for="workDescription" class="text-white">
          - Work Description -
        </label>
        <textarea v-model="formData.description" id="workDescription" placeholder="Enter Work Description"
          class="w-full p-2 rounded-md bg-gray-800 text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
      </div>
      <div class="w-full flex flex-col gap-3">
        <label for="workCategory" class="text-white">
          - Category -
        </label>
        <select v-model="formData.categoryId" id="workCategory" :disabled="store.isLoading"
          class="w-full p-2 rounded-md bg-gray-800 text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50">
          <option disabled :value="0">
            {{ store.isLoading ? 'Loading categories...' : 'Select Category' }}
          </option>
          <option v-for="category in store.categories" :key="category.id" :value="category.id">
            {{ category.title }}
          </option>
        </select>
      </div>
      <div class="w-full flex flex-col gap-3 items-start border-t border-white/20 pt-5">
        <label for="workImage" class="text-white bg-gray-800 p-2 rounded-md cursor-pointer ">
          - Work Image -
        </label>
        <input @change="handleImageChange" type="file" id="workImage"
          class=" p-2 rounded-md bg-gray-800 text-white cursor-pointer border border-white/20" />
      </div>
      <div class="w-full flex flex-col gap-3 items-start border-t border-white/20 pt-5">
        <label for="ExtraImages" class="text-white bg-gray-800 p-2 rounded-md cursor-pointer ">
          - Extra Images -
        </label>
        <input @change="handleExtraImagesChange" type="file" multiple id="ExtraImages"
          class=" p-2 rounded-md bg-gray-800 text-white cursor-pointer border border-white/20" />
      </div>

      <div class="w-full flex flex-col gap-3 items-start border-t border-white/20 pt-5">
        <label for="Link" class="text-white">
          - Link -
        </label>
        <input v-model="formData.link" type="text" id="Link" placeholder="https://example.com"
          class="w-full p-2 rounded-md bg-gray-800 text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500" />
      </div>

      <!-- Success/Error Messages -->
      <div v-if="store.message" class="w-full p-3 rounded-md"
        :class="store.success ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'">
        {{ store.message }}
      </div>

      <button type="submit" :disabled="store.isLoading"
        class="w-full p-2 rounded-md bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors">
        {{ store.isLoading ? 'Creating Work...' : 'Create Work' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { usePanelStore, type Work } from '@/stores/panel'
import { useToast } from 'vue-toast-notification'

const store = usePanelStore()
const toast = useToast()

const formData = reactive<Work>({
  title: '',
  description: '',
  categoryId: 0,
  image: null,
  extraImages: [],
  link: ''
})

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    formData.image = target.files[0]
  }
}

const handleExtraImagesChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    formData.extraImages = Array.from(target.files)
  }
}

const handleSubmit = async () => {
  if (!formData.title || !formData.description || formData.categoryId === 0) {
    toast.error('Please fill in all required fields')
    return
  }

  await store.postWork(formData)

  if (store.success) {
    toast.success('Work created successfully!')
    // Reset form on success
    formData.title = ''
    formData.description = ''
    formData.categoryId = 0
    formData.image = null
    formData.extraImages = []
    formData.link = ''

    // Reset file inputs
    const imageInput = document.getElementById('workImage') as HTMLInputElement
    const extraImagesInput = document.getElementById('ExtraImages') as HTMLInputElement
    if (imageInput) imageInput.value = ''
    if (extraImagesInput) extraImagesInput.value = ''
  } else {
    toast.error(store.message || 'Failed to create work')
  }
}

onMounted(async () => {
  try {
    await store.fetchCategories()
  } catch {
    toast.error('Failed to load categories')
  }
})
</script>
