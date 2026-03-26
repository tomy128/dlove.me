import axios from 'axios'

// 专用于外部直传（如 OSS）的 axios 客户端，不注入业务鉴权头
const ossUploadClient = axios.create({
  // 直传使用绝对URL，不需要 baseURL
  baseURL: undefined,
})

// 清空默认 headers，避免 axios 为 put/post/patch 设置默认 Content-Type
ossUploadClient.defaults.headers.common = {}
ossUploadClient.defaults.headers.put = {}
ossUploadClient.defaults.headers.post = {}
ossUploadClient.defaults.headers.patch = {}

// 默认不做数据转换，且移除未显式设置的 Content-Type
ossUploadClient.defaults.transformRequest = [
  (data, headers) => {
    if (headers) {
      const hasCT = Object.keys(headers).some(k => k.toLowerCase() === 'content-type')
      if (!hasCT) {
        delete headers['Content-Type']
        delete headers['content-type']
      }
    }
    return data
  }
]

// 保险：拦截器中再次移除未显式设置的 Content-Type
ossUploadClient.interceptors.request.use(config => {
  const headers = config.headers || {}
  const hasCT = Object.keys(headers).some(k => k.toLowerCase() === 'content-type')
  if (!hasCT) {
    delete headers['Content-Type']
    delete headers['content-type']
  }
  config.headers = headers
  return config
})

export default ossUploadClient
