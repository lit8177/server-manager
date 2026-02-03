# ⚠️ Windows 本地编译重要提示

## 🚫 不推荐在 Windows 本地编译

由于 `better-sqlite3` 是原生 C++ 模块，在 Windows 上从源码编译经常遇到问题：

- ❌ node-gyp 编译卡死
- ❌ 需要安装 Visual Studio Build Tools（几 GB）
- ❌ 需要配置 Python 环境
- ❌ 环境变量配置复杂
- ❌ 编译时间长且易出错

---

## ✅ 推荐方案：GitHub Actions

**最佳实践**：将代码推送到 GitHub，让 GitHub Actions 自动编译。

### 为什么推荐 GitHub Actions？

1. ✅ **真实的 Windows 环境**：GitHub 提供原生 Windows Server
2. ✅ **自动处理依赖**：已配置所有必要的构建工具
3. ✅ **并行编译三个平台**：Windows + macOS + Linux 同时进行
4. ✅ **无需本地构建工具**：不占用本地磁盘和时间
5. ✅ **可重复构建**：每次构建环境一致

### 操作步骤（5 分钟）

```bash
# 1. 推送代码到 GitHub
git add .
git commit -m "准备发布 v1.0.4"
git push origin main

# 2. 创建版本标签（触发自动编译）
git tag v1.0.4
git push origin v1.0.4

# 3. 等待 10-15 分钟，查看进度
# 访问：https://github.com/你的用户名/server-manager/actions

# 4. 下载编译结果
# 在 Actions 页面底部找到 Artifacts，下载 windows-build
```

---

## 🔧 如果必须在本地 Windows 编译

### 前提条件

1. **安装 Visual Studio Build Tools**
   - 下载：https://visualstudio.microsoft.com/downloads/
   - 选择 "Desktop development with C++"
   - 大小：约 6-8 GB

2. **安装 Python**
   - 版本：3.8 - 3.11
   - 下载：https://www.python.org/downloads/

3. **配置环境变量**
   ```bash
   npm config set msvs_version 2022
   npm config set python "C:\Python311\python.exe"
   ```

### 本地编译步骤

```bash
# 1. 确认 .npmrc 配置正确
cat .npmrc
# 应该包含：
# build-from-source=false
# node_gyp=false

# 2. 清理环境
rm -rf node_modules package-lock.json
npm cache clean --force

# 3. 安装依赖（强制使用预构建二进制）
npm install --prefer-offline --no-audit --legacy-peer-deps

# 4. 如果步骤 3 卡住，按 Ctrl+C 停止，然后：
npm install --ignore-scripts

# 5. 构建应用代码
npm run build

# 6. 打包（只打包当前平台）
npx electron-builder --win --x64
```

---

## 🐛 常见问题

### 问题 1：npm install 卡在 node-gyp

**解决**：

```bash
# 方法 1：完全跳过编译
npm install --ignore-scripts --prefer-offline

# 方法 2：使用镜像源（中国用户）
npm config set registry https://registry.npmmirror.com
npm config set better_sqlite3_binary_host_mirror https://npmmirror.com/mirrors/better-sqlite3
npm install
```

### 问题 2：找不到 Python

**解决**：

```bash
# 查看当前配置
npm config get python

# 手动指定 Python 路径
npm config set python "C:\Python311\python.exe"

# 或使用 pyenv-win（如果已安装）
npm config set python "C:\Users\你的用户名\.pyenv\pyenv-win\versions\3.11.0\python.exe"
```

### 问题 3：MSBuild 错误

**错误信息**：
```
error MSB8036: The Windows SDK version X.X was not found
```

**解决**：
1. 打开 Visual Studio Installer
2. 选择 "Modify"
3. 勾选 "Windows 10 SDK" 或 "Windows 11 SDK"
4. 点击 "Install"

### 问题 4：打包后运行报错

**错误信息**：
```
Cannot find module 'better_sqlite3.node'
```

**原因**：原生模块被打包进 asar

**解决**：检查 `package.json` 中的 `asarUnpack` 配置：

```json
{
  "build": {
    "asarUnpack": [
      "node_modules/better-sqlite3/**/*"
    ]
  }
}
```

---

## 📊 编译方式对比

| 方式 | 时间 | 难度 | 成功率 | 推荐度 |
|------|------|------|--------|--------|
| GitHub Actions | 10-15分钟 | ⭐ 简单 | 99% | ⭐⭐⭐⭐⭐ |
| 本地 Windows 编译 | 30-60分钟 | ⭐⭐⭐⭐ 困难 | 60% | ⭐⭐ |
| WSL2 编译 | 20-40分钟 | ⭐⭐⭐ 中等 | 75% | ⭐⭐⭐ |

---

## 🎯 推荐工作流程

### 开发阶段（本地）

```bash
# 使用开发模式，无需编译
npm run dev
```

### 测试阶段（本地可选）

```bash
# 只构建代码，不打包
npm run build

# 用 electron 直接运行
npm run electron:start
```

### 发布阶段（GitHub Actions）

```bash
# 推送到 GitHub
git push origin main

# 创建版本标签
git tag v1.0.4
git push origin v1.0.4

# 等待自动编译完成
# 下载三个平台的安装包
```

---

## ✅ 检查清单

在尝试本地 Windows 编译之前：

- [ ] 是否真的需要本地编译？（开发模式通常就够了）
- [ ] 是否已安装 Visual Studio Build Tools？
- [ ] 是否已安装 Python 3.8-3.11？
- [ ] 是否配置了正确的 .npmrc？
- [ ] 是否清理了旧的 node_modules？
- [ ] 网络是否稳定（需要下载预构建二进制）？

如果以上任何一项回答"否"，**强烈建议使用 GitHub Actions**！

---

## 📚 相关文档

- `快速修复-Windows编译卡死.md` - 3 步快速修复指南
- `Windows-node-gyp-编译卡死修复.md` - 完整技术文档
- `GitHub-Actions-编译指南.md` - GitHub Actions 详细说明

---

**重要提醒**：除非有特殊需求，否则**不要在 Windows 本地编译 Electron 应用**。GitHub Actions 是更好的选择！🚀
