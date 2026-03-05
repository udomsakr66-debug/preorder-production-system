const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { auth, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// 1. สร้างออเดอร์ใหม่
router.post('/', auth, upload.single('file'), orderController.createOrder);

// 2. ดึงออเดอร์ของ User เอง
router.get('/my-orders', auth, orderController.getUserOrders);

// 3. ดึงออเดอร์ทั้งหมด (Admin เท่านั้น)
router.get('/admin/all', auth, authorize('admin'), orderController.getAllOrders);

// 4. อัปเดตสถานะออเดอร์ (Admin เท่านั้น)
router.patch('/:id/status', auth, authorize('admin'), orderController.updateOrderStatus);

// 5. ลบออเดอร์ (Admin เท่านั้น)
router.delete('/:id', auth, authorize('admin'), orderController.deleteOrder);

// ✅ ตรวจสอบบรรทัดนี้: ต้องไม่มีปีกกาครอบ router
module.exports = router;