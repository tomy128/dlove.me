<template>
  <div class="work-view fixed inset-0 z-[100] flex flex-col overflow-hidden bg-gray-100">
    <!-- 顶部导航 -->
    <div class="h-14 bg-white shadow-sm flex items-center justify-between px-4 lg:px-6 z-30 flex-shrink-0">
      <div class="flex items-center gap-3">
        <router-link to="/user/purchases" class="text-gray-500 hover:text-gray-800 transition-colors">
          <el-icon class="text-xl"><Back /></el-icon>
        </router-link>
        <div class="flex flex-col">
           <h1 class="text-sm font-bold text-gray-800 line-clamp-1">{{ order?.template?.name || '作品预览' }}</h1>
           <span class="text-xs text-gray-400 hidden sm:inline-block">订单号: {{ order?.order_no }}</span>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
         <!-- 设备切换 -->
         <div class="bg-gray-100 p-1 rounded-lg hidden sm:flex">
            <button 
              class="p-1.5 rounded-md transition-all"
              :class="deviceMode === 'mobile' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'"
              @click="deviceMode = 'mobile'"
              title="手机模式"
            >
              <el-icon><Iphone /></el-icon>
            </button>
            <button 
              class="p-1.5 rounded-md transition-all"
              :class="deviceMode === 'desktop' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'"
              @click="deviceMode = 'desktop'"
              title="桌面模式"
            >
              <el-icon><Monitor /></el-icon>
            </button>
         </div>

         <el-button type="primary" round size="small" @click="handleShare">
           <el-icon class="mr-1"><Share /></el-icon> <span class="hidden sm:inline">分享作品</span><span class="sm:hidden">分享</span>
         </el-button>
         
         <el-button type="danger" circle size="small" @click="handleDelete" title="删除作品">
           <el-icon><Delete /></el-icon>
         </el-button>
      </div>
    </div>

    <!-- 预览区域 -->
    <div class="flex-1 w-full flex items-center justify-center bg-gray-100 p-4 overflow-hidden relative" :class="{'!p-0': isRealMobile}">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/50 z-50">
         <el-icon class="is-loading text-3xl text-primary-500"><Loading /></el-icon>
      </div>

      <!-- 背景网格装饰 -->
      <div v-if="!isRealMobile" class="absolute inset-0 opacity-5" style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;"></div>

      <div 
        class="relative bg-white shadow-2xl overflow-hidden transition-all duration-500 ease-in-out"
        :class="[
          (deviceMode === 'mobile' && !isRealMobile) ? 'w-[375px] h-[667px] rounded-[3rem] border-[8px] border-gray-800' : 'w-full h-full max-w-5xl max-h-[800px] rounded-lg border border-gray-200',
          isRealMobile ? '!w-full !h-full !rounded-none !border-0 !max-w-none !max-h-none !shadow-none' : ''
        ]"
      >
        <!-- 模拟手机刘海 -->
        <div v-if="deviceMode === 'mobile' && !isRealMobile" class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-20 pointer-events-none"></div>
        
        <!-- 水印遮罩 (未支付时显示) -->
        <div 
          v-if="!loading && !isPaid" 
          class="absolute inset-0 z-40 pointer-events-none overflow-hidden flex flex-col justify-center items-center select-none"
        >
           <div class="absolute inset-[-50%] w-[200%] h-[200%] flex flex-col justify-center items-center transform -rotate-12 opacity-[0.15]">
             <div v-for="row in 20" :key="row" class="flex gap-16 mb-16 whitespace-nowrap">
                <span v-for="col in 10" :key="col" class="text-2xl font-black text-gray-900">
                  dlove.me
                </span>
             </div>
           </div>
           
           <!-- 底部提示条 -->
           <div class="absolute bottom-10 left-0 right-0 flex justify-center z-50 pointer-events-auto">
              <div class="bg-gray-900/80 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-xl flex items-center gap-3 border border-white/10 animate-fade-in-up">
                 <el-icon><View /></el-icon>
                 <span>当前为预览模式</span>
                 <span class="w-1 h-1 bg-gray-500 rounded-full"></span>
                 <button 
                   class="text-primary-400 hover:text-primary-300 font-bold transition-colors"
                   @click="$router.push(`/checkout/${order?.id}`)"
                 >
                   去支付解锁
                 </button>
              </div>
           </div>
        </div>

        <iframe
          v-if="previewUrl"
          ref="previewFrame"
          :src="previewUrl"
          class="w-full h-full border-0 bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms"
          @load="handleIframeLoad"
        ></iframe>
        
        <div v-else-if="!loading" class="w-full h-full flex flex-col items-center justify-center text-gray-400">
           <el-icon class="text-4xl mb-2"><Warning /></el-icon>
           <p>无法加载预览链接</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '@/store/order';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Back, Iphone, Monitor, Share, Loading, Warning, Delete, View } from '@element-plus/icons-vue';
