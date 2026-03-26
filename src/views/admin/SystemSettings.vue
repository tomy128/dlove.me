<template>
  <div :class="['p-6', { 'p-3': isMobile }]">
    <h1 :class="['font-bold mb-6', isMobile ? 'text-xl' : 'text-2xl']">系统设置</h1>
    
    <el-tabs v-model="activeTab" class="demo-tabs" :stretch="isMobile">
      <!-- 基本设置 -->
      <el-tab-pane label="基本设置" name="general">
        <el-card shadow="never" :class="['mb-6', { 'mb-4': isMobile }]">
          <template #header>
            <div class="card-header">
              <h2 class="text-lg font-medium">网站信息</h2>
              <p class="text-gray-500 text-sm">设置网站的基本信息</p>
            </div>
          </template>
          
          <el-form
            ref="generalFormRef"
            :model="generalForm"
            :rules="generalRules"
            label-position="top"
            :class="[isMobile ? 'w-full' : 'max-w-2xl']"
            :size="isMobile ? 'default' : 'large'"
          >
            <!-- 网站名称 -->
            <el-form-item label="网站名称" prop="siteName">
              <el-input 
                v-model="generalForm.siteName" 
                placeholder="请输入网站名称" 
                :size="isMobile ? 'default' : 'large'"
              />
            </el-form-item>
            
            <!-- 网站描述 -->
            <el-form-item label="网站描述" prop="siteDescription">
              <el-input 
                v-model="generalForm.siteDescription" 
                type="textarea" 
                :rows="isMobile ? 2 : 3"
                placeholder="请输入网站描述"
                :size="isMobile ? 'default' : 'large'"
              />
            </el-form-item>
            
            <!-- 网站Logo -->
            <el-form-item label="网站Logo" prop="siteLogo">
              <div :class="[isMobile ? 'flex-col' : 'flex items-start']">
                <el-upload
                  class="avatar-uploader"
                  :http-request="uploadLogoRequest"
                  :show-file-list="false"
                  :before-upload="beforeLogoUpload"
                >
                  <img v-if="generalForm.siteLogo || generalForm.siteLogoPreview" :src="generalForm.siteLogoPreview || generalForm.siteLogo" :class="[isMobile ? 'w-24 h-24' : 'w-32 h-32', 'object-cover rounded']" />
                  <div :class="[isMobile ? 'w-24 h-24' : 'w-32 h-32', 'border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center hover:border-primary-500 transition-colors']">
                    <el-icon :size="isMobile ? 20 : 24" class="text-gray-400"><Plus /></el-icon>
                    <span class="text-gray-500 text-xs mt-2">上传Logo</span>
                  </div>
                </el-upload>
                <div :class="[isMobile ? 'mt-2' : 'ml-4', 'text-xs text-gray-500']">
                  <p>建议尺寸: 200x200 像素</p>
                  <p>支持格式: JPG, PNG</p>
                  <p>文件大小: 不超过 2MB</p>
                </div>
              </div>
            </el-form-item>
            
            <!-- 联系邮箱 -->
            <el-form-item label="联系邮箱" prop="contactEmail">
              <el-input 
                v-model="generalForm.contactEmail" 
                placeholder="请输入联系邮箱" 
                :size="isMobile ? 'default' : 'large'"
              />
            </el-form-item>
            
            <!-- 版权信息 -->
            <el-form-item label="版权信息" prop="copyright">
              <el-input 
                v-model="generalForm.copyright" 
                placeholder="请输入版权信息" 
                :size="isMobile ? 'default' : 'large'"
              />
            </el-form-item>
            
            <!-- 备案信息 -->
            <el-form-item label="备案信息" prop="icp">
              <el-input 
                v-model="generalForm.icp" 
                placeholder="请输入备案信息" 
                :size="isMobile ? 'default' : 'large'"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                @click="saveGeneralSettings" 
                :loading="generalSaving"
                :size="isMobile ? 'default' : 'large'"
                :class="{ 'w-full': isMobile }"
              >
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      
      <!-- 支付设置 -->
      <el-tab-pane label="支付设置" name="payment">
        <el-card shadow="never" :class="['mb-6', { 'mb-4': isMobile }]">
          <template #header>
            <div class="card-header">
              <h2 :class="[isMobile ? 'text-base' : 'text-lg', 'font-medium']">支付宝设置</h2>
              <p :class="[isMobile ? 'text-xs' : 'text-sm', 'text-gray-500']">配置支付宝支付接口参数</p>
            </div>
          </template>
          
          <el-form
            ref="alipayFormRef"
            :model="paymentForm.alipay"
            :rules="alipayRules"
            label-position="top"
            :class="[isMobile ? 'w-full' : 'max-w-2xl']"
            :size="isMobile ? 'default' : 'large'"
          >
            <!-- 启用支付宝 -->
            <el-form-item label="启用支付宝" prop="enabled">
              <el-switch v-model="paymentForm.alipay.enabled" :size="isMobile ? 'default' : 'large'" />
            </el-form-item>
            
            <!-- 支付宝应用ID -->
            <el-form-item label="应用ID (APPID)" prop="appId">
              <el-input 
                v-model="paymentForm.alipay.appId" 
                placeholder="请输入支付宝应用ID"
                :disabled="!paymentForm.alipay.enabled"
                :size="isMobile ? 'default' : 'large'"
              />
            </el-form-item>
            
            <!-- 支付宝公钥 -->
            <el-form-item label="支付宝公钥" prop="publicKey">
              <el-input 
                v-model="paymentForm.alipay.publicKey" 
                type="textarea" 
                :rows="isMobile ? 3 : 4"
                placeholder="请输入支付宝公钥"
                :disabled="!paymentForm.alipay.enabled"
                :size="isMobile ? 'default' : 'large'"
              />
            </el-form-item>
            
            <!-- 应用私钥 -->
            <el-form-item label="应用私钥" prop="privateKey">
              <el-input 
                v-model="paymentForm.alipay.privateKey" 
                type="textarea" 
                :rows="isMobile ? 3 : 4"
                placeholder="请输入应用私钥"
                :disabled="!paymentForm.alipay.enabled"
                show-password
                :size="isMobile ? 'default' : 'large'"
              />
            </el-form-item>
            
            <!-- 回调地址 -->
            <el-form-item label="回调地址" prop="notifyUrl">
              <el-input 
                v-model="paymentForm.alipay.notifyUrl" 
                placeholder="请输入回调地址"
                :disabled="!paymentForm.alipay.enabled"
                :size="isMobile ? 'default' : 'large'"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                @click="saveAlipaySettings" 
                :loading="alipaySaving" 
                :disabled="!paymentForm.alipay.enabled"
                :size="isMobile ? 'default' : 'large'"
                :class="{ 'w-full': isMobile }"
              >
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
        
        <el-card shadow="never" :class="['mb-6', { 'mb-4': isMobile }]">
          <template #header>
            <div class="card-header">
              <h2 :class="[isMobile ? 'text-base' : 'text-lg', 'font-medium']">微信支付设置</h2>
              <p :class="[isMobile ? 'text-xs' : 'text-sm', 'text-gray-500']">配置微信支付接口参数</p>
            </div>
          </template>
          
          <el-form
            ref="wechatFormRef"
            :model="paymentForm.wechat"
            :rules="wechatRules"
            label-position="top"
            :class="[isMobile ? 'w-full' : 'max-w-2xl']"
            :size="isMobile ? 'default' : 'large'"
          >
            <!-- 启用微信支付 -->
            <el-form-item label="启用微信支付" prop="enabled">
              <el-switch v-model="paymentForm.wechat.enabled" :size="isMobile ? 'default' : 'large'" />
            </el-form-item>
            
            <!-- 微信支付商户号 -->
            <el-form-item label="商户号 (MCH_ID)" prop="mchId">
              <el-input 
                v-model="paymentForm.wechat.mchId" 
                placeholder="请输入微信支付商户号"
                :disabled="!paymentForm.wechat.enabled"
                :size="isMobile ? 'default' : 'large'"
              />
            </el-form-item>
            
            <!-- 微信支付应用ID -->
            <el-form-item label="应用ID (APPID)" prop="appId">
              <el-input 
                v-model="paymentForm.wechat.appId" 
                placeholder="请输入微信支付应用ID"
                :disabled="!paymentForm.wechat.enabled"
                :size="isMobile ? 'default' : 'large'"
              />
            </el-form-item>
            
            <!-- 微信支付密钥 -->
            <el-form-item label="API密钥" prop="apiKey">
              <el-input 
                v-model="paymentForm.wechat.apiKey" 
                placeholder="请输入微信支付API密钥"
                :disabled="!paymentForm.wechat.enabled"
                show-password
                :size="isMobile ? 'default' : 'large'"
              />
            </el-form-item>
            
            <!-- 回调地址 -->
            <el-form-item label="回调地址" prop="notifyUrl">
              <el-input 
                v-model="paymentForm.wechat.notifyUrl" 
                placeholder="请输入回调地址"
                :disabled="!paymentForm.wechat.enabled"
                :size="isMobile ? 'default' : 'large'"
              />
            </el-form-item>
            
            <!-- 证书文件 -->
            <el-form-item label="API证书" prop="certFile">
              <el-upload
                class="upload-demo"
                :http-request="uploadCertRequest"
                :disabled="!paymentForm.wechat.enabled"
                :limit="1"
              >
                <el-button 
                  type="primary" 
                  plain 
                  :disabled="!paymentForm.wechat.enabled"
                  :size="isMobile ? 'default' : 'large'"
                  :class="{ 'w-full': isMobile }"
                >
                  <el-icon class="mr-1"><Upload /></el-icon> 上传证书文件
                </el-button>
                <template #tip>
                  <div :class="[isMobile ? 'text-xs' : 'text-sm', 'text-gray-500 mt-1']">
                    请上传微信支付API证书文件 (apiclient_cert.p12)
                  </div>
                </template>
              </el-upload>
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                @click="saveWechatSettings" 
                :loading="wechatSaving" 
                :disabled="!paymentForm.wechat.enabled"
                :size="isMobile ? 'default' : 'large'"
                :class="{ 'w-full': isMobile }"
              >
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Upload } from '@element-plus/icons-vue'
import { 
  getGeneralSettings, 
  updateGeneralSettings, 
  getPaymentSettings, 
  updateAlipaySettings, 
  updateWechatSettings,
} from '@/api/admin/settings'

