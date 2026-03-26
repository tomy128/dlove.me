import { createRouter, createWebHistory } from 'vue-router'
import { STORAGE_KEYS, storage } from '@/config/storage'

// 路由懒加载
const Home = () => import('@/views/Home.vue')
const Login = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const AuthCallback = () => import('@/views/AuthCallback.vue')
const Terms = () => import('@/views/Terms.vue')
const Privacy = () => import('@/views/Privacy.vue')
const ForgotPassword = () => import('@/views/ForgotPassword.vue')
const TemplateList = () => import('@/views/TemplateList.vue')
const TemplateDetail = () => import('@/views/TemplateDetail.vue')
const TemplateEditor = () => import('@/views/TemplateEditor.vue')
const UserProfile = () => import('@/views/UserProfile.vue')
const UserPurchases = () => import('@/views/UserPurchases.vue')
const WorkView = () => import('@/views/WorkView.vue')
const DeveloperGuide = () => import('@/views/DeveloperGuide.vue')
const OrderList = () => import('@/views/OrderList.vue')
const OrderDetail = () => import('@/views/OrderDetail.vue')
const Checkout = () => import('@/views/Checkout.vue')
const Wallet = () => import('@/views/Wallet.vue')
const Recharge = () => import('@/views/Recharge.vue')
const Pricing = () => import('@/views/Pricing.vue')
const NotFound = () => import('@/views/NotFound.vue')

// 管理页面组件
const AdminLayout = () => import('@/views/admin/AdminLayout.vue')
const Dashboard = () => import('@/views/admin/Dashboard.vue')
const UserManagement = () => import('@/views/admin/UserManagement.vue')
const TemplateManagement = () => import('@/views/admin/TemplateManagement.vue')
const CategoryManagement = () => import('@/views/admin/CategoryManagement.vue')
const OrderManagement = () => import('@/views/admin/OrderManagement.vue')
const SystemSettings = () => import('@/views/admin/SystemSettings.vue')



const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: '首页 - DLove' }
  },
  {
    path: '/developer/guide',
    name: 'developer-guide',
    component: DeveloperGuide,
    meta: { title: '开发者中心 - DLove' }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { title: '登录 - DLove' }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { title: '注册 - DLove' }
  },
  {
    path: '/oauth/callback',
    name: 'auth-callback',
    component: AuthCallback,
    meta: { title: '正在登录 - DLove' }
  },
  {
    path: '/terms',
    name: 'terms',
    component: Terms,
    meta: { title: '服务条款 - DLove' }
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: Privacy,
    meta: { title: '隐私政策 - DLove' }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
    meta: { title: '找回密码 - DLove' }
  },
  {
    path: '/templates',
    name: 'templates',
    component: TemplateList,
    meta: { title: '模板商城 - DLove' }
  },
  {
    path: '/templates/:id',
    name: 'template-detail',
    component: TemplateDetail,
    meta: { title: '模板详情 - DLove' }
  },
  {
    path: '/templates/:id/edit',
    name: 'template-editor',
    component: TemplateEditor,
    meta: { title: '创作您的回忆 - DLove' }
  },
  {
    path: '/orders/:orderId/edit',
    name: 'order-editor',
    component: TemplateEditor,
    meta: { requiresAuth: true, title: '编辑作品 - DLove' }
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: UserProfile,
    meta: { requiresAuth: true, title: '个人资料 - DLove' }
  },
  {
    path: '/user/purchases',
    name: 'user-purchases',
    component: UserPurchases,
    meta: { requiresAuth: true, title: '我的购买 - DLove' }
  },
  {
    path: '/pricing',
    name: 'pricing',
    component: Pricing,
    meta: { title: '会员套餐 - DLove' }
  },
  {
    path: '/works/:id',
    name: 'work-view',
    component: WorkView,
    meta: { title: '查看作品 - DLove' }
  },
  {
    path: '/orders',
    name: 'orders',
    component: OrderList,
    meta: { requiresAuth: true, title: '我的订单 - DLove' }
  },
  {
    path: '/orders/:id',
    name: 'order-detail',
    component: OrderDetail,
    meta: { requiresAuth: true, title: '订单详情 - DLove' }
  },
  {
    path: '/checkout/:id',
    name: 'checkout',
    component: Checkout,
    meta: { requiresAuth: true, title: '确认购买 - DLove' }
  },
  {
    path: '/wallet',
    name: 'wallet',
    component: Wallet,
    meta: { requiresAuth: true, title: '我的钱包 - DLove' }
  },
  {
    path: '/recharge',
    name: 'recharge',
    component: Recharge,
    meta: { requiresAuth: true, title: '钱包充值 - DLove' }
  },
  // 管理页面路由
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: Dashboard,
        meta: { title: '管理后台 - DLove' }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: UserManagement,
        meta: { title: '用户管理 - DLove' }
      },
      {
        path: 'templates',
        name: 'admin-templates',
        component: TemplateManagement,
        meta: { title: '模板管理 - DLove' }
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: CategoryManagement,
        meta: { title: '分类管理 - DLove' }
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: OrderManagement,
        meta: { title: '订单管理 - DLove' }
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: SystemSettings,
        meta: { title: '系统设置 - DLove' }
      }
    ]
  },
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: { title: '页面未找到 - DLove' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 性能监控
  if (import.meta.env.DEV) {
    console.log(`🔄 路由跳转: ${from.path} -> ${to.path}`)
  }

  // 设置页面标题
  document.title = to.meta.title || 'DLove | 让每段感情，都值得被精心表达'
  
  // 检查是否需要登录
  const isLoggedIn = storage.get(STORAGE_KEYS.TOKEN) // 简单判断是否登录
  const userInfo = storage.get(STORAGE_KEYS.USER) // 获取用户信息

  // 记录跳转来源，用于登录后重定向（排除登录注册相关页面）
  // 注意：from.name 可能为 undefined（首次加载），此时不应保存
  const targetIsAuthPage = ['login', 'register'].includes(to.name)
  const sourceIsAuthPage = from.name && ['login', 'register', 'forgot-password', 'auth-callback'].includes(from.name)
  
  // 如果是进入登录/注册页，且来源不是auth相关页面，且不是首次加载（from.name存在），且没有redirect参数
  if (targetIsAuthPage && from.name && !sourceIsAuthPage && !to.query.redirect) {
    storage.set(STORAGE_KEYS.AUTH_REDIRECT_URL, from.fullPath)
  }

  if (to.meta.requiresAuth && !isLoggedIn) {
    // 需要登录但未登录，重定向到登录页
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresAdmin && (!userInfo || userInfo.role !== 'admin')) {
    // 需要管理员权限但不是管理员，重定向到首页
    next({ name: 'home' })
  } else {
    next()
  }
})

// 路由加载完成后的性能监控
router.afterEach((to, from) => {
  if (import.meta.env.DEV) {
    console.log(`✅ 路由加载完成: ${to.path}`)
  }
})

export default router
