<template>
  <div class="template-detail-page bg-white min-h-screen">
    <div v-if="loading" class="h-screen flex items-center justify-center">
      <el-skeleton :rows="3" animated class="w-1/2" />
    </div>

    <template v-else-if="template">
      <!-- 1. 沉浸式 Hero Section (全屏) -->
      <div class="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <!-- 动态背景 (模糊处理) -->
        <div class="absolute inset-0 z-0">
          <img :src="template.cover_url || '@/assets/images/default-cover.png'"
            class="w-full h-full object-cover blur-sm scale-105 opacity-80" alt="Background" />
          <div class="absolute inset-0 bg-black/40"></div>
        </div>

        <!-- 核心内容 -->
        <div class="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in-up">
          <h1 class="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight leading-tight">
            {{ template.name }}
          </h1>
          <p class="text-lg md:text-xl text-white/90 mb-6 font-light leading-relaxed max-w-2xl mx-auto">
            {{ template.description || '为爱而生，记录每一个动人瞬间。' }}
          </p>

          <!-- Metadata Badges -->
          <div class="flex flex-wrap justify-center gap-3 mb-10 animate-fade-in-up" style="animation-delay: 0.1s;">
             <!-- Difficulty -->
             <div v-if="getDifficulty(template.tags)" class="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium flex items-center">
                <span class="mr-1 opacity-80">心意密度:</span> {{ getDifficultyLabel(getDifficulty(template.tags)) }}
             </div>
             
             <!-- Category -->
             <div v-for="cat in template.categories" :key="cat.id" class="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium">
                {{ cat.name }}
             </div>
  
             <!-- Tags -->
             <div v-for="tag in getDisplayTags(template.tags)" :key="tag" class="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/90 text-sm">
                #{{ tag }}
             </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button @click="startCreating"
              class="px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-xl flex items-center">
              <el-icon class="mr-2">
                <EditPen />
              </el-icon>
              试同款
            </button>
            <button @click="previewTemplate"
              class="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium text-lg hover:bg-white/20 transition-all flex items-center">
              <el-icon class="mr-2">
                <View />
              </el-icon>
              预览效果
            </button>
          </div>

          <div class="mt-12 flex justify-center gap-8 text-white/60 text-sm">
            <div class="flex items-center gap-2">
              <el-icon>
                <Monitor />
              </el-icon> 手机/电脑自适应
            </div>
            <div class="flex items-center gap-2">
              <el-icon>
                <Lock />
              </el-icon> 私密安全
            </div>
            <div class="flex items-center gap-2">
              <el-icon>
                <MagicStick />
              </el-icon> 极简编辑
            </div>
          </div>
        </div>

        <!-- 下滑提示 -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
          <el-icon class="text-2xl">
            <ArrowDown />
          </el-icon>
        </div>
      </div>

      <!-- 2. 情感故事与场景 (The Story) -->
      <div class="py-24 bg-stone-50">
        <div class="container-custom max-w-6xl">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div class="relative group">
              <div
                class="absolute -inset-4 bg-rose-200/30 rounded-full blur-2xl group-hover:bg-rose-300/40 transition-all duration-700">
              </div>
              <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop"
                class="relative rounded-2xl shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-700 w-full object-cover aspect-[4/5]"
                alt="Story" />

              <!-- UI Overlay: Music Player -->
              <div class="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float z-20 border border-white/50 max-w-[220px]">
                <div class="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                  <el-icon class="text-lg"><Headset /></el-icon>
                </div>
                <div class="flex-1 min-w-0">
                   <div class="text-xs text-gray-400 mb-0.5">正在播放</div>
                   <div class="text-sm font-bold text-gray-800 truncate">我们的纪念日.mp3</div>
                </div>
                <div class="flex gap-0.5 h-3 items-end">
                   <div class="w-1 bg-rose-400 rounded-full animate-music-bar" style="height: 40%"></div>
                   <div class="w-1 bg-rose-400 rounded-full animate-music-bar" style="height: 100%; animation-delay: 0.1s"></div>
                   <div class="w-1 bg-rose-400 rounded-full animate-music-bar" style="height: 60%; animation-delay: 0.2s"></div>
                </div>
              </div>

              <!-- UI Overlay: Message -->
              <div class="absolute top-8 -right-6 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg transform rotate-6 animate-float-delay z-20 border border-white/50">
                 <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-blue-100 overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100" />
                    </div>
                    <div class="text-xs">
                       <div class="font-bold text-gray-800">亲爱的</div>
                       <div class="text-gray-500">做好了吗？好期待呀✨</div>
                    </div>
                 </div>
              </div>
            </div>
            <div>
              <h2 class="text-3xl font-display font-bold text-gray-800 mb-6">不仅仅是网页，<br />更是你们的故事。</h2>
              <p class="text-gray-600 leading-relaxed mb-6">
                想象一下，当TA收到这个链接，打开看到满屏的回忆，听到那首属于你们的歌。
                这不是冷冰冰的代码，这是你用心编织的惊喜。
              </p>

              <div class="space-y-4">
                <div class="flex items-start gap-4">
                  <div
                    class="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                    <el-icon>
                      <PictureFilled />
                    </el-icon>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-800">视觉叙事</h3>
                    <p class="text-sm text-gray-500">大图展示，沉浸式浏览体验。</p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div
                    class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 shrink-0">
                    <el-icon>
                      <Headset />
                    </el-icon>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-800">听觉共鸣</h3>
                    <p class="text-sm text-gray-500">支持背景音乐，让感动加倍。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. 真实预览展示 (Mockup) -->
      <div class="py-12 md:py-24 bg-white overflow-hidden">
        <div class="container-custom text-center mb-10 md:mb-16">
          <h2 class="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-4">完美适配所有设备</h2>
          <p class="text-sm md:text-base text-gray-500">无论是在手机上还是电脑前，爱意都不打折。</p>
        </div>

        <!-- 响应式容器：移动端垂直排列，桌面端水平并排 -->
        <div class="relative max-w-7xl mx-auto min-h-[600px] flex flex-col lg:flex-row justify-center items-center lg:items-end pb-10 gap-8 lg:gap-8">
          
          <!-- 电脑模型 (MacBook style) - 移动端隐藏，桌面端显示 -->
          <DeviceFrame
            v-if="template.preview_url"
            :url="template.preview_url"
            type="desktop"
            class="hidden lg:block transform scale-75 origin-bottom lg:scale-100"
            :scale="0.5625"
          />
          
          <!-- 手机模型 (iPhone style) - 全端显示 -->
          <DeviceFrame
             v-if="template.preview_url"
             :url="template.preview_url"
             type="mobile"
             class="transform transition-transform hover:scale-105"
             :width="280"
          />
        </div>
      </div>

      <!-- 4. 用户心声 (Social Proof) -->
      <div class="py-24 bg-gray-50">
        <div class="container-custom max-w-4xl">
          <div class="text-center mb-12">
            <el-icon class="text-4xl text-rose-400 mb-4">
              <ChatDotSquare />
            </el-icon>
            <h2 class="text-2xl font-bold text-gray-800">听听大家怎么说</h2>
          </div>

          <div class="grid md:grid-cols-2 gap-8">
            <div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <p class="text-gray-600 italic mb-6">"本来只是想试试，结果做出来的效果太惊艳了。女朋友看到的时候直接哭了，说这是她收到过最用心的礼物。"</p>
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">J
                </div>
                <div>
                  <div class="font-bold text-gray-800">Jason</div>
                  <div class="text-xs text-gray-400">异地恋 3 年</div>
                </div>
              </div>
            </div>
            <div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <p class="text-gray-600 italic mb-6">"完全不需要懂代码，就像填空题一样简单。我把自己拍的照片放上去，配上我们的歌，感觉就像拍了一部微电影。"</p>
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">S
                </div>
                <div>
                  <div class="font-bold text-gray-800">Sarah</div>
                  <div class="text-xs text-gray-400">结婚 1 周年</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部行动栏 (CTA) -->
      <div
        class="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-gray-200 p-4 z-50 transform transition-transform duration-300"
        :class="showBottomBar ? 'translate-y-0' : 'translate-y-full'">
        <div class="container-custom max-w-4xl flex items-center justify-between">
          <div class="hidden md:block">
            <div class="font-bold text-gray-800">{{ template.name }}</div>
            <div class="text-xs text-gray-500">开启你的浪漫创作之旅</div>
          </div>
          <button @click="startCreating"
            class="w-full md:w-auto px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-colors shadow-lg flex items-center justify-center">
            <el-icon class="mr-2">
              <EditPen />
            </el-icon>
            试同款
          </button>
        </div>
      </div>

      <!-- 预览弹窗 -->
      <el-dialog v-model="previewVisible" fullscreen destroy-on-close :show-close="false" class="detail-preview-dialog">
        <template #header="{ close }">
          <div class="flex items-center justify-between w-full px-4 py-3 bg-white border-b shadow-sm z-50 relative">
            <div class="flex items-center gap-2">
               <div class="font-bold text-gray-800 text-lg">预览模式</div>
               <div class="text-xs text-gray-400 px-2 border-l border-gray-300">
                  真实还原在浏览器中打开的效果
               </div>
            </div>
            <div class="flex gap-4">
              <button @click="startCreating"
                class="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-black transition-colors shadow-lg flex items-center">
                <el-icon class="mr-2"><EditPen /></el-icon>
                立即使用
              </button>
              <button @click="close" class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors">
                <el-icon class="text-xl"><Close /></el-icon>
              </button>
            </div>
          </div>
        </template>
        <!-- 移除固定宽高限制，使用全屏 Iframe 以展示响应式效果 (Desktop Card / Mobile Full) -->
        <div class="w-full h-full bg-gray-50 overflow-hidden flex items-center justify-center">
          <DeviceFrame
             v-if="template.preview_url"
             :url="template.preview_url"
             type="mobile"
             :no-shell="true"
             class="w-full h-full"
          />
        </div>
      </el-dialog>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTemplateStore } from '@/store/template';
