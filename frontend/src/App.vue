<template>
  <div id="app">
    <nav v-if="!$route.meta.hideNavbar" class="bg-gray-800 p-4 text-white">
      <div class="container mx-auto flex justify-between items-center">
        <router-link to="/dashboard" class="font-bold text-xl">Pre-Order System</router-link>
        <div class="space-x-4">
          <router-link to="/dashboard" class="hover:text-gray-300">Dashboard</router-link>
          <router-link to="/create-order" class="hover:text-gray-300">สั่งผลิต</router-link>
          <button @click="handleLogout" class="bg-red-500 px-3 py-1 rounded">Logout</button>
        </div>
      </div>
    </nav>

    <main class="container mx-auto mt-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from './store/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style>
/* Global Styles */
body {
  margin: 0;
  background-color: #f3f4f6;
  font-family: sans-serif;
}
</style>