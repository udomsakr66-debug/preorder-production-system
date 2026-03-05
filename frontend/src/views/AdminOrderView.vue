<template>
  <div class="p-6 md:p-10 bg-[#fbfcfd] min-h-screen font-sans text-slate-900">

    <!-- HEADER -->
    <div class="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 class="text-4xl font-black tracking-tighter text-slate-900">
          Orders Management
        </h1>

        <div class="flex items-center gap-3 mt-2">
          <span class="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded-full tracking-wider">
            Admin Level
          </span>
          <p class="text-slate-400 text-sm font-bold">
            อัปเดตข้อมูลล่าสุดเมื่อสักครู่
          </p>
        </div>
      </div>

      <button
        @click="fetchAllOrders"
        :disabled="isProcessing"
        class="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-6 py-3 rounded-2xl shadow-sm font-black text-sm flex items-center gap-3 transition-all active:scale-95"
      >
        <span :class="{ 'animate-spin': isProcessing }">🔄</span>
        Sync Database
      </button>
    </div>

    <!-- STATS -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

      <div
        v-for="stat in ['pending','producing','completed']"
        :key="stat"
        @click="currentFilter = stat"
        class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer"
      >
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {{ formatStatus(stat) }}
        </p>

        <h3 class="text-3xl font-black mt-1">
          {{ getCount(stat) }}
          <span class="text-sm text-slate-300">รายการ</span>
        </h3>
      </div>

    </div>

    <!-- TABLE -->
    <div class="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">

        <table class="w-full">

          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100 text-left">
              <th class="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Customer
              </th>

              <th class="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                Reference Image
              </th>

              <th class="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Product
              </th>

              <th class="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Status
              </th>

              <th class="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-50">

            <tr
              v-for="order in filteredOrders"
              :key="order._id"
              class="hover:bg-blue-50/30 transition-colors"
            >

              <!-- CUSTOMER -->
              <td class="p-6">
                <div class="font-black text-slate-800">
                  {{ order.user?.username || 'Guest' }}
                </div>
                <div class="text-xs text-slate-400 font-bold">
                  {{ order.user?.email }}
                </div>
              </td>

              <!-- IMAGE -->
              <td class="p-6">

                <div
                  v-if="order.fileUrl"
                  @click="openImage(order.fileUrl)"
                  class="relative group w-16 h-16 mx-auto cursor-zoom-in"
                >

                  <img
                    :src="getFullImageUrl(order.fileUrl)"
                    class="w-full h-full object-cover rounded-xl border border-slate-100 shadow-sm"
                    alt="Order Image"
                    @error="imgError"
                  >

                  <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center">
                    <span class="text-white text-[10px] font-black bg-black/40 px-2 py-1 rounded-md">
                      VIEW
                    </span>
                  </div>

                </div>

                <div
                  v-else
                  class="w-16 h-16 mx-auto bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-200 text-[9px] text-slate-300 font-bold italic text-center px-1"
                >
                  No Image
                </div>

              </td>

              <!-- PRODUCT -->
              <td class="p-6">

                <div class="font-bold text-slate-900">
                  {{ order.productName }}
                </div>

                <span class="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md italic">
                  #{{ order._id?.slice(-6).toUpperCase() }}
                </span>

              </td>

              <!-- STATUS -->
              <td class="p-6">

                <span
                  :class="statusBadge(order.status)"
                  class="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase"
                >
                  {{ formatStatus(order.status) }}
                </span>

              </td>

              <!-- ACTIONS -->
              <td class="p-6 text-right">

                <div class="flex justify-end gap-3">

                  <button
                    v-if="order.status==='pending'"
                    @click="updateStatus(order._id,'producing')"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-[10px] font-black"
                  >
                    ACCEPT
                  </button>

                  <button
                    v-if="order.status==='producing'"
                    @click="updateStatus(order._id,'completed')"
                    class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black"
                  >
                    DONE
                  </button>

                  <button
                    @click="deleteOrder(order._id)"
                    class="text-slate-300 hover:text-red-500 p-2"
                  >
                    🗑️
                  </button>

                </div>

              </td>

            </tr>

          </tbody>

        </table>

      </div>
    </div>

    <!-- IMAGE MODAL -->
    <div
      v-if="showModal"
      @click="showModal=false"
      class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90"
    >

      <img
        :src="modalImageUrl"
        class="max-h-[85vh] rounded-2xl shadow-2xl"
        @click.stop
      >

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const API_URL = 'http://localhost:5000'

const allOrders = ref([])
const currentFilter = ref('all')
const isProcessing = ref(false)

const showModal = ref(false)
const modalImageUrl = ref('')

const fetchAllOrders = async () => {
  isProcessing.value = true

  try {

    const res = await axios.get(
      `${API_URL}/api/orders/admin/all`,
      {
        headers:{
          Authorization:`Bearer ${authStore.token}`
        }
      }
    )

    allOrders.value = res.data.data || res.data

  } catch(error){

    if(error.response?.status === 401){
      authStore.logout()
      router.push('/login')
    }

  } finally{
    isProcessing.value = false
  }
}

const updateStatus = async (orderId,status)=>{

  await axios.patch(
    `${API_URL}/api/orders/${orderId}/status`,
    {status},
    {headers:{Authorization:`Bearer ${authStore.token}`}}
  )

  fetchAllOrders()
}

const deleteOrder = async(orderId)=>{

  if(!confirm("ยืนยันการลบ?")) return

  await axios.delete(
    `${API_URL}/api/orders/${orderId}`,
    {headers:{Authorization:`Bearer ${authStore.token}`}}
  )

  fetchAllOrders()
}

const getFullImageUrl = (path)=>{
  if(!path) return ''
  if(path.startsWith('http')) return path
  return `${API_URL}${path}`
}

const openImage = (url)=>{
  modalImageUrl.value = getFullImageUrl(url)
  showModal.value = true
}

const imgError = (e)=>{
  e.target.src='https://placehold.co/100x100?text=No+Image'
}

const filteredOrders = computed(()=>{

  if(currentFilter.value === 'all')
    return allOrders.value

  return allOrders.value.filter(
    o=>o.status===currentFilter.value
  )

})

const getCount = (status)=>{
  return allOrders.value.filter(
    o=>o.status===status
  ).length
}

const formatStatus = (s)=>{

  const map={
    pending:'รอดำเนินการ',
    producing:'กำลังผลิต',
    completed:'เสร็จสิ้น'
  }

  return map[s] || s
}

const statusBadge = (s)=>{

  const map={
    pending:'bg-amber-100 text-amber-600',
    producing:'bg-blue-100 text-blue-600',
    completed:'bg-emerald-100 text-emerald-600'
  }

  return map[s] || 'bg-slate-100 text-slate-500'
}

onMounted(fetchAllOrders)
</script>