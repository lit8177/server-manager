# Server Manager - Quick Start Guide

欢迎使用 Server Manager！这是一个现代化的桌面应用程序，用于发现和管理网络上的服务器 IP 配置。

Welcome to Server Manager! This is a modern desktop application for discovering and managing server IP configurations on your network.

## 🚀 快速开始 / Quick Start

### 1. 安装依赖 / Install Dependencies
```bash
npm install
```

### 2. 启动开发模式 / Start Development Mode
```bash
npm run dev
```

应用程序将自动启动 Vite 开发服务器和 Electron 窗口。
The application will automatically start the Vite dev server and Electron window.

### 3. 测试服务器发现 / Test Server Discovery

在另一个终端中启动测试服务器：
Start a test server in another terminal:

```bash
node test-server.js "生产服务器" 8080
```

或启动多个测试服务器：
Or start multiple test servers:

```bash
node test-server.js "Production Server" 8080
node test-server.js "Development Server" 3000
node test-server.js "Staging Server" 5000
```

## ✨ 主要功能 / Key Features

### 🔍 自动服务器发现
应用程序会自动扫描网络并发现服务器（使用 UDP 组播协议）
Automatically scan the network and discover servers (using UDP multicast)

### 🎨 现代化界面
- 深色/浅色主题支持
- Dark/Light theme support
- 简洁清晰的布局
- Clean and intuitive layout
- 实时连接状态指示
- Real-time connection status indicators

### 🌐 IP 管理
- 查看服务器 IP 信息
- View server IP information
- 修改服务器 IP 配置
- Modify server IP configuration
- 验证 IP 地址格式
- Validate IP address format

### ⚡ 实时更新
- 自动刷新服务器列表（每 5 秒）
- Auto-refresh server list (every 5 seconds)
- 实时状态监控
- Real-time status monitoring
- 连接测试功能
- Connection testing feature

## 📦 构建应用 / Build Application

### 构建所有平台 / Build for All Platforms
```bash
npm run build
npm run electron:build
```

### 构建 Windows 版本 / Build for Windows
```bash
npm run electron:build:win
```

### 构建 macOS 版本 / Build for macOS
```bash
npm run electron:build:mac
```

构建完成的应用将在 `release` 目录中。
Built applications will be in the `release` directory.

## 🎯 使用说明 / Usage Instructions

### 主题切换 / Theme Switching
点击右上角的主题切换按钮：
Click the theme switcher in the top-right corner:
- ☀️ 浅色模式 / Light Mode
- 🌙 深色模式 / Dark Mode
- 🖥️ 系统模式 / System Mode

### 选择服务器 / Select Server
在左侧列表中点击服务器卡片，右侧将显示详细信息。
Click a server card in the left panel to view details on the right.

### 修改 IP / Modify IP
1. 选择一个服务器 / Select a server
2. 点击"编辑"按钮 / Click "Edit" button
3. 输入新的 IP 地址 / Enter new IP address
4. 点击"保存更改" / Click "Save Changes"

### 测试连接 / Test Connection
在服务器详情页面点击"测试连接"按钮，查看服务器响应时间。
Click "Test Connection" button in server detail page to check server response time.

### 刷新服务器列表 / Refresh Server List
点击服务器列表顶部的"刷新"按钮手动刷新。
Click "Refresh" button at the top of server list to manually refresh.

## 🔧 技术栈 / Technology Stack

- **Electron** - 跨平台桌面应用框架 / Cross-platform desktop framework
- **React** - UI 库 / UI library
- **TypeScript** - 类型安全开发 / Type-safe development
- **Tailwind CSS** - 现代化样式系统 / Modern styling system
- **Vite** - 快速构建工具 / Fast build tool

## 📡 网络协议 / Network Protocol

### 服务器发现 / Server Discovery
- 协议 / Protocol: UDP 组播 / UDP Multicast
- 地址 / Address: `239.255.255.250`
- 端口 / Port: `9876`

### 消息格式 / Message Format

**发现请求 / Discovery Request**:
```json
{
  "type": "discovery-request",
  "timestamp": 1234567890
}
```

**服务器公告 / Server Announcement**:
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

## 🧪 测试 / Testing

查看 [TESTING.md](./TESTING.md) 获取完整的测试指南。
See [TESTING.md](./TESTING.md) for comprehensive testing guide.

快速测试发现协议：
Quick test for discovery protocol:
```bash
node test-discovery.js
```

## 📚 更多文档 / More Documentation

- [README.md](./README.md) - 完整项目文档 / Complete project documentation
- [TESTING.md](./TESTING.md) - 测试指南 / Testing guide

## 🐛 常见问题 / Troubleshooting

### Electron 窗口不打开 / Electron Window Doesn't Open
检查控制台错误，确保端口 5173 未被占用。
Check console for errors, ensure port 5173 is not in use.

### 服务器未显示 / Servers Not Appearing
- 确保 test-server.js 正在运行 / Ensure test-server.js is running
- 检查防火墙设置（UDP 端口 9876 必须开放）/ Check firewall (UDP port 9876 must be open)
- 验证网络支持组播 / Verify network supports multicast

### 主题切换不工作 / Theme Switching Not Working
清除 localStorage 并重新加载应用。
Clear localStorage and reload the app.

## 📝 许可证 / License

MIT

## 🤝 贡献 / Contributing

欢迎提交问题和拉取请求！
Issues and pull requests are welcome!

---

**享受使用 Server Manager！ / Enjoy using Server Manager!** 🎉
