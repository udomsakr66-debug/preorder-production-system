import { defineStore } from 'pinia';
import axios from 'axios';

// ตั้งค่า Base URL เพื่อลดการพิมพ์ซ้ำ
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false, // เพิ่มสถานะการโหลด
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    // ฟังก์ชันช่วยตั้งค่า Header สำหรับ Axios
    setAuthHeader(token) {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete api.defaults.headers.common['Authorization'];
      }
    },

    async login(credentials) {
      this.loading = true;
      try {
        const response = await api.post('/auth/login', credentials);
        const { token, user } = response.data;

        this.token = token;
        this.user = user;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        this.setAuthHeader(token);
        return true;
      } catch (error) {
        this.logout(); // เคลียร์สถานะถ้า Login พลาด
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 🆕 เพิ่มฟังก์ชัน Register
    async register(userData) {
      this.loading = true;
      try {
        await api.post('/auth/register', userData);
        return true;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.setAuthHeader(null);
    },

    // 🆕 เช็คสถานะการล็อกอินอัตโนมัติเมื่อโหลด App
    initializeAuth() {
      if (this.token) {
        this.setAuthHeader(this.token);
      }
    }
  }
});