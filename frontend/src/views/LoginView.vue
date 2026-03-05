<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">เข้าสู่ระบบ</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700">อีเมล</label>
          <input 
            v-model="email" 
            type="email" 
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="example@mail.com"
            required
            :disabled="isLoading"
          />
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700">รหัสผ่าน</label>
          <input 
            v-model="password" 
            type="password" 
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="********"
            required
            :disabled="isLoading"
          />
        </div>
        
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex justify-center items-center"
        >
          <span v-if="isLoading" class="mr-2 animate-spin text-lg">⏳</span>
          {{ isLoading ? 'กำลังเข้าสู่ระบบ...' : 'Login' }}
        </button>
      </form>
      
      <p class="mt-4 text-center text-sm text-gray-600">
        ยังไม่มีบัญชี? <router-link to="/register" class="text-blue-500 hover:underline">สมัครสมาชิก</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const isLoading = ref(false); // เพิ่ม Loading State
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  if (isLoading.value) return;
  
  isLoading.value = true;
  try {
    // 1. เรียกใช้ Action Login
    const success = await authStore.login({
      email: email.value,
      password: password.value
    });
    
    // 2. ตรวจสอบว่าใน Store เก็บ Token สำเร็จหรือไม่ (เสริมความมั่นใจ)
    if (authStore.token || success !== false) {
      alert('เข้าสู่ระบบสำเร็จ!');
      
      // 3. ใช้ setTimeout เล็กน้อยเพื่อให้แน่ใจว่า Store อัปเดตเสร็จแล้วค่อยเปลี่ยนหน้า
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
    }
  } catch (error) {
    console.error('Login Error:', error);
    const errorMsg = error.response?.data?.message || 'การเชื่อมต่อเซิร์ฟเวอร์ขัดข้อง';
    alert('เข้าสู่ระบบไม่สำเร็จ: ' + errorMsg);
  } finally {
    isLoading.value = false;
  }
};
</script>