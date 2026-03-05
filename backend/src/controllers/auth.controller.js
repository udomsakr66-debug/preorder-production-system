const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. สมัครสมาชิก (Register)
exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // เช็คว่ามี User นี้หรือยัง
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // เข้ารหัส Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // บันทึกลง Database
        user = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'customer'
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// 2. เข้าสู่ระบบ (Login)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // หา User จาก Email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        // ตรวจสอบ Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        // สร้าง JWT Token
        // ตรวจสอบว่ามี JWT_SECRET ใน .env ไหม ถ้าไม่มีให้ใช้ค่าสำรอง (ป้องกันเซิร์ฟเวอร์ค้าง)
        const secret = process.env.JWT_SECRET || 'default_secret_key_123';
        
        const payload = { 
            id: user._id, 
            role: user.role,
            username: user.username 
        };
        
        const token = jwt.sign(payload, secret, { expiresIn: '1d' });

        res.json({
            token,
            user: { id: user._id, username: user.username, role: user.role }
        });
    } catch (err) {
        // เพิ่ม err.message เพื่อให้ง่ายต่อการ Debug
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};