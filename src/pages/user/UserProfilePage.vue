<template>
  <div class="profile-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">个人信息</h1>
      <p class="page-description">管理您的个人资料和账户信息</p>
    </div>

    <div class="profile-content">
      <!-- 左侧头像区域 -->
      <div class="avatar-section">
        <div class="avatar-wrapper">
          <a-avatar :size="120" :src="userProfile.userAvatar" class="user-avatar">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <div class="avatar-overlay">
            <a-upload
              :show-upload-list="false"
              :before-upload="beforeUpload"
              accept="image/*"
              class="avatar-upload"
              :disabled="uploadingAvatar"
            >
              <div class="upload-trigger" :class="{ uploading: uploadingAvatar }">
                <LoadingOutlined v-if="uploadingAvatar" />
                <CameraOutlined v-else />
                <span>{{ uploadingAvatar ? '上传中...' : '更换头像' }}</span>
              </div>
            </a-upload>
          </div>
        </div>

        <div class="user-basic-info">
          <h2 class="user-name">{{ userProfile.userName || '未设置用户名' }}</h2>
          <div class="user-role">
            <a-tag :color="getRoleColor(userProfile.userRole)" class="role-tag">
              {{ getRoleText(userProfile.userRole) }}
            </a-tag>
          </div>
          <p class="user-account">@{{ userProfile.userAccount }}</p>
        </div>
      </div>

      <!-- 右侧表单区域 -->
      <div class="form-section">
        <a-form
          :model="userProfile"
          layout="vertical"
          @finish="updateProfile"
          class="profile-form"
        >
          <div class="form-row">
            <a-form-item
              label="用户名"
              name="userName"
              :rules="[{ required: true, message: '请输入用户名!' }]"
              class="form-item"
            >
              <a-input
                v-model:value="userProfile.userName"
                placeholder="请输入用户名"
                :maxlength="20"
                size="large"
                class="modern-input"
              />
            </a-form-item>

            <a-form-item label="用户账号" class="form-item">
              <a-input
                :value="userProfile.userAccount"
                disabled
                size="large"
                class="modern-input disabled-input"
              />
            </a-form-item>
          </div>

          <a-form-item label="个人简介" name="userProfile" class="form-item">
            <a-textarea
              v-model:value="userProfile.userProfile"
              placeholder="介绍一下自己吧..."
              :rows="4"
              :maxlength="200"
              show-count
              size="large"
              class="modern-textarea"
            />
          </a-form-item>

          <!-- 账户信息区域 -->
          <div class="info-section">
            <h3 class="section-title">账户信息</h3>
            <div class="info-grid">
              <div class="info-item">
                <label class="info-label">注册时间</label>
                <span class="info-value">{{ formatDate(userProfile.createTime) }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">最后更新</label>
                <span class="info-value">{{ formatDate(userProfile.updateTime) }}</span>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="form-actions">
            <a-button type="primary" html-type="submit" :loading="loading" size="large" class="save-btn">
              <SaveOutlined />
              保存修改
            </a-button>
            <a-button @click="resetForm" size="large" class="reset-btn">
              <ReloadOutlined />
              重置
            </a-button>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  UserOutlined,
  CameraOutlined,
  SaveOutlined,
  ReloadOutlined,
  LoadingOutlined
} from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/loginUser'
import { updateUser, getLoginUser } from '@/api/userController'
import { upload, deleteFile } from '@/api/minioController'

const loginUserStore = useLoginUserStore()
const loading = ref(false)
const uploadingAvatar = ref(false)

// 用户信息表单数据
const userProfile = reactive<API.LoginUserVO>({
  id: 0,
  userName: '',
  userAccount: '',
  userAvatar: '',
  userProfile: '',
  userRole: '',
  createTime: '',
  updateTime: ''
})

// 获取角色颜色
const getRoleColor = (role?: string) => {
  switch (role) {
    case 'admin':
      return 'red'
    case 'user':
      return 'blue'
    default:
      return 'default'
  }
}

// 获取角色文本
const getRoleText = (role?: string) => {
  switch (role) {
    case 'admin':
      return '管理员'
    case 'user':
      return '普通用户'
    default:
      return '未知角色'
  }
}

// 格式化日期
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '暂无'
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 初始化用户信息
const initUserProfile = () => {
  const loginUser = loginUserStore.loginUser
  if (loginUser.id) {
    Object.assign(userProfile, loginUser)
  }
}

// 重置表单
const resetForm = () => {
  initUserProfile()
  message.info('已重置为当前信息')
}

// 异步删除旧头像
const deleteOldAvatar = async (oldAvatarUrl: string) => {
  if (!oldAvatarUrl || oldAvatarUrl.startsWith('data:')) {
    // 如果没有旧头像或是base64格式，则无需删除
    return
  }

  try {
    // 直接传入完整的图片访问地址
    await deleteFile({ filePath: oldAvatarUrl })
    console.log('旧头像删除成功:', oldAvatarUrl)
  } catch (error) {
    console.error('删除旧头像失败:', error)
    // 删除失败不影响主流程，只记录错误
  }
}

