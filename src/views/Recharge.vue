<template>
  <div class="recharge-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-button @click="goBack" circle type="primary" class="back-button">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <h1>钱包充值</h1>
      <div></div>
    </div>

    <!-- 当前余额 -->
    <div class="current-balance">
      <div class="balance-card">
        <div class="balance-label">当前余额</div>
        <div class="balance-amount">
          <span class="amount">{{ formatDCoin(walletStore.balance) }}</span>
        </div>
      </div>
    </div>

    <!-- 充值金额选择 -->
    <div class="recharge-section">
      <h3>选择充值金额</h3>
      
      <!-- 预设金额 -->
      <div class="preset-amounts">
        <div 
          v-for="amount in presetAmounts" 
          :key="amount.value"
          class="amount-item"
          :class="{ active: selectedAmount === amount.value }"
          @click="selectAmount(amount.value)"
        >
          <div class="amount-value">¥{{ amount.value }}</div>
          <div v-if="amount.bonus" class="amount-bonus">送{{ amount.bonus }}元</div>
        </div>
      </div>

      <!-- 自定义金额 -->
      <div class="custom-amount">
        <div class="custom-amount-header">
          <span>自定义金额</span>
          <el-switch v-model="isCustomAmount" @change="handleCustomAmountChange"></el-switch>
        </div>
        <div v-if="isCustomAmount" class="custom-input">
          <el-input
            v-model="customAmountInput"
            placeholder="请输入充值金额"
            @input="handleCustomInput"
            :class="{ 'is-error': customAmountError }"
          >
            <template #prepend>¥</template>
          </el-input>
          <div v-if="customAmountError" class="error-tip">{{ customAmountError }}</div>
          <div v-else class="input-tip">最低充值金额：¥10，最高充值金额：¥10,000</div>
        </div>
      </div>

      <!-- 充值后余额预览 -->
      <div v-if="selectedAmount > 0" class="balance-preview">
        <div class="preview-item">
          <span>充值金额：</span>
          <span class="preview-amount">¥{{ selectedAmount.toFixed(2) }}</span>
        </div>
        <div class="preview-item">
          <span>预计到账：</span>
          <span class="preview-amount">{{ formatDCoin(estimatedDCoin) }}</span>
        </div>
        <div v-if="bonusAmount > 0" class="preview-item">
          <span>赠送金额：</span>
          <span class="preview-bonus">¥{{ bonusAmount.toFixed(2) }}</span>
        </div>
        <div class="preview-item total">
          <span>充值后余额：</span>
          <span class="preview-total">{{ formatDCoin(walletStore.balance + estimatedDCoin + toDCoinFromRMB(bonusAmount)) }}</span>
        </div>
      </div>
    </div>

    <!-- 支付方式 -->
    <div class="payment-section">
      <h3>选择支付方式</h3>
      <div class="payment-methods">
        <div 
          class="payment-method"
          :class="{ active: paymentMethod === 'WECHAT' }"
          @click="selectPaymentMethod('WECHAT')"
        >
          <i class="payment-icon wechat-icon el-icon-chat-dot-round"></i>
          <span>微信支付</span>
          <i class="el-icon-check check-icon"></i>
        </div>
        <div 
          class="payment-method"
          :class="{ active: paymentMethod === 'ALIPAY' }"
          @click="selectPaymentMethod('ALIPAY')"
        >
          <i class="payment-icon alipay-icon el-icon-wallet"></i>
          <span>支付宝</span>
          <i class="el-icon-check check-icon"></i>
        </div>
      </div>
    </div>

    <!-- 充值按钮 -->
    <div class="recharge-actions">
      <el-button 
        type="primary" 
        size="large" 
        :disabled="!canRecharge"
        :loading="rechargeLoading"
        @click="handleRecharge"
        class="recharge-btn"
      >
        <template v-if="rechargeLoading">
          <i class="el-icon-loading"></i>
          创建充值订单中...
        </template>
        <template v-else>
          <i class="el-icon-wallet"></i>
          立即充值 ¥{{ selectedAmount.toFixed(2) }}
        </template>
      </el-button>
    </div>

    <!-- 充值说明 -->
    <div class="recharge-tips">
      <h4>充值说明</h4>
      <ul>
        <li>充值金额将实时到账，可立即使用</li>
        <li>充值过程中请勿关闭页面或重复操作</li>
        <li>如遇到问题，请联系客服处理</li>
        <li>充值记录可在钱包页面查看</li>
      </ul>
    </div>

    <!-- 支付二维码对话框 -->
    <el-dialog
      :title="`${paymentMethodName}支付`"
      v-model="qrDialogVisible"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
    >
      <div class="qr-code-container">
        <div class="qr-code-tip">
          <i class="el-icon-mobile-phone"></i>
          请使用{{ paymentMethodName }}扫描下方二维码完成支付
        </div>
        <div class="qr-code-amount">
          ¥{{ selectedAmount.toFixed(2) }}
        </div>
        <div class="qr-code">
          <img 
            :src="qrCodeUrl" 
            alt="支付二维码" 
            @error="handleQrCodeError"
            @load="handleQrCodeLoad"
            v-show="qrCodeLoaded"
          />
          <div v-if="!qrCodeLoaded" class="qr-code-loading">
            <el-skeleton :rows="1" animated style="width: 200px; height: 200px;" />
          </div>
        </div>
        <div class="qr-code-timer">
          <i class="el-icon-time"></i>
          支付剩余时间：<span class="countdown">{{ formatTime(payCountdown) }}</span>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelPayment">
            <i class="el-icon-close"></i>
            取消支付
          </el-button>
          <el-button type="primary" @click="checkPaymentStatus">
            <i class="el-icon-refresh"></i>
            检查支付状态
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useWalletStore } from '@/store/wallet'
import { rechargeWallet } from '@/api/wallet'
import { getPaymentById } from '@/api/payment'
import { toDCoinFromRMB, formatDCoin } from '@/config/currency'
import { ArrowLeft } from '@element-plus/icons-vue'

