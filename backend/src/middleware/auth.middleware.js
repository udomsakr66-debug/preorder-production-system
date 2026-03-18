const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET || 'MY_FIXED_SECRET_9999';

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // ใช้กุญแจดอกเดียวกันไขรหัส
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("❌ JWT Error:", err.message);
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Admin access only' });
        }
        next();
    };
};

module.exports = { auth, authorize };