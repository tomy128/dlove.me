<template>
  <div class="template-list-page min-h-screen pb-12">
    <!-- 页面头部 - 现代化轻盈设计 -->
    <div class="hero-section relative overflow-hidden bg-gradient-to-b from-rose-50 to-white pt-20 pb-32">
      <!-- 动态背景 -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      <!-- 内容区 -->
      <div class="container-custom relative z-10 text-center">
        <span class="inline-block py-1 px-3 rounded-full bg-rose-100 text-rose-600 text-sm font-medium mb-6 animate-fade-in-up">
          ✨ 发现爱的灵感
        </span>
        <h1 class="text-4xl md:text-6xl font-display font-bold mb-6 text-gray-900 animate-fade-in">
          <span class="relative inline-block">
             这里贩卖<span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600 relative inline-block mx-2 pb-1">浪漫与灵感</span>
          </span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed mb-10 animate-fade-in-up delay-100">
          挑选一个故事脚本，开始导演你们的专属回忆
        </p>
      </div>
    </div>

    <!-- 筛选和搜索区域 -->
    <div class="container-custom relative z-20 -mt-20 mb-16">
      <div class="bg-white/80 backdrop-blur-md shadow-xl shadow-rose-100/50 rounded-3xl p-6 sm:p-10 border border-white/50">
        <!-- 搜索栏 -->
        <div class="max-w-2xl mx-auto mb-10">
          <div class="relative group">
            <div class="absolute inset-0 bg-gradient-to-r from-rose-200 to-purple-200 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div class="relative flex items-center bg-white rounded-full border border-rose-100 shadow-sm overflow-hidden">
               <div class="pl-6 text-gray-400">
                  <el-icon class="text-xl"><Search /></el-icon>
               </div>
               <input 
                  v-model="searchQuery"
                  @input="handleSearch"
                  type="text" 
                  placeholder="搜索你的情感灵感..." 
                  class="w-full py-4 px-4 text-gray-700 bg-transparent focus:outline-none placeholder-gray-400"
               />
               <div v-if="searchQuery" class="pr-4">
                  <button @click="searchQuery = ''; handleSearch()" class="p-1 rounded-full hover:bg-gray-100 text-gray-400">
                    <el-icon><Close /></el-icon>
                  </button>
               </div>
            </div>
          </div>
        </div>
        
        <!-- 分类筛选 -->
        <div class="flex flex-col items-center">
          <div class="flex flex-wrap justify-center gap-3">
            <button
              class="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
              :class="selectedCategory === '' ? 'bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-lg shadow-rose-500/30' : 'bg-white text-gray-600 hover:bg-rose-50 hover:text-rose-600 border border-gray-200'"
              @click="selectedCategory = ''; handleCategoryChange()"
            >
              全部
            </button>
            <button
              v-for="category in categories" 
              :key="category.id"
              class="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
              :class="selectedCategory === category.id ? 'bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-lg shadow-rose-500/30' : 'bg-white text-gray-600 hover:bg-rose-50 hover:text-rose-600 border border-gray-200'"
              @click="selectedCategory = category.id; handleCategoryChange()"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 模板列表 - 现代化设计 -->
    <div class="container-custom">
      <!-- 加载状态 - 现代化骨架屏 -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full">
          <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse-subtle">
            <div class="h-52 bg-gray-200"></div>
            <div class="p-6">
              <div class="h-6 bg-gray-200 rounded-md mb-4"></div>
              <div class="h-4 bg-gray-200 rounded-md w-3/4 mb-3"></div>
              <div class="h-4 bg-gray-200 rounded-md w-2/3 mb-5"></div>
              <div class="flex justify-between items-center">
                <div class="h-4 bg-gray-200 rounded-full w-1/3"></div>
                <div class="h-10 bg-gray-200 rounded-lg w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 - 视觉优化 -->
      <div v-else-if="templates.length === 0" class="text-center py-20 px-4">
        <div class="max-w-md mx-auto">
          <div class="mb-8 text-primary-300 relative">
            <div class="absolute -z-10 inset-0 bg-primary-50 rounded-full blur-3xl opacity-30 transform scale-150"></div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-28 w-28 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 class="text-2xl md:text-3xl font-display font-bold mb-4 text-gray-800">暂时没有找到相关模板</h3>
          <p class="text-gray-600 mb-8 leading-relaxed max-w-sm mx-auto">我们正在不断丰富模板库，或许你可以尝试其他的筛选条件，寻找适合你的情感表达方式。</p>
          <button 
            @click="clearFilters"
            class="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            查看全部模板
          </button>
        </div>
      </div>

      <!-- 模板卡片网格 -->
      <div v-else class="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8 pb-12">
        <div
          v-for="(template, index) in paginatedTemplates"
          :key="`template-${template.id}-${index}`"
          class="template-card group relative rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-500 break-inside-avoid border border-gray-100 flex flex-col"
          :style="{'animation-delay': `${index * 0.1}s`}"
        >
          <!-- 模板封面图区域 -->
          <div 
            class="relative overflow-hidden bg-gray-100 cursor-pointer group/image aspect-[4/3]"
            @click="handlePreview(template)"
          >
            <!-- 图片 -->
            <el-image
              :src="template.cover_url"
              :alt="template.name"
              class="w-full h-full transition-transform duration-700 group-hover/image:scale-110 block"
              fit="cover"
              loading="lazy"
            >
              <template #placeholder>
                <div class="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                  <el-icon class="is-loading text-2xl"><Loading /></el-icon>
                </div>
              </template>
              <template #error>
                <div class="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                  <el-icon class="text-3xl"><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            
            <!-- 悬浮遮罩 - 预览提示 -->
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
               <button class="px-6 py-2.5 bg-white/90 hover:bg-white text-gray-900 rounded-full font-medium shadow-lg transform scale-95 group-hover/image:scale-100 transition-all duration-300 flex items-center gap-2">
                  <el-icon><View /></el-icon> 快速预览
               </button>
            </div>
          </div>

          <!-- 模板内容区域 -->
          <div class="p-6 flex flex-col flex-grow">
             <!-- 顶部标签与分类 -->
             <div class="flex items-center justify-between mb-3">
                <span 
                  v-if="template.categories && template.categories.length > 0"
                  class="px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold tracking-wide"
                >
                  {{ template.categories[0].name }}
                </span>
                <div class="flex gap-2">
                   <span v-for="tag in getDisplayTags(template.tags).slice(0, 1)" :key="tag" class="text-xs text-gray-400 font-medium">#{{ tag }}</span>
                </div>
             </div>

            <!-- 标题 -->
            <h3 
              class="text-xl font-display font-bold text-gray-900 mb-3 hover:text-rose-600 transition-colors cursor-pointer leading-tight"
              @click="goToTemplate(template.id)"
            >
               {{ template.name }}
            </h3>
            
            <!-- 情感描述 -->
            <p class="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 h-10 font-serif italic">
               "{{ template.description || '所爱隔山海，山海皆可平' }}"
            </p>
            
            <!-- 底部：行动 -->
            <div class="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
               <!-- 左侧装饰/辅助信息 -->
               <div class="flex items-center text-xs text-gray-400 gap-1">
                 <el-icon><Star /></el-icon> <span>甄选模板</span>
               </div>
               
               <!-- 查看详情 -->
               <button
                @click="goToTemplate(template.id)"
                class="group/btn flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors"
              >
                查看详情
                <span class="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center group-hover/btn:bg-rose-100 transition-colors">
                  <el-icon class="text-xs transform group-hover/btn:translate-x-0.5 transition-transform"><ArrowRight /></el-icon>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="flex justify-center my-12" v-if="templates.length > 0">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="filteredTemplates.length"
          layout="prev, pager, next"
          @current-change="handlePageChange"
          class="pagination-custom"
          background
        />
      </div>


    </div>
    
      <!-- 快速预览弹窗 -->
      <el-dialog
        v-model="previewVisible"
        :title="currentPreviewTemplate?.name"
        width="90%"
        top="5vh"
        align-center
        append-to-body
        destroy-on-close
        class="template-list-preview-dialog rounded-2xl overflow-hidden"
        :show-close="true"
      >
        <div v-if="currentPreviewTemplate" class="preview-content h-[80vh] -mx-6 -my-4 flex flex-col">
          <div class="flex-grow relative bg-gray-100">
             <iframe 
               v-if="previewUrl"
               :src="previewUrl" 
               class="w-full h-full border-0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowfullscreen
             ></iframe>
             <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <el-icon v-if="previewLoading" class="is-loading text-4xl mb-2"><Loading /></el-icon>
                <el-icon v-else class="text-4xl mb-2"><VideoPlay /></el-icon>
                <p>{{ previewLoading ? '加载预览中...' : '暂无预览链接' }}</p>
             </div>
          </div>
          
          <div class="p-4 bg-white border-t border-gray-100 flex items-center justify-between shrink-0">
             <div class="flex items-center gap-4">
                <h3 class="text-lg font-bold text-gray-800">{{ currentPreviewTemplate.name }}</h3>
                <span v-if="currentPreviewTemplate.categories && currentPreviewTemplate.categories.length > 0" class="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold">
                  {{ currentPreviewTemplate.categories[0].name }}
                </span>
             </div>
             
             <button 
               @click="goToEditThisOne(currentPreviewTemplate.id)"
               class="px-6 py-2 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/30 transition-all hover:-translate-y-0.5 font-medium flex items-center"
             >
               使用此模板 <el-icon class="ml-2"><ArrowRight /></el-icon>
             </button>
          </div>
        </div>
      </el-dialog>

    <!-- 回到顶部按钮 -->
    <transition name="fade">
      <button 
        v-show="showScrollTop" 
        @click="scrollToTop"
        class="fixed right-6 bottom-6 z-50 p-3 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-110"
        aria-label="回到顶部"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
