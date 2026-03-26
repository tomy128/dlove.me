<template>
  <div class="order-list-container">
    <div class="order-list-header">
      <h2>我的订单</h2>
      <el-input
        v-model="searchKeyword"
        placeholder="搜索订单号"
        prefix-icon="el-icon-search"
        clearable
        @clear="handleSearch"
        @keyup.enter="handleSearch"
        class="search-input"
      ></el-input>
    </div>
    
    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane label="全部" name="ALL"></el-tab-pane>
      <el-tab-pane label="待支付" name="PENDING"></el-tab-pane>
      <el-tab-pane label="已支付" name="PAID"></el-tab-pane>
      <el-tab-pane label="已取消" name="CANCELLED"></el-tab-pane>
      <el-tab-pane label="已退款" name="REFUNDED"></el-tab-pane>
    </el-tabs>
    
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="3" animated />
      <el-skeleton :rows="3" animated />
    </div>
    
    <div v-else-if="orders.length === 0" class="empty-container">
      <el-empty description="暂无订单数据"></el-empty>
    </div>
    
    <div v-else class="order-list">
      <div v-for="order in orders" :key="order.id" class="order-item">
        <div class="order-header">
          <span class="order-number">订单号: {{ order.order_no }}</span>
          <span :class="['order-status', `status-${getStatusClass(order.status)}`]">
            {{ getStatusText(order.status) }}
          </span>
        </div>
        
        <div class="order-content">
          <div class="template-info">
            <img :src="order.template?.cover_url" alt="模板封面" class="template-cover" />
            <div class="template-details">
              <h3>{{ order.template?.name }}</h3>
              <div class="template-categories">
                <span class="categories-label">分类：</span>
                <template v-if="(order.template?.categories || []).length">
                  <el-tag
                    v-for="c in order.template.categories"
                    :key="c.id || c.name"
                    size="small"
                    class="category-tag"
                  >
                    {{ c.name || c.title || c.id }}
                  </el-tag>
                </template>
                <span v-else class="no-category">未分类</span>
              </div>
            </div>
          </div>
          
          <div class="order-price">
            <span class="price-label">价格</span>
            <span class="price-value">{{ formatDCoin(order.amount) }}</span>
          </div>
        </div>
        
        <div class="order-footer">
          <span class="order-time">创建时间: {{ formatDate(order.created_at) }}</span>
          
          <div class="order-actions">
            <el-button 
              v-if="order.status === 0"
              type="primary" 
              size="small"
              @click="handlePay(order)"
            >
              立即支付
            </el-button>
            
            <el-button 
              v-if="order.status === 0"
              type="danger" 
              size="small"
              @click="handleCancel(order)"
            >
              取消订单
            </el-button>
            
            <el-button 
              v-if="order.status === 1"
              type="success" 
              size="small"
              @click="handleDownload(order)"
            >
              下载模板
            </el-button>
            
            <el-button 
              type="info" 
              size="small"
              @click="handleDetail(order)"
            >
              订单详情
            </el-button>
          </div>
        </div>
      </div>
      
      <el-pagination
        v-if="total > pageSize"
        @current-change="handlePageChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total"
        class="pagination"
      ></el-pagination>
    </div>
    
    <!-- 支付对话框 -->
    <el-dialog
      title="订单支付"
      v-model="payDialogVisible"
      width="400px"
      center
    >
      <div class="pay-dialog-content">
        <div class="pay-order-info">
          <p class="pay-order-number">订单号: {{ currentOrder?.order_no }}</p>
          <p class="pay-order-amount">支付金额: <span class="amount">{{ formatDCoin(currentOrder?.amount || 0) }}</span></p>
        </div>
        
        <div class="pay-method-selection">
          <p class="pay-method-title">选择支付方式</p>
          <div class="pay-methods">
            <div 
              :class="['pay-method-item', payMethod === 'wallet' ? 'active' : '']"
              @click="selectPayMethod('wallet')"
            >
              <i class="wallet-icon"></i>
              <span>DLove Coin</span>
              <div class="balance-info">余额: {{ walletBalance }}</div>
            </div>
            <div 
              :class="['pay-method-item', payMethod === 'WECHAT' ? 'active' : '']"
              @click="selectPayMethod('WECHAT')"
            >
              <i class="wechat-icon"></i>
              <span>微信支付</span>
            </div>
            <div 
              :class="['pay-method-item', payMethod === 'ALIPAY' ? 'active' : '']"
              @click="selectPayMethod('ALIPAY')"
            >
              <i class="alipay-icon"></i>
              <span>支付宝</span>
            </div>
          </div>
          
          <!-- 钱包余额不足提示 -->
          <div v-if="payMethod === 'wallet' && !canPayWithWallet" 
               class="insufficient-balance-tip">
            <el-alert
              title="余额不足"
              :description="`当前余额: ${walletBalance}，需要支付: ${formatDCoin(currentOrder?.amount || 0)}`"
              type="warning"
              show-icon
              :closable="false">
              <template #default>
                <el-button type="warning" size="small" @click="handleRecharge">
                  立即充值
                </el-button>
              </template>
            </el-alert>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="payDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmPay" :loading="payLoading">确认支付</el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 微信支付二维码对话框 -->
    <el-dialog
      title="微信扫码支付"
      v-model="wechatQrDialogVisible"
      width="350px"
      center
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="qr-code-container">
        <div v-if="qrCodeUrl" class="qr-code">
          <img :src="qrCodeUrl" alt="微信支付二维码" />
        </div>
        <p class="qr-code-tip">请使用微信扫一扫，扫描二维码完成支付</p>
        <p class="qr-code-amount">{{ formatDCoin(currentOrder?.amount || 0) }}</p>
        
        <div class="qr-code-timer">
          <span>支付倒计时：</span>
          <count-down 
            v-if="payCountdown > 0" 
            :time="payCountdown" 
            @finish="handlePayTimeout"
          >
            <template #default="{ minutes, seconds }">
              <span class="countdown">{{ minutes }}:{{ seconds }}</span>
            </template>
          </count-down>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelWechatPay">取消支付</el-button>
          <el-button type="success" @click="checkPayStatus">已完成支付</el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 支付宝支付表单 (隐藏) -->
    <div style="display: none;">
      <form id="alipayForm" method="post" action="" ref="alipayForm">
        <input type="hidden" name="biz_content" :value="alipayFormData.biz_content">
        <!-- 其他支付宝所需参数 -->
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/user'
import { useWalletStore } from '@/store/wallet'
import { getOrders, cancelOrder } from '@/api/order'
import { formatDCoin } from '@/config/currency'
import { createPayment, getPaymentById } from '@/api/payment'
import { formatDate } from '@/utils/date'

