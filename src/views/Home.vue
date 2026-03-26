<template>
  <div class="home-page">
    <!-- 英雄区域 -->
    <section class="hero-section relative overflow-hidden flex items-center justify-center min-h-[calc(100vh-64px)] md:min-h-screen">
      <!-- 动态视频背景/动画背景 -->
      <div class="absolute inset-0 z-0 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-rose-100 via-purple-100 to-blue-50 animate-gradient-xy"></div>
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div class="container-custom relative z-10 py-12 md:py-36 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- 左侧：情感文案 -->
        <div class="text-left space-y-8">
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm text-primary-600 text-sm font-medium mb-4 animate-fade-in-up">
            <span class="flex h-2 w-2 relative mr-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            已有 12,450 个有心人在这里记录了爱
          </div>
          
          <h1 class="text-5xl md:text-7xl font-display font-bold text-gray-900 leading-tight tracking-tight">
            想对 TA 说的话 <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-600 inline-block pb-1">别藏在心里</span>
          </h1>
          
          <p class="text-xl text-gray-600 max-w-lg leading-relaxed">
            不需要写代码，也不需要懂设计。只需上传一张照片，写下一句情话，我们帮你生成一份感动 TA 的专属网页礼物。
          </p>
          
          <div class="flex flex-wrap gap-4 pt-4">
            <router-link to="/templates" class="btn-primary py-4 px-8 text-lg shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 transition-all transform hover:-translate-y-1">
              <el-icon class="mr-2"><Edit /></el-icon>
              开始制作礼物
            </router-link>
            <div class="flex items-center gap-2 text-gray-500 text-sm px-4">
              <el-icon class="text-green-500"><CircleCheckFilled /></el-icon> 免费试玩
              <el-icon class="text-green-500 ml-2"><CircleCheckFilled /></el-icon> 手机预览
            </div>
          </div>
        </div>

        <!-- 右侧：统一视觉组合 (Unified Romantic Composition) -->
        <div class="relative hidden lg:flex h-[650px] w-full items-center justify-center perspective-1000">
           <!-- 组合体容器 -->
           <div class="relative w-[380px] h-[520px] romantic-card-container transition-all duration-700 ease-out preserve-3d group">
              
              <!-- 层级1：黑胶唱片 (代表听觉/氛围) - 位于卡片后方 -->
              <div class="absolute -right-24 top-12 w-64 h-64 rounded-full bg-[#1a1a1a] shadow-2xl flex items-center justify-center animate-[spin_8s_linear_infinite] -z-10 group-hover:-right-32 transition-all duration-700 ease-out border-4 border-gray-900">
                 <!-- 唱片纹理 -->
                 <div class="absolute inset-0 rounded-full border-[2px] border-white/5 opacity-50"></div>
                 <div class="absolute inset-2 rounded-full border-[1px] border-white/5 opacity-40"></div>
                 <div class="absolute inset-4 rounded-full border-[1px] border-white/5 opacity-30"></div>
                 <div class="absolute inset-0 bg-[repeating-radial-gradient(#222_0px,#111_2px,#222_4px)] rounded-full opacity-80"></div>
                 <!-- 唱片封面 -->
                 <div class="absolute w-24 h-24 rounded-full bg-rose-500 overflow-hidden border-4 border-[#111] shadow-inner">
                    <img src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop" class="w-full h-full object-cover opacity-90" alt="Album Art" />
                 </div>
              </div>

              <!-- 层级2：主视觉卡片 (代表记忆/视觉) - 核心主体 -->
              <div class="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.1)] border border-white/60 p-5 flex flex-col z-20 transition-transform duration-500">
                 <!-- 拍立得风格照片区 -->
                 <div class="relative h-[65%] w-full bg-gray-100 rounded-2xl overflow-hidden shadow-inner group-hover:shadow-md transition-shadow duration-500">
                    <img src="@/assets/images/default-cover.png" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Love Story" />
                    <!-- 叠加层 -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                 </div>
                 
                 <!-- 内容区 -->
                 <div class="flex-1 pt-6 px-2 relative">
                    <!-- 装饰性胶带效果 -->
                    <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-rose-200/50 backdrop-blur-sm transform -rotate-2 opacity-80"></div>

                    <h3 class="font-display text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                       我们的故事
                       <el-icon class="text-rose-500 text-lg"><Heart /></el-icon>
                    </h3>
                    <p class="text-sm text-gray-500 font-light leading-relaxed">
                       "不仅仅是照片和文字，<br>更是我们共同走过的每一个心动瞬间。"
                    </p>
                    
                    <!-- 底部互动暗示 -->
                    <div class="mt-auto pt-4 flex items-center justify-between border-t border-gray-100/50">
                       <div class="flex -space-x-2">
                          <div class="w-6 h-6 rounded-full bg-gray-200 border-2 border-white"></div>
                          <div class="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"></div>
                       </div>
                       <span class="text-xs text-rose-400 font-medium">Click to Preview -></span>
                    </div>
                 </div>
              </div>

              <!-- 层级3：悬浮标签 (代表时间/仪式感) - 点缀 -->
              <div class="absolute -left-6 top-8 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg shadow-rose-500/10 z-30 transform -rotate-6 group-hover:-rotate-3 transition-transform duration-500 border border-white/50">
                 <div class="flex flex-col items-center">
                    <span class="text-[10px] text-gray-400 font-bold tracking-widest uppercase">ANNIVERSARY</span>
                    <span class="text-xl font-display font-bold text-gray-800">1st Year</span>
                 </div>
                 <!-- 装饰圆点 -->
                 <div class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></div>
              </div>

              <!-- 播放器控制条 (连接 音乐与卡片) -->
              <div class="absolute -right-4 bottom-20 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg z-30 flex flex-col items-center gap-2 border border-white/50 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-500">
                 <div class="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 cursor-pointer hover:bg-rose-100 transition-colors">
                    <el-icon><VideoPlay /></el-icon>
                 </div>
                 <div class="w-1 h-8 bg-gray-100 rounded-full overflow-hidden flex flex-col justify-end">
                    <div class="w-full h-1/2 bg-rose-400 rounded-full animate-music-wave"></div>
                 </div>
              </div>
           </div>

           <!-- 氛围光晕 -->
           <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-rose-100/30 via-purple-100/20 to-blue-100/10 rounded-full blur-3xl pointer-events-none -z-20"></div>
        </div>
      </div>
    </section>

    <!-- 特色区域 -->
    <section id="about" class="py-24 bg-gradient-to-b from-white to-blue-50">
      <div class="container-custom">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-display font-bold mb-6 text-gray-800">
            <span class="relative inline-block">
              情感表达
              <span class="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full transform scale-x-75"></span>
            </span>
            的艺术
          </h2>
          <p class="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">我们相信，每一段感情都值得被精心表达，每一个重要时刻都应该被用心记录。</p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
          <!-- 特色1 -->
          <div class="bg-white rounded-2xl p-10 text-center shadow-card hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div class="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <el-icon class="text-4xl text-primary-600"><MagicStick /></el-icon>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-800">艺术设计</h3>
            <p class="text-gray-600 leading-relaxed">每一个模板都是一件数字艺术品，精心设计以唤起最真挚的情感共鸣。</p>
          </div>
          
          <!-- 特色2 -->
          <div class="bg-white rounded-2xl p-10 text-center shadow-card hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div class="w-20 h-20 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <el-icon class="text-4xl text-accent-600"><Download /></el-icon>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-800">个性表达</h3>
            <p class="text-gray-600 leading-relaxed">无需技术知识，只需填入您的故事和心意，创造专属于您的情感表达方式。</p>
          </div>
          
          <!-- 特色3 -->
          <div class="bg-white rounded-2xl p-10 text-center shadow-card hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div class="w-20 h-20 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <el-icon class="text-4xl text-secondary-600"><User /></el-icon>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-800">私密珍藏</h3>
            <p class="text-gray-600 leading-relaxed">您的情感表达只属于您和您珍视的人，我们致力于保护每一份真挚情感的私密性。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 模板展示区域 -->
    <section class="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div class="container-custom">
        <div class="text-center mb-20">
          <span class="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mb-6">为您精选</span>
          <h2 class="text-4xl md:text-5xl font-display font-bold mb-6 text-gray-800">
            情感表达<span class="text-primary-600">模板</span>
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">每一个模板都承载着独特的情感故事，等待您注入专属的回忆与心意。</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <!-- 模板卡片循环 -->
          <div v-for="i in 6" :key="i" class="rounded-2xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 group" ref="templateCards">
            <div class="relative">
              <img src="https://via.placeholder.com/400x250" alt="模板预览" class="w-full h-72 object-cover card-image transition-transform duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-500 card-overlay"></div>
              <div class="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <h3 class="text-2xl font-bold mb-2">模板名称 {{ i }}</h3>
                <p class="text-sm opacity-90">适合表白、纪念日等特殊时刻</p>
              </div>
              <div class="absolute top-4 right-4">
                <span class="inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary-700 text-sm font-medium shadow-sm">热门</span>
              </div>
            </div>
            <div class="p-6 bg-white">
              <div class="flex justify-between items-center">
                <div>
                  <div class="flex items-center mb-2">
                    <el-icon class="text-yellow-500 mr-1"><Star /></el-icon>
                    <el-icon class="text-yellow-500 mr-1"><Star /></el-icon>
                    <el-icon class="text-yellow-500 mr-1"><Star /></el-icon>
                    <el-icon class="text-yellow-500 mr-1"><Star /></el-icon>
                    <el-icon class="text-yellow-500 mr-1"><Star /></el-icon>
                    <span class="text-gray-500 text-sm ml-1">(24)</span>
                  </div>
                  <!-- <span class="text-primary-600 font-bold text-lg">{{ formatDCoin(1990) }}</span> -->
                  <span class="text-xs text-gray-400">已有 1,203 人制作</span>
                </div>
                <router-link to="/templates/1" class="btn-sm btn-outline-primary shadow-sm hover:shadow-md transition-all duration-300">
                  立即制作
                </router-link>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-16">
          <router-link to="/templates" class="btn-primary py-3 px-8 text-lg shadow-glow">
            探索更多模板
            <el-icon class="ml-2"><ArrowRight /></el-icon>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 使用流程区域 -->
    <section class="py-28 bg-white relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent z-0"></div>
      <div class="container-custom relative z-10">
        <div class="text-center mb-20">
          <span class="inline-block px-4 py-2 rounded-full bg-accent-100 text-accent-700 font-medium text-sm mb-6">简单易用</span>
          <h2 class="text-4xl md:text-5xl font-display font-bold mb-6 text-gray-800">
            <span class="relative inline-block">
              三步
              <span class="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 to-primary-400 rounded-full transform scale-x-75"></span>
            </span>
            创造专属情感表达
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">无需任何技术知识，只需简单几步，即可创建打动人心的情感表达页面。</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <!-- 连接线 -->
          <div class="hidden md:block absolute top-16 left-1/6 right-1/6 h-1 bg-gradient-to-r from-primary-400 via-accent-400 to-secondary-400 z-0"></div>
          
          <!-- 步骤1 -->
          <div class="text-center relative z-10">
            <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-8 text-white font-bold text-2xl shadow-glow-blue transform transition-transform duration-500 hover:scale-110">1</div>
            <h3 class="text-2xl font-bold mb-4 text-gray-800">选择模板</h3>
            <p class="text-gray-600 leading-relaxed">浏览我们精心设计的情感模板库，选择最能表达您心意的设计。</p>
          </div>
          
          <!-- 步骤2 -->
          <div class="text-center relative z-10">
            <div class="w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-8 text-white font-bold text-2xl shadow-glow transform transition-transform duration-500 hover:scale-110">2</div>
            <h3 class="text-2xl font-bold mb-4 text-gray-800">个性定制</h3>
            <p class="text-gray-600 leading-relaxed">添加您的文字、照片和回忆，将模板变成独一无二的情感故事。</p>
          </div>
          
          <!-- 步骤3 -->
          <div class="text-center relative z-10">
            <div class="w-20 h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-8 text-white font-bold text-2xl shadow-glow transform transition-transform duration-500 hover:scale-110">3</div>
            <h3 class="text-2xl font-bold mb-4 text-gray-800">分享珍藏</h3>
            <p class="text-gray-600 leading-relaxed">将您的情感表达分享给珍视的人，或珍藏为永恒的数字回忆。</p>
          </div>
        </div>
        
        <div class="text-center mt-16">
          <router-link to="/templates" class="btn-outline-primary py-3 px-8 text-lg">
            开始创建
            <el-icon class="ml-2"><ArrowRight /></el-icon>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 用户评价区域 -->
    <section class="py-28 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent z-0"></div>
      <div class="container-custom relative z-10">
        <div class="text-center mb-20">
          <span class="inline-block px-4 py-2 rounded-full bg-secondary-100 text-secondary-700 font-medium text-sm mb-6">真实故事</span>
          <h2 class="text-4xl md:text-5xl font-display font-bold mb-6 text-gray-800">
            情感的<span class="text-secondary-600">共鸣</span>
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">每一个模板背后，都有一个感动人心的真实故事。</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <!-- 评价1 -->
          <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div class="flex items-center mb-4 sm:mb-6">
              <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden mr-3 sm:mr-4 border-2 border-primary-100">
                <img src="https://via.placeholder.com/100x100" alt="用户头像" class="w-full h-full object-cover">
              </div>
              <div>
                <h4 class="text-base sm:text-lg font-bold text-gray-800">李小华</h4>
                <div class="flex items-center mt-1">
                  <el-icon class="text-yellow-500 mr-1 text-sm sm:text-base"><Star /></el-icon>
                  <el-icon class="text-yellow-500 mr-1 text-sm sm:text-base"><Star /></el-icon>
                  <el-icon class="text-yellow-500 mr-1 text-sm sm:text-base"><Star /></el-icon>
                  <el-icon class="text-yellow-500 mr-1 text-sm sm:text-base"><Star /></el-icon>
                  <el-icon class="text-yellow-500 mr-1 text-sm sm:text-base"><Star /></el-icon>
                </div>
              </div>
            </div>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">"用这个模板给女朋友做了一个纪念日礼物，她看到后感动得哭了。这比实体礼物更有意义，因为它承载了我们的回忆和故事。"</p>
            <div class="text-xs sm:text-sm text-gray-500">纪念日模板 · 2023年5月</div>
          </div>
          
          <!-- 评价2 -->
          <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div class="flex items-center mb-4 sm:mb-6">
              <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden mr-3 sm:mr-4 border-2 border-accent-100">
                <img src="https://via.placeholder.com/100x100" alt="用户头像" class="w-full h-full object-cover">
              </div>
              <div>
                <h4 class="text-base sm:text-lg font-bold text-gray-800">张明</h4>
                <div class="flex items-center mt-1">
                  <el-icon class="text-yellow-500 mr-1 text-sm sm:text-base"><Star /></el-icon>
                  <el-icon class="text-yellow-500 mr-1 text-sm sm:text-base"><Star /></el-icon>
                  <el-icon class="text-yellow-500 mr-1 text-sm sm:text-base"><Star /></el-icon>
                  <el-icon class="text-yellow-500 mr-1 text-sm sm:text-base"><Star /></el-icon>
                  <el-icon class="text-yellow-500 mr-1 text-sm sm:text-base"><Star /></el-icon>
                </div>
              </div>
            </div>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">"为父母的结婚纪念日制作了一个回忆页面，收集了他们几十年的照片和故事。他们看到后非常感动，说这是收到过最有意义的礼物。"</p>
            <div class="text-xs sm:text-sm text-gray-500">家庭纪念模板 · 2023年8月</div>
          </div>
          
          <!-- 评价3 -->
          <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div class="flex items-center mb-4 sm:mb-6">
              <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden mr-3 sm:mr-4 border-2 border-secondary-100">
                <img src="https://via.placeholder.com/100x100" alt="用户头像" class="w-full h-full object-cover">
              </div>
              <div>
                <h4 class="text-base sm:text-lg font-bold text-gray-800">陈佳</h4>
                <div class="flex items-center mt-1">
                  <el-icon class="text-yellow-500 mr-1 text-sm sm:text-base"><Star /></el-icon>
                  <el-icon class="text-yellow-500 mr-1 text-sm sm:text-base"><Star /></el-icon>
                  <el-icon class="text-yellow-500 mr-1 text-sm sm:text-base"><Star /></el-icon>
                  <el-icon class="text-yellow-500 mr-1 text-sm sm:text-base"><Star /></el-icon>
                  <el-icon class="text-yellow-500 mr-1 text-sm sm:text-base"><Star /></el-icon>
                </div>
              </div>
            </div>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">"用这个平台向男友表白，设计了一个充满我们共同回忆的页面。他看完后立刻打电话给我，声音都在颤抖。现在我们已经订婚了！"</p>
            <div class="text-xs sm:text-sm text-gray-500">表白模板 · 2023年10月</div>
          </div>
        </div>
        
        <div class="text-center mt-10 sm:mt-16">
          <router-link to="/templates" class="btn-outline-secondary py-2 sm:py-3 px-6 sm:px-8 text-base sm:text-lg touch-target">
            查看更多用户故事
            <el-icon class="ml-2"><ArrowRight /></el-icon>
          </router-link>
        </div>
      </div>
    </section>
    
    <!-- 行动召唤区域 -->
    <section class="py-24 relative overflow-hidden bg-white">
      <!-- 装饰背景 -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div class="container-custom relative z-10">
        <div class="bg-gradient-to-br from-white to-rose-50/50 rounded-3xl p-12 md:p-20 text-center shadow-xl border border-rose-100 relative overflow-hidden">
          
          <!-- 内部装饰 -->
          <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-rose-200 to-purple-200 rounded-full blur-3xl opacity-20"></div>
          <div class="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-gradient-to-br from-blue-200 to-teal-200 rounded-full blur-3xl opacity-20"></div>

          <div class="relative z-10 max-w-3xl mx-auto">
            <div class="inline-block mb-8 relative">
               <div class="w-20 h-20 bg-gradient-to-tr from-rose-400 to-purple-500 rounded-2xl rotate-3 flex items-center justify-center shadow-lg shadow-rose-500/20 transform hover:rotate-6 transition-transform duration-300">
                  <el-icon class="text-4xl text-white"><MagicStick /></el-icon>
               </div>
               <!-- 悬浮装饰 -->
               <div class="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                  <el-icon class="text-xs text-yellow-700"><Star /></el-icon>
               </div>
            </div>

            <h2 class="text-4xl md:text-5xl font-display font-bold mb-6 text-gray-900">
              准备好开始<span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">你的创作</span>了吗？
            </h2>
            
            <p class="text-xl text-gray-600 mb-10 leading-relaxed">
              无需繁琐的操作，只需几分钟，就能将你的心意变成一份独一无二的数字礼物。
              <br class="hidden md:block" />让爱，触手可及。
            </p>

            <div class="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <router-link to="/templates" class="btn-primary py-4 px-10 text-lg shadow-xl shadow-rose-500/20 hover:shadow-2xl hover:shadow-rose-500/30 hover:-translate-y-1 transition-all w-full sm:w-auto">
                <span class="flex items-center justify-center">
                  立即浏览模板 <el-icon class="ml-2"><ArrowRight /></el-icon>
                </span>
              </router-link>
              <a href="#about" class="px-8 py-4 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto">
                了解更多细节
              </a>
            </div>

            <div class="mt-10 flex items-center justify-center gap-6 text-sm text-gray-400">
               <span class="flex items-center"><el-icon class="mr-1 text-green-500"><CircleCheckFilled /></el-icon> 免费试玩</span>
               <span class="flex items-center"><el-icon class="mr-1 text-green-500"><CircleCheckFilled /></el-icon> 永久保存</span>
               <span class="flex items-center"><el-icon class="mr-1 text-green-500"><CircleCheckFilled /></el-icon> 隐私加密</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="container-custom">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4 flex items-center">
              <el-icon class="mr-2 text-primary-500"><Heart /></el-icon> DLove
            </h3>
            <p class="text-gray-400">
              让每段感情，都值得被精心表达。
            </p>
          </div>

          <div>
            <h4 class="font-bold mb-4">快速链接</h4>
            <ul class="space-y-2">
              <li>
                <router-link to="/" class="text-gray-400 hover:text-white flex items-center">
                  <el-icon class="mr-2 text-sm"><House /></el-icon> 首页
                </router-link>
              </li>
              <li>
                <router-link to="/templates" class="text-gray-400 hover:text-white flex items-center">
                  <el-icon class="mr-2 text-sm"><Goods /></el-icon> 模板商城
                </router-link>
              </li>
              <li>
                <router-link to="/user/profile" class="text-gray-400 hover:text-white flex items-center">
                  <el-icon class="mr-2 text-sm"><User /></el-icon> 个人中心
                </router-link>
              </li>
              <li>
                <router-link to="/user/purchases" class="text-gray-400 hover:text-white flex items-center">
                  <el-icon class="mr-2 text-sm"><ShoppingBag /></el-icon> 我的购买
                </router-link>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold mb-4">帮助支持</h4>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-gray-400 hover:text-white flex items-center">
                  <el-icon class="mr-2 text-sm"><Document /></el-icon> 使用指南
                </a>
              </li>
              <li>
                <router-link to="/developer/guide" class="text-gray-400 hover:text-white flex items-center">
                  <el-icon class="mr-2 text-sm"><Monitor /></el-icon> 开发者
                </router-link>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white flex items-center">
                  <el-icon class="mr-2 text-sm"><QuestionFilled /></el-icon> 常见问题
                </a>
              </li>
              <li>
                <router-link to="/terms" class="text-gray-400 hover:text-white flex items-center">
                  <el-icon class="mr-2 text-sm"><Memo /></el-icon> 服务条款
                </router-link>
              </li>
              <li>
                <router-link to="/privacy" class="text-gray-400 hover:text-white flex items-center">
                  <el-icon class="mr-2 text-sm"><Lock /></el-icon> 隐私政策
                </router-link>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white flex items-center">
                  <el-icon class="mr-2 text-sm"><Service /></el-icon> 联系我们
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold mb-4">关注我们</h4>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white text-xl"><el-icon><Platform /></el-icon></a>
              <a href="#" class="text-gray-400 hover:text-white text-xl"><el-icon><Promotion /></el-icon></a>
              <a href="#" class="text-gray-400 hover:text-white text-xl"><el-icon><Avatar /></el-icon></a>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {{ new Date().getFullYear() }} DLove. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  Star, ArrowRight, Platform, Promotion, Avatar, Edit, CircleCheckFilled, 
  ChatDotRound, VideoPlay, Calendar, MagicStick, Monitor,
  House, Goods, User, ShoppingBag, Document, QuestionFilled, Memo, Lock, Service
} from '@element-plus/icons-vue';
import Heart from '@/components/icons/Heart.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatDCoin } from '@/config/currency'

