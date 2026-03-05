require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path'); // เพิ่ม path เพื่อจัดการตำแหน่งโฟลเดอร์

// ✅ Path ถูกต้องตามโครงสร้าง src/
const authRoutes = require('./src/routes/auth.routes');
const orderRoutes = require('./src/routes/order.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const productRoutes = require('./src/routes/product.routes');
const productionRoutes = require('./src/routes/production.routes');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ เพิ่มบรรทัดนี้: เพื่อให้เข้าถึงไฟล์ในโฟลเดอร์ uploads ผ่าน URL ได้
// เช่น http://localhost:5000/uploads/image_123.jpg
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// เชื่อมต่อ MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/preorder_db';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB ✅'))
  .catch(err => console.error('MongoDB connection error ❌:', err));

// ใช้งาน Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/production', productionRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});