// 响应式数据
const selectedAmount = ref(0)
const isCustomAmount = ref(false)
const customAmountInput = ref('')
const customAmountError = ref('')
const paymentMethod = ref('WECHAT')
const rechargeLoading = ref(false)
const qrDialogVisible = ref(false)
const qrCodeUrl = ref('')
const qrCodeLoaded = ref(false)
const payCountdown = ref(300) // 5分钟
const paymentId = ref(null)
const checkPayStatusTimer = ref(null)
const estimatedDCoin = computed(() => toDCoinFromRMB(selectedAmount.value))

// 预设金额
const presetAmounts = ref([
  { value: 10, bonus: 0 },
  { value: 50, bonus: 0 },
  { value: 100, bonus: 5 },
  { value: 200, bonus: 15 },
  { value: 500, bonus: 50 },
  { value: 1000, bonus: 120 }
])

// Store 和 Router
const walletStore = useWalletStore()
const router = useRouter()

// 计算属性
const bonusAmount = computed(() => {
  const preset = presetAmounts.value.find(item => item.value === selectedAmount.value)
  return preset ? preset.bonus : 0
})

const canRecharge = computed(() => {
  return selectedAmount.value >= 10 && 
         selectedAmount.value <= 10000 && 
         paymentMethod.value && 
         !customAmountError.value
})

const paymentMethodName = computed(() => {
  return paymentMethod.value === 'WECHAT' ? '微信' : '支付宝'
})

// 清理支付定时器
const clearPaymentTimer = () => {
  
  if (checkPayStatusTimer.value) {
    clearInterval(checkPayStatusTimer.value)
    checkPayStatusTimer.value = null
  }
}

// 初始化钱包
const initializeWallet = async () => {
  // 确保钱包信息已加载
  if (!walletStore.hasWallet) {
    await walletStore.fetchWallet()
  }
  
  // 如果没有钱包，先创建
  if (!walletStore.hasWallet) {
    try {
      await walletStore.createWallet()
    } catch (error) {
      console.error('创建钱包失败', error)
      ElMessage.error('创建钱包失败，请重试')
    }
  }
}

// 方法函数
const goBack = () => {
  router.go(-1)
}

const selectAmount = (amount) => {
  selectedAmount.value = amount
  isCustomAmount.value = false
  customAmountInput.value = ''
}

const handleCustomAmountChange = (value) => {
  if (!value) {
    selectedAmount.value = 0
    customAmountInput.value = ''
    customAmountError.value = ''
  } else {
    // 实时验证金额
    const amount = parseFloat(customAmountInput.value) || 0
    if (amount && amount < 10) {
      customAmountError.value = '充值金额不能少于10元'
    } else if (amount && amount > 10000) {
      customAmountError.value = '单次充值金额不能超过10000元'
    } else {
      customAmountError.value = ''
    }
  }
}