// 注册ScrollTrigger插件
gsap.registerPlugin(ScrollTrigger);

const heartIcon = ref(null);

onMounted(() => {
  // 页面加载动画
  gsap.from('.hero-section h1', { opacity: 0, y: 30, duration: 1, delay: 0.2 });
  gsap.from('.hero-section p', { opacity: 0, y: 20, duration: 1, delay: 0.4 });
  
  // 确保按钮在动画开始前是可见的
  document.querySelectorAll('.hero-section .btn-primary').forEach(btn => {
    btn.style.opacity = '1';
  });
  
  // 然后应用动画效果
  gsap.from('.hero-section .btn-primary', { y: 20, duration: 1, delay: 0.6 });
  
  // 心形图标浮动动画
  if (heartIcon.value) {
    gsap.to(heartIcon.value, {
      y: -10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }
  
  // 滚动动画
  // 排除 Hero Section，因为它有自己的加载动画
  const sections = Array.from(document.querySelectorAll('section')).filter(
    section => !section.classList.contains('hero-section')
  );
  
  sections.forEach(section => {
    gsap.from(section, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
      }
    });
  });
});
</script>

<style scoped>
.hero-section {
  min-height: 90vh;
  display: flex;
  align-items: center;
}

/* 确保按钮在初始状态下可见 */
.hero-section .btn-primary,
.hero-section .btn-outline {
  opacity: 1 !important; /* 使用!important确保优先级 */
}

.gradient-text-warm {
  background: linear-gradient(to right, #ff7e5f, #feb47b);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

.text-shadow-lg {
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.shadow-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.shadow-glow {
  box-shadow: 0 0 20px rgba(255, 126, 95, 0.4);
}

/* 卡片悬停效果 */
.feature-card:hover .feature-icon,
.template-card:hover .template-image {
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 70vh;
  }
}

/* 3D Visual Effects */
.perspective-1000 {
  perspective: 1000px;
}
.preserve-3d {
  transform-style: preserve-3d;
}
.romantic-card-container {
  transform: rotateY(0deg) rotateX(0deg);
}
.romantic-card-container:hover {
  transform: rotateY(6deg) rotateX(3deg);
}

/* Animations */
@keyframes music-wave {
  0%, 100% { height: 30%; }
  50% { height: 100%; }
}
.animate-music-wave {
  animation: music-wave 1s ease-in-out infinite;
}
</style>
