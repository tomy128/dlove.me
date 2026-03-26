<template>
  <div class="developer-guide-page min-h-screen bg-gray-50 flex flex-col">
    <!-- 头部横幅 -->
    <div class="bg-gray-900 text-white py-16">
      <div class="container-custom">
        <h1 class="text-3xl md:text-5xl font-bold mb-4 font-display">开发者中心</h1>
        <p class="text-xl text-gray-400 max-w-2xl">
          加入 DLove 创作者生态，将你的创意代码转化为可配置的情感礼物。
        </p>
      </div>
    </div>

    <div class="container-custom py-12 flex-1">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- 左侧导航 -->
        <div class="lg:col-span-1">
          <div class="sticky top-8 space-y-1">
            <a href="#intro" class="block px-4 py-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 font-medium transition-colors">协议简介</a>
            <a href="#structure" class="block px-4 py-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 font-medium transition-colors">目录结构</a>
            <a href="#config" class="block px-4 py-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 font-medium transition-colors">配置文件 (Schema)</a>
            <a href="#frameworks" class="block px-4 py-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 font-medium transition-colors">现代框架接入 (Vue/React)</a>
            <a href="#sdk" class="block px-4 py-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 font-medium transition-colors">HTML SDK 接入</a>
            <a href="#download" class="block px-4 py-2 rounded-lg bg-primary-50 text-primary-700 font-medium transition-colors mt-4">下载 Demo</a>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="lg:col-span-3 space-y-12">
          
          <!-- 1. 简介 -->
          <section id="intro" class="scroll-mt-24">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">DLove 模板协议简介</h2>
            <p class="text-gray-600 mb-4">
              DLove 模板不仅仅是一个静态网页，它是一个包含配置定义、资源文件和渲染逻辑的完整包。
              通过遵循我们的协议，你的代码可以被非技术用户轻松编辑和个性化。
            </p>
          </section>

          <!-- 2. 目录结构 -->
          <section id="structure" class="scroll-mt-24">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">目录结构</h2>
            <p class="text-gray-600 mb-4">最终产物（Build 后）需满足以下结构：</p>
            <div class="bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-300 shadow-lg">
<pre>
/template-name/
  ├── index.html          <span class="text-green-400"># [必须] 入口文件</span>
  ├── dlove.config.json   <span class="text-green-400"># [必须] 配置文件</span>
  ├── preview.jpg         <span class="text-green-400"># [推荐] 预览图 (16:9)</span>
  └── assets/             <span class="text-gray-500"># 资源文件 (如果是 Vue/React，这里是打包后的 js/css)</span>
</pre>
            </div>
          </section>

          <!-- 3. 配置文件 -->
          <section id="config" class="scroll-mt-24">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">配置文件详解 (dlove.config.json)</h2>
            <p class="text-gray-600 mb-4">这是模板的灵魂。它定义了编辑器的表单结构。</p>
            
            <div class="bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-300 shadow-lg overflow-x-auto">
<pre class="language-json">
{
  <span class="text-purple-400">"meta"</span>: {
    <span class="text-purple-400">"name"</span>: <span class="text-yellow-300">"星空下的告白"</span>,
    <span class="text-purple-400">"version"</span>: <span class="text-yellow-300">"1.0"</span>,
    <span class="text-purple-400">"author"</span>: <span class="text-yellow-300">"Your Name"</span>
  },
  <span class="text-purple-400">"fields"</span>: [
    {
      <span class="text-purple-400">"key"</span>: <span class="text-yellow-300">"partner_name"</span>,
      <span class="text-purple-400">"type"</span>: <span class="text-yellow-300">"text"</span>,
      <span class="text-purple-400">"label"</span>: <span class="text-yellow-300">"TA 的名字"</span>,
      <span class="text-purple-400">"default"</span>: <span class="text-yellow-300">"亲爱的"</span>,
      <span class="text-purple-400">"placeholder"</span>: <span class="text-yellow-300">"写下那个让你心动的名字"</span>
    },
    {
      <span class="text-purple-400">"key"</span>: <span class="text-yellow-300">"main_photo"</span>,
      <span class="text-purple-400">"type"</span>: <span class="text-yellow-300">"image"</span>,
      <span class="text-purple-400">"label"</span>: <span class="text-yellow-300">"封面合照"</span>
    },
    {
      <span class="text-purple-400">"key"</span>: <span class="text-yellow-300">"bg_music"</span>,
      <span class="text-purple-400">"type"</span>: <span class="text-yellow-300">"music"</span>,
      <span class="text-purple-400">"label"</span>: <span class="text-yellow-300">"背景音乐"</span>
    },
    {
      <span class="text-purple-400">"key"</span>: <span class="text-yellow-300">"content"</span>,
      <span class="text-purple-400">"type"</span>: <span class="text-yellow-300">"textarea"</span>,
      <span class="text-purple-400">"label"</span>: <span class="text-yellow-300">"深情告白"</span>,
      <span class="text-purple-400">"max_length"</span>: 500
    }
  ]
}
</pre>
            </div>
            
            <div class="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 class="font-bold text-blue-800 text-sm mb-2">支持的字段类型 (type):</h4>
              <ul class="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li><code>text</code>: 单行文本输入</li>
                <li><code>textarea</code>: 多行文本输入</li>
                <li><code>image</code>: 图片上传控件</li>
                <li><code>music</code>: 音乐上传/选择控件</li>
                <li><code>color</code>: 颜色选择器</li>
                <li><code>switch</code>: 开关 (boolean)</li>
              </ul>
            </div>
          </section>

          <!-- 4. 现代框架接入 -->
          <section id="frameworks" class="scroll-mt-24">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">现代框架接入 (Vue/React)</h2>
            <p class="text-gray-600 mb-4">
              如果你使用 Vue 或 React 开发模板，可以直接使用我们提供的 Hooks 来管理配置数据。
            </p>
            <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-6">
               <p class="text-yellow-700 text-sm">
                 <strong>注意：</strong> 为了支持本地开发预览，建议将 <code>dlove.config.json</code> 放在项目的 <code>public</code> 目录下，这样 Hooks 可以在初始化时通过 fetch 读取默认配置。
               </p>
            </div>

            <!-- Vue 示例 -->
            <div class="mb-8">
              <h3 class="text-lg font-bold text-green-600 mb-2 flex items-center">
                <span class="bg-green-100 p-1 rounded mr-2"><img src="https://vuejs.org/images/logo.png" class="w-4 h-4"/></span> 
                Vue 3 Composition API
              </h3>
              <div class="bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-300 shadow-lg">