import { useTemplateStore } from '@/store/template';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Search, VideoPlay, View, Star, ArrowRight, Close, Loading, Picture } from '@element-plus/icons-vue';

const templateStore = useTemplateStore();
const router = useRouter();

// 状态
const loading = computed(() => templateStore.loading);
const templates = computed(() => templateStore.templates);
const categories = computed(() => templateStore.categories);
const filteredTemplates = computed(() => templateStore.filteredTemplates);
const paginatedTemplates = computed(() => templateStore.paginatedTemplates);

// 筛选和分页
const selectedCategory = ref('');
const searchQuery = ref('');
const sortBy = ref('newest');
const currentPage = ref(1);
const pageSize = ref(12);
const isSearchFocused = ref(false);
const showScrollTop = ref(false);

// 预览相关
const previewVisible = ref(false);
const currentPreviewTemplate = ref(null);
const previewUrl = ref('');
const previewLoading = ref(false);

// 初始化数据
onMounted(async () => {
  try {
    await Promise.all([
      templateStore.fetchTemplates(),
      templateStore.fetchCategories()
    ]);
    
    // 初始化滚动监听
    initScrollListener();
    
    // 检查URL参数
    checkUrlParams();
  } catch (error) {
    ElMessage.error('获取模板数据失败，请稍后再试');
  }
});

