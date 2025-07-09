import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Library Components
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
const toastOptions = { timeout: 3000 };

const app = createApp(App)
app.use(router)

app.use(Toast, toastOptions)

app.mount('#app')
