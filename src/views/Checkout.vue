<template>
  <div class="checkout-page bg-gradient-to-br from-rose-50 to-purple-50 min-h-screen py-12 flex items-center justify-center">
    <div class="container-custom max-w-2xl w-full">
      
      <PaymentSuccess 
        v-if="showSuccess" 
        :order="order"
        @close="handleSuccessClose"
        @view-order="handleViewOrder"
      />

      <div v-else-if="loading" class="flex justify-center py-12">
        <el-skeleton :rows="5" animated />
      </div>

      <template v-else-if="order">
        <!-- 头部引导 -->
        <div class="text-center mb-10 animate-fade-in-up">
          <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-glow mx-auto mb-6">
             <el-icon class="text-4xl text-primary-500 animate-pulse-slow"><Lock /></el-icon>
          </div>
          <h1 class="text-3xl font-display font-bold mb-3 text-gray-800">解锁这份心意</h1>
          <p class="text-gray-500 text-lg">只差最后一步，就能将这份惊喜送给 TA</p>
        </div>

        <!-- 订单卡片 -->
        <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/50 animate-fade-in-up" style="animation-delay: 0.1s">
          
          <!-- 商品摘要 -->
          <div class="p-8 border-b border-gray-100">
            <div class="flex items-start gap-6">
              <div class="w-24 h-24 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                <img
                  :src="order.items?.[0]?.template?.cover || 'https://via.placeholder.com/100x80'"
                  :alt="order.items?.[0]?.template?.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start mb-2">
                   <div>
                      <h2 class="text-xl font-bold text-gray-800 mb-1">{{ order.items?.[0]?.template?.name || '专属礼物' }}</h2>
                      <div class="flex items-center gap-2">
                         <span class="px-2 py-0.5 bg-primary-50 text-primary-600 text-xs rounded-md">永久授权</span>
                         <span class="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-md">包含源码</span>
                      </div>
                   </div>
                   <div class="text-right">
                      <div class="text-2xl font-bold text-primary-600">{{ formatDCoin(order.amount) }}</div>
                      <div class="text-xs text-gray-400 line-through">原价 {{ formatDCoin(order.amount * 2) }}</div>
                   </div>
                </div>
                <p class="text-gray-500 text-sm mt-3 leading-relaxed">
                   包含：完整模板代码、去水印分享链接、个性化编辑权限。
                </p>
              </div>
            </div>
          </div>

          <!-- 支付方式选择 -->
          <div class="p-8 bg-gray-50/50">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">选择支付方式</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
               <!-- 微信支付 -->
               <div 
                  class="relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-3"
                  :class="paymentMethod === 'wechat' ? 'border-green-500 bg-green-50/30 shadow-sm' : 'border-gray-200 bg-white hover:border-green-200'"
                  @click="paymentMethod = 'wechat'"
               >
                  <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                     <el-icon class="text-xl"><ChatDotRound /></el-icon>
                  </div>
                  <div>
                     <div class="font-bold text-gray-800">微信支付</div>
                     <div class="text-xs text-gray-500">推荐使用</div>
                  </div>
                  <div v-if="paymentMethod === 'wechat'" class="absolute top-3 right-3 text-green-500">
                     <el-icon><Select /></el-icon>
                  </div>
               </div>

               <!-- 支付宝 -->
               <div 
                  class="relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-3"
                  :class="paymentMethod === 'alipay' ? 'border-blue-500 bg-blue-50/30 shadow-sm' : 'border-gray-200 bg-white hover:border-blue-200'"
                  @click="paymentMethod = 'alipay'"
               >
                  <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                     <el-icon class="text-xl"><Money /></el-icon>
                  </div>
                  <div>
                     <div class="font-bold text-gray-800">支付宝</div>
                     <div class="text-xs text-gray-500">安全快捷</div>
                  </div>
                  <div v-if="paymentMethod === 'alipay'" class="absolute top-3 right-3 text-blue-500">
                     <el-icon><Select /></el-icon>
                  </div>
               </div>

               <!-- 余额支付 (测试专用) -->
               <div 
                  class="relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-3 sm:col-span-2"
                  :class="paymentMethod === 'wallet' ? 'border-orange-500 bg-orange-50/30 shadow-sm' : 'border-gray-200 bg-white hover:border-orange-200'"
                  @click="paymentMethod = 'wallet'"
               >
                  <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                     <el-icon class="text-xl"><Wallet /></el-icon>
                  </div>
                  <div>
                     <div class="font-bold text-gray-800">余额支付</div>
                     <div class="text-xs text-gray-500">方便快捷 (测试推荐)</div>
                  </div>
                  <div v-if="paymentMethod === 'wallet'" class="absolute top-3 right-3 text-orange-500">
                     <el-icon><Select /></el-icon>
                  </div>
               </div>
            </div>

            <!-- 操作按钮 -->
            <el-button
              type="primary"
              size="large"
              class="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all transform hover:-translate-y-0.5"
              :loading="payLoading"
              @click="handlePay"
            >
              立即解锁 ({{ formatDCoin(order.amount) }})
            </el-button>
            
            <div class="mt-4 text-center">
               <router-link to="/templates" class="text-gray-400 text-sm hover:text-gray-600 transition-colors">
                  暂不购买，返回浏览
               </router-link>
            </div>
          </div>
        </div>
        
        <!-- 安全提示 -->
        <div class="text-center mt-8 text-gray-400 text-xs flex justify-center gap-6 animate-fade-in-up" style="animation-delay: 0.2s">
           <span class="flex items-center"><el-icon class="mr-1"><Lock /></el-icon> SSL 安全支付</span>
           <span class="flex items-center"><el-icon class="mr-1"><CircleCheck /></el-icon> 7天无理由退款</span>
           <span class="flex items-center"><el-icon class="mr-1"><Service /></el-icon> 24小时客服支持</span>
        </div>

        <!-- 支付二维码弹窗 -->
        <el-dialog
          v-model="paymentDialogVisible"
          title="扫码解锁浪漫"
          width="360px"
          center
          destroy-on-close
          class="rounded-2xl overflow-hidden"
        >
          <div class="text-center py-4">
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-inner mb-6 inline-block relative">
              <img
                :src="paymentQrCode"
                alt="支付二维码"
                class="w-48 h-48 mx-auto"
              />
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                 <el-icon class="text-6xl text-primary-500"><Loading /></el-icon>
              </div>
            </div>
            <p class="text-gray-600 mb-2">请使用<span class="font-bold text-gray-800">{{ paymentMethodName }}</span>扫一扫</p>
            <p class="text-primary-600 font-bold text-2xl mb-6 font-display">{{ formatDCoin(order.amount) }}</p>
            
            <div class="flex gap-3 justify-center">
               <el-button @click="paymentDialogVisible = false">取消</el-button>
               <el-button type="success" @click="checkPaymentStatus" :loading="payLoading">我已支付</el-button>
            </div>
          </div>
        </el-dialog>
      </template>

      <div v-else class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
           <el-icon class="text-4xl text-gray-300"><Warning /></el-icon>
        </div>
        <p class="text-gray-500 text-lg mb-6">订单好像迷路了...</p>
        <router-link to="/templates" class="btn-primary py-3 px-8 rounded-full shadow-lg">
          返回灵感市集
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '@/store/order';
import PaymentSuccess from '@/components/PaymentSuccess.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Lock, CircleCheck, Service, ChatDotRound, Money, Select, Loading, Warning, Wallet } from '@element-plus/icons-vue';
import { formatDCoin } from '@/config/currency'
import { formatDate } from '@/utils/date'
import QRCode from 'qrcode'

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

