<template>
  <transition name="fade">
    <div v-if="ui.globalLoading" class="romantic-overlay">
      <div class="romantic-bg"></div>
      <div class="romantic-content">
        <div class="heart-beat" aria-hidden="true"></div>
        <p class="message">{{ ui.loadingMessage || '正在加载…' }}</p>
        <div class="twinkles" aria-hidden="true">
          <span v-for="i in 12" :key="i" class="twinkle"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useUIStore } from '@/store/ui'
const ui = useUIStore()
</script>

<style scoped>
.romantic-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
}
.romantic-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(1200px 600px at 20% 10%, rgba(255,182,193,0.25), transparent),
              radial-gradient(1000px 500px at 80% 90%, rgba(147,197,253,0.22), transparent),
              linear-gradient(135deg, rgba(255,240,245,0.6), rgba(240,248,255,0.6));
}
.romantic-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.heart-beat {
  width: 64px;
  height: 64px;
  position: relative;
  transform: rotate(-45deg);
  background: linear-gradient(135deg, #ff6b81, #ff94a6);
  box-shadow: 0 10px 25px rgba(255, 107, 129, 0.35);
  animation: beat 1.1s ease-in-out infinite;
}
.heart-beat::before, .heart-beat::after {
  content: '';
  position: absolute;
  width: 64px;
  height: 64px;
  background: inherit;
  border-radius: 50%;
}
.heart-beat::before { top: -32px; }
.heart-beat::after { left: 32px; }

@keyframes beat {
  0%, 100% { transform: rotate(-45deg) scale(1); }
  30% { transform: rotate(-45deg) scale(1.12); }
}

.message {
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #5a5a66;
  text-shadow: 0 1px 0 rgba(255,255,255,0.9);
}

.twinkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.twinkle {
  position: absolute;
  width: 3px; height: 3px;
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
  animation: twinkle 2.8s ease-in-out infinite;
}
.twinkle:nth-child(odd) { animation-duration: 3.4s; }
.twinkle:nth-child(3n) { animation-duration: 2.1s; }
@keyframes twinkle {
  0% { transform: scale(0.6); opacity: 0.5; }
  50% { transform: scale(1.4); opacity: 1; }
  100% { transform: scale(0.6); opacity: 0.5; }
}

/* 随机位置 */
.twinkle { top: calc(var(--t, 50) * 1%); left: calc(var(--l, 50) * 1%); }
.twinkle:nth-child(1) { --t: 12; --l: 22; }
.twinkle:nth-child(2) { --t: 18; --l: 78; }
.twinkle:nth-child(3) { --t: 33; --l: 12; }
.twinkle:nth-child(4) { --t: 45; --l: 85; }
.twinkle:nth-child(5) { --t: 60; --l: 28; }
.twinkle:nth-child(6) { --t: 68; --l: 66; }
.twinkle:nth-child(7) { --t: 72; --l: 44; }
.twinkle:nth-child(8) { --t: 22; --l: 56; }
.twinkle:nth-child(9) { --t: 84; --l: 18; }
.twinkle:nth-child(10){ --t: 88; --l: 72; }
.twinkle:nth-child(11){ --t: 40; --l: 38; }
.twinkle:nth-child(12){ --t: 26; --l: 92; }

.fade-enter-active, .fade-leave-active { transition: opacity .25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>