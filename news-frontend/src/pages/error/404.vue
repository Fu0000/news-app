<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()

const handleGoHome = () => {
  router.replace('/')
}
</script>

<template>
  <div class="h-full w-full bg-surface-muted flex flex-col items-center justify-center relative overflow-hidden">
    
    <!-- 装饰性背景光晕 -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-accent/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px]"></div>
    </div>

    <!-- 404 内容区 -->
    <div class="relative z-10 flex flex-col items-center px-8 text-center animate-fade-in-up">
      
      <!-- 极简风插画 (用 Icon 组合替代) -->
      <div class="relative w-48 h-48 mb-8">
        <div class="absolute inset-0 flex items-center justify-center bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] rotate-3">
          <Icon icon="ph:planet-bold" class="w-24 h-24 text-primary-accent opacity-80" />
        </div>
        <div class="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg -rotate-12 animate-bounce-slow">
          <Icon icon="ph:star-four-fill" class="w-6 h-6 text-yellow-400" />
        </div>
        <div class="absolute -bottom-6 -left-2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg rotate-12">
          <Icon icon="ph:question-mark-bold" class="w-8 h-8 text-gray-300" />
        </div>
      </div>

      <!-- 渐变文字 404 -->
      <h1 class="text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-accent mb-4 drop-shadow-sm">
        404
      </h1>
      
      <h2 class="text-2xl font-bold text-gray-800 mb-3 tracking-wide">
        信号丢失在太空中
      </h2>
      
      <p class="text-[15px] text-gray-500 leading-relaxed font-medium mb-12 max-w-xs mx-auto">
        抱歉，您要访问的页面可能已被删除、重命名，或者它从未存在过。
      </p>

      <!-- 返回首页按钮 -->
      <button 
        @click="handleGoHome"
        class="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-300 bg-primary rounded-full hover:bg-primary-accent hover:shadow-float active:scale-95 overflow-hidden"
      >
        <span class="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
        <Icon icon="ph:rocket-launch-bold" class="w-5 h-5 mr-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
        <span class="relative">返回地球 (首页)</span>
      </button>

    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-bounce-slow {
  animation: bounce 3s infinite;
}
@keyframes bounce {
  0%, 100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>