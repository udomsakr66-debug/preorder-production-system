const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('src/uploads')); // ให้เข้าถึงไฟล์ที่อัปโหลดได้ผ่าน URL

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/orders', require('./routes/order.routes'));

module.exports = app;