import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Library Components
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
const toastOptions = { timeout: 3000 };

// Custom Components & Directives
import globalComponent from "./plugins/global-components";

const app = createApp(App)
app.use(router)

app.use(Toast, toastOptions)
// Custom Components & Directives
app.use(globalComponent);

app.mount('#app')
