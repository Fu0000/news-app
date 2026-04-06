import axios from 'axios'
import { useUserStore } from '@/store/user'
import router from '@/router'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api/v1', // 使用 Vite proxy
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    
    // 如果是业务状态码正常
    if (res.code === 200) {
      return res.data
    } 
    
    // 业务错误（在组件中捕获提示）
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[API] 业务异常', res)
    }
    return Promise.reject(new Error(res.msg || 'Error'))
  },
  (error) => {
    // 处理 HTTP 状态码异常
    const status = error.response?.status
    const data = error.response?.data
    
    if (status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      
      // 强制跳转登录
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
      
      return Promise.reject(new Error('登录已过期，请重新登录'))
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.error('[API] 网络请求失败', error)
    }
    
    return Promise.reject(new Error(data?.msg || '网络繁忙，请稍后再试'))
  }
)

export default request