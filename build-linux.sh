#!/bin/bash

echo "========================================"
echo "  Server Manager - Linux 编译脚本"
echo "========================================"
echo ""

echo "⚠️  重要提示："
echo "   当前环境：Linux"
echo "   可编译：Linux AppImage 和 .deb"
echo "   不可编译：Windows .exe 和 macOS .app"
echo ""
echo "   如需编译 Windows 和 macOS 版本，请："
echo "   1. 在对应系统上编译，或"
echo "   2. 使用 GitHub Actions（见 CROSS-PLATFORM-BUILD.md）"
echo ""
echo "========================================"
echo ""

read -p "按 Enter 继续编译 Linux 版本..." dummy

echo "[1/3] 安装依赖..."
npm install || exit 1

echo ""
echo "[2/3] 构建应用..."
npm run build || exit 1

echo ""
echo "[3/3] 打包 Linux 应用..."
npm run electron:build || exit 1

echo ""
echo "========================================"
echo "✅ Linux 版本编译完成！"
echo "========================================"
echo ""
echo "📁 输出文件位置: ./release/"
echo ""
ls -lh release/*.AppImage 2>/dev/null
ls -lh release/*.deb 2>/dev/null
echo ""
echo "🚀 运行方式："
echo "   chmod +x \"release/Server Manager-1.0.0.AppImage\""
echo "   ./\"release/Server Manager-1.0.0.AppImage\""
echo ""
