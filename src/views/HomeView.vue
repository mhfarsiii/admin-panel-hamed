<template>
  <div class="container  mx-auto h-screen pt-20 overflow-hidden">
    <!-- toast -->
    <Toast />
    <!-- confirm logout -->
    <Dialog v-model:visible="visible" modal header="Edit Profile"
        :style="{ width: '25rem', backgroundColor: '#111827' }" :show-header="false">
        <span class="text-surface-500 dark:text-surface-400 block my-8"> Are You Sure About Logout?</span>
        <div class="flex justify-end gap-2">
          <Button type="button" variant="outlines" severity="secondary" @click="visible = false">Cancel</Button>
          <Button type="button" variant="outline" severity="info" @click="logout()">
            logout
          </Button>
        </div>
      </Dialog>

    <div class="w-full flex flex-nowrap">
      <!-- tab bar-->
      <div class="flex flex-col justify-between gap-2 border-r-1  border-white/20 p-6">
        <div class="flex flex-col gap-3">
          <div class="cursor-pointer  hover:text-gray-500 flex items-center flex-nowrap gap-2"
            :class="{ 'text-blue-500': activeTab === 'createWork', 'text-white': activeTab !== 'createWork' }"
            @click="activeTab = 'createWork'">
            <IconCameraUp size="19" />
            Create Work

          </div>
          <div class="cursor-pointer  hover:text-gray-500 flex items-center flex-nowrap gap-2"
            :class="{ 'text-blue-500': activeTab === 'createCategory', 'text-white': activeTab !== 'createCategory' }"
            @click="activeTab = 'createCategory'">
            <IconCategory size="19" />
            Create Category
          </div>
          <div class="cursor-pointer  hover:text-gray-500 flex items-center flex-nowrap gap-2"
            :class="{ 'text-blue-500': activeTab === 'listWork', 'text-white': activeTab !== 'listWork' }"
            @click="activeTab = 'listWork'">
            <IconListDetails size="19" />
            List Work
          </div>
          <div class="cursor-pointer  hover:text-gray-500 flex items-center flex-nowrap gap-2"
            :class="{ 'text-gray-500': activeTab === 'listCategory', 'text-white': activeTab !== 'listCategory' }"
            @click="activeTab = 'listCategory'">
            <IconListDetails size="19" />
            List Category
          </div>
        </div>
        <div class="flex flex-col gap-3">
          <div class="cursor-pointer text-white hover:text-red-500 flex items-center flex-nowrap gap-2" @click="visible = true">
            <IconLogout size="19" />
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
          <CreateCategory @createCategory="createCategory" :is-loading="panelStore.isLoading"
            :is-success="panelStore.success === true" />
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
import { onMounted, ref, watch, computed } from 'vue';
import CreateCategory from '@/components/CreateCategory.vue';
import CreateWork from '@/components/CreateWork.vue';
import { IconCategory, IconCameraUp, IconListDetails, IconLogout } from '@tabler/icons-vue';
import { useRouter } from 'vue-router';
import { usePanelStore } from '@/stores/panel';
import type { Category } from '@/stores/panel';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

// vars ------------------------------------------------------------
const activeTab = ref(localStorage.getItem('activeTab') || 'createWork');
const router = useRouter();
const panelStore = usePanelStore();
const toast = useToast();
const visible = ref(false);

// computed ------------------------------------------------------------
const message = computed(() => {
  return panelStore.message
})

// methods ------------------------------------------------------------
const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
}

const createCategory = (category: Category) => {
  panelStore.postCategory(category)
  console.log(message.value)
}

// watch ------------------------------------------------------------

watch(activeTab, (newTab) => {
  localStorage.setItem('activeTab', newTab);
});

watch(() => panelStore.success, (newSuccess) => {
  if (newSuccess !== null) { // Only show toast when success state changes

    if (newSuccess) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: panelStore.message,
        life: 3000
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: panelStore.message,
        life: 3000
      });
    }
  }
});

// onMounted ------------------------------------------------------------
onMounted(() => {
  const savedTab = localStorage.getItem('activeTab');
  if (savedTab) {
    activeTab.value = savedTab;
  }
});


</script>