// 获取路由参数
const route = useRoute()

// 响应式设计
const isMobile = ref(false)

// 检查是否为移动设备
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

// 当前激活的标签页
const activeTab = ref(route.params.tab || route.query.tab || 'general')

// 监听路由变化，更新激活的标签页
watch(() => route.params.tab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab
  }
}, { immediate: true })

// 加载和保存状态
const loading = ref(false)
const generalSaving = ref(false)
const alipaySaving = ref(false)
const wechatSaving = ref(false)

// 表单引用
const generalFormRef = ref(null)
const alipayFormRef = ref(null)
const wechatFormRef = ref(null)

// 基本设置表单
const generalForm = ref({
  siteName: 'DLove',
  siteDescription: '让每段感情，都值得被精心表达',
  siteLogo: '',
  contactEmail: 'contact@dlove.me',
  copyright: '© 2023 DLove. All rights reserved.',
  icp: '京ICP备XXXXXXXX号'
})

// 支付设置表单
const paymentForm = ref({
  alipay: {
    enabled: false,
    appId: '',
    publicKey: '',
    privateKey: '',
    notifyUrl: ''
  },
  wechat: {
    enabled: false,
    mchId: '',
    appId: '',
    apiKey: '',
    notifyUrl: '',
    certFile: ''
  }
})

