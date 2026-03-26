<template>
  <div class="login-page bg-gray-50 min-h-screen flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white rounded-xl shadow-soft p-6 sm:p-8">
      <div class="text-center mb-6 sm:mb-8">
        <router-link to="/" class="inline-block">
          <div class="flex items-center justify-center text-xl sm:text-2xl font-bold text-primary-600">
            <el-icon class="mr-2"><Heart /></el-icon> DLove
          </div>
        </router-link>
        <h2 class="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900">登录账号</h2>
        <p class="mt-2 text-sm sm:text-base text-gray-600">
          还没有账号？
          <router-link to="/register" class="text-primary-600 hover:text-primary-500 font-medium">
            立即注册
          </router-link>
        </p>
      </div>

      <LoginForm />
    </div>
  </div>
</template>

<script setup>
import { User, Lock, Message } from '@element-plus/icons-vue';
import Heart from '@/components/icons/Heart.vue';
import LoginForm from '@/components/auth/LoginForm.vue';
</script>

<style scoped>
/* Styles handled by component */
</style>