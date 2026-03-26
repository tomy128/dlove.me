<template>
  <div class="order-detail-container">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>
    
    <div v-else-if="!order" class="empty-container">
      <el-empty description="订单不存在或已被删除"></el-empty>
      <el-button type="primary" @click="$router.push('/orders')">返回订单列表</el-button>
    </div>
    
    <div v-else class="order-detail">
      <div class="order-header">
        <div class="order-title">
          <h2>订单详情</h2>
          <el-tag :type="getStatusType(order.status)" effect="dark">{{ getStatusText(order.status) }}</el-tag>
        </div>
        <div class="order-actions">
          <el-button 
            v-if="order.status === 0"
            type="primary" 
            @click="handlePay"
          >
            立即支付
          </el-button>
          
          <el-button 
            v-if="order.status === 0"
            type="danger" 
            @click="handleCancel"
          >
            取消订单
          </el-button>
          
          <el-button 
            v-if="order.status === 1"
            type="success" 
            @click="handleDownload"
          >
            下载模板
          </el-button>
          
          <el-button 
            type="info" 
            @click="$router.push('/orders')"
          >
            返回列表
          </el-button>
        </div>
      </div>
      
      <el-card class="order-info-card">
        <template #header>
          <span>订单信息</span>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <span class="info-label">订单号：</span>
              <span class="info-value">{{ order.order_no }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="info-label">订单状态：</span>
              <span class="info-value">{{ getStatusText(order.status) }}</span>
            </div>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <span class="info-label">创建时间：</span>
              <span class="info-value">{{ formatDate(order.created_at) }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="info-label">更新时间：</span>
              <span class="info-value">{{ formatDate(order.updated_at) }}</span>
            </div>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" v-if="order.status === 2">
          <el-col :span="24">
            <div class="info-item">
              <span class="info-label">取消原因：</span>
              <span class="info-value">{{ order.cancel_reason || '用户取消' }}</span>
            </div>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" v-if="order.status === 3">
          <el-col :span="24">
            <div class="info-item">
              <span class="info-label">退款原因：</span>
              <span class="info-value">{{ order.refund_reason || '系统退款' }}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>
      
      <el-card class="template-info-card">
        <template #header>
          <span>模板信息</span>
        </template>
        
        <div class="template-info">
          <img :src="order.template?.cover_url || 'https://via.placeholder.com/120x120'" alt="模板封面" class="template-cover" />
          <div class="template-details">
            <h3>{{ order.template?.name || '未知模板' }}</h3>
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
            <p class="template-description">{{ order.template?.description || '' }}</p>
            <div class="template-price">
              <span class="price-label">价格：</span>
              <span class="price-value">{{ formatDCoin(order.amount) }}</span>
            </div>
          </div>
        </div>
      </el-card>
      
      <el-card class="payment-info-card" v-if="payments.length > 0">
        <template #header>
          <span>支付信息</span>
        </template>
        
        <el-table :data="payments" style="width: 100%">
          <el-table-column prop="id" label="支付ID" width="220">
            <template #default="scope">
              <el-tooltip :content="scope.row.id" placement="top">
                <span>{{ scope.row.id.substring(0, 8) }}...</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="payment_method" label="支付方式" width="120">
            <template #default="scope">
              <el-tag size="small" type="info">
                {{ getPaymentMethodText(scope.row.payment_method) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="支付金额" width="120">
            <template #default="scope">
              {{ formatDCoin(scope.row.amount) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="支付状态" width="120">
            <template #default="scope">
              <el-tag 
                size="small" 
                :type="getPaymentStatusType(scope.row.status)"
              >
                {{ getPaymentStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间">
            <template #default="scope">
              {{ formatDate(scope.row.created_at) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
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
          <p class="pay-order-number">订单号: {{ order?.order_no }}</p>
          <p class="pay-order-amount">支付金额: <span class="amount">{{ formatDCoin(order?.amount || 0) }}</span></p>
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
              :description="`当前余额: ${walletBalance}，需要支付: ${formatDCoin(order?.amount || 0)}`"
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
        <p class="qr-code-amount">{{ formatDCoin(order?.amount || 0) }}</p>
        
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
import { getOrderById, cancelOrder, getOrderPayments } from '@/api/order'
import { createPayment, getPaymentById } from '@/api/payment'
import { formatDCoin } from '@/config/currency'
import { formatDate } from '@/utils/date'

// Props
const props = defineProps({
  orderId: {
    type: [String, Number],
    required: true
  }
})

// Router
const router = useRouter()

// Stores
const userStore = useUserStore()
const walletStore = useWalletStore()

// 响应式数据
const loading = ref(false)
const order = ref(null)
const payments = ref([])
const payDialogVisible = ref(false)
const wechatQrDialogVisible = ref(false)
const payMethod = ref('wallet') // 默认选择钱包支付
const payLoading = ref(false)
const qrCodeUrl = ref('')
const payCountdown = ref(15 * 60 * 1000) // 15分钟倒计时
const paymentId = ref('')
const checkPayStatusTimer = ref(null)
const alipayFormData = ref({})

// 计算属性
const walletBalance = computed(() => formatDCoin(walletStore.balance || 0))
const canPayWithWallet = computed(() => walletStore.canPay(order.value?.amount || 0))

// 生命周期钩子
onMounted(() => {
  fetchOrderDetail()
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

const fetchOrderDetail = async () => {
  loading.value = true
  try {
    const response = await getOrderById(props.orderId)
    if (response.data.code === 0) {
      const data = response.data.data
      order.value = data?.order || data
      order.value.template = data?.template
      fetchPayments()
    } else {
      ElMessage.error(response.data.message || '获取订单详情失败')
    }
  } catch (error) {
    console.error('获取订单详情失败', error)
    ElMessage.error('获取订单详情失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const fetchPayments = async () => {
  try {
    const response = await getOrderPayments(props.orderId)
    if (response.data.code === 0) {
      const raw = response.data.data
      payments.value = Array.isArray(raw) ? raw : (raw?.items || [])
    }
  } catch (error) {
    console.error('获取支付记录失败', error)
  }
}

const getStatusText = (status) => {
  const statusMap = {
    0: '待支付',
    1: '已支付',
    2: '已取消',
    3: '已退款'
  }
  return statusMap[status] || status
}

const getStatusType = (status) => {
  const typeMap = {
    0: 'warning',
    1: 'success',
    2: 'info',
    3: 'danger'
  }
  return typeMap[status] || ''
}

const getPaymentMethodText = (method) => {
  const methodMap = {
    'WECHAT': '微信支付',
    'ALIPAY': '支付宝'
  }
  return methodMap[method] || method
}

const getPaymentStatusText = (status) => {
  const statusMap = {
    0: '待支付',
    1: '支付成功',
    2: '支付失败'
  }
  return statusMap[status] ?? (status === true ? '支付成功' : '未知')
}

const getPaymentStatusType = (status) => {
  const typeMap = {
    0: 'warning',
    1: 'success',
    2: 'danger'
  }
  return typeMap[status] ?? (status === true ? 'success' : '')
}

const handlePay = () => {
  payDialogVisible.value = true
}
const handleCancel = async () => {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const response = await cancelOrder(props.orderId, {})
    if (response.data.code === 0) {
      ElMessage.success('订单取消成功')
      fetchOrderDetail()
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

const handleDownload = () => {
  // 跳转到模板详情页面
  router.push(`/templates/${order.value.template_id}`)
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
        `确认使用DLove Coin支付 ${formatDCoin(order.value.amount)}？`,
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
        order_id: props.orderId,
        amount: order.value.amount,
        description: `购买模板: ${order.value.template?.name || '未知模板'}`
      })

      if (result.success) {
        payDialogVisible.value = false
        ElMessage.success('支付成功')
        fetchOrderDetail() // 刷新订单状态
      } else {
        ElMessage.error(result.message || '支付失败')
      }
    } else {
      // 第三方支付
      const methodMap = { WECHAT: 'wechat', ALIPAY: 'alipay', wallet: 'wallet' }
      const response = await createPayment({
        order_id: props.orderId,
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
      const paid = payment.paid === true || payment.status === 1
      if (paid) {
        clearPayStatusTimer()
        wechatQrDialogVisible.value = false
        ElMessage.success('支付成功')
        fetchOrderDetail()
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
.order-detail-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 200px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.order-title {
  display: flex;
  align-items: center;
}

.order-title h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
  margin-right: 15px;
}

.order-info-card,
.template-info-card,
.payment-info-card {
  margin-bottom: 20px;
}

.info-item {
  margin-bottom: 15px;
  display: flex;
}

.info-label {
  font-size: 14px;
  color: #909399;
  width: 100px;
}

.info-value {
  font-size: 14px;
  color: #303133;
  flex: 1;
}

.template-info {
  display: flex;
}

.template-cover {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 20px;
}

.template-details h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #303133;
}

.template-categories {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;
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

.template-description {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.template-price {
  display: flex;
  align-items: center;
}

.price-label {
  font-size: 14px;
  color: #909399;
}

.price-value {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
  margin-left: 5px;
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
  min-width: 120px;
}

.pay-method-item.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.pay-method-item i {
  font-size: 24px;
  margin-bottom: 8px;
}

.wallet-icon {
  color: #9c27b0;
}

.wechat-icon {
  color: #09bb07;
}

.alipay-icon {
  color: #1677ff;
}

.balance-info {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.insufficient-balance-tip {
  margin-top: 15px;
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
