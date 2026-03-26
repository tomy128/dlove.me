<template>
  <div class="template-editor fixed inset-0 z-[100] flex bg-gray-100">
    <!-- Desktop Config Panel -->
    <div v-if="!isMobile"
      class="w-96 flex-shrink-0 relative z-20 transition-all duration-300 bg-white shadow-xl h-full flex flex-col"
      :class="{ '-ml-96': !showConfigurator }">
      <EmotionConfigurator :schema="templateSchema" v-model="templateData" @change="handleConfigChange"
        @preview="handlePreview" @upload-status-change="handleUploadStatusChange" class="h-full" />

      <!-- Toggle Button -->
      <button @click="showConfigurator = !showConfigurator"
        class="absolute top-1/2 -right-12 w-12 h-12 bg-white rounded-r-xl shadow-md flex items-center justify-center text-gray-500 hover:text-primary-500 transition-colors z-50 cursor-pointer"
        title="切换面板">
        <el-icon v-if="showConfigurator">
          <ArrowLeft />
        </el-icon>
        <el-icon v-else>
          <ArrowRight />
        </el-icon>
      </button>
    </div>

    <!-- Mobile Config Drawer -->
    <el-drawer v-if="isMobile" :modal="false" v-model="showMobileConfig" :z-index=1000 direction="btt" size="85%"
      :with-header="false" class="mobile-config-drawer rounded-t-2xl">
      <div class="h-full flex flex-col relative bg-white">
        <!-- Mobile Drawer Handle/Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span class="text-sm font-bold text-gray-500">编辑内容</span>
          <div class="w-12 h-1.5 bg-gray-200 rounded-full absolute left-1/2 -translate-x-1/2" @click="showMobileConfig = false"></div>
          <el-icon class="text-xl text-gray-400" @click="showMobileConfig = false"><ArrowDown /></el-icon>
        </div>

        <EmotionConfigurator :schema="templateSchema" v-model="templateData" @change="handleConfigChange"
          @preview="handlePreview" @upload-status-change="handleUploadStatusChange" class="flex-1 overflow-hidden" />
      </div>
    </el-drawer>

    <!-- Right Preview Area -->
    <div class="flex-1 relative z-10 flex flex-col h-full overflow-hidden">
      <!-- Top Toolbar -->
      <div
        class="h-14 md:h-16 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-4 md:px-6 z-30 border-b border-gray-200 transition-all duration-300"
      >
        <div class="flex items-center gap-2">
          <el-button circle size="small" @click="$router.back()">
            <el-icon>
              <Back />
            </el-icon>
          </el-button>
          <span class="text-sm font-bold text-gray-700 ml-2">预览模式</span>
        </div>

        <div class="flex items-center gap-4">
          <!-- 设备切换模拟 -->
          <div class="bg-gray-100 p-1 rounded-lg flex">
            <button class="p-1.5 rounded-md transition-all"
              :class="deviceMode === 'mobile' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'"
              @click="deviceMode = 'mobile'">
              <el-icon>
                <Iphone />
              </el-icon>
            </button>
            <button class="p-1.5 rounded-md transition-all"
              :class="deviceMode === 'desktop' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'"
              @click="deviceMode = 'desktop'">
              <el-icon>
                <Monitor />
              </el-icon>
            </button>
          </div>

          <el-button type="primary" plain round size="default" @click="handleSave" :loading="saving || isUploading" :disabled="isUploading">
            <el-icon class="mr-1" :class="{'animate-spin': isUploading}"><Files v-if="!isUploading" /><Loading v-else /></el-icon> 
            {{ isUploading ? '资源上传中...' : '保存' }}
          </el-button>

        </div>
      </div>

      <!-- Iframe 容器 -->
      <div class="flex-1 relative bg-gray-100 overflow-hidden flex items-center justify-center p-4 md:p-8 z-0 transition-all duration-300"
        :class="{
          'pb-[85vh]': isMobile && showMobileConfig, // 移动端打开抽屉时，预览区域上移
          'pointer-events-none': !showMobileConfig && isMobile // 移动端未打开编辑时，禁止 iframe 交互（防止误触）
        }">
        <DeviceFrame ref="deviceFrameRef" :url="previewUrl" :type="deviceMode" :no-shell="isMobile"
          @load="handleIframeLoad" 
          class="transition-all duration-500 ease-spring"
          :class="{'scale-[0.85] origin-top': isMobile && showMobileConfig}"
        />
      </div>
    </div>

      <!-- Mobile Floating Edit Button -->
    <div v-if="isMobile && !showMobileConfig"
      class="fixed bottom-8 right-6 z-[500] cursor-pointer w-14 h-14 rounded-full shadow-xl bg-primary-500 hover:bg-primary-600 active:scale-95 transition-all flex items-center justify-center text-white animate-pulse-subtle"
      @click.stop="showMobileConfig = true">
      <el-icon class="text-xl">
        <EditPen />
      </el-icon>
      <span class="hidden sm:inline ml-1 text-xs font-bold">编辑</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useTemplateStore } from '@/store/template'; // 引入 Store
