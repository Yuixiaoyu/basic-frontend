<script setup lang="ts">
import { deleteUser, listUserVoByPage, updateUser } from '@/api/userController.ts'
import { message } from 'ant-design-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 数据
const data = ref<API.UserVO[]>([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<API.UserQueryRequest>({
  pageNum: 1,
  pageSize: 10,
})

// 获取数据
const fetchData = async () => {
  const res = await listUserVoByPage({
    ...searchParams,
  })
  if (res.data.data) {
    data.value = res.data.data.records ?? []
    total.value = res.data.data.totalRow ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.pageNum ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
  }
})
// 表格变化处理
const doTableChange = (page: any) => {
  searchParams.pageNum = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}
// 获取数据
const doSearch = () => {
  // 重置页码
  searchParams.pageNum = 1
  fetchData()
}

// 编辑相关状态
const isEditModalVisible = ref(false)
const editingUser = ref<API.UserVO>({})
const editForm = reactive<API.UserUpdateRequest>({
  id: undefined,
  userName: '',
  userAvatar: '',
  userProfile: '',
  userRole: '',
})

// 打开编辑模态框
const doEdit = (record: API.UserVO) => {
  editingUser.value = { ...record }
  editForm.id = record.id
  editForm.userName = record.userName || ''
  editForm.userAvatar = record.userAvatar || ''
  editForm.userProfile = record.userProfile || ''
  editForm.userRole = record.userRole || ''
  isEditModalVisible.value = true
}

// 关闭编辑模态框
const handleEditCancel = () => {
  isEditModalVisible.value = false
  // 重置表单
  editForm.id = undefined
  editForm.userName = ''
  editForm.userAvatar = ''
  editForm.userProfile = ''
  editForm.userRole = ''
}

// 确认编辑
const handleEditOk = async () => {
  if (!editForm.id) {
    message.error('用户ID不能为空')
    return
  }
  
  try {
    const res = await updateUser(editForm)
    if (res.data.code === 0) {
      message.success('编辑成功')
      isEditModalVisible.value = false
      // 刷新数据
      fetchData()
      // 重置表单
      handleEditCancel()
    } else {
      message.error('编辑失败：' + (res.data.message || '未知错误'))
    }
  } catch (error) {
    message.error('编辑失败')
    console.error('编辑用户失败:', error)
  }
}

// 删除数据
const doDelete = async (id: number) => {
  if (!id) {
    return
  }
  const res = await deleteUser({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('删除失败')
  }
}
</script>

<template>
  <div id="userManagePage">
    <!-- 搜索表单 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="账号">
        <a-input v-model:value="searchParams.userAccount" placeholder="输入账号" />
      </a-form-item>
      <a-form-item label="用户名">
        <a-input v-model:value="searchParams.userName" placeholder="输入用户名" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-divider />
    <!-- 表格 -->
  </div>
  <a-table :columns="columns" :data-source="data" :pagination="pagination" @change="doTableChange">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined />
          Name
        </span>
      </template>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'userAvatar'">
        <a-image :src="record.userAvatar" :width="120" />
      </template>
      <template v-else-if="column.dataIndex === 'userRole'">
        <div v-if="record.userRole === 'admin'">
          <a-tag color="green">管理员</a-tag>
        </div>
        <div v-else>
          <a-tag color="blue">普通用户</a-tag>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-button type="primary" @click="doEdit(record)" style="margin-right: 8px;">编辑</a-button>
        <a-button danger @click="doDelete(record.id)">删除</a-button>
      </template>
    </template>
  </a-table>

  <!-- 编辑用户模态框 -->
  <a-modal
    title="编辑用户信息"
    :open="isEditModalVisible"
    @ok="handleEditOk"
    @cancel="handleEditCancel"
    :confirm-loading="false"
    width="600px"
  >
    <a-form :model="editForm" layout="vertical">
      <a-form-item label="用户名" name="userName">
        <a-input v-model:value="editForm.userName" placeholder="请输入用户名" />
      </a-form-item>
      
      <a-form-item label="头像URL" name="userAvatar">
        <a-input v-model:value="editForm.userAvatar" placeholder="请输入头像URL" />
        <div v-if="editForm.userAvatar" style="margin-top: 8px;">
          <a-image :src="editForm.userAvatar" :width="100" />
        </div>
      </a-form-item>
      
      <a-form-item label="用户简介" name="userProfile">
        <a-textarea 
          v-model:value="editForm.userProfile" 
          placeholder="请输入用户简介" 
          :rows="3"
        />
      </a-form-item>
      
      <a-form-item label="用户角色" name="userRole">
        <a-select v-model:value="editForm.userRole" placeholder="请选择用户角色">
          <a-select-option value="user">普通用户</a-select-option>
          <a-select-option value="admin">管理员</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped></style>
