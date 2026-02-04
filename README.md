# Server Manager

一个基于 Electron + React + TypeScript 开发的现代化桌面应用，用于通过 UDP 组播协议发现和管理局域网内的服务器 IP 配置，支持 SQLite 数据库持久化存储。

A modern desktop application built with Electron, React, and TypeScript for discovering and managing server IP configurations via UDP multicast protocol, with SQLite database persistence.

---

## ✨ 主要功能 / Features

- 🔍 **自动服务器发现** - 通过 UDP 组播自动发现局域网内的服务器
- 💾 **SQLite 数据持久化** - 服务器信息和历史记录持久化存储
- 🎨 **现代化界面** - 支持深色/浅色主题的响应式界面
- 🌍 **IP 配置管理** - 查看和修改服务器 IP 配置
- ⚡ **实时更新** - 实时监控服务器状态和连接
- ⭐ **收藏功能** - 标记重要服务器为收藏
- 📜 **历史记录** - 追踪所有服务器变更和 IP 修改
- 📊 **统计信息** - 查看数据库统计和服务器分析
- 🖥️ **跨平台支持** - 支持 Windows、macOS 和 Linux

---

## 🛠️ 技术栈 / Technology Stack

- **Electron** v34.0.0 - 桌面应用框架
- **React** v18.3.1 - 用户界面库
- **TypeScript** v5.7.3 - 类型安全开发
- **SQLite** (better-sqlite3 v12.6.2) - 本地数据库
- **Tailwind CSS** v3.4.17 - 现代化样式框架
- **Vite** v6.0.7 - 快速构建工具

---

## 🚀 快速开始 / Getting Started

### 环境要求
- Node.js >= v20
- npm >= v10

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 测试服务器发现功能
```bash
# 在另一个终端启动测试服务器
node test-server.js "测试服务器" 8080

# 启动多个测试服务器
node test-server.js "生产服务器" 8080
node test-server.js "开发服务器" 3000
```

### 测试数据库功能
```bash
node test-database.js
```

---

## 📦 打包 / Building

详细的打包说明请查看 [BUILD.md](./BUILD.md)

```bash
# 构建生产版本
npm run build

# Windows 打包
npm run electron:build:win

# macOS 打包（需要 macOS 系统）
./build-macos.sh
```

打包完成后，应用程序将输出到 `release` 目录。

---

## 🏗️ 架构 / Architecture

### 服务器发现协议

应用使用 UDP 组播进行服务器发现：

- **组播地址**: `239.255.255.250`
- **端口**: `9876`
- **发现流程**:
  1. 客户端每 5 秒广播发现请求
  2. 服务器响应包含其信息的公告消息
  3. 客户端维护活跃服务器列表（15 秒超时）

### 消息格式

**发现请求**:
```json
{
  "type": "discovery-request",
  "timestamp": 1234567890
}
```

**服务器公告**:
```json
{
  "type": "server-announce",
  "serverId": "unique-id",
  "name": "Server Name",
  "ip": "192.168.1.100",
  "port": 8080,
  "metadata": {
    "version": "2.1.0",
    "location": "US East"
  }
}
```

---

## 💾 数据库 / Database

应用集成了完整的 SQLite 数据库功能：

- **自动持久化**: 所有服务器数据自动保存
- **历史追踪**: 记录所有变更及时间戳
- **收藏功能**: 标记和筛选重要服务器
- **统计信息**: 查看完整的数据库分析
- **存储位置**: 数据库存储在用户应用数据目录

### 数据库模式

**servers 表**:
- 服务器信息（id, name, ip, port, version, location 等）
- 发现时间戳（firstDiscovered, lastSeen）
- 用户偏好（isFavorite, notes）

**server_history 表**:
- 所有变更的历史记录
- 追踪发现、IP 修改和其他操作
- 带时间戳的审计跟踪

---

## 📂 项目结构 / Project Structure

```
├── electron/          # Electron 主进程
│   ├── main.ts       # 主进程（包含发现逻辑）
│   ├── database.ts   # SQLite 数据库服务（400+ 行）
│   └── preload.ts    # IPC 通信预加载脚本
├── src/              # React 应用
│   ├── components/   # UI 组件
│   │   ├── ServerList.tsx
│   │   ├── ServerDetail.tsx
│   │   ├── Header.tsx
│   │   └── ui/       # 可复用 UI 组件
│   ├── lib/          # 工具函数
│   ├── types/        # TypeScript 类型定义
│   └── App.tsx       # 主应用
├── test-server.js    # 测试服务器脚本
├── test-database.js  # 数据库功能测试
└── package.json      # 项目配置
```

---

## 🎨 设计系统 / Design System

应用使用完整的设计系统：

- **字体**: Inter 字体家族（Google Fonts）
- **颜色系统**: 语义化的主题 token
- **组件**: 可复用的 UI 组件及其变体
- **主题**: 深色和浅色模式，支持系统偏好检测

---

## 📋 API 参考 / API Reference

### 前端 API (window.electronAPI)

```typescript
// 获取所有服务器
const servers = await window.electronAPI.getServers();

// 切换收藏
await window.electronAPI.toggleFavorite(serverId);

// 获取收藏服务器
const favorites = await window.electronAPI.getFavoriteServers();

// 更新备注
await window.electronAPI.updateServerNotes(serverId, "我的备注");

// 获取历史记录
const history = await window.electronAPI.getServerHistory(serverId);

// 获取统计信息
const stats = await window.electronAPI.getDbStats();

// 删除服务器
await window.electronAPI.deleteServer(serverId);
```

---

## 📊 代码统计 / Code Statistics

- **总行数**: ~1,400 行 TypeScript/TSX
- **主进程**: 300+ 行 (main.ts)
- **数据库模块**: 400+ 行 (database.ts)
- **UI 组件**: 8 个 React 组件
- **测试脚本**: 2 个完整测试文件

---

## 📄 许可证 / License

MIT

---

**Built with ❤️ using Electron, React, TypeScript, and SQLite**
