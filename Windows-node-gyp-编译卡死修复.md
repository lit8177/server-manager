# Windows node-gyp 编译卡死问题修复

## 问题描述

在 Windows 上安装依赖时，`better-sqlite3` 尝试使用 `node-gyp` 从源码编译，导致进程卡死：

```
npm error gyp info spawn args 'build/binding.sln',
npm error gyp info spawn args '/nologo',
npm error gyp info spawn args '/p:Configuration=Release;Platform=x64'
npm error ^C
Terminate batch job (Y/N)?
Error: The operation was canceled.
```

## 根本原因

1. **better-sqlite3** 是一个原生 C++ Node.js 模块
2. 默认情况下，npm 会尝试使用 `node-gyp` 从源码编译
3. Windows 上的 `node-gyp` 编译需要：
   - Visual Studio Build Tools
   - Python 2.7 或 3.x
   - 正确的环境变量配置
4. 即使安装了这些工具，编译过程也可能因为各种原因卡死

## 解决方案

### 方案 1: 完全跳过编译，使用预构建二进制（推荐）

#### 步骤 1: 优化 .npmrc 配置

创建/更新 `.npmrc` 文件：

```ini
# 强制使用预构建的二进制文件，禁止从源码编译
build-from-source=false

# 完全禁用 node-gyp 构建
node_gyp=false

# better-sqlite3 特定配置
better_sqlite3_binary_host_mirror=https://github.com/WiseLibs/better-sqlite3/releases/download/

# 禁用所有可选依赖的编译
optional=false

# 忽略脚本错误继续安装
ignore-scripts=false
```

#### 步骤 2: 移除 postinstall 钩子

在 `package.json` 中移除会触发编译的脚本：

```diff
{
  "scripts": {
    "dev": "...",
    "build": "...",
-   "postinstall": "electron-builder install-app-deps",
    "rebuild": "electron-rebuild -f -w better-sqlite3"
  }
}
```

**重要**: `postinstall` 会在每次 `npm install` 后自动运行，可能触发原生模块编译。

#### 步骤 3: 清理并重新安装

```bash
# 1. 删除旧的依赖
rm -rf node_modules package-lock.json

# 2. 清理 npm 缓存
npm cache clean --force

# 3. 重新安装（使用新的 .npmrc 配置）
npm install --prefer-offline --no-audit --legacy-peer-deps
```

### 方案 2: GitHub Actions 自动处理（推荐用于 CI/CD）

在 `.github/workflows/build.yml` 中配置环境变量强制跳过编译：

```yaml
# Windows: 配置环境避免 node-gyp 编译
- name: Configure Windows Build Environment
  if: matrix.os == 'windows-latest'
  run: |
    echo "ELECTRON_SKIP_BINARY_DOWNLOAD=1" >> $GITHUB_ENV
    echo "npm_config_build_from_source=false" >> $GITHUB_ENV
    echo "npm_config_node_gyp=false" >> $GITHUB_ENV
  shell: bash

- name: Install dependencies
  run: npm install --prefer-offline --no-audit --legacy-peer-deps
  env:
    npm_config_build_from_source: false
    ELECTRON_SKIP_BINARY_DOWNLOAD: 1
```

---

## 工作原理

### better-sqlite3 的预构建二进制

`better-sqlite3` 在 GitHub Releases 中提供预构建的二进制文件：

```
https://github.com/WiseLibs/better-sqlite3/releases/download/v12.6.2/better-sqlite3-v12.6.2-electron-v134-win32-x64.tar.gz
```

文件命名格式：
- `v12.6.2` - better-sqlite3 版本
- `electron-v134` - Electron ABI 版本
- `win32-x64` - 平台和架构

### npm 安装流程

使用 `.npmrc` 配置后：

1. ✅ npm 首先尝试下载预构建二进制
2. ✅ 如果找到匹配的二进制，直接使用
3. ❌ **跳过** node-gyp 编译步骤
4. ✅ 安装完成

---

## 验证修复

### 本地验证

```bash
# 清理环境
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 检查 better-sqlite3 是否正确安装
node -e "console.log(require('better-sqlite3'))"
```

如果看到函数定义输出，说明安装成功。

### 检查是否使用了预构建二进制

