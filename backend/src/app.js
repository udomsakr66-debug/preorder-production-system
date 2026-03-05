const express = require('express');
const cors = require('cors');
const path = require('path'); // เพิ่มบรรทัดนี้
const app = express();

app.use(cors());
app.use(express.json());

// แก้ไขบรรทัดนี้: เปลี่ยนจาก 'src/uploads' เป็น '../uploads'
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); 

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/orders', require('./routes/order.routes'));

module.exports = app;