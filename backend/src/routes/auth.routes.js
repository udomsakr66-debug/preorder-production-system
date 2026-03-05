const express = require('express');
const router = express.Router();
// ดึงมาจากโฟลเดอร์ controllers ที่อยู่ในระดับเดียวกัน (ถอยออก 1 ชั้นแล้วเข้า controllers)
const authController = require('../controllers/auth.controller');

// เส้นทางสำหรับ Register (POST /api/auth/register)
router.post('/register', authController.register);

// เส้นทางสำหรับ Login (POST /api/auth/login)
router.post('/login', authController.login);

module.exports = router;