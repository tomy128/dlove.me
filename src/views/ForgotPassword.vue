<template>
  <div class="forgot-password-page bg-gray-50 min-h-screen flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white rounded-xl shadow-soft p-6 sm:p-8">
      <div class="text-center mb-6 sm:mb-8">
        <router-link to="/" class="inline-block">
          <div class="flex items-center justify-center text-xl sm:text-2xl font-bold text-primary-600">
            <el-icon class="mr-2"><Heart /></el-icon> DLove
          </div>
        </router-link>
        <h2 class="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900">重置密码</h2>
        <p class="mt-2 text-sm sm:text-base text-gray-600">
          请输入您的注册邮箱或手机号以重置密码
        </p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        @submit.prevent="handleSubmit"
        class="space-y-4 sm:space-y-6"
      >
        <!-- 账号输入 -->
        <el-form-item prop="target">
          <el-input
            v-model="form.target"
            placeholder="邮箱地址或手机号"
            class="custom-input"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 验证码 -->
        <el-form-item prop="code">
          <div class="flex space-x-3">
            <el-input
              v-model="form.code"
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

        <!-- 新密码 -->
        <el-form-item prop="newPassword">
          <el-input
            v-model="form.newPassword"
            placeholder="新密码"
            type="password"
            show-password
            class="custom-input"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            placeholder="确认新密码"
            type="password"
            show-password
            class="custom-input"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <div>
          <el-button
            type="primary"
            native-type="submit"
            :loading="loading"
            class="w-full py-2 px-4 rounded-md !h-[48px] !text-lg"
          >
            重置密码
          </el-button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="text-sm text-primary-600 hover:text-primary-500 font-medium">
            返回登录
          </router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock, Key } from '@element-plus/icons-vue';
import Heart from '@/components/icons/Heart.vue';
import { sendCode, resetPassword } from '@/api/auth';
import { sha1 } from '@/utils/crypto';

const router = useRouter();
const formRef = ref(null);
const loading = ref(false);
const timer = ref(0);
let intervalId = null;

const form = reactive({
  target: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
});

// 验证规则
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== form.newPassword) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};

const rules = {
  target: [
    { required: true, message: '请输入邮箱或手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度为6位', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validatePass2, trigger: 'blur' }
  ]
};

// 是否可以发送验证码
const canSendCode = computed(() => {
  return form.target && form.target.length > 5;
});

// 发送验证码
const handleSendCode = async () => {
  if (!canSendCode.value) return;
  
  try {
    await sendCode({
      target: form.target,
      type: 'reset_password'
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

// 提交重置
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        await resetPassword({
          target: form.target,
          code: form.code,
          new_password: sha1(form.newPassword)
        });
        
        ElMessage.success('密码重置成功，请重新登录');
        router.push('/login');
      } catch (error) {
        console.error(error);
        ElMessage.error(error.response?.data?.message || '重置密码失败');
      } finally {
        loading.value = false;
      }
    }
  });
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
