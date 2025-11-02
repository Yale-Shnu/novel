@echo off
chcp 65001 >nul
title 火山方舟API代理服务器 - 小说智阅坊

echo ========================================
echo   火山方舟API代理服务器启动脚本
echo ========================================
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ 检测到Node.js

REM 检查依赖包
if not exist "node_modules" (
    echo 正在安装依赖包...
    npm install express cors node-fetch
    if %errorlevel% neq 0 (
        echo 错误: 依赖包安装失败
        pause
        exit /b 1
    )
    echo ✓ 依赖包安装完成
) else (
    echo ✓ 依赖包已存在
)

echo.
echo 正在启动火山方舟API代理服务器...
echo 服务地址: http://localhost:8888
echo API文档: http://localhost:8888/api/info
echo 测试页面: http://localhost:8888/test
echo.
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

REM 启动服务器
node final_volcano_server.js

pause