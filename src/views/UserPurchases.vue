<template>
  <div class="user-purchases-page bg-gray-50 min-h-screen py-12">
    <div class="container-custom max-w-6xl">
      <div class="flex items-center justify-between mb-10">
        <div>
          <h1 class="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-2">我的礼物盒</h1>
          <p class="text-gray-500 text-sm md:text-base">珍藏每一份心意，随时重温与分享</p>
        </div>
        <router-link to="/templates" class="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20 px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-300">
           <el-icon class="text-lg sm:text-xl"><Plus /></el-icon> <span class="hidden sm:inline">制作新礼物</span>
        </router-link>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="py-12 flex justify-center">
        <el-skeleton :rows="5" animated />
      </div>

      <!-- 无数据状态 -->
      <div v-else-if="purchases.length === 0" class="py-20 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
        <div class="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
           <el-icon class="text-5xl text-gray-300"><Present /></el-icon>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">你的礼物盒是空的</h3>
        <p class="text-gray-500 mb-8 max-w-sm mx-auto">就像一个等待被填满的宝箱，去挑选一个模板，开始记录你的专属回忆吧。</p>
        <router-link to="/templates" class="btn-primary inline-block px-8 py-3 rounded-full">
          前往灵感市集
        </router-link>
      </div>

      <!-- 购买列表 -->
      <template v-else>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="item in purchases"
            :key="item.id"
            class="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-500 group border border-gray-100"
          >
            <!-- 封面图 -->
            <div class="relative aspect-video overflow-hidden bg-gray-100">
              <img
                :src="getDisplayInfo(item).cover"
                :alt="getDisplayInfo(item).title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              <!-- 悬浮遮罩 -->
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                 <button 
                    class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-800 hover:text-primary-600 hover:scale-110 transition-all shadow-lg"
                    title="预览"
                    @click="handleViewWork(item)"
                 >
                    <el-icon class="text-xl"><View /></el-icon>
                 </button>
                 <button 
                    class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-800 hover:text-primary-600 hover:scale-110 transition-all shadow-lg"
                    title="分享"
                    @click="handleShare(item)"
                 >
                    <el-icon class="text-xl"><Share /></el-icon>
                 </button>
                 <button 
                    class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-800 hover:text-primary-600 hover:scale-110 transition-all shadow-lg"
                    title="再次编辑"
                    @click="handleEdit(item)"
                 >
                    <el-icon class="text-xl"><Edit /></el-icon>
                 </button>
                 <button 
                    class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-800 hover:text-green-600 hover:scale-110 transition-all shadow-lg"
                    title="下载源码"
                    @click="handleDownload(item)"
                 >
                    <el-icon class="text-xl"><Download /></el-icon>
                 </button>
                 <button 
                    class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-800 hover:text-red-600 hover:scale-110 transition-all shadow-lg"
                    title="删除"
                    @click="handleDelete(item)"
                 >
                    <el-icon class="text-xl"><Delete /></el-icon>
                 </button>
              </div>
              
              <!-- 状态标签 -->
              <div class="absolute top-4 right-4">
                 <span v-if="item.status === 1" class="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary-600 shadow-sm flex items-center gap-1">
                    <el-icon><CircleCheckFilled /></el-icon> 已拥有
                 </span>
                 <span v-else-if="item.status === 0" class="bg-gray-800/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1">
                    <el-icon><Timer /></el-icon> 待解锁
                 </span>
              </div>
            </div>

            <!-- 内容区 -->
            <div class="p-6">
              <div class="flex justify-between items-start mb-3">
                 <h3 class="text-lg font-bold text-gray-800 group-hover:text-primary-600 transition-colors">{{ getDisplayInfo(item).title }}</h3>
                 <span class="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">{{ formatDate(item.created_at || item.purchase_date) }}</span>
              </div>
              
              <p class="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                {{ getDisplayInfo(item).desc }}
              </p>

              <div class="flex items-center justify-between pt-4 border-t border-gray-50">
                <div class="flex -space-x-2">
                   <!-- 模拟头像堆叠 (谁看过了) -->
                   <div class="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
                   <div class="w-8 h-8 rounded-full border-2 border-white bg-gray-300"></div>
                   <div class="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500">+3</div>
                </div>
                
                <!-- 只有已支付的才显示下载 -->
                <button 
                   v-if="item.status === 1"
                   class="text-sm font-medium text-gray-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
                   @click="handleDownload(item)"
                >
                   <el-icon><Download /></el-icon> 下载源码
                </button>
                <button 
                   v-else
                   class="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                   @click="handlePublish(item)"
                >
                   去解锁 <el-icon><ArrowRight /></el-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
      <div class="flex justify-center mt-12" v-if="total > pageSize">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          class="pagination-custom"
          @current-change="handlePageChange"
        />
      </div>
    </template>
  </div>

  <!-- 分享弹窗 -->
  <el-dialog
    v-model="shareDialogVisible"
    title="分享你的作品"
    width="500px"
    class="share-dialog"
    destroy-on-close
    center
  >
    <div v-if="selectedItem" class="space-y-6 py-4">
      <!-- 预览卡片 -->
      <div class="bg-gray-50 p-4 rounded-2xl flex items-center gap-4 border border-gray-100">
        <img :src="getDisplayInfo(selectedItem).cover" class="w-20 h-14 object-cover rounded-lg shadow-sm" />
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-gray-800 truncate">{{ getDisplayInfo(selectedItem).title }}</h4>
          <p class="text-xs text-gray-400 mt-1">作品 ID: {{ selectedItem.id.slice(0, 8) }}...</p>
        </div>
      </div>

      <!-- 分享链接设置 -->
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-700 mb-2 block">自定义分享路径 (Unique Key)</label>
          <el-input
            v-model="shareSlug"
            placeholder="例如: my-love-story"
            class="share-slug-input"
            maxlength="50"
          >
            <template #prepend>
              {{ userStore.userInfo?.custom_domain ? `${userStore.userInfo.custom_domain}.${VITE_DEFAULT_SHARE_DOMAIN}/` : `${VITE_DEFAULT_SHARE_DOMAIN}/u/` }}
            </template>
          </el-input>
          <p class="text-[11px] text-gray-400 mt-2">
            {{ userStore.userInfo?.custom_domain 
              ? '检测到您已设置个性域名，将优先使用个性域名分享。' 
              : '设置个性域名后，分享链接将更加独特（可在个人资料中设置）。' 
            }}
          </p>
        </div>

        <div class="pt-4 flex gap-3">
          <el-button @click="shareDialogVisible = false" class="flex-1 !rounded-xl">取消</el-button>
          <el-button type="primary" :loading="sharing" @click="confirmShare" class="flex-1 !rounded-xl shadow-lg shadow-primary-500/20">
            生成分享链接
          </el-button>
        </div>
      </div>

      <!-- 生成后的链接展示 -->
      <div v-if="generatedUrl" class="mt-6 p-4 bg-rose-50 rounded-2xl border border-rose-100 animate-fade-in">
        <label class="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2 block">已生成专属链接</label>
        <div class="flex items-center gap-2">
          <el-input :value="generatedUrl" readonly class="copy-input" />
          <el-button type="primary" link @click="copyLink" class="font-bold">复制</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/store/order';
