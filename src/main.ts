import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import OpsApp from './ops/OpsApp.vue'

const isOps = window.location.hostname === 'ops.wangshun.work' || window.location.pathname.startsWith('/ops')

createApp(isOps ? OpsApp : App).mount('#app')
