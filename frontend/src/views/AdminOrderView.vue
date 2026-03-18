<template>
  <div class="p-6 md:p-10 bg-[#fbfcfd] min-h-screen font-sans text-slate-900">

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

    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div
        v-for="stat in ['pending','producing','completed']"
        :key="stat"
        @click="currentFilter = stat"
        :class="[
          currentFilter === stat ? 'ring-2 ring-blue-500 border-transparent' : 'border-slate-100',
          'bg-white p-6 rounded-[2rem] border shadow-sm hover:shadow-md transition cursor-pointer'
        ]"
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

    <div class="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100 text-left">
              <th class="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
              <th class="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Image</th>
              <th class="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product & Specs</th>
              <th class="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th class="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-50">
            <tr v-for="order in filteredOrders" :key="order._id" class="hover:bg-blue-50/30 transition-colors">
              
              <td class="p-6">
                <div class="font-black text-slate-800">{{ order.user?.username || 'Guest' }}</div>
                <div class="text-xs text-slate-400 font-bold">{{ order.user?.email }}</div>
              </td>

              <td class="p-6">
                <div v-if="order.fileUrl" @click="openImage(order.fileUrl)" class="relative group w-14 h-14 mx-auto cursor-zoom-in">
                  <img :src="getFullImageUrl(order.fileUrl)" class="w-full h-full object-cover rounded-xl border border-slate-100 shadow-sm" @error="imgError">
                </div>
                <div v-else class="w-14 h-14 mx-auto bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-200 text-[8px] text-slate-300 font-bold italic">No Pic</div>
              </td>

              <td class="p-6">
                <div class="font-bold text-slate-900 leading-tight">{{ order.productName }}</div>
                <div class="flex flex-wrap gap-1 mt-1.5">
                  <span class="text-[9px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">#{{ order._id?.slice(-6).toUpperCase() }}</span>
                  <span class="text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{{ formatSpec('material', order.specs?.material) }}</span>
                  <span v-if="order.specs?.finish !== 'none'" class="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">เคลือบ{{ formatSpec('finish', order.specs?.finish) }}</span>
                </div>
              </td>

              <td class="p-6">
                <span :class="statusBadge(order.status)" class="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase">
                  {{ formatStatus(order.status) }}
                </span>
              </td>

              <td class="p-6 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="viewDetails(order)" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-[10px] font-black transition-all">
                    VIEW
                  </button>
                  <button v-if="order.status==='pending'" @click="updateStatus(order._id,'producing')" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-[10px] font-black shadow-sm shadow-blue-200">
                    ACCEPT
                  </button>
                  <button v-if="order.status==='producing'" @click="updateStatus(order._id,'completed')" class="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-xl text-[10px] font-black shadow-sm shadow-emerald-200">
                    DONE
                  </button>
                  <button @click="deleteOrder(order._id)" class="text-slate-300 hover:text-red-500 p-2 transition-colors">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showDetailModal" class="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click="showDetailModal = false">
      <div class="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" @click.stop>
        <div class="p-8">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-2xl font-black text-slate-900 tracking-tight">รายละเอียดใบสั่งผลิต</h3>
              <p class="text-blue-500 font-bold text-xs">ORDER #{{ selectedOrder?._id?.toUpperCase() }}</p>
            </div>
            <button @click="showDetailModal = false" class="bg-slate-50 text-slate-400 hover:text-slate-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors">✕</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Reference Image</p>
              <div class="aspect-square bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden shadow-inner group relative">
                <img :src="getFullImageUrl(selectedOrder?.fileUrl)" class="w-full h-full object-cover" @error="imgError">
                <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button @click="openImage(selectedOrder?.fileUrl)" class="bg-white/90 px-4 py-2 rounded-full text-[10px] font-black shadow-xl">VIEW FULL IMAGE</button>
                </div>
              </div>
            </div>

            <div class="space-y-5">
              <div class="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                <p class="text-[10px] font-black text-blue-400 uppercase mb-1">Customer Info</p>
                <p class="font-black text-slate-800">{{ selectedOrder?.user?.username || 'Guest' }}</p>
                <p class="text-xs text-blue-600 font-bold opacity-70">{{ selectedOrder?.user?.email || 'No email' }}</p>
              </div>

              <div class="space-y-3">
                <p class="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 pb-2">Specifications</p>
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p class="text-[9px] font-bold text-slate-400">วัสดุ</p>
                    <p class="text-sm font-black text-slate-800">{{ formatSpec('material', selectedOrder?.specs?.material) }}</p>
                  </div>
                  <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p class="text-[9px] font-bold text-slate-400">การเคลือบผิว</p>
                    <p class="text-sm font-black text-slate-800">{{ formatSpec('finish', selectedOrder?.specs?.finish) }}</p>
                  </div>
                  <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p class="text-[9px] font-bold text-slate-400">รูปแบบการตัด</p>
                    <p class="text-sm font-black text-slate-800">{{ formatSpec('cutting', selectedOrder?.specs?.cutting) }}</p>
                  </div>
                  <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p class="text-[9px] font-bold text-slate-400">ขนาด (ก x ส)</p>
                    <p class="text-sm font-black text-slate-800">{{ selectedOrder?.specs?.width }} x {{ selectedOrder?.specs?.height }} ซม.</p>
                  </div>
                </div>
                <div class="mt-4 p-4 bg-slate-900 rounded-2xl text-white flex justify-between items-center">
                  <span class="text-xs font-bold opacity-60">จำนวนที่สั่ง</span>
                  <span class="text-2xl font-black">{{ selectedOrder?.specs?.quantity?.toLocaleString() }} <span class="text-[10px] opacity-60 font-medium">ชิ้น</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-slate-50/80 p-6 flex justify-end gap-3 backdrop-blur-md">
          <button @click="showDetailModal = false" class="px-6 py-3 font-bold text-slate-400 hover:text-slate-600 transition-colors">Close</button>
          <button 
            v-if="selectedOrder?.status !== 'completed'" 
            @click="quickUpdateStatus" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            ปรับเป็น {{ selectedOrder?.status === 'pending' ? 'กำลังผลิต' : 'เสร็จสิ้น' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showModal" @click="showModal=false" class="fixed inset-0 z-[1200] flex items-center justify-center bg-black/95 transition-all p-4">
      <img :src="modalImageUrl" class="max-h-screen max-w-full rounded-xl shadow-2xl animate-in fade-in zoom-in duration-300" @click.stop>
      <button @click="showModal=false" class="absolute top-8 right-8 text-white/50 hover:text-white text-3xl">✕</button>
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

// รายละเอียด Modal
const showDetailModal = ref(false)
const selectedOrder = ref(null)

const fetchAllOrders = async () => {
  isProcessing.value = true
  try {
    const res = await axios.get(`${API_URL}/api/orders/admin/all`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    const rawData = res.data.data || res.data
    // ตรวจสอบและ Parse ข้อมูล specs ให้เป็น Object
    allOrders.value = rawData.map(order => ({
      ...order,
      specs: typeof order.specs === 'string' ? JSON.parse(order.specs) : order.specs
    }))
  } catch (error) {
    if (error.response?.status === 401) {
      authStore.logout()
      router.push('/login')
    }
  } finally {
    isProcessing.value = false
  }
}

const updateStatus = async (orderId, status) => {
  try {
    await axios.patch(`${API_URL}/api/orders/${orderId}/status`, { status }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    await fetchAllOrders()
  } catch (err) {
    alert('อัปเดตสถานะล้มเหลว')
  }
}

const quickUpdateStatus = () => {
  if (!selectedOrder.value) return
  const nextStatus = selectedOrder.value.status === 'pending' ? 'producing' : 'completed'
  updateStatus(selectedOrder.value._id, nextStatus)
  showDetailModal.value = false
}

const deleteOrder = async (orderId) => {
  if (!confirm("ต้องการลบใบสั่งผลิตนี้หรือไม่?")) return
  try {
    await axios.delete(`${API_URL}/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    fetchAllOrders()
  } catch (err) { alert('ลบไม่สำเร็จ') }
}

const viewDetails = (order) => {
  selectedOrder.value = order
  showDetailModal.value = true
}

const formatSpec = (type, value) => {
  if (!value) return '-'
  const dict = {
    material: { pvc_white: 'PVC ขาวนม', pvc_clear: 'PVC ใส', pp: 'PP กันน้ำ', paper: 'กระดาษ', kraft: 'กระดาษคราฟท์', metallic: 'ฟอยล์ เงิน/ทอง' },
    finish: { none: 'ไม่เคลือบ', glossy: 'เงา', matte: 'ด้าน' },
    cutting: { die_cut: 'ตามทรง', square_cut: 'เหลี่ยม', kiss_cut: 'ครึ่งดวง' }
  }
  return dict[type]?.[value] || value
}

const getFullImageUrl = (path) => {
  if (!path) return ''
  return path.startsWith('http') ? path : `${API_URL}${path}`
}

const openImage = (url) => {
  modalImageUrl.value = getFullImageUrl(url)
  showModal.value = true
}

const imgError = (e) => { e.target.src = 'https://placehold.co/400x400?text=Image+Not+Found' }

const filteredOrders = computed(() => {
  if (currentFilter.value === 'all') return allOrders.value
  return allOrders.value.filter(o => o.status === currentFilter.value)
})

const getCount = (status) => allOrders.value.filter(o => o.status === status).length

const formatStatus = (s) => {
  const map = { pending: 'รอดำเนินการ', producing: 'กำลังผลิต', completed: 'เสร็จสิ้น' }
  return map[s] || s
}

const statusBadge = (s) => {
  const map = { pending: 'bg-amber-100 text-amber-600', producing: 'bg-blue-100 text-blue-600', completed: 'bg-emerald-100 text-emerald-600' }
  return map[s] || 'bg-slate-100 text-slate-500'
}

onMounted(fetchAllOrders)
</script>

<style scoped>
.animate-in {
  animation-duration: 0.2s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>