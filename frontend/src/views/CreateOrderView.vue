<template>
  <div class="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">📝 สร้างใบสั่งผลิตใหม่</h2>
    
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <div class="mb-4">
        <label class="block font-semibold mb-1">ชื่อโครงการ / ชื่อสินค้า</label>
        <input v-model="form.productName" type="text" class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" placeholder="เช่น สติกเกอร์โลโก้ร้านอาหาร" required />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block font-semibold mb-1">วัสดุ</label>
          <select v-model="form.specs.material" class="w-full border p-3 rounded-lg">
            <option v-for="opt in options.materials" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="block font-semibold mb-1">ความกว้าง (ซม.)</label>
          <input v-model.number="form.specs.width" type="number" step="0.1" class="w-full border p-3 rounded-lg" required />
        </div>
        <div>
          <label class="block font-semibold mb-1">ความสูง (ซม.)</label>
          <input v-model.number="form.specs.height" type="number" step="0.1" class="w-full border p-3 rounded-lg" required />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block font-semibold mb-1">การเคลือบผิว (Finishing)</label>
          <select v-model="form.specs.finish" class="w-full border p-3 rounded-lg">
            <option v-for="opt in options.finishes" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="block font-semibold mb-1">รูปแบบการตัด (Cutting)</label>
          <select v-model="form.specs.cutting" class="w-full border p-3 rounded-lg">
            <option v-for="opt in options.cuttings" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="mb-4">
        <label class="block font-semibold mb-1">จำนวนที่สั่ง (ชิ้น)</label>
        <input v-model.number="form.specs.quantity" type="number" class="w-full border p-3 rounded-lg" min="1" required />
      </div>

      <div class="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
        <label class="block font-semibold mb-2">อัปโหลดไฟล์งาน (PDF, JPG, PNG)</label>
        <input type="file" @change="handleFileUpload" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" accept="image/*,.pdf" />
        <p v-if="fileName" class="mt-2 text-green-600 font-medium">ไฟล์ที่เลือก: {{ fileName }}</p>
      </div>

      <div class="flex gap-4">
        <button type="button" @click="$router.push('/dashboard')" class="flex-1 bg-gray-200 py-3 rounded-lg font-bold hover:bg-gray-300">ยกเลิก</button>
        <button type="submit" :disabled="isSubmitting" class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300">
          {{ isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งใบสั่งผลิต' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedFile = ref(null);
const fileName = ref('');
const isSubmitting = ref(false);

// รวมรายการ Options ไว้ที่เดียวเพื่อให้จัดการง่าย
const options = {
  materials: [
    { label: 'PVC ขาวนม (กันน้ำ)', value: 'pvc_white' },
    { label: 'PVC ใส (กันน้ำ)', value: 'pvc_clear' },
    { label: 'PP (กันน้ำ/ฉีกไม่ขาด)', value: 'pp' },
    { label: 'กระดาษขาวเงา/ด้าน', value: 'paper' },
    { label: 'กระดาษคราฟท์ (น้ำตาล)', value: 'kraft' },
    { label: 'ฟอยล์ เงิน/ทอง', value: 'metallic' }
  ],
  finishes: [
    { label: 'ไม่เคลือบ', value: 'none' },
    { label: 'เคลือบเงา (Glossy)', value: 'glossy' },
    { label: 'เคลือบด้าน (Matte)', value: 'matte' }
  ],
  cuttings: [
    { label: 'ไดคัทตามทรง (Die-cut)', value: 'die_cut' },
    { label: 'ตัดแยกชิ้นสี่เหลี่ยม', value: 'square_cut' },
    { label: 'ตัดแบบครึ่งดวง (Kiss-cut)', value: 'kiss_cut' }
  ]
};

const form = reactive({
  productName: '',
  specs: {
    material: 'pvc_white',
    width: 0,
    height: 0,
    quantity: 1,
    finish: 'none',
    cutting: 'die_cut'
  }
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    fileName.value = file.name;
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append('productName', form.productName);
    formData.append('specs', JSON.stringify(form.specs));
    if (selectedFile.value) {
      formData.append('file', selectedFile.value);
    }

    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/orders', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });

    alert('สร้างใบสั่งผลิตสำเร็จ!');
    router.push('/dashboard');
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึก');
  } finally {
    isSubmitting.value = false;
  }
};
</script>