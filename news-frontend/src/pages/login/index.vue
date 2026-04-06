<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useUserStore } from '@/store/user'
import request from '@/utils/request'

const router = useRouter()
const userStore = useUserStore()

// 状态控制
const phone = ref('')
const password = ref('')
const isSubmitting = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

// 简单正则校验
const isFormValid = computed(() => {
  const phoneReg = /^1[3-9]\d{9}$/
  return phoneReg.test(phone.value) && password.value.length >= 6
})

/**
 * 处理登录提交
 */
const handleLogin = async () => {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  errorMessage.value = ''
  
  try {
    const res: any = await request.post('/user/login', {
      phone: phone.value,
      password: password.value
    })
    
    // 登录成功，将用户信息存入 Pinia 与 LocalStorage
    userStore.setLoginState(res)
    
    if (process.env.NODE_ENV !== 'production') {
      console.info('[Auth] 用户登录成功', { userId: res.user_id })
    }
    
    // 跳转首页
    router.replace('/')
  } catch (err: any) {
    errorMessage.value = err.message || '登录失败，请稍后重试'
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Auth] 登录异常', err)
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="h-full w-full bg-white flex flex-col relative">
    
    <!-- 装饰性背景 (符合互联网审美的光晕效果) -->
    <div class="absolute top-0 left-0 w-full h-[400px] overflow-hidden z-0 pointer-events-none">
      <div class="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] rounded-full bg-primary-accent/10 blur-[60px]"></div>
      <div class="absolute top-[100px] -left-[100px] w-[250px] h-[250px] rounded-full bg-blue-500/10 blur-[50px]"></div>
    </div>

    <!-- 导航栏 -->
    <div class="w-full pt-12 pb-4 px-6 flex justify-end items-center relative z-10">
      <button class="text-sm font-medium text-gray-500 hover:text-primary transition-colors">
        帮助与设置
      </button>
    </div>

    <!-- 主体内容 -->
    <div class="flex-1 px-8 pt-8 pb-12 flex flex-col relative z-10">
      
      <!-- 头部欢迎区 -->
      <div class="mb-12">
        <h1 class="text-4xl font-bold tracking-tight text-primary mb-3 font-display">
          探索世界<br>
          <span class="text-primary-accent relative inline-block mt-2">
            从这里开始
            <!-- 底部波浪线装饰 -->
            <svg class="absolute -bottom-2 left-0 w-full h-2 text-primary-accent/30" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,10 Q25,20 50,10 T100,10" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
            </svg>
          </span>
        </h1>
        <p class="text-gray-500 mt-6 text-sm font-medium">综合资讯 · 深度阅读 · 互动社区</p>
      </div>

      <!-- 表单区 -->
      <div class="flex-1 flex flex-col space-y-5">
        
        <!-- 手机号输入 -->
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-accent transition-colors">
            <Icon icon="ph:device-mobile" class="w-5 h-5" />
          </div>
          <input 
            v-model="phone"
            type="tel" 
            maxlength="11"
            class="input-field pl-12" 
            placeholder="请输入手机号码"
          />
        </div>

        <!-- 密码输入 -->
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-accent transition-colors">
            <Icon icon="ph:lock-key" class="w-5 h-5" />
          </div>
          <input 
            v-model="password"
            :type="showPassword ? 'text' : 'password'" 
            class="input-field pl-12 pr-12" 
            placeholder="请输入登录密码"
            @keyup.enter="handleLogin"
          />
          <button 
            type="button"
            class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            @click="showPassword = !showPassword"
          >
            <Icon :icon="showPassword ? 'ph:eye' : 'ph:eye-slash'" class="w-5 h-5" />
          </button>
        </div>

        <!-- 错误提示 -->
        <transition name="fade">
          <div v-if="errorMessage" class="text-red-500 text-xs font-medium pl-2 flex items-center">
            <Icon icon="ph:warning-circle-fill" class="w-4 h-4 mr-1" />
            {{ errorMessage }}
          </div>
        </transition>

        <!-- 登录按钮 -->
        <div class="pt-6">
          <button 
            @click="handleLogin"
            :disabled="!isFormValid || isSubmitting"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <span class="relative z-10 flex items-center">
              <Icon v-if="isSubmitting" icon="ph:spinner-gap-bold" class="w-5 h-5 mr-2 animate-spin" />
              {{ isSubmitting ? '正在登录...' : '注册 / 登录' }}
            </span>
            <!-- 按钮 hover 扫光特效 -->
            <div class="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine"></div>
          </button>
        </div>

        <!-- 辅助链接 -->
        <div class="flex justify-between items-center text-xs text-gray-500 mt-4 px-2">
          <button class="hover:text-primary transition-colors">验证码登录</button>
          <button class="hover:text-primary transition-colors">忘记密码？</button>
        </div>
      </div>

      <!-- 底部协议 -->
      <div class="text-center text-[11px] text-gray-400 mt-auto pb-4">
        登录即代表您已同意
        <a href="#" class="text-primary hover:underline font-medium">《用户协议》</a> 与 
        <a href="#" class="text-primary hover:underline font-medium">《隐私政策》</a>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

@keyframes shine {
  100% {
    left: 125%;
  }
}

.animate-shine {
  animation: shine 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
</style>