const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// บรรทัดที่ 6 ที่เกิด Error: productController.getAllProducts ต้องเป็นฟังก์ชัน
router.get('/', productController.getAllProducts);

module.exports = router;