<template>
  <div class="flex justify-center items-center w-screen h-screen">
    <div class="w-1/3  border-1 border-white/20   rounded-2xl flex flex-col items-center py-10 px-5 min-w-96">
      <h1 class="text-white text-2xl font-bold">Hello Hamedaei</h1>
      <form @submit.prevent="handleLogin"  class="w-full flex flex-col gap-4 items-center justify-center px-10 mt-7">
        <div class="w-full flex flex-col gap-2">
          <label for="username" class="text-white">Username</label>
          <input type="text" id="username" class="bg-gray-700 rounded-md p-2 text-white">
        </div>
        <div class="w-full flex flex-col gap-2">
          <label for="password" class="text-white">Password</label>
          <input type="password" autocomplete="new-password" id="password" class="bg-gray-700 rounded-md p-2 text-white">
        </div>
        <button type="submit" class="bg-blue-500 cursor-pointer w-full hover:bg-blue-600 text-white rounded-md p-2 mt-5">Login</button>
      </form>
    </div>
  </div>
</template>



<script setup lang="ts">
import { reactive } from 'vue';

const form = reactive({
  username: '',
  password: '',
})

const handleLogin = () => {
  console.log(form.username, form.password);
}
</script>
