<template>
  <div class="category-management-page p-4 md:p-6">
    <div class="page-header mb-6">
      <h1 class="text-xl md:text-2xl font-bold">场景管理</h1>
      <p class="text-gray-500 text-sm md:text-base">管理用户使用的场景（如：生日、纪念日、表白）</p>
    </div>

    <!-- 操作栏 -->
    <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
      <div class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <el-input v-model="searchQuery" placeholder="搜索场景" clearable @input="handleSearch" class="w-full sm:w-64">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>

      <el-button type="primary" @click="handleAddCategory" class="w-full lg:w-auto">
        <el-icon class="mr-1">
          <Plus />
        </el-icon> 添加场景
      </el-button>
    </div>

    <!-- 场景列表 -->
    <el-card shadow="never" class="mb-6">
      <div v-if="loading" class="py-12 flex justify-center">
        <el-skeleton :rows="5" animated />
      </div>

      <div v-else-if="categories.length === 0" class="py-12 text-center">
        <el-icon class="text-5xl text-gray-300 mb-4">
          <Folder />
        </el-icon>
        <p class="text-gray-500 mb-4">暂无场景数据</p>
        <el-button type="primary" @click="handleAddCategory">
          <el-icon class="mr-1">
            <Plus />
          </el-icon> 添加第一个场景
        </el-button>
      </div>

      <div v-else>
        <!-- 桌面端表格 -->
        <div class="hidden md:block">
          <el-table :data="paginatedCategories" style="width: 100%" stripe>
            <el-table-column prop="name" label="场景名称" min-width="120">
              <template #default="{ row }">
                <div class="flex items-center">
                  <span v-if="row.icon" class="mr-2 text-lg">{{ row.icon }}</span>
                  <span class="font-medium">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="场景描述" min-width="200" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
                  {{ row.status === 1 ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="weight" label="权重" width="80" />
            <el-table-column prop="created_at" label="创建时间" width="160">
              <template #default="{ row }">
                {{ formatDate(row.created_at) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <div class="flex space-x-2">
                  <el-button type="primary" size="small" text @click="handleEditCategory(row)">
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" text @click="handleDeleteCategory(row)">
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 移动端卡片 -->
        <div class="md:hidden space-y-4">
          <div v-for="category in paginatedCategories" :key="category.id" class="border rounded-lg p-4 bg-white">
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center">
                <span v-if="category.icon" class="mr-2 text-lg">{{ category.icon }}</span>
                <h3 class="font-medium text-gray-900">{{ category.name }}</h3>
              </div>
              <el-tag :type="category.status === 1 ? 'success' : 'danger'" size="small">
                {{ category.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </div>
            <p v-if="category.description" class="text-gray-600 text-sm mb-2">{{ category.description }}</p>
            <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>权重: {{ category.weight }}</span>
              <span>{{ formatDate(category.created_at) }}</span>
            </div>
            <div class="flex space-x-2">
              <el-button type="primary" size="small" @click="handleEditCategory(category)" class="flex-1">
                编辑
              </el-button>
              <el-button type="danger" size="small" @click="handleDeleteCategory(category)" class="flex-1">
                删除
              </el-button>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="flex justify-center mt-6" v-if="totalPages > 1">
          <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="filteredCategories.length"
            layout="prev, pager, next" @current-change="handlePageChange" class="justify-center" />
        </div>
      </div>
    </el-card>

    <!-- 添加/编辑场景对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑场景' : '添加场景'" width="90%" :style="{ maxWidth: '500px' }"
      @close="resetForm">
      <el-form ref="categoryFormRef" :model="categoryForm" :rules="categoryRules" label-width="80px" class="space-y-4">
        <el-form-item label="场景名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入场景名称" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="场景描述" prop="description">
          <el-input v-model="categoryForm.description" type="textarea" placeholder="请输入场景描述" :rows="3" maxlength="200"
            show-word-limit />
        </el-form-item>
        <el-form-item label="场景图标" prop="icon">
          <el-input v-model="categoryForm.icon" placeholder="请输入emoji图标，如：❤️" maxlength="10">
            <template #append>
              <span v-if="categoryForm.icon" class="px-2">{{ categoryForm.icon }}</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="categoryForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input-number v-model="categoryForm.weight" :min="0" :max="999" placeholder="数值越大排序越靠前" class="w-full" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ isEdit ? '更新' : '创建' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Folder } from '@element-plus/icons-vue'
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '@/api/admin/categories'
import { formatDate } from '@/utils/date'

// 响应式数据
const loading = ref(false)
const categories = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const categoryFormRef = ref(null)

// 场景表单
const categoryForm = reactive({
  id: '',
  name: '',
  description: '',
  icon: '',
  status: 1,
  weight: 0
})

// 表单验证规则
const categoryRules = {
  name: [
    { required: true, message: '请输入场景名称', trigger: 'blur' },
    { min: 1, max: 50, message: '场景名称长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '描述长度不能超过 200 个字符', trigger: 'blur' }
  ],
  icon: [
    { max: 10, message: '图标长度不能超过 10 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ],
  weight: [
    { type: 'number', min: 0, max: 999, message: '权重范围为 0-999', trigger: 'blur' }
  ]
}

// 计算属性
const filteredCategories = computed(() => {
  let result = categories.value
  
  if (searchQuery.value) {
    result = result.filter(item => 
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }
  
  return result
})

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCategories.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredCategories.value.length / pageSize.value)
})

// 方法
const loadCategories = async () => {
  try {
    loading.value = true
    const response = await getAdminCategories()
    categories.value = response.data.data.data || []
  } catch (error) {
    console.error('获取场景列表失败:', error)
    ElMessage.error('获取场景列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handleAddCategory = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

const handleEditCategory = (category) => {
  isEdit.value = true
  categoryForm.id = category.id
  categoryForm.name = category.name
  categoryForm.description = category.description || ''
  categoryForm.icon = category.icon || ''
  categoryForm.status = category.status
  categoryForm.weight = category.weight
  dialogVisible.value = true
}

const handleDeleteCategory = async (category) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除场景「${category.name}」吗？删除后不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await deleteCategory(category.id)
    if (response.ok) {
      ElMessage.success('删除成功')
      await loadCategories()
    } else {
      ElMessage.error(response.data.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除场景失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = async () => {
  try {
    await categoryFormRef.value.validate()
    
    submitting.value = true
    
    const categoryData = {
      name: categoryForm.name,
      description: categoryForm.description,
      icon: categoryForm.icon,
      status: categoryForm.status,
      weight: categoryForm.weight
    }
    
    let response
    if (isEdit.value) {
      response = await updateCategory(categoryForm.id, categoryData)
    } else {
      response = await createCategory(categoryData)
    }
    
    dialogVisible.value = false
    await loadCategories()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  categoryForm.id = ''
  categoryForm.name = ''
  categoryForm.description = ''
  categoryForm.icon = ''
  categoryForm.status = 1
  categoryForm.weight = 0
  
  if (categoryFormRef.value) {
    categoryFormRef.value.clearValidate()
  }
}

// 生命周期
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.category-management-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header h1 {
  color: #303133;
}

.page-header p {
  margin-top: 4px;
}

@media (max-width: 768px) {
  .category-management-page {
    padding: 1rem;
  }
  
  .page-header h1 {
    font-size: 1.25rem;
  }
}
</style>