import DeviceFrame from '@/components/preview/DeviceFrame.vue';
import { ElMessage } from 'element-plus';
import { 
  EditPen, View, Monitor, Lock, MagicStick, ArrowDown, 
  PictureFilled, Headset, ChatDotSquare, Close 
} from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const templateStore = useTemplateStore();

const loading = ref(true);
const previewVisible = ref(false);
const showBottomBar = ref(false);

const template = computed(() => templateStore.currentTemplate);

// 滚动监听
const handleScroll = () => {
  const scrollY = window.scrollY;
  showBottomBar.value = scrollY > 500;
};

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  const templateId = route.params.id;
  try {
    await templateStore.fetchTemplateById(templateId, true);
  } catch (error) {
    ElMessage.error('获取模板详情失败');
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const startCreating = () => {
  // 直接跳转编辑器，没有任何阻断
  router.push(`/templates/${template.value.id}/edit`);
};

// 标签与难度辅助函数
const getDisplayTags = (tags) => {
  return (tags || []).filter(t => !t.startsWith('difficulty:'));
};

const getDifficulty = (tags) => {
  const tag = (tags || []).find(t => t.startsWith('difficulty:'));
  return tag ? tag.split(':')[1] : null;
};

const getDifficultyLabel = (difficulty) => {
  const map = {
    easy: '轻量',
    medium: '适中',
    hard: '隆重'
  };
  return map[difficulty] || '适中';
};

const previewTemplate = () => {
  if (!template.value.preview_url) {
    ElMessage.warning('暂无预览链接');
    return;
  }
  previewVisible.value = true;
};
</script>

<style>
/* 全局样式覆盖，用于 Teleport 出去的 Dialog */
.detail-preview-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important; /* 覆盖可能存在的 margin */
  position: absolute; /* 确保占满 */
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100% !important;
  max-height: 100% !important;
}

.detail-preview-dialog .el-dialog__header {
  padding: 0;
  margin: 0;
  flex-shrink: 0;
}

.detail-preview-dialog .el-dialog__body {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 0; /* 关键：防止内容撑开导致 flex 失效 */
  overflow: hidden;
}
</style>

<style scoped>
.font-display {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

/* 动效 */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-float-delay {
  animation: float 4s ease-in-out 2s infinite;
}

@keyframes music-bar {
  0%, 100% { height: 40%; }
  50% { height: 100%; }
}

.animate-music-bar {
  animation: music-bar 1s ease-in-out infinite;
}
</style>
