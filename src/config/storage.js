// 存储配置
const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX || 'dlove'

// localStorage keys
export const STORAGE_KEYS = {
  TOKEN: `${STORAGE_PREFIX}-token`,
  USER: `${STORAGE_PREFIX}-user`,
  THEME: `${STORAGE_PREFIX}-theme`,
  LANGUAGE: `${STORAGE_PREFIX}-language`,
  CART: `${STORAGE_PREFIX}-cart`,
  PREFERENCES: `${STORAGE_PREFIX}-preferences`,
  REMEMBER_ME: `${STORAGE_PREFIX}-remember-me`,
  AUTH_REDIRECT_URL: `${STORAGE_PREFIX}-auth-redirect-url`
}

// 存储工具函数
export const storage = {
  // 获取数据
  get(key) {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.warn(`Failed to get storage item: ${key}`, error)
      return null
    }
  },

  // 设置数据
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.warn(`Failed to set storage item: ${key}`, error)
      return false
    }
  },

  // 删除数据
  remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn(`Failed to remove storage item: ${key}`, error)
      return false
    }
  },

  // 清空所有应用相关数据
  clear() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.warn('Failed to clear storage', error)
      return false
    }
  }
}

export default storage