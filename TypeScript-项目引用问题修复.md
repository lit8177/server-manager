# TypeScript 项目引用问题修复

## 问题描述

执行 `npm run build` 后，`dist-electron/` 目录没有被创建，`main.js` 文件不存在，导致 electron-builder 打包失败。

### 错误信息
```
⨯ Application entry file "dist-electron/main.js" in the ".../app.asar" does not exist.
```

## 根本原因

在 `tsconfig.json` 中配置了 **TypeScript 项目引用**（Project References）：

```json
{
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

同时在 `tsconfig.node.json` 中设置了：

```json
{
  "compilerOptions": {
    "composite": true,
    ...
  }
}
```

这种配置启用了 TypeScript 的项目引用模式，要求：
1. 必须使用 `tsc --build` 命令（而不是 `tsc -p`）
2. 依赖项目必须先构建完成
3. 会生成额外的 `.tsbuildinfo` 文件

但我们的构建脚本使用的是：
```json
"build": "tsc && vite build && tsc -p tsconfig.node.json"
```

这导致 `tsc -p tsconfig.node.json` 执行后**没有输出任何文件**，只加载了类型定义但不生成 JavaScript。

## 解决方案

### 1. 移除项目引用配置

**修改 `tsconfig.json`：**
```diff
{
  "compilerOptions": { ... },
-  "include": ["src"],
-  "references": [{ "path": "./tsconfig.node.json" }]
+  "include": ["src"]
}
```

**修改 `tsconfig.node.json`：**
```diff
{
  "compilerOptions": {
-    "composite": true,
    "skipLibCheck": true,
    "module": "CommonJS",
    ...
  }
}
```

### 2. 验证修复

清除旧文件并重新构建：
```bash
rm -rf dist dist-electron release
npm run build
```

检查输出：
```bash
ls -la dist-electron/
# 应该看到：
# database.js
# main.js
# preload.js
```

## 技术说明

### TypeScript 项目引用的作用

项目引用（Project References）是 TypeScript 3.0+ 引入的功能，用于：
- 将大型项目拆分成多个小项目
- 实现增量编译
- 强制模块间的依赖关系

### 为什么我们不需要它

对于我们的 Electron 项目：
1. **前端代码**（`src/`）由 Vite 处理，不需要 TypeScript 编译输出
2. **Electron 主进程**（`electron/`）是独立的编译单元，不依赖前端代码
3. 两者之间通过 IPC 通信，没有直接的代码依赖

因此，使用两个独立的 `tsconfig` 配置就足够了，不需要项目引用的复杂性。

## 最终构建流程

```json
"build": "tsc && vite build && tsc -p tsconfig.node.json"
```

执行顺序：
1. `tsc` - 检查前端类型（noEmit: true，不输出文件）
2. `vite build` - 构建前端代码到 `dist/`
3. `tsc -p tsconfig.node.json` - 编译 Electron 主进程到 `dist-electron/`

## 影响的文件

- ✅ `tsconfig.json` - 移除 references
- ✅ `tsconfig.node.json` - 移除 composite
- ✅ `package.json` - 构建脚本保持不变
- ✅ `.github/workflows/build.yml` - 工作流保持不变

修复后，所有平台的编译都可以正常工作。
