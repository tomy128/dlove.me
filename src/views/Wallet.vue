<template>
  <div class="wallet-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>我的钱包</h1>
      <p>管理您的 DLove Coin 余额和交易记录</p>
    </div>

    <!-- 钱包卡片 -->
    <div class="wallet-card">
      <div class="wallet-header">
        <div class="wallet-icon">
          <i class="el-icon-wallet"></i>
        </div>
        <div class="wallet-info">
          <h2>DLove Coin 钱包</h2>
          <p v-if="!walletStore.hasWallet" class="no-wallet-tip">您还没有创建钱包</p>
        </div>
      </div>

      <div v-if="loading" class="wallet-loading">
        <el-skeleton :rows="3" animated />
      </div>

      <div v-else-if="!walletStore.hasWallet" class="no-wallet">
        <div class="no-wallet-content">
          <i class="el-icon-wallet no-wallet-icon"></i>
          <h3>还没有钱包</h3>
          <p>创建您的 DLove Coin 钱包，开始享受便捷的支付体验</p>
          <el-button type="primary" @click="createWallet" :loading="createLoading">
            创建钱包
          </el-button>
        </div>
      </div>

      <div v-else class="wallet-content">
        <!-- 余额显示 -->
        <div class="balance-section">
          <div class="balance-card">
            <div class="balance-label">当前余额</div>
            <div class="balance-amount">
              <span class="amount">{{ formatDCoin(walletStore.balance) }}</span>
            </div>
          </div>
          <div class="balance-actions">
            <el-button type="primary" @click="goToRecharge">
              <i class="el-icon-plus"></i>
              充值
            </el-button>
            <el-button @click="refreshWallet" :loading="refreshLoading">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>
        </div>

        <!-- 快捷操作 -->
        <div class="quick-actions">
          <div class="action-item" @click="goToRecharge">
            <i class="el-icon-plus"></i>
            <span>充值</span>
          </div>
          <div class="action-item" @click="scrollToTransactions">
            <i class="el-icon-document"></i>
            <span>交易记录</span>
          </div>
          <div class="action-item" @click="goToTemplates">
            <i class="el-icon-shopping-cart-2"></i>
            <span>购买模板</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 交易记录 -->
    <div v-if="walletStore.hasWallet" class="transactions-section" ref="transactionsSection">
      <div class="section-header">
          <h3>交易记录</h3>
          <div class="header-actions">
            <el-input
              v-if="transactions.length > 0 || searchKeyword"
              v-model="searchKeyword"
              placeholder="搜索交易记录..."
              size="small"
              style="width: 200px; margin-right: 10px;"
              @input="handleSearch"
              clearable
            >
              <template #prefix>
                <i class="el-icon-search"></i>
              </template>
            </el-input>
            <el-button 
              v-if="!transactionsLoading && transactions.length > 0" 
              size="small" 
              @click="fetchTransactions(true)" 
              :loading="refreshing"
            >
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>
        </div>

      <!-- 加载状态 -->
      <div v-if="transactionsLoading && transactions.length === 0" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>

      <!-- 空状态 -->
      <div v-else-if="transactions.length === 0" class="empty-transactions">
        <div class="empty-icon">
          <i class="el-icon-document"></i>
        </div>
        <h3>暂无交易记录</h3>
        <p>您还没有任何交易记录，快去充值或购买模板吧！</p>
        <div class="empty-actions">
          <el-button type="primary" @click="goToRecharge">
            <i class="el-icon-plus"></i>
            立即充值
          </el-button>
          <el-button @click="goToTemplates">
            <i class="el-icon-shopping-cart-2"></i>
            浏览模板
          </el-button>
        </div>
      </div>

      <transition-group 
        v-else 
        name="transaction-list" 
        tag="div" 
        class="transactions-list"
      >
        <div 
          v-for="transaction in transactions" 
          :key="transaction.id" 
          class="transaction-item"
        >
          <div class="transaction-icon">
            <i :class="getTransactionIcon(transaction.type)"></i>
          </div>
          <div class="transaction-info">
            <div class="transaction-title">{{ transaction.description }}</div>
            <div class="transaction-time">{{ formatDate(transaction.created_at) }}</div>
          </div>
          <div class="transaction-amount" :class="getAmountClass(transaction.type)">
            {{ getAmountText(transaction) }}
          </div>
        </div>
      </transition-group>

      <!-- 分页 -->
      <div v-if="transactions.length > 0" class="pagination">
        <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          background
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useWalletStore } from '@/store/wallet'
import { getTransactions } from '@/api/wallet'
import { formatDCoin } from '@/config/currency'
import { formatDate } from '@/utils/date'

