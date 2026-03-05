const Order = require('../models/order.model');
const calculatePrice = require('../utils/calculatePrice');
const generateOrderNumber = require('../utils/generateOrderNumber');

exports.createNewOrder = async (orderData, file, userId) => {
    // 1. คำนวณราคา
    const price = calculatePrice(orderData.specs);
    
    // 2. เจนเลขที่สั่งซื้อ
    const orderNumber = await generateOrderNumber(); 

    // 3. บันทึกข้อมูล (เปลี่ยนจาก customer: userId เป็น user: userId)
    const newOrder = new Order({
        orderNumber: orderNumber,
        user: userId, // ✅ ต้องเป็นชื่อ 'user' เท่านั้น เพื่อแก้ Error ในรูป image_4c0549.png
        productName: orderData.productName,
        specs: orderData.specs,
        fileUrl: file ? `/uploads/${file.filename}` : null,
        totalPrice: price,
        status: 'pending'
    });

    return await newOrder.save();
};