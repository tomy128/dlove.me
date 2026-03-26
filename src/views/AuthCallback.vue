<template>
  <div class="auth-callback-page min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div class="text-center p-8 bg-white rounded-xl shadow-soft max-w-md w-full">
      <div v-if="loading" class="flex flex-col items-center">
        <el-icon class="is-loading text-4xl text-primary-600 mb-4"><Loading /></el-icon>
        <h2 class="text-xl font-bold text-gray-900 mb-2">正在登录中...</h2>
        <p class="text-gray-600">请稍候，正在处理您的授权信息</p>
      </div>
      
      <div v-else-if="error" class="flex flex-col items-center">
        <el-icon class="text-4xl text-red-500 mb-4"><CircleCloseFilled /></el-icon>
        <h2 class="text-xl font-bold text-gray-900 mb-2">登录失败</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <el-button type="primary" @click="goToLogin">返回登录页</el-button>
      </div>
      
      <div v-else class="flex flex-col items-center">
        <el-icon class="text-4xl text-green-500 mb-4"><CircleCheckFilled /></el-icon>
        <h2 class="text-xl font-bold text-gray-900 mb-2">登录成功</h2>
        <p class="text-gray-600 mb-4">正在跳转...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import { ElMessage } from 'element-plus';
import { Loading, CircleCloseFilled, CircleCheckFilled } from '@element-plus/icons-vue';
import { getUserInfo } from '@/api/user';
import { STORAGE_KEYS, storage } from '@/config/storage';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const loading = ref(true);
const error = ref('');

onMounted(async () => {
  // 从URL参数中获取token或error
  const token = route.query.token;
  const errorMsg = route.query.error;
  
  if (errorMsg) {
    loading.value = false;
    error.value = decodeURIComponent(errorMsg);
    return;
  }
  
  if (token) {
    try {
      // 1. 保存token
      userStore.token = token;
      storage.set(STORAGE_KEYS.TOKEN, token);
      
      // 2. 获取用户信息
      const response = await getUserInfo();
      // getUserInfo 返回的是 { data: { ... }, body: { ... } }
      // setUserData 期望的格式可能不完全匹配，特别是 bearer_token 字段
      // 我们需要构造一个符合 setUserData 期望的对象，或者单独设置 user
      
      const userData = response.body;
      // 补充 bearer_token，因为 setUserData 需要它来设置 token
      userData.bearer_token = token;
      
      userStore.setUserData(userData);
      
      loading.value = false;
      ElMessage.success('登录成功');
      
      // 3. 跳转到首页或之前访问的页面
      // 检查是否有重定向参数
      const redirectPath = storage.get(STORAGE_KEYS.AUTH_REDIRECT_URL) || '/';
      // 清除存储的重定向地址
      storage.remove(STORAGE_KEYS.AUTH_REDIRECT_URL);
      router.push(redirectPath);
      
    } catch (err) {
      console.error('Login callback error:', err);
      loading.value = false;
      error.value = '获取用户信息失败，请重试';
    }
  } else {
    loading.value = false;
    error.value = '未收到授权信息';
  }
});

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.auth-callback-page {
  /* 确保在移动端也能居中显示 */
  min-height: 100vh;
}
</style>
