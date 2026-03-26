import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    globalLoading: false,
    loadingMessage: '',
    authModalVisible: false,
    authModalTab: 'login' // 'login' or 'register'
  }),
  actions: {
    showLoading(message = '正在加载…') {
      this.globalLoading = true
      this.loadingMessage = message
    },
    hideLoading() {
      this.globalLoading = false
      this.loadingMessage = ''
    },
    openAuthModal(tab = 'login') {
      this.authModalTab = tab
      this.authModalVisible = true
    },
    closeAuthModal() {
      this.authModalVisible = false
    },
    setAuthModalTab(tab) {
      this.authModalTab = tab
    }
  }
})