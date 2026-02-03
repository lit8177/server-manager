@echo off
echo ========================================
echo   Server Manager - Windows 编译脚本
echo ========================================
echo.

echo [1/3] 安装依赖...
call npm install
if errorlevel 1 goto error

echo.
echo [2/3] 构建应用...
call npm run build
if errorlevel 1 goto error

echo.
echo [3/3] 打包 Windows 应用...
call npm run electron:build:win
if errorlevel 1 goto error

echo.
echo ========================================
echo 编译完成！
echo ========================================
echo.
echo 输出文件位置: .\release\
echo.
dir release\*.exe
echo.
echo 安装版: Server Manager Setup 1.0.0.exe
echo 便携版: Server Manager 1.0.0.exe
echo.
pause
goto end

:error
echo.
echo 编译失败！请检查错误信息
pause

:end
