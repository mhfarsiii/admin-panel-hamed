<template>
  <div class="container  mx-auto h-screen pt-20 overflow-hidden">
    <div class="w-full flex flex-nowrap">
      <!-- tab bar-->
       <div class="flex flex-col justify-between gap-2 border-r-1  border-white/20 p-6">
        <div class="flex flex-col gap-3">
          <div class="cursor-pointer text-white hover:text-gray-500 flex items-center flex-nowrap gap-2" @click="activeTab = 'createWork'">
            <IconCameraUp size="19"/>
            Create Work

          </div>
        <div class="cursor-pointer text-white hover:text-gray-500 flex items-center flex-nowrap gap-2" @click="activeTab = 'createCategory'">
          <IconCategory size="19"/>
          Create Category
        </div>
        <div class="cursor-pointer text-white hover:text-gray-500 flex items-center flex-nowrap gap-2" @click="activeTab = 'listWork'">
          <IconListDetails size="19"/>
          List Work
        </div>
        <div class="cursor-pointer text-white hover:text-gray-500 flex items-center flex-nowrap gap-2" @click="activeTab = 'listCategory'">
          <IconListDetails size="19"/>
          List Category</div>
        </div>
        <div class="flex flex-col gap-3">
          <div class="cursor-pointer text-white hover:text-red-500 flex items-center flex-nowrap gap-2" @click="logout">
            <IconLogout size="19"/>
            Logout
          </div>
        </div>
       </div>
       <!-- tab content -->
       <div class="flex-1 w-full   h-[calc(100vh-80px)] overscroll-y-auto px-6">
        <!-- create work -->
        <div v-if="activeTab === 'createWork'" class="w-full h-full overflow-y-scroll pb-7 ">
          <h1 class="text-2xl font-bold text-white">Create Work</h1>
          <CreateWork />
        </div>
        <!-- create category -->
        <div v-if="activeTab === 'createCategory'" class="w-full h-full overflow-y-scroll pb-7 ">
          <h1 class="text-2xl font-bold text-white">Create Category</h1>
          <CreateCategory />
        </div>
        <!-- list work -->
        <div v-if="activeTab === 'listWork'" class="w-full h-full overflow-y-scroll pb-7 ">
          <h1 class="text-2xl font-bold text-white">List Work</h1>
        </div>
        <!-- list category -->
        <div v-if="activeTab === 'listCategory'" class="w-full h-full overflow-y-scroll pb-7 ">
          <h1 class="text-2xl font-bold text-white">List Category</h1>
        </div>
       </div>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref } from 'vue';
import CreateCategory from '@/components/CreateCategory.vue';
import CreateWork from '@/components/CreateWork.vue';
import { IconCategory,IconCameraUp,IconListDetails,IconLogout } from '@tabler/icons-vue';
import { useRouter } from 'vue-router';

// vars ------------------------------------------------------------
const activeTab = ref('createWork');
const router = useRouter();

// methods ------------------------------------------------------------
const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
}


</script>
