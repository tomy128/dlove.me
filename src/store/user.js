import { defineStore } from 'pinia'
import { login, logout as logoutApi, register, getUserInfo, updateUserInfo, updateCustomDomain } from '@/api/user'
import { STORAGE_KEYS, storage } from '@/config/storage'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: storage.get(STORAGE_KEYS.TOKEN) || '',
    user: storage.get(STORAGE_KEYS.USER),
    loading: false
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    userInfo: (state) => state.user,
    nickname: (state) => state.user?.nickname || '',
    userId: (state) => state.user?.id || null,
    isPremium: (state) => state.user?.is_premium || false,
    storageUsage: (state) => ({
      used: state.user?.storage_used || 0,
      limit: state.user?.storage_limit || 51200 // Default 50MB
    })
  },
  
  actions: {
    async login(credentials) {
      this.loading = true
      try {
        const response = await login(credentials)
        this.setUserData(response.body)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    async register(userData) {
      this.loading = true
      
      try {
        const response = await register(userData)
        this.setUserData(response.body)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchUserInfo() {
      this.loading = true
      
      try {
        const response = await getUserInfo()
        this.user = response.body
        storage.set(STORAGE_KEYS.USER, response.body)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    async updateProfile(userData) {
      this.loading = true
      
      try {
        const response = await updateUserInfo(userData)
        console.log('updateUserInfo response:', response)
        this.user = { ...this.user, ...response.body }
        storage.set(STORAGE_KEYS.USER, this.user)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    async updateCustomDomain(domain) {
      this.loading = true
      try {
        const response = await updateCustomDomain({ custom_domain: domain })
        this.user = { ...this.user, custom_domain: domain }
        storage.set(STORAGE_KEYS.USER, this.user)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    setUserData(data) {
      if (data.bearer_token) {
        this.token = data.bearer_token
        storage.set(STORAGE_KEYS.TOKEN, data.bearer_token)
      }
      
      this.user = {
        id: data.user_id || data.id, // 兼容不同的ID字段
        nickname: data.nickname,
        bio: data.bio,
        avatar: data.avatar,
        email: data.email,
        custom_domain: data.custom_domain,
        role: data.role || 'user',
        is_premium: data.is_premium || false,
        storage_limit: data.storage_limit || 51200,
        storage_used: data.storage_used || 0,
      }
      
      // 保存到本地存储
      storage.set(STORAGE_KEYS.USER, this.user)
    },
    
    async logout() {
      this.token = ''
      this.user = null
      // 调用退出登录接口
      await logoutApi()
      // 清除本地存储
      storage.remove(STORAGE_KEYS.TOKEN)
      storage.remove(STORAGE_KEYS.USER)

    }
  }
})