<pre class="language-javascript">
<span class="text-gray-500">// hooks/useDLove.js</span>
<span class="text-purple-400">import</span> { ref, onMounted, onUnmounted } from <span class="text-yellow-300">'vue'</span>;

<span class="text-purple-400">export function</span> useDLove(initialOverrides = {}) {
  <span class="text-purple-400">const</span> config = ref({ ...initialOverrides });

  <span class="text-gray-500">// 辅助函数：从 schema 中提取默认值</span>
  <span class="text-purple-400">const</span> applyDefaultsFromSchema = (schema) => {
    <span class="text-purple-400">if</span> (!schema || !schema.fields) <span class="text-purple-400">return</span>;
    <span class="text-purple-400">const</span> defaults = {};
    schema.fields.forEach(field => {
      <span class="text-purple-400">if</span> (field.default !== undefined) {
        defaults[field.key] = field.default;
      }
    });
    <span class="text-gray-500">// 合并：现有 overrides > schema 默认值</span>
    config.value = { ...defaults, ...config.value };
  };

  <span class="text-purple-400">const</span> handleMessage = (event) => {
    <span class="text-purple-400">const</span> { type, data } = event.data;
    <span class="text-purple-400">if</span> (type === <span class="text-yellow-300">'DLOVE_UPDATE_CONFIG'</span>) {
      config.value = { ...config.value, ...data };
    }
  };

  onMounted(async () => {
    <span class="text-gray-500">// 1. 尝试读取本地配置 (开发模式或初始化)</span>
    <span class="text-purple-400">try</span> {
      <span class="text-purple-400">const</span> response = <span class="text-purple-400">await</span> fetch(<span class="text-yellow-300">'./dlove.config.json'</span>);
      <span class="text-purple-400">if</span> (response.ok) {
        <span class="text-purple-400">const</span> schema = <span class="text-purple-400">await</span> response.json();
        applyDefaultsFromSchema(schema);
      }
    } <span class="text-purple-400">catch</span> (e) {
      console.warn(<span class="text-yellow-300">'Failed to load dlove.config.json:'</span>, e);
    }

    <span class="text-gray-500">// 2. 监听编辑器消息</span>
    window.addEventListener(<span class="text-yellow-300">'message'</span>, handleMessage);
    
    <span class="text-gray-500">// 3. 发送就绪信号</span>
    window.parent.postMessage({ type: <span class="text-yellow-300">'DLOVE_TEMPLATE_READY'</span> }, <span class="text-yellow-300">'*'</span>);
  });

  onUnmounted(() => {
    window.removeEventListener(<span class="text-yellow-300">'message'</span>, handleMessage);
  });

  <span class="text-purple-400">return</span> { config };
}
</pre>
              </div>
            </div>

            <!-- React 示例 -->
            <div>
              <h3 class="text-lg font-bold text-blue-500 mb-2 flex items-center">
                <span class="bg-blue-100 p-1 rounded mr-2"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" class="w-4 h-4"/></span> 
                React Hooks
              </h3>
              <div class="bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-300 shadow-lg">
<pre class="language-javascript">
<span class="text-gray-500">// hooks/useDLove.js</span>
<span class="text-purple-400">import</span> { useState, useEffect } from <span class="text-yellow-300">'react'</span>;

