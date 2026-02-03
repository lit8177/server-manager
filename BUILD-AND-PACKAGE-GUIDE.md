# 项目打包与执行指南

本文档详细说明如何打包和运行 Server Manager 桌面应用程序。

---

## 📋 目录

- [环境要求](#环境要求)
- [安装依赖](#安装依赖)
- [开发环境运行](#开发环境运行)
- [生产环境打包](#生产环境打包)
- [打包文件说明](#打包文件说明)
- [常见问题](#常见问题)

---

## 🔧 环境要求

在开始之前，请确保您的系统已安装：

- **Node.js**: v18.0.0 或更高版本
- **npm**: v8.0.0 或更高版本
- **操作系统**: 
  - Windows 10/11 (64-bit)
  - macOS 10.13 或更高版本
  - Linux (Ubuntu 18.04+, Debian 10+, Fedora 32+)

### 验证环境

```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version
```

---

## 📦 安装依赖

### 1. 下载或克隆项目代码

```bash
# 如果从 Git 仓库克隆
git clone <your-repository-url>
cd server-manager

# 或者解压下载的 ZIP 文件
unzip server-manager.zip
cd server-manager
```

### 2. 安装所有依赖包

```bash
npm install
```

这将安装所有必需的依赖，包括：
- Electron 运行时
- React 前端框架
- better-sqlite3 数据库
- TypeScript 编译器
- 其他工具链

**安装时间**: 首次安装可能需要 3-5 分钟，请耐心等待。

---

## 🚀 开发环境运行

### 快速启动（推荐）

```bash
npm run dev
```

这个命令会：
1. 启动 Vite 开发服务器（前端热重载）
2. 等待开发服务器就绪
3. 启动 Electron 窗口
4. 自动打开开发者工具

### 分步启动

如果需要分别控制前端和 Electron：

```bash
# 终端 1: 启动前端开发服务器
npx vite

# 终端 2: 启动 Electron（等待终端1启动完成后）
npm run electron:start
```

### 开发模式特性

- ✅ 前端代码热重载（修改代码自动刷新）
- ✅ 自动打开 DevTools
- ✅ 实时日志输出
- ✅ 访问地址: http://localhost:5173

---

## 📦 生产环境打包

### 1. 构建应用

首先编译所有代码：

```bash
npm run build
```

这个命令会：
1. 编译 TypeScript → JavaScript
2. 打包 React 前端 → `dist/` 目录
3. 编译 Electron 主进程 → `dist-electron/` 目录

**构建输出**：
```
dist/               # 前端静态文件
  ├── index.html
  ├── assets/
  │   ├── index-*.js
  │   └── index-*.css

dist-electron/      # Electron 主进程
  ├── main.js
  ├── preload.js
  └── database.js
```

### 2. 打包可执行文件

根据您的目标操作系统选择对应的打包命令：

#### Windows 打包

```bash
npm run electron:build:win
```

**输出文件**：
- `release/Server Manager Setup 1.0.0.exe` - 安装程序（推荐）
- `release/Server Manager 1.0.0.exe` - 便携版（无需安装）

#### macOS 打包

```bash
npm run electron:build:mac
```

**输出文件**：
- `release/Server Manager-1.0.0.dmg` - DMG 安装包
- `release/Server Manager-1.0.0-mac.zip` - ZIP 压缩包

#### Linux 打包

```bash
npm run electron:build
```

**输出文件**：
- `release/Server Manager-1.0.0.AppImage` - AppImage（推荐）
- `release/server-manager_1.0.0_amd64.deb` - Debian/Ubuntu 包

### 3. 全平台打包

```bash
npm run electron:build
```

这将为当前平台打包应用程序。

---

## 📁 打包文件说明

### 打包后的文件结构

```
release/                        # 打包输出目录
├── win-unpacked/              # Windows 未打包文件（用于测试）
├── mac/                       # macOS 未打包文件（用于测试）
├── Server Manager Setup 1.0.0.exe    # Windows 安装程序
├── Server Manager 1.0.0.exe          # Windows 便携版
├── Server Manager-1.0.0.dmg          # macOS DMG
├── Server Manager-1.0.0.AppImage     # Linux AppImage
└── builder-debug.yml          # 构建调试信息
```

### 各平台文件大小（参考）

- Windows 安装包: ~80-100 MB
- Windows 便携版: ~150-180 MB
- macOS DMG: ~90-110 MB
- Linux AppImage: ~100-120 MB

### 安装位置

打包后的应用程序数据存储位置：

| 平台 | 数据库路径 |
|------|-----------|
| **Windows** | `C:\Users\<用户名>\AppData\Roaming\server-manager\data\servers.db` |
| **macOS** | `~/Library/Application Support/server-manager/data/servers.db` |
| **Linux** | `~/.config/server-manager/data/servers.db` |

---

## 🎯 完整打包流程（推荐）

### 一键打包脚本

创建 `build.sh` (Linux/macOS) 或 `build.bat` (Windows)：

**Linux/macOS (build.sh)**:
```bash
#!/bin/bash
echo "🚀 开始打包 Server Manager..."
echo ""

echo "📦 步骤 1/3: 安装依赖..."
npm install

echo ""
echo "🔨 步骤 2/3: 构建应用..."
npm run build

echo ""
echo "📦 步骤 3/3: 打包可执行文件..."
npm run electron:build

echo ""
echo "✅ 打包完成！"
echo "📁 打包文件位置: ./release/"
ls -lh release/
```

**Windows (build.bat)**:
```batch
@echo off
echo 🚀 开始打包 Server Manager...
echo.

echo 📦 步骤 1/3: 安装依赖...
call npm install

echo.
echo 🔨 步骤 2/3: 构建应用...
call npm run build

echo.
echo 📦 步骤 3/3: 打包可执行文件...
call npm run electron:build:win

echo.
echo ✅ 打包完成！
echo 📁 打包文件位置: .\release\
dir release\
```

### 执行打包脚本

```bash
# Linux/macOS
chmod +x build.sh
./build.sh

# Windows
build.bat
```

---

## 🧪 测试打包文件

### 在打包前测试

```bash
# 构建但不打包
npm run build

# 运行构建后的应用
npm run electron:start
```

### 测试未打包的应用

```bash
# Windows
.\release\win-unpacked\Server Manager.exe

# macOS
open ./release/mac/Server Manager.app

# Linux
./release/linux-unpacked/server-manager
```

---

## 🔍 验证数据库功能

打包后验证数据库是否正常工作：

### 使用独立测试脚本

```bash
node test-database.js
```

**预期输出**：
```
🗄️  SQLite 数据库功能测试
================================

✅ 数据库创建成功
✅ 服务器数据插入成功

📊 查询测试结果:
  - 总服务器数: 3
  - 活跃服务器: 2
  - 收藏服务器: 1

✅ IP 更新测试通过
✅ 历史记录功能正常

📈 数据库统计:
  - 数据库文件: test-servers.db
  - 文件大小: 20 KB
  - 总历史记录: 4 条
```

### 在应用中测试

1. 运行打包后的应用
2. 启动服务器发现（自动启动）
3. 等待服务器出现在列表中
4. 关闭应用后重新打开
5. ✅ 验证服务器列表是否保留（数据持久化成功）

---

## 📤 分发打包文件

### 推荐分发方式

1. **GitHub Releases** (推荐)
   - 创建新的 Release
   - 上传打包文件
   - 编写版本说明

2. **云存储**
   - Google Drive / 百度网盘
   - OneDrive / Dropbox

3. **企业内网**
   - 文件服务器
   - 内部下载站

### 提供给用户的安装说明

```markdown
# Server Manager 安装指南

## Windows 用户
1. 下载 `Server Manager Setup 1.0.0.exe`
2. 双击运行安装程序
3. 按照向导完成安装
4. 从开始菜单启动应用

## macOS 用户
1. 下载 `Server Manager-1.0.0.dmg`
2. 双击打开 DMG 文件
3. 拖动应用到 Applications 文件夹
4. 从启动台或应用程序文件夹启动

## Linux 用户
1. 下载 `Server Manager-1.0.0.AppImage`
2. 添加执行权限: `chmod +x Server\ Manager-1.0.0.AppImage`
3. 双击运行或命令行执行: `./Server\ Manager-1.0.0.AppImage`
```

---

## ❓ 常见问题

### Q1: npm install 失败

**问题**: `gyp ERR!` 或 `node-gyp` 错误

**解决方案**:
```bash
# Windows: 安装构建工具
npm install --global windows-build-tools

# macOS: 安装 Xcode Command Line Tools
xcode-select --install

# Linux: 安装构建依赖
sudo apt-get install build-essential  # Ubuntu/Debian
sudo yum groupinstall "Development Tools"  # Fedora/CentOS
```

### Q2: 打包失败 - better-sqlite3 错误

**问题**: `Error: Cannot find module 'better-sqlite3'`

**解决方案**:
```bash
# 重新安装 better-sqlite3
npm rebuild better-sqlite3

# 或完全重新安装
rm -rf node_modules package-lock.json
npm install
```

### Q3: 打包后应用无法启动

**问题**: 双击应用没有反应

**解决方案**:
1. 检查是否有杀毒软件拦截
2. 以管理员身份运行（Windows）
3. 查看日志文件定位问题

**日志位置**:
- Windows: `%APPDATA%\server-manager\logs\`
- macOS: `~/Library/Logs/server-manager/`
- Linux: `~/.config/server-manager/logs/`

### Q4: 数据库文件位置

**问题**: 找不到数据库文件

**解决方案**:
```bash
# 在应用中查看数据库路径
window.electronAPI.getDbStats()  # 在开发者控制台执行

# 或直接访问
# Windows: %APPDATA%\server-manager\data\servers.db
# macOS: ~/Library/Application Support/server-manager/data/
# Linux: ~/.config/server-manager/data/
```

### Q5: 打包文件太大

**问题**: 打包后文件超过 200MB

**解决方案**:
```json
// 在 package.json 中配置 electron-builder
{
  "build": {
    "asar": true,
    "compression": "maximum",
    "files": [
      "dist/**/*",
      "dist-electron/**/*",
      "!**/*.map"
    ]
  }
}
```

### Q6: macOS 提示"应用已损坏"

**问题**: macOS 安全机制阻止运行

**解决方案**:
```bash
# 移除隔离属性
sudo xattr -cr /Applications/Server\ Manager.app

# 或在系统偏好设置中允许
# 系统偏好设置 → 安全性与隐私 → 通用 → 仍要打开
```

### Q7: Linux 无法运行 AppImage

**问题**: AppImage 没有执行权限

**解决方案**:
```bash
# 添加执行权限
chmod +x Server\ Manager-1.0.0.AppImage

# 安装 FUSE（如果需要）
sudo apt install libfuse2  # Ubuntu 22.04+
```

---

## 🔄 更新和维护

### 版本更新流程

1. **更新版本号**
   ```bash
   # 修改 package.json 中的 version 字段
   # "version": "1.0.1"
   ```

2. **重新打包**
   ```bash
   npm run build
   npm run electron:build
   ```

3. **测试新版本**
   ```bash
   # 安装并测试打包后的应用
   ```

4. **发布**
   - 上传到 GitHub Releases
   - 更新下载链接
   - 通知用户更新

### 自动更新配置

如需实现应用内自动更新，可以配置 `electron-updater`：

```json
// package.json
{
  "build": {
    "publish": [
      {
        "provider": "github",
        "owner": "your-username",
        "repo": "server-manager"
      }
    ]
  }
}
```

---

## 📚 更多资源

- [Electron 官方文档](https://www.electronjs.org/docs)
- [electron-builder 文档](https://www.electron.build/)
- [项目 README](./README.md)
- [数据库使用指南](./DATABASE-GUIDE.md)
- [SQLite 集成报告](./SQLITE-INTEGRATION.md)

---

## 💡 最佳实践

### 开发阶段
- ✅ 使用 `npm run dev` 进行开发
- ✅ 频繁测试数据库功能
- ✅ 使用 Git 管理代码版本

### 打包阶段
- ✅ 先执行 `npm run build` 验证构建
- ✅ 测试未打包的应用 (`win-unpacked` 等)
- ✅ 在目标平台上测试打包后的应用

### 分发阶段
- ✅ 提供详细的安装说明
- ✅ 包含系统要求说明
- ✅ 提供技术支持联系方式

---

## 📞 技术支持

如果遇到其他问题：

1. 查看项目 [README.md](./README.md)
2. 查看 [Issues](https://github.com/your-repo/issues)
3. 联系开发团队

---

**祝您打包顺利！🎉**
