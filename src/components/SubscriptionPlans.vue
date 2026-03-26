<template>
  <div class="subscription-plans">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
    </div>

    <!-- Comparison Grid -->
    <div v-else class="grid md:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto items-stretch">
      
      <!-- Free Plan -->
      <div class="relative p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm flex flex-col transition-transform hover:-translate-y-1 duration-300">
        <div class="mb-6 md:mb-8 text-center">
          <div class="w-12 h-12 md:w-16 md:h-16 mx-auto bg-gray-700/50 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
            <el-icon class="text-2xl md:text-3xl"><User /></el-icon>
          </div>
          <h3 class="text-xl md:text-2xl font-bold mb-2 text-white">免费版</h3>
          <p class="text-sm md:text-base text-white/60">基础功能，体验爱意表达</p>
        </div>

        <ul class="space-y-3 md:space-y-4 flex-1 mb-6 md:mb-8 pl-2 md:pl-4 text-sm md:text-base">
          <li class="flex items-start gap-3 text-white/80">
            <el-icon class="text-green-500 mt-1"><CircleCheckFilled /></el-icon>
            <span>体验制作精美作品</span>
          </li>
          <li class="flex items-start gap-3 text-white/80">
            <el-icon class="text-green-500 mt-1"><CircleCheckFilled /></el-icon>
            <span>基础存储空间 (50MB)</span>
          </li>
          <li class="flex items-start gap-3 text-white/80">
            <el-icon class="text-green-500 mt-1"><CircleCheckFilled /></el-icon>
            <span>官方域名分享</span>
          </li>
          <li class="flex items-start gap-3 text-white/30">
            <el-icon class="mt-1"><CircleCloseFilled /></el-icon>
            <span>自定义专属域名</span>
          </li>
           <li class="flex items-start gap-3 text-white/30">
            <el-icon class="mt-1"><CircleCloseFilled /></el-icon>
            <span>下载作品源码</span>
          </li>
        </ul>

        <div class="mt-auto pt-6 md:pt-8 border-t border-white/5">
          <button class="w-full py-3 md:py-4 rounded-xl font-bold bg-white/5 text-white/50 cursor-not-allowed text-sm md:text-base">
            当前版本
          </button>
        </div>
      </div>

      <!-- Premium Plan -->
      <div class="relative p-6 md:p-8 rounded-3xl border-2 border-pink-500/50 bg-gradient-to-b from-pink-500/10 to-purple-600/10 backdrop-blur-sm flex flex-col shadow-xl shadow-pink-500/5 transition-transform hover:-translate-y-1 duration-300">
        <div class="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] md:text-xs font-bold px-3 md:px-4 py-1 md:py-1.5 rounded-bl-2xl rounded-tr-2xl shadow-lg">
          推荐选择
        </div>

        <div class="mb-6 text-center">
          <div class="w-12 h-12 md:w-16 md:h-16 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg shadow-pink-500/30">
            <el-icon class="text-2xl md:text-3xl"><StarFilled /></el-icon>
          </div>
          <h3 class="text-xl md:text-2xl font-bold mb-2 text-white">订阅版</h3>
          <p class="text-sm md:text-base text-pink-200/80">解锁全部高级权益</p>
        </div>

        <!-- Plan Duration Selector -->
        <div class="flex justify-center mb-6 md:mb-8">
           <div class="inline-flex bg-white/10 border border-white/10 backdrop-blur-md rounded-xl p-1 md:p-1.5 gap-1 md:gap-2 overflow-x-auto max-w-full no-scrollbar shadow-inner">
             <div 
               v-for="plan in sortedPlans" 
               :key="plan.id"
               @click="selectPlan(plan)"
               class="cursor-pointer px-3 md:px-5 py-2 md:py-2.5 rounded-lg transition-all duration-300 whitespace-nowrap text-xs md:text-sm font-bold tracking-wide"
               :class="selectedPlanId === plan.id ? 'bg-white text-purple-600 shadow-lg scale-105' : 'text-white/90 hover:text-white hover:bg-white/10'"
             >
               {{ plan.name }}
             </div>
           </div>
        </div>

        <!-- Selected Plan Price Display -->
        <div class="text-center mb-6 md:mb-8 h-16 md:h-20" v-if="currentPlan">
           <div class="flex items-end justify-center gap-1 text-white animate-fade-in">
            <span class="text-base md:text-lg font-medium mb-2">¥</span>
            <span class="text-4xl md:text-5xl font-bold tracking-tight">{{ (currentPlan.price / 100).toFixed(2) }}</span>
            <span class="text-xs md:text-sm text-white/60 mb-2 ml-1" v-if="currentPlan.duration > 0">/ {{ currentPlan.duration }}天</span>
            <span class="text-xs md:text-sm text-white/60 mb-2 ml-1" v-else>/ 永久</span>
          </div>
          <p class="text-[10px] md:text-xs text-pink-300/80 mt-1 md:mt-2 font-medium" v-if="currentPlan.code === 'monthly'">平均仅需 ¥{{(currentPlan.price / 100 / 30).toFixed(2)}}/天</p>
          <p class="text-[10px] md:text-xs text-pink-300/80 mt-1 md:mt-2 font-medium" v-if="currentPlan.code === 'yearly'">平均仅需 ¥{{(currentPlan.price / 100 / 365).toFixed(2)}}/天</p>
          <p class="text-[10px] md:text-xs text-yellow-300/80 mt-1 md:mt-2 font-medium" v-if="currentPlan.code === 'lifetime'">一次付费，终身享受所有权益</p>
        </div>

        <ul class="space-y-3 md:space-y-4 flex-1 mb-6 md:mb-8 pl-2 md:pl-4 text-sm md:text-base">
          <li class="flex items-start gap-3 text-white">
            <el-icon class="text-pink-500 mt-1"><CircleCheckFilled /></el-icon>
            <span><strong>体验制作精美作品</strong></span>
          </li>
          <li class="flex items-start gap-3 text-white">
            <el-icon class="text-pink-500 mt-1"><CircleCheckFilled /></el-icon>
            <span><strong>自定义专属域名</strong></span>
          </li>
          <li class="flex items-start gap-3 text-white">
            <el-icon class="text-pink-500 mt-1"><CircleCheckFilled /></el-icon>
            <span><strong>下载作品源码 (HTML)</strong></span>
          </li>
          <li class="flex items-start gap-3 text-white">
            <el-icon class="text-pink-500 mt-1"><CircleCheckFilled /></el-icon>
            <span><strong>1G 超大云空间</strong></span>
          </li>
          <!-- Special highlight for lifetime if selected -->
          <li v-if="currentPlan?.code === 'lifetime'" class="flex items-start gap-3 text-yellow-300 font-bold animate-pulse">
            <el-icon class="mt-1"><Trophy /></el-icon>
            <span>尊贵永久会员标识</span>
          </li>
        </ul>

        <div class="mt-auto pt-6 md:pt-8 border-t border-white/10">
          <button 
            @click="handleSubscribe(currentPlan)"
            :disabled="submitting || !currentPlan"
            class="w-full py-3 md:py-4 rounded-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <span v-if="submitting" class="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>{{ submitting ? '处理中...' : '立即开通' }}</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getSubscriptionPlans, createSubscription } from '@/api/subscription'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, StarFilled, CircleCheckFilled, CircleCloseFilled, Trophy } from '@element-plus/icons-vue'

