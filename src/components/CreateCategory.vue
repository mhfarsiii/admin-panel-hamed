<template>
  <div class="w-full flex flex-col gap-4 mt-10">
    <form @submit.prevent="createCategory" class="w-full flex flex-col gap-10">
      <div class="w-full flex flex-col gap-3">
        <label for="categoryTitle" class="text-white">
          - Category Title -
        </label>
        <input type="text" v-model="category.title" id="categoryTitle" placeholder="Enter Category Title"
          @input="errors.title = ''" :class="[
            'w-full p-2 rounded-md bg-gray-800 text-white border focus:outline-none focus:ring-1 focus:ring-blue-500',
            errors.title ? 'border-red-500' : 'border-white/20'
          ]" />
        <span v-if="errors.title" class="text-red-400 text-sm">{{ errors.title }}</span>
      </div>
      <div class="w-full flex flex-col gap-3">
        <label for="categoryDescription" class="text-white">
          - Category Description -
        </label>
        <textarea id="categoryDescription" v-model="category.description" placeholder="Enter Category Description"
          @input="errors.description = ''" :class="[
            'w-full p-2 rounded-md bg-gray-800 text-white border focus:outline-none focus:ring-1 focus:ring-blue-500',
            errors.description ? 'border-red-500' : 'border-white/20'
          ]"></textarea>
        <span v-if="errors.description" class="text-red-400 text-sm">{{ errors.description }}</span>
      </div>
      <div class="w-full flex flex-col items-start justify-center gap-2">
        <label for="categoryImage"
          class="text-white bg-gray-800 cursor-pointer hover:bg-blue-700 p-2 rounded-md border border-white/20">
          - Category Image -
        </label>
        <input type="file" id="categoryImage" @change="handleImageUpload" accept="image/*"
          class="w-full p-2 rounded-md bg-gray-800 text-white" />
        <span v-if="errors.image" class="text-red-400 text-sm">{{ errors.image }}</span>

        <!-- Image Preview Section -->
        <div v-if="imagePreview" class="w-full flex flex-col gap-3 my-5">
          <label class="text-white text-sm">Image Preview:</label>
          <div class="relative inline-block  w-[550px] h-[180px]">
            <img :src="imagePreview" alt="Category preview"
              class=" rounded-md border border-white/20 w-full h-full object-cover" />
            <button @click="removeImage" type="button"
              class="absolute -top-2 -right-2 cursor-pointer bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm hover:bg-red-600 transition-colors">
              <icon-x />
            </button>
          </div>
        </div>
      </div>
      <button
      type="button"
      class="w-full p-2 rounded-md bg-blue-500 text-white  hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer"
      @click="validateAndSubmit" :disabled="props.isLoading">
      Create Category
    </button>

    <!-- modal confirm -->
    <div class="flex flex-wrap justify-center gap-2 mb-2">
      <Dialog v-model:visible="visible" modal header="Edit Profile" :position="position"
        :style="{ width: '25rem', backgroundColor: '#111827' }" :show-header="false">
        <span class="text-surface-500 dark:text-surface-400 block my-8"> Are You Sure To Create This Category?</span>
        <div class="flex justify-end gap-2">
          <Button type="button" variant="outlines" severity="secondary" @click="visible = false">Cancel</Button>
          <Button type="submit" variant="outline" severity="info" @click="createCategory()">
            <i v-if="props.isLoading" class="pi pi-spin pi-spinner" style="font-size: 1rem"></i>
            <span v-else>Create</span>
          </Button>
        </div>
      </Dialog>
    </div>
    </form>






  </div>
</template>



<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { IconX } from '@tabler/icons-vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';





// props
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  isSuccess: {
    type: Boolean,
    default: false
  }
})

// emits ------------------------------------------------------------
const emit = defineEmits(['createCategory']);

// vars ------------------------------------------------------------
const category = reactive({
  title: '',
  description: '',
  image: null as File | null,
});

const errors = reactive({
  title: '',
  description: '',
  image: '',
});

const position = ref('center');
const visible = ref(false);
const imagePreview = ref<string | null>(null);
const Loading = ref(false);








// methods ------------------------------------------------------------
const validateForm = (): boolean => {
  // Reset errors
  errors.title = '';
  errors.description = '';
  errors.image = '';

  let isValid = true;


  // Validate title
  if (!category.title.trim()) {
    errors.title = 'Category title is required';
    isValid = false;

  }

  // Validate description
  if (!category.description.trim()) {
    errors.description = 'Category description is required';
    isValid = false;

  }

  // Validate image
  if (!category.image) {
    errors.image = 'Category image is required';
    isValid = false;

  }

  return isValid;
};

const validateAndSubmit = () => {
  if (validateForm()) {
    openPosition('top');
  }
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    category.image = file;
    // Create preview URL
    imagePreview.value = URL.createObjectURL(file);
    // Clear image error if exists
    errors.image = '';
  }
};

const openPosition = (pop: string) => {
  position.value = pop;
  visible.value = true;
}

const removeImage = () => {
  category.image = null;
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
    imagePreview.value = null;
  }
  // Reset file input
  const fileInput = document.getElementById('categoryImage') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
  // Clear image error
  errors.image = '';
};

const createCategory = () => {
  // Create FormData to send image file
  const formData = new FormData();
  formData.append('title', category.title);
  formData.append('description', category.description);

  if (category.image) {
    formData.append('image', category.image);
  }

  emit('createCategory', formData);
  visible.value = false;
  Loading.value = props.isLoading;
  // Only reset form if operation is successful
  if (props.isSuccess) {
    resetForm();
  }
}

// Add a new method to reset the form
const resetForm = () => {
  category.title = '';
  category.description = '';
  removeImage();

  // Clear all errors
  errors.title = '';
  errors.description = '';
  errors.image = '';




}



// Add a watcher to reset form when success changes to true
watch(() => props.isSuccess, (newSuccess) => {
  if (newSuccess) {
    resetForm();
  }
});
</script>
