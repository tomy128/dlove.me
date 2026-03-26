<template>
  <el-dialog
    v-model="visible"
    :width="isMobile ? '90%' : '420px'"
    class="auth-modal rounded-xl overflow-hidden !p-0"
    :show-close="true"
    destroy-on-close
    align-center
    :before-close="handleClose"
  >
    <div class="bg-white p-6 sm:p-8">
      <div class="text-center mb-6 sm:mb-8">
        <div class="flex items-center justify-center text-xl sm:text-2xl font-bold text-primary-600">
          <el-icon class="mr-2"><Heart /></el-icon> DLove
        </div>
        <h2 class="mt-4 text-xl sm:text-2xl font-bold text-gray-900">
          {{ activeTab === 'login' ? '欢迎回来' : '创建账号' }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ activeTab === 'login' ? '还没有账号？' : '已有账号？' }}
          <button 
            @click="switchTab" 
            class="text-primary-600 hover:text-primary-500 font-medium focus:outline-none"
          >
            {{ activeTab === 'login' ? '立即注册' : '立即登录' }}
          </button>
        </p>
      </div>

      <div v-if="activeTab === 'login'">
        <LoginForm :in-modal="true" @success="handleSuccess" />
      </div>
      <div v-else>
        <RegisterForm :in-modal="true" @switch-to-login="activeTab = 'login'" />
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue';
import { useUIStore } from '@/store/ui';
import LoginForm from './LoginForm.vue';
import RegisterForm from './RegisterForm.vue';
import Heart from '@/components/icons/Heart.vue';
import { useWindowSize } from '@vueuse/core';

const uiStore = useUIStore();
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 640);

const visible = computed({
  get: () => uiStore.authModalVisible,
  set: (value) => {
    if (!value) uiStore.closeAuthModal();
  }
});

const activeTab = computed({
  get: () => uiStore.authModalTab,
  set: (value) => uiStore.setAuthModalTab(value)
});

const handleClose = (done) => {
  uiStore.closeAuthModal();
  done();
};

const switchTab = () => {
  activeTab.value = activeTab.value === 'login' ? 'register' : 'login';
};

const handleSuccess = () => {
  uiStore.closeAuthModal();
};
</script>

<style scoped>
:deep(.auth-modal) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  display: none;
}

:deep(.el-dialog__body) {
  padding: 0;
}
</style>