import { useTemplateStore } from '@/store/template';
import { useUserStore } from '@/store/user';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Download, View, Present, Plus, Share, Edit, CircleCheckFilled, Timer, ArrowRight, Delete } from '@element-plus/icons-vue';
import { formatDate } from '@/utils/date';
import { copyToClipboard } from '@/utils/device';
import { downloadWork } from '@/api/work';



// 获取展示信息 (优先使用编辑后的信息)
const getDisplayInfo = (item) => {
  const template = item.template || {};
  const config = item.config_data || {};
  const baseInfo = config.baseInfo || {};
  
  return {
    title: baseInfo.title || config.title || template.name || '未命名作品',
    cover: baseInfo.cover || config.cover || template.cover_url || 'https://via.placeholder.com/400x250',
    desc: baseInfo.desc || baseInfo.description || config.description || template.description || '暂无描述'
  };
};

const router = useRouter();
const orderStore = useOrderStore();
const templateStore = useTemplateStore();
const userStore = useUserStore();
const VITE_DEFAULT_SHARE_DOMAIN = import.meta.env.VITE_DEFAULT_SHARE_DOMAIN;

// 状态
const loading = ref(true);
const purchases = ref([]);
const activeTab = ref('all');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 获取购买记录
const loadPurchases = async () => {
  loading.value = true;
  try {
    const result = await orderStore.fetchUserPurchases({
      page: currentPage.value - 1, // Element Plus 从1开始，后端从0开始
      page_size: pageSize.value
    });
    const items = result.items;
    const totalCount = result.total || items.length;
    
    purchases.value = items;
    total.value = totalCount;
  } catch (error) {
    console.error(error);
    ElMessage.error('获取购买记录失败');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadPurchases();
});

// 监听标签变化，重置页码
watch(activeTab, () => {
  currentPage.value = 1;
});

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page;
  loadPurchases();
};

