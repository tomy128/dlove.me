<template>
  <div class="user-management-container p-4 md:p-6">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
      <h1 class="page-title text-xl md:text-2xl">用户管理</h1>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户名或邮箱"
          class="w-full sm:w-64"
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
        <el-select v-model="statusFilter" placeholder="状态筛选" class="w-full sm:w-32" @change="handleSearch">
          <el-option label="全部" value="" />
          <el-option label="活跃" value="active" />
          <el-option label="禁用" value="inactive" />
        </el-select>

      </div>
    </div>

    <el-card class="w-full mb-6" shadow="hover">
      <div class="overflow-x-auto">
        <el-table
          v-loading="loading"
          :data="users"
          style="width: 100%; min-width: 800px"
          border
          stripe
          highlight-current-row
          :size="isMobile ? 'small' : 'default'"
        >
          <el-table-column prop="id" label="ID" width="100%" :show-overflow-tooltip="true" />
          <el-table-column prop="nickname" label="用户名" min-width="120" :show-overflow-tooltip="true" />
          <el-table-column prop="email" label="邮箱" min-width="180" :show-overflow-tooltip="true" />
          <el-table-column prop="phone" label="手机号" min-width="130" :show-overflow-tooltip="true" />

          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 0 ? 'success' : 'danger'">
                {{ row.status === 0 ? '活跃' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="注册时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" :width="isMobile ? '160' : '200'">
            <template #default="{ row }">
              <div class="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                <el-button
                  :size="isMobile ? 'small' : 'small'"
                  type="primary"
                  @click="handleViewUser(row)"
                  class="w-full sm:w-auto"
                >
                  查看
                </el-button>
                <el-button
                  :size="isMobile ? 'small' : 'small'"
                  :type="row.status === 0 ? 'danger' : 'success'"
                  @click="handleToggleStatus(row)"
                  class="w-full sm:w-auto"
                >
                  {{ row.status === 0 ? '禁用' : '启用' }}
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
          :small="isMobile"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 用户详情对话框 -->
    <el-dialog
      v-model="userDialogVisible"
      title="用户详情"
      :width="isMobile ? '95%' : '600px'"
      :fullscreen="isMobile"
      destroy-on-close
    >
      <div v-if="selectedUser" class="user-detail">
        <div class="flex flex-col sm:flex-row sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden sm:mr-6 mx-auto sm:mx-0">
            <img
              v-if="selectedUser.avatar"
              :src="selectedUser.avatar"
              alt="用户头像"
              class="w-full h-full object-cover"
            />
            <el-icon v-else :size="isMobile ? 32 : 40" class="text-gray-400">
              <User />
            </el-icon>
          </div>
          <div class="text-center sm:text-left">
            <h3 class="text-lg sm:text-xl font-bold mb-1">{{ selectedUser.nickname }}</h3>
            <p class="text-gray-500 mb-1 text-sm sm:text-base break-all">{{ selectedUser.email }}</p>
            <div class="flex justify-center sm:justify-start space-x-2">
              <el-tag :type="selectedUser.status === 'active' ? 'success' : 'danger'">
                {{ selectedUser.status === 'active' ? '活跃' : '禁用' }}
              </el-tag>
            </div>
          </div>
        </div>

        <el-descriptions :column="isMobile ? 1 : 2" border :size="isMobile ? 'small' : 'default'">
          <el-descriptions-item label="用户ID">{{ selectedUser.id }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ selectedUser.phone || '未设置' }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">
            <span class="text-xs sm:text-sm">{{ formatDate(selectedUser.created_at) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="最后更新">
            <span class="text-xs sm:text-sm">{{ formatDate(selectedUser.updated_at) }}</span>
          </el-descriptions-item>
        </el-descriptions>

        <div class="mt-6">
          <h4 class="text-base sm:text-lg font-bold mb-3">购买记录</h4>
          <div class="overflow-x-auto">
            <el-table
              v-loading="purchasesLoading"
              :data="userPurchases"
              style="width: 100%; min-width: 400px"
              border
              stripe
              :size="isMobile ? 'small' : 'default'"
            >
              <el-table-column prop="template.name" label="模板名称" min-width="120" :show-overflow-tooltip="true" />
              <el-table-column label="操作" width="80">
                 <template #default="{ row }">
                    <el-button link type="primary" size="small" @click="handleViewWork(row.id)">预览</el-button>
                 </template>
              </el-table-column>
              <el-table-column prop="order.total_amount" label="金额" width="80">
                <template #default="{ row }">
                  <span class="text-xs sm:text-sm">{{ formatDCoin(row.order?.total_amount || row.amount || 0) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="purchased_at" label="购买时间" :width="isMobile ? '120' : '180'">
                <template #default="{ row }">
                  <span class="text-xs sm:text-sm">{{ formatDate(row.purchased_at || row.purchase_date) || '未知' }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="!purchasesLoading && userPurchases.length === 0" class="text-center py-4 text-gray-500 text-sm">
            暂无购买记录
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <el-button
              v-if="selectedUser && selectedUser.id !== currentUser.id"
              type="danger"
              :size="isMobile ? 'small' : 'default'"
              @click="handleResetPassword"
              class="w-full sm:w-auto"
            >
              重置密码
            </el-button>
          </div>
          <el-button 
            @click="userDialogVisible = false"
            :size="isMobile ? 'small' : 'default'"
            class="w-full sm:w-auto"
          >
            关闭
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 重置密码确认对话框 -->
    <el-dialog
      v-model="resetPasswordDialogVisible"
      title="重置密码确认"
      width="400px"
      destroy-on-close
    >
      <p>确定要重置该用户的密码吗？重置后将生成一个随机密码并发送到用户邮箱。</p>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <el-button @click="resetPasswordDialogVisible = false">取消</el-button>
          <el-button type="danger" :loading="resetPasswordLoading" @click="confirmResetPassword">
            确认重置
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, User } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/user'
import { useOrderStore } from '@/store/order'
import { getUsers, getUserPurchases, updateUserStatus, resetUserPassword } from '@/api/admin/users'
import { formatDCoin } from '@/config/currency'
import { formatDate } from '@/utils/date'

const router = useRouter()
const userStore = useUserStore()
const orderStore = useOrderStore()
const currentUser = computed(() => userStore.user)

// 响应式设计
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// 用户列表数据
const users = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 筛选条件
const searchQuery = ref('')
const statusFilter = ref('')

// 用户详情相关
const userDialogVisible = ref(false)
const selectedUser = ref(null)
const userPurchases = ref([])
const purchasesLoading = ref(false)

// 重置密码相关
const resetPasswordDialogVisible = ref(false)
const resetPasswordLoading = ref(false)

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      search: searchQuery.value,
      status: statusFilter.value
    }
    const response = await getUsers(params)
    users.value = response.data.data.items || []
    total.value = response.data.data.total || 0
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchUsers()
}

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchUsers()
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchUsers()
}

// 查看用户详情
const handleViewUser = async (row) => {
  selectedUser.value = row
  userDialogVisible.value = true
  purchasesLoading.value = true
  userPurchases.value = []
  try {
    const res = await getUserPurchases(row.id)
    userPurchases.value = res.data?.data || []
  } catch (error) {
    ElMessage.error('获取购买记录失败')
  } finally {
    purchasesLoading.value = false
  }
}

const handleViewWork = (orderId) => {
  const routeUrl = router.resolve({
    name: 'work-view',
    params: { id: orderId }
  })
  window.open(routeUrl.href, '_blank')
}

// 切换用户状态
const handleToggleStatus = async (user) => {
  try {
    const newStatus = user.status === 0 ? 1 : 0
    const confirmText = newStatus === 1 ? '启用' : '禁用'
    
    await ElMessageBox.confirm(
      `确定要${confirmText}用户 "${user.nickname}" 吗？`,
      '确认操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await updateUserStatus(user.id, newStatus)
    ElMessage.success(`${confirmText}用户成功`)
    
    // 更新本地数据
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value[index].status = newStatus
    }
    
    // 如果当前正在查看该用户，也更新详情中的数据
    if (selectedUser.value && selectedUser.value.id === user.id) {
      selectedUser.value.status = newStatus
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更新用户状态失败:', error)
      ElMessage.error('更新用户状态失败')
    }
  }
}



// 处理重置密码
const handleResetPassword = () => {
  if (!selectedUser.value) return
  resetPasswordDialogVisible.value = true
}

// 确认重置密码
const confirmResetPassword = async () => {
  if (!selectedUser.value) return
  
  resetPasswordLoading.value = true
  try {
    await resetUserPassword(selectedUser.value.id)
    ElMessage.success('密码重置成功，新密码已发送到用户邮箱')
    resetPasswordDialogVisible.value = false
  } catch (error) {
    console.error('重置密码失败:', error)
    ElMessage.error('重置密码失败')
  } finally {
    resetPasswordLoading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-management-container {
  min-height: calc(100vh - 64px);
}
</style>
