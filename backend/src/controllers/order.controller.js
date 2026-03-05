const orderService = require('../services/order.service');
const Order = require('../models/order.model');

// 1. สร้างออเดอร์ใหม่
exports.createOrder = async (req, res) => {
    try {
        // ปรับการดึงข้อมูล Specs ให้ยืดหยุ่นขึ้น (รองรับทั้งแบบ JSON String และ Object)
        let specs = req.body.specs;
        if (typeof specs === 'string') {
            try {
                specs = JSON.parse(specs);
            } catch (e) {
                // ถ้า Parse ไม่ได้ ให้ใช้ค่าว่างหรือจัดการตามความเหมาะสม
                specs = {};
            }
        }

        // เตรียมข้อมูลจากหน้าฟอร์ม (อิงตามฟิลด์ที่คุณใช้ในหน้าบ้าน)
        const orderData = {
            productName: req.body.productName,
            specs: {
                material: req.body.material || specs?.material,
                width: req.body.width || specs?.width,
                height: req.body.height || specs?.height,
                quantity: req.body.quantity || specs?.quantity
            }
        };

        // เรียก Service เพื่อบันทึกลง Database และจัดการไฟล์แนบ
        const order = await orderService.createNewOrder(orderData, req.file, req.user.id);
        
        res.status(201).json({
            success: true,
            message: 'สร้างคำสั่งผลิตเรียบร้อยแล้ว',
            data: order
        });
    } catch (err) {
        console.error('Create Order Error:', err);
        res.status(500).json({ 
            success: false,
            message: 'เกิดข้อผิดพลาดในการสร้างออเดอร์', 
            error: err.message 
        });
    }
};

// 2. ดึงออเดอร์ทั้งหมด (สำหรับ Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'username email')
            .sort({ createdAt: -1 });
            
        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching orders', error: err.message });
    }
};

// 3. ดึงออเดอร์เฉพาะของ User นั้นๆ
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 });
            
        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching your orders', error: err.message });
    }
};