import { useOrderStore } from '@/store/order';
import { useUserStore } from '@/store/user';
import { Back, ArrowLeft, ArrowRight, Iphone, Monitor, Share, EditPen, ArrowDown, Files, Present, Loading } from '@element-plus/icons-vue';
import EmotionConfigurator from '@/components/editor/EmotionConfigurator.vue';
import DeviceFrame from '@/components/preview/DeviceFrame.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { checkIsMobile } from '@/utils/device';
import { getFileURL } from '@/api/oss';

const route = useRoute();
const router = useRouter();
const templateStore = useTemplateStore();
const orderStore = useOrderStore();
const userStore = useUserStore();

const showConfigurator = ref(true);
const showMobileConfig = ref(false);
const deviceFrameRef = ref(null);
const deviceMode = ref('mobile');
const iframeLoaded = ref(false);
const templateSchema = ref({ fields: [] });
const templateData = ref({});
const previewUrl = ref('');
const currentOrderId = ref(null);
const saving = ref(false);
const isUploading = ref(false); // 全局上传状态锁

// 响应式设计
const isMobile = ref(false);
const checkMobile = () => {
  const mobile = checkIsMobile();
  
  isMobile.value = mobile;
  // 如果切换到移动端，默认隐藏左侧面板（其实是不用了），使用Drawer
  // 如果切换到桌面端，确保左侧面板显示
  console.log('isMobile', isMobile.value, 'UA:', navigator.userAgent)
  if (!mobile) {
    showConfigurator.value = true;
    showMobileConfig.value = false;
  }
};

// 发送数据给 iframe
const sendDataToIframe = () => {
  if (deviceFrameRef.value && iframeLoaded.value) {
    deviceFrameRef.value.sendMessage({
      type: 'DLOVE_UPDATE_CONFIG',
      data: JSON.parse(JSON.stringify(templateData.value))
    });
  }
};

// 监听配置变化，发送给 iframe
const handleConfigChange = () => {
  // v-model 会自动更新 templateData，这里只需要触发 iframe 更新即可
  sendDataToIframe();
};

const handleIframeLoad = () => {
  console.log('Iframe loaded');
  setTimeout(sendDataToIframe, 1000);
};

// 监听来自 Iframe 的消息 (握手协议)
const handleMessage = (event) => {
  const message = event.data;
  if (message && message.type === 'DLOVE_TEMPLATE_READY') {
    console.log('收到模板就绪信号，开始发送初始配置');
    iframeLoaded.value = true;
    sendDataToIframe();
  }
};

const handleUploadStatusChange = (status) => {
  isUploading.value = status;
};

const handlePreview = () => {
  // 仅隐藏配置面板，进入预览模式
  if (isMobile.value) {
    showMobileConfig.value = false;
  } else {
    // 桌面端也可以选择收起侧边栏来预览全屏
    showConfigurator.value = false;
  }
  ElMessage.success('已切换至预览模式');
};