// 下载源码
const handleDownload = async (item) => {
  if (!userStore.isPremium) {
    ElMessageBox.confirm('源码下载是会员专属权益，是否去升级？', '提示', {
      confirmButtonText: '去升级',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      router.push('/pricing')
    }).catch(() => {})
    return
  }

  try {
    const response = await downloadWork(item.id)

    // 创建 Blob 对象并处理下载
    const blob = new Blob([response.data], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `work-${item.id}.html`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url);
    
    ElMessage.success('开始下载')
  } catch (error) {
    console.error(error)
    ElMessage.error('下载失败，请稍后再试')
  }
};

const handleDelete = async (item) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个作品吗？删除后无法恢复。',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await orderStore.deleteOrder(item.id)
    ElMessage.success('删除成功')
    
    // 如果是最后一页且只有一条数据，删除后向前翻页
    if (purchases.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
      // 如果删完之后只有一页了，则重新加载数据
      if (currentPage.value === 1) {
        loadPurchases()
      }
    } else {
      loadPurchases()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 查看作品
const handleViewWork = (item) => {
  // 统一跳转到 WorkView，无论是 PC 还是移动端
  // WorkView 内部会处理水印和设备适配
  router.push({
     name: 'work-view',
     params: { id: item.id }
  });
};

// 分享状态
const shareDialogVisible = ref(false);
const selectedItem = ref(null);
const shareSlug = ref('');
const sharing = ref(false);
const generatedUrl = ref('');

// 分享逻辑
const handleShare = (item) => {
  // 1. 检查付费状态
  if (item.status !== 1) {
    ElMessageBox.confirm(
      '该作品尚未解锁，请先购买后分享',
      '提示',
      { confirmButtonText: '去解锁', cancelButtonText: '取消', type: 'warning' }
    ).then(() => {
      handlePublish(item);
    }).catch(() => {});
    return;
  }

  // 2. 打开分享配置
  selectedItem.value = item;
  shareSlug.value = item.share_slug || '';
  shareDialogVisible.value = true;
  // 配置过自定义域名则使用自定义域名，否则使用默认域名
  if (shareSlug.value) {
    const domain = userStore.userInfo?.custom_domain
      ? `${userStore.userInfo.custom_domain}.${VITE_DEFAULT_SHARE_DOMAIN}`
      : `${VITE_DEFAULT_SHARE_DOMAIN}/u`;
    generatedUrl.value = `https://${domain}/${shareSlug.value}`;
  } else {
    generatedUrl.value = '';
  }
};

const confirmShare = async () => {
  if (!shareSlug.value) {
    ElMessage.warning('请输入自定义路径');
    return;
  }

  // 格式校验
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(shareSlug.value)) {
    ElMessage.error('路径只能包含小写字母、数字和连字符');
    return;
  }

  sharing.value = true;
  try {
    // 调用更新接口
    await orderStore.updateShareSlug(selectedItem.value.id, shareSlug.value);
    
    // 更新本地数据
    selectedItem.value.share_slug = shareSlug.value;
    
    // 生成链接
    const domain = userStore.userInfo?.custom_domain 
      ? `${userStore.userInfo.custom_domain}.${VITE_DEFAULT_SHARE_DOMAIN}` 
      : `${VITE_DEFAULT_SHARE_DOMAIN}/u`;
      
    generatedUrl.value = `https://${domain}/${shareSlug.value}`;
    ElMessage.success('分享链接已生成');
  } catch (error) {
    console.error(error);
    ElMessage.error(error.message || '生成失败，请重试');
  } finally {
    sharing.value = false;
  }
};

const copyLink = () => {
  if (!generatedUrl.value) return;
  copyToClipboard(generatedUrl.value);
  ElMessage.success('复制成功');
};

// 编辑
const handleEdit = (item) => {
  if (item.status === 0) {
    // 未支付订单，去编辑/解锁
    router.push({
       name: 'order-editor',
       params: { orderId: item.id }
    });
  } else {
    // 已支付订单，新建一个基于此配置的草稿？或者仅仅是去查看
    // 暂时先复用编辑页逻辑，但可能需要区分模式
    router.push({
       name: 'order-editor',
       params: { orderId: item.id }
    });
  }
};

const handlePublish = async (item) => {
  if (item.id) {
    router.push(`/checkout/${item.id}`);
  }
};

// 查看订单
const handleViewOrder = (item) => {
  router.push(`/orders/${item.id}`);
};
</script>

<style scoped>
/* 自定义样式 */
.shadow-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.pagination-custom :deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: var(--el-color-primary);
}
</style>
