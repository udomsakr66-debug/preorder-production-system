<template>
  <div class="p-6 bg-slate-50 min-h-screen font-sans">

    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-black text-slate-800">Dashboard</h1>

      <router-link
        to="/create-order"
        class="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
      >
        + สั่งผลิตใหม่
      </router-link>
    </div>

    <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">

      <table class="w-full text-left">

        <thead class="bg-slate-50/50">
          <tr>
            <th class="p-5 text-[10px] font-black text-slate-400 uppercase">รูป</th>
            <th class="p-5 text-[10px] font-black text-slate-400 uppercase">สินค้า</th>
            <th class="p-5 text-[10px] font-black text-slate-400 uppercase text-center">จำนวน</th>
            <th class="p-5 text-[10px] font-black text-slate-400 uppercase text-center">สถานะ</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-50">

          <tr
            v-for="order in orders"
            :key="order._id"
            class="hover:bg-slate-50 transition-colors"
          >

            <!-- IMAGE -->
            <td class="p-5">

              <img
                v-if="order.fileUrl"
                :src="getImage(order.fileUrl)"
                class="w-14 h-14 object-cover rounded-xl border"
                @error="imgError"
              />

              <div
                v-else
                class="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400"
              >
                No Img
              </div>

            </td>

            <!-- PRODUCT -->
            <td class="p-5">
              <div class="font-bold text-slate-700">
                {{ order.productName }}
              </div>

              <div class="text-[10px] text-slate-400 font-mono">
                {{ order.orderNumber }}
              </div>
            </td>

            <!-- QUANTITY -->
            <td class="p-5 text-center font-bold text-slate-600">
              {{ order.specs?.quantity || 0 }}
            </td>

            <!-- STATUS -->
            <td class="p-5 text-center">

              <span
                :class="statusColor(order.status)"
                class="px-3 py-1 rounded-lg text-[10px] font-black uppercase"
              >
                {{ statusThai(order.status) }}
              </span>

            </td>

          </tr>

        </tbody>

      </table>

    </div>

  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const authStore = useAuthStore()
const orders = ref([])

const API = "http://localhost:5000"

const fetchOrders = async()=>{

  const res = await axios.get(
    `${API}/api/orders/my-orders`,
    {
      headers:{
        Authorization:`Bearer ${authStore.token}`
      }
    }
  )

  orders.value = res.data.data || res.data
}

const getImage = (path)=>{
  if(!path) return ""
  if(path.startsWith("http")) return path
  return `${API}${path}`
}

const imgError = (e)=>{
  e.target.src = "https://placehold.co/100x100?text=No+Image"
}

const statusThai = (status)=>{

  const s = status?.toLowerCase()

  const map = {
    pending:"รอดำเนินการ",
    producing:"กำลังผลิต",
    completed:"เสร็จสิ้น"
  }

  return map[s] || status
}

const statusColor = (status)=>{

  const s = status?.toLowerCase()

  const map = {

    pending:"bg-yellow-50 text-yellow-600",
    producing:"bg-blue-50 text-blue-600",
    completed:"bg-green-50 text-green-600"

  }

  return map[s] || "bg-gray-50 text-gray-600"

}

onMounted(fetchOrders)
</script>