// 头像上传前处理
const beforeUpload = async (file: File) => {
  // 文件格式验证
  const isValidFormat = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
  if (!isValidFormat) {
    message.error('只能上传 JPG/PNG/GIF 格式的图片!')
    return false
  }

  // 文件大小验证
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!')
    return false
  }

  // 开始上传流程
  uploadingAvatar.value = true

  try {
    // 创建FormData对象
    const formData = new FormData()
    formData.append('file', file)

    // 调用上传接口，使用特殊的配置来处理FormData
    const uploadRes = await upload(formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: [function (data: any) {
        return data
      }]
    })

    if (uploadRes.data.code === 0 && uploadRes.data.data) {
      const newAvatarUrl = uploadRes.data.data
      const oldAvatarUrl = userProfile.userAvatar

      // 更新头像URL
      userProfile.userAvatar = newAvatarUrl
      message.success('头像上传成功!')

      // 异步删除旧头像（不阻塞主流程）
      if (oldAvatarUrl && oldAvatarUrl !== newAvatarUrl) {
        setTimeout(() => {
          deleteOldAvatar(oldAvatarUrl)
        }, 1000) // 延迟1秒后删除，确保新头像已经生效
      }
    } else {
      message.error('头像上传失败: ' + (uploadRes.data.message || '未知错误'))
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    message.error('头像上传失败，请稍后重试')
  } finally {
    uploadingAvatar.value = false
  }

  return false // 阻止ant-design-vue的默认上传行为
}

// 更新个人信息
const updateProfile = async () => {
  try {
    loading.value = true
    const updateData: API.UserUpdateRequest = {
      id: userProfile.id,
      userName: userProfile.userName,
      userAvatar: userProfile.userAvatar,
      userProfile: userProfile.userProfile
    }

    const res = await updateUser(updateData)
    if (res.data.code === 0) {
      message.success('个人信息更新成功!')
      // 更新本地存储的用户信息
      await loginUserStore.fetchLoginUser()
    } else {
      message.error('更新失败: ' + res.data.message)
    }
  } catch (error) {
    message.error('更新失败，请稍后重试')
    console.error('更新个人信息失败:', error)
  } finally {
    loading.value = false
  }
}

// 组件挂载时初始化数据
onMounted(() => {
  initUserProfile()
})
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 页面标题区域 */
.page-header {
  margin-bottom: 32px;
  text-align: left;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.page-description {
  font-size: 16px;
  color: #8c8c8c;
  margin: 0;
  line-height: 1.5;
}

/* 主要内容区域 */
.profile-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 40px;
  align-items: start;
}

/* 左侧头像区域 */
.avatar-section {
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border: 1px solid #f0f0f0;
  text-align: center;
  position: sticky;
  top: 24px;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
}

.user-avatar {
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #f5f5f5;
}

.avatar-overlay {
  position: absolute;
  bottom: -8px;
  right: -8px;
}

.upload-trigger {
  background: #1890ff;
  color: white;
  border-radius: 20px;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.upload-trigger:hover {
  background: #40a9ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
}

.upload-trigger.uploading {
  background: #52c41a;
  cursor: not-allowed;
  animation: pulse 1.5s ease-in-out infinite;
}

.upload-trigger.uploading:hover {
  background: #52c41a;
  transform: none;
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3);
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

.user-basic-info {
  text-align: center;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.user-role {
  margin-bottom: 8px;
}

.role-tag {
  border-radius: 12px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  border: none;
}

.user-account {
  color: #8c8c8c;
  font-size: 14px;
  margin: 0;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

/* 右侧表单区域 */
.form-section {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border: 1px solid #f0f0f0;
}

.profile-form {
  width: 100%;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-item {
  margin-bottom: 24px;
}

.form-item :deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #262626;
  font-size: 14px;
}

.modern-input,
.modern-textarea {
  border-radius: 8px;
  border: 1.5px solid #d9d9d9;
  transition: all 0.3s ease;
  font-size: 14px;
}

.modern-input:hover,
.modern-textarea:hover {
  border-color: #40a9ff;
}

.modern-input:focus,
.modern-textarea:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}

.disabled-input {
  background: #fafafa;
  color: #8c8c8c;
  cursor: not-allowed;
}

.modern-textarea {
  resize: vertical;
  min-height: 100px;
}

/* 信息区域 */
.info-section {
  margin: 32px 0;
  padding: 24px;
  background: #fafafa;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 16px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #8c8c8c;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  color: #262626;
  font-weight: 500;
}

/* 操作按钮 */
.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.save-btn {
  background: #1890ff;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  height: 44px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.save-btn:hover {
  background: #40a9ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.reset-btn {
  border: 1.5px solid #d9d9d9;
  border-radius: 8px;
  font-weight: 500;
  height: 44px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  background: #fff;
}

.reset-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .profile-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .avatar-section {
    position: static;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }

  .avatar-section,
  .form-section {
    padding: 24px 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .save-btn,
  .reset-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .profile-container {
    padding: 0 16px;
  }

  .page-title {
    font-size: 20px;
  }

  .page-description {
    font-size: 14px;
  }

  .avatar-section,
  .form-section {
    padding: 20px 16px;
    border-radius: 12px;
  }

  .user-avatar {
    width: 100px !important;
    height: 100px !important;
  }
}

/* 动画效果 */
.profile-container * {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar-section,
.form-section {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ant Design 组件样式覆盖 */
.profile-form :deep(.ant-form-item-explain-error) {
  font-size: 12px;
  margin-top: 4px;
}

.profile-form :deep(.ant-input-affix-wrapper) {
  border-radius: 8px;
  border: 1.5px solid #d9d9d9;
}

.profile-form :deep(.ant-input-affix-wrapper:hover) {
  border-color: #40a9ff;
}

.profile-form :deep(.ant-input-affix-wrapper-focused) {
  border-color: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}
</style>
