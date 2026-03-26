<template>
  <nav class="navbar transition-all duration-300 z-50 sticky top-0"
    :class="isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'">
    <div class="container-custom py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center group">
          <div class="flex items-center text-2xl font-display font-bold">
            <div
              class="logo-icon mr-2 text-primary-600 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
              <el-icon class="text-3xl">
                <Heart />
              </el-icon>
            </div>
            <span class="gradient-text-warm">DLove</span>
          </div>
        </router-link>

        <!-- 导航链接 - 桌面端 -->
        <div class="hidden md:flex items-center space-x-10">
          <router-link to="/templates" class="nav-link text-lg">灵感市集</router-link>
          <router-link to="/pricing" class="nav-link text-lg">会员套餐</router-link>
        </div>

        <!-- 用户菜单 - 桌面端 -->
        <div class="hidden md:flex items-center space-x-5">
          <template v-if="isLoggedIn">
            <el-dropdown trigger="click" popper-class="user-dropdown-popper">
              <div
                class="flex items-center cursor-pointer hover:text-primary-600 transition-all duration-300 py-1 px-2 rounded-full hover:bg-white/50 group">
                <el-avatar :size="36" :src="userAvatar"
                  class="border-2 border-white shadow-sm group-hover:border-primary-200 transition-colors">
                  <el-icon>
                    <User />
                  </el-icon>
                </el-avatar>
                <span class="ml-2 font-medium">{{ userInfo?.nickname || userInfo?.username }}</span>
                <el-icon class="ml-1 transition-transform duration-300 group-hover:rotate-180">
                  <ArrowDown />
                </el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu class="user-dropdown-menu">
                  <div class="px-4 py-3 border-b border-gray-100 min-w-[240px]">
                    <!-- User Info & Membership Badge -->
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-bold text-gray-800 truncate max-w-[120px]">{{ userInfo?.nickname || userInfo?.username }}</span>
                      <span v-if="isPremium" class="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-600 text-xs font-bold flex items-center gap-1">
                        <el-icon><Trophy /></el-icon> 会员
                      </span>
                      <span v-else class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">普通用户</span>
                    </div>
                    
                    <!-- Validity -->
                    <div v-if="isPremium" class="text-xs text-gray-500 mb-3">
                      有效期至: {{ formatDate(subscription?.end_time) || '永久' }}
                    </div>
                    <div v-else class="text-xs text-gray-500 mb-3">
                      升级解锁更多权益
                    </div>

                    <!-- Storage Usage -->
                    <div class="mb-1 flex justify-between text-xs text-gray-500">
                      <span>存储空间</span>
                      <span>{{ formatSize(storageUsage.used) }} / {{ formatSize(storageUsage.limit) }}</span>
                    </div>
                    <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
                      <div class="h-full bg-gradient-to-r from-pink-500 to-purple-600" :style="{ width: `${(storageUsage.used / storageUsage.limit) * 100}%` }"></div>
                    </div>

                    <!-- Upgrade Button -->
                    <router-link to="/pricing" class="block text-center py-1.5 text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:shadow-md transition-all">
                      {{ isPremium ? '续费会员' : '立即升级' }}
                    </router-link>
                  </div>
                  <el-dropdown-item>
                    <router-link to="/user/profile" class="flex items-center w-full py-1">
                      <el-icon class="mr-3 text-primary-500">
                        <UserFilled />
                      </el-icon> 个人空间
                    </router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link to="/user/purchases" class="flex items-center w-full py-1">
                      <el-icon class="mr-3 text-primary-500">
                        <Present />
                      </el-icon> 我的礼物盒
                    </router-link>
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">
                    <div class="flex items-center text-red-500 py-1">
                      <el-icon class="mr-3">
                        <SwitchButton />
                      </el-icon> 退出登录
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <button @click="uiStore.openAuthModal('login')"
              class="btn-text px-4 py-2 hover:bg-primary-50 rounded-full transition-colors">登录</button>
            <button @click="uiStore.openAuthModal('register')" 
              class="btn-primary rounded-xl shadow-glow-blue px-6">免费注册</button>
          </template>
        </div>

        <!-- 移动端菜单按钮 -->
        <div class="md:hidden">
          <button ref="mobileMenuButtonRef" @click.stop="mobileMenuOpen = !mobileMenuOpen"
            class="p-2 rounded-full hover:bg-primary-50 transition-colors">
            <el-icon v-if="!mobileMenuOpen" class="text-2xl text-primary-600">
              <Menu />
            </el-icon>
            <el-icon v-else class="text-2xl text-primary-600">
              <Close />
            </el-icon>
          </button>
        </div>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <div v-show="mobileMenuOpen" ref="mobileMenuRef"
      class="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 py-6 shadow-card absolute w-full left-0 top-full animate-fadeIn">
      <div class="container-custom space-y-5">
        <div class="border-t border-gray-100 my-3 pt-3">
          <template v-if="isLoggedIn">
            <div class="flex items-center py-3 mb-2 border-b border-gray-100 pb-4">
              <el-avatar :size="40" :src="userAvatar" class="border-2 border-primary-100 shadow-sm">
                <el-icon>
                  <User />
                </el-icon>
              </el-avatar>
              <div class="ml-3">
                <div class="font-medium text-lg">{{ userInfo?.nickname || userInfo?.username }}</div>
                <div class="text-xs text-gray-500">{{ userInfo?.email }}</div>
              </div>
            </div>

            <!-- Membership Info for Mobile -->
            <div class="px-4 py-3 mb-2 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-2">
                <span v-if="isPremium" class="text-yellow-600 text-xs font-bold flex items-center gap-1">
                  <el-icon><Trophy /></el-icon> 尊贵会员
                </span>
                <span v-else class="text-gray-500 text-xs font-bold">普通用户</span>
                <span v-if="isPremium" class="text-xs text-gray-400">{{ formatDate(subscription?.end_time) }}</span>
              </div>
              <div class="mb-1 flex justify-between text-xs text-gray-500">
                <span>存储空间</span>
                <span>{{ formatSize(storageUsage.used) }} / {{ formatSize(storageUsage.limit) }}</span>
              </div>
              <div class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-pink-500 to-purple-600" :style="{ width: `${(storageUsage.used / storageUsage.limit) * 100}%` }"></div>
              </div>
            </div>

            <router-link to="/user/profile" class="mobile-nav-item" @click="mobileMenuOpen = false">
              <el-icon><UserFilled /></el-icon> 个人空间
            </router-link>
            <router-link to="/user/purchases" class="mobile-nav-item" @click="mobileMenuOpen = false">
              <el-icon><Present /></el-icon> 我的礼物盒
            </router-link>
            <router-link to="/pricing" class="mobile-nav-item" @click="mobileMenuOpen = false">
              <el-icon><Star /></el-icon> 会员套餐
            </router-link>

            <div class="mobile-nav-item text-red-500 hover:bg-red-50 hover:text-red-600 active:bg-red-50 active:text-red-600" @click="handleLogout">
              <el-icon class="!text-red-500"><SwitchButton /></el-icon> 退出登录
            </div>
          </template>
          <template v-else>
            <div class="grid grid-cols-2 gap-4 mt-4">
              <button @click="uiStore.openAuthModal('login'); mobileMenuOpen = false" 
                class="btn-outline-primary text-center py-3">登录</button>
              <button @click="uiStore.openAuthModal('register'); mobileMenuOpen = false" 
                class="btn-primary text-center py-3">注册</button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import { useUIStore } from '@/store/ui';
