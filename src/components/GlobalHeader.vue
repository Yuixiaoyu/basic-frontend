<template>
  <a-layout class="header">
    <a-layout-header>
      <a-row :wrap="false">
        <!-- 左侧：Logo和标题 -->
        <a-col flex="200px">
          <RouterLink to="/">
            <div class="header-left">
              <img class="logo" src="@/assets/logo.png" alt="Logo" />
              <h1 class="site-title">Vue-init</h1>
            </div>
          </RouterLink>
        </a-col>
        <!-- 中间：导航菜单 -->
        <a-col flex="auto">
          <a-menu
            v-model:selectedKeys="selectedKeys"
            mode="horizontal"
            :items="menuItems"
            @click="handleMenuClick"
            style="padding: 0 8px"
          />
        </a-col>
        <!-- 右侧：用户操作区域 -->
        <a-col>
          <div class="user-login-status">
            <div v-if="loginUserStore.loginUser.id">
              <a-dropdown>
                <a-space>
                  <a-avatar :src="loginUserStore.loginUser.userAvatar" />
                  {{ loginUserStore.loginUser.userName ?? '无名' }}
                </a-space>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="goToProfile">
                      <UserOutlined />
                      个人信息
                    </a-menu-item>
                    <a-menu-item @click="doLogout">
                      <LogoutOutlined />
                      退出登录
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
            <div v-else>
              <a-button type="primary" href="/user/login">登录</a-button>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-layout-header>
  </a-layout>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { HomeOutlined, InfoCircleOutlined, UserOutlined } from '@ant-design/icons-vue'
// JS 中引入 Store
import { useLoginUserStore } from '@/stores/loginUser.ts'
import { LogoutOutlined } from '@ant-design/icons-vue'
import { userLogout } from '@/api/userController.ts'
import { type MenuProps, message } from 'ant-design-vue'
import checkAccess from '@/access/checkAccess.ts'

// 获取登录用户信息
const loginUserStore = useLoginUserStore()

const router = useRouter()
const route = useRoute()

// 菜单配置项
const originItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/admin/userManage',
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: 'others',
    label: h('a', { href: 'https://github.com/Yuixiaoyu', target: '_blank' }, 'xiaoyu'),
    title: 'xiaoyu',
  },
]

// 根据菜单key查找对应的路由配置
const findRouteByKey = (key: string) => {
  return router.getRoutes().find(route => route.path === key)
}

// 过滤菜单项（基于路由权限配置）
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    const menuKey = menu?.key as string

    // 如果不是路由路径（比如外部链接），直接显示
    if (!menuKey?.startsWith('/')) {
      return true
    }

    // 查找对应的路由配置
    const route = findRouteByKey(menuKey)
    if (!route) {
      return true // 如果找不到路由配置，默认显示
    }

    // 检查用户是否有访问权限
    const needAccess = route.meta?.access
    return checkAccess(loginUserStore.loginUser, needAccess)
  })
}

// 展示在菜单的路由数组
const menuItems = computed<MenuProps['items']>(() => filterMenus(originItems))

// 当前选中的菜单项
const selectedKeys = ref<string[]>([])

// 根据当前路由设置选中的菜单项
const updateSelectedKeys = () => {
  const currentPath = route.path
  selectedKeys.value = [currentPath]
}

// 监听路由变化
watch(
  () => route.path,
  () => {
    updateSelectedKeys()
  },
  { immediate: true },
)

// 处理菜单点击
const handleMenuClick: MenuProps['onClick'] = (e) => {
  const key = e.key as string
  selectedKeys.value = [key]
  // 跳转到对应页面
  if (key.startsWith('/')) {
    router.push(key)
  }
}

// 跳转到个人信息页面
const goToProfile = () => {
  router.push('/user/profile')
}

// 用户注销
const doLogout = async () => {
  const res = await userLogout()
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出登录成功')
    await router.push('/user/login')
  } else {
    message.error('退出登录失败，' + res.data.message)
  }
}



</script>

<style scoped>
.header {
  background: #fff !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid #f0f0f0;
}

.header :deep(.ant-layout-header) {
  background: #fff !important;
  line-height: 64px;
}

.header-left {
  display: flex;
  align-items: center;
  background: #fff;
  gap: 12px;
}

.header-left:hover {
  opacity: 0.8;
  transition: opacity 0.3s;
}

.logo {
  height: 48px;
  width: 48px;
  border-radius: 6px;
}

.site-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.ant-menu-horizontal {
  border-bottom: none !important;
  background: #fff !important;
}

.ant-menu-horizontal :deep(.ant-menu-item) {
  background: #fff !important;
}

.ant-menu-horizontal :deep(.ant-menu-item:hover) {
  background: #f5f5f5 !important;
  border-radius: 6px;
  margin: 0 4px;
}

.ant-menu-horizontal :deep(.ant-menu-item-selected) {
  background: #e6f7ff !important;
  border-radius: 6px;
  margin: 0 4px;
}

.user-login-status {
  background: #fff;
}

.user-login-status :deep(.ant-btn) {
  border-radius: 6px;
  font-weight: 500;
}

.user-login-status :deep(.ant-dropdown-trigger) {
  border-radius: 6px;
  padding: 0 6px;
  transition: background-color 0.3s;
}

.user-login-status :deep(.ant-dropdown-trigger:hover) {
  background: #f5f5f5;
}
</style>
