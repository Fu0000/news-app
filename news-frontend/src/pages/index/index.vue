<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="h-full w-full bg-surface-muted flex flex-col relative pb-[env(safe-area-inset-bottom)]">
    
    <!-- 顶部状态栏 -->
    <header class="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 pt-[env(safe-area-inset-top)] pb-3 px-5 flex items-center justify-between shadow-sm">
      <div class="flex items-center space-x-3">
        <h1 class="text-2xl font-display font-bold tracking-tight text-primary">
          发现
        </h1>
        <div class="h-4 w-[1px] bg-gray-200"></div>
        <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Discover</span>
      </div>
      <div class="flex space-x-4">
        <button class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors">
          <Icon icon="ph:magnifying-glass-bold" class="w-5 h-5" />
        </button>
        <button class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors relative">
          <Icon icon="ph:bell-bold" class="w-5 h-5" />
          <span class="absolute top-2 right-2 w-2 h-2 bg-primary-accent rounded-full ring-2 ring-white"></span>
        </button>
      </div>
    </header>

    <!-- 频道导航 (横向滚动) -->
    <nav class="bg-white border-b border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div class="px-5 py-3 flex space-x-6 inline-flex min-w-max">
        <button class="text-sm font-semibold text-primary relative pb-1">
          推荐
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-primary-accent"></div>
        </button>
        <button class="text-sm font-medium text-gray-500 hover:text-primary transition-colors pb-1">科技</button>
        <button class="text-sm font-medium text-gray-500 hover:text-primary transition-colors pb-1">商业</button>
        <button class="text-sm font-medium text-gray-500 hover:text-primary transition-colors pb-1">娱乐</button>
        <button class="text-sm font-medium text-gray-500 hover:text-primary transition-colors pb-1">体育</button>
        <button class="text-sm font-medium text-gray-500 hover:text-primary transition-colors pb-1">文化</button>
        <button class="text-sm font-medium text-gray-500 hover:text-primary transition-colors pb-1">国际</button>
      </div>
    </nav>

    <!-- 新闻瀑布流 -->
    <main class="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      
      <!-- 焦点大图卡片 (Focus Card) -->
      <article class="group cursor-pointer relative overflow-hidden rounded-[24px] shadow-soft hover:shadow-float transition-all duration-300 transform hover:-translate-y-1 bg-white">
        <div class="aspect-[4/3] w-full relative overflow-hidden bg-gray-100">
          <img src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=2940&auto=format&fit=crop" 
               alt="Focus Image" 
               class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>
        <div class="absolute bottom-0 left-0 w-full p-6 text-white">
          <span class="inline-block px-3 py-1 bg-primary-accent text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">科技前沿</span>
          <h2 class="text-xl font-display font-bold leading-snug mb-2 line-clamp-2">
            2024年全球人工智能发展趋势报告发布：生成式AI重塑生产力
          </h2>
          <div class="flex items-center text-xs text-white/80 space-x-3">
            <span class="flex items-center"><Icon icon="ph:clock" class="mr-1" />2小时前</span>
            <span class="flex items-center"><Icon icon="ph:eye" class="mr-1" />1.2w</span>
          </div>
        </div>
      </article>

      <!-- 标准三图流卡片 (Three-Image Flow) -->
      <article class="group cursor-pointer bg-white p-5 rounded-[20px] shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
        <h3 class="text-base font-bold text-primary leading-tight mb-3 group-hover:text-primary-accent transition-colors line-clamp-2">
          新能源汽车产业迎来拐点，多家车企公布第三季度创纪录财报，市场渗透率首次突破50%
        </h3>
        <div class="grid grid-cols-3 gap-2 mb-4">
          <div class="aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=500&auto=format&fit=crop" class="w-full h-full object-cover" />
          </div>
          <div class="aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=500&auto=format&fit=crop" class="w-full h-full object-cover" />
          </div>
          <div class="aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=500&auto=format&fit=crop" class="w-full h-full object-cover" />
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" class="w-5 h-5 rounded-full bg-gray-100" />
            <span class="text-xs font-medium text-gray-600">商业周刊</span>
          </div>
          <div class="flex items-center space-x-3 text-gray-400 text-xs">
            <span class="flex items-center hover:text-primary-accent transition-colors"><Icon icon="ph:chat-teardrop" class="mr-1" />342</span>
            <button class="hover:text-primary transition-colors"><Icon icon="ph:dots-three-outline-vertical-fill" /></button>
          </div>
        </div>
      </article>

      <!-- 标准单图左文右图卡片 (Standard List Flow) -->
      <article class="group cursor-pointer bg-white p-5 rounded-[20px] shadow-sm border border-gray-50 hover:shadow-md transition-shadow flex space-x-4">
        <div class="flex-1 flex flex-col justify-between">
          <h3 class="text-base font-bold text-primary leading-tight mb-2 group-hover:text-primary-accent transition-colors line-clamp-3">
            深度解析：为什么极简主义设计在现代互联网应用中重新成为主流趋势？
          </h3>
          <div class="flex items-center text-xs text-gray-500 space-x-3 mt-2">
            <span class="font-medium text-primary">UI设计院</span>
            <span>4小时前</span>
          </div>
        </div>
        <div class="w-[110px] h-[80px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=400&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      </article>
      
      <!-- 无图纯文字卡片 (Text Only Flow) -->
      <article class="group cursor-pointer bg-white p-5 rounded-[20px] shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
        <h3 class="text-base font-bold text-primary leading-tight mb-2 group-hover:text-primary-accent transition-colors line-clamp-2">
          刚刚，央行宣布下调存款准备金率0.5个百分点，释放长期资金约1万亿元
        </h3>
        <p class="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
          为巩固经济回升向好基础，保持流动性合理充裕，中国人民银行决定于2024年X月X日下调金融机构存款准备金率...
        </p>
        <div class="flex items-center justify-between text-xs text-gray-400">
          <span class="text-primary-accent bg-primary-accent/10 px-2 py-0.5 rounded text-[10px] font-bold">置顶</span>
          <span class="flex items-center"><Icon icon="ph:chat-teardrop" class="mr-1" />8.9w 评论</span>
        </div>
      </article>

      <!-- 底部留白，防止被 TabBar 遮挡 -->
      <div class="h-20"></div>
    </main>

    <!-- 底部 TabBar (模拟原生) -->
    <div class="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 pb-[env(safe-area-inset-bottom)] z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
      <div class="flex justify-around items-center h-16 px-2">
        <button class="flex flex-col items-center justify-center w-16 h-full text-primary">
          <Icon icon="ph:house-fill" class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-bold">首页</span>
        </button>
        <button class="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-primary transition-colors">
          <Icon icon="ph:play-circle" class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-medium">视频</span>
        </button>
        
        <!-- 居中凸起的发布按钮 -->
        <div class="relative w-16 h-full flex justify-center">
          <button class="absolute -top-5 w-14 h-14 rounded-full bg-primary text-white shadow-float flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
            <Icon icon="ph:plus-bold" class="w-6 h-6" />
          </button>
        </div>
        
        <button class="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-primary transition-colors">
          <Icon icon="ph:users" class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-medium">社区</span>
        </button>
        <button @click="handleLogout" class="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-primary transition-colors">
          <Icon icon="ph:user" class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-medium">我的</span>
        </button>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>