// 响应式数据
const loading = ref(false)
const orders = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchKeyword = ref('')
const activeTab = ref('ALL')
const payDialogVisible = ref(false)
const wechatQrDialogVisible = ref(false)
const payMethod = ref('wallet') // 默认选择钱包支付
const currentOrder = ref(null)
const payLoading = ref(false)
const qrCodeUrl = ref('')
const payCountdown = ref(15 * 60 * 1000) // 15分钟倒计时
const paymentId = ref('')
const checkPayStatusTimer = ref(null)
const alipayFormData = ref({})

// Store 和 Router
const userStore = useUserStore()
const walletStore = useWalletStore()
const router = useRouter()

// 计算属性
const walletBalance = computed(() => formatDCoin(walletStore.balance || 0))
const canPayWithWallet = computed(() => walletStore.canPay(currentOrder.value?.amount || 0))

// 生命周期钩子
onMounted(() => {
  fetchOrders()
  fetchWalletInfo()
})

onBeforeUnmount(() => {
  clearPayStatusTimer()
})
// 方法函数
const fetchWalletInfo = async () => {
  try {
    await walletStore.fetchWallet()
  } catch (error) {
    console.error('获取钱包信息失败', error)
  }
}

const selectPayMethod = (method) => {
  payMethod.value = method
}

const handleRecharge = () => {
  router.push('/wallet/recharge')
}

