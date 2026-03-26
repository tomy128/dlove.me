<template>
  <div class="admin-layout">
    <!-- 顶部导航栏 -->
    <header class="admin-header bg-white shadow-sm">
      <div class="container-fluid px-4 py-3 flex justify-between items-center">
        <div class="flex items-center">
          <!-- 侧边栏切换按钮 -->
          <button
            class="mr-4 text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
            @click="toggleSidebar"
          >
            <el-icon :size="24">
              <Menu />
            </el-icon>
          </button>
          
          <!-- Logo -->
          <router-link to="/" class="flex items-center">
            <img src="/favicon.svg" alt="DLove Logo" class="h-8 w-8 mr-2" />
            <span class="text-xl font-bold text-primary-600">DLove</span>
            <span class="ml-2 text-sm text-gray-500">管理后台</span>
          </router-link>
        </div>
        
        <!-- 用户菜单 -->
        <div class="flex items-center">
          <el-dropdown trigger="click">
            <div class="flex items-center cursor-pointer">
              <el-avatar :size="32" :src="userStore.user?.avatar">
                {{ userStore.user?.nickname?.charAt(0).toUpperCase() }}
              </el-avatar>
              <span class="ml-2 hidden sm:inline">{{ userStore.user?.nickname }}</span>
              <el-icon class="ml-1">
                <ArrowDown />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/')">
                  <el-icon><House /></el-icon>
                  <span class="ml-1">返回前台</span>
                </el-dropdown-item>
                <el-dropdown-item @click="$router.push('/user/profile')">
                  <el-icon><User /></el-icon>
                  <span class="ml-1">个人资料</span>
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  <span class="ml-1">退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>
    
    <div class="admin-container flex">
      <!-- 侧边栏 -->
      <aside
        class="admin-sidebar bg-gray-800 text-white"
        :class="{ 'sidebar-collapsed': !sidebarOpen }"
      >
        <div class="py-4">
          <el-menu
            :default-active="activeMenu"
            class="admin-menu"
            :collapse="!sidebarOpen"
            :collapse-transition="false"
            :close-on-click-outside="true"
            background-color="#1f2937"
            text-color="#e5e7eb"
            active-text-color="#ffffff"
          >
            <el-menu-item index="/admin" @click="$router.push('/admin')">
              <el-icon><DataBoard /></el-icon>
              <template #title>控制台</template>
            </el-menu-item>
            
            <el-menu-item index="/admin/templates" @click="$router.push('/admin/templates')">
              <el-icon><Picture /></el-icon>
              <template #title>模板管理</template>
            </el-menu-item>
            
            <el-menu-item index="/admin/categories" @click="$router.push('/admin/categories')">
              <el-icon><Grid /></el-icon>
              <template #title>场景管理</template>
            </el-menu-item>
            
            <el-menu-item index="/admin/users" @click="$router.push('/admin/users')">
              <el-icon><User /></el-icon>
              <template #title>用户管理</template>
            </el-menu-item>
            
            <el-menu-item index="/admin/orders" @click="$router.push('/admin/orders')">
              <el-icon><ShoppingCart /></el-icon>
              <template #title>订单管理</template>
            </el-menu-item>
            
            <el-menu-item index="/admin/settings" @click="$router.push('/admin/settings')">
              <el-icon><Setting /></el-icon>
              <template #title>系统设置</template>
            </el-menu-item>
          </el-menu>
        </div>
      </aside>
      
      <!-- 主内容区 -->
      <main class="admin-main bg-gray-50">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {
  Menu,
  ArrowDown,
  House,
  User,
  SwitchButton,
  DataBoard,
  Picture,
  Grid,
  ShoppingCart,
  Setting
} from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 侧边栏状态
const sidebarOpen = ref(window.innerWidth >= 1024) // 默认在大屏幕上展开

// 当前活动菜单
const activeMenu = computed(() => {
  return route.path
})

// 切换侧边栏
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// 处理窗口大小变化
const handleResize = () => {
  sidebarOpen.value = window.innerWidth >= 1024
}

// 处理登出
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '确认退出',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    // 用户取消操作
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-header {
  height: 64px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.admin-container {
  flex: 1;
  margin-top: 64px;
}

.admin-sidebar {
  width: 240px;
  height: calc(100vh - 64px);
  position: fixed;
  left: 0;
  top: 64px;
  overflow-y: auto;
  transition: all 0.3s ease;
  z-index: 99;
}

.sidebar-collapsed {
  width: 64px;
}

.admin-main {
  flex: 1;
  margin-left: 240px;
  min-height: calc(100vh - 64px);
  transition: margin-left 0.3s ease;
}

.sidebar-collapsed + .admin-main {
  margin-left: 64px;
}

/* 自定义 Element Plus 菜单样式 */
.admin-menu {
  border-right: none;
}

.admin-menu :deep(.el-menu-item.is-active) {
  background-color: rgba(99, 102, 241, 0.8);
}

.admin-menu :deep(.el-menu-item:hover),
.admin-menu :deep(.el-sub-menu__title:hover) {
  background-color: rgba(55, 65, 81, 0.9);
}

/* 响应式调整 */
@media (max-width: 1023px) {
  .admin-sidebar {
    transform: translateX(-100%);
    box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .admin-sidebar:not(.sidebar-collapsed) {
    transform: translateX(0);
  }
  
  .admin-main {
    margin-left: 0 !important;
  }
}
</style>