// 页面销毁前清理弹窗状态，防止样式残留
onBeforeUnmount(() => {
  previewVisible.value = false;
});

// 监听筛选条件变化，重置页码并重新获取模板数据
watch([selectedCategory, searchQuery, sortBy], () => {
  currentPage.value = 1;
  
  // 先设置筛选条件
  templateStore.setFilter({
    category_id: selectedCategory.value,
    search: searchQuery.value,
    sort: sortBy.value
  });
  
  // 然后重新获取模板数据，筛选条件会在fetchTemplates中传递给后端API
  templateStore.fetchTemplates().catch(error => {
    ElMessage.error('获取模板数据失败，请稍后再试');
  });
});

// 获取分类名称
const getCategoryName = (categoryId) => {
  const category = categories.value.find(item => item.id === categoryId);
  return category ? category.name : '未分类';
};

// 获取分类ID列表
const getCategoryIds = (template) => {
  if (!template.category_ids) return [];
  
  // 如果category_ids是字符串，则转换为数组
  return typeof template.category_ids === 'string' 
    ? template.category_ids.split(',').filter(id => id) 
    : template.category_ids;
};

// 导航与交互
const goToTemplate = (id) => {
  router.push(`/templates/${id}`);
};

const goToEditThisOne = (id) => {
  router.push(`/templates/${id}/edit`);
};

