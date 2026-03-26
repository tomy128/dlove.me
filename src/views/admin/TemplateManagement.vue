<template>
  <div class="template-management-page p-4 md:p-6">
    <div class="page-header mb-6">
      <h1 class="text-xl md:text-2xl font-bold">模板管理</h1>
      <p class="text-gray-500 text-sm md:text-base">管理网站的模板资源</p>
    </div>

    <!-- 操作栏 -->
    <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
      <div class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <el-input
          v-model="searchQuery"
          placeholder="搜索模板"
          clearable
          @input="handleSearch"
          class="w-full sm:w-64"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="selectedCategory"
          placeholder="选择场景"
          clearable
          @change="handleCategoryChange"
          class="w-full sm:w-40"
        >
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
      </div>

      <el-button type="primary" @click="handleAddTemplate" class="w-full lg:w-auto">
        <el-icon class="mr-1"><Plus /></el-icon> 添加模板
      </el-button>
    </div>

    <!-- 模板列表 -->
    <el-card shadow="never" class="mb-6">
      <div v-if="loading" class="py-12 flex justify-center">
        <el-skeleton :rows="5" animated />
      </div>

      <div v-else-if="templates.length === 0" class="py-12 text-center">
        <el-icon class="text-5xl text-gray-300 mb-4"><Document /></el-icon>
        <p class="text-gray-500 text-lg">暂无模板数据</p>
        <el-button type="primary" class="mt-4" @click="handleAddTemplate">添加模板</el-button>
      </div>

      <div v-else class="overflow-x-auto">
        <el-table
          :data="paginatedTemplates"
          style="width: 100%; min-width: 900px"
          border
          :size="isMobile ? 'small' : 'default'"
        >
          <el-table-column label="ID" prop="id" width="80" :show-overflow-tooltip="true" />
          <el-table-column label="封面" :width="isMobile ? '100' : '120'">
            <template #default="{ row }">
              <el-image
                :src="row.cover_url || 'https://via.placeholder.com/100x60'"
                :preview-src-list="[row.cover_url]"
                fit="cover"
                :class="isMobile ? 'w-16 h-10 rounded' : 'w-20 h-12 rounded'"
              />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="name" min-width="120" :show-overflow-tooltip="true" />
          <el-table-column label="场景" min-width="120">
            <template #default="{ row }">
              <div class="flex flex-wrap gap-1">
                <el-tag 
                  v-for="c in (row.categories || [])" 
                  :key="c.id || c.name" 
                  :size="isMobile ? 'small' : 'small'" 
                  type="info"
                  class="mb-1"
                >
                  {{ c.name || c.title || c.id }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="价格" :width="isMobile ? '80' : '100'">
            <template #default="{ row }">
              <span class="text-primary-600 font-bold text-xs sm:text-sm">{{ formatDCoin(row.price) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" :width="isMobile ? '120' : '180'">
            <template #default="{ row }">
              <span class="text-xs sm:text-sm">{{ formatDate(row.created_at) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" :width="isMobile ? '80' : '100'">
            <template #default="{ row }">
              <el-tag
                :type="row.status === 1 ? 'success' : 'info'"
                :size="isMobile ? 'small' : 'small'"
              >
                {{ row.status === 1 ? '已上架' : '已下架' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" :width="isMobile ? '180' : '200'" fixed="right">
            <template #default="{ row }">
              <div class="flex flex-col lg:flex-row space-y-1 lg:space-y-0 lg:space-x-1 ">
                <el-button
                  :size="isMobile ? 'small' : 'small'"
                  type="primary"
                  plain
                  @click="handleEditTemplate(row)"
                  class="w-full lg:w-auto"
                >
                  编辑
                </el-button>
                <el-button
                  :size="isMobile ? 'small' : 'small'"
                  :type="row.status === 1 ? 'warning' : 'success'"
                  plain
                  @click="handleChangeStatus(row)"
                  class="w-full lg:w-auto"
                >
                  {{ row.status === 1 ? '下架' : '上架' }}
                </el-button>
                <el-button
                  :size="isMobile ? 'small' : 'small'"
                  type="danger"
                  plain
                  @click="handleDeleteTemplate(row)"
                  class="w-full lg:w-auto"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="flex justify-center lg:justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="filteredTemplates.length"
          :layout="isMobile ? 'prev, pager, next' : 'total, prev, pager, next'"
          :small="isMobile"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑模板对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑模板' : '添加模板'"
      :width="isMobile ? '95%' : '700px'"
      :fullscreen="isMobile"
      destroy-on-close
    >
      <div class="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div class="flex items-start">
            <el-icon class="text-blue-500 mt-1 mr-2"><Document /></el-icon>
            <div class="flex-1">
                <h3 class="text-sm font-bold text-blue-800 mb-1">{{ isEdit ? '更新模板文件' : '快捷导入模板包' }}</h3>
                <p class="text-xs text-blue-600 mb-3" v-if="!isEdit">上传 .zip 模板包，系统将自动解析 dlove.config.json 并填充表单信息。</p>
                <p class="text-xs text-blue-600 mb-3" v-else>重新上传 .zip 模板包可更新模板文件，若包内包含 dlove.config.json 将同时更新模板信息。</p>
                <el-upload
                    action="#"
                    :auto-upload="true"
                    :show-file-list="false"
                    :before-upload="beforeFileUpload"
                    accept=".zip"
                    :http-request="uploadTemplateFile"
                    drag
                    class="w-full"
                >
                    <div v-if="templateForm.file_path" class="w-full">
                        <div class="p-3 bg-green-50 border border-green-200 rounded mb-2 w-full">
                            <div class="flex items-center mb-2">
                                <el-icon class="text-green-500 mr-2 text-xl"><Check /></el-icon>
                                <span class="text-green-700 font-medium">模板文件已就绪</span>
                            </div>
                            <div class="flex items-center bg-white p-2 rounded border border-green-100">
                                <el-icon class="text-blue-500 mr-2"><Document /></el-icon>
                                <span class="text-sm text-gray-700 truncate flex-1 text-left">{{ templateForm.file_filename || templateForm.file_path }}</span>
                            </div>
                        </div>
                        <div class="text-xs text-gray-400 mt-1">点击或拖拽可替换文件</div>
                    </div>
                    <div v-else class="flex flex-col items-center py-4">
                        <el-icon class="text-3xl text-gray-400 mb-2"><Upload /></el-icon>
                        <div class="text-gray-500 text-center">
                            <span class="text-sm font-medium">拖拽或点击上传模板包 (ZIP)</span>
                            <div class="text-xs mt-1">支持 ZIP 格式，包含所有必要的HTML、CSS、JS等资源文件</div>
                        </div>
                    </div>
                    <template #tip>
                        <div class="text-xs text-gray-500 mt-2">
                            注意：ZIP压缩包内必须包含index.html入口文件。
                        </div>
                    </template>
                </el-upload>
            </div>
        </div>
      </div>

      <el-form
        ref="formRef"
        :model="templateForm"
        :rules="templateRules"
        label-position="top"
        :size="isMobile ? 'small' : 'default'"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <!-- 模板名称 -->
          <el-form-item label="模板名称" prop="name">
            <el-input v-model="templateForm.name" placeholder="请输入模板名称" />
          </el-form-item>

          <!-- 场景 -->
          <el-form-item label="场景" prop="category_ids">
            <el-select
              v-model="templateForm.category_ids"
              placeholder="请选择场景（可多选）"
              multiple
              collapse-tags
              collapse-tags-tooltip
              class="w-full"
            >
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>

          <!-- 价格 -->
          <el-form-item label="价格" prop="price">
            <el-input-number
              v-model="templateForm.price"
              :precision="2"
              :step="0.1"
              :min="0"
              class="w-full"
            />
          </el-form-item>

          <!-- 状态 -->
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="templateForm.status"
              placeholder="请选择状态"
              class="w-full"
            >
              <el-option label="上架" :value="1" />
              <el-option label="下架" :value="0" />
            </el-select>
          </el-form-item>

          <!-- 心意密度 (Difficulty) -->
          <el-form-item label="心意密度" prop="difficulty">
            <el-radio-group v-model="templateForm.difficulty">
              <el-radio label="easy">轻量 (Easy)</el-radio>
              <el-radio label="medium">适中 (Medium)</el-radio>
              <el-radio label="hard">隆重 (Hard)</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 氛围 (Tags) -->
          <el-form-item label="氛围" prop="tags" class="lg:col-span-2">
            <div class="flex flex-wrap gap-2">
              <el-tag
                v-for="tag in templateForm.tags"
                :key="tag"
                closable
                @close="handleRemoveTag(tag)"
                :size="isMobile ? 'small' : 'default'"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="tagInputVisible"
                ref="tagInputRef"
                v-model="tagInputValue"
                class="w-20"
                :size="isMobile ? 'small' : 'small'"
                @keyup.enter="handleAddTag"
                @blur="handleAddTag"
              />
              <el-button v-else :size="isMobile ? 'small' : 'small'" @click="showTagInput">
                + 添加氛围
              </el-button>
            </div>
          </el-form-item>

          <!-- 封面 -->
          <el-form-item label="封面" prop="cover_path" class="lg:col-span-2">
            <el-upload
              class="upload-demo"
              :http-request="uploadTemplateCover"
              :before-upload="beforeCoverUpload"
              :show-file-list="false"
              :limit="1"
              :on-exceed="handleExceed"
              drag
            >
              <div v-if="templateForm.cover_path" class="mb-4">
                <!-- 显示图片预览 -->
                <div class="flex flex-col items-center p-2 bg-green-50 border border-green-200 rounded mb-2">
                  <img 
                    :src="templateForm.cover_path" 
                    class="max-h-40 object-contain mb-2 rounded shadow-sm" 
                    alt="封面预览"
                  />
                  <div class="flex items-center">
                    <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                    <span class="text-sm text-green-700">已上传: {{ templateForm.cover_filename }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="flex flex-col items-center">
                <el-icon :class="isMobile ? 'text-2xl text-gray-400 mb-2' : 'text-3xl text-gray-400 mb-2'"><Upload /></el-icon>
                <div class="text-gray-500">
                  <span class="text-sm lg:text-base">拖拽或点击上传封面图片</span>
                  <div class="text-xs mt-1">支持 JPG、PNG 格式，建议尺寸 800x450px</div>
                </div>
              </div>
            </el-upload>
          </el-form-item>

          <!-- 描述 -->
          <el-form-item label="描述" prop="description" class="lg:col-span-2">
            <el-input
              v-model="templateForm.description"
              type="textarea"
              :rows="isMobile ? 3 : 4"
              placeholder="请输入模板描述"
            />
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <div :class="isMobile ? 'flex flex-col gap-3' : 'flex gap-3 justify-end'">
          <el-button 
            @click="dialogVisible = false"
            :size="isMobile ? 'default' : 'default'"
            :class="isMobile ? 'w-full' : ''"
          >
            取消
          </el-button>
          <el-button 
            type="primary" 
            @click="handleSubmitTemplate" 
            :loading="submitLoading"
            :size="isMobile ? 'default' : 'default'"
            :class="isMobile ? 'w-full' : ''"
          >
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useTemplateStore } from '@/store/template';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Plus, Document, Upload, Check, Loading } from '@element-plus/icons-vue';
import { uploadFileDirect } from '@/api/oss';
import { useUIStore } from '@/store/ui';
import { formatDCoin } from '@/config/currency'
import { formatDate } from '@/utils/date'


const templateStore = useTemplateStore();
const uiStore = useUIStore();

// 状态
const loading = ref(true);
const submitLoading = ref(false);
const templates = computed(() => templateStore.templates);
const categories = computed(() => templateStore.categories);
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref(null);

// 响应式设计
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

// 筛选和分页
const searchQuery = ref('');
const selectedCategory = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

// 氛围输入
const tagInputVisible = ref(false);
const tagInputValue = ref('');
const tagInputRef = ref(null);

// 表单数据
const templateForm = ref({
  id: '',
  name: '',
  description: '',
  category_ids: [],
  price: 19.9,
  status: 1,
  difficulty: 'medium',
  tags: [],
  cover_key: '',
  cover_path: '', // 临时存储完整路径用于预览
  cover_filename: '',
  file_key: '',
  file_path: '', // 临时存储完整路径用于预览
  file_filename: ''
});

// 表单验证规则
const templateRules = {
  name: [
    { required: true, message: '请输入模板名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  category_ids: [
    { required: true, message: '请选择场景', trigger: 'change' },
    { type: 'array', min: 1, message: '至少选择一个场景', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入模板描述', trigger: 'blur' },
    { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
  ],
  cover_key: [
    { required: true, message: '请上传封面图片', trigger: 'change' }
  ]
};


// 初始化数据
onMounted(async () => {
  try {
    await Promise.all([
      templateStore.fetchAdminTemplates(),
      templateStore.fetchAdminCategories()
    ]);
  } catch (error) {
    ElMessage.error('获取数据失败，请稍后再试');
  } finally {
    loading.value = false;
  }
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

// 组件卸载时清理事件监听器
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

// 根据筛选条件过滤模板
const filteredTemplates = computed(() => {
  let result = templates.value;
  
  if (searchQuery.value) {
    result = result.filter(item => 
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  if (selectedCategory.value) {
    result = result.filter(item => {
      const cats = item.categories || [];
      return cats.some(c => c.id === selectedCategory.value);
    });
  }
  
  return result;
});

// 分页数据
const paginatedTemplates = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredTemplates.value.slice(start, end);
});

// 获取场景名称
const getCategoryName = (categoryId) => {
  const category = categories.value.find(item => item.id === categoryId);
  return category ? category.name : '未归类';
};

// 获取场景ID列表
const getCategoryIds = (categoryIds) => {
  if (!categoryIds) return [];
  
  // 如果是字符串，则转换为数组
  return typeof categoryIds === 'string' 
    ? categoryIds.split(',').filter(id => id) 
    : categoryIds;
};

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1;
};

// 处理场景变化
const handleCategoryChange = () => {
  currentPage.value = 1;
};

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page;
};

// 添加模板
const handleAddTemplate = () => {
  isEdit.value = false;
  templateForm.value = {
    id: '',
    name: '',
    description: '',
    category_ids: [],
    price: 19.9,
    status: 1,
    difficulty: 'medium',
    tags: [],
    cover_key: '',
    file_key: '',
    cover_path: '', // 临时存储完整路径用于预览
    file_path: '', // 临时存储完整路径用于预览
    cover_filename: '',
    file_filename: ''
  };
  dialogVisible.value = true;
};

// 编辑模板
const handleEditTemplate = (row) => {
  isEdit.value = true;
  
  // 从URL中提取路径Key
  const extractKeyFromUrl = (url) => {
    if (!url) return '';
    // 假设后端返回的是完整URL，我们需要提取相对路径作为Key
    // 这里简化处理，实际可能需要根据具体URL格式调整
    const parts = url.split('/');
    // 返回static开始的相对路径
    const staticIndex = parts.indexOf('static');
    if (staticIndex >= 0) {
      return '/' + parts.slice(staticIndex).join('/');
    }
    return '';
  };
  
  // 提取封面和文件路径Key
  const coverKey = row.cover_key || extractKeyFromUrl(row.cover_url);
  const fileKey = row.file_key || extractKeyFromUrl(row.file_url);
  
  // 提取难度和普通氛围
  const difficultyTag = (row.tags || []).find(t => t.startsWith('difficulty:'));
  const difficulty = difficultyTag ? difficultyTag.split(':')[1] : 'medium';
  const displayTags = (row.tags || []).filter(t => !t.startsWith('difficulty:'));

  templateForm.value = {
    id: row.id,
    name: row.name,
    description: row.description,
    // 处理多场景，优先从 categories 提取 ID，兼容旧字段
    category_ids: (row.categories && Array.isArray(row.categories))
      ? row.categories.map(c => c.id).filter(Boolean)
      : (row.category_ids ? (typeof row.category_ids === 'string' ? row.category_ids.split(',').filter(id => id) : row.category_ids) : []),
    price: row.price / 100, // 后端存储的是分，前端显示需要转换为元
    status: row.status,
    difficulty: difficulty,
    tags: [...displayTags],
    // 存储路径Key而非完整URL
    cover_key: coverKey,
    file_key: fileKey,
    // 临时存储完整URL用于预览
    cover_path: row.cover_url,
    file_path: row.file_url,
    // 保存文件名用于显示
    cover_filename: coverKey.split('/').pop() || '',
    file_filename: fileKey.split('/').pop() || ''
    // 直传模式不需要临时目录键
  };
  dialogVisible.value = true;
};

// 上下架模板
const handleChangeStatus = async (row) => {
  try {
    const newStatus = row.status === 1 ? 0 : 1;
    await templateStore.updateTemplateStatus(row.id, newStatus);
    ElMessage.success(`模板已${newStatus === 1 ? '上架' : '下架'}`);
  } catch (error) {
    ElMessage.error('操作失败，请稍后再试');
  }
};

// 删除模板
const handleDeleteTemplate = (row) => {
  ElMessageBox.confirm(
    '此操作将永久删除该模板，是否继续？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await templateStore.deleteTemplate(row.id);
      ElMessage.success('删除成功');
    } catch (error) {
      ElMessage.error('删除失败，请稍后再试');
    }
  }).catch(() => {});
};

// 提交模板表单
const handleSubmitTemplate = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;
      
      try {
        // 提交前将价格从元转换为分
        const {cover_path, file_path, difficulty, ...submitData} = {
          ...templateForm.value,
          price: Math.round(templateForm.value.price * 100), // 前端输入的是元，后端存储需要转换为分
        };

        // 将难度合并到氛围中
        submitData.tags = [
          ...templateForm.value.tags,
          `difficulty:${templateForm.value.difficulty}`
        ];

        if (isEdit.value) {
          await templateStore.updateTemplate(submitData);
          ElMessage.success('模板更新成功');
        } else {
          await templateStore.createTemplate(submitData);
          ElMessage.success('模板添加成功');
        }
        
        dialogVisible.value = false;
      } catch (error) {
        ElMessage.error(error.message || '操作失败，请稍后再试');
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

// 氛围相关操作
const showTagInput = () => {
  tagInputVisible.value = true;
  nextTick(() => {
    tagInputRef.value.focus();
  });
};

const handleAddTag = () => {
  if (tagInputValue.value) {
    if (!templateForm.value.tags.includes(tagInputValue.value)) {
      templateForm.value.tags.push(tagInputValue.value);
    }
  }
  tagInputVisible.value = false;
  tagInputValue.value = '';
};

const handleRemoveTag = (tag) => {
  templateForm.value.tags = templateForm.value.tags.filter(item => item !== tag);
};

const beforeFileUpload = (file) => {
  const isZIP = file.type === 'application/zip' || 
               file.type === 'application/x-zip-compressed' ||
               file.name.endsWith('.zip');
  const isLt10M = file.size / 1024 / 1024 < 10;

  if (!isZIP) {
    ElMessage.error('模板文件只能是 ZIP 格式!');
    return false;
  }
  if (!isLt10M) {
    ElMessage.error('模板文件大小不能超过 10MB!');
    return false;
  }
  
  // 检查ZIP内容并解析
  return processZipPackage(file)
    .catch((error) => {
        // 返回 false 或 Promise.reject 会终止上传
        return Promise.reject(error);
    });
};

// 检查ZIP文件并解析配置
const processZipPackage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        await zip.loadAsync(e.target.result);

        const allNames = Object.keys(zip.files);
        // 忽略常见的压缩辅助目录/文件（macOS等）
        const names = allNames.filter(
          (n) => !n.startsWith('__MACOSX/') && !n.startsWith('.DS_Store')
        );

        // 1. 检查 index.html
        const hasRootIndex = !!zip.file('index.html');
        // 只匹配一级目录：<top>/index.html
        const hasTopDirIndex = names.some((n) => /^[^/]+\/index\.html$/.test(n));

        if (!hasRootIndex && !hasTopDirIndex) {
          const msg = 'ZIP 压缩包根目录（或单一顶级目录）必须包含 index.html 入口文件';
          ElMessage.error(msg);
          return reject(new Error(msg));
        }
        
        // 2. 解析 dlove.config.json
        let configContent = null;
        let zipPrefix = '';

        const rootConfig = zip.file('dlove.config.json');
        if (rootConfig) {
            configContent = await rootConfig.async('string');
        } else {
            // 查找一级子目录下的配置文件
            const topLevelConfig = names.find(n => /^[^/]+\/dlove\.config\.json$/.test(n));
            if (topLevelConfig) {
                configContent = await zip.file(topLevelConfig).async('string');
                zipPrefix = topLevelConfig.split('/')[0] + '/';
            }
        }

        if (configContent) {
            try {
                const config = JSON.parse(configContent);
                const meta = config.meta || {};
                
                // 自动填充表单
                if (meta.name) templateForm.value.name = meta.name;
                else if (meta.title) templateForm.value.name = meta.title;

                if (meta.description) templateForm.value.description = meta.description;
                
                // 自动上传封面
                if (meta.cover) {
                    const coverPath = zipPrefix + meta.cover;
                    const coverFile = zip.file(coverPath);
                    if (coverFile) {
                        try {
                            const blob = await coverFile.async('blob');
                            const ext = meta.cover.split('.').pop().toLowerCase();
                            const type = (ext === 'jpg' || ext === 'jpeg') ? 'image/jpeg' : 'image/png';
                            const fileObj = new File([blob], meta.cover, { type });
                            
                            // 校验封面大小/格式 (复用 beforeCoverUpload)
                            if (beforeCoverUpload(fileObj)) {
                                await uploadTemplateCover({ file: fileObj });
                            }
                        } catch (coverErr) {
                            console.warn('Cover auto-upload failed', coverErr);
                        }
                    }
                }
                
                ElMessage.success('解析成功，已自动填充表单');
            } catch (e) {
                console.warn('dlove.config.json parse error', e);
                ElMessage.warning('dlove.config.json 解析失败，请手动填写信息');
            }
        } else {
            ElMessage.warning('未找到 dlove.config.json，请手动填写信息');
        }

        resolve(true);
      } catch (error) {
        ElMessage.error('无法解析 ZIP 文件，请确保文件格式正确');
        reject(error);
      }
    };
    reader.onerror = (error) => {
      ElMessage.error('读取文件失败');
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};


const handleFileSuccess = (fileKey, file) => {
  // 存储OSS Key
  templateForm.value.file_key = fileKey;
  // 文件路径用于展示名称即可
  templateForm.value.file_path = file.name;
  templateForm.value.file_filename = file.name;
};

const uploadTemplateFile = async ({ file }) => {

  uiStore.showLoading('模板上传中…');
  try {
    const { fileKey } = await uploadFileDirect(file)
    // 本地状态更新
    handleFileSuccess(fileKey, file);
    return { ok: true, body: { fileKey } };
  } catch (error) {
    ElMessage.error('模板上传失败');
    throw error;
  } finally {
    uiStore.hideLoading();
  }
};

// 上传相关操作
const beforeCoverUpload = (file) => {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isJPG && !isPNG) {
    ElMessage.error('封面只能是 JPG 或 PNG 格式!');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('封面大小不能超过 5MB!');
    return false;
  }
  return true;
};

const handleCoverSuccess = (fileKey, file) => {
  // 存储OSS Key
  templateForm.value.cover_key = fileKey;
  // 使用本地预览，后端保存后会返回真实URL
  templateForm.value.cover_path = URL.createObjectURL(file);
  // 保留文件名用于显示
  templateForm.value.cover_filename = file.name;
  ElMessage.success('封面上传成功');
};


// 上传封面图片
const uploadTemplateCover = async ({ file }) => {
  try {
    const { fileKey } = await uploadFileDirect(file)
    // 本地状态更新
    handleCoverSuccess(fileKey, file);
    return { ok: true, body: { fileKey } };
  } catch (error) {
    ElMessage.error('文件上传失败');
    throw error;
  }
};

</script>

<style scoped>
/* 自定义样式 */
:deep(.el-table .cell) {
  white-space: nowrap;
}

:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
