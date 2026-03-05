// ✅ ไฟล์ Controller ต้องมีแค่ฟังก์ชัน exports แบบนี้เท่านั้น
// ห้ามมี router.get หรือ router.put ในไฟล์นี้

exports.updateStatus = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "อัปเดตสถานะสำเร็จ"
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'เกิดข้อผิดพลาด', 
            error: err.message 
        });
    }
};