import { defineStore } from 'pinia'
import { 
  getWallet, 
  createWallet, 
  getTransactions, 
  // getTransactionById, // TODO: 待后端实现
  rechargeWallet, 
  walletPayment, 
  getWalletBalance
  // TODO: 以下密码相关功能待后端实现
  // verifyPaymentPassword,
  // setPaymentPassword,
  // changePaymentPassword
} from '@/api/wallet'
import { formatDCoin } from '@/config/currency'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    wallet: null,
    balance: 0,
    transactions: [],
    currentTransaction: null,
    loading: false,
    recharging: false,
    paying: false,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    }
  }),
  
  getters: {
    hasWallet: (state) => !!state.wallet,
    formattedBalance: (state) => {
      return `${state.balance || 0}`
    },
    canPay: (state) => (amount) => {
      return state.balance >= amount
    },
    recentTransactions: (state) => {
      return state.transactions.slice(0, 10)
    },
    paymentTransactions: (state) => {
      return state.transactions.filter(t => t.type === 'payment')
    },
    rechargeTransactions: (state) => {
      return state.transactions.filter(t => t.type === 'recharge')
    },
    refundTransactions: (state) => {
      return state.transactions.filter(t => t.type === 'refund')
    }
  },
  
  actions: {
    async fetchWallet() {
      this.loading = true
      
      try {
        const response = await getWallet()
        this.wallet = response.data?.data || response.data
        this.balance = this.wallet?.balance?.amount || 0
        return Promise.resolve(response)
      } catch (error) {
        // 如果钱包不存在，尝试创建
        if (error.response?.status === 404) {
          return await this.createWallet()
        }
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    async createWallet() {
      this.loading = true
      
      try {
        const response = await createWallet()
        this.wallet = response.data?.data || response.data
        this.balance = this.wallet?.balance?.amount || 0
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchTransactions(params = {}) {
      this.loading = true
      
      try {
        const queryParams = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          ...params
        }
        
        const response = await getTransactions(queryParams)
        
        if (params.page === 1 || !params.page) {
          this.transactions = response.data.transactions || []
        } else {
          this.transactions.push(...(response.data.transactions || []))
        }
        
        this.pagination = {
          ...this.pagination,
          ...response.data.pagination
        }
        
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    // TODO: 交易详情功能待后端实现
    async fetchTransactionById(transactionId) {
      this.loading = true
      
      try {
        // 临时实现：从当前交易列表中查找
        console.warn('交易详情功能待后端实现，当前为临时实现')
        const transaction = this.transactions.find(t => t.id === transactionId)
        if (transaction) {
          this.currentTransaction = transaction
          return Promise.resolve({ data: transaction })
        } else {
          throw new Error('交易记录未找到')
        }
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    async recharge(rechargeData) {
      this.recharging = true
      
      try {
        const response = await rechargeWallet(rechargeData)
        
        // 充值成功后更新余额和交易记录
        await this.fetchWallet()
        await this.fetchTransactions({ page: 1 })
        
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.recharging = false
      }
    },
    
    async pay(paymentData) {
      this.paying = true
      
      try {
        const response = await walletPayment(paymentData)
        const ok = response?.data?.code === 0
        if (ok) {
          await this.fetchWallet()
          await this.fetchTransactions({ page: 1 })
          return Promise.resolve({ success: true, message: response?.data?.message || '支付成功', data: response?.data?.data })
        } else {
          return Promise.resolve({ success: false, message: response?.data?.message || '支付失败', data: response?.data?.data })
        }
      } catch (error) {
        return Promise.resolve({ success: false, message: error?.response?.data?.message || error?.message || '支付失败' })
      } finally {
        this.paying = false
      }
    },
    
    async refreshBalance() {
      try {
        const response = await getWalletBalance()
        this.balance = response.data?.data?.amount || response.data?.amount || 0
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // TODO: 以下密码相关功能待后端实现
    async verifyPassword(password) {
      try {
        // 临时实现：总是返回验证成功
        console.warn('密码验证功能待后端实现，当前为临时实现')
        return Promise.resolve({ success: true, message: '密码验证成功（临时）' })
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    async setPassword(passwordData) {
      try {
        // 临时实现：总是返回设置成功
        console.warn('设置密码功能待后端实现，当前为临时实现')
        return Promise.resolve({ success: true, message: '密码设置成功（临时）' })
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    async changePassword(passwordData) {
      try {
        // 临时实现：总是返回修改成功
        console.warn('修改密码功能待后端实现，当前为临时实现')
        return Promise.resolve({ success: true, message: '密码修改成功（临时）' })
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 工具方法
    loadMoreTransactions() {
      if (this.pagination.page < this.pagination.totalPages) {
        this.pagination.page += 1
        return this.fetchTransactions()
      }
      return Promise.resolve()
    },
    
    resetTransactions() {
      this.transactions = []
      this.pagination.page = 1
    },
    
    clearCurrentTransaction() {
      this.currentTransaction = null
    },
    
    // 格式化金额显示
    formatAmount(amount) {
      return `${amount || 0}`
    },
    
    // 格式化交易类型显示
    formatTransactionType(type) {
      const typeMap = {
        'payment': '支付',
        'recharge': '充值',
        'refund': '退款'
      }
      return typeMap[type] || type
    },
    
    // 格式化交易状态显示
    formatTransactionStatus(status) {
      const statusMap = {
        0: '处理中',
        1: '成功',
        2: '失败',
        3: '已取消'
      }
      return statusMap[status] || '未知'
    }
  }
})