// 响应式数据
const loading = ref(true)
const createLoading = ref(false)
const refreshLoading = ref(false)
const transactionsLoading = ref(false)
const transactions = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const refreshing = ref(false)
const searchKeyword = ref('')
const searchTimer = ref(null)
const transactionsSection = ref(null)

// Store 和 Router
const walletStore = useWalletStore()
const router = useRouter()

// 生命周期钩子
onMounted(async () => {
  await initWallet()
})

onBeforeUnmount(() => {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }
})
// 方法函数
const initWallet = async () => {
  loading.value = true
  try {
    await walletStore.fetchWallet()
    if (walletStore.hasWallet) {
      await fetchTransactions()
    }
  } catch (error) {
    console.error('初始化钱包失败', error)
    ElMessage.error('加载钱包信息失败')
  } finally {
    loading.value = false
  }
}

const createWallet = async () => {
  createLoading.value = true
  try {
    const result = await walletStore.createWallet()
    if (result.success) {
      ElMessage.success('钱包创建成功')
      await fetchTransactions()
    } else {
      ElMessage.error(result.message || '创建钱包失败')
    }
  } catch (error) {
    console.error('创建钱包失败', error)
    ElMessage.error('创建钱包失败')
  } finally {
    createLoading.value = false
  }
}

const refreshWallet = async () => {
  refreshLoading.value = true
  try {
    await walletStore.fetchWallet()
    ElMessage.success('刷新成功')
  } catch (error) {
    console.error('刷新钱包失败', error)
    ElMessage.error('刷新失败')
  } finally {
    refreshLoading.value = false
  }
}

const fetchTransactions = async (isRefresh = false) => {
  if (isRefresh) {
    refreshing.value = true
  } else {
    transactionsLoading.value = true
  }
  
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    if (searchKeyword.value) {
      params.search = searchKeyword.value
    }
    
    const response = await getTransactions(params)
    
    if (response.data.code === 0) {
      transactions.value = response.data.data.transactions || []
      total.value = response.data.data.total || 0
      
      if (isRefresh) {
        ElMessage.success('刷新成功')
      }
    } else {
      ElMessage.error(response.data.message || '获取交易记录失败')
    }
  } catch (error) {
    console.error('获取交易记录失败', error)
    if (error.response) {
      // 服务器响应错误
      const status = error.response.status
      if (status === 401) {
        ElMessage.error('登录已过期，请重新登录')
        router.push('/login')
      } else if (status === 403) {
        ElMessage.error('没有权限访问钱包信息')
      } else if (status >= 500) {
        ElMessage.error('服务器错误，请稍后重试')
      } else {
        ElMessage.error('获取交易记录失败，请稍后重试')
      }
    } else if (error.request) {
      // 网络错误
      ElMessage.error('网络连接失败，请检查网络设置')
    } else {
      ElMessage.error('获取交易记录失败')
    }
  } finally {
    transactionsLoading.value = false
    refreshing.value = false
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchTransactions()
}

const handleSearch = () => {
  // 清除之前的定时器
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }
  
  // 设置防抖，500ms后执行搜索
  searchTimer.value = setTimeout(() => {
    currentPage.value = 1 // 重置到第一页
    fetchTransactions()
  }, 500)
}

const goToRecharge = () => {
  router.push('/recharge')
}

const goToTemplates = () => {
  router.push('/templates')
}

