<template>
  <div class="user-profile-page min-h-screen py-12 relative overflow-hidden">
    <!-- 动态背景 -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <div class="container-custom max-w-5xl relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- 左侧：个人信息卡片 (Bento Grid Style) -->
        <div class="lg:col-span-4 space-y-6">
          <!-- 主卡片 -->
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-rose-100/50 overflow-hidden border border-white/50 sticky top-24">
            <!-- 头部背景 -->
            <div class="h-32 bg-gradient-to-br from-rose-400 to-purple-500 relative overflow-hidden">
              <div class="absolute inset-0 bg-pattern opacity-20"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            <!-- 头像与基本信息 -->
            <div class="px-6 pb-8 relative">
              <div class="relative -mt-16 mb-4 flex justify-center">
                <div class="relative group cursor-pointer">
                  <div class="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white transition-transform duration-500 group-hover:scale-105">
                     <img
                       v-if="profileForm.avatar || profileForm.avatarPreview"
                       :src="profileForm.avatarPreview || profileForm.avatar"
                       class="w-full h-full object-cover"
                       alt="用户头像"
                     />
                     <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <el-icon class="text-4xl"><User /></el-icon>
                     </div>
                     
                     <!-- 上传遮罩 -->
                     <el-upload
                        class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]"
                        :http-request="uploadAvatarRequest"
                        :show-file-list="false"
                        :before-upload="beforeAvatarUpload"
                     >
                        <el-icon class="text-white text-2xl transform group-hover:scale-110 transition-transform"><Camera /></el-icon>
                     </el-upload>
                  </div>
                  <!-- 等级徽章 -->
                  <div class="absolute bottom-1 right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-md" title="会员等级">
                    <el-icon class="text-white text-sm"><StarFilled /></el-icon>
                  </div>
                </div>
              </div>
              
              <div class="text-center mb-6">
                <h1 class="text-2xl font-display font-bold text-gray-800 mb-1">{{ profileForm.nickname || '未设置昵称' }}</h1>
                <p class="text-sm text-gray-500 flex items-center justify-center gap-1">
                   <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                   加入于 {{ formatDate(userStore.userInfo?.created_at, 'long-date') }}
                </p>
              </div>

              <!-- 导航菜单 -->
              <div class="space-y-2">
                 <router-link to="/user/profile" class="flex items-center gap-3 px-4 py-3 bg-rose-50 text-rose-600 rounded-xl font-medium transition-colors">
                    <el-icon><User /></el-icon> 个人资料
                 </router-link>
                 <router-link to="/user/purchases" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors group">
                    <el-icon class="group-hover:scale-110 transition-transform"><Present /></el-icon> 我的礼物
                 </router-link>
                 <router-link to="/orders" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors group">
                    <el-icon class="group-hover:scale-110 transition-transform"><List /></el-icon> 订单记录
                 </router-link>
                 <router-link to="/wallet"
                  class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors group">
                  <el-icon class="group-hover:scale-110 transition-transform">
                    <Wallet />
                  </el-icon> 我的钱包
                </router-link>
              </div>
              
              <div class="mt-8 pt-6 border-t border-gray-100">
                 <button @click="handleLogout" class="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 py-2.5 rounded-lg transition-all text-sm font-medium">
                    <el-icon><SwitchButton /></el-icon> 退出登录
                 </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：功能与编辑区 -->
        <div class="lg:col-span-8 space-y-6">

          <!-- 个性域名卡片 -->
          <div class="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl shadow-lg p-8 animate-fade-in-up mb-6 text-white relative overflow-hidden group">
            
            <!-- 装饰背景 -->
            <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
            
            <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <el-icon class="text-xl"><Link /></el-icon>
                  </div>
                  <h2 class="text-2xl font-bold">专属个性域名</h2>
                </div>
                <p class="text-white/80 text-sm leading-relaxed mb-4">
                  设置您的专属二级域名 (例如: <span class="font-mono bg-white/20 px-1 rounded">zhangsan</span>.{{ VITE_DEFAULT_SHARE_DOMAIN }})，<br>
                  让您的个人主页和作品分享链接独一无二。
                </p>
                
                <div class="flex flex-col sm:flex-row gap-3 max-w-lg">
                  <div class="relative flex-1">
                    <input 
                      v-model="profileForm.custom_domain"
                      type="text" 
                      placeholder="输入您心仪的域名"
                      class="w-full h-12 px-4 pr-[6.5rem] rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all font-medium truncate"
                      maxlength="20"
                    />
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 font-medium pointer-events-none">.{{ VITE_DEFAULT_SHARE_DOMAIN }}</span>
                  </div>
                  <button 
                    @click="handleUpdateDomain"
                    :disabled="domainLoading || !profileForm.custom_domain || profileForm.custom_domain === userStore.userInfo?.custom_domain"
                    class="h-12 px-6 bg-white text-purple-600 rounded-xl font-bold shadow-lg hover:bg-gray-50 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <span v-if="domainLoading" class="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></span>
                    <span v-else>{{ userStore.userInfo?.custom_domain ? '更新域名' : '立即设置' }}</span>
                  </button>
                </div>
                <div class="mt-2 pl-1 space-y-1">
                  <p class="text-xs text-white/50">
                    * 3-20位字符，仅限小写字母、数字和连字符
                  </p>
                  <p v-if="userStore.userInfo?.custom_domain" class="text-xs text-orange-200/80 flex items-start gap-1">
                    <el-icon class="mt-0.5"><Warning /></el-icon>
                    <span>注意：更换域名会导致之前的链接失效，且原域名可能被他人占用。</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 编辑表单 -->
          <div class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-8 animate-fade-in-up">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-bold text-gray-800">编辑资料</h2>
                <p class="text-sm text-gray-500 mt-1">完善你的个人信息，让大家更了解你</p>
              </div>
              <button 
                 @click="handleSubmit(false)" 
                 class="hidden md:flex px-6 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full font-medium shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 hover:-translate-y-0.5 transition-all items-center gap-2"
              >
                <el-icon><Check /></el-icon> 保存修改
              </button>
            </div>
            
            <el-form
              ref="formRef"
              :model="profileForm"
              :rules="profileRules"
              label-position="top"
              @submit.prevent="handleSubmit"
              class="space-y-6"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <!-- 昵称 -->
                <el-form-item label="昵称" prop="nickname">
                  <el-input v-model="profileForm.nickname" placeholder="大家都怎么称呼你？" size="large" class="custom-input" />
                </el-form-item>

                <!-- 邮箱 (只读) -->
                <el-form-item label="账号邮箱" prop="email" class="md:col-span-2">
                   <div class="bg-gray-50/80 px-4 py-3 rounded-xl text-gray-500 flex justify-between items-center border border-gray-200">
                      <div class="flex items-center gap-2">
                        <el-icon><Message /></el-icon>
                        <span>{{ profileForm.email }}</span>
                      </div>
                      <el-tag size="small" type="success" effect="plain" round>已验证</el-tag>
                   </div>
                </el-form-item>

                <!-- 个人简介 -->
                <el-form-item label="个性签名" prop="bio" class="md:col-span-2">
                  <el-input
                    v-model="profileForm.bio"
                    type="textarea"
                    :rows="4"
                    placeholder="写一句喜欢的话，展示独特的你..."
                    maxlength="200"
                    show-word-limit
                    resize="none"
                    class="font-serif custom-textarea"
                  />
                </el-form-item>
              </div>

              <!-- 密码修改折叠面板 -->
              <div class="border border-gray-100 rounded-2xl overflow-hidden mt-8 transition-all duration-300 hover:shadow-md bg-white/50">
                 <div 
                    class="px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50/80 transition-colors"
                    @click="showPasswordSection = !showPasswordSection"
                 >
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                        <el-icon><Lock /></el-icon>
                      </div>
                      <span class="font-medium text-gray-700">安全设置 (修改密码)</span>
                    </div>
                    <el-icon :class="{'transform rotate-180': showPasswordSection}" class="transition-transform duration-300 text-gray-400"><ArrowDown /></el-icon>
                 </div>
                 
                 <div v-show="showPasswordSection" class="p-6 border-t border-gray-100 bg-white/80">
                    <div class="space-y-6">
                      <el-form-item label="当前密码" prop="currentPassword">
                        <el-input
                          v-model="profileForm.currentPassword"
                          type="password"
                          placeholder="为了安全，请输入当前密码"
                          show-password
                          size="large"
                          class="custom-input"
                        />
                      </el-form-item>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <el-form-item label="新密码" prop="newPassword">
                          <el-input
                            v-model="profileForm.newPassword"
                            type="password"
                            placeholder="6位以上字符"
                            show-password
                            size="large"
                            class="custom-input"
                          />
                        </el-form-item>

                        <el-form-item label="确认新密码" prop="confirmPassword">
                          <el-input
                            v-model="profileForm.confirmPassword"
                            type="password"
                            placeholder="再次输入新密码"
                            show-password
                            size="large"
                            class="custom-input"
                          />
                        </el-form-item>
                      </div>
                    </div>
                 </div>
              </div>

              <!-- 账号绑定 -->
              <div class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-8 animate-fade-in-up mt-6">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                    <el-icon class="text-xl"><Lock /></el-icon>
                  </div>
                  <h2 class="text-2xl font-bold text-gray-800">账号安全</h2>
                </div>

                <div class="space-y-4">
                  <!-- 邮箱绑定 -->
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                        <el-icon class="text-xl"><Message /></el-icon>
                      </div>
                      <div>
                        <h3 class="font-medium text-gray-900">邮箱账号</h3>
                        <p class="text-sm text-gray-500">{{ userStore.userInfo?.email || '未绑定' }}</p>
                      </div>
                    </div>
                    <el-button 
                      v-if="userStore.userInfo?.binds?.email" 
                      type="danger" 
                      link 
                      @click="handleUnbind('email')"
                    >
                      解绑
                    </el-button>
                    <el-button 
                      v-else 
                      type="primary" 
                      link 
                      @click="openBindEmailDialog"
                    >
                      绑定
                    </el-button>
                  </div>

                  <!-- 手机号绑定 -->
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full bg-green-100 text-green-500 flex items-center justify-center">
                        <el-icon class="text-xl"><Iphone /></el-icon>
                      </div>
                      <div>
                        <h3 class="font-medium text-gray-900">手机号码</h3>
                        <p class="text-sm text-gray-500">{{ userStore.userInfo?.phone || '未绑定' }}</p>
                      </div>
                    </div>
                    <el-button 
                      v-if="userStore.userInfo?.binds?.phone" 
                      type="danger" 
                      link 
                      @click="handleUnbind('phone')"
                    >
                      解绑
                    </el-button>
                    <el-button 
                      v-else 
                      type="primary" 
                      link 
                      @click="openBindPhoneDialog"
                    >
                      绑定
                    </el-button>
                  </div>

                  <!-- QQ绑定 -->
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center">
                        <svg class="w-5 h-5" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z" fill="currentColor"></path></svg>
                      </div>
                      <div>
                        <h3 class="font-medium text-gray-900">QQ账号</h3>
                        <p class="text-sm text-gray-500">{{ userStore.userInfo?.binds?.qq ? '已绑定' : '未绑定' }}</p>
                      </div>
                    </div>
                    <el-button 
                      v-if="userStore.userInfo?.binds?.qq" 
                      type="danger" 
                      link 
                      @click="handleUnbind('qq')"
                    >
                      解绑
                    </el-button>
                    <el-button 
                      v-else 
                      type="primary" 
                      link 
                      @click="handleBindQQ"
                    >
                      绑定
                    </el-button>
                  </div>

                  <!-- GitHub绑定 -->
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full bg-gray-200 text-gray-800 flex items-center justify-center">
                        <el-icon class="text-xl"><GitHub /></el-icon>
                      </div>
                      <div>
                        <h3 class="font-medium text-gray-900">GitHub账号</h3>
                        <p class="text-sm text-gray-500">{{ userStore.userInfo?.binds?.github ? '已绑定' : '未绑定' }}</p>
                      </div>
                    </div>
                    <el-button 
                      v-if="userStore.userInfo?.binds?.github" 
                      type="danger" 
                      link 
                      @click="handleUnbind('github')"
                    >
                      解绑
                    </el-button>
                    <el-button 
                      v-else 
                      type="primary" 
                      link 
                      @click="handleBindGitHub"
                    >
                      绑定
                    </el-button>
                  </div>
                </div>
              </div>

              <!-- 移动端保存按钮 -->
              <div class="md:hidden pt-4">
                <el-button 
                   type="primary" 
                   native-type="submit" 
                   :loading="loading" 
                   size="large"
                   class="w-full shadow-lg shadow-primary-500/30 !rounded-xl"
                >
                  保存更新
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <!-- 绑定邮箱弹窗 -->
    <el-dialog
      v-model="bindEmailVisible"
      title="绑定邮箱"
      width="90%"
      class="max-w-md"
      align-center
    >
      <el-form :model="bindEmailForm" :rules="bindRules" ref="bindEmailFormRef" label-position="top">
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="bindEmailForm.email" placeholder="请输入邮箱地址" />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <div class="flex gap-3">
            <el-input v-model="bindEmailForm.code" placeholder="6位验证码" maxlength="6" />
            <el-button 
              type="primary" 
              :disabled="countDown > 0 || sendCodeLoading"
              @click="sendVerificationCode('email')"
            >
              {{ countDown > 0 ? `${countDown}秒后重发` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="bindEmailVisible = false">取消</el-button>
          <el-button type="primary" :loading="bindLoading" @click="handleBindEmail">确认绑定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 绑定手机弹窗 -->
    <el-dialog
      v-model="bindPhoneVisible"
      title="绑定手机号"
      width="90%"
      class="max-w-md"
      align-center
    >
      <el-form :model="bindPhoneForm" :rules="bindRules" ref="bindPhoneFormRef" label-position="top">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="bindPhoneForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <div class="flex gap-3">
            <el-input v-model="bindPhoneForm.code" placeholder="6位验证码" maxlength="6" />
            <el-button 
              type="primary" 
              :disabled="countDown > 0 || sendCodeLoading"
              @click="sendVerificationCode('phone')"
            >
              {{ countDown > 0 ? `${countDown}秒后重发` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="bindPhoneVisible = false">取消</el-button>
          <el-button type="primary" :loading="bindLoading" @click="handleBindPhone">确认绑定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 订阅弹窗 -->
    <el-dialog
      v-model="showSubscriptionModal"
      title="订阅会员，解锁更多权益"
      width="90%"
      class="max-w-4xl subscription-dialog dark-dialog"
      align-center
      destroy-on-close
      :close-on-click-modal="false"
    >
       <div class="bg-gray-900 rounded-xl p-4 md:p-6 relative">
         <button 
           @click="showSubscriptionModal = false" 
           class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 p-2 rounded-full hover:bg-white/10"
         >
            <el-icon class="text-xl"><Close /></el-icon>
         </button>
         <SubscriptionPlans :compact="true" @success="handleSubscriptionSuccess" />
       </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/user';
import { ElMessage, ElMessageBox } from 'element-plus';
import { bindEmail, bindPhone, unbindIdentity } from '@/api/user';
import { sendCode } from '@/api/auth';
import { User, Camera, Calendar, Present, List, SwitchButton, ArrowDown, StarFilled, Brush, Star, Wallet, Check, Message, Lock, Link, Warning, ArrowRight, CircleCheckFilled, Trophy, Close, Iphone } from '@element-plus/icons-vue';
import GitHub from '@/components/icons/GitHub.vue';
import { convertImageToBase64 } from '@/utils/image';
import { formatDate } from '@/utils/date';
import { sha1 } from '@/utils/crypto';
import SubscriptionPlans from '@/components/SubscriptionPlans.vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const VITE_DEFAULT_SHARE_DOMAIN = import.meta.env.VITE_DEFAULT_SHARE_DOMAIN;

// 表单引用
const formRef = ref(null);
const showPasswordSection = ref(false);
const showSubscriptionModal = ref(false);

// 加载状态
const loading = ref(false);
const domainLoading = ref(false);

// 表单数据
const profileForm = reactive({
  nickname: '',
  email: '',
  phone: '',
  bio: '',
  custom_domain: '',
  avatar: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 绑定相关状态
const bindEmailVisible = ref(false);
const bindPhoneVisible = ref(false);
const bindLoading = ref(false);
const sendCodeLoading = ref(false);
const countDown = ref(0);
let timer = null;

const bindEmailForm = reactive({
  email: '',
  code: ''
});

const bindPhoneForm = reactive({
  phone: '',
  code: ''
});

const bindEmailFormRef = ref(null);
const bindPhoneFormRef = ref(null);

const bindRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度为6位', trigger: 'blur' }
  ]
};

// 打开绑定邮箱弹窗
const openBindEmailDialog = () => {
  bindEmailForm.email = '';
  bindEmailForm.code = '';
  bindEmailVisible.value = true;
};

// 打开绑定手机弹窗
const openBindPhoneDialog = () => {
  bindPhoneForm.phone = '';
  bindPhoneForm.code = '';
  bindPhoneVisible.value = true;
};

// 发送验证码
const sendVerificationCode = async (type) => {
  const form = type === 'email' ? bindEmailForm : bindPhoneForm;
  const formRef = type === 'email' ? bindEmailFormRef : bindPhoneFormRef;
  
  if (!form[type]) {
    ElMessage.warning(type === 'email' ? '请输入邮箱' : '请输入手机号');
    return;
  }
  
  // 简单验证格式
  if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    ElMessage.warning('请输入正确的邮箱格式');
    return;
  }
  if (type === 'phone' && !/^1[3-9]\d{9}$/.test(form.phone)) {
    ElMessage.warning('请输入正确的手机号格式');
    return;
  }
  
  if (countDown.value > 0) return;

  sendCodeLoading.value = true;
  try {
    await sendCode({
      [type]: form[type],
      type: 'bind'
    });
    ElMessage.success('验证码已发送');
    startCountDown();
  } catch (error) {
    // Error handled by interceptor
  } finally {
    sendCodeLoading.value = false;
  }
};

// 倒计时
const startCountDown = () => {
  countDown.value = 60;
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    countDown.value--;
    if (countDown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

// 绑定邮箱提交
const handleBindEmail = async () => {
  if (!bindEmailFormRef.value) return;
  await bindEmailFormRef.value.validate(async (valid) => {
    if (valid) {
      bindLoading.value = true;
      try {
        await bindEmail(bindEmailForm);
        ElMessage.success('邮箱绑定成功');
        bindEmailVisible.value = false;
        await userStore.fetchUserInfo();
      } catch (error) {
        // Error handled
      } finally {
        bindLoading.value = false;
      }
    }
  });
};

// 绑定手机提交
const handleBindPhone = async () => {
  if (!bindPhoneFormRef.value) return;
  await bindPhoneFormRef.value.validate(async (valid) => {
    if (valid) {
      bindLoading.value = true;
      try {
        await bindPhone(bindPhoneForm);
        ElMessage.success('手机号绑定成功');
        bindPhoneVisible.value = false;
        await userStore.fetchUserInfo();
      } catch (error) {
        // Error handled
      } finally {
        bindLoading.value = false;
      }
    }
  });
};

// 解绑
const handleUnbind = (type) => {
  const typeName = {
    email: '邮箱',
    phone: '手机号',
    qq: 'QQ账号',
    wechat: '微信账号',
    github: 'GitHub账号'
  }[type];
  
  ElMessageBox.confirm(`确定要解绑该${typeName}吗？`, '解绑确认', {
    confirmButtonText: '确定解绑',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await unbindIdentity({ type });
      ElMessage.success('解绑成功');
      await userStore.fetchUserInfo();
    } catch (error) {
      // Error handled
    }
  }).catch(() => {});
};

// QQ绑定
const handleBindQQ = () => {
  // 获取当前token
  const token = userStore.token;
  if (!token) {
    ElMessage.error('请先登录');
    return;
  }
  // 跳转到QQ绑定授权页
  window.location.href = `/api/v1/auth/qq/login?token=${token}`;
};

// GitHub绑定
const handleBindGitHub = () => {
  const token = userStore.token;
  if (!token) {
    ElMessage.error('请先登录');
    return;
  }
  // 跳转到GitHub绑定授权页
  window.location.href = `/api/v1/auth/github/login?token=${token}`;
};

const isPremium = computed(() => userStore.isPremium);

const goToSubscription = () => {
  showSubscriptionModal.value = true;
};

const handleSubscriptionSuccess = () => {
  showSubscriptionModal.value = false;
};

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '退出',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await userStore.logout();
    router.push('/login');
    ElMessage.success('已安全退出');
  }).catch(() => {});
};

// 头像转base64
const uploadAvatarRequest = async ({ file }) => {
  try {
    // 本地校验
    if (!beforeAvatarUpload(file)) {
      throw new Error('avatar validation failed');
    }
    // 预览与保存键
    profileForm.avatarPreview = URL.createObjectURL(file);
    profileForm.avatar = await convertImageToBase64(file);
    ElMessage.success('头像上传成功');
    // 立即保存头像
    await handleSubmit(true);
    return { ok: true };
  } catch (e) {
    console.error(e);
    ElMessage.error('头像上传失败');
    throw e;
  }
};

// 表单验证规则
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback();
  } else if (value !== profileForm.newPassword) {
    callback(new Error('两次输入密码不一致'));
  } else {
    callback();
  }
};

const profileRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度应在2到20个字符之间', trigger: 'blur' }
  ],
  email: [
    { max: 20, message: '长度不能超过 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  bio: [
    { max: 200, message: '长度不能超过 200 个字符', trigger: 'blur' }
  ],
  custom_domain: [
    { pattern: /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, message: '只能包含小写字母、数字和连字符，且不能以连字符开头或结尾', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  newPassword: [
    { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validatePass, trigger: 'blur' }
  ]
};

// 获取用户信息
onMounted(async () => {
  try {
    await userStore.fetchUserInfo();
    const userInfo = userStore.userInfo;
    
    // 填充表单数据
    profileForm.nickname = userInfo.nickname || '';
    profileForm.email = userInfo.email || '';
    // phone field removed from form
    // profileForm.phone = userInfo.phone || '';
    profileForm.bio = userInfo.bio || '';
    profileForm.custom_domain = userInfo.custom_domain || '';
    profileForm.avatar = userInfo.avatar || '';

    // Check for bind results
    const { bind_success, bind_error } = route.query;
    if (bind_success) {
      if (bind_success === 'qq') {
        ElMessage.success('QQ绑定成功');
      }
      // Remove query params
      router.replace({ query: {} });
      // Refresh user info
      await userStore.fetchUserInfo();
    }
    if (bind_error) {
      ElMessage.error('绑定失败: ' + bind_error);
      router.replace({ query: {} });
    }

  } catch (error) {
    ElMessage.error('获取用户信息失败');
  }
});

// 头像上传前的验证
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';
  const isImage = isJPG || isPNG || file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error('头像必须是图片格式!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!');
    return false;
  }
  return true;
};

