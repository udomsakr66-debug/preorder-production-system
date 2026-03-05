const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true }, // เช่น ORD-2024-001
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productName: { type: String, required: true },
  specs: {
    material: String,
    width: Number,
    height: Number,
    quantity: { type: Number, default: 1 },
    note: String
  },
  fileUrl: { type: String }, // Path ของไฟล์ที่อัปโหลด
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'producing', 'completed', 'rejected'], 
    default: 'pending' 
  },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);