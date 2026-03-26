<template>
  <div class="device-frame h-full w-full relative transition-all duration-500 ease-in-out" :class="containerClass">

    <!-- 1. Mobile Shell (iPhone Style) -->
    <div v-if="type === 'mobile' && !noShell" class="relative mx-auto origin-top-left" :style="mobileWrapperStyle">
      <div
        class="relative w-[399px] h-[836px] bg-gray-900 rounded-[3rem] shadow-2xl border-[12px] border-gray-900 overflow-hidden"
        :style="mobileScaleStyle">
        <!-- Dynamic Island / Notch -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-xl z-20"></div>

        <!-- Screen Container (375x812) -->
        <div class="absolute top-0 left-0 right-0 bottom-0 bg-white rounded-[2.5rem] overflow-hidden z-10">
          <iframe ref="iframeRef" :src="url" class="w-full h-full border-0" :style="iframeStyle"
            @load="handleLoad"></iframe>
        </div>
      </div>
    </div>

    <!-- 2. Desktop Shell (MacBook Style) -->
    <div v-else-if="type === 'desktop' && !noShell"
      class="relative mx-auto h-full w-full max-w-6xl aspect-[16/10] bg-gray-900 rounded-t-2xl border-[12px] border-gray-800 shadow-2xl overflow-hidden">
      <!-- Camera -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-800 rounded-b-lg z-20"></div>

      <!-- Screen Container -->
      <div class="w-full h-full bg-white overflow-hidden relative">
        <!-- Browser Header Bar (Optional, for realism) -->
        <div v-if="showBrowserHeader"
          class="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2 absolute top-0 left-0 right-0 z-10">
          <div class="w-3 h-3 rounded-full bg-red-400"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div class="w-3 h-3 rounded-full bg-green-400"></div>
          <div class="flex-1 text-center text-xs text-gray-500 font-mono truncate px-4">{{ displayUrl }}</div>
        </div>

        <iframe ref="iframeRef" :src="url" class="w-full h-full border-0 bg-white"
          :class="{ 'mt-8 h-[calc(100%-2rem)]': showBrowserHeader }" :style="iframeStyle" @load="handleLoad"></iframe>
      </div>
    </div>

    <!-- 3. No Shell (Fullscreen / Raw) -->
    <div v-else class="w-full h-full bg-white relative z-0">
      <iframe ref="iframeRef" :src="url" class="w-full h-full border-0" :style="iframeStyle"
        @load="handleLoad"></iframe>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'mobile',
    validator: (value) => ['mobile', 'desktop'].includes(value)
  },
  // 强制不显示外壳（例如在真实移动端设备上预览）
  noShell: {
    type: Boolean,
    default: false
  },
  // 目标宽度（用于整体缩放设备）
  width: {
    type: Number,
    default: 0
  },
  // 是否显示浏览器头部（仅 Desktop 模式有效）
  showBrowserHeader: {
    type: Boolean,
    default: true
  },
  // Iframe 缩放比例 (用于在小容器中显示大屏幕)
  scale: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['load', 'message']);

const iframeRef = ref(null);
const VITE_DEFAULT_SHARE_DOMAIN = import.meta.env.VITE_DEFAULT_SHARE_DOMAIN;

// Mobile dimensions constants
const MOBILE_WIDTH = 399; // 375 + 12*2
const MOBILE_HEIGHT = 836; // 812 + 12*2

const containerClass = computed(() => {
  return '';
});

// Calculate styles for Mobile Wrapper (outer box sizing)
const mobileWrapperStyle = computed(() => {
  if (props.width > 0) {
    const scale = props.width / MOBILE_WIDTH;
    return {
      width: `${props.width}px`,
      height: `${MOBILE_HEIGHT * scale}px`
    };
  }
  return {
    width: `${MOBILE_WIDTH}px`,
    height: `${MOBILE_HEIGHT}px`
  };
});

// Calculate transform for Mobile Shell (scaling the whole device)
const mobileScaleStyle = computed(() => {
  if (props.width > 0) {
    const scale = props.width / MOBILE_WIDTH;
    return {
      transform: `scale(${scale})`,
      transformOrigin: 'top left'
    };
  }
  return {};
});

const displayUrl = computed(() => {
  try {
    const urlObj = new URL(props.url);
    return urlObj.hostname;
  } catch (e) {
    return `${VITE_DEFAULT_SHARE_DOMAIN}`;
  }
});

const iframeStyle = computed(() => {
  const styles = {};
  if (props.scale !== 1) {
    styles.transform = `scale(${props.scale})`;
    styles.transformOrigin = 'top left';
    styles.width = `${100 / props.scale}%`;
    styles.height = `${100 / props.scale}%`;
  }
  return styles;
});

const handleLoad = () => {
  emit('load', iframeRef.value);
};

// 暴露 postMessage 方法给父组件
const sendMessage = (message) => {
  if (iframeRef.value && iframeRef.value.contentWindow) {
    iframeRef.value.contentWindow.postMessage(message, '*');
  }
};

defineExpose({
  sendMessage,
  iframeRef
});
</script>

<style scoped>
/* 可以在这里添加一些特定的设备样式微调 */
</style>
