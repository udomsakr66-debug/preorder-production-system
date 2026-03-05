const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ตั้งค่าตำแหน่งที่เก็บไฟล์ให้แม่นยำ
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // ใช้ path.join เพื่อระบุตำแหน่งโฟลเดอร์ uploads ที่อยู่ใน src
        const uploadDir = path.join(__dirname, '..', 'uploads');

        // ตรวจสอบว่ามีโฟลเดers หรือไม่ ถ้าไม่มีให้สร้างทันที (กัน Error ENOENT)
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // ตั้งชื่อไฟล์ป้องกันชื่อซ้ำ: timestamp-สุ่มตัวเลข-ชื่อเดิม
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// กรองประเภทไฟล์ (รับเฉพาะรูปและ PDF)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('อนุญาตเฉพาะไฟล์รูปภาพ (JPG, PNG) และ PDF เท่านั้น!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // จำกัด 5MB
});

module.exports = upload;