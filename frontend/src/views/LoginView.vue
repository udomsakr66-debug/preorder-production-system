<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 p-4 font-sans text-slate-900">
    <div class="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] overflow-hidden border border-white">
      
      <div class="p-8 md:p-12">
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-[2rem] mb-6 shadow-xl shadow-blue-200 rotate-3 hover:rotate-0 transition-transform duration-300">
            <span class="text-white text-4xl font-black italic">P</span>
          </div>
          <h2 class="text-3xl font-black tracking-tighter text-slate-800">ยินดีต้อนรับกลับ</h2>
          <p class="text-slate-500 text-sm mt-2 font-medium">จัดการคำสั่งซื้อของคุณอย่างมืออาชีพ</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="group">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Email Address</label>
            <input v-model="email" type="email" required :disabled="isLoading"
              class="w-full pl-5 pr-4 py-4 bg-slate-100/50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700 font-semibold"
              placeholder="you@example.com">
          </div>
          
          <div class="group">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
            <input v-model="password" type="password" required :disabled="isLoading"
              class="w-full pl-5 pr-4 py-4 bg-slate-100/50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-700 font-semibold"
              placeholder="••••••••">
          </div>
          
          <button type="submit" :disabled="isLoading"
            class="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-slate-200 transition-all transform active:scale-[0.97] flex justify-center items-center gap-3 mt-8">
            <template v-if="isLoading">
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>กำลังตรวจสอบ...</span>
            </template>
            <span v-else>เข้าสู่ระบบ <span class="opacity-50">→</span></span>
          </button>

          <div class="mt-8 text-center border-t border-slate-100 pt-6">
            <p class="text-sm text-slate-500 font-medium">
              ยังไม่มีบัญชีผู้ใช้? 
              <router-link to="/register" class="text-blue-600 font-black hover:underline ml-1">
                สมัครสมาชิกใหม่ที่นี่
              </router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const isLoading = ref(false);

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  
  try {
    // 💡 ส่งข้อมูลไปที่ Store
    const success = await authStore.login({
      email: email.value,
      password: password.value
    });
    
    if (success) {
      // ✅ เช็ค Role เพื่อส่งไปหน้าแอดมินหรือหน้าผู้ใช้
      if (authStore.user?.role === 'admin') {
        router.push('/admin/orders');
      } else {
        router.push('/dashboard');
      }
    }
  } catch (error) {
    console.error('Login Error:', error);
    // แสดงข้อความ Error จาก Backend ถ้ามี
    const msg = error.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
    alert('เข้าสู่ระบบไม่สำเร็จ: ' + msg);
  } finally {
    isLoading.value = false;
  }
};
</script>