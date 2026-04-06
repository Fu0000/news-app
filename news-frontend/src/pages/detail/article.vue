<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import request from '@/utils/request'

const route = useRoute()
const router = useRouter()
const articleId = route.params.id

const article = ref<any>(null)
const isLoading = ref(true)
const isLiked = ref(false)

const fetchArticleDetail = async () => {
  isLoading.value = true
  try {
    const res: any = await request.get(`/news/${articleId}`)
    article.value = res
    isLiked.value = res.has_liked || false
  } catch (error) {
    console.error('获取文章详情失败', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchArticleDetail()
})

const handleBack = () => {
  router.back()
}

const toggleLike = () => {
  // 临时切换 UI 状态，Sprint 4 时再对接真实接口
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    article.value.like_count++
  } else {
    article.value.like_count--
  }
}
</script>

<template>
  <div class="h-full w-full bg-white flex flex-col relative pb-[env(safe-area-inset-bottom)]">
    
    <!-- 沉浸式顶部导航栏 (透明度随滚动可变) -->
    <header class="fixed top-0 left-0 w-full z-50 pt-[env(safe-area-inset-top)] pb-3 px-4 flex items-center justify-between bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300">
      <button @click="handleBack" class="w-10 h-10 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors active:scale-95">
        <Icon icon="ph:caret-left-bold" class="w-6 h-6" />
      </button>
      <div class="flex items-center space-x-2 opacity-0 transition-opacity duration-300" id="header-author">
        <img :src="article?.author_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'" class="w-7 h-7 rounded-full border border-gray-200" />
        <span class="text-sm font-bold text-primary">{{ article?.author_name }}</span>
      </div>
      <button class="w-10 h-10 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors active:scale-95">
        <Icon icon="ph:dots-three-outline-vertical-fill" class="w-5 h-5" />
      </button>
    </header>

    <!-- 加载中骨架屏 -->
    <div v-if="isLoading" class="flex-1 pt-24 px-5 animate-pulse">
      <div class="h-8 bg-gray-200 rounded-md w-3/4 mb-4"></div>
      <div class="h-8 bg-gray-200 rounded-md w-1/2 mb-8"></div>
      <div class="flex items-center space-x-3 mb-10">
        <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 rounded w-24"></div>
          <div class="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
      <div class="space-y-4">
        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>

    <!-- 真实文章内容 -->
    <main v-else class="flex-1 overflow-y-auto pt-[calc(env(safe-area-inset-top)+80px)] pb-32 px-5">
      
      <!-- 标题区 -->
      <h1 class="text-3xl font-display font-bold leading-tight text-primary mb-6 tracking-tight">
        {{ article.title }}
      </h1>

      <!-- 作者信息条 -->
      <div class="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <img :src="article.author_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'" class="w-11 h-11 rounded-full bg-gray-100 object-cover shadow-sm" />
            <span class="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
              <Icon icon="ph:star-fill" class="w-2.5 h-2.5" />
            </span>
          </div>
          <div>
            <div class="text-[15px] font-bold text-primary">{{ article.author_name }}</div>
            <div class="text-xs text-gray-400 mt-0.5 flex items-center space-x-2">
              <span>{{ new Date(article.publish_time).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</span>
              <span>·</span>
              <span>阅读 {{ article.view_count }}</span>
            </div>
          </div>
        </div>
        <button class="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold shadow-soft hover:bg-primary-accent hover:shadow-float transition-all duration-300 active:scale-95">
          + 关注
        </button>
      </div>

      <!-- 富文本正文区 (Editorial Typography) -->
      <article class="prose prose-lg prose-gray max-w-none prose-headings:font-display prose-headings:font-bold prose-p:leading-relaxed prose-p:text-gray-700 prose-img:rounded-2xl prose-img:shadow-md prose-img:my-8 prose-a:text-primary-accent" v-html="article.content">
      </article>

      <!-- 文章底部免责/标签 -->
      <div class="mt-12 pt-6 border-t border-gray-100">
        <div class="flex flex-wrap gap-2 mb-6">
          <span class="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-medium border border-gray-100">深度报道</span>
          <span class="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-medium border border-gray-100">前沿科技</span>
          <span class="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-medium border border-gray-100">商业洞察</span>
        </div>
        <p class="text-xs text-gray-400 leading-relaxed bg-gray-50 p-4 rounded-xl">
          免责声明：本文由入驻平台的创作者撰写，观点仅代表作者本人，不代表平台立场。如有侵权，请联系删除。
        </p>
      </div>
      
    </main>

    <!-- 底部吸底交互条 (Sticky Action Bar) -->
    <div v-if="!isLoading" class="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] flex items-center justify-between z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
      
      <!-- 评论输入框伪装按钮 -->
      <button class="flex-1 bg-gray-100 text-gray-400 text-sm py-2.5 px-4 rounded-full text-left mr-6 flex items-center transition-colors hover:bg-gray-200">
        <Icon icon="ph:pencil-simple" class="w-4 h-4 mr-2" />
        写下你的看法...
      </button>

      <!-- 互动按钮组 -->
      <div class="flex items-center space-x-5 text-gray-600">
        <button class="relative flex items-center group">
          <Icon icon="ph:chat-circle" class="w-6 h-6 group-hover:text-primary transition-colors" />
          <span v-if="article.comment_count > 0" class="absolute -top-1.5 -right-2 bg-primary-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
            {{ article.comment_count }}
          </span>
        </button>
        
        <button @click="toggleLike" class="relative flex items-center group transition-transform active:scale-75 duration-200">
          <Icon 
            :icon="isLiked ? 'ph:thumbs-up-fill' : 'ph:thumbs-up'" 
            :class="['w-6 h-6 transition-colors', isLiked ? 'text-primary-accent' : 'group-hover:text-primary']" 
          />
          <span v-if="article.like_count > 0" :class="['ml-1 text-xs font-bold transition-colors', isLiked ? 'text-primary-accent' : 'text-gray-500 group-hover:text-primary']">
            {{ article.like_count }}
          </span>
        </button>
        
        <button class="flex items-center group">
          <Icon icon="ph:star" class="w-6 h-6 group-hover:text-yellow-400 transition-colors" />
        </button>
        
        <button class="flex items-center group">
          <Icon icon="ph:share-network" class="w-6 h-6 group-hover:text-blue-500 transition-colors" />
        </button>
      </div>
    </div>
    
  </div>
</template>

<style>
/* 定制 Typography (Prose) 内部的图片样式，因为 v-html 注入的内容不受 scoped 影响 */
.prose img {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.08);
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.prose p {
  font-size: 1.05rem;
  color: #333;
  line-height: 1.8;
  margin-bottom: 1.5em;
  letter-spacing: 0.02em;
}
</style>