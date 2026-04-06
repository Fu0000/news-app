<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import request from '@/utils/request'

const route = useRoute()
const router = useRouter()
const topicName = route.params.name as string

const isLoading = ref(true)
const newsList = ref<any[]>([])

// 模拟话题数据信息
const topicInfo = ref({
  name: topicName,
  cover: 'https://images.unsplash.com/photo-1614064641913-a5170068598a?q=80&w=800&auto=format&fit=crop',
  desc: `这是关于“${topicName}”的最新资讯与深度讨论集合。在这里，发现更多同好。`,
  viewCount: '2.4w',
  discussCount: '892',
  isFollowed: false
})

const fetchTopicNews = async () => {
  isLoading.value = true
  try {
    // 借用现有的列表接口，将话题名作为模糊搜索词，模拟查出该话题下的新闻
    const res: any = await request.get('/news/list', {
      params: {
        keyword: topicName,
        page: 1,
        size: 10
      }
    })
    newsList.value = res.list
  } catch (err) {
    console.error('获取话题新闻失败', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTopicNews()
})

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div class="h-full w-full bg-surface-muted flex flex-col relative pb-[env(safe-area-inset-bottom)]">
    
    <!-- 顶部状态栏 (随滚动透明度变化的设计) -->
    <header class="fixed top-0 left-0 w-full z-50 pt-[env(safe-area-inset-top)] px-4 pb-2 flex items-center justify-between bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <button @click="handleBack" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors active:scale-95 -ml-2">
        <Icon icon="ph:caret-left-bold" class="w-5 h-5" />
      </button>
      <div class="text-base font-bold text-primary flex items-center">
        <span class="text-primary-accent mr-0.5">#</span>
        {{ topicInfo.name }}
      </div>
      <button class="w-8 h-8 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors">
        <Icon icon="ph:share-network-bold" class="w-5 h-5" />
      </button>
    </header>

    <main class="flex-1 overflow-y-auto">
      
      <!-- 话题头部 Cover -->
      <div class="relative w-full h-[220px] bg-gray-900 overflow-hidden">
        <img :src="topicInfo.cover" class="w-full h-full object-cover opacity-60 mix-blend-overlay" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        
        <div class="absolute bottom-0 left-0 w-full p-5 text-white">
          <div class="flex items-end justify-between">
            <div>
              <h1 class="text-3xl font-display font-bold tracking-wide mb-2 flex items-center">
                <span class="text-primary-accent mr-1 font-normal opacity-80">#</span>
                {{ topicInfo.name }}
              </h1>
              <div class="flex items-center text-xs font-medium text-white/80 space-x-4">
                <span>{{ topicInfo.viewCount }} 次浏览</span>
                <span>{{ topicInfo.discussCount }} 条讨论</span>
              </div>
            </div>
            
            <button 
              @click="topicInfo.isFollowed = !topicInfo.isFollowed"
              :class="['px-5 py-2 rounded-full text-xs font-bold shadow-soft transition-all duration-300', topicInfo.isFollowed ? 'bg-white/20 text-white backdrop-blur-md' : 'bg-primary-accent text-white']"
            >
              {{ topicInfo.isFollowed ? '已关注' : '+ 关注话题' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- 话题简介条 -->
      <div class="bg-white px-5 py-4 border-b border-gray-50 flex items-start space-x-3 shadow-sm z-10 relative">
        <Icon icon="ph:quotes-fill" class="w-5 h-5 text-primary-accent opacity-50 flex-shrink-0 mt-0.5" />
        <p class="text-[13px] text-gray-500 leading-relaxed font-medium">
          {{ topicInfo.desc }}
        </p>
      </div>

      <!-- 内容区 -->
      <div class="px-5 pt-6 pb-10">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-[15px] font-bold text-gray-800">精选内容</h3>
          <div class="flex space-x-3 text-xs font-bold">
            <span class="text-primary-accent">最热</span>
            <span class="text-gray-400">最新</span>
          </div>
        </div>
        
        <!-- 加载中骨架屏 -->
        <div v-if="isLoading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
            <div class="w-3/4 h-5 bg-gray-100 rounded mb-3"></div>
            <div class="w-full h-4 bg-gray-100 rounded mb-2"></div>
            <div class="w-1/2 h-4 bg-gray-100 rounded mb-4"></div>
            <div class="w-full h-32 bg-gray-100 rounded-xl"></div>
          </div>
        </div>
        
        <!-- 真实文章列表 -->
        <div v-else class="space-y-4">
          <div v-if="newsList.length === 0" class="text-center py-12 text-gray-400 text-sm font-medium">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon icon="ph:empty" class="w-8 h-8 text-gray-300" />
            </div>
            该话题下暂无内容，快来发布第一篇吧！
          </div>
          
          <!-- 复用精简版的新闻卡片 -->
          <article 
            v-for="news in newsList" 
            :key="news.id"
            @click="router.push(`/detail/${news.id}`)"
            class="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer active:scale-[0.98] transition-transform"
          >
            <h4 class="text-[16px] font-bold text-primary leading-snug mb-2 line-clamp-2">
              {{ news.title }}
            </h4>
            
            <div v-if="news.cover_urls && news.cover_urls.length > 0" class="w-full h-36 rounded-xl overflow-hidden mb-3 bg-gray-50">
              <img :src="news.cover_urls[0]" class="w-full h-full object-cover" />
            </div>
            
            <div class="flex items-center justify-between text-xs text-gray-400 font-medium">
              <div class="flex items-center space-x-2">
                <img :src="news.author.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'" class="w-5 h-5 rounded-full object-cover" />
                <span>{{ news.author.nickname }}</span>
              </div>
              <div class="flex items-center space-x-3">
                <span class="flex items-center"><Icon icon="ph:eye" class="mr-1" />{{ news.view_count }}</span>
                <span class="flex items-center"><Icon icon="ph:chat-teardrop" class="mr-1" />{{ news.comment_count }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>

    </main>
    
    <!-- 悬浮的参与话题按钮 -->
    <button 
      @click="router.push('/publish')"
      class="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-primary text-white rounded-full shadow-float flex items-center justify-center z-40 font-bold text-[15px] hover:scale-105 active:scale-95 transition-transform"
    >
      <Icon icon="ph:pencil-simple-bold" class="w-5 h-5 mr-2" />
      参与话题讨论
    </button>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>