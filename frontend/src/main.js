import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // ตรวจสอบว่าไฟล์ src/router/index.js มีอยู่จริง

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)   // ต้อง Register Pinia ก่อน Router และ App
app.use(router)  // Register Router
app.mount('#app')