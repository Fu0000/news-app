<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('hot')
const isLoading = ref(true)

// 模拟社区动态数据流 (类似小红书/即刻的瀑布流或卡片流)
const posts = ref([
  {
    id: '1',
    author: {
      name: '科技漫游者',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech',
      title: '资深数码博主'
    },
    publishTime: '2小时前',
    content: '今天拿到了最新款的折叠屏手机，深度体验了一下午，铰链的阻尼感做得非常出色！最让我惊喜的是外屏的交互逻辑，完全可以直接当主力机用。大家有什么想测的可以在评论区留言👇',
    images: [
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop'
    ],
    stats: {
      likes: 342,
      comments: 89,
      shares: 12
    },
    isLiked: false,
    tags: ['数码测评', '折叠屏', '开箱']
  },
  {
    id: '2',
    author: {
      name: '咖啡与阅读',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Coffee',
      title: '独立撰稿人'
    },
    publishTime: '5小时前',
    content: '在这样一个下雨的午后，找一家安静的独立咖啡馆，点一杯手冲，读完《百年孤独》的最后几个章节。这种感觉就像是在时间的洪流中按下了暂停键。推荐大家去尝试一下这种脱离数字世界的“慢生活”。☕️📖',
    images: [
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop'
    ],
    stats: {
      likes: 1205,
      comments: 342,
      shares: 89
    },
    isLiked: true,
    tags: ['生活方式', '阅读', '咖啡探店']
  },
  {
    id: '3',
    author: {
      name: '投资小助手',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Invest',
      title: '认证金融分析师'
    },
    publishTime: '昨天 18:30',
    content: '【晚间速报】今日大盘探底回升，新能源赛道集体反弹。值得注意的是，北向资金尾盘大幅净流入，说明外资对A股核心资产的长期配置意愿依然强烈。明天重点关注社融数据的发布。',
    images: [],
    stats: {
      likes: 89,
      comments: 45,
      shares: 22
    },
    isLiked: false,
    tags: ['股市分析', '晚间复盘', '财经资讯']
  }
])

const toggleLike = (index: number) => {
  const post = posts.value[index]
  post.isLiked = !post.isLiked
  post.stats.likes += post.isLiked ? 1 : -1
}

onMounted(() => {
  // 模拟加载延迟
  setTimeout(() => {
    isLoading.value = false
  }, 600)
})
</script>