const handlePreview = async (template) => {
  currentPreviewTemplate.value = template;
  previewUrl.value = '';
  previewVisible.value = true;
  previewLoading.value = true;

  try {
    await templateStore.fetchTemplateById(template.id, true);
    if (templateStore.currentTemplate && templateStore.currentTemplate.preview_url) {
      previewUrl.value = templateStore.currentTemplate.preview_url;
    }
  } catch (error) {
    console.error('获取预览链接失败:', error);
    ElMessage.error('获取预览链接失败，请稍后再试');
  } finally {
    previewLoading.value = false;
  }
};

// 处理筛选和排序
const handleCategoryChange = () => {
  // 不需要额外操作，watch会处理
};

const handleSearch = () => {
  // 不需要额外操作，watch会处理
};

const handleSortChange = () => {
  // 不需要额外操作，watch会处理
};

const handlePageChange = (page) => {
  currentPage.value = page;
  templateStore.setPage(page, pageSize.value);
  
  // 重新获取模板数据，分页信息会在fetchTemplates中传递给后端API
  templateStore.fetchTemplates().catch(error => {
    ElMessage.error('获取模板数据失败，请稍后再试');
  });
  
  // 滚动到模板列表顶部
  const templateList = document.querySelector('.grid');
  if (templateList) {
    templateList.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const clearFilters = () => {
  // 重置所有筛选条件
  selectedCategory.value = '';
  searchQuery.value = '';
  sortBy.value = 'newest';
  
  // 先调用 store 的清除筛选方法
  templateStore.clearFilters();
  
  // 确保重置页码
  currentPage.value = 1;
  
  // 然后重新获取模板数据，此时没有筛选条件
  templateStore.fetchTemplates().catch(error => {
    ElMessage.error('获取模板数据失败，请稍后再试');
  });
};

// 滚动相关功能
const initScrollListener = () => {
  window.addEventListener('scroll', handleScroll);
};

const handleScroll = () => {
  // 显示/隐藏回到顶部按钮
  showScrollTop.value = window.scrollY > 500;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// URL参数处理
const checkUrlParams = () => {
  // 检查URL参数，支持通过URL直接筛选
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category_id');
  const query = urlParams.get('q');
  
  if (category) {
    const foundCategory = categories.value.find(c => c.name.toLowerCase() === category.toLowerCase());
    if (foundCategory) {
      selectedCategory.value = foundCategory.id;
      handleCategoryChange();
    }
  }
  
  if (query) {
    searchQuery.value = query;
    handleSearch();
  }
};

// 标签辅助函数
const getDisplayTags = (tags) => {
  return (tags || []).filter(t => !t.startsWith('difficulty:'));
};

// 搜索框焦点状态
const toggleSearchFocus = (focused) => {
  isSearchFocused.value = focused;
};
</script>

<style scoped>
/* 基础样式 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 自定义分页样式 */
.pagination-custom :deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #f43f5e; /* rose-500 */
  color: white;
  font-weight: bold;
  border-color: #f43f5e;
}

.pagination-custom :deep(.el-pagination.is-background .el-pager li) {
  border-radius: 50%;
  margin: 0 4px;
  transition: all 0.3s;
  background-color: white;
  border: 1px solid #ffe4e6; /* rose-100 */
  color: #881337; /* rose-900 */
}

.pagination-custom :deep(.el-pagination.is-background .el-pager li:hover) {
  color: #f43f5e;
  border-color: #f43f5e;
}

.pagination-custom :deep(.el-pagination.is-background .btn-prev),
.pagination-custom :deep(.el-pagination.is-background .btn-next) {
  border-radius: 50%;
  background-color: white;
  border: 1px solid #ffe4e6;
  color: #881337;
  margin: 0 4px;
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease forwards;
}

.animate-fade-in-up {
  animation: fadeIn 0.6s ease 0.1s forwards;
}

/* Blob Animation */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* 预览弹窗样式 */
.template-list-preview-dialog.el-dialog {
  border-radius: 1rem;
  overflow: hidden;
}

.template-list-preview-dialog .el-dialog__header {
  margin-right: 0;
  padding: 1rem;
}

.template-list-preview-dialog .el-dialog__body {
  padding: 0;
}
</style>
