<template>
  <div id="app" class="min-h-screen bg-slate-50 font-sans antialiased">
    <nav v-if="!$route.meta.hideNavbar" 
      class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          
          <div class="flex items-center gap-2 group cursor-pointer" @click="$router.push('/dashboard')">
            <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
              P
            </div>
            <span class="font-black text-xl tracking-tighter text-slate-800">PRE-ORDER</span>
          </div>

          <div class="hidden md:flex items-center space-x-8">
            <router-link to="/dashboard" 
              class="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest"
              active-class="text-indigo-600">
              Dashboard
            </router-link>
            <router-link to="/create-order" 
              class="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest"
              active-class="text-indigo-600">
              สั่งผลิต
            </router-link>
            
            <div class="h-6 w-[1px] bg-slate-200"></div>

            <button @click="handleLogout" 
              class="bg-rose-50 hover:bg-rose-100 text-rose-600 px-5 py-2 rounded-xl text-xs font-black transition-all active:scale-95 uppercase tracking-tighter">
              Logout
            </button>
          </div>

          <div class="md:hidden">
             <button class="text-slate-500 text-2xl">☰</button>
          </div>
        </div>
      </div>
    </nav>

    <main :class="[!$route.meta.hideNavbar ? 'max-w-7xl mx-auto px-4 py-8' : '']">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from './store/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  if(confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
    authStore.logout();
    router.push('/login');
  }
};
</script>

<style>
/* ล้าง CSS เดิมออกให้หมด และใช้เฉพาะ Transition เล็กน้อย */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ไม่ต้องใส่ body { background... } ในนี้แล้ว เพราะเราคุมผ่าน class ใน template และ style.css แล้ว */
</style>