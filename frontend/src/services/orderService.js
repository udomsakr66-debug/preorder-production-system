import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders';

export default {
  // ฟังก์ชันสร้าง Order ใหม่
  async createOrder(formData) {
    const token = localStorage.getItem('token');
    return await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
  },

  // ฟังก์ชันดึงรายการออเดอร์ของตัวเอง
  async getMyOrders() {
    const token = localStorage.getItem('token');
    return await axios.get(`${API_URL}/my-orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
};