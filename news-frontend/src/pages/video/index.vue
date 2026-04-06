<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()

// 模拟短视频数据流
const videos = ref([
  {
    id: '1',
    url: 'https://cdn.pixabay.com/video/2023/10/22/186115-876930514_large.mp4',
    title: '探秘未来城市：AI驱动下的智慧生活新纪元，当科技与自然完美融合',
    author: {
      name: '科技漫游者',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech'
    },
    stats: {
      likes: '12.4w',
      comments: '3428',
      shares: '1.2w'
    },
    tags: ['未来科技', '人工智能', '智慧城市'],
    isLiked: false
  },
  {
    id: '2',
    url: 'https://cdn.pixabay.com/video/2022/11/04/137682-767406208_large.mp4',
    title: '极致美学：一分钟带你领略极简主义设计的魅力',
    author: {
      name: 'Design Daily',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Design'
    },
    stats: {
      likes: '8.9w',
      comments: '1205',
      shares: '4500'
    },
    tags: ['设计美学', '极简主义', '灵感'],
    isLiked: false
  },
  {
    id: '3',
    url: 'https://cdn.pixabay.com/video/2021/08/04/83866-584742686_large.mp4',
    title: '商业洞察：新能源汽车出海记，中国制造如何征服全球市场',
    author: {
      name: '商业前线',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Biz'
    },
    stats: {
      likes: '4.5w',
      comments: '892',
      shares: '2100'
    },
    tags: ['商业分析', '新能源', '出海'],
    isLiked: false
  }
])

const currentIndex = ref(0)
const videoRefs = ref<HTMLVideoElement[]>([])
const isPlaying = ref(true)

// 监听滚动实现视频切换 (类似抖音/TikTok)
let touchStartY = 0
let touchEndY = 0
const MIN_SWIPE_DISTANCE = 50

const handleTouchStart = (e: TouchEvent) => {
  touchStartY = e.touches[0].clientY
}

const handleTouchEnd = (e: TouchEvent) => {
  touchEndY = e.changedTouches[0].clientY
  handleSwipe()
}

const handleSwipe = () => {
  const distance = touchStartY - touchEndY
  
  if (Math.abs(distance) > MIN_SWIPE_DISTANCE) {
    // 暂停当前视频
    if (videoRefs.value[currentIndex.value]) {
      videoRefs.value[currentIndex.value].pause()
      videoRefs.value[currentIndex.value].currentTime = 0
    }
    
    if (distance > 0 && currentIndex.value < videos.value.length - 1) {
      // 向上滑，下一个
      currentIndex.value++
    } else if (distance < 0 && currentIndex.value > 0) {
      // 向下滑，上一个
      currentIndex.value--
    }
    
    // 播放新视频
    setTimeout(() => {
      if (videoRefs.value[currentIndex.value]) {
        videoRefs.value[currentIndex.value].play().catch(e => console.log('Auto-play prevented', e))
        isPlaying.value = true
      }
    }, 50)
  }
}

const togglePlay = () => {
  const currentVideo = videoRefs.value[currentIndex.value]
  if (currentVideo) {
    if (isPlaying.value) {
      currentVideo.pause()
    } else {
      currentVideo.play()
    }
    isPlaying.value = !isPlaying.value
  }
}

const toggleLike = (index: number) => {
  videos.value[index].isLiked = !videos.value[index].isLiked
}

onMounted(() => {
  // 尝试自动播放第一个视频
  setTimeout(() => {
    if (videoRefs.value[0]) {
      videoRefs.value[0].play().catch(() => {
        // 浏览器限制自动播放时，显示暂停状态
        isPlaying.value = false
      })
    }
  }, 100)
})
</script>

