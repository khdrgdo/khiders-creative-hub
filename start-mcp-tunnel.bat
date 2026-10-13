@echo off
chcp 65001 >nul
title Khiders Hub MCP Server & Cloudflare Tunnel
echo ===================================================================
echo   🚀 تشغيل خادم MCP لمنصة خضر مأمون والربط السحابي مع هاتف Claude
echo ===================================================================
echo.
echo [1/2] تشغيل خادم MCP على المنفذ 3001...
start "MCP Server (Port 3001)" cmd /k "cd /d %~dp0 && bun run scripts/mcp-http-server.ts"
timeout /t 2 >nul
echo.
echo [2/2] بدء نفق Cloudflare Tunnel للوصول من الهاتف...
echo.
echo انسخ الرابط الذي سيظهر وضع في آخره /sse داخل تطبيق Claude على هاتفك.
echo مثال: https://xxxx.trycloudflare.com/sse
echo.
bunx untun tunnel http://localhost:3001
pause
