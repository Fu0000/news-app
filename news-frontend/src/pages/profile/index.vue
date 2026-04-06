<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useUserStore } from '@/store/user'
import request from '@/utils/request'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('articles')
const userStats = ref({
  articles_count: 0,
  likes_count: 0,
  fans_count: 0,
  following_count: 0
})
const myArticles = ref<any[]>([])
const isLoading = ref(true)

const fetchProfileData = async () => {
  isLoading.value = true
  try {
    // 模拟并行请求用户统计数据和文章列表
    // 在真实后端中，您可以新增 /user/profile 接口来聚合这些数据
    const res: any = await request.get('/news/list', {
      params: { page: 1, size: 10 }
    })
    
    // 仅过滤出当前用户的文章 (前端模拟过滤)
    myArticles.value = res.list.filter((a: any) => a.author_name === userStore.nickname)
    
    userStats.value = {
      articles_count: myArticles.value.length,
      likes_count: Math.floor(Math.random() * 500) + 120,
      fans_count: Math.floor(Math.random() * 2000) + 50,
      following_count: 12
    }
  } catch (error) {
    console.error('获取个人信息失败', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProfileData()
})

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    router.replace('/login')
  }
}
</script>

<template>
  <div class="h-full w-full bg-surface-muted flex flex-col relative pb-[env(safe-area-inset-bottom)] overflow-x-hidden">
    
    <!-- 沉浸式头部背景 (带毛玻璃和渐变光效) -->
    <div class="absolute top-0 left-0 w-full h-[280px] z-0 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-primary-accent/20 to-surface-muted"></div>
      <div class="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] rounded-full bg-primary-accent/20 blur-[60px]"></div>
    </div>

    <!-- 顶部状态栏 -->
    <header class="relative z-10 pt-[env(safe-area-inset-top)] pb-2 px-5 flex items-center justify-between">
      <button class="w-10 h-10 rounded-full flex items-center justify-center text-gray-800 hover:bg-white/50 transition-colors">
        <Icon icon="ph:qr-code" class="w-6 h-6" />
      </button>
      <div class="flex space-x-2">
        <button class="w-10 h-10 rounded-full flex items-center justify-center text-gray-800 hover:bg-white/50 transition-colors">
          <Icon icon="ph:moon" class="w-6 h-6" />
        </button>
        <button @click="handleLogout" class="w-10 h-10 rounded-full flex items-center justify-center text-gray-800 hover:bg-white/50 transition-colors">
          <Icon icon="ph:sign-out" class="w-6 h-6" />
        </button>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto relative z-10">
      
      <!-- 用户资料卡片 -->
      <div class="px-5 pt-4 pb-6">
        <div class="flex items-center space-x-5 mb-6">
          <div class="relative">
            <img :src="userStore.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'" class="w-20 h-20 rounded-full bg-white p-1 shadow-md object-cover" />
            <div class="absolute bottom-0 right-0 w-6 h-6 bg-primary text-white rounded-full border-2 border-white flex items-center justify-center shadow-sm">
              <Icon icon="ph:pencil-simple" class="w-3 h-3" />
            </div>
          </div>
          <div class="flex-1">
            <h1 class="text-2xl font-display font-bold text-primary mb-1">{{ userStore.nickname || '未命名用户' }}</h1>
            <p class="text-sm text-gray-500 font-medium">探索世界的每一天，都在这里记录。</p>
            <div class="mt-2 flex items-center text-xs font-bold text-primary-accent bg-primary-accent/10 w-fit px-2 py-0.5 rounded">
              <Icon icon="ph:medal-fill" class="mr-1" />
              Lv.4 资深创作者
            </div>
          </div>
        </div>

        <!-- 数据统计面板 -->
        <div class="bg-white rounded-2xl p-5 shadow-soft flex justify-between items-center text-center">
          <div class="flex-1">
            <div class="text-xl font-bold text-primary font-display">{{ userStats.articles_count }}</div>
            <div class="text-[11px] text-gray-400 mt-1 font-medium">获赞与收藏</div>
          </div>
          <div class="w-[1px] h-8 bg-gray-100"></div>
          <div class="flex-1">
            <div class="text-xl font-bold text-primary font-display">{{ userStats.fans_count }}</div>
            <div class="text-[11px] text-gray-400 mt-1 font-medium">粉丝</div>
          </div>
          <div class="w-[1px] h-8 bg-gray-100"></div>
          <div class="flex-1">
            <div class="text-xl font-bold text-primary font-display">{{ userStats.following_count }}</div>
            <div class="text-[11px] text-gray-400 mt-1 font-medium">关注</div>
          </div>
        </div>
      </div>

      <!-- 核心功能区 (金刚区) -->
      <div class="px-5 mb-6">
        <h3 class="text-sm font-bold text-gray-800 mb-3 px-1">创作中心</h3>
        <div class="grid grid-cols-4 gap-3">
          <div class="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-2">
              <Icon icon="ph:chart-line-up" class="w-5 h-5" />
            </div>
            <span class="text-xs font-medium text-gray-600">数据分析</span>
          </div>
          <div class="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div class="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-2">
              <Icon icon="ph:wallet" class="w-5 h-5" />
            </div>
            <span class="text-xs font-medium text-gray-600">收益管理</span>
          </div>
          <div class="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div class="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mb-2">
              <Icon icon="ph:bookmark-simple" class="w-5 h-5" />
            </div>
            <span class="text-xs font-medium text-gray-600">我的收藏</span>
          </div>
          <div class="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div class="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-2">
              <Icon icon="ph:clock-counter-clockwise" class="w-5 h-5" />
            </div>
            <span class="text-xs font-medium text-gray-600">浏览历史</span>
          </div>
        </div>
      </div>

      <!-- 内容 Tabs 区 -->
      <div class="bg-white rounded-t-[30px] min-h-[400px] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] pt-6 pb-24">
        
        <!-- Tabs 头部 -->
        <div class="flex space-x-8 px-8 mb-6 border-b border-gray-50">
          <button 
            @click="activeTab = 'articles'"
            :class="['pb-3 text-sm relative transition-colors', activeTab === 'articles' ? 'font-bold text-primary' : 'font-medium text-gray-400 hover:text-gray-600']"
          >
            我的发布
            <div v-if="activeTab === 'articles'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-primary"></div>
          </button>
          <button 
            @click="activeTab = 'comments'"
            :class="['pb-3 text-sm relative transition-colors', activeTab === 'comments' ? 'font-bold text-primary' : 'font-medium text-gray-400 hover:text-gray-600']"
          >
            我的评论
            <div v-if="activeTab === 'comments'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-primary"></div>
          </button>
        </div>

        <!-- 列表内容区 -->
        <div class="px-5">
          <div v-if="isLoading" class="flex justify-center py-10">
            <Icon icon="ph:spinner-gap-bold" class="w-8 h-8 animate-spin text-gray-300" />
          </div>
          
          <template v-else>
            <div v-if="activeTab === 'articles'">
              <div v-if="myArticles.length === 0" class="text-center py-16">
                <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon="ph:pencil-line" class="w-8 h-8 text-gray-300" />
                </div>
                <p class="text-sm text-gray-400 font-medium">暂无发布内容，快去创作吧</p>
                <button @click="router.push('/publish')" class="mt-4 px-6 py-2 bg-primary text-white text-xs font-bold rounded-full shadow-soft hover:shadow-md transition-shadow">
                  去发布
                </button>
              </div>
              
              <div v-else class="space-y-4">
                <div v-for="article in myArticles" :key="article.id" @click="router.push(`/detail/${article.id}`)" class="flex space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                  <div v-if="article.cover_urls && article.cover_urls.length > 0" class="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img :src="article.cover_urls[0]" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 flex flex-col justify-between">
                    <h4 class="text-[15px] font-bold text-primary leading-tight line-clamp-2">{{ article.title }}</h4>
                    <div class="flex items-center text-[11px] text-gray-400 space-x-3">
                      <span>{{ new Date(article.publish_time).toLocaleDateString() }}</span>
                      <span class="flex items-center"><Icon icon="ph:eye" class="mr-1" />{{ article.view_count }}</span>
                      <span class="flex items-center"><Icon icon="ph:thumbs-up" class="mr-1" />{{ article.like_count || 0 }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="activeTab === 'comments'" class="text-center py-16">
              <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="ph:chat-teardrop" class="w-8 h-8 text-gray-300" />
              </div>
              <p class="text-sm text-gray-400 font-medium">暂无评论记录</p>
            </div>
          </template>
        </div>

      </div>
    </main>

    <!-- 底部 TabBar (复用首页结构，保持一致性) -->
    <div class="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 pb-[env(safe-area-inset-bottom)] z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
      <div class="flex justify-around items-center h-16 px-2">
        <button @click="router.push('/')" class="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-primary transition-colors">
          <Icon icon="ph:house" class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-medium">首页</span>
        </button>
        <button class="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-primary transition-colors">
          <Icon icon="ph:play-circle" class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-medium">视频</span>
        </button>
        
        <div class="relative w-16 h-full flex justify-center">
          <button @click="router.push('/publish')" class="absolute -top-5 w-14 h-14 rounded-full bg-primary text-white shadow-float flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
            <Icon icon="ph:plus-bold" class="w-6 h-6" />
          </button>
        </div>
        
        <button class="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-primary transition-colors">
          <Icon icon="ph:users" class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-medium">社区</span>
        </button>
        <button class="flex flex-col items-center justify-center w-16 h-full text-primary">
          <Icon icon="ph:user-fill" class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-bold">我的</span>
        </button>
      </div>
    </div>
    
  </div>
</template>