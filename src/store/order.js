import { defineStore } from 'pinia'
import { 
  createOrder, 
  updateOrder,
  updateShareSlug,
  getOrders, 
  getOrderById,
  getOrderByShareSlug, 
  getUserPurchases, 
  cancelOrder, 
  refundOrder, 
  deleteOrder,
  createPayment, 
  getPaymentById, 
  verifyPayment 
} from '@/api/order'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    currentOrder: null,
    userPurchases: [],
    currentPayment: null,
    loading: false
  }),
  
  getters: {
    isPending: (state) => {
      return state.currentOrder && state.currentOrder.status === 0
    },
    isPaid: (state) => {
      return state.currentOrder && state.currentOrder.status === 1
    },
    isCancelled: (state) => {
      return state.currentOrder && state.currentOrder.status === 2
    },
    isRefunded: (state) => {
      return state.currentOrder && state.currentOrder.status === 3
    }
  },
  
  actions: {
    async createOrder(orderData) {
      this.loading = true
      
      try {
        const response = await createOrder(orderData)
        const data = response?.body ?? response?.data?.data
        if (!data || !data.id) {
          const msg = response?.data?.message || '创建订单失败'
          throw new Error(msg)
        }
        this.currentOrder = data
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    async updateOrder(orderId, orderData) {
      this.loading = true
      
      try {
        const response = await updateOrder(orderId, orderData)
        const data = response?.body ?? response?.data?.data
        if (!data || !data.id) {
          const msg = response?.data?.message || '更新订单失败'
          throw new Error(msg)
        }
        this.currentOrder = data
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    async updateShareSlug(orderId, slug) {
      this.loading = true
      try {
        const response = await updateShareSlug(orderId, slug)
        const data = response?.body ?? response?.data?.data
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    async getOrderByShareSlug(slug) {
      try {
        const response = await getOrderByShareSlug(slug)
        const data = response?.body ?? response?.data?.data
        return data
      } catch (error) {
        throw error
      }
    },

    async fetchOrders(params) {
      this.loading = true
      
      try {
        const response = await getOrders(params)
        const data = response?.data?.data || response?.data
        this.orders = data?.items || []
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchOrderById(id) {
      this.loading = true
      
      try {
        const response = await getOrderById(id)
        const data = response?.data?.data || response?.data
        const order = data?.order || data
        const template = data?.template
        
        // Merge template info into order for component usage
        if (template) {
           // Adapt to what Checkout.vue expects (order.items[0].template)
           // Or update Checkout.vue. Let's adapt here for now.
           order.items = [{ template: { 
               ...template, 
               cover: template.cover_url || template.cover_key 
           }}]
           order.template = template
        }

        this.currentOrder = order
        return Promise.resolve(order)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchUserPurchases(params) {
      this.loading = true
      
      try {
        const response = await getUserPurchases(params)
        const data = response?.body || response?.data?.data
        this.userPurchases = data?.items || []
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    async cancelOrder(orderId, cancelData) {
      this.loading = true
      
      try {
        const response = await cancelOrder(orderId, cancelData)
        
        // 如果当前订单是被取消的订单，更新当前订单状态
        if (this.currentOrder && this.currentOrder.id === orderId) {
          this.currentOrder = response.data
        }
        
        // 更新订单列表中的订单状态
        const index = this.orders.findIndex(order => order.id === orderId)
        if (index !== -1) {
          this.orders[index] = response.data
        }
        
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    async refundOrder(orderId, refundData) {
      this.loading = true
      
      try {
        const response = await refundOrder(orderId, refundData)
        
        // 如果当前订单是被退款的订单，更新当前订单状态
        if (this.currentOrder && this.currentOrder.id === orderId) {
          this.currentOrder = response.data
        }
        
        // 更新订单列表中的订单状态
        const index = this.orders.findIndex(order => order.id === orderId)
        if (index !== -1) {
          this.orders[index] = response.data
        }
        
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    async deleteOrder(orderId) {
      this.loading = true
      try {
        const response = await deleteOrder(orderId)
        // 移除本地列表中的订单
        this.userPurchases = this.userPurchases.filter(item => item.id !== orderId)
        if (this.currentOrder && this.currentOrder.id === orderId) {
           this.currentOrder = null
        }
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    async createPayment(paymentData) {
      this.loading = true
      
      try {
        const response = await createPayment({
          order_id: paymentData.order_id,
          payment_method: paymentData.payment_method
        })
        const data = response?.body ?? response?.data?.data
        this.currentPayment = data?.payment
        // 这里返回 data，因为 Checkout.vue 里会用 paymentResult?.payment?.status
        // 或者 paymentResult?.success
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchPaymentById(paymentId) {
      this.loading = true
      
      try {
        const response = await getPaymentById(paymentId)
        this.currentPayment = response.data
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    async verifyPayment(verifyData) {
      this.loading = true
      
      try {
        const response = await verifyPayment(verifyData)
        
        // 如果验证成功，更新当前订单状态
        if (this.currentOrder && response.data && response.data.order_id === this.currentOrder.id) {
          await this.fetchOrderById(this.currentOrder.id)
        }
        
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    async getPaymentStatus(orderId) {
      try {
        const order = await this.fetchOrderById(orderId)
        if (order.status === 1) {
          return 'paid'
        }
        return 'pending'
      } catch (error) {
        return 'unknown'
      }
    },
    
    clearCurrentOrder() {
      this.currentOrder = null
    },
    
    clearCurrentPayment() {
      this.currentPayment = null
    }
  }
})