<template>
  <div class="h-full w-full bg-black flex flex-col relative pb-[env(safe-area-inset-bottom)] overflow-hidden">
    
    <!-- 顶部状态栏 (透明沉浸) -->
    <header class="absolute top-0 left-0 w-full z-50 pt-[env(safe-area-inset-top)] pb-2 px-5 flex items-center justify-between">
      <div class="flex items-center space-x-6 text-white/80 font-bold text-[17px]">
        <button class="hover:text-white transition-colors drop-shadow-md">同城</button>
        <button class="hover:text-white transition-colors drop-shadow-md">关注</button>
        <button class="text-white relative drop-shadow-md">
          推荐
          <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-white"></div>
        </button>
      </div>
      <button class="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors drop-shadow-md">
        <Icon icon="ph:magnifying-glass-bold" class="w-6 h-6" />
      </button>
    </header>

    <!-- 视频流容器 -->
    <div 
      class="flex-1 w-full h-full relative"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <div 
        class="w-full h-full transition-transform duration-300 ease-out flex flex-col"
        :style="{ transform: `translateY(-${currentIndex * 100}%)` }"
      >
        <!-- 单个视频容器 -->
        <div 
          v-for="(video, index) in videos" 
          :key="video.id"
          class="w-full h-full flex-shrink-0 relative bg-black flex items-center justify-center overflow-hidden"
        >
          <!-- 视频播放器 -->
          <video 
            ref="videoRefs"
            :src="video.url"
            class="w-full h-full object-cover"
            loop
            playsinline
            webkit-playsinline
            preload="metadata"
            @click="togglePlay"
          ></video>

          <!-- 播放/暂停指示器 -->
          <div 
            v-if="!isPlaying && currentIndex === index" 
            class="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div class="w-16 h-16 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white">
              <Icon icon="ph:play-fill" class="w-8 h-8 ml-1" />
            </div>
          </div>

          <!-- 底部信息区 (标题、作者) -->
          <div class="absolute bottom-[80px] left-0 w-3/4 p-4 z-20 flex flex-col justify-end text-white drop-shadow-lg">
            <div class="flex items-center space-x-2 mb-2">
              <span class="font-bold text-[17px]">@{{ video.author.name }}</span>
              <span class="px-2 py-0.5 bg-primary-accent rounded text-[10px] font-bold tracking-wider">关注</span>
            </div>
            
            <p class="text-[15px] leading-relaxed line-clamp-3 mb-2 font-medium">
              {{ video.title }}
            </p>
            
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in video.tags" :key="tag" class="text-sm font-bold text-yellow-300 drop-shadow-md">
                #{{ tag }}
              </span>
            </div>
            
            <!-- 原声音乐条 -->
            <div class="flex items-center mt-3 space-x-2 animate-pulse text-sm">
              <Icon icon="ph:music-notes-simple-fill" class="w-4 h-4" />
              <span>{{ video.author.name }}创作的原声 - 综合新闻APP</span>
            </div>
          </div>

          <!-- 右侧交互动作栏 -->
          <div class="absolute bottom-[90px] right-2 w-14 z-20 flex flex-col items-center space-y-5 text-white">
            
            <!-- 头像 -->
            <div class="relative w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-800 shadow-md">
              <img :src="video.author.avatar" class="w-full h-full object-cover" />
            </div>

            <!-- 点赞 -->
            <button @click="toggleLike(index)" class="flex flex-col items-center group mt-4">
              <div class="w-10 h-10 flex items-center justify-center transition-transform active:scale-75">
                <Icon 
                  :icon="video.isLiked ? 'ph:heart-fill' : 'ph:heart-fill'" 
                  :class="['w-9 h-9 drop-shadow-lg transition-colors', video.isLiked ? 'text-primary-accent' : 'text-white']" 
                />
              </div>
              <span class="text-xs font-bold mt-1 drop-shadow-md">{{ video.stats.likes }}</span>
            </button>

            <!-- 评论 -->
            <button class="flex flex-col items-center">
              <div class="w-10 h-10 flex items-center justify-center transition-transform active:scale-75">
                <Icon icon="ph:chat-teardrop-dots-fill" class="w-8 h-8 drop-shadow-lg" />
              </div>
              <span class="text-xs font-bold mt-1 drop-shadow-md">{{ video.stats.comments }}</span>
            </button>

            <!-- 收藏 -->
            <button class="flex flex-col items-center">
              <div class="w-10 h-10 flex items-center justify-center transition-transform active:scale-75">
                <Icon icon="ph:star-fill" class="w-8 h-8 drop-shadow-lg text-white" />
              </div>
              <span class="text-xs font-bold mt-1 drop-shadow-md">收藏</span>
            </button>

            <!-- 分享 -->
            <button class="flex flex-col items-center">
              <div class="w-10 h-10 flex items-center justify-center transition-transform active:scale-75">
                <Icon icon="ph:share-fat-fill" class="w-8 h-8 drop-shadow-lg" />
              </div>
              <span class="text-xs font-bold mt-1 drop-shadow-md">{{ video.stats.shares }}</span>
            </button>
            
            <!-- 旋转唱片 -->
            <div class="w-12 h-12 rounded-full bg-gray-800 border-[8px] border-black flex items-center justify-center animate-[spin_4s_linear_infinite] overflow-hidden mt-4">
               <img :src="video.author.avatar" class="w-full h-full object-cover opacity-80" />
            </div>
            
          </div>
          
          <!-- 底部进度条 -->
          <div class="absolute bottom-[60px] left-0 w-full h-[2px] bg-white/20 z-20">
            <div class="h-full bg-white/80 w-1/3"></div>
          </div>
          
        </div>
      </div>
    </div>

    <!-- 底部 TabBar (透明暗黑版) -->
    <div class="absolute bottom-0 left-0 w-full bg-transparent bg-gradient-to-t from-black/80 to-transparent pb-[env(safe-area-inset-bottom)] z-50">
      <div class="flex justify-around items-center h-[60px] px-2">
        <button @click="router.push('/')" class="flex flex-col items-center justify-center w-16 h-full text-white/60 hover:text-white transition-colors">
          <Icon icon="ph:house" class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-medium">首页</span>
        </button>
        <button class="flex flex-col items-center justify-center w-16 h-full text-white">
          <Icon icon="ph:play-circle-fill" class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-bold drop-shadow-md">视频</span>
        </button>
        
        <div class="relative w-16 h-full flex justify-center items-center">
          <button @click="router.push('/publish')" class="w-12 h-8 rounded-lg bg-transparent border-2 border-white text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
            <Icon icon="ph:plus-bold" class="w-5 h-5" />
          </button>
        </div>
        
        <button @click="router.push('/community')" class="flex flex-col items-center justify-center w-16 h-full text-white/60 hover:text-white transition-colors">
          <Icon icon="ph:users" class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-medium">社区</span>
        </button>
        <button @click="router.push('/profile')" class="flex flex-col items-center justify-center w-16 h-full text-white/60 hover:text-white transition-colors">
          <Icon icon="ph:user" class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-medium">我的</span>
        </button>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>