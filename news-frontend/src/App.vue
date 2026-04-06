<script setup lang="ts">
// 根组件只做路由承载
</script>

<template>
  <div class="h-screen w-full relative overflow-hidden bg-surface flex flex-col">
    <!-- 主路由视图 -->
    <main class="flex-1 overflow-y-auto w-full relative z-10">
      <router-view v-slot="{ Component }">
        <transition name="fade-page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style>
.fade-page-enter-active,
.fade-page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.fade-page-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

.fade-page-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
</style>