import { getMySubscription } from '@/api/subscription';
import { ElMessageBox } from 'element-plus';
import { User, ArrowDown, UserFilled, ShoppingBag, Setting, SwitchButton, Menu, Close, List, Present, Monitor, Trophy, StarFilled } from '@element-plus/icons-vue';
import Heart from './icons/Heart.vue';
import { formatDate } from '@/utils/date';

const router = useRouter();
const userStore = useUserStore();
const uiStore = useUIStore();

// 移动端菜单状态
const mobileMenuOpen = ref(false);
const isScrolled = ref(false);
const mobileMenuRef = ref(null);
const mobileMenuButtonRef = ref(null);
const subscription = ref(null);

watch(mobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', handleClickOutside);
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
});
// 监听滚动
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  if (mobileMenuOpen.value && 
      mobileMenuRef.value && 
      !mobileMenuRef.value.contains(event.target) && 
      mobileMenuButtonRef.value && 
      !mobileMenuButtonRef.value.contains(event.target)) {
    mobileMenuOpen.value = false;
  }
};

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// 用户信息
const isLoggedIn = computed(() => userStore.isLoggedIn);

const userInfo = computed(() => userStore.userInfo);
const userAvatar = computed(() => userInfo.value?.avatar || '');
const isPremium = computed(() => userStore.isPremium);
const storageUsage = computed(() => userStore.storageUsage);

