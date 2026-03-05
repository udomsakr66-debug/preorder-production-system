const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { auth, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware'); // ต้องใช้ middleware ตัวนี้เพื่อรับไฟล์ภาพ/PDF

// 1. ✅ แก้ Error 404: เพิ่ม Route สำหรับ "สร้างออเดอร์ใหม่" (POST)
// ใช้ upload.single('file') เพื่อรับไฟล์จากหน้า CreateOrderView.vue
router.post('/', auth, upload.single('file'), orderController.createOrder);

// 2. ดึงออเดอร์เฉพาะของ User (สำหรับหน้า Dashboard)
// ตรวจสอบว่าใน controller ชื่อ getUserOrders ตรงกัน
router.get('/my-orders', auth, orderController.getUserOrders);

// 3. ดึงออเดอร์ทั้งหมด (สำหรับ Admin)
router.get('/admin/all', auth, authorize('admin'), orderController.getAllOrders); 

module.exports = router;