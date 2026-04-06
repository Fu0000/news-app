<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import request from '@/utils/request'

const route = useRoute()
const router = useRouter()
const userId = route.params.id

const isLoading = ref(true)
const activeTab = ref('articles')
const isHeaderSolid = ref(false)

// 模拟获取他人的个人信息
const userInfo = ref({
  id: userId,
  nickname: '',
  avatar_url: '',
  bio: '这家伙很懒，什么都没留下。',
  cover_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  stats: {
    articles_count: 0,
    likes_count: 0,
    fans_count: 0,
    following_count: 0
  },
  isFollowing: false
})

const articles = ref<any[]>([])

const fetchUserData = async () => {
  isLoading.value = true
  try {
    // 模拟根据 userId 查询用户发布的文章 (直接用 list 接口模糊查)
    const res: any = await request.get('/news/list', {
      params: { page: 1, size: 10 }
    })
    
    // 如果列表里有数据，就用第一条数据的作者信息来模拟当前主页的作者
    if (res.list && res.list.length > 0) {
      // 随机取一个作者来展示
      const authorInfo = res.list[0].author
      userInfo.value.nickname = authorInfo.nickname || `用户_${userId}`
      userInfo.value.avatar_url = authorInfo.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
      
      // 把该作者的文章过滤出来
      articles.value = res.list.filter((a: any) => a.author.nickname === authorInfo.nickname)
    } else {
      userInfo.value.nickname = `用户_${userId}`
      userInfo.value.avatar_url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
    }
    
    // 随机生成一些好看的统计数据
    userInfo.value.stats = {
      articles_count: articles.value.length || 12,
      likes_count: Math.floor(Math.random() * 5000) + 100,
      fans_count: Math.floor(Math.random() * 10000) + 500,
      following_count: Math.floor(Math.random() * 50) + 10
    }
  } catch (error) {
    console.error('获取用户主页失败', error)
  } finally {
    isLoading.value = false
  }
}

// 监听滚动实现顶部导航栏背景渐变
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  isHeaderSolid.value = target.scrollTop > 100
}

