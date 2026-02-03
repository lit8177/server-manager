# 快速修复：Windows node-gyp 卡死问题

## 🚨 问题

Windows 上 `npm install` 卡在 better-sqlite3 编译：

```
npm error gyp info spawn args 'build/binding.sln',
npm error ^C
Terminate batch job (Y/N)?
```

---

## ✅ 快速解决（3 步）

### 第 1 步：检查 .npmrc 文件

确认项目根目录的 `.npmrc` 包含以下内容：

```ini
build-from-source=false
node_gyp=false
better_sqlite3_binary_host_mirror=https://github.com/WiseLibs/better-sqlite3/releases/download/
```

### 第 2 步：清理并重新安装

```bash
# Windows CMD
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install --prefer-offline --no-audit

# PowerShell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm cache clean --force
npm install --prefer-offline --no-audit

# Git Bash (Windows)
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --prefer-offline --no-audit
```

### 第 3 步：验证安装成功

```bash
# 测试 better-sqlite3 是否正确加载
node -e "console.log(require('better-sqlite3'))"
```

应该看到函数定义输出，而不是错误。

---

## 📝 如果还是卡住

### 方法 1：使用淘宝镜像（中国用户）

修改 `.npmrc`：

```ini
better_sqlite3_binary_host_mirror=https://npmmirror.com/mirrors/better-sqlite3
registry=https://registry.npmmirror.com
```

### 方法 2：手动下载预构建二进制

1. 访问：https://github.com/WiseLibs/better-sqlite3/releases
2. 下载对应版本（例如 v12.6.2）
3. 将 `.node` 文件放到 `node_modules/better-sqlite3/build/Release/`

### 方法 3：跳过 better-sqlite3（临时）

如果只是想测试其他功能：

```bash
npm install --omit=optional --ignore-scripts
```

然后手动注释掉代码中使用 database 的部分。

---

## 🎯 GitHub Actions 自动编译（推荐）

**不要在本地 Windows 编译！** 让 GitHub Actions 自动完成：

1. 推送代码到 GitHub
2. 创建版本标签：
   ```bash
   git tag v1.0.4
   git push origin v1.0.4
   ```
3. 等待 10-15 分钟
4. 从 GitHub Actions 下载编译好的 `.exe` 文件

GitHub Actions 已经配置好所有环境变量，不会遇到编译问题。

---

## ✅ 验证清单

安装成功的标志：

- [x] 没有看到 `gyp info spawn` 相关日志
- [x] 看到 `[better-sqlite3] Success: installed via prebuild-install`
- [x] `node_modules/better-sqlite3/build/Release/better_sqlite3.node` 文件存在
- [x] `npm run dev` 可以正常启动应用

---

## 🔗 详细文档

完整技术细节请参考：`Windows-node-gyp-编译卡死修复.md`

---

**快速总结**：使用预构建二进制（.npmrc 配置），完全跳过 node-gyp 编译！
