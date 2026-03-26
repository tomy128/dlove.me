<template>
  <div class="order-management-container" :class="isMobile ? 'p-4' : 'p-6'">
    <div class="mb-6">
      <h1 class="page-title mb-4" :class="isMobile ? 'text-xl' : 'text-2xl'">订单管理</h1>
      <div class="flex flex-col lg:flex-row lg:justify-end gap-4">
        <el-input
          v-model="searchQuery"
          placeholder="搜索订单号或用户"
          :class="isMobile ? 'w-full' : 'w-64'"
          :size="isMobile ? 'default' : 'default'"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #suffix>
            <el-icon class="cursor-pointer" @click="handleSearch">
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-select 
          v-model="statusFilter" 
          placeholder="支付状态" 
          :class="isMobile ? 'w-full' : 'w-32'" 
          :size="isMobile ? 'default' : 'default'"
          @change="handleSearch"
        >
          <el-option label="全部" :value="null" />
          <el-option label="待支付" value=0 />
          <el-option label="已支付" value=1 />
          <el-option label="已取消" value=2 />
          <el-option label="已退款" value=3 />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :class="isMobile ? 'w-full' : ''"
          :size="isMobile ? 'default' : 'default'"
          @change="handleSearch"
        />
      </div>
    </div>

    <div class="w-full mb-6">
      <div class="overflow-x-auto">
        <el-table
          v-loading="loading"
          :data="orders"
          style="width: 100%; min-width: 1000px;"
          border
          stripe
          highlight-current-row
          :size="isMobile ? 'small' : 'default'"
        >
          <el-table-column 
            prop="order_no" 
            label="订单号" 
            show-overflow-tooltip
          />
          <el-table-column 
            prop="user.nickname" 
            label="用户" 
            :width="isMobile ? '120' : '100%'"
            :min-width="isMobile ? '120' : '150'"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <el-link type="primary" @click="handleViewUser(row.user)" :class="isMobile ? 'text-sm' : ''">
                {{ row.user.nickname }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column 
            prop="total_amount" 
            label="金额" 
            :width="isMobile ? '100' : '120'"
            :min-width="isMobile ? '100' : '120'"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span :class="isMobile ? 'text-sm' : ''">{{ formatDCoin(row.total_amount || row.amount) }}</span>
            </template>
          </el-table-column>
          <el-table-column 
            prop="status" 
            label="状态" 
            :width="isMobile ? '100' : '120'"
            :min-width="isMobile ? '100' : '120'"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" :size="isMobile ? 'small' : 'default'">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column 
            prop="payment_method" 
            label="支付方式" 
            :width="isMobile ? '100' : '120'"
            :min-width="isMobile ? '100' : '120'"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span :class="isMobile ? 'text-sm' : ''">{{ getPaymentMethodText(row.payment_method) }}</span>
            </template>
          </el-table-column>
          <el-table-column 
            prop="created_at" 
            label="创建时间" 
            :width="isMobile ? '140' : '180'"
            :min-width="isMobile ? '140' : '180'"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span :class="isMobile ? 'text-xs' : 'text-sm'">{{ formatDate(row.created_at) }}</span>
            </template>
          </el-table-column>
          <el-table-column 
            prop="updated_at" 
            label="更新时间" 
            :width="isMobile ? '140' : '180'"
            :min-width="isMobile ? '140' : '180'"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span :class="isMobile ? 'text-xs' : 'text-sm'">{{ formatDate(row.updated_at) }}</span>
            </template>
          </el-table-column>
          <el-table-column 
            label="操作" 
            fixed="right" 
            :width="isMobile ? '160' : '180'"
            :min-width="isMobile ? '160' : '180'"
          >
            <template #default="{ row }">
              <div :class="isMobile ? 'flex flex-col gap-1' : 'flex gap-2'">
                <el-button
                  :size="isMobile ? 'small' : 'small'"
                  type="primary"
                  @click="handleViewOrder(row)"
                  :class="isMobile ? 'w-full' : ''"
                >
                  详情
                </el-button>
                <el-button
                  v-if="row.status === 'pending'"
                  :size="isMobile ? 'small' : 'small'"
                  type="danger"
                  @click="handleCancelOrder(row)"
                  :class="isMobile ? 'w-full' : ''"
                >
                  取消
                </el-button>
                <el-button
                  v-if="row.status === 'paid'"
                  :size="isMobile ? 'small' : 'small'"
                  type="warning"
                  @click="handleRefundOrder(row)"
                  :class="isMobile ? 'w-full' : ''"
                >
                  退款
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="flex justify-center mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :layout="isMobile ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
          :total="total"
          :size="isMobile ? 'small' : 'default'"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="orderDialogVisible"
      title="订单详情"
      :width="isMobile ? '95%' : '700px'"
      :fullscreen="isMobile"
      destroy-on-close
    >
      <div v-if="selectedOrder" class="order-detail">
        <el-descriptions :column="isMobile ? 1 : 2" border :size="isMobile ? 'small' : 'default'">
          <el-descriptions-item label="订单ID">{{ selectedOrder.id }}</el-descriptions-item>
          <el-descriptions-item label="用户">
            <el-link type="primary" @click="handleViewUser(selectedOrder.user)">
              {{ selectedOrder.user.nickname }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="订单金额">{{ formatDCoin(selectedOrder.total_amount || selectedOrder.amount) }}</el-descriptions-item>
          <el-descriptions-item label="支付状态">
            <el-tag :type="getStatusType(selectedOrder.status)" :size="isMobile ? 'small' : 'default'">
              {{ getStatusText(selectedOrder.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="支付方式">{{ getPaymentMethodText(selectedOrder.payment_method) }}</el-descriptions-item>
          <el-descriptions-item label="支付ID">{{ selectedOrder.payment_id || '暂无' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDate(selectedOrder.created_at) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ formatDate(selectedOrder.updated_at) }}</el-descriptions-item>
        </el-descriptions>

        <div class="mt-6">
          <h4 :class="isMobile ? 'text-base font-bold mb-3' : 'text-lg font-bold mb-3'">订单项目</h4>
          <div class="overflow-x-auto">
            <el-table
              :data="selectedOrder.items || (selectedOrder.template ? [{template: selectedOrder.template, price: selectedOrder.amount}] : [])"
              style="width: 100%; min-width: 400px;"
              border
              stripe
              :size="isMobile ? 'small' : 'default'"
            >
              <el-table-column 
                prop="template.name" 
                label="模板名称" 
                :min-width="isMobile ? '120' : '150'"
                show-overflow-tooltip
              />
              <el-table-column 
                label="查看作品" 
                :width="isMobile ? '100' : '120'"
              >
                 <template #default="{ row }">
                   <el-button link type="primary" size="small" @click="handleViewWork(selectedOrder.id)">预览</el-button>
                 </template>
              </el-table-column>
              <el-table-column 
                prop="price" 
                label="价格" 
                :width="isMobile ? '80' : '120'"
                :min-width="isMobile ? '80' : '120'"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <span :class="isMobile ? 'text-sm' : ''">{{ formatDCoin(row.price || selectedOrder.amount) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 配置信息 (新增) -->
        <div v-if="selectedOrder.config_data" class="mt-6">
           <h4 :class="isMobile ? 'text-base font-bold mb-3' : 'text-lg font-bold mb-3'">配置数据</h4>
           <div class="bg-gray-50 p-4 rounded border overflow-x-auto">
              <pre class="text-xs text-gray-600">{{ typeof selectedOrder.config_data === 'string' ? selectedOrder.config_data : JSON.stringify(selectedOrder.config_data, null, 2) }}</pre>
           </div>
        </div>

        <div v-if="selectedOrder.status === 'paid' || selectedOrder.status === 'refunded'" class="mt-6">
          <h4 :class="isMobile ? 'text-base font-bold mb-3' : 'text-lg font-bold mb-3'">支付记录</h4>
          <el-descriptions :column="isMobile ? 1 : 2" border :size="isMobile ? 'small' : 'default'">
            <el-descriptions-item label="支付时间">{{ formatDate(selectedOrder.payment_time) || '暂无' }}</el-descriptions-item>
            <el-descriptions-item label="支付渠道">{{ getPaymentMethodText(selectedOrder.payment_method) }}</el-descriptions-item>
            <el-descriptions-item v-if="selectedOrder.status === 'refunded'" label="退款时间">{{ formatDate(selectedOrder.refund_time) || '暂无' }}</el-descriptions-item>
            <el-descriptions-item v-if="selectedOrder.status === 'refunded'" label="退款原因">{{ selectedOrder.refund_reason || '暂无' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <div :class="isMobile ? 'flex flex-col gap-3' : 'flex justify-between'">
          <div :class="isMobile ? 'flex flex-col gap-2' : 'flex gap-2'">
            <el-button
              v-if="selectedOrder && selectedOrder.status === 'pending'"
              type="danger"
              :size="isMobile ? 'default' : 'default'"
              :class="isMobile ? 'w-full' : ''"
              @click="handleCancelOrder(selectedOrder)"
            >
              取消订单
            </el-button>
            <el-button
              v-if="selectedOrder && selectedOrder.status === 'paid'"
              type="warning"
              :size="isMobile ? 'default' : 'default'"
              :class="isMobile ? 'w-full' : ''"
              @click="handleRefundOrder(selectedOrder)"
            >
              退款
            </el-button>
          </div>
          <el-button 
            @click="orderDialogVisible = false"
            :size="isMobile ? 'default' : 'default'"
            :class="isMobile ? 'w-full' : ''"
          >
            关闭
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 退款对话框 -->
    <el-dialog
      v-model="refundDialogVisible"
      title="订单退款"
      :width="isMobile ? '95%' : '500px'"
      :fullscreen="isMobile"
      destroy-on-close
    >
      <el-form 
        :model="refundForm" 
        :label-width="isMobile ? '80px' : '100px'"
        :size="isMobile ? 'default' : 'default'"
      >
        <el-form-item label="退款原因" required>
          <el-input
            v-model="refundForm.reason"
            type="textarea"
            :rows="isMobile ? 3 : 3"
            placeholder="请输入退款原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div :class="isMobile ? 'flex flex-col gap-3' : 'flex justify-end gap-2'">
          <el-button 
            @click="refundDialogVisible = false"
            :size="isMobile ? 'default' : 'default'"
            :class="isMobile ? 'w-full' : ''"
          >
            取消
          </el-button>
          <el-button 
            type="warning" 
            :loading="refundLoading" 
            @click="confirmRefund"
            :size="isMobile ? 'default' : 'default'"
            :class="isMobile ? 'w-full' : ''"
          >
            确认退款
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdminOrders, updateOrderStatus, processRefund, getOrderDetails } from '@/api/admin/orders'
import { getOrderDetail } from '@/api/order'
import { formatDCoin } from '@/config/currency'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/date'

const router = useRouter()

// 订单列表数据
const orders = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 响应式设计
const isMobile = ref(false)
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

// 筛选条件
const searchQuery = ref('')
const statusFilter = ref(null)
const dateRange = ref(null)

// 订单详情相关
const orderDialogVisible = ref(false)
const selectedOrder = ref(null)

// 退款相关
const refundDialogVisible = ref(false)
const refundForm = ref({ reason: '' })
const refundLoading = ref(false)

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      search: searchQuery.value,
      status: statusFilter.value,
      start_date: dateRange.value ? dateRange.value[0] : null,
      end_date: dateRange.value ? dateRange.value[1] : null
    }
    const response = await getAdminOrders(params)
    orders.value = response.data.data.items
    total.value = response.data.data.total
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 获取订单详情
const fetchOrderDetail = async (orderId) => {
  try {
    const response = await getOrderDetail(orderId)
    selectedOrder.value = response.data.data
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchOrders()
}

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchOrders()
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchOrders()
}

// 查看订单详情
const handleViewOrder = async (order) => {
  try {
    const response = await getOrderDetails(order.id)
    selectedOrder.value = response.data.data
    orderDialogVisible.value = true
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
  }
}

// 查看用户详情
const handleViewUser = (user) => {
  // 这里可以跳转到用户管理页面并查看该用户
  // 或者打开一个用户详情对话框
  ElMessage.info(`查看用户: ${user.nickname}`)
}

// 查看作品
const handleViewWork = (orderId) => {
  const routeUrl = router.resolve({
    name: 'work-view',
    params: { id: orderId }
  })
  window.open(routeUrl.href, '_blank')
}

// 取消订单
const handleCancelOrder = async (order) => {
  try {
    await ElMessageBox.confirm(
      `确定要取消订单 #${order.id} 吗？`,
      '确认操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await updateOrderStatus(order.id, 'cancelled')
    ElMessage.success('订单已取消')
    
    // 更新本地数据
    const index = orders.value.findIndex(o => o.id === order.id)
    if (index !== -1) {
      orders.value[index].status = 'cancelled'
    }
    
    // 如果当前正在查看该订单，也更新详情中的数据
    if (selectedOrder.value && selectedOrder.value.id === order.id) {
      selectedOrder.value.status = 'cancelled'
    }
    
    // 如果是在详情对话框中取消的，关闭对话框
    if (orderDialogVisible.value) {
      orderDialogVisible.value = false
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消订单失败:', error)
      ElMessage.error('取消订单失败')
    }
  }
}

// 退款订单
const handleRefundOrder = (order) => {
  selectedOrder.value = { ...order }
  refundForm.value.reason = ''
  refundDialogVisible.value = true
}

// 确认退款
const confirmRefund = async () => {
  if (!selectedOrder.value) return
  if (!refundForm.value.reason.trim()) {
    ElMessage.warning('请输入退款原因')
    return
  }
  
  refundLoading.value = true
  try {
    await updateOrderStatus(selectedOrder.value.id, 'refunded', {
      refund_reason: refundForm.value.reason
    })
    ElMessage.success('退款成功')
    
    // 更新本地数据
    const index = orders.value.findIndex(o => o.id === selectedOrder.value.id)
    if (index !== -1) {
      orders.value[index].status = 'refunded'
    }
    
    // 关闭对话框
    refundDialogVisible.value = false
    orderDialogVisible.value = false
    
    // 刷新订单列表
    fetchOrders()
  } catch (error) {
    console.error('退款失败:', error)
    ElMessage.error('退款失败')
  } finally {
    refundLoading.value = false
  }
}

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    pending: 'warning',
    paid: 'success',
    failed: 'danger',
    refunded: 'info',
    cancelled: 'info'
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
  const getStatusText = (status) => {
    const int2Status = {
      0: 'pending',
      1: 'paid',
      2: 'cancelled',
      3: 'refunded'
    }
    const statusMap = {
      pending: '待支付',
      paid: '已支付',
      failed: '已失败',
      refunded: '已退款',
      cancelled: '已取消'
    }
    return statusMap[int2Status[status]] || status
  }

// 获取支付方式文本
const getPaymentMethodText = (method) => {
  const methodMap = {
    alipay: '支付宝',
    wechat: '微信支付',
    bank: '银行转账',
    other: '其他'
  }
  return methodMap[method] || method || '未选择'
}

onMounted(() => {
  fetchOrders()
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

// 组件卸载时清理事件监听器
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.order-management-container {
  min-height: calc(100vh - 64px);
}
</style>
