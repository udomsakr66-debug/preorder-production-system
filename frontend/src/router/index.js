import { createRouter, createWebHistory } from 'vue-router'

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
    component: AdminOrderView 
  },
  { 
    path: '/production', 
    name: 'ProductionBoard', 
    component: ProductionBoardView 
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ ปรับปรุง Navigation Guard เป็นแบบ Modern Return
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token

  // 1. ถ้ายังไม่ได้ Login และพยายามเข้าหน้าอื่นที่ไม่ใช่ Login/Register
  if (!isAuthenticated && to.name !== 'Login' && to.name !== 'Register') {
    return { name: 'Login' }
  }

  // 2. ถ้า Login แล้ว แต่ยังพยายามจะกลับไปหน้า Login หรือ Register
  if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    return { name: 'Dashboard' }
  }

  // 3. กรณีอื่นๆ ให้ผ่านไปได้ตามปกติ (return true หรือไม่ return ก็ได้)
  return true
})

export default router