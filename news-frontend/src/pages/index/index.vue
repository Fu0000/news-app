<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useUserStore } from '@/store/user'
import request from '@/utils/request'

const router = useRouter()
const userStore = useUserStore()

// 新闻数据列表
const newsList = ref<any[]>([])
const isLoading = ref(true)
  const searchQuery = ref('')
  const isSearchFocused = ref(false)
  
  // 简易防抖定时器
  let searchTimer: any = null
  
  const handleSearch = () => {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      fetchNews()
    }, 500)
  }
  
  // 分类频道
const categories = [
  { id: null, name: '推荐' },
  { id: 1, name: '商业' },
  { id: 2, name: '科技' },
  { id: 3, name: '杂谈' },
  { id: 4, name: '体育' },
  { id: 5, name: '文化' },
]
const activeCategoryId = ref<number | null>(null)

const fetchNews = async () => {
    isLoading.value = true
    try {
      const res: any = await request.get('/news/list', {
        params: {
          keyword: searchQuery.value,
          category_id: activeCategoryId.value,
          page: 1,
          size: 10
        }
      })
      newsList.value = res.list
    } catch (err) {
      console.error('获取新闻失败', err)
    } finally {
      isLoading.value = false
    }
  }

const handleCategoryChange = (id: number | null) => {
    activeCategoryId.value = id
    fetchNews()
  }
  
  const handleArticleClick = (id: string) => {
    router.push(`/detail/${id}`)
  }
  
  onMounted(() => {
    fetchNews()
  })
  
  // 移除未使用的 handleLogout，因为登出逻辑移到了 profile 页
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
      <div class="flex items-center space-x-3 flex-1 ml-4 justify-end">
        <div 
          :class="[
            'flex items-center bg-gray-50 rounded-full transition-all duration-300',
            isSearchFocused ? 'w-full bg-white border border-primary-accent ring-2 ring-primary-accent/10 px-3' : 'w-10 px-0 justify-center border border-transparent'
          ]"
        >
          <Icon 
            icon="ph:magnifying-glass-bold" 
            @click="isSearchFocused = true"
            :class="['w-5 h-5 flex-shrink-0 cursor-pointer', isSearchFocused ? 'text-primary-accent mr-2' : 'text-gray-600']" 
          />
          <input 
            v-show="isSearchFocused"
            v-model="searchQuery"
            @input="handleSearch"
            @focus="isSearchFocused = true"
            @blur="isSearchFocused = !!searchQuery"
            type="text" 
            placeholder="搜索新闻资讯..."
            class="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400 py-2"
          />
        </div>
        <button 
          v-if="!isSearchFocused"
          @click="router.push('/messages')"
          class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors relative"
        >
          <Icon icon="ph:bell-bold" class="w-5 h-5" />
          <span class="absolute top-2 right-2 w-2 h-2 bg-primary-accent rounded-full ring-2 ring-white"></span>
        </button>
      </div>
    </header>

    <!-- 频道导航 (横向滚动) -->
    <nav class="bg-white border-b border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div class="px-5 py-3 flex space-x-6 inline-flex min-w-max">
        <button 
          v-for="cat in categories" 
          :key="cat.name"
          @click="handleCategoryChange(cat.id)"
          :class="['text-sm relative pb-1 transition-colors', activeCategoryId === cat.id ? 'font-semibold text-primary' : 'font-medium text-gray-500 hover:text-primary']"
        >
          {{ cat.name }}
          <div v-if="activeCategoryId === cat.id" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-primary-accent"></div>
        </button>
      </div>
    </nav>

    <!-- 新闻瀑布流 -->
    <main class="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      
      <div v-if="isLoading" class="flex justify-center py-10">
        <Icon icon="ph:spinner-gap-bold" class="w-8 h-8 animate-spin text-primary-accent" />
      </div>

      <template v-else>
        <!-- 遍历真实新闻数据 -->
        <article 
          v-for="news in newsList" 
          :key="news.id"
          @click="handleArticleClick(news.id)"
          class="group cursor-pointer bg-white rounded-[20px] shadow-sm border border-gray-50 hover:shadow-md transition-shadow overflow-hidden"
        >
          <!-- 无图情况 -->
          <div v-if="!news.cover_urls || news.cover_urls.length === 0" class="p-5">
            <h3 class="text-base font-bold text-primary leading-tight mb-2 group-hover:text-primary-accent transition-colors line-clamp-2">
              {{ news.title }}
            </h3>
            <div class="flex items-center justify-between text-xs text-gray-400 mt-4">
              <div class="flex items-center space-x-2">
                <img :src="news.author_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'" class="w-5 h-5 rounded-full bg-gray-100" />
                <span class="font-medium text-gray-600">{{ news.author_name }}</span>
              </div>
              <span class="flex items-center"><Icon icon="ph:chat-teardrop" class="mr-1" />{{ news.comment_count }}</span>
            </div>
          </div>

          <!-- 单图情况 (大焦点图) -->
          <div v-else-if="news.cover_urls.length === 1" class="relative">
            <div class="aspect-[4/3] w-full relative overflow-hidden bg-gray-100">
              <img :src="news.cover_urls[0]" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>
            <div class="absolute bottom-0 left-0 w-full p-5 text-white">
              <h2 class="text-lg font-display font-bold leading-snug mb-3 line-clamp-2">
                {{ news.title }}
              </h2>
              <div class="flex items-center justify-between text-xs text-white/80">
                <div class="flex items-center space-x-2">
                  <img :src="news.author_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'" class="w-5 h-5 rounded-full bg-white/20" />
                  <span>{{ news.author_name }}</span>
                </div>
                <span class="flex items-center"><Icon icon="ph:eye" class="mr-1" />{{ news.view_count }}</span>
              </div>
            </div>
          </div>

          <!-- 三图情况 -->
          <div v-else class="p-5">
            <h3 class="text-base font-bold text-primary leading-tight mb-3 group-hover:text-primary-accent transition-colors line-clamp-2">
              {{ news.title }}
            </h3>
            <div class="grid grid-cols-3 gap-2 mb-4">
              <div v-for="(url, idx) in news.cover_urls.slice(0, 3)" :key="idx" class="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img :src="url" class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <img :src="news.author_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'" class="w-5 h-5 rounded-full bg-gray-100" />
                <span class="text-xs font-medium text-gray-600">{{ news.author_name }}</span>
              </div>
              <div class="flex items-center space-x-3 text-gray-400 text-xs">
                <span class="flex items-center hover:text-primary-accent transition-colors"><Icon icon="ph:chat-teardrop" class="mr-1" />{{ news.comment_count }}</span>
              </div>
            </div>
          </div>
        </article>

        <div v-if="newsList.length === 0" class="text-center text-gray-400 py-10 text-sm">
          暂无相关资讯
        </div>
      </template>

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
        <button @click="router.push('/video')" class="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-primary transition-colors">
          <Icon icon="ph:play-circle" class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-medium">视频</span>
        </button>
        
        <!-- 居中凸起的发布按钮 -->
        <div class="relative w-16 h-full flex justify-center">
          <button @click="router.push('/publish')" class="absolute -top-5 w-14 h-14 rounded-full bg-primary text-white shadow-float flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
            <Icon icon="ph:plus-bold" class="w-6 h-6" />
          </button>
        </div>
        
        <button @click="router.push('/community')" class="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-primary transition-colors">
          <Icon icon="ph:users" class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-medium">社区</span>
        </button>
        <button @click="router.push('/profile')" class="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-primary transition-colors">
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