onMounted(() => {
  fetchUserData()
})

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div class="h-full w-full bg-surface-muted flex flex-col relative pb-[env(safe-area-inset-bottom)] overflow-hidden">
    
    <!-- 沉浸式顶部状态栏 -->
    <header 
      :class="[
        'fixed top-0 left-0 w-full z-50 pt-[env(safe-area-inset-top)] pb-2 px-4 flex items-center justify-between transition-colors duration-300',
        isHeaderSolid ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm text-gray-800' : 'bg-transparent text-white'
      ]"
    >
      <button 
        @click="handleBack" 
        :class="['w-8 h-8 rounded-full flex items-center justify-center transition-colors active:scale-95 -ml-1', isHeaderSolid ? 'hover:bg-gray-100' : 'bg-black/20 backdrop-blur-sm']"
      >
        <Icon icon="ph:caret-left-bold" class="w-5 h-5" />
      </button>
      
      <div :class="['text-base font-bold font-display transition-opacity duration-300', isHeaderSolid ? 'opacity-100' : 'opacity-0']">
        {{ userInfo.nickname }}
      </div>
      
      <button 
        :class="['w-8 h-8 rounded-full flex items-center justify-center transition-colors active:scale-95', isHeaderSolid ? 'hover:bg-gray-100' : 'bg-black/20 backdrop-blur-sm']"
      >
        <Icon icon="ph:dots-three-bold" class="w-5 h-5" />
      </button>
    </header>

    <main class="flex-1 overflow-y-auto" @scroll="handleScroll">
      
      <!-- 封面图 (Cover) -->
      <div class="relative w-full h-[200px]">
        <img :src="userInfo.cover_url" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      
      <!-- 用户资料区 -->
      <div class="relative px-5 pt-0 pb-6 bg-surface-muted">
        <!-- 悬浮头像 -->
        <div class="absolute -top-10 left-5">
          <div class="w-20 h-20 rounded-full border-4 border-surface-muted overflow-hidden bg-white shadow-sm">
            <img :src="userInfo.avatar_url" class="w-full h-full object-cover" />
          </div>
        </div>
        
        <!-- 右侧操作按钮 -->
        <div class="flex justify-end pt-3 pb-2 space-x-3">
          <button class="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <Icon icon="ph:chat-teardrop-dots-bold" class="w-5 h-5" />
          </button>
          <button 
            @click="userInfo.isFollowing = !userInfo.isFollowing"
            :class="['px-6 py-1.5 rounded-full text-sm font-bold shadow-sm transition-colors', userInfo.isFollowing ? 'bg-gray-200 text-gray-600' : 'bg-primary text-white hover:bg-primary-accent']"
          >
            {{ userInfo.isFollowing ? '已关注' : '+ 关注' }}
          </button>
        </div>
        
        <!-- 昵称与简介 -->
        <div class="mt-2">
          <h1 class="text-2xl font-display font-bold text-primary mb-1">{{ userInfo.nickname }}</h1>
          <p class="text-[13px] text-gray-500 font-medium leading-relaxed">{{ userInfo.bio }}</p>
        </div>
        
        <!-- 数据统计面板 -->
        <div class="flex items-center space-x-6 mt-5">
          <div class="flex flex-col">
            <span class="text-lg font-bold text-primary font-display">{{ userInfo.stats.fans_count }}</span>
            <span class="text-[11px] text-gray-400 font-medium">粉丝</span>
          </div>
          <div class="flex flex-col">
            <span class="text-lg font-bold text-primary font-display">{{ userInfo.stats.following_count }}</span>
            <span class="text-[11px] text-gray-400 font-medium">关注</span>
          </div>
          <div class="flex flex-col">
            <span class="text-lg font-bold text-primary font-display">{{ userInfo.stats.likes_count }}</span>
            <span class="text-[11px] text-gray-400 font-medium">获赞</span>
          </div>
        </div>
      </div>

      <!-- 内容 Tabs 区 -->
      <div class="bg-white min-h-[500px] shadow-[0_-4px_20px_rgba(0,0,0,0.02)] pt-2 pb-10">
        
        <!-- Tabs 头部 -->
        <div class="flex space-x-8 px-6 mb-4 border-b border-gray-50 sticky top-[env(safe-area-inset-top)] bg-white/90 backdrop-blur-md z-40">
          <button 
            @click="activeTab = 'articles'"
            :class="['py-3 text-[15px] relative transition-colors', activeTab === 'articles' ? 'font-bold text-primary' : 'font-medium text-gray-400 hover:text-gray-600']"
          >
            发布
            <div v-if="activeTab === 'articles'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-primary-accent"></div>
          </button>
          <button 
            @click="activeTab = 'posts'"
            :class="['py-3 text-[15px] relative transition-colors', activeTab === 'posts' ? 'font-bold text-primary' : 'font-medium text-gray-400 hover:text-gray-600']"
          >
            动态
            <div v-if="activeTab === 'posts'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-primary-accent"></div>
          </button>
        </div>

        <!-- 列表内容区 -->
        <div class="px-5">
          <div v-if="isLoading" class="flex justify-center py-10">
            <Icon icon="ph:spinner-gap-bold" class="w-8 h-8 animate-spin text-gray-300" />
          </div>
          
          <template v-else>
            <div v-if="activeTab === 'articles'">
              <div v-if="articles.length === 0" class="text-center py-16">
                <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon="ph:article" class="w-8 h-8 text-gray-300" />
                </div>
                <p class="text-sm text-gray-400 font-medium">Ta还没有发布过文章</p>
              </div>
              
              <div v-else class="space-y-4">
                <div v-for="article in articles" :key="article.id" @click="router.push(`/detail/${article.id}`)" class="flex space-x-3 py-2 border-b border-gray-50 last:border-none cursor-pointer group">
                  <div class="flex-1 flex flex-col justify-between">
                    <h4 class="text-[15px] font-bold text-primary leading-snug line-clamp-2 group-hover:text-primary-accent transition-colors">{{ article.title }}</h4>
                    <div class="flex items-center text-[11px] text-gray-400 space-x-4 mt-2">
                      <span>{{ new Date(article.create_time).toLocaleDateString() }}</span>
                      <span class="flex items-center"><Icon icon="ph:eye" class="mr-1" />{{ article.view_count }}</span>
                      <span class="flex items-center"><Icon icon="ph:thumbs-up" class="mr-1" />{{ article.like_count || 0 }}</span>
                    </div>
                  </div>
                  <div v-if="article.cover_urls && article.cover_urls.length > 0" class="w-28 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img :src="article.cover_urls[0]" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="activeTab === 'posts'" class="text-center py-16">
              <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="ph:ghost" class="w-8 h-8 text-gray-300" />
              </div>
              <p class="text-sm text-gray-400 font-medium">Ta暂时没有发布动态</p>
            </div>
          </template>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>