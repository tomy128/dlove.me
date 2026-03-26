<template>
  <el-form
    ref="formRef"
    :model="registerForm"
    :rules="registerRules"
    @submit.prevent="handleRegister"
    class="space-y-4 sm:space-y-6"
  >
    <el-form-item prop="nickname">
      <el-input
        v-model="registerForm.nickname"
        placeholder="昵称"
        class="custom-input"
      >
        <template #prefix>
          <el-icon><User /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="email">
      <el-input
        v-model="registerForm.email"
        placeholder="邮箱地址"
        type="email"
        class="custom-input"
      >
        <template #prefix>
          <el-icon><Message /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="code">
      <div class="flex space-x-3">
        <el-input
          v-model="registerForm.code"
          placeholder="验证码"
          class="custom-input flex-1"
        >
          <template #prefix>
            <el-icon><Key /></el-icon>
          </template>
        </el-input>
        <el-button 
          type="primary" 
          plain 
          :disabled="!!timer || !canSendCode"
          @click="handleSendCode"
          class="!h-[48px] !rounded-lg w-32"
        >
          {{ timer ? `${timer}s` : '获取验证码' }}
        </el-button>
      </div>
    </el-form-item>

    <el-form-item prop="password">
      <el-input
        v-model="registerForm.password"
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

    <el-form-item prop="confirmPassword">
      <el-input
        v-model="registerForm.confirmPassword"
        placeholder="确认密码"
        type="password"
        show-password
        class="custom-input"
      >
        <template #prefix>
          <el-icon><Lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <div class="flex items-start sm:items-center">
      <el-checkbox v-model="registerForm.agreeTerms" class="text-xs sm:text-sm text-gray-600">
        我已阅读并同意
        <router-link to="/terms" target="_blank" class="text-primary-600 hover:text-primary-500">服务条款</router-link>
        和
        <router-link to="/privacy" target="_blank" class="text-primary-600 hover:text-primary-500">隐私政策</router-link>
      </el-checkbox>
    </div>

    <div>
      <el-button
        type="primary"
        native-type="submit"
        :loading="loading"
        class="w-full py-2 px-4 rounded-md h-[44px]"
      >
        注册
      </el-button>
    </div>
  </el-form>

  <div class="mt-6">
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500">或通过以下方式注册</span>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-2 gap-3">
      <button
        type="button"
        @click="handleWeChatRegister"
        class="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
      >
        <el-icon size="20" color="#07C160" class="mr-2"><WeChat /></el-icon>
        微信注册
      </button>
      <button
        type="button"
        @click="handleQQRegister"
        class="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
      >
        <el-icon size="20" color="#12B7F5" class="mr-2"><QQ /></el-icon>
        QQ注册
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/user';
import { ElMessage } from 'element-plus';
import { User, Message, Lock, Key } from '@element-plus/icons-vue';
import WeChat from '@/components/icons/WeChat.vue';
import QQ from '@/components/icons/QQ.vue';
import { sendCode } from '@/api/auth';
import { sha1 } from '@/utils/crypto';
import { STORAGE_KEYS, storage } from '@/config/storage';

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

const emit = defineEmits(['success', 'switchToLogin']);

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const formRef = ref(null);
const registerForm = reactive({
  nickname: '',
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
});

const timer = ref(0);
let intervalId = null;

// 是否可以发送验证码
const canSendCode = computed(() => {
  return registerForm.email && /.+@.+\..+/.test(registerForm.email);
});

// 发送验证码
const handleSendCode = async () => {
  if (!canSendCode.value) return;
  
  try {
    await sendCode({
      target: registerForm.email,
      type: 'register'
    });
    
    ElMessage.success('验证码已发送');
    startTimer();
  } catch (error) {
    console.error(error);
    ElMessage.error(error.response?.data?.message || '发送验证码失败');
  }
};

// 倒计时
const startTimer = () => {
  timer.value = 60;
  intervalId = setInterval(() => {
    timer.value--;
    if (timer.value <= 0) {
      clearInterval(intervalId);
    }
  }, 1000);
};

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'));
  } else {
    callback();
  }
};

const registerRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 1, max: 10, message: '昵称长度应在1到10个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度为6位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' }
  ],
  agreeTerms: [
    { validator: (rule, value, callback) => {
      if (!value) {
        callback(new Error('请阅读并同意服务条款和隐私政策'));
      } else {
        callback();
      }
    }, trigger: 'change' }
  ]
};

const loading = ref(false);

const handleRegister = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      
      try {
        await userStore.register({
          nickname: registerForm.nickname,
          email: registerForm.email,
          code: registerForm.code,
          password: sha1(registerForm.password)
        });
        
        ElMessage.success('注册成功，请登录');
        emit('switchToLogin');
        
        if (!props.inModal) {
           // 检查是否有重定向地址
           let redirectPath = props.redirect || route.query.redirect;
           if (!redirectPath) {
             redirectPath = storage.get(STORAGE_KEYS.AUTH_REDIRECT_URL);
             // 注意：这里不清除 storage，因为可能还需要传给 login 页面使用
           }
           
           if (redirectPath) {
             router.push({ path: '/login', query: { redirect: redirectPath } });
           } else {
             router.push({ path: '/login' });
           }
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || '注册失败，请稍后再试';
        ElMessage.error(errorMessage);
      } finally {
        loading.value = false;
      }
    }
  });
};

const handleWeChatRegister = () => {
  ElMessage.info('微信注册功能开发中，敬请期待！');
  // TODO: 实现微信注册逻辑
};

const handleQQRegister = () => {
  // 保存当前的重定向地址（如果有）
  let redirectPath = props.redirect || route.query.redirect;
  
  // 如果没有指定重定向地址，且当前不在注册页面，则保存当前页面的完整路径
  if (!redirectPath && route.path !== '/register') {
    redirectPath = route.fullPath;
  }
  
  if (redirectPath) {
    storage.set(STORAGE_KEYS.AUTH_REDIRECT_URL, redirectPath);
  }

  // 注册和登录使用相同的 OAuth 流程
  // 后端会自动处理：如果是新用户则注册，如果是老用户则登录
  window.location.href = '/api/v1/auth/qq/login';
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