const fetchOrders = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value
    }
    
    if (activeTab.value !== 'ALL') {
      const map = { PENDING: 0, PAID: 1, CANCELLED: 2, REFUNDED: 3 }
      params.status = map[activeTab.value]
    }
    
    if (searchKeyword.value) {
      params.keyword = searchKeyword.value
    }
    
    const response = await getOrders(params)
    if (response.data.code === 0) {
      orders.value = response.data.data.items
      total.value = response.data.data.total
    } else {
      ElMessage.error(response.data.message || '获取订单列表失败')
    }
  } catch (error) {
    console.error('获取订单列表失败', error)
    ElMessage.error('获取订单列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchOrders()
}

  const handleTabChange = (tab, e) => {
    activeTab.value = tab.paneName
    currentPage.value = 1
    fetchOrders()
  }

const handlePageChange = (page) => {
  currentPage.value = page
  fetchOrders()
}

const getStatusClass = (status) => {
  const map = {
    0: 'pending',
    1: 'paid',
    2: 'cancelled',
    3: 'refunded'
  }
  return map[status] || 'pending'
}

const getStatusText = (status) => {
  const map = {
    0: '待支付',
    1: '已支付',
    2: '已取消',
    3: '已退款'
  }
  return map[status] || '未知'
}

const handlePay = (order) => {
  currentOrder.value = order
  payDialogVisible.value = true
}
    
const handleCancel = async (order) => {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const response = await cancelOrder(order.id, {})
    if (response.data.code === 0) {
      ElMessage.success('订单取消成功')
      fetchOrders()
    } else {
      ElMessage.error(response.data.message || '订单取消失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('订单取消失败', error)
      ElMessage.error('订单取消失败，请稍后重试')
    }
  }
}

const handleDownload = (order) => {
  // 跳转到模板详情页面
  router.push(`/templates/${order.template_id}`)
}

const handleDetail = (order) => {
  // 跳转到订单详情页面
  router.push(`/orders/${order.id}`)
}

const confirmPay = async () => {
  if (!payMethod.value) {
    ElMessage.warning('请选择支付方式')
    return
  }
  
  // 如果是钱包支付，检查余额和确认
  if (payMethod.value === 'wallet') {
    if (!walletStore.hasWallet) {
      ElMessage.error('请先创建钱包')
      return
    }
    
    if (!canPayWithWallet.value) {
      ElMessage.warning('钱包余额不足，请先充值')
      return
    }

    // 钱包支付确认
    try {
      await ElMessageBox.confirm(
        `确认使用DLove Coin支付 ${formatDCoin(currentOrder.value.amount)}？`,
        '确认支付',
        {
          confirmButtonText: '确认支付',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
    } catch {
      return // 用户取消
    }
  }
  
  payLoading.value = true
  try {
    if (payMethod.value === 'wallet') {
      // 钱包支付
      const result = await walletStore.pay({
        order_id: currentOrder.value.id,
        amount: currentOrder.value.amount,
        description: `购买模板: ${currentOrder.value.template?.name || '未知模板'}`
      })

      if (result.success) {
        payDialogVisible.value = false
        ElMessage.success('支付成功')
        fetchOrders() // 刷新订单列表
      } else {
        ElMessage.error(result.message || '支付失败')
      }
    } else {
      // 第三方支付
      const methodMap = { WECHAT: 'wechat', ALIPAY: 'alipay', wallet: 'wallet' }
      const response = await createPayment({
        order_id: currentOrder.value.id,
        payment_method: methodMap[payMethod.value] || 'wallet'
      })
      
      if (response.data.code === 0) {
        const paymentData = response.data.data
        paymentId.value = paymentData.payment.id
        
        if (payMethod.value === 'WECHAT') {
          // 处理微信支付
          payDialogVisible.value = false
          handleWechatPay(paymentData.payment_params)
        } else if (payMethod.value === 'ALIPAY') {
          // 处理支付宝支付
          payDialogVisible.value = false
          handleAlipay(paymentData.payment_params)
        }
      } else {
        ElMessage.error(response.data.message || '创建支付失败')
      }
    }
  } catch (error) {
    console.error('支付失败', error)
    ElMessage.error('支付失败，请稍后重试')
  } finally {
    payLoading.value = false
  }
}

const handleWechatPay = (payParams) => {
  qrCodeUrl.value = payParams?.code_url || payParams?.qr_code_url || payParams?.qr_code || 'https://via.placeholder.com/200x200?text=QR+Code'
  wechatQrDialogVisible.value = true
  startCheckPayStatus()
}

const handleAlipay = (payParams) => {
  // 设置支付宝表单数据
  alipayFormData.value = payParams
  
  // 提交表单到支付宝
  setTimeout(() => {
    document.getElementById('alipayForm').submit()
  }, 100)
}

const startCheckPayStatus = () => {
  // 每3秒检查一次支付状态
  checkPayStatusTimer.value = setInterval(checkPayStatus, 3000)
}

const clearPayStatusTimer = () => {
  if (checkPayStatusTimer.value) {
    clearInterval(checkPayStatusTimer.value)
    checkPayStatusTimer.value = null
  }
}

const checkPayStatus = async () => {
  try {
    const response = await getPaymentById(paymentId.value)
    if (response.data.code === 0) {
      const payment = response.data.data
      if (payment.status === 'SUCCESS') {
        // 支付成功
        clearPayStatusTimer()
        wechatQrDialogVisible.value = false
        ElMessage.success('支付成功')
        fetchOrders()
      }
    }
  } catch (error) {
    console.error('检查支付状态失败', error)
  }
}

const cancelWechatPay = () => {
  clearPayStatusTimer()
  wechatQrDialogVisible.value = false
}

const handlePayTimeout = () => {
   clearPayStatusTimer()
   ElMessage.warning('支付超时，请重新发起支付')
   wechatQrDialogVisible.value = false
 }
</script>

<style scoped>
.order-list-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 200px);
}

.order-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.order-list-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.search-input {
  width: 250px;
}

.order-list {
  margin-top: 20px;
}

.order-item {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8f9fb;
  border-bottom: 1px solid #ebeef5;
}

.order-number {
  font-size: 14px;
  color: #606266;
}

.order-status {
  font-size: 14px;
  font-weight: bold;
}

.status-pending {
  color: #e6a23c;
}

.status-paid {
  color: #67c23a;
}

.status-cancelled {
  color: #909399;
}

.status-refunded {
  color: #f56c6c;
}

.order-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.template-info {
  display: flex;
  align-items: center;
}

.template-cover {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
}

.template-details h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #303133;
}

