const jwt = require('jsonwebtoken');

// ส่วนที่ 1: ตรวจสอบ Token ทั่วไป
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // ใช้ค่าจาก .env หรือค่า Default สำรองกรณีโหลด .env ไม่เข้า
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_fallback');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// ส่วนที่ 2: ตรวจสอบสิทธิ์ (Role-based)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: User role '${req.user?.role}' is not authorized` 
      });
    }
    next();
  };
};

// ✅ แก้ไขตรงนี้: ส่งออกเป็น Object
module.exports = { auth, authorize };