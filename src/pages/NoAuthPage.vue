<template>
  <div class="no-auth-container">
    <div class="no-auth-content">
      <!-- Minimalist lock icon -->
      <div class="icon-container">
        <svg class="no-auth-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM9 6C9 4.34 10.34 3 12 3S15 4.34 15 6V8H9V6ZM18 20H6V10H18V20ZM12 17C13.1 17 14 16.1 14 15S13.1 13 12 13 10 13.9 10 15 10.9 17 12 17Z" fill="currentColor"/>
        </svg>
      </div>

      <div class="content-wrapper">
        <h1 class="no-auth-title">访问受限</h1>
        <p class="no-auth-description">
          您暂时没有权限访问此页面
        </p>
        <p class="no-auth-subdescription">
          请联系管理员获取相应权限，或返回到其他页面继续浏览
        </p>
      </div>

      <div class="no-auth-actions">
        <button class="btn btn-primary" @click="goHome">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="currentColor"/>
          </svg>
          返回首页
        </button>
        <button class="btn btn-secondary" @click="goBack">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
          </svg>
          返回上页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.no-auth-container {
  height: calc(100vh - 140px - 88px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.no-auth-content {
  max-width: 420px;
  width: 100%;
  text-align: center;
  background: #ffffff;
  border-radius: 16px;
  padding: 48px 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid #e9ecef;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.icon-container {
  margin-bottom: 32px;
}

.no-auth-icon {
  width: 64px;
  height: 64px;
  color: #6c757d;
  opacity: 0.8;
}

.content-wrapper {
  margin-bottom: 40px;
}

.no-auth-title {
  font-size: 28px;
  font-weight: 600;
  color: #212529;
  margin-bottom: 16px;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.no-auth-description {
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  line-height: 1.5;
  margin-bottom: 8px;
}

.no-auth-subdescription {
  font-size: 14px;
  color: #6c757d;
  line-height: 1.5;
  margin: 0;
}

.no-auth-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  text-decoration: none;
}

.btn-primary {
  background: #212529;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(33, 37, 41, 0.15);
}

.btn-primary:hover {
  background: #343a40;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(33, 37, 41, 0.2);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(33, 37, 41, 0.15);
}

.btn-secondary {
  background: #ffffff;
  color: #495057;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.btn-secondary:hover {
  background: #f8f9fa;
  border-color: #ced4da;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.btn-secondary:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* Mobile responsive */
@media (max-width: 640px) {
  .no-auth-container {
    padding: 16px;
  }

  .no-auth-content {
    padding: 40px 24px;
    border-radius: 12px;
  }

  .no-auth-title {
    font-size: 24px;
  }

  .no-auth-description {
    font-size: 15px;
  }

  .no-auth-subdescription {
    font-size: 13px;
  }

  .no-auth-actions {
    flex-direction: column;
    gap: 10px;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .no-auth-content {
    padding: 32px 20px;
  }

  .no-auth-icon {
    width: 56px;
    height: 56px;
  }

  .no-auth-title {
    font-size: 22px;
  }

  .no-auth-description {
    font-size: 14px;
  }

  .no-auth-subdescription {
    font-size: 12px;
  }
}

/* Dark mode support - keeping the minimalist gray theme */
@media (prefers-color-scheme: dark) {
  .no-auth-container {
    background: #1a1a1a;
  }

  .no-auth-content {
    background: #2d2d2d;
    border: 1px solid #404040;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  }

  .no-auth-icon {
    color: #9ca3af;
  }

  .no-auth-title {
    color: #ffffff;
  }

  .no-auth-description {
    color: #d1d5db;
  }

  .no-auth-subdescription {
    color: #9ca3af;
  }

  .btn-primary {
    background: #374151;
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .btn-primary:hover {
    background: #4b5563;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .btn-secondary {
    background: #2d2d2d;
    color: #d1d5db;
    border: 1px solid #404040;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .btn-secondary:hover {
    background: #374151;
    border-color: #4b5563;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .no-auth-content {
    animation: none;
  }

  .btn {
    transition: none;
  }
}
</style>