<template>
  <div class="h-full w-full bg-surface-muted flex flex-col relative pb-[env(safe-area-inset-bottom)] overflow-hidden">
    
    <!-- 顶部状态栏 -->
    <header class="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 pt-[env(safe-area-inset-top)] px-5 pb-2 flex items-center justify-between shadow-sm">
      <div class="flex items-center space-x-6">
        <button 
          @click="activeTab = 'following'"
          :class="['text-[17px] transition-colors relative pb-1', activeTab === 'following' ? 'font-bold text-primary' : 'font-medium text-gray-400 hover:text-gray-600']"
        >
          关注
          <div v-if="activeTab === 'following'" class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-primary-accent"></div>
        </button>
        <button 
          @click="activeTab = 'hot'"
          :class="['text-[17px] transition-colors relative pb-1', activeTab === 'hot' ? 'font-bold text-primary' : 'font-medium text-gray-400 hover:text-gray-600']"
        >
          广场
          <div v-if="activeTab === 'hot'" class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-primary-accent"></div>
        </button>
      </div>
      <div class="flex space-x-3">
        <button class="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors relative">
          <Icon icon="ph:user-plus-bold" class="w-5 h-5" />
        </button>
      </div>
    </header>

    <!-- 核心内容流 -->
    <main class="flex-1 overflow-y-auto bg-gray-50">
      
      <!-- 加载中骨架屏 -->
      <div v-if="isLoading" class="p-4 space-y-4">
        <div v-for="i in 3" :key="i" class="bg-white p-4 rounded-2xl animate-pulse shadow-sm">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div class="space-y-2">
              <div class="w-24 h-4 bg-gray-200 rounded"></div>
              <div class="w-16 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div class="w-full h-4 bg-gray-200 rounded mb-2"></div>
          <div class="w-3/4 h-4 bg-gray-200 rounded mb-4"></div>
          <div class="w-full h-40 bg-gray-200 rounded-xl mb-4"></div>
        </div>
      </div>

      <template v-else>
        <!-- 社区动态卡片 -->
        <div class="space-y-2.5 pb-24">
          <article 
            v-for="(post, index) in posts" 
            :key="post.id"
            class="bg-white px-5 pt-5 pb-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
          >
            <!-- 头部：作者信息 -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <img :src="post.author.avatar" class="w-10 h-10 rounded-full bg-gray-100 object-cover border border-gray-100" />
                <div>
                  <div class="flex items-center space-x-1">
                    <span class="text-[15px] font-bold text-primary">{{ post.author.name }}</span>
                    <Icon v-if="post.author.title" icon="ph:check-circle-fill" class="w-4 h-4 text-blue-500" />
                  </div>
                  <div class="text-xs text-gray-400 mt-0.5 flex items-center space-x-2">
                    <span>{{ post.publishTime }}</span>
                    <span v-if="post.author.title">·</span>
                    <span v-if="post.author.title">{{ post.author.title }}</span>
                  </div>
                </div>
              </div>
              <button class="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                <Icon icon="ph:dots-three-bold" class="w-5 h-5" />
              </button>
            </div>

            <!-- 正文内容 -->
            <p class="text-[15px] text-gray-800 leading-relaxed mb-3 whitespace-pre-line font-medium">
              {{ post.content }}
            </p>

            <!-- 话题标签 -->
            <div class="flex flex-wrap gap-2 mb-3" v-if="post.tags && post.tags.length > 0">
              <span v-for="tag in post.tags" :key="tag" class="text-[13px] font-bold text-primary-accent bg-primary-accent/10 px-2 py-1 rounded-md cursor-pointer hover:bg-primary-accent/20 transition-colors">
                #{{ tag }}
              </span>
            </div>

            <!-- 图片网格 -->
            <div 
              v-if="post.images.length > 0" 
              :class="['grid gap-2 mb-4', post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2']"
            >
              <div 
                v-for="(img, imgIdx) in post.images" 
                :key="imgIdx"
                :class="['rounded-xl overflow-hidden bg-gray-100', post.images.length === 1 ? 'aspect-video' : 'aspect-square']"
              >
                <img :src="img" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- 底部交互条 -->
            <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 text-gray-500">
              <button class="flex flex-1 items-center justify-center space-x-1.5 hover:text-primary transition-colors group">
                <Icon icon="ph:share-network" class="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
                <span class="text-[13px] font-medium">{{ post.stats.shares || '分享' }}</span>
              </button>
              <div class="w-[1px] h-4 bg-gray-100"></div>
              <button class="flex flex-1 items-center justify-center space-x-1.5 hover:text-primary transition-colors group">
                <Icon icon="ph:chat-teardrop" class="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
                <span class="text-[13px] font-medium">{{ post.stats.comments || '评论' }}</span>
              </button>
              <div class="w-[1px] h-4 bg-gray-100"></div>
              <button 
                @click="toggleLike(index)"
                :class="['flex flex-1 items-center justify-center space-x-1.5 transition-colors group', post.isLiked ? 'text-primary-accent' : 'hover:text-primary']"
              >
                <div class="transition-transform active:scale-75 duration-200">
                  <Icon :icon="post.isLiked ? 'ph:thumbs-up-fill' : 'ph:thumbs-up'" class="w-[18px] h-[18px]" />
                </div>
                <span class="text-[13px] font-medium">{{ post.stats.likes || '赞' }}</span>
              </button>
            </div>
          </article>
        </div>
      </template>

      <!-- 悬浮的发布动态按钮 -->
      <button 
        @click="router.push('/publish')"
        class="fixed bottom-24 right-5 w-14 h-14 bg-primary text-white rounded-full shadow-float flex items-center justify-center z-40 hover:scale-105 active:scale-95 transition-transform"
      >
        <Icon icon="ph:pencil-simple-bold" class="w-6 h-6" />
      </button>

    </main>

    <!-- 底部 TabBar -->
    <div class="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 pb-[env(safe-area-inset-bottom)] z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
      <div class="flex justify-around items-center h-16 px-2">
        <button @click="router.push('/')" class="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-primary transition-colors">
          <Icon icon="ph:house" class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-medium">首页</span>
        </button>
        <button @click="router.push('/video')" class="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-primary transition-colors">
          <Icon icon="ph:play-circle" class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-medium">视频</span>
        </button>
        
        <div class="relative w-16 h-full flex justify-center">
          <button @click="router.push('/publish')" class="absolute -top-5 w-14 h-14 rounded-full bg-primary text-white shadow-float flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
            <Icon icon="ph:plus-bold" class="w-6 h-6" />
          </button>
        </div>
        
        <button class="flex flex-col items-center justify-center w-16 h-full text-primary">
          <Icon icon="ph:users-fill" class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-bold">社区</span>
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
::-webkit-scrollbar {
  display: none;
}
</style>