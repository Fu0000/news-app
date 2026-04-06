import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/index/index.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/index.vue'),
    meta: { requiresAuth: false, hideTabBar: true }
  },
  {
    path: '/detail/:id',
    name: 'ArticleDetail',
    component: () => import('@/pages/detail/article.vue'),
    meta: { requiresAuth: false, hideTabBar: true }
  },
  {
    path: '/publish',
    name: 'Publish',
    component: () => import('@/pages/publish/index.vue'),
    meta: { requiresAuth: true, hideTabBar: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/pages/profile/index.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由拦截器
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router