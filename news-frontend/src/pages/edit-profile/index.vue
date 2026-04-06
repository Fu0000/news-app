<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useUserStore } from '@/store/user'
import request from '@/utils/request'

const router = useRouter()
const userStore = useUserStore()

const fileInput = ref<HTMLInputElement | null>(null)
const isSaving = ref(false)

// 表单数据
const form = ref({
  nickname: '',
  bio: '',
  avatar_url: ''
})

onMounted(() => {
  form.value.nickname = userStore.nickname || ''
  form.value.bio = '探索世界的每一天，都在这里记录。' // 暂用默认签名
  form.value.avatar_url = userStore.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
})

const handleBack = () => {
  router.back()
}

const triggerAvatarUpload = () => {
  fileInput.value?.click()
}

// 复用内容模块的图片上传接口 (本地模拟)
const handleAvatarChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  
  const file = target.files[0]
  target.value = ''
  
  if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
    alert('仅支持上传图片')
    return
  }

  try {
    const formData = new FormData()
    formData.append('file', file)
    
    // 这里借用 content 的 upload 接口，实际开发应有单独的 user/upload 接口
    const res: any = await request.post('/content/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    form.value.avatar_url = res.url
  } catch (error) {
    console.error('头像上传失败', error)
    alert('头像上传失败，请重试')
  }
}

const handleSave = async () => {
  if (!form.value.nickname.trim()) {
    alert('昵称不能为空')
    return
  }

  isSaving.value = true
  try {
    // 模拟保存接口请求 (后端尚未实现真实的用户信息修改接口)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 手动更新 Pinia 中的用户数据以更新本地 UI
    userStore.setUserInfo({
      ...userStore,
      nickname: form.value.nickname,
      avatarUrl: form.value.avatar_url
    } as any)
    
    alert('资料保存成功')
    router.back()
  } catch (error) {
    console.error('保存失败', error)
    alert('保存失败，请稍后重试')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="h-full w-full bg-surface-muted flex flex-col relative pb-[env(safe-area-inset-bottom)]">
    
    <!-- 顶部状态栏 -->
    <header class="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 pt-[env(safe-area-inset-top)] px-4 flex items-center justify-between shadow-sm h-14">
      <button @click="handleBack" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors active:scale-95 -ml-2">
        <Icon icon="ph:caret-left-bold" class="w-5 h-5" />
      </button>
      <div class="text-base font-bold text-primary font-display tracking-wide">
        编辑个人资料
      </div>
      <button 
        @click="handleSave"
        :disabled="isSaving"
        class="text-sm font-bold text-primary-accent hover:text-primary transition-colors disabled:opacity-50"
      >
        <Icon v-if="isSaving" icon="ph:spinner-gap-bold" class="w-4 h-4 animate-spin" />
        <span v-else>保存</span>
      </button>
    </header>

    <main class="flex-1 overflow-y-auto px-5 pt-8 pb-10">
      
      <!-- 头像修改区 -->
      <div class="flex flex-col items-center mb-10">
        <div class="relative cursor-pointer group" @click="triggerAvatarUpload">
          <img :src="form.avatar_url" class="w-24 h-24 rounded-full bg-gray-100 object-cover shadow-sm border-2 border-white group-hover:opacity-80 transition-opacity" />
          <div class="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Icon icon="ph:camera-plus-fill" class="w-6 h-6 mb-1" />
          </div>
          <div class="absolute bottom-0 right-0 w-7 h-7 bg-primary text-white rounded-full border-2 border-white flex items-center justify-center shadow-sm">
            <Icon icon="ph:camera-bold" class="w-3.5 h-3.5" />
          </div>
        </div>
        <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleAvatarChange" />
      </div>

      <!-- 表单区 -->
      <div class="space-y-6">
        <!-- 昵称 -->
        <div class="bg-white rounded-[20px] p-4 shadow-sm border border-transparent focus-within:border-primary-accent/30 focus-within:ring-2 focus-within:ring-primary-accent/10 transition-all">
          <label class="block text-xs font-bold text-gray-400 mb-1 pl-1">昵称</label>
          <input 
            v-model="form.nickname"
            type="text" 
            placeholder="填写你的昵称"
            class="w-full bg-transparent border-none outline-none text-[16px] text-gray-800 font-bold placeholder-gray-300"
            maxlength="20"
          />
        </div>

        <!-- 简介 -->
        <div class="bg-white rounded-[20px] p-4 shadow-sm border border-transparent focus-within:border-primary-accent/30 focus-within:ring-2 focus-within:ring-primary-accent/10 transition-all">
          <label class="block text-xs font-bold text-gray-400 mb-1 pl-1">个人简介</label>
          <textarea 
            v-model="form.bio"
            rows="3"
            placeholder="介绍一下你自己吧..."
            class="w-full bg-transparent border-none outline-none text-[15px] text-gray-700 leading-relaxed placeholder-gray-300 resize-none"
            maxlength="100"
          ></textarea>
          <div class="text-right text-[10px] font-bold text-gray-300 mt-1">
            {{ form.bio.length }}/100
          </div>
        </div>

        <!-- 额外信息展示 -->
        <div class="bg-white rounded-[20px] shadow-sm overflow-hidden divide-y divide-gray-50 mt-8">
          <div class="flex items-center justify-between p-4">
            <span class="text-[15px] font-medium text-gray-800">性别</span>
            <div class="flex items-center space-x-2 text-gray-400">
              <span class="text-[14px]">保密</span>
              <Icon icon="ph:caret-right-bold" class="w-4 h-4" />
            </div>
          </div>
          <div class="flex items-center justify-between p-4">
            <span class="text-[15px] font-medium text-gray-800">生日</span>
            <div class="flex items-center space-x-2 text-gray-400">
              <span class="text-[14px]">添加生日，收获惊喜</span>
              <Icon icon="ph:caret-right-bold" class="w-4 h-4" />
            </div>
          </div>
          <div class="flex items-center justify-between p-4">
            <span class="text-[15px] font-medium text-gray-800">所在地区</span>
            <div class="flex items-center space-x-2 text-gray-400">
              <span class="text-[14px]">未知</span>
              <Icon icon="ph:caret-right-bold" class="w-4 h-4" />
            </div>
          </div>
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