# GitHub Actions 自动编译所有平台

## 🎯 一次配置，自动编译 Linux + Windows + macOS

---

## 📋 前提条件

1. ✅ 代码已推送到 GitHub 仓库
2. ✅ `.github/workflows/build.yml` 文件已创建（我已经创建好了）

---

## 🚀 使用方法

### **方法 1：手动触发（最简单）**

1. 访问您的 GitHub 仓库
2. 点击顶部的 **Actions** 标签
3. 左侧选择 **Build All Platforms** 工作流
4. 点击右侧的 **Run workflow** 下拉按钮
5. 点击绿色的 **Run workflow** 按钮

✅ **等待 15-20 分钟，所有平台自动编译完成！**

---

### **方法 2：通过 Git 标签触发**

在 ClackyAI 终端或本地执行：

```bash
# 1. 提交所有更改
git add .
git commit -m "Ready for build"
git push

# 2. 打版本标签
git tag v1.0.0
git push origin v1.0.0
```

✅ **自动触发编译，等待 15-20 分钟即可！**

---

## 📦 下载编译结果

### 步骤 1：等待编译完成

访问 GitHub 仓库的 **Actions** 页面，等待三个任务全部显示 ✅ 绿色对勾。

### 步骤 2：下载编译文件

在 Actions 页面：

1. 点击最新的编译任务（Workflow run）
2. 滚动到底部 **Artifacts** 区域
3. 下载三个文件：
   - 📦 `linux-build.zip` - Linux AppImage 和 .deb
   - 📦 `windows-build.zip` - Windows .exe 文件
   - 📦 `macos-build.zip` - macOS .dmg 和 .zip

### 步骤 3：解压并分发

```bash
# 解压下载的文件
unzip linux-build.zip
unzip windows-build.zip
unzip macos-build.zip
```

现在您有了所有平台的安装包！

---

## 📊 编译时间

| 平台 | 编译时间 |
|-----|---------|
| Linux | 5-8 分钟 |
| Windows | 6-10 分钟 |
| macOS | 8-12 分钟 |
| **总计** | **15-20 分钟** |

**注意**：三个平台是**并行编译**的，所以总时间取决于最慢的那个。

---

## 🎁 编译输出文件

### Linux 版本
- ✅ `Server Manager-1.0.0.AppImage` (111 MB)
- ✅ `server-manager_1.0.0_amd64.deb` (100 MB)

### Windows 版本
- ✅ `Server Manager Setup 1.0.0.exe` (安装版, 80 MB)
- ✅ `Server Manager 1.0.0.exe` (便携版, 150 MB)

### macOS 版本
- ✅ `Server Manager-1.0.0.dmg` (90 MB)
- ✅ `Server Manager-1.0.0-mac.zip` (100 MB)

---

## 🔧 配置说明

### 自动触发条件

GitHub Actions 会在以下情况自动编译：

1. **推送版本标签**（如 `v1.0.0`, `v2.0.1`）
2. **手动触发**（在 Actions 页面点击 Run workflow）

### 修改触发条件

如果需要修改，编辑 `.github/workflows/build.yml`：

```yaml
on:
  push:
    tags:
      - 'v*'           # 所有 v 开头的标签
  workflow_dispatch:   # 允许手动触发
  push:
    branches:
      - main           # 或者每次推送到 main 分支时编译
```

---

## ❓ 常见问题

### Q1: 编译失败怎么办？

**答**：
1. 访问 Actions 页面查看具体错误信息
2. 点击失败的任务查看日志
3. 常见问题：
   - 依赖安装失败 → 检查 `package.json`
   - 构建错误 → 检查代码是否有语法错误

### Q2: 可以免费使用吗？

**答**：是的！GitHub 提供：
- **公开仓库**：无限制免费
- **私有仓库**：每月 2000 分钟免费（足够用）

### Q3: Artifacts 保留多久？

**答**：GitHub 默认保留 **90 天**，足够您下载和分发。

### Q4: 可以自动发布到 Release 吗？

**答**：可以！修改 workflow 添加：

```yaml
- name: Create Release
  uses: softprops/action-gh-release@v1
  if: startsWith(github.ref, 'refs/tags/')
  with:
    files: release/*
```

### Q5: 编译速度可以更快吗？

**答**：
- 使用缓存可以加速（我已在配置中包含）
- GitHub 提供的免费 runner 速度已经很快
- 付费的 GitHub Pro 可以使用更快的 runner

---

## 🎯 推荐工作流

### 日常开发
```bash
# 在 ClackyAI 中开发和测试
npm run dev
```

### 发布新版本
```bash
# 1. 在 ClackyAI 中完成开发
git add .
git commit -m "Release v1.0.0"
git push

# 2. 打版本标签
git tag v1.0.0
git push origin v1.0.0

# 3. 等待 GitHub Actions 自动编译（15-20 分钟）

# 4. 从 Actions 页面下载编译好的所有平台安装包

# 5. 分发给用户
```

---

## ✅ 总结

使用 GitHub Actions 的优势：

- ✅ **完全自动化** - 一次配置，永久使用
- ✅ **并行编译** - 同时编译所有平台，节省时间
- ✅ **完全免费** - 公开仓库无限制
- ✅ **无需多系统** - 不需要自己有 Windows/macOS/Linux
- ✅ **稳定可靠** - GitHub 的基础设施保证编译环境一致

---

## 🚀 现在就开始！

### 第一步：推送代码
```bash
git add .
git commit -m "Add GitHub Actions build workflow"
git push
```

### 第二步：手动触发
1. 访问 GitHub 仓库
2. 点击 **Actions**
3. 点击 **Build All Platforms**
4. 点击 **Run workflow**

### 第三步：等待 15-20 分钟

### 第四步：下载所有平台的安装包！

---

**祝编译顺利！🎉**
