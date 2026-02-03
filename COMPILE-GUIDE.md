# 编译成 Windows EXE 和 macOS APP 的完整指南

## 🎯 快速编译（3步完成）

### **步骤 1：安装依赖**
```bash
npm install
```
⏱️ 耗时：3-5 分钟（首次安装）

---

### **步骤 2：编译 Windows EXE**
```bash
npm run electron:build:win
```

**输出文件**（在 `release/` 目录）：
- ✅ `Server Manager Setup 1.0.0.exe` - **安装版**（推荐分发）
- ✅ `Server Manager 1.0.0.exe` - **便携版**（无需安装，双击即用）

⏱️ 耗时：2-3 分钟
📦 文件大小：80-100 MB（安装包）

---

### **步骤 3：编译 macOS APP**
```bash
npm run electron:build:mac
```

**输出文件**（在 `release/` 目录）：
- ✅ `Server Manager-1.0.0.dmg` - **DMG 安装包**（推荐分发）
- ✅ `Server Manager-1.0.0-mac.zip` - **ZIP 压缩包**

⏱️ 耗时：2-3 分钟
📦 文件大小：90-110 MB

---

## 📁 编译后的文件位置

```
release/
├── Server Manager Setup 1.0.0.exe      ← Windows 安装包
├── Server Manager 1.0.0.exe            ← Windows 便携版
├── Server Manager-1.0.0.dmg            ← macOS DMG
├── Server Manager-1.0.0-mac.zip        ← macOS ZIP
└── win-unpacked/                       ← Windows 未打包版（测试用）
```

---

## 🖥️ 不同操作系统编译说明

### **情况 1：在 Windows 上编译**
✅ 可以编译 Windows EXE
❌ **不能**编译 macOS APP（需要 macOS 系统）

```bash
# Windows 上只能这样编译
npm run electron:build:win
```

---

### **情况 2：在 macOS 上编译**
✅ 可以编译 macOS APP
✅ 可以编译 Windows EXE（通过 wine）

```bash
# macOS 上编译 Mac 版本
npm run electron:build:mac

# macOS 上编译 Windows 版本
npm run electron:build:win
```

---

### **情况 3：在 Linux 上编译**
✅ 可以编译 Linux AppImage
✅ 可以编译 Windows EXE（通过 wine）
⚠️ 编译 macOS 需要额外配置

```bash
# Linux 上编译 Windows 版本
npm run electron:build:win

# Linux 上编译 Linux 版本
npm run electron:build
```

---

## 🔥 一键编译脚本（推荐）

### **Windows 用户 - 创建 `build.bat`**

创建文件 `build.bat`，内容如下：

```batch
@echo off
echo ================================
echo   Server Manager 编译脚本
echo ================================
echo.

echo [1/3] 安装依赖...
call npm install
if errorlevel 1 goto error

echo.
echo [2/3] 构建应用...
call npm run build
if errorlevel 1 goto error

echo.
echo [3/3] 打包 Windows EXE...
call npm run electron:build:win
if errorlevel 1 goto error

echo.
echo ================================
echo ✅ 编译完成！
echo ================================
echo.
echo 📁 输出目录: .\release\
echo.
dir release\*.exe
echo.
pause
goto end

:error
echo.
echo ❌ 编译失败！请检查错误信息
pause

:end
```

**使用方法**：
```bash
# 双击运行或命令行执行
build.bat
```

---

### **macOS/Linux 用户 - 创建 `build.sh`**

创建文件 `build.sh`，内容如下：

```bash
#!/bin/bash

echo "================================"
echo "  Server Manager 编译脚本"
echo "================================"
echo ""

echo "[1/3] 安装依赖..."
npm install || exit 1

echo ""
echo "[2/3] 构建应用..."
npm run build || exit 1

echo ""
echo "[3/3] 打包应用..."
npm run electron:build:mac || exit 1

echo ""
echo "================================"
echo "✅ 编译完成！"
echo "================================"
echo ""
echo "📁 输出目录: ./release/"
ls -lh release/*.dmg release/*.zip 2>/dev/null
echo ""
```

**使用方法**：
```bash
# 添加执行权限
chmod +x build.sh

# 运行脚本
./build.sh
```

