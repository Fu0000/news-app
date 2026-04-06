<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()

const isLoading = ref(true)

// 模拟消息列表数据
const messageList = ref([
  {
    id: 1,
    type: 'system',
    sender: {
      name: 'Trae 新闻小助手',
      avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=System&backgroundColor=3b82f6',
      isOfficial: true
    },
    content: '欢迎来到综合新闻APP！您的账号已注册成功，快去完善个人资料，开启您的专属创作之旅吧。',
    time: '刚刚',
    unread: true
  },
  {
    id: 2,
    type: 'interaction',
    sender: {
      name: '科技漫游者',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech',
      isOfficial: false
    },
    content: '赞了你的文章《极简主义设计在现代互联网应用中的趋势》',
    time: '2小时前',
    unread: true
  },
  {
    id: 3,
    type: 'chat',
    sender: {
      name: 'Design Daily',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Design',
      isOfficial: false
    },
    content: '大佬您好，请问可以转载您刚才发的那篇文章吗？我们会注明出处。',
    time: '昨天',
    unread: false
  },
  {
    id: 4,
    type: 'interaction',
    sender: {
      name: '商业前线',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Biz',
      isOfficial: false
    },
    content: '开始关注了你',
    time: '星期二',
    unread: false
  }
])

const handleBack = () => {
  router.back()
}

const markAllAsRead = () => {
  messageList.value.forEach(msg => {
    msg.unread = false
  })
}

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 400)
})
</script>

<template>
  <div class="h-full w-full bg-surface-muted flex flex-col relative pb-[env(safe-area-inset-bottom)]">
    
    <!-- 顶部状态栏 -->
    <header class="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 pt-[env(safe-area-inset-top)] px-4 flex items-center justify-between shadow-sm h-14">
      <button @click="handleBack" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors active:scale-95 -ml-2">
        <Icon icon="ph:caret-left-bold" class="w-5 h-5" />
      </button>
      <div class="text-lg font-bold text-primary font-display tracking-wide">
        消息中心
      </div>
      <button 
        @click="markAllAsRead"
        class="text-xs font-bold text-gray-500 hover:text-primary-accent transition-colors"
      >
        全部已读
      </button>
    </header>

    <main class="flex-1 overflow-y-auto">
      
      <!-- 快捷操作金刚区 -->
      <div class="bg-white px-5 py-6 mb-2 shadow-sm flex justify-around items-center">
        <div class="flex flex-col items-center group cursor-pointer">
          <div class="w-14 h-14 rounded-[20px] bg-blue-50 text-blue-500 flex items-center justify-center mb-2 group-hover:scale-105 group-hover:shadow-md transition-all">
            <Icon icon="ph:at-bold" class="w-7 h-7" />
          </div>
          <span class="text-xs font-bold text-gray-600">@ 我的</span>
        </div>
        
        <div class="flex flex-col items-center group cursor-pointer relative">
          <div class="w-14 h-14 rounded-[20px] bg-red-50 text-red-500 flex items-center justify-center mb-2 group-hover:scale-105 group-hover:shadow-md transition-all">
            <Icon icon="ph:heart-bold" class="w-7 h-7" />
          </div>
          <span class="absolute top-0 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          <span class="text-xs font-bold text-gray-600">赞和收藏</span>
        </div>
        
        <div class="flex flex-col items-center group cursor-pointer relative">
          <div class="w-14 h-14 rounded-[20px] bg-green-50 text-green-500 flex items-center justify-center mb-2 group-hover:scale-105 group-hover:shadow-md transition-all">
            <Icon icon="ph:users-bold" class="w-7 h-7" />
          </div>
          <span class="text-xs font-bold text-gray-600">新增粉丝</span>
        </div>
        
        <div class="flex flex-col items-center group cursor-pointer relative">
          <div class="w-14 h-14 rounded-[20px] bg-orange-50 text-orange-500 flex items-center justify-center mb-2 group-hover:scale-105 group-hover:shadow-md transition-all">
            <Icon icon="ph:chat-teardrop-text-bold" class="w-7 h-7" />
          </div>
          <span class="text-xs font-bold text-gray-600">评论回复</span>
        </div>
      </div>

      <!-- 消息列表 -->
      <div class="bg-white min-h-full">
        
        <div v-if="isLoading" class="p-5 space-y-6">
          <div v-for="i in 4" :key="i" class="flex space-x-4 animate-pulse">
            <div class="w-12 h-12 bg-gray-100 rounded-full flex-shrink-0"></div>
            <div class="flex-1 space-y-3 py-1">
              <div class="w-1/3 h-4 bg-gray-100 rounded"></div>
              <div class="w-3/4 h-3 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>

        <div v-else class="divide-y divide-gray-50">
          <div 
            v-for="msg in messageList" 
            :key="msg.id"
            class="flex items-start px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer relative"
          >
            <!-- 左侧头像 -->
            <div class="relative mr-4 flex-shrink-0">
              <img :src="msg.sender.avatar" class="w-12 h-12 rounded-full bg-gray-100 object-cover border border-gray-50" />
              <!-- 官方认证角标 -->
              <div v-if="msg.sender.isOfficial" class="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 text-white rounded-full border-2 border-white flex items-center justify-center">
                <Icon icon="ph:check-bold" class="w-2.5 h-2.5" />
              </div>
            </div>
            
            <!-- 右侧内容 -->
            <div class="flex-1 min-w-0 pt-0.5 relative">
              <div class="flex justify-between items-baseline mb-1">
                <h4 class="text-[15px] font-bold text-primary truncate max-w-[70%]">
                  {{ msg.sender.name }}
                </h4>
                <span class="text-xs text-gray-400 font-medium whitespace-nowrap ml-2">
                  {{ msg.time }}
                </span>
              </div>
              <p :class="['text-[14px] leading-snug line-clamp-2 pr-4', msg.unread ? 'text-gray-800 font-bold' : 'text-gray-500']">
                {{ msg.content }}
              </p>
              
              <!-- 未读红点 (移到右侧) -->
              <div v-if="msg.unread" class="absolute top-1/2 -translate-y-1/2 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <!-- 底部占位 -->
        <div class="py-8 text-center text-xs text-gray-400 font-medium">
          没有更多消息了
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>