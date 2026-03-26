<template>
  <el-form
    ref="formRef"
    :model="loginForm"
    :rules="loginRules"
    @submit.prevent="handleLogin"
    class="space-y-4 sm:space-y-6"
  >
    <el-form-item prop="email">
      <el-input
        v-model="loginForm.email"
        placeholder="邮箱地址"
        type="email"
        class="custom-input"
      >
        <template #prefix>
          <el-icon><Message /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        placeholder="密码"
        type="password"
        show-password
        class="custom-input"
      >
        <template #prefix>
          <el-icon><Lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <div class="flex items-center justify-between">
      <el-checkbox v-model="loginForm.remember" class="text-sm text-gray-600">
        记住我
      </el-checkbox>
      <a 
        href="#" 
        class="text-sm text-primary-600 hover:text-primary-500"
        @click.prevent="handleForgotPassword"
      >
        忘记密码？
      </a>
    </div>

    <div>
      <el-button
        type="primary"
        native-type="submit"
        :loading="loading"
        class="w-full py-2 px-4 rounded-md h-[44px]"
      >
        登录
      </el-button>
    </div>
  </el-form>

  <div class="mt-6">
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500">或通过以下方式登录</span>
      </div>
    </div>

    <div class="mt-4 sm:mt-6 grid grid-cols-3 gap-3">
      <button
        type="button"
        @click="handleWeChatLogin"
        class="w-full inline-flex justify-center items-center py-2 px-2 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
      >
        <el-icon size="18" color="#07C160" class="mr-1"><WeChat /></el-icon>
        微信
      </button>
      <button
        type="button"
        @click="handleQQLogin"
        class="w-full inline-flex justify-center items-center py-2 px-2 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
      >
        <el-icon size="18" color="#12B7F5" class="mr-1"><QQ /></el-icon>
        QQ
      </button>
      <button
        type="button"
        @click="handleGitHubLogin"
        class="w-full inline-flex justify-center items-center py-2 px-2 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
      >
        <el-icon size="18" color="#24292e" class="mr-1"><GitHub /></el-icon>
        GitHub
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/user';
import { STORAGE_KEYS, storage } from '@/config/storage';
import { ElMessage } from 'element-plus';
import { Message, Lock } from '@element-plus/icons-vue';
import WeChat from '@/components/icons/WeChat.vue';
import QQ from '@/components/icons/QQ.vue';
import GitHub from '@/components/icons/GitHub.vue';
import { sha1 } from '@/utils/crypto';
import { useUIStore } from '@/store/ui';

const props = defineProps({
  redirect: {
    type: String,
    default: ''
  },
  inModal: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['success']);

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const uiStore = useUIStore();

const formRef = ref(null);
const loginForm = reactive({
  email: '',
  password: '',
  remember: false
});

onMounted(() => {
  const remembered = storage.get(STORAGE_KEYS.REMEMBER_ME);
  if (remembered) {
    try {
      const { email, password, remember } = remembered;
      if (remember) {
        loginForm.email = email;
        // Simple base64 decoding
        loginForm.password = atob(password);
        loginForm.remember = true;
      }
    } catch (e) {
      storage.remove(STORAGE_KEYS.REMEMBER_ME);
    }
  }
});

const loginRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ]
};
const loading = ref(false);

const handleLogin = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      
      try {
        await userStore.login({
          email: loginForm.email,
          password: sha1(loginForm.password),
          remember: loginForm.remember
        });
        
        // 记住我功能
        if (loginForm.remember) {
          storage.set(STORAGE_KEYS.REMEMBER_ME, {
            email: loginForm.email,
            password: btoa(loginForm.password), // Simple base64 encoding
            remember: true
          });
        } else {
          storage.remove(STORAGE_KEYS.REMEMBER_ME);
        }

        ElMessage.success('登录成功');
        emit('success');
        
        // 如果提供了 redirect 属性或路由中有 redirect 参数，则跳转
        // 注意：如果是弹窗模式，父组件负责关闭弹窗，这里的跳转可能需要根据情况处理
        // 如果是在独立页面，则必须跳转
        let redirectPath = props.redirect || route.query.redirect;
        
        // 如果没有 redirect 参数，尝试从 storage 获取
        if (!redirectPath) {
          redirectPath = storage.get(STORAGE_KEYS.AUTH_REDIRECT_URL);
          storage.remove(STORAGE_KEYS.AUTH_REDIRECT_URL); // 使用后清除
        }
        
        if (redirectPath && !props.inModal) { // 只有非弹窗模式才自动跳转，或者弹窗模式下由父组件处理跳转
           router.push(redirectPath);
        } else if (!props.inModal) {
           router.push('/');
        }
        
      } catch (err) {
        console.info('login error', err)
        const errorMessage = err.response?.data?.message || '登录失败';
        ElMessage.error(errorMessage);
      } finally {
        loading.value = false;
      }
    }
  });
};

const handleWeChatLogin = () => {
  ElMessage.info('微信登录功能开发中，敬请期待！');
  // TODO: 实现微信登录逻辑
};

const handleQQLogin = () => {
  // 保存当前的重定向地址
  let redirectPath = props.redirect || route.query.redirect;
  
  // 如果没有指定重定向地址，且当前不在登录页面，则保存当前页面的完整路径
  if (!redirectPath && route.path !== '/login') {
    redirectPath = route.fullPath;
  }
  
  if (redirectPath) {
    storage.set(STORAGE_KEYS.AUTH_REDIRECT_URL, redirectPath);
  }
  
  // 使用 window.location.href 直接跳转到后端 OAuth 登录接口
  // 后端会重定向到 QQ 授权页面
  // 授权成功后 QQ 会回调后端，后端再重定向回前端 /auth/callback 页面
  window.location.href = '/api/v1/auth/qq/login';
};

const handleGitHubLogin = () => {
  // 保存当前的重定向地址
  let redirectPath = props.redirect || route.query.redirect;
  
  // 如果没有指定重定向地址，且当前不在登录页面，则保存当前页面的完整路径
  if (!redirectPath && route.path !== '/login') {
    redirectPath = route.fullPath;
  }
  
  if (redirectPath) {
    storage.set(STORAGE_KEYS.AUTH_REDIRECT_URL, redirectPath);
  }
  
  window.location.href = '/api/v1/auth/github/login';
};

const handleForgotPassword = () => {
  if (props.inModal) {
    uiStore.closeAuthModal();
  }
  router.push('/forgot-password');
};
</script>

<style scoped>
.custom-input :deep(.el-input__inner) {
  height: 48px;
  border-radius: 8px;
}

.custom-input :deep(.el-input__prefix) {
  left: 12px;
}

.custom-input :deep(.el-input__inner) {
  padding-left: 40px;
}
</style>