.template-categories {
  display: flex;
  align-items: center;
  gap: 6px;
}

.categories-label {
  font-size: 14px;
  color: #909399;
}

.category-tag {
  margin-right: 4px;
}

.no-category {
  font-size: 14px;
  color: #909399;
}

.order-price {
  text-align: right;
}

.price-label {
  display: block;
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.price-value {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
}

.order-time {
  font-size: 14px;
  color: #909399;
}

.order-actions .el-button {
  margin-left: 10px;
}

.loading-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.empty-container {
  padding: 40px 0;
  background-color: #fff;
  border-radius: 8px;
  text-align: center;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

/* 支付对话框样式 */
.pay-dialog-content {
  padding: 10px 0;
}

.pay-order-info {
  text-align: center;
  margin-bottom: 20px;
}

.pay-order-number {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.pay-order-amount {
  font-size: 16px;
  color: #303133;
}

.pay-order-amount .amount {
  font-size: 24px;
  font-weight: bold;
  color: #f56c6c;
}

.pay-method-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 15px;
}

.pay-methods {
  display: flex;
  justify-content: space-around;
  gap: 10px;
}

.pay-method-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 20px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;
}

.pay-method-item.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.pay-method-item i {
  font-size: 24px;
  margin-bottom: 8px;
}

.wechat-icon {
  color: #09bb07;
}

.alipay-icon {
  color: #1677ff;
}

.wallet-icon {
  color: #ff6b35;
}

.balance-info {
  font-size: 12px;
  color: #606266;
  margin-top: 4px;
}

.insufficient-balance-tip {
  font-size: 12px;
  color: #f56c6c;
  margin-top: 4px;
  text-align: center;
}

/* 二维码对话框样式 */
.qr-code-container {
  text-align: center;
}

.qr-code {
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
}

.qr-code img {
  width: 100%;
  height: 100%;
}

.qr-code-tip {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.qr-code-amount {
  font-size: 24px;
  font-weight: bold;
  color: #f56c6c;
  margin-bottom: 20px;
}

.qr-code-timer {
  font-size: 14px;
  color: #606266;
}

.countdown {
  font-weight: bold;
  color: #f56c6c;
}
</style>
