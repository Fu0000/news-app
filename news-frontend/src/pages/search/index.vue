<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import request from '@/utils/request'

const router = useRouter()

const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const isSearching = ref(false)
const hasSearched = ref(false)
const searchResults = ref<any[]>([])

// 搜索历史记录 (模拟本地存储)
const searchHistory = ref<string[]>(['苹果发布会', '折叠屏', 'OpenAI', '特斯拉'])

// 热搜榜单 (模拟接口数据)
const hotSearches = ref([
  { id: 1, keyword: '马斯克宣布脑机接口新进展', hot: '452w', isNew: true, isHot: true },
  { id: 2, keyword: '大模型在医疗领域的突破', hot: '380w', isNew: false, isHot: true },
  { id: 3, keyword: '新能源汽车价格战', hot: '290w', isNew: false, isHot: false },
  { id: 4, keyword: '如何看待年轻人热衷极简生活', hot: '210w', isNew: true, isHot: false },
  { id: 5, keyword: '全球半导体供应链重组', hot: '150w', isNew: false, isHot: false }
])

onMounted(() => {
  // 进入页面时自动聚焦搜索框
  setTimeout(() => {
    searchInput.value?.focus()
  }, 100)
})

const handleBack = () => {
  router.back()
}

const clearHistory = () => {
  searchHistory.value = []
}

const executeSearch = async (keyword: string) => {
  if (!keyword.trim()) return
  
  searchQuery.value = keyword
  isSearching.value = true
  hasSearched.value = true
  
  // 将搜索词加入历史记录头部并去重
  const newHistory = [keyword, ...searchHistory.value.filter(k => k !== keyword)].slice(0, 10)
  searchHistory.value = newHistory

  try {
    const res: any = await request.get('/news/list', {
      params: {
        keyword: keyword,
        page: 1,
        size: 20
      }
    })
    searchResults.value = res.list
  } catch (error) {
    console.error('搜索失败', error)
  } finally {
    isSearching.value = false
  }
}

