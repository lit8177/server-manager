# 构建指南 / Build Guide

## 🚀 快速开始

### 开发模式
```bash
# 安装依赖
npm install

# 启动开发环境
npm run dev
```

### 测试服务器发现功能
```bash
# 在另一个终端启动测试服务器
node test-server.js "测试服务器" 8080
```

---

## 📦 打包应用

### Windows 打包
```bash
npm run build
npm run electron:build:win
```
打包产物在 `release` 目录。

### macOS 打包

⚠️ **重要**: macOS 应用**只能在 macOS 系统上**打包（Apple 平台限制）

#### 在 macOS 系统上打包：
```bash
npm install
./build-macos.sh
```

#### 在 Linux/Windows 上开发：
```bash
# ✅ 可以正常开发
npm run dev

# ❌ 无法打包 macOS 应用（平台限制）
```

#### 解决方案：
1. **使用真实 macOS 机器**打包
2. **使用 GitHub Actions** - 配置 `.github/workflows/build.yml` 使用 `macos-latest` runner
3. **使用云服务** - MacStadium、AWS EC2 Mac 等

### Linux 打包
```bash
npm run build
npm run electron:build
```

---

## 🔍 打包问题诊断

如果遇到打包问题，运行诊断脚本：
```bash
./diagnose-build.sh
```

---

## 📋 系统要求

- Node.js >= v20
- npm >= v10
- macOS 打包需要 macOS 系统

---

## 📂 打包输出

所有打包文件在 `release/` 目录：
- Windows: `.exe` 安装包
- macOS: `.dmg` 和 `.zip`
- Linux: `.AppImage` 和 `.deb`
