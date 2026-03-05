const Order = require('../models/order.model');
const orderService = require('../services/order.service');

// 1. สร้างออเดอร์ใหม่
exports.createOrder = async (req, res) => {
    try {
        let specs = req.body.specs;
        if (typeof specs === 'string') {
            try { specs = JSON.parse(specs); } catch (e) { specs = {}; }
        }

        const orderData = {
            productName: req.body.productName,
            specs: {
                material: req.body.material || specs?.material,
                width: req.body.width || specs?.width,
                height: req.body.height || specs?.height,
                quantity: req.body.quantity || specs?.quantity
            }
        };

        const order = await orderService.createNewOrder(orderData, req.file, req.user.id);
        
        res.status(201).json({
            success: true,
            message: 'สร้างคำสั่งผลิตเรียบร้อยแล้ว',
            data: order
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. ดึงออเดอร์เฉพาะของ User นั้นๆ
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 3. ดึงออเดอร์ทั้งหมด (สำหรับ Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'username email')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 4. อัปเดตสถานะ (PATCH)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        ).populate('user', 'username email');

        if (!order) return res.status(404).json({ success: false, message: 'ไม่พบออเดอร์' });

        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 5. ลบออเดอร์ (DELETE)
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'ไม่พบออเดอร์' });
        
        res.json({ success: true, message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};