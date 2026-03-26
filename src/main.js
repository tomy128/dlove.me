import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './app.vue'
import router from './router'

import './styles/index.css'
// 引入全局日志控制器
import './utils/logger.js'

// 性能监控
if (import.meta.env.DEV) {
  console.log('🚀 应用启动时间:', performance.now(), 'ms')
}

const app = createApp(App)

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')