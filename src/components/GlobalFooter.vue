<template>
  <div class="global-footer">
    <div class="footer-content">
      <p class="copyright">
        © {{ currentYear }} Vue-init by 飞宇
      </p>
      <div class="footer-links">
        <a href="#" class="footer-link">隐私政策</a>
        <a-divider type="vertical" />
        <a href="#" class="footer-link">服务条款</a>
        <a-divider type="vertical" />
        <a href="#" class="footer-link">联系我们</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 获取当前年份
const currentYear = computed(() => {
  return new Date().getFullYear()
})
</script>

<style scoped>
.global-footer {
  background: #fff;
  color: #666;
  font-size: 14px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.copyright {
  margin: 0;
  color: #666;
  font-weight: 500;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 0;
}

.footer-link {
  color: #666;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.footer-link:hover {
  color: #1890ff;
  background-color: #f0f0f0;
}

.footer-links :deep(.ant-divider-vertical) {
  background-color: #d9d9d9;
  margin: 0 8px;
  height: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-content {
    padding: 0 16px;
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .footer-links {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .global-footer {
    padding: 16px 0;
    font-size: 13px;
  }

  .footer-content {
    padding: 0 12px;
    gap: 8px;
  }

  .footer-links {
    flex-wrap: wrap;
    gap: 8px;
  }

  .footer-links :deep(.ant-divider-vertical) {
    display: none;
  }

  .footer-link {
    padding: 4px 6px;
    font-size: 13px;
  }
}
</style>
