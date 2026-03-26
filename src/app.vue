<template>
  <div class="app-container">
    <Navbar v-if="!isAdminRoute" />
    <router-view />
    <RomanticLoading />
    <AuthModal />
  </div>
</template>

<script setup>
// App.vue 是应用的根组件
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import RomanticLoading from './components/RomanticLoading.vue';
import AuthModal from './components/auth/AuthModal.vue';

const route = useRoute();

// 判断是否为后台路由
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin');
});
</script>

<style>
.app-container {
  min-height: 100vh;
  width: 100%;
}
</style>