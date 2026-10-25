@echo off
chcp 65001 > nul
title [Agent Multi] Dung He Thong
color 0e

echo ===============================================================================
echo                DUNG HE THONG AGENT MULTI (CONG 8000 & 5173)
echo ===============================================================================
echo.

echo Dang giai phong cong 8000 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo Dang giai phong cong 5173 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)

color 0a
echo.
echo Da dung toan bo tien trinh Backend va Frontend thanh cong!
echo.
pause