const props = defineProps({
  compact: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['success', 'close'])

const router = useRouter()
const userStore = useUserStore()
const plans = ref([])
const loading = ref(true)
const selectedPlanId = ref(null)
const submitting = ref(false)

const currentPlan = computed(() => {
  return plans.value.find(p => p.id === selectedPlanId.value)
})

const sortedPlans = computed(() => {
  // Define sort order: monthly, yearly, lifetime, others
  const order = ['daily', 'monthly', 'yearly', 'lifetime']
  return [...plans.value].sort((a, b) => {
    const indexA = order.indexOf(a.code)
    const indexB = order.indexOf(b.code)
    // If both found in order list
    if (indexA !== -1 && indexB !== -1) return indexA - indexB
    // If only A found, A comes first
    if (indexA !== -1) return -1
    // If only B found, B comes first
    if (indexB !== -1) return 1
    // Default to price ascending
    return a.price - b.price
  })
})

const fetchPlans = async () => {
  try {
    loading.value = true
    const res = await getSubscriptionPlans()
    plans.value = res.data.data
    // Default select monthly
    const defaultPlan = plans.value.find(p => p.code === 'monthly') || plans.value[0]
    if (defaultPlan) {
      selectedPlanId.value = defaultPlan.id
    }
  } catch (e) {
    ElMessage.error('获取套餐失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const selectPlan = (plan) => {
  selectedPlanId.value = plan.id
}

const handleSubscribe = async (plan) => {
  if (!plan) return
  
  // Check login
  if (!userStore.token) {
    router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
    return
  }

  selectedPlanId.value = plan.id
  submitting.value = true

  try {
    await createSubscription({
      plan_id: plan.id,
      amount: plan.price
    })
    
    // Refresh user info
    await userStore.fetchUserInfo()
    
    ElMessage.success('开通成功！')
    emit('success')
  } catch (e) {
    console.error(e)
    ElMessage.error('开通失败: ' + (e.response?.data?.message || e.message))
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchPlans()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
