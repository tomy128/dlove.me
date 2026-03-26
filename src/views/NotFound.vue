<template>
  <div class="not-found">
    <div class="container mx-auto px-4 py-16 text-center">
      <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-8">页面未找到</h2>
      <p class="text-gray-600 mb-8">您访问的页面不存在或已被移除</p>
      <router-link to="/" class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition duration-300">
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script setup>
// 404页面不需要特殊逻辑
</script>

<style scoped>
.not-found {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>