<template>
  <a-layout class="basic-layout">
    <!-- 导航栏 -->
    <a-layout-header class="header">
      <GlobalHeader />
    </a-layout-header>
    
    <!-- 内容区域 -->
    <a-layout-content class="content">
      <div class="content-wrapper">
        <RouterView />
      </div>
    </a-layout-content>
    
    <!-- 底部版权信息 -->
    <a-layout-footer class="footer">
      <GlobalFooter />
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'
</script>

<style scoped>
.basic-layout {
  min-height: 100vh;
  background: #f0f2f5;
}

.header {
  padding: 0;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.content {
  flex: 1;
  padding: 24px 50px;
  background: #f0f2f5;
}

.content-wrapper {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  min-height: calc(100vh - 200px);
}

.footer {
  background: #fff;
  border-top: 1px solid #e8e8e8;
  padding: 20px 50px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    padding: 16px 20px;
  }
  
  .content-wrapper {
    padding: 16px;
    min-height: calc(100vh - 160px);
  }
  
  .footer {
    padding: 16px 20px;
  }
}

@media (max-width: 576px) {
  .content {
    padding: 12px 16px;
  }
  
  .content-wrapper {
    padding: 12px;
    min-height: calc(100vh - 140px);
  }
  
  .footer {
    padding: 12px 16px;
  }
}
</style>