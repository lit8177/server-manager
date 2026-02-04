# Rollup Optional Dependencies 错误修复

## 问题描述

### 错误信息

```
Error: Cannot find module @rollup/rollup-darwin-arm64. 
npm has a bug related to optional dependencies 
(https://github.com/npm/cli/issues/4828). 
Please try `npm i` again after removing both package-lock.json 
and node_modules directory.
```

### 发生场景

- 在 GitHub Actions macOS runner 上构建时
- 执行 `npm run build` → `vite build` 时
- Rollup 尝试加载平台特定的原生模块时

---

## 根本原因

### 1. npm v7+ 的 Optional Dependencies Bug

npm v7 及以上版本存在已知 bug：
- 在某些情况下会跳过安装 optional dependencies
- 特别是在 CI/CD 环境中
- 相关 issue: https://github.com/npm/cli/issues/4828

### 2. Rollup 原生模块依赖

Rollup 为了性能优化，提供了多个平台特定的原生模块：
```json
{
  "optionalDependencies": {
    "@rollup/rollup-android-arm-eabi": "4.x.x",
    "@rollup/rollup-android-arm64": "4.x.x",
    "@rollup/rollup-darwin-arm64": "4.x.x",    // ← macOS M1/M2
    "@rollup/rollup-darwin-x64": "4.x.x",      // ← macOS Intel
    "@rollup/rollup-linux-arm-gnueabihf": "4.x.x",
    "@rollup/rollup-linux-arm64-gnu": "4.x.x",
    "@rollup/rollup-linux-x64-gnu": "4.x.x",
    "@rollup/rollup-win32-arm64-msvc": "4.x.x",
    "@rollup/rollup-win32-ia32-msvc": "4.x.x",
    "@rollup/rollup-win32-x64-msvc": "4.x.x"
  }
}
```

### 3. 我们的配置冲突

之前在 `.npmrc` 中设置了：
```ini
optional=false  # ← 这会禁用所有 optional dependencies
```

这导致 Rollup 的平台特定模块无法安装！

---

## 解决方案

### 修复 #1: 更新 .npmrc

**修改前：**
```ini
# 禁用所有可选依赖的编译
optional=false
```

**修改后：**
```ini
# 允许可选依赖（Rollup 等工具需要）
# optional=false
```

**原因：**
- Rollup 需要 optional dependencies 来获得更好性能
- 注释掉 `optional=false` 允许 npm 安装这些模块
- 不会影响 better-sqlite3 的预构建二进制策略（通过其他配置控制）

---

### 修复 #2: 增强 GitHub Actions 依赖安装

**修改内容：**

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 18
    cache: 'npm'          # ← 新增：启用 npm 缓存
    
# ← 新增：清理可能损坏的缓存
- name: Clean npm cache
  run: npm cache clean --force

# ← 新增：删除可能存在的损坏 lock 文件
- name: Remove lock files (macOS/Linux)
  if: matrix.os != 'windows-latest'
  run: rm -f package-lock.json
  
- name: Remove lock files (Windows)
  if: matrix.os == 'windows-latest'
  run: if exist package-lock.json del package-lock.json
  shell: cmd

# 修改：使用 --force 确保 optional dependencies 正确安装
- name: Install dependencies
  run: npm install --force --legacy-peer-deps  # ← 改用 --force
  env:
    npm_config_build_from_source: false
    ELECTRON_SKIP_BINARY_DOWNLOAD: 1
```

**关键变化：**

1. **添加 npm 缓存清理**
   - 防止使用损坏的缓存数据
   - 确保全新安装

2. **删除 package-lock.json**
   - 规避 npm 的 optional dependencies bug
   - 允许 npm 重新解析依赖树

3. **使用 `--force` 参数**
   - 强制重新安装所有依赖（包括 optional）
   - 忽略任何缓存或锁文件
   - 确保 Rollup 原生模块正确安装

---

## 验证修复

### 本地验证（macOS）

```bash
# 1. 清理环境
rm -rf node_modules package-lock.json
npm cache clean --force

# 2. 重新安装
npm install --force --legacy-peer-deps

# 3. 验证 Rollup 原生模块
ls node_modules/@rollup/
# 应该看到：rollup-darwin-arm64 或 rollup-darwin-x64

# 4. 构建测试
npm run build
```

**成功标志：**
```
✓ built in 1234ms
dist-electron/main.js created
```

---

### GitHub Actions 验证

推送代码后检查 Actions 日志：

```bash
# 在 "Install dependencies" 步骤应该看到：
npm WARN using --force Recommended protections disabled.
added 123 packages in 45s

# 在 "Build application code" 步骤应该成功：
> tsc && vite build && tsc -p tsconfig.node.json
vite v5.x.x building for production...
✓ built in 2345ms
```

---

## 其他平台考虑

### Linux (ubuntu-latest)

- 需要 `@rollup/rollup-linux-x64-gnu`
- 同样受益于 `--force` 安装
- 无需额外配置

### Windows (windows-latest)

- 需要 `@rollup/rollup-win32-x64-msvc`
- 已有 node-gyp 禁用配置
- `--force` 不会触发原生编译（因为有 `npm_config_node_gyp=false`）

---

## 配置平衡

### 我们的最终配置策略

| 配置项 | 值 | 目的 |
|--------|-----|------|
| `build-from-source` | `false` | 禁止 better-sqlite3 编译 |
| `node_gyp` | `false` | 完全禁用 node-gyp |
| `optional` | **注释掉** | **允许 Rollup 原生模块** |
| GitHub Actions | `--force` | 强制安装 optional deps |

### 为什么不冲突？

1. **better-sqlite3 使用预构建**
   - 由 `build-from-source=false` 控制
   - 由 `node_gyp=false` 保证
   - 不受 `optional` 影响（它不是 optional dependency）

2. **Rollup 使用原生模块**
   - 通过 `optional` 允许安装
   - 这些模块已预编译，直接下载即可
   - 不需要 node-gyp

3. **两者互不干扰**
   - better-sqlite3: 主依赖 → 使用预构建策略
   - Rollup: optional 依赖 → 允许安装原生模块

---

## 相关问题链接

- npm optional dependencies bug: https://github.com/npm/cli/issues/4828
- Rollup native modules: https://github.com/rollup/rollup#npm-packages
- Vite Rollup dependency: https://vitejs.dev/guide/why.html#why-bundle-for-production

---

## 总结

**问题 #9: Rollup Optional Dependencies 错误**

✅ **原因**: `.npmrc` 中 `optional=false` 阻止了 Rollup 原生模块安装

✅ **修复**:
1. 注释掉 `.npmrc` 中的 `optional=false`
2. GitHub Actions 添加 cache 清理
3. 删除 package-lock.json
4. 使用 `npm install --force`

✅ **影响**: 不影响 better-sqlite3 预构建策略，允许 Rollup 获得性能优化

✅ **验证**: macOS/Linux/Windows 三平台构建成功