const handleCustomInput = (value) => {
  // 限制只能输入数字和小数点
  const numericValue = value.replace(/[^\d.]/g, '')
  
  // 限制小数点后最多两位
  const parts = numericValue.split('.')
  if (parts.length > 2) {
    customAmountInput.value = parts[0] + '.' + parts[1]
    return
  }
  if (parts[1] && parts[1].length > 2) {
    customAmountInput.value = parts[0] + '.' + parts[1].substring(0, 2)
    return
  }
  
  // 限制最大值
  const num = parseFloat(numericValue)
  if (num > 10000) {
    customAmountInput.value = '10000'
    selectedAmount.value = 10000
    return
  }
  
  customAmountInput.value = numericValue
  selectedAmount.value = num || 0
  
  // 验证金额范围
  if (num && num < 10) {
    customAmountError.value = '充值金额不能少于10元'
  } else {
    customAmountError.value = ''
  }
}

const selectPaymentMethod = (method) => {
  paymentMethod.value = method
}

const handleRecharge = async () => {
  if (!canRecharge.value) {
    ElMessage.warning('请选择充值金额和支付方式')
    return
  }

  // 金额验证
  if (selectedAmount.value < 10) {
    ElMessage.warning('充值金额不能少于10元')
    return
  }
  
  if (selectedAmount.value > 10000) {
    ElMessage.warning('单次充值金额不能超过10000元')
    return
  }

  rechargeLoading.value = true
  try {
    const response = await rechargeWallet({
      amount: estimatedDCoin.value,
      payment_method: paymentMethod.value.toLowerCase()
    })

    if (response.data.code === 0) {
      const paymentData = response.data.data
      paymentId.value = paymentData.payment.id
      qrCodeUrl.value = paymentData.payment_params.qr_code_url || 'https://via.placeholder.com/200x200?text=QR+Code'
      qrCodeLoaded.value = false
      qrDialogVisible.value = true
      startPaymentTimer()
    } else {
      ElMessage.error(response.data.message || '创建充值订单失败')
    }
  } catch (error) {
    console.error('创建充值订单失败', error)
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        ElMessage.error('登录已过期，请重新登录')
        router.push('/login')
      } else if (status === 403) {
        ElMessage.error('没有权限进行充值操作')
      } else if (status === 400) {
        ElMessage.error(error.response.data.message || '充值参数错误')
      } else if (status >= 500) {
        ElMessage.error('服务器错误，请稍后重试')
      } else {
        ElMessage.error('创建充值订单失败，请稍后重试')
      }
    } else if (error.request) {
      ElMessage.error('网络连接失败，请检查网络设置')
    } else {
      ElMessage.error('创建充值订单失败，请稍后重试')
    }
  } finally {
    rechargeLoading.value = false
  }
}

const startPaymentTimer = () => {
  payCountdown.value = 300 // 5分钟
  checkPayStatusTimer.value = setInterval(() => {
    payCountdown.value--
    if (payCountdown.value <= 0) {
      cancelPayment()
      ElMessage.warning('支付超时，请重新发起充值')
    } else {
      // 每10秒检查一次支付状态
      if (payCountdown.value % 10 === 0) {
        checkPaymentStatus()
      }
    }
  }, 1000)
}

const checkPaymentStatus = async () => {
  if (!paymentId.value) return

  try {
    const response = await getPaymentById(paymentId.value)
    if (response.data.code === 0) {
      const payment = response.data.data
      if (payment.status === 1) {
        // 支付成功
        clearPaymentTimer()
        qrDialogVisible.value = false
        ElMessage.success('充值成功！')
        
        // 刷新钱包余额
        try {
          await walletStore.fetchWallet()
        } catch (walletError) {
          console.error('刷新钱包信息失败', walletError)
        }
        
        // 返回钱包页面
        router.push('/wallet')
      } else if (payment.status === 2) {
        // 支付失败
        clearPaymentTimer()
        qrDialogVisible.value = false
        ElMessage.error('支付失败，请重新发起充值')
      }
      // status === 0 表示支付中，继续等待
    } else {
      console.error('检查支付状态失败', response.data.message)
    }
  } catch (error) {
    console.error('检查支付状态失败', error)
    // 静默处理错误，避免频繁弹窗干扰用户
    if (error.response && error.response.status === 401) {
      clearPaymentTimer()
      qrDialogVisible.value = false
      ElMessage.error('登录已过期，请重新登录')
      router.push('/login')
    }
  }
}

