const Order = require('../models/order.model');

module.exports = async () => {
    const date = new Date();
    const yearMonth = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    // หา Order ล่าสุดของเดือนนี้
    const lastOrder = await Order.findOne({
        orderNumber: new RegExp(`ORD-${yearMonth}`)
    }).sort({ createdAt: -1 });

    let sequence = '001';
    if (lastOrder) {
        // ดึงเลข 3 ตัวท้ายมาบวกเพิ่ม
        const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2]);
        sequence = (lastSequence + 1).toString().padStart(3, '0');
    }

    return `ORD-${yearMonth}-${sequence}`; // ผลลัพธ์จะเป็น ORD-202405-001
};