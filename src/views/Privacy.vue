<template>
  <div class="privacy-page bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-soft overflow-hidden">
      <!-- 头部 -->
      <div class="bg-primary-600 px-6 py-8 sm:px-10 text-center">
        <h1 class="text-3xl font-bold text-white mb-2">隐私政策</h1>
        <p class="text-primary-100">最后更新日期：2026年3月11日</p>
      </div>

      <!-- 内容区域 -->
      <div class="px-6 py-8 sm:px-10 space-y-8 text-gray-700 leading-relaxed">
        <section>
          <p class="mb-4">
            感谢您信任并使用 DLove。我们需要收集一些信息来为您提供更好的服务。本政策将说明我们如何处理您的个人信息。
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span class="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
            我们收集的信息
          </h2>
          <ul class="list-disc pl-5 space-y-2 ml-11">
            <li><strong>账号信息：</strong>注册时提供的昵称、邮箱地址、密码等。</li>
            <li><strong>用户内容：</strong>您上传的照片、文字、纪念日、音频等数据。</li>
            <li><strong>设备与日志信息：</strong>IP 地址、浏览器类型、访问时间、设备型号等，用于优化服务体验和保障安全。</li>
            <li><strong>Cookies：</strong>我们使用 Cookies 来记住您的登录状态和偏好设置。</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span class="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
            信息的用途
          </h2>
          <ul class="list-disc pl-5 space-y-2 ml-11">
            <li>提供、维护和改进我们的服务。</li>
            <li>个性化您的体验（如推荐相关模板）。</li>
            <li>发送服务通知、安全提醒或您订阅的内容。</li>
            <li>防止欺诈、滥用和安全漏洞。</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span class="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
            信息共享与披露
          </h2>
          <p class="mb-2">我们不会出售您的个人信息。仅在以下情况共享：</p>
          <ul class="list-disc pl-5 space-y-2 ml-11">
            <li><strong>获得您的同意。</strong></li>
            <li><strong>法律要求：</strong>响应法院命令、法律程序或政府要求。</li>
            <li><strong>服务提供商：</strong>与代表我们需要处理数据的第三方（如云存储服务商、短信服务商）共享必要信息，这些第三方受严格的保密义务约束。</li>
            <li><strong>保护权利：</strong>为了保护 DLove、用户或公众的权利、财产或安全。</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span class="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
            数据存储与安全
          </h2>
          <ul class="list-disc pl-5 space-y-2 ml-11">
            <li>我们采取合理的安全措施（如加密传输、访问控制）来保护您的信息。</li>
            <li>您的数据存储在安全的服务器上。</li>
            <li>请注意，互联网传输并非绝对安全，我们无法保证信息的绝对安全。</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span class="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">5</span>
            管理您的信息
          </h2>
          <ul class="list-disc pl-5 space-y-2 ml-11">
            <li>您可以随时登录账号查看、修改您的个人信息。</li>
            <li>您可以联系我们申请注销账号。注销后，我们将删除或匿名化处理您的个人数据，法律法规另有规定的除外。</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span class="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">6</span>
            未成年人保护
          </h2>
          <p>
            我们的服务主要面向成年人。若您是未成年人，请在监护人指导下使用。
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span class="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">7</span>
            政策更新
          </h2>
          <p>
            我们可能会不时更新本隐私政策。更新后的政策将在网站上公布，重大变更会通过邮件或站内信通知。
          </p>
        </section>
      </div>

      <!-- 底部 -->
      <div class="bg-gray-50 px-6 py-6 sm:px-10 border-t border-gray-100 flex justify-center">
        <a href="javascript:;" @click="uiStore.openAuthModal('register')" class="text-primary-600 hover:text-primary-700 font-medium">
          立即注册
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUIStore } from '@/store/ui';

const uiStore = useUIStore();
</script>

<style scoped>
section {
  @apply border-b border-gray-100 pb-8 last:border-0;
}
</style>
