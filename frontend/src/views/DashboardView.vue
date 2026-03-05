<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
      <router-link 
        to="/create-order" 
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition"
      >
        + สร้างคำสั่งใหม่
      </router-link>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-blue-500 text-white p-6 rounded-xl shadow-lg">
        <h3 class="text-lg opacity-90">ออเดอร์ทั้งหมด</h3>
        <p class="text-4xl font-bold">{{ orders.length }}</p>
      </div>
      
      <div class="bg-yellow-500 text-white p-6 rounded-xl shadow-lg">
        <h3 class="text-lg opacity-90">กำลังผลิต</h3>
        <p class="text-4xl font-bold">{{ stats.producing }}</p>
      </div>

      <div class="bg-green-500 text-white p-6 rounded-xl shadow-lg">
        <h3 class="text-lg opacity-90">ส่งมอบแล้ว</h3>
        <p class="text-4xl font-bold">{{ stats.completed }}</p>
      </div>
    </div>

    <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
      <table class="w-full text-left">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="p-4 font-semibold text-gray-600">สินค้า</th>
            <th class="p-4 font-semibold text-gray-600 text-center">จำนวน</th>
            <th class="p-4 font-semibold text-gray-600 text-center">สถานะ</th>
            <th class="p-4 font-semibold text-gray-600 text-right">วันที่สั่ง</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id" class="border-b border-gray-50 hover:bg-blue-50/30 transition">
            <td class="p-4">
              <div class="font-medium text-gray-800">{{ order.productName }}</div>
              <div class="text-xs text-gray-400 font-mono">{{ order._id.substring(0, 8) }}</div>
            </td>
            <td class="p-4 text-center text-gray-700">
              {{ JSON.parse(order.specs || '{}').quantity || 0 }} ชิ้น
            </td>
            <td class="p-4 text-center">
              <span :class="statusBadge(order.status)" class="px-3 py-1 rounded-full text-xs font-bold uppercase">
                {{ formatStatus(order.status) }}
              </span>
            </td>
            <td class="p-4 text-right text-sm text-gray-500">
              {{ new Date(order.createdAt).toLocaleDateString('th-TH') }}
            </td>
          </tr>
          
          <tr v-if="loading">
            <td colspan="4" class="p-10 text-center text-gray-400 italic">กำลังโหลดข้อมูล...</td>
          </tr>
          <tr v-if="!loading && orders.length === 0">
            <td colspan="4" class="p-10 text-center text-gray-400">ยังไม่มีรายการสั่งผลิต</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import axios from 'axios';

const orders = ref([]);
const loading = ref(true);

// ดึงข้อมูลจาก API
const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/orders/my-orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    orders.value = response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
  } finally {
    loading.value = false;
  }
};

// คำนวณตัวเลขสรุปผล
const stats = computed(() => {
  return {
    producing: orders.value.filter(o => o.status === 'producing').length,
    completed: orders.value.filter(o => o.status === 'completed').length
  };
});

// ฟอร์แมตชื่อสถานะ
const formatStatus = (status) => {
  const map = {
    pending: 'รอนุมัติ',
    approved: 'อนุมัติแล้ว',
    producing: 'กำลังผลิต',
    completed: 'สำเร็จ',
    rejected: 'ยกเลิก'
  };
  return map[status] || status;
};

// กำหนดสี Badge ตามสถานะ
const statusBadge = (status) => {
  const base = 'px-3 py-1 rounded-full text-xs font-bold';
  if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
  if (status === 'producing') return 'bg-blue-100 text-blue-700';
  if (status === 'completed') return 'bg-green-100 text-green-700';
  return 'bg-gray-100 text-gray-600';
};

onMounted(fetchOrders);
</script>

<style scoped>
/* คุณสามารถลบ style เดิมทิ้งได้เลยเพราะใช้ Tailwind คลุมไว้หมดแล้วครับ */
</style>