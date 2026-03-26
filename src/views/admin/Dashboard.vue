<template>
  <div class="dashboard-container p-6">
    <h1 class="page-title mb-6">管理后台</h1>

    <!-- 数据概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <el-card shadow="hover" class="dashboard-card">
        <div class="flex items-center">
          <div class="mr-4 p-3 rounded-full bg-blue-100">
            <el-icon :size="24" class="text-blue-500">
              <User />
            </el-icon>
          </div>
          <div>
            <div class="text-gray-500 text-sm">用户总数</div>
            <div class="text-2xl font-bold mt-1">
              <template v-if="loading">
                <el-skeleton-item variant="text" style="width: 60px; height: 30px" />
              </template>
              <template v-else>
                {{ statistics.userCount || 0 }}
              </template>
            </div>
          </div>
        </div>
        <div class="mt-4 text-sm text-gray-500">
          <span class="text-green-500 font-medium">↑ {{ statistics.userGrowth || 0 }}%</span>
          较上月
        </div>
      </el-card>

      <el-card shadow="hover" class="dashboard-card">
        <div class="flex items-center">
          <div class="mr-4 p-3 rounded-full bg-purple-100">
            <el-icon :size="24" class="text-purple-500">
              <Picture />
            </el-icon>
          </div>
          <div>
            <div class="text-gray-500 text-sm">模板总数</div>
            <div class="text-2xl font-bold mt-1">
              <template v-if="loading">
                <el-skeleton-item variant="text" style="width: 60px; height: 30px" />
              </template>
              <template v-else>
                {{ statistics.templateCount || 0 }}
              </template>
            </div>
          </div>
        </div>
        <div class="mt-4 text-sm text-gray-500">
          <span class="text-green-500 font-medium">↑ {{ statistics.templateGrowth || 0 }}%</span>
          较上月
        </div>
      </el-card>

      <el-card shadow="hover" class="dashboard-card">
        <div class="flex items-center">
          <div class="mr-4 p-3 rounded-full bg-green-100">
            <el-icon :size="24" class="text-green-500">
              <ShoppingCart />
            </el-icon>
          </div>
          <div>
            <div class="text-gray-500 text-sm">订单总数</div>
            <div class="text-2xl font-bold mt-1">
              <template v-if="loading">
                <el-skeleton-item variant="text" style="width: 60px; height: 30px" />
              </template>
              <template v-else>
                {{ statistics.orderCount || 0 }}
              </template>
            </div>
          </div>
        </div>
        <div class="mt-4 text-sm text-gray-500">
          <span class="text-green-500 font-medium">↑ {{ statistics.orderGrowth || 0 }}%</span>
          较上月
        </div>
      </el-card>

      <el-card shadow="hover" class="dashboard-card">
        <div class="flex items-center">
          <div class="mr-4 p-3 rounded-full bg-amber-100">
            <el-icon :size="24" class="text-amber-500">
              <Money />
            </el-icon>
          </div>
          <div>
            <div class="text-gray-500 text-sm">总收入</div>
            <div class="text-2xl font-bold mt-1">
              <template v-if="loading">
                <el-skeleton-item variant="text" style="width: 60px; height: 30px" />
              </template>
              <template v-else>
                {{ formatDCoin(statistics.totalRevenue || 0) }}
              </template>
            </div>
          </div>
        </div>
        <div class="mt-4 text-sm text-gray-500">
          <span class="text-green-500 font-medium">↑ {{ statistics.revenueGrowth || 0 }}%</span>
          较上月
        </div>
      </el-card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- 销售趋势图 -->
      <el-card shadow="hover" class="h-80">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-bold">销售趋势</span>
            <el-radio-group v-model="salesChartPeriod" size="small">
              <el-radio-button label="week">周</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
              <el-radio-button label="year">年</el-radio-button>
            </el-radio-group>
          </div>
        </template>
        <div class="h-64" v-loading="loading">
          <div v-if="!loading" ref="salesChartRef" class="w-full h-full"></div>
        </div>
      </el-card>

      <!-- 热门模板 -->
      <el-card shadow="hover" class="h-80">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-bold">热门模板</span>
            <el-button type="primary" link @click="$router.push('/admin/templates')">
              查看全部
            </el-button>
          </div>
        </template>
        <div v-loading="loading">
          <el-table :data="topTemplates" style="width: 100%">
            <el-table-column prop="name" label="模板名称">
              <template #default="{ row }">
                <div class="flex items-center">
                  <el-image 
                    :src="row.cover_image" 
                    style="width: 40px; height: 40px" 
                    fit="cover"
                    class="mr-2 rounded"
                  />
                  <span class="truncate">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="category" label="场景" width="100" />
            <el-table-column prop="sales" label="销量" width="80" align="right" />
            <el-table-column prop="revenue" label="收入(Ð)" width="120" align="right">
              <template #default="{ row }">
                {{ formatDCoin(row.revenue) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 最近订单 -->
      <el-card shadow="hover">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-bold">最近订单</span>
            <el-button type="primary" link @click="$router.push('/admin/orders')">
              查看全部
            </el-button>
          </div>
        </template>
        <div v-loading="loading">
          <el-table :data="recentOrders" style="width: 100%">
            <el-table-column prop="id" label="订单ID" width="80" />
            <el-table-column prop="user" label="用户" width="120" />
            <el-table-column prop="amount" label="金额(Ð)" width="120">
              <template #default="{ row }">
                {{ formatDCoin(row.amount) }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" size="small">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="日期">
              <template #default="{ row }">
                {{ formatDate(row.date) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>

      <!-- 最新用户 -->
      <el-card shadow="hover">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-bold">最新用户</span>
            <el-button type="primary" link @click="$router.push('/admin/users')">
              查看全部
            </el-button>
          </div>
        </template>
        <div v-loading="loading">
          <el-table :data="recentUsers" style="width: 100%">
            <el-table-column prop="id" label="用户ID" width="80" />
            <el-table-column prop="nickname" label="用户名">
              <template #default="{ row }">
                <div class="flex items-center">
                  <el-avatar :size="32" :src="row.avatar" class="mr-2">
                    {{ row.nickname.charAt(0).toUpperCase() }}
                  </el-avatar>
                  <span>{{ row.nickname }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="registerDate" label="注册日期">
              <template #default="{ row }">
                {{ formatDate(row.registerDate) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { User, Picture, ShoppingCart, Money } from '@element-plus/icons-vue'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { getStatistics } from '@/api/admin/dashboard'
import { formatDCoin } from '@/config/currency'
import { formatDate } from '@/utils/date'

// 注册 ECharts 组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer
])

// 数据加载状态
const loading = ref(true)

// 统计数据
const statistics = ref({
  userCount: 0,
  userGrowth: 0,
  templateCount: 0,
  templateGrowth: 0,
  orderCount: 0,
  orderGrowth: 0,
  totalRevenue: 0,
  revenueGrowth: 0
})

// 销售图表
const salesChartRef = ref(null)
const salesChartPeriod = ref('month')
let salesChart = null

// 热门模板
const topTemplates = ref([])

// 最近订单
const recentOrders = ref([])

// 最新用户
const recentUsers = ref([])

// 获取统计数据
const fetchStatistics = async () => {
  loading.value = true
  try {
    const response = await getStatistics({
      period: salesChartPeriod.value
    })
    statistics.value = response.data.statistics
    topTemplates.value = response.data.topTemplates
    recentOrders.value = response.data.recentOrders
    recentUsers.value = response.data.recentUsers
    
    // 更新销售图表
    renderSalesChart(response.data.salesTrend)
  } catch (error) {
    console.error('获取统计数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 渲染销售图表
const renderSalesChart = (data) => {
  if (!salesChartRef.value) return
  
  // 如果图表已存在，销毁它
  if (salesChart) {
    salesChart.dispose()
  }
  
  // 创建新图表
  salesChart = echarts.init(salesChartRef.value)
  
  // 图表配置
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const data = params[0].data
        return `${params[0].axisValue}<br/>${params[0].marker}销售额: ${formatDCoin(data)}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.labels
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value) => `${formatDCoin(value)}`
      }
    },
    series: [
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#6366f1'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(99, 102, 241, 0.5)'
            },
            {
              offset: 1,
              color: 'rgba(99, 102, 241, 0.1)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: data.values
      }
    ]
  }
  
  // 设置图表选项
  salesChart.setOption(option)
  
  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    salesChart && salesChart.resize()
  })
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
  const statusMap = {
    pending: '待支付',
    paid: '已支付',
    failed: '已失败',
    refunded: '已退款',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

// 监听销售图表周期变化
watch(salesChartPeriod, () => {
  fetchStatistics()
})

onMounted(() => {
  fetchStatistics()
})
</script>

<style scoped>
.dashboard-container {
  min-height: calc(100vh - 64px);
}

.dashboard-card {
  transition: transform 0.3s ease;
}

.dashboard-card:hover {
  transform: translateY(-5px);
}
</style>