const cancelPayment = () => {
  ElMessageBox.confirm('确定要取消当前支付吗？', '取消支付', {
    confirmButtonText: '确定',
    cancelButtonText: '继续支付',
    type: 'warning'
  }).then(() => {
    clearPaymentTimer()
    qrDialogVisible.value = false
    paymentId.value = null
    qrCodeUrl.value = ''
    qrCodeLoaded.value = false
    ElMessage.info('已取消支付')
  }).catch(() => {
    // 用户选择继续支付，不做任何操作
  })
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

const handleQrCodeLoad = () => {
  qrCodeLoaded.value = true
}

const handleQrCodeError = () => {
  qrCodeLoaded.value = false
  ElMessage.error('二维码加载失败，请重试')
}

// 生命周期
onMounted(() => {
  initializeWallet()
})

onBeforeUnmount(() => {
  clearPaymentTimer()
})
</script>

<style scoped>
.recharge-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.back-button {
  background-color: #ff6b35;
  border-color: #ff6b35;
  color: #fff;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.current-balance {
  margin-bottom: 30px;
}

.balance-card {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.balance-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 10px;
}

.balance-amount {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.currency {
  font-size: 18px;
  margin-right: 5px;
}

.amount {
  font-size: 32px;
  font-weight: bold;
}

.recharge-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 20px;
}

.recharge-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #303133;
}

.preset-amounts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.amount-item {
  padding: 20px;
  border: 2px solid #dcdfe6;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.amount-item:hover {
  border-color: #ff6b35;
}

.amount-item.active {
  border-color: #ff6b35;
  background: #fff5f2;
}

.amount-value {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.amount-bonus {
  font-size: 12px;
  color: #f56c6c;
}

.custom-amount {
  border-top: 1px solid #ebeef5;
  padding-top: 20px;
}

.custom-amount-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.custom-input {
  margin-top: 15px;
}

.input-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.error-tip {
  font-size: 12px;
  color: #f56c6c;
  margin-top: 8px;
}

.custom-input .el-input.is-error .el-input__inner {
  border-color: #f56c6c;
}

.balance-preview {
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.preview-item:last-child {
  margin-bottom: 0;
}

.preview-item.total {
  font-weight: bold;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.preview-amount {
  color: #ff6b35;
}

.preview-bonus {
  color: #67c23a;
}

.preview-total {
  color: #303133;
  font-size: 18px;
}

.payment-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 20px;
}

.payment-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #303133;
}

.payment-methods {
  display: flex;
  gap: 15px;
}

.payment-method {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid #dcdfe6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-method:hover {
  border-color: #ff6b35;
}

.payment-method.active {
  border-color: #ff6b35;
  background: #fff5f2;
}

.payment-icon {
  font-size: 24px;
  margin-right: 10px;
}

.wechat-icon {
  color: #09bb07;
}

.alipay-icon {
  color: #1677ff;
}

.check-icon {
  margin-left: auto;
  color: #ff6b35;
  opacity: 0;
  transition: opacity 0.3s;
}

.payment-method.active .check-icon {
  opacity: 1;
}

.recharge-actions {
  margin-bottom: 30px;
}

.recharge-btn {
  width: 100%;
  height: 50px;
  font-size: 18px;
}

.recharge-tips {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.recharge-tips h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #303133;
}

.recharge-tips ul {
  margin: 0;
  padding-left: 20px;
}

.recharge-tips li {
  margin-bottom: 8px;
  color: #606266;
  line-height: 1.5;
}

/* 二维码对话框样式 */
.qr-code-container {
  text-align: center;
  padding: 20px;
}

.qr-code {
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  padding: 10px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.qr-code:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.qr-code img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.qr-code-loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 8px;
}

.qr-code-tip {
  font-size: 14px;
  color: #606266;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.qr-code-tip i {
  color: #ff6b35;
}

.qr-code-amount {
  font-size: 28px;
  font-weight: bold;
  color: #ff6b35;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(255, 107, 53, 0.2);
}

.qr-code-timer {
  font-size: 14px;
  color: #606266;
  background: #f8f9fa;
  padding: 10px 20px;
  border-radius: 20px;
  display: inline-block;
}

.countdown {
  font-weight: bold;
  color: #f56c6c;
  font-size: 16px;
}

@media (max-width: 768px) {
  .recharge-page {
    padding: 15px;
  }
  
  .preset-amounts {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .amount-item {
    padding: 15px;
  }
  
  .amount-value {
    font-size: 16px;
  }
  
  .payment-methods {
    flex-direction: column;
    gap: 15px;
  }
  
  .payment-method {
    margin-bottom: 0;
  }
  
  .recharge-btn {
    width: 100%;
    padding: 15px;
    font-size: 16px;
  }
  
  .qr-code {
    width: 180px;
    height: 180px;
  }
  
  .qr-code-amount {
    font-size: 24px;
  }
  
  .recharge-section,
  .payment-section,
  .recharge-tips {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .preset-amounts {
    grid-template-columns: 1fr;
  }
  
  .balance-preview {
    padding: 15px;
  }
  
  .payment-section {
    padding: 20px;
  }
}
</style>
