import axios from 'axios'
import { ElMessage } from 'element-plus'
import { STORAGE_KEYS, storage } from '@/config/storage'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    // 默认使用 JSON，但会在拦截器中对 FormData 进行覆盖
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 从本地存储获取token
    const token = storage.get(STORAGE_KEYS.TOKEN)
    if (token) {
      config.headers['Authorization'] = token
    }

    // 如果是 FormData，确保使用 multipart/form-data 以便后端正确解析
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      // 删除默认的 JSON 头，由浏览器自动设置带 boundary 的 multipart 头
      delete config.headers['Content-Type']
    }
    
    // 记录请求日志
    console.info('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
      params: config.params
    })
    
    return config
  },
  error => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 增加一个 body 对象，直接对应后端返回的 JSON 数据
    response.body = response.data.data
    // 增加 response.ok 属性，直接对应后端返回的状态码
    response.ok = response.status >= 200 && response.status < 400
    // 记录成功响应日志
    console.info('API Response Success:', {
      method: response.config?.method?.toUpperCase(),
      url: response.config?.url,
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      body: response.body
    })
    return response
  },
  error => {
    // 记录错误响应日志
    console.error('API Response Error:', {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data
    })
    
    // 处理401错误（未授权）
    if (error.response && error.response.status === 401) {
      // 清除本地存储的用户信息
      storage.remove(STORAGE_KEYS.TOKEN)
      storage.remove(STORAGE_KEYS.USER)

      // 重定向到登录页
      if (window.location.pathname !== '/login') {
        window.location.href = `/login?redirect=${window.location.pathname}`
      }
    }
    // 显示后端返回的信息
    const serverMessage = error.response?.data?.message || error.message || '请求失败'
    try {
      ElMessage.error(serverMessage)
    } catch (_) {}
    
    return Promise.reject(error)
  }
)

export default api