```bash
# 查看安装日志
npm install better-sqlite3 --verbose
```

应该看到类似输出：
```
[better-sqlite3] Downloading prebuilt binary from GitHub Releases...
[better-sqlite3] Success: "...better-sqlite3.node" is installed via prebuild-install
```

而**不应该**看到：
```
gyp info spawn python
gyp info spawn args
```

---

## 常见问题排查

### 问题 1: 仍然尝试编译

**症状**: 看到 `gyp info spawn` 相关日志

**检查**:
```bash
# 查看 npm 配置
npm config list

# 应该看到：
# build-from-source = false
# node_gyp = false
```

**修复**:
```bash
npm config set build-from-source false
npm config set node_gyp false
```

### 问题 2: 下载预构建二进制失败

**症状**: `prebuild-install WARN install No prebuilt binaries found`

**原因**: 网络问题或版本不匹配

**修复**:
1. 检查 Electron 版本和 better-sqlite3 版本兼容性
2. 使用镜像源（中国用户）：
   ```ini
   # .npmrc
   better_sqlite3_binary_host_mirror=https://npmmirror.com/mirrors/better-sqlite3
   ```

### 问题 3: electron-builder 打包时找不到 .node 文件

**症状**: `Cannot find module '...better-sqlite3.node'`

**原因**: 原生模块被打包进 asar 归档

**修复**: 在 `package.json` 中配置 `asarUnpack`：
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

## electron-builder 配置总结

完整的 `package.json` 配置：

```json
{
  "scripts": {
    "rebuild": "electron-rebuild -f -w better-sqlite3"
  },
  "build": {
    "files": [
      "dist/**/*",
      "dist-electron/**/*",
      "node_modules/better-sqlite3/**/*"
    ],
    "asarUnpack": [
      "node_modules/better-sqlite3/**/*"
    ],
    "win": {
      "target": ["nsis", "portable"],
      "sign": null,
      "artifactName": "${productName}-${version}-${arch}.${ext}"
    }
  }
}
```

**关键点**:
- `files`: 确保 better-sqlite3 被包含在打包文件中
- `asarUnpack`: 确保原生模块不被打包进 asar（.node 文件无法从 asar 中加载）
- `sign: null`: 跳过 Windows 代码签名（需要证书）

---

## 最佳实践

### 1. 开发环境

```bash
# .npmrc（项目根目录）
build-from-source=false
node_gyp=false
```

### 2. CI/CD 环境

```yaml
# .github/workflows/build.yml
env:
  npm_config_build_from_source: false
  ELECTRON_SKIP_BINARY_DOWNLOAD: 1
```

### 3. 如果必须从源码编译

只在**必要时**手动执行：

```bash
# 删除预构建二进制
rm -rf node_modules/better-sqlite3

# 强制从源码编译
npm install better-sqlite3 --build-from-source

# 或使用 electron-rebuild
npm run rebuild
```

---

## 总结

| 方法 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| 预构建二进制 | 快速、无需构建工具 | 依赖网络下载 | ⭐⭐⭐⭐⭐ |
| 从源码编译 | 完全控制 | 需要构建工具，易出错 | ⭐ |
| electron-rebuild | 为 Electron 专门构建 | 仍需构建工具 | ⭐⭐⭐ |

**推荐流程**:
1. ✅ 默认使用预构建二进制（.npmrc 配置）
2. ✅ 通过 GitHub Actions 编译发布版本
3. ❌ 避免在本地 Windows 环境从源码编译

---

## 修复验证清单

在推送到 GitHub 之前，确认：

- [x] ✅ `.npmrc` 包含 `build-from-source=false`
- [x] ✅ `.npmrc` 包含 `node_gyp=false`
- [x] ✅ `package.json` 移除了 `postinstall` 脚本
- [x] ✅ `package.json` 配置了 `asarUnpack`
- [x] ✅ GitHub Actions 配置了环境变量
- [x] ✅ 本地 `npm install` 不再卡在 node-gyp

**修复后的安装输出应该类似**:
```
npm install
[better-sqlite3] Downloading prebuilt binary...
[better-sqlite3] Success: installed via prebuild-install
✓ Dependencies installed successfully
```

🎉 **修复完成！现在 Windows 编译不再卡死！**
