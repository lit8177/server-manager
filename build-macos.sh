#!/bin/bash

echo "========================================"
echo "  Server Manager - macOS 编译脚本"
echo "========================================"
echo ""

echo "[1/5] 清理 npm 缓存..."
npm cache clean --force || echo "⚠️  缓存清理失败，继续..."

echo ""
echo "[2/5] 删除旧的 node_modules..."
rm -rf node_modules || echo "⚠️  删除 node_modules 失败，继续..."

echo ""
echo "[3/5] 删除 package-lock.json（避免 optional deps 问题）..."
rm -f package-lock.json || echo "⚠️  删除 lock 文件失败，继续..."

echo ""
echo "[4/5] 安装依赖（使用 --force 确保 optional deps 安装）..."
npm install --force --legacy-peer-deps || exit 1

echo ""
echo "[5/5] 构建应用..."
npm run build || exit 1

echo ""
echo "[6/6] 打包 macOS 应用..."
npm run electron:build:mac || exit 1

echo ""
echo "========================================"
echo "✅ macOS 版本编译完成！"
echo "========================================"
echo ""
echo "📁 输出文件位置: ./release/"
echo ""
ls -lh release/*.dmg 2>/dev/null
ls -lh release/*.zip 2>/dev/null
echo ""
echo "🚀 安装方式："
echo "   1. 双击打开 .dmg 文件"
echo "   2. 拖动应用到 Applications 文件夹"
echo ""