---

## 🧪 编译前测试

在正式打包前，先测试构建是否成功：

```bash
# 1. 安装依赖
npm install

# 2. 构建项目
npm run build

# 3. 测试运行（不打包）
npm run electron:start
```

如果窗口正常打开，说明构建成功，可以继续打包！

---

## 📤 分发给用户

### **Windows 用户安装方法**
1. 下载 `Server Manager Setup 1.0.0.exe`
2. 双击安装程序
3. 按提示完成安装
4. 从开始菜单启动应用

### **Windows 便携版使用方法**
1. 下载 `Server Manager 1.0.0.exe`
2. 直接双击运行（无需安装）
3. 可以放在 U 盘随身携带

### **macOS 用户安装方法**
1. 下载 `Server Manager-1.0.0.dmg`
2. 双击打开 DMG
3. 拖动到 Applications（应用程序）文件夹
4. 从启动台或 Finder 启动

如果遇到"无法打开"提示：
```bash
sudo xattr -cr /Applications/Server\ Manager.app
```

---

## ⚠️ 常见问题

### ❌ 问题 1：`npm install` 失败

**错误信息**：`gyp ERR!` 或 `node-gyp` 相关错误

**解决方法**：

**Windows**:
```bash
# 以管理员身份运行 PowerShell
npm install --global windows-build-tools
```

**macOS**:
```bash
xcode-select --install
```

**Linux**:
```bash
sudo apt-get install build-essential
```

---

### ❌ 问题 2：打包时出现 `better-sqlite3` 错误

**错误信息**：`Error: Cannot find module 'better-sqlite3'`

**解决方法**：
```bash
# 重新编译 better-sqlite3
npm rebuild better-sqlite3

# 如果还不行，删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ 问题 3：打包后的 exe 无法运行

**可能原因**：杀毒软件拦截

**解决方法**：
1. 检查杀毒软件是否拦截
2. 添加到白名单
3. 或以管理员身份运行

---

### ❌ 问题 4：macOS 提示"应用已损坏"

**错误信息**：应用程序"Server Manager"已损坏，无法打开

**解决方法**：
```bash
# 移除隔离属性
sudo xattr -cr /Applications/Server\ Manager.app
```

或者：
```
系统偏好设置 → 安全性与隐私 → 通用 → 点击"仍要打开"
```

---

### ❌ 问题 5：跨平台编译 macOS 失败

**在 Windows/Linux 上编译 macOS 需要额外配置**

**不推荐跨平台编译 macOS**，建议：
- 在 macOS 上编译 macOS 版本
- 或使用 CI/CD 服务（GitHub Actions）自动编译

---

## 🚀 高级：使用 GitHub Actions 自动编译

如果需要同时编译多个平台，可以使用 GitHub Actions：

创建 `.github/workflows/build.yml`：

```yaml
name: Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm install
      - run: npm run electron:build

      - uses: actions/upload-artifact@v3
        with:
          name: release-${{ matrix.os }}
          path: release/
```

**使用方法**：
```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub 会自动编译所有平台的安装包！

---

## 📊 编译时间参考

| 操作 | 时间 |
|------|------|
| `npm install` (首次) | 3-5 分钟 |
| `npm run build` | 30-60 秒 |
| `electron:build:win` | 2-3 分钟 |
| `electron:build:mac` | 2-3 分钟 |
| **总计（首次）** | **约 8-12 分钟** |
| **总计（后续）** | **约 3-5 分钟** |

---

## ✅ 编译完成检查清单

- [ ] `release/` 目录存在
- [ ] Windows: `Server Manager Setup 1.0.0.exe` 文件存在
- [ ] macOS: `Server Manager-1.0.0.dmg` 文件存在
- [ ] 文件大小在 80-120 MB 范围内
- [ ] 双击测试是否能正常运行
- [ ] 数据库功能是否正常（重启后数据保留）

---

## 📞 需要帮助？

如果编译过程中遇到问题：

1. 查看控制台错误信息
2. 检查 Node.js 版本是否符合要求（v18+）
3. 确保网络连接正常（下载依赖需要）
4. 查看 [electron-builder 文档](https://www.electron.build/)

---

**祝编译顺利！🎉**