const handleSave = async (redirect = false) => {
  saving.value = true;
  try {
    // 数据清洗：将临时 OSS Key 替换回对应的字段
    const cleanData = { ...templateData.value };
    console.log('cleanData', cleanData)
    
    // 遍历所有 key，检查是否有对应的隐藏 _oss_key
    Object.keys(cleanData).forEach(key => {
      // 兼容两种格式：_cover_oss_key (标准) 或 _cover_key (部分场景可能用到的简写)
      // 以及防止用户数据里本身就有 _oss_key 后缀的字段
      if (key.startsWith('_') && key.endsWith('_oss_key')) {
         // 这是一个 oss key 字段，例如 _cover_oss_key
         const originalKey = key.replace(/^_(.*)_oss_key$/, '$1');
         // 只有当原始字段存在（即被 Base64 占用了），我们才替换
         if (cleanData[originalKey] !== undefined) {
            cleanData[originalKey] = cleanData[key];
         }
         // 删除辅助字段
         delete cleanData[key];
      }
    });

    // 检查登录状态
    if (!userStore.isLoggedIn) {
      // 保存数据到 localStorage
      const unsavedData = {
         templateId: route.params.id,
         orderId: currentOrderId.value,
         data: cleanData,
         timestamp: Date.now()
      };
      localStorage.setItem('dlove_unsaved_template_data', JSON.stringify(unsavedData));
      
      ElMessage.warning('请先登录以保存您的作品');
      router.push({
         path: '/login',
         query: { redirect: route.fullPath }
      });
      return;
    }

    let orderId = currentOrderId.value;

    if (currentOrderId.value) {
      // 更新现有订单
      await orderStore.updateOrder(currentOrderId.value, { config_data: cleanData });
      ElMessage.success('✨ 已保存到礼物盒');
    } else {
      // 创建新订单
      const orderData = {
        template_id: route.params.id,
        config_data: cleanData
      };
      const order = await orderStore.createOrder(orderData);
      currentOrderId.value = order.id;
      orderId = order.id;
      
      // 更新路由，但不刷新页面
      router.replace({ name: 'order-editor', params: { orderId: order.id } });
      ElMessage.success('✨ 已保存到礼物盒');
    }
    
    if (redirect && orderId) {
       router.push(`/checkout/${orderId}`);
    }

  } catch (error) {
    console.error('Save failed:', error);
    ElMessage.error(error.message || '保存失败，请重试');
  } finally {
    saving.value = false;
  }
};

// 移动端下滑关闭抽屉
const handleTouchStart = (e) => {
  touchStartY.value = e.touches[0].clientY;
};

const handleTouchMove = (e) => {
  // 可以添加阻尼效果或跟随手指移动的逻辑，这里简化处理
};

const handleTouchEnd = (e) => {
  const touchEndY = e.changedTouches[0].clientY;
  const diff = touchEndY - touchStartY.value;
  
  // 如果向下滑动超过 50px，则关闭抽屉
  if (diff > 50) {
    showMobileConfig.value = false;
  }
};

const handleSaveAndUnlock = () => {
   handleSave(true);
};

