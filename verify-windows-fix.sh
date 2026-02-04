#!/bin/bash

# Windows node-gyp 编译卡死问题 - 验证修复脚本

echo "======================================"
echo "Windows 编译问题修复验证"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success_count=0
fail_count=0

# 检查 1: .npmrc 文件
echo "1️⃣  检查 .npmrc 配置..."
if [ -f ".npmrc" ]; then
    if grep -q "build-from-source=false" .npmrc && grep -q "node_gyp=false" .npmrc; then
        echo -e "${GREEN}✅ .npmrc 配置正确${NC}"
        success_count=$((success_count+1))
    else
        echo -e "${RED}❌ .npmrc 配置不完整${NC}"
        echo "   应该包含:"
        echo "   - build-from-source=false"
        echo "   - node_gyp=false"
        fail_count=$((fail_count+1))
    fi
else
    echo -e "${RED}❌ .npmrc 文件不存在${NC}"
    fail_count=$((fail_count+1))
fi
echo ""

# 检查 2: package.json - 移除 postinstall
echo "2️⃣  检查 package.json scripts..."
if ! grep -q '"postinstall"' package.json; then
    echo -e "${GREEN}✅ postinstall 钩子已移除${NC}"
    success_count=$((success_count+1))
else
    echo -e "${YELLOW}⚠️  package.json 中仍有 postinstall 脚本${NC}"
    echo "   建议移除以避免自动触发 electron-rebuild"
fi
echo ""

# 检查 3: package.json - asarUnpack
echo "3️⃣  检查 asarUnpack 配置..."
if grep -q '"asarUnpack"' package.json && grep -q "better-sqlite3" package.json; then
    echo -e "${GREEN}✅ asarUnpack 已正确配置${NC}"
    success_count=$((success_count+1))
else
    echo -e "${RED}❌ asarUnpack 配置缺失或不完整${NC}"
    fail_count=$((fail_count+1))
fi
echo ""

# 检查 4: tsconfig.json - 无 references
echo "4️⃣  检查 TypeScript 配置..."
if ! grep -q '"references"' tsconfig.json; then
    echo -e "${GREEN}✅ tsconfig.json 无 references（正确）${NC}"
    success_count=$((success_count+1))
else
    echo -e "${RED}❌ tsconfig.json 中仍有 references${NC}"
    echo "   应该移除项目引用配置"
    fail_count=$((fail_count+1))
fi
echo ""

# 检查 5: tsconfig.node.json - 无 composite
echo "5️⃣  检查 Electron TypeScript 配置..."
if ! grep -q '"composite"' tsconfig.node.json; then
    echo -e "${GREEN}✅ tsconfig.node.json 无 composite（正确）${NC}"
    success_count=$((success_count+1))
else
    echo -e "${RED}❌ tsconfig.node.json 中仍有 composite${NC}"
    fail_count=$((fail_count+1))
fi
echo ""

# 检查 6: tsconfig.node.json - CommonJS 模块
echo "6️⃣  检查模块系统配置..."
if grep -q '"module": "CommonJS"' tsconfig.node.json; then
    echo -e "${GREEN}✅ 使用 CommonJS 模块系统${NC}"
    success_count=$((success_count+1))
else
    echo -e "${RED}❌ 模块系统配置错误${NC}"
    echo "   应该使用 CommonJS"
    fail_count=$((fail_count+1))
fi
echo ""

# 检查 7: postcss.config.js - CommonJS 语法
echo "7️⃣  检查 PostCSS 配置语法..."
if grep -q "module.exports" postcss.config.js; then
    echo -e "${GREEN}✅ PostCSS 使用 CommonJS 语法${NC}"
    success_count=$((success_count+1))
else
    echo -e "${RED}❌ PostCSS 配置语法错误${NC}"
    fail_count=$((fail_count+1))
fi
echo ""

# 检查 8: tailwind.config.js - CommonJS 语法
echo "8️⃣  检查 Tailwind 配置语法..."
if grep -q "module.exports" tailwind.config.js; then
    echo -e "${GREEN}✅ Tailwind 使用 CommonJS 语法${NC}"
    success_count=$((success_count+1))
else
    echo -e "${RED}❌ Tailwind 配置语法错误${NC}"
    fail_count=$((fail_count+1))
fi
echo ""

# 检查 9: GitHub Actions - v4 版本
echo "9️⃣  检查 GitHub Actions 配置..."
if [ -f ".github/workflows/build.yml" ]; then
    if grep -q "actions/checkout@v4" .github/workflows/build.yml && \
       grep -q "actions/setup-node@v4" .github/workflows/build.yml && \
       grep -q "actions/upload-artifact@v4" .github/workflows/build.yml; then
        echo -e "${GREEN}✅ GitHub Actions 使用 v4 版本${NC}"
        success_count=$((success_count+1))
    else
        echo -e "${YELLOW}⚠️  GitHub Actions 可能使用旧版本${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  未找到 GitHub Actions 配置文件${NC}"
fi
echo ""

# 检查 10: 构建输出
echo "🔟 检查构建输出..."
if [ -d "dist-electron" ] && [ -f "dist-electron/main.js" ]; then
    echo -e "${GREEN}✅ dist-electron/main.js 存在${NC}"
    size=$(ls -lh dist-electron/main.js | awk '{print $5}')
    echo "   文件大小: $size"
    success_count=$((success_count+1))
else
    echo -e "${YELLOW}⚠️  dist-electron/main.js 不存在${NC}"
    echo "   运行 'npm run build' 来生成"
fi
echo ""

# 总结
echo "======================================"
echo "验证结果总结"
echo "======================================"
echo -e "${GREEN}✅ 通过: $success_count${NC}"
echo -e "${RED}❌ 失败: $fail_count${NC}"
echo ""

if [ $fail_count -eq 0 ]; then
    echo -e "${GREEN}🎉 所有检查通过！可以推送到 GitHub 了！${NC}"
    echo ""
    echo "下一步操作："
    echo "1. git add ."
    echo "2. git commit -m '修复 Windows node-gyp 编译卡死问题'"
    echo "3. git push origin main"
    echo "4. git tag v1.0.4"
    echo "5. git push origin v1.0.4"
    exit 0
else
    echo -e "${RED}⚠️  发现 $fail_count 个问题，请修复后再推送${NC}"
    echo ""
    echo "参考文档："
    echo "- 快速修复-Windows编译卡死.md"
    echo "- 编译前检查清单.md"
    exit 1
fi
