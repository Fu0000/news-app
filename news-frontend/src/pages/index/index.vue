<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import request from '@/utils/request'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, EffectFade } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const router = useRouter()

// 新闻数据列表
const newsList = ref<any[]>([])
const activeCategoryId = ref<number | null>(null)
const isLoading = ref(true)

// 焦点图轮播数据 (模拟从接口或配置中获取的热门/置顶文章)
const bannerList = ref([
  {
    id: 'banner1',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    title: '苹果 WWDC24 亮点回顾：AI 时代全面到来，Siri 迎来史诗级进化',
    tag: '科技前沿'
  },
  {
    id: 'banner2',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    title: '全球半导体供应链大迁徙：谁能在这场芯片竞赛中笑到最后？',
    tag: '深度商业'
  },
  {
    id: 'banner3',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
    title: '逃离内卷还是拥抱旷野：当代年轻人的生活方式观察报告',
    tag: '人文视点'
  }
])

// 分类频道
const categories = [
  { id: null, name: '推荐' },
  { id: 1, name: '商业' },
  { id: 2, name: '科技' },
  { id: 3, name: '杂谈' },
  { id: 4, name: '体育' },
  { id: 5, name: '文化' },
]

const fetchNews = async () => {
  isLoading.value = true
  try {
    const res: any = await request.get('/news/list', {
      params: {
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
          @click="router.push('/search')"
          class="flex items-center bg-gray-50 rounded-full w-10 h-10 justify-center border border-transparent cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <Icon 
            icon="ph:magnifying-glass-bold" 
            class="w-5 h-5 flex-shrink-0 text-gray-600" 
          />
        </div>
        <button 
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

    <!-- 焦点轮播图 (仅在“推荐”频道展示) -->
    <div v-if="activeCategoryId === null" class="px-4 pt-3 pb-2 z-0 relative">
      <div class="rounded-2xl overflow-hidden shadow-sm relative h-[180px] bg-gray-100">
        <Swiper
          :modules="[Autoplay, Pagination, EffectFade]"
          effect="fade"
          :autoplay="{ delay: 4000, disableOnInteraction: false }"
          :pagination="{ clickable: true, el: '.custom-pagination' }"
          :loop="true"
          class="w-full h-full"
        >
          <SwiperSlide v-for="banner in bannerList" :key="banner.id">
            <div class="relative w-full h-full cursor-pointer group">
              <img :src="banner.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div class="absolute bottom-0 left-0 w-full p-4 pr-12 pb-6">
                <span class="inline-block px-2 py-0.5 bg-primary-accent text-white text-[10px] font-bold rounded mb-1.5">{{ banner.tag }}</span>
                <h3 class="text-white text-[15px] font-bold leading-snug line-clamp-2 drop-shadow-md">
                  {{ banner.title }}
                </h3>
              </div>
            </div>
          </SwiperSlide>
          
          <!-- 自定义分页器容器 -->
          <div class="custom-pagination absolute bottom-2 right-3 z-10 flex space-x-1 justify-end"></div>
        </Swiper>
      </div>
    </div>

    <!-- 新闻瀑布流 -->
    <main :class="['flex-1 overflow-y-auto px-4 space-y-6', activeCategoryId !== null ? 'py-6' : 'pt-2 pb-6']">
      
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
              <div 
                class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 -ml-1 rounded-full transition-colors"
                @click.stop="router.push(`/user/${news.author_id}`)"
              >
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
              <div class="absolute bottom-0 left-0 w-full p-5 text-white">
                <h2 class="text-lg font-display font-bold leading-snug mb-3 line-clamp-2">
                  {{ news.title }}
                </h2>
                <div class="flex items-center justify-between text-xs text-white/80">
                  <div 
                    class="flex items-center space-x-2 cursor-pointer hover:bg-white/20 p-1 -ml-1 rounded-full transition-colors"
                    @click.stop="router.push(`/user/${news.author_id}`)"
                  >
                    <img :src="news.author_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'" class="w-5 h-5 rounded-full bg-white/20" />
                    <span>{{ news.author_name }}</span>
                  </div>
                  <span class="flex items-center"><Icon icon="ph:eye" class="mr-1" />{{ news.view_count }}</span>
                </div>
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
              <div 
                class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 -ml-1 rounded-full transition-colors"
                @click.stop="router.push(`/user/${news.author_id}`)"
              >
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

/* Swiper 自定义分页器样式 */
:deep(.swiper-pagination-bullet) {
  width: 6px;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 3px;
  transition: all 0.3s ease;
  margin: 0 3px !important;
}
:deep(.swiper-pagination-bullet-active) {
  width: 14px;
  background-color: white;
}
</style>