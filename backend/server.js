require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// 1. นำเข้า Routes
const authRoutes = require('./src/routes/auth.routes');
const orderRoutes = require('./src/routes/order.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const productRoutes = require('./src/routes/product.routes');
const productionRoutes = require('./src/routes/production.routes');

const app = express();

// --- 🛠 Middleware พื้นฐาน ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 📂 การจัดการไฟล์อัปโหลด (จุดสำคัญที่ทำให้เปิดรูปไม่ได้) ---
// กำหนดทางเลือกของ Path เพื่อป้องกันการหาโฟลเดอร์ไม่เจอ
const uploadPaths = [
    path.join(__dirname, 'src/uploads'), // กรณีเก็บใน src
    path.join(__dirname, 'uploads')      // กรณีเก็บนอก src
];

let finalUploadDir = uploadPaths[0];

// ตรวจสอบว่าโฟลเดอร์ไหนมีอยู่จริง ถ้าไม่มีเลยให้สร้างที่ src/uploads
for (const p of uploadPaths) {
    if (fs.existsSync(p)) {
        finalUploadDir = p;
        break;
    }
}

if (!fs.existsSync(finalUploadDir)) {
    fs.mkdirSync(finalUploadDir, { recursive: true });
}

// ✅ แก้ไข: ทำให้เปิดดูรูปผ่าน http://localhost:5000/uploads/... ได้จริง
app.use('/uploads', express.static(finalUploadDir));
console.log(`📁 Static files served from: ${finalUploadDir}`);

// --- 🔗 เชื่อมต่อ MongoDB ---
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/preorder_db';
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB ✅'))
    .catch(err => console.error('MongoDB connection error ❌:', err));

// --- 🚀 ใช้งาน Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/production', productionRoutes);

// Route ทดสอบสถานะ
app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend is running 🚀', 
        uploadStatus: fs.existsSync(finalUploadDir) ? 'Ready' : 'Dir Missing'
    });
});

// --- ⚠️ Error Handling (ดักจับ Error 500 ให้ละเอียดขึ้น) ---
app.use((err, req, res, next) => {
    // พิมพ์ Error ออกทางหน้าจอ Terminal เพื่อให้เราแก้ได้ถูกจุด
    console.error('❌ Server Error Detailed:', err.message);
    console.error(err.stack); 
    
    res.status(500).json({ 
        success: false, 
        message: 'Internal Server Error: ' + err.message 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
    -------------------------------------------
    🚀 Server running on port ${PORT}
    📡 API Base: http://localhost:${PORT}/api
    🖼️ Check Uploads: http://localhost:${PORT}/uploads
    -------------------------------------------
    `);
});