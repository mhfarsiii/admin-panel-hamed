<template>
  <div class="flex justify-center items-center w-screen h-screen">
    <div class="w-1/3  border-1 border-white/20   rounded-2xl flex flex-col items-center py-10 px-5 min-w-96">
      <h1 class="text-white text-2xl font-bold">Login Admin</h1>
      <form @submit.prevent="handleLogin" class="w-full flex flex-col gap-4 items-center justify-center px-10 mt-7">
        <div class="w-full flex flex-col gap-2">
          <label for="username" class="text-white">Username</label>
          <input type="text" v-model="form.username" id="username" class="bg-gray-700 rounded-md p-2 text-white">
        </div>
        <div class="w-full flex flex-col gap-2">
          <label for="password" class="text-white">Password</label>
          <input type="password" v-model="form.password" autocomplete="new-password" id="password"
            class="bg-gray-700 rounded-md p-2 text-white">
        </div>
        <button type="submit" class="bg-blue-500 cursor-pointer w-full hover:bg-blue-600 text-white rounded-md p-2 mt-5"
          :disabled="isLoading">
          <span v-if="isLoading">Loading...</span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
    <Toast />
  </div>
</template>



<script setup lang="ts">
import { reactive, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';


// types ------------------------------------------------------------
interface LoginForm {
  admin: {
    email: string,
    id: string
  },
  message: string,
  token: string
}

interface Error {
  error: string,
}




// vars ------------------------------------------------------------
const form = reactive({
  username: '',
  password: '',
})
const router = useRouter();
const isLoading = ref(false)
const toast = useToast();

// methods ------------------------------------------------------------
const handleLogin = async () => {
  isLoading.value = true
  try {
    const response = await axios.post<LoginForm | Error>('api/admin/login', {
      username: form.username,
      password: form.password,
    })
    if ('token' in response.data) {
      const token = response.data.token
      localStorage.setItem('token', token)
      router.push('/')
    }
    console.log(response.data)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: (response.data as LoginForm).message,
      life: 3000
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response.data.error,
      life: 3000
    })
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
</script>
