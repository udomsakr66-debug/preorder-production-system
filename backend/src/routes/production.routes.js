const express = require('express');
const router = express.Router();
const productionController = require('../controllers/production.controller');
const { auth, authorize } = require('../middleware/auth.middleware');

// อัปเดตสถานะการผลิต (เฉพาะ Admin/Staff)
router.put('/:id/status', auth, authorize('admin', 'staff'), productionController.updateStatus);

module.exports = router;