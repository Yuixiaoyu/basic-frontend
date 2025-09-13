# Basic Frontend Template

## 项目简介

这是一个基于 Vue 3 + TypeScript + Ant Design Vue 的前端基础模板项目，提供了用户认证、权限管理、页面路由等基础功能，适合快速开发中后台管理系统。

## 技术栈

- **框架**: Vue 3.5+ (Composition API)
- **语言**: TypeScript 5.8+
- **构建工具**: Vite 7.0+
- **UI组件库**: Ant Design Vue 4.2+
- **状态管理**: Pinia 3.0+
- **路由**: Vue Router 4.5+
- **HTTP客户端**: Axios 1.11+
- **代码规范**: ESLint + Prettier
- **Node.js**: ^20.19.0 || >=22.12.0

## 项目特性

### 🔐 认证与权限
- 用户登录/注册
- 基于角色的权限控制 (RBAC)
- 路由权限守卫
- 登录状态管理

### 🎨 界面与体验
- 响应式布局设计
- Ant Design Vue 组件库
- 全局样式重置
- 优雅的滚动条样式

### 🔧 开发体验
- TypeScript 类型检查
- 热重载开发服务器
- ESLint 代码检查
- Prettier 代码格式化
- 自动 API 类型生成

### 📁 项目结构
```
src/
├── access/           # 权限控制
│   ├── accessEnum.ts  # 权限枚举
│   ├── checkAccess.ts # 权限检查
│   └── index.ts       # 路由守卫
├── api/              # API 接口
│   ├── userController.ts  # 用户相关接口
│   ├── healthController.ts # 健康检查接口
│   ├── minioController.ts  # 文件存储接口
│   └── typings.d.ts       # API 类型定义
├── components/       # 公共组件
│   ├── GlobalFooter.vue
│   └── GlobalHeader.vue
├── layouts/          # 布局组件
│   └── BasicLayout.vue
├── pages/            # 页面组件
│   ├── admin/        # 管理员页面
│   │   └── UserManagePage.vue
│   ├── user/         # 用户页面
│   │   ├── UserLoginPage.vue
│   │   ├── UserProfilePage.vue
│   │   └── UserRegisterPage.vue
│   ├── AboutView.vue
│   ├── HomePage.vue
│   └── NoAuthPage.vue
├── router/           # 路由配置
│   └── index.ts
├── stores/           # 状态管理
│   ├── counter.ts
│   └── loginUser.ts  # 用户登录状态
├── App.vue           # 根组件
├── main.ts           # 应用入口
└── request.ts        # HTTP 请求封装
```

## 快速开始

### 环境要求
- Node.js: ^20.19.0 || >=22.12.0
- npm 或 yarn 或 pnpm

### 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发运行
```bash
npm run dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

### 代码检查与格式化
```bash
# ESLint 检查并自动修复
npm run lint

# Prettier 格式化代码
npm run format

# TypeScript 类型检查
npm run type-check
```

### API 类型生成
```bash
# 根据后端 OpenAPI 文档生成前端 API 类型
npm run openapi2ts
```

## 配置说明

### 后端 API 配置

项目默认连接到 `http://localhost:8123/api` 后端服务。

修改 API 地址：
1. 编辑 `src/request.ts` 文件中的 `baseURL`
2. 编辑 `openapi2ts.config.ts` 文件中的 `schemaPath`

### 权限系统

项目包含三种权限级别：
- `notLogin`: 未登录用户
- `user`: 普通用户
- `admin`: 管理员

权限配置在 `src/access/accessEnum.ts` 中定义，路由权限在 `src/router/index.ts` 中配置。

### 路由配置

主要路由:
- `/` - 首页
- `/user/login` - 用户登录
- `/user/register` - 用户注册
- `/user/profile` - 个人信息 (需要登录)
- `/admin/userManage` - 用户管理 (需要管理员权限)
- `/noAuth` - 无权限页面

## 开发指南

### 添加新页面

1. 在 `src/pages/` 目录下创建 Vue 组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 如需要权限控制，在路由的 `meta.access` 字段设置权限级别

### 添加新的 API 接口

1. 方式一：手动在 `src/api/` 目录下创建控制器文件
2. 方式二：使用 `npm run openapi2ts` 自动生成（推荐）

### 状态管理

使用 Pinia 进行状态管理，已提供:
- `loginUser` store: 用户登录状态管理
- `counter` store: 示例计数器

### 样式开发

- 全局样式在 `src/App.vue` 中定义
- 使用 Ant Design Vue 组件样式
- 支持 CSS Modules 和 Scoped CSS

## 部署

### 构建
```bash
npm run build
```

构建产物在 `dist/` 目录下。

### 部署选项
- 静态文件服务器 (Nginx, Apache)
- CDN 部署
- 容器化部署 (Docker)
- 云平台部署 (Vercel, Netlify)

## 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如果您有任何问题或建议，请通过以下方式联系：

<img src="https://youke1.picui.cn/s1/2025/09/14/68c5a03405338.jpg"></img>


---

**注意**: 本项目为基础模板，实际使用时请根据具体需求进行调整和扩展。