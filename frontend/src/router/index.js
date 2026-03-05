import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/authStore' // นำเข้า Store มาเช็ค Role

// Import Views
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import CreateOrderView from '../views/CreateOrderView.vue'
import OrderDetailView from '../views/OrderDetailView.vue'
import AdminOrderView from '../views/AdminOrderView.vue'
import ProductionBoardView from '../views/ProductionBoardView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { 
    path: '/login', 
    name: 'Login', 
    component: LoginView,
    meta: { hideNavbar: true } 
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: RegisterView,
    meta: { hideNavbar: true }
  },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: DashboardView 
  },
  { 
    path: '/create-order', 
    name: 'CreateOrder', 
    component: CreateOrderView 
  },
  { 
    path: '/order/:id', 
    name: 'OrderDetail', 
    component: OrderDetailView,
    props: true 
  },
  { 
    path: '/admin/orders', 
    name: 'AdminOrders', 
    component: AdminOrderView,
    meta: { requiresAdmin: true } // มาร์คไว้ว่าเป็นหน้าเฉพาะแอดมิน
  },
  { 
    path: '/production', 
    name: 'ProductionBoard', 
    component: ProductionBoardView,
    meta: { requiresAdmin: true } // หน้ากระดานผลิตก็เฉพาะแอดมิน
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: (to) => {
       // ถ้า URL มั่ว ให้เช็ค Role แล้วดีดไปหน้าเริ่มต้นที่ถูกต้อง
       const authStore = useAuthStore();
       return authStore.user?.role === 'admin' ? '/admin/orders' : '/dashboard';
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ ปรับปรุง Navigation Guard ให้แยก Role ชัดเจน
router.beforeEach((to, from) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  const isAdmin = authStore.user?.role === 'admin'; // ดึงค่าจาก Store มาเช็ค

  // 1. ถ้ายังไม่ได้ Login และพยายามเข้าหน้าอื่นที่ไม่ใช่ Login/Register
  if (!isAuthenticated && to.name !== 'Login' && to.name !== 'Register') {
    return { name: 'Login' };
  }

  // 2. ถ้า Login แล้ว และพยายามจะกลับไปหน้า Login หรือ Register
  if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    // 🚀 จุดสำคัญ: แยกทางเดิน!
    if (isAdmin) {
      return { name: 'AdminOrders' }; // แอดมินไปหน้าจัดการ
    } else {
      return { name: 'Dashboard' };   // ผู้ใช้ธรรมดาไปหน้าส่งของ
    }
  }

  // 3. ป้องกัน User ทั่วไปแอบพิมพ์ URL เข้าหน้า Admin
  if (to.meta.requiresAdmin && !isAdmin) {
    alert('สิทธิ์ของคุณไม่สามารถเข้าถึงหน้านี้ได้');
    return { name: 'Dashboard' };
  }

  return true;
})

export default router;