import { checkIsMobile } from '@/utils/device';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

const loading = ref(true);
const deviceMode = ref('mobile');
const isRealMobile = ref(false);
const previewFrame = ref(null);
const iframeLoaded = ref(false);
const order = ref(null);
const previewUrl = ref('');

// 支付状态判断
const isPaid = computed(() => {
  return order.value?.status === 1;
});

// 获取订单详情及配置
onMounted(async () => {
  isRealMobile.value = checkIsMobile();
  window.addEventListener('resize', () => {
    isRealMobile.value = checkIsMobile();
  });
  const orderId = route.params.id; // 这里其实是 order_id
  if (!orderId) {
     ElMessage.error('参数错误');
     loading.value = false;
     return;
  }

  try {
    // 假设我们通过订单ID来查看作品 (实际上可能需要专门的作品ID，但简化起见先用订单ID)
    const result = await orderStore.fetchOrderById(orderId);
    order.value = result;
    
    // 设置预览链接 (使用 SSR 渲染)
    previewUrl.value = `/api/v1/works/${orderId}`;

  } catch (error) {
    ElMessage.error('加载作品失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
  
  window.addEventListener('message', handleMessage);
});

// 发送配置数据给 iframe
const sendDataToIframe = () => {
  if (previewFrame.value && previewFrame.value.contentWindow && order.value?.config_data) {
    try {
      // 解析配置数据 (如果是字符串)
      let config = order.value.config_data;
      if (typeof config === 'string') {
         config = JSON.parse(config);
      }
      
      console.log('Sending config to iframe:', config);

      // 使用 JSON 序列化/反序列化来确保数据是纯对象，去除 Proxy 包装
      // 这可以解决 DataCloneError 问题
      const plainConfig = JSON.parse(JSON.stringify(config));

      previewFrame.value.contentWindow.postMessage({
        type: 'DLOVE_UPDATE_CONFIG',
        data: plainConfig
      }, '*');
    } catch (e) {
      console.error('Failed to parse config data:', e);
    }
  }
};

const handleIframeLoad = () => {
  console.log('Iframe loaded');
  // 延迟发送，确保 SDK 初始化
  setTimeout(sendDataToIframe, 500);
  setTimeout(sendDataToIframe, 1500); 
};

// 监听握手信号
const handleMessage = (event) => {
  const message = event.data;
  if (message && message.type === 'DLOVE_TEMPLATE_READY') {
    console.log('WorkView: Template ready, sending config...');
    iframeLoaded.value = true;
    sendDataToIframe();
  }
};

const handleShare = () => {
  // 复制 SSR 成品链接
  const url = `${window.location.origin}/api/v1/works/${order.value?.id || route.params.id}`;
  navigator.clipboard.writeText(url).then(() => {
    ElMessage.success('作品链接已复制，快去分享给TA吧！');
  }).catch(() => {
    ElMessage.error('复制失败');
  });
};

const handleDelete = async () => {
  if (!order.value) return;
  
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
    
    await orderStore.deleteOrder(order.value.id)
    ElMessage.success('删除成功')
    router.push('/user/purchases')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}
</script>

<style scoped>
.work-view {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}
</style>