const scrollToTransactions = () => {
  // 使用 ref 来访问 DOM 元素
  if (transactionsSection.value) {
    transactionsSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}

const getTransactionIcon = (type) => {
  const icons = {
    'recharge': 'el-icon-plus',
    'payment': 'el-icon-shopping-cart-2',
    'refund': 'el-icon-refresh-left'
  }
  return icons[type] || 'el-icon-document'
}

const getAmountClass = (type) => {
  return type === 'recharge' || type === 'refund' ? 'amount-positive' : 'amount-negative'
}

const getAmountText = (transaction) => {
  // 处理DCoin字典格式的amount数据
  let amount = 0
  if (typeof transaction.amount === 'object' && transaction.amount !== null) {
    // 如果amount是DCoin对象，使用其amount属性
    amount = transaction.amount.amount || 0
  } else {
    // 如果amount是数字，直接使用
    amount = parseFloat(transaction.amount) || 0
  }
  
  const prefix = transaction.type === 'recharge' || transaction.type === 'refund' ? '+' : '-'
  return `${prefix}${amount}Ð`
}
</script>

<style scoped>
.wallet-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
  color: #303133;
}

.page-header p {
  margin: 0;
  font-size: 16px;
  color: #606266;
}

.wallet-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  overflow: hidden;
}

.wallet-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
}

.wallet-icon {
  font-size: 32px;
  margin-right: 15px;
}

.wallet-info h2 {
  margin: 0 0 5px 0;
  font-size: 20px;
}

.wallet-info p {
  margin: 0;
  opacity: 0.9;
}

.wallet-loading {
  padding: 30px;
}

.no-wallet {
  padding: 40px;
}

.no-wallet-content {
  text-align: center;
}

.no-wallet-icon {
  font-size: 64px;
  color: #dcdfe6;
  margin-bottom: 20px;
}

.no-wallet-content h3 {
  margin: 0 0 10px 0;
  font-size: 20px;
  color: #303133;
}

.no-wallet-content p {
  margin: 0 0 30px 0;
  color: #606266;
}

.wallet-content {
  padding: 30px;
}

.balance-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #ebeef5;
}

.balance-card {
  text-align: left;
}

.balance-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.balance-amount {
  display: flex;
  align-items: baseline;
}

.currency {
  font-size: 20px;
  color: #303133;
  margin-right: 5px;
}

.amount {
  font-size: 36px;
  font-weight: bold;
  color: #ff6b35;
}

.balance-actions {
  display: flex;
  gap: 10px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.action-item i {
  font-size: 24px;
  color: #ff6b35;
  margin-bottom: 8px;
}

.action-item span {
  font-size: 14px;
  color: #303133;
}

.transactions-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.section-header .el-button {
  color: #409eff;
  border: none;
  padding: 8px 12px;
  font-size: 14px;
}

.section-header .el-button:hover {
  background-color: #ecf5ff;
}

.header-actions {
  display: flex;
  align-items: center;
}

.loading-container {
  padding: 20px 0;
}

.loading-container {
  padding: 20px 0;
}

.empty-transactions {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-icon {
  margin-bottom: 20px;
}

.empty-icon i {
  font-size: 64px;
  color: #dcdfe6;
}

.empty-transactions h3 {
  margin: 0 0 10px 0;
  font-size: 20px;
  color: #606266;
}

.empty-transactions p {
  margin: 0 0 30px 0;
  font-size: 14px;
  color: #909399;
  line-height: 1.5;
}

.empty-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.empty-actions .el-button {
  min-width: 120px;
}

.transactions-list {
  margin-bottom: 20px;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.transaction-icon i {
  font-size: 18px;
  color: #ff6b35;
}

.transaction-info {
  flex: 1;
}

.transaction-title {
  font-size: 16px;
  color: #303133;
  margin-bottom: 5px;
}

.transaction-time {
  font-size: 14px;
  color: #909399;
}

.transaction-amount {
  font-size: 16px;
  font-weight: bold;
}

.amount-positive {
  color: #67c23a;
}

.amount-negative {
  color: #f56c6c;
}

.pagination {
  text-align: center;
  margin-top: 20px;
}

/* 过渡动画 */
.transaction-list-enter-active,
.transaction-list-leave-active {
  transition: all 0.3s ease;
}

.transaction-list-enter {
  opacity: 0;
  transform: translateY(20px);
}

.transaction-list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.transaction-list-move {
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .wallet-page {
    padding: 15px;
  }
  
  .balance-section {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }
  
  .balance-card {
    text-align: center;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .transactions-section {
    padding: 20px;
  }
}
</style>
