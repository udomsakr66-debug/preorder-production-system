// backend/src/controllers/product.controller.js

exports.getAllProducts = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "ดึงข้อมูลสินค้าสำเร็จ",
            data: []
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};