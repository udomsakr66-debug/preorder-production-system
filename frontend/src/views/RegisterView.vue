<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
      <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">สมัครสมาชิก</h2>
      
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-1">ชื่อผู้ใช้งาน</label>
          <input 
            v-model="form.username" 
            type="text" 
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="เช่น somchai_printing"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-1">อีเมล</label>
          <input 
            v-model="form.email" 
            type="email" 
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="example@mail.com"
            required
          />
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 font-medium mb-1">รหัสผ่าน</label>
          <input 
            v-model="form.password" 
            type="password" 
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="อย่างน้อย 6 ตัวอักษร"
            required
          />
        </div>
        
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {{ loading ? 'กำลังบันทึก...' : 'ยืนยันการสมัคร' }}
        </button>
      </form>
      
      <p class="mt-4 text-center text-sm text-gray-600">
        มีบัญชีอยู่แล้ว? <router-link to="/login" class="text-blue-600 hover:underline">เข้าสู่ระบบ</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const form = reactive({
  username: '',
  email: '',
  password: ''
});

const handleRegister = async () => {
  loading.value = true;
  try {
    // ยิงไปที่ Backend API (เช็ค URL ให้ตรงกับที่ตั้งไว้ใน Server)
    const response = await axios.post('http://localhost:5000/api/auth/register', form);
    
    alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
    router.push('/login');
  } catch (error) {
    const msg = error.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก';
    alert(msg);
  } finally {
    loading.value = false;
  }
};
</script>