// 移除旧的服务器直传成功回调，统一改为预签名直传

// 重置表单
const resetForm = () => {
  if (!formRef.value) return;
  
  formRef.value.resetFields();
  
  // 重新填充用户信息
  const userInfo = userStore.userInfo;
  profileForm.nickname = userInfo.nickname || '';
  profileForm.email = userInfo.email || '';
  profileForm.phone = userInfo.phone || '';
  profileForm.bio = userInfo.bio || '';
  profileForm.custom_domain = userInfo.custom_domain || '';
  profileForm.avatar = userInfo.avatar || '';
  
  // 清空密码字段
  profileForm.currentPassword = '';
  profileForm.newPassword = '';
  profileForm.confirmPassword = '';
};

// 提交表单
const handleSubmit = async (avatarOnly = false) => {
  if (!avatarOnly) {
    // 如果不是仅更新头像，需要验证表单
    if (!formRef.value) return;
    
    try {
      await formRef.value.validate();
    } catch (error) {
      return;
    }
  }
  
  loading.value = true;
  try {
    const updateData = {
      nickname: profileForm.nickname,
      phone: profileForm.phone,
      bio: profileForm.bio
    };
    
    // 如果是更新头像，发送base64编码给后端处理
    if (avatarOnly && profileForm.avatar) {
      updateData.avatar = profileForm.avatar;
    }
    
    // 如果有设置新密码，添加密码字段
    if (profileForm.currentPassword && profileForm.newPassword) {
      updateData.old_password = sha1(profileForm.currentPassword);
      updateData.new_password = sha1(profileForm.newPassword);
    }
    
    // 更新用户信息
    await userStore.updateProfile(updateData);
    ElMessage.success('个人资料更新成功');
    // 刷新用户信息
    await userStore.fetchUserInfo();
    // 清空密码字段
    profileForm.currentPassword = '';
    profileForm.newPassword = '';
    profileForm.confirmPassword = '';
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '更新失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 单独更新域名
const handleUpdateDomain = async () => {
  if (!profileForm.custom_domain) return;
  
  // 手动校验
  const domain = profileForm.custom_domain;
  if (domain.length < 3 || domain.length > 20) {
    ElMessage.error('域名长度必须在 3-20 个字符之间');
    return;
  }
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(domain)) {
    ElMessage.error('域名格式不正确');
    return;
  }

  domainLoading.value = true;
  try {
    await userStore.updateCustomDomain(domain);
    ElMessage.success('专属域名设置成功！');
    await userStore.fetchUserInfo();
  } catch (error) {
    const errorMsg = error.response?.data?.message || '';
    if (errorMsg.includes('会员')) {
      ElMessageBox.confirm(
        '自定义域名是会员专属权益，是否立即升级会员？',
        '会员专属',
        {
          confirmButtonText: '去升级',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        showSubscriptionModal.value = true;
      }).catch(() => {});
    } else {
      ElMessage.error(errorMsg || '设置失败，该域名可能已被使用');
    }
  } finally {
    domainLoading.value = false;
  }
};
</script>

<style scoped>
/* 基础样式 */
.bg-pattern {
  background-image: radial-gradient(rgba(255, 255, 255, 0.2) 2px, transparent 2px);
  background-size: 20px 20px;
}

/* 动效 */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 表单控件优化 */
.custom-input :deep(.el-input__wrapper) {
  background-color: rgba(249, 250, 251, 0.8);
  border-radius: 12px;
  box-shadow: none !important;
  border: 1px solid transparent;
  transition: all 0.3s;
}

.custom-input :deep(.el-input__wrapper:hover),
.custom-input :deep(.el-input__wrapper.is-focus) {
  background-color: white;
  border-color: rgba(244, 63, 94, 0.3); /* rose-500/30 */
  box-shadow: 0 4px 12px rgba(244, 63, 94, 0.1) !important;
}

.custom-textarea :deep(.el-textarea__inner) {
  background-color: rgba(249, 250, 251, 0.8);
  border-radius: 16px;
  box-shadow: none !important;
  border: 1px solid transparent;
  padding: 16px;
  transition: all 0.3s;
}

.custom-textarea :deep(.el-textarea__inner:hover),
.custom-textarea :deep(.el-textarea__inner:focus) {
  background-color: white;
  border-color: rgba(244, 63, 94, 0.3);
  box-shadow: 0 4px 12px rgba(244, 63, 94, 0.1) !important;
}

/* 订阅弹窗样式优化 */
:deep(.dark-dialog) {
  background: transparent !important;
  box-shadow: none !important;
}

:deep(.dark-dialog .el-dialog__header) {
  display: none;
}

:deep(.dark-dialog .el-dialog__body) {
  padding: 0 !important;
  background: transparent !important;
}
</style>
