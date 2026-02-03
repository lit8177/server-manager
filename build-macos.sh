#!/bin/bash

echo "========================================"
echo "  Server Manager - macOS 编译脚本"
echo "========================================"
echo ""

echo "[1/3] 安装依赖..."
npm install || exit 1

echo ""
echo "[2/3] 构建应用..."
npm run build || exit 1

echo ""
echo "[3/3] 打包 macOS 应用..."
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
