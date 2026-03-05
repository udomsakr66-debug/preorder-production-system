const Order = require('../models/order.model');
const calculatePrice = require('../utils/calculatePrice');
const generateOrderNumber = require('../utils/generateOrderNumber'); // เรียกใช้ตัวนี้!

exports.createNewOrder = async (orderData, file, userId) => {
    // 1. คำนวณราคาจากสเปคที่ลูกค้าส่งมา
    const price = calculatePrice(orderData.specs);
    
    // 2. เจนเลขที่สั่งซื้อผ่าน Utility (ส่ง Model เข้าไปเพื่อเช็คเลขล่าสุดใน DB)
    const orderNumber = await generateOrderNumber(); 

    // 3. สร้างก้อนข้อมูลเพื่อบันทึก
    const newOrder = new Order({
        orderNumber: orderNumber,
        customer: userId,
        productName: orderData.productName,
        specs: orderData.specs,
        fileUrl: file ? `/uploads/${file.filename}` : null,
        totalPrice: price,
        status: 'pending' // กำหนดสถานะเริ่มต้น
    });

    return await newOrder.save();
};