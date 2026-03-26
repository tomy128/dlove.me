<template>
  <div class="payment-success-overlay fixed inset-0 z-50 flex items-center justify-center bg-white">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
       <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-200/30 rounded-full blur-3xl animate-blob"></div>
       <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
       <div class="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-yellow-200/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
    </div>

    <div class="container-custom max-w-lg w-full relative z-10 px-4">
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-white/50 animate-scale-in">
        
        <!-- 成功图标 -->
        <div class="mb-8 relative">
           <div class="w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/30 animate-bounce-subtle">
              <el-icon class="text-5xl text-white"><Check /></el-icon>
           </div>
        </div>

        <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 pb-1">
          支付成功！
        </h1>
        
        <p class="text-gray-500 text-lg mb-8 leading-relaxed">
          您的心意已经准备就绪。<br>
          快去看看您的专属礼物吧！
        </p>

        <!-- 订单信息卡片 -->
        <div class="bg-gray-50 rounded-2xl p-4 mb-8 text-left border border-gray-100 flex items-center gap-4">
           <div class="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
              <img v-if="order?.items?.[0]?.template?.cover" :src="order.items[0].template.cover" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400"><el-icon><Picture /></el-icon></div>
           </div>
           <div>
              <div class="font-bold text-gray-800 line-clamp-1">{{ order?.items?.[0]?.template?.name || '专属礼物' }}</div>
              <div class="text-xs text-gray-500 mt-1">订单号: {{ order?.id?.slice(-8) }}</div>
           </div>
        </div>

        <!-- 按钮组 -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="$emit('view-order')"
            class="flex-1 btn-primary py-3.5 px-6 rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-1 transition-all duration-300 font-bold flex items-center justify-center gap-2"
          >
            <el-icon><Present /></el-icon> 查看礼物
          </button>
          
          <button 
            @click="$emit('close')"
            class="flex-1 bg-white text-gray-600 border border-gray-200 py-3.5 px-6 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-medium"
          >
            返回列表
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { Check, Present, Picture } from '@element-plus/icons-vue';
import confetti from 'canvas-confetti';

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'view-order']);

const fireConfetti = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }; // 增加 z-index

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
  
  // 额外来一发大的
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    zIndex: 100
  });
};

onMounted(() => {
  fireConfetti();
});
</script>

<style scoped>
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

@keyframes scale-in {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}

.animate-scale-in {
  animation: scale-in 0.5s ease-out forwards;
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s infinite ease-in-out;
}
</style>