onMounted(async () => {
  // 初始化移动端检查
  checkMobile();
  window.addEventListener('resize', checkMobile);
  window.addEventListener('message', handleMessage);
  
  // 检查是否是编辑已有订单
  const orderId = route.params.orderId;
  let templateId = route.params.id;

  try {
    if (orderId) {
      currentOrderId.value = orderId;
      // 加载订单详情
      const order = await orderStore.fetchOrderById(orderId);
      if (!order) throw new Error('Order not found');
      
      templateId = order.template_id;
      // 恢复配置数据
      templateData.value = typeof order.config_data === 'string' 
        ? JSON.parse(order.config_data) 
        : (order.config_data || {});
        
      console.log('Resumed editing order:', orderId, 'Template:', templateId);
    }

    if (!templateId) {
      throw new Error('Template ID is required');
    }

    console.log('Loading template:', templateId);

    // 1. 从 Store 获取模板详情 (获取 config_url 和 preview_url)
    await templateStore.fetchTemplateById(templateId, true);
    const template = templateStore.currentTemplate;

    if (!template) {
      throw new Error('Template not found');
    }

    // 2. 加载模板配置 (Schema)
    if (template.config_url) {
      const response = await axios.get(template.config_url);
      templateSchema.value = response.data;
      
      // 如果是新建订单，初始化默认值
      if (!currentOrderId.value) {
        const defaultData = {};
        if (templateSchema.value.fields) {
          templateSchema.value.fields.forEach(field => {
            if (field.default !== undefined) {
              defaultData[field.key] = field.default;
            }
          });
        }
        templateData.value = defaultData;
      }
    } else {
      ElMessage.warning('该模板缺少配置文件，无法编辑');
    }

    // 3. 加载模板预览页面
    if (template.preview_url) {
      previewUrl.value = template.preview_url;
    } else {
      ElMessage.warning('该模板缺少预览地址');
    }
    
    // 检查是否有未保存的数据
    const unsavedDataStr = localStorage.getItem('dlove_unsaved_template_data');
    if (unsavedDataStr) {
       try {
         const unsaved = JSON.parse(unsavedDataStr);
         // 检查数据是否新鲜 (例如 < 30 分钟)
         if (Date.now() - unsaved.timestamp < 0.5 * 60 * 60 * 1000) {
             // 检查是否匹配当前上下文
             const currentId = route.params.id;
             const currentOrderIdParam = route.params.orderId;
             
             // 逻辑：如果我们处于同一个模板或订单
             // 注意：ID 比较需要转为字符串，因为 params 是字符串，unsaved 可能是数字
             if ((currentId && String(unsaved.templateId) === String(currentId)) || 
                 (currentOrderIdParam && String(unsaved.orderId) === String(currentOrderIdParam))) {
                 
                 await ElMessageBox.confirm('检测到您有未保存的编辑内容，是否恢复？', '恢复编辑', {
                    confirmButtonText: '恢复',
                    cancelButtonText: '丢弃',
                    type: 'info'
                 }).then(async () => {
                    // 恢复数据逻辑增强：检测 OSS Key 并自动签名
                    const restoredData = unsaved.data;
                    
                    if (templateSchema.value && templateSchema.value.fields) {
                        for (const field of templateSchema.value.fields) {
                            const val = restoredData[field.key];
                            // 检查媒体类型的字段
                            if (['image', 'audio', 'video'].includes(field.type) && val && typeof val === 'string') {
                                // 判断是否是 OSS Key (非 http/https/data 开头)
                                // 注意：我们允许 dlove/ 开头，或者不含协议头的相对路径（通常也是 key）
                                if (!val.startsWith('http') && !val.startsWith('data:')) {
                                    const ossKey = val;
                                    // 1. 恢复辅助字段 _oss_key，确保下次保存时能正确处理（提交 key 而非临时 url）
                                    // 只有当没有冲突时才恢复，或者强制恢复？
                                    // 应该强制恢复，因为 unsaved.data 是 cleanData，里面没有 _oss_key
                                    restoredData[`_${field.key}_oss_key`] = ossKey;
                                    
                                    // 2. 获取签名 URL 用于展示
                                    try {
                                        const url = await getFileURL(ossKey);
                                        restoredData[field.key] = url;
                                        console.log(`[Restore] Signed URL for ${field.key}:`, url);
                                    } catch (e) {
                                        console.error('Failed to get signed url for key:', ossKey, e);
                                        // 降级：保留 Key，虽然可能无法显示，但数据还在
                                    }
                                }
                            }
                        }
                    }

                    templateData.value = restoredData;
                    if (unsaved.orderId) currentOrderId.value = unsaved.orderId;
                    // 触发 iframe 更新
                    setTimeout(sendDataToIframe, 1000);
                    ElMessage.success('已恢复编辑内容');
                 }).catch(() => {
                    // 用户选择丢弃
                 });
                 
                 // 无论如何都清除，避免重复提示
                 localStorage.removeItem('dlove_unsaved_template_data');
             }
         } else {
           // 数据过期，清除
           localStorage.removeItem('dlove_unsaved_template_data');
         }
       } catch (e) {
         console.error('Failed to parse unsaved data', e);
         localStorage.removeItem('dlove_unsaved_template_data');
       }
    }

  } catch (error) {
    console.error('Failed to load template:', error);
    ElMessage.error('加载模板失败');
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  window.removeEventListener('message', handleMessage);
});
</script>

<style>
.mobile-config-drawer .el-drawer__body {
  padding: 0 !important;
}
</style>

<style scoped>
/* 样式调整 */
@keyframes pulse-subtle {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
}
.animate-pulse-subtle {
  animation: pulse-subtle 2s infinite ease-in-out;
}
</style>