<span class="text-purple-400">export function</span> useDLove(initialOverrides = {}) {
  <span class="text-purple-400">const</span> [config, setConfig] = useState({ ...initialOverrides });

  useEffect(() => {
    <span class="text-gray-500">// 辅助函数：提取默认值</span>
    <span class="text-purple-400">const</span> applyDefaultsFromSchema = (schema) => {
      <span class="text-purple-400">if</span> (!schema || !schema.fields) <span class="text-purple-400">return</span>;
      <span class="text-purple-400">const</span> defaults = {};
      schema.fields.forEach(field => {
        <span class="text-purple-400">if</span> (field.default !== undefined) {
          defaults[field.key] = field.default;
        }
      });
      setConfig(prev => ({ ...defaults, ...prev }));
    };

    <span class="text-gray-500">// 1. 读取本地配置</span>
    fetch(<span class="text-yellow-300">'./dlove.config.json'</span>)
      .then(res => {
        <span class="text-purple-400">if</span> (res.ok) <span class="text-purple-400">return</span> res.json();
        <span class="text-purple-400">throw new</span> Error(<span class="text-yellow-300">'Config not found'</span>);
      })
      .then(schema => applyDefaultsFromSchema(schema))
      .catch(e => console.warn(<span class="text-yellow-300">'Failed to load config:'</span>, e));

    <span class="text-gray-500">// 2. 监听消息</span>
    <span class="text-purple-400">const</span> handleMessage = (event) => {
      <span class="text-purple-400">const</span> { type, data } = event.data;
      <span class="text-purple-400">if</span> (type === <span class="text-yellow-300">'DLOVE_UPDATE_CONFIG'</span>) {
        setConfig(prev => ({ ...prev, ...data }));
      }
    };

    window.addEventListener(<span class="text-yellow-300">'message'</span>, handleMessage);
    window.parent.postMessage({ type: <span class="text-yellow-300">'DLOVE_TEMPLATE_READY'</span> }, <span class="text-yellow-300">'*'</span>);

    <span class="text-purple-400">return</span> () => window.removeEventListener(<span class="text-yellow-300">'message'</span>, handleMessage);
  }, []);

  <span class="text-purple-400">return</span> config;
}
</pre>
              </div>
            </div>
          </section>

          <!-- 5. HTML SDK (原通信机制) -->
          <section id="sdk" class="scroll-mt-24">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">HTML SDK 接入 (原生 JS)</h2>
            <p class="text-gray-600 mb-4">
              对于简单的静态 HTML 页面，我们提供了一个微型 SDK，自动处理 DOM 绑定。
            </p>
            
            <div class="bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-300 shadow-lg">
<pre class="language-html">
<span class="text-gray-500">&lt;!-- 1. 引入 SDK --&gt;</span>
<span class="text-blue-400">&lt;script</span> <span class="text-green-400">src</span>=<span class="text-yellow-300">"https://dlove.com/sdk/dlove-sdk.v1.js"</span><span class="text-blue-400">&gt;&lt;/script&gt;</span>

<span class="text-gray-500">&lt;!-- 2. 绑定元素 --&gt;</span>
<span class="text-blue-400">&lt;h1</span> <span class="text-green-400">data-dlove-field</span>=<span class="text-yellow-300">"partner_name"</span><span class="text-blue-400">&gt;</span>默认名字<span class="text-blue-400">&lt;/h1&gt;</span>
<span class="text-blue-400">&lt;img</span> <span class="text-green-400">data-dlove-field</span>=<span class="text-yellow-300">"main_photo"</span> <span class="text-green-400">src</span>=<span class="text-yellow-300">"default.jpg"</span> <span class="text-blue-400">/&gt;</span>

<span class="text-gray-500">&lt;!-- 3. 初始化 --&gt;</span>
<span class="text-blue-400">&lt;script&gt;</span>
  DLove.autoMap(); <span class="text-gray-500">// 自动寻找 data-dlove-field 并更新</span>
<span class="text-blue-400">&lt;/script&gt;</span>
</pre>
            </div>
          </section>

          <!-- 下载区域 -->
          <section id="download" class="mt-12 p-8 bg-primary-50 rounded-2xl border border-primary-100 text-center">
             <h3 class="text-2xl font-bold text-gray-800 mb-4">准备好开始了吗？</h3>
             <p class="text-gray-600 mb-6">下载标准 Demo 模板包，解压后即可看到完整的代码结构和通信示例。</p>
             <a href="/dlove-demo-templates.zip" download>
               <el-button type="primary" size="large" round class="px-8 shadow-lg shadow-primary-500/30">
                 <el-icon class="mr-2"><Download /></el-icon> 下载 Demo 模板包 (ZIP)
               </el-button>
             </a>
          </section>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Download } from '@element-plus/icons-vue';
</script>

<style scoped>
.font-display {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}
.scroll-mt-24 {
  scroll-margin-top: 6rem;
}
</style>