// 状态
const loading = ref(true);
const payLoading = ref(false);
const showSuccess = ref(false);
const paymentMethod = ref('wechat'); // 默认微信支付
const paymentDialogVisible = ref(false);
const paymentQrCode = ref('');

// 获取订单数据
const order = computed(() => orderStore.currentOrder);

const handleSuccessClose = () => {
  router.push('/user/purchases');
};

const handleViewOrder = () => {
  router.push('/user/purchases');
};

onMounted(async () => {
  const orderId = route.params.id;
  try {
    await orderStore.fetchOrderById(orderId);
  } catch (error) {
    ElMessage.error(error?.response?.data?.message || error?.message || '获取订单信息失败');
  } finally {
    loading.value = false;
  }
});

// // 支付方式名称
const paymentMethodName = computed(() => {
  const methods = {
    alipay: '支付宝',
    wechat: '微信',
    wallet: '余额支付'
  };
  return methods[paymentMethod.value] || '未知';
});

// 处理支付
const handlePay = async () => {
  if (!paymentMethod.value) {
    ElMessage.warning('请选择支付方式');
    return;
  }

  payLoading.value = true;
  try {
    // 余额支付直接处理
    if (paymentMethod.value === 'wallet') {
      try {
        await ElMessageBox.confirm(
          `确定使用余额支付 ${formatDCoin(order.value.amount)} 吗？`,
          '支付确认',
          {
            confirmButtonText: '确定支付',
            cancelButtonText: '取消',
            type: 'info',
          }
        );
      } catch {
        payLoading.value = false;
        return;
      }

      const paymentResult = await orderStore.createPayment({
        order_id: order.value.id,
        payment_method: 'wallet'
      });

      console.log('余额支付结果:', paymentResult);

      // 检查支付结果 (根据后端返回结构)
      // 成功通常直接返回 success: true 且 data 中有 paid: true 或 status: 1
      const isSuccess = paymentResult?.status === 1
      
      if (isSuccess) {
        ElMessage.success('支付成功！');
        showSuccess.value = true;
        return;
      } else {
        // 如果后端返回了错误信息
        throw new Error(paymentResult?.error || paymentResult?.message);
      }
    }

    // 第三方支付
    const paymentResult = await orderStore.createPayment({
      order_id: order.value.id,
      payment_method: paymentMethod.value
    });

    console.log('支付结果:', paymentResult);
    const qrContent = paymentResult?.payment_params?.qr_code || paymentResult?.payment_params?.code_url || '';
    if (!qrContent) {
      ElMessage.error('未获取到支付二维码信息');
      return;
    }
    try {
      paymentQrCode.value = await QRCode.toDataURL(qrContent, { width: 192, margin: 1 });
    } catch (e) {
      paymentQrCode.value = '';
      ElMessage.error('二维码生成失败');
      return;
    }
    paymentDialogVisible.value = true;
  } catch (error) {
    console.error('支付失败:', error);
    ElMessage.error(error.message || '支付失败，请稍后再试');
  } finally {
    payLoading.value = false;
  }
};

// 检查支付状态
const checkPaymentStatus = async () => {
  try {
    const status = await orderStore.getPaymentStatus(order.value.id);
    
    if (status === 'paid') {
      paymentDialogVisible.value = false;
      showSuccess.value = true;
    } else {
      ElMessage.warning('未检测到支付完成，请确认支付状态或重新支付');
    }
  } catch (error) {
    ElMessage.error('检查支付状态失败，请稍后再试');
  }
};
</script>

<style scoped>
/* 自定义样式 */
:deep(.el-radio.is-bordered) {
  padding: 12px 20px;
  height: auto;
  margin-right: 0;
}
</style>
