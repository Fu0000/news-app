<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const handleBack = () => {
  router.back()
}

const handleLogout = () => {
  // 增加 iOS 风格的 Action Sheet (这里用简易 confirm 模拟)
  if (confirm('退出后不会删除任何历史数据，下次登录依然可以使用本账号。确认退出吗？')) {
    userStore.logout()
    router.replace('/login')
  }
}

// 设置菜单配置
const settingGroups = ref([
  {
    title: '账号与安全',
    items: [
      { id: 'account', icon: 'ph:shield-check-fill', color: 'text-green-500', label: '账号绑定与安全', value: '已保护' },
      { id: 'privacy', icon: 'ph:lock-key-fill', color: 'text-blue-500', label: '隐私设置', value: '' }
    ]
  },
  {
    title: '通用',
    items: [
      { id: 'theme', icon: 'ph:moon-fill', color: 'text-indigo-500', label: '深色模式', value: '跟随系统' },
      { id: 'font', icon: 'ph:text-t-fill', color: 'text-orange-500', label: '字体大小', value: '标准' },
      { id: 'notification', icon: 'ph:bell-ringing-fill', color: 'text-red-500', label: '推送通知', value: '' },
      { id: 'cache', icon: 'ph:trash-fill', color: 'text-gray-500', label: '清理缓存', value: '128 MB' }
    ]
  },
  {
    title: '关于',
    items: [
      { id: 'feedback', icon: 'ph:chat-circle-dots-fill', color: 'text-teal-500', label: '意见反馈', value: '' },
      { id: 'about', icon: 'ph:info-fill', color: 'text-primary-accent', label: '关于综合新闻', value: 'v1.0.0' }
    ]
  }
])

const handleItemClick = (id: string) => {
  if (id === 'cache') {
    alert('缓存清理成功！')
    const cacheItem = settingGroups.value[1].items.find(i => i.id === 'cache')
    if (cacheItem) cacheItem.value = '0 MB'
  }
}
</script>

<template>
  <div class="h-full w-full bg-surface-muted flex flex-col relative pb-[env(safe-area-inset-bottom)]">
    
    <!-- 顶部状态栏 -->
    <header class="bg-surface-muted sticky top-0 z-50 pt-[env(safe-area-inset-top)] px-4 flex items-center justify-between h-14">
      <button @click="handleBack" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-200 transition-colors active:scale-95 -ml-2">
        <Icon icon="ph:caret-left-bold" class="w-5 h-5" />
      </button>
      <div class="text-lg font-bold text-primary font-display tracking-wide">
        设置
      </div>
      <div class="w-8"></div> <!-- 占位保持居中 -->
    </header>

    <main class="flex-1 overflow-y-auto px-4 pt-4 pb-10">
      
      <!-- 用户简易卡片 (可点击编辑资料) -->
      <div class="bg-white rounded-[20px] p-4 mb-6 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform">
        <div class="flex items-center space-x-4">
          <img :src="userStore.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'" class="w-14 h-14 rounded-full bg-gray-100 object-cover border border-gray-100" />
          <div>
            <div class="text-base font-bold text-primary mb-0.5">{{ userStore.nickname || '未命名用户' }}</div>
            <div class="text-xs text-gray-400 font-medium">账号：{{ userStore.phone }}</div>
          </div>
        </div>
        <div class="flex items-center text-gray-400">
          <span class="text-xs font-medium mr-1">编辑资料</span>
          <Icon icon="ph:caret-right-bold" class="w-4 h-4" />
        </div>
      </div>

      <!-- 设置菜单分组 -->
      <div class="space-y-6">
        <div v-for="group in settingGroups" :key="group.title">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 mb-2">{{ group.title }}</div>
          <div class="bg-white rounded-[20px] shadow-sm overflow-hidden divide-y divide-gray-50">
            <div 
              v-for="item in group.items" 
              :key="item.id"
              @click="handleItemClick(item.id)"
              class="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
            >
              <div class="flex items-center space-x-3">
                <div :class="['w-8 h-8 rounded-full flex items-center justify-center bg-gray-50', item.color]">
                  <Icon :icon="item.icon" class="w-4 h-4" />
                </div>
                <span class="text-[15px] font-medium text-gray-800">{{ item.label }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span v-if="item.value" class="text-[13px] text-gray-400 font-medium">{{ item.value }}</span>
                <Icon icon="ph:caret-right-bold" class="w-4 h-4 text-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 退出登录按钮 (大红钮设计) -->
      <div class="mt-8">
        <button 
          @click="handleLogout"
          class="w-full bg-white text-red-500 font-bold text-[15px] py-4 rounded-[20px] shadow-sm hover:bg-red-50 active:scale-[0.98] transition-all"
        >
          退出当前账号
        </button>
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