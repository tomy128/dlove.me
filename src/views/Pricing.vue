<template>
  <div class="min-h-screen bg-black text-white relative">
    <!-- Back Button -->
    <button 
      @click="router.back()" 
      class="absolute top-6 left-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-105 transition-all backdrop-blur-sm"
    >
      <el-icon class="text-xl"><ArrowLeft /></el-icon>
    </button>

    <!-- Header Section -->
    <div class="relative pt-20 pb-12 px-4 text-center overflow-hidden">
      <!-- Background Elements -->
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none">
      </div>
      <div class="absolute top-20 left-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-[100px] pointer-events-none">
      </div>
      <div class="absolute top-20 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none">
      </div>

      <h1
        class="relative text-4xl md:text-5xl font-bold mb-6 bg-clip-text bg-gradient-to-r from-white via-pink-100 to-white">
        升级您的爱意表达
      </h1>
      <p class="relative text-xl text-white/60 max-w-2xl mx-auto mb-12">
        选择适合您的会员计划，解锁自定义域名、源码下载等高级功能，让爱意永久保存。
      </p>

      <!-- Plans Component -->
      <div class="max-w-6xl mx-auto">
        <SubscriptionPlans />
      </div>
    </div>

    <!-- FAQ Section (Optional but good for a pricing page) -->
    <div class="max-w-4xl mx-auto px-4 py-16 border-t border-white/10">
      <h2 class="text-2xl font-bold text-center mb-12">常见问题</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div class="space-y-2">
          <h3 class="font-bold text-lg text-pink-400">会员有效期如何计算？</h3>
          <p class="text-white/60 text-sm leading-relaxed">有效期从购买成功当刻开始计算。例如购买月度会员，有效期为30天。</p>
        </div>
        <div class="space-y-2">
          <h3 class="font-bold text-lg text-purple-400">可以退款吗？</h3>
          <p class="text-white/60 text-sm leading-relaxed">由于数字商品的特殊性，会员权益开通后不支持退款。建议您先试用免费功能。</p>
        </div>
        <div class="space-y-2">
          <h3 class="font-bold text-lg text-blue-400">如何绑定自定义域名？</h3>
          <p class="text-white/60 text-sm leading-relaxed">开通会员后，在个人中心即可设置您的专属域名（如 yourname.dlove.me），立即生效。</p>
        </div>
        <div class="space-y-2">
          <h3 class="font-bold text-lg text-green-400">源码包含什么？</h3>
          <p class="text-white/60 text-sm leading-relaxed">包含完整的HTML、CSS和JavaScript文件，您可以将其部署到任何您喜欢的服务器上。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import SubscriptionPlans from '@/components/SubscriptionPlans.vue'
  import { useUserStore } from '@/store/user'
  import { useRouter } from 'vue-router'
  import { ArrowLeft } from '@element-plus/icons-vue'

  const userStore = useUserStore()
  const router = useRouter()
</script>
