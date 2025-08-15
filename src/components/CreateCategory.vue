<template>
  <div class="w-full flex flex-col gap-4 mt-10">
    <form @submit.prevent="createCategory" class="w-full flex flex-col gap-10">
      <div class="w-full flex flex-col gap-3">
        <label for="categoryTitle" class="text-white">
          - Category Title -
        </label>
        <input type="text" id="categoryTitle" placeholder="Enter Category Title" class="w-full p-2 rounded-md bg-gray-800 text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500" />
      </div>
      <div class="w-full flex flex-col gap-3">
        <label for="categoryDescription" class="text-white">
          - Category Description -
        </label>
        <textarea id="categoryDescription" placeholder="Enter Category Description" class="w-full p-2 rounded-md bg-gray-800 text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
      </div>
      <div class="w-full flex flex-col items-start justify-center gap-2">
        <label for="categoryImage" class="text-white bg-gray-800 p-2 rounded-md border border-white/20">
          - Category Image -
        </label>
        <input type="file" id="categoryImage" class="w-full p-2 rounded-md bg-gray-800 text-white" />
      </div>
      <button type="submit" class="w-full p-2 rounded-md bg-blue-500 text-white">Create Category</button>
    </form>

  </div>
</template>



<script setup lang="ts">
  import { reactive } from 'vue';


  // emits ------------------------------------------------------------
  const emit = defineEmits(['createCategory']);

  // vars ------------------------------------------------------------
  const category = reactive({
    title: '',
    description: '',
    image: ''
  });

  // methods ------------------------------------------------------------
  const createCategory = () => {
    emit('createCategory', category)
  }
</script>
