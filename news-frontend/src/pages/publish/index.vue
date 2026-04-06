<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import request from '@/utils/request'

const router = useRouter()

// 表单数据
const title = ref('')
const content = ref('')
const categoryId = ref<number | null>(null)
const uploadedImages = ref<{ url: string; file: File }[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

// 状态
const isPublishing = ref(false)
const isUploading = ref(false)

const categories = [
  { id: 1, name: '商业' },
  { id: 2, name: '科技' },
  { id: 3, name: '杂谈' },
  { id: 4, name: '体育' },
  { id: 5, name: '文化' },
]

// 校验是否允许发布
const canPublish = computed(() => {
  return title.value.trim().length > 0 && 
         content.value.trim().length > 0 && 
         categoryId.value !== null && 
         !isPublishing.value &&
         !isUploading.value
})

const handleBack = () => {
  // 简易防误触
  if (title.value || content.value || uploadedImages.value.length > 0) {
    if (confirm('内容尚未发布，确认退出吗？')) {
      router.back()
    }
  } else {
    router.back()
  }
}

const triggerFileInput = () => {
  if (uploadedImages.value.length >= 3) {
    alert('最多只能上传 3 张图片')
    return
  }
  fileInput.value?.click()
}

// 模拟图片上传到 Node.js 服务器
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  
  const file = target.files[0]
  
  // 重置 input，允许重复选择同一个文件
  target.value = ''
  
  // 校验文件类型与大小
  if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
    alert('仅支持上传图片')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('图片大小不能超过 5MB')
    return
  }

  isUploading.value = true
  
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    // 调用后端的上传接口
    const res: any = await request.post('/content/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    uploadedImages.value.push({
      url: res.url,
      file: file
    })
  } catch (error) {
    console.error('上传失败', error)
    alert('图片上传失败，请重试')
  } finally {
    isUploading.value = false
  }
}

const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
}

// 执行发布
const handlePublish = async () => {
  if (!canPublish.value) return
  
  isPublishing.value = true
  
  try {
    // 简易将换行符替换为段落标签，模拟富文本
    const formattedContent = content.value.split('\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('')
    
    await request.post('/content/publish', {
      title: title.value,
      category_id: categoryId.value,
      content: formattedContent,
      cover_urls: uploadedImages.value.map(img => img.url)
    })
    
    alert('发布成功！')
    router.replace('/')
  } catch (error: any) {
    console.error('发布失败', error)
    alert(error.message || '发布失败')
  } finally {
    isPublishing.value = false
  }
}
</script>

<template>
  <div class="h-full w-full bg-white flex flex-col relative pb-[env(safe-area-inset-bottom)]">
    
    <!-- 顶部状态栏 -->
    <header class="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 pt-[env(safe-area-inset-top)] px-4 flex items-center justify-between shadow-sm h-14">
      <button @click="handleBack" class="text-sm font-medium text-gray-500 hover:text-primary transition-colors">
        取消
      </button>
      <div class="text-base font-bold text-primary font-display tracking-wide">
        创作内容
      </div>
      <button 
        @click="handlePublish"
        :disabled="!canPublish"
        class="flex items-center text-sm font-bold px-4 py-1.5 rounded-full transition-all duration-300 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 bg-primary text-white shadow-soft hover:shadow-float active:scale-95"
      >
        <Icon v-if="isPublishing" icon="ph:spinner-gap-bold" class="animate-spin mr-1 w-4 h-4" />
        发布
      </button>
    </header>

    <main class="flex-1 overflow-y-auto flex flex-col relative">
      
      <!-- 分类选择 (药丸风格) -->
      <div class="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
        <div class="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">选择分类栏目</div>
        <div class="flex flex-wrap gap-2.5">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            @click="categoryId = cat.id"
            :class="[
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border',
              categoryId === cat.id 
                ? 'bg-primary border-primary text-white shadow-md' 
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
            ]"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- 标题输入区 -->
      <div class="px-5 pt-6 pb-2">
        <textarea 
          v-model="title"
          placeholder="起个吸引人的标题吧..." 
          rows="2"
          class="w-full text-2xl font-display font-bold text-primary placeholder-gray-300 bg-transparent border-none outline-none resize-none overflow-hidden"
        ></textarea>
      </div>

      <!-- 分割线 -->
      <div class="mx-5 border-b border-gray-100 mb-4"></div>

      <!-- 正文输入区 -->
      <div class="px-5 flex-1 flex flex-col">
        <textarea 
          v-model="content"
          placeholder="分享你的见解、故事或新鲜事..." 
          class="w-full flex-1 text-[15px] leading-relaxed text-gray-700 placeholder-gray-300 bg-transparent border-none outline-none resize-none"
        ></textarea>
        
        <!-- 图片网格展示区 -->
        <div v-if="uploadedImages.length > 0" class="grid grid-cols-3 gap-3 pb-6 mt-4">
          <div 
            v-for="(img, idx) in uploadedImages" 
            :key="idx"
            class="aspect-square relative rounded-xl overflow-hidden shadow-sm group border border-gray-100"
          >
            <img :src="img.url" class="w-full h-full object-cover" />
            <button 
              @click.stop="removeImage(idx)"
              class="absolute top-1.5 right-1.5 w-6 h-6 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-100 transition-opacity hover:bg-black/70"
            >
              <Icon icon="ph:x-bold" class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

    </main>

    <!-- 底部编辑工具栏 -->
    <div class="border-t border-gray-100 bg-white px-5 py-3 flex items-center space-x-6 z-40">
      <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleFileChange" />
      
      <button 
        @click="triggerFileInput"
        :class="['flex flex-col items-center justify-center transition-colors', uploadedImages.length >= 3 ? 'text-gray-300' : 'text-gray-600 hover:text-primary']"
      >
        <div class="relative">
          <Icon icon="ph:image-square" class="w-6 h-6 mb-1" />
          <!-- 上传中 loading 遮罩 -->
          <div v-if="isUploading" class="absolute inset-0 bg-white/80 rounded flex items-center justify-center">
            <Icon icon="ph:spinner-gap-bold" class="w-4 h-4 animate-spin text-primary-accent" />
          </div>
        </div>
        <span class="text-[10px] font-bold">添加图片 ({{ uploadedImages.length }}/3)</span>
      </button>

      <button class="flex flex-col items-center justify-center text-gray-400 cursor-not-allowed">
        <Icon icon="ph:hash" class="w-6 h-6 mb-1" />
        <span class="text-[10px] font-bold">话题标签</span>
      </button>
      
      <button class="flex flex-col items-center justify-center text-gray-400 cursor-not-allowed">
        <Icon icon="ph:at" class="w-6 h-6 mb-1" />
        <span class="text-[10px] font-bold">提醒谁看</span>
      </button>
    </div>
    
  </div>
</template>

<style scoped>
/* 隐藏 textarea 滚动条 */
textarea::-webkit-scrollbar {
  display: none;
}
textarea {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>