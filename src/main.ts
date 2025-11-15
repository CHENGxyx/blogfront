import './assets/main.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'


import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.use(ElementPlus as any)
app.mount('#app')