const handleInputSearch = () => {
  executeSearch(searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  hasSearched.value = false
  searchResults.value = []
  searchInput.value?.focus()
}
</script>

<template>
  <div class="h-full w-full bg-white flex flex-col relative pb-[env(safe-area-inset-bottom)]">
    
    <!-- 顶部搜索栏 -->
    <header class="bg-white sticky top-0 z-50 pt-[env(safe-area-inset-top)] px-4 pb-3 flex items-center justify-between shadow-sm">
      <div class="flex-1 flex items-center bg-gray-50 rounded-full px-4 py-2.5 mr-3 border border-transparent focus-within:border-primary-accent focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-accent/10 transition-all">
        <Icon icon="ph:magnifying-glass-bold" class="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
        <input 
          ref="searchInput"
          v-model="searchQuery"
          @keyup.enter="handleInputSearch"
          type="text" 
          placeholder="搜索你想知道的资讯..."
          class="w-full bg-transparent border-none outline-none text-[15px] text-gray-800 placeholder-gray-400 font-medium"
        />
        <button 
          v-show="searchQuery" 
          @click="clearSearch"
          class="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-white hover:bg-gray-400 ml-2 flex-shrink-0 transition-colors"
        >
          <Icon icon="ph:x-bold" class="w-3 h-3" />
        </button>
      </div>
      <button @click="handleBack" class="text-[15px] font-bold text-gray-600 hover:text-primary transition-colors flex-shrink-0">
        取消
      </button>
    </header>

    <main class="flex-1 overflow-y-auto">
      
      <!-- 搜索状态页 -->
      <template v-if="!hasSearched">
        <!-- 搜索历史 -->
        <div v-if="searchHistory.length > 0" class="px-5 pt-6 pb-2">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-[15px] font-bold text-gray-800">搜索历史</h3>
            <button @click="clearHistory" class="text-gray-400 hover:text-red-500 transition-colors">
              <Icon icon="ph:trash" class="w-5 h-5" />
            </button>
          </div>
          <div class="flex flex-wrap gap-2.5">
            <button 
              v-for="history in searchHistory" 
              :key="history"
              @click="executeSearch(history)"
              class="px-4 py-1.5 bg-gray-50 text-[13px] text-gray-600 font-medium rounded-full hover:bg-gray-100 transition-colors"
            >
              {{ history }}
            </button>
          </div>
        </div>

        <!-- 热搜榜单 -->
        <div class="px-5 pt-6 pb-10">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-[15px] font-bold text-gray-800 flex items-center">
              <Icon icon="ph:fire-fill" class="w-5 h-5 text-red-500 mr-1.5" />
              综合热搜榜
            </h3>
            <span class="text-xs text-gray-400">每10分钟更新</span>
          </div>
          
          <div class="bg-gray-50/50 rounded-2xl p-2">
            <div 
              v-for="(item, index) in hotSearches" 
              :key="item.id"
              @click="executeSearch(item.keyword)"
              class="flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm cursor-pointer transition-all group"
            >
              <div class="flex items-center min-w-0">
                <span 
                  :class="[
                    'w-5 font-display font-bold text-base flex-shrink-0 text-center mr-3', 
                    index === 0 ? 'text-red-500' : index === 1 ? 'text-orange-500' : index === 2 ? 'text-yellow-500' : 'text-gray-400'
                  ]"
                >
                  {{ index + 1 }}
                </span>
                <span class="text-[15px] font-medium text-gray-800 truncate group-hover:text-primary transition-colors">
                  {{ item.keyword }}
                </span>
                
                <!-- 标签徽章 -->
                <span v-if="item.isHot" class="ml-2 flex-shrink-0 px-1.5 py-0.5 bg-red-100 text-red-500 text-[10px] font-bold rounded-sm">热</span>
                <span v-if="item.isNew" class="ml-2 flex-shrink-0 px-1.5 py-0.5 bg-blue-100 text-blue-500 text-[10px] font-bold rounded-sm">新</span>
              </div>
              
              <span class="text-xs text-gray-400 ml-4 flex-shrink-0">{{ item.hot }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- 搜索结果页 -->
      <template v-else>
        <!-- 骨架屏 -->
        <div v-if="isSearching" class="p-5 space-y-4">
          <div v-for="i in 4" :key="i" class="flex space-x-3 py-2 animate-pulse">
            <div class="flex-1 space-y-3">
              <div class="w-full h-5 bg-gray-100 rounded"></div>
              <div class="w-3/4 h-5 bg-gray-100 rounded"></div>
              <div class="w-1/3 h-3 bg-gray-100 rounded mt-4"></div>
            </div>
            <div class="w-28 h-20 rounded-lg bg-gray-100 flex-shrink-0"></div>
          </div>
        </div>
        
        <!-- 真实结果 -->
        <div v-else class="px-5 pt-4 pb-10">
          <div v-if="searchResults.length === 0" class="text-center py-20">
            <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="ph:magnifying-glass-minus-bold" class="w-10 h-10 text-gray-300" />
            </div>
            <p class="text-[15px] text-gray-800 font-bold mb-1">抱歉，没有找到相关内容</p>
            <p class="text-sm text-gray-400">请尝试更换关键词或缩短搜索词</p>
          </div>
          
          <div v-else class="space-y-4">
            <div class="text-xs text-gray-400 font-medium mb-2">找到 {{ searchResults.length }} 条相关结果</div>
            
            <article 
              v-for="news in searchResults" 
              :key="news.id"
              @click="router.push(`/detail/${news.id}`)"
              class="flex space-x-3 py-3 border-b border-gray-50 last:border-none cursor-pointer group"
            >
              <div class="flex-1 flex flex-col justify-between">
                <h4 class="text-[16px] font-bold text-primary leading-snug line-clamp-2 group-hover:text-primary-accent transition-colors">
                  {{ news.title }}
                </h4>
                <div class="flex items-center text-[11px] text-gray-400 space-x-3 mt-3 font-medium">
                  <span class="flex items-center">
                    <img :src="news.author.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'" class="w-4 h-4 rounded-full mr-1 object-cover" />
                    {{ news.author.nickname }}
                  </span>
                  <span>{{ new Date(news.create_time).toLocaleDateString() }}</span>
                  <span class="flex items-center"><Icon icon="ph:eye" class="mr-1" />{{ news.view_count }}</span>
                </div>
              </div>
              <div v-if="news.cover_urls && news.cover_urls.length > 0" class="w-28 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-50">
                <img :src="news.cover_urls[0]" class="w-full h-full object-cover" />
              </div>
            </article>
          </div>
        </div>
      </template>

    </main>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>