const formatSize = (kb) => {
  if (!kb) return '0 B';
  const bytes = kb * 1024;
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  if (isLoggedIn.value && isPremium.value) {
    try {
      const res = await getMySubscription();
      subscription.value = res.data;
    } catch (e) {
      console.error('Failed to fetch subscription', e);
    }
  }
});

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    await userStore.logout();
    mobileMenuOpen.value = false;
    router.push('/login');
  } catch (error) {
    // 用户取消操作
  }
};
</script>

<style>
/* 用户下拉菜单样式 - 必须放在非 scoped 样式块中，因为 dropdown menu 是 append 到 body 的 */
.user-dropdown-popper .el-dropdown-menu__item {
  padding: 10px 16px;
  line-height: 1.5;
  transition: all 0.2s ease;
}

.user-dropdown-popper .el-dropdown-menu__item:hover,
.user-dropdown-popper .el-dropdown-menu__item:focus {
  background-color: var(--el-color-primary-light-9) !important;
  color: var(--el-color-primary) !important;
}

.user-dropdown-popper .el-dropdown-menu__item.is-disabled {
  color: var(--el-text-color-disabled);
  cursor: not-allowed;
}
</style>

<style scoped>
/* 移动端菜单项样式 */
.mobile-nav-item {
  @apply flex items-center py-3 px-4 rounded-lg transition-colors duration-200 text-gray-700;
}

.mobile-nav-item:active {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.mobile-nav-item .el-icon {
  @apply mr-3 text-gray-400 transition-colors duration-200;
}

.mobile-nav-item:active .el-icon {
  color: var(--el-color-primary);
}

.nav-link {
  @apply text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 0.125rem;
  background-color: var(--el-color-primary-500);
  transform: translateX(-50%);
  transition: all 0.3s;
  opacity: 0;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  @apply w-full opacity-100;
}

.nav-link.router-link-active {
  @apply text-primary-600 font-semibold;
}

.btn-text {
  @apply text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium relative;
}

.btn-text::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 0.125rem;
  background-color: var(--el-color-primary-500);
  transition: all 0.3s;
  opacity: 0;
}

.btn-text:hover::after {
  @apply w-full opacity-100;
}

.logo-icon {
  @apply relative;
}

.logo-icon::before {
  content: '';
  position: absolute;
  inset: -0.25rem;
  border-radius: 9999px;
  background-color: var(--el-color-primary-100);
  opacity: 0;
  transform: scale(0);
  transition: all 0.5s;
}

.logo-icon:hover::before {
  @apply opacity-70 scale-150;
}

.user-dropdown .el-dropdown-menu__item {
  @apply py-3 px-4;
}
</style>