// 基本设置验证规则
const generalRules = {
  siteName: [
    { required: true, message: '请输入网站名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  siteDescription: [
    { required: true, message: '请输入网站描述', trigger: 'blur' },
    { max: 200, message: '长度不能超过 200 个字符', trigger: 'blur' }
  ],
  contactEmail: [
    { required: true, message: '请输入联系邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

// 支付宝设置验证规则
const alipayRules = {
  appId: [
    { required: true, message: '请输入支付宝应用ID', trigger: 'blur' }
  ],
  publicKey: [
    { required: true, message: '请输入支付宝公钥', trigger: 'blur' }
  ],
  privateKey: [
    { required: true, message: '请输入应用私钥', trigger: 'blur' }
  ],
  notifyUrl: [
    { required: true, message: '请输入回调地址', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL地址', trigger: 'blur' }
  ]
}

// 微信支付设置验证规则
const wechatRules = {
  mchId: [
    { required: true, message: '请输入微信支付商户号', trigger: 'blur' }
  ],
  appId: [
    { required: true, message: '请输入微信支付应用ID', trigger: 'blur' }
  ],
  apiKey: [
    { required: true, message: '请输入微信支付API密钥', trigger: 'blur' }
  ],
  notifyUrl: [
    { required: true, message: '请输入回调地址', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL地址', trigger: 'blur' }
  ]
}

// 直传上传请求
const uploadLogoRequest = async ({ file }) => {
  try {
    // 本地校验
    if (!beforeLogoUpload(file)) {
      throw new Error('Logo校验未通过')
    }

    // 使用统一上传方法
    const { fileKey } = await uploadFileDirect(file)

    // 本地预览与保存键
    generalForm.value.siteLogoPreview = URL.createObjectURL(file)
    generalForm.value.siteLogoKey = fileKey
    ElMessage.success('Logo上传成功')
    return { ok: true, body: { file_key: fileKey } }
  } catch (e) {
    console.error(e)
    ElMessage.error('Logo上传失败')
    throw e
  }
}

const uploadCertRequest = async ({ file }) => {
  try {
    // 针对 p12 证书文件特殊处理 Content-Type，防止浏览器识别失败
    if (file.name.endsWith('.p12') && !file.type) {
      // File.type 是只读的，但可以通过 new File 重建，或者直接相信 uploadFileDirect 会处理
      // 这里我们尝试不做特殊处理，直接上传。如果失败再考虑 hack
      // 其实 ossUploadClient 内部是用 xhr/axios put，如果 file.type 是空，header 可能是空
    }
    
    // 使用统一上传方法
    const { fileKey } = await uploadFileDirect(file)

    // 保存键与名称
    paymentForm.value.wechat.certFileKey = fileKey
    paymentForm.value.wechat.certFile = file.name
    ElMessage.success('证书上传成功')
    return { ok: true, body: { file_key: fileKey } }
  } catch (e) {
    console.error(e)
    ElMessage.error('证书上传失败')
    throw e
  }
}

// 初始化数据
onMounted(async () => {
  // 初始化移动端检测
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  loading.value = true
  try {
    // 获取基本设置
    const generalRes = await getGeneralSettings()
    if (generalRes.data) {
      generalForm.value = generalRes.data
    }
    
    // 获取支付设置
    const paymentRes = await getPaymentSettings()
    if (paymentRes.data.data) {
      paymentForm.value = paymentRes.data.data
    }
  } catch (error) {
    console.error('获取设置数据失败:', error)
    ElMessage.error('获取设置数据失败，请稍后再试')
  } finally {
    loading.value = false
  }
})

// 清理事件监听器
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// 保存基本设置
const saveGeneralSettings = async () => {
  if (!generalFormRef.value) return
  
  await generalFormRef.value.validate(async (valid) => {
    if (valid) {
      generalSaving.value = true
      try {
        const res = await updateGeneralSettings(generalForm.value)
        if (res.code === 0) {
          ElMessage.success('基本设置保存成功')
        } else {
          ElMessage.error(res.message || '保存失败，请稍后再试')
        }
      } catch (error) {
        console.error('保存基本设置失败:', error)
        ElMessage.error('保存失败，请稍后再试')
      } finally {
        generalSaving.value = false
      }
    }
  })
}

// 保存支付宝设置
const saveAlipaySettings = async () => {
  if (!alipayFormRef.value) return
  
  await alipayFormRef.value.validate(async (valid) => {
    if (valid) {
      alipaySaving.value = true
      try {
        const res = await updateAlipaySettings(paymentForm.value.alipay)
        if (res.code === 0) {
          ElMessage.success('支付宝设置保存成功')
        } else {
          ElMessage.error(res.message || '保存失败，请稍后再试')
        }
      } catch (error) {
        console.error('保存支付宝设置失败:', error)
        ElMessage.error('保存失败，请稍后再试')
      } finally {
        alipaySaving.value = false
      }
    }
  })
}

// 保存微信支付设置
const saveWechatSettings = async () => {
  if (!wechatFormRef.value) return
  
  await wechatFormRef.value.validate(async (valid) => {
    if (valid) {
      wechatSaving.value = true
      try {
        const res = await updateWechatSettings(paymentForm.value.wechat)
        if (res.code === 0) {
          ElMessage.success('微信支付设置保存成功')
        } else {
          ElMessage.error(res.message || '保存失败，请稍后再试')
        }
      } catch (error) {
        console.error('保存微信支付设置失败:', error)
        ElMessage.error('保存失败，请稍后再试')
      } finally {
        wechatSaving.value = false
      }
    }
  })
}

// 移除旧的直传服务器成功回调逻辑（已改为预签名直传）

// Logo上传前验证
const beforeLogoUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('Logo只能是JPG或PNG格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('Logo大小不能超过2MB!')
    return false
  }
  return true
}

// 移除旧的直传服务器证书上传逻辑（已改为预签名直传）
</script>

<style scoped>
.card-header {
  padding-bottom: 12px;
}

.logo {
  width: 128px;
  height: 128px;
  object-fit: cover;
  border-radius: 8px;
}

.logo-mobile {
  width: 96px;
  height: 96px;
}

.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.logo-uploader-icon-mobile {
  font-size: 24px;
  width: 96px;
  height: 96px;
  line-height: 96px;
}

.logo-uploader-icon:hover {
  border-color: #409eff;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
}

:deep(.el-tabs__active-bar) {
  height: 3px;
}

:deep(.el-tabs__item) {
  font-size: 16px;
}

:deep(.el-tabs__item.is-active) {
  font-weight: 600;
}

@media (max-width: 768px) {
  :deep(.el-tabs__item) {
    font-size: 14px;
    padding: 0 12px;
  }
  
  :deep(.el-form-item__label) {
    font-size: 14px;
  }
  
  :deep(.el-card__header) {
    padding: 16px;
  }
  
  :deep(.el-card__body) {
    padding: 16px;
  }
}
</style>
